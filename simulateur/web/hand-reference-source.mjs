import {fetchBoundedBytes} from './bounded-fetch.mjs';
import {sha256Bytes,readGzipBounded} from './body-chunk-reader.mjs';
export const HAND_REFERENCE_SOURCE=Object.freeze({rawBytes:1538211,sha256:'1d1f3a9b3d404995b6fff486cdc7a01af3292a2eb1777a04f1799ebbfc4b56f4'});
export function planHandBuffers(data,maxBufferBytes=4*1024*1024){
  if(!Array.isArray(data?.parts)||data.parts.length!==76)throw Error('Hand reference coverage invalid');
  const ids=new Set();let vertices=0,indices=0;
  for(const p of data.parts){
    if(typeof p.id!=='string'||ids.has(p.id)||!['bone','muscle'].includes(p.kind)||!['R','L'].includes(p.side))throw Error('Hand source identity invalid');ids.add(p.id);
    if(!Array.isArray(p.positions)||!p.positions.length||p.positions.length%3||!p.positions.every(Number.isFinite)||
      !Array.isArray(p.indices)||p.indices.length%3||!p.indices.every(i=>Number.isInteger(i)&&i>=0&&i<p.positions.length/3))throw Error('Hand source geometry invalid');
    vertices+=p.positions.length/3;indices+=p.indices.length;
  }
  // Two position/normal/index sets (preview and body) + body base positions.
  // Index arrays are conservatively budgeted as uint32 even when Three.js uses uint16.
  const bufferUpperBound=vertices*60+indices*8;
  if(!Number.isSafeInteger(maxBufferBytes)||bufferUpperBound>maxBufferBytes)throw Error('Hand geometry buffer budget exceeded');
  return {parts:76,vertices,indices,bufferUpperBound};
}
export async function readHandReference({signal,maxBufferBytes=4*1024*1024,fetcher=fetch,hash=sha256Bytes,unzip=readGzipBounded}={}){
  const packed=await fetchBoundedBytes(new URL('../data/hand-muscles-reference.json.gz',import.meta.url),{maxBytes:1024*1024,signal,fetcher});
  const raw=await unzip(packed,HAND_REFERENCE_SOURCE.rawBytes);signal?.throwIfAborted();
  if(raw.byteLength!==HAND_REFERENCE_SOURCE.rawBytes||await hash(raw)!==HAND_REFERENCE_SOURCE.sha256)throw Error('Hand reference altered');
  const data=JSON.parse(new TextDecoder().decode(raw)),plan=planHandBuffers(data,maxBufferBytes);signal?.throwIfAborted();return {data,plan};
}
