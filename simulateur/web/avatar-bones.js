import * as THREE from './vendor/three.module.js?v=audit-o-1';

// Presentation transforms only. The existing activity trajectories are reused;
// none of these fixed pivots or segment assignments is anatomical registration.
export function segmentForBone(bone){
 const id=bone.id||bone.bone_id;
 if(bone.region==='foot')return 'foot';
 if(bone.region==='hand')return 'forearm';
 if(bone.region==='arm')return id.includes('humerus')?'upperarm':'forearm';
 if(bone.region==='leg')return id.includes('femur')?'thigh':'shank';
 return 'trunk';
}
export function bonePoseMatrix(segment,side,u){
 const matrix=new THREE.Matrix4(),v=k=>u[k]?.value||0;
 const rotation=(pivot,q)=>{const p=new THREE.Vector3(...pivot);matrix.premultiply(new THREE.Matrix4().makeTranslation(-p.x,-p.y,-p.z));matrix.premultiply(new THREE.Matrix4().makeRotationFromQuaternion(q.isQuaternion?q:new THREE.Quaternion(q.x,q.y,q.z,q.w)));matrix.premultiply(new THREE.Matrix4().makeTranslation(p.x,p.y,p.z));};
 const rx=(cy,a)=>rotation([0,cy,0],new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),a));
 const suffix=side==='L'?'L':'R';
 if(segment==='foot')rx(.18,v('ank'+suffix));
 if(['foot','shank'].includes(segment))rx(.99,v('knee'+suffix));
 if(['foot','shank','thigh'].includes(segment))rx(1.83,v('hip'+suffix));
 if(['upperarm','forearm'].includes(segment)){
  if(segment==='forearm'&&side==='R'&&u.eatForearm)rotation([-.63,2.27,.03],u.eatForearm.value);
  if(side==='R'&&u.eatShoulder)rotation([-.36,2.85,0],u.eatShoulder.value);
  rx(2.85,v('armSwing'+suffix));
 }
 matrix.premultiply(new THREE.Matrix4().makeTranslation(0,v('bob'),0));rx(0,v('rootTilt'));
 const shift=u.rootShift?.value||{x:0,y:0,z:0};matrix.premultiply(new THREE.Matrix4().makeTranslation(shift.x,shift.y,shift.z));
 return matrix;
}

// Graphic rest-pose adaptation to the PRE-EXISTING avatar control anchors.
// Bounds-derived landmarks are not anatomical landmarks or measured entheses.
export function graphicArmRest(data){
 const matrices=new Map(),records=[];
 const tip=(parts,upper)=>{let low=Infinity,high=-Infinity;for(const p of parts)for(let i=1;i<p.positions.length;i+=3){low=Math.min(low,p.positions[i]);high=Math.max(high,p.positions[i]);}const v=new THREE.Vector3();let n=0;for(const p of parts)for(let i=0;i<p.positions.length;i+=3){const y=p.positions[i+1];if(upper?y>=high-(high-low)*.08:y<=low+(high-low)*.08){v.add(new THREE.Vector3(...p.positions.slice(i,i+3)));n++;}}return v.divideScalar(n);};
 for(const side of ['R','L']){
  const hum=data.meshes.filter(p=>p.bone_id==='BONE:humerus_'+side),lower=data.meshes.filter(p=>['BONE:radius_'+side,'BONE:ulna_'+side].includes(p.bone_id));
  const S=tip(hum,true),E=tip(hum,false),W=tip(lower,false),sign=side==='R'?-1:1;
  const targetS=new THREE.Vector3(sign*.36,2.85,0),targetE=new THREE.Vector3(sign*.63,2.27,.03),targetW=new THREE.Vector3(sign*.9,1.78,.05);
  const upperQ=new THREE.Quaternion().setFromUnitVectors(E.clone().sub(S).normalize(),targetE.clone().sub(targetS).normalize());
  const reachedE=E.clone().sub(S).applyQuaternion(upperQ).add(targetS);
  const lowerQ=new THREE.Quaternion().setFromUnitVectors(W.clone().sub(E).normalize(),targetW.clone().sub(targetE).normalize());
  const map=(from,to,q)=>new THREE.Matrix4().makeTranslation(to.x,to.y,to.z).multiply(new THREE.Matrix4().makeRotationFromQuaternion(q)).multiply(new THREE.Matrix4().makeTranslation(-from.x,-from.y,-from.z));
  const upper=map(S,targetS,upperQ),forearm=map(E,reachedE,lowerQ);matrices.set('upperarm:'+side,upper);matrices.set('forearm:'+side,forearm);
  records.push({side,method:'rigid_graphic_rest_pose_to_existing_activity_anchors_no_scaling',source_landmark_method:'centroid_of_extreme_8_percent_y_bands_not_anatomical_annotation',source_shoulder:S.toArray(),source_elbow:E.toArray(),source_wrist:W.toArray(),existing_avatar_shoulder:targetS.toArray(),existing_avatar_elbow:targetE.toArray(),existing_avatar_wrist:targetW.toArray(),elbow_residual_avatar_units:reachedE.distanceTo(targetE),wrist_residual_avatar_units:W.clone().applyMatrix4(forearm).distanceTo(targetW),upper_matrix:upper.toArray(),forearm_matrix:forearm.toArray(),anatomical_registration_validated:false});
 }
 return {matrices,records};
}

