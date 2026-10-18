from pathlib import Path
import numpy as np,json,gzip,hashlib,re,csv,collections,zipfile,xml.etree.ElementTree as E
OUT=Path(__file__).resolve().parents[1]
P=OUT/'input'
def read(n):return json.loads((P/n).read_text(encoding='utf-8'))
def time_at(i,n,meta):
    f=meta.get('SamplingFrequency');s=meta.get('StartTime')
    if not isinstance(f,(int,float)) or not np.isfinite(f) or f<=0:raise ValueError('Invalid sampling frequency')
    if not isinstance(s,(int,float)) or not np.isfinite(s):raise ValueError('Missing or ambiguous time origin')
    if not isinstance(i,int) or i<0 or i>=n:raise IndexError(i)
    return s+i/f
def summary(a):
    a=np.asarray(a)
    if a.ndim!=2:raise ValueError('Expected matrix')
    return dict(shape=list(a.shape),nonfinite_by_column=np.sum(~np.isfinite(a),axis=0).tolist(),constant_by_column=[bool(np.all(a[:,j]==a[0,j])) if np.isfinite(a[:,j]).all() and len(a) else False for j in range(a.shape[1])])
# Conventions tested before reading numerical series.
tests=[]
assert time_at(0,5,dict(StartTime=9,SamplingFrequency=1000))==9;tests.append('zero based origin')
assert abs(time_at(4,5,dict(StartTime=9,SamplingFrequency=1000))-9.004)<1e-12;tests.append('last sample')
for i,n,m,exc in [(0,5,dict(StartTime=0,SamplingFrequency=0),ValueError),(0,5,dict(SamplingFrequency=1),ValueError),(-1,5,dict(StartTime=0,SamplingFrequency=1),IndexError),(5,5,dict(StartTime=0,SamplingFrequency=1),IndexError)]:
    try:time_at(i,n,m)
    except exc:pass
    else:raise AssertionError('Expected rejection')
    tests.append(str(exc.__name__)+' rejection')
assert summary([[2],[2]])['constant_by_column']==[True];tests.append('constant retained')
assert summary([[float('nan')],[2]])['nonfinite_by_column']==[1];tests.append('missing counted, not imputed')
result=dict(convention_tests=tests,analysis_type='Contrôle de format et d’intégrité ; aucun effet biologique estimé.',selection='AfterTheRain / sub-S01 / ses-2 fixé avant acquisition des séries',files={})
for name,meta,ptr in [('consensus','annotation__derivatives__Annot_AfterTheRain_stim.json','annotation__derivatives__Annot_AfterTheRain_stim.tsv.gz'),('physio','fmri__sub-S01__ses-2__func__sub-S01_ses-2_task-AfterTheRain_physio.json','fmri__sub-S01__ses-2__func__sub-S01_ses-2_task-AfterTheRain_physio.tsv.gz')]:
    path=P/('pilot_'+name+'.tsv.gz');data=path.read_bytes()
    expected=re.search(r'SHA256E-s(\d+)--([0-9a-f]{64})', (P/ptr).read_text())
    assert expected and len(data)==int(expected[1]) and hashlib.sha256(data).hexdigest()==expected[2]
    m=read(meta)
    with gzip.open(path,'rt') as f:a=np.loadtxt(f,delimiter='\t')
    assert a.shape[1]==len(m['Columns'])
    d=summary(a);d.update(sha256=hashlib.sha256(data).hexdigest(),bytes=len(data),annex_hash_verified=True,columns=m['Columns'],sampling_frequency=m['SamplingFrequency'],start_time=m['StartTime'],last_time=time_at(len(a)-1,len(a),m),units_declared=m.get('Units'),duplicate_column_names=[k for k,v in collections.Counter(m['Columns']).items() if v>1])
    if name=='physio':
        d['time_column_first_last']=a[[0,-1],0].tolist()
        dt=np.diff(a[:,0]);d['time_column_monotonic']=bool((dt>0).all());d['time_column_step_min_max']=[float(dt.min()),float(dt.max())]
        d['time_column_units_declared']=False
    else:d['Breathing_in_consensus']='Breathing' in m['Columns']
    if name=='physio':
        d['origin_difference_if_time_column_in_seconds']=float(m['StartTime']-a[0,0])
        d['time_alignment_status']='BLOCKED_ORIGIN_CONVENTION_CONFLICT'
    result['files'][name]=d
for prefix in ['fmri','annotation']:
    tree=read(prefix+'_tree.json');assert not tree['truncated']
    paths=[x['path'] for x in tree['tree'] if x['type']=='blob']
    result[prefix+'_inventory']=dict(commit=read(prefix+'_commit.json')['sha'],tree_sha=tree['sha'],files=len(paths),participants_declared_initial_audit={'fmri':30,'annotation':44}[prefix],physio_json=sum(x.endswith('_physio.json') for x in paths),physio_gz=sum(x.endswith('_physio.tsv.gz') for x in paths),consensus_json=sum(x.startswith('derivatives/Annot_') and x.endswith('.json') for x in paths),note='Présence de chemins, pas assurance de validité de chaque fichier.')
result['cautions']=['La colonne time ne déclare pas son unité ; sa relation avec StartTime doit être vérifiée par triggers avant toute jointure temporelle.','Les colonnes Digital input sont répétées : index de colonne indispensable.','PPG est un signal optique pulsatile, pas un ECG ni une fréquence cardiaque déjà calculée.','Un seul film/sujet physiologique contrôlé ; aucun résultat généralisable.']
expected=json.loads((OUT/'PILOTE_RESULTATS.json').read_text(encoding='utf-8'))
for key in ['consensus','physio']: assert result['files'][key]==expected['files'][key]
assert len(result['convention_tests'])==8
print('Pilot verification PASSED; no input or frozen report changed.')
print(json.dumps(result,ensure_ascii=False,indent=2))
