import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyAffine4,applyPCBMMatrix,auditPCBMRegistration,composePCBMRegistrations} from '../web/pcbm-registration.mjs';
import {validatePCBM,planPCBM,PCBMReceipt} from '../web/pcbm-core.mjs';
import {readFileSync} from 'node:fs';
const h='a'.repeat(64),k='b'.repeat(64);
const from={id:'frame-a',unit:'mm'},to={id:'frame-b',unit:'mm'};
const sources=new Map([['independent-human-review',{id:'independent-human-review',verification:'source_read'}]]);
const M=[1,0,0,10, 0,1,0,-3, 0,0,1,2, 0,0,0,1];
const landmarks=[[0,0,0],[10,0,0],[0,10,0],[0,0,10],[2,3,4]];
const fresh=()=>({
 status:'independently_validated',from_frame:from.id,to_frame:to.id,
 matrix4x4:[...M],matrix_convention:'row_major_column_vector',
 error_bound:0.001,error_unit:'mm',method:'Independent held-out point registration',
 source_ids:['independent-human-review'],fit_dataset_sha256:h,validation_dataset_sha256:k,
 review:{status:'HUMAN_APPROVED',reviewer_id:'reviewer-laboratory',date:'2026-10-30'},
 holdout_landmarks:landmarks.map((p,i)=>({id:'held-out-'+i,from_xyz_mm:p,to_xyz_mm:[p[0]+10,p[1]-3,p[2]+2]}))
});
const audit=(t=fresh())=>auditPCBMRegistration({registration:t,from,to,sources});
test('synthetic independent numerical holdout passes only as a mathematical audit',()=>{
 const result=audit();
 assert.equal(result.landmarks,5);assert.ok(result.held_out_max_mm<1e-10);
 assert.equal(result.numerical_check,'passed_not_anatomical_proof');
 assert.equal(result.dataset_independence_verified_by_software,false);
 assert.deepEqual(applyPCBMMatrix(M,[2,3,4]),[12,0,6]);
});
test('rejects corrupt homogeneous matrix, singular and unbounded mapping',()=>{
 for(const [i,v]of [[12,1],[15,0],[0,0]]){
  const t=fresh();t.matrix4x4[i]=v;
  assert.throws(()=>audit(t),/matrix must be affine|degenerate spatial/);
 }
 const x=fresh();x.matrix4x4[0]=1e7;
 assert.throws(()=>audit(x),/unbounded spatial scale/);
});
test('held-out landmarks must span 3D, not a plane or line',()=>{
 const t=fresh();t.holdout_landmarks=t.holdout_landmarks.map((p,i)=>({...p,from_xyz_mm:[i,i,0],to_xyz_mm:[i+10,i-3,2]}));
 assert.throws(()=>audit(t),/coplanar or degenerate/);
});
test('underreported residuals are rejected instead of hidden in rendering',()=>{
 const t=fresh();t.holdout_landmarks[0].to_xyz_mm[0]+=.15;
 assert.throws(()=>audit(t),/residual exceeds claimed bound/);
 const u=fresh();u.holdout_landmarks[0].from_xyz_mm[0]+=0.15;
 assert.throws(()=>audit(u),/residual exceeds claimed bound/);
});
test('independent datasets, human review and mm units are required',()=>{
 const t=fresh();t.validation_dataset_sha256=h;
 assert.throws(()=>audit(t),/distinct checksums/);
 const u=fresh();u.review.status='AUTO_APPROVED';
 assert.throws(()=>audit(u),/human review/);
 assert.throws(()=>auditPCBMRegistration({registration:fresh(),from:{...from,unit:'unitless'},to,sources}),/millimetric frames/);
});
test('independent numerical audit cannot bridge SPARC SSV and MNI',()=>{
 const t=fresh();t.from_frame='sparc-f002-ssv';
 assert.throws(()=>auditPCBMRegistration({registration:t,from:{id:'sparc-f002-ssv',unit:'unitless'},to,sources}),/millimetric frames/);
});
test('composition multiplies matrices and propagates conservative bounded uncertainty',()=>{
 const A={from_frame:'a',to_frame:'b',specimen_id:'synthetic-1',unit:'mm',numerically_audited:true,matrix4x4:M,error_bound_mm:.2};
 const B={from_frame:'b',to_frame:'c',specimen_id:'synthetic-1',unit:'mm',numerically_audited:true,matrix4x4:[2,0,0,1,0,2,0,0,0,0,2,-1,0,0,0,1],error_bound_mm:.3};
 const C=composePCBMRegistrations(A,B);
 assert.deepEqual(applyPCBMMatrix(C.matrix4x4,[2,3,4]),[25,0,11]);
 assert.ok(Math.abs(C.error_bound_mm-.7)<1e-12);
 assert.equal(C.landmark_identity_proven,false);assert.equal(C.biological_time,null);
 assert.throws(()=>composePCBMRegistrations(A,{...B,from_frame:'wrong'}),/consecutive/);
 assert.throws(()=>composePCBMRegistrations(A,{...B,specimen_id:'synthetic-2'}),/across specimens/);
 assert.throws(()=>composePCBMRegistrations({...A,numerically_audited:false},B),/only audited/);
});
test('receipt rejects fabricated or reordered links',()=>{
 const reg=JSON.parse(readFileSync(new URL('../web/pcbm-registry.json',import.meta.url),'utf8'));
 const m=validatePCBM(reg),route=planPCBM(m,'body-hra','metabolic-network');
 assert.equal(PCBMReceipt(m,route).steps.length,9);
 assert.throws(()=>PCBMReceipt(m,{ids:['body-hra','brain-cerebra'],links:[]}),/cardinality/);
 assert.throws(()=>PCBMReceipt(m,{ids:['body-hra','metabolic-network'],links:[route.links[0]]}),/connection inconsistent/);
 assert.throws(()=>PCBMReceipt(m,{ids:['body-hra','brain-cerebra'],links:[{...route.links[0]}]}),/connection inconsistent/);
});
test('fixture with arbitrary independently validated flag cannot bypass actual audit',()=>{
 const reg=JSON.parse(readFileSync(new URL('../web/pcbm-registry.json',import.meta.url),'utf8'));
 reg.links[0].mode='spatial';
 reg.links[0].registration={status:'independently_validated',from_frame:'hra-display',to_frame:'mni-cerebra',matrix4x4:M,error_bound:0,error_unit:'mm',method:'Unvalidated synthetic demo',source_ids:['hra-catalog']};
 assert.throws(()=>validatePCBM(reg),/distinct or unknown specimens/);
});
