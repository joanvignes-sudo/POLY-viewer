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
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/simulateur/web/attachments.html#surface=body:FJ1503');
    await page.waitForFunction(()=>window.POLY_ATTACHMENTS?.selected==='body:FJ1503');
    assert.equal(await page.locator('#surface option').count(),507);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.locator('#qualification').selectOption('rejected');assert.equal(await page.locator('#surface option').count(),4);
    await page.locator('#qualification').selectOption('documented_region');assert.equal(await page.locator('#surface option').count(),97);
    await page.locator('#query').fill('aponevrose');assert.ok(await page.locator('#surface option').count()>0);
    await page.locator('#query').fill('nonexistent-surface-xyz');assert.equal(await page.locator('#surface option').count(),0);assert.match(await page.locator('#detail').innerText(),/Aucune/);
    await page.locator('#query').fill('');await page.locator('#qualification').selectOption('');await page.locator('#surface').selectOption('hand:FJ1483M');
    assert.match(await page.locator('#detail').innerText(),/gauche|L/);
    if(process.env.POLY_SCREENSHOTS){fs.mkdirSync(process.env.POLY_SCREENSHOTS,{recursive:true});await page.screenshot({path:process.env.POLY_SCREENSHOTS+`/attachments-${mobile?'mobile':'desktop'}.png`,fullPage:false})}
    await page.goto(base+'/simulateur/web/index.html');
    await page.waitForFunction(()=>!document.querySelector('main').inert,null,{timeout:120000});
    await page.locator('#forearm-motor-open').click();
    await page.waitForFunction(()=>document.querySelector('#forearm-motor-card .attachment-qualification')?.textContent.includes('preuves'));
    assert.match(await page.locator('#forearm-motor-card .attachment-qualification').innerText(),/insertion 3D non localisée/);
    await page.locator('#forearm-motor-side').selectOption('L');
    await page.locator('#forearm-motor-close').click();await page.locator('#hand-ref-open').click();
    await page.waitForFunction(()=>document.querySelector('#hand-muscles-reference .attachment-qualification')?.textContent.includes('preuves'));
    await page.locator('#hand-ref-side').selectOption('L');
    if(process.env.POLY_SCREENSHOTS)await page.screenshot({path:process.env.POLY_SCREENSHOTS+`/avatar-${mobile?'mobile':'desktop'}.png`,fullPage:false});
    assert.deepEqual(errors,[]);results.push({viewport:mobile?'390x844 touch':'1440x1000',catalogue:true,filters:true,left_and_right:true,avatar_and_panels:true,page_errors:errors});
    await context.close();
  }
  const context=await browser.newContext(),page=await context.newPage();
  await page.route('**/attachment-catalogue.json',r=>r.fulfill({status:503,body:'Unavailable'}));
  await page.goto(base+'/simulateur/web/attachments.html');await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Catalogue non chargé'));
  assert.equal(await page.locator('#surface option').count(),0);await context.close();
  console.log(JSON.stringify({results,unavailable_catalogue_fails_closed:true},null,2));
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
