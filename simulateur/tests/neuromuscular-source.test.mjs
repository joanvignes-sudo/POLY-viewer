import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {readNeuromuscularGuide} from '../web/neuromuscular-source.mjs';
const text=fs.readFileSync(new URL('../data/neuromuscular-guide.json',import.meta.url),'utf8').replace(/\r\n/g,'\n');
test('neuromuscular source preserves actual culture protocol and unknown biological quantities with LF/CRLF',async()=>{
 for(const body of [text,text.replace(/\n/g,'\r\n')]){const data=await readNeuromuscularGuide({fetcher:async()=>new Response(body)});assert.equal(data.schema,'poly.neuromuscular.guide/1');assert.equal(data.biological_timing,null);assert.equal(data.actual_hand_junction_location,null);assert.equal(data.contraction_force,null);assert.ok(data.steps.every(s=>s.delay_ms===null));assert.equal(data.source.doi,'10.7554/eLife.44530');assert.deepEqual(data.modes.map(m=>m.last_step),[3,1,2]);}
 await assert.rejects(readNeuromuscularGuide({fetcher:async()=>new Response(text.replace('"contraction_force": null','"contraction_force": 10'))}),/Source text altered/);
 const controller=new AbortController();controller.abort();await assert.rejects(readNeuromuscularGuide({signal:controller.signal,fetcher:async()=>{throw Error('must not read')}}));
});
