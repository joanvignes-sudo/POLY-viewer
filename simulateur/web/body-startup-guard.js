// Graceful fallback for the heavy 3D body entry. Does not change anatomy or assert GPU recovery.
(() => {
 const main=document.querySelector('main');
 const fallback=document.querySelector('#body-startup-fallback');
 const label=document.querySelector('#status');
 const retry=document.querySelector('#body-retry');
 const canvas=document.querySelector('#body');
 if(!main||!fallback||!label||!retry||!canvas)return;
 let shown=false;
 const isBusy=()=>main.getAttribute('aria-busy')==='true';
 function show(reason,force=false){
  if(shown||(!force&&!isBusy()))return;
  shown=true;fallback.hidden=false;fallback.dataset.reason=reason;
  label.textContent='Corps 3D indisponible : autres explorateurs accessibles';
  // If main is still inert, the fallback is outside it and remains keyboard accessible.
 }
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
