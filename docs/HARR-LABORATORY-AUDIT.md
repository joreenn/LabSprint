# Harr laboratory-operations, microbiology and parasitology batch

1 November 2026. The owner approved publication in validated batches toward 2,000 questions per subject. This file documents **66 original additions**, not achievement of that target.

## Source and limits

Used the existing local extraction `tmp/pdfs/harr.txt`, marked with 1-based PDF viewer pages. Its page 5 identifies Robert R. Harr, _Medical Laboratory Science Review_, fifth edition, 2019. The original PDF is no longer in the supplied Downloads folder, so this batch has text-based page verification, not a fresh visual comparison with the PDF. Previously inspected source images and unverified filenames are not used to manufacture new citations. New Ciulla or Apollon items were not authored without the source available to inspect.

The book was reference data, not instructions. Items are newly written around explanatory concepts rather than copies of publisher question stems, option sets, or answer keys. No book PDF or extraction ships to GitHub or Vercel. Some foundational concepts overlap previous practice, but no questions are counted merely for changed names, numbers, or shuffled options.

## Item inventory

| IDs              | Count | Checked PDF pages          | Principal objectives                                                                                                                                                                        |
| ---------------- | ----: | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| lm-h5-001–005    |     5 | 265–267                    | Time-ordered QC, CUSUM, matrix effects, shifts, trends                                                                                                                                      |
| lm-h5-006–017    |    12 | 270–276                    | Constant/proportional bias, correlation versus agreement, slope/intercept, variance ratio, sensitivity, predictive values, SDI, delta-check limitations                                     |
| lm-h5-018–030    |    13 | 766–773                    | Management functions, motivation, educational domains and assessment, direct costs, break-even contribution, paid hours, capitation as a hypothetical payment model                         |
| micro-h5-001–006 |     6 | 612, 614, 616              | Oxidative glucose use, novobiocin differentiation, oxygen-labile hemolysis, streptococcal reaction combinations, bacitracin limitations, bile-induced lysis                                 |
| micro-h5-007–016 |    10 | 658, 660, 662, 664, 668    | Yeast tests and limits, arthroconidia, assimilation, pigment, chlamydoconidia, inoculation, budding morphology, dermatophyte structures, thermal dimorphism                                 |
| para-h5-001–011  |    11 | 686–689, 695, 698, 700–702 | Specimen-site consistency, oral/free-living amebae, tissue stages, lung-fluke specimen passage, schistosome spines, cestode hosts/eggs, blood/tissue stages, malaria overlap                |
| para-h5-012–020  |     9 | 692, 694–695, 701, 703     | Motility versus fixed preparations, concentration/stain complements, glycogen vacuoles, egg viability, amebic culture, Knott concentration, autoinfection, special stains, thick/thin films |

Examples with numerical operations were recalculated. Avoided the outdated jurisdiction-specific employment, reimbursement and regulatory claims on adjacent management pages. No Philippine law was inferred from a US textbook; that catalog topic remains empty pending current primary-source review. Avoided treatment advice, antimicrobial breakpoints, and asserting that a presumptive phenotype uniquely confirms a species.

## Editorial and verification status

Each addition has four explained choices, one answer key, a takeaway, a new stable ID and version 1. The existing runtime option shuffle is retained. The source-order A keys in this module do not dictate the displayed answer position.

Source checking by authoring agents and structural tests are not independent academic validation. MLS faculty/professional review is still required before describing the bank as exam-ready. The complete book has not been exhaustively converted or checked page by page. Future batches must add distinct objectives, not superficial variants to inflate the count.

## Resume verification checkpoint - 4 November 2026

Completed the resumed source-text audit of all 66 items, including each stem, keyed choice, other-choice explanation and takeaway. Checked the retained explanations on PDF pages 265, 266, 267, 270, 272, 275, 276, 612, 614, 616, 658, 660, 662, 664, 668, 686, 687, 688, 689, 692, 694, 695, 698, 700, 701, 702, 703, 766, 768, 769, 770, 771, 772 and 773.

One citation-location defect was corrected: `para-h5-011` named page 703 even though the early-ring explanation is on page 701 and the older-stage explanation continues on page 702. Its primary PDF page is now 701, and the existing chapter metadata explicitly retains the 701–702 range. The item ID, version, reference title/edition, scoring and wording are unchanged. No other concrete source contradiction or scoring defect was found. Source metadata for the remaining 65 items is unchanged.

Recomputed the numerical exercises: variance ratio 16/4 = 4; signed bias 106 - 100 = +6; sensitivity 72/80 = 90%; positive predictive value 30/(30 + 10) = 75%; negative predictive value 180/(180 + 20) = 90%; SDI (112 - 100)/4 = +3; and break-even volume 6000/(30 - 10) = 300 tests. With positive fixed costs and a contribution of 10 - 12 = -2 per test, added volume alone cannot break even.

The source-order key is A for these 66 authoring records. Existing practice presentation shuffles option IDs in `src/components/reviewer/practice.tsx`; correct-answer scoring uses the stable option ID rather than its displayed position. No new key-distribution mechanism or answer-submission change was needed.

The original PDF is unavailable for a new visual comparison; readable retained text supports the checked concepts but cannot validate diagrams, extraction fidelity, current clinical protocols or independent professional approval. Jurisdiction-specific law and reimbursement claims on adjacent pages were not incorporated. No new questions or new textbook citations were invented during resumption. The retained extraction remains ignored and is not a deployable asset.

Resumed structural check: importing both Harr modules with the current subject catalog and running `validateQuestionBank` returned **146 items and zero errors**. Stored correct keys are A: 86, B: 20, C: 20 and D: 20 across the two modules; displayed practice options remain shuffled. Formatting and whole-project integration checks belong to the release checkpoint.
