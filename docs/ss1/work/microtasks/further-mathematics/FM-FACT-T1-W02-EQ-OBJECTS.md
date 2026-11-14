# FM-FACT-T1-W02-EQ-OBJECTS — Source-render inspection completed

Status: **IMPLEMENTED_TESTING_DEFERRED**. The exact source-rendered contents are now recorded. This is not an MTEF byte decode and does not claim an ObjectPool/ObjLocation anchor-to-stream mapping.

## Exact archive and member identity

- User-supplied archive: `SSS 1-20260507T072431Z-3-001 (1).zip`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member: `SSS 1/1st Term SS1_/1ST TERM S1 FURTHER MATHEMATICS.doc`
- Member SHA-256: `995cba8c37479850ffa65824ad90df34c3294c970f091c8a576d7831a7839145`

Both hashes match the queue's required attachment/member identities.

## Inspection method and findings

The exact legacy `.doc` member was converted locally with LibreOffice to PDF and the rendered original pages 6–7 were visually inspected. On page 7 the two previously missing embedded conclusions are visible:

1. After the factorisation gives (p=5) or (p=-25), the source shows `5^x = -25` followed by `x = log_5(-25)`.
2. After the substitution gives (a=3) or (a=-3), the source shows `3^x = -3` followed by `x = log_3(-3)`.

These are the exact visible contents of the missing conclusions. A negative real logarithm argument is undefined, so neither negative branch produces a real solution. The source's displayed logarithm notation therefore records the rejected branches but does not explicitly state the real-domain reason. The replacement lesson's plain-language rejection is justified.

## Limits of this evidence

- This is a visual reading of the rendered original archive member, not a decode of the 41-byte MTEF streams.
- The original OLE ObjectPool/ObjLocation FSPA table has not been decoded; the three text-anchor positions have not been mapped to individual pool entries.
- No claim is made about byte-level identity between each displayed equation and a particular Equation Native stream.

## Delivery impact

- The source-object display question is answered and the rendering method is reproducible.
- Original source row remains unchanged.
- `OI-FM-T1-W02-NOTATION-LOSS` remains OPEN because the wider superscript/subscript extraction problem is not fixed by this local inspection.
- `OI-FM-T1-W02-FACT-DEFECTS` remains OPEN because the source's reasoning and other defects still require correction/review.
- Content approval remains PENDING; verification remains DEFERRED.
