"""Prevent register regeneration from reopening completed recovery or hiding guard drift."""
import csv, json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class Register(unittest.TestCase):
 def command(self,out,extra=None):
  c=[sys.executable,str(ROOT/'scripts/jss3/v2/build_visual_register.py'),'--guards',str(ROOT/'curriculum-assets/jss3/v2-math/V2_MATH_ROW_GUARDS.csv'),'--extra-guards',str(ROOT/'curriculum-assets/jss3/m1-equations/M1_ROW_GUARDS.csv'),'--extra-guards',str(ROOT/'curriculum-assets/jss3/m2-simultaneous/M2_ROW_GUARDS.csv'),'--manifests',str(ROOT/'curriculum-assets/jss3/v2-math'),'--out',str(out)]
  if extra:c+=['--extra-guards',str(extra)]
  return c
 def test_regeneration_preserves_completed_recovery_and_interim_decisions(self):
  with tempfile.TemporaryDirectory() as d:
   out=Path(d)/'register.csv';subprocess.run(self.command(out),check=True,capture_output=True)
   self.assertEqual(out.read_bytes(),(ROOT/'docs/jss3/completion/V2_MATH/VISUAL_REGISTER.csv').read_bytes())
   with out.open() as f:rows={r['occurrence_id']:r for r in csv.DictReader(f)}
   self.assertIn('M1-EQ-A',rows['M1-O04']['asset_key']);self.assertIn('M1-EQ-B',rows['M1-O04']['asset_key'])
   self.assertIn('RECOVERED_ASSET',rows['M1-O04']['disposition'])
   self.assertEqual(rows['M1-E01']['open_item'],'')
   self.assertIn('SUP-MATH-BINARY',rows['M1-E03']['disposition'])
   self.assertIn('current importer already recovers',rows['M2-O02']['evidence_and_notes'])
   for key in ['M1-F07','M2-F06','M2-F08']:self.assertIn('not teacher-certified',rows[key]['open_item'])
 def test_conflicting_guard_fails_before_output(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'bad.csv';out=Path(d)/'out.csv'
   with (ROOT/'curriculum-assets/jss3/m1-equations/M1_ROW_GUARDS.csv').open() as f:
    reader=csv.DictReader(f);fields=reader.fieldnames;rows=list(reader)
   rows[0]['source_body_sha256']='0'*64
   with p.open('w',newline='') as f:w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(rows)
   r=subprocess.run(self.command(out,p),capture_output=True,text=True)
   self.assertNotEqual(r.returncode,0);self.assertIn('Conflicting row guards',r.stderr);self.assertFalse(out.exists())
 def test_reviewed_nonfigure_metadata_is_not_silently_dropped(self):
  rows=json.loads((ROOT/'scripts/jss3/v2/v2_math_reviewed_occurrences.json').read_text())
  self.assertEqual(len(rows),12);self.assertEqual(len({r['occurrence_id'] for r in rows}),12)
  self.assertTrue(next(r for r in rows if r['occurrence_id']=='M1-O04')['asset_sha256'])
if __name__=='__main__':unittest.main()
