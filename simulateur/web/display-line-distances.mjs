// Same double-precision accumulation as THREE.Line.computeLineDistances,
// writing into an already-owned float32 display buffer.
export function writeDisplayLineDistances(positions,target){
 if(!(positions instanceof Float32Array)||positions.length%3||!(target instanceof Float32Array)||target.length!==positions.length/3)throw Error('Incompatible display line buffers');
 if(!target.length)return target;target[0]=0;let distance=0;for(let i=1;i<target.length;i++){const offset=i*3,x=positions[offset]-positions[offset-3],y=positions[offset+1]-positions[offset-2],z=positions[offset+2]-positions[offset-1];distance+=Math.sqrt(x*x+y*y+z*z);target[i]=distance;}return target;
}
