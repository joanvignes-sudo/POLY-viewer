import {observedAcquisitionScope} from './observed-acquisition.mjs';
const EXPECTED='b2eff70e7d98e7c6f626f191f68abac78cbd6e9943c6d41e8f6b44df50802a72',accepted=new WeakSet();
const check=(ok,msg)=>{if(!ok)throw Error(msg);};
function freeze(o){for(const v of Object.values(o))if(v&&typeof v==='object')freeze(v);return Object.freeze(o);}
export async function decodeLightLocalization(raw){
 check(typeof raw==='string'&&raw.length<100000,'Contrat L3 trop volumineux ou invalide.');
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw))),v=>v.toString(16).padStart(2,'0')).join('');
 check(hash===EXPECTED,'Contrat de localisation différent de la version reçue.');const c=JSON.parse(raw);
 check(c.schema==='poly.light-observable-localization.v1'&&c.scope==='metadata_and_observable_lineage_only'&&c.avatar_write===false&&c.physiological_execution===false&&c.world_time_s===null,'Portée L3 incompatible.');
 freeze(c);accepted.add(c);return c;
}
export function lightObservableContext(contract,data){
 check(accepted.has(contract),'Contrat L3 non reçu.');const observed=observedAcquisitionScope(data);
 const record=contract.observed_records.find(r=>r.subject===observed.subject);
 check(record?.pupil_member_sha256===observed.source_member_sha256&&record.session===observed.session,'Identité hors contrat L3.');
 const modeled=observed.subject===contract.model_catalog.reference_subject?structuredClone(contract.model_catalog):null;
 return freeze({schema:'poly.light-observable-context.v1',scope:'metadata_only_not_sample_authentication',contract_id:contract.id,
  observed:{subject:observed.subject,session:observed.session,source_member_sha256:observed.source_member_sha256,quantity:observed.quantity,unit:observed.unit,support:contract.observed_preparation.support,raw_channels:structuredClone(contract.raw_channels),single_eye_substitution:false},
  population:structuredClone(contract.dataset),publication_apparatus:structuredClone(contract.acquisition),model_contrast:modeled,stimulus:structuredClone(contract.stimulus),session_scope:structuredClone(contract.session),geometry:structuredClone(contract.geometry),
  individual_eye_values_reconstructible:false,world_time_s:null,avatar_write:false,physiological_execution:false,retinal_activity:false,neural_activity:false});
}
export function mountLightLocalization(after){
 const section=document.createElement('section');section.id='light-localization';after.after(section);
 let contract=null,raw=null,current=null;section.textContent='Lecture du contrat de provenance lumière…';
 const add=(tag,text,parent=section)=>{const e=document.createElement(tag);e.textContent=text;parent.append(e);return e;};
 function paint(){
  if(!contract||!current)return;
  try{
   const c=lightObservableContext(contract,current);section.replaceChildren();add('h2','De la mesure au modèle · localisation');
   add('p',`Personne ${c.observed.subject} · sn2 désigne la tâche lumineuse, sans l’identifier au deuxième des cinq blocs décrits dans l’article.`);
   add('p','Population : 22 enregistrements lumineux disponibles parmi 23 contrôles féminins recrutés. L’âge moyen publié de 41,87 ans (écart-type 3,90) concerne le groupe de 23 ; il n’a pas été recalculé pour les 22 fichiers disponibles.');
   const table=add('table',''),head=add('thead','',table),tr=add('tr','',head);for(const title of ['Grandeur','Portée conservée'])add('th',title,tr);const body=add('tbody','',table);
   const rows=[['Canaux sources','Pupille gauche (1) et droite (2), mm, 500 Hz. Deux yeux d’une même personne.'],['Courbe observée','Moyenne binoculaire stricte ; groupes de 0,1 s. Aucun remplacement par un seul œil.'],['Entrée lumineuse','Niveaux nominaux au niveau des yeux ; aucune photométrie instantanée ni conversion rétinienne.'],['Contraste statistique',c.model_contrast?'Catalogue X1 : personne 01, modèle appris sur 21 autres personnes ; contraste en mm pour une cible binoculaire, sans diamètre absolu ou valeur par œil.':'Le catalogue X1 concerne la personne 01. Aucun contraste de ce catalogue n’est associé à la personne affichée.']];
   for(const [a,b]of rows){const tr=add('tr','',body);add('td',a,tr);add('td',b,tr);}
   add('p','Appareil décrit dans l’article : EyeLink 1000, échantillonnage 500 Hz ; luxmètre Voltcraft MS-1300 au niveau des yeux. Cette description du protocole ne vérifie pas l’appareil individuel de chaque fichier. Les unités mm restent celles des exports, sans nouvelle calibration.');
   add('p','Limites conservées : distance 590 mm dans les fichiers contre 700 mm dans l’article ; 24 présentations exportées par fichier, cinq blocs décrits dans l’article sans correspondance établie. Ni recalage individuel à l’avatar, ni temps du monde, ni activité rétinienne ou neuronale déduits.');
   const links=add('p','');for(const [label,url]of [['Dépôt humain et licence CC BY 4.0','https://zenodo.org/records/8239465'],['Article primaire','https://www.nature.com/articles/s41598-023-41357-1']]){const a=add('a',label,links);a.href=url;a.target='_blank';a.rel='noopener';add('span',' · ',links);}
   const button=add('button','Exporter le contrat de localisation'),status=add('p','Contrat documentaire reçu ; aucun raccord physiologique autorisé.');status.id='light-localization-status';status.setAttribute('role','status');
   button.id='light-localization-export';button.onclick=()=>{const url=URL.createObjectURL(new Blob([raw],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='POLY_L3_contrat_localisation_lumiere.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Contrat exporté : sources, portée des grandeurs et inconnues ; aucune série numérique ajoutée.';};
  }catch(e){section.replaceChildren();add('p','Localisation non reçue : '+e.message);}
 }
 fetch('light-localization.json',{cache:'no-store',signal:AbortSignal.timeout(10000)}).then(async r=>{check(r.ok,'Contrat documentaire indisponible.');raw=await r.text();contract=await decodeLightLocalization(raw);paint();}).catch(e=>{section.textContent='Localisation documentaire indisponible : '+e.message+' Le lecteur des observations reste indépendant.';});
 return {draw(data){current=data;paint();}};
}
