import {lightExchange} from './research-exchange.mjs';
// Qualification of the received X1 catalog only; no physiological destination.
const sourceSHA='4937612857def19fc1d7b93635597cbfd14269f8782a420a33462235835895ca';
const calibrationSHA='e1e3e4edcfc1610908722ff01dacf001821c80ffc90a3232b9e8e8e53bf7cb87';
const canonical=x=>JSON.stringify(sort(x));
function sort(x){return Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;}
const freeze=o=>{for(const v of Object.values(o))if(v&&typeof v==='object')freeze(v);return Object.freeze(o);};
export function qualifyLightReading(record,source){
 if(source?.kind!=='light'||source.sha256!==sourceSHA||source.data?.calibration_sha256!==calibrationSHA)throw Error('Source lumière hors qualification L1.');
 const index=source.data.time_recording_s.indexOf(record?.clock?.value);
 const expected=lightExchange(source,{worldId:record?.world_id,runId:record?.run_id,scenarioId:record?.scenario?.id,index});
 if(canonical(record)!==canonical(expected))throw Error('Lecture lumière modifiée ; régénération depuis la source requise.');
 return freeze({schema:'poly.qualified-light-reading.v1',reading:expected,
 qualification:{id:'L1:X1:subject-01:sn2',catalog_sha256:sourceSHA,calibration_sha256:calibrationSHA,
 quantity_scope:[{quantity:'nominal_illuminance',unit:'lux',role:'parameterized_input',location:'eye-level nominal illuminance',laterality:null,geometry_registration:null},
 {quantity:'conditional_pupil_diameter_contrast',unit:'mm',role:'statistical_model_contrast',location:'pupillary observable; no individual anatomical registration',laterality:null,geometry_registration:null}],
 native_clock:'subject-01/sn2 recording',world_time_s:null,world_state_write:false,avatar_write:false,neural_activity:false,causal_effect_validated:false,
 unknowns:['No measured absolute pupil diameter in this modeled contrast','No qualified laterality or participant-to-atlas registration','No irradiance or retinal/neural/chemical conversion','No native-to-world clock mapping'],event_convention:source.data.event_convention}});
}
export function decodeQualifiedLightReading(text,source){
 if(typeof text!=='string'||text.length>25000)throw Error('Lecture L1 trop volumineuse ou invalide.');const d=JSON.parse(text),expected=qualifyLightReading(d?.reading,source);
 if(canonical(d)!==canonical(expected))throw Error('Qualification L1 altérée.');return expected;
}
