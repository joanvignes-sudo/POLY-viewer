const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path');
const {routePreview,chooseBlock}=require('./body-region-browser.cjs');
const root=process.env.POLY_CHUNKS_ROOT,base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
async function main(){
 const manifest=JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json'))),records=[];
 for(const c of manifest.chunks)for(const r of JSON.parse(await fs.readFile(path.join(root,c.metadata))).geometries)records.push({...r,chunk:c});
 const heart=records.find(r=>r.path.includes('VH_M_heart')),lung=records.find(r=>r.path.includes('VH_M_lungs'));
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chromium',args:['--enable-webgl','--use-angle=swiftshader']});
 const results=[];
 try{
  for(const mobile of [false,true]){
   const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile}),page=await ctx.newPage();
   page.setDefaultTimeout(45000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await routePreview(page);
   await page.goto(base+'/simulateur/web/body-region-lab.html');await page.locator('#app').waitFor({state:'visible'});
   await page.locator('#budget').selectOption('16777216');
   async function load(c){await chooseBlock(page,c);await page.locator('#load').click();await page.waitForFunction(id=>window.__polyRegionLabDiagnostics().cache.ids.includes(id),c.id);}
   await load(heart.chunk);await page.locator('#network-enabled').waitFor();
   await page.locator('#network-enabled').check();
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().functional_network?.coverage.heart.visible.length>0);
   let coverage=await page.evaluate(()=>window.__polyRegionLabPerformance().functional_network.coverage);
   assert.equal(coverage.lung.resident.length,0);assert.ok(coverage.lung.missing.length>0);
   assert.equal(coverage.ground.kind,'documentary_marker');
   await load(lung.chunk);
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().functional_network?.visible_segments>0);
   coverage=await page.evaluate(()=>window.__polyRegionLabPerformance().functional_network.coverage);
   assert.ok(coverage.heart.visible.length>0&&coverage.lung.visible.length>0);
   await page.locator('#network-reading').click();
   await page.locator('#structure').selectOption(String(heart.source_index));
   const view=await page.evaluate(()=>window.__polyRegionLabPerformance().view);
   await page.locator('#detailed-inspect').click();
   await page.locator('#organ-inspector').waitFor({state:'visible'});
   assert.match(await page.locator('#organ-inspector h2').innerText(),/Cœur/);
   assert.match(await page.locator('.organ-coverage').innerText(),/pièces du catalogue en mémoire/);
   assert.ok(await page.locator('.organ-parts button').count()>0);
   assert.ok(await page.locator('.organ-link').count()>0,'Original documentary route references remain connected');
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().functional_network?.visible_segments===0);
   assert.ok((await page.evaluate(()=>window.__polyRegionLabPerformance().functional_network.coverage.lung.resident.length))>0);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().functional_network.coverage.lung.visible.length),0);
   await page.locator('.organ-parts button').first().click();
   await page.locator('#organ-back').click();
   assert.deepEqual(await page.evaluate(()=>window.__polyRegionLabPerformance().view),view);
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().functional_network?.visible_segments>0);
   await page.locator('#detailed-inspect').click();
   await page.evaluate(()=>{window.__oldOrganButton=document.querySelector('.organ-parts button');});
   await page.locator('#clear').click();
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().three_geometries===0);
   assert.equal(await page.locator('#organ-inspector').isVisible(),false);
   assert.equal(await page.locator('#organ-catalog option').count(),1);
   await page.evaluate(()=>window.__oldOrganButton.click());
   assert.equal(await page.evaluate(()=>window.__polyRegionLabDiagnostics().scene.selected_source_index),null);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().functional_network),null);
   await load(heart.chunk);
   await page.locator('#network-enabled').waitFor();
   assert.equal(await page.locator('#network-enabled').isChecked(),true,'Route preferences survive a source reload');
   await page.locator('#organ-catalog').selectOption('VH_M_heart');
   await page.locator('#organ-inspector').waitFor({state:'visible'});
   assert.ok(await page.locator('.organ-parts button').count()>0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   // The actual historical inspector must report partial eyes and update on another block.
   await page.locator('#clear').click();
   const eyeRecords=records.filter(r=>r.path.includes('VH_M_eye_R'));
   const eyeFirst=eyeRecords[0],eyeOther=eyeRecords.find(r=>r.chunk.id!==eyeFirst.chunk.id);
   await load(eyeFirst.chunk);await page.locator('#structure').selectOption(String(eyeFirst.source_index));
   await page.locator('#detailed-inspect').click();
   const expectedEye=eyeRecords.length;
   let parts=await page.locator('.organ-parts button').count();assert.ok(parts<expectedEye);
   const initialParts=parts;
   await load(eyeOther.chunk);
   // The block's automatic first selection can be outside the eye: reopen the same source group.
   await page.locator('#structure').selectOption(String(eyeFirst.source_index));await page.locator('#detailed-inspect').click();
   parts=await page.locator('.organ-parts button').count();assert.ok(parts>initialParts);assert.equal(parts,expectedEye);
   assert.match(await page.locator('.organ-coverage').innerText(),/0 absentes/);
   await page.locator('#organ-hierarchy').selectOption('VH_M_eyes');
   assert.match(await page.locator('#organ-inspector h2').innerText(),/Yeux/);
   // Reuse the native cornea/lens/retina browsing session with only its source blocks loaded.
   await page.locator('#clear').click();
   const nativeRecords=[358,350,336].map(node=>records.find(r=>r.node===node));
   const nativeChunks=[...new Map(nativeRecords.map(r=>[r.chunk.id,r.chunk])).values()];
   for(const c of nativeChunks)await load(c);
   await page.waitForFunction(()=>!document.querySelector('#native-eye-open').disabled);
   const nativeView=await page.evaluate(()=>window.__polyRegionLabPerformance().view);
   const previousSelection=await page.evaluate(()=>window.__polyRegionLabDiagnostics().scene.selected_source_index);
   await page.locator('#native-eye-open').click();
   await page.waitForFunction(()=>window.__polyRegionLabPerformance().native_eye_active);
   for(let i=0;i<3;i++){
    if(i)await page.locator('#native-eye-next').click();
    assert.equal(await page.evaluate(()=>window.__polyRegionLabDiagnostics().scene.selected_source_index),nativeRecords[i].source_index);
    assert.match(await page.locator('#native-eye-status').innerText(),/temps physiologique inconnu/);
   }
   await page.locator('#native-eye-body').click();assert.deepEqual(await page.evaluate(()=>window.__polyRegionLabPerformance().view),nativeView);
   await page.locator('#native-eye-focus').click();
   await page.locator('#native-eye-close').click();
   assert.deepEqual(await page.evaluate(()=>window.__polyRegionLabPerformance().view),nativeView);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabDiagnostics().scene.selected_source_index),previousSelection);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().eye_mask_size),0);
   await page.locator('#native-eye-open').click();await page.locator('#clear').click();
   await page.waitForFunction(()=>!window.__polyRegionLabPerformance().native_eye_active);
   assert.equal(await page.locator('#native-eye-steps').isVisible(),false);
   assert.equal(await page.evaluate(()=>window.__polyRegionLabPerformance().eye_mask_size),0);
   assert.deepEqual(errors,[]);
   results.push({mobile,historical_inspector_reused:true,native_eye_source_session:true,native_eye_eviction_and_restore:true,partial_historical_coverage_and_hierarchy:true,route_residency_updates:true,
    hidden_anatomy_not_highlighted:true,source_eviction_closes_inspector:true,
    old_button_cannot_select_disposed_mesh:true,overlay_gpu_resources_released:true,
    source_reload_restores_catalogue_and_preferences:true,errors});await ctx.close();
  }
  const receipt={schema:'poly.regional-specialists-browser.v1',results};
  if(process.env.POLY_SPECIALIST_RESULTS)await fs.writeFile(process.env.POLY_SPECIALIST_RESULTS,JSON.stringify(receipt,null,2));
  console.log(JSON.stringify(receipt,null,2));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
