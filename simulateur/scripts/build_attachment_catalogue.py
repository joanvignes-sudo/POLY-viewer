"""Reproducible read-only inventory and attachment migration. No spatial inference.

Run: python simulateur/scripts/build_attachment_catalogue.py (numpy required).
Source files are hashed; existing source coordinates, C4 and calculations are untouched.
"""
import gzip
import hashlib
import json
from collections import Counter
from pathlib import Path
from qualify_elbow_surfaces import audit_mesh

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data'


def read(name):
    p = DATA / name
    raw = p.read_bytes()
    return json.loads(gzip.decompress(raw) if name.endswith('.gz') else raw)


def build():
    inputs = ['muscle-catalogue.json.gz', 'muscle-skeleton-interface.json',
              'muscle-integration-ledger.json', 'forearm-motor-reference.json.gz',
              'hand-muscles-reference.json.gz', 'elbow-anatomical-qualifications.json',
              'recherche/muscles-correspondances-osseuses.json', 'attachment-reviewed-regions.json']
    provenance = {name: hashlib.sha256((DATA / name).read_bytes() if name.endswith('.gz') else
                  (DATA / name).read_bytes().replace(b'\r\n', b'\n')).hexdigest() for name in inputs}
    cat, interface, ledger, body, hand, elbow, candidates, reviewed = [read(n) for n in inputs]
    terms = {str(t['id']): t for t in cat['terms']}
    identities = {s['id']: s for s in interface['entities']['muscle_surface_references']}
    meshes = {**{'body:' + p['id']: p for p in body['parts']},
              **{'hand:' + p['id']: p for p in hand['parts'] if p['kind'] == 'muscle'}}
    surfaces = []
    for s in cat['surfaces'] + cat['native']:
        key = s['layer'] + ':' + s['id']
        mesh = meshes.get(key)
        term_ids = sorted({str(t['id']) for t in cat['terms'] if any(
            x['id'] == s['id'] and x['layer'] == s['layer'] for x in t['surfaces'])})
        audit = audit_mesh(mesh) if mesh else {'status': 'not_audited', 'reason': 'Native contextual piece; no mesh decoded by this inventory'}
        if mesh:
            audit['status'] = 'mesh_audited_not_biological_validation'
        surfaces.append({'id': key, 'name': s.get('label', s['name']), 'layer': s['layer'],
                         'side': s.get('side'), 'region': s.get('region', 'HRA natif'),
                         'term_ids': term_ids, 'href': s['href'],
                         'atlas': s.get('source_atlas', 'HRA' if s['layer'] == 'native' else 'BodyParts3D'),
                         'source_geometry_sha256': mesh.get('original_sha256') if mesh else None,
                         'identity': identities.get(key), 'geometry_status': 'estimated_display_placement',
                         'attachment_xyz': None, 'audit': audit})
    known = {s['id'] for s in surfaces}
    relations = []

    def add(id, refs, target, role, status, evidence, provenance_path, note='', via=None, group=None):
        # Fail closed: dangling surface IDs must never silently disappear.
        if not refs or any(r not in known for r in refs):
            raise ValueError(f'Unresolved surface(s) in {id}: {refs}')
        relations.append({'id': id, 'source_surface_ids': sorted(set(refs)), 'target': target,
                          'via': via, 'role': role, 'documentary_group': group,
                          'status': status, 'confidence': 'regional_source_reviewed' if status == 'documented_region' else 'unverified',
                          'evidence': evidence, 'provenance': {'path': provenance_path, 'sha256': provenance[provenance_path]},
                          'note': note, 'geometry': {'status': 'unlocated', 'source_xyz': None, 'target_xyz': None,
                                                   'frame': None, 'registration': None}, 'validation': None})

    for i, record in enumerate(reviewed['records']):
        refs = [s['id'] for s in surfaces if set(map(str, record['term_ids'])) & set(s['term_ids'])]
        add(f'reviewed:{i+1}', refs, {'kind': record['kind'], 'label': record['target'], 'mesh_ids': []},
            record['role'], 'documented_region',
            [{'url': reviewed['sources'][record['source']], 'locator': record['row'], 'type': 'university_anatomy_table',
              'review_date': reviewed['review_date'], 'species': 'Homo sapiens', 'scope': 'Population-level regional description; atlas identity is a name correspondence'}],
            inputs[-1], reviewed['scope'], record.get('via'), record.get('group'))
    candidate_refs = {c['muscle_ref'] for c in candidates['relationships']}
    # Latest qualified elbow cases supersede earlier duplicates, preserving their original file.
    for c in elbow['cases']:
        add('elbow:' + c['id'], ['body:' + p for p in c['source_surface_ids']],
            {'kind': 'bone', 'label': c['bone_region'], 'family': c['bone_family'], 'mesh_ids': []},
            c['relation_type'], 'documented_region', [{'url': c['source_url'], 'locator': c['id'],
            'type': c['evidence_type'], 'scope': c['study_scope']}], inputs[5], c['notes'])
    for c in interface['relations']['legacy_documented_bone_regions']:
        if c['id'] in ['legacy:biceps_radius', 'legacy:triceps_ulna', 'legacy:pq_radius', 'legacy:pq_ulna']:
            continue
        if any(p.split(':', 1)[1] in candidate_refs for p in c['source_surface_ids']):
            continue  # Candidate/rejected source table takes precedence over its optimistic legacy label.
        add(c['id'], c['source_surface_ids'], {'kind': 'bone', 'label': c['anatomical_note'],
            'family': c['bone_family'], 'mesh_ids': []}, 'regional_association', 'documented_region',
            [{'url': c['source'], 'locator': c['id'], 'type': 'legacy_documentary_reference', 'scope': c['scope']}],
            inputs[1], 'Imported documentary qualification; no new independent study review.')
    for c in candidates['relationships']:
        rejected = c['documentation_status'].startswith('unqualified')
        add('candidate:' + c['id'], ['body:' + c['muscle_ref']],
            {'kind': 'tendon' if c['target_anatomical_class'] == 'tendon' else 'bone',
             'label': c['target_region'], 'mesh_ids': c['in_avatar_bone_ids']},
            'regional_association', 'rejected' if rejected else 'source_candidate',
            [] if rejected else [{'url': c['evidence_url'], 'locator': c['id'], 'type': 'unverified_reference'}],
            inputs[6], c['warning'])
    for i, c in enumerate(hand['attachment_observations']):
        refs = []
        for p in hand['parts']:
            if p['kind'] == 'muscle' and (p['id'] in c['parts'] or p.get('counterpart') in c['parts']):
                refs.append('hand:' + p['id'])
        add('hand-observation:' + str(i+1), refs,
            {'kind': 'mixed_region', 'label': c.get('text', c['scope'] if 'scope' in c else ''), 'mesh_ids': []},
            'regional_association', 'documented_region', [{'url': c['source'], 'locator': c.get('id', str(i)),
            'type': 'legacy_human_anatomy_observation', 'scope': c.get('preparation', c.get('scope', ''))}],
            inputs[4], 'Shared human population evidence, not an individual left/right measurement.')
    # Keep all inherited muscle descriptions searchable, without treating a muscle/nerve URL as attachment evidence.
    for key, p in meshes.items():
        text = p.get('attachments') or p.get('attachment_text')
        if text:
            add('description:' + key, [key], {'kind': 'unresolved', 'label': text, 'mesh_ids': []},
                'unspecified', 'unreviewed_description', [], inputs[3] if key.startswith('body:') else inputs[4],
                'Inherited text; attachment evidence must be checked separately from innervation and atlas provenance.')
    for s in surfaces:
        linked = [r for r in relations if s['id'] in r['source_surface_ids']]
        s['relation_ids'] = [r['id'] for r in linked]
        s['attachment_status'] = 'documented_region' if any(r['status'] == 'documented_region' for r in linked) else 'unmapped'
    regions = {}
    for region in sorted({s['region'] for s in surfaces}):
        rows = [s for s in surfaces if s['region'] == region]
        regions[region] = {'surfaces': len(rows), 'documented': sum(s['attachment_status'] == 'documented_region' for s in rows)}
    references = {}
    def collect(value, path):
        if isinstance(value, dict):
            for k, v in value.items():
                if k not in ('positions', 'indices', 'normals'): collect(v, path + '/' + k)
        elif isinstance(value, list):
            for i, v in enumerate(value): collect(v, path + '/' + str(i))
        elif isinstance(value, str) and value.startswith(('https://', 'http://')) and ' ' not in value:
            references.setdefault(value, []).append(path)
    for name, source in zip(inputs, [cat, interface, ledger, body, hand, elbow, candidates, reviewed]):
        collect(source, name)
    result = {'schema': 'poly.attachment-catalogue/1', 'release': '0.140.1', 'date': '2026-10-25',
              'scope': 'Operational inventory of all known surfaces; selective regional documentary coverage, no physical binding or mechanical constraint.',
              'hash_convention': 'SHA256: gzip exact bytes; UTF-8 JSON with CRLF normalized to LF for cross-platform reproduction.',
              'source_reference_inventory': [{'url': url, 'occurrences': paths, 'qualification': 'inventory_only_not_attachment_evidence'} for url, paths in sorted(references.items())],
              'provenance': provenance, 'surfaces': surfaces, 'relations': relations,
              'terms': [{'id': str(t['id']), 'name': t['english'], 'region': t['region'], 'kind': t['kind'],
                         'surface_ids': [s['id'] for s in surfaces if str(t['id']) in s['term_ids']]} for t in cat['terms']],
              'summary': {'surfaces': len(surfaces), 'reference_surfaces': len(cat['surfaces']), 'native_context': len(cat['native']),
                          'audited_meshes': len(meshes), 'relations_by_status': dict(Counter(r['status'] for r in relations)),
                          'documented_surfaces': sum(s['attachment_status'] == 'documented_region' for s in surfaces),
                          'hypothetical_points': 0, 'validated_insertions': 0, 'validated_dynamic_constraints': 0,
                          'by_region': regions},
              'limitations': ['Le nombre de surfaces n’est pas un nombre de muscles individuels.',
                              'Les groupes et chefs partagent des descriptions ; aucune empreinte individuelle n’en est déduite.',
                              'Les géométries natives HRA restent contextuelles ; leur topologie n’est pas auditée ici.',
                              'Les cibles documentaires sans mesh_ids ne désignent aucun maillage ni point 3D.',
                              'Les origines, terminaisons et continuités sont partielles ; bassin, périnée et muscles viscéraux nécessitent une revue dédiée.',
                              'Aucune fermeture topologique ne vaut validation d’un volume biologique ou d’une déformation.']}
    (DATA / 'attachment-catalogue.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(result['summary'], ensure_ascii=False))


if __name__ == '__main__':
    build()
