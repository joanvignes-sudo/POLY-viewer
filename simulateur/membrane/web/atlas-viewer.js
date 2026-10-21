/* POLY v0.2 : local HRA organ reference renderer, no anatomical registration. */
import * as THREE from 'three';
import { GLTFLoader } from './vendor/loaders/GLTFLoader.js';

const modelBase = new URL('../models/', import.meta.url);
const approved = new Set(['skin','brain','spinal_cord','heart','lung']);
const loader=new GLTFLoader();
const fetchJSON=async path=>{
  const r=await fetch(new URL(path,modelBase));
  if(!r.ok)throw new Error('Fichier d’atlas indisponible : '+r.status);
  return await r.json();
};

let manifestPromise=Promise.all([fetchJSON('hra_assets.json'),fetchJSON('hra_crosswalk_5.json')]);
let gltfCache=new Map();
let renderer=null,scene=null,camera=null,root=null,stage=null,chosenId=null;
let yaw=0,pitch=0,distance=5.6,requestId=0;
const focusPivot=new THREE.Vector3();
let currentSnapshot=null,serverReady=true,drag=null,frameActive=false;

function ensureEngine() {
  if(renderer)return;
  renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'default'});
  renderer.setClearColor(0x102922,1);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
  renderer.domElement.setAttribute('aria-label','Anatomie 3D HRA de référence, non recalée sur POLY');
  renderer.domElement.className='atlas-canvas';
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(36,1,0.01,300);
  camera.position.set(0,0,distance);
  root=new THREE.Group();
  scene.add(root);
  scene.add(new THREE.AmbientLight(0xffffff,1.9));
  const key=new THREE.DirectionalLight(0xffe8c8,2.2);key.position.set(2,4,5);scene.add(key);
  const fill=new THREE.DirectionalLight(0xa4d4f8,1.1);fill.position.set(-3,-2,-4);scene.add(fill);
  renderer.domElement.addEventListener('pointerdown',e=>{
    drag=[e.clientX,e.clientY];
    renderer.domElement.setPointerCapture(e.pointerId);
  });
  renderer.domElement.addEventListener('pointermove',e=>{
    if(!drag)return;
    yaw+=(e.clientX-drag[0])*.007;
    pitch=Math.max(-1.3,Math.min(1.3,pitch+(e.clientY-drag[1])*.007));
    drag=[e.clientX,e.clientY];
  });
  renderer.domElement.addEventListener('pointerup',()=>drag=null);
  renderer.domElement.addEventListener('wheel',e=>{
    e.preventDefault();
    distance=Math.max(.1,Math.min(12,distance*Math.exp(e.deltaY*.001)));
  },{passive:false});
  if(!frameActive){frameActive=true;requestAnimationFrame(animate);}
}

function animate() {
  requestAnimationFrame(animate);
  if(!stage || !stage.isConnected || !stage.clientWidth || !stage.clientHeight)return;
  const w=stage.clientWidth,h=stage.clientHeight;
  renderer.setSize(w,h,false);
  camera.aspect=w/h;
  camera.position.set(0,0,distance);
  camera.lookAt(0,0,0);
  camera.updateProjectionMatrix();
  root.rotation.set(pitch,yaw,0,'YXZ');
  root.position.copy(focusPivot).applyEuler(root.rotation).multiplyScalar(-1);
  renderer.render(scene,camera);
}

function clearModel(){
  while(root.children.length)root.remove(root.children[0]);
}
function status(message,level='info') {
  const e=document.querySelector('#atlas-status');
  if(e){e.textContent=message;e.dataset.level=level;}
}
function info(message){
  const e=document.querySelector('#atlas-provenance');
  if(e)e.textContent=message;
}

function loadOne(asset) {
  if(!approved.has(asset.id)) return Promise.reject(new Error('Modèle non autorisé'));
  if(gltfCache.has(asset.id))return gltfCache.get(asset.id);
  const url=new URL(asset.file,modelBase).href;
  const loading=new Promise((resolve,reject)=>{
    loader.load(url, gltf=>{
      const object=gltf.scene;
      object.traverse(x=>{
        if(x.isMesh){
          x.frustumCulled=false;
          x.userData.referenceOnly=true;
        }
      });
      // Visual normalization, never an anatomical registration or physical scale.
      const box=new THREE.Box3().setFromObject(object);
      if(box.isEmpty()) return reject(new Error('Maillage vide'));
      const size=box.getSize(new THREE.Vector3());
      const center=box.getCenter(new THREE.Vector3());
      const dim=Math.max(size.x,size.y,size.z);
      if(!Number.isFinite(dim)||dim<=0)return reject(new Error('Mesures de maillage invalides'));
      const transform=new THREE.Group();
      object.position.sub(center);
      const visualScale=2.9/dim;
      transform.add(object);
      transform.scale.setScalar(visualScale);
      transform.userData.visualOnly=true;
      transform.userData.originalBounds={size:size.toArray(),center:center.toArray()};
      resolve({transform,sourceObject:object,meshCount:gltf.parser.json.meshes?.length||0,
        nodeCount:gltf.parser.json.nodes?.length||0,visualScale});
    },null,e=>reject(new Error('Chargement GLB : '+(e.message||String(e)))));
  });
  gltfCache.set(asset.id,loading);
  return loading;
}

function findMapping(s, crosswalk, selectedId) {
  const anchors=[s.event.from_anchor,s.event.to_anchor].filter(Boolean);
  const matches=crosswalk.mappings.filter(x=>anchors.includes(x.poly_anchor));
  const current=matches.find(x=>x.atlas_asset_id===selectedId);
  return {matches,current:current||null};
}

