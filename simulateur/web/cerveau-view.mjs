import * as THREE from './vendor/three.module.js?v=audit-o-1';
let mounted=false;
export async function mountBrain(){
 if(mounted)return;
 const response=await fetch(new URL('../models/cerebra/ATLAS_ANATOMIQUE.json',import.meta.url));if(!response.ok)throw Error('Métadonnées absentes');const meta=await response.json();
 const r=await fetch(new URL('../models/cerebra/cerebra-surfaces.bin',import.meta.url));if(!r.ok)throw Error('Surfaces absentes');const buffer=await r.arrayBuffer();
 if(meta.species!=='Homo sapiens'||meta.units!=='mm'||meta.space!=='MNI152NLin2009cSym'||meta.regions.length!==17)throw Error('Référence incompatible');
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',buffer)),n=>n.toString(16).padStart(2,'0')).join('');if(hash!==meta.mesh_sha256)throw Error('Empreinte incorrecte');
 // Validate before allocating GPU resources. Native RAS+ millimetres remain unchanged.
 for(const q of meta.regions){for(const key of ['position_offset','index_offset','vertices','triangles'])if(!Number.isSafeInteger(q[key])||q[key]<0)throw Error('Maillage invalide');if(q.position_offset%4||q.index_offset%4||q.position_offset+q.vertices*12>buffer.byteLength||q.index_offset+q.triangles*12>buffer.byteLength)throw Error('Maillage hors limites');const p=new Float32Array(buffer,q.position_offset,q.vertices*3),ix=new Uint32Array(buffer,q.index_offset,q.triangles*3);if(p.some(v=>!Number.isFinite(v))||ix.some(v=>v>=q.vertices))throw Error('Coordonnées invalides');}
 const canvas=document.getElementById('brain-canvas'),stage=document.getElementById('brain-stage');
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,1,3000),group=new THREE.Group();scene.add(group);scene.add(new THREE.HemisphereLight(0xe4f9f0,0x263748,2));const light=new THREE.DirectionalLight(0xffedda,3);light.position.set(200,300,300);scene.add(light);
 const bounds=new THREE.Box3(),palette={cortex:0x9bc9c1,amygdala:0xe29b87,hippocampus:0xd1cc83,insula:0xe1bc71,thalamus:0x8ebcd6,caudate:0xc2a6db,putamen:0x8ad6b6,cerebellum:0xa1b8af,brainstem:0xdfcfaa};
 for(const q of meta.regions){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(buffer,q.position_offset,q.vertices*3),3));g.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer,q.index_offset,q.triangles*3),1));g.computeVertexNormals();g.computeBoundingBox();bounds.union(g.boundingBox);const mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:palette[q.group]||0x9bc9c1,side:THREE.DoubleSide,roughness:.7,transparent:true,opacity:q.group==='cortex'?.85:1,depthWrite:q.group!=='cortex'}));mesh.userData=q;group.add(mesh);}
 const center=bounds.getCenter(new THREE.Vector3()),radius=bounds.getSize(new THREE.Vector3()).length()/2;group.position.copy(center).negate(); // RAS+ superior becomes display-up; coordinates in the source stay in mm.
 // Rotate about the anatomical centre, including the recentering translation.
 const pivot=new THREE.Group();scene.remove(group);pivot.add(group);scene.add(pivot);pivot.rotation.x=-Math.PI/2;

 const $=id=>document.getElementById(id),select=$('brain-region-lite'),side=$('brain-side'),search=$('brain-search'),isolate=$('isolate-brain-lite'),open=$('open-cortex-lite'),opacity=$('brain-cortex-opacity');
 let yaw=.45,pitch=.15,distance=radius*3.4,visible=!$('cerveau').hidden,pending=0,focused=false;
 const target=new THREE.Vector3(),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
 const views={front:[Math.PI,0],back:[0,0],left:[-Math.PI/2,0],right:[Math.PI/2,0],top:[0,1.55],bottom:[0,-1.55]};
 function draw(){pending=0;if(!visible||document.hidden)return;const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(target.x+distance*Math.sin(yaw)*Math.cos(pitch),target.y+distance*Math.sin(pitch),target.z+distance*Math.cos(yaw)*Math.cos(pitch));camera.lookAt(target);camera.updateProjectionMatrix();renderer.render(scene,camera);}
 function invalidate(){if(!pending&&visible&&!document.hidden)pending=requestAnimationFrame(draw);}
 function clearViewPreset(){for(const b of document.querySelectorAll('[data-brain-view]'))b.setAttribute('aria-pressed','false');}
 function resetView(){target.set(0,0,0);focused=false;yaw=.45;pitch=.15;distance=radius*3.4;clearViewPreset();invalidate();}
 function selectedMesh(){return group.children.find(m=>m.userData.id===select.value);}
 function focusSelection(){const mesh=selectedMesh();if(!mesh)return;scene.updateMatrixWorld(true);const sphere=mesh.geometry.boundingBox.getBoundingSphere(new THREE.Sphere());target.copy(mesh.localToWorld(sphere.center.clone()));distance=Math.max(5,sphere.radius/Math.sin(THREE.MathUtils.degToRad(camera.fov/2))*1.15);focused=true;invalidate();}
 function selection(){const id=select.value;
  if(!id){isolate.checked=false;if(focused)resetView();}
  $('focus-brain-lite').disabled=!id;isolate.disabled=!id;
  const alpha=Number(opacity.value)/100;open.checked=alpha<=.1;$('brain-opacity-value').value=Math.round(alpha*100)+' %';
  for(const mesh of group.children){const q=mesh.userData;mesh.visible=(!side.value||q.hemisphere===side.value||q.hemisphere==='both')&&(!isolate.checked||q.id===id);mesh.material.color.set(q.id===id?0xffd38a:palette[q.group]||0x9bc9c1);mesh.material.opacity=q.group==='cortex'?alpha:1;}
  const q=meta.regions.find(v=>v.id===id);
  $('brain-detail-lite').textContent=q?`${q.label} · centre atlas [${q.centroid_mm.map(v=>v.toFixed(1)).join(', ')}] mm · MNI152NLin2009cSym. Couleur de sélection anatomique, sans activité mesurée.`:'Référence humaine CerebrA · 17 surfaces, en mm dans l’espace MNI152NLin2009cSym. Aucune localisation individuelle ni activité mesurée.';
  if(focused&&id)focusSelection();invalidate();
 }
 function options(){const prior=select.value,query=search.value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();const rows=meta.regions.filter(q=>(!side.value||q.hemisphere===side.value||q.hemisphere==='both')&&q.label.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(query));select.replaceChildren(new Option('Toutes les structures visibles',''));for(const q of rows)select.add(new Option(q.label,q.id));select.value=rows.some(q=>q.id===prior)?prior:'';$('brain-region-count').textContent=`${rows.length} structure${rows.length>1?'s':''} dans la liste · 17 dans l’atlas. La recherche filtre la liste.`;selection();}
 function pick(id){const q=meta.regions.find(q=>q.id===id);if(!q)return;if(side.value&&q.hemisphere!==side.value&&q.hemisphere!=='both')side.value=q.hemisphere;search.value='';options();select.value=id;selection();}
 select.onchange=selection;search.oninput=options;side.onchange=options;isolate.onchange=selection;
 open.onchange=()=>{opacity.value=open.checked?'7':'85';selection();};opacity.oninput=selection;
 $('focus-brain-lite').onclick=focusSelection;$('clear-brain-lite').onclick=()=>{select.value='';selection();};
 $('reset-brain-lite').onclick=resetView;$('show-all-brain').onclick=()=>{search.value='';side.value='';isolate.checked=false;opacity.value='85';options();resetView();};
 for(const b of document.querySelectorAll('[data-brain-view]'))b.onclick=()=>{[yaw,pitch]=views[b.dataset.brainView];clearViewPreset();b.setAttribute('aria-pressed','true');invalidate();};
 function zoom(factor){const mesh=focused?selectedMesh():null;const min=mesh?Math.max(2,mesh.geometry.boundingBox.getBoundingSphere(new THREE.Sphere()).radius*1.15):radius*1.15;distance=Math.max(min,Math.min(radius*7,distance*factor));invalidate();}
 function rotate(dx,dy){yaw+=dx;pitch=Math.max(-1.55,Math.min(1.55,pitch+dy));clearViewPreset();invalidate();}
 $('brain-zoom-in').onclick=()=>zoom(.85);$('brain-zoom-out').onclick=()=>zoom(1.15);
 $('brain-turn-left').onclick=()=>rotate(-.2,0);$('brain-turn-right').onclick=()=>rotate(.2,0);$('brain-tilt-up').onclick=()=>rotate(0,.15);$('brain-tilt-down').onclick=()=>rotate(0,-.15);
 let drag=null;
 canvas.onpointerdown=e=>{if(!e.isPrimary||e.button!==0)return;drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false,id:e.pointerId};canvas.setPointerCapture(e.pointerId);};
 canvas.onpointermove=e=>{if(!drag||e.pointerId!==drag.id)return;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>5)drag.moved=true;if(drag.moved)rotate(-(e.clientX-drag.x)*.008,(e.clientY-drag.y)*.008);drag.x=e.clientX;drag.y=e.clientY;};
 canvas.onpointerup=e=>{if(!drag||e.pointerId!==drag.id)return;const click=!drag.moved;drag=null;if(!click)return;const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);raycaster.setFromCamera(pointer,camera);const candidates=group.children.filter(m=>m.visible&&m.material.opacity>0&&(!open.checked||m.userData.group!=='cortex'));const hit=raycaster.intersectObjects(candidates,false)[0];if(hit)pick(hit.object.userData.id);};
 canvas.onpointercancel=canvas.onlostpointercapture=()=>{drag=null;};
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(Math.max(-1,Math.min(1,e.deltaY*.001))));},{passive:false});
 canvas.onkeydown=e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const actions={ArrowLeft:()=>rotate(-.12,0),ArrowRight:()=>rotate(.12,0),ArrowUp:()=>rotate(0,.12),ArrowDown:()=>rotate(0,-.12),'+':()=>zoom(.85),'=':()=>zoom(.85),'-':()=>zoom(1.15),Home:resetView,Escape:()=>{select.value='';selection();}};if(actions[e.key]){e.preventDefault();actions[e.key]();}};
 const fullscreen=$('brain-fullscreen'),workbench=$('brain-workbench');
 if(!document.fullscreenEnabled||!workbench.requestFullscreen){fullscreen.disabled=true;fullscreen.textContent='Plein écran indisponible';}
 else fullscreen.onclick=async()=>{try{if(document.fullscreenElement===workbench)await document.exitFullscreen();else await workbench.requestFullscreen();}catch{fullscreen.textContent='Plein écran indisponible';}};
 document.addEventListener('fullscreenchange',()=>{const active=document.fullscreenElement===workbench;fullscreen.setAttribute('aria-pressed',String(active));fullscreen.textContent=active?'Quitter le plein écran':'Agrandir l’espace de travail';invalidate();});
 new ResizeObserver(invalidate).observe(stage);document.addEventListener('poly-brain-visibility',e=>{visible=e.detail;invalidate();});document.addEventListener('visibilitychange',invalidate);
 $('brain-placeholder').hidden=true;canvas.hidden=false;mounted=true;options();
}
