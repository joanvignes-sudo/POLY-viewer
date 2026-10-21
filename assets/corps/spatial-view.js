(()=>{'use strict';window.PolySpatialView=function(T,scene,host,point){
 const layer=new T.Group();scene.add(layer);
 const baseMat=new T.LineDashedMaterial({color:0x91ddec,transparent:true,opacity:.75,dashSize:.06,gapSize:.035,depthTest:false});
 const line=new T.Line(new T.BufferGeometry(),baseMat);line.renderOrder=16;layer.add(line);
 const endLine=new T.Line(new T.BufferGeometry(),new T.LineDashedMaterial({color:0xa6b4ae,transparent:true,opacity:.4,dashSize:.035,gapSize:.055,depthTest:false}));endLine.renderOrder=16;layer.add(endLine);
 const trail=new T.Line(new T.BufferGeometry(),new T.LineBasicMaterial({color:0xf1f8ac,transparent:true,opacity:1,depthTest:false}));trail.renderOrder=18;layer.add(trail);
 const dotMat=new T.MeshBasicMaterial({color:0xfbffd3,depthTest:false});
 const dots=Array.from({length:8},(_,i)=>{const m=new T.Mesh(new T.SphereGeometry(.044-i*.003,12,8),new T.MeshBasicMaterial({color:0xf4ffa8,transparent:true,opacity:1-i*.105,depthTest:false}));m.renderOrder=20;layer.add(m);return m;});
 const stops=Array.from({length:2},()=>{const m=new T.Mesh(new T.TorusGeometry(.09,.014,8,40),dotMat);m.renderOrder=19;layer.add(m);return m;});
 const breakMark=new T.Mesh(new T.OctahedronGeometry(.10),new T.MeshBasicMaterial({color:0xf2b27c,depthTest:false,wireframe:true}));breakMark.renderOrder=20;layer.add(breakMark);
 const parallel=Array.from({length:3},()=>{const l=new T.Line(new T.BufferGeometry(),new T.LineDashedMaterial({color:0x9fe2f0,dashSize:.035,gapSize:.025,depthTest:false}));l.renderOrder=17;layer.add(l);return l;});
 const labels=document.createElement('div');labels.className='spatial-labels';host.append(labels);
 const makeLabel=cls=>{const e=document.createElement('div');e.className='spatial-label '+cls;labels.append(e);return e;};
 const linkSvg=document.createElementNS('http://www.w3.org/2000/svg','svg'),linkPath=document.createElementNS('http://www.w3.org/2000/svg','path');linkSvg.classList.add('mechanism-link');linkSvg.setAttribute('aria-hidden','true');linkSvg.append(linkPath);host.append(linkSvg);
 const fromLabel=makeLabel('from'),toLabel=makeLabel('to'),gapLabel=makeLabel('gap');
 let currentKey='',currentGroup='',plan=null,curve=null,positions=null,drawn=-1,contextSites=[];
 function graphicEndpoint(e,side){
  if(e.layout)return new T.Vector3(...e.layout);
  if(e.anchor){const p=point(e.anchor);if(p)return p;}
  // Docking stations live beside the body. These are layout slots, never anatomy.
  return new T.Vector3(1.32,side===0?2.95:1.20,.32);
 }
 function project(label,v,camera,offset=14){const p=v.clone().project(camera);const x=(p.x*.5+.5)*host.clientWidth,y=(-p.y*.5+.5)*host.clientHeight;label.hidden=p.z>=1||Math.abs(p.x)>1.2||Math.abs(p.y)>1.2;label.style.left=Math.max(8,Math.min(host.clientWidth-190,x+offset))+'px';label.style.top=Math.max(6,Math.min(host.clientHeight-40,y-10))+'px';}
 function render(model,camera,brainFocus){
  const candidate=model.spatialPlan;if(!candidate){layer.visible=false;labels.hidden=true;return;}
  plan=candidate;const intracranial=['brain','brainstem','thalamus','insula','amygdala','striatum','prefrontal','occipital'];const showInAtlas=intracranial.includes(plan.from.anchor)&&intracranial.includes(plan.to.anchor);layer.visible=!brainFocus||showInAtlas;labels.hidden=brainFocus&&!showInAtlas;if(brainFocus&&!showInAtlas){Object.assign(host.dataset,{spatialGroup:plan.group,spatialInterval:plan.interval,spatialProgress:PolySpatial.progress(plan,model.visualJourney?.progress||0).toFixed(4),spatialRouteStatus:plan.routeStatus,spatialMode:plan.mode,spatialRole:plan.routeRole||'',spatialDrawnPoints:'0',spatialMissingAnchors:[plan.from,...(plan.waypoints||[]),plan.to].filter(e=>e.anchor&&!point(e.anchor)).map(e=>e.anchor).join(',')});delete host.dataset.graphicHead;host.dataset.spatialTrace='focus-brain';return;}
  const key=plan.group+'|'+plan.interval+'|'+plan.edgeId+'|'+(plan.routeAlternative||'');
  if(key!==currentKey){currentKey=key;fromLabel.textContent='① '+plan.from.label;toLabel.textContent='② '+plan.to.label;gapLabel.textContent='Hypothèse de trajet · à confirmer';drawn=-1;}
  if(currentGroup!==plan.group){currentGroup=plan.group;for(const s of contextSites){layer.remove(s.marker);s.marker.geometry.dispose();s.marker.material.dispose();s.label.remove();}contextSites=[];const seen=new Set();for(const n of model.group.nodes)for(const b of PolySpatial.bindings(model.group,n)){if(!b||seen.has(b.anchor))continue;seen.add(b.anchor);const marker=new T.Mesh(new T.SphereGeometry(.035,10,8),new T.MeshBasicMaterial({color:0x9ed8ca,depthTest:false,transparent:true,opacity:.65}));layer.add(marker);marker.renderOrder=15;const label=makeLabel('context-site');label.textContent=PolySpatial.names[b.anchor]+' · repère';contextSites.push({anchor:b.anchor,marker,label});}}
  for(const s of contextSites){const p=point(s.anchor);s.marker.visible=!!p;if(p){s.marker.position.copy(p);project(s.label,p,camera,-150);if([plan.from.anchor,plan.to.anchor].includes(s.anchor))s.label.hidden=true;}}
  let prior=-30;for(const s of [...contextSites].filter(s=>!s.label.hidden).sort((a,b)=>parseFloat(a.label.style.top)-parseFloat(b.label.style.top))){const top=Math.max(prior+23,parseFloat(s.label.style.top)||0);s.label.style.top=top+'px';prior=top;}
  const from=graphicEndpoint(plan.from,0),to=graphicEndpoint(plan.to,1);
  const mid=from.clone().lerp(to,.5);mid.x+=(plan.from.anchor&&plan.to.anchor===plan.from.anchor)?.3:.48;mid.z+=.38;
  
  const via=(plan.waypoints||[]).map(e=>graphicEndpoint(e,0));
  curve=PolyRouteGeometry.build(T,from,to,via,{compact:showInAtlas});
  positions=curve.getSpacedPoints(80);
  const boundary=plan.boundary&&!plan.routeStatus,color=plan.routeStatus==='MEASUREMENT_ROUTE'||plan.routeStatus==='DOCUMENTARY_OPERATIONS'?0x9fe2f0:plan.routeStatus==='CLINICAL_CONDITION'?0xc3b9f4:plan.hypotheticalRoute?0xf5bd84:plan.mode==='BODY'?0xbfe986:plan.mode==='DATA'?0x9fe2f0:plan.mode==='OPEN'?0xf5bd84:0xc3b9f4;
  baseMat.color.setHex(brainFocus?0x65fff1:color);trail.material.color.setHex(brainFocus?0x65fff1:0xf1f8ac);dotMat.color.setHex(brainFocus?0x65fff1:0xfbffd3);dots.forEach(m=>m.material.color.setHex(brainFocus?0x65fff1:0xf4ffa8));baseMat.dashSize=brainFocus ? .012 : .06;baseMat.gapSize=brainFocus ? .007 : .035;line.geometry.setFromPoints(boundary?positions.slice(0,35):positions);line.computeLineDistances();
  endLine.visible=boundary;breakMark.visible=boundary;gapLabel.hidden=!boundary;
  if(boundary){endLine.geometry.setFromPoints(positions.slice(46));endLine.computeLineDistances();breakMark.position.copy(curve.getPointAt(.5));project(gapLabel,breakMark.position,camera);}
  host.dataset.spatialHypothesis=String(!!plan.hypotheticalRoute);
  const progress=PolySpatial.progress(plan,model.visualJourney?.progress||0);
  const head=curve.getPointAt(progress).project(camera),card=document.getElementById('micro-card'),rect=host.getBoundingClientRect(),cr=card?.getBoundingClientRect();
  linkSvg.style.display=cr?.width&&!brainFocus&&Math.abs(head.x)<1&&Math.abs(head.y)<1?'block':'none';
  if(cr?.width){const x=(head.x*.5+.5)*host.clientWidth,y=(-head.y*.5+.5)*host.clientHeight,cx=cr.right-rect.left,cy=cr.top-rect.top+cr.height*.5;linkSvg.setAttribute('viewBox','0 0 '+host.clientWidth+' '+host.clientHeight);linkPath.setAttribute('d','M '+x+' '+y+' Q '+((x+cx)/2)+' '+y+' '+cx+' '+cy);}
  host.dataset.graphicHead=JSON.stringify(curve.getPointAt(progress).toArray());
  parallel.forEach((l,i)=>{const r=plan.parallelRoutes?.[i];l.visible=!!r;if(r){const f=graphicEndpoint(r.from,0),t=graphicEndpoint(r.to,1);const c=new T.CatmullRomCurve3([f,f.clone().lerp(t,.5).add(new T.Vector3(0,0,.2)),t]);l.geometry.setFromPoints(c.getPoints(40).slice(0,Math.max(2,Math.floor(progress*40)+1)));l.computeLineDistances();}});
  host.dataset.spatialParallelRoutes=String(plan.parallelRoutes?.length||0);host.dataset.spatialAlternative=plan.routeAlternative||'';host.dataset.spatialRole=plan.routeRole||'';
  const count=Math.max(2,Math.floor(progress*80)+1);trail.geometry.setFromPoints(positions.slice(0,count));trail.visible=plan.routeStatus!=='CLINICAL_CONDITION'&&!plan.parallelRoutes?.length;line.visible=!plan.parallelRoutes?.length;
  dots.forEach((m,i)=>{const q=progress-i*.021;m.visible=q>=0&&plan.routeStatus!=='CLINICAL_CONDITION'&&!plan.parallelRoutes?.length;m.position.copy(curve.getPointAt(Math.max(0,q)));m.scale.setScalar(brainFocus ? .32 : 1);});
  stops[0].position.copy(from);stops[1].position.copy(to);stops.forEach(m=>{m.quaternion.copy(camera.quaternion);m.scale.setScalar(brainFocus ? .18 : 1);});
  project(fromLabel,from,camera);project(toLabel,to,camera,from.distanceTo(to)<.18?-190:14);if(brainFocus){fromLabel.style.left='16px';toLabel.style.left='16px';fromLabel.style.top='52px';toLabel.style.top='90px';}toLabel.dataset.kind=plan.to.type;if(Math.abs(parseFloat(fromLabel.style.top)-parseFloat(toLabel.style.top))<30){toLabel.style.top=Math.max(6,Math.min(host.clientHeight-38,parseFloat(fromLabel.style.top)+32))+'px';}
  host.dataset.spatialRouteStatus=plan.routeStatus;host.dataset.spatialWaypoints=String(plan.waypoints?.length||0);host.dataset.spatialMissingAnchors=[plan.from,...(plan.waypoints||[]),plan.to].filter(e=>e.anchor&&!point(e.anchor)).map(e=>e.anchor).join(',');host.dataset.spatialTrace='true';host.dataset.spatialMode=plan.mode;host.dataset.spatialInterval=plan.interval;host.dataset.spatialGroup=plan.group;host.dataset.spatialProgress=progress.toFixed(4);host.dataset.spatialBoundary=String(boundary);host.dataset.spatialEndpoints=String(plan.from.anchor||'outside')+'→'+String(plan.to.anchor||'outside');host.dataset.spatialDrawnPoints=String(count);const controls=host.parentElement.querySelector('.brain-tools');if(controls){const reserved=controls.getBoundingClientRect(),frame=host.getBoundingClientRect();for(const label of labels.querySelectorAll('.spatial-label:not([hidden])')){const r=label.getBoundingClientRect();if(r.left<reserved.right+8&&r.right>reserved.left-8&&r.top<reserved.bottom+8&&r.bottom>reserved.top-8)label.style.left=Math.max(8,reserved.left-frame.left-r.width-14)+'px';}}
 }
 return{render,dispose(){labels.remove();linkSvg.remove();scene.remove(layer);layer.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});}};
};})();
