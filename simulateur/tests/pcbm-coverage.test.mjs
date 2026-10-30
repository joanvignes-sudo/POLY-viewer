import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validatePCBMCoverage,filterPCBMCoverage} from '../web/pcbm-coverage.mjs';
const ref=JSON.parse(readFileSync(new URL('../data/inventaire-multiechelle.json',import.meta.url),'utf8'));
const fresh=()=>structuredClone(ref);
test('canonical topics remain explicit research candidates',()=>{
 const c=validatePCBMCoverage(fresh());
 assert.equal(c.topic_count,100);assert.equal(c.family_count,16);
 assert.equal(c.incomplete,true);assert.equal(c.scientific_validation_claimed,false);
 assert.ok(c.entries.every(x=>x.status==='candidate_to_document'&&x.evidence_count===0&&!x.runtime_model&&!x.qualified_registration));
});
test('filter inventory by family and accent-insensitive research terms',()=>{
 const c=validatePCBMCoverage(fresh());
 assert.equal(filterPCBMCoverage(c).length,100);
 assert.ok(filterPCBMCoverage(c,{query:'metaboli'}).some(x=>/métaboli/i.test(x.topic)));
 const chosen='Anatomie et compartiments';
 assert.ok(filterPCBMCoverage(c,{family:chosen}).every(x=>x.family===chosen));
 assert.throws(()=>filterPCBMCoverage(c,{family:'Invented'}),/unknown family/);
});
test('reject unreviewed promotions, geometry, evidence and duplicate identities',()=>{
 const cases=[
  [r=>r.entries.push(structuredClone(r.entries[0])),/repeated topic/],
  [r=>r.entries[0].status='validated',/promoted/],
  [r=>r.entries[0].runtime_model=true,/promoted/],
  [r=>r.entries[0].evidence_ids=['DOI:example'],/unreviewed scientific evidence/],
  [r=>r.entries[0].anatomical_registration={matrix:[]},/unreviewed parameters/],
  [r=>r.entries[0].parameters={value:1},/unreviewed parameters/],
  [r=>r.exhaustive=true,/bounded incomplete inventory/],
  [r=>r.entries[0].missing=[],/missing qualification rules/]
 ];
 for(const [edit,error] of cases){const x=fresh();edit(x);assert.throws(()=>validatePCBMCoverage(x),error)}
});
test('coverage cannot be confused with a graph of causal models',()=>{
 const c=validatePCBMCoverage(fresh());
 assert.equal(c.entries.reduce((n,e)=>n+e.evidence_count,0),0);
 assert.equal(c.entries.filter(e=>e.runtime_model||e.qualified_registration).length,0);
});
