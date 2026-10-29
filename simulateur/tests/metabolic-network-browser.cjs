const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),crypto=require('node:crypto');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8131',url=base+'/simulateur/web/metabolic-network-lab.html';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chrome'}),results=[];
try{for(const mobile of [false,true]){
 const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1550,height:1050},isMobile:mobile,hasTouch:mobile}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForFunction(()=>window.POLY_METABOLIC?.reconstruction());assert.equal((await page.evaluate(()=>window.POLY_METABOLIC.snapshot())).playing,false);
 const initial=await page.evaluate(()=>window.POLY_METABOLIC.snapshot());assert.equal(initial.nodes,35);assert.equal(initial.edges,42);assert.equal(initial.quantitative_propagation,false);assert.equal(initial.biological_clock,null);
 assert.equal(await page.locator('input[type=range], input[type=number]').count(),0);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal page overflow');
 await page.selectOption('#node-jump','hcar1');assert.match(await page.locator('#crossings').innerText(),/Entrée/);assert.match(await page.locator('#crossings').innerText(),/Sortie/);
 assert.match(await page.locator('#local-uncertainty').innerText(),/Localisation de HCAR1/);
 assert(await page.locator('[data-node="hcar1"]').getAttribute('class').then(x=>x.includes('uncertain')));
 assert.equal(await page.locator('.edge.unresolved').count(),1);assert.equal(await page.locator('.edge.hypothesis').count(),1);
 await page.locator('#tab-challenges').click();assert(await page.locator('#challenge-table').isVisible());assert.equal(await page.locator('#challenge-table tbody tr').count(),3);
 await page.locator('#tab-evidence').click();assert.match(await page.locator('#pilot-receipt').innerText(),/0\/7/);assert.equal((await page.evaluate(()=>window.POLY_METABOLIC.inquiry())).ready_for_quantitative_test,false);
 await page.locator('#tab-mechanisms').click();await page.locator('[data-mechanism="transport-redox"]').click();assert.equal((await page.evaluate(()=>window.POLY_METABOLIC.snapshot())).route,'redox-nmda');
 const graph=await page.evaluate(()=>window.POLY_METABOLIC.graph());
 // Explicit synthetic test fixture, never stored as a scientific observation.
 const fixture={schema:'poly.metabolic-observations.v1',published:false,cross_preparation_propagation:false,graph_digest_format:'json-stringify-utf8',graph_sha256:sha(JSON.stringify(graph)),admissions:[],series:[{id:'synthetic-test-only',title:'FIXTURE SYNTHETIQUE DE TEST',detail:'Aucune observation biologique.',source_id:'koep',edge_id:'blood-observe',context:'human_blood_region',unit:'mmol/min (indice net)',x_kind:'conditions',direction:'signed_net_blood_region',provenance:{derived_sha256:'a'.repeat(64)},samples:[{x:0,label:'negative fixture',value:-1,SE:.1,n:1,environment:{pH:7,arterial_lactate_mmol_L:1,glucose_use_mmol_min:1,oxygen_use_ml_min:1}},{x:1,label:'positive fixture',value:1,SE:.1,n:1,environment:{pH:8,arterial_lactate_mmol_L:1,glucose_use_mmol_min:1,oxygen_use_ml_min:1}},{x:2,label:'missing fixture',value:null},{x:3,label:'last fixture',value:1}]}]};
 const bytes=JSON.stringify(fixture),meta={schema:'poly.metabolic-preview.v1',published:false,resource:'OBSERVATIONS.json',bytes:Buffer.byteLength(bytes),sha256:sha(bytes)};let corrupt=false,unavailable=false;
 await page.route('**/metabolic-observations-preview/*',async r=>{if(unavailable)return r.fulfill({status:404,body:'not mounted'});const manifest=r.request().url().endsWith('MANIFEST.json');await r.fulfill({contentType:'application/json',body:manifest?JSON.stringify({...meta,sha256:corrupt?'0'.repeat(64):meta.sha256}):bytes});});
 await page.locator('#load-data').click();await page.waitForFunction(()=>window.POLY_METABOLIC.snapshot().observations===1);await page.selectOption('#series','synthetic-test-only');
 let state=await page.evaluate(()=>window.POLY_METABOLIC.snapshot());assert.equal(state.encoding.direction,-1);const geometry=state.edge_geometry;
 await page.locator('#next-point').click();state=await page.evaluate(()=>window.POLY_METABOLIC.snapshot());assert.equal(state.encoding.direction,1);assert.notEqual(state.edge_geometry,geometry);
 await page.locator('#next-point').click();state=await page.evaluate(()=>window.POLY_METABOLIC.snapshot());assert.equal(state.encoding.missing,true);await page.locator('#read-data').click();assert.equal((await page.evaluate(()=>window.POLY_METABOLIC.snapshot())).playing,false);
 corrupt=true;await page.locator('#load-data').click();await page.waitForFunction(()=>document.querySelector('#data-status').textContent.includes('Empreinte'));assert.equal((await page.evaluate(()=>window.POLY_METABOLIC.snapshot())).observations,1);
 unavailable=true;await page.locator('#load-data').click();await page.waitForFunction(()=>document.querySelector('#data-status').textContent.includes('404'));assert.equal((await page.evaluate(()=>window.POLY_METABOLIC.snapshot())).observations,1);
 await page.selectOption('#route','serine');await page.locator('#play').click();await page.waitForFunction(()=>window.POLY_METABOLIC.snapshot().frames>0);
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));state=await page.evaluate(()=>window.POLY_METABOLIC.snapshot());assert.equal(state.playing,false);assert.equal(state.pending_frame,false);const frames=state.frames;
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));await page.waitForTimeout(120);assert.equal((await page.evaluate(()=>window.POLY_METABOLIC.snapshot())).frames,frames);
 await page.locator('#play').click();await page.waitForFunction(n=>window.POLY_METABOLIC.snapshot().frames>n,frames);await page.locator('#pause').click();assert.deepEqual(errors,[]);
 results.push({mobile,source_fixture_only:true,typed_direction_missing_and_corruption:true,lifecycle_manual_resume:true,no_parameter_inputs:true,inquiry_scope_and_frontiers:true,conditional_challenges:true,hcar1_location_uncertain:true,errors});await page.close();
 }
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(url);await reduced.waitForFunction(()=>window.POLY_METABOLIC?.reconstruction());assert.equal((await reduced.evaluate(()=>window.POLY_METABOLIC.snapshot())).playing,false);await reduced.close();
 const broken=await browser.newPage();await broken.route('**/metabolic-network-data.json',r=>r.fulfill({status:503,body:'unavailable'}));await broken.goto(url);await broken.locator('#reload').waitFor({state:'visible'});assert.equal((await broken.evaluate(()=>window.POLY_METABOLIC.snapshot())).ready,false);await broken.close();
 if(process.env.POLY_METABOLIC_RESULTS)await fs.writeFile(process.env.POLY_METABOLIC_RESULTS,JSON.stringify({schema:'poly.metabolic-browser.v1',results,reduced_motion:true,initial_failure:true,physical_phone:false},null,2));console.log(JSON.stringify({results,reduced_motion:true,initial_failure:true}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});

