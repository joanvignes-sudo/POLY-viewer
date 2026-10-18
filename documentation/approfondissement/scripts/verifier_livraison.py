from pathlib import Path
import json,hashlib
OUT=Path(__file__).resolve().parents[1]
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
m=read(OUT/'MANIFESTE.json')
assert all((OUT/n).is_file() and sha(OUT/n)==h for n,h in m.items())
inv=read(OUT/'INVENTAIRE_RUNS.json');assert len(inv['records'])==450
assert sum(inv['counts_by_subject'].values())==450
assert inv['counts_by_subject']['S13']==13 and inv['counts_by_task']['Error']==1
assert len(inv['alias_candidates_not_applied'])==2
p=read(OUT/'PILOTE_RESULTATS.json')
assert p['files']['consensus']['shape']==[496,50]
assert p['files']['physio']['shape']==[713500,12]
assert p['files']['physio']['time_alignment_status']=='BLOCKED_ORIGIN_CONVENTION_CONFLICT'
assert not p['files']['consensus']['Breathing_in_consensus']
proof=read(OUT/'REGISTRE_PREUVES.json')
assert len(proof['claims'])==12 and all(c['source'] in proof['sources'] for c in proof['claims'])
assert not proof['scientific_effects_recomputed'] and not proof['biological_latency_inferred'] and not proof['site_modified']
print('Delivery verification PASSED:',len(m),'files; 450 inventory records; timing gate retained.')
