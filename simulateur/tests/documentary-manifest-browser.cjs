const assert=require('node:assert/strict');
const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chrome'});
 try{for(const mobile of [false,true]){
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:900},hasTouch:mobile,isMobile:mobile});
  await page.goto((process.env.POLY_BASE_URL||'http://127.0.0.1:8124')+'/simulateur/web/anatomy.html');
  await page.evaluate(async()=>{
   const {createChainBridge}=await import('./chain-bridge.mjs');
   const {groups}=await (await fetch('../data/documentary-chains.json')).json();
   const group=groups[0];document.body.replaceChildren();const host=document.createElement('div');document.body.append(host);
   let view={target:[0,2,0],zoom:1,pitch:0,angle:0};window.restores=0;
   window.bridge=createChainBridge({host,getGroups:()=>groups,getContext:()=>({group,index:0,progress:0,edge:null}),getView:()=>view,setView:v=>view=v,resolveRegion:()=>null,pause:()=>{},restoreContext:()=>{window.restores++}});
  });
  const downloadPromise=page.waitForEvent('download');await page.locator('#bridge-export').click();const download=await downloadPromise;
  const stream=await download.createReadStream();let raw='';for await(const chunk of stream)raw+=chunk;const record=JSON.parse(raw);
  assert.ok(record.resources.some(r=>r.path==='documentary-context.mjs'));assert.ok(record.resources.some(r=>r.path==='documentary-engine.js'));
  await page.locator('summary').filter({hasText:'Reprendre par copier-coller'}).click();
  await page.locator('#bridge-manifest-text').fill(raw);await page.locator('#bridge-paste-restore').click();await page.waitForFunction(()=>window.restores===1);
  const changed=structuredClone(record);changed.context.region='invented';await page.locator('#bridge-manifest-text').fill(JSON.stringify(changed));await page.locator('#bridge-paste-restore').click();await page.locator('#bridge-status').filter({hasText:'Reprise refusée'}).waitFor();assert.equal(await page.evaluate(()=>window.restores),1);
  const stale=structuredClone(record);stale.resources[0].sha256='0'.repeat(64);await page.locator('#bridge-manifest-text').fill(JSON.stringify(stale));await page.locator('#bridge-paste-restore').click();await page.locator('#bridge-status').filter({hasText:'Les ressources ont changé'}).waitFor();assert.equal(await page.evaluate(()=>window.restores),1);
  await page.close();console.log('PASS documentary manifest export/import, source refusal and digest refusal '+(mobile?'mobile emulation':'desktop'));
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
