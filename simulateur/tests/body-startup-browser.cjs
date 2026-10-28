const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chrome'});
 const results=[];
 try{
  for(const mobile of [false,true]){
   const context=await browser.newContext({
    viewport:mobile?{width:390,height:844}:{width:1440,height:900},
    isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1
   });
   const page=await context.newPage();
   // public-assets.js maps the logical .bin request onto its .bin.gz payload.
   await page.route('**/models/body-display.bin.gz',route=>route.abort('failed'));
   await page.goto(base+'/simulateur/web/index.html',{waitUntil:'domcontentloaded'});
   await page.locator('#body-startup-fallback').waitFor({state:'visible',timeout:45000});
   assert.ok(['resource-load','asynchronous-initialization','module-execution','module-resource','webgl-context-lost'].includes(await page.locator('#body-startup-fallback').getAttribute('data-reason')));
   assert.match(await page.locator('#status').innerText(),/indisponible/);
   assert.equal(await page.locator('main').getAttribute('aria-busy'),'true');
   assert.equal(await page.locator('main').getAttribute('inert'),'');
   assert.equal(await page.locator('#body-retry').isEnabled(),true);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false,'Recovery causes horizontal overflow');
   await page.locator('#body-startup-fallback a[href="cerveau.html"]').click();
   await page.waitForURL(/\/simulateur\/web\/cerveau\.html/);
   assert.match(await page.title(),/Cerveau & conscience/);
   results.push({viewport:mobile?'390x844 touch':'1440x900 desktop',simulated_binary_failure:true,visible_fallback:true,accessible_after_inert_main:true,lightweight_route:true});
   await context.close();
  }
  console.log(JSON.stringify({schema:'poly.mobile-body-recovery-test.v1',results},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
