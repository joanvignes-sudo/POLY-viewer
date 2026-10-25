// POLY full-body provisional anchor graph — NON-anatomical, NON-physiological.
// Two PCA endpoints of each referenced muscle surface may be tethered to
// a nearby Z-Anatomy bone *surface vertex* for visual inspection only.
// No origin/insertion/tendon/force is inferred from spatial proximity.
import * as THREE from './vendor/three.module.js?v=audit-o-1';
import {deformPosition} from './rig.js?v=audit-o-1';
import {deformReferenceTrunk} from './reference-trunk-rig.js?v=bl-1';
import {deformReferenceLeg} from './reference-leg-rig.js?v=ac-1';
import {deformReferenceBone} from './reference-bone-rig.js?v=bv-1';

const txt=(name,value)=>{const e=document.createElement(name);e.textContent=value;return e;};
const PREFIX='poly-full-anchors-';

export async function createFullMuscleAttachmentOverlay({scene,uniforms,avatarBones,forearmMotor,handMuscles}){
  const response=await fetch('../data/all-muscle-display-anchors.json');
  if(!response.ok)throw Error('Graphe des ancrages visuels indisponible');
  const data=await response.json();
  if(data.records.length!==480 || data.summary.total_end_candidates!==960)
    throw Error('Le lot 480/960 a changé : réaudit préalable obligatoire');
  const references=new Map([...forearmMotor.meshes.filter(m=>m.userData.kind!=='bone').map(m=>['body:'+m.userData.id,m]),
    ...handMuscles.bodyMeshes.filter(m=>m.userData.kind==='muscle').map(m=>['hand:'+m.userData.id,m])]);
  const skeleton=new Map(avatarBones.meshes.map(m=>[m.userData.bone_id,m]));
  const all=new Map(data.records.map(p=>[p.id,p]));
  const available=data.records.filter(r=>references.has(r.id));
  // No surface silently lost if another source revision changed the viewer.
  if(available.length!==data.records.length)throw Error('Une surface musculaire n’a plus sa géométrie source');

  const group=new THREE.Group();
  group.name='poly-provisional-muscle-bone-tethers';
  group.visible=false;
  scene.add(group);
  const geometry=new THREE.BufferGeometry();
  const material=new THREE.LineBasicMaterial({color:0xefa873,transparent:true,opacity:.88,depthTest:false,depthWrite:false});
  const line=new THREE.LineSegments(geometry,material);
  line.frustumCulled=false;line.renderOrder=98;group.add(line);
  const dots=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({
    color:0x9ff4dd,size:.025,transparent:true,opacity:.96,depthTest:false,depthWrite:false,sizeAttenuation:true
  }));
  dots.frustumCulled=false;dots.renderOrder=99;group.add(dots);
  const box=document.createElement('section');
  box.id=PREFIX+'panel';
  box.style.cssText='border:1px solid #579a91;border-radius:12px;padding:13px;margin:16px 0;background:#122e3c';
  const heading=txt('h3','Attaches musculaires · prototype');
  heading.style.cssText='color:#ccfff0;font-size:16px;margin:0 0 8px';
  box.append(heading,txt('p',data.summary.muscle_surfaces+' surfaces · '+data.summary.statuses.illustrative_bone_surface_proxy_unvalidated+' extrémités proches d’os · '+data.summary.statuses.unresolved_no_qualified_bone_target+' non résolues.'));
  const warning=txt('p','IMPORTANT : points d’ancrage graphiques provisoires, pas des origines ni insertions anatomiques. Ne calcule aucune contraction ni force.');
  warning.style.cssText='color:#f0c38c;font-size:12px';
  box.append(warning);
  const filter=txt('label','Filtrer les muscles');
  const search=document.createElement('input');search.type='search';search.placeholder='Nom, région ou identifiant';search.setAttribute('aria-label','Rechercher une surface musculaire');filter.append(search);
  box.append(filter);
  const selector=txt('label','Muscle à inspecter');
  const select=document.createElement('select');select.id=PREFIX+'muscle';select.setAttribute('aria-label','Choisir un muscle');selector.append(select);
  box.append(selector);
  const regionLabel=txt('label','Région à afficher');
  const region=document.createElement('select');region.id=PREFIX+'region';
  for(const name of ['all','arm_shoulder','forearm','hand','trunk','thigh','leg','foot']){const opt=new Option(({all:'Tout le corps',arm_shoulder:'Épaules et bras',forearm:'Avant-bras',hand:'Mains',trunk:'Tronc et tête',thigh:'Cuisses',leg:'Jambes',foot:'Pieds'})[name],name);region.add(opt)}
  regionLabel.append(region);box.append(regionLabel);
  const toggleLabel=txt('label','');
  const toggle=document.createElement('input');toggle.type='checkbox';toggle.id=PREFIX+'enabled';
  toggleLabel.append(toggle,document.createTextNode(' Dessiner les attaches provisoires'));box.append(toggleLabel);
  const modeLabel=txt('label','Portée des ancrages');
  const mode=document.createElement('select');mode.id=PREFIX+'mode';
  for(const [name,label] of [['selected','Muscle choisi'],['region','Région choisie'],['all','480 surfaces (chargement graphique)']])mode.add(new Option(label,name));
  modeLabel.append(mode);box.append(modeLabel);
  const explanation=txt('p','');explanation.id=PREFIX+'detail';explanation.style.cssText='font-size:12px;color:#d4e6ea;line-height:1.55;margin:10px 0';box.append(explanation);
  const status=txt('p','');status.id=PREFIX+'status';status.setAttribute('aria-live','polite');status.style.cssText='font-size:12px;color:#a8ebd7';box.append(status);
  const parent=document.querySelector('main > aside:first-child') || document.querySelector('main aside');
  if(!parent)throw Error('Volet explorateur manquant');
  const nav=parent.querySelector('.workbench-nav');
  if(nav){
    const jump=txt('button','Ancrages · 480');
    jump.id=PREFIX+'jump';
    jump.onclick=()=>{toggle.checked=true;dirty=true;box.scrollIntoView({block:'nearest'});};
    nav.append(jump);
    nav.after(box);
  }else parent.append(box);
  const chosen={id:all.has('body:FJ1512')?'body:FJ1512':data.records[0].id};
  function refreshOptions(){
    const phrase=search.value.trim().toLocaleLowerCase('fr');
    const filtered=data.records.filter(p=>!phrase || (p.name+' '+p.id+' '+p.region).toLocaleLowerCase('fr').includes(phrase));
    select.replaceChildren();
    for(const rec of filtered){const opt=new Option(rec.name+' · '+(rec.side||'?')+' · '+rec.id,rec.id);select.add(opt)}
    if(filtered.length){if(!filtered.some(p=>p.id===chosen.id))chosen.id=filtered[0].id;select.value=chosen.id;}
    explain();dirty=true;
  }
  function explain(){
    const rec=all.get(chosen.id);
    if(!rec){explanation.textContent='Aucun muscle dans le filtre.';return}
    const lines=rec.anchors.map((a,i)=>a.candidate_bone_id ?
      (i===0?'Extrémité A':'Extrémité B')+' : '+a.candidate_bone_id+' (écart '+a.rest_distance.toFixed(3)+' unité POLY, simple proximité)' :
      (i===0?'Extrémité A':'Extrémité B')+' : non résolue (distance '+(a.rest_distance===null?'inconnue':a.rest_distance.toFixed(3))+').'
    );
    explanation.textContent=rec.name+' — '+rec.region+'. '+lines.join(' ')+' Aucun tendon ni point d’enthèse attesté.';
  }
  let dirty=true,lastPose='',lastSelected='',lastActiveCount=0;
  function renderSelection(){
    if(mode.value==='all')return available;
    if(mode.value==='region')return available.filter(p=>region.value==='all'||p.region===region.value);
    return [all.get(chosen.id)].filter(Boolean);
  }
  function moveMuscle(point,record){
    if(record.source_atlas==='hand')return deformReferenceBone(point,{bone_family:'hand',side:record.side},uniforms);
    if(record.region==='trunk')return deformReferenceTrunk(point,uniforms);
    if(record.region==='foot')return deformReferenceBone(point,{bone_family:'foot',side:record.side},uniforms);
    if(record.region==='leg'||record.region==='thigh')return deformReferenceLeg(point,uniforms);
    return deformPosition(point,uniforms);
  }
  function update(){
    group.visible=toggle.checked;
    if(!group.visible)return;
    const pose=JSON.stringify(Object.values(uniforms).map(u=>u.value));
    const selection=mode.value+'|'+region.value+'|'+chosen.id;
    if(!dirty && pose===lastPose && selection===lastSelected)return;
    dirty=false;lastPose=pose;lastSelected=selection;
    // avatarBones.update() has just populated pose x rest matrices for the whole 206-bone skeleton.
    avatarBones.group.updateMatrixWorld(true);
    const lines=[],endpoints=[];
    const bonePoint=new THREE.Vector3();
    let skipped=0;
    for(const record of renderSelection()){
      const mesh=references.get(record.id);
      const base=mesh?.userData.base;
      for(const anchor of record.anchors){
        if(!base || !anchor.candidate_bone_id){skipped++;continue}
        const bone=skeleton.get(anchor.candidate_bone_id);
        if(!bone){skipped++;continue}
        const j=anchor.muscle_vertex_index*3;
        if(j+2>=base.length){skipped++;continue}
        const musclePoint=moveMuscle([base[j],base[j+1],base[j+2]],record);
        bonePoint.fromArray(anchor.bone_source_xyz).applyMatrix4(bone.matrixWorld);
        if(!musclePoint.every(Number.isFinite)||!Number.isFinite(bonePoint.x)){skipped++;continue}
        lines.push(...musclePoint,bonePoint.x,bonePoint.y,bonePoint.z);
        endpoints.push(bonePoint.x,bonePoint.y,bonePoint.z);
      }
    }
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(lines,3));
    geometry.computeBoundingSphere();
    dots.geometry.setAttribute('position',new THREE.Float32BufferAttribute(endpoints,3));
    dots.geometry.computeBoundingSphere();
    lastActiveCount=lines.length/6;
    status.textContent=lastActiveCount+' raccords graphiques dessinés ; '+skipped+' extrémités non affichées. Calcul de force et insertions biologiques : indisponibles.';
  }
  search.addEventListener('input',refreshOptions);
  select.addEventListener('change',()=>{chosen.id=select.value;dirty=true;explain()});
  toggle.addEventListener('change',()=>{dirty=true;update()});
  region.addEventListener('change',()=>{dirty=true});
  mode.addEventListener('change',()=>{dirty=true;update()});
  refreshOptions();
  window.POLY_FULL_MUSCLE_ATTACHMENTS={
    coverage:data.summary,graphicalOnly:true,anatomicalInsertionsVerified:0,
    count:()=>lastActiveCount,select:(id)=>{if(!all.has(id))return false;search.value='';refreshOptions();chosen.id=id;select.value=id;dirty=true;explain();return true;}
  };
  return {group,data,update};
}
