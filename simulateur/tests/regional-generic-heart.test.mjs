import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {gunzipSync} from 'node:zlib';
import {verifySourceText} from '../web/source-text-integrity.mjs';
import {REGIONAL_HEART_CONTRACT_SHA256,regionalHeartSourceIds} from '../web/regional-generic-heart.mjs';
const meta=JSON.parse(gunzipSync(fs.readFileSync(new URL('../models/body-display.json.gz',import.meta.url)))),contract=JSON.parse(fs.readFileSync(new URL('../web/protocol-heart-reference.json',import.meta.url)));
test('generic cardiac reference resolves all exact fourteen node/name/source path identities',()=>{
 const all=meta.structures.map((_,i)=>i),ids=regionalHeartSourceIds(contract,meta,all);assert.equal(ids.length,14);assert.equal(new Set(ids).size,14);for(const id of ids)assert.ok(meta.structures[id].path.includes('VH_M_heart'));
 assert.throws(()=>regionalHeartSourceIds(contract,meta,ids.slice(1)),/14 surfaces/);
 for(const mutate of [r=>r.participant_registration=true,r=>r.sensor_localization=true,r=>r.physiological_time_s=1,r=>r.reference.parts[0].name='invented']){const changed=structuredClone(contract);mutate(changed);assert.throws(()=>regionalHeartSourceIds(changed,meta,all));}
});

test('cardiac contract pin accepts Git line endings and refuses altered scientific fields',async()=>{
 const text=fs.readFileSync(new URL('../web/protocol-heart-reference.json',import.meta.url),'utf8').replace(/\r\n/g,'\n');
 for(const value of [text,text.replace(/\n/g,'\r\n')])assert.equal(await verifySourceText(new TextEncoder().encode(value),REGIONAL_HEART_CONTRACT_SHA256),text);
 await assert.rejects(verifySourceText(new TextEncoder().encode(text.replace('"sensor_localization": false','"sensor_localization": true')),REGIONAL_HEART_CONTRACT_SHA256));
});
