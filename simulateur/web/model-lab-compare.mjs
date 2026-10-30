// POLY ModelLab: same-observable comparisons with explicit refusals and boundaries.
import {validateModelRegistry,checkComparisonCompatibility} from './model-lab-contract.mjs';
import {runP8Profile} from './model-lab-p8-adapter.mjs';
import {runLinearModel} from './model-lab-linear-adapter.mjs';
const adapters=Object.freeze({p8:runP8Profile,'linear-mass-balance':runLinearModel});
function finitePoints(s){
 if(s?.schema!=='poly.model-lab.series.v1'||!Array.isArray(s.points)||s.points.length<2||s.points.length>10001||s.points.some(p=>!Number.isFinite(p.t)||!Number.isFinite(p.value)))throw Error('ModelLab: invalid or missing trajectory');
 for(let i=1;i<s.points.length;i++)if(s.points[i].t<=s.points[i-1].t)throw Error('ModelLab: unordered time axis');
}
export function compareModels(registry,leftId,rightId,{dt=0.02}={}){
 validateModelRegistry(registry);
 const left=registry.models.find(m=>m.id===leftId),right=registry.models.find(m=>m.id===rightId);
 if(!left||!right)throw Error('ModelLab: unknown model identifier');
 if(left.id===right.id)throw Error('ModelLab: choose two different configurations');
 const check=checkComparisonCompatibility(left,right);
 if(!check.compatible)return {status:'not_comparable',reasons:check.reasons,left:left.id,right:right.id,experimental_claim:false};
 if(!adapters[left.engine]||!adapters[right.engine])return {status:'not_executable',reasons:['Aucun adaptateur de solveur contrôlé pour au moins un modèle.'],experimental_claim:false};
 const a=adapters[left.engine](left,{dt}),b=adapters[right.engine](right,{dt});
 finitePoints(a);finitePoints(b);
 if(a.observable_id!==b.observable_id||a.unit!==b.unit||a.time_basis!==b.time_basis||a.points.length!==b.points.length)throw Error('ModelLab: different solver output contracts');
 const differences=[];
 for(let i=0;i<a.points.length;i++){
  const p=a.points[i],q=b.points[i];
  if(Math.abs(p.t-q.t)>1e-10)throw Error('ModelLab: time grids differ; no implicit interpolation');
  differences.push({t:p.t,delta:q.value-p.value});
 }
 const maxPoint=differences.reduce((best,p)=>Math.abs(p.delta)>Math.abs(best.delta)?p:best,differences[0]);
 const last=differences.at(-1),first=differences[0];
 let absoluteArea=0;for(let i=1;i<differences.length;i++){
  const p=differences[i-1],q=differences[i];absoluteArea+=(q.t-p.t)*(Math.abs(q.delta)+Math.abs(p.delta))/2;
 }
 const sameFamily=left.family===right.family;
 const interpret={
  kind:sameFamily?'parameter_or_boundary_scenario':'distinct_model_families',
  differs_in:[left.driver.description,right.driver.description],
  conclusion:'La différence de courbe est une conséquence des conditions déclarées dans les équations du solveur ; elle ne démontre pas un mécanisme biologique.',
  identifiability:'not_evaluated',
  calibration:'none',
  independent_data_comparison:'not_performed',
  extrapolation_to_human:'forbidden',
  evidence:'synthetic_trajectory_only'
 };
 return {status:'compared_synthetic',left:left.id,right:right.id,observable:left.observable.id,unit:a.unit,time_basis:a.time_basis,
  series:{left:a.points,right:b.points},differences,metrics:{max_absolute_difference:Math.abs(maxPoint.delta),time_of_max_difference:maxPoint.t,delta_at_start:first.delta,delta_at_end:last.delta,integral_absolute_difference_synthetic_time:absoluteArea},verification:{left:a.verification,right:b.verification},
  interpretation:interpret,experimental_claim:false};
}
