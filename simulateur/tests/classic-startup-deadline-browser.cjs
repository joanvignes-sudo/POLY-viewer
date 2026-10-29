const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chrome',args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const results=[];
 try{for(const mobile of [false,true]){
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile});
  const errors=[],failures=[];let attempts=0,release,markStarted;
  page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()?.errorText}));
  const gate=new Promise(resolve=>release=resolve),started=new Promise(resolve=>markStarted=resolve);
  await page.clock.install();
  await page.route('**/enteric-inhibition.js*',async route=>{attempts++;markStarted();await gate;await route.continue();});
  try{
   await page.goto((process.env.POLY_BASE_URL||'http://127.0.0.1:8123')+'/simulateur/web/index.html',{waitUntil:'commit'});
   await Promise.race([started,new Promise((_,reject)=>{const t=setTimeout(()=>reject(Error('held import not requested')),15000);t.unref();})]);
   await page.waitForFunction(()=>Boolean(window.__polyClassicStartup));
   await page.clock.fastForward(31000);
   await page.locator('#body-startup-fallback').waitFor({state:'visible'});
   assert.equal(await page.locator('#body-startup-fallback').getAttribute('data-reason'),'initialization-deadline');
   assert.equal(await page.locator('main').getAttribute('aria-busy'),'true');
   assert.equal(await page.locator('#body-retry').isEnabled(),true);
   assert.equal(await page.locator('#body-startup-fallback a[href="body-light.html"]').isVisible(),true);
   assert.equal(attempts,1,'no automatic retry of held import');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   release();await page.clock.resume();
   await page.waitForFunction(()=>window.__polyClassicStartup().ready&&window.POLY?.meshes.length===918,null,{timeout:120000});
   assert.equal(await page.locator('#body-startup-fallback').isHidden(),true);
   assert.match(await page.locator('#status').innerText(),/prêt/);
   const diagnostic=await page.evaluate(()=>window.__polyClassicStartup());assert.equal(diagnostic.deadline_exceeded,true);assert.equal(diagnostic.failure_reason,null);
   assert.equal(attempts,1);assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
   results.push({mobile,held_dependency:'enteric-inhibition.js',deadline_warning:true,accessible_alternatives:true,no_automatic_retry:true,late_ready_918:true,warning_removed:true,diagnostic});
  }catch(error){console.error(JSON.stringify({mobile,errors,failures,attempts,status:await page.locator('#status').textContent()}));throw error;}
  finally{release();await page.close();}
 }}finally{await browser.close();}
 const receipt={schema:'poly.classic-startup-deadline.v1',results};if(process.env.POLY_CLASSIC_DEADLINE_RESULTS)await fs.writeFile(process.env.POLY_CLASSIC_DEADLINE_RESULTS,JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
