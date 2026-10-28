import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {makeLiteCatalogue,validateBodyMetadata,filterLite,projectLiteBox,simplify,GROUPS} from '../web/body-light-core.mjs';
import {buildInBudget} from '../web/body-batch-loader.mjs';

const meta=JSON.parse(gunzipSync(fs.readFileSync(new URL('../models/body-display.json.gz',import.meta.url))).toString('utf8'));
const catalogue=makeLiteCatalogue(meta);
const html=fs.readFileSync(new URL('../web/body-light.html',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../web/body-light.mjs',import.meta.url),'utf8');

test('actual compressed atlas metadata provides 918 finite structures and normalized source bounds',()=>{
 assert.equal(validateBodyMetadata(meta),meta);
 assert.equal(catalogue.records.length,918);
 assert.equal(catalogue.schema,'poly.body-metadata-locator.v1');
 assert.equal(catalogue.source_geometry_loaded,false);
 assert.equal(catalogue.validated_attachments,false);
 assert.equal(catalogue.measured_individual_positions,false);
 assert.ok(catalogue.bounds.every(row=>row.every(Number.isFinite)));
 assert.ok(catalogue.records.some(r=>r.system==='skeletal'));
 assert.ok(catalogue.records.some(r=>r.system==='muscular'));
 assert.ok(catalogue.records.some(r=>r.system==='nervous'));
 assert.ok(catalogue.records.every(r=>r.bounds.every(row=>row.every(Number.isFinite))));
});
test('filter searches source names, with accents and all-system selection',()=>{
 assert.equal(simplify('CŒUR Épine'),'coeur epine');
 const skeleton=filterLite(catalogue,{system:'skeletal'});
 assert.ok(skeleton.length>10);
 assert.ok(skeleton.every(x=>x.system==='skeletal'));
 const heart=filterLite(catalogue,{system:'all',query:'heart'});
 assert.ok(heart.length>=1);
 assert.ok(heart.every(x=>x.search.includes('heart')));
 assert.throws(()=>filterLite(catalogue,{system:'unknown'}),/Système/);
});
test('front and side projections have finite monotone bounding rectangles',()=>{
 for(const record of catalogue.records.slice(0,120))for(const view of ['front','side']){
  const p=projectLiteBox(record,catalogue.bounds,view);
  for(const v of Object.values(p))assert.ok(Number.isFinite(v));
  assert.ok(p.width>=0&&p.height>=0);
  assert.ok(p.centerX>=p.x&&p.centerX<=p.x+p.width+1e-9);
  assert.ok(p.centerY>=p.y&&p.centerY<=p.y+p.height+1e-9);
 }
 assert.throws(()=>projectLiteBox(catalogue.records[0],catalogue.bounds,'isometric'),/Vue/);
});
test('bad source metadata refused before drawing anything',()=>{
 const invalid=structuredClone(meta);invalid.structures[0].bounds[0][0]=NaN;
 assert.throws(()=>makeLiteCatalogue(invalid),/non finies/);
 const missing=structuredClone(meta);delete missing.structures[1].bounds;
 assert.throws(()=>makeLiteCatalogue(missing),/volume/);
});
test('metadata-only mode never loads the 30 MB body geometry or WebGL',()=>{
 assert.match(html,/public-assets\.js/);
 assert.match(js,/fetch\('\.\.\/models\/body-display\.json'/);
 assert.doesNotMatch(html+js,/body-display\.bin|WebGLRenderer|THREE\.Mesh|three\.module/);
 assert.ok(fs.statSync(new URL('../models/body-display.json.gz',import.meta.url)).size<120000);
 assert.ok(fs.statSync(new URL('../models/body-display.bin.gz',import.meta.url)).size>10000000);
});
test('budgeted builder makes progress and yields while preserving source order',async()=>{
 let now=0,yields=0;const visits=[],updates=[];
 const x=await buildInBudget([0,1,2,3,4],async n=>{visits.push(n);now+=4;},{budgetMs:7,now:()=>now,yieldControl:async()=>{yields++},onProgress:(n,t)=>updates.push([n,t])});
 assert.deepEqual(visits,[0,1,2,3,4]);
 assert.deepEqual(x,{completed:5,total:5});
 assert.ok(yields>=1);
 assert.deepEqual(updates.at(-1),[5,5]);
 const empty=await buildInBudget([],()=>{throw Error('must not run')},{onProgress:(n,t)=>updates.push([n,t])});
 assert.deepEqual(empty,{completed:0,total:0});
 assert.deepEqual(updates.at(-1),[0,0]);
});
test('batch failure propagates before reporting completion',async()=>{
 let progress=0;
 await assert.rejects(buildInBudget([1,2,3],x=>{if(x===2)throw Error('fail fixture')},{onProgress:n=>{progress=n}}),/fail fixture/);
 assert.ok(progress<3);
 await assert.rejects(buildInBudget([1],()=>{},{budgetMs:-1}),/frame budget/);
});
