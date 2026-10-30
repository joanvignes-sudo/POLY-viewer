import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateModelRegistry,checkComparisonCompatibility} from '../web/model-lab-contract.mjs';
import {compareModels} from '../web/model-lab-compare.mjs';
import {runLinearModel,validateLinearSystem} from '../web/model-lab-linear-adapter.mjs';
import {runP8Profile} from '../web/model-lab-p8-adapter.mjs';
import {validateEvidenceSet,compareToEvidence} from '../web/model-lab-evidence.mjs';
import {auditLinearIdentifiability} from '../web/model-lab-identifiability.mjs';
const registry=JSON.parse(fs.readFileSync(new URL('../web/model-lab-registry.json',import.meta.url),'utf8'));
const get=id=>registry.models.find(m=>m.id===id);
const copy=v=>structuredClone(v);
test('registry validates and keeps source DOI and documentary models explicit',()=>{
 assert.equal(validateModelRegistry(registry),registry);
 assert.equal(registry.models.length,7);
 assert.equal(registry.sources.find(s=>s.id==='aubert-2005').doi,'10.1073/pnas.0505427102');
 assert.equal(get('aubert-2005').status,'documentary_only');
});
test('P8 control compared with reduced MCT scenario, only synthetic results',()=>{
 const report=compareModels(registry,'p8-control','p8-mct-reduced');
 assert.equal(report.status,'compared_synthetic');
 assert.equal(report.time_basis,'synthetic_time');
 assert.equal(report.unit,'mM');
 assert.equal(report.series.left.length,81);
 assert.equal(report.series.right.length,81);
 assert(report.metrics.max_absolute_difference>0);
 assert.equal(report.interpretation.independent_data_comparison,'not_performed');
 assert.equal(report.experimental_claim,false);
 assert(report.verification.left.max_invariant_residual<1e-7);
});
test('P8 pH scenario uses same interface, no automatic human time claims',()=>{
 const report=compareModels(registry,'p8-control','p8-ph-lowered');
 assert.equal(report.status,'compared_synthetic');
 assert.equal(report.interpretation.extrapolation_to_human,'forbidden');
 assert(report.metrics.max_absolute_difference>0);
});
test('declarative two-pool and three-pool models share observation contract, not topology',()=>{
 const report=compareModels(registry,'linear-two-pools','linear-three-pools');
 assert.equal(report.status,'compared_synthetic');
 assert.equal(report.interpretation.kind,'distinct_model_families');
 assert.equal(report.series.left[0].value,1);
 assert.equal(report.series.right[0].value,1);
 assert(report.metrics.max_absolute_difference>0);
 assert(report.verification.left.max_invariant_residual<1e-8);
 assert(report.verification.right.max_invariant_residual<1e-8);
});
test('no solver means explicit refusal, never a fabricated Aubert curve',()=>{
 const report=compareModels(registry,'p8-control','aubert-2005');
 assert.equal(report.status,'not_comparable');
 assert(report.reasons.some(x=>x.includes('solveur')));
 assert.equal(report.experimental_claim,false);
});
test('different biological preparations are not silently converted',()=>{
 const report=compareModels(registry,'aubert-2005','microglia-2026');
 assert.equal(report.status,'not_comparable');
 assert(report.reasons.some(x=>x.includes('Contexte incompatible')));
});
test('P8 and declarative reservoir matrices are not silently declared equivalent',()=>{
 const report=compareModels(registry,'p8-control','linear-two-pools');
 assert.equal(report.status,'not_comparable');
 assert(report.reasons.some(x=>x.includes('opérateurs')));
});
test('registry refuses forged validation and model-status promotion',()=>{
 const x=copy(registry);x.models[0].validation.human=true;
 assert.throws(()=>validateModelRegistry(x),/unqualified validation/);
 const y=copy(registry);y.models.find(m=>m.id==='aubert-2005').status='runnable_synthetic';
 assert.throws(()=>validateModelRegistry(y),/runnable model engine/);
});
test('registry refuses missing provenance and duplicate models',()=>{
 const x=copy(registry);x.models[0].source_ids=['made-up'];
 assert.throws(()=>validateModelRegistry(x),/provenance/);
 const y=copy(registry);y.models.push(copy(y.models[0]));
 assert.throws(()=>validateModelRegistry(y),/identifier/);
});
test('linear engine refuses fabricated matter creation, negative transfer and invalid time',()=>{
 const x=copy(get('linear-two-pools').system);x.rate_matrix[0][0]=-0.1;
 assert.throws(()=>validateLinearSystem(x),/mass balance/);
 const y=copy(get('linear-two-pools').system);y.rate_matrix[0][1]=-0.05;
 assert.throws(()=>validateLinearSystem(y),/negative off-diagonal/);
 const z=copy(get('linear-two-pools').system);z.time_basis='seconds';
 assert.throws(()=>validateLinearSystem(z),/time base/);
});
test('linear model can be declared and executed by changing metadata only',()=>{
 const m=copy(get('linear-two-pools'));m.id='synthetic-rate-variant';m.driver={id:'altered-rate',description:'Independent synthetic mass-balanced rate choice.'};
 m.system.rate_matrix=[[-0.3,0.08],[0.3,-0.08]];
 const x=runLinearModel(m),y=runLinearModel(get('linear-two-pools'));
 assert.notDeepEqual(x.points,y.points);
 assert.equal(x.scope.human_validation,false);
});
test('unknown identifiers, same profiles and unqualified resolution are rejected',()=>{
 assert.throws(()=>compareModels(registry,'p8-control','unknown'),/unknown model/);
 assert.throws(()=>compareModels(registry,'p8-control','p8-control'),/two different/);
 assert.throws(()=>compareModels(registry,'p8-control','p8-ph-lowered',{dt:0.03}),/unsupported P8 step/);
});
test('comparison does not mutate models, original P8 parameters or source inputs',()=>{
 const snapshot=JSON.stringify(registry);
 const first=compareModels(registry,'p8-control','p8-mct-reduced');
 const second=compareModels(registry,'p8-control','p8-mct-reduced');
 assert.deepEqual(first.metrics,second.metrics);
 assert.equal(JSON.stringify(registry),snapshot);
 assert.equal(runP8Profile(get('p8-control')).scope.biology_clock,null);
});
test('compatibility requires actual operator equality, not only equal labels',()=>{
 const left=get('linear-two-pools'),right=copy(get('linear-three-pools'));
 right.observable.operator='invented-normalization';
 assert.equal(checkComparisonCompatibility(left,right).compatible,false);
});

