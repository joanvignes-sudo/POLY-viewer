import importlib.util
import math
import struct
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('reference_chunks', Path(__file__).resolve().parents[1] / 'scripts/build_reference_source_chunks.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ReferenceChunksTest(unittest.TestCase):
    def test_float64_signed_zero_and_indices_are_not_quantized_or_reordered(self):
        p = {'id': 'source', 'positions': [-0.0, 1.123456789123, 2.0, 3, 4, 5], 'indices': [1, 0, 1]}
        payload = bytearray(b'xxxx')
        record = module.append_geometry(payload, 'parts', 0, p)
        self.assertEqual(record['position_offset'] % 8, 0)
        points = struct.unpack_from('<6d', payload, record['position_offset'])
        self.assertEqual(math.copysign(1, points[0]), -1)
        self.assertEqual(points[1], p['positions'][1])
        self.assertEqual(struct.unpack_from('<3I', payload, record['index_offset']), (1, 0, 1))

    def test_invalid_geometry_and_changed_source_are_rejected(self):
        for p in [{'positions': [0, 0, math.nan], 'indices': [0, 0, 0]}, {'positions': [0, 0, 0], 'indices': [1, 0, 0]}]:
            with self.assertRaises(ValueError):
                module.validate_part(p)
        with tempfile.TemporaryDirectory() as directory:
            source, output = Path(directory) / 'changed.gz', Path(directory) / 'output'
            source.write_bytes(b'changed')
            with self.assertRaises(ValueError):
                module.build(source, output)
            self.assertFalse(output.exists())

    def test_catalogue_preserves_scientific_fields_and_both_collections(self):
        data = {'schema': 'fixture', 'human_latency_observations': [{'value': None}],
                'parts': [{'id': 'muscle', 'positions': [0, 0, 0], 'indices': [0, 0, 0], 'delay_ms': None}],
                'bones': [{'id': 'bone', 'positions': [0, 0, 0], 'indices': [0, 0, 0], 'placement': {'source': [1, 2, 3]}}]}
        result = module.stripped_source(data)
        self.assertEqual(result['human_latency_observations'], data['human_latency_observations'])
        self.assertEqual(result['parts'][0]['delay_ms'], None)
        self.assertEqual(result['bones'][0]['placement'], data['bones'][0]['placement'])
        self.assertIn('positions', data['parts'][0])
