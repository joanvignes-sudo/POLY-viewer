import * as THREE from './vendor/three.module.js?v=audit-o-1';
import {fetchBoundedBytes} from './bounded-fetch.mjs';
import {validateReferenceManifest,readReferenceCatalogue,browserReferenceBytes} from './reference-source-reader.mjs';
import {createAttachmentPanel} from './attachment-panel.mjs?v=141-1';
import {auditSceneGeometryIds} from './three-resource-audit.mjs';
import {referenceRelations} from './reference-catalogue-relations.mjs';
import {planReferenceSelection,loadReferenceSelection} from './reference-selection.mjs';
import {createReferenceNervePanel} from './reference-nerve-documentation.mjs';
import {REFERENCE_BOOKMARK_KEY,validateReferenceBookmark} from './reference-view-bookmark.mjs';
const $=id=>document.getElementById(id),root=new URL('../data/reference-chunks-preview/',import.meta.url),readBytes=browserReferenceBytes(root);
const canvas=$('reference-canvas'),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.001,100000);
scene.background=new THREE.Color(0x092231);scene.add(new THREE.HemisphereLight(0xd3e8ef,0x273346,2.2));
const light=new THREE.DirectionalLight(0xffe5d1,2.6);light.position.set(5,8,6);scene.add(light);
let manifest,catalogue,records=[],visibleRows=35,chunk=null,mesh=null,selectedKey=null,renderer=null,pending=null,serial=0,failedContext=false,renderPending=false,qualification=null,startup=null,metadataSerial=0;
let center=new THREE.Vector3(),radius=1,distance=3,azimuth=1.25,elevation=.15;
let documentationGeneration=0,displayGeneration=0,residentBlocks=[],contextMeshes=[],nerveDocumentation=null;
const fmt=n=>Number(n).toLocaleString('fr-FR');
function status(text,error=false){$('reference-status').textContent=text;$('reference-status').dataset.error=String(error);}
function draw(){
 if(!renderer||failedContext||document.hidden||renderPending)return;renderPending=true;
 requestAnimationFrame(()=>{renderPending=false;if(!renderer||failedContext||renderer.getContext().isContextLost())return;
  const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,matchMedia('(pointer:coarse)').matches?1:1.5);
  if(renderer.getPixelRatio()!==dpr)renderer.setPixelRatio(dpr);
  const w=Math.max(1,Math.round(rect.width)),h=Math.max(1,Math.round(rect.height));
  if(canvas.width!==Math.floor(w*dpr)||canvas.height!==Math.floor(h*dpr))renderer.setSize(w,h,false);
  camera.aspect=w/h;camera.near=Math.max(.000001,radius/10000);camera.far=Math.max(1,radius*1000);camera.updateProjectionMatrix();
  const c=Math.cos(elevation);camera.position.set(center.x+distance*c*Math.sin(azimuth),center.y+distance*Math.sin(elevation),center.z+distance*c*Math.cos(azimuth));camera.lookAt(center);
  try{renderer.render(scene,camera);}catch(error){if(!renderer.getContext().isContextLost())throw error;}
  $('reference-stat').textContent=mesh?fmt(1+contextMeshes.length)+' pièce(s) chargée(s) · '+fmt([mesh,...contextMeshes].reduce((n,m)=>n+m.geometry.index.count/3,0))+' triangles · '+fmt(renderer.info.memory.geometries)+' géométries suivies par Three.js.':'0 pièce affichée.';
 });
}
function diagnostics(){return {schema:'poly.reference-part-preview.v1',selected_key:selectedKey,block:chunk?.id??null,
 resident_raw_bytes:residentBlocks.reduce((n,b)=>n+b.rawBytes,0),resident_blocks:residentBlocks.map(b=>b.id),context_keys:contextMeshes.map(m=>m.userData.referenceKey),capacity_raw_bytes:4194304,metadata_raw_bytes:manifest?.catalogue.raw_bytes??null,
 display_buffer_bytes:mesh?[mesh,...contextMeshes].reduce((n,m)=>n+m.geometry.attributes.position.array.byteLength+m.geometry.attributes.normal.array.byteLength,0):0,
 meshes:mesh?1+contextMeshes.length:0,visible_meshes:[mesh,...contextMeshes].filter(m=>m?.visible).length,webgl_initialized:Boolean(renderer),geometries:renderer?.info.memory.geometries??0,context_lost:failedContext,
 view:{distance,azimuth,elevation},pixel_ratio:renderer?.getPixelRatio()??null,source_raw_sha256:manifest?.source_raw_sha256??null,geometry_ids:auditSceneGeometryIds(scene)};}
