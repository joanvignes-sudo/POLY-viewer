#!/usr/bin/env python3
"""Build unpublished exact-value chunks from the existing limbs/trunk reference JSON.

Source JSON numbers become little-endian float64, not float32. No coordinates,
registration, triangles, physiological values or metadata are reconstructed.
"""
import argparse
import array
import gzip
import hashlib
import json
import math
import sys
from collections import defaultdict
from pathlib import Path

SOURCE = Path(__file__).resolve().parents[1] / 'data/forearm-motor-reference.json.gz'
PACKED_SHA = 'd619f1fcb6f85ec38b11cfe92d86a3460eb0454b35791c11128353b4c619bde4'
RAW_SHA = '64ec70f74fb6af18333d6f53b46ac736d59331221c54213737a35b26a1c0f81a'
POLICY = 'exact_json_float64_le_uint32_le_no_transform'


def digest(data):
    return hashlib.sha256(data).hexdigest()


def json_bytes(value):
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False) + '\n').encode()


def numeric_bytes(values, code):
    result = array.array(code, values)
    if result.itemsize != (8 if code == 'd' else 4):
        raise ValueError('Unsupported numeric storage platform')
    if sys.byteorder != 'little':
        result.byteswap()
    return result.tobytes()


def validate_part(part):
    positions, indices = part['positions'], part['indices']
    if not positions or len(positions) % 3 or len(indices) % 3:
        raise ValueError('Invalid source geometry lengths')
    if any(type(v) not in (int, float) or not math.isfinite(v) for v in positions):
        raise ValueError('Non-finite source position')
    if any(type(i) is not int or i < 0 or i >= len(positions) // 3 or i > 0xffffffff for i in indices):
        raise ValueError('Source index outside vertex range')


def append_geometry(payload, collection, source_index, part):
    validate_part(part)
    payload.extend(b'\0' * (-len(payload) % 8))
    position_offset = len(payload)
    payload.extend(numeric_bytes(part['positions'], 'd'))
    index_offset = len(payload)
    payload.extend(numeric_bytes(part['indices'], 'I'))
    return {'key': f'{collection}/{source_index}', 'collection': collection, 'source_index': source_index,
            'source_id': part['id'], 'json_pointer': f'/{collection}/{source_index}',
            'position_offset': position_offset, 'position_values': len(part['positions']),
            'index_offset': index_offset, 'index_values': len(part['indices'])}


def stripped_source(data):
    result = {k: v for k, v in data.items() if k not in ('parts', 'bones')}
    for collection in ('parts', 'bones'):
        result[collection] = [{k: v for k, v in p.items() if k not in ('positions', 'indices')} for p in data[collection]]
    return result


def build(source, output, max_bytes=4*1024*1024, verify=False):
    packed = Path(source).read_bytes()
    if digest(packed) != PACKED_SHA:
        raise ValueError('Pinned compressed reference source changed')
    raw = gzip.decompress(packed)
    if digest(raw) != RAW_SHA:
        raise ValueError('Pinned JSON reference source changed')
    data = json.loads(raw)
    if data['schema'] != 'poly.forearm.motor.reference/1' or len(data['parts']) != 458 or len(data['bones']) != 68:
        raise ValueError('Source reference inventory changed')
    if not isinstance(max_bytes, int) or max_bytes < 1024 or max_bytes > 16*1024*1024:
        raise ValueError('Invalid source chunk budget')
    output = Path(output)
    if output.exists() and any(output.iterdir()):
        raise FileExistsError('Output must be empty; no overwrite')
    (output / 'chunks').mkdir(parents=True, exist_ok=True)
    groups = defaultdict(list)
    for collection in ('parts', 'bones'):
        seen = set()
        for index, part in enumerate(data[collection]):
            validate_part(part)
            if part['id'] in seen:
                raise ValueError('Duplicate source identity')
            seen.add(part['id'])
            group = json.dumps([collection, part.get('region'), part.get('bone_family'), part.get('side')])
            groups[group].append((collection, index, part))
    chunks = []

    def flush(payload, entries, group):
        chunk_id = f'reference-{len(chunks):03d}'
        metadata = {'schema': 'poly.reference-source-chunk.v1', 'id': chunk_id, 'coordinate_policy': POLICY,
                    'source_raw_sha256': RAW_SHA, 'entries': entries}
        meta_bytes = json_bytes(metadata)
        compressed = gzip.compress(payload, compresslevel=6, mtime=0)
        (output / 'chunks' / (chunk_id+'.json')).write_bytes(meta_bytes)
        (output / 'chunks' / (chunk_id+'.bin.gz')).write_bytes(compressed)
        chunks.append({'id': chunk_id, 'metadata': 'chunks/'+chunk_id+'.json', 'geometry': 'chunks/'+chunk_id+'.bin.gz',
                       'source_group': json.loads(group), 'keys': [e['key'] for e in entries],
                       'raw_bytes': len(payload), 'compressed_bytes': len(compressed),
                       'raw_sha256': digest(payload), 'compressed_sha256': digest(compressed), 'metadata_sha256': digest(meta_bytes),
                       'oversized_single': len(payload) > max_bytes and len(entries) == 1})

    for group, members in sorted(groups.items()):
        payload, entries = bytearray(), []
        for collection, index, part in members:
            size = len(part['positions'])*8 + len(part['indices'])*4
            if entries and len(payload) + (-len(payload) % 8) + size > max_bytes:
                flush(payload, entries, group)
                payload, entries = bytearray(), []
            entries.append(append_geometry(payload, collection, index, part))
        if entries:
            flush(payload, entries, group)
    catalogue = json_bytes({'schema': 'poly.reference-source-catalogue.v1', 'source_raw_sha256': RAW_SHA,
                            'data': stripped_source(data)})
    compressed_catalogue = gzip.compress(catalogue, compresslevel=6, mtime=0)
    (output / 'CATALOGUE.json.gz').write_bytes(compressed_catalogue)
    manifest = {'schema': 'poly.reference-source-manifest.v1', 'status': 'experimental_not_deployed', 'published': False,
                'source_gzip_sha256': PACKED_SHA, 'source_raw_sha256': RAW_SHA, 'source_raw_bytes': len(raw),
                'coordinate_policy': POLICY, 'source_counts': {'parts': 458, 'bones': 68}, 'chunk_budget_bytes': max_bytes,
                'catalogue': {'path': 'CATALOGUE.json.gz', 'raw_bytes': len(catalogue), 'compressed_bytes': len(compressed_catalogue),
                              'raw_sha256': digest(catalogue), 'compressed_sha256': digest(compressed_catalogue)},
                'chunks': chunks, 'total_raw_bytes': sum(c['raw_bytes'] for c in chunks)}
    if verify:
        seen = set()
        for chunk in chunks:
            payload = gzip.decompress((output / chunk['geometry']).read_bytes())
            metadata = json.loads((output / chunk['metadata']).read_bytes())
            for entry in metadata['entries']:
                if entry['key'] in seen:
                    raise AssertionError('Duplicate packed entity')
                seen.add(entry['key'])
                part = data[entry['collection']][entry['source_index']]
                for field, code, size in [('position', 'd', 8), ('index', 'I', 4)]:
                    values = part['positions' if field == 'position' else 'indices']
                    offset = entry[field+'_offset']
                    if payload[offset:offset+len(values)*size] != numeric_bytes(values, code):
                        raise AssertionError('Source numeric bits changed')
        if len(seen) != 526 or json.loads(gzip.decompress((output / 'CATALOGUE.json.gz').read_bytes()))['data'] != stripped_source(data):
            raise AssertionError('Reference inventory or metadata changed')
        manifest['source_value_verification'] = 'PASS'
    (output / 'MANIFEST.json').write_bytes(json_bytes(manifest))
    return manifest


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=SOURCE)
    parser.add_argument('--output-root', type=Path, required=True)
    parser.add_argument('--max-chunk-bytes', type=int, default=4*1024*1024)
    parser.add_argument('--verify', action='store_true')
    args = parser.parse_args()
    result = build(args.source, args.output_root, args.max_chunk_bytes, args.verify)
    print(json.dumps({k: v for k, v in result.items() if k not in ('chunks', 'catalogue')}, indent=2))
    print('chunks:', len(result['chunks']), 'catalogue raw bytes:', result['catalogue']['raw_bytes'])
