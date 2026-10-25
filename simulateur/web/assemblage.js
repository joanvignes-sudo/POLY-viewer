import {nativeKneeEntries,nativeContextMatch,visibleInHierarchy} from './native-knee-context.mjs';
import * as THREE from './vendor/three.module.js?v=audit-o-1';
const $=id=>document.getElementById(id);
const [response,metaResponse]=await Promise.all([
 fetch('../data/poly-canonical-scaffold-v1.json'),
 fetch('../models/body-display.json')
]);
if(!response.ok||!metaResponse.ok)throw new Error("Registres d'assemblage absents");
const data=await response.json(),meta=await metaResponse.json();
const byHraNode=new Map(meta.structures.map(x=>[x.node,x]));
const bones=data.bones,hra=data.hra_structures,muscles=data.muscle_surfaces,nerves=data.nerve_routes;
$('count-bones').textContent=bones.length;
$('count-muscles').textContent=muscles.length;
$('count-hra').textContent=hra.length;
$('count-nerves').textContent=nerves.length;
$('status').textContent='Corps d’accueil : '+bones.length+' os, '+muscles.length+' surfaces musculaires non raccordées, '+hra.length+' structures HRA, '+nerves.length+' routes. 0 attache spatiale validée.';
const canvas=$('viewport');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x10212c);
const camera=new THREE.PerspectiveCamera(38,1,.01,100);
scene.add(new THREE.HemisphereLight(0xbddff2,0x283845,2.2));
const key=new THREE.DirectionalLight(0xfff1d7,2.4);key.position.set(2,5,4);scene.add(key);
const fill=new THREE.DirectionalLight(0x86adc7,.5);fill.position.set(-4,2,-2);scene.add(fill);
const grid=new THREE.GridHelper(5,24,0x3a6471,0x28404b);grid.position.y=-.05;scene.add(grid);
const bonePoints=new THREE.Group();scene.add(bonePoints);
const boneMeshes=new THREE.Group();scene.add(boneMeshes);
const hraMeshes=new THREE.Group();scene.add(hraMeshes);
const routeMeshes=new THREE.Group();scene.add(routeMeshes);
let angle=.42,pitch=.12,zoom=7.2,spin=false,focus=new THREE.Vector3(0,1.7,0);
const raycaster=new THREE.Raycaster();raycaster.params.Points.threshold=.06;
const marker=new THREE.Mesh(new THREE.SphereGeometry(.027,12,9),
  new THREE.MeshBasicMaterial({color:0xffd078,depthTest:false}));
marker.visible=false;marker.renderOrder=1000;scene.add(marker);
let selected=null,loadingBones=null,loadingHra=null,loadingNerves=null;
const systemColors={muscular:0xce7a7b,digestive:0xdaaf6e,respiratory:0x88c6d4,
 circulatory:0xd18c91,nervous:0x82aed3,urinary:0xb5a5d4,
 skeletal:0xd5d4b8,integumentary:0x9cc0b2,lymphatic:0x80bba3,
 male_reproductive:0xd6a2c4,unclassified:0x75bed5};
const boneCloudGeometry=new THREE.BufferGeometry();
boneCloudGeometry.setAttribute('position',new THREE.Float32BufferAttribute(
  bones.flatMap(b=>b.display_anchor.position),3));
