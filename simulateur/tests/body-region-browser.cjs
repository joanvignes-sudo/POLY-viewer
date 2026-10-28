// Browser integration: real staged source chunks supplied only by the CI fixture route.
// They are never copied to GitHub Pages or the source repository.
const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8123';
const root=process.env.POLY_CHUNKS_ROOT;
if(!root)throw Error('POLY_CHUNKS_ROOT required');
let manifest,a,b;
async function routePreview(page,{failManifest=false,corruptId=null}={}){
 await page.route('**/simulateur/data/body-chunks-preview/**',async route=>{
  const rel=decodeURIComponent(new URL(route.request().url()).pathname.split('/body-chunks-preview/')[1]||'');
  if(!rel||rel.includes('..')||rel.startsWith('/')||!(/^(MANIFEST\.json|chunks\/[a-z][a-z0-9_-]{1,64}\.(?:json|bin\.gz))$/.test(rel))){
   await route.fulfill({status:403,body:'Invalid fixture resource'});return;
  }
  if(failManifest&&rel==='MANIFEST.json'){await route.abort('failed');return;}
  try{
   const bytes=await fs.readFile(path.join(root,rel));
   if(rel==='chunks/'+corruptId+'.bin.gz')bytes[9]^=1;
   await route.fulfill({status:200,body:bytes,contentType:rel.endsWith('.json')?'application/json':'application/octet-stream'});
  }catch(e){await route.fulfill({status:404,body:'Fixture not found'});}
 });
}
async function chooseBlock(page,c){
 await page.locator('#system').selectOption(c.system);
 await page.locator('#block').selectOption(c.id);
}
async function expectLoaded(page,c){
 await page.waitForFunction(id=>document.querySelector('#status')?.textContent?.includes('Bloc vérifié et affiché : '+id),c.id,{timeout:45000});
 await page.waitForFunction(count=>(document.querySelector('#scene-stat')?.textContent||'').startsWith(count.toLocaleString('fr-FR')+' structures'),c.part_count,{timeout:30000});
}
async function launch(){
 manifest=JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json'),'utf8'));
 const candidates=[...manifest.chunks].sort((x,y)=>y.raw_bytes-x.raw_bytes);
 [a,b]=candidates;
 assert.ok(a.raw_bytes+b.raw_bytes>4194304,'Fixture needs two blocks that exceed one 4 MiB budget');
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chromium',
   args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const results=[];
 try{
  for(const mobile of [false,true]){
   const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},
    isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1});
   context.setDefaultTimeout(60000);
   const page=await context.newPage(),errors=[],requests=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>requests.push(new URL(r.url()).pathname));
   await routePreview(page);
   await page.goto(base+'/simulateur/web/body-region-lab.html');
   await page.locator('#app').waitFor({state:'visible'});
   assert.equal(await page.locator('#block option').count()>0,true);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);
   assert.ok(!requests.some(p=>p.endsWith('body-display.bin.gz')));
   await page.locator('#budget').selectOption('4194304');
   await chooseBlock(page,a);
   await page.locator('#load').click();await expectLoaded(page,a);
   assert.equal(await page.locator('#structure option').count(),a.part_count+1);
   assert.equal(await page.locator('#selected h3').count(),1);
   assert.match(await page.locator('#selected').innerText(),/Indice original/);
   assert.match(await page.locator('#selected').innerText(),/Anciennes positions/);
   assert.equal(await page.locator('#scene-stat').innerText().then(s=>s.includes('triangles')),true);
   const firstIndex=a.original_indices[0];
   assert.equal(await page.locator('#structure').inputValue(),String(firstIndex));
   await page.locator('#focus').click();
   await chooseBlock(page,b);
   await page.locator('#load').click();await expectLoaded(page,b);
   assert.equal(await page.locator('#structure').inputValue(),String(b.original_indices[0]));
   assert.equal(await page.locator('#structure option[value="'+firstIndex+'"]').count(),0,'Evicted structures should vanish');
   assert.ok((await page.locator('#memory').innerText()).includes('4 194 304')||
     (await page.locator('#memory').innerText()).includes('4 194 304')||
     (await page.locator('#memory').innerText()).includes('4194304'));
   await page.locator('#clear').click();
   await page.waitForFunction(()=>document.querySelector('#scene-stat')?.textContent?.startsWith('0 structures'));
   await page.waitForFunction(()=>document.querySelector('#scene-stat')?.textContent?.includes('0 géométries GPU'));
   assert.equal(await page.locator('#structure option').count(),1);
   assert.deepEqual(errors,[]);
   results.push({view:mobile?'390x844 touch':'1440x900 desktop',actual_triangle_buffers:true,
     first:a.id,second:b.id,memory_eviction:true,source_selection:true,gpu_disposal:true,
     no_full_body_download:true,errors});
   await context.close();
  }
  const ctx=await browser.newContext(),page=await ctx.newPage();
  await routePreview(page,{failManifest:true});
  await page.goto(base+'/simulateur/web/body-region-lab.html');
  await page.locator('#loading[role="alert"]').waitFor({state:'visible'});
  assert.equal(await page.locator('#app').isVisible(),false);
  results.push({missing_manifest:'fails_closed'});
  await ctx.close();
  const cx=await browser.newContext(),broken=await cx.newPage();
  await routePreview(broken,{corruptId:a.id});
  await broken.goto(base+'/simulateur/web/body-region-lab.html');
  await broken.locator('#app').waitFor({state:'visible'});
  await chooseBlock(broken,a);
  await broken.locator('#load').click();
  await broken.waitForFunction(()=>document.querySelector('#status')?.dataset?.error==='true');
  assert.match(await broken.locator('#status').innerText(),/altéré|refusé/);
  assert.match(await broken.locator('#scene-stat').innerText(),/^0 structures/);
  results.push({corrupt_gzip:'refused_no_mesh'});
  await cx.close();
  console.log(JSON.stringify({schema:'poly.regional-three-browser.v1',results},null,2));
 }finally{await browser.close();}
}
launch().catch(e=>{console.error(e);process.exitCode=1;});