function release(){
 documentationGeneration++;
 displayGeneration++;$('reference-context-label').hidden=true;
 nerveDocumentation?.dispose();nerveDocumentation=null;
 serial++;pending?.abort(Error('Reference selection cancelled'));pending=null;
 for(const m of [mesh,...contextMeshes].filter(Boolean)){scene.remove(m);m.geometry.dispose();m.material.dispose();}mesh=null;contextMeshes=[];residentBlocks=[];
 chunk=null;selectedKey=null;pointers.clear();drag=null;pinch=null;renderer?.renderLists.dispose();qualification?.dispose();qualification=null;$('reference-qualification').hidden=true;
 $('reference-selected').textContent='Aucune pièce chargée.';$('reference-loaded-pieces').replaceChildren();$('reference-documentation').replaceChildren();$('reference-documentation').hidden=true;$('reference-memory').textContent='0 octet géométrique résident ; le catalogue reste disponible.';draw();
}
function reset(){if(!mesh)return;const box=new THREE.Box3();for(const m of [mesh,...contextMeshes])box.expandByObject(m);const b=box.getBoundingSphere(new THREE.Sphere());center.copy(b.center);radius=Math.max(b.radius,.00001);distance=radius*3.2;azimuth=1.25;elevation=.15;draw();}
function makeMesh(entry){
 const geometry=new THREE.BufferGeometry();let material,candidate;
 try{const positions=new Float32Array(entry.positions);if(!positions.every(Number.isFinite))throw Error('Coordinate outside float32 display range');geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setIndex(new THREE.BufferAttribute(entry.indices,1));geometry.computeVertexNormals();
  material=new THREE.MeshStandardMaterial({color:entry.key.startsWith('bones/')?0xe4ddc8:0xb76c69,roughness:.65,side:THREE.DoubleSide});candidate=new THREE.Mesh(geometry,material);
 }catch(error){geometry.dispose();material?.dispose();throw error;}
 candidate.userData.referenceKey=entry.key;return candidate;
}
function show(selection){
 const candidates=[];
 try{for(const entry of selection.entries)candidates.push(makeMesh(entry));if(!renderer){renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'low-power'});renderer.outputColorSpace=THREE.SRGBColorSpace;}}
 catch(error){for(const m of candidates){m.geometry.dispose();m.material.dispose();}throw error;}
 for(const m of [mesh,...contextMeshes].filter(Boolean)){scene.remove(m);m.geometry.dispose();m.material.dispose();}
 [mesh,...contextMeshes]=candidates;for(const m of candidates)scene.add(m);residentBlocks=selection.blocks;
 const entry=selection.entries[0];chunk=selection.blocks.find(b=>b.entries.some(e=>e.key===entry.key));selectedKey=entry.key;renderer.renderLists.dispose();
 $('reference-context').checked=true;$('reference-context-label').hidden=!contextMeshes.length;
 const generation=++displayGeneration,loaded=$('reference-loaded-pieces');loaded.replaceChildren();
 for(const piece of selection.entries){const button=document.createElement('button');button.type='button';button.className='secondary';button.dataset.loadedReferenceKey=piece.key;button.textContent='Fiche de la pièce chargée : '+piece.metadata.name+' · '+piece.source_id;button.onclick=()=>{if(displayGeneration===generation)showDocumentation(piece.key)};loaded.append(button);}
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
 if(key.startsWith('parts/'))nerveDocumentation=createReferenceNervePanel(host,model.item);
}
async function select(key,savedView=null,keys=[key]){
 if(failedContext){status('Rendu suspendu : attendre la restauration du contexte.',true);return;}
 const request=++serial;pending?.abort(Error('Reference selection changed'));const controller=new AbortController();pending=controller;
 status('Vérification des blocs de la sélection…');
 try{
  const selection=await loadReferenceSelection(manifest,keys,{catalogue,readBytes,signal:controller.signal,resident:residentBlocks});
  if(request!==serial||failedContext)return;show(selection);
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
 const generation=++metadataSerial,controller=new AbortController();startup=controller;
 try{
  const bytes=await fetchBoundedBytes(new URL('MANIFEST.json',root),{maxBytes:512*1024,signal:controller.signal});
  const candidate=validateReferenceManifest(JSON.parse(new TextDecoder().decode(bytes))),inventory=await readReferenceCatalogue(candidate,{readBytes,signal:controller.signal});
  if(generation!==metadataSerial)return;manifest=candidate;catalogue=inventory;records=[];
  for(const collection of ['parts','bones'])catalogue.data[collection].forEach((metadata,i)=>records.push({key:collection+'/'+i,collection,metadata}));
  for(const value of [...new Set(records.map(r=>r.metadata.region).filter(v=>typeof v==='string'))].sort()){const option=document.createElement('option');option.value=value;option.textContent=value+' · champ source';$('reference-region').append(option);}
  $('reference-credit').textContent=(typeof catalogue.data.attribution==='string'?catalogue.data.attribution:JSON.stringify(catalogue.data.attribution))+' · Licence déclarée par la source : '+(typeof catalogue.data.license==='string'?catalogue.data.license:JSON.stringify(catalogue.data.license));
  $('loading').hidden=true;$('app').hidden=false;list();refreshBookmark();
 }catch(error){if(controller.signal.aborted||generation!==metadataSerial)return;$('loading').setAttribute('role','alert');$('loading').textContent='Référence locale indisponible : '+error.message+'. Aucun maillage ne sera créé sans bloc vérifié.';}
 finally{if(generation===metadataSerial)startup=null;}
}
$('reference-search').oninput=()=>list();$('reference-collection').onchange=()=>list();$('reference-side').onchange=()=>list();$('reference-region').onchange=()=>list();$('reference-more').onclick=()=>{visibleRows+=35;list(false)};
$('reference-context').onchange=()=>{for(const m of contextMeshes)m.visible=$('reference-context').checked;draw();};
$('reference-release').onclick=()=>{release();status('Bloc et ressources de la pièce libérés.')};$('reference-reset').onclick=reset;
function bookmark(){try{return validateReferenceBookmark(JSON.parse(localStorage.getItem(REFERENCE_BOOKMARK_KEY)),manifest?.source_raw_sha256,records.map(r=>r.key));}catch{return null;}}
function refreshBookmark(){$('reference-restore').disabled=!bookmark();}
$('reference-save').onclick=()=>{
 if(!mesh){status('Choisir une pièce avant de mémoriser sa vue.',true);return;}
 const value=validateReferenceBookmark({schema:REFERENCE_BOOKMARK_KEY,source_raw_sha256:manifest.source_raw_sha256,key:selectedKey,keys:[selectedKey,...contextMeshes.map(m=>m.userData.referenceKey)],view:{zoom_ratio:distance/radius,azimuth,elevation}},manifest.source_raw_sha256,records.map(r=>r.key));
 if(!value){status('Cette caméra ne peut pas être mémorisée.',true);return;}
 try{localStorage.setItem(REFERENCE_BOOKMARK_KEY,JSON.stringify(value));refreshBookmark();status('Identifiant et caméra mémorisés sur cet appareil.');}catch{status('Stockage local indisponible ; la vue reste consultable.',true);}
};
$('reference-restore').onclick=()=>{const saved=bookmark();refreshBookmark();if(saved)select(saved.key,saved.view,saved.keys??[saved.key]);else status('Vue absente, invalide ou issue d’une autre source.',true);};
$('reference-forget').onclick=()=>{try{localStorage.removeItem(REFERENCE_BOOKMARK_KEY);refreshBookmark();status('Vue mémorisée effacée.');}catch{status('Stockage local indisponible.',true);}};
window.addEventListener('storage',event=>{if(event.key===REFERENCE_BOOKMARK_KEY||event.key===null)refreshBookmark();});
const pointers=new Map();let drag=null,pinch=null;const span=()=>{const [a,b]=[...pointers.values()];return Math.hypot(a.x-b.x,a.y-b.y)};
canvas.onpointerdown=e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});canvas.setPointerCapture(e.pointerId);if(pointers.size===1)drag={x:e.clientX,y:e.clientY,azimuth,elevation};else{drag=null;if(pointers.size===2)pinch={span:Math.max(1,span()),distance}}};
canvas.onpointermove=e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pinch&&pointers.size===2)distance=Math.max(radius*.2,Math.min(radius*40,pinch.distance*pinch.span/Math.max(1,span())));else if(drag){azimuth=drag.azimuth-(e.clientX-drag.x)*.006;elevation=Math.max(-1.3,Math.min(1.3,drag.elevation+(e.clientY-drag.y)*.006));}draw();};
canvas.onpointerup=canvas.onpointercancel=e=>{pointers.delete(e.pointerId);drag=null;pinch=null;};
canvas.addEventListener('wheel',e=>{e.preventDefault();distance=Math.max(radius*.2,Math.min(radius*40,distance*Math.exp(e.deltaY*.001)));draw();},{passive:false});
canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();azimuth+=e.key==='ArrowLeft'?-.1:e.key==='ArrowRight'?.1:0;elevation=Math.max(-1.3,Math.min(1.3,elevation+(e.key==='ArrowUp'?.1:e.key==='ArrowDown'?-.1:0)));draw();}});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();failedContext=true;release();status('Contexte WebGL perdu ; bloc et pièce libérés.',true)});
canvas.addEventListener('webglcontextrestored',()=>{failedContext=false;status('Contexte rétabli. Choisir une pièce pour la recharger.');draw();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)draw();});
window.addEventListener('resize',draw);window.addEventListener('pagehide',()=>{metadataSerial++;startup?.abort();startup=null;release();renderer?.dispose();renderer=null;});window.addEventListener('pageshow',e=>{if(e.persisted){failedContext=false;if(!catalogue)start();else status('Catalogue conservé ; aucune pièce rechargée automatiquement.')}});
Object.defineProperty(window,'__polyReferencePartDiagnostics',{value:diagnostics});start();
