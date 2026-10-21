/* POLY isolated Hodgkin-Huxley 1952 squid giant axon membrane demonstrator.
   Units: mV, ms, uA/cm², mS/cm², uF/cm²; V absolute with resting -65 mV.
   This is NOT a human-neuron model, nor propagation along an axon.
   Parameter conventions from NEURON hh.mod (squid, reference temperature 6.3 °C).
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object' && module.exports)module.exports=api;
 else root.PolyHH=factory();
})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 const P=Object.freeze({gNa:120,gK:36,gL:0.3,ENa:50,EK:-77,EL:-54.3,Cm:1,temperature_C:6.3,
   source:'https://github.com/neuronsimulator/nrn/blob/master/src/nrnoc/hh.mod',
   organism:'Loligo (squid giant axon)',preparation:'isolated squid axon'});
 function xOverExpm1(x){
   if(Math.abs(x)<1e-5)return 1-x/2+x*x/12-x*x*x*x/720;
   return x/Math.expm1(x);
 }
 function rates(v,temp=6.3){
   const q=Math.pow(3,(temp-6.3)/10);
   return {
     am:q*xOverExpm1(-(v+40)/10), bm:q*4*Math.exp(-(v+65)/18),
     ah:q*.07*Math.exp(-(v+65)/20), bh:q/(1+Math.exp(-(v+35)/10)),
     an:q*.1*xOverExpm1(-(v+55)/10), bn:q*.125*Math.exp(-(v+65)/80)
   };
 }
 function restingGates(v=-65,temp=6.3){
   const x=rates(v,temp);
   return [x.am/(x.am+x.bm),x.ah/(x.ah+x.bh),x.an/(x.an+x.bn)];
 }
 function derivatives(y,i,config=P){
   const [v,m,h,n]=y,rr=rates(v,config.temperature_C);
   const sodium=config.gNa*m*m*m*h*(v-config.ENa);
   const potassium=config.gK*Math.pow(n,4)*(v-config.EK);
   const leak=config.gL*(v-config.EL);
   return [(i-sodium-potassium-leak)/config.Cm,
     rr.am*(1-m)-rr.bm*m,
     rr.ah*(1-h)-rr.bh*h,
     rr.an*(1-n)-rr.bn*n];
 }
 function rk4(y,dt,i,cfg){
   const a=derivatives(y,i,cfg);
   const b=derivatives(y.map((v,k)=>v+dt*a[k]/2),i,cfg);
   const c=derivatives(y.map((v,k)=>v+dt*b[k]/2),i,cfg);
   const d=derivatives(y.map((v,k)=>v+dt*c[k]),i,cfg);
   return y.map((v,k)=>v+dt*(a[k]+2*b[k]+2*c[k]+d[k])/6);
 }
 function validate(opts){
   const {dt_ms=0.025,duration_ms=40,pulse_start_ms=10,pulse_end_ms=11,current_uA_cm2=10,
    temperature_C=6.3}=opts;
   if(![dt_ms,duration_ms,pulse_start_ms,pulse_end_ms,current_uA_cm2,temperature_C].every(Number.isFinite))
     throw new TypeError('All numeric parameters must be finite');
   if(!(dt_ms>=0.0025&&dt_ms<=0.05) ||!(duration_ms>1&&duration_ms<=100) ||
     !(pulse_start_ms>=0 && pulse_end_ms>pulse_start_ms && pulse_end_ms<=duration_ms) ||
     !(current_uA_cm2>=0 && current_uA_cm2<=30)|| !(temperature_C>=6.3&&temperature_C<=6.3))
     throw new RangeError('Parameter outside documented demonstrator protocol; temperature is locked to 6.3 °C');
   if(Math.abs(Math.round(duration_ms/dt_ms)*dt_ms-duration_ms)>1e-8||
      Math.abs(Math.round(pulse_start_ms/dt_ms)*dt_ms-pulse_start_ms)>1e-8 ||
      Math.abs(Math.round(pulse_end_ms/dt_ms)*dt_ms-pulse_end_ms)>1e-8)
     throw new RangeError('dt must partition duration and pulse edges; avoid undisclosed current-step timing errors');
 }
 function simulate(opts={}){
   validate(opts);
   const dt=opts.dt_ms??.025, duration=opts.duration_ms??40,start=opts.pulse_start_ms??10,
     end=opts.pulse_end_ms??11,amp=opts.current_uA_cm2??10;
   const temperature_C=opts.temperature_C??6.3,cfg={...P,temperature_C};
   const initial=[-65,...restingGates(-65,temperature_C)];
   let y=initial.slice();
   const results=[];
   const steps=Math.round(duration/dt);
   for(let k=0;k<=steps;k++){
     const t=k*dt;
     const i=(t>=start-1e-9 && t<end-1e-9)?amp:0;
     if(!y.every(Number.isFinite)||Math.abs(y[0])>200||y.slice(1).some(v=>v < -.01||v>1.01))
       throw new Error('Numerical dynamics left valid state range: '+t);
     results.push({t_ms:+t.toFixed(10),voltage_mV:y[0],m:y[1],h:y[2],n:y[3],current_uA_cm2:i});
     if(k<steps)y=rk4(y,dt,i,cfg);
   }
   const peak=results.reduce((a,v)=>Math.max(a,v.voltage_mV),-Infinity);
   const minimum=results.reduce((a,v)=>Math.min(a,v.voltage_mV),Infinity);
   const spikeCount=results.reduce((n,v,k)=> n + (k>0 && results[k-1].voltage_mV<0 && v.voltage_mV>=0?1:0),0);
   return {
     schema:'poly.quantitative.test-result/1',model:'Hodgkin-Huxley squid giant axon',
     species:'squid',evidence_class:'published_model_reproduction',
     human_transfer_validated:false,
     biological_timing:'model_computed_not_experimental',
     anatomical_position:'none',
     scientific_validation:'NUMERICAL_TESTED_NOT_INDEPENDENTLY_EMPIRICALLY_VALIDATED',
     units:{time:'ms',voltage:'mV',current_density:'uA/cm^2',gates:'dimensionless'},
     stimulus:{start_ms:start,end_ms:end,current_uA_cm2:amp},
     numerical_method:'fixed-step classical RK4',
     params:{...cfg},initial_state:initial,
     metrics:{peak_voltage_mV:peak,min_voltage_mV:minimum,positive_zero_crossings:spikeCount},
     rows:results
   };
 }
 return Object.freeze({P,rates,restingGates,derivatives,rk4,simulate,validate,xOverExpm1});
});
