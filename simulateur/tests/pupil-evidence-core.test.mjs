import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validatePupilChain,validatePupilObserved,descriptiveEventWindow,pupilEvidenceReceipt} from '../web/pupil-evidence-core.mjs';
const chain=JSON.parse(fs.readFileSync(new URL('../data/pupil-reflex-documentary.json',import.meta.url),'utf8'));
const observed=JSON.parse(fs.readFileSync(new URL('../web/observations-lumiere.json',import.meta.url),'utf8'));
test('human subject, license, units, native clock and 11-node documentary graph are explicit',()=>{
 assert.equal(validatePupilChain(chain),chain);
 assert.equal(validatePupilObserved(observed,chain),observed);
 assert.equal(chain.nodes.length,11);
 assert.equal(chain.edges.length,10);
 assert.equal(observed.subject,'01');
 assert.equal(observed.events.length,49);
 assert.equal(observed.license,'CC BY 4.0');
 assert.equal(chain.experiment.measurement_unit,'mm');
 assert.equal(chain.experiment.stimulus_unit,'lux');
 for(const e of chain.edges)assert.equal(e.latency_s,null);
});
test('source 590mm vs publication 700mm discrepancy and unresolved mapping remain',()=>{
 assert.deepEqual([chain.constraints.screen_distance_file_mm,chain.constraints.screen_distance_publication_mm],[590,700]);
 assert.equal(chain.constraints.screen_distance_discrepancy_resolved,false);
 assert.equal(chain.constraints.session_to_publication_blocks_mapping,null);
 assert.equal(chain.constraints.world_time_alignment,false);
 assert.equal(chain.constraints.individual_neural_activity,false);
});
test('event 4 contains nominal lux, observed human values and separated pre/post windows',()=>{
 const record=descriptiveEventWindow(observed,chain,4);
 assert.equal(record.schema,'poly.pupil-descriptive-window.v1');
 assert.equal(record.event.index,4);
 assert.equal(record.event.nominal_illuminance_lux,5.3);
 assert.ok(record.event.recording_time_s>58&&record.event.recording_time_s<58.1);
 assert.equal(record.before.end_s,record.event.recording_time_s);
 assert.equal(record.after.start_s,record.event.recording_time_s);
 for(const interval of [record.before,record.after]){
  assert.ok(interval.possible_samples>=interval.observed_samples);
  assert.ok(interval.coverage_fraction>=0&&interval.coverage_fraction<=1);
  if(interval.weighted_mean_mm!==null)assert.ok(Number.isFinite(interval.weighted_mean_mm));
 }
 assert.equal(record.neural_impulses,null);
 assert.equal(record.neural_delay_s,null);
 assert.equal(record.avatar_event_time_s,null);
});
test('no value invented for empty or partly missing windows and no interpolation',()=>{
 const d=structuredClone(observed);
 const t=d.events.find(e=>e.event_index===4).time_recording_s;
 for(const b of d.bins)if(b.t>=t-1-1e-8&&b.end<=t+2+1e-8){
  b.observed=0;b.mean=null;b.min=null;b.max=null;
 }
 assert.equal(validatePupilObserved(d,chain),d);
 const e=descriptiveEventWindow(d,chain,4);
 assert.equal(e.before.weighted_mean_mm,null);
 assert.equal(e.after.weighted_mean_mm,null);
 assert.equal(e.descriptive_delta_mm,null);
});
test('bin-level means are weighted by actually observed sample counts',()=>{
 const e=descriptiveEventWindow(observed,chain,4);
 const t=e.event.recording_time_s;
 for(const [window,start,end] of [[e.before,t-1,t],[e.after,t,t+2]]){
  const bins=observed.bins.filter(b=>b.t>=start-1e-8&&b.end<=end+1e-8);
  const count=bins.reduce((acc,b)=>acc+b.observed,0),possible=bins.reduce((acc,b)=>acc+b.n,0);
  assert.equal(window.observed_samples,count);
  assert.equal(window.possible_samples,possible);
  if(window.sufficient_coverage){
   const weighted=bins.reduce((acc,b)=>acc+(b.observed?b.mean*b.observed:0),0)/count;
   assert.ok(Math.abs(window.weighted_mean_mm-weighted)<1e-12);
  }
 }
});
test('receipt has source and scope, not a neural simulation or intervention',()=>{
 const result=pupilEvidenceReceipt(observed,chain,4);
 assert.equal(result.graph.documentary_nodes.length,11);
 assert.equal(result.graph.unlocated_edges,10);
 assert.equal(result.observation.subject,'01');
 assert.equal(result.limitations.latency_measured,false);
 assert.equal(result.limitations.individual_anatomical_registration,false);
 assert.equal(result.limitations.causal_effect_estimated,false);
 assert.deepEqual(result.limitations.known_screen_distance_discrepancy_mm,[590,700]);
 assert.equal(result.observation.neural_delay_s,null);
});
test('fail closed on altered subject, processed source identity, invented neural delays or physiological claims',()=>{
 const d=structuredClone(observed);d.source_member_sha256='0'.repeat(64);
 assert.throws(()=>validatePupilObserved(d,chain),/empreinte/i);
 const subject=structuredClone(observed);subject.subject='02';
 assert.throws(()=>validatePupilObserved(subject,chain),/associ|identit/i);
 const latency=structuredClone(chain);latency.edges[0].latency_s=0.2;
 assert.throws(()=>validatePupilChain(latency),/latence/i);
 const physiological=structuredClone(chain);physiological.constraints.causal_identification=true;
 assert.throws(()=>validatePupilChain(physiological),/Portée/);
 const changed=structuredClone(chain);changed.constraints.screen_distance_discrepancy_resolved=true;
 assert.throws(()=>validatePupilChain(changed),/Désaccord/);
 const misrepresented=structuredClone(chain);misrepresented.edges[3].status='measured_experimental_nerve_delay';
 assert.throws(()=>validatePupilChain(misrepresented),/surqualifiée/i);
 assert.throws(()=>descriptiveEventWindow(observed,chain,999),/absent/);
});
