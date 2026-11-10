import type { Question, Subject } from './types';
import { extraQuestions } from './extra-questions';
import { rodakQuestions } from './rodak-questions';
import { strasingerQuestions } from './strasinger-questions';
import { harrExpansionQuestions } from './harr-expansion-questions';
import { harrLaboratoryQuestions } from './harr-laboratory-questions';
import { referenceRefreshQuestions } from './reference-refresh-questions';
import { returnedReviewerQuestions } from './returned-reviewer-questions';

export const subjects: Subject[] = [
  {
    id: 'chemistry',
    name: 'Clinical Chemistry',
    shortName: 'Chemistry',
    description: 'Connect analytes, methods, and clinical patterns.',
    color: '#d3eea9',
    topics: [
      'Instrumentation',
      'Acid-base and electrolytes',
      'Carbohydrates',
      'Renal chemistry',
      'Proteins',
      'Enzymes',
      'Endocrinology',
      'Lipids and lipoproteins',
      'Liver function',
    ],
  },
  {
    id: 'immunoserology-blood-banking',
    name: 'Immunoserology and Blood Banking',
    shortName: 'Immuno & Blood Bank',
    description: 'Make sense of immune responses and transfusion testing.',
    color: '#e6d8f5',
    topics: [
      'Immunoglobulins',
      'Hypersensitivity',
      'Serologic methods',
      'Antiglobulin testing',
      'Blood groups',
      'Antibody identification',
      'Immune cells and complement',
    ],
  },
  {
    id: 'urine-body-fluids',
    name: 'Analysis of Urine and Body Fluids',
    shortName: 'Urine & Body Fluids',
    description: 'Interpret chemistry, sediment, and fluid findings together.',
    color: '#f8e3ad',
    topics: [
      'Urine chemistry',
      'Urine microscopy',
      'Cerebrospinal fluid',
      'Synovial fluid',
      'Serous fluids',
      'Other body fluids',
      'Renal physiology',
    ],
  },
  {
    id: 'microbiology',
    name: 'Microbiology',
    shortName: 'Microbiology',
    description: 'Follow the clues in bacteriology, mycology, and virology.',
    color: '#c6e8e3',
    topics: [
      'Bacteriology',
      'Mycology',
      'Virology',
      'Specimen collection',
      'Antimicrobial susceptibility',
      'Microbial molecular testing',
    ],
  },
  {
    id: 'parasitology',
    name: 'Parasitology',
    shortName: 'Parasitology',
    description: 'Recognize organisms, life cycles, and diagnostic methods.',
    color: '#f4d6c0',
    topics: [
      'Intestinal protozoa',
      'Nematodes',
      'Trematodes',
      'Cestodes',
      'Blood parasites',
      'Diagnostic methods',
    ],
  },
  {
    id: 'hematology',
    name: 'Hematology',
    shortName: 'Hematology',
    description: 'Link cell morphology, blood counts, and hemostasis.',
    color: '#f1cfd5',
    topics: [
      'RBC indices',
      'Anemias',
      'Leukocyte disorders',
      'Hemostasis',
      'Specimen quality',
      'Platelets',
    ],
  },
  {
    id: 'histopathology-lab-management-laws',
    name: 'Histopathology, Laboratory Management & Medtech Laws',
    shortName: 'Histo, Management & Laws',
    description: 'Review quality systems, management, and professional foundations.',
    color: '#d6e0f5',
    topics: [
      'Quality assessment',
      'Laboratory statistics',
      'Management',
      'Standards and calibration',
      'Laboratory safety',
      'Histopathology',
      'Philippine Medtech Laws',
    ],
  },
];

type OptionInput = readonly [text: string, rationale: string];
function item(
  id: string,
  subjectId: string,
  topic: string,
  kind: Question['kind'],
  stem: string,
  options: readonly OptionInput[],
  correctIndex: number,
  takeaway: string,
  pdfPage: number,
  chapter: string,
  title = 'Medical Laboratory Science Review',
  edition = '5th edition (Harr, 2019)',
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
    source: { title, edition, pdfPage, chapter },
    version: 1,
  };
}

