# CHEM-FACT-T3-ACCURACY-EQUATIONS — Chemistry Third Term equation findings

Status: **IMPLEMENTED_TESTING_DEFERRED** (findings only; no source equation is balanced or corrected).

## Source
- Member `SSS 1/3rd Term SS1_/3RD TERM S1 CHEMISTRY.doc`; SHA-256 `0b8f96389c722ed7bfeed046e4478771b98613cb1bfdf004226b7794922ea435`.
- Whole-body SHA-256 `2b83b851ea8de54b62fb49a9396bc0f23c3b8b95941a1f8ea1ea65515fde886f`.

## Findings register
| Line(s) | Source equation / issue | Finding |
|---|---|---|
| 345-358 | Neutralisation set includes `H3OCl`, `(H3O)2SO4` and oxonium/hydroxide equation | Formulae are suspect; verify correct acid/base products and charges against the exact source context. Do not silently replace. |
| 412-414 | Hydrolysis equations for Na₂CO₃, AlCl₃ and Na₂S | As written in the inventory, equations do not conserve atoms/charge in their current form. Preserve exact strings and require a separately reviewed balanced equation. |
| 796 | Limewater product `Ca(HCO3)(aq)` | Formula/stoichiometry appears incomplete; standard limewater test initially forms insoluble CaCO₃. Preserve source form. |
| 845-849 | Formate decomposition fragment `2HCOONa(aq) + H2(g) 4000C COONa` | Missing arrow/reactants/products and flattened temperature. Cannot be reconstructed safely from fragment alone. |
| 1030 | Silver-carbonate decomposition | Requires atom and charge balance against the exact original equation. |
| 1055 | Sodium hydrogen carbonate/sulfuric acid equation | Requires atom/charge balance; preserve source wording until reviewed. |
| 1157-1158 | Cracking equations | Check carbon/hydrogen atom counts and product formulas; no balancing is done here. |
| 1224 | Pyrolysis fragment `C10H22 H2 + C C5H12 + CH3-CH=CH-CH3` | Operators and products are incomplete/garbled. Do not infer missing terms. |

## Disposition
This record identifies the source equation defects and line locators only. The source equations remain unchanged. Any replacement must be a separate teaching correction with atom balance, state conditions where relevant and authoritative evidence. Nothing is approved or verified.
