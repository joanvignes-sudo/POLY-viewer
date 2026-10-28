import {mountNativeEyeContext} from './native-eye-context.mjs';
import {findOccluders,createMaterialMask} from './selective-occlusion.js';
import {createOrganInspector} from './organ-inspector.js';
import {createWalkingNetwork} from './walking-network.js';
import {createResidentInspector} from './body-resident-inspector.mjs';
import {createRegionalRig,createWalkSampler} from './body-region-motion.mjs';
import {sourceMeshData,createSourceAccess,planSourceBlocks} from './body-source-contract.mjs';
import {atlasSystem} from './body-light-core.mjs';
import * as THREE from './vendor/three.module.js';
import {validateChunkManifest,createBoundedChunkStore,browserChunkReader,sha256Bytes,readGzipBounded} from './body-chunk-reader.mjs';
import {createRegionSceneAdapter} from './body-region-three.mjs';

const $=id=>document.getElementById(id);
const fmt=n=>Number(n).toLocaleString('fr-FR');
const ROOT_URL=new URL('../data/body-chunks-preview/',import.meta.url);
const manifestURL=new URL('MANIFEST.json',ROOT_URL);
let manifest=null,store=null,adapter=null,renderer=null,scene=null,camera=null;
let inspector=null,records=[],catalogueAccess=null,sampler=null,playing=false,elapsed=0,lastFrame=null;
const rig=createRegionalRig();
let detailedInspector=null,nativeEye=null,sourceMeta=null;
const eyeMask=createMaterialMask();
let network=null,networkElapsed=0,networkSerial=0,networkLoading=false,networkPreferences=null;
let inspectionView=null;
const renderSamples=[],loadSamples=[],pickSamples=[];let renderedFrames=0;
let selectedIndex=null,renderPending=false,failedContext=false;
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
 requestAnimationFrame(now=>{
  renderPending=false;
  if(!renderer||failedContext)return;
  nativeEye?.update();
  const dt=lastFrame!==null?Math.min((now-lastFrame)/1000,.05):0;
  if(playing&&sampler){
   elapsed+=dt;
   sampler.apply(elapsed,rig.uniforms);$('motion-phase').value=String(elapsed%sampler.duration);
  }
  lastFrame=now;
  const rect=canvas.getBoundingClientRect();
  if(rect.width<1||rect.height<1)return;
  const dpr=Math.min(window.devicePixelRatio||1,window.matchMedia('(pointer:coarse)').matches?1:1.5);
  if(renderer.getPixelRatio()!==dpr)renderer.setPixelRatio(dpr);
  const width=Math.max(1,Math.round(rect.width)),height=Math.max(1,Math.round(rect.height));
  if(canvas.width!==Math.floor(width*dpr)||canvas.height!==Math.floor(height*dpr))renderer.setSize(width,height,false);
  if(camera.aspect!==width/height){camera.aspect=width/height;camera.updateProjectionMatrix();}
  if(network){
   if(network.state.reading&&network.state.enabled)networkElapsed+=dt;
   network.update(networkElapsed,!inspector.info().scope&&!detailedInspector?.active&&!nativeEye?.active,selectedIndex===null?null:adapter.sources.resolve(selectedIndex),playing?'walk':'stand');
   const coverage=network.coverage;
   $('regional-network-coverage').textContent=Object.entries(coverage).map(([id,c])=>network.data.nodes[id].title+' : '+(c.kind==='documentary_marker'?'repère documentaire sans surface':c.visible.length+' visibles / '+c.expected+' surfaces du catalogue')).join(' · ');
  }
  const renderStart=performance.now();
  try{
   if(nativeEye?.active&&selectedIndex!==null){
    const mesh=adapter.sources.resolve(selectedIndex);
    if(mesh)eyeMask.apply(findOccluders(camera,mesh,adapter.listSourceIndices().map(id=>adapter.sources.resolve(id))),.12);
   }
   renderer.render(scene,camera);
  }finally{eyeMask.restore()}
  renderSamples.push(performance.now()-renderStart);if(renderSamples.length>120)renderSamples.shift();renderedFrames++;
  updateStats();
  if(playing||(network?.state.enabled&&network.state.reading&&network.group.visible&&adapter.listSourceIndices().length))scheduleRender();
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
 detailedInspector?.sync();inspector?.refresh();refreshInspection();refreshSearch();updateStats();
 if(!ids.length){pauseMotion();releaseNetwork();}
 else if(!network&&!networkLoading)loadNetwork();
}
function refreshSearch(){
 const host=$('source-results');host.replaceChildren();
 const query=$('source-search').value;
 if(!adapter||!query.trim())return;
 const matches=($('search-scope').value==='catalogue'?catalogueAccess:adapter.sources).search(query);
 for(const mesh of matches){
  const id=mesh.userData.source_index;
  const button=document.createElement('button');
  button.dataset.sourceIndex=String(id);
  button.textContent=mesh.userData.name.replaceAll('_',' ');
  button.onclick=()=>{if(adapter.sources.resolve(id))selectSource(id);else loadSource(id)};
  host.append(button);
 }
 if(!matches.length)host.textContent=$('search-scope').value==='catalogue'?'Aucun résultat dans le catalogue de référence.':'Aucun résultat dans les blocs actuellement en mémoire.';
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
 if(detailedInspector?.active&&!detailedInspector.parts.some(m=>m.userData.source_index===id))detailedInspector.close();
 if(inspector?.info().scope&&!inspector.info().resident.includes(id))inspector.close();
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
 $('load').disabled=false;$('load-inspection').disabled=false;
}
function newStore(){
 if(store)store.clear();
 selectedIndex=null;selectedUI(null);
 const cap=Number($('budget').value);
 store=createBoundedChunkStore(manifest,{
  maxRawBytes:cap,
  readBytes:browserChunkReader(ROOT_URL),
  onInstall:chunk=>{if(failedContext)throw Error('Rendu suspendu : contexte WebGL perdu');return adapter.install(chunk)},
  onDispose:(token,chunk)=>{adapter.uninstall(token,chunk);renderer.renderLists.dispose()}
 });
 refreshStructures();fillBlocks();scheduleRender();
}
async function loadSelected(requestedIndex=null){
 const id=block.value,requestedStore=store,serial=++loadSerial,loadStart=performance.now(),hadResidents=adapter.listSourceIndices().length>0;
 pendingBlock=id;$('load').disabled=true;
 status('Lecture, vérification des empreintes et préparation des maillages : '+id+'…');
 try{
  const chunk=await requestedStore.load(id);
  if(serial!==loadSerial)return; // Never select an obsolete or cancelled region.
  const candidate=chunk.metadata.geometries[0];
  if(candidate)selectSource(requestedIndex??candidate.source_index);
  if(!hadResidents)resetCamera();
  loadSamples.push({id,read_verify_install_ms:performance.now()-loadStart});if(loadSamples.length>30)loadSamples.shift();
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
 const bounds=adapter?.listSourceIndices().map(id=>adapter.sourceInfo(id).bounds)??[];
 if(bounds.length){
  const lo=[0,1,2].map(k=>Math.min(...bounds.map(b=>b[0][k]))),hi=[0,1,2].map(k=>Math.max(...bounds.map(b=>b[1][k])));
  target.set(...lo.map((x,k)=>(x+hi[k])/2));distance=Math.max(.6,...hi.map((x,k)=>(x-lo[k])*2));
 }else{target.set(0,1.75,0);distance=7.1;}
 azimuth=.42;elevation=.25;updateCamera();
}
function bindPointer(){
 canvas.tabIndex=0;
 let origin=null,moved=false,pinch=null;
 const pointers=new Map();
 const pinchDistance=()=>{const [a,b]=[...pointers.values()];return Math.hypot(a.x-b.x,a.y-b.y)};
 canvas.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===1){origin={x:e.clientX,y:e.clientY,azimuth,elevation};moved=false;}
  else{origin=null;moved=true;if(pointers.size===2)pinch={span:Math.max(1,pinchDistance()),distance};}
  canvas.setPointerCapture(e.pointerId);
 });
 canvas.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId))return;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pinch&&pointers.size===2){distance=pinch.distance*pinch.span/Math.max(1,pinchDistance());updateCamera();return;}
  if(!origin)return;
  const dx=e.clientX-origin.x,dy=e.clientY-origin.y;
  if(Math.abs(dx)+Math.abs(dy)>6)moved=true;
  azimuth=origin.azimuth-dx*.006;
  elevation=origin.elevation+dy*.006;updateCamera();
 });
 canvas.addEventListener('pointerup',e=>{
  const wasClick=origin&&!moved&&pointers.size===1;
  pointers.delete(e.pointerId);pinch=null;origin=null;
  if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
  if(!wasClick||failedContext)return;
  const r=canvas.getBoundingClientRect();
  const mouse=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,
    -((e.clientY-r.top)/r.height)*2+1);
  const ray=new THREE.Raycaster();
  ray.setFromCamera(mouse,camera);
  const pickStart=performance.now();
  const record=adapter.pick(ray);
  pickSamples.push(performance.now()-pickStart);if(pickSamples.length>30)pickSamples.shift();
  if(record){selectedIndex=record.source_index;selectedUI(record);refreshStructures();structure.value=String(record.source_index)}
 });
 canvas.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);origin=null;pinch=null;moved=true});
 canvas.addEventListener('wheel',e=>{e.preventDefault();distance*=Math.exp(e.deltaY*.001);updateCamera()},{passive:false});
 canvas.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft'){azimuth-=.1;updateCamera();e.preventDefault()}
  if(e.key==='ArrowRight'){azimuth+=.1;updateCamera();e.preventDefault()}
  if(e.key==='ArrowUp'){elevation+=.1;updateCamera();e.preventDefault()}
  if(e.key==='ArrowDown'){elevation-=.1;updateCamera();e.preventDefault()}
 });
}

