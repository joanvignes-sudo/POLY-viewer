import * as THREE from './vendor/three.module.js?v=audit-o-1';
// Original graphical props: fixed presentation coordinates, no anatomical data.
export function createActivityProps({scene}){
 const props=new THREE.Group();scene.add(props);const chair=new THREE.Group(),table=new THREE.Group(),mat=new THREE.Group();props.add(chair,table,mat);
 function box(group,size,pos,color){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),new THREE.MeshStandardMaterial({color,roughness:.75}));mesh.position.set(...pos);group.add(mesh);return mesh}
 box(chair,[1.25,.16,.95],[0,.87,0],0x286271);box(chair,[1.25,1.4,.14],[0,1.65,-.48],0x286271);for(const x of [-.6,.6]){box(chair,[.14,.18,1.04],[x,1.2,0],0x397e88);for(const z of [-.36,.36])box(chair,[.08,.8,.08],[x,.4,z],0x1c3845)}
 box(table,[1.7,.08,.7],[0,1.18,1.15],0x735f49);for(const x of [-.72,.72])for(const z of [.88,1.42])box(table,[.07,1.14,.07],[x,.57,z],0x53606b);
 const plate=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.025,32),new THREE.MeshStandardMaterial({color:0xe0e9e7}));plate.position.set(-.1,1.24,1.12);table.add(plate);for(let i=0;i<5;i++){const food=new THREE.Mesh(new THREE.SphereGeometry(.048,10,8),new THREE.MeshStandardMaterial({color:i%2?0xe9a668:0x85ad71}));food.position.set(-.2+i*.045,1.28,1.1);table.add(food)}
 box(mat,[1.4,.035,4],[0,-.005,0],0x294652);
 const spoon=new THREE.Group();box(spoon,[.025,.025,.14],[0,0,.05],0xc9d4d5);const bowl=new THREE.Mesh(new THREE.SphereGeometry(.045,10,6),new THREE.MeshStandardMaterial({color:0xc9d4d5}));bowl.scale.set(.7,.25,1.2);bowl.position.z=.1;spoon.add(bowl);spoon.rotation.y=Math.PI;props.add(spoon);
 let disposed=false;
 function setMode(mode){if(disposed)return;chair.visible=['sit','eat'].includes(mode);table.visible=mode==='eat';mat.visible=['lie','sleep'].includes(mode);spoon.visible=mode==='eat';}
 function update(mode,wrist,enabled=true){if(disposed)return;setMode(mode);props.visible=enabled;if(wrist)spoon.position.set(...wrist);}
 function dispose(){if(disposed)return;disposed=true;props.traverse(object=>{object.geometry?.dispose();object.material?.dispose();});props.removeFromParent();props.clear();}
 setMode('stand');return {props,chair,table,mat,spoon,setMode,update,dispose};
}
