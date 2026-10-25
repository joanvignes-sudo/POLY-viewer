#!/usr/bin/env python3
"""POLY elbow pilot: geometry QA, NOT anatomical volume or attachment inference.

Run: python simulateur/scripts/qualify_elbow_surfaces.py --out simulateur/data/elbow-surface-audit.json
Requires numpy. Reads source meshes without rewriting them.
"""
import argparse
import gzip
import hashlib
import json
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
CASES = {
    "biceps_radius": {"family": "radius", "part_ids": ["FJ1512", "FJ1478", "FJ1512M", "FJ1478M"]},
    "triceps_ulna": {"family": "ulna", "part_ids": ["FJ1480", "FJ1477", "FJ1479", "FJ1480M", "FJ1477M", "FJ1479M"]},
    "pronator_radius": {"family": "radius", "part_ids": ["FJ1503", "FJ1503M"]},
    "pronator_ulna": {"family": "ulna", "part_ids": ["FJ1503", "FJ1503M"]},
}


def audit_mesh(mesh):
    p = np.asarray(mesh["positions"], dtype=np.float64).reshape(-1, 3)
    t = np.asarray(mesh["indices"], dtype=np.int64).reshape(-1, 3)
    if p.size == 0 or not np.isfinite(p).all() or (t.size and (t.min() < 0 or t.max() >= len(p))):
        raise ValueError("Missing or invalid surface geometry " + mesh["id"])
    edges = np.sort(np.concatenate([t[:, [0, 1]], t[:, [1, 2]], t[:, [2, 0]]]), axis=1)
    _, occurrence = np.unique(edges, axis=0, return_counts=True)
    size = np.ptp(p, axis=0)
    boundary = int(np.count_nonzero(occurrence == 1))
    nonmanifold = int(np.count_nonzero(occurrence > 2))
    return {
        "source_part_id": mesh["id"],
        "source_name": mesh.get("name", ""),
        "side": mesh.get("side"),
        "vertex_count": len(p),
        "triangle_count": len(t),
        "boundary_edge_count": boundary,
        "nonmanifold_edge_count": nonmanifold,
        "watertight_candidate": bool(boundary == 0 and nonmanifold == 0),
        "bbox_extent_source_units": [round(float(x), 5) for x in size],
        "bbox_occupancy_source_units_cubed": round(float(np.prod(size)), 5),
        "actual_muscle_volume": None,
        "validated_enthesis_xyz": None,
        "validated_dynamic_strain": None,
    }


def build(data, digest):
    muscles = {p["id"]: p for p in data["parts"]}
    bones = {(b.get("side"), b.get("bone_family")): b for b in data["bones"]}
    mesh_cache = {}
    cases = []
    for key, case in CASES.items():
        rows = []
        for part_id in case["part_ids"]:
            part = muscles[part_id]
            side = part.get("side")
            bone = bones[(side, case["family"])]
            if part_id not in mesh_cache:
                mesh_cache[part_id] = audit_mesh(part)
            muscle_audit = mesh_cache[part_id]
            bone_audit = audit_mesh(bone)
            denom = bone_audit["bbox_occupancy_source_units_cubed"]
            rows.append({
                **muscle_audit,
                "context_bone_id": bone["id"],
                "context_bone_family": case["family"],
                "bbox_muscle_to_bone_enclosure_ratio": (
                    round(muscle_audit["bbox_occupancy_source_units_cubed"] / denom, 6) if denom > 0 else None
                ),
                "volume_ratio_biological": None,
                "bone_is_separately_registered": False,
            })
        cases.append({
            "id": key, "side_count": len({p["side"] for p in rows}),
            "surfaces": rows,
            "all_surface_volumes_blocked": all(not x["watertight_candidate"] for x in rows),
        })
    return {
        "schema": "poly.elbow-surface-audit/1",
        "method": "source BodyParts3D vertex and triangle topology with AABB enclosure ratios only",
        "source_file": "forearm-motor-reference.json.gz",
        "source_gzip_sha256": digest,
        "units": "Original BodyParts3D mesh coordinate units; not transferred to an individual HRA body",
        "scope_warning": "Bounding-box enclosure ratios are NOT true anatomical muscle/bone volume ratios; open meshes cannot be integrated as closed physical tissue volumes.",
        "anatomical_registration_validated": False,
        "dynamic_deformation_validated": False,
        "cases": cases,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=ROOT / "data" / "forearm-motor-reference.json.gz")
    parser.add_argument("--out", type=Path, default=ROOT / "data" / "elbow-surface-audit.json")
    args = parser.parse_args()
    compressed = args.source.read_bytes()
    data = json.loads(gzip.decompress(compressed))
    result = build(data, hashlib.sha256(compressed).hexdigest())
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({c["id"]: {"n_surfaces": len(c["surfaces"]), "all_open": c["all_surface_volumes_blocked"]} for c in result["cases"]}))


if __name__ == "__main__":
    main()