export async function createAvatarBones({scene,uniforms,meshes=[],getMeshes=()=>meshes,referenceBones=()=>[],sourceReview,blocked,activate,focus,onSelect,sourceData=null,registryData=null,signal,hostParent=document.querySelector('aside:not(.right)'),badgeHost=document.querySelector('#stage .top'),counterNode=null,statusNode=document.getElementById('status'),skeletalVisible=()=>document.querySelector('[data-system="skeletal"]').checked,onChange=()=>{}}){
 let registry=registryData,data=sourceData;if(!registry||!data){const [r,g]=await Promise.all([fetch('../data/skeleton-worksite-206.json',{signal}),fetch('../data/skeleton-source-206.json',{signal})]);if(!r.ok||!g.ok)throw Error('Le squelette complet ne peut pas être chargé');registry=await r.json();data=await g.json();}signal?.throwIfAborted();let disposed=false;
 const rest=graphicArmRest(data);
 const group=new THREE.Group();group.name='DE-integrated-source-bones-illustrative-motion';scene.add(group);
 const state={enabled:true,region:'all',bone:'all',solo:false},created=[];let hidden=[];
 const material=new THREE.MeshStandardMaterial({color:0xede1c8,roughness:.58,metalness:.03,side:THREE.DoubleSide});
 for(const part of data.meshes){
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(part.positions,3));geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(part.indices),1));geometry.computeVertexNormals();geometry.computeBoundingSphere();
  const mesh=new THREE.Mesh(geometry,material.clone());mesh.matrixAutoUpdate=false;mesh.userData={...part,segment:segmentForBone(part),anatomical_registration_validated:false,motion_status:'illustrative_rigid_existing_activity_pivots'};group.add(mesh);created.push(mesh);
 }
 const host=document.createElement('section');host.id='avatar-bones-panel';host.style.cssText='margin-top:12px;padding:12px;border:1px solid #a6b4a0;border-radius:8px';
 host.innerHTML='<strong>Les os de l’avatar</strong><p class="small">206 os · 208 surfaces sources, réunis sur le personnage.</p><label><input id="avatar-bones-enabled" type="checkbox" checked> Afficher le squelette complet</label><button id="avatar-bones-solo">Voir les os seuls</button><button id="avatar-bones-body">Voir avec le corps</button><label>Région <select id="avatar-bones-region"><option value="all">Tout le squelette · 206</option></select></label><label>Os <select id="avatar-bones-bone"><option value="all">Tous les os</option></select></label><button id="avatar-bones-focus">Centrer la sélection</button><p id="avatar-bones-status" class="small"></p><p id="avatar-bones-detail" class="small"></p><p class="small">Placement global de référence. Marche, course et repas illustratifs ; os rigides, sans calcul de forces ni validation des articulations. Les relations exactes avec les autres atlas restent à qualifier.</p><details><summary>Sources et limites</summary><p class="small">Z-Anatomy / Gauthier Kervyn, Marcin Zielinski · CC BY-SA 4.0 ; dérivations BodyParts3D signalées. Identifiants et sources originales conservés. 206 concepts de référence adulte : variantes et os accessoires suivis à part. Deux polygones scapulaires exclus du rendu, originaux conservés.</p><a href="../reports/ETUDE_OS_DE.md" target="_blank" rel="noopener">Étude et chantier des os ↗</a></details>';
 hostParent.append(host);const $=id=>document.getElementById(id);
 const style=document.createElement('style');style.textContent='body.poly-avatar-bones-solo .network-labels{display:none!important}#avatar-bones-panel label{display:block;margin-top:8px}';document.head.append(style);
 const badge=document.createElement('span');badge.className='pill';badge.id='avatar-bones-badge';badge.textContent='Squelette Z-Anatomy · placement illustratif';badgeHost.append(badge);
 const counter=counterNode??document.querySelector('[data-system="skeletal"]').closest('label').querySelector('span');const nativeCount=counter.textContent,nativeTitle=counter.title;counter.title='206 concepts dans la couche source ; '+nativeCount+' structures HRA natives conservées séparément.';
 statusNode.textContent=getMeshes().length+' structures HRA · 206 os sources · local';
 const labels={cranium:'Crâne',face:'Face',ear:'Osselets',hyoid:'Hyoïde',spine:'Colonne, sacrum et coccyx',thorax:'Thorax',shoulder:'Ceinture scapulaire',arm:'Bras et avant-bras',hand:'Mains',pelvis:'Bassin',leg:'Jambes',foot:'Pieds'};
 for(const [key,label]of Object.entries(labels))$('avatar-bones-region').add(new Option(label+' · '+registry.bones.filter(b=>b.region===key).length,key));
 function fill(){const select=$('avatar-bones-bone');select.replaceChildren(new Option('Tous les os de la région','all'));for(const b of registry.bones.filter(b=>state.region==='all'||b.region===state.region))select.add(new Option(b.name_fr+' · '+b.id,b.id));state.bone='all';}
 function setBone(id){if(disposed)return;const b=registry.bones.find(b=>b.id===id);if(!b)return;state.region=b.region;$('avatar-bones-region').value=b.region;fill();state.bone=id;$('avatar-bones-bone').value=id;describe();}
 function describe(){const visible=created.filter(m=>(state.region==='all'||m.userData.region===state.region)&&(state.bone==='all'||m.userData.bone_id===state.bone));const count=new Set(visible.map(m=>m.userData.bone_id)).size;$('avatar-bones-status').textContent=count+' os sélectionnés · '+visible.length+' surfaces · '+(state.enabled?'affichage activé':'affichage désactivé');const b=registry.bones.find(b=>b.id===state.bone);$('avatar-bones-detail').textContent=b?b.name_fr+' · '+b.id+' · '+b.source_objects.join(' + ')+' · placement anatomique et attaches non validés.':'Squelette source cohérent ; le sternum compte un os malgré ses trois surfaces.';}
 function update(){
  if(disposed)return;restore();const reviewing=sourceReview(),allowed=!blocked()&&!reviewing;group.visible=state.enabled&&allowed&&skeletalVisible();
  document.body.classList.toggle('poly-avatar-bones-solo',group.visible&&state.solo);badge.hidden=!group.visible;
  counter.textContent=state.enabled?'206':nativeCount;
  const matrices=new Map();for(const mesh of created){const p=mesh.userData,key=p.segment+':'+(p.side||'');if(!matrices.has(key)){const pose=bonePoseMatrix(p.segment,p.side,uniforms);if(rest.matrices.has(key))pose.multiply(rest.matrices.get(key));matrices.set(key,pose);}mesh.matrix.copy(matrices.get(key));mesh.matrixWorldNeedsUpdate=true;mesh.visible=(state.region==='all'||p.region===state.region)&&(state.bone==='all'||p.bone_id===state.bone);mesh.material.emissive.setHex(state.bone===p.bone_id?0x40331c:0);}
  if(group.visible){for(const mesh of [...getMeshes(),...referenceBones()]){if(mesh.visible&&(mesh.userData.system==='skeletal'||mesh.userData.kind==='bone'||state.solo)){hidden.push(mesh);mesh.visible=false;}}if(state.solo)for(const node of scene.children){if(node!==group&&!node.isLight&&node.visible){hidden.push(node);node.visible=false;}}}
 }
 // Suppression applies only while rendering: native visibility and inspection
 // snapshots must not be destroyed by this alternative source skeleton.
 function restore(){for(const mesh of hidden)mesh.visible=true;hidden=[];}
 function center(){group.updateMatrixWorld(true);const box=new THREE.Box3();for(const mesh of created.filter(m=>m.visible))box.expandByObject(mesh);if(!box.isEmpty())focus({target:box.getCenter(new THREE.Vector3()).toArray(),zoom:Math.max(.08,box.getSize(new THREE.Vector3()).length()*2.2),pitch:.04,angle:.2});}
 function show(solo){if(disposed)return;activate();state.enabled=true;state.solo=solo;$('avatar-bones-enabled').checked=true;state.region='all';$('avatar-bones-region').value='all';fill();update();center();restore();describe();}
 $('avatar-bones-enabled').onchange=e=>{state.enabled=e.target.checked;restore();describe();};
 $('avatar-bones-solo').onclick=()=>show(true);$('avatar-bones-body').onclick=()=>show(false);$('avatar-bones-focus').onclick=()=>{update();center();restore();};
 $('avatar-bones-region').onchange=e=>{state.region=e.target.value;fill();describe();};$('avatar-bones-bone').onchange=e=>{state.bone=e.target.value;describe();};
 const nav=document.createElement('button');nav.id='avatar-bones-nav';nav.textContent='Os · 206';nav.onclick=()=>{show(true);host.scrollIntoView({block:'nearest'});};document.querySelector('.workbench-nav')?.append(nav);
 function pick(ray){if(!group.visible)return false;group.updateMatrixWorld(true);const hits=ray.intersectObjects(created.filter(m=>m.visible),false);if(!hits.length)return false;const id=hits[0].object.userData.bone_id;setBone(id);const b=registry.bones.find(b=>b.id===id);onSelect(b);return true;}
 host.addEventListener('click',onChange);host.addEventListener('change',onChange);nav.addEventListener('click',onChange);
 fill();describe();return {dispose(){if(disposed)return;restore();disposed=true;state.enabled=false;for(const m of created){m.geometry.dispose();m.material.dispose();group.remove(m);}created.length=0;material.dispose();scene.remove(group);document.body.classList.remove('poly-avatar-bones-solo');counter.textContent=nativeCount;counter.title=nativeTitle;host.removeEventListener('click',onChange);host.removeEventListener('change',onChange);nav.removeEventListener('click',onChange);for(const e of host.querySelectorAll('button,select,input')){e.onclick=null;e.onchange=null;}nav.onclick=null;host.remove();badge.remove();style.remove();nav.remove();},state,group,meshes:created,registry,data,rest,update,restore,show,setBone,pick,segmentForBone,bonePoseMatrix};
}
