from pathlib import Path
from html.parser import HTMLParser
import json,hashlib,re,subprocess
OUT=Path(__file__).resolve().parent
ROOT=OUT.parents[1]
BASE=Path('C:/Users/vignes/Documents/Codex/2026-10-14/reprends-poly-depuis-ce-dossier-c')
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def git(p,*args):return subprocess.check_output(['git','-C',str(p),*args],encoding='utf-8').strip()
d=read(OUT/'SOURCES_HUMAINES.json');rows=d['studies']
assert len(rows)==18 and len({r['id'] for r in rows})==18 and len({r['doi'].lower() for r in rows})==18
assert sum(r['role']=='CANDIDATE_COMPLEMENTAIRE' for r in rows)==13
assert sum(r['role']=='REFERENCE_EXISTANTE_C13_OU_FILMS' for r in rows)==5
assert all(re.fullmatch(r'10\.\d{4,9}/\S+',r['doi']) for r in rows)
assert all(r['url'].startswith('https://') and r['limit'] and r['population'] and r['access_verified'] for r in rows)
assert all(r['effect_size_extracted'] is None and r['biological_delay_ms'] is None and not r['raw_data_reanalysis'] and not r['integrated_in_viewer'] for r in rows)
byid={r['id']:r for r in rows}
assert 'AM et BG' in byid['H14']['cohort_overlap']
assert '11 participants' in byid['H13']['cohort_overlap']
assert byid['H02']['local_presence']['registry'] and byid['H08']['local_presence']['registry']
class Catalogue(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.links=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='article':self.ids.append(a['id'])
        if tag=='a':self.links.append(a['href'])
p=Catalogue();p.feed((OUT/'CATALOGUE.html').read_text(encoding='utf-8'))
assert set(p.ids)==set(byid) and len(p.ids)==18
assert all((OUT/u).is_file() for u in p.links if not u.startswith('https://'))
assert {r['url'] for r in rows}.issubset(set(p.links))
prior={}
for folder in ['POLY_LOT07_2026-10-17','POLY_C13_SUITE_2026-10-17']:
    root=OUT.parent/folder;m=read(root/'MANIFESTE_LIVRAISON.json')
    failures=[n for n,h in m.items() if not (root/n).is_file() or sha(root/n)!=h]
    assert not failures,(folder,failures)
    prior[folder]=dict(files_checked=len(m),failures=failures,manifest_sha256=sha(root/'MANIFESTE_LIVRAISON.json'))
pub=BASE/'work/poly_release_canon_2026-10-15'
old=BASE.parents[1]/'2026-10-10/bon/work/poly-publication'
proto=BASE/'work/poly_ux_nuit_2026-10-15'
refs=[('public_v0.129.0',pub,read(BASE/'outputs/POLY_UX_NUIT_2026-10-15/REFERENCE_FICHIERS.json')['files']),('Konrad_v0.128.1',old,read(old.parents[1]/'outputs/POLY_LOCAL_AFTER_v0.128.1/PUBLICATION_FREEZE.json')['tracked_files']),('prototype',proto,read(BASE/'outputs/POLY_C13_SCENES_HUMAINES_2026-10-16/REFERENCE_APRES_HUMAIN.json')['files'])]
protected={}
for name,root,files in refs:
    failures=[n for n,h in files.items() if not (root/n).is_file() or sha(root/n)!=h]
    assert not failures,(name,failures)
    protected[name]=dict(files_checked=len(files),failures=failures)
for name,root,head in [('public_v0.129.0',pub,'ff2f1b249a2f70e78b74d488659840bdb2aed555'),('Konrad_v0.128.1',old,'3be8c5d17ddbedf2436cd11d7a432f9aa096b30d')]:
    assert git(root,'rev-parse','HEAD')==head
    assert not git(root,'status','--porcelain')
    protected[name]['head']=head;protected[name]['git_clean']=True
relay=read(BASE/'outputs/POLY_RELAIS_EMOTIONS_2026-10-16/ETAT_REPRISE.json')['status']
assert relay=='pause_demandee_par_proprietaire'
manifest=OUT/'MANIFESTE.json'
if manifest.is_file():
    assert all(sha(OUT/n)==h for n,h in read(manifest).items())
result=dict(passed=True,human_publications=18,complementary_to_C13_FILMS=13,already_represented=5,local_catalogue_articles=len(p.ids),local_catalogue_links=3,external_link_check='Sources consultées par recherche Web ; ce script ne teste pas leur disponibilité réseau.',previous_deliveries=prior,protected_originals=protected,relay_status=relay,scientific_reanalysis=False,scientific_validation=False,limitations=['Catalogue contrôlé structurellement ; pas de test navigateur rendu, zoom ou lecteur écran dans ce supplément.','Présence locale par correspondances documentées ; pas audit de tout l’historique.','Méthodes/suppléments, corrections, licences et fichiers de données à compléter avant intégration.'])
if not manifest.is_file():(OUT/'CONTROLES.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
