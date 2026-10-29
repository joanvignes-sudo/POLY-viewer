import {fetchBoundedBytes} from './bounded-fetch.mjs';
import {verifySourceText} from './source-text-integrity.mjs';
export const NEUROMUSCULAR_GUIDE_SHA256='b19350a0330e9518ad085c1857c1a1b5865a13f0394deecffb8f6b03fea05850';
export async function readNeuromuscularGuide({signal,fetcher=fetch}={}){
 const bytes=await fetchBoundedBytes(new URL('../data/neuromuscular-guide.json',import.meta.url),{signal,fetcher,maxBytes:16384});
 const data=JSON.parse(await verifySourceText(bytes,NEUROMUSCULAR_GUIDE_SHA256));signal?.throwIfAborted();return data;
}
