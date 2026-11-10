# Returned reviewer batch - 11 November 2026

This batch adds **42 original questions**, six per subject, increasing **408 to 450**. All 408 released question objects are preserved, including IDs, options, keys, explanations, versions, and citations. The additions are in [the returned-reviewer module](../src/content/returned-reviewer-questions.ts). A [408-item hash fixture](../tests/fixtures/bank-v041-hashes.json) and [integration checks](../tests/returned-reviewers.test.ts) protect preservation and practice availability.

## Source review scope

All five newly supplied files were opened and identified. Text was indexed across every page with a text layer to locate relevant sections; complete relevant pages were read for this batch. Jarreau has no text layer: the title/edition pages, contents, and relevant source pages were rendered and visually read. Alba's cited histology pages were also visually checked against the OCR and the answer column. This was a **targeted review for 42 objectives**, not an exhaustive page-by-page review of every book or every publisher question. The earlier Harr/Apollon/Hubbard/Rodak/Strasinger batch remains as recorded in [the November 10 review](CONTENT-REFRESH-2026-11-10.md); those books were not all re-reviewed in this batch.

| Supplied book                                                                                   | PDF pages | Newly cited viewer pages                                     |
| ----------------------------------------------------------------------------------------------- | --------: | ------------------------------------------------------------ |
| Linné & Ringsrud, Clinical Laboratory Science, seventh edition (2016)                           |       685 | 316, 343, 405, 429, 437, 448, 470                            |
| Elsevier's Medical Laboratory Science Examination Review, first edition (2015)                  |       407 | 16, 17, 18, 39, 79, 90, 91, 92, 107, 214, 216, 219, 283, 351 |
| SUCCESS! in Clinical Laboratory Science, fourth edition, Ciulla and Lehman                      |     1,161 | 55, 59, 61, 67, 76, 414, 824, 828, 954                       |
| Clinical Laboratory Science Review: A Bottom Line Approach, fifth edition, Patsy Jarreau (2015) |       284 | 71, 72, 132                                                  |
| Alba's Medical Technology Board Examination Review, Volume 2 (1973)                             |       582 | 467, 469, 491, 494                                           |

Pages are **1-based PDF viewer pages**, not printed numbers. The Ciulla file is fourth edition and includes Donald Lehman as coauthor; a separate fifth-edition SUCCESS! file previously mentioned remains unavailable and is not interchangeable for pagination. Alba's historical material is used only for stable histology principles, with modern corroboration. No historical treatment recommendations, reagent recipes, outdated donor criteria, or Philippine legal claims were added. PDFs, extracts, rendered pages, and scan tooling stay local and are excluded from deployment.

## Inventory

| Subject                                              |  Before |  Added | Available |
| ---------------------------------------------------- | ------: | -----: | --------: |
| Clinical Chemistry                                   |      54 |      6 |        60 |
| Immunoserology and Blood Banking                     |      54 |      6 |        60 |
| Urine and Body Fluids                                |      98 |      6 |       104 |
| Microbiology                                         |      30 |      6 |        36 |
| Parasitology                                         |      34 |      6 |        40 |
| Hematology                                           |      94 |      6 |       100 |
| Histopathology, Laboratory Management & Medtech Laws |      44 |      6 |        50 |
| **Total**                                            | **408** | **42** |   **450** |

All six additions in the combined histopathology/management/laws subject are **histopathology**. Four catalog topics were added: Lipids and lipoproteins, Liver function, Renal physiology, and Microbial molecular testing. The 2,000-per-subject goal remains unfinished. Independent MLS faculty review is still needed.

## Objective and page trace

