# Microbiology and Parasitology continuation - 11 November 2026

Continues from [v0.4.2](RESUME-V042.md) with **24 original questions**, 12 in each of the two least-populated subjects. The bank grows from **450 to 474**. Microbiology grows from 36 to 48; Parasitology grows from 40 to 52. All other subject counts are unchanged. All 450 existing question objects are preserved, including IDs, choices, explanations, keys, versions, and citations.

The [new module](../src/content/micro-parasite-continuation.ts) provides four explained choices, one correct key, a takeaway, a checked **1-based PDF viewer page**, and question version 1 for each addition. No publisher question or answer-bank text was imported. [Regression tests](../tests/question-continuation.test.ts) protect the [450-item baseline](../tests/fixtures/bank-v042-hashes.json) and availability in both subject practice pools.

## Source work

Reused the saved indexes to locate relevant sections in the two supplied books, then read the complete relevant pages. Both PDF files were reopened, their page counts checked, and SHA-256 hashes matched against the earlier source inventory. Relevant figures/tables on Ciulla pages 811, 817, 833 and Elsevier pages 70, 204 were also rendered and visually inspected. This was targeted review for the new objectives, not another exhaustive scan of all five books or all earlier PDFs.

| Supplied book                                            | Edition                     | Pages | SHA-256                                                            |
| -------------------------------------------------------- | --------------------------- | ----: | ------------------------------------------------------------------ |
| Elsevier's Medical Laboratory Science Examination Review | First, Graeter et al., 2015 |   407 | `73e73a9de2b7513fc51f8517212d19ad90186915a16b4504afae2d11fcf5a162` |
| SUCCESS! in Clinical Laboratory Science                  | Fourth, Ciulla and Lehman   | 1,161 | `57e7f11bccdeeb5fb69bdf157031d55bdda4b7375162c58718b5b00a59c45c61` |

The separate fifth-edition SUCCESS! PDF remains unavailable. No fifth-edition pagination was inferred. The previous batch's source availability and limitations remain in [its review record](CONTENT-REFRESH-2026-11-11.md). PDFs, extracts, rendered pages, scan tools, and local data are excluded from deployment.

## Objective and page trace

| ID            | New objective                                                       | Source / viewer page          |
| ------------- | ------------------------------------------------------------------- | ----------------------------- |
| micro-c26-001 | Gram iodine forms the crystal violet-iodine mordant complex         | Elsevier 15                   |
| micro-c26-002 | Endospores preserve viability during adverse conditions             | Elsevier 24                   |
| micro-c26-003 | Catalase releases oxygen from hydrogen peroxide                     | Ciulla 682                    |
| micro-c26-004 | Lancefield grouping is based on cell-wall antigens                  | Ciulla 637                    |
| micro-c26-005 | TSI blackening indicates hydrogen sulfide production                | Elsevier 32                   |
| micro-c26-006 | Tryptophanase/tryptophan in the indole reaction                     | Ciulla 683                    |
| micro-c26-007 | Representative deep aspirate and anaerobic transport                | Elsevier 48                   |
| micro-c26-008 | Aspergillus vesicle/phialide/conidial-chain morphology              | Elsevier 70                   |
| micro-c26-009 | Histoplasma mold-phase tuberculate macroconidia                     | Elsevier 78                   |
| micro-c26-010 | Vaccine-associated anti-HBs without anti-HBc                        | Elsevier 204, Table 6-4       |
| micro-c26-011 | IgM anti-HAV supports recent HAV infection in context               | Elsevier 203                  |
| micro-c26-012 | Direct-contact conjugative plasmid transfer                         | Elsevier 18                   |
| para-c26-001  | Routine cyst morphology cannot distinguish E. histolytica/E. dispar | Ciulla 811                    |
| para-c26-002  | Blastocystis vacuolar form and peripheral nuclei                    | Ciulla 812                    |
| para-c26-003  | Dientamoeba binucleate trophozoite/fragmented karyosomes            | Ciulla 815                    |
| para-c26-004  | Large elongated Cystoisospora oocyst                                | Ciulla 817                    |
| para-c26-005  | Round 8-10 micrometer Cyclospora oocyst                             | Ciulla 817                    |
| para-c26-006  | Unfertilized Ascaris egg morphology                                 | Ciulla 833, Figures 8-17/8-18 |
| para-c26-007  | Necator filariform larvae penetrate skin                            | Ciulla 834                    |
| para-c26-008  | Clonorchis metacercariae in freshwater fish                         | Ciulla 827                    |
| para-c26-009  | Armed T. solium scolex versus unarmed T. saginata                   | Elsevier 90                   |
| para-c26-010  | Hydatid sand contains larval scolices/protoscolices                 | Elsevier 91                   |
| para-c26-011  | Anopheles injects Plasmodium sporozoites into humans                | Ciulla 818                    |
| para-c26-012  | Crescent-shaped mature P. falciparum gametocytes                    | Ciulla 818                    |

## Accuracy and duplicate review

All 450 old questions were snapshotted before editing; the current Microbiology and Parasitology stems and takeaways were read before choosing objectives. A second pass reviewed the new keys, distractor explanations, and citations and compared the additions with the whole bank. A weighted word-overlap report compared all new-old pairs and all new-new pairs. This is an editorial aid, not a semantic guarantee. The existing validator rejects normalized duplicate stems, duplicate IDs, and duplicate option text.