function createNativeEye(){
 const required=[[358,'VH_M_cornea_R'],[350,'VH_M_lens_R'],[336,'VH_M_retina_R']];
 const sourceIds=required.map(([node,name])=>records.find(r=>r.node===node&&r.name===name)?.source_index);
 nativeEye=mountNativeEyeContext({host:$('native-eye-host'),meta:sourceMeta,regional:true,
  getMeshes:()=>adapter.listSourceIndices().map(id=>adapter.sources.resolve(id)),
  allowed:inProgress=>!failedContext&&!playing&&!inspector.info().scope&&!detailedInspector?.active&&
   sourceIds.every(id=>adapter.sources.resolve(id)?.visible)&&(!inProgress||sourceIds.includes(selectedIndex)),
  begin:()=>{
   restPose();const saved={selectedIndex,target:target.toArray(),distance,azimuth,elevation,networkReading:network?.state.reading??false};
   if(network){network.state.reading=false;$('network-reading').textContent='Lire les chaînes';}return saved;
  },
  choose:(mesh,mode,saved)=>{
   selectSource(mesh.userData.source_index);
   if(mode==='body'){target.set(...saved.target);({distance,azimuth,elevation}=saved);updateCamera();}
   else{const b=mesh.userData.bounds;target.set(...[0,1,2].map(k=>(b[0][k]+b[1][k])/2));distance=Math.max(.08,...[0,1,2].map(k=>(b[1][k]-b[0][k])*3.2));updateCamera();}
  },
  end:(saved,restore)=>{
   eyeMask.restore();
   if(network){network.state.reading=saved.networkReading;$('network-reading').textContent=network.state.reading?'Figer les chaînes':'Lire les chaînes';}
   if(restore){target.set(...saved.target);({distance,azimuth,elevation}=saved);if(saved.selectedIndex!==null&&adapter.sources.resolve(saved.selectedIndex))selectSource(saved.selectedIndex);updateCamera();}
   scheduleRender();
  }});
}
function createDetailedInspector(){
 detailedInspector=createOrganInspector({records,getMeshes:()=>adapter.listSourceIndices().map(id=>adapter.sources.resolve(id)),
  network:{get data(){return network?.data??{routes:[]}},get matches(){return network?.matches??{}}},
  getView:()=>({visibleSourceIndices:new Set(adapter.listSourceIndices().filter(id=>adapter.sources.resolve(id).visible)),knownSourceIndices:new Set(adapter.listSourceIndices()),target:target.toArray(),zoom:distance,pitch:elevation,angle:azimuth,playing:false}),
  setView:view=>{
   for(const id of adapter.listSourceIndices())adapter.sources.resolve(id).visible=!view.knownSourceIndices||view.knownSourceIndices.has(id)?view.visibleSourceIndices.has(id):true;
   target.set(...view.target);distance=view.zoom;elevation=view.pitch;azimuth=view.angle;pauseMotion();updateCamera();
  },selectLeaf:mesh=>selectSource(mesh.userData.source_index),onMode:()=>scheduleRender()});
}
function performanceReceipt(){
 const sorted=[...renderSamples].sort((a,b)=>a-b);
 return {schema:'poly.regional-local-diagnostics.v1',environment:{user_agent:navigator.userAgent,
  viewport:[innerWidth,innerHeight],dpr:renderer.getPixelRatio(),coarse_pointer:matchMedia('(pointer:coarse)').matches},
  source_metadata_sha256:manifest.source.metadata_sha256,source_geometry_sha256:manifest.source.geometry_sha256,
  cache:store.info(),scene:adapter.diagnostics(),inspection:inspector.info(),native_eye_active:nativeEye?.active??false,eye_mask_size:eyeMask.size,detailed_inspection:{active:detailedInspector?.active??false,group_id:detailedInspector?.groupId??null},
  view:{distance,azimuth,elevation},functional_network:network?{coverage:network.coverage,enabled:network.state.enabled,active:[...network.active],visible_segments:network.routeViews.filter(v=>network.group.visible&&v.line.visible||network.group.visible&&v.beam?.visible).length}:null,context_lost:failedContext,rendered_frames:renderedFrames,
  cpu_render_submission_ms:{count:sorted.length,p50:sorted.length?sorted[Math.floor((sorted.length-1)*.5)]:null,
   p95:sorted.length?sorted[Math.floor((sorted.length-1)*.95)]:null},
  recent_cpu_pick_ms:[...pickSamples],recent_loads:loadSamples.map(x=>({...x})),three_geometries:renderer.info.memory.geometries,
  draw_calls:renderer.info.render.calls,
  limits:['CPU submission duration only; no GPU timing or physical GPU memory',
   'Cache bytes exclude transient buffers, metadata, CPU proxies and renderer resources',
   'No battery, thermal or biomechanical measurement; emulation is not a physical phone']};
}
function releaseNetwork(){
 if(network){networkPreferences={enabled:network.state.enabled,reading:network.state.reading,active:[...network.active],focus:network.state.focus};network.dispose();network=null;}
 networkSerial++;networkLoading=false;
 $('regional-network-coverage').textContent='Aucune surface : réseaux graphiques suspendus.';
}
async function loadNetwork(){
 if(networkLoading||network)return;
 networkLoading=true;const serial=++networkSerial;
 try{
  const response=await fetch('../data/walking-network.json');if(!response.ok)throw Error('Réseau documentaire indisponible');
  const bytes=new Uint8Array(await response.arrayBuffer());
  if(await sha256Bytes(bytes)!=='8448312aafdd9e921cea80b04e798cd2a3ce33b8f9ee15ce7b0aaf7be9b0c95b')throw Error('Réseau documentaire altéré');
  if(serial!==networkSerial)return;
  const candidate=await createWalkingNetwork({scene,camera,getMeshes:()=>adapter.listSourceIndices().map(id=>adapter.sources.resolve(id)),
   records,residentOnly:true,sourceData:JSON.parse(new TextDecoder().decode(bytes)),uniforms:rig.uniforms,stage:$('regional-stage')});
  if(serial!==networkSerial){candidate.dispose();return;}network=candidate;
  network.state.enabled=networkPreferences?.enabled??false;network.state.reading=networkPreferences?.reading??true;
  if(networkPreferences){network.active.clear();for(const id of networkPreferences.active)network.active.add(id);network.state.focus=networkPreferences.focus;}
  $('network-enabled').checked=network.state.enabled;
  $('network-reading').textContent=network.state.reading?'Figer les chaînes':'Lire les chaînes';
  for(const input of $('network-panel').querySelectorAll('[data-route]'))input.checked=network.active.has(input.dataset.route);
  // The complete brain dossier remains accessible through the existing separate page.
  $('network-brain-doc').onclick=()=>{location.href='cerveau.html'};
  scheduleRender();
 }catch(e){if(serial===networkSerial)$('regional-network-coverage').textContent=e.message+' ; les surfaces restent consultables.';}
 finally{if(serial===networkSerial)networkLoading=false;}
}
let motionScale=null;
function motionText(mode){if(sampler)$('motion-status').textContent=mode+' · Transfert graphique de la marche OpenSim sur un atlas distinct. Aucune force, activation, contact au sol ni précision biomécanique validée.';}
function pauseMotion(){playing=false;lastFrame=null;$('motion-play').textContent='Lire la marche';motionText('Lecture en pause');}
function restPose(){pauseMotion();rig.reset();elapsed=0;$('motion-phase').value='0';motionText('Repos');}
async function loadMotion(){
 try{
  const response=await fetch('../data/walk.json');
  if(!response.ok)throw Error('Cinématique indisponible');
  const bytes=new Uint8Array(await response.arrayBuffer());
  if(await sha256Bytes(bytes)!=='b22455ced299545f9fe2aa95e14153952b02db864eef218a208604db44eff5fb')throw Error('Cinématique source altérée');
  sampler=createWalkSampler(JSON.parse(new TextDecoder().decode(bytes)),motionScale);
  $('motion-phase').disabled=false;$('motion-play').disabled=false;
 }catch(e){$('motion-status').textContent='Marche désactivée : '+e.message+'. Inspection statique disponible.';}
}
async function loadInspection(){
 const info=inspector.info();if(!info.scope)return;
 const plan=planSourceBlocks(manifest,[...info.resident,...info.missing],store.info().capacityRawBytes);
 if(!plan.fitsBudget){status('Cet ensemble requiert '+fmt(plan.rawBytes)+' octets bruts de blocs. Augmenter le budget avant de le charger.',true);return;}
 invalidatePending();const serial=++loadSerial,requestedStore=store;
 $('load-inspection').disabled=true;
 try{
  // Pin existing required blocks first so eviction cannot close the active inspection.
  for(const id of plan.ids.filter(id=>requestedStore.info().ids.includes(id)))await requestedStore.load(id,{pin:true});
  for(const id of plan.ids){
   if(serial!==loadSerial)return;
   pendingBlock=id;await requestedStore.load(id,{pin:true});
  }
  if(serial===loadSerial)status('Ensemble chargé dans ses blocs vérifiés. La complétude humaine reste inconnue.');
 }catch(e){if(serial===loadSerial)status('Ensemble partiel : '+e.message,true);}
 finally{
  for(const id of plan.ids)requestedStore.unpin(id);
  if(serial===loadSerial){pendingBlock=null;$('load-inspection').disabled=false;fillBlocks();refreshStructures();scheduleRender();}
 }
}
async function loadSource(index){
 const chunk=manifest.chunks.find(c=>c.original_indices.includes(index));
 if(!chunk)return;
 invalidatePending();system.value=chunk.system;fillBlocks();block.value=chunk.id;
 await loadSelected(index);
}
function openInspection(single){
 if(selectedIndex===null)return;nativeEye?.close(false);
 if(detailedInspector?.active)detailedInspector.close();
 restPose();
 if(!inspector.info().scope)inspectionView={target:target.toArray(),distance,azimuth,elevation};
 if(inspector.open(selectedIndex,{single})){
  const bounds=inspector.info().resident.map(id=>records[id].bounds);
  const lo=[0,1,2].map(k=>Math.min(...bounds.map(b=>b[0][k]))),hi=[0,1,2].map(k=>Math.max(...bounds.map(b=>b[1][k])));
  target.set(...lo.map((x,k)=>(x+hi[k])/2));distance=Math.max(.6,...hi.map((x,k)=>(x-lo[k])*3.2));updateCamera();
  refreshStructures();scheduleRender();
 }
}
function refreshInspection(){
 const out=$('inspection');if(!out||!inspector)return;
 const info=inspector.info();out.replaceChildren();
 $('load-inspection').hidden=!info.scope||!info.missing.length;
 if(!info.scope){
  if(inspectionView){target.set(...inspectionView.target);({distance,azimuth,elevation}=inspectionView);inspectionView=null;updateCamera();}
  out.textContent='Inspection inactive. Choisir une structure pour ouvrir son ensemble.';return;}
 const p=document.createElement('p');
 p.textContent=info.resident.length+' / '+info.expected+' pièces du catalogue présentes dans cet ensemble. '+info.missing.length+' absentes. La complétude anatomique humaine n’est pas établie.';
 out.append(p);
 for(const id of info.resident){
  const button=document.createElement('button');button.dataset.inspectionSource=String(id);
  button.textContent=records[id].name.replaceAll('_',' ');
  button.onclick=()=>{if(adapter.sources.resolve(id))selectSource(id)};out.append(button);
 }
}

