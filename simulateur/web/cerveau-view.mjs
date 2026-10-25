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
 let yaw=.45,pitch=.15,distance=radius*3.4,visible=!document.getElementById('cerveau').hidden,pending=0;
 function draw(){pending=0;if(!visible||document.hidden)return;const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(distance*Math.sin(yaw)*Math.cos(pitch),distance*Math.sin(pitch),distance*Math.cos(yaw)*Math.cos(pitch));camera.lookAt(0,0,0);camera.updateProjectionMatrix();renderer.render(scene,camera);}
 function invalidate(){if(!pending&&visible&&!document.hidden)pending=requestAnimationFrame(draw);}
 const select=document.getElementById('brain-region-lite');select.replaceChildren(new Option('Toutes les structures',''));for(const q of meta.regions)select.add(new Option(q.label,q.id));
 function selection(){const id=select.value,open=document.getElementById('open-cortex-lite').checked;for(const mesh of group.children){const q=mesh.userData;mesh.material.color.set(q.id===id?0xffd38a:palette[q.group]||0x9bc9c1);mesh.material.opacity=q.group==='cortex'?(open?.07:.85):1;}const q=meta.regions.find(v=>v.id===id);document.getElementById('brain-detail-lite').textContent=q?`${q.label} · centre atlas [${q.centroid_mm.map(v=>v.toFixed(1)).join(', ')}] mm · MNI152NLin2009cSym. Couleur de sélection anatomique, sans activité mesurée.`:'Référence humaine CerebrA · 17 surfaces, en mm dans l’espace MNI152NLin2009cSym. Aucune localisation individuelle ni activité mesurée.';invalidate();}
 select.onchange=selection;document.getElementById('open-cortex-lite').onchange=selection;
 document.getElementById('reset-brain-lite').onclick=()=>{yaw=.45;pitch=.15;distance=radius*3.4;invalidate();};
 function zoom(factor){distance=Math.max(radius*1.5,Math.min(radius*7,distance*factor));invalidate();}
 document.getElementById('brain-zoom-in').onclick=()=>zoom(.85);document.getElementById('brain-zoom-out').onclick=()=>zoom(1.15);
 let drag=null;canvas.onpointerdown=e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);};canvas.onpointermove=e=>{if(!drag)return;yaw-=(e.clientX-drag[0])*.008;pitch=Math.max(-1.4,Math.min(1.4,pitch+(e.clientY-drag[1])*.008));drag=[e.clientX,e.clientY];invalidate();};canvas.onpointerup=canvas.onpointercancel=()=>{drag=null;};canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(Math.max(-1,Math.min(1,e.deltaY*.001))));},{passive:false});
 new ResizeObserver(invalidate).observe(stage);document.addEventListener('poly-brain-visibility',e=>{visible=e.detail;invalidate();});document.addEventListener('visibilitychange',invalidate);
 document.getElementById('brain-placeholder').hidden=true;canvas.hidden=false;mounted=true;selection();
}
