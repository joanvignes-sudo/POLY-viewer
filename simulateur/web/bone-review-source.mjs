import {fetchBoundedBytes} from './bounded-fetch.mjs';import {sha256Bytes,readGzipBounded} from './body-chunk-reader.mjs';
export async function readBoneReviewSource({signal,fetcher=fetch}={}){
 const packed=await fetchBoundedBytes(new URL('../data/bone-registration-db.json.gz',import.meta.url),{signal,fetcher,maxBytes:3791556});signal?.throwIfAborted();if(packed.length!==3791556||await sha256Bytes(packed)!=='25b3bffd3c8abbacdd29e684bf21efc703f27312d77a6571bc035316ee4fc937')throw Error('Bone review gzip altered');const raw=await readGzipBounded(packed,15286674);signal?.throwIfAborted();if(raw.length!==15286674||await sha256Bytes(raw)!=='92dc2d58105508a2119ed9a38e627163d110388b30f7607c02cec68a672373d0')throw Error('Bone review source altered');const data=JSON.parse(new TextDecoder().decode(raw));if(data.meshes?.length!==80||!Array.isArray(data.registration?.groups)||data.meshes.some(m=>m.anatomical_registration_validated!==false))throw Error('Bone review inventory or scope altered');return data;
}
export function selectBoneReview(data,{region='all',identity='all'}={}){return data.meshes.filter(m=>(region==='all'||m.group===region)&&(identity==='all'||m.id===identity));}
export function boneReviewGeometry(record,mode='refined'){
 if(!['initial','refined'].includes(mode))throw Error('Unknown stored review placement');const positions=mode==='initial'?record.initial_positions:record.positions,indices=record.indices;
 if(!Array.isArray(positions)||positions.length!==record.positions.length||positions.length%3||!positions.every(Number.isFinite)||!Array.isArray(indices)||indices.length%3||!indices.every(i=>Number.isInteger(i)&&i>=0&&i<positions.length/3))throw Error('Invalid stored review geometry');return {positions,indices};
}
