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