async function start(){
 try{
  const res=await fetch(manifestURL,{cache:'no-store'});
  if(!res.ok)throw Error('Manifeste expérimental indisponible (HTTP '+res.status+')');
  manifest=validateChunkManifest(await res.json());
  const packed=await fetch('../models/body-display.json.gz');
  if(!packed.ok)throw Error('Catalogue source indisponible');
  const bytes=await readGzipBounded(new Uint8Array(await packed.arrayBuffer()),427196);
  if(await sha256Bytes(bytes)!==manifest.source.metadata_sha256)throw Error('Catalogue source altéré');
  const meta=JSON.parse(new TextDecoder().decode(bytes));sourceMeta=meta;
  records=meta.structures.map((r,i)=>sourceMeshData(r,{sourceIndex:i,system:atlasSystem(r)}));
  catalogueAccess=createSourceAccess(()=>records.map(userData=>({userData})));
  motionScale=meta.normalization.scale;
  scene=new THREE.Scene();scene.background=new THREE.Color(0x092231);
  camera=new THREE.PerspectiveCamera(42,1,.01,120);
  target=new THREE.Vector3(0,1.75,0);
  scene.add(new THREE.HemisphereLight(0xc6e4ed,0x26354b,2.2));
  const light=new THREE.DirectionalLight(0xffe5c8,2.7);light.position.set(5,8,6);scene.add(light);
  renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'low-power'});
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  adapter=createRegionSceneAdapter({THREE,scene,rig,
    onChange:()=>{refreshStructures();scheduleRender()},
    onSelectionLost:()=>{selectedIndex=null;selectedUI(null)}
  });
  const systems=[...new Set(manifest.chunks.map(c=>c.system))].sort();
  for(const k of systems){const o=document.createElement('option');o.value=k;o.textContent=k;system.append(o)}
  if(systems.includes('skeletal'))system.value='skeletal';
  system.onchange=()=>{invalidatePending();fillBlocks()};
  block.onchange=()=>{invalidatePending();fillBlocks()};
  $('budget').onchange=()=>{invalidatePending();newStore();status('Budget modifié. Anciens blocs et ressources GPU libérés.')};
  $('load').onclick=()=>loadSelected();$('release').onclick=()=>{invalidatePending();releaseSelected()};
  $('clear').onclick=()=>{restPose();invalidatePending();store.clear();selectedIndex=null;selectedUI(null);refreshStructures();fillBlocks();status('Tous les blocs libérés.');scheduleRender()};
  structure.onchange=()=>{if(structure.value)selectSource(Number(structure.value))};
  $('source-search').oninput=refreshSearch;
  $('focus').onclick=()=>{restPose();focusSelected()};$('reset').onclick=resetCamera;
  inspector=createResidentInspector({records,getMeshes:()=>adapter.listSourceIndices().map(id=>adapter.sources.resolve(id))});
  createDetailedInspector();createNativeEye();
  $('detailed-inspect').onclick=()=>{if(selectedIndex!==null){nativeEye?.close(false);inspector.close();refreshStructures();restPose();detailedInspector.inspect(adapter.sources.resolve(selectedIndex));}};
  $('organ-catalog').addEventListener('change',()=>{nativeEye?.close(false);inspector.close();refreshStructures();restPose();},{capture:true});
  $('search-scope').onchange=refreshSearch;
  $('inspect').onclick=()=>openInspection(false);
  $('isolate-source').onclick=()=>openInspection(true);
  $('load-inspection').onclick=loadInspection;
  $('close-inspection').onclick=()=>{inspector.close();refreshStructures();scheduleRender()};
  $('motion-phase').oninput=()=>{pauseMotion();sampler.apply(elapsed=Number($('motion-phase').value),rig.uniforms);scheduleRender()};
  $('motion-rest').onclick=()=>{restPose();scheduleRender()};
  $('motion-play').onclick=()=>{if(playing)pauseMotion();else if(!failedContext&&adapter.listSourceIndices().length){playing=true;lastFrame=null;$('motion-play').textContent='Pause';motionText('Lecture de la marche');scheduleRender()}};
  newStore();bindPointer();resetCamera();
  loadMotion();loadNetwork();
  $('network-panel').addEventListener('click',scheduleRender);$('network-panel').addEventListener('change',scheduleRender);
  $('export-diagnostics').onclick=()=>{
   const url=URL.createObjectURL(new Blob([JSON.stringify(performanceReceipt(),null,2)],{type:'application/json'}));
   const a=document.createElement('a');a.href=url;a.download='poly-regional-local-diagnostics.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  Object.defineProperty(window,'__polyRegionLabPerformance',{value:performanceReceipt,configurable:false});
  // Read-only diagnostics for source/provenance regression tests in this isolated lab.
  Object.defineProperty(window,'__polyRegionLabDiagnostics',{value:()=>({cache:store.info(),scene:adapter.diagnostics(),inspection:inspector.info(),motion:{playing,elapsed,pose:Object.fromEntries(Object.entries(rig.uniforms).filter(([k,u])=>typeof u.value==='number').map(([k,u])=>[k,u.value]))}}),configurable:false});
  window.addEventListener('resize',scheduleRender);
  window.addEventListener('pagehide',()=>{pauseMotion();nativeEye?.dispose();nativeEye=null;releaseNetwork();detailedInspector?.dispose();detailedInspector=null;invalidatePending();inspector.close();store.clear();adapter.dispose();renderer.dispose();});
  window.addEventListener('pageshow',e=>{if(e.persisted){
   renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'low-power'});renderer.outputColorSpace=THREE.SRGBColorSpace;
   failedContext=false;createDetailedInspector();createNativeEye();refreshStructures();fillBlocks();loadNetwork();scheduleRender();
  }});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseMotion();else scheduleRender()});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();failedContext=true;pauseMotion();if(network){network.state.reading=false;$('network-reading').textContent='Lire les chaînes';}invalidatePending();status('Contexte WebGL perdu. Rendu suspendu ; les données restent séparées.',true)});
  canvas.addEventListener('webglcontextrestored',()=>{failedContext=false;status('Contexte WebGL rétabli. Vérifier le rendu.');scheduleRender()});
  $('loading').hidden=true;$('app').hidden=false;fillBlocks();scheduleRender();
  status('Manifeste vérifié : '+manifest.chunk_count+' blocs disponibles. Aucun bloc chargé.');
 }catch(e){
  $('loading').setAttribute('role','alert');
  $('loading').textContent='Laboratoire non disponible : '+e.message+'. Aucun maillage ne sera affiché sans source contrôlée. Utiliser le mode léger.';
 }
}
start();
