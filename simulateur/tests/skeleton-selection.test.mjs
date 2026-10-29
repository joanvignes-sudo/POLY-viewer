import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {gunzipSync} from 'node:zlib';import {selectSkeletonObjects} from '../web/skeleton-selection.mjs';
const source=JSON.parse(gunzipSync(fs.readFileSync(new URL('../data/skeleton-source-206.json.gz',import.meta.url)))),catalogue={data:source};
test('skeleton region and concept filters retain 208 object identities and 206 concepts',()=>{
 const all=selectSkeletonObjects(catalogue);assert.equal(all.length,208);assert.equal(new Set(all.map(e=>e.metadata.bone_id)).size,206);const before=JSON.stringify(source);
 for(const region of new Set(source.meshes.map(m=>m.region))){const filtered=selectSkeletonObjects(catalogue,{region});assert.equal(filtered.length,source.meshes.filter(m=>m.region===region).length);for(const row of filtered){assert.equal(row.key,'skeleton206/'+row.source_index);assert.equal(row.metadata,source.meshes[row.source_index]);const concept=selectSkeletonObjects(catalogue,{region,concept:row.metadata.bone_id});assert.ok(concept.every(e=>e.metadata.region===region&&e.metadata.bone_id===row.metadata.bone_id));}}
 assert.deepEqual(selectSkeletonObjects(catalogue,{region:'unknown'}),[]);assert.deepEqual(selectSkeletonObjects(catalogue,{concept:'unknown'}),[]);assert.equal(JSON.stringify(source),before);
});
