import {createRecoveredWork} from './recovered-work.js';
import {readRecoveredSources} from './recovered-source.mjs';
import {createCogitateScene} from './cogitate-scene.js';
import {readCogitateSource} from './cogitate-source.mjs';
import {createNerveExcitability} from './nerve-excitability.js';
import {createEntericInhibition} from './enteric-inhibition.js';
import {createHumanNerves} from './human-nerves.js';
import {createNerveLinkedPilot} from './nerve-linked-pilot.js';
import {loadReferenceNerveDocumentation} from './reference-nerve-documentation.mjs';
import {createNeuromuscularGuide} from './neuromuscular-guide.js';
import {readNeuromuscularGuide} from './neuromuscular-source.mjs';
import {mountRegionalGenericHeart} from './regional-generic-heart.mjs';
import {mountRegionalDocumentary} from './regional-documentary-view.mjs';
import {createHandMusclesReference} from './hand-muscles-reference.js';
import {readHandReference} from './hand-reference-source.mjs';
import {createBrainAtlas} from './brain-atlas.js';
import {readCerebraSource} from './brain-atlas-source.mjs';
import {verifySourceText} from './source-text-integrity.mjs';
import {auditSceneGeometryIds} from './three-resource-audit.mjs';
import {createEyeLight} from './eye-light.js';
import {mountNativeEyeContext} from './native-eye-context.mjs';
import {findOccluders,createMaterialMask} from './selective-occlusion.js';
import {createOrganInspector} from './organ-inspector.js';
import {createWalkingNetwork} from './walking-network.js';
import {createResidentInspector} from './body-resident-inspector.mjs';
import {createRegionalRig,createWalkSampler} from './body-region-motion.mjs';
import {sourceMeshData,createSourceAccess,planSourceBlocks} from './body-source-contract.mjs';
import {atlasSystem} from './body-light-core.mjs';
import * as THREE from './vendor/three.module.js?v=audit-o-1';
import {validateChunkManifest,createBoundedChunkStore,browserChunkReader,sha256Bytes,readGzipBounded} from './body-chunk-reader.mjs';
import {createRegionSceneAdapter} from './body-region-three.mjs';
import {createResidentOcclusion,isNeutralRig} from './resident-occlusion.mjs';
import {createCameraHistory,orientedCamera,CAMERA_POLE_LIMIT} from './camera-navigation.mjs';
import {createHistoricalPosture} from './historical-posture.mjs';

