// Regional leg surfaces must not acquire arm weights at a broad lateral thigh.
// Pose illustration only; these weights are not a biomechanical muscle model.
import {smooth} from './rig.js?v=audit-o-1';
export function deformReferenceLeg(point,u){
 const [ox,oy,oz]=point,side=ox>0?1:-1;let x=ox,y=oy,z=oz;
 const val=k=>u[k]?.value||0,rx=(cy,a)=>{const dy=y-cy;y=cy+Math.cos(a)*dy-Math.sin(a)*z;z=Math.sin(a)*dy+Math.cos(a)*z};
 if(oy<1.85){rx(.18,val(side>0?'ankL':'ankR')*(1-smooth(oy,.15,.3)));rx(.99,val(side>0?'kneeL':'kneeR')*(1-smooth(oy,.88,1.13)));rx(1.83,val(side>0?'hipL':'hipR')*(1-smooth(oy,1.65,1.87)))}
 y+=val('bob');rx(0,val('rootTilt'));const shift=u.rootShift?.value||{x:0,y:0,z:0};return [x+shift.x,y+shift.y,z+shift.z];
}
export const legGLSL=`vec3 polyReferenceLeg(vec3 pos){vec3 p=pos;float side=p.x>0.0?1.0:-1.0;
 if(pos.y<1.85){p=polyRX(p,0.18,(side>0.0?ankL:ankR)*(1.0-smoothstep(0.15,0.3,pos.y)));p=polyRX(p,0.99,(side>0.0?kneeL:kneeR)*(1.0-smoothstep(0.88,1.13,pos.y)));p=polyRX(p,1.83,(side>0.0?hipL:hipR)*(1.0-smoothstep(1.65,1.87,pos.y)));}
 p.y+=bob;p=polyRX(p,0.0,rootTilt);return p+rootShift;}`;
