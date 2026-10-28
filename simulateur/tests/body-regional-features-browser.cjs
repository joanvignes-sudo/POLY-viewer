const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises'),path=require('node:path');
const {routePreview,chooseBlock,expectLoaded}=require('./body-region-browser.cjs');
const root=process.env.POLY_CHUNKS_ROOT,base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
async function contextEvent(page,kind){
 await page.evaluate(kind=>{
  if(kind==='restore'){window.__restoreRegionContext();return;}
  const gl=document.querySelector('#region-canvas').getContext('webgl2'),ext=gl.getExtension('WEBGL_lose_context');
  if(!ext)throw Error('Context loss extension required');
  window.__restoreRegionContext=()=>ext.restoreContext();
  if(kind==='lose')ext.loseContext();else ext.restoreContext();
 },kind);
 await page.waitForFunction(kind=>document.querySelector('#status').textContent.includes(kind==='lose'?'Contexte WebGL perdu':'Contexte WebGL rétabli'),kind);
}
async function main(){
 const manifest=JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json')));
 const records=[];
 for(const c of manifest.chunks){
  const meta=JSON.parse(await fs.readFile(path.join(root,c.metadata)));
  for(const r of meta.geometries)records.push({...r,chunk:c});
 }
 const first=records.find(r=>records.some(other=>other.path[2]===r.path[2]&&other.chunk.id!==r.chunk.id));
 assert.ok(first,'Need a source ensemble split across blocks');
 const second=records.find(r=>r.path[2]===first.path[2]&&r.chunk.id!==first.chunk.id);
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chromium',
  args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const results=[];
 try{
  for(const mobile of [false,true]){
   const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile});
   const page=await ctx.newPage(),errors=[],shaderErrors=[];
   page.setDefaultTimeout(45000);page.on('pageerror',e=>errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error'&&/shader|program|uniform/i.test(m.text()))shaderErrors.push(m.text());});
   await routePreview(page);await page.goto(base+'/simulateur/web/body-region-lab.html');
   await page.locator('#app').waitFor({state:'visible'});
   await page.locator('#budget').selectOption('16777216');
   await chooseBlock(page,first.chunk);await page.locator('#load').click();await expectLoaded(page,first.chunk);
   await page.locator('#structure').selectOption(String(first.source_index));
   const originalView=await page.evaluate(()=>window.__polyRegionLabPerformance().view);
   await page.locator('#inspect').click();
   let info=await page.evaluate(()=>window.__polyRegionLabDiagnostics().inspection);
   assert.ok(info.missing.length>0,'A partial group must be explicitly incomplete');
   const initial=info.resident.length,expected=records.filter(r=>r.path.includes(first.path[2])).length;
   assert.equal(info.expected,expected);
   await page.locator('#search-scope').selectOption('catalogue');
   await page.locator('#source-search').fill(second.name);
   await page.locator('#source-results button[data-source-index="'+second.source_index+'"]').click();
   await page.waitForFunction(id=>window.__polyRegionLabDiagnostics().scene.selected_source_index===id,second.source_index);
   info=await page.evaluate(()=>window.__polyRegionLabDiagnostics().inspection);
   assert.ok(info.resident.length>initial);assert.equal(info.expected,expected);
   assert.equal(info.resident.length+info.missing.length,expected);
   await page.locator('#isolate-source').click();
   info=await page.evaluate(()=>window.__polyRegionLabDiagnostics().inspection);
   assert.deepEqual(info.resident,[second.source_index]);assert.equal(info.expected,1);
   await page.locator('#close-inspection').click();
   assert.equal(await page.evaluate(()=>window.__polyRegionLabDiagnostics().inspection.scope),null);
   assert.deepEqual(await page.evaluate(()=>window.__polyRegionLabPerformance().view),originalView);
   // Scrub, play and restore use the real historic shader in WebGL.
   await page.waitForFunction(()=>!document.querySelector('#motion-phase').disabled);
   await page.locator('#motion-phase').evaluate(el=>{el.value='.4';el.dispatchEvent(new Event('input',{bubbles:true}));});
   assert.notEqual(await page.evaluate(()=>window.__polyRegionLabDiagnostics().motion.pose.hipR),0);
   await page.locator('#motion-play').click();
   await page.waitForFunction(()=>window.__polyRegionLabDiagnostics().motion.elapsed>.5);
   await contextEvent(page,'lose');
   assert.equal(await page.evaluate(()=>window.__polyRegionLabDiagnostics().motion.playing),false);
   const afterLoss=await page.evaluate(()=>window.__polyRegionLabDiagnostics());
   await contextEvent(page,'restore');
   assert.deepEqual(await page.evaluate(()=>window.__polyRegionLabDiagnostics()),afterLoss);
   await page.locator('#motion-rest').click();
   assert.ok(Object.values(await page.evaluate(()=>window.__polyRegionLabDiagnostics().motion.pose)).every(v=>v===0));
   // Real browser pointer events verify that a pinch changes zoom without selecting anatomy.
   const distance=await page.evaluate(()=>window.__polyRegionLabPerformance().view.distance);
   const c=page.locator('#region-canvas');await c.scrollIntoViewIfNeeded();
   const rect=await c.boundingBox();
   const cdp=await ctx.newCDPSession(page);
   const points=[{x:rect.x+80,y:rect.y+100},{x:rect.x+160,y:rect.y+100}];
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[points[0],{x:rect.x+220,y:rect.y+100}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   assert.ok(await page.evaluate(()=>window.__polyRegionLabPerformance().view.distance)<distance);
   await cdp.detach();
   await page.locator('#inspect').click();
   await c.scrollIntoViewIfNeeded();
   if(process.env.POLY_SCREENSHOTS){await fs.mkdir(process.env.POLY_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.POLY_SCREENSHOTS,`POLY-regional-${mobile?'mobile':'desktop'}.png`)});}
   const download=page.waitForEvent('download');await page.locator('#export-diagnostics').click();
   const saved=await download,receipt=JSON.parse(await fs.readFile(await saved.path()));
   assert.equal(receipt.schema,'poly.regional-local-diagnostics.v1');
   assert.ok(receipt.cpu_render_submission_ms.count>0);assert.ok(receipt.limits.length>=3);
   await page.locator('#inspect').click();
   await page.locator('#clear').click();
   await page.waitForFunction(()=>window.__polyRegionLabDiagnostics().scene.meshes===0);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabDiagnostics().inspection.scope),null);
   assert.equal(await page.locator('#inspection button').count(),0);
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().three_geometries===0);
   // The renderer is released on pagehide and rebuilt for a BFCache-style return.
   await page.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});
   await chooseBlock(page,first.chunk);await page.locator('#load').click();await expectLoaded(page,first.chunk);
   await page.locator('#structure').selectOption(String(first.source_index));await page.locator('#inspect').click();
   await page.locator('#load-inspection').click();
   await page.waitForFunction(()=>window.__polyRegionLabDiagnostics().inspection.scope&&window.__polyRegionLabDiagnostics().inspection.missing.length===0);
   await page.waitForFunction(()=>window.__polyRegionLabDiagnostics().cache.pinned.length===0);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabDiagnostics().inspection.expected),expected);
   await page.locator('#clear').click();
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().three_geometries===0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.deepEqual(errors,[]);assert.deepEqual(shaderErrors,[]);
   results.push({mobile,catalogue_to_minimal_block:true,partial_inspection:true,single_isolation:true,
    historical_walk_shader:true,context_loss_pauses_motion:true,pinch_zoom:true,diagnostic_export:true,camera_restore:true,pagehide_cleanup_and_return:true,load_missing_group_blocks:true,
    cpu_submission_ms:receipt.cpu_render_submission_ms,loads:receipt.recent_loads,errors,shaderErrors});
   await ctx.close();
  }
  // A context loss invalidates a real transfer before its late response can install anything.
  const ctx=await browser.newContext(),page=await ctx.newPage();
  const abortedRequests=[];page.on('requestfailed',request=>abortedRequests.push({url:request.url(),error:request.failure()?.errorText}));
  let release,notify;const gate=new Promise(r=>release=r),started=new Promise(r=>notify=r);
  await routePreview(page,{delayId:first.chunk.id,delayGate:gate,onDelay:notify});
  await page.goto(base+'/simulateur/web/body-region-lab.html');await page.locator('#app').waitFor({state:'visible'});
  await chooseBlock(page,first.chunk);await page.locator('#load').click();await started;
  await contextEvent(page,'lose');release();
  await page.waitForFunction(()=>window.__polyRegionLabDiagnostics().cache.pending.length===0);
  assert.equal(await page.evaluate(()=>window.__polyRegionLabDiagnostics().scene.meshes),0);
  assert.ok(abortedRequests.some(r=>r.url.endsWith(first.chunk.id+'.bin.gz')&&/ABORT/.test(r.error)));
  await contextEvent(page,'restore');
  await page.locator('#load').click();await expectLoaded(page,first.chunk);
  results.push({context_loss_during_transfer:'cancelled_then_retry_passed',actual_network_abort:true});await ctx.close();
  for(const broken of ['catalogue','motion']){
   const ctx=await browser.newContext(),page=await ctx.newPage();await routePreview(page);
   await page.route(broken==='catalogue'?'**/models/body-display.json.gz':'**/data/walk.json',route=>route.fulfill({status:200,body:'corrupted fixture'}));
   await page.goto(base+'/simulateur/web/body-region-lab.html');
   if(broken==='catalogue'){
    await page.locator('#loading[role="alert"]').waitFor({state:'visible'});assert.equal(await page.locator('#app').isVisible(),false);
   }else{
    await page.locator('#app').waitFor({state:'visible'});
    await page.waitForFunction(()=>document.querySelector('#motion-status').textContent.includes('Marche désactivée'));
    assert.equal(await page.locator('#motion-play').isDisabled(),true);
    await chooseBlock(page,first.chunk);await page.locator('#load').click();await expectLoaded(page,first.chunk);
   }
   results.push({invalid_source:broken,behavior:broken==='catalogue'?'fails_closed':'static_inspection_remains_available'});await ctx.close();
  }
  const receipt={schema:'poly.regional-features-browser.v1',results};
  if(process.env.POLY_FEATURE_RESULTS)await fs.writeFile(process.env.POLY_FEATURE_RESULTS,JSON.stringify(receipt,null,2));
  console.log(JSON.stringify(receipt,null,2));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
