// Minimal declarative compartmental ODE solver: dX/dt = Q X, fixed synthetic time.
// It exists to demonstrate model interchange, NOT to claim human kinetic validity.
export function validateLinearSystem(s){
 if(s?.schema!=='poly.model-lab.linear-system.v1')throw Error('ModelLab: linear schema');
 const n=s.states?.length;
 if(!Number.isInteger(n)||n<2||n>12||new Set(s.states).size!==n||s.states.some(x=>typeof x!=='string'||!x))throw Error('ModelLab: state names');
 if(!Array.isArray(s.initial_mmol)||s.initial_mmol.length!==n||s.initial_mmol.some(x=>!Number.isFinite(x)||x<0))throw Error('ModelLab: initial amounts');
 if(!Array.isArray(s.rate_matrix)||s.rate_matrix.length!==n||s.rate_matrix.some(row=>!Array.isArray(row)||row.length!==n||row.some(x=>!Number.isFinite(x))))throw Error('ModelLab: rate matrix');
 for(let j=0;j<n;j++){
  let colSum=0;
  for(let i=0;i<n;i++){
   const x=s.rate_matrix[i][j];
   if(i!==j&&x<0)throw Error('ModelLab: negative off-diagonal transfer');
   if(i===j&&x>0)throw Error('ModelLab: positive diagonal transfer');
   colSum+=x;
  }
  if(Math.abs(colSum)>1e-10)throw Error('ModelLab: rate matrix violates closed mass balance');
 }
 if(s.time_basis!=='synthetic_time'||s.time_end!==8||s.dt!==0.02||s.sample_every!==5)throw Error('ModelLab: unqualified time base');
 if(!s.states.includes(s.observed_state)||!Number.isFinite(s.observed_volume_L)||s.observed_volume_L<=0)throw Error('ModelLab: observation operator');
 return s;
}
const derivative=(x,q)=>q.map(row=>row.reduce((sum,a,j)=>sum+a*x[j],0));
const plus=(x,k,dx)=>x.map((v,i)=>v+k*dx[i]);
function rk4(x,dt,q){
 const a=derivative(x,q),b=derivative(plus(x,dt/2,a),q),c=derivative(plus(x,dt/2,b),q),d=derivative(plus(x,dt,c),q);
 return x.map((v,i)=>v+dt*(a[i]+2*b[i]+2*c[i]+d[i])/6);
}
export function runLinearModel(model){
 if(model.engine!=='linear-mass-balance'||model.status!=='runnable_synthetic')throw Error('ModelLab: invalid linear model');
 const s=validateLinearSystem(model.system),index=s.states.indexOf(s.observed_state),initialTotal=s.initial_mmol.reduce((a,b)=>a+b,0);
 let state=s.initial_mmol.slice(),maxResidual=0;const points=[],steps=Math.round(s.time_end/s.dt);
 for(let i=0;i<=steps;i++){
  const total=state.reduce((a,b)=>a+b,0);maxResidual=Math.max(maxResidual,Math.abs(total-initialTotal));
  if(state.some(x=>x< -1e-10||!Number.isFinite(x)))throw Error('ModelLab: negative or invalid state');
  if(i%s.sample_every===0)points.push({t:Number((i*s.dt).toFixed(8)),value:state[index]/s.observed_volume_L});
  if(i<steps)state=rk4(state,s.dt,s.rate_matrix);
 }
 return {schema:'poly.model-lab.series.v1',model_id:model.id,engine:model.engine,observable_id:model.observable.id,unit:model.observable.unit,time_basis:s.time_basis,points,
  verification:{max_invariant_residual:maxResidual,max_positive_net_times_affinity:null},
  scope:{synthetic:true,human_validation:false,independent_validation:false,biology_clock:null}};
}
