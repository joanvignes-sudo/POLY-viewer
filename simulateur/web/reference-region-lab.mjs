import * as THREE from './vendor/three.module.js?v=audit-o-1';
import {fetchBoundedBytes} from './bounded-fetch.mjs';
import {validateReferenceManifest,readReferenceCatalogue,browserReferenceBytes} from './reference-source-reader.mjs';
import {createAttachmentPanel} from './attachment-panel.mjs?v=141-1';
import {auditSceneGeometryIds} from './three-resource-audit.mjs';
import {referenceRelations} from './reference-catalogue-relations.mjs';
import {planReferenceSelection,loadReferenceSelection} from './reference-selection.mjs';
import {createReferenceNervePanel} from './reference-nerve-documentation.mjs';
import {loadReferencePosture,makeReferencePostureBase,writeReferencePosture,deformReferenceRoute} from './reference-posture.mjs';
import {startLoadDeadline} from './load-deadline.mjs';
import {REFERENCE_BOOKMARK_KEY,validateReferenceBookmark} from './reference-view-bookmark.mjs';
const $=id=>document.getElementById(id),root=new URL('../data/reference-chunks-preview/',import.meta.url),readBytes=browserReferenceBytes(root);
const canvas=$('reference-canvas'),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.001,100000);
scene.background=new THREE.Color(0x092231);scene.add(new THREE.HemisphereLight(0xd3e8ef,0x273346,2.2));
const light=new THREE.DirectionalLight(0xffe5d1,2.6);light.position.set(5,8,6);scene.add(light);
let manifest,catalogue,records=[],visibleRows=35,chunk=null,mesh=null,selectedKey=null,renderer=null,pending=null,serial=0,failedContext=false,renderPending=false,qualification=null,startup=null,metadataSerial=0;
let center=new THREE.Vector3(),radius=1,distance=3,azimuth=1.25,elevation=.15;
let documentationGeneration=0,displayGeneration=0,residentBlocks=[],contextMeshes=[],nerveDocumentation=null;
let metadataState={attempt:0,stage:'not_started',trace:[],error:null,failed_stage:null,elapsed_ms:0},metadataStarted=0;
let inspectedKey=null,savedCamera=null,tap=null;const raycaster=new THREE.Raycaster();
let posture=null,postureController=null,postureGeneration=0,playing=false,lastFrame=null,elapsed=0,posePhase=null,routeLine=null,activeRoute=null;
function allMeshes(){return [mesh,...contextMeshes].filter(Boolean);}
function pausePosture(){playing=false;lastFrame=null;$('reference-play').textContent='Lire la marche illustrative';}
function clearRoute(){if(routeLine){scene.remove(routeLine);routeLine.geometry.dispose();routeLine.material.dispose();routeLine=null;}activeRoute=null;draw();}
function updateRoute(){if(!routeLine||!activeRoute||!posture)return;const curve=new THREE.CatmullRomCurve3(activeRoute.points.map(p=>new THREE.Vector3(...p)),false,'centripetal');const points=curve.getPoints(64);const attr=routeLine.geometry.attributes.position;points.forEach((p,i)=>attr.setXYZ(i,...deformReferenceRoute(p.toArray(),activeRoute,posture.rig.uniforms)));attr.needsUpdate=true;routeLine.geometry.computeBoundingSphere();routeLine.computeLineDistances();}
function showRoute(route,sourceId){
 clearRoute();if(!route)return false;
 if($('reference-space').value!=='illustrative'||!posture||!allMeshes().some(m=>m.userData.entry.source_id===sourceId)){status('La courbe exige le repère illustratif et la pièce de cette fiche déjà chargée.',true);return false;}
 activeRoute=route;const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(65*3),3));routeLine=new THREE.Line(geometry,new THREE.LineDashedMaterial({color:0xf4ce8b,depthTest:false,dashSize:.022,gapSize:.012}));routeLine.renderOrder=31;scene.add(routeLine);updateRoute();draw();return true;
}
function updatePostureGeometry(){
 for(const m of allMeshes()){
  const entry=m.userData.entry,target=m.geometry.attributes.position.array;
  if(posture&&$('reference-space').value==='illustrative'){m.userData.postureBase??=makeReferencePostureBase(entry,catalogue.data,posture.fit);writeReferencePosture(m.userData.postureBase,target,entry.metadata,posture.rig.uniforms);}
  else{target.set(entry.positions);m.userData.postureBase=null;}
  m.geometry.attributes.position.needsUpdate=true;m.geometry.computeVertexNormals();m.geometry.computeBoundingSphere();m.geometry.computeBoundingBox();
 }
 updateRoute();
}
async function changeSpace(mode){
 pausePosture();clearRoute();nerveDocumentation?.hideRoute();clearInspection();const generation=++postureGeneration;postureController?.abort();postureController=null;
 $('reference-space').value=mode;for(const id of ['reference-phase','reference-play','reference-rest'])$(id).disabled=true;
 try{
  if(mode==='illustrative'){
   if(!posture){postureController=new AbortController();const candidate=await loadReferencePosture({signal:postureController.signal});if(generation!==postureGeneration)return false;posture=candidate;}
   if(generation!==postureGeneration)return false;posture.rig.reset();elapsed=0;posePhase=null;
   for(const id of ['reference-phase','reference-play','reference-rest'])$(id).disabled=false;
   $('reference-posture-status').textContent='Placement et rig historiques illustratifs. Correction géométrique par proxies ; aucune insertion, activité, force, conduction ni précision biomécanique validée. La phase règle uniquement la présentation.';
  }else{posePhase=null;$('reference-posture-status').textContent='Coordonnées source restaurées, sans déformation ni courbe HRA superposée.';}
  updatePostureGeometry();reset();return true;
 }catch(error){if(generation===postureGeneration){postureController?.abort();posture=null;$('reference-space').value='source';updatePostureGeometry();reset();$('reference-posture-status').textContent='Illustration refusée : '+error.message;}return false;}
 finally{if(generation===postureGeneration)postureController=null;}
}
$('reference-space').onchange=()=>changeSpace($('reference-space').value);
$('reference-phase').oninput=()=>{if(!posture||$('reference-space').value!=='illustrative')return;pausePosture();posePhase=elapsed=Number($('reference-phase').value);posture.sampler.apply(elapsed,posture.rig.uniforms);updatePostureGeometry();draw();};
$('reference-play').onclick=()=>{if(playing){pausePosture();return;}if(!posture||!mesh||$('reference-space').value!=='illustrative'||failedContext)return;playing=true;lastFrame=null;$('reference-play').textContent='Pause';draw();};
$('reference-rest').onclick=()=>{if(!posture)return;pausePosture();posture.rig.reset();elapsed=0;posePhase=null;$('reference-phase').value='0';updatePostureGeometry();draw();};
const fmt=n=>Number(n).toLocaleString('fr-FR');
function status(text,error=false){$('reference-status').textContent=text;$('reference-status').dataset.error=String(error);}
function draw(){
 if(!renderer||failedContext||document.hidden||renderPending)return;renderPending=true;
 requestAnimationFrame(now=>{renderPending=false;if(!renderer||failedContext||renderer.getContext().isContextLost())return;
  if(playing&&posture&&mesh){elapsed+=lastFrame===null?0:Math.min(.05,(now-lastFrame)/1000);lastFrame=now;posePhase=elapsed%posture.sampler.duration;posture.sampler.apply(elapsed,posture.rig.uniforms);$('reference-phase').value=String(posePhase);updatePostureGeometry();}
  const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,matchMedia('(pointer:coarse)').matches?1:1.5);
  if(renderer.getPixelRatio()!==dpr)renderer.setPixelRatio(dpr);
  const w=Math.max(1,Math.round(rect.width)),h=Math.max(1,Math.round(rect.height));
  if(canvas.width!==Math.floor(w*dpr)||canvas.height!==Math.floor(h*dpr))renderer.setSize(w,h,false);
  camera.aspect=w/h;camera.near=Math.max(.000001,radius/10000);camera.far=Math.max(1,radius*1000);camera.updateProjectionMatrix();
  const c=Math.cos(elevation);camera.position.set(center.x+distance*c*Math.sin(azimuth),center.y+distance*Math.sin(elevation),center.z+distance*c*Math.cos(azimuth));camera.lookAt(center);
  try{renderer.render(scene,camera);}catch(error){if(!renderer.getContext().isContextLost())throw error;}
  $('reference-stat').textContent=mesh?fmt(1+contextMeshes.length)+' pièce(s) chargée(s) · '+fmt([mesh,...contextMeshes].reduce((n,m)=>n+m.geometry.index.count/3,0))+' triangles · '+fmt(renderer.info.memory.geometries)+' géométries suivies par Three.js.':'0 pièce affichée.';
  if(playing)draw();
 });
}
function diagnostics(){return {schema:'poly.reference-part-preview.v1',selected_key:selectedKey,block:chunk?.id??null,
 metadata:{...metadataState,trace:metadataState.trace.map(item=>({...item})),elapsed_ms:startup?performance.now()-metadataStarted:metadataState.elapsed_ms},
 resident_raw_bytes:residentBlocks.reduce((n,b)=>n+b.rawBytes,0),resident_blocks:residentBlocks.map(b=>b.id),context_keys:contextMeshes.map(m=>m.userData.referenceKey),capacity_raw_bytes:4194304,metadata_raw_bytes:manifest?.catalogue.raw_bytes??null,
 display_buffer_bytes:allMeshes().reduce((n,m)=>n+m.geometry.attributes.position.array.byteLength+m.geometry.attributes.normal.array.byteLength+(m.userData.postureBase?.byteLength??0),0),
 posture:{mode:$('reference-space').value,playing,elapsed,source_sample:mesh?Array.from(mesh.userData.entry.positions.subarray(0,3)):null,display_sample:mesh?Array.from(mesh.geometry.attributes.position.array.subarray(0,3)):null,route:activeRoute?.id??null},
 meshes:mesh?1+contextMeshes.length:0,visible_meshes:[mesh,...contextMeshes].filter(m=>m?.visible).length,webgl_initialized:Boolean(renderer),geometries:renderer?.info.memory.geometries??0,context_lost:failedContext,
 inspected_key:inspectedKey,view:{distance,azimuth,elevation,target:center.toArray()},pixel_ratio:renderer?.getPixelRatio()??null,source_raw_sha256:manifest?.source_raw_sha256??null,geometry_ids:auditSceneGeometryIds(scene)};}
