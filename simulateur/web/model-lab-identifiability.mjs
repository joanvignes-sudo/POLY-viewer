// Rank audit for a declared local linear observation operator, not global nonlinear identifiability.
export function auditLinearIdentifiability(parameterNames,matrix,{tolerance=1e-10}={}){
 if(!Array.isArray(parameterNames)||parameterNames.length<1||parameterNames.length>32||new Set(parameterNames).size!==parameterNames.length||parameterNames.some(x=>typeof x!=='string'||!x))throw Error('ModelLab: invalid parameter identifiers');
 const n=parameterNames.length;
 if(!Array.isArray(matrix)||matrix.length<1||matrix.length>64||matrix.some(row=>!Array.isArray(row)||row.length!==n||row.some(x=>!Number.isFinite(x))))throw Error('ModelLab: invalid observation matrix');
 if(!Number.isFinite(tolerance)||tolerance<=0||tolerance>0.001)throw Error('ModelLab: invalid tolerance');
 const a=matrix.map(r=>r.slice());let rank=0;
 for(let j=0;j<n&&rank<a.length;j++){
  let pivot=rank;for(let i=rank+1;i<a.length;i++)if(Math.abs(a[i][j])>Math.abs(a[pivot][j]))pivot=i;
  if(Math.abs(a[pivot][j])<=tolerance)continue;
  [a[rank],a[pivot]]=[a[pivot],a[rank]];
  const diag=a[rank][j];for(let k=j;k<n;k++)a[rank][k]/=diag;
  for(let i=0;i<a.length;i++)if(i!==rank){const f=a[i][j];for(let k=j;k<n;k++)a[i][k]-=f*a[rank][k];}
  rank++;
 }
 return {kind:'local_linear_observation_rank',parameters:n,independent_observations:rank,nullity:n-rank,
   locally_identifiable_from_operator:rank===n,tolerance,scope:'declared_linear_operator_only',
   explanation:rank<n?'Le nombre de directions non observables est '+(n-rank)+' : plusieurs valeurs des paramètres produisent la même observation linéaire.':'Rang complet de cet opérateur linéaire ; cela ne prouve pas l’identifiabilité d’un modèle non linéaire complet.'};
}
