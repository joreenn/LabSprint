import type { Question } from './types';

type Option = readonly [text: string, rationale: string];
type Source = Question['source'];
const hubbard = (pdfPage: number, chapter: string): Source => ({
  title: 'A Concise Review of Clinical Laboratory Science',
  edition: '2nd edition (Hubbard, 2010)',
  pdfPage,
  chapter,
});
const elsevier = (pdfPage: number, chapter: string): Source => ({
  title: "Elsevier's Medical Laboratory Science Examination Review",
  edition: '1st edition (Graeter et al., 2015)',
  pdfPage,
  chapter,
});
const lehman = (pdfPage: number, chapter: string): Source => ({
  title: 'SUCCESS! in Clinical Laboratory Science',
  edition: '5th edition (Lehman and Chiasera, 2020)',
  pdfPage,
  chapter,
});
const linne = (pdfPage: number, chapter: string): Source => ({
  title: "Linne & Ringsrud's Clinical Laboratory Science",
  edition: '7th edition (Turgeon, 2016)',
  pdfPage,
  chapter,
});
function item(
  id: string,
  subjectId: string,
  topic: string,
  kind: Question['kind'],
  stem: string,
  options: readonly Option[],
  correctIndex: number,
  takeaway: string,
  source: Source,
): Question {
  return {
    id,
    subjectId,
    topic,
    kind,
    difficulty: kind === 'case' ? 'Application' : 'Foundation',
    stem,
    options: options.map(([text, rationale], i) => ({
      id: String.fromCharCode(65 + i),
      text,
      rationale,
    })),
    correctOptionId: String.fromCharCode(65 + correctIndex),
    takeaway,
    source,
    version: 1,
  };
}