| ID          | New objective                                                             | Book / viewer page                           |
| ----------- | ------------------------------------------------------------------------- | -------------------------------------------- |
| cc-r26-001  | Dietary triglyceride transport in chylomicrons versus hepatic VLDL        | Ciulla 55                                    |
| cc-r26-002  | GGT supports a hepatobiliary contribution to elevated ALP                 | Ciulla 67                                    |
| cc-r26-003  | Calculate LDL with supplied Friedewald formula and valid assumptions      | Ciulla 59                                    |
| cc-r26-004  | Caffeine-benzoate permits unconjugated bilirubin diazo reaction           | Jarreau 132                                  |
| cc-r26-005  | Calculate a nonspecific measured-minus-calculated osmolal gap             | Ciulla 76                                    |
| cc-r26-006  | Uncompetitive inhibitor binds the enzyme-substrate complex                | Ciulla 61                                    |
| ibb-r26-001 | Failed check cells invalidate a negative tube AHG result                  | Elsevier 351                                 |
| ibb-r26-002 | DTT destruction prevents anti-K exclusion with treated cells alone        | Elsevier 351                                 |
| ibb-r26-003 | Lewis antigen adsorption from plasma                                      | Elsevier 219                                 |
| ibb-r26-004 | Se activity produces H substance in secretions                            | Elsevier 214                                 |
| ibb-r26-005 | Expected absence of anti-A/anti-B in ordinary group AB plasma             | Elsevier 216                                 |
| ibb-r26-006 | Biphasic IgG anti-P in paroxysmal cold hemoglobinuria                     | Elsevier 351; supporting discussion 219-220  |
| ubf-r26-001 | Cholesterol-ester birefringence in oval fat bodies with artifact caveat   | Linné 437                                    |
| ubf-r26-002 | Alkaline coffin-lid struvite crystals                                     | Linné 448                                    |
| ubf-r26-003 | Urobilinogen oxidation during storage                                     | Linné 429                                    |
| ubf-r26-004 | Xanthochromia describes yellow CSF supernatant without assigning etiology | Linné 470                                    |
| ubf-r26-005 | Sudan III demonstrates fecal fat                                          | Ciulla 954                                   |
| ubf-r26-006 | Thick ascending limb transports salt with very low water permeability     | Linné 405, corroboration below               |
| mic-r26-001 | H. influenzae X/hemin and V/NAD requirements                              | Elsevier 39, corroboration below             |
| mic-r26-002 | Aerobic branching partially acid-fast Nocardia clue                       | Elsevier 79; comparison 78                   |
| mic-r26-003 | MacConkey lactose fermentation color is not a species identification      | Elsevier 16                                  |
| mic-r26-004 | Failed required internal PCR control invalidates a target-negative result | Elsevier 283                                 |
| mic-r26-005 | Facultative anaerobic growth in air and without oxygen                    | Elsevier 18                                  |
| mic-r26-006 | Colistin/nalidixic acid provide CNA selectivity                           | Elsevier 17                                  |
| par-r26-001 | Taenia eggs cannot distinguish T. solium from T. saginata                 | Elsevier 90                                  |
| par-r26-002 | Dipylidium egg packets                                                    | Elsevier 91                                  |
| par-r26-003 | Fasciola metacercariae on aquatic vegetation infect humans                | Ciulla 828                                   |
| par-r26-004 | Leishmania tissue amastigotes                                             | Ciulla 824; morphology corroboration below   |
| par-r26-005 | Babesia intraerythrocytic tetrads                                         | Elsevier 92                                  |
| par-r26-006 | Toxoplasma bradyzoites in tissue cysts                                    | Elsevier 90                                  |
| hem-r26-001 | 2,3-BPG right shift reduces oxygen affinity                               | Elsevier 107                                 |
| hem-r26-002 | Ferric iron in methemoglobin                                              | Linné 316                                    |
| hem-r26-003 | Hemoglobin H is beta4, distinct from gamma4 Bart                          | Jarreau 72                                   |
| hem-r26-004 | Alkaline HbS/D/G co-migration limits identification                       | Jarreau 71                                   |
| hem-r26-005 | Howell-Jolly bodies are DNA remnants, distinct from iron inclusions       | Linné 343                                    |
| hem-r26-006 | Antithrombin is enhanced by unfractionated heparin                        | Ciulla 414                                   |
| hml-r26-001 | Decalcification removes mineral before routine sectioning                 | Alba 469                                     |
| hml-r26-002 | Frozen preparation preserves lipid lost during solvent processing         | Alba 467; supporting 469                     |
| hml-r26-003 | Oxidation of hematoxylin produces hematein                                | Alba 491                                     |
| hml-r26-004 | Aluminum acts as a mordant in alum hematoxylin                            | Alba 491                                     |
| hml-r26-005 | Regressive staining intentionally overstains then differentiates          | Alba 491                                     |
| hml-r26-006 | Acidic eosin binds positively charged protein groups                      | Alba 494; eosin-specific corroboration below |

## Second pass: accuracy and nonduplication

