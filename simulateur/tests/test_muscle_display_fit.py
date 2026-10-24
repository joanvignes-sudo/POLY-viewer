"""POLY display-only calibration invariants (not biological validation)."""
import json
import math
import pathlib
import unittest

FILE = pathlib.Path(__file__).resolve().parents[1] / "data" / "muscle-bone-display-calibration.json"


class MuscleBoneDisplayFitTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fit = json.loads(FILE.read_text(encoding="utf-8"))
        cls.groups = cls.fit["groups"]

    def test_expected_sides_and_regions(self):
        regions = ("arm_shoulder", "forearm", "thigh", "leg", "foot", "hand")
        self.assertEqual(set(self.groups), {f"{side}:{region}" for side in "RL" for region in regions})

    def test_source_and_target_are_finite_and_reversible(self):
        for key, record in self.groups.items():
            with self.subTest(key=key):
                scale = record["scale"]
                self.assertGreaterEqual(scale, 0.8)
                self.assertLessEqual(scale, 1.25)
                src, dst = record["source_center"], record["target_center"]
                self.assertEqual(len(src), 3)
                self.assertEqual(len(dst), 3)
                self.assertTrue(all(map(math.isfinite, [scale, *src, *dst])))
                sample = [0.17, 1.52, -0.09]
                forward = [dst[i] + scale * (sample[i] - src[i]) for i in range(3)]
                inverse = [src[i] + (forward[i] - dst[i]) / scale for i in range(3)]
                for a, b in zip(sample, inverse):
                    self.assertAlmostEqual(a, b, places=6)

    def test_proxy_residual_does_not_increase(self):
        for key, record in self.groups.items():
            with self.subTest(key=key):
                self.assertLessEqual(record["rms_center_after"], record["rms_center_before"] + 1e-7)
                self.assertGreaterEqual(record["n_bone_proxies"], 1)
                self.assertEqual(record["anatomical_registration_validated"], False)

    def test_no_unsupported_anatomical_certification(self):
        self.assertIn("Trunk", self.fit["fallback"])
        self.assertIn("No locally varying deformation", " ".join(self.fit["limitations"]))


if __name__ == "__main__":
    unittest.main()
