import {createSourceMaterialSession} from './body-source-material-session.mjs';
import * as THREE from './vendor/three.module.js?v=audit-o-1';
import {mountEyeReader} from './p1-eye-controls.mjs';
export function createEyeLight({scene,meshes,getMeshes=()=>meshes,organView,focus,stage=document.getElementById('stage'),beforeOpen=()=>null,onStop=()=>{},onChange=()=>{},compatible=()=>true}){
 const launch=document.createElement('button');launch.id='eye-light-open';launch.textContent='☀ Voir la lumière dans l’œil';document.getElementById('organ-catalog').before(launch);
 const panel=document.createElement('section');panel.id='eye-light-panel';panel.hidden=true;panel.style.cssText='position:absolute;left:12px;right:12px;top:70px;max-height:38vh;overflow:auto;z-index:8;background:#102736ed;border:1px solid #f4d67c;border-radius:12px;padding:12px;color:#fff;font-size:12px';panel.innerHTML='<div class="eye-light-toolbar" style="position:sticky;top:0;z-index:2;background:#102736;display:flex;flex-wrap:wrap;gap:6px;padding:4px 0"><strong>Lumière → rétine → réponse cellulaire</strong><button id="eye-light-play">Ⅱ Pause lumière</button> <button id="eye-light-close">← Revenir</button></div><p id="eye-light-phase"></p><p>Jaune : lumière incidente. Cyan : site d’absorption dans la rétine. Trajet schématique sur l’anatomie HRA ; réfraction non calculée. Temps pédagogique, aucune vitesse physique déduite.</p><a style="color:#83e9e0" href="https://www.nei.nih.gov/eye-health-information/healthy-vision/how-eyes-work" target="_blank" rel="noopener">Source : National Eye Institute ↗</a>';stage.append(panel);
 const group=new THREE.Group();scene.add(group);group.visible=false;
 const points=[[-.068,3.308,.245],[-.068,3.308,.193],[-.068,3.308,.184],[-.068,3.307,.149]];
 const path=points.map(p=>new THREE.Vector3(...p));const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(path),new THREE.LineBasicMaterial({color:0xffdf67,depthTest:false,transparent:true,opacity:.85}));line.renderOrder=100;group.add(line);
 const photon=new THREE.Mesh(new THREE.SphereGeometry(.0018,16,10),new THREE.MeshBasicMaterial({color:0xfff1a0,depthTest:false}));photon.renderOrder=102;group.add(photon);
 const absorb=new THREE.Mesh(new THREE.SphereGeometry(.003,20,12),new THREE.MeshBasicMaterial({color:0x60f4df,transparent:true,opacity:.8,depthTest:false,wireframe:true}));absorb.position.copy(path[3]);absorb.renderOrder=101;group.add(absorb);
 let active=false,playing=true,time=0,documentarySession=null,sessionContext=null,disposed=false,gpuReleased=false,lastStopReason=null;
 const materials=createSourceMaterialSession(getMeshes);
 function releaseGraphics(){if(gpuReleased)return;gpuReleased=true;const geometries=new Set(),materials=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material)});for(const g of geometries)g.dispose();for(const m of materials)m.dispose();}
 function stop(close=true,reason='user'){lastStopReason=reason;
  if(!active)return;releaseDocumentary();active=false;group.visible=false;panel.hidden=true;
  materials.restore();releaseGraphics();if(close)organView.close();const prior=sessionContext;sessionContext=null;onStop(prior,close);
  panel.dispatchEvent(new CustomEvent('poly-eye-closed'));onChange();
 }
 function releaseDocumentary(){if(!documentarySession)return;({time,playing}=documentarySession);documentarySession=null;const button=document.getElementById('eye-light-play');button.disabled=false;button.textContent=playing?'Ⅱ Pause lumière':'▶ Lire la lumière';onChange()}
 function readDocumentary(phase){if(disposed||!active)throw Error('Ouvrir la vue œil avant la lecture');if(phase!==0&&phase!==5)throw Error('Position documentaire invalide');if(!documentarySession)documentarySession={time,playing};time=phase;playing=false;document.getElementById('eye-light-play').disabled=true;document.getElementById('eye-light-play').textContent='Lecture P1 · position fixe';onChange()}
 function open(){
  if(disposed)return false;if(active)stop();
  const meshes=getMeshes(),required=[[358,'VH_M_cornea_R'],[350,'VH_M_lens_R'],[336,'VH_M_retina_R']];
  if(!required.every(([node,name])=>meshes.some(m=>m.userData.node===node&&m.userData.name===name))){launch.textContent='Charger cornée, cristallin et rétine droits avant cette vue';return false;}
  const eye=meshes.find(m=>m.userData.name==='VH_M_cornea_R');sessionContext=beforeOpen();
  try{
   organView.openGroup('VH_M_eye_R',eye);
   materials.capture(organView.parts.map(m=>m.userData.source_index));
   materials.apply(record=>({transparent:true,opacity:/retina|lens|cornea/.test(record.name)?.22:.055,depthWrite:false}));
   focus({target:[-.068,3.307,.177],zoom:.23,pitch:.12,angle:1.05});time=0;playing=true;active=true;lastStopReason=null;gpuReleased=false;panel.hidden=false;group.visible=true;
   launch.textContent='☀ Voir la lumière dans l’œil';document.getElementById('eye-light-play').textContent='Ⅱ Pause lumière';onChange();return true;
  }catch(error){active=true;stop();throw error;}
 }
 launch.onclick=open;document.getElementById('eye-light-close').onclick=()=>stop();document.getElementById('eye-light-play').onclick=e=>{playing=!playing;e.target.textContent=playing?'Ⅱ Pause lumière':'▶ Lire la lumière';onChange()};
 const reader=mountEyeReader({readDocumentary,releaseDocumentary},panel);
 return {open,close:stop,dispose(){if(disposed)return;stop();disposed=true;reader?.dispose();
  releaseGraphics();scene.remove(group);group.clear();panel.remove();launch.remove();materials.restore();},
  pause(){if(active){playing=false;document.getElementById('eye-light-play').textContent='▶ Lire la lumière';onChange()}},get playing(){return active&&playing},get savedMaterialCount(){return materials.size},get lastStopReason(){return lastStopReason},readDocumentary,releaseDocumentary,get active(){return active},get phase(){return time%8},update(dt){if(disposed||!active)return;const sameParts=materials.isCurrent(organView.parts.map(m=>m.userData.source_index));if(!compatible()||!sameParts||!organView.active||organView.groupId!=='VH_M_eye_R'){stop(false,!compatible()?'incompatible_context':!sameParts?'source_material_changed':'organ_view_changed');return}if(playing)time+=dt;const t=time%8;photon.visible=t<5;absorb.visible=t>=5;const u=Math.min(t/5,1)*3;const i=Math.min(2,Math.floor(u));photon.position.lerpVectors(path[i],path[i+1],u-i);absorb.scale.setScalar(1+Math.sin(t*5)*.2);document.getElementById('eye-light-phase').textContent=t<1.67?'1 · La lumière arrive sur la cornée.':t<3.34?'2 · Passage par les milieux transparents et le cristallin.':t<5?'3 · La lumière atteint la rétine.':'4 · Absorption par un photorécepteur : début de la phototransduction. Le photon absorbé ne repart pas en rebond. Réponse électrique non simulée.';}};
}
