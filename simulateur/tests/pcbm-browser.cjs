const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8125';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chromium',args:['--disable-dev-shm-usage']});
 const results=[];
 try{
  for(const mobile of [false,true]){
   const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},hasTouch:mobile,isMobile:mobile});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/simulateur/web/pcbm-lab.html');
   await page.waitForFunction(()=>window.__pcbmDiagnostics?.().loaded===true);
   const d=await page.evaluate(()=>window.__pcbmDiagnostics());
   assert.equal(d.node,'body-hra');assert.equal(d.step_count,9);assert.equal(d.registered_spatial,0);
   assert.equal(d.biological_clock,null);assert.equal(d.world_transform_applied,false);
   await page.route('**/body-light.html',r=>r.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Isolated test viewer</title>'}));
   await page.locator('#embed-viewer').click();
   assert.equal(await page.locator('#viewer-frame').getAttribute('src'),'body-light.html');
   await page.locator('#next').click();
   assert.equal(await page.locator('#viewer-frame').getAttribute('src'),null);
   assert.equal(await page.locator('#viewer-panel').isVisible(),false);
   assert.equal((await page.evaluate(()=>window.__pcbmDiagnostics())).node,'brain-cerebra');
   assert.match(await page.locator('#transition-title').innerText(),/Structurel/);
   await page.locator('.step-button').nth(4).click();
   assert.equal((await page.evaluate(()=>window.__pcbmDiagnostics())).node,'vagus-f002');
   assert.match(await page.locator('#frame').innerText(),/unitless|normalis|SSV/i);
   assert.equal(await page.locator('#open-viewer').isVisible(),false);
   await page.locator('.step-button').last().click();
   assert.equal((await page.evaluate(()=>window.__pcbmDiagnostics())).node,'metabolic-network');
   assert.equal(await page.locator('#open-viewer').getAttribute('href'),'metabolic-network-lab.html');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.locator('#from').selectOption('metabolic-network');
   await page.locator('#to').selectOption('body-hra');
   await page.locator('#build').click();
   assert.match(await page.locator('#route-notice').innerText(),/Aucun itinéraire/);
   assert.deepEqual(errors,[]);
   results.push({mobile,validated_nine_stages:true,no_fabricated_spatial:true,missing_data_visible:true,reverse_no_invented_route:true,no_overflow:true,errors});
   await context.close();
  }
  const context=await browser.newContext(),page=await context.newPage();
  await page.route('**/pcbm-registry.json',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({schema:'bad'})}));
  await page.goto(base+'/simulateur/web/pcbm-lab.html');
  await page.locator('#error').waitFor({state:'visible'});
  assert.equal(await page.locator('#app').isVisible(),false);
  await context.close();
  console.log(JSON.stringify({schema:'poly.pcbm.browser-receipt.v1',results,corrupted_registry:'fails_closed'},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
