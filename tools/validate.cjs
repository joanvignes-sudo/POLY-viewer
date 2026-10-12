const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..')),I=require(path.join(root,'assets/poly-integrity-v097.js'));
const D=JSON.parse(fs.readFileSync(path.join(root,'EXPLORATION_v0.97.json'),'utf8')),report=I.validate(D);
const local=(url,where)=>{if(url&&!/^https?:\/\//.test(url)){const p=path.resolve(root,url.split('#')[0]);if(!p.startsWith(root+path.sep)||!fs.existsSync(p))report.errors.push({path:where,message:'Source locale absente ou hors publication.'});}};
for(const [id,c] of Object.entries(D.chains))for(const e of c.evidence||[])local(e.url,id);
for(const p of D.paths)for(const e of p.sources||[])local(e.url,p.id);
for(const t of D.timings)local(t.public_href,t.id);
const meta=JSON.parse(fs.readFileSync(path.join(root,'assets/anatomy/ATLAS_ANATOMIQUE.json')));
for(const [name,hash] of [['cerebra-surfaces.bin',meta.mesh_sha256],['CerebrA-source.zip',meta.source_sha256]]){
 const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'assets/anatomy',name))).digest('hex');
 if(actual!==hash)report.errors.push({path:name,message:'Empreinte anatomique incorrecte.'});
}
const bindings=JSON.parse(fs.readFileSync(path.join(root,'ANCRAGE_HUMAIN_v0.94.json')));
const regions=new Set(meta.regions.map(r=>r.id));
for(const r of bindings.routes){const route=D.paths.find(p=>p.id===r.path);if(!route)report.errors.push({path:r.path,message:'Parcours anatomique inconnu.'});for(const s of r.steps){if(!route?.steps.some((n,i)=>n.id===s.id&&i===s.index)||s.atlas_regions.some(id=>!regions.has(id)))report.errors.push({path:s.id,message:'Ancrage inconnu.'});}}
const bb=path.join(root,'assets/bigbrain/PROVENANCE.json');
if(fs.existsSync(bb)){const m=JSON.parse(fs.readFileSync(bb));for(const s of [...m.sources,{file:m.mesh_file,sha256:m.mesh_sha256}]){const f=path.resolve(root,'assets/bigbrain',s.file);if(!f.startsWith(path.resolve(root,'assets/bigbrain')+path.sep)||!fs.existsSync(f)||crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')!==s.sha256)report.errors.push({path:s.file,message:'Source BigBrain absente ou empreinte incorrecte.'});}}
const hist=path.join(root,'assets/histology/PROVENANCE.json');
if(fs.existsSync(hist)){const m=JSON.parse(fs.readFileSync(hist));for(const r of [...m.sources.map(r=>({path:r.file,sha256:r.sha256})),...m.derived_files]){const f=path.resolve(root,'assets/histology',r.path);if(!f.startsWith(path.resolve(root,'assets/histology')+path.sep)||!fs.existsSync(f)||crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')!==r.sha256)report.errors.push({path:r.path,message:'Source histologique absente ou empreinte incorrecte.'});}}
const org=JSON.parse(fs.readFileSync(path.join(root,'ORGANISATION_v0.97.json'))),atlas=JSON.parse(fs.readFileSync(path.join(root,'atlas/ATLAS_EXPLORATION.json'))),docs=JSON.parse(fs.readFileSync(path.join(root,'DOCUMENTS_CANONIQUES_v0.97.json')));
const fail=(where,message)=>report.errors.push({path:where,message});
const normalize=item=>{const q=JSON.parse(JSON.stringify(item));for(const s of q.sources||[])if(s.url?.startsWith('atlas/'))s.url=s.url.slice(6);if(q.public_href?.startsWith('atlas/'))q.public_href=q.public_href.slice(6);return q;};
if(JSON.stringify(D.paths.map(normalize))!==JSON.stringify(atlas.paths))fail('atlas.paths','Parcours divergents entre les deux vues.');
if(JSON.stringify(D.timings.map(normalize))!==JSON.stringify(atlas.timings))fail('atlas.timings','Repères divergents entre les deux vues.');
const embedded=fs.readFileSync(path.join(root,'atlas/index.html'),'utf8').match(/<script[^>]*id="polyData"[^>]*>([\s\S]*?)<\/script>/);
if(!embedded||JSON.stringify(JSON.parse(embedded[1]))!==JSON.stringify(atlas))fail('atlas/index.html','Export intégré différent du fichier téléchargeable.');
const sourceIds=new Set(org.sources.map(s=>s.id));
for(const entry of org.entries){if(!D.chains[entry.id]&&!D.paths.some(p=>p.id===entry.id))fail(entry.id,'Dossier dérivé inconnu.');for(const ref of [...entry.references,...entry.evidence_records])if(!sourceIds.has(ref.source))fail(entry.id,'Source absente du répertoire.');}
if(org.entries.length!==Object.keys(D.chains).length+D.paths.length||JSON.stringify(org.timings)!==JSON.stringify(D.timings))fail('ORGANISATION','Répertoire dérivé incomplet ou ancien.');
for(const g of docs.groups)for(const file of [g.canonical_path,...g.aliases]){const d=atlas.documents.find(d=>d.path===file);if(!d||crypto.createHash('sha256').update(d.text.replace(/\r/g,'')).digest('hex')!==g.normalized_body_sha256)fail(file,'Regroupement documentaire non identique.');}
if(docs.groups.length!==docs.canonical_count||docs.groups.reduce((s,g)=>s+1+g.aliases.length,0)!==atlas.documents.length)fail('documents','Nombre de documents regroupés incorrect.');
report.ok=report.errors.length===0;report.version='0.97';report.scope='Structural and local-source integrity; not scientific validation';
console.log(JSON.stringify(report,null,2));process.exitCode=report.ok?0:1;

