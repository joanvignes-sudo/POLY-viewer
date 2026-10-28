import {findGroupOccluders,occlusionSceneKey} from './selective-occlusion.js';
import {createSourceMaterialSession} from './body-source-material-session.mjs';
export function isNeutralRig(uniforms){
 const scalar=['hipR','hipL','kneeR','kneeL','ankR','ankL','bob','armSwingR','armSwingL','rootTilt'];
 return scalar.every(key=>uniforms[key]?.value===0)&&['x','y','z'].every(key=>uniforms.rootShift?.value?.[key]===0)&&['eatShoulder','eatForearm'].every(key=>uniforms[key]?.value?.w===1&&['x','y','z'].every(axis=>uniforms[key]?.value?.[axis]===0));
}
// Only IDs/scalars are cached. Material changes exist solely during a synchronous render.
export function createResidentOcclusion(getMeshes,{detect=findGroupOccluders,keyFor=occlusionSceneKey}={}){
 const session=createSourceMaterialSession(getMeshes);let key='',ids=[],rendering=false,detections=0,hits=0;
 return {
  render(camera,targetIds,render){
   if(rendering)throw Error('Occlusion render already active');
   const meshes=getMeshes(),targets=meshes.filter(m=>targetIds.includes(m.userData.source_index));
   const nextKey=keyFor(camera,targets,meshes);
   if(nextKey!==key){ids=[...new Set(detect(camera,targets,meshes).map(m=>m.userData.source_index))];key=nextKey;detections++;}else hits++;
   const opacity=new Map(meshes.map(m=>[m.userData.source_index,m.material?.opacity]));rendering=true;
   try{session.capture(ids);session.apply(data=>({opacity:Math.min(.12,opacity.get(data.source_index)),transparent:true,depthWrite:false}));return render();}
   finally{session.restore();rendering=false;}
  },
  clear(){if(rendering)throw Error('Cannot clear during occlusion render');session.restore();key='';ids=[];},
  info(){return {cached_source_indices:[...ids],cached_key_characters:key.length,saved_materials:session.size,rendering,detections,cache_hits:hits};},
 };
}
