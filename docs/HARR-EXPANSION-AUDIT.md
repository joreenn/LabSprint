# Harr expansion source audit - 1 November 2026

## Resume verification checkpoint - 4 November 2026

Completed the resumed source-text audit of all 80 items: each stem, keyed choice, other-choice explanation and takeaway was read against the retained page-marked explanations. No concrete scoring, arithmetic or source-text contradiction was found, and no academic content, IDs, versions or citations in this module were changed during this pass.

Checked Clinical Chemistry pages: 283, 286, 288, 289, 294, 309, 311, 315, 319, 331, 334, 335, 356, 357, 358, 360, 368, 369, 371, 372, 391, 392, 394, 417, 418 and 421. Checked Immunoserology/Blood Banking pages: 128, 131, 132, 133, 138, 139, 140, 141, 164, 165, 166, 169, 171, 187, 189, 194, 198, 199, 200, 204, 205, 207, 213 and 216.

Recomputed the supplied numerical exercises: absorbance at 25%T is approximately 0.602; the stated bicarbonate/PCO2 values give pH 7.10; uncorrected creatinine clearance is 72 mL/min; and 18 mg/dL BUN converts to 38.52 mg/dL urea with the supplied factor. The AO x BO inheritance combinations are AB, AO, BO and OO. These checks do not establish clinical suitability, exam prediction or lasting learner mastery.

The original PDF remains unavailable for a new visual audit. This is verification against the retained extraction, not a fresh PDF comparison or independent MLS faculty/professional review. The complete book has not been audited. No new content was authored during resumption.

## Scope and provenance

`src/content/harr-expansion-questions.ts` exports **80 original questions**: 40 Clinical Chemistry (`cc-h5-001` through `cc-h5-040`) and 40 Immunoserology and Blood Banking (`ibb-h5-001` through `ibb-h5-040`). These additions preserve the existing 56 questions and their IDs and versions.

The source is Robert R. Harr, _Medical Laboratory Science Review_, fifth edition, F. A. Davis, 2019. The retained extraction at ignored `tmp/pdfs/harr.txt` identifies the title, author, fifth edition, publisher and copyright year on **PDF viewer page 5**. The earlier repository source record identifies this as the extraction of the supplied `Harr 5th ed.pdf`.

**Verification limit:** the source PDF itself is no longer present in the Downloads folder at this authoring pass. Verification used the retained text extraction, with explicit `=== PDF PAGE N ===` markers, rather than a fresh visual inspection of the PDF. No new edition or page numbers were inferred from an absent file. Citations are **1-based PDF viewer pages**, not printed book pages. The retained extraction contains encoding artifacts and page-split sentences; items were selected from comprehensible explanations rather than garbled formulas or figures. No book pages, extracted text files, publisher questions, or answer keys are included in the deployable bank.

Every stem, answer choice and explanation is newly authored. The content is a source-grounded practice expansion, **not independently faculty-reviewed or validated high-yield exam coverage**. Structural validation cannot establish academic correctness. No claims are made that every page of Harr has been covered, that the full syllabus is represented, or that a subject has reached 2,000 questions.

## Item-level grounding

Each row maps the complete item (stem, answer and rationale) to the checked explanation or concept. Arithmetic in the new calculation items was recomputed independently.

| ID suffix | Clinical Chemistry objective                                                       | PDF page |
| --------- | ---------------------------------------------------------------------------------- | -------: |
| 001       | Convert 25% transmittance to absorbance using the logarithmic relationship         |      283 |
| 002       | Recognize high-absorbance nonlinearity caused by stray light                       |      286 |
| 003       | Select a narrow-peak reference material for wavelength verification                |      286 |
| 004       | Explain a reference beam's compensation for lamp fluctuations                      |      286 |
| 005       | Distinguish specimen blanking from reagent blanking                                |      288 |
| 006       | Explain separate fluorescence excitation/emission wavelength selection             |      289 |
| 007       | Distinguish chemical light generation from optical excitation                      |      289 |
| 008       | Identify selective potassium binding by valinomycin                                |      294 |
| 009       | Calculate pH from bicarbonate and PCO2                                             |      309 |
| 010       | Predict CO2 loss and pH increase after air exposure                                |      311 |
| 011       | Relate pH to the bicarbonate/dissolved-CO2 ratio                                   |      309 |
| 012       | Recognize the need for two calibration points to establish slope                   |      319 |
| 013       | Explain ventilatory compensation for metabolic acidosis                            |      315 |
| 014       | Relate insulin to glucose uptake and storage                                       |      331 |
| 015       | Distinguish endogenous insulin release from administered insulin using C-peptide   |      334 |
| 016       | Explain nonenzymatic hemoglobin glycation                                          |      335 |
| 017       | Compare fructosamine and HbA1c measurement intervals                               |      335 |
| 018       | Recognize counterregulatory actions of cortisol and growth hormone                 |      331 |
| 019       | Calculate uncorrected creatinine clearance with supplied concentrations and flow   |      356 |
| 020       | Explain timing error from including precollection bladder urine                    |      357 |
| 021       | Explain the interference-reduction strategy of kinetic Jaffe measurement           |      358 |
| 022       | Identify peroxide generation in a coupled creatinine method                        |      357 |
| 023       | Explain correction for dilution by urine albumin/creatinine indexing               |      360 |
| 024       | Distinguish urea nitrogen metabolism from uric acid purine catabolism              |      360 |
| 025       | Convert BUN to urea mass concentration using the stated factor                     |      360 |
| 026       | Select adequate analytical sensitivity for low fluid protein                       |      368 |
| 027       | Recognize plasma fibrinogen as a protein-electrophoresis artifact                  |      372 |
| 028       | Identify albumin as the leading fraction in routine alkaline electrophoresis       |      371 |
| 029       | Explain lack of electrophoretic migration after interruption of the ionic circuit  |      371 |
| 030       | Integrate high total protein with low albumin and a restricted immunoglobulin band |      369 |
| 031       | Identify transferrin as a beta-fraction protein                                    |      372 |
| 032       | Explain substrate excess in enzyme activity measurement                            |      391 |
| 033       | Separate catalytic acceleration from equilibrium composition                       |      391 |
| 034       | Recognize substrate competition as a means of overcoming competitive inhibition    |      391 |
| 035       | Explain pyridoxal phosphate support of aminotransferase activity                   |      392 |
| 036       | Recognize in-vitro hemolysis as an LD interference                                 |      394 |
| 037       | Interpret high gonadotropins with low testosterone using feedback                  |      418 |
| 038       | Explain two-site selectivity for intact hormone versus fragments                   |      421 |
| 039       | Identify estradiol as the principal ovarian estrogen measured                      |      418 |
| 040       | Relate ADH-mediated water handling to paired plasma/urine concentration            |      417 |

