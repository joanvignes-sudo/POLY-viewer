import {sha256Bytes,readGzipBounded} from './body-chunk-reader.mjs';
import {fetchBoundedBytes} from './bounded-fetch.mjs';
const RAW_SOURCE='64ec70f74fb6af18333d6f53b46ac736d59331221c54213737a35b26a1c0f81a';
const PACKED_SOURCE='d619f1fcb6f85ec38b11cfe92d86a3460eb0454b35791c11128353b4c619bde4';
const POLICY='exact_json_float64_le_uint32_le_no_transform';
const check=(ok,message)=>{if(!ok)throw Error(message)};
const integer=n=>Number.isSafeInteger(n)&&n>=0,hex=s=>typeof s==='string'&&/^[0-9a-f]{64}$/.test(s);
export function validateReferenceManifest(m){
 check(m?.schema==='poly.reference-source-manifest.v1'&&m.status==='experimental_not_deployed'&&m.published===false,'Unpublished reference manifest required');
 check(m.source_value_verification==='PASS'&&m.source_raw_bytes===92965454&&integer(m.chunk_budget_bytes)&&m.chunk_budget_bytes>=1024&&m.chunk_budget_bytes<=16*1024*1024,'Verified reference build required');
 check(m.source_raw_sha256===RAW_SOURCE&&m.source_gzip_sha256===PACKED_SOURCE&&m.coordinate_policy===POLICY,'Reference provenance changed');
 check(m.source_counts?.parts===458&&m.source_counts?.bones===68&&Array.isArray(m.chunks)&&m.chunks.length>0&&m.chunks.length<1000,'Reference inventory incomplete');
 const ids=new Set(),keys=new Set();let total=0;
 for(const c of m.chunks){
  check(/^reference-\d{3}$/.test(c.id)&&!ids.has(c.id),'Invalid reference block identity');ids.add(c.id);
  check(c.metadata==='chunks/'+c.id+'.json'&&c.geometry==='chunks/'+c.id+'.bin.gz','Invalid reference path');
  check(integer(c.raw_bytes)&&c.raw_bytes>0&&c.raw_bytes<=16*1024*1024&&integer(c.compressed_bytes)&&c.compressed_bytes>0&&c.compressed_bytes<=16*1024*1024,'Invalid block size');
  check([c.raw_sha256,c.metadata_sha256,c.compressed_sha256].every(hex)&&Array.isArray(c.keys)&&c.keys.length>0,'Missing reference block proof');
  for(const key of c.keys){const match=/^(parts|bones)\/(\d+)$/.exec(key);check(match&&!keys.has(key)&&String(Number(match[2]))===match[2]&&Number(match[2])<m.source_counts[match[1]],'Repeated or unknown reference key');keys.add(key);}
  check(c.raw_bytes<=m.chunk_budget_bytes||(c.oversized_single===true&&c.keys.length===1),'Unexplained oversized block');total+=c.raw_bytes;
 }
 check(keys.size===526&&total===m.total_raw_bytes,'Reference block coverage incomplete');
 check(m.catalogue?.path==='CATALOGUE.json.gz'&&integer(m.catalogue.raw_bytes)&&m.catalogue.raw_bytes>0&&m.catalogue.raw_bytes<=2*1024*1024&&integer(m.catalogue.compressed_bytes)&&m.catalogue.compressed_bytes>0&&m.catalogue.compressed_bytes<=2*1024*1024&&hex(m.catalogue.raw_sha256)&&hex(m.catalogue.compressed_sha256),'Invalid reference catalogue proof');
 return m;
}
export async function readReferenceCatalogue(manifest,{readBytes,hash=sha256Bytes,unzip=readGzipBounded,signal,onStage=()=>{}}={}){
 validateReferenceManifest(manifest);signal?.throwIfAborted();const c=manifest.catalogue;
 onStage('catalogue_fetch');
 const packed=await readBytes(c.path,{signal,maxBytes:c.compressed_bytes});signal?.throwIfAborted();
 onStage('catalogue_compressed_hash');
 check(packed.byteLength===c.compressed_bytes&&await hash(packed)===c.compressed_sha256,'Reference catalogue compressed data altered');
 signal?.throwIfAborted();onStage('catalogue_decompress');
 const raw=await unzip(packed,c.raw_bytes);signal?.throwIfAborted();
 onStage('catalogue_raw_hash');
 check(raw.byteLength===c.raw_bytes&&await hash(raw)===c.raw_sha256,'Reference catalogue altered');
 signal?.throwIfAborted();onStage('catalogue_parse');
 const catalogue=JSON.parse(new TextDecoder().decode(raw));
 check(catalogue.schema==='poly.reference-source-catalogue.v1'&&catalogue.source_raw_sha256===RAW_SOURCE&&catalogue.data?.schema==='poly.forearm.motor.reference/1','Wrong reference catalogue');
 for(const name of ['parts','bones']){
  check(catalogue.data[name]?.length===manifest.source_counts[name],'Reference catalogue entries missing');
  const ids=new Set();for(const r of catalogue.data[name]){check(typeof r.id==='string'&&!ids.has(r.id)&&!Object.hasOwn(r,'positions')&&!Object.hasOwn(r,'indices'),'Invalid metadata-only reference entry');ids.add(r.id);}
 }
 signal?.throwIfAborted();onStage('catalogue_validated');return catalogue;
}
export async function readReferenceChunk(manifest,id,{catalogue,readBytes,maxRawBytes=4*1024*1024,hash=sha256Bytes,unzip=readGzipBounded,signal}={}){
 validateReferenceManifest(manifest);signal?.throwIfAborted();const c=manifest.chunks.find(c=>c.id===id);
 check(c&&integer(maxRawBytes)&&maxRawBytes>0&&c.raw_bytes<=maxRawBytes,'Reference block exceeds caller budget or is unknown');
 check(catalogue?.source_raw_sha256===RAW_SOURCE,'Verified reference catalogue required');
 const [metaBytes,packed]=await Promise.all([readBytes(c.metadata,{signal,maxBytes:2*1024*1024}),readBytes(c.geometry,{signal,maxBytes:c.compressed_bytes})]);signal?.throwIfAborted();
 check(metaBytes.byteLength<=2*1024*1024&&await hash(metaBytes)===c.metadata_sha256,'Reference block metadata altered');
 check(packed.byteLength===c.compressed_bytes&&await hash(packed)===c.compressed_sha256,'Reference block gzip altered');
 const metadata=JSON.parse(new TextDecoder().decode(metaBytes));
 check(metadata.schema==='poly.reference-source-chunk.v1'&&metadata.id===id&&metadata.coordinate_policy===POLICY&&metadata.source_raw_sha256===RAW_SOURCE&&metadata.entries?.length===c.keys.length,'Invalid reference block metadata');
 let bytes=await unzip(packed,c.raw_bytes);signal?.throwIfAborted();
 check(bytes.byteLength===c.raw_bytes&&await hash(bytes)===c.raw_sha256,'Reference numeric bytes altered');
 check(new Uint8Array(new Uint32Array([1]).buffer)[0]===1,'Little-endian reference runtime required');
 if(bytes.byteOffset%8)bytes=new Uint8Array(bytes);
 const entries=metadata.entries.map((r,i)=>{
  check(r.key===c.keys[i]&&['parts','bones'].includes(r.collection)&&integer(r.source_index)&&r.key===r.collection+'/'+r.source_index,'Wrong reference entity identity');
  const source=catalogue.data[r.collection][r.source_index];check(source?.id===r.source_id&&r.json_pointer==='/'+r.key,'Reference source pointer changed');
  for(const [field,size]of [['position',8],['index',4]])check(integer(r[field+'_offset'])&&r[field+'_offset']%size===0&&integer(r[field+'_values'])&&r[field+'_values']%3===0&&r[field+'_offset']+r[field+'_values']*size<=bytes.byteLength,'Reference numeric range invalid');
  check(r.position_values>0,'Reference position list empty');
  const positions=new Float64Array(bytes.buffer,bytes.byteOffset+r.position_offset,r.position_values),indices=new Uint32Array(bytes.buffer,bytes.byteOffset+r.index_offset,r.index_values);
  check(positions.every(Number.isFinite)&&indices.every(index=>index<positions.length/3),'Reference geometry invalid');
  return Object.freeze({key:r.key,source_id:r.source_id,json_pointer:r.json_pointer,metadata:source,positions,indices});
 });
 return Object.freeze({id,rawBytes:bytes.byteLength,bytes,entries});
}
export function browserReferenceBytes(baseUrl,fetcher=fetch){
 const base=new URL(baseUrl,location.href);
 return async (path,{signal,maxBytes=2*1024*1024}={})=>{
  check(/^(CATALOGUE\.json\.gz|chunks\/reference-\d{3}\.(json|bin\.gz))$/.test(path),'Invalid reference resource path');
  const url=new URL(path,base);check(url.origin===base.origin,'External reference asset refused');return fetchBoundedBytes(url,{maxBytes,signal,fetcher});
 };
}
