import test from 'node:test';
import assert from 'node:assert/strict';
import {referenceRelations} from '../web/reference-catalogue-relations.mjs';
const data={parts:[{id:'muscle',side:'R',itinerary:'path',contralateral_id:'explicit'},{id:'explicit',side:'L'},{id:'unlinked',side:'R'}],bones:[{id:'radius',side:'R',bone_family:'radius'},{id:'radiusL',side:'L',bone_family:'radius'},{id:'unknown',bone_family:'radius'}],bone_relations:[{parts:['muscle'],bone_family:'radius',scope:'No localized insertion'}],human_latency_observations:[{itinerary:'path',mean:2,used_for_animation:false},{itinerary:'elsewhere',mean:8}]};
test('muscle resolves only explicit same-side bone relationships and itinerary observations',()=>{
 const result=referenceRelations(data,'parts/0');assert.deepEqual(result.links.map(r=>r.key),['bones/0']);assert.equal(result.opposite.key,'parts/1');assert.equal(result.observations.length,1);assert.equal(result.observations[0],data.human_latency_observations[0]);assert.equal(result.relations[0],data.bone_relations[0]);
});
test('bone reverse links preserve side and do not infer a contralateral identifier',()=>{
 assert.deepEqual(referenceRelations(data,'bones/0').links.map(r=>r.key),['parts/0']);assert.deepEqual(referenceRelations(data,'bones/1').links,[]);assert.deepEqual(referenceRelations(data,'bones/2').links,[]);assert.equal(referenceRelations(data,'bones/0').opposite,null);
});
test('invalid identities and absent optional metadata are safe',()=>{
 for(const key of ['parts/99','other/0','parts/-1','parts/0x'])assert.equal(referenceRelations(data,key),null);
 assert.deepEqual(referenceRelations({parts:[{id:'bare'}]},'parts/0'),{item:{id:'bare'},relations:[],links:[],opposite:null,observations:[]});
});
