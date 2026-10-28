// Common source identity for the historical body and verified regional meshes.
// Offsets here always address the ORIGINAL binary, never the regional buffer.
export function sourceMeshData(record, {sourceIndex=record.source_index, system, chunkId=null}={}) {
  if(!Number.isInteger(sourceIndex)||sourceIndex<0)throw Error('Invalid source index');
  const offsets=record.source_offsets??record;
  return {
    source_index:sourceIndex, name:record.name, node:record.node??null,
    path:[...record.path], bounds:record.bounds.map(row=>[...row]), system,
    position_offset:offsets.position_offset, normal_offset:offsets.normal_offset,
    index_offset:offsets.index_offset,
    source_offsets:{position_offset:offsets.position_offset,
      normal_offset:offsets.normal_offset,index_offset:offsets.index_offset},
    vertex_count:record.vertex_count, triangle_count:record.triangle_count,
    chunk_id:chunkId,
  };
}

const normalize=value=>String(value).trim().toLocaleLowerCase('fr').normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replaceAll('œ','oe');
const aliases={coeur:'heart',rein:'kidney',reins:'kidney',poumon:'lung',poumons:'lung',
  cerveau:'brain',foie:'liver',estomac:'stomach','rein gauche':'left_kidney',
  'rein droit':'right_kidney','poumon gauche':'lungs_l','poumon droit':'lungs_r',
  yeux:'eye',moelle:'spinal_cord',rate:'spleen',vessie:'urinary_bladder',
  pancreas:'pancreas',colon:'colon',vesicule:'gallbladder','vesicule biliaire':'gallbladder',
  'intestin grele':'small_intestine',cervelet:'cerebellum','tronc cerebral':'brainstem',
  trachee:'trachea',oesophage:'esophagus',nerfs:'nerve',nerf:'nerve'};

// Resolve from current residents on every call. Consumers must store source IDs,
// not retain a mesh reference across a release/reload of a regional block.
export function createSourceAccess(getMeshes) {
  return Object.freeze({
    resolve:sourceIndex=>getMeshes().find(m=>m.userData.source_index===sourceIndex)??null,
    search(query,limit=35){
      const raw=normalize(query),q=aliases[raw]??raw;
      if(!q)return [];
      return getMeshes().filter(m=>normalize(m.userData.path.join(' ')).includes(q))
        .sort((a,b)=>a.userData.name.length-b.userData.name.length||
          a.userData.source_index-b.userData.source_index).slice(0,limit);
    },
  });
}

// A structure request maps to whole verified blocks; no fictitious per-organ byte savings.
export function planSourceBlocks(manifest,sourceIndices,maxRawBytes){
  const wanted=new Set(sourceIndices);
  if(!wanted.size||[...wanted].some(i=>!Number.isInteger(i)||i<0||i>=manifest.source_count))
    throw Error('Invalid source selection');
  const chunks=manifest.chunks.filter(c=>c.original_indices.some(i=>wanted.has(i)));
  if([...wanted].some(i=>!chunks.some(c=>c.original_indices.includes(i))))throw Error('Source not covered');
  const rawBytes=chunks.reduce((n,c)=>n+c.raw_bytes,0);
  return {ids:chunks.map(c=>c.id),rawBytes,
    compressedBytes:chunks.reduce((n,c)=>n+c.compressed_bytes,0),fitsBudget:rawBytes<=maxRawBytes};
}
