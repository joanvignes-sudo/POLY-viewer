import * as THREE from './vendor/three.module.js?v=audit-o-1';
export async function createBoneRegistrationReview({scene,meshes,activate,getView,setView,isStatic}){
 const response=await fetch('../data/bone-registration-db.json');if(!response.ok)throw Error('Référentiel osseux DB indisponible');
 const data=await response.json(),group=new THREE.Group(),targetGroup=new THREE.Group();group.name='DB-all-source-bones-review';targetGroup.name='DB-BP40-hand-reference';scene.add(group,targetGroup);group.visible=targetGroup.visible=false;
 const state={enabled:false,region:'cervical',selected:'all',mode:'refined',nativeCoccyx:false};
 function make(p,color){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p.positions,3));g.setIndex(p.indices);g.computeVertexNormals();const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color,transparent:true,opacity:.67,depthWrite:false,side:THREE.DoubleSide,roughness:.6}));m.userData=p;return m}
 const created=data.meshes.map(p=>{const m=make(p,p.fit_role==='fit'?0x39bddd:0xf2b75a);group.add(m);return m});
 const references=data.meshes.filter(p=>p.target_ref).map(p=>{const m=make(p.target_ref,0xe4ddc8);m.userData.sourceId=p.id;targetGroup.add(m);return m});
 const host=document.createElement('section');host.id='bone-registration-da';host.style.cssText='margin-top:12px;padding:10px;border:1px solid #8d9baf;border-radius:7px';
 host.innerHTML='<strong>Os · lot local DB</strong><p class="small">79/79 sources BodyParts3D 4.3 placées pour comparaison, plus le candidat coccyx Z-Anatomy. Registration anatomique et attaches non validées. Repos uniquement.</p><label>Région <select id="db-region"><option value="all">Toutes les régions · 80 surfaces</option></select></label><button id="da-open">Comparer les os de la région</button><button id="da-close" disabled>Fermer la comparaison</button><label>Os <select id="da-level"><option value="all">Toute la région</option></select></label><label>Transformation <select id="da-transform"><option value="refined">Ajustement exploratoire</option><option value="initial">Initialisation</option></select></label><label><input id="db-targets" type="checkbox" checked> Voir les surfaces de comparaison</label><p id="db-target-kind" class="small"></p><p id="da-metrics" class="small"></p><button id="da-coccyx">Voir le coccyx HRA existant</button><p class="small">Coccyx HRA : nœud 969, UBERON:0001350. Le candidat Z-Anatomy se sélectionne dans Région.</p><a style="color:#8ad4e5" href="registration-source-da.html" target="_blank" rel="noopener">Revoir les quatre trapèzes dans leur source ↗</a><p class="small">BodyParts3D / DBCLS : mentions CC BY-SA 2.1 Japan et archive CC BY 4.0 conservées séparément. HRA : CC BY 4.0. Z-Anatomy : CC BY-SA 4.0. Aucun nouveau raccord anatomique.</p>';
 document.querySelector('aside:not(.right)').append(host);const $=id=>document.getElementById(id);
 for(const r of data.registration.groups)$('db-region').add(new Option(r.label||'Cervicales · 7',r.key));$('db-region').value=state.region;
 const nativeRoots=new Set(meshes.map(m=>m.parent));const supplemental=()=>scene.children.filter(o=>o!==group&&o!==targetGroup&&!nativeRoots.has(o)&&!o.isLight);let saved=null;
 function selected(){return data.meshes.filter(p=>(state.region==='all'||p.group===state.region)&&(state.selected==='all'||p.id===state.selected))}
 function fill(){const select=$('da-level');select.replaceChildren(new Option('Toute la région','all'));for(const p of data.meshes.filter(p=>state.region==='all'||p.group===state.region))select.add(new Option((p.label||p.level)+' · '+p.id,p.id));state.selected='all'}
 function close(){if(!state.enabled)return;state.enabled=false;group.visible=targetGroup.visible=false;if(saved){for(const m of meshes)m.visible=saved.visible.has(m.userData.node);for(const [o,v] of saved.supplemental)o.visible=v;setView(saved.view)}saved=null;$('da-close').disabled=true;}
 function open(mode='region'){
  close();activate();saved={visible:new Set(meshes.filter(m=>m.visible).map(m=>m.userData.node)),view:getView(),supplemental:supplemental().map(o=>[o,o.visible])};state.enabled=true;state.nativeCoccyx=mode==='coccyx';
  const sel=selected();saved.ids=new Set(state.nativeCoccyx?[969,...meshes.filter(m=>m.userData.name==='VH_M_sacrum').map(m=>m.userData.node)]:sel.map(p=>p.target_node).filter(x=>x!==null&&x!==undefined));update();
  const box=new THREE.Box3();if(state.nativeCoccyx){for(const m of meshes.filter(m=>saved.ids.has(m.userData.node)))box.expandByObject(m)}else{for(const m of created.filter(m=>m.visible))box.expandByObject(m)}
  if(!box.isEmpty())setView({target:box.getCenter(new THREE.Vector3()).toArray(),zoom:Math.max(.18,box.getSize(new THREE.Vector3()).length()*2.9),pitch:.1,angle:.4});$('da-close').disabled=false;
 }
 function update(){
  if(state.enabled&&!isStatic()){close();return}
  const sel=selected(),ids=new Set(sel.map(p=>p.id)),targets=$('db-targets').checked;
  if(state.enabled){for(const m of meshes)m.visible=saved.ids.has(m.userData.node)&&(state.nativeCoccyx||targets);for(const o of supplemental())o.visible=false}
  group.visible=state.enabled&&!state.nativeCoccyx;targetGroup.visible=group.visible&&targets;
  for(const m of created)m.visible=ids.has(m.userData.id);for(const m of references)m.visible=ids.has(m.userData.sourceId);
  const hands=sel.some(p=>p.group.startsWith('hand'));
  $('db-target-kind').textContent=hands?'Mains : comparaison à BodyParts3D 4.0 déjà placé dans POLY ; HRA ne fournit pas ici de main osseuse segmentée. Géométries presque identiques entre versions : contrôle de cohérence, aucune validation indépendante.':'Colonne, sacrum et coccyx : comparaison aux surfaces HRA d’affichage, décimées. Candidat coccyx Z-Anatomy distinct des sources BodyParts3D 4.3.';
  const key=state.mode==='initial'?'initial_metrics':'refined_metrics';const rms=Math.sqrt(sel.reduce((s,p)=>s+p[key].bidirectional_nearest_vertex_rms_units**2,0)/Math.max(1,sel.length));
  $('da-metrics').textContent=sel.length+' surface(s) source · RMS agrégé entre sommets '+rms.toFixed(6)+' unité POLY, pas des mm. Bleu : estimation ; ambre : os réservés au contrôle. Sacrum et coccyx : aucun os indépendant réservé. Aucune enthèse validée.';
 }
 $('da-open').onclick=()=>open();$('da-close').onclick=close;$('da-coccyx').onclick=()=>open('coccyx');
 $('db-region').onchange=()=>{state.region=$('db-region').value;fill();if(state.enabled)open();else update()};
 $('da-level').onchange=()=>{state.selected=$('da-level').value;if(state.enabled)open();else update()};$('db-targets').onchange=update;
 $('da-transform').onchange=()=>{state.mode=$('da-transform').value;for(let i=0;i<created.length;i++){const p=data.meshes[i];created[i].geometry.attributes.position.array.set(state.mode==='initial'?p.initial_positions:p.positions);created[i].geometry.attributes.position.needsUpdate=true;created[i].geometry.computeVertexNormals();created[i].geometry.computeBoundingSphere()}update()};
 window.addEventListener('poly-view-context-changed',close);window.addEventListener('poly-reference-open',close);document.addEventListener('click',e=>{if(state.enabled&&!host.contains(e.target)&&e.target.tagName!=='CANVAS')close()},true);fill();update();
 return{data,state,group,targetGroup,meshes:created,references,open,close,update};
}
