#!/usr/bin/env node
// POLY sacrum audit: static safety gate; never interprets geometric proxies as anatomy.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const candidate=JSON.parse(fs.readFileSync(path.join(root,'recherches/sacrum/SACRUM_REPERES_CANDIDATS.json'),'utf8'));
const template=JSON.parse(fs.readFileSync(path.join(root,'recherches/sacrum/GABARIT_REPERES_ANATOMIQUES_VALIDATION.json'),'utf8'));
const errors=[];
const check=(v,msg)=>{if(!v)errors.push(msg)};
const n=candidate.numbers||{};
check(n.expert_homologies_validated===0,'Expert homologies must remain zero');
check(n.surrogate_candidates===11&&n.fit_points===7&&n.reserved_points===4,'Unexpected candidate partition');
check(n.independent_subjects===0,'Independent-subject status unexpectedly changed');
const l=template.requested_anatomical_landmarks||[];
check(l.length===12,'Expected 12 sacral anatomical targets');
for(const p of l){
 check(p.validated===false,'Unreviewed landmark promoted: '+p.code);
 check(p.bodyparts3d_FJ3393_xyz===null&&p.Z_sacrum_xyz===null,'Unreviewed coordinates populated: '+p.code);
}
const metrics=candidate.heldout_lumbar_surface_effect||{};
for(const level of ['L2','L4','L5']){
 const x=metrics[level]||{};
 const before=x.initial_shared_surface_fit?.one_way_vertex_rms;
 const after=x.landmark_candidate_fit?.one_way_vertex_rms;
 check(Number.isFinite(before)&&Number.isFinite(after)&&after>before,level+' regression not reproduced');
 if(Number.isFinite(before)&&Number.isFinite(after))console.log(level+': '+before.toFixed(6)+' -> '+after.toFixed(6)+' (x'+(after/before).toFixed(2)+')');
}
const scope=JSON.parse(fs.readFileSync(path.join(root,'PUBLICATION_SCOPE.json'),'utf8'));
check(scope.sacrum_landmarks?.new_skeletal_transform_applied===false,'Candidate transform appears applied');
check(scope.sacrum_landmarks?.homologues_verified===0,'Scope claims verified homologues');
if(errors.length){for(const e of errors)console.error('FAIL '+e);process.exitCode=1}
else console.log('PASS: sacrum research remains unvalidated; rejected transform not promoted. This does NOT validate anatomy.');
