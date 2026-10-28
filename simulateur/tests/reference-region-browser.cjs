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
   await choose(page,'parts/0');await selected(page,'parts/0');
   let stats=await page.evaluate(()=>window.__polyReferencePartDiagnostics());assert.ok(stats.resident_raw_bytes<=4194304);assert.equal(stats.meshes,1);if(mobile)assert.equal(stats.pixel_ratio,1);
   assert.match(await page.locator('#reference-selected').innerText(),/\/parts\/0/);
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
    keyboard_camera:true,abandoned_transfer_aborted:true,webgl_recovery:true,page_return:true,no_monolithic_reference_download:true,errors});await ctx.close();
  }
  for(const missing of [false,true]){
   const ctx=await browser.newContext(),page=await ctx.newPage();await fixtures(page,{missing,corruptId:missing?null:a.id});
   await page.goto(base+'/simulateur/web/reference-region-lab.html');
   if(missing){await page.locator('#loading[role="alert"]').waitFor({state:'visible'});assert.equal(await page.locator('#app').isVisible(),false);}
   else{await page.locator('#app').waitFor({state:'visible'});await choose(page,'parts/0');await page.waitForFunction(()=>document.querySelector('#reference-status').dataset.error==='true');assert.equal(await page.evaluate(()=>window.__polyReferencePartDiagnostics().meshes),0);}
   results.push({failure:missing?'missing_manifest':'corrupted_block',refused_without_mesh:true});await ctx.close();
  }
  const receipt={schema:'poly.reference-region-browser.v1',results};if(process.env.POLY_REFERENCE_RESULTS)await fs.writeFile(process.env.POLY_REFERENCE_RESULTS,JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