const boneCloud=new THREE.Points(boneCloudGeometry,new THREE.PointsMaterial({
 color:0xead5b4,size:.035,sizeAttenuation:true,transparent:true,opacity:.95,depthWrite:false
}));
bonePoints.add(boneCloud);
function applyCamera(){
 camera.position.set(focus.x+Math.sin(angle)*Math.cos(pitch)*zoom,
  focus.y+Math.sin(pitch)*zoom,focus.z+Math.cos(angle)*Math.cos(pitch)*zoom);
 camera.lookAt(focus);
}
function updateSize(){
 const w=Math.max(300,canvas.clientWidth||600),h=Math.max(250,canvas.clientHeight||550);
 if(canvas.width!==Math.round(w*renderer.getPixelRatio())||canvas.height!==Math.round(h*renderer.getPixelRatio())){
  renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
 }
}
function frameFocus(position,dist=2){
 focus.set(...position);zoom=Math.min(8,Math.max(.4,dist));applyCamera();
}
function setDetails(entry,kind){
 selected={entry,kind};
 const position=entry.display_anchor?.position;
 if(position){marker.visible=true;marker.position.set(...position);frameFocus(position,kind==='bone'?1.1:2.2)}
 else marker.visible=false;
 let lines=[];
 if(kind==='bone'){
  lines=['OS : '+entry.label,'ID : '+entry.id,
   'Source : '+entry.representation.atlas,'Région : '+entry.region,
   'Position : cohérence interne Z-Anatomy, adaptation graphique vers POLY.',
   'Centre affiché : centre de boîte, PAS centre articulaire.',
   'Pivot articulaire : NON validé.','Origines/insertions musculaires : NON annotées.'];
 }else if(kind==='muscle'){
  lines=['SURFACE MUSCULAIRE : '+entry.label,'ID : '+entry.id,
   'Source : '+entry.source_atlas,'Région : '+entry.region,
   'Statut : surface référencée, pouvant ne pas représenter un muscle entier.',
   'Position par rapport au squelette POLY : NON recalée.',
   'Origines, insertions, innervation terminale : NON validées.'];
 }else if(kind==='hra'){
  lines=['STRUCTURE HRA : '+entry.source_name,'ID : '+entry.id,
    'Système : '+entry.system,'Atlas : '+entry.representation.atlas,
    'Position native du modèle HRA ; pas de validation individuelle.',
    'Proximité avec les os Z-Anatomy ne prouve aucune liaison.'];
 }else{
  lines=['TRAJET NERVEUX : '+entry.label,'ID : '+entry.id,
   'Famille : '+(entry.family||'non classé'),'Géométrie : '+entry.route_status,
   'Points : SCHÉMATIQUES, non segmentés.','Continuité avec muscle ou organe : NON prouvée.'];
 }
 if(position)lines.push('Repère : '+position.map(v=>Number(v).toFixed(4)).join(' ; ')+' (unités POLY)');
 $('details').replaceChildren();
 const p=document.createElement('p');p.textContent=lines.join('\n');$('details').append(p);
 if(kind==='muscle'&&entry.existing_viewer_href){
  const a=document.createElement('a');a.href=entry.existing_viewer_href;
  a.textContent='Ouvrir cette référence dans le simulateur →';$('details').append(a);
 }
 if(kind==='muscle'&&['FJ1512','FJ1478','FJ1512M','FJ1478M'].includes(entry.source_id)){
  const a=document.createElement('a');a.href='attache-biceps.html';a.textContent='Examiner les études humaines du raccord biceps–radius (non recalé)';$('details').append(document.createElement('br'),a);
 }
 if(kind==='bone'&&entry.source_concept_id==='BONE:coccyx'){
  const a=document.createElement('a');a.href='sacrococcygeal-joint.html';
  a.textContent='Examiner la jonction sacrum-coccyx →';$('details').append(a);
 }
}
const records=[
 ...bones.map(entry=>({entry,kind:'bone',label:entry.label,search:(entry.label+' '+entry.id+' '+entry.region).toLowerCase()})),
 ...muscles.map(entry=>({entry,kind:'muscle',label:entry.label,search:(entry.label+' '+entry.id+' '+entry.region).toLowerCase()})),
 ...hra.map(entry=>({entry,kind:'hra',label:entry.source_name,search:(entry.source_name+' '+entry.system+' '+entry.source_path.join(' ')).toLowerCase()})),
 ...nerves.map(entry=>({entry,kind:'nerve',label:entry.label,search:(entry.label+' '+entry.id+' '+entry.family).toLowerCase()}))
];
function renderSearch(){
 const normalized=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const q=normalized($('search').value.trim()),kind=$('category').value;
 const matches=records.filter(r=>(kind==='all'||r.kind===kind)&&(!q||normalized(r.search).includes(q)));
 const host=$('results');host.replaceChildren();
 for(const hit of matches.slice(0,35)){
  const b=document.createElement('button');b.textContent=hit.label+' · '+hit.kind;
  b.onclick=()=>setDetails(hit.entry,hit.kind);host.append(b);
 }
 if(matches.length>35){const p=document.createElement('small');p.textContent=matches.length+' résultats : 35 premiers affichés.';host.append(p);}
 if(!matches.length){const p=document.createElement('p');p.textContent='Aucune structure correspondante.';host.append(p);}
}
$('search').oninput=renderSearch;$('category').onchange=renderSearch;renderSearch();
function showUnlocatedSurfaces(){$('search').value='';$('category').value='muscle';renderSearch();}
$('unlocated-surfaces').onclick=showUnlocatedSurfaces;
if(location.hash==='#surfaces-sans-repere')showUnlocatedSurfaces();

