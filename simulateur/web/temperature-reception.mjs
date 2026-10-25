const fail=message=>{throw Error(message);};
const canonical=value=>Array.isArray(value)?'['+value.map(canonical).join(',')+']':value&&typeof value==='object'?'{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}':JSON.stringify(value);
const same=(a,b)=>canonical(a)===canonical(b);
export function validateRequest(r){
 const keys=['schema','air_C','radiant_C','start_s','end_s','duration_s','step_s'];
 if(!r||!same(Object.keys(r).sort(),keys.sort())||r.schema!=='poly.thermal-request.v1')fail('Requête thermique incompatible.');
 if(!keys.filter(k=>k!=='schema').every(k=>typeof r[k]==='number'&&Number.isFinite(r[k])))fail('Valeurs numériques finies requises.');
 if(r.air_C<26||r.air_C>28||r.radiant_C<26||r.radiant_C>28)fail('Air et rayonnement : 26 à 28 °C.');
 if(!(r.start_s>=0&&r.start_s<r.end_s&&r.end_s<=r.duration_s&&r.duration_s<=3600))fail('Vérifiez début < fin ≤ durée totale ≤ 3 600 s.');
 if(![15,30,60].includes(r.step_s)||['start_s','end_s','duration_s'].some(k=>r[k]%r.step_s!==0))fail('Les temps doivent être des multiples du pas choisi, sans arrondi.');
 return r;
}
export function validateResult(value,request,qualification){
 validateRequest(request);
 if(!value||value.schema!=='poly.thermal-result.v1'||!same(value.request,request))fail('Le résultat ne correspond pas à la requête.');
 if(value.avatar_coupled!==false||value.experimental_validation!==false||value.parameters_fitted!==false||value.world_time!==null)fail('Portée scientifique incompatible.');
 for(const key of ['initial_state_sha256','source_files_sha256','source_commit','profile','fixed_boundaries','columns','interval'])
  if(!same(value[key],qualification[key]))fail('Provenance ou profil incompatible : '+key);
 if(!Array.isArray(value.rows)||value.rows.length!==request.duration_s/request.step_s+1)fail('Nombre d’échantillons incompatible.');
 value.rows.forEach((row,i)=>{
  if(!Array.isArray(row)||row.length!==5||!row.every(v=>typeof v==='number'&&Number.isFinite(v))||row[0]!==i*request.step_s)fail('Grille native ou valeurs incompatibles.');
  const start=(i-1)*request.step_s,active=i>0&&request.start_s<=start&&start<request.end_s;
  if(row[3]!== (active?request.air_C:28)||row[4]!== (active?request.radiant_C:28))fail('Frontières incompatibles avec le pas précédent.');
 });
 if(!same(value.rows[0],qualification.initial_row))fail('État initial incompatible.');
 const limits={max_inverse_vs_solve_K:1e-8,max_relative_residual:1e-12,max_corrected_energy_residual_W:1e-7};
 for(const [key,limit] of Object.entries(limits))if(typeof value.receipt?.[key]!=='number'||!Number.isFinite(value.receipt[key])||value.receipt[key]<0||value.receipt[key]>=limit)fail('Recette numérique refusée : '+key);
 return structuredClone(value);
}
export function compareResults(intervention,control,qualification){
 const request=intervention.request;
 const a=validateResult(intervention,request,qualification);
 const b=validateResult(control,{...request,air_C:28,radiant_C:28},qualification);
 const rows=a.rows.map((row,i)=>{
  const ref=b.rows[i];
  if(row[0]<=request.start_s&&(row[1]!==ref[1]||row[2]!==ref[2]))fail('Le passé diffère avant l’intervention.');
  return [row[0],row[1]-ref[1],row[2]-ref[2]];
 });
 return {schema:'poly.thermal-comparison.v1',intervention:a,control:b,columns:['elapsed_s','skin_difference_K','central_blood_difference_K'],rows,world_time:null,avatar_coupled:false,experimental_validation:false,scope:'Paired model calculation; no human causal validation'};
}