const $=id=>document.getElementById(id);
const fmt=n=>Number(n).toLocaleString('fr-FR');
const startupStarted=performance.now(),startupTrace=[];let startupStage='module_ready',startupError=null;
function startupMark(stage){startupStage=stage;startupTrace.push({stage,elapsed_ms:performance.now()-startupStarted});if(startupTrace.length>32)startupTrace.shift();$('loading').dataset.stage=stage;}
Object.defineProperty(window,'__polyRegionLabStartup',{value:()=>({stage:startupStage,error:startupError,trace:startupTrace.map(item=>({...item})),elapsed_ms:startupStage==='ready'||startupError?startupTrace.at(-1).elapsed_ms:performance.now()-startupStarted}),configurable:false});
startupMark('module_ready');
const ROOT_URL=new URL('../data/body-chunks-preview/',import.meta.url);
const manifestURL=new URL('MANIFEST.json',ROOT_URL);
let manifest=null,store=null,adapter=null,renderer=null,scene=null,camera=null;
let inspector=null,records=[],catalogueAccess=null,sampler=null,playing=false,elapsed=0,lastFrame=null;
const rig=createRegionalRig();
const historicalPosture=createHistoricalPosture(rig.uniforms);let manualMode='stand',manualTime=0,manualPlaying=false,manualView=null;
let detailedInspector=null,nativeEye=null,eyeLight=null,sourceMeta=null,brain=null,brainSerial=0,brainController=null,hand=null,handSerial=0,handController=null;
const eyeMask=createMaterialMask();
const cameraHistory=createCameraHistory(),residentMask=createResidentOcclusion(()=>adapter?adapter.listSourceIndices().map(id=>adapter.sources.resolve(id)):[]);
function specialView(){return Boolean(cogitate?.active||genericHeart?.active||inspector?.info().scope||detailedInspector?.active||nativeEye?.active||eyeLight?.active||brain?.group.visible||hand?.bodyGroup.visible);}
function maskAvailable(){return !failedContext&&!playing&&isNeutralRig(rig.uniforms)&&!specialView()&&selectedIndex!==null&&Boolean(adapter?.sources.resolve(selectedIndex)?.visible);}
function navigationUI(){
 $('region-view-back').disabled=!cameraHistory.size||failedContext||specialView();$('region-orientation').disabled=failedContext||specialView();
 const requested=$('region-occlusion').checked,available=maskAvailable();$('region-occlusion').disabled=!available;
 $('region-occlusion-status').textContent=requested?(available?'Atténuation graphique des obstacles échantillonnés ; les matériaux sont restaurés après chaque image.':'Atténuation suspendue : sélectionner une surface HRA au repos, hors des vues spécialisées.'):'Sept rayons de présentation sur les blocs HRA chargés, au repos. Les régions absentes et la visibilité anatomique complète ne sont pas déduites.';
 postureUI();documentary?.refresh();
}
function postureBlocked(){return failedContext||specialView()||Boolean(hand?.state.enabled);}
function postureUI(){
 const available=Boolean(adapter?.listSourceIndices().length)&&!postureBlocked(),dynamic=['run','eat'].includes(manualMode);
 $('regional-activity').disabled=!available;$('regional-pose-time').disabled=!available||!dynamic;$('regional-pose-play').disabled=!available||!dynamic;$('regional-pose-focus').disabled=!available||manualMode==='stand'||selectedIndex===null;
 $('motion-phase').disabled=!sampler||!available||manualMode!=='stand';$('motion-play').disabled=!sampler||!available||manualMode!=='stand';
 $('regional-pose-clock').textContent=manualTime.toFixed(2)+' s';$('regional-pose-time').value=String(manualTime);
}
function pauseManual(){manualPlaying=false;$('regional-pose-play').textContent='Lire le geste illustratif';}
function endManual(restore=true){
 pauseManual();manualMode='stand';manualTime=0;$('regional-activity').value='stand';historicalPosture.reset();cameraHistory.clear();
 if(manualView&&restore&&target){target.fromArray(manualView.target);({distance,azimuth,elevation}=manualView);updateCamera();}manualView=null;
}
function chooseManual(mode){
 if(!['stand','run','sit','lie','eat'].includes(mode)||postureBlocked()||!adapter.listSourceIndices().length)return;
 if(mode==='stand'){restPose();scheduleRender();return;}
 pauseMotion();pauseManual();if(!manualView)manualView={target:target.toArray(),distance,azimuth,elevation};cameraHistory.clear();manualMode=mode;manualTime=0;historicalPosture.apply(mode,0);
 if(mode==='lie'){target.set(0,.45,0);distance=7.2;elevation=.8;azimuth=.35;}else if(['sit','eat'].includes(mode)){target.set(0,1.32,.25);distance=6.5;elevation=.12;azimuth=.35;}else{target.set(0,1.75,0);distance=7.7;elevation=.04;azimuth=.25;}
 $('regional-pose-status').textContent='Posture / geste historique illustratif, sans mobilier ni ustensile ajouté. Temps de présentation uniquement ; aucun contact, force, activation, sommeil ou digestion calculé. Réseau documentaire de marche suspendu dans ces postures.';updateCamera();
}
function focusPosedSelection(){
 if(selectedIndex===null||manualMode==='stand'||postureBlocked())return;pauseManual();const record=adapter.sourceInfo(selectedIndex);if(!record)return;
 cameraHistory.push({target:target.toArray(),distance,azimuth,elevation});const box=new THREE.Box3(),[lo,hi]=record.bounds;
 for(let x=0;x<2;x++)for(let y=0;y<2;y++)for(let z=0;z<2;z++)box.expandByPoint(new THREE.Vector3(...rig.deform([x?hi[0]:lo[0],y?hi[1]:lo[1],z?hi[2]:lo[2]])));
 target.copy(box.getCenter(new THREE.Vector3()));distance=Math.max(.55,box.getSize(new THREE.Vector3()).length()*2.8);elevation=.08;updateCamera();
}
let documentary=null,genericHeart=null,neuromuscular=null,nmjController=null,nmjSerial=0;
let recovered=null,recoveredController=null,recoveredSerial=0;
let cogitate=null,cogitateController=null,cogitateSerial=0,cogitateView=null;
let humanNerves=null,nervePilot=null,nerveExcitability=null,entericInhibition=null,nervesController=null,nervesSerial=0;
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
  if(!renderer||failedContext||renderer.getContext().isContextLost())return;
  nativeEye?.update();cogitate?.update();
  const dt=lastFrame!==null?Math.min((now-lastFrame)/1000,.05):0;
  const recoveredBlocked=Boolean(inspector?.info().scope||detailedInspector?.active||nativeEye?.active||eyeLight?.active||cogitate?.active);if(recoveredBlocked&&recovered?.playing)recovered.pause();recovered?.update(dt,{organ:recoveredBlocked});
  if(manualMode!=='stand'&&postureBlocked())restPose();
  if(manualMode!=='stand'){if(manualPlaying){manualTime=Math.min(6,manualTime+dt);if(manualTime>=6)pauseManual();}historicalPosture.apply(manualMode,manualTime);}
  if(playing&&sampler){
   elapsed+=dt;
   sampler.apply(elapsed,rig.uniforms);$('motion-phase').value=String(elapsed%sampler.duration);
  }
  hand?.update();neuromuscular?.update(dt);
  const nerveBlocked=manualMode!=='stand'||specialView();if(nerveBlocked){humanNerves?.pause();nerveExcitability?.pause();entericInhibition?.pause();}humanNerves?.update(dt,{organ:nerveBlocked});nervePilot?.update();nerveExcitability?.update(dt,{organ:nerveBlocked});entericInhibition?.update(dt,{organ:nerveBlocked});
  eyeLight?.update(dt);
  brain?.update({organ:Boolean(inspector.info().scope||detailedInspector?.active||nativeEye?.active||eyeLight?.active)});
  lastFrame=now;
  const rect=canvas.getBoundingClientRect();
  if(rect.width<1||rect.height<1)return;
  const dpr=Math.min(window.devicePixelRatio||1,window.matchMedia('(pointer:coarse)').matches?1:1.5);
  if(renderer.getPixelRatio()!==dpr)renderer.setPixelRatio(dpr);
  const width=Math.max(1,Math.round(rect.width)),height=Math.max(1,Math.round(rect.height));
  if(canvas.width!==Math.floor(width*dpr)||canvas.height!==Math.floor(height*dpr))renderer.setSize(width,height,false);
  if(camera.aspect!==width/height){camera.aspect=width/height;camera.updateProjectionMatrix();}
  if(network){
   if(network.state.reading&&network.state.enabled&&manualMode==='stand')networkElapsed+=dt;
   network.update(networkElapsed,manualMode==='stand'&&!inspector.info().scope&&!detailedInspector?.active&&!nativeEye?.active&&!eyeLight?.active&&!brain?.group.visible,selectedIndex===null?null:adapter.sources.resolve(selectedIndex),playing?'walk':'stand');
   const coverage=network.coverage;
   $('regional-network-coverage').textContent=Object.entries(coverage).map(([id,c])=>network.data.nodes[id].title+' : '+(c.kind==='documentary_marker'?'repère documentaire sans surface':c.visible.length+' visibles / '+c.expected+' surfaces du catalogue')).join(' · ');
  }
  const renderStart=performance.now();
  try{
   if(nativeEye?.active&&selectedIndex!==null){
    const mesh=adapter.sources.resolve(selectedIndex);
    if(mesh)eyeMask.apply(findOccluders(camera,mesh,adapter.listSourceIndices().map(id=>adapter.sources.resolve(id))),.12);
   }
   if($('region-occlusion').checked&&maskAvailable())residentMask.render(camera,[selectedIndex],()=>renderer.render(scene,camera));
   else{residentMask.clear();renderer.render(scene,camera);}
  }catch(error){if(!renderer.getContext().isContextLost())throw error;}finally{eyeMask.restore()}
  renderSamples.push(performance.now()-renderStart);if(renderSamples.length>120)renderSamples.shift();renderedFrames++;
  updateStats();
  if(recovered?.playing||playing||manualPlaying||(nerveExcitability?.state.playing&&nerveExcitability.group.visible)||(entericInhibition?.state.playing&&entericInhibition.group.visible)||(humanNerves?.state.playing&&humanNerves.group.visible)||neuromuscular?.state.playing||eyeLight?.playing||(network?.state.enabled&&network.state.reading&&network.group.visible&&adapter.listSourceIndices().length))scheduleRender();
 });
}
function updateStats(){
 if(!adapter||!store||!renderer)return;
 const d=adapter.diagnostics(),m=store.info();
 $('memory').textContent=fmt(m.residentRawBytes)+' / '+fmt(m.capacityRawBytes)+' octets bruts en cache · '+m.ids.length+' bloc(s).';
 $('scene-stat').textContent=fmt(d.meshes)+' structures HRA · '+fmt(d.triangles)+' triangles · '+fmt(d.vertices)+' sommets · '+fmt(renderer.info.memory.geometries)+' géométries GPU suivies par Three.js.';
 navigationUI();
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
 humanNerves?.refresh();detailedInspector?.sync();inspector?.refresh();refreshInspection();refreshSearch();updateStats();
 if(!ids.length){pauseMotion();endManual(false);releaseNetwork();}
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
 unloadHand();unloadBrain();
 if(store)store.clear();
 selectedIndex=null;selectedUI(null);
 const cap=Number($('budget').value);
 store=createBoundedChunkStore(manifest,{
  maxRawBytes:cap,
  readBytes:browserChunkReader(ROOT_URL),
  onInstall:chunk=>{if(failedContext)throw Error('Rendu suspendu : contexte WebGL perdu');return adapter.install(chunk)},
  onDispose:(token,chunk)=>{residentMask.clear();adapter.uninstall(token,chunk);renderer.renderLists.dispose()}
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
 elevation=Math.max(-CAMERA_POLE_LIMIT,Math.min(CAMERA_POLE_LIMIT,elevation));
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
 cameraHistory.push({target:target.toArray(),distance,azimuth,elevation});
 const b=record.bounds;
 target.set((b[0][0]+b[1][0])/2,(b[0][1]+b[1][1])/2,(b[0][2]+b[1][2])/2);
 const diameter=Math.max(.1,...[0,1,2].map(i=>b[1][i]-b[0][i]));
 distance=Math.max(.6,diameter*3.2);updateCamera();
}
function resetCamera(){
 cameraHistory.clear();
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
  if(cogitate?.pick(ray)){scheduleRender();return;}
  if(hand?.bodyGroup.visible){status('Référence BodyParts3D distincte : sélectionner une pièce avec les commandes de la main.');return;}
  const pickStart=performance.now();
  if(brain?.pick(ray)){pickSamples.push(performance.now()-pickStart);if(pickSamples.length>30)pickSamples.shift();scheduleRender();return;}
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

function unloadRecovered(){recoveredSerial++;recoveredController?.abort();recoveredController=null;recovered?.dispose();recovered=null;renderer?.renderLists.dispose();$('regional-recovered-load').disabled=!brain;$('regional-recovered-unload').disabled=true;$('regional-recovered-status').textContent='Travaux et lecteur documentaire libérés.';scheduleRender();}
async function loadRecovered(){if(!brain||recovered||recoveredController)return;const reference=brain,serial=++recoveredSerial,controller=new AbortController();recoveredController=controller;const timer=setTimeout(()=>controller.abort(),30000);$('regional-recovered-load').disabled=true;$('regional-recovered-unload').disabled=false;
 try{const sourceData=await readRecoveredSources({signal:controller.signal});if(serial!==recoveredSerial||brain!==reference)return;const candidate=await createRecoveredWork({scene,uniforms:rig.uniforms,brain:reference,sourceData,signal:controller.signal,stage:$('regional-stage'),rightHost:$('regional-recovered-panel'),onChange:scheduleRender,onSelect:()=>{restPose();humanNerves?.pause();scheduleRender();},focus:point=>{restPose();target.fromArray(point);distance=1.5;updateCamera();}});if(serial!==recoveredSerial||brain!==reference){candidate.dispose();return;}recovered=candidate;$('regional-recovered-status').textContent=sourceData.catalog.groups.length+' dossiers et '+sourceData.inventory.intervals+' intervalles source vérifiés. Horloge de lecture indépendante, aucun effet biologique du corps calculé.';scheduleRender();
 }catch(e){if(serial===recoveredSerial)$('regional-recovered-status').textContent='Travaux refusés : '+e.message;}finally{clearTimeout(timer);if(serial===recoveredSerial){recoveredController=null;$('regional-recovered-load').disabled=Boolean(recovered)||!brain;}}}
function unloadCogitate(){cogitateSerial++;cogitateController?.abort();cogitateController=null;cogitate?.dispose();cogitate=null;renderer?.renderLists.dispose();$('regional-cogitate-load').disabled=false;$('regional-cogitate-unload').disabled=true;$('regional-cogitate-status').textContent='Scène et textures COGITATE libérées.';scheduleRender();}
async function loadCogitate(){if(cogitate||cogitateController||failedContext)return;const serial=++cogitateSerial,controller=new AbortController();cogitateController=controller;const timer=setTimeout(()=>controller.abort(),30000);$('regional-cogitate-load').disabled=true;$('regional-cogitate-unload').disabled=false;
 try{const sourceAssets=await readCogitateSource({signal:controller.signal});if(serial!==cogitateSerial)return;const candidate=await createCogitateScene({scene,camera,uniforms:rig.uniforms,sourceAssets,signal:controller.signal,panelHost:$('regional-cogitate-panel'),entryHost:$('regional-cogitate-entry'),onChange:scheduleRender,allowed:()=>!failedContext&&!specialView(),focus:v=>{target.fromArray(v.target);distance=v.zoom;elevation=v.pitch;azimuth=v.angle;updateCamera();},onMode:open=>{if(open){restPose();humanNerves?.pause();if(network)network.state.reading=false;cogitateView={target:target.toArray(),distance,azimuth,elevation};}else if(cogitateView){if(!failedContext){target.fromArray(cogitateView.target);({distance,azimuth,elevation}=cogitateView);updateCamera();}cogitateView=null;}scheduleRender();}});if(serial!==cogitateSerial||controller.signal.aborted){candidate.dispose();return;}cogitate=candidate;$('regional-cogitate-status').textContent='Dossier et deux figures locales vérifiés. Ce corps de référence n’est pas le participant CF102.';cogitate.open();scheduleRender();
 }catch(e){if(serial===cogitateSerial)$('regional-cogitate-status').textContent='Scène refusée : '+e.message;}finally{clearTimeout(timer);if(serial===cogitateSerial){cogitateController=null;$('regional-cogitate-load').disabled=Boolean(cogitate);}}}
function unloadNerves(){nervesSerial++;nervesController?.abort();nervesController=null;nerveExcitability?.dispose();nerveExcitability=null;entericInhibition?.dispose();entericInhibition=null;nervePilot?.dispose();nervePilot=null;humanNerves?.dispose();humanNerves=null;renderer?.renderLists.dispose();$('regional-nerves-load').disabled=false;$('regional-nerves-unload').disabled=true;$('regional-nerves-status').textContent='Courbes et contrôles nerveux libérés.';scheduleRender();}
async function loadNerves(){
 if(humanNerves||nervesController)return;const serial=++nervesSerial,controller=new AbortController();nervesController=controller;const timer=setTimeout(()=>controller.abort(),30000);$('regional-nerves-load').disabled=true;$('regional-nerves-unload').disabled=false;
 let candidate=null,pilot=null,electrical=null,enteric=null;
 try{const sourceData=await loadReferenceNerveDocumentation({signal:controller.signal});if(serial!==nervesSerial)return;
  candidate=await createHumanNerves({scene,uniforms:rig.uniforms,organView:detailedInspector,sourceData,signal:controller.signal,stage:$('regional-stage'),getMeshes:()=>adapter.listSourceIndices().map(id=>adapter.sources.resolve(id)),onChange:scheduleRender,focus:view=>{restPose();target.fromArray(view.target);distance=view.zoom;elevation=view.pitch;azimuth=view.angle;updateCamera();}});
  candidate.group.visible=false;
  if(candidate.bufferBytes>12582912)throw Error('Buffers nerveux au-delà du budget de 12 Mio');
  pilot=await createNerveLinkedPilot({scene,uniforms:rig.uniforms,humanNerves:candidate,organView:detailedInspector,signal:controller.signal,stage:$('regional-stage'),onChange:scheduleRender});
  if(serial!==nervesSerial||controller.signal.aborted){pilot.dispose();candidate.dispose();return;}electrical=createNerveExcitability({scene,uniforms:rig.uniforms,humanNerves:candidate,stage:$('regional-stage'),onChange:scheduleRender});enteric=createEntericInhibition({scene,uniforms:rig.uniforms,humanNerves:candidate,organView:detailedInspector,stage:$('regional-stage'),onChange:scheduleRender});humanNerves=candidate;nervePilot=pilot;nerveExcitability=electrical;entericInhibition=enteric;candidate=null;pilot=null;electrical=null;enteric=null;
  $('regional-nerves-status').textContent='575 courbes vérifiées, 458 itinéraires ; '+fmt(humanNerves.bufferBytes)+' octets de buffers géométriques propres, hors objets/source/temporaires/GPU. Aucun nerf segmenté ni intervalle biologique calculé.';scheduleRender();
 }catch(e){electrical?.dispose();enteric?.dispose();pilot?.dispose();candidate?.dispose();if(serial===nervesSerial){$('regional-nerves-status').textContent='Courbes refusées : '+e.message;$('regional-nerves-unload').disabled=true;}}finally{clearTimeout(timer);if(serial===nervesSerial){nervesController=null;$('regional-nerves-load').disabled=Boolean(humanNerves);}}
}
function unloadHand(){
 nmjSerial++;nmjController?.abort();nmjController=null;neuromuscular?.dispose();neuromuscular=null;$('regional-nmj-load').disabled=true;$('regional-nmj-status').textContent='Guide libéré avec la référence de main.';
 handSerial++;handController?.abort(Error('Référence de main annulée'));handController=null;
 hand?.dispose();hand=null;renderer?.renderLists.dispose();
 $('hand-load').disabled=false;$('hand-unload').disabled=true;$('hand-load-status').textContent='Référence de main libérée.';scheduleRender();
}
async function loadHand(){
 if(hand||handController)return;unloadBrain();const serial=++handSerial,controller=new AbortController();handController=controller;
 $('hand-load').disabled=true;$('hand-unload').disabled=false;$('hand-load-status').textContent='Vérification de la main BodyParts3D et de ses buffers…';
 try{
  const source=await readHandReference({signal:controller.signal});if(serial!==handSerial)return;
  const candidate=await createHandMusclesReference({sourceData:source,signal:controller.signal,bodyScene:scene,uniforms:rig.uniforms,
   host:$('regional-hand-host'),controlsHost:$('regional-hand-controls'),stage:$('regional-stage'),organView:detailedInspector,
   getView:()=>({target:target.toArray(),zoom:distance,pitch:elevation,angle:azimuth}),
   focus:view=>{target.set(...view.target);distance=view.zoom;elevation=view.pitch;azimuth=view.angle;updateCamera();},
   beforeOpen:()=>{eyeLight?.close(false);nativeEye?.close(false);restPose();},
   beforeFocus:()=>{eyeLight?.close(false);nativeEye?.close(false);inspector.close();detailedInspector.close();restPose();},
   isReferenceHidden:()=>Boolean(inspector.info().scope||nativeEye?.active||eyeLight?.active),onChange:scheduleRender});
  if(serial!==handSerial){candidate.dispose();return;}hand=candidate;
  $('hand-load-status').textContent='76 pièces BodyParts3D distinctes. Borne de buffers géométriques : '+fmt(source.plan.bufferUpperBound)+' octets, hors JSON, objets, temporaires et GPU. Aucun pilote nerveux régional n’est raccordé ; associations documentaires seulement.';
  hand.open();$('regional-nmj-load').disabled=false;$('regional-nmj-status').textContent='Guide qualitatif disponible à la demande ; aucune jonction localisée.';scheduleRender();
 }catch(error){if(serial===handSerial){$('hand-load-status').textContent='Main refusée : '+error.message;$('hand-unload').disabled=true;}}
 finally{if(serial===handSerial){handController=null;$('hand-load').disabled=Boolean(hand);}}
}
async function loadNeuromuscular(){
 if(!hand||neuromuscular||nmjController)return;const reference=hand,serial=++nmjSerial,controller=new AbortController();nmjController=controller;$('regional-nmj-load').disabled=true;
 const timer=setTimeout(()=>controller.abort(),30000);
 try{const sourceData=await readNeuromuscularGuide({signal:controller.signal});
  if(serial!==nmjSerial||hand!==reference||controller.signal.aborted)return;
  const candidate=await createNeuromuscularGuide({scene,uniforms:rig.uniforms,handMuscles:reference,sourceData,signal:controller.signal,onChange:scheduleRender});
  if(serial!==nmjSerial||hand!==reference){candidate.dispose();return;}neuromuscular=candidate;neuromuscular.open();$('regional-nmj-status').textContent='Guide de culture humaine, horloge pédagogique séparée ; aucune force ou jonction de main calculée.';scheduleRender();
 }catch(e){if(serial===nmjSerial)$('regional-nmj-status').textContent='Guide refusé : '+e.message;}finally{clearTimeout(timer);if(serial===nmjSerial){nmjController=null;$('regional-nmj-load').disabled=Boolean(neuromuscular)||!hand;}}
}
function unloadBrain(){
 unloadRecovered();
 brainSerial++;brainController?.abort(Error('Atlas cérébral annulé'));brainController=null;
 brain?.dispose();brain=null;$('regional-recovered-load').disabled=true;renderer?.renderLists.dispose();
 $('brain-load').disabled=false;$('brain-unload').disabled=true;
 $('brain-load-status').textContent='Atlas CerebrA libéré. Les blocs HRA restent indépendants.';
 scheduleRender();
}
async function loadBrain(){
 if(brain||brainController)return;unloadHand();
 const serial=++brainSerial,controller=new AbortController();brainController=controller;
 $('brain-load').disabled=true;$('brain-unload').disabled=false;$('brain-load-status').textContent='Vérification de CerebrA et de son budget de buffers…';
 try{
  const source=await readCerebraSource({signal:controller.signal,maxBufferBytes:Number($('brain-budget').value)});if(serial!==brainSerial)return;
  const candidate=await createBrainAtlas({scene,getMeshes:()=>adapter.listSourceIndices().map(id=>adapter.sources.resolve(id)),
   nativeCatalogueCount:records.filter(r=>r.path.includes('Allen_brain')).length,sourceData:source,signal:controller.signal,maxBufferBytes:Number($('brain-budget').value),uniforms:rig.uniforms,
   getCamera:()=>({target:target.toArray(),zoom:distance,pitch:elevation,angle:azimuth}),
   setCamera:view=>{if(view.target)target.set(...view.target);if(view.zoom!==undefined)distance=view.zoom;if(view.pitch!==undefined)elevation=view.pitch;if(view.angle!==undefined)azimuth=view.angle;updateCamera();},
   beforeFocus:()=>{eyeLight?.close(false);nativeEye?.close(false);inspector.close();detailedInspector?.close();refreshStructures();restPose();},
   isNervousVisible:()=>true,onChange:scheduleRender});
  if(serial!==brainSerial){candidate.dispose();return;}brain=candidate;$('regional-recovered-load').disabled=false;
  $('brain-load-status').textContent='CerebrA : 17 surfaces · '+fmt(source.plan.bufferBytes)+' octets de buffers CPU propres estimés, hors cache HRA, objets, temporaires et GPU. Référence distincte ; aucun recalage individuel.';
  scheduleRender();
 }catch(error){if(serial===brainSerial){$('brain-load-status').textContent='CerebrA refusé : '+error.message;$('brain-unload').disabled=true;}}
 finally{if(serial===brainSerial){brainController=null;$('brain-load').disabled=Boolean(brain);}}
}
function createGraphicEye(){
 eyeLight=createEyeLight({scene,getMeshes:()=>adapter.listSourceIndices().map(id=>adapter.sources.resolve(id)),organView:detailedInspector,
  stage:$('regional-stage'),compatible:()=>!failedContext&&!playing,
  beforeOpen:()=>{
   brain?.focus(false);nativeEye?.close(false);inspector.close();if(detailedInspector.active)detailedInspector.close();refreshStructures();restPose();
   const saved={selectedIndex,networkReading:network?.state.reading??false};if(network){network.state.reading=false;$('network-reading').textContent='Lire les chaînes';}return saved;
  },
  onStop:(saved,restore)=>{
   if(saved&&network){network.state.reading=saved.networkReading;$('network-reading').textContent=network.state.reading?'Figer les chaînes':'Lire les chaînes';}
   if(restore&&saved?.selectedIndex!==null&&adapter.sources.resolve(saved?.selectedIndex))selectSource(saved.selectedIndex);
   scheduleRender();
  },onChange:scheduleRender,
  focus:view=>{target.set(...view.target);distance=view.zoom;elevation=view.pitch;azimuth=view.angle;updateCamera();}});
}
function createNativeEye(){
 const required=[[358,'VH_M_cornea_R'],[350,'VH_M_lens_R'],[336,'VH_M_retina_R']];
 const sourceIds=required.map(([node,name])=>records.find(r=>r.node===node&&r.name===name)?.source_index);
 nativeEye=mountNativeEyeContext({host:$('native-eye-host'),meta:sourceMeta,regional:true,
  getMeshes:()=>adapter.listSourceIndices().map(id=>adapter.sources.resolve(id)),
  allowed:inProgress=>!failedContext&&!playing&&!eyeLight?.active&&!brain?.focused&&!inspector.info().scope&&!detailedInspector?.active&&
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
  hand_reference:hand?{namespace:'hand',parts:hand.meshes.length,preview:hand.previewDiagnostics,buffer_bytes:hand.bufferBytes,planned_buffer_upper_bound:hand.plan.bufferUpperBound,side:hand.state.side,filter:hand.state.filter,selected:'hand:'+hand.state.selected,overlay:hand.bodyGroup.visible}:null,cerebra:brain?{regions:brain.meshes.length,buffer_bytes:brain.bufferBytes,planned_buffer_bytes:brain.plan.bufferBytes,focused:brain.focused,source:brain.source,split:brain.split,selection:brain.selection,saved_native_materials:brain.savedMaterialCount}:null,runtime_geometry_audit:auditSceneGeometryIds(scene),cache:store.info(),scene:adapter.diagnostics(),inspection:inspector.info(),selected_material:selectedIndex===null?null:(()=>{const m=adapter.sources.resolve(selectedIndex)?.material;return m?{uuid:m.uuid,opacity:m.opacity,transparent:m.transparent,depthWrite:m.depthWrite}:null})(),graphic_eye:eyeLight?{active:eyeLight.active,playing:eyeLight.playing,phase:eyeLight.phase,last_stop_reason:eyeLight.lastStopReason,saved_materials:eyeLight.savedMaterialCount}:null,native_eye_active:nativeEye?.active??false,eye_mask_size:eyeMask.size,detailed_inspection:{active:detailedInspector?.active??false,group_id:detailedInspector?.groupId??null},
  recovered:recovered?{active:recovered.active,playing:recovered.playing,progress:recovered.progress,group:recovered.current?.id??null,interval:recovered.action?.id??null,point:recovered.point,groups:recovered.catalog.groups.length,intervals:recovered.inventory.intervals}:null,cogitate:cogitate?{active:cogitate.active,index:cogitate.index,boards:cogitate.group.children.length}:null,human_nerves:humanNerves?{routes:humanNerves.data.routes.length,itineraries:humanNerves.itineraries.length,buffer_bytes:humanNerves.bufferBytes,current_route:humanNerves.current?.id,mode:humanNerves.state.mode,playing:humanNerves.state.playing,time:humanNerves.state.time,index:humanNerves.state.index,finished:humanNerves.state.finished,visible_routes:humanNerves.state.visibleRoutes,itinerary:humanNerves.state.itinerary?.id??null,pilot:nervePilot?.state.pilot,pilot_enabled:nervePilot?.state.enabled,electrical:nerveExcitability?{...nerveExcitability.state}:null,enteric:entericInhibition?{...entericInhibition.state}:null}:null,neuromuscular:neuromuscular?{playing:neuromuscular.state.playing,graphic_time_s:neuromuscular.state.time,step:neuromuscular.state.step,mode:neuromuscular.state.mode,finished:neuromuscular.state.finished,halo_visible:neuromuscular.halo.visible,biological_timing:neuromuscular.data.biological_timing}:null,generic_heart:genericHeart?.info()??null,documentary:documentary?.info()??null,view:{distance,azimuth,elevation,target:target.toArray(),camera:camera.position.toArray()},view_history_size:cameraHistory.size,manual_posture:{mode:manualMode,playing:manualPlaying,graphic_time_s:manualTime,saved_view:Boolean(manualView),root_shift:{...rig.uniforms.rootShift.value},shoulder:{...rig.uniforms.eatShoulder.value},forearm:{...rig.uniforms.eatForearm.value}},selective_occlusion:{requested:$('region-occlusion').checked,available:maskAvailable(),...residentMask.info()},functional_network:network?{coverage:network.coverage,enabled:network.state.enabled,active:[...network.active],visible_segments:network.routeViews.filter(v=>network.group.visible&&v.line.visible||network.group.visible&&v.beam?.visible).length}:null,context_lost:failedContext,rendered_frames:renderedFrames,
  cpu_render_submission_ms:{count:sorted.length,p50:sorted.length?sorted[Math.floor((sorted.length-1)*.5)]:null,
   p95:sorted.length?sorted[Math.floor((sorted.length-1)*.95)]:null},
  recent_cpu_pick_ms:[...pickSamples],recent_loads:loadSamples.map(x=>({...x})),three_geometries:renderer.info.memory.geometries,
  draw_calls:renderer.info.render.calls,
  limits:['CPU submission duration only; no GPU timing or physical GPU memory',
   'Cache bytes exclude transient buffers, metadata, CPU proxies and renderer resources',
   'No battery, thermal or biomechanical measurement; emulation is not a physical phone']};
}
function createDocumentary(){
 genericHeart?.dispose();genericHeart=null;documentary?.dispose();
 documentary=mountRegionalDocumentary({host:$('regional-documentary-host'),records,source:manifest.source,
  getResidents:()=>adapter?.listSourceIndices()??[],getView:()=>({target:target.toArray(),distance,azimuth,elevation}),
  setView:view=>{target.fromArray(view.target);({distance,azimuth,elevation}=view);cameraHistory.clear();updateCamera();},
  pauseScene:()=>{restPose();if(network){network.state.reading=false;$('network-reading').textContent='Lire les chaînes';}},
  canFocus:()=>!failedContext&&!specialView(),onContextChange:()=>genericHeart?.refresh()});
 genericHeart=mountRegionalGenericHeart({host:$('regional-generic-heart-host'),meta:sourceMeta,
  getContext:()=>documentary?.info().context,getResidents:()=>adapter.listSourceIndices(),pauseReading:()=>documentary.pause(),
  allowed:()=>!failedContext&&!playing&&manualMode==='stand'&&isNeutralRig(rig.uniforms)&&!specialView(),
  begin:ids=>{documentary.pause();restPose();if(network){network.state.reading=false;$('network-reading').textContent='Lire les chaînes';}
   const saved={selectedIndex,target:target.toArray(),distance,azimuth,elevation};
   selectSource(ids[0]);inspector.open(ids[0],{group:'VH_M_heart'});refreshStructures();const bounds=new THREE.Box3();for(const id of ids){const [lo,hi]=adapter.sourceInfo(id).bounds;bounds.expandByPoint(new THREE.Vector3(...lo));bounds.expandByPoint(new THREE.Vector3(...hi));}target.copy(bounds.getCenter(new THREE.Vector3()));distance=Math.max(.55,bounds.getSize(new THREE.Vector3()).length()*2.8);elevation=.08;azimuth=0;cameraHistory.clear();updateCamera();return saved;},
  setMode:(mode,ids)=>{if(mode==='body')inspector.close();else inspector.open(ids[0],{group:'VH_M_heart'});refreshStructures();scheduleRender();},
  end:(saved,restore)=>{inspector.close();if(restore&&saved){selectSource(saved.selectedIndex);target.fromArray(saved.target);({distance,azimuth,elevation}=saved);updateCamera();}refreshStructures();scheduleRender();}
 });
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
  const text=await verifySourceText(bytes,'e197f3858caba850b16110c96516b2bc779b02225fd49d28745184691222b477');
  if(serial!==networkSerial)return;
  const candidate=await createWalkingNetwork({scene,camera,getMeshes:()=>adapter.listSourceIndices().map(id=>adapter.sources.resolve(id)),
   records,residentOnly:true,sourceData:JSON.parse(text),uniforms:rig.uniforms,stage:$('regional-stage')});
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
function restPose(){pauseMotion();endManual();rig.reset();elapsed=0;$('motion-phase').value='0';motionText('Repos');}
async function loadMotion(){
 try{
  const response=await fetch('../data/walk.json');
  if(!response.ok)throw Error('Cinématique indisponible');
  const bytes=new Uint8Array(await response.arrayBuffer());
  if(await sha256Bytes(bytes)!=='b22455ced299545f9fe2aa95e14153952b02db864eef218a208604db44eff5fb')throw Error('Cinématique source altérée');
  sampler=createWalkSampler(JSON.parse(new TextDecoder().decode(bytes)),motionScale);
  postureUI();
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
 if(selectedIndex===null)return;brain?.focus(false);eyeLight?.close(false);nativeEye?.close(false);
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
  startupMark('manifest:fetch');const res=await fetch(manifestURL,{cache:'no-store'});
  if(!res.ok)throw Error('Manifeste expérimental indisponible (HTTP '+res.status+')');
  startupMark('manifest:parse');manifest=validateChunkManifest(await res.json());
  startupMark('catalogue:fetch');const packed=await fetch('../models/body-display.json.gz');
  if(!packed.ok)throw Error('Catalogue source indisponible');
  startupMark('catalogue:body');const packedBytes=new Uint8Array(await packed.arrayBuffer());startupMark('catalogue:decompress');const bytes=await readGzipBounded(packedBytes,427196);startupMark('catalogue:digest');
  if(await sha256Bytes(bytes)!==manifest.source.metadata_sha256)throw Error('Catalogue source altéré');
  startupMark('catalogue:parse');const meta=JSON.parse(new TextDecoder().decode(bytes));sourceMeta=meta;
  records=meta.structures.map((r,i)=>sourceMeshData(r,{sourceIndex:i,system:atlasSystem(r)}));
  catalogueAccess=createSourceAccess(()=>records.map(userData=>({userData})));
  motionScale=meta.normalization.scale;
  startupMark('scene:create');scene=new THREE.Scene();scene.background=new THREE.Color(0x092231);
  camera=new THREE.PerspectiveCamera(42,1,.01,120);
  target=new THREE.Vector3(0,1.75,0);
  scene.add(new THREE.HemisphereLight(0xc6e4ed,0x26354b,2.2));
  const light=new THREE.DirectionalLight(0xffe5c8,2.7);light.position.set(5,8,6);scene.add(light);
  startupMark('renderer:create');renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'low-power'});
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
  $('clear').onclick=()=>{unloadHand();unloadBrain();restPose();invalidatePending();store.clear();selectedIndex=null;selectedUI(null);refreshStructures();fillBlocks();status('Tous les blocs libérés.');scheduleRender()};
  structure.onchange=()=>{if(structure.value)selectSource(Number(structure.value))};
  $('source-search').oninput=refreshSearch;
  $('focus').onclick=()=>{restPose();focusSelected()};$('reset').onclick=()=>{restPose();resetCamera()};
  $('regional-activity').onchange=()=>chooseManual($('regional-activity').value);
  $('regional-pose-time').oninput=()=>{if(!['run','eat'].includes(manualMode)||postureBlocked())return;pauseManual();manualTime=Number($('regional-pose-time').value);historicalPosture.apply(manualMode,manualTime);scheduleRender();};
  $('regional-pose-play').onclick=()=>{if(manualPlaying){pauseManual();return;}if(!['run','eat'].includes(manualMode)||postureBlocked()||!adapter.listSourceIndices().length)return;if(manualTime>=6)manualTime=0;manualPlaying=true;lastFrame=null;$('regional-pose-play').textContent='Pause du geste';scheduleRender();};
  $('regional-pose-focus').onclick=focusPosedSelection;
  $('region-orientation').onchange=()=>{if(specialView()||failedContext||!$('region-orientation').value)return;const current={target:target.toArray(),distance,azimuth,elevation},next=orientedCamera(current,$('region-orientation').value);cameraHistory.push(current);({distance,azimuth,elevation}=next);$('region-orientation').value='';updateCamera();};
  $('region-view-back').onclick=()=>{if(specialView()||failedContext)return;const previous=cameraHistory.pop();if(!previous)return;target.fromArray(previous.target);({distance,azimuth,elevation}=previous);updateCamera();};
  $('region-occlusion').onchange=()=>{residentMask.clear();scheduleRender();};
  inspector=createResidentInspector({records,getMeshes:()=>adapter.listSourceIndices().map(id=>adapter.sources.resolve(id))});
  createDetailedInspector();createNativeEye();createGraphicEye();
  $('detailed-inspect').onclick=()=>{if(selectedIndex!==null){brain?.focus(false);eyeLight?.close(false);nativeEye?.close(false);inspector.close();refreshStructures();restPose();detailedInspector.inspect(adapter.sources.resolve(selectedIndex));}};
  $('organ-catalog').addEventListener('change',()=>{brain?.focus(false);eyeLight?.close(false);nativeEye?.close(false);inspector.close();refreshStructures();restPose();},{capture:true});
  $('search-scope').onchange=refreshSearch;
  $('inspect').onclick=()=>openInspection(false);
  $('isolate-source').onclick=()=>openInspection(true);
  $('load-inspection').onclick=loadInspection;$('brain-load').onclick=loadBrain;$('brain-unload').onclick=unloadBrain;$('brain-budget').onchange=unloadBrain;$('hand-load').onclick=loadHand;$('hand-unload').onclick=unloadHand;$('regional-nmj-load').onclick=loadNeuromuscular;$('regional-nerves-load').onclick=loadNerves;$('regional-nerves-unload').onclick=unloadNerves;$('regional-cogitate-load').onclick=loadCogitate;$('regional-cogitate-unload').onclick=unloadCogitate;$('regional-recovered-load').onclick=loadRecovered;$('regional-recovered-unload').onclick=unloadRecovered;
  $('close-inspection').onclick=()=>{inspector.close();refreshStructures();scheduleRender()};
  $('motion-phase').oninput=()=>{endManual();pauseMotion();sampler.apply(elapsed=Number($('motion-phase').value),rig.uniforms);scheduleRender()};
  $('motion-rest').onclick=()=>{restPose();scheduleRender()};
  $('motion-play').onclick=()=>{if(playing)pauseMotion();else if(!failedContext&&adapter.listSourceIndices().length){endManual();playing=true;lastFrame=null;$('motion-play').textContent='Pause';motionText('Lecture de la marche');scheduleRender()}};
  startupMark('controls:create');newStore();bindPointer();resetCamera();createDocumentary();
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
  window.addEventListener('pagehide',()=>{unloadCogitate();unloadNerves();genericHeart?.dispose();genericHeart=null;documentary?.dispose();documentary=null;endManual(false);cameraHistory.clear();residentMask.clear();unloadHand();unloadBrain();pauseMotion();eyeLight?.dispose();eyeLight=null;nativeEye?.dispose();nativeEye=null;releaseNetwork();detailedInspector?.dispose();detailedInspector=null;invalidatePending();inspector.close();store.clear();adapter.dispose();renderer.dispose();});
  window.addEventListener('pageshow',e=>{if(e.persisted){
   renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'low-power'});renderer.outputColorSpace=THREE.SRGBColorSpace;
   failedContext=false;createDocumentary();createDetailedInspector();createNativeEye();createGraphicEye();refreshStructures();fillBlocks();loadNetwork();scheduleRender();
  }});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){recovered?.pause();if(recoveredController)unloadRecovered();if(cogitateController)unloadCogitate();humanNerves?.pause();nerveExcitability?.pause();entericInhibition?.pause();if(nervesController)unloadNerves();neuromuscular?.pause();nmjSerial++;nmjController?.abort();nmjController=null;genericHeart?.suspend();documentary?.suspend();pauseMotion();pauseManual();eyeLight?.pause();}else{$('regional-nmj-load').disabled=!hand||Boolean(neuromuscular);scheduleRender()}});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();failedContext=true;unloadCogitate();unloadNerves();genericHeart?.suspend();documentary?.suspend();cameraHistory.clear();residentMask.clear();unloadHand();unloadBrain();eyeLight?.close(false);pauseMotion();pauseManual();navigationUI();if(network){network.state.reading=false;$('network-reading').textContent='Lire les chaînes';}invalidatePending();status('Contexte WebGL perdu. Rendu suspendu ; les données restent séparées.',true)});
  canvas.addEventListener('webglcontextrestored',()=>{failedContext=false;status('Contexte WebGL rétabli. Vérifier le rendu.');scheduleRender()});
  startupMark('ready');$('loading').hidden=true;$('app').hidden=false;fillBlocks();scheduleRender();
  status('Manifeste vérifié : '+manifest.chunk_count+' blocs disponibles. Aucun bloc chargé.');
 }catch(e){
  startupError=e.message;startupTrace.push({stage:'failed',failed_stage:startupStage,elapsed_ms:performance.now()-startupStarted});$('loading').setAttribute('role','alert');
  $('loading').textContent='Laboratoire non disponible : '+e.message+'. Aucun maillage ne sera affiché sans source contrôlée. Utiliser le mode léger.';
 }
}
start();
