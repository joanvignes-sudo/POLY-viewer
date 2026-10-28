import {verifySourceText} from './source-text-integrity.mjs';
import {fetchBoundedBytes} from './bounded-fetch.mjs';
import {sha256Bytes,readGzipBounded} from './body-chunk-reader.mjs';
export const CEREBRA_SOURCE=Object.freeze({
  metadataSha256:'fbf9c0d44bbc7aa84d62e7c5d57d13655e46e9be17f1f662622acc057b1470f9',
  geometrySha256:'4630d8682ddf780aaccfadb52876f94e903ae07b5cb294a773c5f6c0538c96b1',rawBytes:5372724,
});
export function planCerebraBuffers(meta,maxBufferBytes){
  if(meta?.species!=='Homo sapiens'||meta.units!=='mm'||meta.space!=='MNI152NLin2009cSym'||
    !Array.isArray(meta.regions)||meta.regions.length!==17||meta.mesh_sha256!==CEREBRA_SOURCE.geometrySha256)
    throw Error('CerebrA source identity invalid');
  const seen=new Set();let vertices=0;
  for(const r of meta.regions){
    if(typeof r.id!=='string'||seen.has(r.id))throw Error('CerebrA region identity invalid');seen.add(r.id);
    for(const [key,count]of [['position_offset',r.vertices],['index_offset',r.triangles]])
      if(!Number.isSafeInteger(count)||count<=0||!Number.isSafeInteger(r[key])||r[key]<0||r[key]%4||r[key]+count*12>CEREBRA_SOURCE.rawBytes)
        throw Error('CerebrA source range invalid');
    vertices+=r.vertices;
  }
  // Original binary retained by index views + base, display positions, computed normal arrays.
  const bufferBytes=CEREBRA_SOURCE.rawBytes+vertices*36;
  if(!Number.isSafeInteger(maxBufferBytes)||maxBufferBytes<=0||bufferBytes>maxBufferBytes)throw Error('CerebrA display buffer budget exceeded');
  return {bufferBytes,rawBytes:CEREBRA_SOURCE.rawBytes,vertices,regions:17};
}
export async function readCerebraSource({maxBufferBytes=12*1024*1024,signal,fetcher=fetch,hash=sha256Bytes,unzip=readGzipBounded}={}){
  const root=new URL('../models/cerebra/',import.meta.url);
  const bytes=await fetchBoundedBytes(new URL('ATLAS_ANATOMIQUE.json',root),{maxBytes:65536,signal,fetcher});
  const text=await verifySourceText(bytes,CEREBRA_SOURCE.metadataSha256,{hash}).catch(()=>{throw Error('CerebrA metadata altered')});
  signal?.throwIfAborted();const meta=JSON.parse(text),plan=planCerebraBuffers(meta,maxBufferBytes);
  const packed=await fetchBoundedBytes(new URL('cerebra-surfaces.bin.gz',root),{maxBytes:4*1024*1024,signal,fetcher});
  const raw=await unzip(packed,CEREBRA_SOURCE.rawBytes);signal?.throwIfAborted();
  if(raw.byteLength!==CEREBRA_SOURCE.rawBytes||await hash(raw)!==CEREBRA_SOURCE.geometrySha256)throw Error('CerebrA geometry altered');
  signal?.throwIfAborted();
  return {meta,buffer:raw.byteOffset===0&&raw.byteLength===raw.buffer.byteLength?raw.buffer:raw.slice().buffer,plan};
}