async function loadBones(){
 if(loadingBones)return loadingBones;
 loadingBones=(async()=>{
  $('status').textContent='Chargement des 208 surfaces osseuses originales…';
  const r=await fetch('../data/skeleton-source-206.json');
  if(!r.ok)throw Error('Source osseuse indisponible');
  const original=await r.json();
  const material=new THREE.MeshStandardMaterial({color:0xe4d6b9,roughness:.82,
   metalness:0,transparent:true,opacity:.78,side:THREE.DoubleSide,depthWrite:true});
  for(const part of original.meshes){
   const geometry=new THREE.BufferGeometry();
   geometry.setAttribute('position',new THREE.Float32BufferAttribute(part.positions,3));
   geometry.setIndex(part.indices);geometry.computeVertexNormals();
   const mesh=new THREE.Mesh(geometry,material);
   mesh.userData.polyId='POLY:BONE:'+part.bone_id.substring(5);boneMeshes.add(mesh);
  }
  $('status').textContent='208 surfaces osseuses Z-Anatomy chargées : placement graphique, aucune validation anatomique.';
 })();
 return loadingBones;
}
let hraBinary=null;
async function loadHra(){
 if(loadingHra)return loadingHra;
 loadingHra=(async()=>{
  $('status').textContent='Chargement des structures HRA…';
  const r=await fetch('../models/body-display.bin');
  if(!r.ok)throw Error('Binaire HRA absent');
  hraBinary=await r.arrayBuffer();
  $('status').textContent='HRA disponible : affichage natif à la demande.';
 })();
 return loadingHra;
}
const meshCache=new Map(),byHraEntry=new Map(hra.map(x=>[x.source_node,x]));
function createHra(part,system){
 if(meshCache.has(part.node))return meshCache.get(part.node);
 const geom=new THREE.BufferGeometry();
 geom.setAttribute('position',new THREE.BufferAttribute(
   new Float32Array(hraBinary,part.position_offset,part.vertex_count*3),3));
 geom.setAttribute('normal',new THREE.BufferAttribute(
   new Float32Array(hraBinary,part.normal_offset,part.vertex_count*3),3));
 geom.setIndex(new THREE.BufferAttribute(
   new Uint32Array(hraBinary,part.index_offset,part.triangle_count*3),1));
 const material=new THREE.MeshStandardMaterial({
  color:systemColors[system]||systemColors.unclassified,roughness:.88,
  transparent:true,opacity:system==='muscular'?.82:.30,
  depthWrite:system==='muscular',side:THREE.DoubleSide});
 const mesh=new THREE.Mesh(geom,material);
 mesh.userData.polyId='POLY:HRA:'+part.node;
 meshCache.set(part.node,mesh);hraMeshes.add(mesh);return mesh;
}
async function updateHra(){
 const name=$('system-filter').value,visible=$('show-hra-meshes').checked&&name!=='off';
 hraMeshes.visible=visible;if(!visible)return;
 await loadHra();
 for(const entry of hra){
  const ok=nativeContextMatch(entry,name);
  if(ok){const part=byHraNode.get(entry.source_node);if(part)createHra(part,entry.system);}
 }
 for(const [node,mesh] of meshCache){
  const entry=byHraEntry.get(node);
  mesh.visible=Boolean(entry)&&nativeContextMatch(entry,name);
 }
}
let previousNativeDisplay=null;
function restoreNativeDisplay(){
 if(!previousNativeDisplay)return;const old=previousNativeDisplay;
 for(const [id,value]of Object.entries(old.checks))$(id).checked=value;
 $('system-filter').value=old.system;bonePoints.visible=old.bonePoints;boneMeshes.visible=old.boneMeshes;routeMeshes.visible=old.routes;hraMeshes.visible=old.hra;
 $('search').value=old.search;$('category').value=old.category;renderSearch();
 for(const [node,mesh]of meshCache)mesh.visible=old.meshVisibility.get(node)??false;
 selected=old.selected;marker.visible=old.markerVisible;marker.position.copy(old.markerPosition);$('details').replaceChildren(...old.details);
 focus.copy(old.focus);angle=old.angle;pitch=old.pitch;zoom=old.zoom;spin=old.spin;applyCamera();$('status').textContent=old.status;
 $('toggle-rotation').textContent=spin?'Arrêter la rotation':'Rotation automatique';previousNativeDisplay=null;$('native-knee-restore').disabled=true;$('native-knee-status').textContent='Affichage, caméra et sélection précédents rétablis ; aucune géométrie modifiée.';
}
$('native-knee-restore').onclick=restoreNativeDisplay;
$('native-knee-open').onclick=async()=>{
 $('native-knee-open').disabled=true;$('native-knee-restore').disabled=true;
 try{
  const entries=nativeKneeEntries(hra,meta);await loadHra();
  if(!previousNativeDisplay)previousNativeDisplay={checks:Object.fromEntries(['show-bone-centers','show-bone-meshes','show-hra-meshes','show-nerve-routes'].map(id=>[id,$(id).checked])),system:$('system-filter').value,search:$('search').value,category:$('category').value,bonePoints:bonePoints.visible,boneMeshes:boneMeshes.visible,routes:routeMeshes.visible,hra:hraMeshes.visible,meshVisibility:new Map([...meshCache].map(([node,m])=>[node,m.visible])),selected,markerVisible:marker.visible,markerPosition:marker.position.clone(),details:[...$('details').childNodes].map(n=>n.cloneNode(true)),focus:focus.clone(),angle,pitch,zoom,spin,status:$('status').textContent};
  for(const id of ['show-bone-centers','show-bone-meshes','show-nerve-routes'])$(id).checked=false;
  bonePoints.visible=false;boneMeshes.visible=false;routeMeshes.visible=false;$('show-hra-meshes').checked=true;$('system-filter').value='native-knee-left';spin=false;selected=null;marker.visible=false;
  await updateHra();const box=new THREE.Box3();for(const entry of entries){const p=byHraNode.get(entry.source_node);box.union(new THREE.Box3(new THREE.Vector3(...p.bounds[0]),new THREE.Vector3(...p.bounds[1])));}
  angle=0;pitch=.04;$('toggle-rotation').textContent='Rotation automatique';frameFocus(box.getCenter(new THREE.Vector3()).toArray(),Math.max(.8,box.getSize(new THREE.Vector3()).length()*1.5));
  $('details').replaceChildren();const text=document.createElement('p');text.textContent='Six surfaces HRA dans leur repère commun de source. Aucun recalage vers les autres atlas, aucun pivot, enthèse, force ou lien mécanique validé.';$('details').append(text);
  for(const entry of entries){const button=document.createElement('button');button.textContent=entry.source_name;button.onclick=()=>setDetails(entry,'hra');$('details').append(button);}
  $('native-knee-restore').disabled=false;$('native-knee-status').textContent='6 surfaces natives : droit fémoral, tendon du quadriceps, ligament patellaire, fémur, tibia et patella gauches. Proximité de source ; aucune continuité anatomique prouvée.';
  $('status').textContent='Contexte natif HRA · genou gauche · six surfaces · sans superposition Z-Anatomy ou trajets schématiques.';
 }catch(e){restoreNativeDisplay();$('native-knee-status').textContent='Contexte refusé : '+e.message;}finally{$('native-knee-open').disabled=false;}
};
async function loadNerves(){
 if(loadingNerves)return loadingNerves;
 loadingNerves=(async()=>{
  const r=await fetch('../data/human-nerves.json');
  if(!r.ok)throw Error('Trajets nerveux indisponibles');
  const d=await r.json();
  const material=new THREE.LineBasicMaterial({color:0xd4bb70,transparent:true,opacity:.72});
  for(const route of d.routes){
   if(!Array.isArray(route.points)||route.points.length<2)continue;
   const points=route.points.filter(p=>p?.length===3);
   if(points.length<2)continue;
   const geom=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));
   const line=new THREE.Line(geom,material);
   line.userData.polyId='POLY:NERVE_ROUTE:'+route.id;routeMeshes.add(line);
  }
 })();return loadingNerves;
}
$('show-bone-centers').onchange=()=>bonePoints.visible=$('show-bone-centers').checked;
$('show-bone-meshes').onchange=async()=>{
 const enabled=$('show-bone-meshes').checked;
 if(enabled)try{await loadBones()}catch(e){$('status').textContent='Erreur : '+e.message;return}
 boneMeshes.visible=enabled;
};
$('show-hra-meshes').onchange=()=>updateHra().catch(e=>$('status').textContent=e.message);
$('system-filter').onchange=()=>updateHra().catch(e=>$('status').textContent=e.message);
$('show-nerve-routes').onchange=async()=>{
 const enabled=$('show-nerve-routes').checked;
 if(enabled)try{await loadNerves()}catch(e){$('status').textContent='Erreur : '+e.message;return}
 routeMeshes.visible=enabled;
};
$('reset-view').onclick=()=>frameFocus([0,1.75,0],7.2);
$('toggle-rotation').onclick=()=>{
 spin=!spin;$('toggle-rotation').textContent=spin?'Arrêter la rotation':'Rotation automatique';
};
let gesture=null;
canvas.addEventListener('pointerdown',e=>{
 gesture={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove',e=>{
 if(!gesture)return;
 const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
 angle-=dx*.006;pitch=Math.max(-1.3,Math.min(1.3,pitch+dy*.006));
 gesture={x:e.clientX,y:e.clientY};applyCamera();
});
canvas.addEventListener('pointerup',()=>gesture=null);
canvas.addEventListener('pointercancel',()=>gesture=null);
canvas.addEventListener('wheel',e=>{
 e.preventDefault();zoom=Math.max(.35,Math.min(25,zoom*Math.exp(e.deltaY*.001)));applyCamera();
},{passive:false});
canvas.addEventListener('dblclick',e=>{
 const bounds=canvas.getBoundingClientRect();
 const coords=new THREE.Vector2((e.clientX-bounds.left)/bounds.width*2-1,
  -((e.clientY-bounds.top)/bounds.height*2-1));
 raycaster.setFromCamera(coords,camera);
 const targets=[boneCloud,...boneMeshes.children,...hraMeshes.children];
 const hits=raycaster.intersectObjects(targets.filter(visibleInHierarchy),false);
 if(!hits.length)return;
 const hit=hits[0];
 const id=hit.object===boneCloud?bones[hit.index]?.id:hit.object.userData.polyId;
 if(!id)return;
 const found=records.find(r=>r.entry.id===id);
 if(found)setDetails(found.entry,found.kind);
});
function render(){
 requestAnimationFrame(render);
 if(spin)angle+=.0025;
 applyCamera();updateSize();renderer.render(scene,camera);
}
boneMeshes.visible=false;routeMeshes.visible=false;
updateHra().catch(e=>$('status').textContent='HRA : '+e.message);
render();