test('single total lactate observation cannot distinguish production sources and internal transfer',()=>{
 const r=auditLinearIdentifiability(['P_A','P_N','q'],[[1,1,0]]);
 assert.equal(r.independent_observations,1);
 assert.equal(r.nullity,2);
 assert.equal(r.locally_identifiable_from_operator,false);
 const full=auditLinearIdentifiability(['P_A','P_N','q'],[[1,0,0],[0,1,0],[0,0,1]]);
 assert.equal(full.nullity,0);
});
test('identifiability rejects malformed and non-finite observation operators',()=>{
 assert.throws(()=>auditLinearIdentifiability(['A','A'],[[1,1]]),/parameter/);
 assert.throws(()=>auditLinearIdentifiability(['A','B'],[[1,Infinity]]),/observation/);
 assert.throws(()=>auditLinearIdentifiability(['A'],[[1]],{tolerance:0}),/tolerance/);
});
test('a self-derived fixture may match exactly but is not independent validation',()=>{
 const m=get('p8-control'),traj=runP8Profile(m);
 const points=traj.points.slice(0,5).map(p=>({t:p.t,value:p.value,uncertainty:null}));
 const evidence={schema:'poly.model-lab.evidence.v1',id:'fixture-self-derived',origin:'synthetic_fixture',
  scope:copy(m.scope),observable:copy(m.observable),provenance:{doi:null,fixture:true},independence_status:'reused_for_fitting',points};
 const fit=compareToEvidence(m,traj,evidence);
 assert.equal(fit.status,'descriptive_fit_only');
 assert.equal(fit.rmse,0);
 assert.equal(fit.validated,false);
 assert.equal(fit.independence_status,'reused_for_fitting');
 assert.equal(fit.claims.independent_biological_validation,false);
});
test('real observations with incompatible scope are refused even if numeric values match',()=>{
 const m=get('p8-control'),traj=runP8Profile(m);
 const e={schema:'poly.model-lab.evidence.v1',id:'fictional-study',origin:'published_extracted',
  scope:{...copy(m.scope),species:'mouse'},observable:copy(m.observable),
  provenance:{doi:'10.1234/demo-model',file_sha256:'a'.repeat(64),extraction_method:'manual'},independence_status:'unknown',
  points:traj.points.slice(0,3).map(p=>({t:p.t,value:p.value,uncertainty:null}))};
 assert.equal(validateEvidenceSet(e),e);
 const result=compareToEvidence(m,traj,e);
 assert.equal(result.status,'not_comparable');
 assert(result.reasons.some(x=>x.includes('Espèce')));
 assert.equal(result.validated,false);
});
test('evidence parser refuses missing provenance, unordered times and illegal uncertainty',()=>{
 const m=get('p8-control'),traj=runP8Profile(m);
 const e={schema:'poly.model-lab.evidence.v1',id:'synthetic-trial',origin:'synthetic_fixture',
  scope:copy(m.scope),observable:copy(m.observable),provenance:{doi:null,fixture:true},
  independence_status:'not_tested',points:traj.points.slice(0,3).map(p=>({t:p.t,value:p.value,uncertainty:null}))};
 const x=copy(e);x.points[1].t=x.points[0].t;
 assert.throws(()=>validateEvidenceSet(x),/ordered time/);
 const y=copy(e);y.points[0].uncertainty=-1;
 assert.throws(()=>validateEvidenceSet(y),/uncertainty/);
 const z=copy(e);z.origin='published_extracted';
 assert.throws(()=>validateEvidenceSet(z),/source DOI/);
});
test('UI contains clear local-import affordances and separate interpretation output',()=>{
 const html=fs.readFileSync(new URL('../web/model-lab.html',import.meta.url),'utf8');
 for(const id of ['registry-file','evidence-file','compare-evidence','identifiability','explanation'])assert(html.includes('id="'+id+'"'));
 assert(html.includes('branche non publiée'));
});
