import test from 'node:test';
import assert from 'node:assert/strict';
import {REFERENCE_BOOKMARK_KEY,validateReferenceBookmark} from '../web/reference-view-bookmark.mjs';
const valid={schema:REFERENCE_BOOKMARK_KEY,source_raw_sha256:'trusted',key:'parts/0',view:{zoom_ratio:3.2,azimuth:.3,elevation:.15}};
const check=value=>validateReferenceBookmark(value,'trusted',['parts/0']);
test('bookmark copies only source identity and bounded camera scalars',()=>{const input={...valid,mesh:{},view:{...valid.view,other:1}};assert.deepEqual(check(input),valid);assert.notEqual(check(input).view,input.view);});
test('bookmark refuses changed source or missing entity',()=>{assert.equal(check({...valid,source_raw_sha256:'old'}),null);assert.equal(check({...valid,key:'parts/1'}),null);assert.equal(check({...valid,schema:'old'}),null);assert.equal(check(null),null);});
test('bookmark refuses malformed or unbounded camera inputs',()=>{for(const view of [null,{}, {...valid.view,zoom_ratio:0},{...valid.view,zoom_ratio:41},{...valid.view,elevation:2},{...valid.view,azimuth:Infinity},{...valid.view,zoom_ratio:'3'}])assert.equal(check({...valid,view}),null);});
