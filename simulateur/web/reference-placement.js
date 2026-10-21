// A display similarity between geometric proxies, never a validated anatomical registration.
export function alignReferencePoint(point,alignment){
 if(!alignment)return point;
 const [x,y,z]=point.map((v,i)=>v-alignment.source_wrist_proxy[i]),[qx,qy,qz,qw]=alignment.quaternion;
 const tx=2*(qy*z-qz*y),ty=2*(qz*x-qx*z),tz=2*(qx*y-qy*x);
 const rotated=[x+qw*tx+qy*tz-qz*ty,y+qw*ty+qz*tx-qx*tz,z+qw*tz+qx*ty-qy*tx];
 return rotated.map((v,i)=>alignment.target_wrist_proxy[i]+alignment.scale*v);
}
