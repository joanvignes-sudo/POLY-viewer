const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path');
const {routePreview,chooseBlock}=require('./body-region-browser.cjs');
const root=process.env.POLY_CHUNKS_ROOT,base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
async function main(){
 const manifest=JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json'))),records=[];
 for(const c of manifest.chunks)for(const r of JSON.parse(await fs.readFile(path.join(root,c.metadata))).geometries)records.push({...r,chunk:c});
 const required=[358,350,336].map(node=>records.find(r=>r.node===node));
 const chunks=[...new Map(required.map(r=>[r.chunk.id,r.chunk])).values()];
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chromium',args:['--enable-webgl','--use-angle=swiftshader']});
 const results=[];
 async function loadEye(page){
  await page.locator('#budget').selectOption('16777216');
  for(const c of chunks){await chooseBlock(page,c);await page.locator('#load').click();await page.waitForFunction(id=>window.__polyRegionLabDiagnostics().cache.ids.includes(id),c.id);}
  await page.locator('#structure').selectOption(String(required[0].source_index));
 }
 async function openReader(page){await page.locator('#p1-eye-reader summary').click();await page.waitForFunction(()=>!document.querySelector('#p1-eye-absorption').disabled);}
 try{
  for(const mobile of [false,true]){
   const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile}),page=await ctx.newPage();
   page.setDefaultTimeout(45000);const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.stack??e.message));page.on('request',r=>requests.push(r.url()));
   await routePreview(page);await page.goto(base+'/simulateur/web/body-region-lab.html');await page.locator('#app').waitFor({state:'visible'});
   await page.locator('#eye-light-open').click();assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().graphic_eye.active),false);
   assert.match(await page.locator('#eye-light-open').innerText(),/Charger/);
   await loadEye(page);
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().three_geometries===window.__polyRegionLabDiagnostics().scene.meshes);
   const before=await page.evaluate(()=>({view:window.__polyRegionLabPerformance().view,material:window.__polyRegionLabPerformance().selected_material,geometries:window.__polyRegionLabPerformance().three_geometries}));
   await page.locator('#eye-light-open').click();
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().graphic_eye.active);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().selected_material.opacity),.22);
   await page.waitForFunction(n=>window.__polyRegionLabPerformance().three_geometries>=n+2,before.geometries);
   await openReader(page);await page.locator('#p1-eye-absorption').click();
   await page.waitForFunction(n=>window.__polyRegionLabPerformance().three_geometries===n+3,before.geometries);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().graphic_eye.phase),5);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().graphic_eye.playing),false);
   assert.equal(await page.locator('#eye-light-play').isDisabled(),true);
   await page.locator('#p1-eye-save').click();
   const checkpoint=await page.evaluate(()=>localStorage.getItem('poly.p1.eye.documentary.v1'));assert.ok(checkpoint);
   await page.locator('#eye-light-close').click();
   await page.waitForFunction(n=>window.__polyRegionLabPerformance().three_geometries===n,before.geometries);
   assert.deepEqual(await page.evaluate(()=>window.__polyRegionLabPerformance().selected_material),before.material);
   assert.deepEqual(await page.evaluate(()=>window.__polyRegionLabPerformance().view),before.view);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().graphic_eye.saved_materials),0);
   await page.locator('#eye-light-open').click();await openReader(page);await page.locator('#p1-eye-restore').click();
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().graphic_eye.phase),5);
   await page.locator('#p1-eye-release').click();
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().graphic_eye.playing&&window.__polyRegionLabPerformance().graphic_eye.phase>0);
   await page.locator('#clear').click();
   await page.waitForFunction(()=>!window.__polyRegionLabPerformance().graphic_eye.active&&window.__polyRegionLabPerformance().three_geometries===0);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().graphic_eye.saved_materials),0);
   assert.equal(await page.evaluate(()=>localStorage.getItem('poly.p1.eye.documentary.v1')),checkpoint);
   await loadEye(page);await page.locator('#eye-light-open').click();await openReader(page);await page.locator('#p1-eye-restore').click();
   await page.evaluate(()=>{
    const ext=document.querySelector('#region-canvas').getContext('webgl2').getExtension('WEBGL_lose_context');window.__restoreOptics=()=>ext.restoreContext();ext.loseContext();
   });
   await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Contexte WebGL perdu'));
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().graphic_eye.active),false);
   await page.evaluate(()=>window.__restoreOptics());await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Contexte WebGL rétabli'));
   await page.locator('#organ-back').click();
   await page.locator('#eye-light-open').click();await openReader(page);
   await page.evaluate(()=>{window.__oldOpticsOpen=document.querySelector('#eye-light-open');window.__oldP1Absorb=document.querySelector('#p1-eye-absorption');window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});
   assert.equal(await page.locator('#eye-light-open').count(),1);assert.equal(await page.locator('#eye-light-panel').count(),1);assert.equal(await page.locator('#p1-eye-reader').count(),1);
   await loadEye(page);await page.locator('#eye-light-open').click();
   await page.evaluate(()=>{window.__oldOpticsOpen.click();window.__oldP1Absorb.click();});
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().graphic_eye.playing),true);
   await openReader(page);await page.locator('#p1-eye-restore').click();
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().graphic_eye.phase),5);
   assert.ok(!requests.some(url=>/body-display\.bin/.test(url)));
   assert.equal(new Set(requests.filter(url=>new URL(url).pathname.endsWith('/vendor/three.module.js'))).size,1);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().runtime_geometry_audit.consistent),true);assert.deepEqual(errors,[]);
   results.push({mobile,missing_sources_refused:true,original_illustration_and_p1:true,single_three_runtime:true,unique_geometry_ids:true,material_restore:true,
    overlay_gpu_release:true,source_eviction_cleanup:true,context_loss_cleanup:true,
    checkpoint_survives_eviction_and_page_return:true,disposed_controls_inert:true,no_full_body_download:true,errors});await ctx.close();
  }
  // Disposal aborts a pending documentary contract rather than updating a detached panel.
  const ctx=await browser.newContext(),page=await ctx.newPage();let release,notify;
  const gate=new Promise(r=>release=r),started=new Promise(r=>notify=r),failures=[];
  page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()?.errorText}));await routePreview(page);
  await page.route('**/p1-eye-light.json',async route=>{notify();await gate;if(!route.request().failure())await route.fulfill({status:200,body:await fs.readFile(path.join(__dirname,'../web/p1-eye-light.json'))});});
  await page.goto(base+'/simulateur/web/body-region-lab.html');await page.locator('#app').waitFor({state:'visible'});await loadEye(page);await page.locator('#eye-light-open').click();await page.locator('#p1-eye-reader summary').click();await started;
  await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
  await page.waitForFunction(()=>!document.querySelector('#eye-light-panel'));
  // requestfailed is delivered asynchronously by Chromium.
  await new Promise(resolve=>{if(failures.some(r=>r.url.endsWith('p1-eye-light.json')))resolve();else page.once('requestfailed',resolve)});
  assert.ok(failures.some(r=>r.url.endsWith('p1-eye-light.json')&&/ABORT/.test(r.error)));release();
  results.push({pending_documentary_fetch:'aborted_on_dispose'});await ctx.close();
  const receipt={schema:'poly.regional-optics-browser.v1',results};if(process.env.POLY_OPTICS_RESULTS)await fs.writeFile(process.env.POLY_OPTICS_RESULTS,JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
