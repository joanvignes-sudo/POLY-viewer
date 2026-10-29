// Area-weighted indexed display normals, following Three.js triangle and Float32 write order.
// Display buffers only: original source positions/indices are never changed.
export function writeIndexedDisplayNormals(positions,indices,normals){
 if(!(positions instanceof Float32Array)||!(indices instanceof Uint32Array)||!(normals instanceof Float32Array)||positions.length%3||indices.length%3||normals.length!==positions.length||positions.buffer===normals.buffer||indices.buffer===normals.buffer)throw Error('Invalid indexed display buffers');
 const count=positions.length/3;
 for(let i=0;i<positions.length;i++)if(!Number.isFinite(positions[i]))throw Error('Non-finite display position');
 for(let i=0;i<indices.length;i++)if(indices[i]>=count)throw Error('Display index outside positions');
 normals.fill(0);
 for(let i=0;i<indices.length;i+=3){
  const a=indices[i]*3,b=indices[i+1]*3,c=indices[i+2]*3;
  const cbx=positions[c]-positions[b],cby=positions[c+1]-positions[b+1],cbz=positions[c+2]-positions[b+2];
  const abx=positions[a]-positions[b],aby=positions[a+1]-positions[b+1],abz=positions[a+2]-positions[b+2];
  const x=cby*abz-cbz*aby,y=cbz*abx-cbx*abz,z=cbx*aby-cby*abx;
  normals[a]+=x;normals[a+1]+=y;normals[a+2]+=z;
  normals[b]+=x;normals[b+1]+=y;normals[b+2]+=z;
  normals[c]+=x;normals[c+1]+=y;normals[c+2]+=z;
 }
 for(let i=0;i<normals.length;i+=3){const x=normals[i],y=normals[i+1],z=normals[i+2],inverse=1/(Math.sqrt(x*x+y*y+z*z)||1);normals[i]=x*inverse;normals[i+1]=y*inverse;normals[i+2]=z*inverse;}
 return normals;
}
