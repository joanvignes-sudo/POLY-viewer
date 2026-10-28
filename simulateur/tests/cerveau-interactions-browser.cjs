// npm install --no-save playwright; run with the POLY HTTP server on port 8123.
const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
const modulePattern=/cerveau-view\.mjs/;
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chrome',args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const results=[];
 try{
  for(const mobile of [false,true]){
   const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
   context.setDefaultTimeout(120000);
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   let release;const gate=new Promise(resolve=>release=resolve);
   await page.route(modulePattern,async route=>{await gate;await route.continue();});
   await page.goto(base+'/#cerveau');
   assert.equal(await page.locator('#brain-controls').isVisible(),false);
   await page.locator('#load-brain').click();
   await page.locator('#brain-controls').waitFor({state:'visible'});
   assert.equal(await page.locator('#brain-toolset').isDisabled(),true);
   assert.equal(await page.locator('#brain-workbench').getAttribute('aria-busy'),'true');
   release();
   await page.locator('#brain-canvas').waitFor({state:'visible'});
   await page.waitForFunction(()=>!document.querySelector('#brain-toolset').disabled);
   assert.match(await page.locator('#brain-status').innerText(),/17 surfaces reçues et empreinte vérifiée/);
   assert.equal(await page.locator('#brain-region-lite option').count(),18);
   assert.equal(await page.locator('[data-brain-view]').count(),6);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.locator('#brain-search').fill('hippo');
   assert.equal(await page.locator('#brain-region-lite option').count(),3);
   await page.locator('#brain-region-lite').selectOption('hippocampus-left');
   await page.locator('#isolate-brain-lite').check();await page.locator('#focus-brain-lite').click();
   assert.match(await page.locator('#brain-detail-lite').innerText(),/Hippocampe gauche.*-25.1, -23.4, -13.5/);
   await page.locator('#brain-search').fill('absent-xyz');
   assert.equal(await page.locator('#brain-region-lite option').count(),1);
   assert.equal(await page.locator('#isolate-brain-lite').isChecked(),false);
   assert.equal(await page.locator('#focus-brain-lite').isDisabled(),true);
   await page.locator('#show-all-brain').click();
   await page.locator('#brain-side').selectOption('left');
   assert.equal(await page.locator('#brain-region-lite option').count(),10);
   await page.locator('#open-cortex-lite').check();
   assert.equal(await page.locator('#brain-cortex-opacity').inputValue(),'7');
   await page.locator('#brain-cortex-opacity').press('End');
   assert.equal(await page.locator('#brain-cortex-opacity').inputValue(),'100');
   assert.equal(await page.locator('#open-cortex-lite').isChecked(),false);
   await page.locator('[data-brain-view="front"]').click();
   assert.equal(await page.locator('[data-brain-view="front"]').getAttribute('aria-pressed'),'true');
   await page.locator('#brain-canvas').press('ArrowRight');
   assert.equal(await page.locator('[data-brain-view="front"]').getAttribute('aria-pressed'),'false');
   await page.locator('#show-all-brain').click();
   const canvas=page.locator('#brain-canvas');await canvas.scrollIntoViewIfNeeded();
   const box=await canvas.boundingBox();assert.ok(box&&box.width>0&&box.height>0);
   if(mobile)await canvas.tap({position:{x:box.width*.5,y:box.height*.5}});
   else await canvas.click({position:{x:box.width*.5,y:box.height*.5}});
   assert.notEqual(await page.locator('#brain-region-lite').inputValue(),'');
   await canvas.press('Escape');assert.equal(await page.locator('#brain-region-lite').inputValue(),'');
   if(!mobile&&await page.evaluate(()=>document.fullscreenEnabled)){
    await page.locator('#brain-fullscreen').click();
    await page.waitForFunction(()=>document.fullscreenElement?.id==='brain-workbench');
    await page.locator('#brain-fullscreen').click();
    await page.waitForFunction(()=>!document.fullscreenElement);
   }
   await page.locator('#show-all-brain').click();
   assert.equal(await page.locator('#brain-side').inputValue(),'');
   assert.equal(await page.locator('#brain-cortex-opacity').inputValue(),'85');
   assert.equal(await page.locator('#brain-region-lite option').count(),18);
   assert.deepEqual(errors,[]);
   results.push({viewport:mobile?'390x844 touch':'1440x1000',opens_with_controls:true,search_and_isolation:true,side_and_opacity:true,surface_picking:true,keyboard:true,page_errors:errors});
   await context.close();
  }
  const context=await browser.newContext(),page=await context.newPage();context.setDefaultTimeout(120000);
  await page.route(modulePattern,route=>route.abort());
  await page.goto(base+'/simulateur/web/cerveau.html#cerveau');await page.locator('#load-brain').click();
  await page.getByRole('button',{name:'Réessayer la 3D',exact:true}).waitFor();
  assert.equal(await page.locator('#brain-controls').isVisible(),true);
  assert.equal(await page.locator('#brain-toolset').isDisabled(),true);
  assert.equal(await page.locator('#brain-workbench').getAttribute('aria-busy'),'false');
  await page.unroute(modulePattern);await page.locator('#load-brain').click();
  await page.locator('#brain-canvas').waitFor({state:'visible'});
  await page.waitForFunction(()=>!document.querySelector('#brain-toolset').disabled);
  console.log(JSON.stringify({results,load_failure_controls_disabled:true},null,2));await context.close();
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
