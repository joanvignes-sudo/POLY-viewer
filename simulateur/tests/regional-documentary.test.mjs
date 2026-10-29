import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {snapshotChain} from '../web/documentary-context.mjs';
import {REGIONAL_DOCUMENTARY_RESOURCES,regionalDocumentaryCoverage,documentaryRegionView,validateRegionalDocumentaryManifest} from '../web/regional-documentary.mjs';
const records=JSON.parse(gunzipSync(fs.readFileSync(new URL('../models/body-display.json.gz',import.meta.url)))).structures.map((r,source_index)=>({...r,source_index}));
const groups=JSON.parse(fs.readFileSync(new URL('../data/documentary-chains.json',import.meta.url))).groups;
const source={metadata_sha256:'a'.repeat(64),geometry_sha256:'b'.repeat(64)};
test('regional documentary bounds use only exact qualified paths and current source IDs',()=>{
 const heart=regionalDocumentaryCoverage('heart',records,[591]);assert.equal(heart.path,'VH_M_heart');assert.deepEqual(heart.resident,[591]);assert.deepEqual(heart.bounds,records[591].bounds);assert.ok(heart.missing.length>0);assert.equal(heart.expected.length,heart.missing.length+1);
 const view=documentaryRegionView(heart);assert.deepEqual(view.target,records[591].bounds[0].map((v,k)=>(v+records[591].bounds[1][k])/2));assert.ok(view.distance>=.55);
 const empty=regionalDocumentaryCoverage('heart',records,[]);assert.equal(empty.bounds,null);assert.throws(()=>documentaryRegionView(empty));
 for(const region of ['amygdala','insula','striatum','prefrontal','made-up',null]){const cov=regionalDocumentaryCoverage(region,records,records.map(r=>r.source_index));assert.equal(cov.path,null);assert.equal(cov.bounds,null);}
 for(const region of ['brain','lungs','eye','skin']){const cov=regionalDocumentaryCoverage(region,records,records.map(r=>r.source_index));assert.ok(cov.resident.length>0,region);assert.deepEqual(cov.missing,[]);}
});
function fixture(){const group=groups.find(g=>g.nodes.some(n=>n.region==='heart'&&n.kind!=='gap')),index=group.nodes.findIndex(n=>n.region==='heart'&&n.kind!=='gap');const view={target:[0,2,0],distance:7,azimuth:0,elevation:0};return {schema:'poly.regional-documentary-manifest.v1',scope:'documentary-view-only',viewer:'hra-regional',physiological_replay:false,representation:'region',context:snapshotChain(group,index),source:{namespace:'hra',...source},resident_source_indices:[591],view,body_view:structuredClone(view),resources:REGIONAL_DOCUMENTARY_RESOURCES.map(path=>({path,sha256:'a'.repeat(64)}))};}
const environment={groups,source,records,residentIds:[591]};
test('regional manifest binds original source hashes, resident set, camera and canonical context',()=>{
 const valid=fixture();assert.equal(validateRegionalDocumentaryManifest(valid,environment),valid);
 for(const mutate of [r=>r.source.namespace='cerebra',r=>r.source.metadata_sha256='c'.repeat(64),r=>r.resident_source_indices=[],r=>r.resident_source_indices=[591,591],r=>r.context.region='lungs',r=>r.view.distance=61,r=>r.view.elevation=Math.PI/2,r=>r.view.target[0]=NaN,r=>r.resources.pop(),r=>r.viewer='classic',r=>r.physiological_replay=true]){const changed=structuredClone(valid);mutate(changed);assert.throws(()=>validateRegionalDocumentaryManifest(changed,environment));}
 assert.throws(()=>validateRegionalDocumentaryManifest(valid,{...environment,residentIds:[]}),/Blocs en mémoire/);
 const unplaced=fixture(),group=groups.find(g=>g.nodes.some(n=>n.region==='amygdala')),index=group.nodes.findIndex(n=>n.region==='amygdala');unplaced.context=snapshotChain(group,index);assert.throws(()=>validateRegionalDocumentaryManifest(unplaced,environment),/Région sans surface/);unplaced.representation='body';assert.doesNotThrow(()=>validateRegionalDocumentaryManifest(unplaced,environment));
 assert.ok(REGIONAL_DOCUMENTARY_RESOURCES.includes('documentary-engine.js'));assert.ok(REGIONAL_DOCUMENTARY_RESOURCES.includes('body-region-lab.mjs'));
});
