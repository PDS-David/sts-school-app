# TD-VIS-OLE — Embedded AutoCAD object transcription inventory

**Status:** IMPLEMENTED — TESTING DEFERRED. All 17 embedded OLE objects have been located, their paired WMF previews rendered and visually reviewed, and a transcription or explicit unreadable status recorded. Embedded OLE controls were never executed.

## Source and safe inspection

- Source member: `SS1-SRC-af4868d2c026`; SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`.
- All 17 objects have ProgID `AutoCAD.Drawing.15`. Their OLE binaries are under `word/embeddings/`; each has one `v:imagedata` WMF preview under `word/media/`.
- Inspected the previews via LibreOffice 25.2.3.2 rendering and direct preview conversion. No OLE binary was launched, opened in AutoCAD or executed. Original bytes and temporary renders remain outside Git.
- Hashes below are SHA-256 of the original OLE and WMF parts in the registered DOCX member.

## Per-object transcription and provenance

| Object | Source row / XML locator | OLE part (bytes) | OLE SHA-256 | WMF preview (bytes) | WMF SHA-256 | Preview transcription / status |
|---|---|---|---|---|---|---|
| OLE 1 | Week 4 / body child 718 | `oleObject1.bin` (12,800 bytes) | `45e3016f2b32228011cdd9613c118c3792e8354b5061b092da4699f630435b7e` | `image36.wmf` (36,500 bytes) | `51f4c161a02d372de6177971a95935ca509a6eb7cedec181c17cb905169f52f2` | Plain scale RF 1:2.5, maximum 400 mm/minimum 10 mm; 160 mm total, four 40 mm major units, first unit in ten; X=280 mm, Y=130 mm. |
| OLE 2 | Week 4 / body child 729 | `oleObject2.bin` (12,800 bytes) | `dea2dcf59ef49d2410d4650573392d2a44e413c1ba521c1bddda707a28e72b3b` | `image37.wmf` (71,792 bytes) | `dcb5600cbe868389be027ea502559b271ee32d3d1cb80bcf0ddea6193c24aeb8` | 2 cm=1 m, RF 1:50, maximum 6 m in decimetres; 120 mm total, six 20 mm units; example reading 2.4 m/24 dm. |
| OLE 3 | Week 4 / body child 742 | `oleObject3.bin` (12,288 bytes) | `15472ad81a65849e682bdc9ffdb7902e176f8d2213a5863fe6f86bb95d666bc3` | `image38.wmf` (60,228 bytes) | `6614747895550767b8aaf2851ea7b157ea101ba091e55a12d883c5321a72b6ec` | 3 cm=1 dm, maximum 4 dm in centimetres; 120 mm total, four 30 mm units; example reading 22 cm. |
| OLE 4 | Week 4 / body child 758 | `oleObject4.bin` (12,288 bytes) | `bf01a7a2fe926e4b6f19bab31238e22ef15c2ef7f591c04424e5f25cbb04a3bd` | `image39.wmf` (59,856 bytes) | `5303c1555e9c33be841bc614fa91c13ae7adb514f39e4a718f867b1184f8861c` | Enlargement 1.5× full size, maximum 8 cm in millimetres; 120 mm total, eight equal units; first unit in ten. |
| OLE 5 | Week 4 / body child 773 | `oleObject5.bin` (12,288 bytes) | `9cdfc126987cc2e28454bd0f4f2f894b2637ba704702f2f582cad271b8c19af5` | `image40.wmf` (44,004 bytes) | `285d30656f6b92950794c6e22d638b78105cdf6e541cdb17b68d3e5054423ff9` | Reduction 1/3, maximum 4 dm in centimetres; one decimetre interval divided into three equal parts; first unit in ten. |
| OLE 6 | Week 4 / body child 796 | `oleObject6.bin` (13,824 bytes) | `7cc9f49a94afe0e3976c7a5ef5a0acebc9ac6879f68cfaa05285f818f240205c` | `image41.wmf` (47,660 bytes) | `65bce7fac66086b258c501e0812ce7d77814fa6be28796f08280db4ffff595de` | Dimensioned frame/stand-like outline for the 1:5 exercise (20 cm=1 m, read to 6 m in millimetres). Small dimension labels are not reliably legible in preview; exact values unreadable pending native-resolution inspection. |
| OLE 7 | Week 4 / body child 810 | `oleObject7.bin` (18,432 bytes) | `e2a6aa8d2c21aa2e8492cf24102ac511d0683915c08757c96fba377e0314e3d7` | `image42.wmf` (120,872 bytes) | `2619d4b706481a57c0f210acf4019edbdbf9370e6d7756eec60d5677cb699090` | Composite of two scale rulers: upper 0–120 in tens, lower 0–500 in hundreds, with X/Z reading spans and 53/70 offset marks. |
| OLE 8 | Week 4 / body child 827 | `oleObject8.bin` (14,336 bytes) | `59f9b57530b0e9327a4d2d998e02354744cddd7552228ecef438a5631677810d` | `image43.wmf` (51,840 bytes) | `9f3c64c1a20090b5d0141149cfefaffb4613d39632ab366a87930f6d774273fe` | Dimensioned ornamental pedestal/stand; visible overall height 240, base width 180, intermediate dimensions and 10×45° chamfer. Some small labels unreadable in preview; not guessed. |
| OLE 9 | Week 4 / body child 841 | `oleObject9.bin` (16,896 bytes) | `8a23966acc1abc434ee74e7428dfc298c38e2f9d727444d2438641be88f2172d` | `image44.wmf` (43,964 bytes) | `10a083ad382f5e55bc642fbeae1cc6620586afe068d17e21543e40898b926f14` | Ornamental gate elevation; overall length 2100 mm, post width 300 mm; A–E are unknown dimensions to be measured. |
| OLE 10 | Week 5 / body child 866 | `oleObject10.bin` (15,872 bytes) | `f289031178c3b9b20cabc849a1a1ed971fdd4008e4dbd1b6903043c173e55a0d` | `image45.wmf` (108,600 bytes) | `d0fd9b686031c19366518a6e4859a459aee2d354d4321b389da3e4a5bd4133b1` | Diagonal scale to 7 cm in millimetres and tenths; S=4.66 cm=46.6 mm (4 cm+6 mm+0.6 mm). |
| OLE 11 | Week 5 / body child 886 | `oleObject11.bin` (15,360 bytes) | `0700a03e348469583cc94721c101e07a3decb5ec2ba0a9e50daa72eed10d345d` | `image46.wmf` (98,288 bytes) | `002e7f9be5a38217742a62069cb5f1423cfbb114c4d44a3fc826ca3ba7fd2fab` | Diagonal scale at twice full size to 6 cm in millimetres/tenths; X=2.49 cm=24.9 mm. |
| OLE 12 | Week 5 / body child 895 | `oleObject12.bin` (14,336 bytes) | `b3b1a168c825e0d2b1a68729fe78b9d98e061ecb0bca1f75a7787e7848d2739d` | `image47.wmf` (83,720 bytes) | `412a2335cdfe01e5d410232a13597ea05919fecfc37e8daf3075e3b077f96521` | Diagonal scale 3 cm=1 m, maximum 4 m in decimetres/centimetres; S=1.93 m=19.3 dm=193 cm. |
| OLE 13 | Week 5 / body child 908 | `oleObject13.bin` (14,848 bytes) | `3f4bf9ce3ba5c2713cf79716e74710e41bce2d0e28919194b7466fc7fe0be072` | `image48.wmf` (89,860 bytes) | `9d39f0a5baf3d6050accf691002d58bf25162f02f169d18b52ea57d4d7d3348a` | Diagonal reduction scale 1/4, maximum 5 dm in centimetres/millimetres; Z=3.93 dm=39.3 cm=393 mm. |
| OLE 14 | Week 5 / body child 927 | `oleObject14.bin` (14,336 bytes) | `4d7834a63ad704a1b98a239cde1957348a63014c2c2b3fb1648b8116d117acd1` | `image49.wmf` (50,944 bytes) | `f826cda7e02e702657d050f6a0cafea8d53e79180ef0aa4b7b68a3cada6b2754` | Diagonal-scale assessment figure with k and n measurement spans. The exact k/n difference is not transcribed; answer requires a separately checked measurement. |
| OLE 15 | Week 5 / body child 941 | `oleObject15.bin` (19,456 bytes) | `1f0963b17fbe535c92dbf5954a463b7aa26afc462e688f6f3677d3eefb3674fa` | `image50.wmf` (150,500 bytes) | `94b7a15d4de3836cff7a8dec2d99a14f524cf53ffa601039c948a5981570c1bf` | Chordal scale with 5° increments, formed from 18 equal divisions of a quadrant. |
| OLE 16 | Week 5 / body child 964 | `oleObject16.bin` (12,288 bytes) | `0ce7ace02810b4c9f836e4c8ebbe206488667325b79a0c5986a512b5aeae6cb8` | `image51.wmf` (56,420 bytes) | `0ffa14db4c8b9b9e4e425c553c0119185ae12d51afffd8be68d564ff2da75206` | Worked 25° angle using the scale of chords; radius R and chord r transfer, line PS gives angle SPM. |
| OLE 17 | Week 6–7 / body child 1194 | `oleObject17.bin` (9,728 bytes) | `94b0784d1ebb64a6668cc95a2d6ecff7b82b1a08019de9c29a3e698563b81845` | `image63.wmf` (19,308 bytes) | `aff737699c5bbbb3ee5435a5920be3bd11c6459b7549fc4ed26f4f4cbbe276a5` | Triangle ABD with AB=30, BD=60 and AD=70; same visible geometry as Week Three image30.png and Week Eight–Nine image83.jpeg; cross-row derivative reuse tasks are pending. |

## Cross-row duplicate and unresolved readings

- OLE 17 is the same visible 30/60/70 triangle ABD used in Week Three and Week Eight–Nine. Reuse of a single derivative is pending explicit geometry/label validation in `TD-ASSET-W06-W07-F12` and `TD-ASSET-W08-W09-F20`; no separate duplicate is assumed.
- OLE 6 and OLE 8 have small dimension labels that cannot be reliably read from the WMF preview. Their status is **partially unreadable pending native-resolution confirmation**; no missing dimensions are guessed.
- OLE 14's k/n assessment asks for a difference between two readings. The diagram is visible, but the answer is not transcribed here; a separate assessment/answer task must calculate and verify it.
- All other visible scale ratios, ranges, units and worked readings are transcribed above or in the linked Week Four/Five evidence notes.

## Checks and limits

- Confirmed 17 OLE objects, 17 matching WMF previews, and ProgID `AutoCAD.Drawing.15` for every object.
- Recomputed OLE binary and WMF preview SHA-256 values and recorded byte counts.
- Matched all objects to their Week Four, Week Five or Week Six–Seven row and body-child locator.
- Did not execute controls, modify OLE binaries, convert the WMF files into package assets, bind any package assets, run subject schema/tests/compiler/importer, or verify app display.
- No approval, certification or deployment is claimed.
