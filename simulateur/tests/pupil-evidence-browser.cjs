// This checks the *public entry* and the branch-only pupil chain on desktop + touch emulation.
// No clinical or temporal neural inference is tested or claimed.
const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chrome'}),results=[];
 try{
  for(const mobile of [false,true]){
   const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile,acceptDownloads:true});
   context.setDefaultTimeout(60000);
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/#chaines');
   await page.locator('#chaines').waitFor({state:'visible'});
   await page.locator('#chaines a[href="simulateur/web/chaine-pupillaire.html"]').click();
   await page.waitForURL(/\/simulateur\/web\/chaine-pupillaire\.html/);
   await page.locator('#app').waitFor({state:'visible'});
   assert.equal(await page.locator('#chain li.step').count(),11);
   assert.equal(await page.locator('#event option').count(),49);
   assert.equal(await page.locator('#event').inputValue(),'4');
   assert.match(await page.locator('#event-label').innerText(),/58,014 s.*5,3 lx/);
   assert.equal(await page.locator('#pupil-plot polyline').count(),0,'No interpolated path allowed');
   assert.ok(await page.locator('#pupil-plot circle').count()>0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No horizontal overflow');
   assert.match(await page.locator('#chain-title').innerText(),/circuit/);
   assert.match(await page.locator('.warning').innerText(),/aucune des mesures/i);
   assert.equal(await page.locator('a[href="https://www.ncbi.nlm.nih.gov/books/NBK553169/"]').count(),1);
   await page.locator('#event').selectOption('2');
   assert.match(await page.locator('#event-label').innerText(),/48,008 s.*13,3 lx/);
   const downloadPromise=page.waitForEvent('download');
   await page.locator('#export').click();const download=await downloadPromise;
   assert.equal(download.suggestedFilename(),'POLY-chaine-pupille-sujet01-evenement2.json');
   const saved=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
   assert.equal(saved.schema,'poly.pupil-mechanism-receipt.v1');
   assert.equal(saved.observation.event.index,2);
   assert.equal(saved.observation.event.nominal_illuminance_lux,13.3);
   assert.equal(saved.observation.neural_delay_s,null);
   assert.equal(saved.limitations.latency_measured,false);
   assert.equal(saved.limitations.individual_anatomical_registration,false);
   assert.equal(saved.limitations.causal_effect_estimated,false);
   assert.equal(saved.graph.documentary_nodes.length,11);
   assert.equal(saved.observation.source_member_sha256,'a4ea673a702f6349cea3408d47df7971c4703a48a815d1f1535d8582201e669a');
   assert.deepEqual(errors,[]);
   results.push({viewport:mobile?'390x844 touch':'1440x900 desktop',path_from_home:true,measured_data:true,documentary_graph:true,missing_data_not_interpolated:true,export:true,errors});
   await context.close();
  }
  const cx=await browser.newContext(),page=await cx.newPage();
  await page.route(/\/simulateur\/web\/observations-lumiere\.json/,route=>route.abort());
  await page.goto(base+'/simulateur/web/chaine-pupillaire.html');
  await page.locator('#loading[role="alert"]').waitFor({state:'visible'});
  assert.equal(await page.locator('#app').isVisible(),false);
  assert.match(await page.locator('#loading').innerText(),/Lecture suspendue/);
  results.push({missing_data:'fails_closed'});
  await cx.close();
  console.log(JSON.stringify({schema:'poly.pupil-evidence-browser.v1',results},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
