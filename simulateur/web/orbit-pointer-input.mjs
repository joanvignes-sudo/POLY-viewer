// Camera input only. Holds pointer IDs and scalar screen/view coordinates, never source geometry.
export function mountOrbitPointerInput(canvas,{getView,setView,onTap=()=>{},minDistance=.001,maxDistance=100000,maxElevation=1.5}={}){
 if(!canvas?.addEventListener||typeof getView!=='function'||typeof setView!=='function'||typeof onTap!=='function'||![minDistance,maxDistance,maxElevation].every(Number.isFinite)||minDistance<=0||maxDistance<minDistance||maxElevation<=0)throw Error('Invalid orbit input contract');
 const pointers=new Map(),listeners=[];let drag=null,pinch=null,tap=null,multi=false,disposed=false;
 const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
 const view=()=>{const v=getView();if(!v||!['azimuth','elevation','distance'].every(k=>Number.isFinite(v[k]))||v.distance<=0)throw Error('Invalid camera view');return {azimuth:v.azimuth,elevation:v.elevation,distance:v.distance};};
 const write=v=>{if(!['azimuth','elevation','distance'].every(k=>Number.isFinite(v[k])))return;setView({azimuth:v.azimuth,elevation:clamp(v.elevation,-maxElevation,maxElevation),distance:clamp(v.distance,minDistance,maxDistance)});};
 const span=()=>{const [a,b]=[...pointers.values()];return Math.hypot(a.x-b.x,a.y-b.y);};
 const valid=e=>Number.isSafeInteger(e.pointerId)&&e.pointerId>=0&&Number.isFinite(e.clientX)&&Number.isFinite(e.clientY);
 function release(id){try{if(canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);}catch{/* The browser may have released capture already. */}}
 function cancel(){const ids=[...pointers.keys()];pointers.clear();drag=pinch=tap=null;multi=false;for(const id of ids)release(id);}
 function listen(type,fn,options){canvas.addEventListener(type,fn,options);listeners.push([type,fn,options]);}
 listen('pointerdown',e=>{
  if(disposed||!valid(e)||(e.pointerType==='mouse'&&e.button!==0)||pointers.has(e.pointerId))return;
  const v=view();pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});try{canvas.setPointerCapture(e.pointerId);}catch{}
  if(pointers.size===1){multi=false;tap={id:e.pointerId,x:e.clientX,y:e.clientY};drag={x:e.clientX,y:e.clientY,...v};}
  else{multi=true;tap=drag=null;pinch=pointers.size===2?{span:Math.max(1,span()),...v}:null;}
 });
 listen('pointermove',e=>{
  if(!valid(e)||!pointers.has(e.pointerId))return;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(tap&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>6)tap=null;
  if(multi){if(pinch&&pointers.size===2)write({...pinch,distance:pinch.distance*pinch.span/Math.max(1,span())});}
  else if(drag)write({...drag,azimuth:drag.azimuth-(e.clientX-drag.x)*.006,elevation:drag.elevation+(e.clientY-drag.y)*.006});
 });
 listen('pointerup',e=>{
  if(!valid(e)||!pointers.has(e.pointerId))return;
  const pick=!multi&&tap?.id===e.pointerId&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<=6;
  pointers.delete(e.pointerId);drag=pinch=tap=null;release(e.pointerId);
  if(pointers.size===0)multi=false;
  if(pick)onTap(e.clientX,e.clientY);
 });
 listen('pointercancel',cancel);
 listen('lostpointercapture',e=>{if(pointers.has(e.pointerId))cancel();});
 listen('wheel',e=>{if(!Number.isFinite(e.deltaY)||e.ctrlKey||e.metaKey)return;e.preventDefault();const v=view();write({...v,distance:v.distance*Math.exp(clamp(e.deltaY*.001,-20,20))});},{passive:false});
 listen('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='Escape'){cancel();return;}
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','_'].includes(e.key))return;
  e.preventDefault();const v=view();
  if(e.key==='ArrowLeft')v.azimuth-=.1;if(e.key==='ArrowRight')v.azimuth+=.1;
  if(e.key==='ArrowUp')v.elevation+=.1;if(e.key==='ArrowDown')v.elevation-=.1;
  if(['+','='].includes(e.key))v.distance/=1.1;if(['-','_'].includes(e.key))v.distance*=1.1;
  write(v);
 });
 return {cancel,info:()=>({pointers:pointers.size,multi}),dispose(){if(disposed)return;disposed=true;cancel();for(const [type,fn,options]of listeners)canvas.removeEventListener(type,fn,options);listeners.length=0;}};
}
