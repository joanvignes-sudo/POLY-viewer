const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const {gunzipSync}=require('node:zlib');
const root=process.env.POLY_REFERENCE_CHUNKS_ROOT,base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
if(!root)throw Error('POLY_REFERENCE_CHUNKS_ROOT required');
async function fixtures(page,{holdId=null,gate=null,onHold=()=>{},corruptId=null,missing=false}={}){
 await page.route('**/reference-chunks-preview/**',async route=>{
  const rel=decodeURIComponent(new URL(route.request().url()).pathname.split('/reference-chunks-preview/')[1]);
  if(!/^(MANIFEST\.json|CATALOGUE\.json\.gz|chunks\/reference-\d{3}\.(json|bin\.gz))$/.test(rel)){await route.fulfill({status:403});return;}
  if(missing&&rel==='MANIFEST.json'){await route.fulfill({status:404});return;}
  try{
   if(rel==='chunks/'+holdId+'.bin.gz'){onHold();await gate;}
   if(route.request().failure())return;
   const bytes=await fs.readFile(path.join(root,rel));if(rel==='chunks/'+corruptId+'.bin.gz')bytes[9]^=1;
   await route.fulfill({status:200,body:bytes,contentType:rel.endsWith('.json')?'application/json':'application/octet-stream'});
  }catch(error){if(!route.request().failure())await route.fulfill({status:404});}
 });
}
async function main(){
 const manifest=JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json'))),catalogue=JSON.parse(gunzipSync(await fs.readFile(path.join(root,'CATALOGUE.json.gz'))));
 const a=manifest.chunks.find(c=>c.keys.includes('parts/0')),b=manifest.chunks.find(c=>c.id!==a.id&&c.keys.some(k=>k.startsWith('parts/'))),second=b.keys.find(k=>k.startsWith('parts/'));
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chromium',args:['--enable-webgl','--use-angle=swiftshader']});const results=[];
 const ready=async page=>{await page.goto(base+'/simulateur/web/reference-region-lab.html');await page.locator('#app').waitFor({state:'visible'});};
 async function choose(page,key){const [collection,index]=key.split('/');await page.locator('#reference-collection').selectOption(collection);await page.locator('#reference-search').fill(catalogue.data[collection][Number(index)].id);await page.locator('[data-reference-key="'+key+'"]').click();}
 const selected=(page,key)=>page.waitForFunction(key=>window.__polyReferencePartDiagnostics().selected_key===key&&window.__polyReferencePartDiagnostics().geometries===1,key);
 try{
  for(const mobile of [false,true]){
   const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile}),page=await ctx.newPage();page.setDefaultTimeout(45000);
   const errors=[],requests=[],failed=[];page.on('pageerror',e=>errors.push(e.stack??e.message));page.on('request',r=>requests.push(r.url()));page.on('requestfailed',r=>failed.push(r.url()));
   await fixtures(page);await ready(page);
   assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().webgl_initialized),false);
   assert.ok(!requests.some(url=>url.includes('.bin.gz')));
   await page.locator('#reference-region').selectOption('__missing__');assert.match(await page.locator('#reference-count').innerText(),/^26 pièces/);await page.locator('#reference-region').selectOption('all');
   await page.locator('#reference-collection').selectOption('all');await page.locator('#reference-side').selectOption('U');assert.match(await page.locator('#reference-count').innerText(),/^11 pièces/);await page.locator('#reference-side').selectOption('all');await page.locator('#reference-collection').selectOption('parts');
   await page.locator('[data-reference-info="parts/0"]').click();assert.ok((await page.locator('#reference-documentation').innerText()).includes(catalogue.data.parts[0].name));
   assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().webgl_initialized),false);assert.ok(!requests.some(url=>url.includes('.bin.gz')));
   await page.getByRole('button',{name:'Charger les étapes documentées',exact:true}).click();await page.getByRole('button',{name:'Étape suivante',exact:true}).waitFor();
   assert.ok((await page.locator('#reference-documentation').innerText()).includes('ain_pq_R'));
   await page.getByRole('button',{name:'Étape suivante',exact:true}).click();assert.ok((await page.locator('#reference-documentation').innerText()).includes('Étape documentaire 2 / 2'));
   assert.equal(await page.getByRole('button',{name:'Étape suivante',exact:true}).isDisabled(),true);
   assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().webgl_initialized),false);assert.ok(!requests.some(url=>url.includes('.bin.gz')));
   await choose(page,'parts/0');await selected(page,'parts/0');
   let stats=await page.evaluate(()=>window.__polyReferencePartDiagnostics());assert.ok(stats.resident_raw_bytes<=4194304);assert.equal(stats.meshes,1);if(mobile)assert.equal(stats.pixel_ratio,1);
   assert.match(await page.locator('#reference-selected').innerText(),/\/parts\/0/);
   const relation=catalogue.data.bone_relations.find(r=>catalogue.data.parts.some(p=>r.parts.includes(p.id)&&catalogue.data.bones.some(b=>b.side===p.side&&b.bone_family===r.bone_family)));
   const relatedPart=catalogue.data.parts.findIndex(p=>relation.parts.includes(p.id)&&catalogue.data.bones.some(b=>b.side===p.side&&b.bone_family===relation.bone_family));
   await choose(page,'parts/'+relatedPart);await selected(page,'parts/'+relatedPart);
   assert.ok((await page.locator('#reference-documentation').innerText()).includes(relation.scope));
   const related=page.locator('[data-related-reference-key]').first(),relatedKey=await related.getAttribute('data-related-reference-key');
   await related.click();await selected(page,relatedKey);assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().meshes),1);
   const reverse=page.locator('[data-related-reference-key="parts/'+relatedPart+'"]').first();await reverse.click();await selected(page,'parts/'+relatedPart);
   await page.locator('[data-reference-group="parts/'+relatedPart+'"]').click();
   await page.waitForFunction(()=>window.__polyReferencePartDiagnostics().meshes>1&&window.__polyReferencePartDiagnostics().geometries===window.__polyReferencePartDiagnostics().meshes);
   const groupStats=await page.evaluate(()=>window.__polyReferencePartDiagnostics());assert.ok(groupStats.resident_raw_bytes<=4194304);assert.ok(groupStats.context_keys.every(k=>k.startsWith('bones/')));assert.equal(groupStats.geometry_ids.consistent,true);
   await page.locator('#reference-context').uncheck();assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().visible_meshes),1);assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().resident_raw_bytes),groupStats.resident_raw_bytes);await page.locator('#reference-context').check();
   await page.locator('[data-loaded-reference-key="'+relatedKey+'"]').click();assert.ok((await page.locator('#reference-documentation').innerText()).includes(relatedKey));assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().meshes),groupStats.meshes);
   await page.locator('#reference-save').click();await ready(page);assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().meshes),0);await page.locator('#reference-restore').click();
   await page.waitForFunction(count=>window.__polyReferencePartDiagnostics().meshes===count&&window.__polyReferencePartDiagnostics().geometries===count,groupStats.meshes);assert.deepEqual(await page.evaluate(()=>window.__polyReferencePartDiagnostics().context_keys),groupStats.context_keys);
   // A new selection must dispose every context mesh from the previous group.
   await choose(page,'parts/'+relatedPart);await selected(page,'parts/'+relatedPart);assert.deepEqual(await page.evaluate(()=>window.__polyReferencePartDiagnostics().context_keys),[]);
   const boneBlock=manifest.chunks.find(c=>c.keys.includes(relatedKey));
   const primaryBlock=manifest.chunks.find(c=>c.keys.includes('parts/'+relatedPart));
   if(boneBlock.id!==primaryBlock.id){await page.unroute('**/reference-chunks-preview/**');await fixtures(page,{corruptId:boneBlock.id});
    await page.locator('[data-reference-group="parts/'+relatedPart+'"]').click();await page.waitForFunction(()=>document.querySelector('#reference-status').dataset.error==='true');
    assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().selected_key),'parts/'+relatedPart);assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().meshes),1);
    await page.unroute('**/reference-chunks-preview/**');await fixtures(page);
   }
   await page.locator('#reference-canvas').focus();await page.keyboard.press('ArrowLeft');
   const savedAngle=await page.evaluate(()=>window.__polyReferencePartDiagnostics().view.azimuth);
   await page.locator('#reference-save').click();const requestCount=requests.length;await ready(page);
   assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().webgl_initialized),false);
   assert.ok(!requests.slice(requestCount).some(url=>url.includes('.bin.gz')));
   await page.locator('#reference-restore').click();await selected(page,'parts/'+relatedPart);
   assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().view.azimuth),savedAngle);
   await page.locator('#reference-forget').click();assert.equal(await page.locator('#reference-restore').isDisabled(),true);
   await choose(page,'bones/0');await selected(page,'bones/0');assert.match(await page.locator('#reference-selected').innerText(),/\/bones\/0/);
   const canvas=page.locator('#reference-canvas');await canvas.scrollIntoViewIfNeeded();await canvas.focus();const before=await page.evaluate(()=>window.__polyReferencePartDiagnostics().view.azimuth);await page.keyboard.press('ArrowRight');assert.notEqual(await page.evaluate(()=>window.__polyReferencePartDiagnostics().view.azimuth),before);
   await page.locator('#reference-release').click();await page.waitForFunction(()=>window.__polyReferencePartDiagnostics().geometries===0);assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().resident_raw_bytes),0);
   // Hold one block, select another, and verify the old transfer is really aborted.
   let release,notify;const gate=new Promise(r=>release=r),started=new Promise(r=>notify=r);
   await page.unroute('**/reference-chunks-preview/**');await fixtures(page,{holdId:a.id,gate,onHold:notify});
   await choose(page,'parts/0');await started;await choose(page,second);await selected(page,second);release();
   assert.ok(failed.some(url=>url.endsWith(a.id+'.bin.gz')));
   assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().block),b.id);
   await page.evaluate(()=>{const ext=document.querySelector('#reference-canvas').getContext('webgl2').getExtension('WEBGL_lose_context');window.__restoreReference=()=>ext.restoreContext();ext.loseContext();});
   await page.waitForFunction(()=>window.__polyReferencePartDiagnostics().context_lost);assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().resident_raw_bytes),0);
   await page.evaluate(()=>window.__restoreReference());await page.waitForFunction(()=>!window.__polyReferencePartDiagnostics().context_lost);
   await choose(page,second);await selected(page,second);
   await page.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});
   assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().webgl_initialized),false);await choose(page,'bones/0');await selected(page,'bones/0');
   assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().geometry_ids.consistent),true);
   assert.ok(!requests.some(url=>/forearm-motor-reference\.json|body-display\.bin/.test(url)));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
   results.push({mobile,metadata_without_webgl:true,one_verified_block:true,one_source_piece:true,muscle_and_bone_identity:true,
    nerve_documentary_steps_without_webgl:true,bounded_source_group:true,group_disposal:true,group_failure_preserves_previous:true,explicit_bookmark_resume:true,no_automatic_geometry_resume:true,documentary_bone_navigation:true,keyboard_camera:true,abandoned_transfer_aborted:true,webgl_recovery:true,page_return:true,no_monolithic_reference_download:true,errors});await ctx.close();
  }
  for(const missing of [false,true]){
   const ctx=await browser.newContext(),page=await ctx.newPage();await fixtures(page,{missing,corruptId:missing?null:a.id});
   await page.goto(base+'/simulateur/web/reference-region-lab.html');
   if(missing){await page.locator('#loading[role="alert"]').waitFor({state:'visible'});assert.equal(await page.locator('#app').isVisible(),false);}
   else{await page.locator('#app').waitFor({state:'visible'});await choose(page,'parts/0');await page.waitForFunction(()=>document.querySelector('#reference-status').dataset.error==='true');assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().meshes),0);}
   results.push({failure:missing?'missing_manifest':'corrupted_block',refused_without_mesh:true});await ctx.close();
  }
  const ctx=await browser.newContext(),page=await ctx.newPage();await fixtures(page);const corruptedNerve=await fs.readFile(path.join(__dirname,'../data/human-nerves.json.gz'));corruptedNerve[9]^=1;
  await page.route('**/human-nerves.json.gz',route=>route.fulfill({status:200,body:corruptedNerve}));await ready(page);await page.locator('[data-reference-info="parts/0"]').click();await page.getByRole('button',{name:'Charger les étapes documentées',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#reference-documentation').textContent.includes('Lecture refusée'));assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().webgl_initialized),false);
  results.push({failure:'corrupted_nerve_documentation',refused_without_mesh:true});await ctx.close();
  const lateContext=await browser.newContext(),latePage=await lateContext.newPage();await fixtures(latePage);let releaseNerve,notifyNerve;const nerveGate=new Promise(r=>releaseNerve=r),nerveStarted=new Promise(r=>notifyNerve=r);const failedNerve=[];
  latePage.on('requestfailed',r=>failedNerve.push(r.url()));await latePage.route('**/human-nerves.json.gz',async route=>{notifyNerve();await nerveGate;if(!route.request().failure())await route.fulfill({status:200,body:await fs.readFile(path.join(__dirname,'../data/human-nerves.json.gz'))});});
  await ready(latePage);await latePage.locator('[data-reference-info="parts/0"]').click();await latePage.getByRole('button',{name:'Charger les étapes documentées',exact:true}).click();await nerveStarted;
  await latePage.locator('#reference-collection').selectOption('bones');await latePage.locator('[data-reference-info="bones/0"]').click();releaseNerve();await latePage.waitForFunction(()=>document.querySelector('#reference-documentation').textContent.includes('bones/0'));
  assert.ok(failedNerve.some(url=>url.includes('human-nerves.json.gz')));assert.equal(await latePage.getByRole('button',{name:'Étape suivante',exact:true}).count(),0);assert.equal(await latePage.evaluate(()=>window.__polyReferencePartDiagnostics().webgl_initialized),false);
  results.push({nerve_transfer_cancelled_on_new_document:true,late_nerve_result_not_installed:true});await lateContext.close();
  const receipt={schema:'poly.reference-region-browser.v1',results};if(process.env.POLY_REFERENCE_RESULTS)await fs.writeFile(process.env.POLY_REFERENCE_RESULTS,JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
