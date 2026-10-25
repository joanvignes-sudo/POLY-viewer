import * as THREE from './vendor/three.module.js?v=audit-o-1';

const LANDMARKS = [
 {code:'promontory',label:'Promontoire : bord antérieur supérieur de S1',role:'fit',help:'Repérer le rebord antérieur saillant du corps S1 ; ne pas utiliser l’extrémité la plus antérieure du sacrum entier.'},
 {code:'S1_superior',label:'Plateau S1 : rebord postérieur médian',role:'fit',help:'Choisir un point du rebord supérieur du corps S1, précisément sur sa portion médiane postérieure.'},
 {code:'ala_L',label:'Aile sacrée anatomique gauche : sommet',role:'fit',help:'Identifier la surface supérieure de l’aile gauche, distincte du processus articulaire. Vérifier le côté anatomique.'},
 {code:'ala_R',label:'Aile sacrée anatomique droite : sommet',role:'fit',help:'Identifier la surface supérieure de l’aile droite, distincte du processus articulaire. Vérifier le côté anatomique.'},
 {code:'art_sup_L',label:'Processus articulaire supérieur gauche : milieu facette',role:'fit',help:'Repérer la surface articulaire S1 gauche avec L5. Le milieu de la facette est une zone, pas forcément un sommet osseux.'},
 {code:'art_sup_R',label:'Processus articulaire supérieur droit : milieu facette',role:'fit',help:'Repérer la surface articulaire S1 droite avec L5, sans confondre avec l’aile sacrée.'},
 {code:'canal',label:'Canal sacré : rebord postérieur supérieur',role:'fit',help:'Pointer sur l’os, au bord de l’ouverture supérieure du canal ; pas au centre du vide.'},
 {code:'apex',label:'Apex du sacrum : bord de la facette coccygienne',role:'fit',help:'Choisir le milieu du rebord articulaire inférieur avec le coccyx, sans le confondre avec le coccyx lui-même.'},
 {code:'hiatus',label:'Hiatus sacré : sommet du bord osseux',role:'holdout',help:'Choisir le rebord osseux supérieur du hiatus, ouverture postérieure inférieure du canal.'},
 {code:'crest',label:'Crête sacrée médiane : sommet S2/S3',role:'holdout',help:'Cibler un tubercule médian clairement visible et identifier son niveau ; ne pas prendre le centroïde global.'},
 {code:'foramen_L',label:'Premier foramen dorsal gauche : point supérieur du rebord',role:'holdout',help:'Cliquer le rebord osseux supérieur du premier foramen postérieur gauche (pas le trou vide).'},
 {code:'foramen_R',label:'Premier foramen dorsal droit : point supérieur du rebord',role:'holdout',help:'Cliquer le rebord osseux supérieur du premier foramen postérieur droit (pas le trou vide).'}
];

const $ = id => document.getElementById(id);
const state = {selected:'promontory',marks:{},view:{theta:0,phi:Math.PI/2,zoom:1},wire:false,scope:false,observer:'',notes:''};
for (const l of LANDMARKS)state.marks[l.code]={};
const viewports={},ray=new THREE.Raycaster(),clickClock=()=>Date.now();
let meshData,animating=false;
const angle=new THREE.Vector2(),pointer=new THREE.Vector2();
const inverseMul=(m,p)=>[0,1,2].map(r=>m[r][0]*p[0]+m[r][1]*p[1]+m[r][2]*p[2]+m[r][3]);
const fmt=p=>p?.poly_xyz ? p.poly_xyz.map(v=>v.toFixed(5)).join(', ') : 'non placé';
const dispose=o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()};

