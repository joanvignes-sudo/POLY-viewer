// Run while POLY localhost server serves the repository root on port 8123.
const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chrome'});
 try{
  const results=[];
  for(const mobile of [false,true]){
   const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile,acceptDownloads:true});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/simulateur/web/metabolisme-humain.html');
   await page.locator('#app').waitFor({state:'visible'});
   assert.match(await page.locator('#audit-status').innerText(),/12 \/ 12/);
   assert.equal(await page.locator('#metrics .metric').count(),4);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);
   await page.locator('#tissue').selectOption('WM');
   await page.locator('#subject').selectOption('02');
   assert.equal(await page.locator('#p-total').innerText(),'0,1200');
   assert.match(await page.locator('#ag-ratio').innerText(),/27,3 %/);
   await page.locator('#alpha').evaluate(el=>{el.value='60';el.dispatchEvent(new Event('input',{bubbles:true}));});
   await page.locator('#beta').evaluate(el=>{el.value='50';el.dispatchEvent(new Event('input',{bubbles:true}));});
   assert.equal(await page.locator('#j-transfer').innerText(),'0,0360');
   await page.locator('#compare').click();
   assert.match(await page.locator('#comparison').innerText(),/Même production tissulaire/);
   const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;
   assert.equal(download.suggestedFilename(),'POLY_Li2025_WM_02_scenario.json');
   await page.locator('#reset').click();
   assert.equal(await page.locator('#tissue').inputValue(),'GM');
   assert.equal(await page.locator('#subject').inputValue(),'mean');
   assert.deepEqual(errors,[]);
   results.push({view:mobile?'390x844 touch':'1440x900 desktop',audit:true,selection:true,allocation:true,comparison:true,export:true,errors});
   await context.close();
  }
  // Missing evidence must not silently show sample values.
  const context=await browser.newContext(),page=await context.newPage();
  await page.route(/li-2025-table1\.json/,r=>r.abort());
  await page.goto(base+'/simulateur/web/metabolisme-humain.html');
  await page.getByRole('alert').waitFor();
  assert.equal(await page.locator('#app').isVisible(),false);
  assert.match(await page.locator('#loading').innerText(),/Démonstration suspendue/);
  results.push({missing_source:'fails_closed'});
  await context.close();
  console.log(JSON.stringify({results},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
