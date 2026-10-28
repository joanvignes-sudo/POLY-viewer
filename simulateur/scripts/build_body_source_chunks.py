#!/usr/bin/env python3
"""Produce temporary, byte-faithful anatomy chunks from POLY's pinned packed source.

Output is a *candidate build artefact*, never published by this program.
No geometry simplification, anatomical insertion, coordinate adjustment or state simulation.
"""
from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import struct
from collections import Counter, defaultdict
from pathlib import Path

SCHEMA = "poly.body-source-chunks.v1"
SOURCES = {
    "body-display.json": "cf140a39c11163508e91e12b0df9820e6e36ea2f2b50392f62cd9f404fea1573",
    "body-display.bin": "41fb852fb1c3d00dd8be90150226f92e5adf1d1fc783cb1223945f3a4ba229c4",
}
SYSTEMS = (
    "skeletal", "muscular", "nervous", "circulatory", "respiratory",
    "digestive", "urinary", "integumentary", "lymphatic", "male_reproductive",
)
SIZE_FIELDS = (
    ("position_offset", "vertex_count"),
    ("normal_offset", "vertex_count"),
    ("index_offset", "triangle_count"),
)
ORIGINAL_ROOT = Path(__file__).resolve().parents[1] / "models"


def digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def system_of(item: dict) -> str:
    path = " ".join(item["path"])
    return next((name for name in SYSTEMS if "VH_M_" + name + "_system" in path), "nervous")


def payload_lengths(item: dict) -> tuple[int, int, int]:
    return item["vertex_count"] * 12, item["vertex_count"] * 12, item["triangle_count"] * 12


def source_slices(item: dict, blob: bytes) -> list[bytes]:
    checks = ("position_offset", "normal_offset", "index_offset", "vertex_count", "triangle_count")
    if any(not isinstance(item.get(k), int) or item[k] < 0 for k in checks):
        raise ValueError("Non-integer or negative source geometry range for " + str(item.get("name")))
    pieces = []
    for (offset_key, _), length in zip(SIZE_FIELDS, payload_lengths(item)):
        offset = item[offset_key]
        if offset % 4 or offset + length > len(blob):
            raise ValueError("Out-of-range source geometry: " + str(item.get("name")))
        pieces.append(blob[offset : offset + length])
    # Existing atlas uses per-structure vertex indices. Enforce this before repacking.
    indices = pieces[2]
    if indices:
        highest = max(value for (value,) in struct.iter_unpack("<I", indices))
        if highest >= item["vertex_count"]:
            raise ValueError("Index outside source structure: " + str(item.get("name")))
    return pieces


def read_sources(source_root: Path) -> tuple[dict, bytes, dict]:
    raw = {}
    for name, expected in SOURCES.items():
        filename = source_root / (name + ".gz")
        if not filename.is_file():
            raise FileNotFoundError(filename)
        content = gzip.decompress(filename.read_bytes())
        if digest(content) != expected:
            raise ValueError(f"Source {name} has unexpected SHA256: {digest(content)}")
        raw[name] = content
    meta = json.loads(raw["body-display.json"])
    if not isinstance(meta.get("structures"), list) or len(meta["structures"]) != 918:
        raise ValueError("Unexpected source anatomical inventory")
    return meta, raw["body-display.bin"], {
        "metadata_sha256": digest(raw["body-display.json"]),
        "geometry_sha256": digest(raw["body-display.bin"]),
        "metadata_uncompressed_bytes": len(raw["body-display.json"]),
        "geometry_uncompressed_bytes": len(raw["body-display.bin"]),
        "metadata_compressed_bytes": (source_root / "body-display.json.gz").stat().st_size,
        "geometry_compressed_bytes": (source_root / "body-display.bin.gz").stat().st_size,
    }


def plan_chunks(items: list[dict], blob: bytes, max_bytes: int) -> list[dict]:
    """Do not split one original mesh across files; record oversize objects explicitly."""
    if max_bytes < 16:
        raise ValueError("Chunk budget must be at least 16 bytes")
    groups = defaultdict(list)
    for index, item in enumerate(items):
        groups[system_of(item)].append((index, item))
    plans = []
    for system in SYSTEMS:
        group = groups[system]
        if not group:
            continue
        members, total, ordinal = [], 0, 0
        def emit() -> None:
            nonlocal members, total, ordinal
            if not members:
                return
            plans.append({"id": f"{system}-{ordinal:03d}", "system": system,
                          "members": members, "raw_bytes": total,
                          "over_budget": total > max_bytes})
            ordinal += 1
            members, total = [], 0
        for index, item in group:
            lengths = payload_lengths(item)
            size = sum(lengths)
            if total and size + total > max_bytes:
                emit()
            members.append((index, item))
            total += size
            if size >= max_bytes:  # an individual mesh may be larger than a whole budget
                emit()
        emit()
    return plans


