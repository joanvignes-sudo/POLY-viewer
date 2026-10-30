// Playwright smoke: experimental ModelLab, desktop and touch-emulated mobile.
const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const url=(process.env.POLY_BASE_URL||'http://127.0.0.1:8131')+'/simulateur/web/model-lab.html';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const mobile of [false,true]){
   const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1400,height:900},isMobile:mobile,hasTouch:mobile});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url,{waitUntil:'load'});
   await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('7 modèles'),{timeout:15000});
   assert.match(await page.locator('#verdict').textContent(),/synthétique réussie/);
   assert.equal(await page.locator('#chart polyline').count(),2);
   assert.match(await page.locator('#identifiability').textContent(),/rang 1/);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal viewport overflow');
   await page.locator('#right').selectOption('aubert-2005');
   await page.locator('#compare').click();
   assert.match(await page.locator('#verdict').textContent(),/non autorisée/);
   assert.equal(await page.locator('#figure').isHidden(),true);
   await page.locator('#left').selectOption('linear-two-pools');
   await page.locator('#right').selectOption('linear-three-pools');
   await page.locator('#compare').click();
   assert.match(await page.locator('#verdict').textContent(),/synthétique réussie/);
   assert.match(await page.locator('#explanation').textContent(),/structures mécanistiques différentes/);
   const json=fs.readFileSync('simulateur/web/model-lab-registry.json');
   await page.locator('#registry-file').setInputFiles({name:'registered-models.json',mimeType:'application/json',buffer:json});
   await page.waitForFunction(()=>document.querySelector('#registry-import-status').textContent.includes('accepté'));
   const evidence={schema:'poly.model-lab.evidence.v1',id:'browser-fixture',origin:'synthetic_fixture',scope:{species:'synthetic',preparation:'closed_three_compartment',region:'abstract',time_basis:'synthetic_time'},observable:{id:'extracellular-lactate',unit:'mM',operator:'lactate-E-mmol-over-volume-L'},provenance:{doi:null,fixture:true},independence_status:'not_tested',points:[{t:0,value:1,uncertainty:null},{t:0.1,value:1,uncertainty:null}]};
   await page.locator('#evidence-file').setInputFiles({name:'fixture.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(evidence))});
   await page.waitForFunction(()=>document.querySelector('#evidence-status').textContent.includes('Données chargées'));
   await page.locator('#compare-evidence').click();
   assert.match(await page.locator('#evidence-status').textContent(),/Écarts descriptifs/);
   assert.deepEqual(errors,[],'unhandled browser errors');
   await page.close();
  }
  console.log('ModelLab browser desktop/mobile emulated PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