Before authoring, all 408 stems and takeaways were inventoried. After authoring, each new objective, keyed response, distractor explanation, and citation was reviewed again against the relevant page and the old inventory. A weighted word-overlap report compared each new question with all old questions and all other additions; it is an editorial aid, not a semantic guarantee. Exact normalized stems are rejected by the existing validator. No exact duplicates or repeated answer objectives were accepted.

Related concepts were retained only for distinct decisions: check-cell validation differs from the old inadequate-washing mechanism; DTT/Kell differs from enzyme/Duffy destruction; the osmolal gap differs from freezing-point depression; the uncompetitive binding target differs from overcoming competitive inhibition; struvite differs from the older oxalate/cystine/cholesterol crystals; storage oxidation of urobilinogen differs from bacterial glucose consumption; Taenia species-identification limits differ from the old egg-ingestion cysticercosis risk; Howell-Jolly DNA differs from Pappenheimer iron; HbH chain composition and electrophoretic ambiguity differ from the old HbS amino-acid substitution. MacConkey's differential color and CNA's antimicrobial selection test different medium functions. Hematein formation, mordant binding, and regressive differentiation test separate steps despite sharing a page. None of the six new histology objectives repeats the older fixation-purpose or dehydration-purpose questions.

Cross-checks used primary sources: [CDC Taeniasis](https://www.cdc.gov/dpdx/taeniasis/), [CDC stool morphology](https://www.cdc.gov/dpdx/diagnosticprocedures/stool/morphcomp.html), [CDC Fascioliasis](https://www.cdc.gov/dpdx/fascioliasis/), [CDC Leishmaniasis](https://www.cdc.gov/dpdx/leishmaniasis/), [CDC Toxoplasmosis](https://www.cdc.gov/dpdx/toxoplasmosis/), [renal concentration physiology review](https://pmc.ncbi.nlm.nih.gov/articles/PMC2709207/), [manufacturer growth-medium submission hosted by FDA](https://www.accessdata.fda.gov/CDRH510K/K933121.pdf), [Leica H&E overview](https://www.leicabiosystems.com/knowledge-pathway/he-staining-overview-a-guide-to-best-practices/), and [Leica H&E teaching material](https://www.leicabiosystems.com/educational-resources/webinars/how-to-create-a-high-quality-he-staining-protocol/). These supplement the book citations; they do not establish independent faculty approval.

The second pass excluded identifiable source errors: Elsevier 91 incorrectly describes Fasciola eggs as infective to humans (the question instead cites correct Ciulla 828); Jarreau 132 reverses the chloroform/aqueous layers in an unrelated Watson-Schwartz note; Linné 405 contains unrelated glucose-unit, aldosterone-source, and tubular-tonicity errors; Elsevier 283 contains unrelated polymerase-direction and dye-fluorescence errors. Only the corroborated principles were used. Alba's older hazardous reagent recipes and historical procedural claims were excluded.

## Verification and publication

- All **47 tests passed**, including the 408-item preservation fixture and full-bank practice selection. The two targeted content integration checks were run again after tightening the PCH citation to the complete explanation on Elsevier page 351; both passed.
- TypeScript, project-wide formatting, 450-item structural content validation, and the isolated production Webpack build passed. The final build includes the citation correction.
- The local production app, using a disposable local account/database, displayed 450 questions, found `cc-r26-004`, accepted its correct choice, and displayed all four explanations, the takeaway, and Jarreau fifth-edition PDF viewer page 132. This is a representative flow check, not visual inspection of every question.
- The local workspace API confirmed a correct `cc-r26-004` attempt at question version 1. A 390-pixel viewport had no horizontal document overflow; the viewport was reset afterward.
- Runtime commit **`6ec56ee7d995d42e7be9c30dde00ba597acb0813`**, `feat: add 42 questions from returned reviewer books`, was pushed to `origin/main`.
- Production deployment **`dpl_BsDUYV4YU5iqySkALZfqjXMrAB1F`** reached READY and was promoted to [labsprint.vercel.app](https://labsprint.vercel.app). Project ID, production target, source commit, and canonical alias were checked. The upload contained 74 explicitly allowed committed source/configuration files.
- Anonymous hosted verification found all **408 existing stems**, **42 new IDs and stems**, and **v0.4.2** across 12 served JavaScript assets. Home returned HTTP 200 and the anonymous workspace API HTTP 401. This release performed no production account/progress writes. No database migration was required or repeated.