| ID suffix | Immunoserology/Blood Banking objective                                             | PDF page |
| --------- | ---------------------------------------------------------------------------------- | -------: |
| 001       | Locate the antigen-binding site in paired variable regions                         |      131 |
| 002       | Associate heavy-chain constant regions with effector function                      |      131 |
| 003       | Associate J-chain with polymeric IgM and secretory IgA                             |      131 |
| 004       | Explain passive placental transfer of IgG                                          |      133 |
| 005       | Identify plasma-cell antibody secretion                                            |      128 |
| 006       | Recognize IgG predominance in the classic secondary response                       |      132 |
| 007       | Interpret matching restricted heavy/light-chain bands by immunofixation            |      139 |
| 008       | Distinguish monoclonal M component from the class IgM                              |      169 |
| 009       | Distinguish specific functional antibody response from total concentration         |      169 |
| 010       | Distinguish B-cell number from class-specific antibody production                  |      169 |
| 011       | Identify delayed T-cell/macrophage hypersensitivity                                |      166 |
| 012       | Identify immune-complex injury                                                     |      164 |
| 013       | Identify cell-targeted antibody/complement injury                                  |      165 |
| 014       | Explain direct detection of tissue-bound antibody                                  |      166 |
| 015       | Distinguish allergen-specific from total IgE                                       |      165 |
| 016       | Identify complement inflammatory split products                                    |      131 |
| 017       | Explain falsely high ELISA signal after inadequate washing                         |      138 |
| 018       | Explain unequal color-development timing                                           |      138 |
| 019       | Handle a quantitative sample exceeding the calibrated range by validated dilution  |      138 |
| 020       | Explain inert carriers in passive agglutination                                    |      141 |
| 021       | Identify highest reactive dilution as the endpoint titer                           |      141 |
| 022       | Interpret crossed double-diffusion precipitin lines                                |      138 |
| 023       | Distinguish early rate from endpoint nephelometry                                  |      140 |
| 024       | Characterize a restricted electrophoretic protein using immunofixation             |      139 |
| 025       | Distinguish complement functional lysis from component concentration               |      171 |
| 026       | Identify oxidative respiratory burst assessed by DHR                               |      171 |
| 027       | Explain soluble-Ig neutralization of antiglobulin reagent after inadequate washing |      166 |
| 028       | Recognize pre-existing DAT positivity as a weak-D antiglobulin-phase confounder    |      199 |
| 029       | Explain antibody recovery in an eluate                                             |      216 |
| 030       | Distinguish the recipient-plasma/donor-cell major crossmatch pairing               |      213 |
| 031       | Distinguish direct serologic phenotype from genotype                               |      187 |
| 032       | Determine possible AO x BO offspring allele combinations                           |      189 |
| 033       | Distinguish Bombay from ordinary O phenotype through H antigen                     |      189 |
| 034       | Interpret acquired B-like forward/reverse discordance                              |      194 |
| 035       | Distinguish D designation from the whole Rh antigen system                         |      198 |
| 036       | Explain partial-D epitope variation                                                |      200 |
| 037       | Interpret antigen dosage in reaction strength                                      |      204 |
| 038       | Explain persistence of antibody-history relevance after evanescence                |      207 |
| 039       | Relate adult/cord I/i antigen expression to antibody reactivity                    |      205 |
| 040       | Interpret broad panel reactivity with a negative autocontrol                       |      213 |

## Deliberate exclusions

- No old diabetes screening schedules, therapeutic targets or treatment instructions.
- No race-adjusted historical eGFR equation or claim that cystatin C lacks all nonrenal influences.
- No claim that all HbA1c methods are immune to hemoglobin-variant interference.
- No use of the extraction's incorrect description of SDS as nonionic or its reversed molecular-size migration explanation.
- No dated transfusion storage intervals, patient-specific component selection orders or weak-D prophylaxis rules.
- No historical endocrine dynamic-test dose/cutoff protocol.

The items focus on stable analytical principles and explicitly supplied educational data. Clinical implementation still depends on local validated procedures and contemporary professional review.

## Checks

The batch was imported alongside the existing bank and checked with `validateQuestionBank`: **80 additions, 40 per subject, zero structural errors**. This checks schema consistency, IDs, topics, answer-key references and required rationales; it does not replace academic review. The application already shuffles answer options for practice; the authoring helper also distributes the correct key across positions deterministically. Root integration must run formatting and the complete test/build checks before publication.

Resumed structural check: importing both Harr modules with the current subject catalog and running `validateQuestionBank` returned **146 items and zero errors**. Stored correct keys are A: 86, B: 20, C: 20 and D: 20 across the two modules; displayed practice options remain shuffled. Formatting and whole-project integration checks belong to the release checkpoint.
