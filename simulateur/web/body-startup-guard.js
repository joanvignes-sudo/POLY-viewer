// Graceful fallback for the heavy 3D body entry. Does not change anatomy or assert GPU recovery.
(() => {
 const main=document.querySelector('main');
 const fallback=document.querySelector('#body-startup-fallback');
 const label=document.querySelector('#status');
 const retry=document.querySelector('#body-retry');
 const canvas=document.querySelector('#body');
 const title=document.querySelector('#body-fallback-title'),initialTitle=title?.textContent;
 if(!main||!fallback||!label||!retry||!canvas)return;
 let shown=false,reason=null;
 const state={schema:'poly.classic-startup.v1',ready:false,deadline_exceeded:false,failure_reason:null};
 window.__polyClassicStartup=()=>({...state});
 const isBusy=()=>main.getAttribute('aria-busy')==='true';
 function show(nextReason,force=false){
  if((shown&&reason!=='initialization-deadline')||(!force&&!isBusy()))return;
  reason=nextReason;state.failure_reason=reason;
  if(title)title.textContent=reason==='initialization-deadline'?'Le corps entier 3D est encore en cours de chargement.':initialTitle;
  shown=true;fallback.hidden=false;fallback.dataset.reason=reason;
  if(reason!=='initialization-deadline')clearTimeout(timer);
  label.textContent='Corps 3D indisponible : autres explorateurs accessibles';
  // If main is still inert, the fallback is outside it and remains keyboard accessible.
 }
 // A held dependency may produce neither an error nor a rejected promise.
 // This deadline offers access to alternatives; it does not abort or retry loading.
 let timer=null;
 function armDeadline(){
  clearTimeout(timer);
  if(!isBusy()||shown)return;
  timer=setTimeout(()=>{if(!isBusy())return;state.deadline_exceeded=true;show('initialization-deadline');label.textContent='Le corps 3D charge encore après 30 secondes : autres explorateurs accessibles';},30000);
 }
 function ready(){
  if(isBusy())return;
  state.ready=true;clearTimeout(timer);
  // Only a delay warning is reversible. A reported failure/context loss remains visible.
  if(reason==='initialization-deadline'){shown=false;reason=null;state.failure_reason=null;fallback.hidden=true;delete fallback.dataset.reason;}
 }
 const observer=new MutationObserver(ready);
 observer.observe(main,{attributes:true,attributeFilter:['aria-busy']});
 armDeadline();ready();
 window.addEventListener('pagehide',()=>{clearTimeout(timer);observer.disconnect();});
 window.addEventListener('pageshow',event=>{if(event.persisted){observer.observe(main,{attributes:true,attributeFilter:['aria-busy']});armDeadline();ready();}});
 // The heavy body module explicitly reports its resource-preflight failures.
 window.addEventListener('poly-body-init-failed',event=>show(event.detail?.reason||'resource-load'));
 // Top-level module await failures, e.g. downloading the 30 MB body mesh.
 window.addEventListener('unhandledrejection',()=>show('asynchronous-initialization'));
 // Execution failures, including missing WebGL support, plus failure to fetch the entry module.
 window.addEventListener('error',event=>{
  if(event instanceof ErrorEvent){show('module-execution');return;}
  if(event.target?.tagName==='SCRIPT'&&event.target.src?.includes('/app.js'))show('module-resource');
 },true);
 canvas.addEventListener('webglcontextlost',event=>{
  // Allow the browser to attempt WebGL restoration; keep the documentary fallback visible.
  event.preventDefault();
  show('webgl-context-lost',true);
 });
 retry.addEventListener('click',()=>location.reload());
})();
