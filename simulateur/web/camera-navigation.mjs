export const CAMERA_POLE_LIMIT=Math.PI/2-.01;
const directions={front:[0,0],back:[Math.PI,0],right:[-Math.PI/2,0],left:[Math.PI/2,0],top:[0,CAMERA_POLE_LIMIT],bottom:[0,-CAMERA_POLE_LIMIT]};
export function orientedCamera(view,direction){if(!directions[direction])throw Error('Unknown camera orientation');const [azimuth,elevation]=directions[direction];return {...copy(view),azimuth,elevation};}
function copy(view){
 if(!Array.isArray(view?.target)||view.target.length!==3||!view.target.every(Number.isFinite)||![view.distance,view.azimuth,view.elevation].every(Number.isFinite)||view.distance<=0||Math.abs(view.elevation)>CAMERA_POLE_LIMIT)throw Error('Invalid camera snapshot');
 return {target:[...view.target],distance:view.distance,azimuth:view.azimuth,elevation:view.elevation};
}
export function createCameraHistory(capacity=16){
 if(!Number.isInteger(capacity)||capacity<1||capacity>64)throw Error('Invalid camera history capacity');const entries=[];
 return {push(view){const next=copy(view);if(JSON.stringify(entries.at(-1))!==JSON.stringify(next))entries.push(next);if(entries.length>capacity)entries.shift();},pop(){return entries.length?copy(entries.pop()):null;},clear(){entries.length=0;},get size(){return entries.length}};
}
