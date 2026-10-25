import * as THREE from './vendor/three.module.js?v=joint-dk-1';

const $=id=>document.getElementById(id);
const state={selected:'sacral_apex',bpSource:'FJ3393',marks:{},angle:{theta:0,phi:Math.PI/2},radius:0.65,focus:[0,1.816,-0.13],boundary:true};
const scenes={};let src,joint,busy=false;
const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();
const polyToRaw=(xyz,m)=>[0,1,2].map(i=>m[i][0]*xyz[0]+m[i][1]*xyz[1]+m[i][2]*xyz[2]+m[i][3]);
const form=(p)=>p?.poly_xyz?p.poly_xyz.map(x=>x.toFixed(6)).join(', '):'non pointé';
const selectedLandmark=()=>joint.target_labels.find(x=>x.code===state.selected);
function frame(mesh,key,color){
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(mesh.vertices,3));
 geometry.setIndex(mesh.faces);
 geometry.computeVertexNormals();
 const material=new THREE.MeshStandardMaterial({color,roughness:.78,side:THREE.DoubleSide});
 const object=new THREE.Mesh(geometry,material);
 object.userData.bone=key;object.frustumCulled=false;
 return object;
}
function initScene(which){
 const canvas=$('canvas-'+which);
 const scene=new THREE.Scene();scene.background=new THREE.Color('#0a1b27');
 const group=new THREE.Group();scene.add(group);
 const camera=new THREE.PerspectiveCamera(38,1,.001,50);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
 const amb=new THREE.HemisphereLight(0xe3f5f6,0x314756,2.1);scene.add(amb);
 const key=new THREE.DirectionalLight(0xfff3d3,2.0);key.position.set(1,1,2);scene.add(key);
 const markers=new THREE.Group();group.add(markers);
 scenes[which]={canvas,scene,group,camera,renderer,markers,parts:[]};
 let drag;
 canvas.addEventListener('pointerdown',ev=>{
  drag={x:ev.clientX,y:ev.clientY,theta:state.angle.theta,phi:state.angle.phi};canvas.setPointerCapture(ev.pointerId)
 });
 canvas.addEventListener('pointermove',ev=>{
  if(!drag)return;
  const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;
  if(Math.hypot(dx,dy)>3){state.angle.theta=drag.theta-dx*.007;state.angle.phi=THREE.MathUtils.clamp(drag.phi+dy*.007,.07,Math.PI-.07);drawLater();}
 });
 canvas.addEventListener('pointerup',ev=>{
  if(!drag)return;const delta=Math.hypot(ev.clientX-drag.x,ev.clientY-drag.y);drag=undefined;
  if(delta<5)pick(which,ev);
 });
 canvas.addEventListener('wheel',ev=>{ev.preventDefault();state.radius=THREE.MathUtils.clamp(state.radius*Math.exp(ev.deltaY*.001),.11,2.5);drawLater()},{passive:false});
}
function refreshObjects(){
 for(const p of Object.values(scenes)){
  for(const mesh of p.parts){p.group.remove(mesh);if(mesh.geometry)mesh.geometry.dispose();if(mesh.material)mesh.material.dispose()}
  p.parts=[];
 }
 const bp=state.bpSource==='FJ3393'?src.bp43:joint.FJ6484;
 const b=frame(bp,state.bpSource,0x87bfd9);scenes.bp.group.add(b);scenes.bp.parts.push(b);
 const s=frame(src.zan,'sacrum',0xd9ac71);
 const c=frame(joint.Z_coccyx,'coccyx',0x83decd);
 s.visible=!$('hide-sacrum').checked;c.visible=!$('hide-coccyx').checked;
 scenes.z.group.add(s,c);scenes.z.parts.push(s,c);
 if(state.bpSource==='FJ3393'&&state.boundary){
  const path=joint.BP43_boundary.segments.flat(2);
  const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(path,3));
  const m=new THREE.LineBasicMaterial({color:0x33f1cb,transparent:true,opacity:0.95,depthTest:false});
  const line=new THREE.LineSegments(geom,m);line.userData.isIndicator=true;
  scenes.bp.group.add(line);scenes.bp.parts.push(line);
 }
 if($('geometry-seeds').checked){
  const pair=joint.seed_points.midline_10mm_not_calibrated;
  const pts=[pair.point_sacrum_Z,pair.point_coccyx_Z];
  for(let i=0;i<pts.length;i++){
   const mesh=new THREE.Mesh(new THREE.SphereGeometry(.005,12,10),
      new THREE.MeshBasicMaterial({color:i===0?0xf07b8e:0x64d8f5,depthTest:false}));
   mesh.position.fromArray(pts[i]);mesh.userData.isIndicator=true;mesh.renderOrder=14;
   scenes.z.group.add(mesh);scenes.z.parts.push(mesh);
  }
  const arrow=new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(...p)));
  const line=new THREE.Line(arrow,new THREE.LineBasicMaterial({color:0xfaf7c5,depthTest:false}));
  line.userData.isIndicator=true;line.renderOrder=13;scenes.z.group.add(line);scenes.z.parts.push(line);
 }
 refreshMarks();drawLater();
}
function refreshMarks(){
 for(const [which,p] of Object.entries(scenes)){
  while(p.markers.children.length){
   const a=p.markers.children[0];p.markers.remove(a);a.geometry.dispose();a.material.dispose()
  }
  for(const item of joint.target_labels){
   const site=state.marks[item.code]||{};
   const mark=which==='bp'?site.bp:site.z;
   if(!mark)continue;
   if(which==='bp'&&mark.source_id!==state.bpSource)continue;
   const geom=new THREE.SphereGeometry(.004,10,8);
   const color=item.code===state.selected?0xf1e86c:0xf784af;
   const dot=new THREE.Mesh(geom,new THREE.MeshBasicMaterial({color,depthTest:false}));
   dot.renderOrder=20;dot.position.fromArray(mark.poly_xyz);
   p.markers.add(dot);
  }
 }
 drawLater();
}
function drawLater(){if(!busy){busy=true;requestAnimationFrame(draw)}}
function draw(){
 busy=false;
 for(const p of Object.values(scenes)){
  const w=Math.max(200,p.canvas.clientWidth),h=Math.max(250,p.canvas.clientHeight);
  if(p.canvas.width!==Math.round(w*Math.min(devicePixelRatio||1,2))||p.canvas.height!==Math.round(h*Math.min(devicePixelRatio||1,2)))
   p.renderer.setSize(w,h,false);
  p.camera.aspect=w/h;p.camera.updateProjectionMatrix();
  const r=state.radius,p0=state.angle;
  p.camera.position.set(state.focus[0]+r*Math.sin(p0.phi)*Math.sin(p0.theta),
   state.focus[1]+r*Math.cos(p0.phi),
   state.focus[2]+r*Math.sin(p0.phi)*Math.cos(p0.theta));
  p.camera.lookAt(...state.focus);p.camera.updateMatrixWorld();
  p.renderer.render(p.scene,p.camera);
 }
}
function pick(which,ev){
 const p=scenes[which],b=p.canvas.getBoundingClientRect();
 pointer.set(2*(ev.clientX-b.left)/b.width-1,1-2*(ev.clientY-b.top)/b.height);
 raycaster.setFromCamera(pointer,p.camera);
 const candidates=p.parts.filter(o=>o.isMesh&&o.visible&&!o.userData.isIndicator);
 const found=raycaster.intersectObjects(candidates,false)[0];
 if(!found){$('status').textContent='Clique sur une surface osseuse visible, pas dans le vide.';return}
 const target=selectedLandmark();
 if(which==='z'&&found.object.userData.bone!==target.target){
  $('status').textContent='Refus : le repère « '+target.label+' » appartient au '+target.target+' ; le clic est sur '+found.object.userData.bone+'.';
  return;
 }
 const poly=found.point.toArray();
 const mark={source_id:found.object.userData.bone,poly_xyz:poly,triangle_index:found.faceIndex,
  anatomical_identity_confirmed:false,operator_action:'3d_surface_ray_pick',unit:'POLY_normalized_not_mm',
  clicked_at:new Date().toISOString()};
 if(which==='bp')mark.raw_obj_xyz=polyToRaw(poly,src.bp43.matrix_poly_to_raw);
 state.marks[state.selected][which]=mark;
 update();
}
function update(){
 $('landmark').value=state.selected;
 const rows=$('sites');rows.replaceChildren();
 let n=0;
 for(const item of joint.target_labels){
  const mark=state.marks[item.code]||{}, complete=mark.bp&&mark.z;
  if(complete)n++;
  const tr=document.createElement('tr');tr.dataset.selected=item.code===state.selected?'true':'false';
  for(const txt of [item.label,item.target,mark.bp?.source_id||'—',mark.z?.source_id||'—']){
   const td=document.createElement('td');td.textContent=txt;tr.appendChild(td);
  }
  const td=document.createElement('td'),btn=document.createElement('button');
  btn.textContent='Pointer';btn.onclick=()=>{state.selected=item.code;update()};
  td.appendChild(btn);tr.appendChild(td);rows.appendChild(tr);
 }
 $('status').textContent=n+'/7 paires enregistrées. Statut : correspondance anatomique non vérifiée.';
 $('picked-bp').textContent=(state.marks[state.selected]?.bp?.source_id||'Source BP')+' · '+form(state.marks[state.selected]?.bp);
 $('picked-z').textContent=(state.marks[state.selected]?.z?.source_id||'Os Z')+' · '+form(state.marks[state.selected]?.z);
 const item=selectedLandmark();
 const m=state.marks[state.selected]||{};
 let info='Site : '+item.label+'\nCritère : '+item.hint+'\n';
 if(m.bp)info+='\nBP '+m.bp.source_id+': '+form(m.bp);
 if(m.z)info+='\nZ '+m.z.source_id+': '+form(m.z);
 if(m.bp&&m.z){
  const delta=Math.hypot(...m.bp.poly_xyz.map((x,i)=>x-m.z.poly_xyz[i]));
  info+='\nÉcart brut : '+delta.toFixed(7)+' unité POLY (PAS une erreur anatomique validée)';
 }
 info+='\n\nIndice géométrique automatique Z :\n'+JSON.stringify(joint.seed_points.midline_10mm_not_calibrated,null,2);
 $('measures').textContent=info;
 refreshMarks();
}
function save(){
 const data={schema:'poly.sacrococcygeal-manual-markup/1',
  observer_alias:$('observer').value.trim()||null,notes:$('notes').value.trim()||null,
  source_provenance:{FJ3393_SHA256:src.bp43.source_sha256,FJ6484_SHA256:joint.FJ6484.sha256,Z_registry_SHA256:src.zan.source_registry_sha256},
  measurement_unit:'POLY normalized, non calibrated in mm',date:new Date().toISOString(),
  anatomical_homology_validated:false,
  sites:joint.target_labels.map(item=>({
   code:item.code,definition:item.label,target_bone:item.target,
   BP_candidate:state.marks[item.code]?.bp||null,Z_candidate:state.marks[item.code]?.z||null,
   external_expert_validated:false,observer_justification_required:true}))};
 const b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const uri=URL.createObjectURL(b),a=document.createElement('a');a.href=uri;a.download='POLY_JONCTION_SACROCOCCYGIENNE_A_VALIDER.json';a.click();
 setTimeout(()=>URL.revokeObjectURL(uri),5000);
}
async function start(){
 try{
  const [a,b]=await Promise.all([
   fetch('../data/sacrum-annotation-meshes-di.json',{cache:'no-store'}),
   fetch('../data/sacrococcygeal-inspection-dk.json',{cache:'no-store'})
  ]);
  if(!a.ok||!b.ok)throw Error('Impossible de charger les surfaces sources '+a.status+'/'+b.status);
  src=await a.json();joint=await b.json();
  if(src.schema!=='poly.sacrum-annotation-surfaces/1'||joint.schema!=='poly.sacrococcygeal-interactive-review/1')throw Error('Schémas des sources incompatibles');
  for(const item of joint.target_labels){
   state.marks[item.code]={};$('landmark').add(new Option(item.label,item.code));
  }
  initScene('bp');initScene('z');
  refreshObjects();update();
  window.POLY_JOINT={ready:true,state,sourceSignatures:joint.FJ6484.sha256,sites:joint.target_labels};
  window.addEventListener('resize',drawLater);
 }catch(e){$('status').textContent='Chargement impossible : '+e.message;console.error(e)}
}
$('landmark').onchange=ev=>{state.selected=ev.target.value;update()};
$('bpmodel').onchange=ev=>{state.bpSource=ev.target.value;refreshObjects();update()};
$('hide-sacrum').onchange=refreshObjects;
$('hide-coccyx').onchange=refreshObjects;
$('bisector').onchange=ev=>{state.boundary=ev.target.checked;refreshObjects()};
$('geometry-seeds').onchange=refreshObjects;
$('focus').onclick=()=>{state.focus=[0,1.818,-.13];state.radius=.27;drawLater()};
$('all').onclick=()=>{state.focus=[0,1.88,-.08];state.radius=.77;drawLater()};
$('clear').onclick=()=>{state.marks[state.selected]={};update()};
$('export').onclick=save;
start();
