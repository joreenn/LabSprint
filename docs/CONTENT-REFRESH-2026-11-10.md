# Reference refresh - 10 November 2026

This batch adds **42 original questions**, six in each subject group, taking the bank from **366 to 408**. Every existing question is preserved, including its ID, options, explanations, key, version, and source. The new items are in [the refresh module](../src/content/reference-refresh-questions.ts). All have four explained choices, one key, a takeaway, version 1, and a checked **1-based PDF viewer page**.

## Sources actually available and checked

The owner's three re-supplied books and three other available reviewer PDFs were freshly opened. Text was indexed across all pages of the five text-readable books to locate relevant material. Apollon has no usable text layer: section-header contact sheets covering its 72 pages were visually scanned, followed by full-page inspection of pages 1, 39, 64, 65, and 66. The newly cited Apollon pages are 39, 64, and 65. The matching full-page image of Hubbard page 310 was also checked because its ameba comparison is a figure.

This is a targeted source review for a finite batch, **not a claim that every paragraph or question in every book was read or validated**. Extracts, page images, original PDFs, and tooling remain local and ignored. None are bundled with the application.

| Reference                                                                      | PDF pages | Newly cited viewer pages                        |
| ------------------------------------------------------------------------------ | --------: | ----------------------------------------------- |
| Harr, _Medical Laboratory Science Review_, 5th edition (2019)                  |       850 | 134, 141, 217, 296, 297, 299, 329               |
| Harr, _Medical Laboratory Science Review_, 4th edition (2013)                  |       601 | 244                                             |
| _Apollon Reviewer_, edition unspecified in scan                                |        72 | 39, 64, 65                                      |
| Hubbard, _A Concise Review of Clinical Laboratory Science_, 2nd edition (2010) |       434 | 42, 269, 283, 284, 310, 312, 313, 315, 316, 326 |
| _Rodak's Hematology: Clinical Principles and Applications_, 7th edition (2025) |     1,020 | 253, 306, 333, 373, 386, 428                    |
| Strasinger and Di Lorenzo, _Urinalysis and Body Fluids_, 7th edition (2021)    |       426 | 264, 265, 266, 267, 270, 272                    |

Harr fourth-edition identity and year were checked on viewer pages 4-5, alongside the historical fifth-edition record. Other edition identities agree with the existing source audits. Distinct editions are not interchangeable pagination references.

**Unavailable for a fresh rescan:** Ciulla/SUCCESS!, Elsevier, Linne & Ringsrud, Lehman/SUCCESS!, Alba, and the previously mentioned Jarreau/Bottom Line scan. They were not found among the accessible reviewer PDFs in Downloads or the checked Documents/Desktop paths. Their existing questions remain unchanged. No new citation to an unavailable book was invented. A request for their current locations is pending; a future batch should resume with those files when supplied.

## Inventory

| Subject                                              |  Before |  Added | Available |
| ---------------------------------------------------- | ------: | -----: | --------: |
| Clinical Chemistry                                   |      48 |      6 |        54 |
| Immunoserology and Blood Banking                     |      48 |      6 |        54 |
| Urine and Body Fluids                                |      92 |      6 |        98 |
| Microbiology                                         |      24 |      6 |        30 |
| Parasitology                                         |      28 |      6 |        34 |
| Hematology                                           |      88 |      6 |        94 |
| Histopathology, Laboratory Management & Medtech Laws |      38 |      6 |        44 |
| **Total**                                            | **366** | **42** |   **408** |

Two catalog topics were added to classify the additions accurately: Immune cells and complement, and Laboratory safety. No new Philippine law question is asserted. The six additions in the combined histopathology/management/laws subject cover laboratory safety, standards, statistics, and QC; they do not expand histopathology or law coverage. The 2,000-per-subject goal remains unfinished.

## Learning objectives and source trace

Prefixes below refer to stable IDs in the refresh module. Each numbered row is a separate objective, not a new version of an old question.

