(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.PolyRouteGeometry=factory();})(typeof window==='undefined'?globalThis:window,function(){'use strict';
 function build(T,start,end,waypoints=[],options={}){
  for(const p of [start,...waypoints,end])if(![p.x,p.y,p.z].every(Number.isFinite))throw Error('Repère graphique non fini');
  const a=start.clone(),b=end.clone();let points;
  if(waypoints.length)points=[a,...waypoints.map(p=>p.clone()),b];
  else if(a.distanceTo(b)<1e-6){
   // A local operation returns to its actual landmark; never displace the endpoints.
   const s=options.compact?.2:1;
   points=[a,a.clone().add(new T.Vector3(.12,.10,.08).multiplyScalar(s)),a.clone().add(new T.Vector3(.23,0,.13).multiplyScalar(s)),a.clone().add(new T.Vector3(.12,-.10,.08).multiplyScalar(s)),b];
  }else{
   const mid=a.clone().lerp(b,.5),bow=Math.min(options.compact?.025:.35,a.distanceTo(b)*.25);mid.x+=bow;mid.z+=bow*.7;
   points=[a,a.clone().lerp(mid,.65),mid,b];
  }
  const curve=new T.CatmullRomCurve3(points);curve.arcLengthDivisions=400;
  return curve;
 }
 return{build};
});
