const {chromium}=require(process.env.POLY_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs/promises');
const base=process.env.POLY_BASE_URL||'http://127.0.0.1:8124';
(async()=>{const browser=await chromium.launch({headless:true,channel:process.env.POLY_BROWSER_CHANNEL||'chrome',args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const results=[];
try{for(const kind of ['skeleton','review']){
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[];page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.message));
 const stats=()=>page.evaluate(kind==='skeleton'?()=>window.__polySkeletonDiagnostics():()=>window.__polyBoneReview());
 await page.goto(base+'/simulateur/web/'+(kind==='skeleton'?'skeleton-region-lab.html':'bone-review-lab.html'));
 if(kind==='skeleton'){await page.waitForFunction(()=>window.__polySkeletonDiagnostics?.().catalogue_loaded);await page.locator('#skeleton-load').click();await page.waitForFunction(()=>window.__polySkeletonDiagnostics().objects>0);}else{await page.locator('#review-load').click();await page.waitForFunction(()=>window.__polyBoneReview().loaded);await page.locator('#review-show').click();await page.waitForFunction(()=>window.__polyBoneReview().displayed_sources>0);}
 const canvas=page.locator('canvas');await canvas.scrollIntoViewIfNeeded();let rect=await canvas.boundingBox(),point={x:rect.x+rect.width/2,y:rect.y+rect.height/2};
 if(kind==='skeleton'){
  let hit=false;for(let y=.25;y<=.75&&!hit;y+=.1)for(let x=.25;x<=.75&&!hit;x+=.1){const candidate={x:rect.x+rect.width*x,y:rect.y+rect.height*y};await page.touchscreen.tap(candidate.x,candidate.y);if((await stats()).last_pick){point=candidate;hit=true;}}
  assert(hit,'find an actual visible source triangle');await page.locator('#skeleton-region').evaluate(e=>{e.value='all';e.dispatchEvent(new Event('change',{bubbles:true}))});assert.equal((await stats()).last_pick,null);
 }
 const client=await context.newCDPSession(page),touch=(type,points)=>client.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(p=>({...p,radiusX:1,radiusY:1,force:1}))});
 await page.evaluate(()=>{window.__inputTrace=[];const c=document.querySelector('canvas');for(const t of ['pointerdown','pointerup','pointercancel','lostpointercapture'])c.addEventListener(t,e=>window.__inputTrace.push({type:t,id:e.pointerId,x:e.clientX,y:e.clientY}),true)});const a={id:1,x:point.x-10,y:point.y},b={id:2,...point};
 await touch('touchStart',[a]);await touch('touchStart',[a,b]);
 // CDP ends all contacts in its own order. Exercise reverse release explicitly while capture is real.
 await page.evaluate(point=>{const c=document.querySelector('canvas'),id=window.__inputTrace.filter(e=>e.type==='pointerdown').at(-1).id;c.dispatchEvent(new PointerEvent('pointerup',{pointerId:id,clientX:point.x,clientY:point.y,pointerType:'touch',bubbles:true}));},point);await touch('touchEnd',[]);
 if(process.env.POLY_INPUT_TRACE)console.log(JSON.stringify(await page.evaluate(()=>window.__inputTrace)));if(kind==='skeleton')assert.equal((await stats()).last_pick,null,'lifting the second finger must not select a surface');
 const before=await stats();assert(before.view,'camera diagnostics required');const center={x:rect.x+rect.width/2,y:rect.y+rect.height/2};
 const p1={id:1,x:center.x-25,y:center.y},p2={id:2,x:center.x+25,y:center.y};
 await touch('touchStart',[p1,p2]);await touch('touchMove',[{...p1,x:center.x-50},{...p2,x:center.x+50}]);await touch('touchEnd',[]);
 const zoom=await stats();assert(Math.abs(zoom.view.distance-before.view.distance/2)<1e-9);assert.equal(zoom.view.azimuth,before.view.azimuth);assert.equal(zoom.view.elevation,before.view.elevation);
 if(kind==='skeleton')assert.equal(zoom.last_pick,null);
 await canvas.focus();await page.keyboard.press('ArrowRight');assert(Math.abs((await stats()).view.azimuth-zoom.view.azimuth-.1)<1e-12);await page.keyboard.press('+');assert((await stats()).view.distance<zoom.view.distance);
 // Abort a live native pointer gesture through the same lifecycle as a hidden page.
 await touch('touchStart',[p1]);await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});assert.equal((await stats()).input.pointers,0);await touch('touchEnd',[]);await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
 if(kind==='skeleton'){assert.equal((await stats()).last_pick,null);await page.touchscreen.tap(point.x,point.y);assert((await stats()).last_pick,'single touch remains functional');}
 assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 if(process.env.POLY_STATIC_INPUT_SHOTS)await page.locator('.stage').screenshot({path:require('node:path').join(process.env.POLY_STATIC_INPUT_SHOTS,'POLY-input-'+kind+'-mobile.png')});
 results.push({kind,native_chromium_touch_events:true,synthetic_reverse_release_case:true,not_a_physical_phone:true,two_finger_no_pick:true,pinch_only_changes_distance:true,keyboard_camera:true,hidden_page_releases_capture:true,source_namespace:kind==='skeleton'?'skeleton206':'db-review',errors});await context.close();
}}finally{await browser.close();if(process.env.POLY_STATIC_INPUT_RESULTS)await fs.writeFile(process.env.POLY_STATIC_INPUT_RESULTS,JSON.stringify({schema:'poly.static-anatomy-input.v1',results},null,2));}
console.log(JSON.stringify(results,null,2));})().catch(e=>{console.error(e);process.exitCode=1});