def write_chunk(plan: dict, blob: bytes, out: Path, sources: dict) -> dict:
    payload = bytearray()
    generated = []
    for index, source in plan["members"]:
        original = dict(source)
        original["source_index"] = index
        original["source_offsets"] = {field: source[field] for field, _ in SIZE_FIELDS}
        for (field, _), part in zip(SIZE_FIELDS, source_slices(source, blob)):
            original[field] = len(payload)
            payload.extend(part)
        generated.append(original)
    assert len(payload) == plan["raw_bytes"]
    chunk_name = plan["id"]
    data_bytes = bytes(payload)
    packed = gzip.compress(data_bytes, compresslevel=6, mtime=0)
    chunk_meta = {
        "schema": "poly.body-source-chunk-metadata.v1",
        "id": chunk_name,
        "system": plan["system"],
        "source_metadata_sha256": sources["metadata_sha256"],
        "source_geometry_sha256": sources["geometry_sha256"],
        "coordinate_policy": "byte_exact_no_transform",
        "geometries": generated,
    }
    meta_bytes = (json.dumps(chunk_meta, sort_keys=True, ensure_ascii=False, separators=(",", ":")) + "\n").encode()
    (out / (chunk_name + ".bin.gz")).write_bytes(packed)
    (out / (chunk_name + ".json")).write_bytes(meta_bytes)
    return {
        "id": chunk_name, "system": plan["system"], "part_count": len(generated),
        "original_indices": [index for index, _ in plan["members"]],
        "geometry": "chunks/" + chunk_name + ".bin.gz",
        "metadata": "chunks/" + chunk_name + ".json",
        "raw_bytes": len(data_bytes), "compressed_bytes": len(packed),
        "geometry_sha256": digest(data_bytes), "compressed_sha256": digest(packed),
        "metadata_sha256": digest(meta_bytes),
        "above_budget_single_mesh": plan["over_budget"],
    }


def verify_chunks(manifest: dict, original_meta: dict, original_blob: bytes, out: Path) -> None:
    witnessed = set()
    for chunk in manifest["chunks"]:
        meta_bytes = (out / Path(chunk["metadata"]).name).read_bytes()
        compressed = (out / Path(chunk["geometry"]).name).read_bytes()
        if digest(meta_bytes) != chunk["metadata_sha256"] or digest(compressed) != chunk["compressed_sha256"]:
            raise AssertionError("Tampered chunk artefact")
        contents = gzip.decompress(compressed)
        if digest(contents) != chunk["geometry_sha256"] or len(contents) != chunk["raw_bytes"]:
            raise AssertionError("Chunk binary identity mismatch")
        parsed = json.loads(meta_bytes)
        if parsed["source_geometry_sha256"] != manifest["source"]["geometry_sha256"]:
            raise AssertionError("Original geometry provenance absent")
        for item in parsed["geometries"]:
            index = item["source_index"]
            if index in witnessed or not (0 <= index < len(original_meta["structures"])):
                raise AssertionError("Duplicate or unrecognized atlas structure")
            witnessed.add(index)
            original = original_meta["structures"][index]
            for field, size_field in SIZE_FIELDS:
                if item["source_offsets"][field] != original[field]:
                    raise AssertionError("Changed source offsets")
                length = original[size_field] * 12
                before = original_blob[original[field] : original[field] + length]
                after = contents[item[field] : item[field] + length]
                if before != after:
                    raise AssertionError("Structure bytes changed during repacking")
            for field in original:
                if field not in ("position_offset", "normal_offset", "index_offset") and item[field] != original[field]:
                    raise AssertionError("Source structure metadata altered: " + field)
    if witnessed != set(range(len(original_meta["structures"]))):
        raise AssertionError("Not all source structures preserved")


def build(source_root: Path, out: Path, max_bytes: int, verify: bool) -> dict:
    meta, blob, sources = read_sources(source_root)
    if out.exists() and any(out.iterdir()):
        raise FileExistsError("Output destination must be empty; no overwrite permitted")
    (out / "chunks").mkdir(parents=True, exist_ok=True)
    plans = plan_chunks(meta["structures"], blob, max_bytes)
    chunks = [write_chunk(plan, blob, out / "chunks", sources) for plan in plans]
    witness = sorted(i for chunk in chunks for i in chunk["original_indices"])
    if witness != list(range(918)):
        raise AssertionError("Chunk plan did not preserve all 918 source identities")
    manifest = {
        "schema": SCHEMA, "status": "experimental_not_deployed",
        "source": sources, "source_count": len(meta["structures"]),
        "chunk_budget_bytes": max_bytes,
        "chunk_count": len(chunks),
        "total_raw_chunk_bytes": sum(x["raw_bytes"] for x in chunks),
        "total_compressed_chunk_bytes": sum(x["compressed_bytes"] for x in chunks),
        "oversized_source_chunks": [x["id"] for x in chunks if x["above_budget_single_mesh"]],
        "original_source_geometry_unchanged": True,
        "no_anatomical_simplification": True, "no_individual_registration": True,
        "published": False, "chunks": chunks,
    }
    if verify:
        verify_chunks(manifest, meta, blob, out / "chunks")
        manifest["byte_for_byte_structure_verification"] = "PASS"
    path = out / "MANIFEST.json"
    path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-root", type=Path, default=ORIGINAL_ROOT)
    parser.add_argument("--output-root", type=Path, required=True)
    parser.add_argument("--max-chunk-bytes", type=int, default=4 * 1024 * 1024)
    parser.add_argument("--verify", action="store_true")
    args = parser.parse_args()
    summary = build(args.source_root, args.output_root, args.max_chunk_bytes, args.verify)
    print(json.dumps({k: v for k, v in summary.items() if k != "chunks"}, indent=2))


if __name__ == "__main__":
    main()
