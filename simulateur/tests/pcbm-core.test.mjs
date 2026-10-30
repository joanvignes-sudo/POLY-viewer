import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validatePCBM,planPCBM,classifyPCBM,createPCBMNavigator,PCBMReceipt} from '../web/pcbm-core.mjs';
const original=JSON.parse(readFileSync(new URL('../web/pcbm-registry.json',import.meta.url),'utf8'));
const fresh=()=>structuredClone(original);
const invalid=(change,message)=>{const r=fresh();change(r);assert.throws(()=>validatePCBM(r),new RegExp(message))};
test('all nine representations and eight edges are qualified and reachable',()=>{
 const m=validatePCBM(fresh()),path=planPCBM(m,m.registry.entry_id,m.registry.goal_id);
 assert.equal(m.nodes.size,9);assert.equal(m.links.size,8);assert.equal(path.ids.length,9);
 assert.equal(path.ids[0],'body-hra');assert.equal(path.ids.at(-1),'metabolic-network');
 assert.equal(path.links.filter(l=>l.mode==='spatial').length,0);
 for(const link of path.links){const t=classifyPCBM(m,link);assert.equal(t.spatially_continuous,false);assert.equal(t.elapsed_biological_seconds,null);assert.equal(t.anatomical_registration,null)}
});
test('explicit frames preserve mm, display units, SSV and conceptual positions',()=>{
 const m=validatePCBM(fresh());
 assert.equal(m.frames.get('mni-cerebra').unit,'mm');
 assert.equal(m.frames.get('sparc-f002-ssv').unit,'unitless');
 assert.equal(m.frames.get('hra-display').unit,'display_unit');
 assert.equal(m.frames.get('molecular-diagram').unit,'none');
});
test('source or relation duplication fails closed',()=>{
 invalid(r=>r.nodes.push(structuredClone(r.nodes[0])),'duplicated');
 invalid(r=>r.links[0].source_ids.push('nonexistent'),'sources absent');
 invalid(r=>r.links[0].to='no-such-node','endpoints');
});
test('forbid fabricated spatial joins even with a plausible matrix',()=>{
 invalid(r=>{r.links[0].mode='spatial'},'spatial transform unvalidated');
 invalid(r=>{r.links[0].mode='spatial';r.links[0].registration={status:'independently_validated',from_frame:'hra-display',to_frame:'mni-cerebra',source_ids:['hra-catalog'],matrix4x4:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],method:'arbitrary affine',error_bound:1,error_unit:'mm'}},'distinct or unknown specimens');
 invalid(r=>{r.links[0].registration={status:'independently_validated'}},'fabricated registration');
});
test('no SSV lengths, invalid frames or atlas claims',()=>{
 invalid(r=>{r.frames.find(f=>f.id==='sparc-f002-ssv').unit='mm'},'normalized coordinate');
 invalid(r=>{r.nodes.find(n=>n.id==='vagus-f002').order_exponent_m=100},'invalid illustrative scale');
 invalid(r=>{r.nodes.find(n=>n.id==='brain-cerebra').frame_id='missing'},'node frame');
 invalid(r=>{r.experimental=false},'publication or spatial');
});
test('do not expose unmounted or hostile viewer links',()=>{
 invalid(r=>{r.nodes.find(n=>n.id==='vagus-f002').href='cerveau.html'},'presented as local viewer');
 invalid(r=>{r.nodes.find(n=>n.id==='body-hra').href='https://example.com'},'viewer route not local');
 invalid(r=>{r.sources[0].path='../private.txt'},'unsafe source path');
});
test('structural evidence cannot become an unsupported assumption',()=>{
 invalid(r=>{r.links[0].evidence_status='unknown'},'unsupported structural');
 invalid(r=>{r.links[2].relationship='contains'},'containment downgraded');
});
test('route selection rejects absent nodes and permits same-point plan',()=>{
 const m=validatePCBM(fresh());
 assert.deepEqual(planPCBM(m,'brain-cerebra','brain-cerebra'),{ids:['brain-cerebra'],links:[]});
 assert.equal(planPCBM(m,'metabolic-network','body-hra'),null);
 assert.throws(()=>planPCBM(m,'missing','body-hra'),/unknown route endpoints/);
});
test('navigation history preserves explicit selections without mutating the registry',()=>{
 const m=validatePCBM(fresh()),n=createPCBMNavigator(m);
 n.visit('brain-cerebra');n.visit('vagus-concepts');
 assert.equal(n.back().current,'brain-cerebra');
 assert.equal(n.forward().current,'vagus-concepts');
 assert.equal(n.back().current,'brain-cerebra');
 assert.equal(n.visit('vagus-f002').can_forward,false);
 assert.equal(m.nodes.get('vagus-f002').href,null);
});
test('export receipt preserves provenance and never claims alignment or physiology',()=>{
 const m=validatePCBM(fresh()),route=planPCBM(m,m.registry.entry_id,m.registry.goal_id),receipt=PCBMReceipt(m,route);
 assert.equal(receipt.spatial_transformations_applied,0);assert.equal(receipt.biological_time_inferred,false);
 assert.equal(receipt.steps[4].frame_id,'sparc-f002-ssv');
 assert.equal(receipt.steps[4].scale_basis,'illustrative_only');
 assert.equal(receipt.steps[4].incoming.spatially_continuous,false);
 assert.ok(receipt.steps.every(s=>s.source_ids.length&&s.incoming?.elapsed_biological_seconds===null||s.incoming===null));
});