Closest related items were checked explicitly:

- Gram iodine tests a specific bacterial stain complex, whereas older alum/hematein questions test histology reagents. Lancefield cell-wall antigen grouping differs from hemolysis appearance and the older PYR/bacitracin presumptive workups.
- TSI blackening tests sulfide production; the existing TSI question tests a red-slant/yellow-butt carbohydrate pattern with no blackening. Catalase chemistry differs from older organism-identification combinations that mention catalase results. Indole/tryptophanase differs from urease and oxidase.
- Anaerobic specimen transport differs from classifying facultative growth and from the old contaminated-sputum assessment. Aspergillus conidial heads and Histoplasma macroconidia are distinct from older Candida, dermatophyte, and other dimorphic fungal features.
- The two viral questions concern different viruses and markers. They do not repeat general IgM/IgG response or antigen-versus-antibody detection questions.
- E. histolytica/E. dispar cyst ambiguity differs from the old ingested-RBC trophozoite clue. Dientamoeba trophozoites differ from eight-nucleate E. coli cysts. Blastocystis central-body morphology is new.
- Cystoisospora and Cyclospora items cover distinct organisms and size/shape combinations; the old coccidia question asks which stain to use. Their shared morphology vocabulary was reviewed directly rather than treated as proof of duplication.
- Ascaris egg fertility morphology differs from Trichuris plugs. Necator's infective skin-penetrating stage differs from the old Strongyloides rhabditiform identification and autoinfection mechanism.
- Clonorchis uses fish as the metacercarial vehicle, whereas the old Fasciola question tests plant-associated metacercariae. T. solium scolex armature provides an adult differentiating feature beyond the old indistinguishable eggs. Hydatid protoscolices differ from identifying definitive/intermediate hosts.
- Mosquito-to-human sporozoites and mature falciparum gametocyte shape test different stages and do not repeat severe-malaria association, vivax/ovale relapse, or knowlesi morphological ambiguity.

Current primary corroboration: [CDC HBV testing](https://www.cdc.gov/hepatitis-b/hcp/diagnosis-testing/index.html), [CDC HAV testing](https://www.cdc.gov/hepatitis-a/hcp/diagnosis-testing/), [CDC amebiasis](https://www.cdc.gov/dpdx/amebiasis/index.html), [CDC Dientamoeba](https://www.cdc.gov/dpdx/dientamoeba/index.html), [CDC stool morphology](https://www.cdc.gov/dpdx/diagnosticProcedures/stool/morphcomp.html), [CDC Cyclospora](https://www.cdc.gov/dpdx/cyclosporiasis/index.html), [CDC Blastocystis](https://www.cdc.gov/dpdx/Blastocystis/index.html), [CDC Ascaris](https://www.cdc.gov/dpdx/ascariasis/index.html), [CDC Taenia](https://www.cdc.gov/dpdx/taeniasis/index.html), and [CDC Echinococcus](https://www.cdc.gov/dpdx/echinococcosis/index.html). The book citations remain the core source trace; corroboration supports current terminology and interpretation.

Excluded outdated or erroneous claims encountered during review: Ciulla's absolute absence of a Dientamoeba cyst stage, its implication that all freshly passed Ascaris eggs are infective, the mislabeled notched Strongyloides rhabditiform tail, Elsevier's obsolete HIV Western-blot confirmation pathway and HSV serology-only diagnosis statement, its conflation of hemolysis with Lancefield grouping, and incorrect direct life-cycle claims for H. diminuta. No treatment or hazardous culture recipes were added. HAV interpretation accounts for vaccination and false positivity; HBV interpretation states the vaccination history and passive-antibody assumption.

This is source-checked teaching content and still needs independent MLS faculty review. The 2,000-per-subject goal and Philippine law coverage remain unfinished.

## Validation and release

- All **14 targeted content tests passed** across content validation, historical preservation fixtures, reference mixing, and the new subject practice pools. The new fixture protects all 450 previous question objects.
- TypeScript, project-wide formatting, 474-item content validation, and the isolated production Webpack build passed. Counts are Chemistry 60, Immunoserology/Blood Banking 60, Urine/Body Fluids 104, Microbiology 48, Parasitology 52, Hematology 100, and the combined histopathology/management/laws subject 50.
- Backend/authentication suites were not rerun for this content-only change; the prior release's 47-test evidence remains historical. No new authenticated browser write-flow check is claimed in this batch.
- Runtime commit **`14ce15bb1628a81cbb17a3562ef090886e8702ab`**, `feat: add 24 microbiology and parasitology questions`, was created and pushed to `origin/main`.
- Deployment **`dpl_9Kf4Etc28xcHq9Mynj6mUvyY16dL`** reached READY and was promoted to [labsprint.vercel.app](https://labsprint.vercel.app). Production target, project ID, runtime commit metadata, and canonical alias were verified. The upload contained 75 explicitly allowed committed application/configuration files.
- Anonymous hosted verification found all **450 previous stems**, **24 new IDs and stems**, and **v0.4.3** across 12 served script assets. Home returned HTTP 200 and the anonymous workspace API HTTP 401. No production account/progress writes or migration were performed.
