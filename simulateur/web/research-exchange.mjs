// Research read adapters only. No world-state mutation or physiological coupling.
const require = (ok, message) => { if (!ok) throw Error(message); };
const finite = Number.isFinite;
const freeze = o => { for (const v of Object.values(o)) if (v && typeof v === 'object') freeze(v); return Object.freeze(o); };
export async function readResearchSource(raw, kind) {
 require(typeof raw === 'string', 'Source text required');
 const d = JSON.parse(raw);
 require(d.experimental_validation === false && d.avatar_coupled === false, 'Evidence level changed');
 require((kind === 'light' && d.schema === 'poly.light-experiment-catalog.v1') || (kind === 'thermal' && d.schema === 'poly.thermal-research.v1'), 'Unsupported source schema');
 const bytes = new TextEncoder().encode(raw);
 const sha = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
 return freeze({kind, data:d, sha256:sha});
}
function base(source, worldId, runId, location, clock) {
 require(typeof worldId === 'string' && worldId.trim() && typeof runId === 'string' && runId.trim(), 'Explicit world and run identity required');
 return {schema:'poly.research-exchange.v1',world_id:worldId,run_id:runId,module:source.kind,
  evidence:'precomputed_model_output',source:{sha256:source.sha256,schema:source.data.schema},
  location,clock,experimental_validation:false,avatar_write:false,
  unknowns:['No qualified mapping to avatar physiology','No alignment between recording and thermal clocks']};
}
export function lightExchange(source, {worldId, runId, scenarioId, index}) {
 require(source.kind === 'light', 'Light source required'); const d=source.data;
 require(d.source_subject === '01' && d.source_session === 'sn2' && d.model_rate_Hz === 20 && !d.training_people.includes('01'), 'Unsupported calibration scope');
 const s=d.scenarios.find(x=>x.id===scenarioId), times=d.time_recording_s;
 require(s && [5.3,5.8,7.3,9.6,13.3].includes(s.nominal_lux) && [1,3,5].some(x=>Math.abs(s.end_s-s.start_s-x)<1e-9) && s.start_s===58.05, 'Scenario outside received catalog domain');
 require(Number.isInteger(index) && index>=0 && index<times.length && s.statistical_contrast_mm.length===times.length && s.scenario_nominal_lux.length===times.length, 'Invalid sample');
 const t=times[index],lux=s.scenario_nominal_lux[index],delta=s.statistical_contrast_mm[index];
 require([t,lux,delta].every(finite) && [5.3,5.8,7.3,9.6,13.3].includes(lux), 'Invalid sample values');
 require(Math.abs(t-(45+index/20))<1e-8, 'Unexpected recording time grid');
 return freeze({...base(source,worldId,runId,{label:'eye-level nominal illuminance',geometry_registration:null},{basis:'subject-01/sn2 recording',unit:'s',value:t,world_time_s:null}),
  scenario:{id:s.id,start_s:s.start_s,end_s:s.end_s,interval:'half-open',mode:'input_parameterization'},
  calibration_sha256:d.calibration_sha256,
  values:[{quantity:'nominal_illuminance',value:lux,unit:'lux'},{quantity:'conditional_pupil_diameter_contrast',value:delta,unit:'mm'}],
  unknowns:[...d.unknowns,'No alignment to thermal or world clock'],interpretation:'Statistical contrast; neither observed diameter nor validated intervention effect'});
}
export function thermalExchange(source, {worldId,runId,step,index}) {
 require(source.kind==='thermal','Thermal source required');const d=source.data;
 require(d.nodes===85 && [15,30,60].includes(step),'Unsupported thermal discretization');
 const rows=d.series[step];require(Array.isArray(rows) && rows.length===7200/step && Number.isInteger(index) && index>=0 && index<rows.length,'Invalid thermal sample');
 const row=rows[index];require(row.length===3 && row.every(finite) && row[0]===step*(index+1),'Invalid thermal clock or values');
 return freeze({...base(source,worldId,runId,{label:'JOS-3 mean skin and central blood compartments',geometry_registration:null},{basis:'JOS-3 demo elapsed time',unit:'s',value:row[0],world_time_s:null}),
  model_source_commit:d.source_commit,scenario:{id:'T2-demo-To28-to20-at3600s',mode:'precomputed_demo',step_s:step},
  values:[{quantity:'mean_skin_temperature',value:row[1],unit:'degC'},{quantity:'central_blood_temperature',value:row[2],unit:'degC'}],
  interpretation:'Numerically verified demo; PAR 1.2 does not qualify physiological standing rest'});
}
export function requestPhysiologicalCoupling() {
 throw Error('U-COUPLING: no qualified physiological coupling; research records cannot write avatar state');
}
