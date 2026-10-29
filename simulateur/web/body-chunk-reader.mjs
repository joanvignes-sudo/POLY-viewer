// Byte-verified, bounded local chunk reader for future opt-in regional WebGL.
// This module is not wired into POLY's deployed body viewer. No physiology is inferred.
const SOURCE_META='cf140a39c11163508e91e12b0df9820e6e36ea2f2b50392f62cd9f404fea1573';
const SOURCE_BIN='41fb852fb1c3d00dd8be90150226f92e5adf1d1fc783cb1223945f3a4ba229c4';
const HEX=/^[a-f0-9]{64}$/;
const check=(condition,message)=>{if(!condition)throw Error(message)};
const goodInt=x=>Number.isSafeInteger(x)&&x>=0;
const validName=id=>typeof id==='string'&&/^[a-z][a-z0-9_-]{1,64}$/.test(id);
export function validateChunkManifest(m){
 check(m?.schema==='poly.body-source-chunks.v1'&&m.status==='experimental_not_deployed'&&m.published===false,'Manifest absent ou marqué publié');
 check(m.source?.metadata_sha256===SOURCE_META&&m.source?.geometry_sha256===SOURCE_BIN,'Empreintes de provenance hors canon');
 check(m.source_count===918&&Number.isInteger(m.chunk_count)&&m.chunk_count>0&&m.chunk_count<1000&&Array.isArray(m.chunks)&&m.chunks.length===m.chunk_count,'Couverture du manifeste incomplète');
 check(m.no_anatomical_simplification===true&&m.no_individual_registration===true&&m.original_source_geometry_unchanged===true,'Provenance ou portée incompatible');
 check(goodInt(m.chunk_budget_bytes)&&m.chunk_budget_bytes>=1024,'Budget invalide');
 const seenIDs=new Set(),seenIndices=new Set();
 let total=0,compressed=0;
 for(const c of m.chunks){
  check(validName(c.id)&&!seenIDs.has(c.id),'ID de chunk invalide ou dupliqué');
  seenIDs.add(c.id);
  check(c.geometry==='chunks/'+c.id+'.bin.gz'&&c.metadata==='chunks/'+c.id+'.json','Chemin de chunk hors portée');
  check([c.geometry_sha256,c.compressed_sha256,c.metadata_sha256].every(x=>typeof x==='string'&&HEX.test(x)),'Empreinte du chunk absente');
  check(Number.isInteger(c.part_count)&&c.part_count>0&&Array.isArray(c.original_indices)&&c.original_indices.length===c.part_count,'Comptage de pièces invalide');
  check(goodInt(c.raw_bytes)&&c.raw_bytes>0&&c.raw_bytes<=16*1024*1024,'Bloc décompressé trop volumineux');
  check(goodInt(c.compressed_bytes)&&c.compressed_bytes>0&&c.compressed_bytes<=16*1024*1024,'Bloc compressé trop volumineux');
  check(typeof c.above_budget_single_mesh==='boolean','Statut de dépassement absent');
  if(c.raw_bytes>m.chunk_budget_bytes)check(c.above_budget_single_mesh===true&&c.part_count===1,'Budget de bloc dépassé sans preuve');
  for(const index of c.original_indices){
   check(Number.isInteger(index)&&index>=0&&index<918&&!seenIndices.has(index),'Structure omise, répétée ou hors source');
   seenIndices.add(index);
  }
  total+=c.raw_bytes;compressed+=c.compressed_bytes;
 }
 check(seenIndices.size===918,'Catalogue incomplet');
 check(m.total_raw_chunk_bytes===total&&m.total_compressed_chunk_bytes===compressed,'Sommes des octets du manifeste incorrectes');
 return m;
}
export async function sha256Bytes(buffer){
 const x=buffer instanceof Uint8Array?buffer:new Uint8Array(buffer);
 check(typeof crypto!=='undefined'&&crypto.subtle,'SHA256 WebCrypto indisponible');
 const digest=await crypto.subtle.digest('SHA-256',x);
 return Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('');
}
export async function readGzipBounded(packed,maxBytes){
 check(typeof DecompressionStream!=='undefined','Gzip décompression indisponible');
 const stream=new Response(packed).body.pipeThrough(new DecompressionStream('gzip'));
 const reader=stream.getReader(),parts=[];let size=0;
 try{
  while(true){
   const {done,value}=await reader.read();
   if(done)break;
   size+=value.byteLength;
   if(size>maxBytes)throw Error('Chunk décompressé excède sa taille autorisée');
   parts.push(value);
  }
 }catch(e){await reader.cancel().catch(()=>{});throw e}
 const out=new Uint8Array(size);let offset=0;
 for(const part of parts){out.set(part,offset);offset+=part.byteLength;}
 return out;
}
export async function readValidatedChunk(manifest,id,{readBytes,unzip=readGzipBounded,hash=sha256Bytes,signal}={}){
 validateChunkManifest(manifest);
 const c=manifest.chunks.find(x=>x.id===id);
 check(c,'Bloc anatomique absent du manifeste');
 check(typeof readBytes==='function','Lecture de fichiers non fournie');
 const abort=()=>{if(signal?.aborted)throw signal.reason??Error('Chargement anatomique annulé')};
 abort();
 const [metaBytes,compressed]=await Promise.all([readBytes(c.metadata,{signal}),readBytes(c.geometry,{signal})]);
 abort();
 check(metaBytes instanceof Uint8Array&&metaBytes.byteLength<=5*1024*1024,'Métadonnées de bloc trop volumineuses');
 check(compressed instanceof Uint8Array&&compressed.byteLength===c.compressed_bytes,'Fichier gzip de taille incohérente');
 check(await hash(metaBytes)===c.metadata_sha256,'Métadonnées de bloc altérées');
 abort();
 check(await hash(compressed)===c.compressed_sha256,'Fichier gzip de bloc altéré');
 abort();
 const meta=JSON.parse(new TextDecoder().decode(metaBytes));
 check(meta.schema==='poly.body-source-chunk-metadata.v1'&&meta.id===id&&meta.source_metadata_sha256===SOURCE_META&&meta.source_geometry_sha256===SOURCE_BIN&&meta.coordinate_policy==='byte_exact_no_transform','Identité ou repère de bloc incorrect');
 check(Array.isArray(meta.geometries)&&meta.geometries.length===c.part_count,'Pièces du bloc absentes');
 abort();
 const data=await unzip(compressed,c.raw_bytes);
 abort();
 check(data instanceof Uint8Array&&data.byteLength===c.raw_bytes&&await hash(data)===c.geometry_sha256,'Octets géométriques de bloc altérés');
 abort();
 for(let i=0;i<meta.geometries.length;i++){
  const g=meta.geometries[i];
  check(g.source_index===c.original_indices[i],'Identifiant source différent');
  check(typeof g.name==='string'&&Array.isArray(g.path)&&g.path.length>0&&Array.isArray(g.bounds)&&g.bounds.length===2&&g.source_offsets,'Métadonnées géométriques incomplètes');
  check(goodInt(g.vertex_count)&&goodInt(g.triangle_count),'Nombre de sommets/triangles invalide');
  for(const [field,count] of [['position_offset',g.vertex_count],['normal_offset',g.vertex_count],['index_offset',g.triangle_count]]){
   check(goodInt(g[field])&&g[field]%4===0&&g[field]+count*12<=data.byteLength,'Décalage géométrique hors bloc');
   check(goodInt(g.source_offsets[field]),'Décalage source perdu');
  }
 }
 return Object.freeze({id,system:c.system,bytes:data,metadata:meta,rawBytes:c.raw_bytes,source_geometry_sha256:SOURCE_BIN});
}
export function createBoundedChunkStore(manifest,{readBytes,unzip=readGzipBounded,hash=sha256Bytes,maxRawBytes=8*1024*1024,onInstall=()=>null,onDispose=()=>{}}={}){
 validateChunkManifest(manifest);
 check(Number.isInteger(maxRawBytes)&&maxRawBytes>0&&maxRawBytes<=128*1024*1024,'Budget RAM de store invalide');
 const entries=new Map(),inflight=new Map(),controllers=new Map(),pins=new Set(),revisions=new Map();
 let occupied=0,commitGate=Promise.resolve(),epoch=0;
 const revision=id=>revisions.get(id)||0;
 const invalidate=id=>revisions.set(id,revision(id)+1);
 function remove(id){
  const e=entries.get(id);
  if(!e)return false;
  entries.delete(id);pins.delete(id);occupied-=e.chunk.rawBytes;
  onDispose(e.installed,e.chunk);
  return true;
 }
 function release(id){
  // Also invalidates a pending request that has not yet reached onInstall.
  invalidate(id);
  controllers.get(id)?.abort(Error('Chargement anatomique annulé'));
  return remove(id);
 }
 function clear(){
  // Invalidate *all* pending reads even if there are no resident entries.
  epoch++;
  for(const controller of controllers.values())controller.abort(Error('Chargement anatomique annulé'));
  for(const id of [...entries.keys()])remove(id);
 }
 async function load(id,{pin=false}={}){
  const present=entries.get(id);
  if(present){entries.delete(id);entries.set(id,present);if(pin)pins.add(id);return present.chunk}
  if(inflight.has(id)){
   const chunk=await inflight.get(id);
   if(pin&&entries.has(id))pins.add(id);
   return chunk;
  }
  const requestedEpoch=epoch,requestedRevision=revision(id);
  const stillCurrent=()=>epoch===requestedEpoch&&revision(id)===requestedRevision;
  const controller=new AbortController();controllers.set(id,controller);
  const task=(async()=>{
   const chunk=await readValidatedChunk(manifest,id,{readBytes,unzip,hash,signal:controller.signal});
   check(chunk.rawBytes<=maxRawBytes,'Bloc excède la limite RAM du lecteur');
   check(stillCurrent(),'Chargement anatomique annulé avant installation');
   // Network reads may run concurrently; reserve and commit cache RAM serially.
   const preceding=commitGate;let releaseGate;
   commitGate=new Promise(resolve=>{releaseGate=resolve});
   await preceding;
   try{
    check(stillCurrent(),'Chargement anatomique annulé après changement de région');
    const removable=[...entries.keys()].filter(x=>!pins.has(x));
    const reclaimable=removable.reduce((n,x)=>n+entries.get(x).chunk.rawBytes,0);
    check(occupied-reclaimable+chunk.rawBytes<=maxRawBytes,'Budget RAM indisponible : éléments fixés en mémoire');
    while(occupied+chunk.rawBytes>maxRawBytes){check(remove(removable.shift()),'Éviction impossible')}
    const installed=await onInstall(chunk);
    // An async installer may finish after the user has cleared the scene.
    if(!stillCurrent()){
     onDispose(installed,chunk);
     throw Error('Chargement anatomique annulé pendant installation');
    }
    entries.set(id,{chunk,installed});occupied+=chunk.rawBytes;
    if(pin)pins.add(id);
    return chunk;
   }finally{releaseGate()}
  })();
  inflight.set(id,task);
  try{return await task}catch(error){controller.abort(error);throw error}finally{if(inflight.get(id)===task)inflight.delete(id);if(controllers.get(id)===controller)controllers.delete(id)}
 }
 return {
  load,release,unpin:id=>pins.delete(id),clear,
  info:()=>({ids:[...entries.keys()],residentRawBytes:occupied,capacityRawBytes:maxRawBytes,pinned:[...pins],pending:[...inflight.keys()]}),
 };
}
export function browserChunkReader(baseUrl,fetcher=fetch){
 const url=new URL(baseUrl,location.href);
 return async (path,{signal}={})=>{
  check(/^chunks\/[a-z][a-z0-9_-]{1,64}\.(?:json|bin\.gz)$/.test(path),'Chemin de ressource non autorisé');
  const u=new URL(path,url);
  check(u.origin===url.origin,'Ressource externe non autorisée');
  const r=await fetcher(u.toString(),{cache:'no-store',signal});
  check(r.ok,'Chargement du bloc échoué');
  return new Uint8Array(await r.arrayBuffer());
 };
}