async function mount(host,snapshot,organId) {
  if(!host||!host.isConnected)return;
  if(!approved.has(organId))throw new Error('Organe non autorisé : '+organId);
  currentSnapshot=snapshot;
  const generation=++requestId;
  stage=host;
  status('Chargement du modèle HRA…');
  try{
    const [manifest,crosswalk]=await manifestPromise;
    const asset=manifest.assets.find(a=>a.id===organId);
    if(!asset)throw new Error('Modèle absent du manifeste local.');
    if(asset.atlas_to_POLY_registration!=='NOT_VALIDATED')
      throw new Error('Statut scientifique inattendu.');
    if(!asset.sha256||!asset.file||!asset.source_model_url)
      throw new Error('Traçabilité du modèle absente.');
    ensureEngine();
    if(!stage.isConnected||generation!==requestId)return;
    stage.replaceChildren(renderer.domElement);
    status('Ouverture du maillage « '+asset.organ_label+' »…');
    const model=await loadOne(asset);
    if(generation!==requestId||!stage||!stage.isConnected)return;
    clearModel();
    model.sourceObject.traverse(node=>{if(node.isMesh)node.visible=true;});
    root.add(model.transform);
    chosenId=organId;
    yaw=0;pitch=0;distance=5.6;focusPivot.set(0,0,0);
    const selector=document.querySelector('#atlas-subpart');
    if(selector){
      const names=new Set();model.sourceObject.traverse(x=>{if(x.name)names.add(x.name);});
      selector.replaceChildren(new Option('Organe complet / toutes les structures',''));
      for(const term of asset.terms.filter(t=>names.has(t.node_name)))
        selector.add(new Option(term.label+' · '+term.ontology_id,term.node_name));
      selector.disabled=false;
      selector.onchange=()=>focusNode(selector.value);
    }
    const m=findMapping(snapshot,crosswalk,organId);
    const msg=m.current?
       'Correspondance ontologique '+m.current.ontology_id+' vérifiée dans le GLB ; repère POLY non recalé.' :
       'Cet organe ne possède pas de correspondance directe avec l’intervalle courant.';
    status(asset.organ_label+' · '+model.meshCount+' maillages · '+msg,'ready');
    info('Source : '+asset.source_version+' · SHA256 '+asset.sha256.slice(0,16)+'… · CC BY 4.0 · '+
      'HRA homme de référence ; données issues de spécimens/atlas distincts. Aucun trajet ni distance physiologique démontré.');
    const viewer=document.querySelector('#atlas-stage');
    if(viewer){viewer.dataset.modelLoaded=organId;viewer.dataset.matchedTerm=m.current?.ontology_id||'none';}
  }catch(error){
    if(generation===requestId){status('Modèle indisponible : '+error.message,'error');}
  }
}
async function focusNode(name) {
  if(!chosenId || !gltfCache.has(chosenId))return;
  const model=await gltfCache.get(chosenId);
  const obj=model.sourceObject;
  obj.traverse(node=>{if(node.isMesh)node.visible=true;});
  yaw=0;pitch=0;
  root.rotation.set(0,0,0);
  root.position.set(0,0,0);
  focusPivot.set(0,0,0);
  distance=5.6;
  if(!name){
    const host=document.querySelector('#atlas-stage');
    if(host)host.dataset.substructure='whole';
    status('Organe complet · données HRA de référence ; aucun trajet physiologique déduit.','ready');
    return;
  }
  const part=obj.getObjectByName(name);
  if(!part){status('Sous-structure absente dans le fichier GLB : '+name,'error');return;}
  const selected=new Set();
  part.traverse(node=>{if(node.isMesh)selected.add(node);});
  if(!selected.size){
    status('Sous-structure non maillée : '+name,'error');return;
  }
  obj.traverse(node=>{if(node.isMesh)node.visible=selected.has(node);});
  const box=new THREE.Box3().setFromObject(part);
  if(box.isEmpty()){
    status('Sous-structure sans géométrie exploitable.','error');return;
  }
  const size=box.getSize(new THREE.Vector3());
  const maxSide=Math.max(size.x,size.y,size.z);
  focusPivot.copy(box.getCenter(new THREE.Vector3()));
  distance=Math.min(6,Math.max(.18,maxSide/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))*1.6));
  const host=document.querySelector('#atlas-stage');
  if(host)host.dataset.substructure=name;
  status('Sous-structure source isolée : '+name+'. Zoom de présentation uniquement, pas localisation POLY.','ready');
}

function stop(){
  requestId++;
  stage=null;
  currentSnapshot=null;
}

function suggestedOrgan(snapshot) {
  const x=snapshot?.event?.from_anchor;
  const y=snapshot?.event?.to_anchor;
  const anchors=[x,y];
  if(y==='cervical_spinal')return 'spinal_cord';
  if(y==='brainstem'||y==='insula'||x==='brainstem'||x==='insula'||anchors.includes('brain'))return 'brain';
  if(anchors.includes('cervical_spinal'))return 'spinal_cord';
  if(anchors.includes('skin'))return 'skin';
  if(anchors.includes('heart'))return 'heart';
  if(anchors.includes('lungs'))return 'lung';
  return null;
}

window.PolyAtlasViewer=Object.freeze({mount,stop,suggestedOrgan,approved:[...approved]});
window.dispatchEvent(new Event('poly-atlas-ready'));
