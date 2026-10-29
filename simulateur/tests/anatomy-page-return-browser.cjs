const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs/promises');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8124';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chrome',args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const results=[];
 try{for(const mobile of [false,true])for(const kind of ['skeleton','reference','review','hra']){
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile});page.setDefaultTimeout(20000);
  const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  await page.addInitScript(()=>{const raf=window.requestAnimationFrame.bind(window),caf=window.cancelAnimationFrame.bind(window),live=new Set();window.requestAnimationFrame=fn=>{let id=raf(t=>{live.delete(id);fn(t)});live.add(id);return id;};window.cancelAnimationFrame=id=>{live.delete(id);caf(id);};window.__testFrames=()=>live.size;});
  const config={skeleton:{url:'skeleton-region-lab.html',ready:()=>Boolean(window.__polySkeletonDiagnostics?.().catalogue_loaded),load:'#skeleton-load',loaded:()=>window.__polySkeletonDiagnostics().objects>0,stats:()=>window.__polySkeletonDiagnostics()},reference:{url:'reference-region-lab.html',ready:()=>window.__polyReferencePartDiagnostics?.().metadata.stage==='ready',load:'[data-reference-key="parts/0"]',loaded:()=>window.__polyReferencePartDiagnostics().meshes>0,stats:()=>window.__polyReferencePartDiagnostics()},review:{url:'bone-review-lab.html',ready:()=>Boolean(window.__polyBoneReview),load:'#review-show',loaded:()=>window.__polyBoneReview().displayed_sources>0,stats:()=>window.__polyBoneReview()}}[kind];
  const active=kind==='hra'?{url:'body-region-lab.html',ready:()=>Boolean(window.__polyRegionLabDiagnostics),load:'#load',loaded:()=>window.__polyRegionLabDiagnostics().scene.meshes>0,stats:()=>({...window.__polyRegionLabDiagnostics(),pending_frame:window.__testFrames()>0})}:config;
  await page.goto(base+'/simulateur/web/'+active.url);await page.waitForFunction(active.ready);
  if(kind==='review'){await page.locator('#review-load').click();await page.waitForFunction(()=>window.__polyBoneReview().loaded);}
  await page.locator(active.load).click();await page.waitForFunction(active.loaded);
  const result=await page.evaluate(()=>{window.dispatchEvent(new Event('resize'));const queued=window.__testFrames();window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));return {queued,after:window.__testFrames()};});
  assert.equal(result.queued,1,kind+': render queued before pagehide');assert.equal(result.after,0,kind+': no pending callback retains disposed renderer');
  const state=await page.evaluate(active.stats);if(kind==='hra'){assert.equal(state.scene.meshes,0);assert.equal(state.cache.residentRawBytes,0);}else assert.equal(state.geometries,0);
  const relevant=()=>kind==='hra'?requests.filter(u=>/\.bin\.gz(?:\?|$)/.test(u)).length:requests.length;
  const before=relevant();await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
  assert.equal(relevant(),before,'no automatic geometry/source fetch on simulated return');
  if(kind==='review'){await page.locator('#review-load').click();await page.waitForFunction(()=>window.__polyBoneReview().loaded);}
  await page.locator(active.load).click();await page.waitForFunction(active.loaded);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  await page.waitForFunction(()=>window.__testFrames()===0);
  assert.equal((await page.evaluate(active.stats)).pending_frame,false);assert.deepEqual(errors,[]);
  results.push({mobile,kind,queued_frame_cancelled:true,simulated_page_return:true,manual_reload_renders:true,errors});await page.close();
 }}finally{await browser.close();if(process.env.POLY_PAGE_RETURN_RESULTS)await fs.writeFile(process.env.POLY_PAGE_RETURN_RESULTS,JSON.stringify({schema:'poly.anatomy-page-return.v1',scope:'simulated pagehide/pageshow; not real BFCache eligibility or physical phone',results},null,2));}
 console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