// Original educational items. PDF page numbers are 1-based viewer pages, not printed pages.
// This starter bank is source-checked but still requires independent faculty review before expansion.
export const questions: Question[] = [
  ...returnedReviewerQuestions,
  ...extraQuestions,
  item(
    'cc-001',
    'chemistry',
    'Instrumentation',
    'case',
    'Within the linear range of a colorimetric assay, a sample has an absorbance of 0.30 in a 1-cm cuvette. What absorbance is expected in a 2-cm cuvette if all other conditions stay the same?',
    [
      [
        '0.15',
        'A longer light path increases absorbance; halving it would correspond to a shorter path.',
      ],
      [
        '0.30',
        'Absorbance depends on path length as well as concentration, so it does not remain unchanged.',
      ],
      [
        '0.60',
        'Beer-Lambert law gives A = abc. Doubling b doubles absorbance when absorptivity and concentration are constant.',
      ],
      [
        '0.90',
        'This would require tripling the path length or concentration, rather than doubling it.',
      ],
    ],
    2,
    "Within the assay's linear range, absorbance is proportional to path length and concentration.",
    283,
    '6.1 Instrumentation',
  ),
  item(
    'cc-002',
    'chemistry',
    'Acid-base and electrolytes',
    'case',
    'A chemistry panel shows sodium 140 mmol/L, chloride 103 mmol/L, and bicarbonate 15 mmol/L. Using an anion gap formula that excludes potassium, what is the calculated gap?',
    [
      ['22 mmol/L', 'The gap is Na - (Cl + HCO3): 140 - (103 + 15) = 22 mmol/L.'],
      ['37 mmol/L', 'Subtracting chloride alone gives 37; bicarbonate must also be subtracted.'],
      ['52 mmol/L', 'Adding bicarbonate rather than subtracting it produces this result.'],
      ['118 mmol/L', 'This is the sum of chloride and bicarbonate, not the anion gap.'],
    ],
    0,
    'State whether potassium is included before calculating or interpreting an anion gap.',
    320,
    '6.2 Blood Gases, pH, and Electrolytes',
  ),
  item(
    'cc-003',
    'chemistry',
    'Carbohydrates',
    'case',
    'A patient eats breakfast before a scheduled HbA1c collection. Which statement best explains why fasting is generally unnecessary for this test?',
    [
      [
        'HbA1c measures the glucose concentration at the instant of collection.',
        'That describes a contemporaneous glucose measurement; HbA1c reflects longer-term exposure.',
      ],
      [
        'HbA1c represents glycation over the preceding weeks to months.',
        'HbA1c reflects time-averaged glucose exposure of circulating red cells, approximately the preceding 2 to 3 months, so one meal does not determine the result.',
      ],
      [
        'Eating removes the labile fraction of hemoglobin.',
        'A meal does not remove a hemoglobin fraction. Assay design distinguishes relevant fractions.',
      ],
      [
        'HbA1c is a urinary glucose measurement.',
        'HbA1c is measured in whole blood and is a glycated hemoglobin fraction.',
      ],
    ],
    1,
    'HbA1c reflects longer-term glycemia; altered red-cell survival and some hemoglobin variants can affect interpretation.',
    335,
    '6.3 Glucose, Hemoglobin, Iron, and Bilirubin',
  ),
  item(
    'cc-004',
    'chemistry',
    'Renal chemistry',
    'recall',
    'Which reagent combination identifies a creatinine assay as a Jaffe method?',
    [
      [
        'Glucose oxidase and peroxidase',
        'This coupled enzyme system is associated with glucose assays, not the Jaffe reaction.',
      ],
      ['Diazotized sulfanilic acid', 'Diazo reagents are used for bilirubin reactions.'],
      [
        'Urease and glutamate dehydrogenase',
        'This enzyme combination is used to measure urea through ammonia production.',
      ],
      [
        'Picrate in an alkaline medium',
        'Creatinine reacts with alkaline picrate to form a measurable colored complex; the reaction is susceptible to noncreatinine chromogens.',
      ],
    ],
    3,
    'Jaffe means alkaline picrate; remember its limited analytical specificity.',
    358,
    '6.4 Creatinine, Uric Acid, BUN, and Ammonia',
  ),
  item(
    'cc-005',
    'chemistry',
    'Proteins',
    'recall',
    'A total protein procedure uses copper ions in an alkaline solution. Which analytical method is being performed?',
    [
      [
        'Biuret',
        'The biuret reaction uses alkaline copper reagent to detect peptide bonds in proteins.',
      ],
      ['Jaffe', 'The Jaffe method uses alkaline picrate to measure creatinine.'],
      [
        'Uricase',
        'Uricase is an enzyme used for uric acid measurement, rather than total protein.',
      ],
      [
        'Glucose oxidase',
        'Glucose oxidase reacts with glucose and does not measure total peptide bonds.',
      ],
    ],
    0,
    'Distinguish alkaline copper for biuret protein assays from alkaline picrate for creatinine.',
    358,
    '6.4 Creatinine, Uric Acid, BUN, and Ammonia',
  ),
  item(
    'cc-006',
    'chemistry',
    'Acid-base and electrolytes',
    'case',
    'An arterial specimen has pH 7.50, PCO2 28 mm Hg, and bicarbonate 23 mmol/L. Which primary acid-base process best fits these results?',
    [
      [
        'Metabolic acidosis',
        'Metabolic acidosis requires a primary bicarbonate decrease and usually acidemia, which are not the pattern here.',
      ],
      [
        'Metabolic alkalosis',
        'The bicarbonate is within the stated conventional interval; it is not the primary cause of this alkalemia.',
      ],
      [
        'Respiratory alkalosis',
        'The alkalemic pH with a low PCO2 and near-normal bicarbonate indicates a primary respiratory alkalosis.',
      ],
      [
        'Respiratory acidosis',
        'A primary respiratory acidosis has increased PCO2, opposite to this result.',
      ],
    ],
    2,
    'Start with the pH, then determine whether PCO2 or bicarbonate explains its direction.',
    318,
    '6.2 Blood Gases, pH, and Electrolytes',
  ),

  item(
    'isbb-001',
    'immunoserology-blood-banking',
    'Immunoglobulins',
    'recall',
    'After a first encounter with a new antigen, which immunoglobulin class typically predominates early in the primary humoral response?',
    [
      [
        'IgA',
        'IgA is important in mucosal secretions but is not the typical first class in a primary systemic response.',
      ],
      [
        'IgM',
        'IgM appears early in the primary response before class-switched antibodies predominate.',
      ],
      [
        'IgE',
        'IgE is associated with immediate hypersensitivity and antiparasitic responses, rather than the usual early primary serum response.',
      ],
      ['IgG', 'IgG is prominent after class switching and in many secondary responses.'],
    ],
    1,
    'Primary response: think early IgM. Secondary responses often feature rapid, stronger IgG production.',
    132,
    '3.1 Basic Principles of Immunology',
  ),
  item(
    'isbb-002',
    'immunoserology-blood-banking',
    'Hypersensitivity',
    'case',
    'A sensitized person develops an immediate wheal after allergen exposure. Which antibody class links allergen recognition to mast-cell degranulation?',
    [
      [
        'IgG',
        'IgG participates in other immune mechanisms, including some antibody-mediated cytotoxic responses; it is not the characteristic mast-cell-bound antibody here.',
      ],
      [
        'IgD',
        'IgD functions mainly as a B-cell surface receptor and is not the principal mediator of this immediate reaction.',
      ],
      [
        'IgM',
        'IgM is effective at complement activation but is not the characteristic trigger of allergen-driven mast-cell degranulation.',
      ],
      [
        'IgE',
        'Cross-linking of allergen-specific IgE bound to mast cells initiates release of mediators such as histamine.',
      ],
    ],
    3,
    'Type I immediate hypersensitivity is associated with IgE and mast cells.',
    133,
    '3.1 Basic Principles of Immunology',
  ),
  item(
    'isbb-003',
    'immunoserology-blood-banking',
    'Serologic methods',
    'case',
    'An undiluted serum gives a negative precipitation reaction, but appropriate serial dilution reveals a reaction. Excess antibody has been demonstrated. What explains the original result?',
    [
      [
        'Prozone',
        'Excess antibody can prevent the antigen-antibody cross-linking needed for a visible lattice; dilution can restore a suitable ratio.',
      ],
      [
        'Postzone',
        'Postzone refers to antigen excess. The stem specifically establishes antibody excess.',
      ],
      [
        'An absence of antibody',
        'A reaction after dilution and demonstrated antibody excess contradict complete antibody absence.',
      ],
      [
        'A true negative with no analytical interference',
        'The recovery of reactivity after dilution shows that the original negative was misleading.',
      ],
    ],
    0,
    'Antibody excess is prozone; antigen excess is postzone. Both can impair visible lattice formation.',
    137,
    '3.2 Immunologic Procedures',
  ),
  item(
    'isbb-004',
    'immunoserology-blood-banking',
    'Antiglobulin testing',
    'case',
    "A laboratory wants to establish whether a patient's circulating red cells are already coated with immunoglobulin or complement. Which test directly addresses this question?",
    [
      [
        'Indirect antiglobulin test',
        'The IAT detects in-vitro sensitization of test red cells by antibodies in serum or plasma.',
      ],
      [
        'ABO reverse grouping',
        "Reverse grouping detects expected ABO antibodies using reagent cells; it does not establish in-vivo coating of the patient's cells.",
      ],
      [
        'Direct antiglobulin test',
        'The DAT tests washed patient red cells for immunoglobulin and/or complement that bound in vivo.',
      ],
      [
        'Serum protein electrophoresis',
        'Electrophoresis characterizes serum proteins and does not directly detect red-cell-bound antibody.',
      ],
    ],
    2,
    'DAT examines in-vivo red-cell sensitization; IAT examines in-vitro sensitization.',
    33,
    '1.2 Normocytic and Normochromic Anemias',
  ),
  item(
    'isbb-005',
    'immunoserology-blood-banking',
    'Antibody identification',
    'case',
    'An antibody reacts with untreated Fy(a+) cells but loses reactivity when the same cells are treated with a proteolytic enzyme. Which specificity best fits this observation?',
    [
      [
        'Anti-Jka',
        'Kidd antibody reactivity is commonly enhanced by enzyme treatment rather than destroyed.',
      ],
      [
        'Anti-Fya',
        'Duffy antigens are enzyme sensitive; destruction of Fya can eliminate anti-Fya reactivity.',
      ],
      [
        'Anti-e',
        'Rh reactivity is generally enhanced by enzyme treatment, not eliminated in the described way.',
      ],
      [
        'Anti-K',
        'Kell antigens are generally unaffected by the proteolytic enzyme treatment described here.',
      ],
    ],
    1,
    'Enzymes help distinguish antibody patterns: Duffy is destroyed, whereas Rh and Kidd reactions are often enhanced.',
    207,
    '4.4 Testing for Antibodies',
  ),
  item(
    'isbb-006',
    'immunoserology-blood-banking',
    'Blood groups',
    'recall',
    'Why can an otherwise satisfactory antibody screen using only group O reagent cells fail to detect anti-A1?',
    [
      [
        'Group O cells contain no Rh antigens.',
        'Group O refers to ABO status and does not imply absence of Rh antigens.',
      ],
      [
        'Anti-A1 is always an IgE antibody.',
        'Anti-A1 is not an IgE-defined antibody; the relevant issue is reagent-cell antigen expression.',
      ],
      [
        'Group O cells neutralize every cold-reactive antibody.',
        'Group O cells do not universally neutralize cold antibodies.',
      ],
      [
        'Group O cells lack the A1 antigen needed for the reaction.',
        'An antibody cannot be detected with cells that lack its target antigen; group O screen cells have no A1 antigen.',
      ],
    ],
    3,
    'A negative screen excludes only antibodies detectable with the antigens and conditions represented by that screen.',
    208,
    '4.4 Testing for Antibodies',
  ),

  item(
    'ubf-001',
    'urine-body-fluids',
    'Urine chemistry',
    'case',
    'A urine protein strip is negative, but a precipitation test is positive in a patient with suspected excess free immunoglobulin light chains. Which limitation explains the discrepancy?',
    [
      [
        'The strip is most sensitive to albumin and can miss light chains.',
        'Routine protein reagent strips respond preferentially to albumin; precipitation methods can detect a broader range of proteins.',
      ],
      [
        'Light chains cannot be excreted in urine.',
        'Free immunoglobulin light chains can appear in urine as Bence-Jones protein.',
      ],
      [
        'Every precipitation test is specific for albumin alone.',
        'Precipitation methods are less protein-class selective and can detect proteins that the strip misses.',
      ],
      [
        'A negative strip rules out all clinically important proteinuria.',
        'A negative strip does not exclude nonalbumin proteinuria or small amounts of albumin.',
      ],
    ],
    0,
    'Know the analyte selectivity of a screening test before using a negative result to exclude disease.',
    489,
    '7.1 Routine Physical and Biochemical Urine Tests',
  ),
  item(
    'ubf-002',
    'urine-body-fluids',
    'Urine microscopy',
    'case',
    'A patient has hematuria and unequivocal red blood cell casts. What is the most defensible localization of the bleeding?',
    [
      [
        'The urethra only',
        'Casts form within renal tubules, so an isolated urethral source does not explain red-cell casts.',
      ],
      [
        'The urinary bladder only',
        'Bladder bleeding can add free red cells but cannot create true renal casts.',
      ],
      [
        'A renal source',
        'Red cells incorporated into true casts establish that bleeding originated within the kidney, often with glomerular disease.',
      ],
      [
        'The finding cannot help localize bleeding',
        'True red-cell casts are useful because their formation requires the renal tubular environment.',
      ],
    ],
    2,
    'Free red cells have many possible sources; red-cell casts point to renal bleeding.',
    504,
    '7.2 Urine Microscopy and Clinical Correlations',
  ),
  item(
    'ubf-003',
    'urine-body-fluids',
    'Urine microscopy',
    'case',
    'In a patient with fever and bacteriuria, the sediment contains white blood cell casts. Which site of infection is most strongly supported?',
    [
      [
        'Isolated urethritis',
        'Lower tract inflammation can cause pyuria but does not account for true white-cell casts.',
      ],
      [
        'Renal involvement, as in pyelonephritis',
        'White cells incorporated into casts indicate renal inflammation; with bacteriuria and fever, pyelonephritis is supported.',
      ],
      [
        'Uncomplicated cystitis confined to the bladder',
        'Bladder infection can produce leukocytes and bacteria, but casts indicate involvement above the bladder.',
      ],
      [
        'An infection confined to the skin',
        'A skin infection alone does not explain bacteriuria and white-cell casts.',
      ],
    ],
    1,
    'White-cell casts indicate renal inflammation, although infection is not their only possible cause.',
    504,
    '7.2 Urine Microscopy and Clinical Correlations',
  ),
  item(
    'ubf-004',
    'urine-body-fluids',
    'Cerebrospinal fluid',
    'case',
    'CSF has marked pleocytosis with predominantly neutrophils, low glucose relative to blood, and increased protein. Which process is most strongly suggested?',
    [
      [
        'An uncomplicated normal CSF profile',
        'Marked pleocytosis, low glucose, and high protein are abnormal.',
      ],
      [
        'A purely traumatic tap with no other process',
        'Blood contamination alone does not establish this combined inflammatory biochemical pattern.',
      ],
      [
        'Typical uncomplicated viral meningitis',
        'Viral meningitis more commonly has lymphocytic predominance and preserved glucose, although exceptions occur.',
      ],
      [
        'Acute bacterial meningitis',
        'A neutrophilic inflammatory response with low glucose and high protein is a classic bacterial meningitis pattern; organism testing is still required.',
      ],
    ],
    3,
    'Interpret CSF cell differential together with glucose and protein; no single parameter identifies an organism.',
    515,
    '7.3 Cerebrospinal, Serous, and Synovial Fluids',
  ),
  item(
    'ubf-005',
    'urine-body-fluids',
    'Synovial fluid',
    'case',
    'A synovial fluid crystal appears yellow when its long axis is parallel to the slow axis of a compensator and blue when perpendicular. The crystals are needle shaped. Which interpretation fits?',
    [
      [
        'Monosodium urate crystals with negative birefringence',
        'Needle-shaped urate crystals show negative birefringence: yellow parallel and blue perpendicular to the compensator slow axis.',
      ],
      [
        'Calcium pyrophosphate crystals with positive birefringence',
        'Calcium pyrophosphate generally shows the reverse color relationship and is often rhomboid.',
      ],
      [
        'A result that excludes crystalline arthritis',
        'The described characteristic crystals support a crystalline arthritis rather than excluding it.',
      ],
      [
        'Proof that the specimen is sterile',
        'Crystal identification does not exclude a simultaneous infection; sterility requires appropriate microbiologic assessment.',
      ],
    ],
    0,
    'With compensated polarized light, urate is negatively birefringent; crystals do not rule out concurrent infection.',
    525,
    '7.3 Cerebrospinal, Serous, and Synovial Fluids',
  ),
  item(
    'ubf-006',
    'urine-body-fluids',
    'Urine chemistry',
    'recall',
    'Which urinary substance can suppress color development and produce a falsely negative nitrite reagent-strip result?',
    [
      [
        'Albumin',
        'Albumin is the principal target of the protein pad, not the classic reducing interference in the nitrite reaction.',
      ],
      [
        'Urea',
        'Urea is a normal urine constituent and is not the reducing interference described.',
      ],
      [
        'Ascorbic acid',
        'Ascorbate can reduce the diazonium reaction product and inhibit development of the nitrite test color.',
      ],
      [
        'Creatinine',
        'Creatinine reflects urine concentration in some applications, but it is not the classic reducing interference in this pad.',
      ],
    ],
    2,
    'A negative nitrite result does not exclude bacteriuria; reaction interference and biological conditions matter.',
    496,
    '7.1 Routine Physical and Biochemical Urine Tests',
  ),

  item(
    'micro-001',
    'microbiology',
    'Bacteriology',
    'case',
    'A slide coagulase test is negative on a staphylococcal isolate suspected to be S. aureus. Which follow-up best addresses a limitation of the slide method?',
    [
      [
        'Report that S. aureus has been definitively excluded',
        'Some S. aureus strains lack a positive slide reaction, so a negative slide test does not conclusively exclude the species.',
      ],
      [
        'Perform a tube coagulase test with appropriate controls',
        'The tube method detects free coagulase and can resolve a negative slide test, which detects bound clumping factor.',
      ],
      [
        'Perform only an oxidase test',
        'Oxidase does not directly resolve the bound-versus-free coagulase limitation in a suspected staphylococcus.',
      ],
      [
        'Assume the isolate is a streptococcus',
        "A negative coagulase test does not change the organism's established genus.",
      ],
    ],
    1,
    'Slide coagulase detects bound clumping factor; the tube test detects free coagulase.',
    609,
    '8.5 Gram-Positive and Gram-Negative Cocci',
  ),
  item(
    'micro-002',
    'microbiology',
    'Bacteriology',
    'case',
    'An alpha-hemolytic streptococcal isolate gives an equivocal optochin result. Which additional property supports identification as S. pneumoniae?',
    [
      [
        'Strong growth in 6.5% sodium chloride broth',
        'Salt tolerance is more useful in identifying enterococci and does not confirm pneumococcus.',
      ],
      [
        'Production of coagulase',
        'Coagulase is associated with selected staphylococci, rather than pneumococcal confirmation.',
      ],
      [
        'A positive germ-tube test',
        'Germ-tube testing is used in yeast identification, not streptococcal identification.',
      ],
      [
        'Bile solubility',
        'Pneumococci lyse in the presence of appropriate bile salts; this can help confirm an equivocal optochin identification.',
      ],
    ],
    3,
    'Combine optochin susceptibility with bile solubility when presumptive pneumococcal identification needs confirmation.',
    616,
    '8.5 Gram-Positive and Gram-Negative Cocci',
  ),
  item(
    'micro-003',
    'microbiology',
    'Bacteriology',
    'recall',
    'Among the following organisms, which is characteristically able to grow in 6.5% sodium chloride broth?',
    [
      [
        'Enterococcus faecalis',
        'Growth in 6.5% salt is a traditional characteristic used in presumptive identification of enterococci.',
      ],
      [
        'Streptococcus pneumoniae',
        'Pneumococcus is not characteristically salt tolerant at this concentration.',
      ],
      [
        'Streptococcus gallolyticus group (formerly S. bovis group)',
        'The traditional S. bovis group is differentiated from enterococci in part by lack of growth in 6.5% salt.',
      ],
      [
        'Viridans streptococci as a group',
        'Salt tolerance at this concentration is not the defining characteristic of viridans streptococci.',
      ],
    ],
    0,
    'Salt tolerance is one presumptive identification feature; interpret it with the full identification scheme.',
    616,
    '8.5 Gram-Positive and Gram-Negative Cocci',
  ),
  item(
    'micro-004',
    'microbiology',
    'Mycology',
    'case',
    'On germ-tube testing, a filament has a distinct constriction where it leaves the parent yeast cell. How should this structure be interpreted?',
    [
      [
        'A definitive positive result for C. albicans',
        'A true germ tube lacks constriction at its origin, so this structure alone does not establish a positive result.',
      ],
      [
        'An arthroconidium',
        'Arthroconidia arise from fragmentation of hyphae; the described budding filament is different.',
      ],
      [
        'A pseudohyphal structure rather than a true germ tube',
        'A constriction at the point of origin supports pseudohypha formation, which can mimic a germ tube.',
      ],
      [
        'A capsule demonstrated by negative staining',
        'A capsule appears as a surrounding clear zone with appropriate negative stains, not as a constricted filament.',
      ],
    ],
    2,
    'A true germ tube has no constriction at its junction with the parent yeast cell.',
    657,
    '8.9 Mycology',
  ),
  item(
    'micro-005',
    'microbiology',
    'Mycology',
    'recall',
    'Why is potassium hydroxide used when examining skin or nail scrapings for fungal elements?',
    [
      [
        'It specifically stains all fungal nuclei red',
        'KOH is a clearing agent rather than a nuclear stain.',
      ],
      [
        'It clears keratinous and cellular debris to improve visualization',
        'KOH clears background material in keratinized specimens, allowing fungal elements to be seen more readily.',
      ],
      [
        'It proves that all observed fungi are alive',
        'A KOH preparation demonstrates morphology and does not establish organism viability.',
      ],
      [
        'It identifies every fungus to species',
        'Direct morphology after clearing does not provide universal species-level identification.',
      ],
    ],
    1,
    'KOH improves direct visualization; culture or other testing may still be needed for identification.',
    655,
    '8.9 Mycology',
  ),
  item(
    'micro-006',
    'microbiology',
    'Virology',
    'recall',
    'An influenza rapid antigen assay is performed on a nasopharyngeal specimen. What does this type of assay seek to detect?',
    [
      [
        "Only the patient's anti-influenza IgG",
        'That would be an antibody assay; rapid respiratory antigen testing targets viral material.',
      ],
      [
        "Only the patient's anti-influenza IgE",
        'IgE is not the diagnostic target of a rapid influenza antigen test.',
      ],
      [
        'Bacterial peptidoglycan',
        'Influenza is a virus and does not have a bacterial peptidoglycan cell wall.',
      ],
      [
        'Influenza viral antigens, such as nucleoprotein',
        'Rapid influenza antigen tests detect viral protein antigens, allowing testing without waiting for a host antibody response.',
      ],
    ],
    3,
    "Distinguish detection of the infectious agent's antigen from detection of the patient's antibody response.",
    154,
    '3.3 Infectious Diseases',
  ),

  item(
    'para-001',
    'parasitology',
    'Intestinal protozoa',
    'case',
    'Several hikers develop giardiasis after drinking untreated stream water. Which stage most plausibly survived in the water and initiated intestinal infection?',
    [
      [
        'A Giardia cyst',
        'Ingestion of environmentally resistant Giardia cysts in contaminated water is a principal route of infection.',
      ],
      ['A Giardia egg', 'Giardia is a protozoan and does not produce helminth eggs.'],
      ['A cercaria', 'Cercariae are trematode larval stages, not stages of Giardia.'],
      ['A microfilaria', 'Microfilariae are stages of filarial nematodes, not Giardia.'],
    ],
    0,
    'For waterborne giardiasis, the infective form is the cyst.',
    685,
    '8.11 Parasitology',
  ),
  item(
    'para-002',
    'parasitology',
    'Intestinal protozoa',
    'case',
    'A stool trophozoite has an amebic nucleus and clearly ingested intact red blood cells. Which organism is most strongly supported by this finding?',
    [
      [
        'Entamoeba coli',
        'This intestinal ameba is not characteristically identified by red-cell ingestion.',
      ],
      [
        'Giardia duodenalis',
        'Giardia is a flagellate with a different morphology; erythrophagocytosis is not its diagnostic feature.',
      ],
      [
        'Entamoeba histolytica',
        'Erythrophagocytosis in a compatible trophozoite strongly supports E. histolytica. Without this feature, morphology alone often cannot separate it from E. dispar.',
      ],
      [
        'Iodamoeba butschlii',
        'This ameba is associated with a prominent glycogen vacuole in cysts, rather than characteristic erythrophagocytosis.',
      ],
    ],
    2,
    'Ingested red cells are a strong clue to E. histolytica; molecular or antigen testing can improve species discrimination.',
    687,
    '8.11 Parasitology',
  ),
  item(
    'para-003',
    'parasitology',
    'Nematodes',
    'case',
    'A rhabditiform larva in a stool preparation has a short buccal cavity and a conspicuous genital primordium. Which identification fits best?',
    [
      [
        'Hookworm larva',
        'Hookworm rhabditiform larvae have a longer buccal cavity and a less conspicuous genital primordium.',
      ],
      [
        'Strongyloides stercoralis',
        'A short buccal cavity with a large genital primordium is the classic rhabditiform Strongyloides pattern.',
      ],
      ['Schistosoma haematobium egg', 'A schistosome egg is not a rhabditiform nematode larva.'],
      [
        'Giardia cyst',
        'Giardia cysts are protozoan structures and do not have nematode larval anatomy.',
      ],
    ],
    1,
    'For rhabditiform larvae: Strongyloides has a short mouth and prominent genital primordium.',
    687,
    '8.11 Parasitology',
  ),
  item(
    'para-004',
    'parasitology',
    'Trematodes',
    'recall',
    'A laboratory is selecting a specimen for suspected urinary schistosomiasis. Which parasite is specifically associated with recovery of eggs from urine?',
    [
      [
        'Taenia saginata',
        'The adult beef tapeworm inhabits the intestine, with eggs or proglottids sought in stool.',
      ],
      [
        'Trichuris trichiura',
        'Whipworm inhabits the large intestine and its eggs are detected in stool.',
      ],
      [
        'Enterobius vermicularis',
        'Pinworm eggs are primarily collected from perianal skin rather than urine.',
      ],
      [
        'Schistosoma haematobium',
        'Adult S. haematobium inhabit venous plexuses associated with the bladder, and eggs are commonly recovered from urine.',
      ],
    ],
    3,
    'Match parasite biology to the specimen: urinary eggs strongly suggest S. haematobium.',
    687,
    '8.11 Parasitology',
  ),
  item(
    'para-005',
    'parasitology',
    'Cestodes',
    'case',
    'A person develops tissue cysticercosis after ingesting Taenia solium eggs. What role does the person occupy in this infection?',
    [
      [
        'Intermediate host',
        'Ingested eggs release larvae that develop into cysticerci in human tissues, so the person is an accidental intermediate host.',
      ],
      [
        'Definitive host because an adult worm must be present',
        'Humans are definitive hosts when an adult tapeworm develops in the intestine after ingestion of cysticerci, not eggs.',
      ],
      [
        'Arthropod vector',
        'T. solium tissue infection does not make the person an arthropod vector.',
      ],
      [
        'A host with no developing parasite',
        'Tissue cysticerci represent developing parasites, so this is a true infection.',
      ],
    ],
    0,
    'T. solium eggs lead to cysticercosis; cysticerci in pork lead to intestinal taeniasis.',
    689,
    '8.11 Parasitology',
  ),
  item(
    'para-006',
    'parasitology',
    'Blood parasites',
    'case',
    'A returning traveler with malaria develops marked hemolysis and cerebral involvement. Which of these species has the strongest classic association with this severe pattern?',
    [
      [
        'Plasmodium malariae',
        'P. malariae causes malaria, but the described cerebral, severe multiorgan pattern is classically associated with P. falciparum.',
      ],
      [
        'Plasmodium ovale',
        'P. ovale can cause relapse through dormant liver stages, but is not the strongest match to this severe pattern.',
      ],
      [
        'Plasmodium falciparum',
        'P. falciparum is strongly associated with severe malaria, including cerebral involvement and marked hemolysis.',
      ],
      [
        'Plasmodium vivax',
        'P. vivax can cause severe disease, but among these options the classic strongest association is P. falciparum.',
      ],
    ],
    2,
    'Severe cerebral malaria strongly suggests P. falciparum, while other species can also cause serious disease.',
    691,
    '8.11 Parasitology',
  ),

  item(
    'hema-001',
    'hematology',
    'RBC indices',
    'case',
    'A CBC shows hematocrit 30% and an RBC count of 4.0 x 10^12/L. What is the calculated mean corpuscular volume?',
    [
      [
        '7.5 fL',
        'This omits the factor of 10 when using hematocrit as a percentage and RBC count in millions per microliter.',
      ],
      ['75 fL', 'MCV = hematocrit (%) x 10 / RBC count (10^12/L) = 30 x 10 / 4.0 = 75 fL.'],
      ['120 fL', 'This reverses or misapplies the relationship; the calculated MCV is 75 fL.'],
      ['133 fL', 'This does not follow the MCV formula for the supplied hematocrit and RBC count.'],
    ],
    1,
    'MCV in fL = Hct (%) x 10 / RBC count (millions per microliter).',
    23,
    '1.1 Basic Hematology Concepts and Laboratory Procedures',
  ),
  item(
    'hema-002',
    'hematology',
    'Anemias',
    'case',
    'A patient has microcytic, hypochromic red cells, low ferritin, and increased total iron-binding capacity. Which explanation best integrates these findings?',
    [
      [
        'An isolated folate deficiency',
        'Folate deficiency typically produces megaloblastic macrocytosis, not this classic iron profile.',
      ],
      [
        'A high iron-store state',
        'Low ferritin in the given context argues against increased iron stores.',
      ],
      [
        'A purely acute hemorrhage with no depletion of iron stores',
        'Acute hemorrhage alone is usually initially normocytic and does not explain established low ferritin and microcytosis.',
      ],
      [
        'Iron deficiency anemia',
        'Depleted iron stores lower ferritin, while transferrin-related binding capacity rises; restricted hemoglobin production produces microcytosis and hypochromia.',
      ],
    ],
    3,
    'Interpret ferritin with inflammation and clinical context; low ferritin plus high TIBC is a classic iron-deficiency pattern.',
    38,
    '1.3 Hypochromic and Microcytic Anemias',
  ),
  item(
    'hema-003',
    'hematology',
    'Anemias',
    'case',
    'Macro-ovalocytes and hypersegmented neutrophils are seen on a blood film. Which process is the best overall match?',
    [
      [
        'Impaired DNA synthesis causing megaloblastic hematopoiesis',
        'Vitamin B12 or folate deficiency can impair DNA synthesis and produce macro-ovalocytes with neutrophil hypersegmentation.',
      ],
      [
        'An isolated lack of iron for heme synthesis',
        'Iron deficiency characteristically produces microcytic, hypochromic cells rather than this combination.',
      ],
      [
        'An ABO incompatibility defined solely by the smear',
        'ABO incompatibility requires serologic and clinical evidence; this film pattern does not establish it.',
      ],
      [
        'A finding that definitively separates vitamin B12 from folate deficiency',
        'Both deficiencies may show megaloblastic morphology, so the smear does not by itself distinguish them.',
      ],
    ],
    0,
    'Megaloblastic morphology suggests a DNA-synthesis problem; determine the underlying cause with additional testing.',
    42,
    '1.4 Macrocytic and Normochromic Anemias',
  ),
  item(
    'hema-004',
    'hematology',
    'Leukocyte disorders',
    'recall',
    'An unequivocal Auer rod is identified within a blast. Which lineage does this finding support?',
    [
      [
        'Mature plasma-cell lineage',
        'Auer rods are not a defining structure of mature plasma cells.',
      ],
      [
        'Erythroid lineage',
        'Auer rods are not hemoglobin inclusions or an erythroid lineage marker.',
      ],
      [
        'Myeloid lineage',
        'Auer rods are aggregates of primary granules and support myeloid differentiation rather than lymphoblastic differentiation.',
      ],
      [
        'A normal mature lymphocyte',
        'Auer rods in a blast are abnormal and do not describe a normal mature lymphocyte.',
      ],
    ],
    2,
    'Auer rods support myeloid differentiation; their absence does not rule out AML.',
    50,
    '1.6 Acute Leukemias',
  ),
  item(
    'hema-005',
    'hematology',
    'Hemostasis',
    'case',
    "A prolonged clotting time corrects after mixing the patient's plasma 1:1 with normal pooled plasma, and the correction persists under the laboratory's validated incubation protocol. Which explanation is most supported?",
    [
      [
        'An inhibitor that necessarily remains active after mixing',
        'A strong persistent inhibitor often prevents correction, although mixing-study interpretation requires validated criteria and awareness of weak inhibitors.',
      ],
      [
        'A coagulation factor deficiency supplied by normal plasma',
        'Normal plasma supplies deficient coagulation factors, allowing correction. This pattern supports deficiency, though it does not identify the factor by itself.',
      ],
      [
        'Proof of a normal original patient specimen',
        'The original prolonged time remains abnormal; correction provides a clue to its cause.',
      ],
      [
        'Identification of a specific factor without further testing',
        'Mixing alone does not identify the particular deficient factor; targeted assays may be needed.',
      ],
    ],
    1,
    "Correction supports factor deficiency; lack of correction suggests inhibition. Apply the laboratory's time and interpretation criteria.",
    102,
    '2.4 Inhibitors, Thrombotic Disorders, and Anticoagulant Drugs',
  ),
  item(
    'hema-006',
    'hematology',
    'Specimen quality',
    'case',
    'A citrate tube intended for routine PT and aPTT testing is substantially underfilled. Why can this produce spuriously prolonged clotting times?',
    [
      [
        'The sample contains no anticoagulant',
        'The problem is excess citrate relative to blood, not absence of anticoagulant.',
      ],
      [
        'The sample automatically has more coagulation factors',
        "Underfilling does not increase the patient's factor concentration.",
      ],
      [
        'Citrate permanently eliminates all plasma proteins',
        'Citrate acts by binding calcium; it does not remove every plasma protein.',
      ],
      [
        'Excess citrate relative to blood binds more of the calcium added during testing',
        'The intended blood-to-citrate ratio is approximately 9:1. Underfilling leaves disproportionate citrate and can impair recalcification during the assay.',
      ],
    ],
    3,
    'Correct fill volume preserves the blood-to-citrate ratio; also consider citrate adjustment for markedly high hematocrit.',
    84,
    '2.1 Coagulation and Fibrinolytic Systems/Reagents and Methods',
  ),

  item(
    'hml-001',
    'histopathology-lab-management-laws',
    'Laboratory statistics',
    'case',
    'A control material has a mean of 100 units and a standard deviation of 2 units. What is its coefficient of variation?',
    [
      ['2%', 'CV = standard deviation / mean x 100 = 2 / 100 x 100 = 2%.'],
      ['0.02%', 'The ratio is 0.02, but converting it to a percentage gives 2%.'],
      ['50%', 'This reverses the relationship between mean and standard deviation.'],
      [
        '200%',
        'This fails to divide the standard deviation by the mean before converting to a percentage.',
      ],
    ],
    0,
    'CV expresses imprecision relative to the mean, allowing comparisons across concentration levels.',
    26,
    '1.1 Basic Hematology Concepts and Laboratory Procedures',
  ),
  item(
    'hml-002',
    'histopathology-lab-management-laws',
    'Quality assessment',
    'case',
    'Among 100 people known not to have a disease, a test gives 95 negative and 5 positive results. What is its diagnostic specificity in this group?',
    [
      ['5%', 'Five percent is the false-positive rate among the disease-negative people.'],
      ['100%', 'Five false positives mean the specificity is below 100%.'],
      [
        '95%',
        'Specificity = true negatives / (true negatives + false positives) = 95 / 100 = 95%.',
      ],
      [
        'Cannot be calculated without the number of true positives',
        'True positives are needed for some other measures; specificity uses disease-negative people only.',
      ],
    ],
    2,
    'Specificity describes correct negative classification among people without the condition.',
    273,
    '5 Laboratory Operations',
  ),
  item(
    'hml-003',
    'histopathology-lab-management-laws',
    'Management',
    'case',
    'A supervisor gives a qualified technologist a defined improvement task, the authority to carry it out, an agreed deadline, and a follow-up review. Which management process is illustrated?',
    [
      [
        'Abandoning accountability',
        'An agreed review and clear responsibility preserve accountability rather than abandoning it.',
      ],
      [
        'Delegation',
        'Effective delegation assigns a suitable task with responsibility, authority, clear expectations, and evaluation.',
      ],
      [
        'Random assignment without direction',
        'The task, authority, deadline, and review are explicitly defined, so the assignment is structured.',
      ],
      [
        'Removing all employee decision-making',
        'Delegated authority allows the employee to act within the agreed scope.',
      ],
    ],
    1,
    'Delegate responsibility with the authority, resources, expectations, and follow-up needed to complete the task.',
    1060,
    '14 Laboratory Management',
    'SUCCESS! in Clinical Laboratory Science',
    '4th edition (Ciulla and Lehman)',
  ),
  item(
    'hml-004',
    'histopathology-lab-management-laws',
    'Histopathology',
    'case',
    'A tissue specimen is promptly placed in an appropriate fixative before routine processing. What is the principal purpose of this step?',
    [
      [
        'Remove all paraffin from a mounted section',
        'Deparaffinization occurs after sectioning and is not the purpose of initial fixation.',
      ],
      [
        'Replace all tissue water directly with paraffin',
        'Dehydration, clearing, and infiltration are later processing steps; initial fixation does not accomplish all three.',
      ],
      [
        'Produce the final differential stain',
        'Fixation preserves the specimen; a later staining procedure creates the differential colors.',
      ],
      [
        'Preserve tissue structure by limiting autolytic and postmortem change',
        'Fixation stabilizes tissue constituents and reduces degradative changes so that morphology can be examined.',
      ],
    ],
    3,
    'Fixation preserves morphology; dehydration, clearing, infiltration, sectioning, and staining have different roles.',
    446,
    'VII Review of Histology Technique',
    "Alba's Medical Technology Board Examination Review, Volume II",
    '3rd edition (1973; stable basic principle)',
  ),
  item(
    'hml-005',
    'histopathology-lab-management-laws',
    'Histopathology',
    'recall',
    'During routine paraffin tissue processing, progressively stronger alcohol solutions are used before clearing. Which process is being performed?',
    [
      [
        'Dehydration',
        'Alcohol removes tissue water so that subsequent clearing and paraffin infiltration can proceed.',
      ],
      [
        'Decalcification',
        'Decalcification removes calcium salts, typically with a suitable acid or chelating method, rather than simply graded alcohol.',
      ],
      [
        'Microtomy',
        'Microtomy cuts thin tissue sections and is a mechanical step after embedding.',
      ],
      [
        'Coverslipping',
        'Coverslipping protects the finished stained section and is performed much later.',
      ],
    ],
    0,
    'The processing sequence assigns distinct tasks: alcohol dehydrates, a clearing agent bridges to paraffin, and paraffin infiltrates.',
    445,
    'VII Review of Histology Technique',
    "Alba's Medical Technology Board Examination Review, Volume II",
    '3rd edition (1973; stable basic principle)',
  ),
  item(
    'hml-006',
    'histopathology-lab-management-laws',
    'Management',
    'recall',
    'A manager documents expected laboratory revenue and planned expenses for the next financial period. What is this plan called?',
    [
      [
        'A calibration curve',
        'A calibration curve relates analytical response to known analyte concentration.',
      ],
      [
        'A reference interval',
        'A reference interval describes a distribution of measurements in a defined reference population.',
      ],
      [
        'A budget',
        'A budget is a financial plan of expected income and expenditures for a defined period.',
      ],
      [
        'An antibody panel',
        'An antibody panel is a set of characterized reagent cells used in immunohematology.',
      ],
    ],
    2,
    'A budget translates operational plans into anticipated revenue and expenses.',
    65,
    'General Laboratory Principles',
    'Apollon Reviewer',
    'Edition not stated in supplied scan',
  ),
  ...rodakQuestions,
  ...strasingerQuestions,
  ...harrExpansionQuestions,
  ...harrLaboratoryQuestions,
  ...referenceRefreshQuestions,
];
