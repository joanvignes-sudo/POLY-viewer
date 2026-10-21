// Shared CPU/GPU transform: render, anatomical picking and documentary landmarks.
export const smooth=(x,a,b)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
export function armWeight(x,y){return smooth(Math.abs(x),.35,.56)*smooth(y,1.25,1.6)}
function qrotate(p,q){const [x,y,z]=p,{x:qx=0,y:qy=0,z:qz=0,w:qw=1}=q||{};const tx=2*(qy*z-qz*y),ty=2*(qz*x-qx*z),tz=2*(qx*y-qy*x);return [x+qw*tx+qy*tz-qz*ty,y+qw*ty+qz*tx-qx*tz,z+qw*tz+qx*ty-qy*tx]}
export function deformPosition(point,u){const [ox,oy,oz]=point,side=ox>0?1:-1,w=armWeight(ox,oy);let x=ox,y=oy,z=oz;const val=k=>u[k]?.value||0;const rx=(cy,a)=>{const dy=y-cy;y=cy+Math.cos(a)*dy-Math.sin(a)*z;z=Math.sin(a)*dy+Math.cos(a)*z};
if(oy<1.85){rx(.18,val(side>0?'ankL':'ankR')*(1-smooth(oy,.15,.3))*(1-w));rx(.99,val(side>0?'kneeL':'kneeR')*(1-smooth(oy,.88,1.13))*(1-w));rx(1.83,val(side>0?'hipL':'hipR')*(1-smooth(oy,1.65,1.87))*(1-w))}
rx(2.85,(u.armSwingR?val(side>0?'armSwingL':'armSwingR'):val(side>0?'hipR':'hipL')*.55)*w);
if(side<0&&u.eatShoulder){const f=(1-smooth(oy,2.12,2.45))*w;const fore=qrotate([x+.63,y-2.27,z-.03],u.eatForearm.value);x=x*(1-f)+(fore[0]-.63)*f;y=y*(1-f)+(fore[1]+2.27)*f;z=z*(1-f)+(fore[2]+.03)*f;const upper=qrotate([x+.36,y-2.85,z],u.eatShoulder.value);x=x*(1-w)+(upper[0]-.36)*w;y=y*(1-w)+(upper[1]+2.85)*w;z=z*(1-w)+upper[2]*w;}
y+=val('bob');rx(0,val('rootTilt'));const shift=u.rootShift?.value||{x:0,y:0,z:0};return [x+shift.x,y+shift.y,z+shift.z]}
export const rigGLSL=`uniform float hipR;uniform float hipL;uniform float kneeR;uniform float kneeL;uniform float ankR;uniform float ankL;uniform float bob;uniform float armSwingR;uniform float armSwingL;uniform float rootTilt;uniform vec3 rootShift;uniform vec4 eatShoulder;uniform vec4 eatForearm;
vec3 polyQ(vec3 p,vec4 q){return p+2.0*cross(q.xyz,cross(q.xyz,p)+q.w*p);}
vec3 polyRX(vec3 p,float cy,float a){p.y-=cy;float s=sin(a),co=cos(a);p.yz=mat2(co,s,-s,co)*p.yz;p.y+=cy;return p;}
vec3 polyDeform(vec3 pos){vec3 p=pos;float side=p.x>0.0?1.0:-1.0;float w=smoothstep(0.35,0.56,abs(pos.x))*smoothstep(1.25,1.6,pos.y);
if(pos.y<1.85){float hip=side>0.0?hipL:hipR;float knee=side>0.0?kneeL:kneeR;float ank=side>0.0?ankL:ankR;p=polyRX(p,0.18,ank*(1.0-smoothstep(0.15,0.3,pos.y))*(1.0-w));p=polyRX(p,0.99,knee*(1.0-smoothstep(0.88,1.13,pos.y))*(1.0-w));p=polyRX(p,1.83,hip*(1.0-smoothstep(1.65,1.87,pos.y))*(1.0-w));}
p=polyRX(p,2.85,(side>0.0?armSwingL:armSwingR)*w);
if(side<0.0){float f=(1.0-smoothstep(2.12,2.45,pos.y))*w;vec3 e=vec3(-0.63,2.27,0.03),s=vec3(-0.36,2.85,0.0);p=mix(p,polyQ(p-e,eatForearm)+e,f);p=mix(p,polyQ(p-s,eatShoulder)+s,w);}p.y+=bob;p=polyRX(p,0.0,rootTilt);return p+rootShift;}
`;
