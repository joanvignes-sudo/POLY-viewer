// Explicit, read-only adapter for the EXISTING P8 solver. No calibration or parameter fit.
import {runP8,P8_MODEL} from './reversible-lactate-core.mjs';
export const P8_ENGINE='p8';
const allowed=new Set(P8_MODEL.cases);
export function runP8Profile(model,options={}){
 if(model.engine!==P8_ENGINE||!allowed.has(model.scenario)||model.version!==P8_MODEL.version||model.observable?.id!=='extracellular-lactate'||model.observable?.unit!=='mM'||model.observable?.operator!=='lactate-E-mmol-over-volume-L')throw Error('ModelLab: unsupported or relabeled P8 profile');
 const dt=options.dt??0.02;
 if(![0.02,0.01,0.005].includes(dt))throw Error('ModelLab: unsupported P8 step');
 const result=runP8({schema:'poly.p8.request.v1',dt});
 if(result.scope.human_validation!==false||result.scope.human_clock!==null)throw Error('ModelLab: model scope changed unexpectedly');
 const v=P8_MODEL.volume_L.E;
 const points=result.series[model.scenario].map(row=>({t:row.t,value:row.state[5]/v}));
 if(points.some(p=>!Number.isFinite(p.t)||!Number.isFinite(p.value)||p.value<0))throw Error('ModelLab: invalid P8 output');
 return {schema:'poly.model-lab.series.v1',model_id:model.id,engine:P8_ENGINE,observable_id:model.observable.id,unit:'mM',time_basis:'synthetic_time',points,verification:{max_invariant_residual:result.receipt.max_invariant_residual,max_positive_net_times_affinity:result.receipt.max_positive_net_times_affinity},scope:{synthetic:true,human_validation:false,independent_validation:false,biology_clock:null}};
}
