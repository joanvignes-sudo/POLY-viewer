"""POLY entire-body visual anchoring gates, not anatomic enthesis certification."""
import gzip
import hashlib
import json
import math
from collections import Counter
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
GRAPH=ROOT/"data"/"all-muscle-display-anchors.json"

class WholeBodyAnchoringTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data=json.loads(GRAPH.read_text(encoding="utf-8"))
        cls.records=cls.data["records"]

    def test_coverage_and_uniqueness(self):
        ids=[x["id"] for x in self.records]
        self.assertEqual(len(ids),480)
        self.assertEqual(len(set(ids)),480)
        self.assertEqual(sum(x.startswith("body:") for x in ids),458)
        self.assertEqual(sum(x.startswith("hand:") for x in ids),22)
        self.assertEqual(sum(len(r["anchors"]) for r in self.records),960)

    def test_no_anatomical_fabrication(self):
        self.assertEqual(self.data["documented_insertion_count"],0)
        self.assertEqual(self.data["validated_attachment_count"],0)
        self.assertEqual(self.data["distance_limit_display_units"],.26)
        for part in self.records:
            with self.subTest(part=part["id"]):
                self.assertIsNone(part["anatomical_origin_xyz"])
                self.assertIsNone(part["anatomical_insertion_xyz"])
                self.assertFalse(part["tendon_segments_measured"])
                self.assertFalse(part["anatomical_registration_validated"])

    def test_bounded_visual_tethers_or_explicit_unresolved(self):
        good=0;bad=0
        for part in self.records:
            for a in part["anchors"]:
                self.assertGreaterEqual(a["muscle_vertex_index"],0)
                self.assertEqual(len(a["muscle_display_xyz"]),3)
                self.assertTrue(all(math.isfinite(v) for v in a["muscle_display_xyz"]))
                self.assertTrue(a["rest_distance"] is None or (math.isfinite(a["rest_distance"]) and a["rest_distance"]>=0))
                if a["status"]=="illustrative_bone_surface_proxy_unvalidated":
                    good+=1
                    self.assertTrue(a["candidate_bone_id"].startswith("BONE:"))
                    self.assertIsInstance(a["bone_vertex_index"],int)
                    self.assertGreaterEqual(a["bone_vertex_index"],0)
                    self.assertEqual(len(a["bone_source_xyz"]),3)
                    self.assertLessEqual(a["rest_distance"],.26+0.000002)
                else:
                    bad+=1
                    self.assertEqual(a["status"],"unresolved_no_qualified_bone_target")
                    self.assertIsNone(a["candidate_bone_id"])
                    self.assertIsNone(a["bone_source_xyz"])
        self.assertEqual(good,942)
        self.assertEqual(bad,18)
        self.assertEqual(good+bad,960)
        self.assertEqual(self.data["summary"]["two_visual_bone_proxies"],466)
        self.assertEqual(self.data["summary"]["at_least_one_visual_bone_proxy"],476)

    def test_source_hashes_and_indices_when_sources_available(self):
        src={}
        for p,sha in self.data["provenance"]["input_files"].items():
            f=ROOT/"data"/p
            if not f.exists():self.skipTest("Source atlas omitted in sparse archive")
            self.assertEqual(hashlib.sha256(f.read_bytes()).hexdigest(),sha)
            src[p]=json.loads(gzip.decompress(f.read_bytes()))
        muscles={}
        for part in src["forearm-motor-reference.json.gz"]["parts"]:muscles["body:"+part["id"]]=part
        for part in src["hand-muscles-reference.json.gz"]["parts"]:
            if part.get("kind")=="muscle":muscles["hand:"+part["id"]]=part
        bones={part["bone_id"]:part for part in src["skeleton-source-206.json.gz"]["meshes"]}
        for rec in self.records:
            raw=muscles[rec["id"]]
            n=len(raw["positions"])//3
            for a in rec["anchors"]:
                self.assertLess(a["muscle_vertex_index"],n)
                if not a["candidate_bone_id"]:continue
                bone=bones[a["candidate_bone_id"]]
                k=a["bone_vertex_index"]
                self.assertLess(k,len(bone["positions"])//3)
                for v,u in zip(a["bone_source_xyz"],bone["positions"][3*k:3*k+3]):
                    self.assertAlmostEqual(v,u,places=5)
                self.assertIn(bone.get("side"),(rec["side"],None))

if __name__=="__main__":
    unittest.main()
