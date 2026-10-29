// Exhaustive source-chunk smoke test: all 13 real SHA256-verified blocks in a
// browser, released between loads. No binary is committed or published.
const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const {routePreview,chooseBlock,expectLoaded}=require('./body-region-browser.cjs');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
const root=process.env.POLY_CHUNKS_ROOT;
if(!root)throw Error('POLY_CHUNKS_ROOT required');

(async()=>{
 const manifest=JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json'),'utf8'));
 assert.equal(manifest.chunk_count,13);
 assert.equal(manifest.source_count,918);
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chromium',
  args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const results=[];
 try{
  for(const mobile of [false,true]){
   const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},
    isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1});
   const page=await ctx.newPage(),errors=[],requests=[];
   page.setDefaultTimeout(45000);
   page.on('pageerror',error=>errors.push(error.message));
   page.on('request',request=>requests.push(new URL(request.url()).pathname));
   await routePreview(page);
   await page.goto(base+'/simulateur/web/body-region-lab.html');
   await page.locator('#app').waitFor({state:'visible'});
   await page.locator('#budget').selectOption('4194304');
   let seen=0;
   for(const c of manifest.chunks){
    assert.ok(c.raw_bytes<=4194304,'All source blocks must fit the explicit budget');
    await chooseBlock(page,c);
    await page.locator('#load').click();
    await expectLoaded(page,c);
    const current=await page.evaluate(()=>window.__polyRegionLabDiagnostics());
    assert.deepEqual(current.cache.ids,[c.id],'Only the requested source block should be resident');
    assert.equal(current.cache.residentRawBytes,c.raw_bytes);
    assert.equal(current.scene.meshes,c.part_count,'Every source mesh must be rendered');
    assert.equal(current.scene.selected_source_index,c.original_indices[0]);
    assert.equal(await page.locator('#structure option').count(),c.part_count+1);
    seen+=c.part_count;
    await page.locator('#clear').click();
    await page.waitForFunction(()=>{
     const d=window.__polyRegionLabDiagnostics(),p=window.__polyRegionLabPerformance();
     return d.scene.meshes===0&&d.cache.residentRawBytes===0&&p.three_geometries===0;
    });
    assert.equal(await page.locator('#structure option').count(),1);
   }
   assert.equal(seen,918);
   assert.deepEqual(errors,[]);
   assert.ok(!requests.some(s=>s.endsWith('body-display.bin.gz')),'No legacy whole-body download');
   results.push({view:mobile?'390x844 tactile emule':'1440x900 desktop',
    blocks:manifest.chunk_count,structures:seen,all_pass:true,
    zero_three_geometries_after_each_release:true,no_full_body_download:true,errors});
   await ctx.close();
  }
  console.log(JSON.stringify({schema:'poly.all-regional-source-chunks-browser.v1',results},null,2));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
