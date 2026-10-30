const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8125';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chromium',args:['--disable-dev-shm-usage']});
 const results=[];
 try{
  for(const mobile of [false,true]){
   const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},hasTouch:mobile,isMobile:mobile});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/simulateur/web/pcbm-lab.html');
   await page.waitForFunction(()=>window.__pcbmDiagnostics?.().loaded===true);
   const d=await page.evaluate(()=>window.__pcbmDiagnostics());
   assert.equal(d.node,'body-hra');assert.equal(d.step_count,9);assert.equal(d.registered_spatial,0);
   assert.equal(d.biological_clock,null);assert.equal(d.world_transform_applied,false);
   await page.route('**/body-light.html',r=>r.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Isolated test viewer</title>'}));
   await page.locator('#embed-viewer').click();
   assert.equal(await page.locator('#viewer-frame').getAttribute('src'),'body-light.html');
   await page.locator('#next').click();
   assert.equal(await page.locator('#viewer-frame').getAttribute('src'),null);
   assert.equal(await page.locator('#viewer-panel').isVisible(),false);
   assert.equal((await page.evaluate(()=>window.__pcbmDiagnostics())).node,'brain-cerebra');
   assert.match(await page.locator('#transition-title').innerText(),/Structurel/);
   await page.locator('.step-button').nth(4).click();
   assert.equal((await page.evaluate(()=>window.__pcbmDiagnostics())).node,'vagus-f002');
   assert.match(await page.locator('#frame').innerText(),/unitless|normalis|SSV/i);
   assert.equal(await page.locator('#open-viewer').isVisible(),false);
   assert.equal(await page.locator('#sources a[href="https://docs.sparc.science/docs/subject-specific-vagus-ssv-scaffolds"]').count(),1);
   await page.locator('.step-button').last().click();
   assert.equal((await page.evaluate(()=>window.__pcbmDiagnostics())).node,'metabolic-network');
   assert.equal(await page.locator('#open-viewer').getAttribute('href'),'metabolic-network-lab.html');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.locator('#vagus-study-load').click();
   await page.locator('#vagus-study-panel').waitFor({state:'visible',timeout:12000});
   assert.equal(await page.locator('.vagus-branch-row').count(),6);
   assert.match(await page.locator('#vagus-study-status').innerText(),/3 références distinctes/);
   assert.match(await page.locator('#vagus-branch-chart').innerText(),/26.5 cm/);
   assert.match(await page.locator('#vagus-coordinate-fields').innerText(),/vagus coordinates/);
   assert.equal(await page.locator('#vagus-study-sources a').count(),3);
   await page.locator('#lineage-load').click();
   await page.locator('#lineage-panel').waitFor({state:'visible',timeout:12000});
   assert.equal(await page.locator('#lineage-resources>li').count(),5);
   assert.match(await page.locator('#lineage-status').innerText(),/1 origine f002/);
   assert.equal(await page.locator('#lineage-resources a[href="https://discover.pennsieve.io/datasets/674"]').count(),1);
   const synthetic={
    schema:'poly.pcbm.ssv-level-preview.v1',published:false,review_status:'unreviewed_local_import',
    specimen_id:'f002',side:'left',source_dataset_doi:'10.26275/imas-52lf',
    scaffold_collection_doi:'10.26275/tjzi-muqm',coordinate_field:'vagus coordinates',
    unit:'unitless',physical_length_mm:null,xyz_coordinates:null,anatomical_registration:null,
    source_digest_status:'declared_not_verified',source_artifact_sha256:'a'.repeat(64),
    landmarks:[{id:'level-a',label:'Synthetic level A',ssv:.07,physical_mm:null,xyz:null},
     {id:'level-b',label:'Synthetic level B',ssv:.22,physical_mm:null,xyz:null}],
    segments:[{id:'segment-a',start_ssv:.08,end_ssv:.11,length_mm:null,xyz:null,source_label:'SYNTHETIC_TEST_ONLY'}]
   };
   await page.locator('#ssv-upload').setInputFiles({name:'synthetic-local-ssv.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(synthetic))});
   await page.locator('#ssv-panel').waitFor({state:'visible',timeout:12000});
   assert.equal(await page.locator('#ssv-landmarks>li').count(),2);
   assert.equal(await page.locator('#ssv-segments>li').count(),1);
   assert.match(await page.locator('#ssv-summary').innerText(),/non authentifié/);
   assert.match(await page.locator('#ssv-status').innerText(),/sans unité/);
   await page.locator('#ssv-clear').click();
   assert.equal(await page.locator('#ssv-panel').isVisible(),false);
   synthetic.unit='mm';
   await page.locator('#ssv-upload').setInputFiles({name:'invalid-ssv.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(synthetic))});
   await page.waitForFunction(()=>document.getElementById('ssv-status').textContent.includes('Fichier incompatible'));
   assert.equal(await page.locator('#ssv-panel').isVisible(),false);
   await page.locator('#coverage-load').click();
   await page.locator('#coverage-panel').waitFor({state:'visible',timeout:12000});
   assert.match(await page.locator('#coverage-status').innerText(),/100 sujets, 16 familles/);
   assert.match(await page.locator('#coverage-count').innerText(),/100 sujets sur 100/);
   assert.equal(await page.locator('#coverage-list>li').count(),31);
   await page.locator('#coverage-family').selectOption('Anatomie et compartiments');
   assert.match(await page.locator('#coverage-count').innerText(),/sujets sur 100/);
   await page.locator('#coverage-query').fill('organes');
   assert.ok((await page.locator('#coverage-list>li').count())>=1);
   await page.locator('#coverage-query').fill('sujet impossible 9999');
   assert.match(await page.locator('#coverage-count').innerText(),/0 sujets/);
   await page.locator('#from').selectOption('metabolic-network');
   await page.locator('#to').selectOption('body-hra');
   await page.locator('#build').click();
   assert.match(await page.locator('#route-notice').innerText(),/Aucun itinéraire/);
   assert.deepEqual(errors,[]);
   results.push({mobile,validated_nine_stages:true,no_fabricated_spatial:true,missing_data_visible:true,reverse_no_invented_route:true,no_overflow:true,errors});
   await context.close();
  }
  const context=await browser.newContext(),page=await context.newPage();
  await page.route('**/pcbm-registry.json',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({schema:'bad'})}));
  await page.goto(base+'/simulateur/web/pcbm-lab.html');
  await page.locator('#error').waitFor({state:'visible'});
  assert.equal(await page.locator('#app').isVisible(),false);
  await context.close();
  console.log(JSON.stringify({schema:'poly.pcbm.browser-receipt.v1',results,corrupted_registry:'fails_closed'},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
