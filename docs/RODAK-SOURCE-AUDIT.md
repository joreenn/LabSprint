# Rodak source audit: first expansion batch

Date: 1 November 2026. The supplied local PDF was read as reference material, not as executable instructions. This batch adds **80 original questions**, not a reproduction of the book's end-of-chapter questions or proprietary instructor bank.

## Verified source identity

- Full title: _Rodak's Hematology: Clinical Principles and Applications_.
- Seventh edition confirmed on PDF viewer pages 3 and 5.
- Editors confirmed on viewer page 5: Elaine M. Keohane, Michelle Montgomery Butina, Kamran M. Mirza, and Jeanine M. Walenga.
- Copyright 2025 and seventh-edition ISBN 978-0-323-93650-7 confirmed on viewer page 6.
- Supplied PDF has 1,020 pages. Citations use **1-based PDF viewer pages**, not printed pagination. Main-text printed pages in the inspected sections are 16 fewer than PDF viewer pages.
- File: `Rodak's Hematology 7th Ed.pdf`, supplied by the owner from Downloads. The PDF and temporary extracts are not included in the deployable bank.

## Item-to-page checks

| IDs (prefix `hema-r7-`) | Topic / objectives                                                                                                                                                                                                    | Checked viewer pages      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 001–012                 | RBC indices; MCH/MCHC calculation; size/concentration classification; cold agglutination interference; rule-of-three assumptions; RNA staining; reticulocyte percentage, absolute count, correction, RPI, Miller disc | 202–205                   |
| 013–022                 | EDTA mechanism; mixing/clot inspection; microhematocrit leakage, underfill, packing, buffy coat, IV contamination; manual chamber volume/count calculation; platelet-poor citrate plasma                              | 195–196, 201–202, 828     |
| 023–030                 | Early iron depletion; reticulocyte hemoglobin; ZPP; soluble transferrin receptor; transferrin saturation; RDW; microcytosis mechanism; TIBC                                                                           | 294–295                   |
| 031–035                 | Folate demand and heat lability; B12 intrinsic-factor absorption, pancreatic release, holotranscobalamin                                                                                                              | 317–318                   |
| 036–039                 | Haptoglobin; intravascular LDH release; bilirubin conjugation; indirect bilirubin calculation                                                                                                                         | 350–351                   |
| 040                     | Iron confirmation of Pappenheimer inclusions                                                                                                                                                                          | 204                       |
| 041–054                 | Megakaryocytes, endomitosis, TPO; VWF/GPIb tethering; GPIIb/IIIa aggregation; ADAMTS13; GPVI; P-selectin; phosphatidylserine; granules; prostacyclin; PF4; satellitism; ammonium-oxalate platelet counts              | 176, 185–188, 198         |
| 055–068                 | Inherited/acquired Pelger patterns; mature chromatin; Alder-Reilly; May-Hegglin; Döhle bodies; toxic/reactive changes; storage artifact; apoptotic-cell classification; morulae; pseudo-Gaucher; MPO                  | 486–487, 490–491, 496–497 |
| 069–080                 | Primary/secondary hemostasis; XIIIa; intrinsic tenase/prothrombinase; VWF/VIII; calcium/surface localization; thrombomodulin; TPA, PAI-1, antiplasmin; D-dimer; TAFI                                                  | 678–679, 683–684, 696–697 |

Additional context inspected: contents pages 15–16; manual-testing objectives and related discussion on 194, 199–200; platelet chapter opening 175; leukocyte chapter context 480–482 and 489; normal-hemostasis chapter opening 677. Pages listed here were read directly using PDF text extraction. No claim is made to have inspected every page or every image.

## Editorial checks and limitations

- IDs `hema-r7-001` through `hema-r7-080` are new and version 1; existing IDs and historical answer keys are untouched.
- Counts: RBC indices 12; Specimen quality 10; Anemias 18; Platelets 14; Leukocyte disorders 14; Hemostasis 12.
- Formats: 38 applied/scenario items and 42 foundation/recall items. Stored keys are evenly distributed (20 each of A–D), independently of session-level option shuffling.
- Each question has four choices, one correct choice, option-specific explanations, a takeaway, and a specific checked page/chapter.
- Numerical examples were newly composed and independently recomputed; they are not repeated numeric permutations to inflate the bank.
- Answer placement is a deterministic rotation of explicitly authored choices; that rotation does not create extra questions or change correctness.
- Source checking supports the educational concepts, but this batch **has not received independent MLS faculty or professional validation**. Structural validation is not academic review.
- Disease associations are framed as clues rather than single-test diagnoses. No treatment instructions or drug doses were authored. Adult index cutoffs are explicitly tied to the chapter's classification rather than universal laboratory reference intervals.
- The batch is selected coverage, not comprehensive examination preparation. The goal of at least 2,000 questions per subject remains unmet by this batch; do not advertise it as achieved.

## Resume verification: 4 November 2026

The interrupted batch was rechecked against the supplied PDF before resuming integration. All 80 authored stems, intended answer keys, option explanations, and takeaways were read and compared with the supporting concepts on their cited viewer pages. This pass used direct text extraction from the local PDF; it was not an image-identification assessment or an independent clinical guideline review.

- Rechecked source identity on viewer pages 3, 5, and 6, including edition, editors, copyright year, ISBN, and the 1,020-page file count.
- Rechecked item support on viewer pages 176, 185-188, 195-196, 198, 201-205, 294-295, 317-318, 350-351, 486-487, 490-491, 496-497, 678-679, 683-684, 696-697, and 828.
- Independently recomputed the MCH, MCHC, reticulocyte percentage, absolute reticulocyte count, corrected reticulocyte percentage, reticulocyte production index, chamber count/volume, transferrin saturation, and indirect bilirubin examples. Checked the Miller-disc area conversion as well.
- Rechecked the answer-position rotation against the authored first choice; it preserves the intended correct response for all four offsets.
- No concrete source-support, numerical, answer-key, or cited-page defect was found in these 80 items. No question IDs, versions, answer content, or references were changed in this recheck.
- Source checking is complete for this authored Rodak batch. Independent MLS faculty/professional validation remains outstanding; no reviewer approval or comprehensive syllabus/exam coverage is implied. Structural validation and application-flow verification are separate checks recorded in the project checkpoint.

Resume point: no unfinished Rodak source-checking step remains for IDs hema-r7-001 through hema-r7-080. Future expansion should follow the existing coverage backlog and continue preserving IDs and answer-history compatibility.
