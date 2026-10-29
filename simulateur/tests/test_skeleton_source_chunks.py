import importlib.util,tempfile,unittest
from pathlib import Path
s=importlib.util.spec_from_file_location('skeleton_chunks',Path(__file__).resolve().parents[1]/'scripts/build_skeleton_source_chunks.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
class SkeletonChunksTest(unittest.TestCase):
 def test_reject_budget_before_creating_output(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'new'
   for budget in [0,608447,4194305,True]:
    with self.assertRaises(ValueError):m.build(p,budget)
    self.assertFalse(p.exists())
 def test_source_and_metadata_are_not_transformed(self):
  data=m.load('skeleton-source-206');catalogue=m.strip(data)
  self.assertEqual(len(catalogue['meshes']),208)
  for a,b in zip(data['meshes'],catalogue['meshes']):self.assertEqual(b,{k:v for k,v in a.items() if k not in ('positions','indices')})
  self.assertEqual(m.numeric([-0.0,1.123456789],'d').hex(),'0000000000000080369673d3adf9f13f')
if __name__=='__main__':unittest.main()
