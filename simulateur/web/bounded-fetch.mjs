export async function fetchBoundedBytes(url,{maxBytes,signal,fetcher=fetch}={}){
  if(!Number.isSafeInteger(maxBytes)||maxBytes<=0||maxBytes>128*1024*1024)throw Error('Invalid transfer budget');
  signal?.throwIfAborted();
  const response=await fetcher(url,{signal,cache:'no-store'});
  if(!response.ok)throw Error('Asset unavailable (HTTP '+response.status+')');
  const declared=Number(response.headers.get('Content-Length'));
  if(Number.isFinite(declared)&&declared>maxBytes){await response.body?.cancel();throw Error('Declared asset exceeds transfer budget');}
  if(!response.body)return new Uint8Array();
  const reader=response.body.getReader(),parts=[];let size=0;
  const cancel=()=>{reader.cancel(signal.reason).catch(()=>{});};
  signal?.addEventListener('abort',cancel,{once:true});
  try{
    signal?.throwIfAborted();
    while(true){
      const {done,value}=await reader.read();signal?.throwIfAborted();if(done)break;
      size+=value.byteLength;if(size>maxBytes)throw Error('Asset exceeds transfer budget');parts.push(value);
    }
    const bytes=new Uint8Array(size);let offset=0;
    for(const part of parts){bytes.set(part,offset);offset+=part.byteLength;}
    return bytes;
  }catch(error){await reader.cancel().catch(()=>{});throw error;}
  finally{signal?.removeEventListener('abort',cancel);reader.releaseLock();}
}