function release(){
 pausePosture();clearRoute();postureGeneration++;postureController?.abort();postureController=null;posture=null;elapsed=0;$('reference-space').value='source';for(const id of ['reference-phase','reference-play','reference-rest'])$(id).disabled=true;
 documentationGeneration++;
 displayGeneration++;$('reference-context-label').hidden=true;
 clearInspection();
 nerveDocumentation?.dispose();nerveDocumentation=null;
 serial++;pending?.abort(Error('Reference selection cancelled'));pending=null;
 for(const m of [mesh,...contextMeshes].filter(Boolean)){scene.remove(m);m.geometry.dispose();m.material.dispose();}mesh=null;contextMeshes=[];residentBlocks=[];
 chunk=null;selectedKey=null;pointers.clear();drag=null;pinch=null;renderer?.renderLists.dispose();qualification?.dispose();qualification=null;$('reference-qualification').hidden=true;
 $('reference-selected').textContent='Aucune pièce chargée.';$('reference-loaded-pieces').replaceChildren();$('reference-documentation').replaceChildren();$('reference-documentation').hidden=true;$('reference-memory').textContent='0 octet géométrique résident ; le catalogue reste disponible.';draw();
}
function reset(){if(!mesh)return;const box=new THREE.Box3();for(const m of [mesh,...contextMeshes])box.expandByObject(m);const b=box.getBoundingSphere(new THREE.Sphere());center.copy(b.center);radius=Math.max(b.radius,.00001);distance=radius*3.2;azimuth=1.25;elevation=.15;draw();}
function clearInspection(){inspectedKey=null;savedCamera=null;tap=null;$('reference-focus-hit').disabled=true;$('reference-back-view').disabled=true;$('reference-hit').textContent='Toucher une surface ouvre sa fiche sans charger de nouvelle pièce.';}
function inspectLoaded(key){
 const item=[mesh,...contextMeshes].find(m=>m?.visible&&m.userData.referenceKey===key);if(!item)return;
 inspectedKey=key;$('reference-focus-hit').disabled=false;$('reference-hit').textContent='Surface inspectée : '+key+' · '+item.userData.sourceName;showDocumentation(key);
}
function pickAt(x,y){
 if(!renderer||failedContext||!mesh)return;const rect=canvas.getBoundingClientRect();scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
 raycaster.setFromCamera(new THREE.Vector2((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1),camera);
 const hit=raycaster.intersectObjects([mesh,...contextMeshes].filter(m=>m.visible),false)[0];if(hit)inspectLoaded(hit.object.userData.referenceKey);
}
$('reference-focus-hit').onclick=()=>{
 const item=[mesh,...contextMeshes].find(m=>m?.visible&&m.userData.referenceKey===inspectedKey);if(!item)return;
 if(!savedCamera)savedCamera={target:center.toArray(),radius,distance,azimuth,elevation};
 const bounds=new THREE.Box3().setFromObject(item).getBoundingSphere(new THREE.Sphere());center.copy(bounds.center);radius=Math.max(bounds.radius,.00001);distance=radius*3.2;$('reference-back-view').disabled=false;draw();
};
$('reference-back-view').onclick=()=>{if(!savedCamera)return;center.fromArray(savedCamera.target);({radius,distance,azimuth,elevation}=savedCamera);savedCamera=null;$('reference-back-view').disabled=true;draw();};
function makeMesh(entry){
 const geometry=new THREE.BufferGeometry();let material,candidate;
 try{const positions=new Float32Array(entry.positions);if(!positions.every(Number.isFinite))throw Error('Coordinate outside float32 display range');geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setIndex(new THREE.BufferAttribute(entry.indices,1));geometry.computeVertexNormals();
  material=new THREE.MeshStandardMaterial({color:entry.key.startsWith('bones/')?0xe4ddc8:0xb76c69,roughness:.65,side:THREE.DoubleSide});candidate=new THREE.Mesh(geometry,material);
 }catch(error){geometry.dispose();material?.dispose();throw error;}
 candidate.userData.referenceKey=entry.key;candidate.userData.sourceName=entry.metadata.name;candidate.userData.entry=entry;
 try{if(posture&&$('reference-space').value==='illustrative'){candidate.userData.postureBase=makeReferencePostureBase(entry,catalogue.data,posture.fit);writeReferencePosture(candidate.userData.postureBase,geometry.attributes.position.array,entry.metadata,posture.rig.uniforms);geometry.computeVertexNormals();}}
 catch(error){geometry.dispose();material.dispose();throw error;}
 return candidate;
}
function show(selection){
 const candidates=[];
 try{for(const entry of selection.entries)candidates.push(makeMesh(entry));if(!renderer){renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'low-power'});renderer.outputColorSpace=THREE.SRGBColorSpace;}}
 catch(error){for(const m of candidates){m.geometry.dispose();m.material.dispose();}throw error;}
 for(const m of [mesh,...contextMeshes].filter(Boolean)){scene.remove(m);m.geometry.dispose();m.material.dispose();}
 [mesh,...contextMeshes]=candidates;for(const m of candidates)scene.add(m);residentBlocks=selection.blocks;
 clearInspection();
 const entry=selection.entries[0];chunk=selection.blocks.find(b=>b.entries.some(e=>e.key===entry.key));selectedKey=entry.key;renderer.renderLists.dispose();
 $('reference-context').checked=true;$('reference-context-label').hidden=!contextMeshes.length;
 const generation=++displayGeneration,loaded=$('reference-loaded-pieces');loaded.replaceChildren();
 for(const piece of selection.entries){const key=piece.key;const button=document.createElement('button');button.type='button';button.className='secondary';button.dataset.loadedReferenceKey=piece.key;button.textContent='Fiche de la pièce chargée : '+piece.metadata.name+' · '+piece.source_id;button.onclick=()=>{if(displayGeneration===generation)inspectLoaded(key)};loaded.append(button);}
 const host=$('reference-selected');host.replaceChildren();for(const text of [entry.metadata.name,'Source : '+entry.source_id+' · '+entry.json_pointer,
  'Positions float64 source : '+fmt(entry.positions.length/3)+' sommets · indices uint32 : '+fmt(entry.indices.length/3)+' triangles.',
  'Empreinte du fichier JSON source : '+manifest.source_raw_sha256,'Coordonnées numériques source ; unité et recalage individuels non inférés.']){const p=document.createElement('p');p.textContent=text;host.append(p);}
 qualification?.dispose();qualification=null;$('reference-qualification').hidden=!entry.key.startsWith('parts/');
 if(entry.key.startsWith('parts/')){qualification=createAttachmentPanel($('reference-qualification'),'body');qualification.show(entry.source_id);}
 showDocumentation(entry.key);$('reference-memory').textContent=fmt(selection.plan.rawBytes)+' / '+fmt(4194304)+' octets de blocs source résidents. '+fmt(selection.entries.length)+' pièce(s) affichée(s) ; les autres pièces des blocs ne sont pas affichées.';reset();
}
function showDocumentation(key){
 nerveDocumentation?.dispose();nerveDocumentation=null;
 const generation=++documentationGeneration,model=referenceRelations(catalogue.data,key),host=$('reference-documentation');host.replaceChildren();host.hidden=false;
 const text=value=>{if(value==null)return;const p=document.createElement('p');p.textContent=String(value);host.append(p);};
 const source=(url,label)=>{try{const u=new URL(url);if(!['https:','http:'].includes(u.protocol))return;const a=document.createElement('a');a.href=u.href;a.target='_blank';a.rel='noopener';a.textContent=label;host.append(a);}catch{}};
 const title=document.createElement('h3');title.textContent='Fiche documentaire : '+model.item.name;host.append(title);
 text('Identité du catalogue : '+key+' · '+model.item.id+'. Cette fiche ne change pas la pièce 3D affichée.');
 for(const field of ['relation_scope','attachments','geometry_provenance'])text(model.item[field]);
 source(model.item.source,'Source anatomique déclarée');
 text('Les liens ci-dessous remplacent la pièce affichée. Ils ne chargent pas un assemblage et ne localisent aucune insertion.');
 for(const relation of model.relations){text(relation.region);text(relation.scope);source(relation.source,'Source de la relation osseuse');}
 for(const row of model.links){const b=document.createElement('button');b.type='button';b.dataset.relatedReferenceKey=row.key;b.textContent='Consulter séparément : '+row.metadata.name;b.onclick=()=>{if(documentationGeneration===generation)select(row.key)};host.append(b);}
 if(!model.links.length)text('Aucune autre pièce résolue par une relation osseuse explicite et un côté source commun.');
 if(key.startsWith('parts/')&&model.links.length){const keys=[key,...model.links.map(r=>r.key)],b=document.createElement('button');b.type='button';b.dataset.referenceGroup=key;
  try{const plan=planReferenceSelection(manifest,keys);b.textContent='Afficher ensemble : muscle et os documentés · '+fmt(plan.rawBytes)+' octets source';b.onclick=()=>{if(documentationGeneration===generation)select(key,null,keys)};}
  catch{b.disabled=true;b.textContent='Groupe indisponible dans le budget de 4 Mio.';}host.append(b);
  text('Assemblage dans les coordonnées de cette référence source uniquement. Les régions d’attache documentaires ne deviennent pas des points d’insertion mesurés.');}

 if(model.opposite){const b=document.createElement('button');b.type='button';b.textContent='Pièce controlatérale explicitement liée : '+model.opposite.metadata.name;b.onclick=()=>{if(documentationGeneration===generation)select(model.opposite.key)};host.append(b);}
 if(model.observations.length){const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Observations humaines sources · sans application au maillage';details.append(summary);
  for(const observation of model.observations){const pre=document.createElement('pre');pre.style.whiteSpace='pre-wrap';pre.style.overflowWrap='anywhere';pre.textContent=JSON.stringify(observation,null,2);details.append(pre);}host.append(details);}
 if(model.interactions.length){const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Interactions humaines documentées · protocole distinct de la posture affichée';details.append(summary);for(const observation of model.interactions){const pre=document.createElement('pre');pre.style.whiteSpace='pre-wrap';pre.style.overflowWrap='anywhere';pre.textContent=JSON.stringify(observation,null,2);details.append(pre);}host.append(details);}
 const raw=document.createElement('details'),summary=document.createElement('summary'),pre=document.createElement('pre');summary.textContent='Tous les champs documentaires source de cette pièce';pre.style.whiteSpace='pre-wrap';pre.style.overflowWrap='anywhere';pre.textContent=JSON.stringify(model.item,null,2);raw.append(summary,pre);host.append(raw);
 if(key.startsWith('parts/'))nerveDocumentation=createReferenceNervePanel(host,model.item,{onRoute:showRoute});
}
async function select(key,savedView=null,keys=[key],focusKey=null){
 if(failedContext){status('Rendu suspendu : attendre la restauration du contexte.',true);return;}
 pausePosture();
 const request=++serial;pending?.abort(Error('Reference selection changed'));const controller=new AbortController();pending=controller;
 status('Vérification des blocs de la sélection…');
 try{
  const selection=await loadReferenceSelection(manifest,keys,{catalogue,readBytes,signal:controller.signal,resident:residentBlocks});
  if(request!==serial||failedContext)return;show(selection);
  if(focusKey){inspectLoaded(focusKey);$('reference-focus-hit').onclick();}
  if(savedView){distance=radius*savedView.zoom_ratio;azimuth=savedView.azimuth;elevation=savedView.elevation;draw();}
  status('Sélection vérifiée : '+fmt(selection.entries.length)+' pièce(s), '+fmt(selection.blocks.length)+' bloc(s).');
 }catch(error){if(request===serial)status('Pièce refusée : '+error.message,true);}
 finally{if(request===serial)pending=null;}
}
function selectButton(key){return ()=>select(key);}
function list(resetRows=true){
 if(resetRows)visibleRows=35;const q=$('reference-search').value.trim().toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,''),collection=$('reference-collection').value,side=$('reference-side').value;
 const region=$('reference-region').value;
 const filtered=records.filter(r=>(collection==='all'||r.collection===collection)&&(side==='all'||r.metadata.side===side)&&(region==='all'||(region==='__missing__'?r.metadata.region==null:r.metadata.region===region))&&(!q||[r.metadata.id,r.metadata.name,r.metadata.region??'',r.metadata.bone_family??''].join(' ').toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q)));
 $('reference-count').textContent=fmt(filtered.length)+' pièces du catalogue correspondent, sur 526.';const host=$('reference-results');host.replaceChildren();
 for(const r of filtered.slice(0,visibleRows)){const b=document.createElement('button');b.type='button';b.dataset.referenceKey=r.key;b.textContent=r.metadata.name+' · '+r.metadata.id+' · '+(r.metadata.side??'côté non renseigné');b.onclick=selectButton(r.key);const info=document.createElement('button');info.type='button';info.className='secondary';info.dataset.referenceInfo=r.key;info.textContent='Lire la fiche sans charger la 3D';info.onclick=()=>showDocumentation(r.key);host.append(b,info);}
 $('reference-more').hidden=visibleRows>=filtered.length;
}
async function start(){
 startup?.abort();$('loading').setAttribute('role','status');$('loading').textContent='Vérification du manifeste local…';$('reference-retry').hidden=false;
 const generation=++metadataSerial,controller=new AbortController();startup=controller;
 const deadline=startLoadDeadline(controller);metadataStarted=performance.now();metadataState={attempt:metadataState.attempt+1,stage:'manifest_fetch',trace:[{stage:'manifest_fetch',at_ms:0}],error:null,failed_stage:null,elapsed_ms:0,timeout_ms:30000};
 const mark=stage=>{if(generation!==metadataSerial)return;metadataState.stage=stage;metadataState.elapsed_ms=performance.now()-metadataStarted;metadataState.trace.push({stage,at_ms:metadataState.elapsed_ms});};
 try{
  const bytes=await fetchBoundedBytes(new URL('MANIFEST.json',root),{maxBytes:512*1024,signal:controller.signal});
  mark('manifest_validate');const candidate=validateReferenceManifest(JSON.parse(new TextDecoder().decode(bytes)));if(generation!==metadataSerial)return;$('loading').textContent='Manifeste vérifié. Lecture et contrôle du catalogue…';const inventory=await readReferenceCatalogue(candidate,{readBytes,signal:controller.signal,onStage:mark});
  if(generation!==metadataSerial)return;manifest=candidate;catalogue=inventory;records=[];
  for(const collection of ['parts','bones'])catalogue.data[collection].forEach((metadata,i)=>records.push({key:collection+'/'+i,collection,metadata}));
  for(const option of $('reference-region').querySelectorAll('option[data-source-region]'))option.remove();
  for(const value of [...new Set(records.map(r=>r.metadata.region).filter(v=>typeof v==='string'))].sort()){const option=document.createElement('option');option.dataset.sourceRegion='true';option.value=value;option.textContent=value+' · champ source';$('reference-region').append(option);}
  $('reference-credit').textContent=(typeof catalogue.data.attribution==='string'?catalogue.data.attribution:JSON.stringify(catalogue.data.attribution))+' · Licence déclarée par la source : '+(typeof catalogue.data.license==='string'?catalogue.data.license:JSON.stringify(catalogue.data.license));
  $('loading').hidden=true;$('reference-retry').hidden=true;$('app').hidden=false;list();refreshBookmark();mark('ready');
 }catch(error){
  if(generation!==metadataSerial||controller.signal.aborted&&!deadline.expired())return;
  metadataState.failed_stage=metadataState.stage;metadataState.error=error.message;mark(deadline.expired()?'timeout':'error');
  $('loading').setAttribute('role','alert');$('loading').textContent=deadline.expired()?'Le chargement a dépassé 30 secondes ; la demande a été interrompue. Vous pouvez relancer le catalogue. Aucun maillage créé.':'Référence locale indisponible : '+error.message+'. Aucun maillage ne sera créé sans bloc vérifié.';
 }
 finally{deadline.dispose();if(generation===metadataSerial)startup=null;}
}
$('reference-search').oninput=()=>list();$('reference-collection').onchange=()=>list();$('reference-side').onchange=()=>list();$('reference-region').onchange=()=>list();$('reference-more').onclick=()=>{visibleRows+=35;list(false)};
$('reference-retry').onclick=start;
$('reference-context').onchange=()=>{for(const m of contextMeshes)m.visible=$('reference-context').checked;draw();};
$('reference-release').onclick=()=>{release();status('Bloc et ressources de la pièce libérés.')};$('reference-reset').onclick=reset;
function bookmark(){try{return validateReferenceBookmark(JSON.parse(localStorage.getItem(REFERENCE_BOOKMARK_KEY)),manifest?.source_raw_sha256,records.map(r=>r.key));}catch{return null;}}
function refreshBookmark(){$('reference-restore').disabled=!bookmark();}
$('reference-save').onclick=()=>{
 if(!mesh){status('Choisir une pièce avant de mémoriser sa vue.',true);return;}
 const value=validateReferenceBookmark({schema:REFERENCE_BOOKMARK_KEY,source_raw_sha256:manifest.source_raw_sha256,key:selectedKey,keys:[selectedKey,...contextMeshes.map(m=>m.userData.referenceKey)],...(savedCamera&&inspectedKey?{focus_key:inspectedKey}:{}),display:{space:$('reference-space').value,phase:posePhase},view:{zoom_ratio:distance/radius,azimuth,elevation}},manifest.source_raw_sha256,records.map(r=>r.key));
 if(!value){status('Cette caméra ne peut pas être mémorisée.',true);return;}
 try{localStorage.setItem(REFERENCE_BOOKMARK_KEY,JSON.stringify(value));refreshBookmark();status('Identifiant et caméra mémorisés sur cet appareil.');}catch{status('Stockage local indisponible ; la vue reste consultable.',true);}
};
$('reference-restore').onclick=async()=>{
 const saved=bookmark();refreshBookmark();if(!saved){status('Vue absente, invalide ou issue d’une autre source.',true);return;}
 const request=++serial;pending?.abort();pending=null;
 if(!await changeSpace(saved.display?.space??'source'))return;
 if(request!==serial)return;
 if(posture&&saved.display?.space==='illustrative'&&saved.display.phase!==null){posePhase=elapsed=saved.display.phase;posture.sampler.apply(elapsed,posture.rig.uniforms);$('reference-phase').value=String(posePhase);}
 select(saved.key,saved.view,saved.keys??[saved.key],saved.focus_key??null);
};
$('reference-forget').onclick=()=>{try{localStorage.removeItem(REFERENCE_BOOKMARK_KEY);refreshBookmark();status('Vue mémorisée effacée.');}catch{status('Stockage local indisponible.',true);}};
window.addEventListener('storage',event=>{if(event.key===REFERENCE_BOOKMARK_KEY||event.key===null)refreshBookmark();});
const pointers=new Map();let drag=null,pinch=null;const span=()=>{const [a,b]=[...pointers.values()];return Math.hypot(a.x-b.x,a.y-b.y)};
canvas.onpointerdown=e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});canvas.setPointerCapture(e.pointerId);if(pointers.size===1){tap={id:e.pointerId,x:e.clientX,y:e.clientY};drag={x:e.clientX,y:e.clientY,azimuth,elevation};}else{tap=null;drag=null;if(pointers.size===2)pinch={span:Math.max(1,span()),distance}}};
canvas.onpointermove=e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pinch&&pointers.size===2)distance=Math.max(radius*.2,Math.min(radius*40,pinch.distance*pinch.span/Math.max(1,span())));else if(drag){azimuth=drag.azimuth-(e.clientX-drag.x)*.006;elevation=Math.max(-1.3,Math.min(1.3,drag.elevation+(e.clientY-drag.y)*.006));}draw();};
canvas.addEventListener('pointermove',e=>{if(tap&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>6)tap=null;});
canvas.onpointerup=e=>{const hit=tap?.id===e.pointerId&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<=6;pointers.delete(e.pointerId);drag=null;pinch=null;tap=null;if(hit)pickAt(e.clientX,e.clientY);};
canvas.onpointercancel=()=>{pointers.clear();drag=null;pinch=null;tap=null;};
canvas.addEventListener('wheel',e=>{e.preventDefault();distance=Math.max(radius*.2,Math.min(radius*40,distance*Math.exp(e.deltaY*.001)));draw();},{passive:false});
canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();azimuth+=e.key==='ArrowLeft'?-.1:e.key==='ArrowRight'?.1:0;elevation=Math.max(-1.3,Math.min(1.3,elevation+(e.key==='ArrowUp'?.1:e.key==='ArrowDown'?-.1:0)));draw();}});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();failedContext=true;release();status('Contexte WebGL perdu ; bloc et pièce libérés.',true)});
canvas.addEventListener('webglcontextrestored',()=>{failedContext=false;status('Contexte rétabli. Choisir une pièce pour la recharger.');draw();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pausePosture();else draw();});
window.addEventListener('resize',draw);window.addEventListener('pagehide',()=>{metadataSerial++;startup?.abort();startup=null;release();renderer?.dispose();renderer=null;});window.addEventListener('pageshow',e=>{if(e.persisted){failedContext=false;if(!catalogue)start();else status('Catalogue conservé ; aucune pièce rechargée automatiquement.')}});
Object.defineProperty(window,'__polyReferencePartDiagnostics',{value:diagnostics});start();
