import {validateDocumentaryContext} from './documentary-context.mjs';
export const RESOURCE_PATHS=['../data/documentary-chains.json','chain-bridge.mjs','documentary-manifest.mjs','documentary-context.mjs','documentary-engine.js','app.js'];
export async function resourceDigests(){return Promise.all(RESOURCE_PATHS.map(async path=>{const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error('Ressource de provenance indisponible');const bytes=await r.arrayBuffer(),digest=await crypto.subtle.digest('SHA-256',bytes);return {path,sha256:[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')};}));}
export function validateManifest(record,groups){
 if(!record||record.schema!=='poly.documentary-manifest.v1'||record.scope!=='documentary-view-only'||record.physiological_replay!==false||!['body','region'].includes(record.representation))throw Error('Manifeste incompatible');
 const s=validateDocumentaryContext(record.context,groups),g=groups.find(g=>g.id===s.group_id),n=g.nodes[s.index];
 if(record.representation==='region'&&(n.kind==='gap'||!n.region))throw Error('Région inconnue');
 for(const v of [record.view,record.body_view])if(!v||!Array.isArray(v.target)||v.target.length!==3||!v.target.every(x=>Number.isFinite(x)&&Math.abs(x)<100)||![v.zoom,v.pitch,v.angle].every(Number.isFinite)||v.zoom<.08||v.zoom>12||Math.abs(v.pitch)>1.5)throw Error('Cadrage invalide');
 if(!Array.isArray(record.resources)||record.resources.length!==RESOURCE_PATHS.length||record.resources.some((r,i)=>r.path!==RESOURCE_PATHS[i]||!/^[a-f0-9]{64}$/.test(r.sha256)))throw Error('Provenance incomplète');return record;
}
export function verifyDigests(expected,actual){if(expected.length!==actual.length||expected.some((r,i)=>r.path!==actual[i]?.path||r.sha256!==actual[i]?.sha256))throw Error('Les ressources ont changé ; reprise refusée');}
