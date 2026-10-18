from pathlib import Path
import gzip,json,hashlib,re,numpy as np
OUT=Path(__file__).resolve().parents[1];P=OUT/'input'
ptr=(P/'pilot_phys2bids_pointer.txt').read_text(encoding='utf-8')
key=re.search(r'SHA256E-s(\d+)--([0-9a-f]{64})',ptr)
data=(P/'pilot_phys2bids.log').read_bytes()
assert len(data)==int(key[1]) and hashlib.sha256(data).hexdigest()==key[2]
a=np.loadtxt(gzip.open(P/'pilot_physio.tsv.gz','rt'),delimiter='\t')
edges=np.flatnonzero(np.diff(a[:,11])>0)+1
assert len(edges)==535 and a[edges[0],0]==0
assert abs(float(np.median(np.diff(a[edges,0])))-1.3)<1e-9
assert json.loads((OUT/'PILOTE_RESULTATS.json').read_text())['files']['physio']['time_alignment_status']=='BLOCKED_ORIGIN_CONVENTION_CONFLICT'
print('Trigger diagnostic verified: 535 fronts, candidate channel index 11; film alignment unresolved, no correction applied.')
