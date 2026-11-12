# Second Term Week 05 — Mapping and functions source review

Source member SHA-256: `3f9b36a0d90af06f9eb82bacd4dbc29a7737290566fd1109f51983537844bb36`. Original rendered pages 20–22 were visually inspected.

Findings:
- Page 20 confirms the mapping diagram's codomain is `{a,b,e,f,g}`, not the corrupted extracted list `{e,f,g,h,i}`; its range is `{a,b,f,g}`.
- The printed function definition incorrectly restricts the codomain to numbers. Functions may map between arbitrary sets.
- The one-to-one definition gives the implication in the wrong direction. Correct test: f(x₁)=f(x₂) ⇒ x₁=x₂.
- The example g(x)=2x²−1 with range {1,7,17} reports only positive preimages. Over R, the full domain is {−3,−2,−1,1,2,3}, unless positive x is specified.
- The page 21 diagram states f(x)=2x+3 on {-2,1,3}, but maps 3 to 4; the correct image is 9.
- The general evaluation item `g(x)=2p−q` lacks x and cannot be solved as printed; the replacement does not guess the missing expression.

Replacement `SUP-SS1-FURTHER-MATHEMATICS-T2-W05-MAPPING-FUNCTIONS`: 4 objectives; 10 practice questions; 26 marks. Coverage COV-FM-T2-W05-OBJ-1..3 added; row COV-FM-T2-R04 linked. Approval PENDING; verification DEFERRED.