// Original items from checked source pages, not reproduced publisher questions.
// Page numbers are 1-based PDF viewer pages. Existing IDs/answers remain unchanged.
export const extraQuestions: Question[] = [
  item(
    'cc-007',
    'chemistry',
    'Enzymes',
    'case',
    'An enzyme follows Michaelis-Menten kinetics and has a Vmax of 120 activity units. At a substrate concentration equal to its Km, what reaction velocity is expected?',
    [
      [
        '0 units',
        'The reaction has a measurable positive velocity when substrate is present at Km.',
      ],
      [
        '30 units',
        'This is one quarter of Vmax, whereas the defining velocity at Km is one half of Vmax.',
      ],
      [
        '60 units',
        'Km is the substrate concentration at which reaction velocity is half of Vmax: 120 / 2 = 60 units.',
      ],
      [
        '120 units',
        'Vmax is approached at saturating substrate concentrations, not when substrate concentration equals Km.',
      ],
    ],
    2,
    'At [S] = Km, velocity is Vmax / 2 for an enzyme that follows Michaelis-Menten kinetics.',
    hubbard(50, '1. Clinical Chemistry - Enzymology'),
  ),
  item(
    'cc-008',
    'chemistry',
    'Endocrinology',
    'case',
    'A patient has free T4 above the laboratory interval and markedly suppressed TSH. There is no suspected assay interference. Which laboratory pattern is most consistent with these findings?',
    [
      [
        'Thyrotoxicosis with suppressed pituitary TSH',
        'Excess circulating thyroid hormone suppresses pituitary TSH through negative feedback; the cause still needs clinical investigation.',
      ],
      [
        'Primary hypothyroidism',
        'Primary thyroid failure typically produces low free T4 with elevated TSH, the opposite pattern.',
      ],
      [
        'Secondary hypothyroidism',
        'Pituitary-related hypothyroidism has insufficient thyroid hormone, so an elevated free T4 does not fit.',
      ],
      [
        'An entirely euthyroid pattern',
        'Both values are outside their stated intervals in a pattern consistent with thyroid hormone excess.',
      ],
    ],
    0,
    'Interpret TSH together with free T4; the biochemical pattern does not by itself identify the cause.',
    hubbard(62, '1. Clinical Chemistry - Thyroid Disorders'),
  ),

  item(
    'isbb-007',
    'immunoserology-blood-banking',
    'Serologic methods',
    'case',
    'In a validated assay within its measuring range, an immobilized antibody captures patient antigen and a second labeled antibody binds that antigen. Increasing antigen produces increasing signal. Which format is described?',
    [
      [
        'A competitive antigen assay',
        'In a typical competitive assay, patient antigen competes with labeled antigen and more patient antigen produces less bound label.',
      ],
      [
        'A noncompetitive sandwich immunoassay',
        'The antigen is held between capture and detection antibodies; within the validated range, signal increases with antigen concentration.',
      ],
      [
        'An indirect antiglobulin red-cell test',
        'An IAT detects in-vitro sensitization of red cells rather than the solid-phase antigen sandwich described here.',
      ],
      [
        'A direct antiglobulin red-cell test',
        'A DAT examines antibody or complement already bound to patient red cells, not captured soluble antigen.',
      ],
    ],
    1,
    'Sandwich assays use capture and detection antibodies; signal is generally directly related to antigen within the assay range.',
    elsevier(201, '6. Immunology and Serology - Other Immunoassays'),
  ),
  item(
    'isbb-008',
    'immunoserology-blood-banking',
    'Serologic methods',
    'case',
    'A slide bearing known antigen is incubated with patient serum and washed. A fluorescent anti-human immunoglobulin reagent is then added. What does this second reagent reveal?',
    [
      [
        'Antigen-free areas of the slide',
        'The reagent binds human immunoglobulin; it does not label areas solely because they lack antigen.',
      ],
      [
        'The concentration of every serum protein',
        'Anti-human immunoglobulin recognizes immunoglobulin rather than measuring all serum proteins.',
      ],
      [
        'Only complement fixed directly to patient red cells',
        'That describes a different target and specimen system; this assay uses a known antigen slide and patient serum.',
      ],
      [
        'Patient antibody bound to the known antigen',
        'The fluorescent secondary antibody binds the patient immunoglobulin that remains attached to the slide antigen after washing.',
      ],
    ],
    3,
    'In indirect immunofluorescence, the fluorescent anti-human reagent reveals bound patient antibody.',
    elsevier(201, '6. Immunology and Serology - Indirect Fluorescent Assays'),
  ),

  item(
    'ubf-007',
    'urine-body-fluids',
    'Serous fluids',
    'case',
    'A low-protein serous effusion forms when markedly reduced plasma albumin lowers colloid osmotic pressure. There is no evidence of local membrane inflammation. Which mechanism best describes this effusion?',
    [
      [
        'An inflammatory exudative process',
        'Exudates are associated with local membrane injury or inflammation and increased vascular permeability.',
      ],
      [
        'A noninflammatory transudative process',
        'Reduced plasma oncotic pressure permits more fluid to enter the cavity without requiring inflammatory membrane damage.',
      ],
      [
        'A joint fluid collection produced by synoviocytes',
        'Synovial fluid is found in joints; the stem describes an effusion in a serous cavity.',
      ],
      [
        'Proof of a malignant effusion',
        'The stated low-protein, noninflammatory mechanism does not establish malignancy; cytologic and other findings would be needed.',
      ],
    ],
    1,
    'Transudates arise from disturbances in fluid balance, whereas exudates reflect local membrane pathology.',
    linne(473, '14. Examination of Body Fluids - Transudates and Exudates'),
  ),
  item(
    'ubf-008',
    'urine-body-fluids',
    'Urine chemistry',
    'recall',
    'Which bilirubin fraction can enter urine and account for a positive routine urine bilirubin reaction?',
    [
      [
        'Conjugated bilirubin',
        'Conjugated bilirubin is water soluble and can enter urine when it accumulates in the circulation.',
      ],
      [
        'Albumin-bound unconjugated bilirubin',
        'This fraction is not filtered into urine in the way conjugated bilirubin is.',
      ],
      [
        'Hemoglobin within intact erythrocytes',
        'Intact red cells and their hemoglobin concern the urine blood reaction, not the bilirubin analyte.',
      ],
      [
        'Urobilinogen as an identical chemical form',
        'Urobilinogen is a separate bilirubin metabolite measured by a different reagent-pad reaction.',
      ],
    ],
    0,
    'A urine bilirubin result concerns conjugated bilirubin; bilirubin and urobilinogen are different analytes.',
    elsevier(176, '5. Clinical Fluid Analysis (Sue King Strasinger) - Bilirubin'),
  ),

  item(
    'micro-007',
    'microbiology',
    'Antimicrobial susceptibility',
    'case',
    'A broth dilution series shows visible growth at 0.5, 1, and 2 micrograms/mL, but no visible growth at 4, 8, or 16 micrograms/mL. Growth and sterility controls are acceptable. What is the MIC?',
    [
      [
        '2 micrograms/mL',
        'Growth is still visible at this concentration, so it has not reached the inhibitory endpoint.',
      ],
      [
        '8 micrograms/mL',
        'This concentration inhibits visible growth, but a lower tested concentration also does so.',
      ],
      [
        '4 micrograms/mL',
        'The MIC is the lowest tested antimicrobial concentration that prevents visible growth under the test conditions.',
      ],
      [
        '16 micrograms/mL',
        'The MIC is not the highest tested concentration; it is the first inhibitory concentration in the dilution series.',
      ],
    ],
    2,
    'MIC describes inhibition of visible growth; it does not by itself establish bacterial killing.',
    hubbard(305, '7. Clinical Microbiology - Antimicrobial Susceptibility Testing'),
  ),
  item(
    'micro-008',
    'microbiology',
    'Specimen collection',
    'case',
    'A specimen labeled sputum contains abundant squamous epithelial cells and few neutrophils on its Gram stain. Which concern should prompt specimen-quality review before interpreting a routine lower-respiratory culture?',
    [
      [
        'The specimen proves a sterile lower respiratory tract',
        'A poor-quality sample cannot prove that infection is absent.',
      ],
      [
        'The smear establishes a specific bacterial species',
        'Cell composition helps assess specimen quality but does not identify a bacterial species.',
      ],
      [
        'Squamous epithelial cells prove tissue invasion',
        'These cells commonly originate from the mouth and do not demonstrate bacterial tissue invasion.',
      ],
      [
        'The specimen may be predominantly saliva or oral contamination',
        'Numerous squamous cells with few inflammatory cells raise concern that expectorated material does not adequately represent the lower respiratory tract.',
      ],
    ],
    3,
    'Interpret culture results in the context of specimen quality; oral contamination can obscure a respiratory pathogen.',
    elsevier(15, '1. Microbiology - Stained Smears and Sputum Specimen Quality'),
  ),

  item(
    'para-007',
    'parasitology',
    'Diagnostic methods',
    'case',
    'A child has persistent perianal itching, and Enterobius vermicularis is suspected. Which collection approach most directly samples the site where eggs are deposited?',
    [
      [
        'A routine blood culture bottle',
        'Enterobius is an intestinal nematode; routine blood culture does not target its perianal eggs.',
      ],
      [
        'An adhesive tape preparation of the perianal area',
        'Female worms deposit eggs around the anus, making a perianal tape preparation an appropriate diagnostic collection.',
      ],
      [
        'An acid-fast sputum smear',
        'This is designed for a different specimen and organism group, not perianal pinworm eggs.',
      ],
      [
        'A serum total protein assay',
        'Serum protein concentration neither collects nor identifies Enterobius eggs.',
      ],
    ],
    1,
    'Match the specimen to the parasite life cycle: Enterobius eggs are sought with a perianal tape preparation.',
    elsevier(87, '2. Mycology, Virology, and Parasitology - Enterobius vermicularis'),
  ),
  item(
    'para-008',
    'parasitology',
    'Diagnostic methods',
    'recall',
    'Which stain is specifically useful for highlighting coccidian oocysts in a processed stool specimen?',
    [
      [
        'A routine Wright stain for blood films',
        'Wright stain is used primarily for blood-cell morphology and is not the targeted stool oocyst method here.',
      ],
      [
        'A Gram stain as a definitive oocyst identification',
        'A routine Gram stain is not the specific method described for highlighting coccidian oocysts.',
      ],
      [
        'An iron stain for marrow storage iron',
        'Marrow iron staining detects iron and does not target intestinal coccidian oocysts.',
      ],
      [
        'A modified acid-fast stain',
        'Modified acid-fast methods can highlight coccidian oocysts; morphology and other findings are still needed for identification.',
      ],
    ],
    3,
    'Choose the stain for the organism being sought; a positive staining characteristic is not a complete species identification.',
    elsevier(86, '2. Mycology, Virology, and Parasitology - Stool Microscopy'),
  ),

  item(
    'heme-007',
    'hematology',
    'Platelets',
    'case',
    'An automated EDTA platelet count is unexpectedly low. The blood film shows platelet clumps, and a correctly processed alternative-anticoagulant specimen gives an adequate count. Which explanation best fits?',
    [
      [
        'EDTA-associated in-vitro platelet aggregation causing a spurious low count',
        'Platelets that aggregate in the collection tube may not be counted as individual platelets by the analyzer.',
      ],
      [
        'Definite failure of platelet production in the marrow',
        'A low automated result with clumps and an adequate alternative-specimen count does not establish marrow failure.',
      ],
      [
        'A platelet count that must be released without review',
        'Analyzer results require review when specimen artifacts can make the reported count misleading.',
      ],
      [
        'Proof that all platelets are absent from circulation',
        'Visible platelet aggregates and the alternative count contradict complete absence of circulating platelets.',
      ],
    ],
    0,
    'Review a suspicious low platelet count for clumping; confirm the count using the laboratory validated specimen procedure.',
    lehman(411, '3. Hemostasis - Falsely Low Platelet Counts'),
  ),
  item(
    'heme-008',
    'hematology',
    'Hemostasis',
    'recall',
    'Which screening assay primarily evaluates the extrinsic and common coagulation pathways using tissue factor and calcium?',
    [
      [
        'An erythrocyte sedimentation rate',
        'The ESR concerns red-cell settling and is not a plasma coagulation pathway screening assay.',
      ],
      [
        'A direct antiglobulin test',
        'The DAT detects antibody or complement coating red cells, not extrinsic pathway activity.',
      ],
      [
        'The prothrombin time',
        'The PT uses a thromboplastin tissue-factor reagent with calcium to assess factors of the extrinsic and common pathways.',
      ],
      [
        'A reticulocyte count',
        'Reticulocyte enumeration assesses young red cells rather than plasma clotting-factor function.',
      ],
    ],
    2,
    'PT evaluates the extrinsic/common pathways; interpret prolonged results with specimen quality, medication, and clinical context.',
    lehman(424, '3. Hemostasis - Prothrombin Time'),
  ),

  item(
    'hml-007',
    'histopathology-lab-management-laws',
    'Quality assessment',
    'case',
    "A laboratory information system compares a new patient sodium result with that same patient's earlier sodium result and flags an unexpectedly large difference. What process is being applied?",
    [
      [
        'A reference interval study',
        'Reference interval studies characterize a reference population rather than comparing two results from the same patient.',
      ],
      [
        'A delta check',
        'A delta check compares a current patient result with a previous result and applies established limits to their difference.',
      ],
      [
        'An instrument calibration curve',
        'Calibration relates instrument signal to known analyte concentrations; it is not a patient-to-patient-history comparison.',
      ],
      [
        'A definitive diagnosis based only on the difference',
        'A large change prompts investigation and interpretation; it does not establish a diagnosis by itself.',
      ],
    ],
    1,
    'A delta check flags a change for investigation; both analytical/preanalytical problems and real clinical change are possible.',
    lehman(1020, '13. General Laboratory Principles - Laboratory Quality Assessment'),
  ),
  item(
    'hml-008',
    'histopathology-lab-management-laws',
    'Standards and calibration',
    'case',
    'A technologist uses material with assigned analyte concentrations to establish the instrument response curve. Separate control material is then analyzed with patient specimens. What is the first material serving as?',
    [
      [
        'A specimen collection preservative',
        'A preservative stabilizes a specimen; it does not establish the relationship between concentration and analytical response.',
      ],
      [
        'An unassayed patient sample',
        'The stated material has known assigned concentrations, unlike an unknown patient specimen.',
      ],
      [
        'A replacement for every quality-control sample',
        'Calibration and quality control serve different roles; calibration does not remove the need to monitor analytical performance.',
      ],
      [
        'A calibrator or standard',
        'Known-concentration standard material establishes the response relationship; independent controls assess the acceptability of results.',
      ],
    ],
    3,
    'Calibrators establish the measurement relationship; controls monitor whether the analytical system is performing acceptably.',
    lehman(1020, '13. General Laboratory Principles - Standards and Controls'),
  ),
];
