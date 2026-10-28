import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../',import.meta.url));
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const status=JSON.parse(read('docs/ETAT_PUBLIC_COURANT.json'));
const readme=read('README.md');
const compareVersion=(a,b)=>{
 const x=a.split('.').map(Number),y=b.split('.').map(Number);
 for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]-y[i];
 return 0;
};
const releases=fs.readdirSync(root).map(n=>/^RELEASE_v(\d+\.\d+\.\d+)\.md$/.exec(n)).filter(Boolean);
const latest=releases.map(x=>x[1]).sort(compareVersion).at(-1);

test('the current-public status and README match the latest versioned release note',()=>{
 assert.ok(latest,'No versioned release notes found');
 assert.equal(status.schema,'poly.current-public-release.v1');
 assert.equal(status.public_release,latest);
 assert.equal(status.release_notes,`RELEASE_v${latest}.md`);
 assert.match(readme,new RegExp('^# POLY — état public actuel v'+latest.replaceAll('.','\\.')+'(?:\\r?\\n)'));
 assert.equal(status.publication_branch,'main');
 assert.equal(status.public_url,'https://joanvignes-sudo.github.io/POLY-viewer/');
 assert.ok(read(status.release_notes).startsWith(`# POLY v${latest}`));
});

test('release status references existing local artefacts and the published brain landing page',()=>{
 for(const relative of [
  status.release_notes,
  status.front_end.entry_point,
  status.anatomy.source,
  'docs/ETAT_PUBLIC_COURANT.md',
  ...status.separate_historical_documents.map(x=>x.path)
 ])assert.ok(fs.existsSync(path.join(root,relative)),relative);
 assert.match(read(status.front_end.entry_point),/Cerveau & conscience/);
 assert.match(read(status.anatomy.source),/143/);
 assert.match(read(status.release_notes),/364/);
});

test('anatomical and clinical scope cannot be silently inflated',()=>{
 assert.equal(status.anatomy.inventory_pieces,507);
 assert.equal(status.anatomy.pieces_with_documented_regional_relation,143);
 assert.equal(status.anatomy.pieces_without_qualified_relation,364);
 assert.equal(status.anatomy.pieces_with_documented_regional_relation+status.anatomy.pieces_without_qualified_relation,status.anatomy.inventory_pieces);
 assert.equal(status.anatomy.validated_3d_insertions,0);
 for(const [key,value] of Object.entries(status.scientific_guards))assert.equal(value,false,key);
 assert.match(readme,/Aucune insertion musculaire 3D n'est validée/);
});

test('historical snapshots remain explicitly historical, with original version identifiers',()=>{
 for(const entry of status.separate_historical_documents){
  const source=JSON.parse(read(entry.path));
  assert.equal(source.version,entry.snapshot_version,entry.path);
  assert.ok(compareVersion(entry.snapshot_version,status.public_release)<0,entry.path);
  assert.match(entry.classification,/historique|antérieur/);
 }
 assert.match(readme,/instantanés historiques/);
});

test('staging work is declared separately from the deployed feature inventory',()=>{
 assert.deepEqual(status.work_not_yet_public_as_of_audit.map(x=>x.pr),[12,13]);
 for(const pr of status.work_not_yet_public_as_of_audit){
  assert.match(pr.status,/draft_on/);
  assert.ok(!status.front_end.intro.includes(pr.branch));
 }
 assert.match(readme,/branches non fusionnées/);
});
