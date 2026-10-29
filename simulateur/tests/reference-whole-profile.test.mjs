import test from 'node:test';import assert from 'node:assert/strict';
import {referenceSelectionProfile,REFERENCE_LOCAL_BUDGET,REFERENCE_WHOLE_BUDGET} from '../web/reference-selection-profile.mjs';
import {planReferenceSelection,loadReferenceSelection} from '../web/reference-selection.mjs';
import {REFERENCE_WHOLE_BOOKMARK_KEY,validateReferenceBookmark} from '../web/reference-view-bookmark.mjs';
const keys=Array.from({length:526},(_,i)=>'parts/'+i),manifest={chunks:keys.map((key,i)=>({id:'test-'+i,keys:[key],raw_bytes:100000}))};
test('global view requires explicit budget and preserves the local default limits',async()=>{
 assert.equal(referenceSelectionProfile(false).maxEntries,16);assert.equal(referenceSelectionProfile(true).maxRawBytes,REFERENCE_LOCAL_BUDGET);
 let calls=0;const readChunk=async(m,id)=>{calls++;const c=m.chunks.find(c=>c.id===id);return {id,entries:[{key:c.keys[0]}]};};
 await assert.rejects(loadReferenceSelection(manifest,keys,{...referenceSelectionProfile(true),readChunk}),/budget/);assert.equal(calls,0);
 await assert.rejects(loadReferenceSelection(manifest,keys,{...referenceSelectionProfile(false),readChunk}),/selection/);assert.equal(calls,0);
 const result=await loadReferenceSelection(manifest,keys,{...referenceSelectionProfile(true,REFERENCE_WHOLE_BUDGET),readChunk});assert.equal(result.entries.length,526);assert.equal(result.plan.rawBytes,52600000);assert.equal(calls,526);
 for(const args of [[false,REFERENCE_WHOLE_BUDGET],[true,Infinity],[true,REFERENCE_WHOLE_BUDGET+1],['whole',REFERENCE_LOCAL_BUDGET]])assert.throws(()=>referenceSelectionProfile(...args));
 for(const maxEntries of [0,527,Infinity])assert.throws(()=>planReferenceSelection(manifest,keys,{maxEntries,maxRawBytes:REFERENCE_WHOLE_BUDGET}));
});
test('whole bookmark is isolated from local saves and contains only IDs and bounded view state',()=>{
 const value={schema:REFERENCE_WHOLE_BOOKMARK_KEY,source_raw_sha256:'trusted',key:keys[0],keys,view:{zoom_ratio:3.2,azimuth:.2,elevation:.1},geometry:new Float64Array(3)};
 const saved=validateReferenceBookmark(value,'trusted',keys,{whole:true});assert.equal(saved.keys.length,526);assert.equal(Object.hasOwn(saved,'geometry'),false);assert.notEqual(saved.keys,keys);
 assert.equal(validateReferenceBookmark(value,'trusted',keys),null);assert.equal(validateReferenceBookmark({...value,source_raw_sha256:'old'},'trusted',keys,{whole:true}),null);
 assert.equal(validateReferenceBookmark({...value,keys:[...keys,'parts/526']},'trusted',[...keys,'parts/526'],{whole:true}),null);
});
