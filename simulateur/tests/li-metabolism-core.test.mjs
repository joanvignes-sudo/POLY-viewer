import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateLiTable,arithmeticAudit,sampleStats,selectRates,ratioAerobicGlycolysis,conditionalLactateScenario,TISSUES,VARIABLES} from '../web/li-metabolism-core.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../data/li-2025-table1.json',import.meta.url),'utf8'));
test('source, schema, units and five independent subject identities are retained',()=>{
 assert.equal(validateLiTable(data),data);
 assert.equal(data.source.doi,'10.1093/pnasnexus/pgaf072');
 assert.equal(data.source.unit,'µmol/g/min');
 assert.equal(data.subjects.length,5);
 assert.equal(data.subjects.length*3*4,60);
 assert.equal(new Set(data.subjects.map(s=>s.id)).size,5);
});
test('12 means and sample standard deviations reproduce published two-decimal Table 1 summaries',()=>{
 const audit=arithmeticAudit(data);
 assert.equal(audit.rows.length,12);
 assert.equal(audit.all_pass,true);
 for(const row of audit.rows){
  assert.equal(row.pass,true,row.tissue+'/'+row.variable);
  assert.equal(row.n,5);
 }
 assert.equal(sampleStats([0,2]).sd,Math.SQRT2);
});
test('tissue / subject selection never silently interpolates or extrapolates an individual',()=>{
 assert.equal(selectRates(data,'GM','02').CMRGlc,.60);
 assert.equal(selectRates(data,'WM','03').CMRLac,.09);
 assert.ok(Math.abs(selectRates(data,'WB','mean').CMRLac-.132)<1e-12);
 assert.throws(()=>selectRates(data,'INVALID','mean'),/tissue/);
 assert.throws(()=>selectRates(data,'WM','99'),/participant/);
});
test('aerobic glycolysis is an explicit production/glucose-derived ratio, not an ATP measurement',()=>{
 const gm=selectRates(data,'GM','mean');
 assert.ok(Math.abs(ratioAerobicGlycolysis(gm)-(.148/(2*.468)))<1e-12);
 assert.throws(()=>ratioAerobicGlycolysis({CMRGlc:0,CMRLac:.1}),/ratio/);
});
test('model-only internal transfer cancels exactly from tissue-level output',()=>{
 for(const tissue of TISSUES)for(const subject of ['mean','01','02','03','04','05'])for(const alpha of [0,.2,.6,1])for(const beta of [0,.4,1]){
  const r=conditionalLactateScenario(data,{tissue,subject,alpha,beta});
  const m=r.model_only;
  assert.ok(Math.abs(m.balance_residual)<1e-12,tissue+'/'+subject);
  assert.ok(m.assumed_internal_transfer>=0&&m.assumed_internal_transfer<=m.astrocyte_production+1e-12);
  assert.ok(Math.abs(m.astrocyte_remaining+m.neuronal_pool_contribution-r.observables.CMRLac)<1e-12);
  assert.equal(r.identifiability.transfer_observed,false);
 }
});
test('distinct internal shuttle fluxes produce same tissue-level estimate: non-identifiability witness',()=>{
 const a=conditionalLactateScenario(data,{tissue:'WB',subject:'mean',alpha:.5,beta:0});
 const b=conditionalLactateScenario(data,{tissue:'WB',subject:'mean',alpha:.5,beta:1});
 assert.equal(a.observables.CMRLac,b.observables.CMRLac);
 assert.equal(a.model_only.assumed_internal_transfer,0);
 assert.ok(b.model_only.assumed_internal_transfer>0);
 assert.equal(b.identifiability.independent_parameters_not_identified,2);
});
test('refuse non-finite, out-of-domain or corrupted evidence',()=>{
 for(const value of [NaN,Infinity,-.01,1.01])assert.throws(()=>conditionalLactateScenario(data,{alpha:value}),/share/);
 assert.throws(()=>conditionalLactateScenario(data,{beta:-.1}),/share/);
 const other=structuredClone(data);other.subjects[0].GM.CMRLac=null;
 assert.throws(()=>validateLiTable(other),/Missing or invalid/);
 const wrong=structuredClone(data);wrong.source.doi='other';
 assert.throws(()=>validateLiTable(wrong),/source/);
});
