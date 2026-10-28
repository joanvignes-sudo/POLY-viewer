"""Tests for byte-exact, *unpublished* geometry partitioning."""
from __future__ import annotations

import importlib.util
import json
import struct
import tempfile
import unittest
from pathlib import Path

MODULE = Path(__file__).resolve().parents[1] / "scripts" / "build_body_source_chunks.py"
spec = importlib.util.spec_from_file_location("body_chunk_builder", MODULE)
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


def fixture(name, group, origin):
    points = struct.pack("<6f", origin, 0.0, 0.0, origin + 1.0, 1.0, 1.0)
    normal = struct.pack("<6f", 0.0, 1.0, 0.0, 0.0, 1.0, 0.0)
    faces = struct.pack("<3I", 0, 1, 1)
    return {
        "name": name, "path": ["root", "VH_M_" + group + "_system", name],
        "vertex_count": 2, "triangle_count": 1,
        "bounds": [[origin, 0, 0], [origin + 1, 1, 1]],
    }, (points, normal, faces)


def make_synthetic():
    raw = bytearray()
    structures = []
    for idx, group in enumerate(["muscular", "skeletal", "nervous", "muscular"]):
        item, pieces = fixture("p" + str(idx), group, float(idx))
        for field, part in zip(("position_offset", "normal_offset", "index_offset"), pieces):
            item[field] = len(raw)
            raw.extend(part)
        structures.append(item)
    return structures, bytes(raw)


class BodySourceChunkTests(unittest.TestCase):
    def test_plan_covers_each_source_structure_once(self):
        items, blob = make_synthetic()
        plans = builder.plan_chunks(items, blob, max_bytes=100)
        all_indices = sorted(index for p in plans for index, _ in p["members"])
        self.assertEqual(all_indices, list(range(4)))
        self.assertEqual({p["system"] for p in plans}, {"muscular", "skeletal", "nervous"})
        self.assertTrue(all(p["raw_bytes"] <= 100 for p in plans))

    def test_round_trip_preserves_all_attributes_and_bits(self):
        items, blob = make_synthetic()
        plans = builder.plan_chunks(items, blob, max_bytes=100)
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = {"metadata_sha256": "a" * 64, "geometry_sha256": builder.digest(blob)}
            chunks = [builder.write_chunk(p, blob, root, source) for p in plans]
            manifest = {"source": source, "chunks": chunks}
            builder.verify_chunks(manifest, {"structures": items}, blob, root)
            self.assertEqual(sum(c["part_count"] for c in chunks), 4)
            self.assertEqual(len({c["id"] for c in chunks}), len(chunks))
            first = json.loads((root / (chunks[0]["id"] + ".json")).read_text())
            self.assertEqual(first["coordinate_policy"], "byte_exact_no_transform")
            self.assertTrue(all("source_offsets" in item for item in first["geometries"]))

    def test_tamper_protection_fails_closed(self):
        items, blob = make_synthetic()
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = {"metadata_sha256": "a" * 64, "geometry_sha256": builder.digest(blob)}
            chunks = [builder.write_chunk(p, blob, root, source)
                      for p in builder.plan_chunks(items, blob, max_bytes=100)]
            corrupted = root / (chunks[0]["id"] + ".json")
            corrupted.write_bytes(corrupted.read_bytes() + b"\n")
            with self.assertRaisesRegex(AssertionError, "Tampered"):
                builder.verify_chunks({"source": source, "chunks": chunks}, {"structures": items}, blob, root)

    def test_invalid_indices_and_offsets_refused(self):
        items, blob = make_synthetic()
        wrong = dict(items[0]);wrong["index_offset"] = len(blob) + 4
        with self.assertRaisesRegex(ValueError, "Out-of-range"):
            builder.source_slices(wrong, blob)
        wrong = dict(items[0]);wrong["position_offset"] = 3
        with self.assertRaisesRegex(ValueError, "Out-of-range"):
            builder.source_slices(wrong, blob)
        wrong = dict(items[0]);wrong["index_offset"] = items[0]["index_offset"]
        invalid = bytearray(blob)
        struct.pack_into("<I", invalid, items[0]["index_offset"], 99)
        with self.assertRaisesRegex(ValueError, "Index outside"):
            builder.source_slices(wrong, bytes(invalid))

    def test_oversized_single_mesh_is_flagged_instead_of_silently_truncated(self):
        items, blob = make_synthetic()
        plans = builder.plan_chunks(items, blob, max_bytes=48)
        self.assertTrue(any(p["over_budget"] for p in plans))
        self.assertEqual(sorted(i for p in plans for i, _ in p["members"]), list(range(4)))
        with self.assertRaisesRegex(ValueError, "at least"):
            builder.plan_chunks(items, blob, max_bytes=2)


if __name__ == "__main__":
    unittest.main()
