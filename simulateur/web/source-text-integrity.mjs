import {sha256Bytes} from './body-chunk-reader.mjs';
// Git text checkouts may use LF or CRLF. Only line endings are normalized;
// JSON values, coordinates and scientific fields are never reserialized.
export async function verifySourceText(bytes,expectedSha256,{hash=sha256Bytes}={}){
  const text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes).replace(/\r\n/g,'\n');
  if(await hash(new TextEncoder().encode(text))!==expectedSha256)throw Error('Source text altered');
  return text;
}
