// npm install --no-save playwright; node simulateur/tests/attachments-browser.cjs
// POLY_BASE_URL (default localhost:8123), POLY_PLAYWRIGHT, POLY_SCREENSHOTS optional.
const {chromium}=require(process.env.POLY_PLAYWRIGHT || 'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.POLY_BASE_URL || 'http://127.0.0.1:8123';
(async()=>{
  const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL || 'chrome',args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const results=[];
  try{for(const mobile of [false,true]){
    const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
    context.setDefaultTimeout(120000);
    const page=await context.newPage(),errors=[],pending=new Set();page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>pending.add(r.url()));page.on('requestfinished',r=>pending.delete(r.url()));page.on('requestfailed',r=>pending.delete(r.url()));
    const failedRequests=[],failedResponses=[],consoleErrors=[];
    page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
    page.on('response',r=>{if(r.status()>=400)failedResponses.push({url:r.url(),status:r.status()})});
    page.on('console',m=>{if(m.type()==='error')consoleErrors.push({text:m.text(),location:m.location()})});
    if(process.env.POLY_BROWSER_TRACE){const interval=setInterval(()=>console.log(JSON.stringify({case:'classic-suite-progress',mobile,url:page.url(),pending:[...pending].slice(0,30),page_errors:errors})),15000);page.once('close',()=>clearInterval(interval));}
    await page.goto(base+'/simulateur/web/attachments.html#surface=body:FJ1503');
    await page.waitForFunction(()=>window.POLY_ATTACHMENTS?.selected==='body:FJ1503');
    assert.equal(await page.locator('#surface option').count(),507);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.locator('#qualification').selectOption('rejected');assert.equal(await page.locator('#surface option').count(),4);
    await page.locator('#qualification').selectOption('documented_region');assert.equal(await page.locator('#surface option').count(),143);
    await page.locator('#query').fill('aponevrose');assert.ok(await page.locator('#surface option').count()>0);
    await page.locator('#query').fill('nonexistent-surface-xyz');assert.equal(await page.locator('#surface option').count(),0);assert.match(await page.locator('#detail').innerText(),/Aucune/);
    await page.locator('#query').fill('');await page.locator('#qualification').selectOption('');await page.locator('#surface').selectOption('hand:FJ1483M');
    assert.match(await page.locator('#detail').innerText(),/gauche|L/);
    if(process.env.POLY_SCREENSHOTS){fs.mkdirSync(process.env.POLY_SCREENSHOTS,{recursive:true});await page.screenshot({path:process.env.POLY_SCREENSHOTS+`/attachments-${mobile?'mobile':'desktop'}.png`,fullPage:false})}
    await page.locator('#view').selectOption('terms');
    assert.equal(await page.locator('#term-select option').count(),880);
    await page.locator('#term-query').fill('TA2:2417');
    assert.equal(await page.locator('#term-select option').count(),1);
    await page.waitForFunction(()=>window.POLY_ATTACHMENTS?.selected_term==='2417');
    assert.match(await page.locator('#term-detail').innerText(),/Aucune surface rapprochée/);
    assert.equal(await page.locator('#term-detail a[href*="index.html"]').count(),0);
    await page.locator('#term-query').fill('');await page.locator('#term-without-geometry').check();await page.locator('#term-qualification').selectOption('documented_region');
    assert.equal(await page.locator('#term-select option').count(),7);
    await page.locator('#term-without-geometry').uncheck();await page.locator('#term-query').fill('TA2:2418');
    assert.match(await page.locator('#term-detail').innerText(),/Description masculine/);
    assert.match(await page.locator('#term-detail').innerText(),/Description féminine/);
    if(process.env.POLY_SCREENSHOTS)await page.screenshot({path:process.env.POLY_SCREENSHOTS+`/terms-${mobile?'mobile':'desktop'}.png`,fullPage:false});
    await page.goto(base+'/simulateur/web/attachments.html#term=2417');
    await page.waitForFunction(()=>window.POLY_ATTACHMENTS?.selected_term==='2417');
    assert.equal(await page.locator('#view').inputValue(),'terms');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.locator('#term-query').fill('nonexistent-term-xyz');assert.equal(await page.locator('#term-select option').count(),0);assert.match(await page.locator('#term-detail').innerText(),/Aucun terme/);
    await page.goto(base+'/simulateur/web/index.html');
    try{await page.waitForFunction(()=>!document.querySelector('main').inert,null,{timeout:120000});}catch(error){console.error(JSON.stringify({case:'classic-body-startup',mobile,pending:[...pending],failed_requests:failedRequests,failed_responses:failedResponses,console_errors:consoleErrors,page_errors:errors,status:await page.locator('#status').textContent(),fallback_reason:await page.locator('#body-startup-fallback').getAttribute('data-reason')}));throw error;}
    assert.equal(await page.evaluate(()=>window.POLY.meshes.length),918);
    for(const mode of ['sit','lie','eat','run','stand']){await page.locator('[data-activity="'+mode+'"]').click();await page.waitForFunction(mode=>window.POLY.activity.mode===mode&&(mode==='sit'||mode==='eat'?window.POLY.uniforms.hipR.value===-Math.PI/2:mode==='lie'?window.POLY.uniforms.rootTilt.value===-Math.PI/2:mode==='stand'?window.POLY.uniforms.rootTilt.value===0:window.POLY.uniforms.kneeR.value>=.25),mode);}
    await page.locator('#search').fill('cœur');
    assert.ok(await page.locator('#results button').count()>0);
    await page.locator('#results button').first().click();
    await page.locator('#organ-back').waitFor({state:'visible'});
    const inspection=await page.evaluate(()=>window.POLY.organView.parts.map(m=>({
      source_index:m.userData.source_index,name:m.userData.name,node:m.userData.node,
      offset:m.userData.position_offset,original:m.userData.source_offsets.position_offset})));
    assert.ok(inspection.length>0);
    assert.ok(inspection.every(r=>Number.isInteger(r.source_index)&&r.offset===r.original));
    await page.locator('#organ-back').click();
    await page.locator('#search').fill('');
    await page.waitForFunction(()=>!document.querySelector('#native-eye-open').disabled);
    const nativeBefore=await page.evaluate(()=>window.POLY.view);
    await page.locator('#native-eye-open').click();
    for(const [i,node]of [358,350,336].entries()){
     if(i)await page.locator('#native-eye-next').click();
     assert.match(await page.locator('#native-eye-status').innerText(),new RegExp('HRA-NATIVE-EYE-R:'+node));
    }
    await page.locator('#native-eye-close').click();
    assert.deepEqual(await page.evaluate(()=>window.POLY.view),nativeBefore);
    await page.locator('#eye-light-open').click();
    await page.locator('#eye-light-panel').waitFor({state:'visible'});
    await page.locator('#p1-eye-reader summary').click();
    await page.waitForFunction(()=>!document.querySelector('#p1-eye-absorption').disabled);
    await page.locator('#p1-eye-absorption').click();
    assert.equal(await page.evaluate(()=>window.POLY.eyeLight.phase),5);
    await page.locator('#p1-eye-save').click();
    await page.locator('#eye-light-close').click({timeout:15000}).catch(async error=>{await page.screenshot({path:'../classic-eye-blocked.png'});throw error;});
    assert.equal(await page.evaluate(()=>window.POLY.eyeLight.savedMaterialCount),0);
    await page.locator('#eye-light-open').click();await page.locator('#p1-eye-reader summary').click();
    await page.locator('#p1-eye-restore').click();assert.equal(await page.evaluate(()=>window.POLY.eyeLight.phase),5);
    await page.locator('#eye-light-close').click({timeout:15000}).catch(async error=>{await page.screenshot({path:'../classic-eye-blocked.png'});throw error;});
    await page.locator('#forearm-motor-open').click();
    await page.waitForFunction(()=>document.querySelector('#forearm-motor-card .attachment-qualification')?.textContent.includes('preuves'));
    assert.match(await page.locator('#forearm-motor-card .attachment-qualification').innerText(),/insertion 3D non localisée/);
    await page.locator('#forearm-motor-side').selectOption('L');
    await page.locator('#forearm-motor-close').click();await page.locator('#hand-ref-open').click();
    await page.waitForFunction(()=>document.querySelector('#hand-muscles-reference .attachment-qualification')?.textContent.includes('preuves'));
    await page.locator('#hand-ref-side').selectOption('L');
    if(process.env.POLY_SCREENSHOTS)await page.screenshot({path:process.env.POLY_SCREENSHOTS+`/avatar-${mobile?'mobile':'desktop'}.png`,fullPage:false});
    assert.deepEqual(errors,[]);results.push({viewport:mobile?'390x844 touch':'1440x1000',catalogue:true,filters:true,left_and_right:true,avatar_and_panels:true,shared_search_and_organ_inspection:true,native_eye_source_session:true,eye_light_and_p1_checkpoint:true,terms_without_geometry:true,variant_separation:true,term_deep_links:true,page_errors:errors});
    await context.close();
  }
  const context=await browser.newContext(),page=await context.newPage();
  await page.route('**/attachment-catalogue.json*',r=>r.fulfill({status:503,body:'Unavailable'}));
  await page.goto(base+'/simulateur/web/attachments.html');await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Catalogue non chargé'));
  assert.equal(await page.locator('#surface option').count(),0);await context.close();
  console.log(JSON.stringify({results,unavailable_catalogue_fails_closed:true},null,2));
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
