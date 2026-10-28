import {readReferenceChunk} from './reference-source-reader.mjs';
export function planReferenceSelection(manifest,keys,{maxRawBytes=4194304,maxEntries=16}={}){
 if(!Array.isArray(keys)||!keys.length||keys.length>maxEntries||new Set(keys).size!==keys.length)throw Error('Invalid reference selection');
 const blocks=[];
 for(const key of keys){const block=manifest.chunks.find(c=>c.keys.includes(key));if(!block)throw Error('Unknown reference selection identity');if(!blocks.includes(block))blocks.push(block);}
 const rawBytes=blocks.reduce((sum,c)=>sum+c.raw_bytes,0);
 if(!Number.isSafeInteger(maxRawBytes)||maxRawBytes<=0||rawBytes>maxRawBytes)throw Error('Reference selection exceeds combined source budget');
 return Object.freeze({keys:[...keys],blocks:blocks.map(c=>c.id),rawBytes,maxRawBytes});
}
export async function loadReferenceSelection(manifest,keys,{catalogue,readBytes,signal,resident=[],readChunk=readReferenceChunk,maxRawBytes=4194304}={}){
 const plan=planReferenceSelection(manifest,keys,{maxRawBytes}),blocks=[];
 for(const id of plan.blocks){signal?.throwIfAborted();const block=resident.find(c=>c.id===id)??await readChunk(manifest,id,{catalogue,readBytes,signal,maxRawBytes});signal?.throwIfAborted();blocks.push(block);}
 const entries=keys.map(key=>{const entry=blocks.flatMap(b=>b.entries).find(e=>e.key===key);if(!entry)throw Error('Reference selection entry missing');return entry;});
 return {plan,blocks,entries};
}
