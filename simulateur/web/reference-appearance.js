import * as THREE from './vendor/three.module.js?v=audit-o-1';
export const referenceOpacity=()=>Number(document.getElementById('reference-opacity')?.value||14)/100;
export function referenceMaterial(kind){return new THREE.MeshStandardMaterial({color:kind==='bone'?0xc9c0ab:0x996e68,roughness:.95,metalness:0,transparent:true,opacity:kind==='bone'?.82:referenceOpacity(),side:THREE.FrontSide,depthTest:true,depthWrite:kind==='bone'});}
export function muscleAppearance(mesh,{selected=false,associated=false,comparison=false,overview=false}={}){mesh.material.color.setHex(comparison?0x8b929e:selected&&!overview?0xb18b78:0x996e68);mesh.material.opacity=overview?referenceOpacity():selected||associated?Math.min(.52,referenceOpacity()*2.3):referenceOpacity()*.32;}
