#!/usr/bin/env python3
"""Unpublished exact numeric blocks for the separate 206-bone / 208-object source."""
import argparse,array,gzip,hashlib,json,math,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'data'
PINS={'skeleton-source-206':('0594c0bb7aeeeb7684409de4e8afdcb941598c723ad6fce3942b4804d60c94b4','23b699c0b1ff01cdc4f882c481c74e3933cff846694c9b5aded802ba097a3140'),'skeleton-worksite-206':('e0e3794d69dc0b60592e811c681f0a7259bff419389de8a3a1c0056a40767dff','c55893ac02f650132e66e1bba1a4e392887c9f41f0b7d817d2e76f6e138dcd5a')}
def sha(b):return hashlib.sha256(b).hexdigest()
def encode(x):return (json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)+'\n').encode()
def numeric(values,code):
 a=array.array(code,values)
 if a.itemsize!=(8 if code=='d' else 4):raise ValueError('Unsupported numeric platform')
 if sys.byteorder!='little':a.byteswap()
 return a.tobytes()
def load(name):
 packed=(ROOT/(name+'.json.gz')).read_bytes();raw=gzip.decompress(packed)
 if (sha(packed),sha(raw))!=PINS[name]:raise ValueError('Pinned source altered: '+name)
 return json.loads(raw)
def strip(data):return {**{k:v for k,v in data.items() if k!='meshes'},'meshes':[{k:v for k,v in m.items() if k not in ('positions','indices')} for m in data['meshes']]}
def build(output,max_bytes=4194304,verify=False):
 if type(max_bytes)!=int or not 608448<=max_bytes<=4194304:raise ValueError('Invalid skeleton block budget')
 data,registry=load('skeleton-source-206'),load('skeleton-worksite-206');meshes=data['meshes']
 if len(meshes)!=208 or len(registry['bones'])!=206 or len({m['source_object'] for m in meshes})!=208:raise ValueError('Source inventory changed')
 # Validate everything before creating any output; never transform source coordinates.
 for m in meshes:
  p,ids=m['positions'],m['indices']
  if not p or len(p)%3 or len(ids)%3 or any(type(v) not in (int,float) or not math.isfinite(v) for v in p) or any(type(v)!=int or not 0<=v<len(p)//3 for v in ids):raise ValueError('Invalid geometry')
  if len(p)*8+len(ids)*4>max_bytes:raise ValueError('Single object exceeds block budget')
 output=Path(output)
 if output.exists() and any(output.iterdir()):raise FileExistsError('Output must be empty; no overwrite')
 (output/'chunks').mkdir(parents=True,exist_ok=True);chunks=[];payload=bytearray();entries=[]
 def flush():
  if not entries:return
  identity=f'skeleton-{len(chunks):03d}';meta=encode({'schema':'poly.skeleton-source-chunk.v1','namespace':'skeleton206','id':identity,'source_raw_sha256':PINS['skeleton-source-206'][1],'entries':entries});packed=gzip.compress(payload,mtime=0)
  geometry='chunks/'+identity+'.bin.gz';metadata='chunks/'+identity+'.json';(output/geometry).write_bytes(packed);(output/metadata).write_bytes(meta)
  chunks.append({'id':identity,'geometry':geometry,'metadata':metadata,'raw_bytes':len(payload),'compressed_bytes':len(packed),'raw_sha256':sha(payload),'compressed_sha256':sha(packed),'metadata_sha256':sha(meta),'keys':[e['key'] for e in entries]})
 for index,m in enumerate(meshes):
  size=len(m['positions'])*8+len(m['indices'])*4
  if entries and len(payload)+(-len(payload)%8)+size>max_bytes:flush();payload=bytearray();entries=[]
  payload.extend(b'\0'*(-len(payload)%8));offset=len(payload);payload.extend(numeric(m['positions'],'d'));indices_offset=len(payload);payload.extend(numeric(m['indices'],'I'))
  entries.append({'key':f'skeleton206/{index}','source_index':index,'source_object':m['source_object'],'bone_id':m['bone_id'],'json_pointer':f'/meshes/{index}','position_offset':offset,'position_values':len(m['positions']),'index_offset':indices_offset,'index_values':len(m['indices'])})
 flush();catalogue=encode({'schema':'poly.skeleton-source-catalogue.v1','namespace':'skeleton206','data':strip(data),'registry':registry});packed=gzip.compress(catalogue,mtime=0);(output/'CATALOGUE.json.gz').write_bytes(packed)
 manifest={'schema':'poly.skeleton-source-manifest.v1','namespace':'skeleton206','published':False,'status':'experimental_not_deployed','coordinate_policy':'exact_json_float64_le_uint32_le_no_transform','source_pins':PINS,'source_objects':208,'bone_concepts':206,'chunk_budget_bytes':max_bytes,'catalogue':{'path':'CATALOGUE.json.gz','raw_bytes':len(catalogue),'compressed_bytes':len(packed),'raw_sha256':sha(catalogue),'compressed_sha256':sha(packed)},'chunks':chunks}
 if verify:
  seen=set()
  for c in chunks:
   raw=gzip.decompress((output/c['geometry']).read_bytes());meta=json.loads((output/c['metadata']).read_bytes())
   assert len(raw)<=max_bytes and sha(raw)==c['raw_sha256']
   for e in meta['entries']:
    assert e['source_index'] not in seen;seen.add(e['source_index']);m=meshes[e['source_index']]
    for field,values,code in [('position',m['positions'],'d'),('index',m['indices'],'I')]:
     expected=numeric(values,code);offset=e[field+'_offset'];assert raw[offset:offset+len(expected)]==expected
  assert seen==set(range(208)) and json.loads(gzip.decompress((output/'CATALOGUE.json.gz').read_bytes()))['data']==strip(data)
  manifest['source_value_verification']='PASS'
 (output/'MANIFEST.json').write_bytes(encode(manifest));return manifest
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--output-root',type=Path,required=True);p.add_argument('--max-chunk-bytes',type=int,default=4194304);p.add_argument('--verify',action='store_true');a=p.parse_args();r=build(a.output_root,a.max_chunk_bytes,a.verify);print(json.dumps({'blocks':len(r['chunks']),'raw_bytes':sum(c['raw_bytes'] for c in r['chunks']),'catalogue_raw_bytes':r['catalogue']['raw_bytes'],'verified':r.get('source_value_verification')}))
