"""Build the public inventory from staged Git objects, independent of checkout line endings."""
from pathlib import Path
import hashlib,json,subprocess
root=Path(__file__).resolve().parents[2]
entries=[]
for line in subprocess.check_output(['git','ls-files','--stage','-z'],cwd=root).split(b'\0'):
 if not line:continue
 meta,path=line.split(b'\t',1);mode,oid,stage=meta.split();name=path.decode('utf-8')
 if name=='MANIFESTE_PUBLIC.json':continue
 if stage!=b'0':raise ValueError('Unmerged index')
 if any(x in name.lower().split('/') for x in ['private','body-chunks','reference-chunks','skeleton-chunks','metabolic-observations']) or name.endswith('.bundle'):raise ValueError('Private work artifact in publication: '+name)
 entries.append((name,oid))
p=subprocess.Popen(['git','cat-file','--batch'],cwd=root,stdin=subprocess.PIPE,stdout=subprocess.PIPE)
files=[]
for name,oid in sorted(entries):
 p.stdin.write(oid+b'\n');p.stdin.flush();header=p.stdout.readline().split();size=int(header[2]);data=p.stdout.read(size)
 if p.stdout.read(1)!=b'\n' or len(data)!=size:raise ValueError('Incomplete Git object')
 files.append({'path':name,'bytes':size,'sha256':hashlib.sha256(data).hexdigest()})
p.stdin.close();p.wait()
version=json.loads((root/'VERSION.json').read_text(encoding='utf-8'))['version']
manifest={'version':version,'hash_basis':'git-index-blob-bytes','inventory_scope':'tracked repository files, excluding this self-referential manifest; local research resources excluded','files':files,'total_bytes':sum(x['bytes'] for x in files)}
(root/'MANIFESTE_PUBLIC.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'version':version,'files':len(files),'bytes':manifest['total_bytes'],'private_work_artifacts':0}))
