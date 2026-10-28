const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const {gunzipSync}=require('node:zlib');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123',root=process.env.POLY_REFERENCE_CHUNKS_ROOT;
if(!root)throw Error('POLY_REFERENCE_CHUNKS_ROOT required');
const url=base+'/simulateur/web/reference-region-lab.html',diagnostics=page=>page.evaluate(()=>window.__polyReferencePartDiagnostics());
async function fixtures(page){await page.route('**/reference-chunks-preview/**',async route=>{if(route.request().failure())return;const rel=new URL(route.request().url()).pathname.split('/reference-chunks-preview/')[1];if(!/^(MANIFEST\.json|CATALOGUE\.json\.gz|chunks\/reference-\d{3}\.(json|bin\.gz))$/.test(rel))throw Error('Unexpected reference path');await route.fulfill({status:200,body:await fs.readFile(path.join(root,rel))});});}
async function ready(page){await page.waitForFunction(()=>['ready','error','timeout'].includes(window.__polyReferencePartDiagnostics?.().metadata.stage),null,{timeout:35000});const state=await diagnostics(page);assert.equal(state.metadata.stage,'ready',JSON.stringify(state.metadata));return state;}
async function main(){
 const catalogue=JSON.parse(gunzipSync(await fs.readFile(path.join(root,'CATALOGUE.json.gz')))),trunkKey='parts/'+catalogue.data.parts.findIndex(part=>part.id==='FJ1451');
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chromium',args:['--enable-webgl','--use-angle=swiftshader']});
 const receipt={schema:'poly.reference-startup-browser.v1',physical_phone:false,results:[]},releases=[];
 try{
  for(const held of ['MANIFEST.json','CATALOGUE.json.gz']){
   const context=await browser.newContext(),page=await context.newPage();await page.clock.install();await fixtures(page);const failed=[],requests=[];page.on('requestfailed',r=>failed.push(r.url()));page.on('request',r=>requests.push(r.url()));let first=true,release;const gate=new Promise(r=>release=r);releases.push(release);
   await page.route('**/reference-chunks-preview/'+held,async route=>{if(first){first=false;await gate;if(route.request().failure())return;}await route.fulfill({status:200,body:await fs.readFile(path.join(root,held))});});
   await page.goto(url,{waitUntil:'domcontentloaded'});const expected=held==='MANIFEST.json'?'manifest_fetch':'catalogue_fetch';await page.waitForFunction(stage=>window.__polyReferencePartDiagnostics?.().metadata.stage===stage,expected);
   await page.clock.fastForward(30001);await page.waitForFunction(()=>window.__polyReferencePartDiagnostics().metadata.stage==='timeout');
   const timed=await diagnostics(page);assert.equal(timed.metadata.failed_stage,expected);assert.equal(timed.metadata.timeout_ms,30000);assert.equal(timed.webgl_initialized,false);assert.equal(await page.locator('#loading').getAttribute('role'),'alert');assert.ok(failed.some(url=>url.endsWith(held)));assert.equal(requests.filter(url=>url.endsWith(held)).length,1,'no silent automatic retry');
   release();await page.locator('#reference-retry').click();const restored=await ready(page);assert.equal(restored.metadata.attempt,2);assert.equal(restored.webgl_initialized,false);assert.equal(restored.metadata.error,null);assert.ok(restored.metadata.trace.some(item=>item.stage==='catalogue_parse'));
   receipt.results.push({case:'stalled_'+held,explicit_timeout:true,failed_stage:expected,transfer_really_aborted:true,no_automatic_retry:true,manual_recovery:true,no_webgl:true});await context.close();
  }
  for(const mobile of [false,true]){
   const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile}),page=await context.newPage(),errors=[];page.setDefaultTimeout(35000);page.on('pageerror',e=>errors.push(e.stack??e.message));await fixtures(page);await page.goto(url);await ready(page);const cycles=[];
   for(let cycle=0;cycle<4;cycle++){
    await page.locator('#reference-search').fill('FJ1512');await page.locator('[data-reference-key="parts/38"]').click();await page.locator('[data-reference-group="parts/38"]').click();await page.waitForFunction(()=>window.__polyReferencePartDiagnostics().meshes===2);
    if(cycle%2){await page.locator('#reference-space').selectOption('illustrative');await page.waitForFunction(()=>!document.querySelector('#reference-phase').disabled);await page.getByRole('button',{name:'Charger les étapes documentées',exact:true}).click();await page.getByRole('button',{name:'Afficher cette étape dans le repère illustratif',exact:true}).click();await page.waitForFunction(()=>window.__polyReferencePartDiagnostics().geometries===3);}
    await page.reload();const state=await ready(page);assert.equal(state.webgl_initialized,false);assert.equal(state.meshes,0);assert.equal(state.resident_raw_bytes,0);assert.equal(state.metadata.attempt,1);cycles.push({cycle,stage:state.metadata.stage,elapsed_ms:state.metadata.elapsed_ms,trace:state.metadata.trace});
   }
   let fullTrunk=null;
   if(!mobile){await page.locator('#reference-search').fill('FJ1451');await page.locator('[data-reference-key="'+trunkKey+'"]').click();await page.waitForFunction(key=>window.__polyReferencePartDiagnostics().selected_key===key&&window.__polyReferencePartDiagnostics().geometries===1,trunkKey);const before=await diagnostics(page);await page.locator('#reference-space').selectOption('illustrative');await page.waitForFunction(()=>!document.querySelector('#reference-phase').disabled);await page.locator('#reference-phase').evaluate(input=>{input.value='.4';input.dispatchEvent(new Event('input',{bubbles:true}))});const posed=await diagnostics(page);assert.deepEqual(posed.posture.source_sample,before.posture.source_sample);assert.ok(posed.posture.display_sample.every(Number.isFinite));assert.ok(posed.resident_raw_bytes<=4194304);fullTrunk={key:trunkKey,raw_bytes:posed.resident_raw_bytes,display_bytes:posed.display_buffer_bytes,source_unchanged:true};}
   assert.deepEqual(errors,[]);receipt.results.push({mobile,reloads:cycles.length,raw_and_illustrative_scenes_released:true,no_automatic_geometry_reload:true,full_trunk:fullTrunk,cycles,errors});await context.close();
  }
 }catch(error){receipt.failure={message:error.stack??String(error)};throw error;}
 finally{for(const release of releases)release();await browser.close();if(process.env.POLY_STARTUP_RESULTS)await fs.writeFile(process.env.POLY_STARTUP_RESULTS,JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));}
}
main().catch(error=>{console.error(error);process.exitCode=1});
