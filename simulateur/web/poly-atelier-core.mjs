// Contrat minimal de lecture : aucun calcul de température, aucune interpolation.
export function verifyThermalDataset(d){
 if(!d || d.schema!=='poly.thermal-research.v1' || d.nodes!==85 ||
    d.experimental_validation!==false || d.avatar_coupled!==false ||
    d.equilibrium?.numerical_stationarity_received!==true) throw Error('Contrat scientifique incompatible');
 for(const step of [15,30,60]){
  const rows=d.series?.[step];
  if(!Array.isArray(rows)||rows.length!==7200/step)throw Error('Série absente : '+step);
  for(let i=0;i<rows.length;i++){
   const r=rows[i];
   if(!Array.isArray(r)||r.length!==3||r[0]!==step*(i+1)||!r.every(Number.isFinite))
    throw Error('Échantillon non qualifié : '+step+'/'+i);
  }
 }
 return d;
}
export function selectThermalSample(d,step,position){
 const s=Number(step),rows=d.series[s];
 if(![15,30,60].includes(s)||!rows)throw Error('Pas inconnu');
 const n=Math.max(0,Math.min(rows.length-1,Math.round(Number(position)/s)-1));
 return {index:n,time_s:rows[n][0],skin_C:rows[n][1],central_blood_C:rows[n][2],ambient_C:rows[n][0]<=3600?28:20,step_s:s};
}
export function buildExport(d,sample){
 return {schema:'poly.functional-workbench-reading.v1',kind:'precomputed_thermal_reading',
   model:'JOS-3',source_commit:d.source_commit,source_schema:d.schema,
   profile:{age_years:30,sex:'male',height_m:1.7,weight_kg:60,posture:'standing',PAR:1.2},
   environment:{first_3600_s_C:28,remaining_3600_s_C:20},
   sample,clock:{basis:'native_model_elapsed',world_time_s:null},
   physiological_validation:false,avatar_write:false,geometry_registration:null,
   statement:'Consultation d’une série existante, sans prédiction intermodulaire ni interpolation.'};
}