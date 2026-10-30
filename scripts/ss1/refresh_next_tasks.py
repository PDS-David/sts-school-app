#!/usr/bin/env python3
"""Refresh bounded SS1 worker prompts from current queues; no curriculum/status changes.
Run from any directory: python3 scripts/ss1/refresh_next_tasks.py
This is documentation generation, not a test or curriculum certification.
"""
from pathlib import Path
from collections import Counter
import json, subprocess
ROOT=Path(__file__).resolve().parents[2]
BASE=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
DONE={'IMPLEMENTED_TESTING_DEFERRED'}
entries=[];totals=Counter();outputs={}
for path in sorted((ROOT/'docs/ss1/work/microtasks').glob('*/QUEUE.json')):
    data=json.loads(path.read_text());items=data['items'];byid={i['id']:i for i in items}
    if len(byid)!=len(items):raise ValueError(f'{path}: duplicate task IDs')
    for item in items:
        missing=set(item.get('depends_on',[]))-byid.keys()
        if missing:raise ValueError(f"{item['id']}: missing dependencies {sorted(missing)}")
    totals.update(i['status'] for i in items)
    ready=[i for i in items if i['status']=='PENDING' and i['kind']!='TEST' and all(byid[d]['status'] in DONE for d in i.get('depends_on',[]))]
    slug=path.parent.name
    if not ready:
        outputs[path.parent/'NEXT_TASK.md']=f'# {slug}\n\nNo dependency-ready non-test task is recorded at {BASE}. Do not invent one or treat this as subject completion. Review BLOCKED and deferred TEST entries with their exact input gates.\n'
        continue
    item=ready[0];tid=item['id'];files=list(dict.fromkeys([str(path.relative_to(ROOT)),'docs/ss1/contracts/CONTRACT.md','backend/src/db/ss1/subjectPackageSchema.ts','backend/src/db/ss1/compiler.ts']+item.get('required_files',[])))
    for f in files:
        if not (ROOT/f).is_file():raise ValueError(f'{tid}: missing required repository file {f}')
    writes=list(dict.fromkeys(item['allowed_write_paths']+[f'docs/ss1/work/microtasks/{slug}/{tid}.md']))
    for f in writes:
        if not (f.startswith(f'docs/ss1/work/microtasks/{slug}/') or f==f'backend/src/db/ss1/subjects/{slug}.json' or f.startswith(f'backend/src/db/ss1/assets/{slug}/')):raise ValueError(f'{tid}: shared write scope requires explicit review: {f}')
    text=f'''# {tid} {data['subject']}

Execute ONE task: {tid}. Repository PDS-David/sts-school-app. Reviewed base {BASE}.
Fetch latest master, read applicable AGENTS.md and inspect open PRs. Use an isolated branch. Re-read this queue item and dependency evidence. If already implemented, report its exact evidence and stop; do not repeat it or choose another task without assignment. If another PR owns this subject package/queue, do not overwrite it. This task is not completion of the whole subject.

## Read these repository files
'''+''.join('- '+f+'\n' for f in files)+f'''
## Boundary
Kind: {item['kind']}
Term: {item.get('term','not specified')}
Locator: {item.get('week_or_locator','see item')}
Prerequisites: {', '.join(item.get('depends_on',[])) or 'none'}.

{item['objective']}

## Exact source inputs
'''
    attachments=item.get('required_attachments',[])
    for a in attachments:
        text+=f"- Standalone file: `{Path(a['member']).name}`\n  Archive member: `{a['member']}`\n  Member SHA-256: `{a['member_sha256']}`\n"
    if attachments:
        text+='Accept matching bytes from a standalone file or any supplied container. The full ZIP is optional. If Library is available, find SSS 1-20260507T072431Z-3-001 (1).zip there before requesting another upload. Hash the original before conversion. Keep the manifest archive_member unchanged. Do not claim verification of the outer archive unless actually checked. If unavailable, state only the exact missing member; never infer content/headings from its name.\n'
    else:text+='No attachment is named for this task. Use committed evidence in the listed files. Do not invent absent source facts.\n'
    text+='\n## Permitted writes\n'+''.join('- '+f+'\n' for f in writes)+'''
Do not change other subjects, JSS3, UI, shared schemas/compiler, database or production. All subject packages exist: historical claims that a package or all coverage is absent are obsolete. Preserve current content and stable IDs. Historical locators are leads; reproduce or explain method differences without silently rewriting evidence.

## Completion condition
'''+item['completion_condition']+'''

## Implementation rules
For inventory: inspect only the assigned source; list sections/weeks, substantive revision material and visual groups; append small follow-ups with exact locators and dependencies. Do not author the entire subject or implement rules that the task only requests as findings.
For indexing: implement objective-level coverage/classification under the existing schema within this boundary. Check every assigned objective and exercise. Record precise remaining gaps and small follow-up tasks; do not fabricate missing text or teacher answers. A marker cannot erase teaching.
For an assigned lesson: deliver actual explanations, worked examples, original answered practice, marks that add up, provenance and exact UTF-8 body hash. Label equivalents honestly. Never infer reuse permission from a citation alone. For other task kinds, follow the exact objective and condition above; do not turn them into an unrequested broad audit.
Keep content approval PENDING unless actual approval evidence exists, and verification DEFERRED. Basic JSON parsing, unique-ID/reference inspection, file/body hashing, marking arithmetic and diff review are permitted authoring checks. Testing remains deferred: do not run typechecks, suites, importer, database or device validation. Do not label authoring checks as tests.

## Finish and publish
Mark this item IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met; otherwise record the precise blocker. Preserve all unrelated queue items. Recompute counts and status_counts from items. Write the allowed task evidence note with input hashes, reproducible locators, exact changes and remaining gaps. Keep original documents, full extracts, private renders and secrets out of Git.
Commit and push the isolated branch, then open one PR to master. Do not merge other agents' PRs. If write access fails, finish the local work and provide a binary-capable patch, base/commit SHA and changed-path list; never request a pasted token. Report publication accurately. Stop after this item; name the next eligible item without executing it. Do not update shared assignment indexes; the coordinator regenerates them after merges.
'''
    outputs[path.parent/'NEXT_TASK.md']=text
    entries.append((slug,tid,'; '.join(Path(a['member']).name for a in attachments) or 'Repository only'))
index=f'''# Current SS1 next assignments

Source base: {BASE}. Generated from current queue items by scripts/ss1/refresh_next_tasks.py. This is an implementation queue, not certification. Testing remains deferred.

Queue totals: {json.dumps(dict(totals),sort_keys=True)}.

Run only one worker per subject. Different subjects may run concurrently because their package/queue scopes differ. Each linked prompt contains the exact inputs, prerequisites, scope and completion condition. Do not interpret the existence of a source package, a finished inventory or a merged prompt as completed curriculum.

| Subject | One assigned task | Standalone file to attach | Prompt |
|---|---|---|---|
'''
for slug,tid,attachment in entries:index+=f'| {slug} | {tid} | {attachment} | [Open](microtasks/{slug}/NEXT_TASK.md) |\n'
index+='\nAfter merges, regenerate this file. The generator validates IDs/dependencies and required repository paths before writing; it does not inspect original documents, run tests, approve content or change queue status. New inventory tasks can increase the pending count without undoing completed work. No full-source or release task is authorised here.\n'
outputs[ROOT/'docs/ss1/work/NEXT_ASSIGNMENTS_20261030.md']=index
for path,text in outputs.items():path.write_text(text)
print(json.dumps({'base':BASE,'queue_totals':dict(totals),'assignments':entries,'documents_written':len(outputs)},indent=2))
