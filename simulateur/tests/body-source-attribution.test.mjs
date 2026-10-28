import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const meta=JSON.parse(fs.readFileSync(new URL('../data/body-source-attribution.json',import.meta.url),'utf8'));
const scope=fs.readFileSync(new URL('../reports/PORTÉE.md',import.meta.url),'utf8');

test('the precise HRA source version and official CC BY 4.0 attribution remain attached',()=>{
 assert.equal(meta.schema,'poly.body-source-attribution.v1');
 assert.equal(meta.original_3d_reference.release,'v1.10');
 assert.match(meta.original_3d_reference.source_glb,/ref-organ\/united-male\/v1\.10\/assets\/3d-vh-m-united\.glb$/);
 assert.equal(meta.original_3d_reference.license,'CC BY 4.0');
 assert.equal(meta.original_3d_reference.license_url,'https://creativecommons.org/licenses/by/4.0/');
 assert.ok(meta.original_3d_reference.suggested_credit.includes('Human Reference Atlas'));
 assert.ok(meta.original_3d_reference.suggested_credit.includes('National Library of Medicine'));
 assert.match(scope,/united male v1\.10/i);
 assert.match(scope,/CC BY 4\.0/);
});

test('source-bit identity in attribution metadata matches the pinned geometry reader',()=>{
 assert.equal(meta.poly_derivative.original_geometry_sha256_uncompressed,
 '41fb852fb1c3d00dd8be90150226f92e5adf1d1fc783cb1223945f3a4ba229c4');
 assert.equal(meta.poly_derivative.original_metadata_sha256_uncompressed,
 'cf140a39c11163508e91e12b0df9820e6e36ea2f2b50392f62cd9f404fea1573');
 assert.ok(meta.poly_derivative.existing_poly_processing.length>0);
 assert.ok(meta.poly_derivative.new_chunk_processing.length>0);
 assert.ok(meta.poly_derivative.scientific_non_claims.length>0);
});

test('permission to adapt is not mistaken for owner approval to publish derived chunks',()=>{
 assert.equal(meta.original_3d_reference.individual_creator_citation_for_exact_release_verified,false);
 assert.equal(meta.distribution_policy.public_distribution_approved,false);
 assert.equal(meta.distribution_policy.chunk_files_committed_to_repository,false);
 assert.equal(meta.distribution_policy.chunk_files_published_on_pages,false);
 assert.equal(meta.distribution_policy.software_tests_in_temporary_runner,true);
 assert.ok(meta.distribution_policy.required_before_distribution.some(s=>/creator names/i.test(s)));
 assert.ok(meta.distribution_policy.required_before_distribution.some(s=>/change notice/i.test(s)));
});
