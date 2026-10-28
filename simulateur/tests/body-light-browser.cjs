// Lightweight anatomical explorer: real compressed source metadata, no whole-body mesh download.
const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chrome'});
 const results=[];
 try{
  for(const mobile of [false,true]){
   const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1});
   context.setDefaultTimeout(60000);
   const page=await context.newPage(),errors=[],requested=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',req=>requested.push(new URL(req.url()).pathname));
   await page.goto(base+'/simulateur/web/body-light.html');
   await page.locator('#app').waitFor({state:'visible'});
   assert.match(await page.locator('#count').innerText(),/918 dans l.inventaire/);
   assert.ok(await page.locator('#map circle').count()>10);
   assert.equal(await page.locator('#selected h3').count(),1);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Horizontal overflow');
   assert.ok(requested.some(x=>x.endsWith('/models/body-display.json.gz')),'packed catalogue not requested');
   assert.equal(requested.some(x=>x.endsWith('/models/body-display.bin.gz')),false,'full model was requested');
   await page.locator('#view').selectOption('side');
   assert.equal(await page.locator('#map rect[data-selected-index]').count(),1);
   const first=await page.locator('#results button[data-source-index]').first().getAttribute('data-source-index');
   assert.equal(await page.locator('#map rect[data-selected-index]').getAttribute('data-selected-index'),first);
   await page.locator('#system').selectOption('muscular');
   assert.ok(await page.locator('#map circle').count()>10);
   await page.locator('#search').fill('heart');
   assert.equal(await page.locator('#system').inputValue(),'all');
   assert.match(await page.locator('#count').innerText(),/structure/);
   assert.ok(await page.locator('#results button').count()>0);
   await page.locator('#results button').first().click();
   assert.match(await page.locator('#selected').innerText(),/Volume englobant/);
   assert.match(await page.locator('#selected').innerText(),/pas une région cérébrale individuelle/);
   assert.deepEqual(errors,[]);
   results.push({viewport:mobile?'390x844 touch':'1440x900 desktop',source_catalogue:true,source_structures:918,no_whole_body_download:true,projection:true,search:true,source_limits:true,errors});
   await context.close();
  }
  const context=await browser.newContext(),page=await context.newPage();
  await page.route('**/models/body-display.json.gz',route=>route.abort());
  await page.goto(base+'/simulateur/web/body-light.html');
  await page.locator('#loading[role="alert"]').waitFor({state:'visible'});
  assert.equal(await page.locator('#app').isVisible(),false);
  assert.match(await page.locator('#loading').innerText(),/indisponible/);
  results.push({missing_source:'fails_closed'});
  await context.close();
  console.log(JSON.stringify({schema:'poly.body-light-browser.v1',results},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
