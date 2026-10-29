const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8128';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chrome',args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const results=[];
 try{
  for(const mobile of [false,true]){
   const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1400,height:900},isMobile:mobile,hasTouch:mobile});
   const failures=[],errors=[];page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()?.errorText}));page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/simulateur/web/index.html');
   try{await page.waitForFunction(()=>!document.querySelector('main').inert&&window.POLY?.meshes?.length===918,null,{timeout:90000});}
   catch(error){console.error(JSON.stringify({mobile,stage:'classic-start',failures,errors,status:await page.locator('#status').textContent(),fallback:await page.locator('#body-startup-fallback').getAttribute('data-reason')}));throw error;}
   const systems=page.locator('#systems [data-system]'),count=await systems.count();assert(count>3);
   const skeletal=page.locator('[data-system="skeletal"]');assert(await skeletal.isChecked());
   const before=await page.evaluate(()=>window.POLY.meshes.filter(m=>m.userData.system==='skeletal'&&m.visible).length);assert(before>0);
   await skeletal.uncheck();assert.equal(await page.evaluate(()=>window.POLY.meshes.filter(m=>m.userData.system==='skeletal'&&m.visible).length),0);
   await skeletal.check();const restored=await page.evaluate(()=>window.POLY.meshes.filter(m=>m.userData.system==='skeletal'&&m.visible).length);assert(restored>=before);
   const skin=page.locator('#skin'),initial=await skin.textContent();
   await skin.click();assert.notEqual(await skin.textContent(),initial);
   await skin.click();assert.equal(await skin.textContent(),initial);
   const speed=page.locator('#speed');assert.equal(await speed.getAttribute('type'),'range');assert.equal(await speed.getAttribute('max'),'1.5');
   const scenarios=await page.locator('#scenario option').count();assert(scenarios>0);
   assert(scenarios>1);await page.locator('#scenario').selectOption({index:1});await page.locator('#next').waitFor({state:'visible'});const stepBefore=await page.locator('#node').innerText();await page.locator('#next').click();assert.notEqual(await page.locator('#node').innerText(),stepBefore);
   const tissueCount=await page.locator('#tissue-reference-list button').count();assert(tissueCount>0);
   await page.locator('#tissue-reference summary').click();const tissue=await page.locator('#tissue-reference-list button').first().textContent();await page.locator('#tissue-reference-list button').first().click();const openedTissueSelection=await page.locator('#selected').innerText();assert(openedTissueSelection.length>0);
   await page.locator('#native-anatomy').click();
   assert.deepEqual(errors,[]);
   results.push({mobile,original_918:true,system_filters:count,system_toggle_and_restore:true,initial_visible_bones:before,visible_after_reenable:restored,skin_toggle_and_restore:true,speed_range:true,scenario_options:scenarios,source_tissue_buttons:tissueCount,opened_tissue:tissue.trim(),selection_text_after_tissue:openedTissueSelection,legacy_native_reset:true});
   await page.close();
  }
 }finally{await browser.close();}
 console.log(JSON.stringify({schema:'poly.classic-controls-parity.v1',results},null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
