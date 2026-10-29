const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path');
const root=process.env.POLY_SKELETON_CHUNKS_ROOT,base=process.env.POLY_BASE_URL||'http://127.0.0.1:8124';
if(!root)throw Error('POLY_SKELETON_CHUNKS_ROOT required');
const stats=page=>page.evaluate(()=>window.__polySkeletonDiagnostics());
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chrome',args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const results=[];
 try{
  for(const mobile of [false,true])for(const {held,mode} of [{held:'MANIFEST.json',mode:'cancel'},{held:'CATALOGUE.json.gz',mode:'timeout'},{held:'MANIFEST.json',mode:'error'},{held:'CATALOGUE.json.gz',mode:'pagehide'}]){
   const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile});page.setDefaultTimeout(12000);
   const errors=[],requests=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));page.on('requestfailed',r=>failed.push(r.url()));
   await page.clock.install();let first=true,release;
   const gate=new Promise(resolve=>release=resolve);
   await page.route('**/skeleton-chunks-preview/**',async route=>{
    const rel=new URL(route.request().url()).pathname.split('/skeleton-chunks-preview/')[1];
    assert.match(rel,/^(MANIFEST\.json|CATALOGUE\.json\.gz|chunks\/skeleton-\d{3}\.(json|bin\.gz))$/);
    if(rel===held&&first){first=false;if(mode==='error'){await route.abort('failed');return;}await gate;}
    if(route.request().failure())return;
    await route.fulfill({status:200,body:await fs.readFile(path.join(root,rel))});
   });
   try{
    await page.goto(base+'/simulateur/web/skeleton-region-lab.html');
    if(mode==='error')await page.waitForFunction(()=>window.__polySkeletonDiagnostics?.().metadata.stage==='error');
    else{await page.waitForFunction(()=>window.__polySkeletonDiagnostics?.().pending);await page.waitForFunction(({held})=>window.__polySkeletonDiagnostics().metadata.stage===(held==='MANIFEST.json'?'manifest_fetch':'catalogue_read'),{held});}
    assert.equal(await page.locator('#skeleton-retry').count(),1,'explicit metadata recovery must exist');
    if(mode==='cancel'){
     await page.locator('#skeleton-cancel').click();assert.equal((await stats(page)).metadata.stage,'cancelled');
    }else if(mode==='timeout'){
     await page.clock.fastForward(31000);await page.waitForFunction(()=>window.__polySkeletonDiagnostics().metadata.stage==='timeout');
     assert.equal((await stats(page)).metadata.failed_stage,'catalogue_read');
    }else if(mode==='pagehide'){
     await page.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});assert.equal((await stats(page)).metadata.stage,'cancelled');
    }
    await page.waitForFunction(()=>!window.__polySkeletonDiagnostics().pending);
    assert.equal((await stats(page)).webgl_created,false);assert.equal((await stats(page)).catalogue_loaded,false);
    assert.equal(await page.locator('#skeleton-load').isDisabled(),true);assert.equal(await page.locator('#skeleton-whole').isDisabled(),true);
    assert.equal(requests.filter(u=>u.endsWith('/'+held)).length,1,'no automatic retry');
    if(process.env.POLY_SKELETON_STARTUP_SCREENSHOTS&&mode==='timeout')await page.screenshot({path:path.join(process.env.POLY_SKELETON_STARTUP_SCREENSHOTS,'POLY-skeleton-reprise-'+(mobile?'mobile':'desktop')+'.png')});
    const failure=(await stats(page)).metadata.last_failure;release();
    await page.locator('#skeleton-retry').click();await page.waitForFunction(()=>window.__polySkeletonDiagnostics().catalogue_loaded);
    assert.equal((await stats(page)).metadata.stage,'ready');assert.equal((await stats(page)).webgl_created,false);
    assert.deepEqual((await stats(page)).metadata.last_failure,failure,'successful retry retains failure evidence');
    assert.equal(requests.filter(u=>u.endsWith('/'+held)).length,2);
    assert.equal(await page.locator('#skeleton-retry').isHidden(),true);
    const options=await page.locator('#skeleton-region option').count();
    await page.locator('#skeleton-load').click();await page.waitForFunction(()=>window.__polySkeletonDiagnostics().objects>0);
    await page.clock.runFor(100);const loaded=await stats(page);assert.equal(loaded.pending,false);
    // Explicitly simulated browser lifecycle. This does not assert real BFCache eligibility.
    await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
    const hidden=await stats(page);assert.equal(hidden.objects,0);assert.equal(hidden.webgl_created,false);assert.equal(hidden.raw_bytes,0);assert.equal(hidden.pending_frame,false);
    const before=requests.length;
    await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
    assert.equal(requests.length,before,'return does not fetch geometry automatically');assert.equal(await page.locator('#skeleton-region option').count(),options);
    await page.locator('#skeleton-load').click();await page.waitForFunction(()=>window.__polySkeletonDiagnostics().objects>0);await page.clock.runFor(100);
    assert.equal((await stats(page)).pending_frame,false);assert.deepEqual(errors,[]);
    assert(failed.some(u=>u.endsWith('/'+held)),'held network transfer was actually aborted');
    results.push({mobile,held,mode,real_network_abort:true,explicit_recovery:true,no_automatic_retry:true,metadata_without_webgl:true,simulated_page_return:true,explicit_geometry_reload:true,errors});
   }finally{release();await page.close();}
  }
 }finally{await browser.close();if(process.env.POLY_SKELETON_STARTUP_RESULTS)await fs.writeFile(process.env.POLY_SKELETON_STARTUP_RESULTS,JSON.stringify({schema:'poly.skeleton-startup-browser.v1',physical_phone:false,results},null,2));}
 console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
