// Display transform shared by trunk surfaces and documentary routes.
// No arm/leg weights, chest expansion or physiological contraction is inferred.
export function deformReferenceTrunk(point,u){
 const value=k=>u[k]?.value||0,[x,baseY,z]=point,y=baseY+value('bob'),a=value('rootTilt'),shift=u.rootShift?.value||{x:0,y:0,z:0};
 return[x+shift.x,Math.cos(a)*y-Math.sin(a)*z+shift.y,Math.sin(a)*y+Math.cos(a)*z+shift.z];
}
export const trunkGLSL=`vec3 polyReferenceTrunk(vec3 p){p.y+=bob;p=polyRX(p,0.0,rootTilt);return p+rootShift;}`;
