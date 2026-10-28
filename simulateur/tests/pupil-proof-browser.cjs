// End-to-end, observed-human-data proof path, not a physiological validation.
// Start the repository server at http://127.0.0.1:8123.
// The test visits the public home, opens the pupil source, exports and restores
// the versioned SHA256-backed observation receipt, and checks rejection on tampering.
const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chrome'});
 const results=[];
 try{
  for(const mobile of [false,true]){
   const context=await browser.newContext({
    viewport:mobile?{width:390,height:844}:{width:1440,height:900},
    isMobile:mobile,hasTouch:mobile,acceptDownloads:true,deviceScaleFactor:1
   });
   context.setDefaultTimeout(60000);
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/#chaines');
   await page.locator('#chaines').waitFor({state:'visible'});
   await page.locator('#chaines a[href="simulateur/web/observations-lumiere.html"]').click();
   await page.waitForURL(/\/simulateur\/web\/observations-lumiere\.html/);
   await page.waitForFunction(()=>/^Sujet 01 ·/.test(document.querySelector('#status')?.textContent||''));
   assert.equal(await page.locator('#person option').count(),22);
   assert.equal(await page.locator('#quality tr').count(),22);
   assert.ok(await page.locator('#event option').count()>24);
   assert.ok(await page.locator('#chart circle').count()>20);
   assert.equal(await page.locator('a[href="https://doi.org/10.5281/zenodo.8239465"]').count(),1);
   await page.getByText('Qualité des 22 personnes et provenance',{exact:true}).click();
   assert.match(await page.locator('#identity').innerText(),/SHA256 [a-f0-9]{64}/);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false,'mobile horizontal overflow');
   // Select a published stimulus event; no neuronal latency is inferred.
   await page.locator('#event').selectOption({index:1});
   const event=await page.locator('#event').inputValue();
   assert.ok(event!=='full');
   assert.match(await page.locator('#coverage').innerText(),/Échantillons observés/);
   assert.match(await page.locator('#observed-acquisition').innerText(),/./);
   const pending=page.waitForEvent('download');
   await page.locator('#observed-export').click();
   const download=await pending;
   assert.equal(download.suggestedFilename(),'POLY-repere-mesures-lumiere.json');
   const receipt=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
   assert.equal(receipt.schema,'poly.observed-reader-manifest.v1');
   assert.equal(receipt.scope,'observed-pupil-reading-only');
   assert.equal(receipt.subject,'01');
   assert.equal(receipt.session,'sn2');
   assert.equal(receipt.unit,'mm');
   assert.equal(receipt.event,event);
   assert.equal(receipt.preparation.interpolation,false);
   assert.equal(receipt.preparation.model_prediction,false);
   assert.equal(receipt.resources.length,3);
   assert.ok(receipt.resources.every(x=>/^[a-f0-9]{64}$/.test(x.sha256)));
   assert.match(await page.locator('#observed-transfer-status').innerText(),/Repère exporté/);
   await page.getByText('Reprendre par copier-coller',{exact:true}).click();
   const tampered={...receipt,source_sha256:'0'.repeat(64)};
   await page.locator('#observed-manifest-text').fill(JSON.stringify(tampered));
   await page.locator('#observed-restore').click();
   await page.waitForFunction(()=>document.querySelector('#observed-transfer-status')?.textContent?.startsWith('Reprise refusée'));
   assert.match(await page.locator('#observed-transfer-status').innerText(),/Reprise refusée/);
   assert.equal(await page.locator('#event').inputValue(),event);
   await page.locator('#observed-manifest-text').fill(JSON.stringify(receipt));
   await page.locator('#observed-restore').click();
   await page.waitForFunction(()=>document.querySelector('#observed-transfer-status')?.textContent?.startsWith('Lecture restaurée'));
   assert.equal(await page.locator('#person').inputValue(),'01');
   assert.equal(await page.locator('#event').inputValue(),event);
   assert.deepEqual(errors,[]);
   results.push({viewport:mobile?'390x844 touch':'1440x900 desktop',source_link:true,observed_human_reading:true,hash_receipt:true,tamper_rejected:true,restored:true,errors});
   await context.close();
  }
  console.log(JSON.stringify({schema:'poly.pupil-proof-browser-e2e.v1',results},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