function setupPane(kind,data,color) {
 const canvas=$('canvas-'+kind);
 const verts=new Float32Array(data.vertices),ix=data.faces;
 const geom=new THREE.BufferGeometry();
 if(kind==='bp'){
  const zvert=meshData.zan.vertices;let ymin=Infinity;for(let i=1;i<zvert.length;i+=3)ymin=Math.min(ymin,zvert[i]);
  const colors=new Float32Array(verts.length);
  for(let i=0;i<verts.length;i+=3){const low=verts[i+1]<ymin;colors[i]=low?.91:.52;colors[i+1]=low?.28:.82;colors[i+2]=low?.22:.90}
  geom.setAttribute('color',new THREE.BufferAttribute(colors,3));
 }
 geom.setAttribute('position',new THREE.BufferAttribute(verts,3));
 geom.setIndex(ix);
 geom.computeVertexNormals();
 geom.computeBoundingBox();
 const bounds=geom.boundingBox.clone(),center=bounds.getCenter(new THREE.Vector3());
 const size=bounds.getSize(new THREE.Vector3());
 const maxdim=Math.max(size.x,size.y,size.z);
 const scene=new THREE.Scene();
 scene.background=new THREE.Color('#0b1d2a');
 const group=new THREE.Group();scene.add(group);
 const mat=new THREE.MeshStandardMaterial({color,roughness:0.71,metalness:0.01,side:THREE.DoubleSide});
 const mesh=new THREE.Mesh(geom,mat);mesh.position.copy(center).multiplyScalar(-1);group.add(mesh);
 const marks=new THREE.Group();group.add(marks);
 scene.add(new THREE.HemisphereLight(0xe8ffff,0x284757,2.0));
 const lamp=new THREE.DirectionalLight(0xfff5df,2.0);lamp.position.set(1.2,2.4,4.1);scene.add(lamp);
 const camera=new THREE.PerspectiveCamera(38,1,0.001,100);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 const pane={kind,data,canvas,mesh,marks,scene,camera,renderer,center,maxdim};
 viewports[kind]=pane;
 let drag=null;
 canvas.addEventListener('pointerdown',ev=>{drag={x:ev.clientX,y:ev.clientY,theta:state.view.theta,phi:state.view.phi};canvas.setPointerCapture(ev.pointerId)});
 canvas.addEventListener('pointermove',ev=>{if(!drag)return;const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;
  if(Math.hypot(dx,dy)>3){state.view.theta=drag.theta-dx*.007;state.view.phi=THREE.MathUtils.clamp(drag.phi+dy*.007,.07,Math.PI-.07);requestDraw()}
 });
 canvas.addEventListener('pointerup',ev=>{
  if(!drag)return;const delta=Math.hypot(ev.clientX-drag.x,ev.clientY-drag.y);drag=null;
  if(delta<5)selectSurface(pane,ev);
 });
 canvas.addEventListener('wheel',ev=>{ev.preventDefault();state.view.zoom=THREE.MathUtils.clamp(state.view.zoom*Math.exp(-ev.deltaY*.0012),.3,7);requestDraw()},{passive:false});
 return pane;
}
function resizePane(p){
 const c=p.canvas,w=Math.max(300,c.clientWidth),h=Math.max(260,c.clientHeight);
 if(c.width!==Math.round(w*(Math.min(2,devicePixelRatio||1)))||c.height!==Math.round(h*(Math.min(2,devicePixelRatio||1))))p.renderer.setSize(w,h,false);
 p.camera.aspect=w/h;p.camera.updateProjectionMatrix();
}
function draw(){
 animating=false;const ref=Math.max(...Object.values(viewports).map(p=>p.maxdim));
 for(const p of Object.values(viewports)){
  resizePane(p);
  const radius=ref*2.8/state.view.zoom;
  p.camera.position.set(radius*Math.sin(state.view.phi)*Math.sin(state.view.theta),
   radius*Math.cos(state.view.phi),radius*Math.sin(state.view.phi)*Math.cos(state.view.theta));
  p.camera.lookAt(0,0,0);p.camera.updateMatrixWorld();
  p.mesh.material.wireframe=state.wire;
  const desired=p.kind==='bp'&&state.scope;if(p.mesh.material.vertexColors!==desired){p.mesh.material.vertexColors=desired;p.mesh.material.color.set(desired?0xffffff:0x84cce3);p.mesh.material.needsUpdate=true}
  p.renderer.render(p.scene,p.camera);
 }
}
function requestDraw(){if(!animating){animating=true;requestAnimationFrame(draw)}}
function selectSurface(p,ev){
 const rect=p.canvas.getBoundingClientRect();
 pointer.set(((ev.clientX-rect.left)/rect.width)*2-1,-((ev.clientY-rect.top)/rect.height)*2+1);
 ray.setFromCamera(pointer,p.camera);
 const hit=ray.intersectObject(p.mesh,false)[0];
 if(!hit){$('status').textContent='Aucune surface touchée, orienter le modèle puis réessayer.';return;}
 const pos=hit.point.clone().add(p.center);
 const poly=[pos.x,pos.y,pos.z];
 state.marks[state.selected][p.kind]={
  caudal_scope_alert:p.kind==='bp'&&state.selected==='apex'&&poly[1]<Math.min(...meshData.zan.vertices.filter((x,i)=>i%3===1))-.015,
  poly_xyz:poly,
  triangle_index:hit.faceIndex,
  source_raw_xyz:p.kind==='bp'?inverseMul(meshData.bp43.matrix_poly_to_raw,poly):null,
  operator_action:'direct_ray_surface_pick', manually_confirmed_anatomical_homology:false,
  coordinate_unit:'POLY_normalized_not_mm',
  annotated_local:new Date().toISOString()
 };
 update();
 if(state.marks[state.selected].bp?.caudal_scope_alert){$('status').textContent='Attention : point « apex » BP placé dans l’extension caudale proche du coccyx ; ne pas le considérer comme validé.'}
}
function redrawMarkers(){
 for(const pane of Object.values(viewports)){
  while(pane.marks.children.length){const child=pane.marks.children[0];pane.marks.remove(child);dispose(child)}
  for(const l of LANDMARKS){
   const item=state.marks[l.code][pane.kind];
   if(!item)continue;
   const radius=pane.maxdim*.013;
   const circle=new THREE.Mesh(new THREE.SphereGeometry(radius,10,10),
    new THREE.MeshBasicMaterial({color:l.code===state.selected?0xeaf35f:(l.role==='holdout'?0xed8ca0:0x66f1cf),depthTest:false}));
   circle.renderOrder=10;
   circle.position.fromArray(item.poly_xyz).sub(pane.center);
   pane.marks.add(circle);
  }
 }
 requestDraw();
}
function update(){
 const n=LANDMARKS.filter(l=>state.marks[l.code].bp&&state.marks[l.code].z).length;
 $('status').textContent=n+'/12 paires pointées · aucune correspondance homologuée automatiquement';
 $('status').dataset.good=n>0?'true':'false';
 $('activeHelp').textContent=LANDMARKS.find(x=>x.code===state.selected).help+' Le point doit être choisi SUR un triangle dans les deux modèles.';
 const list=$('list');list.replaceChildren();
 for(const l of LANDMARKS){
  const tr=document.createElement('tr');
  tr.dataset.active=l.code===state.selected?'true':'false';
  tr.dataset.complete=state.marks[l.code].bp&&state.marks[l.code].z?'true':'false';
  const a=document.createElement('td');a.textContent=l.label;
  const role=document.createElement('td');role.textContent=l.role==='fit'?'ajustement':'contrôle réservé';
  const bp=document.createElement('td');bp.title=fmt(state.marks[l.code].bp);bp.textContent=state.marks[l.code].bp?'●':'—';
  const z=document.createElement('td');z.title=fmt(state.marks[l.code].z);z.textContent=state.marks[l.code].z?'●':'—';
  const cell=document.createElement('td'),btn=document.createElement('button');
  btn.textContent='Pointer';btn.onclick=()=>{state.selected=l.code;$('point').value=l.code;update()};
  cell.appendChild(btn);tr.append(a,role,bp,z,cell);list.appendChild(tr);
 }
 for(const kind of ['bp','z']){
  const item=state.marks[state.selected][kind];
  $('meta-'+kind).textContent=item?'Coordonnées POLY : '+fmt(item):'Cliquer sur le maillage pour renseigner '+state.selected;
 }
 redrawMarkers();
}
function exportData(){
 const output={
  schema:'poly.sacrum-manual-annotation/1',
  source_mesh_sha256:{BodyParts3D_FJ3393:meshData.bp43.source_sha256,Z_sacrum_registry:meshData.zan.source_registry_sha256},
  coordinate_unit:'POLY_normalized_not_mm',
  observer_alias:$('observer').value.trim()||null,
  reviewer_status:'no_independent_anatomic_validation',
  notes:$('notes').value.trim(),
  data_origin:'manual_interactive_3d_surface_pointing',
  landmarks:LANDMARKS.map(l=>({code:l.code,label:l.label,role:l.role,
   source_BodyParts3D_FJ3393:state.marks[l.code].bp||null,
   target_Z_sacrum:state.marks[l.code].z||null,review:{confirmed_homologous:false,reviewer:null,reference:null,uncertainty_mm:null}})),
  created_utc:new Date().toISOString()
 };
 const bytes=new Blob([JSON.stringify(output,null,2)],{type:'application/json'});
 const link=document.createElement('a'),url=URL.createObjectURL(bytes);
 link.href=url;link.download='POLY_SACRUM_REPERES_A_CONTROLER.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function loadData(file) {
 const imported=JSON.parse(await file.text());
 if(imported.schema!=='poly.sacrum-manual-annotation/1')throw Error('Format du fichier incompatible');
 if(imported.source_mesh_sha256.BodyParts3D_FJ3393!==meshData.bp43.source_sha256||
    imported.source_mesh_sha256.Z_sacrum_registry!==meshData.zan.source_registry_sha256)throw Error('Ce fichier ne correspond pas aux géométries actuelles');
 for(const l of LANDMARKS){const rec=imported.landmarks.find(v=>v.code===l.code);if(!rec)continue;
  for(const [key,field] of [['bp','source_BodyParts3D_FJ3393'],['z','target_Z_sacrum']]){
   const point=rec[field];
   if(point?.poly_xyz){
    if(!Array.isArray(point.poly_xyz)||point.poly_xyz.length!==3||!point.poly_xyz.every(Number.isFinite))throw Error('Coordonnées invalides');
    state.marks[l.code][key]={...point,manually_confirmed_anatomical_homology:false};
   }
  }
 }
 $('observer').value=imported.observer_alias||'';
 $('notes').value=imported.notes||'';
 update();
}
$('point').addEventListener('change',ev=>{state.selected=ev.target.value;update()});
$('view').addEventListener('change',ev=>{
 const name=ev.target.value;
 const a={zp:[0,Math.PI/2],zm:[Math.PI,Math.PI/2],xp:[Math.PI/2,Math.PI/2],xm:[-Math.PI/2,Math.PI/2],yp:[0,.06]}[name];
 state.view.theta=a[0];state.view.phi=a[1];requestDraw()
});
$('wire').addEventListener('change',ev=>{state.wire=ev.target.checked;requestDraw()});
$('scope').addEventListener('change',ev=>{state.scope=ev.target.checked;requestDraw()});
$('clear').addEventListener('click',()=>{state.marks[state.selected]={};update()});
$('resetView').addEventListener('click',()=>{state.view={theta:0,phi:Math.PI/2,zoom:1};$('view').value='zp';requestDraw()});
$('export').addEventListener('click',exportData);
$('import').addEventListener('change',async ev=>{try{if(ev.target.files[0])await loadData(ev.target.files[0])}catch(error){$('status').textContent='Import refusé : '+error.message}});
async function run(){
 try{
  const response=await fetch('../data/sacrum-annotation-meshes-di.json',{cache:'no-store'});
  if(!response.ok)throw Error('Fichier de surfaces inaccessible : '+response.status);
  meshData=await response.json();
  if(meshData.schema!=='poly.sacrum-annotation-surfaces/1')throw Error('Sources non qualifiées');
  for(const l of LANDMARKS){$('point').add(new Option(l.label+' · '+(l.role==='fit'?'ajust.':'réservé'),l.code))}
  setupPane('bp',meshData.bp43,0x84cce3);
  setupPane('z',meshData.zan,0xd8a874);
  update();
  window.addEventListener('resize',requestDraw);
  window.POLY_SACRUM_ANNOTATION={state,sourceHashes:{bp:meshData.bp43.source_sha256,z:meshData.zan.source_registry_sha256},landmarkCodes:LANDMARKS.map(l=>l.code),ready:true};
 }catch(e){$('status').textContent='Erreur : '+e.message;console.error(e)}
}
run();
