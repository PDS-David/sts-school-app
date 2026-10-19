# Prompt E tests and regeneration

Python 3.12 with `pip install -r requirements.txt`.

Regenerate every figure and contract file (deterministic):
```
cd generator
python3 build_assets.py ../assets
python3 build_contract.py <JSS3_NEXT_STAGE_INPUTS dir> <repo checkout at base SHA> <E_MUSIC_CCA/WORKLIST.csv>
```
Run the Python tests from the delivery root: `python3 -m unittest discover -s tests -v`
(notation re-parsed with music21 and compared with independently typed pitch lists; lesson marks, decision anchors,
asset hashes and correction targets; includes negative controls).

Run the importer gate in an integration copy of the repo with dependencies installed (`npm ci --ignore-scripts`):
```
git apply code.patch            # registers the 12 new WG gap ids
# compose SUPPLEMENT_UPSERTS.json into backend/src/db/data/jss3Supplements.json
INTEG=<copy> UPSERTS=<delivery>/SUPPLEMENT_UPSERTS.json node --import tsx tests/validate_composed.mts
node --import tsx --test tests/jss3-supplements.test.mts
```
Running the gate against unpatched master must fail with `Unregistered wider-workstream gap` (negative control for the patch).
`vector_drawing_scan.json` lists, for all 39 source DOCX files, counts of drawing and shape objects.
