// Evidence comparison is strictly descriptive, never automatic biological validation.
const valid=x=>typeof x==='string'&&x.trim().length>0&&x.length<500;
function requireIt(ok,msg){if(!ok)throw Error('ModelLab evidence: '+msg);}
export function validateEvidenceSet(o){
 requireIt(o?.schema==='poly.model-lab.evidence.v1'&&valid(o.id),'schema and id');
 requireIt(['synthetic_fixture','published_extracted'].includes(o.origin),'origin');
 for(const k of ['species','preparation','region','time_basis'])requireIt(valid(o.scope?.[k]),'scope '+k);
 for(const k of ['id','unit','operator'])requireIt(valid(o.observable?.[k]),'observable '+k);
 if(o.origin==='published_extracted'){
  requireIt(/^10\.\d{4,9}\/\S{2,120}$/.test(o.provenance?.doi),'source DOI');
  requireIt(/^[a-f0-9]{64}$/.test(o.provenance?.file_sha256),'source fingerprint');
  requireIt(valid(o.provenance?.extraction_method),'extraction method');
 }else requireIt(o.provenance?.doi===null&&o.provenance?.fixture===true,'synthetic evidence must be identified as such');
 requireIt(['not_tested','declared_independent','reused_for_fitting','unknown'].includes(o.independence_status),'independence declaration');
 requireIt(Array.isArray(o.points)&&o.points.length>=2&&o.points.length<=10000,'point count');
 let previous=-Infinity;
 for(const p of o.points){
  requireIt(typeof p.t==='number'&&Number.isFinite(p.t)&&p.t>previous,'ordered time');
  requireIt(p.value===null||typeof p.value==='number'&&Number.isFinite(p.value),'observed value or explicit missing');
  requireIt(p.uncertainty===null||typeof p.uncertainty==='number'&&Number.isFinite(p.uncertainty)&&p.uncertainty>=0,'uncertainty value or explicit missing');
  previous=p.t;
 }
 return o;
}
export function compareToEvidence(model,trajectory,raw){
 const o=validateEvidenceSet(raw),reasons=[];
 if(model.scope.species!==o.scope.species||model.scope.preparation!==o.scope.preparation||model.scope.region!==o.scope.region||model.scope.time_basis!==o.scope.time_basis)reasons.push('Espèce, préparation, région ou horloge incompatibles.');
 if(model.observable.id!==o.observable.id||model.observable.unit!==o.observable.unit||model.observable.operator!==o.observable.operator)reasons.push('Observable ou opérateur de mesure non équivalent.');
 if(trajectory.model_id!==model.id||trajectory.unit!==o.observable.unit||trajectory.time_basis!==o.scope.time_basis)reasons.push('La trajectoire provient d’un autre modèle ou d’une autre unité.');
 const grid=new Map(trajectory.points.map(p=>[p.t,p.value]));
 if(o.points.some(p=>!grid.has(p.t)))reasons.push('L’horloge des mesures ne correspond pas aux sorties ; aucune interpolation implicite.');
 if(reasons.length)return {status:'not_comparable',reasons,validated:false};
 const pairs=o.points.filter(p=>p.value!==null).map(p=>({t:p.t,observed:p.value,predicted:grid.get(p.t),uncertainty:p.uncertainty}));
 if(pairs.length<2)return {status:'insufficient_observations',reasons:['Moins de deux observations numériques comparables.'],validated:false};
 const residuals=pairs.map(p=>({...p,residual:p.predicted-p.observed}));
 const rmse=Math.sqrt(residuals.reduce((sum,p)=>sum+p.residual*p.residual,0)/residuals.length);
 const mae=residuals.reduce((sum,p)=>sum+Math.abs(p.residual),0)/residuals.length;
 return {status:'descriptive_fit_only',evidence_id:o.id,observations:residuals.length,missing:o.points.length-residuals.length,rmse,mae,
  origin:o.origin,independence_status:o.independence_status,uncertainty_coverage:residuals.filter(p=>p.uncertainty!==null).length,
  validated:false,claims:{causal_inference:false,statistical_significance:false,independent_biological_validation:false},
  interpretation:'Écarts descriptifs uniquement. Une valeur proche ne démontre pas le mécanisme ; absence de calibration ou de test statistique automatique.'};
}
