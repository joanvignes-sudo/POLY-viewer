import * as THREE from './vendor/three.module.js?v=audit-o-1';
import {deformPosition} from './rig.js?v=audit-o-1';
export async function createCogitateScene({scene,camera,uniforms,focus,onMode}){
 const response=await fetch('../cogitate/preuves.json');if(!response.ok)throw Error('Dossier COGITATE indisponible');const data=await response.json();
 const group=new THREE.Group();group.name='COGITATE-documentary-scene';group.visible=false;scene.add(group);
 const panel=document.createElement('section');panel.id='cogitate-scene-panel';panel.hidden=true;document.querySelector('aside.right').prepend(panel);
 panel.innerHTML='<label class="eyebrow">COGITATE DANS POLY</label><h2>Voir, enregistrer, examiner.</h2><p class="cog-status">CF102 · sorties des auteurs, pas réanalyse POLY</p><div class="cog-steps"><button data-cog="0">1 · Stimulus</button><button data-cog="1">2 · Signal</button><button data-cog="2">3 · Localisation</button><button data-cog="3">4 · Résultats</button></div><article id="cog-evidence" aria-live="polite"></article><div class="cog-tools"><button id="cog-focus">Cadrer la scène</button><button id="cog-close">Masquer COGITATE</button></div><a href="../cogitate/index.html" target="_blank">Ouvrir le dossier détaillé ↗</a>';
 const entry=document.createElement('button');entry.id='open-cogitate';entry.textContent='COGITATE · Illustrer dans le simulateur';entry.className='inventory-link';document.querySelector('aside').prepend(entry);
 const material=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,depthTest:false});
 function board(width,height,anchor){const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,height),material.clone());mesh.renderOrder=30;mesh.userData.anchor=anchor;group.add(mesh);return mesh}
 const screen=board(.85,.64,[.82,3.1,.6]);const visual=board(1.15,.95,[-.85,3.1,.6]);
 const loaders=new THREE.TextureLoader();const textures=await Promise.all(['notebook-cell-39-output-1.png','notebook-cell-55-output-1.png'].map(n=>loaders.loadAsync('../cogitate/assets/cogitate/'+n)));textures.forEach(t=>t.colorSpace=THREE.SRGBColorSpace);
 function textTexture(lines){const c=document.createElement('canvas');c.width=900;c.height=660;const ctx=c.getContext('2d');ctx.fillStyle='#102b36';ctx.fillRect(0,0,c.width,c.height);ctx.textAlign='center';ctx.fillStyle='#8ef0d2';ctx.font='bold 30px sans-serif';lines.forEach((l,i)=>ctx.fillText(l,450,65+i*48));const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
 const stimulusTexture=textTexture(['STIMULUS VISUEL','Schéma illustratif du protocole','','+','','Aucune image expérimentale reproduite']);
 const resultTexture=textTexture(['CF102 · SORTIES DES AUTEURS','','28 / 92 canaux réactifs','18 augmentations · 10 diminutions','720 époques dans la sortie','','Pas un résultat de population']);
 const pendingTexture=textTexture(['ENREGISTREMENT iEEG','','Le signal brut reste à acquérir.','Les figures des auteurs sont','consultables à l’étape Signal.','','Aucune réponse simulée.']);
 screen.material.map=stimulusTexture;visual.material.map=pendingTexture;
 const tagCanvas=document.createElement('canvas');tagCanvas.width=1024;tagCanvas.height=160;const ctx=tagCanvas.getContext('2d');ctx.fillStyle='#0e2435e6';ctx.fillRect(0,0,1024,160);ctx.fillStyle='#a7f2d8';ctx.font='30px sans-serif';ctx.textAlign='center';ctx.fillText('CERVEAU DE RÉFÉRENCE · ATLAS',512,65);ctx.fillStyle='#d3e1e8';ctx.font='23px sans-serif';ctx.fillText('Ce corps n’est pas le participant CF102.',512,115);const label=board(1.3,.2,[0,3.7,.1]);label.material.map=new THREE.CanvasTexture(tagCanvas);label.material.map.colorSpace=THREE.SRGBColorSpace;
 let active=false,index=0,saved=null;const records=[data.records[0],data.records[1],data.records[3],data.records[2]];
 const captions=['Le stimulus est schématisé. Aucun trajet nerveux individuel n’est mesuré ici.','La figure est celle des auteurs : pas une courbe générée par l’avatar.','Les électrodes restent dans la figure originale. Aucun placement inventé sur ce cerveau.','Les comptes décrivent le tutoriel CF102. Ils ne pilotent pas une activation du cerveau.'];
 function select(i){index=i;panel.querySelectorAll('[data-cog]').forEach((b,j)=>{b.setAttribute('aria-pressed',String(i===j))});screen.material.map=i===3?resultTexture:stimulusTexture;visual.material.map=i===1?textures[0]:i===2?textures[1]:i===3?resultTexture:pendingTexture;const image=textures[i===2?1:0].image;visual.scale.set(1,i===1||i===2?(image.height/image.width)*1.15/.95:1,1);const r=records[i],view=panel.querySelector('#cog-evidence');view.replaceChildren();for(const [tag,text] of [['strong',r.title.replace(/^\d · /,'')],['p',r.fact],['p',captions[i]],['p',r.limit]]){const n=document.createElement(tag);n.textContent=text;view.append(n)}const a=document.createElement('a');a.href=r.source;a.textContent='Source exacte ↗';a.target='_blank';a.rel='noopener';view.append(a)}
 function frame(){focus({target:deformPosition([0,3.13,.25],uniforms),zoom:Math.max(4.8,3.4/(2*Math.tan(camera.fov*Math.PI/360)*camera.aspect)),pitch:.03,angle:0})}
 function open(){if(active)return;active=true;group.visible=true;panel.hidden=false;onMode(true);select(index);frame()}
 function close(){if(!active)return;active=false;group.visible=false;panel.hidden=true;onMode(false)}
 for(const b of panel.querySelectorAll('[data-cog]'))b.onclick=()=>select(+b.dataset.cog);entry.onclick=open;panel.querySelector('#cog-close').onclick=close;panel.querySelector('#cog-focus').onclick=frame;
 function update(){if(!active)return;for(const m of group.children){m.position.set(...deformPosition(m.userData.anchor,uniforms));m.quaternion.copy(camera.quaternion)}}
 function pick(ray){if(!active)return false;const hit=ray.intersectObjects([screen,visual],false)[0];if(!hit)return false;select(hit.object===screen?0:(index===1?2:1));return true}
 return{open,close,select,update,pick,group,panel,data,get active(){return active},get index(){return index}};
}

