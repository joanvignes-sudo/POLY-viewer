// Independent Z-Anatomy source namespace. No HRA registration or transform is applied.
import {sha256Bytes,readGzipBounded} from './body-chunk-reader.mjs';
import {fetchBoundedBytes} from './bounded-fetch.mjs';
const SOURCE='23b699c0b1ff01cdc4f882c481c74e3933cff846694c9b5aded802ba097a3140',PACKED='0594c0bb7aeeeb7684409de4e8afdcb941598c723ad6fce3942b4804d60c94b4';
const REGISTRY='c55893ac02f650132e66e1bba1a4e392887c9f41f0b7d817d2e76f6e138dcd5a',REGISTRY_PACKED='e0e3794d69dc0b60592e811c681f0a7259bff419389de8a3a1c0056a40767dff';
const check=(ok,message)=>{if(!ok)throw Error(message);},integer=n=>Number.isSafeInteger(n)&&n>=0,hex=s=>typeof s==='string'&&/^[a-f0-9]{64}$/.test(s),proof=new WeakMap();
function sizes(c,max){return integer(c.raw_bytes)&&c.raw_bytes>0&&c.raw_bytes<=max&&integer(c.compressed_bytes)&&c.compressed_bytes>0&&c.compressed_bytes<=max&&hex(c.raw_sha256)&&hex(c.compressed_sha256);}
export function validateSkeletonManifest(m){
 check(m?.schema==='poly.skeleton-source-manifest.v1'&&m.namespace==='skeleton206'&&m.published===false&&m.status==='experimental_not_deployed'&&m.source_value_verification==='PASS','Verified unpublished skeleton manifest required');
 check(m.coordinate_policy==='exact_json_float64_le_uint32_le_no_transform'&&JSON.stringify(m.source_pins?.['skeleton-source-206'])===JSON.stringify([PACKED,SOURCE])&&JSON.stringify(m.source_pins?.['skeleton-worksite-206'])===JSON.stringify([REGISTRY_PACKED,REGISTRY]),'Skeleton provenance changed');
 check(m.source_objects===208&&m.bone_concepts===206&&integer(m.chunk_budget_bytes)&&m.chunk_budget_bytes>=608448&&m.chunk_budget_bytes<=4194304&&Array.isArray(m.chunks)&&m.chunks.length>0&&m.chunks.length<=208,'Skeleton inventory or budget changed');
 const ids=new Set(),keys=new Set();for(const c of m.chunks){check(/^skeleton-\d{3}$/.test(c.id)&&!ids.has(c.id),'Invalid skeleton block identity');ids.add(c.id);check(c.geometry==='chunks/'+c.id+'.bin.gz'&&c.metadata==='chunks/'+c.id+'.json'&&sizes(c,m.chunk_budget_bytes)&&hex(c.metadata_sha256)&&Array.isArray(c.keys)&&c.keys.length>0,'Invalid skeleton block proof');for(const key of c.keys){const match=/^skeleton206\/(0|[1-9]\d*)$/.exec(key);check(match&&Number(match[1])<208&&!keys.has(key),'Invalid skeleton source identity');keys.add(key);}}
 check(keys.size===208&&m.catalogue?.path==='CATALOGUE.json.gz'&&sizes(m.catalogue,1048576),'Incomplete skeleton catalogue');return m;
}
async function verifiedPayload(c,readBytes,signal){
 const packed=await readBytes(c.path??c.geometry,{signal,maxBytes:c.compressed_bytes});signal?.throwIfAborted();check(packed.byteLength===c.compressed_bytes&&await sha256Bytes(packed)===c.compressed_sha256,'Skeleton compressed bytes altered');signal?.throwIfAborted();const raw=await readGzipBounded(packed,c.raw_bytes);signal?.throwIfAborted();check(raw.byteLength===c.raw_bytes&&await sha256Bytes(raw)===c.raw_sha256,'Skeleton raw bytes altered');signal?.throwIfAborted();return raw;
}
export async function readSkeletonCatalogue(manifest,{readBytes,signal}={}){
 validateSkeletonManifest(manifest);signal?.throwIfAborted();const raw=await verifiedPayload(manifest.catalogue,readBytes,signal),c=JSON.parse(new TextDecoder().decode(raw));
 check(c.schema==='poly.skeleton-source-catalogue.v1'&&c.namespace==='skeleton206'&&c.data?.meshes?.length===208&&c.registry?.bones?.length===206,'Wrong skeleton catalogue');
 const names=new Set();for(const m of c.data.meshes){check(typeof m.source_object==='string'&&!names.has(m.source_object)&&typeof m.bone_id==='string'&&!Object.hasOwn(m,'positions')&&!Object.hasOwn(m,'indices'),'Invalid metadata-only skeleton object');names.add(m.source_object);}
 proof.set(c,{manifest:JSON.stringify(manifest),catalogue:JSON.stringify(c)});return c;
}
export async function readSkeletonChunk(manifest,id,{catalogue,readBytes,signal,maxRawBytes=4194304}={}){
 validateSkeletonManifest(manifest);signal?.throwIfAborted();const p=proof.get(catalogue),c=manifest.chunks.find(c=>c.id===id);
 check(p&&p.manifest===JSON.stringify(manifest)&&p.catalogue===JSON.stringify(catalogue),'Verified unchanged skeleton catalogue required');check(c&&integer(maxRawBytes)&&maxRawBytes>0&&c.raw_bytes<=maxRawBytes,'Skeleton block exceeds caller budget or is unknown');
 const metaBytes=await readBytes(c.metadata,{signal,maxBytes:1048576});signal?.throwIfAborted();check(metaBytes.byteLength<=1048576&&await sha256Bytes(metaBytes)===c.metadata_sha256,'Skeleton metadata altered');signal?.throwIfAborted();const metadata=JSON.parse(new TextDecoder().decode(metaBytes));check(metadata.schema==='poly.skeleton-source-chunk.v1'&&metadata.namespace==='skeleton206'&&metadata.source_raw_sha256===SOURCE&&metadata.id===id&&metadata.entries?.length===c.keys.length,'Wrong skeleton block metadata');
 let bytes=await verifiedPayload(c,readBytes,signal);check(new Uint8Array(new Uint32Array([1]).buffer)[0]===1,'Little-endian skeleton runtime required');if(bytes.byteOffset%8)bytes=new Uint8Array(bytes);let end=0;
 const entries=metadata.entries.map((e,i)=>{const source=catalogue.data.meshes[e.source_index];check(e.key===c.keys[i]&&integer(e.source_index)&&e.key==='skeleton206/'+e.source_index&&e.json_pointer==='/meshes/'+e.source_index&&source?.source_object===e.source_object&&source.bone_id===e.bone_id,'Skeleton source identity changed');
  for(const [field,size]of [['position',8],['index',4]]){const offset=e[field+'_offset'],count=e[field+'_values'];check(integer(offset)&&offset%size===0&&integer(count)&&count>0&&count%3===0&&offset>=end&&offset+count*size<=bytes.byteLength,'Invalid or overlapping skeleton numeric range');end=offset+count*size;}
  const positions=new Float64Array(bytes.buffer,bytes.byteOffset+e.position_offset,e.position_values),indices=new Uint32Array(bytes.buffer,bytes.byteOffset+e.index_offset,e.index_values);check(positions.every(Number.isFinite)&&indices.every(n=>n<positions.length/3),'Invalid skeleton geometry');return Object.freeze({key:e.key,namespace:'skeleton206',source_index:e.source_index,json_pointer:e.json_pointer,metadata:source,positions,indices});});
 check(end===bytes.byteLength,'Unaddressed skeleton geometry tail');return Object.freeze({id,namespace:'skeleton206',rawBytes:bytes.byteLength,bytes,entries});
}
export function browserSkeletonBytes(baseUrl,fetcher=fetch){const base=new URL(baseUrl);check(base.pathname.endsWith('/'),'Skeleton base directory required');return (path,{signal,maxBytes=1048576}={})=>{check(/^(MANIFEST\.json|CATALOGUE\.json\.gz|chunks\/skeleton-\d{3}\.(json|bin\.gz))$/.test(path),'Invalid skeleton resource path');return fetchBoundedBytes(new URL(path,base),{signal,maxBytes,fetcher});};}
