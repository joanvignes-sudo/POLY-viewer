import * as THREE from './vendor/three.module.js';
import {validateChunkManifest,createBoundedChunkStore,browserChunkReader} from './body-chunk-reader.mjs';
import {createRegionSceneAdapter} from './body-region-three.mjs';

const $=id=>document.getElementById(id);
const fmt=n=>Number(n).toLocaleString('fr-FR');
const ROOT_URL=new URL('../data/body-chunks-preview/',import.meta.url);
const manifestURL=new URL('MANIFEST.json',ROOT_URL);
let manifest=null,store=null,adapter=null,renderer=null,scene=null,camera=null;
let activeDescription=null,selectedIndex=null,renderPending=false,failedContext=false;
const canvas=$('region-canvas');
const system=$('system'),block=$('block'),structure=$('structure');

function status(message,error=false){
 const node=$('status');node.textContent=message;
 node.dataset.error=String(error);
 node.style.color=error?'#f3c987':'';
}
function scheduleRender(){
 if(!renderer||!scene||!camera||renderPending||document.hidden||failedContext)return;
 renderPending=true;
 requestAnimationFrame(()=>{
  renderPending=false;
  if(!renderer||failedContext)return;
  const rect=canvas.getBoundingClientRect();
  if(rect.width<1||rect.height<1)return;
  const dpr=Math.min(window.devicePixelRatio||1,window.matchMedia('(pointer:coarse)').matches?1:1.5);
  renderer.setPixelRatio(dpr);
  renderer.setSize(Math.max(1,Math.round(rect.width)),Math.max(1,Math.round(rect.height)),false);
  camera.aspect=rect.width/rect.height;
  camera.updateProjectionMatrix();
  renderer.render(scene,camera);
  updateStats();
 });
}
function updateStats(){
 if(!adapter||!store||!renderer)return;
 const d=adapter.diagnostics(),m=store.info();
 $('memory').textContent=fmt(m.residentRawBytes)+' / '+fmt(m.capacityRawBytes)+' octets bruts en cache · '+m.ids.length+' bloc(s).';
 $('scene-stat').textContent=fmt(d.meshes)+' structures · '+fmt(d.triangles)+' triangles · '+fmt(d.vertices)+' sommets · '+fmt(renderer.info.memory.geometries)+' géométries GPU suivies par Three.js.';
}
function refreshStructures(){
 if(!adapter)return;
 const current=structure.value;
 const ids=adapter.listSourceIndices();
 const sel=structure;sel.replaceChildren();
 const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Choisir une structure chargée';sel.append(placeholder);
 for(const id of ids){
  const rec=adapter.sourceInfo(id);
  const o=document.createElement('option');o.value=String(id);
  o.textContent='#'+id+' · '+rec.name.replaceAll('_',' ');
  sel.append(o);
 }
 if(ids.includes(selectedIndex))sel.value=String(selectedIndex);
 else if(ids.includes(Number(current)) && current!=='')sel.value=current;
 else sel.value='';
 updateStats();
}
function selectedUI(record){
 const out=$('selected');out.replaceChildren();
 if(!record){out.textContent='Aucune structure sélectionnée. Les parties non chargées ne sont pas reconstruites.';return;}
 const heading=document.createElement('h3');heading.textContent=record.name.replaceAll('_',' ');
 out.append(heading);
 for(const text of [
  'Indice original : '+record.source_index+' · bloc : '+record.chunk_id,
  'Référence : '+record.path.join(' / '),
  'Anciennes positions des données binaires : '+JSON.stringify(record.source_offsets),
  'Sommets : '+fmt(record.vertex_count)+' · triangles : '+fmt(record.triangle_count),
  'Source : maillage d’origine vérifié par empreintes ; aucune validation individuelle.'
 ]){
  const p=document.createElement('p');p.textContent=text;out.append(p);
 }
}
function selectSource(id){
 const record=adapter.select(id);
 selectedIndex=record?.source_index??null;
 selectedUI(record);refreshStructures();
 if(record)structure.value=String(id);
 return record;
}
function fillBlocks(){
 const key=system.value,previous=block.value;
 const choices=manifest.chunks.filter(c=>c.system===key);
 block.replaceChildren();
 for(const c of choices){
  const o=document.createElement('option');o.value=c.id;
  o.textContent=c.id+' · '+fmt(c.part_count)+' structures · '+(c.compressed_bytes/1048576).toFixed(2)+' Mio gzip';
  block.append(o);
 }
 if(choices.some(c=>c.id===previous))block.value=previous;
 $('release').disabled=!store?.info().ids.includes(block.value);
}
let loadSerial=0,pendingBlock=null;
function invalidatePending(){
 loadSerial++;
 if(pendingBlock&&store)store.release(pendingBlock);
 pendingBlock=null;
 $('load').disabled=false;
}
function newStore(){
 if(store)store.clear();
 selectedIndex=null;selectedUI(null);
 const cap=Number($('budget').value);
 store=createBoundedChunkStore(manifest,{
  maxRawBytes:cap,
  readBytes:browserChunkReader(ROOT_URL),
  onInstall:chunk=>adapter.install(chunk),
  onDispose:(token,chunk)=>adapter.uninstall(token,chunk)
 });
 refreshStructures();fillBlocks();scheduleRender();
}
async function loadSelected(){
 const id=block.value,requestedStore=store,serial=++loadSerial;
 pendingBlock=id;$('load').disabled=true;
 status('Lecture, vérification des empreintes et préparation des maillages : '+id+'…');
 try{
  const chunk=await requestedStore.load(id);
  if(serial!==loadSerial)return; // Never select an obsolete or cancelled region.
  const candidate=chunk.metadata.geometries[0];
  if(candidate)selectSource(candidate.source_index);
  status('Bloc vérifié et affiché : '+id+' ('+chunk.metadata.geometries.length+' structures de référence).');
 }catch(e){
  if(serial===loadSerial)status('Bloc refusé ou indisponible : '+e.message,true);
 }finally{
  if(serial===loadSerial){
   pendingBlock=null;$('load').disabled=false;
   fillBlocks();refreshStructures();scheduleRender();
  }
 }
}
function releaseSelected(){
 const id=block.value;
 const done=store.release(id);
 status(done?'Bloc '+id+' libéré, géométries et matériaux Three.js détruits.':'Ce bloc n’était pas en mémoire.');
 if(selectedIndex!==null&&!adapter.listSourceIndices().includes(selectedIndex)){selectedIndex=null;selectedUI(null)}
 refreshStructures();fillBlocks();scheduleRender();
}
let target,azimuth=.42,elevation=.25,distance=7.1;
function updateCamera(){
 elevation=Math.max(-1.3,Math.min(1.3,elevation));
 distance=Math.max(.25,Math.min(60,distance));
 const cs=Math.cos(elevation);
 camera.position.set(target.x+distance*cs*Math.sin(azimuth),
  target.y+distance*Math.sin(elevation),
  target.z+distance*cs*Math.cos(azimuth));
 camera.lookAt(target);scheduleRender();
}
function focusSelected(){
 const id=selectedIndex;
 if(id===null)return;
 const record=adapter.sourceInfo(id);
 if(!record)return;
 const b=record.bounds;
 target.set((b[0][0]+b[1][0])/2,(b[0][1]+b[1][1])/2,(b[0][2]+b[1][2])/2);
 const diameter=Math.max(.1,...[0,1,2].map(i=>b[1][i]-b[0][i]));
 distance=Math.max(.6,diameter*3.2);updateCamera();
}
function resetCamera(){
 target.set(0,1.75,0);azimuth=.42;elevation=.25;distance=7.1;updateCamera();
}
function bindPointer(){
 canvas.tabIndex=0;
 let origin=null, moved=false;
 canvas.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  origin={x:e.clientX,y:e.clientY,azimuth,elevation};
  moved=false;canvas.setPointerCapture(e.pointerId);
 });
 canvas.addEventListener('pointermove',e=>{
  if(!origin)return;
  const dx=e.clientX-origin.x,dy=e.clientY-origin.y;
  if(Math.abs(dx)+Math.abs(dy)>6)moved=true;
  azimuth=origin.azimuth-dx*.006;
  elevation=origin.elevation+dy*.006;updateCamera();
 });
 canvas.addEventListener('pointerup',e=>{
  if(!origin)return;
  origin=null;
  if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
  if(moved)return;
  const r=canvas.getBoundingClientRect();
  const mouse=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,
    -((e.clientY-r.top)/r.height)*2+1);
  const ray=new THREE.Raycaster();
  ray.setFromCamera(mouse,camera);
  const record=adapter.pick(ray);
  if(record){selectedIndex=record.source_index;selectedUI(record);refreshStructures();structure.value=String(record.source_index)}
 });
 canvas.addEventListener('pointercancel',()=>{origin=null});
 canvas.addEventListener('wheel',e=>{e.preventDefault();distance*=Math.exp(e.deltaY*.001);updateCamera()},{passive:false});
 canvas.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft'){azimuth-=.1;updateCamera();e.preventDefault()}
  if(e.key==='ArrowRight'){azimuth+=.1;updateCamera();e.preventDefault()}
  if(e.key==='ArrowUp'){elevation+=.1;updateCamera();e.preventDefault()}
  if(e.key==='ArrowDown'){elevation-=.1;updateCamera();e.preventDefault()}
 });
}
async function start(){
 try{
  const res=await fetch(manifestURL,{cache:'no-store'});
  if(!res.ok)throw Error('Manifeste expérimental indisponible (HTTP '+res.status+')');
  manifest=validateChunkManifest(await res.json());
  scene=new THREE.Scene();scene.background=new THREE.Color(0x092231);
  camera=new THREE.PerspectiveCamera(42,1,.01,120);
  target=new THREE.Vector3(0,1.75,0);
  scene.add(new THREE.HemisphereLight(0xc6e4ed,0x26354b,2.2));
  const light=new THREE.DirectionalLight(0xffe5c8,2.7);light.position.set(5,8,6);scene.add(light);
  renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'low-power'});
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  adapter=createRegionSceneAdapter({THREE,scene,
    onChange:()=>{refreshStructures();scheduleRender()},
    onSelectionLost:()=>{selectedIndex=null;selectedUI(null)}
  });
  const systems=[...new Set(manifest.chunks.map(c=>c.system))].sort();
  for(const k of systems){const o=document.createElement('option');o.value=k;o.textContent=k;system.append(o)}
  if(systems.includes('skeletal'))system.value='skeletal';
  system.onchange=()=>{invalidatePending();fillBlocks()};
  block.onchange=()=>{invalidatePending();fillBlocks()};
  $('budget').onchange=()=>{invalidatePending();newStore();status('Budget modifié. Anciens blocs et ressources GPU libérés.')};
  $('load').onclick=loadSelected;$('release').onclick=()=>{invalidatePending();releaseSelected()};
  $('clear').onclick=()=>{invalidatePending();store.clear();selectedIndex=null;selectedUI(null);refreshStructures();fillBlocks();status('Tous les blocs libérés.');scheduleRender()};
  structure.onchange=()=>{if(structure.value)selectSource(Number(structure.value))};
  $('focus').onclick=focusSelected;$('reset').onclick=resetCamera;
  newStore();bindPointer();resetCamera();
  window.addEventListener('resize',scheduleRender);
  document.addEventListener('visibilitychange',scheduleRender);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();failedContext=true;status('Contexte WebGL perdu. Rendu suspendu ; les données restent séparées.',true)});
  canvas.addEventListener('webglcontextrestored',()=>{failedContext=false;status('Contexte WebGL rétabli. Vérifier le rendu.');scheduleRender()});
  $('loading').hidden=true;$('app').hidden=false;fillBlocks();scheduleRender();
  status('Manifeste vérifié : '+manifest.chunk_count+' blocs disponibles. Aucun bloc chargé.');
 }catch(e){
  $('loading').setAttribute('role','alert');
  $('loading').textContent='Laboratoire non disponible : '+e.message+'. Aucun maillage ne sera affiché sans source contrôlée. Utiliser le mode léger.';
 }
}
start();
