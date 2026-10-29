// Documentary context uses existing HRA display bounds, never individual measurements.
import {validateDocumentaryContext} from './documentary-context.mjs';
export const REGIONAL_DOCUMENTARY_RESOURCES=Object.freeze(['../data/documentary-chains.json','documentary-context.mjs','documentary-engine.js','regional-documentary.mjs','regional-documentary-view.mjs','body-region-lab.mjs','documentary-network.js']);
const paths=Object.freeze({heart:'VH_M_heart',lungs:'VH_M_lungs',skin:'VH_M_skin',eye:'VH_M_eyes',brain:'Allen_brain'});
export function regionalDocumentaryCoverage(region,records,residentIds){
 const path=paths[region]??null,ids=new Set(residentIds);
 const expected=path?records.filter(r=>r.path.includes(path)):[];
 const resident=expected.filter(r=>ids.has(r.source_index)),missing=expected.filter(r=>!ids.has(r.source_index));
 let bounds=null;
 if(resident.length){bounds=[[Infinity,Infinity,Infinity],[-Infinity,-Infinity,-Infinity]];for(const r of resident)for(let k=0;k<3;k++){bounds[0][k]=Math.min(bounds[0][k],r.bounds[0][k]);bounds[1][k]=Math.max(bounds[1][k],r.bounds[1][k]);}}
 return {region:region??null,path,expected:expected.map(r=>r.source_index),resident:resident.map(r=>r.source_index),missing:missing.map(r=>r.source_index),bounds,localization_kind:path?'bounds of resident reference surfaces; not individual coordinates':'no qualified HRA mapping'};
}
export function documentaryRegionView(coverage){
 if(!coverage.bounds||!coverage.resident.length)throw Error('Aucune surface compatible en mémoire');
 const [lo,hi]=coverage.bounds;
 return {target:lo.map((v,k)=>(v+hi[k])/2),distance:Math.max(.55,Math.min(60,Math.hypot(...hi.map((v,k)=>v-lo[k]))*2.8)),azimuth:0,elevation:.08};
}
const validIds=ids=>Array.isArray(ids)&&ids.length<=918&&ids.every((v,i)=>Number.isInteger(v)&&v>=0&&v<918&&(i===0||v>ids[i-1]));
export function validateRegionalDocumentaryManifest(record,{groups,source,residentIds,records}){
 if(!record||record.schema!=='poly.regional-documentary-manifest.v1'||record.scope!=='documentary-view-only'||record.physiological_replay!==false||record.viewer!=='hra-regional'||!['body','region'].includes(record.representation))throw Error('Manifeste régional incompatible');
 validateDocumentaryContext(record.context,groups);
 if(record.source?.namespace!=='hra'||record.source.metadata_sha256!==source.metadata_sha256||record.source.geometry_sha256!==source.geometry_sha256)throw Error('Source anatomique différente');
 if(!validIds(record.resident_source_indices)||JSON.stringify(record.resident_source_indices)!==JSON.stringify([...residentIds].sort((a,b)=>a-b)))throw Error('Blocs en mémoire différents ; charger explicitement les mêmes sources avant reprise');
 if(record.representation==='region'&&!regionalDocumentaryCoverage(record.context.region,records,residentIds).bounds)throw Error('Région sans surface compatible');
 for(const v of [record.view,record.body_view])if(!v||!Array.isArray(v.target)||v.target.length!==3||!v.target.every(x=>Number.isFinite(x)&&Math.abs(x)<100)||!Number.isFinite(v.distance)||v.distance<.25||v.distance>60||!Number.isFinite(v.azimuth)||Math.abs(v.azimuth)>1e6||!Number.isFinite(v.elevation)||Math.abs(v.elevation)>Math.PI/2-.01)throw Error('Cadrage régional invalide');
 if(!Array.isArray(record.resources)||record.resources.length!==REGIONAL_DOCUMENTARY_RESOURCES.length||record.resources.some((r,i)=>r.path!==REGIONAL_DOCUMENTARY_RESOURCES[i]||!/^[a-f0-9]{64}$/.test(r.sha256)))throw Error('Provenance régionale incomplète');
 return record;
}