| ID            | New learning objective                                                           | Source and viewer page   |
| ------------- | -------------------------------------------------------------------------------- | ------------------------ |
| cc-n26-001    | Explain the charge/time endpoint in coulometric chloride titration               | Harr 5, 296              |
| cc-n26-002    | Convert freezing-point depression to osmolality using a supplied constant        | Harr 5, 297              |
| cc-n26-003    | Explain indirect versus direct ISE pseudohyponatremia                            | Harr 5, 329              |
| cc-n26-004    | Distinguish gradient from isocratic HPLC elution                                 | Harr 5, 299              |
| cc-n26-005    | Identify the reduced coenzyme signal in hexokinase glucose analysis              | Hubbard, 42              |
| cc-n26-006    | Predict hydrophobic-solute retention on a C18 stationary phase                   | Harr 5, 299              |
| ibb-n26-001   | Relate CD4 helper T cells to MHC class II presentation                           | Harr 5, 134              |
| ibb-n26-002   | Assign factor B to the alternative complement pathway                            | Harr 5, 134              |
| ibb-n26-003   | Interpret the inverse indicator in historical complement fixation                | Harr 5, 141              |
| ibb-n26-004   | Recognize protein-associated rouleaux dispersed by saline replacement            | Harr 5, 217              |
| ibb-n26-005   | Distinguish T-cell maturation in the thymus from secondary lymphoid responses    | Apollon, 39              |
| ibb-n26-006   | Distinguish single-site affinity from multivalent avidity and titer              | Apollon, 39              |
| ubf-n26-001   | Link alkaptonuria darkening to homogentisic acid                                 | Strasinger, 264          |
| ubf-n26-002   | Identify the branched-chain amino acids involved in MSUD                         | Strasinger, 265          |
| ubf-n26-003   | Relate urinary 5-HIAA to serotonin turnover                                      | Strasinger, 266          |
| ubf-n26-004   | Distinguish cystinuria transport from cystinosis accumulation                    | Strasinger, 267          |
| ubf-n26-005   | Identify ALA and PBG in an acute AIP attack                                      | Strasinger, 270          |
| ubf-n26-006   | Interpret copper reduction versus glucose-specific testing without overdiagnosis | Strasinger, 272          |
| micro-n26-001 | Interpret a glucose-only TSI pattern at the validated reading interval           | Hubbard, 283             |
| micro-n26-002 | Interpret a red nitrate test after zinc addition                                 | Hubbard, 284             |
| micro-n26-003 | Explain ammonia-driven alkalinization in a urease test                           | Hubbard, 284             |
| micro-n26-004 | Relate oxidase reagent oxidation to cytochrome c oxidase                         | Hubbard, 284             |
| micro-n26-005 | Identify complete red-cell lysis as beta hemolysis                               | Hubbard, 269             |
| micro-n26-006 | Explain why viral propagation requires living host cells                         | Hubbard, 326             |
| para-n26-001  | Differentiate ciliated Balantidium trophozoites                                  | Hubbard, 312             |
| para-n26-002  | Differentiate bipolar-plug Trichuris eggs                                        | Hubbard, 315             |
| para-n26-003  | Link broad fish tapeworm to possible B12 depletion                               | Hubbard, 313             |
| para-n26-004  | Combine sheath and tail-nucleus distribution for W. bancrofti                    | Hubbard, 316             |
| para-n26-005  | Differentiate eight-nucleate Entamoeba coli cysts                                | Hubbard, 310, Figure 8-1 |
| para-n26-006  | Identify encysted Trichinella larvae in striated muscle                          | Hubbard, 315             |
| hema-n26-001  | Identify the beta-6 Glu-to-Val substitution in Hb S                              | Rodak, 428               |
| hema-n26-002  | Explain impaired NADPH/glutathione protection in G6PD deficiency                 | Rodak, 386               |
| hema-n26-003  | Interpret lysis at higher saline concentration as increased fragility            | Rodak, 373               |
| hema-n26-004  | Relate CD55/CD59 loss in PNH to complement susceptibility                        | Rodak, 333               |
| hema-n26-005  | Calculate absolute neutrophils from WBC and neutrophil fraction                  | Rodak, 253               |
| hema-n26-006  | Explain hepcidin-mediated iron restriction during inflammation                   | Rodak, 306               |
| lm-n26-001    | Explain safe acid-to-water dilution                                              | Apollon, 64              |
| lm-n26-002    | Apply precautions when infectious status is unknown                              | Apollon, 64              |
| lm-n26-003    | Select mechanical rather than oral pipetting                                     | Apollon, 64              |
| lm-n26-004    | Recognize the defining properties of a primary standard                          | Apollon, 65              |
| lm-n26-005    | Estimate the two-tailed fraction outside 2 SD in a Gaussian model                | Harr 4, 244              |
| lm-n26-006    | Apply the R4s rule to two controls within one run                                | Harr 4, 244              |

