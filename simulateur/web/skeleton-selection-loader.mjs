import {validateSkeletonManifest,readSkeletonChunk} from './skeleton-source-reader.mjs';
export function planSkeletonSelection(manifest,keys,maxRawBytes){
 validateSkeletonManifest(manifest);if(!Number.isSafeInteger(maxRawBytes)||maxRawBytes<1||maxRawBytes>16777216||!Array.isArray(keys)||!keys.length||keys.length>208||new Set(keys).size!==keys.length)throw Error('Invalid skeleton selection budget or identities');
 const wanted=new Set(keys),chunks=manifest.chunks.filter(c=>c.keys.some(k=>wanted.has(k)));if(keys.some(key=>!chunks.some(c=>c.keys.includes(key))))throw Error('Unknown skeleton selection identity');const rawBytes=chunks.reduce((sum,c)=>sum+c.raw_bytes,0);if(rawBytes>maxRawBytes)throw Error('Sélection au-delà du budget brut ; choisir explicitement un budget suffisant');return {ids:chunks.map(c=>c.id),rawBytes,objectCount:chunks.reduce((sum,c)=>sum+c.keys.length,0)};
}
export async function loadSkeletonSelection(manifest,keys,{catalogue,readBytes,signal,maxRawBytes=4194304}={}){
 const plan=planSkeletonSelection(manifest,keys,maxRawBytes),blocks=[];for(const id of plan.ids){signal?.throwIfAborted();blocks.push(await readSkeletonChunk(manifest,id,{catalogue,readBytes,signal,maxRawBytes:4194304}));}signal?.throwIfAborted();return Object.freeze({id:plan.ids.join('+'),ids:plan.ids,rawBytes:plan.rawBytes,entries:blocks.flatMap(b=>b.entries)});
}
