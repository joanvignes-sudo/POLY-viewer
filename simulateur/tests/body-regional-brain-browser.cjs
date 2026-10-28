const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path');
const {routePreview,chooseBlock}=require('./body-region-browser.cjs');
const root=process.env.POLY_CHUNKS_ROOT,base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
async function main(){
 const manifest=JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json')));let native;
 for(const c of manifest.chunks){const rs=JSON.parse(await fs.readFile(path.join(root,c.metadata))).geometries;const r=rs.find(r=>r.path.includes('Allen_brain'));if(r){native={...r,chunk:c};break;}}
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chromium',args:['--enable-webgl','--use-angle=swiftshader']});
 const results=[];
 async function ready(page){await page.goto(base+'/simulateur/web/body-region-lab.html');await page.locator('#app').waitFor({state:'visible'});await page.locator('#regional-brain-tools summary').click();}
 async function loaded(page){await page.waitForFunction(()=>window.__polyRegionLabPerformance().cerebra?.regions===17);}
 async function loadNative(page){await chooseBlock(page,native.chunk);await page.locator('#load').click();await page.waitForFunction(id=>window.__polyRegionLabDiagnostics().cache.ids.includes(id),native.chunk.id);await page.locator('#structure').selectOption(String(native.source_index));}
 try{
  for(const mobile of [false,true]){
   const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile}),page=await ctx.newPage();
   page.setDefaultTimeout(45000);const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.stack??e.message));page.on('request',r=>requests.push(r.url()));
   await routePreview(page);await ready(page);assert.ok(!requests.some(url=>url.includes('cerebra-surfaces')));
   await page.locator('#brain-budget').selectOption('8388608');await page.locator('#brain-load').click();
   await page.waitForFunction(()=>document.querySelector('#brain-load-status').textContent.includes('budget exceeded'));
   assert.ok(!requests.some(url=>url.includes('cerebra-surfaces')),'Insufficient budget must reject before binary download');
   await page.locator('#brain-budget').selectOption('12582912');await page.locator('#brain-load').click();await loaded(page);
   let atlas=await page.evaluate(()=>window.__polyRegionLabPerformance().cerebra);
   assert.equal(atlas.buffer_bytes,10707096);assert.equal(atlas.planned_buffer_bytes,atlas.buffer_bytes);
   assert.match(await page.locator('#brain-load-status').innerText(),/Référence distincte/);
   await page.locator('#brain-focus').click();await page.locator('#brain-region').selectOption('cortex-right');
   assert.match(await page.locator('#brain-detail').innerText(),/MNI152NLin2009cSym/);assert.match(await page.locator('#brain-detail').innerText(),/pas activation/);
   await page.locator('#brain-cortex').click();
   await page.locator('#brain-split').evaluate(el=>{el.value='.1';el.dispatchEvent(new Event('input',{bubbles:true}));});
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().cerebra.split),.1);
   await page.locator('#brain-split').evaluate(el=>{el.value='0';el.dispatchEvent(new Event('input',{bubbles:true}));});
   await page.locator('#brain-source').selectOption('hra');
   assert.match(await page.locator('#brain-source option[value="hra"]').innerText(),/0 \/ 283/);
   await page.locator('#brain-source').selectOption('cerebra');
   await loadNative(page);
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().selected_material?.opacity===0);
   const oldUuid=await page.evaluate(()=>window.__polyRegionLabPerformance().selected_material.uuid);
   await page.locator('#brain-source').selectOption('hra');await page.waitForFunction(()=>window.__polyRegionLabPerformance().selected_material?.opacity===1);
   await page.locator('#brain-source').selectOption('cerebra');await page.waitForFunction(()=>window.__polyRegionLabPerformance().selected_material?.opacity===0);
   await page.locator('#release').click();await page.waitForFunction(()=>window.__polyRegionLabDiagnostics().scene.meshes===0);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().cerebra.regions),17);
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().cerebra.saved_native_materials===0);
   await loadNative(page);await page.waitForFunction(()=>window.__polyRegionLabPerformance().selected_material?.opacity===0);
   assert.notEqual(await page.evaluate(()=>window.__polyRegionLabPerformance().selected_material.uuid),oldUuid);
   await page.locator('#brain-unload').click();await page.waitForFunction(()=>window.__polyRegionLabPerformance().cerebra===null);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().selected_material.opacity),1);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().runtime_geometry_audit.consistent),true);
   await page.locator('#clear').click();await page.waitForFunction(()=>window.__polyRegionLabPerformance().three_geometries===0);
   assert.ok(!requests.some(url=>/body-display\.bin/.test(url)));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
   results.push({mobile,lazy_reference:true,independent_buffer_budget:true,buffer_bytes:atlas.buffer_bytes,
    original_reference_and_coordinates:true,source_materials_restored:true,native_eviction_and_reload:true,
    atlas_disposal:true,no_full_body_download:true,errors});await ctx.close();
  }
  // Abandoned cerebral transfer cannot create a late atlas or overwrite its controls.
  const ctx=await browser.newContext(),page=await ctx.newPage();let release,notify;
  const gate=new Promise(r=>release=r),started=new Promise(r=>notify=r),failed=[];page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
  await routePreview(page);await page.route('**/cerebra-surfaces.bin.gz',async route=>{notify();await gate;if(!route.request().failure())await route.fulfill({status:200,body:await fs.readFile(path.join(__dirname,'../models/cerebra/cerebra-surfaces.bin.gz'))});});
  await ready(page);await page.locator('#brain-load').click();await started;await page.locator('#brain-unload').click();
  release();await page.waitForFunction(()=>!document.querySelector('#brain-load').disabled);
  assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().cerebra),null);
  await page.locator('#brain-load').click();await loaded(page);
  assert.ok(failed.some(r=>r.url.endsWith('cerebra-surfaces.bin.gz')&&/ABORT/.test(r.error)));
  await page.evaluate(()=>document.querySelector('#region-canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Contexte WebGL perdu'));
  assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().cerebra),null);
  results.push({abandoned_transfer:'aborted_then_retry_passed',context_loss_releases_atlas:true});await ctx.close();
  const cx=await browser.newContext(),broken=await cx.newPage();await routePreview(broken);
  await broken.route('**/cerebra/ATLAS_ANATOMIQUE.json',route=>route.fulfill({status:200,body:'{}'}));
  await ready(broken);await broken.locator('#brain-load').click();await broken.waitForFunction(()=>document.querySelector('#brain-load-status').textContent.includes('metadata altered'));
  assert.equal(await broken.evaluate(()=>window.__polyRegionLabPerformance().cerebra),null);
  results.push({corrupt_cerebral_metadata:'refused_without_scene'});await cx.close();
  const receipt={schema:'poly.regional-brain-browser.v1',results};if(process.env.POLY_BRAIN_RESULTS)await fs.writeFile(process.env.POLY_BRAIN_RESULTS,JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
