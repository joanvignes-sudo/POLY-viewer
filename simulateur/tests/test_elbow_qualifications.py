"""Safety and traceability gates for POLY elbow research pilot."""
import hashlib
import json
import pathlib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
QUAL = ROOT / "data" / "elbow-anatomical-qualifications.json"
AUDIT = ROOT / "data" / "elbow-surface-audit.json"


class ElbowQualificationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.q = json.loads(QUAL.read_text(encoding="utf-8"))
        cls.a = json.loads(AUDIT.read_text(encoding="utf-8"))
        cls.cases = {c["id"]: c for c in cls.q["cases"]}
        cls.audit = {c["id"]: c for c in cls.a["cases"]}

    def test_all_documents_have_audit_and_independently_cited_region(self):
        self.assertEqual(set(self.cases), set(self.audit))
        self.assertEqual(len(self.cases), 4)
        for key, case in self.cases.items():
            with self.subTest(case=key):
                self.assertTrue(case["source_url"].startswith("https://"))
                self.assertFalse(case["registration_validated"])
                self.assertIsNone(case["attachment_location_xyz"])
                self.assertFalse(case["muscle_tendon_continuity_registered"])
                self.assertEqual(set(case["source_surface_ids"]), set(x["source_part_id"] for x in self.audit[key]["surfaces"]))
                self.assertEqual({x["side"] for x in self.audit[key]["surfaces"]}, {"R", "L"})

    def test_mesh_quality_blocks_direct_volume_and_anatomical_inference(self):
        self.assertFalse(self.a["anatomical_registration_validated"])
        self.assertFalse(self.a["dynamic_deformation_validated"])
        for case in self.a["cases"]:
            for row in case["surfaces"]:
                with self.subTest(part=row["source_part_id"]):
                    self.assertGreater(row["boundary_edge_count"], 0)
                    self.assertFalse(row["watertight_candidate"])
                    self.assertIsNone(row["actual_muscle_volume"])
                    self.assertIsNone(row["volume_ratio_biological"])
                    self.assertIsNone(row["validated_enthesis_xyz"])
                    self.assertIsNone(row["validated_dynamic_strain"])
                    self.assertGreater(row["bbox_muscle_to_bone_enclosure_ratio"], 0)

    def test_no_claims_of_anatomical_validation(self):
        rules = self.q["evidence_rules"]
        self.assertEqual(rules["accepted_registration_count"], 0)
        self.assertEqual(rules["validated_true_volume_count"], 0)
        self.assertEqual(rules["validated_dynamic_model_count"], 0)
        contract = self.q["future_attachment_contract"]
        self.assertIn("muscle_landmark_source_xyz", contract)
        self.assertIn("bone_landmark_source_xyz", contract)
        self.assertIn("independent_validation_source", contract)

    def test_source_hash_when_original_is_available(self):
        original = ROOT / "data" / "forearm-motor-reference.json.gz"
        if not original.is_file():
            self.skipTest("Source geometry is not included in this sparse export.")
        self.assertEqual(hashlib.sha256(original.read_bytes()).hexdigest(), self.a["source_gzip_sha256"])


if __name__ == "__main__":
    unittest.main()
