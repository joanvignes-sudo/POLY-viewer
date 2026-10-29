const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path');
const {routePreview}=require('./body-region-browser.cjs');
const {gunzipSync}=require('node:zlib');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
async function main(){
 const original=JSON.parse(gunzipSync(await fs.readFile(path.join(__dirname,'../data/hand-muscles-reference.json.gz'))));
 const initial=original.parts.find(p=>p.id==='FJ1483'),other=original.parts.find(p=>p.kind==='muscle'&&p.side==='L'&&p.id!==initial.counterpart);
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chromium',args:['--enable-webgl','--use-angle=swiftshader']});
 const results=[];
 async function ready(page){const pending=new Set(),failures=[];const started=r=>pending.add(r.url()),finished=r=>pending.delete(r.url()),failed=r=>{pending.delete(r.url());failures.push({url:r.url(),error:r.failure()?.errorText});};page.on('request',started);page.on('requestfinished',finished);page.on('requestfailed',failed);try{await page.goto(base+'/simulateur/web/body-region-lab.html');await page.locator('#app').waitFor({state:'visible'});}catch(error){console.error(JSON.stringify({case:'regional-hand-startup',pending:[...pending],failures,loading:await page.locator('#loading').textContent(),startup:await page.evaluate(()=>window.__polyRegionLabStartup?.()??null)}));throw error;}finally{page.off('request',started);page.off('requestfinished',finished);page.off('requestfailed',failed);}await page.locator('#regional-hand-tools summary').click();}
 async function loaded(page){await page.waitForFunction(()=>window.__polyRegionLabPerformance().hand_reference?.preview?.triangles>0);}
 try{
  for(const mobile of [false,true]){
   const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile}),page=await ctx.newPage();
   page.setDefaultTimeout(45000);const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.stack??e.message));page.on('request',r=>requests.push(r.url()));
   await routePreview(page);await ready(page);assert.ok(!requests.some(url=>url.includes('hand-muscles-reference.json.gz')));
   await page.locator('#hand-load').click();await loaded(page);
   let hand=await page.evaluate(()=>window.__polyRegionLabPerformance().hand_reference);
   assert.equal(hand.parts,76);assert.equal(hand.namespace,'hand');assert.ok(hand.buffer_bytes<=hand.planned_buffer_upper_bound);assert.equal(hand.planned_buffer_upper_bound,3401772);
   if(mobile)assert.equal(hand.preview.pixelRatio,1);
   await page.locator('#hand-ref-side').selectOption('L');
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().hand_reference.selected),'hand:'+initial.counterpart);
   await page.locator('#hand-ref-filter').selectOption('all');await page.locator('#hand-ref-choices button[data-part="'+other.id+'"]').click();
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().hand_reference.selected),'hand:'+other.id);
   assert.match(await page.locator('#hand-ref-latency').innerText(),/pas mesure de cet avatar|non établie/);
   await page.waitForFunction(()=>document.querySelector('#hand-muscles-reference .attachment-qualification')?.textContent.includes('insertion 3D non localisée'));
   const canvas=page.locator('#hand-ref-canvas');await canvas.scrollIntoViewIfNeeded();const r=await canvas.boundingBox();
   const before=await page.evaluate(()=>window.__polyRegionLabPerformance().hand_reference.preview.distance),cdp=await ctx.newCDPSession(page);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x+60,y:r.y+100},{x:r.x+130,y:r.y+100}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:r.x+60,y:r.y+100},{x:r.x+200,y:r.y+100}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
   assert.ok(await page.evaluate(()=>window.__polyRegionLabPerformance().hand_reference.preview.distance)<before);
   await page.locator('#hand-ref-overlay').check();await page.waitForFunction(()=>window.__polyRegionLabPerformance().hand_reference.overlay);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabDiagnostics().scene.meshes),0,'BodyParts3D is not a fabricated HRA structure');
   assert.match(await page.locator('#hand-overlay-label').innerText(),/non validée anatomiquement|schématique/);
   await page.evaluate(()=>{const ext=document.querySelector('#hand-ref-canvas').getContext('webgl2').getExtension('WEBGL_lose_context');window.__restoreHand=()=>ext.restoreContext();ext.loseContext();});
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().hand_reference.preview.context_lost);
   await page.evaluate(()=>window.__restoreHand());await page.waitForFunction(()=>!window.__polyRegionLabPerformance().hand_reference.preview.context_lost&&window.__polyRegionLabPerformance().hand_reference.preview.triangles>0);
   await page.evaluate(id=>{window.__oldHandPart=document.querySelector('#hand-ref-choices button[data-part="'+id+'"]');},other.id);
   await page.locator('#hand-unload').click();await page.waitForFunction(()=>window.__polyRegionLabPerformance().hand_reference===null&&window.__polyRegionLabPerformance().three_geometries===0);
   assert.equal(await page.locator('#hand-muscles-reference').count(),0);
   await page.locator('#hand-load').click();await loaded(page);await page.evaluate(()=>window.__oldHandPart.click());
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().hand_reference.selected),'hand:FJ1483');
   await page.locator('#hand-ref-close').click();assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().hand_reference.preview),null);
   await page.locator('#hand-ref-open').click();await loaded(page);
   await page.locator('#regional-brain-tools summary').click();await page.locator('#brain-load').click();await page.waitForFunction(()=>window.__polyRegionLabPerformance().cerebra?.regions===17);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().hand_reference),null,'Independent heavy references are mutually exclusive');
   await page.locator('#clear').click();await page.waitForFunction(()=>window.__polyRegionLabPerformance().three_geometries===0);
   assert.ok(!requests.some(url=>/forearm-motor-reference|body-display\.bin/.test(url)));
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().runtime_geometry_audit.consistent),true);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
   results.push({mobile,separate_reference_76_parts:true,source_namespace_preserved:true,buffer_upper_bound:3401772,
    left_right_and_filters:true,documentary_qualification_preserved:true,pinch_zoom:true,private_context_recovery:true,
    unload_and_reload:true,disposed_controls_inert:true,exclusive_reference_ownership:true,no_forearm_or_full_body_download:true,errors});await ctx.close();
  }
  const ctx=await browser.newContext(),page=await ctx.newPage();let release,notify;
  const gate=new Promise(r=>release=r),started=new Promise(r=>notify=r),failed=[];page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));await routePreview(page);
  await page.route('**/hand-muscles-reference.json.gz',async route=>{notify();await gate;if(!route.request().failure())await route.fulfill({status:200,body:await fs.readFile(path.join(__dirname,'../data/hand-muscles-reference.json.gz'))});});
  await ready(page);await page.locator('#hand-load').click();await started;await page.locator('#hand-unload').click();release();
  await page.locator('#hand-load').click();await loaded(page);assert.ok(failed.some(r=>r.url.endsWith('hand-muscles-reference.json.gz')&&/ABORT/.test(r.error)));
  results.push({abandoned_hand_transfer:'aborted_then_retry_passed'});await ctx.close();
  const receipt={schema:'poly.regional-hand-browser.v1',results};if(process.env.POLY_HAND_RESULTS)await fs.writeFile(process.env.POLY_HAND_RESULTS,JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
