import {createC4Lineage} from './c4-lineage.mjs';
import {virtualGrid} from './c4-spatial-core.mjs';

// Conservative share of an existing normalized pool, never local concentration.
export function createC4VoxelLineage(receipt){
 const pool=createC4Lineage(receipt),seed=receipt.request.seed,grid=virtualGrid(seed);
 return {snapshot(index,hypothesis,voxelIndex){
  if(!Number.isInteger(voxelIndex)||voxelIndex<0||voxelIndex>=grid.cells.length)throw Error('Indice de voxel virtuel incompatible');
  const trace=pool.snapshot(index,hypothesis),cell=grid.cells[voxelIndex];
  const get=key=>trace.nodes.find(n=>n.key===key),template=get(hypothesis+':retained');
  const selected=template.value,reference=get('gln:retained').value;
  const prefix=trace.roots.net+':voxel:'+voxelIndex,id=key=>prefix+':'+key;
  const spatial={index:voxelIndex,ijk:[Math.floor(voxelIndex/144),Math.floor(voxelIndex/12)%12,voxelIndex%12],position:[...cell.position],weight:cell.weight,seed,grid:12,frame:'virtual dimensionless cube [-1,1]^3',coordinate_unit:'1',origin:'analyst_spatial_hypothesis',algorithm:'LCG32 + normalized discrete Gaussian v1',center:[...grid.center],anatomical_registration:false,cell_identity:null};
  function add(key,label,value,unit,parents,law,origin){
   const node=structuredClone(template);Object.assign(node,{id:id(key),key:'spatial:'+key,label,value,unit,parents,law,origin});
   node.location={frame:spatial.frame,position:[...spatial.position],coordinate_unit:'1',voxel_index:voxelIndex,anatomical_registration:false,compartment:'share of normalized neuronal C4 pool'};
   node.unknowns=[...node.unknowns,'Voxel tissue mass, volume and concentration'];trace.nodes.push(node);
  }
  add('placement','Placement virtuel : graine',seed,'seed',[],'Seed identifies the declared virtual placement, not observed tissue','analyst_hypothesis');
  add('weight','Poids conservatif du voxel',cell.weight,'1',[id('placement')],'Discrete Gaussian weight divided by sum over 1728 voxels','analyst_hypothesis');
  add('selected','Part du marquage sélectionné',cell.weight*selected,'normalized pool fraction',[id('weight'),template.id],'voxel share=weight*selected pool fraction','model_derived');
  add('reference','Part du marquage Glu/Gln',cell.weight*reference,'normalized pool fraction',[id('weight'),get('gln:retained').id],'voxel reference share=same weight*reference pool fraction','model_derived');
  add('difference','Écart du voxel à Glu/Gln',cell.weight*(selected-reference),'normalized pool fraction',[id('selected'),id('reference')],'voxel difference=weight*(selected-reference); same positions and tau','model_derived');
  trace.roots.voxel=id('difference');trace.spatial=spatial;
  trace.scope.voxel_quantity='share of normalized pool, not local concentration';
  return trace;
 }};
}