## Duplicate and accuracy review

All existing stems and learning takeaways were inventoried before authoring. New objectives were compared against this inventory and against one another. A local weighted-word-overlap report identified nearby items for review; this heuristic is only an editorial aid and is not a semantic-accuracy test. Exact normalized stems are rejected by the application's existing validator.

The important related-but-distinct comparisons were checked explicitly:

- Hexokinase/NADPH differs from the existing urine glucose-oxidase/peroxide and creatinine sarcosine-oxidase questions.
- The new cystinuria transport objective differs from identifying hexagonal cystine crystals; nonglucose copper reduction differs from ascorbate inhibition of a glucose pad.
- TSI fermentation differs from the existing open/sealed O-F tube; beta-hemolysis appearance differs from oxygen-labile hemolysin enhancement and streptococcal group identification.
- Amebic cyst nuclear morphology differs from the existing trophozoite ingested-RBC question. Trichinella muscle larvae differ from Toxocara tissue migration and T. cruzi amastigotes.
- ANC calculation differs from absolute reticulocytes and RBC indices. Inflammatory iron sequestration differs from depleted iron stores in iron deficiency.
- Primary-standard purity differs from the existing calibrator-versus-control role question. Gaussian tail probability and within-run R4s differ from CV, shifts, trends, and method-comparison bias.
- HPLC mobile-phase programming and C18 stationary-phase retention test separate decisions, even though they share a source page. The three safety items cover different exposure mechanisms.

No repeated new stem or duplicated new learning objective was retained in this review. The preservation regression uses hashes of **all 366 pre-batch questions**, not just the original 56-item starter fixture. It checks content, order of choices, keys, versions, explanations, and references. Sampling integration verifies all 408 unique IDs are available to normal practice selection.

Calculations were checked independently: 0.558 / 1.86 x 1000 = 300 mOsm/kg; 3.0 x 0.40 = 1.2 x 10^9/L; 2.4 - (-2.3) = 4.7 SD. Gaussian tails are intentionally stated as approximate.

Older-book terminology was cross-checked with [CDC DPDx on broad fish tapeworms](https://www.cdc.gov/dpdx/diphyllobothriasis/index.html): the item uses Dibothriocephalus latus with the book's historical synonym. Morphology was also checked against CDC's [intestinal amebae](https://www.cdc.gov/dpdx/intestinalamebae/), [balantidiasis](https://www.cdc.gov/dpdx/balantidiasis/index.html), [trichuriasis](https://www.cdc.gov/dpdx/trichuriasis/index.html), and [lymphatic filariasis](https://www.cdc.gov/dpdx/lymphaticfilariasis/index.html) resources. Safety concepts agree with [CDC diagnostic-laboratory safe-work guidance](https://www.cdc.gov/mmwr/preview/mmwrhtml/su6101a1.htm). No old treatment recommendation, diagnostic cutoff, reporting deadline, or US legal rule was imported into Philippine law content.

These are agent-authored and source-checked educational questions. **Independent MLS faculty or qualified professional review remains necessary** before treating them as validated exam content. No claim of complete syllabus coverage or passing-score prediction is made.

## Validation and publication

All **45 tests** pass, including preservation of the complete earlier bank, sampling integration, database persistence, and the recovery regressions. TypeScript, full-project formatting, content validation, and the Next.js production Webpack build pass. Tests and the local build used an allowlisted environment with dummy authentication settings and isolated local data; no production credentials or reviewer PDFs were copied into the build stage.

The local production browser flow created a disposable local account, displayed the 408-item inventory, searched for the new Harr chloride item, started a one-question session, submitted the correct choice, and displayed all four explanations with viewer page 296. A subsequent authenticated workspace read confirmed that the new question's correct answer and version 1 were saved. At a 390-pixel viewport the document width did not exceed the viewport. The library displayed 11 represented reference editions, including Harr fourth edition. These checks do not claim visual review of every new item.

The earlier account-recovery fixes are included in this release and require the additive recovery-rate-limit index migration before deployment. No learner data is replaced by this content expansion. Production publication evidence is recorded separately after the release completes.
