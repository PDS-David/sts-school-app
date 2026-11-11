# PHYS-PORT-D1-RULE-SPLIT — disposition

Status: `IMPLEMENTED_TESTING_DEFERRED`. No parser, compiler, importer, database or device test was run.

## Evidence

- Source: `SS1-SRC-5c0149cda71d`, First Term member SHA-256 `cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206`.
- Combined parsed row: `SS1-SRC-5c0149cda71d:BODY:593683bb0b6b62e3db27e3d4609dcedcfd20ced66ac79fb065477d8f4929a29d`, label `WEEK FIVE AND SIX`.
- Earlier PR #71 proposed an unsupported `split_before_anchor` operation at `GRAPHS\nThe motion of an object is best represented`.
- The current contract has a supported `split_before` operation that can insert a numeric Week 6 marker before a line-start anchor. Therefore, the old operation is not needed as a new schema feature.

## Decision and identity impact

I did **not** port the split rule. A split would change the single content-bound body identity into two different parsed-body hashes. Existing coverage points at the combined source row, and a split would require new reviewed coverage targets and a new identity map; it could also affect exact source-row compatibility with stored imports. The old anchor's uniqueness has not been independently rechecked against the original member during this run, so no uniqueness claim is made.

The current authored supplement `SUP-SS1-PHYSICS-T1-W05-W06-MOTION-GRAPHS` already teaches the Week 5 motion and Week 6 velocity-time graph objectives. A parser split is not necessary to teach either objective.

The identity limitation is recorded as package open item `PHYSICS-T1-W05-W06-SPLIT-IDENTITY`. The existing combined row and stable IDs remain unchanged.

## Validation boundary

Static inspection of the contract, schema, package references and prior branch evidence only. Testing and importer execution remain deferred by owner instruction.
