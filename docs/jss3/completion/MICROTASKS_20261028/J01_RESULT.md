# J01 completed — 29 October 2026

**Outcome: INSPECTED / NO ELIGIBLE ỌYA PÍPÈ PASSAGE.** This supersedes the earlier INACCESSIBLE result below. Do not ask for this PDF or repeat this lead. YO-SL-094 remains partial; this finding does not establish that no suitable passage exists elsewhere.

The exact Zenodo PDF was downloaded with curl, 700,955 bytes, 47 pages. Computed MD5 `81dce7307beb2b40ddb57c04b3c31c18` matches the record. SHA-256: `d7e1e777868f1adc34ed89225e1f5986a82c99021cd3598ed477d89e5e290f64`.

URL: https://zenodo.org/records/12574511/files/OYA%20RELIGIOUS%20GROUP%20IN%20OYO.pdf?download=1

All extracted page text was inspected. Pages 8 and 9 were also rendered and read visually. The PDF is an English religious-group questionnaire. Page 1 identifies Olusegun Oladosu, Database of Religious History, publication 6 March 2024, and CC BY 4.0; Zenodo's later deposit date is a separate date. Pages 7–9 describe oral sources and transmission, without presenting a chant. Page 9 does print a short Yoruba saying with an English gloss about Ṣàngó/Koso and Ọya/Ira; it is not labelled Ọya pípè. It must not be misrepresented as the missing chant. Pages 10–46 contain further questionnaire responses; page 47 is bibliography. Page 2 links to an external primary-corpus lead; that site's text and rights were not investigated here, and the PDF's licence cannot be assumed to cover it.

Reproduce: download the exact URL, verify both hashes, run `pdfinfo` and `pdftotext -layout`, review PDF pages (not extracted line numbers); render pages 8–9 with `pdftoppm`. Only receipt metadata and findings are committed; no paper or full extraction is placed in Git. No curriculum content, test expectations, holds, database or production state changed. No certification claimed.

---

## Historical 28 October attempt (retained)

# J01 result — YT-R1-01 (Oladosu 2024, Zenodo 12574511)

**Outcome: INACCESSIBLE.** The PDF bytes could not be obtained, so nothing was inspected. This is not a finding that no Ọya passage exists, and it does not unblock the text-study implementation. YO-SL-094 stays open.

Base: master `7ce2a68283e771f454119370130e33e852626201`. No `AGENTS.md` found. No tests, typechecks, importer, DB, device or production operations were run (deferred by the task). The only check run was that the edited register still parses as JSON.

## Record facts (read from the Zenodo record page, 28 Oct 2026)

| Item | Value |
|---|---|
| Record | https://zenodo.org/records/12574511 |
| Title | OYA RELIGIOUS GROUP IN OYO |
| Author / editor | Olusegun Oladosu (Obafemi Awolowo University, Ile-Ife); editor Adegbola Tolu Adefi |
| Version | v1, published 27 June 2024 (record modified 27 June 2024) |
| DOI | 10.5281/zenodo.12574511 |
| Published in | The Database of Religious History, 2024 |
| Licence | Creative Commons Attribution 4.0 International (as stated on the record) |
| File | `OYA RELIGIOUS GROUP IN OYO.pdf`, 701.0 kB |
| md5 (published by Zenodo, not computed here) | `81dce7307beb2b40ddb57c04b3c31c18` |
| SHA-256 | **none: file not obtained** |

The record description and reference list are English prose on Ọya's role, myth and worship. The only Yoruba terms are names and the festival name Ìṣẹ̀ṣe. Its reference list cites secondary literature, not a chant collection. This is page text only and cannot settle what the PDF prints.

## Retrieval attempts

| Attempt | Result |
|---|---|
| Fetch tool, `.../files/OYA%20RELIGIOUS%20GROUP%20IN%20OYO.pdf?download=1`, PDF text extraction on | Returned binary only, no text |
| Same URL without `?download=1` | Redirected to the `?download=1` URL; binary only |
| `.../preview/OYA%20RELIGIOUS%20GROUP%20IN%20OYO.pdf?include_deleted=0` | Refused: site disallows automated access |
| Shell `curl` to zenodo.org | DNS failure (host not in the shell's allowed domains) |

## Required input (one item only)

The PDF downloaded from Zenodo record 12574511 (file name above). Once supplied, the next worker should record its SHA-256, check it against the md5 above, inspect every page for a Yoruba Ọya passage, and give page locators and whether usable Yoruba text, a translation and reuse authority are actually present. Quote nothing beyond what is needed to identify a passage, and do not store the paper in Git.

## Repository change

`YO_TEXT/SOURCE_RIGHTS_REGISTER.json`: a `j01_check` field added to YT-R1-01 only. Its verdict remains `NOT_EXAMINED`. No lesson, attribution, runtime, schema or other register row changed. No certification, approval or closure is claimed.
