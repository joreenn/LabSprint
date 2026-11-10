import type { Question } from './types';

const references = {
  linne: [
    "Linné & Ringsrud's Clinical Laboratory Science: Concepts, Procedures, and Clinical Applications",
    '7th edition (Turgeon, 2016)',
  ],
  elsevier: [
    "Elsevier's Medical Laboratory Science Examination Review",
    '1st edition (Graeter et al., 2015)',
  ],
  ciulla: ['SUCCESS! in Clinical Laboratory Science', '4th edition (Ciulla and Lehman)'],
  jarreau: [
    'Clinical Laboratory Science Review: A Bottom Line Approach',
    '5th edition (Jarreau, 2015)',
  ],
  alba: ["Alba's Medical Technology Board Examination Review", 'Volume 2 (1973)'],
} as const;

type Choice = readonly [text: string, rationale: string];
function item(
  id: string,
  subjectId: string,
  topic: string,
  kind: Question['kind'],
  stem: string,
  options: readonly [Choice, Choice, Choice, Choice],
  correctIndex: number,
  takeaway: string,
  reference: keyof typeof references,
  pdfPage: number,
  chapter: string,
): Question {
  const [title, edition] = references[reference];
  return {
    id,
    subjectId,
    topic,
    kind,
    difficulty: kind === 'case' ? 'Application' : 'Foundation',
    stem,
    options: options.map(([text, rationale], index) => ({
      id: String.fromCharCode(65 + index),
      text,
      rationale,
    })),
    correctOptionId: String.fromCharCode(65 + correctIndex),
    takeaway,
    source: { title, edition, pdfPage, chapter },
    version: 1,
  };
}

// Original teaching items; citations use 1-based PDF-viewer pages.
// Source checks, exclusions, and objective-overlap review: docs/CONTENT-REFRESH-2026-11-11.md.
export const returnedReviewerQuestions: Question[] = [
  item(
    'cc-r26-001',
    'chemistry',
    'Lipids and lipoproteins',
    'case',
    'A teaching diagram follows dietary triglycerides from intestinal absorption into the circulation. Which lipoprotein should label the particle that initially carries most of this absorbed triglyceride?',
    [
      [
        'LDL',
        'LDL principally delivers cholesterol and is not the initial transporter of dietary triglycerides.',
      ],
      [
        'Chylomicron',
        'Intestinal cells package absorbed dietary triglycerides into chylomicrons for transport.',
      ],
      [
        'HDL',
        'HDL participates in cholesterol transport rather than serving as the primary carrier of absorbed dietary triglycerides.',
      ],
      ['VLDL', 'VLDL is secreted by the liver and chiefly transports endogenous triglycerides.'],
    ],
    1,
    'Chylomicrons carry exogenous dietary triglycerides; hepatic VLDL carries endogenous triglycerides.',
    'ciulla',
    55,
    'Clinical Chemistry: lipoprotein transport',
  ),
  item(
    'cc-r26-002',
    'chemistry',
    'Enzymes',
    'case',
    'An alkaline phosphatase result is elevated. Which accompanying result supports a hepatobiliary contribution rather than an isolated increase from bone?',
    [
      [
        'An increased GGT activity',
        'GGT is associated with hepatobiliary disease and is not increased by bone disease alone. The combination supports a hepatic contribution.',
      ],
      [
        'A normal glucose result',
        'Glucose does not distinguish the liver and bone sources of alkaline phosphatase.',
      ],
      [
        'An increased bone-specific alkaline phosphatase fraction',
        'A bone-specific fraction supports a bone contribution rather than identifying hepatobiliary origin.',
      ],
      [
        'A normal sodium result',
        'Sodium does not identify the tissue source of elevated alkaline phosphatase.',
      ],
    ],
    0,
    'Use GGT to support interpretation of an elevated ALP; the paired result does not establish a specific diagnosis.',
    'ciulla',
    67,
    'Clinical Chemistry: GGT and alkaline phosphatase',
  ),
  item(
    'cc-r26-003',
    'chemistry',
    'Lipids and lipoproteins',
    'case',
    'For a specimen suitable for the Friedewald calculation, total cholesterol is 210 mg/dL, HDL cholesterol 50 mg/dL, and triglycerides 150 mg/dL. Using LDL = total cholesterol - HDL - triglycerides/5, what is calculated LDL cholesterol?',
    [
      ['10 mg/dL', 'This subtracts all triglycerides instead of the triglycerides/5 estimate.'],
      ['160 mg/dL', 'This subtracts HDL but omits the triglycerides/5 term.'],
      ['190 mg/dL', 'This adds rather than subtracts the triglycerides/5 estimate.'],
      [
        '130 mg/dL',
        '210 - 50 - (150/5) = 130 mg/dL. This uses the supplied formula and its stated suitability assumption.',
      ],
    ],
    3,
    'The Friedewald equation estimates VLDL cholesterol as triglycerides/5 when concentrations are expressed in mg/dL and its assumptions apply.',
    'ciulla',
    59,
    'Clinical Chemistry: calculated LDL cholesterol',
  ),
  item(
    'cc-r26-004',
    'chemistry',
    'Liver function',
    'recall',
    'In the Jendrassik-Grof total bilirubin method, what is the purpose of the caffeine-benzoate accelerator?',
    [
      [
        'To remove all conjugated bilirubin before measurement',
        'The total bilirubin reaction includes conjugated bilirubin rather than discarding it.',
      ],
      [
        'To convert bilirubin to hemoglobin',
        'Bilirubin is a heme breakdown product; this method does not rebuild hemoglobin.',
      ],
      [
        'To enable unconjugated bilirubin to participate in the diazo reaction',
        'The accelerator makes albumin-bound unconjugated bilirubin available to react, allowing total bilirubin measurement.',
      ],
      [
        'To measure plasma sodium by ion exchange',
        'This reagent has a role in bilirubin chemistry, not sodium potentiometry.',
      ],
    ],
    2,
    'An accelerator allows the unconjugated fraction to react in total bilirubin diazo methods.',
    'jarreau',
    132,
    'Clinical Chemistry: bilirubin methods',
  ),
  item(
    'cc-r26-005',
    'chemistry',
    'Acid-base and electrolytes',
    'case',
    'Measured serum osmolality is 318 mOsm/kg and the laboratory calculation gives 288 mOsm/kg. Define the osmolal gap as measured minus calculated osmolality. What conclusion follows?',
    [
      [
        'The gap is -30 mOsm/kg and identifies the missing solute.',
        'The subtraction order is reversed, and the gap alone cannot identify a solute.',
      ],
      [
        'The gap is 30 mOsm/kg and does not by itself identify the responsible solute.',
        '318 - 288 = 30 mOsm/kg. A positive discrepancy is nonspecific and needs clinical and analytical interpretation.',
      ],
      ['The gap is 606 mOsm/kg.', 'Adding the two osmolalities does not calculate their gap.'],
      [
        'The gap is zero because both results have the same units.',
        'Common units permit subtraction; they do not make unequal values identical.',
      ],
    ],
    1,
    'An osmolal gap is a measured-calculated discrepancy, not identification of a particular alcohol or toxin.',
    'ciulla',
    76,
    'Clinical Chemistry: osmolality and osmolal gap',
  ),
  item(
    'cc-r26-006',
    'chemistry',
    'Enzymes',
    'recall',
    'An inhibitor binds only after the substrate has bound, forming an inactive enzyme-substrate-inhibitor complex. Which inhibition pattern does this describe?',
    [
      [
        'Competitive inhibition',
        'A competitive inhibitor competes with substrate for free enzyme rather than binding only the enzyme-substrate complex.',
      ],
      [
        'Pure noncompetitive inhibition',
        'Pure noncompetitive inhibition involves binding to both free enzyme and the enzyme-substrate complex.',
      ],
      [
        'Enzyme activation',
        'Formation of an inactive complex reduces catalysis; it is not activation.',
      ],
      [
        'Uncompetitive inhibition',
        'An uncompetitive inhibitor binds the enzyme-substrate complex rather than free enzyme.',
      ],
    ],
    3,
    'Uncompetitive inhibition requires the enzyme-substrate complex as the inhibitor-binding target.',
    'ciulla',
    61,
    'Clinical Chemistry: enzyme inhibition',
  ),

  item(
    'ibb-r26-001',
    'immunoserology-blood-banking',
    'Antiglobulin testing',
    'case',
    'A tube antiglobulin test shows no agglutination. Added IgG-sensitized check cells also fail to agglutinate. How should the original tube result be handled?',
    [
      [
        'Accept it as a valid negative.',
        'A valid negative tube AHG result requires the expected check-cell reaction.',
      ],
      [
        'Report the patient as DAT-positive.',
        'Failure of the control does not demonstrate patient red-cell sensitization.',
      ],
      [
        'Treat it as invalid and repeat after resolving the control failure.',
        'Nonreactive check cells fail to verify active AHG in the tube; the apparent negative cannot be accepted.',
      ],
      [
        'Convert it to a positive antibody screen automatically.',
        'Control failure invalidates interpretation; it does not establish a patient antibody.',
      ],
    ],
    2,
    'IgG-sensitized check cells must react when used to validate a negative tube antiglobulin result.',
    'elsevier',
    351,
    'Immunohematology: validation of negative AHG tests',
  ),
  item(
    'ibb-r26-002',
    'immunoserology-blood-banking',
    'Antibody identification',
    'case',
    'An antibody investigation uses reagent red cells treated with dithiothreitol (DTT). Why cannot a negative reaction with these cells alone exclude anti-K?',
    [
      [
        'DTT destroys Kell antigens on the reagent cells.',
        'The relevant K target is lost with DTT treatment, so absence of reactivity cannot exclude anti-K.',
      ],
      [
        'DTT converts every red cell to group AB.',
        'DTT does not create A and B antigens on all reagent cells.',
      ],
      [
        'DTT selectively increases K expression.',
        'Kell antigens are destroyed rather than enhanced by DTT.',
      ],
      ['Anti-K recognizes only white cells.', 'Anti-K is directed against the K red-cell antigen.'],
    ],
    0,
    'Antigen destruction limits the antibodies that can be excluded using chemically treated panel cells.',
    'elsevier',
    351,
    'Immunohematology: DTT-sensitive Kell antigens',
  ),
  item(
    'ibb-r26-003',
    'immunoserology-blood-banking',
    'Blood groups',
    'recall',
    'What makes the relationship between Lewis antigens and circulating red cells different from that of many intrinsic red-cell antigens?',
    [
      [
        'Lewis antigens occur only inside the red-cell nucleus.',
        'Mature circulating red cells have no nucleus; Lewis antigens are expressed at their surface.',
      ],
      [
        'Lewis antigens are identical to Rh proteins.',
        'Lewis carbohydrate structures and Rh membrane proteins belong to different systems.',
      ],
      [
        'Lewis antigens are antibodies secreted by red cells.',
        'Antigens are targets of recognition, not antibodies secreted by erythrocytes.',
      ],
      [
        'Lewis substances are formed in tissues and adsorbed from plasma onto red cells.',
        'Red cells acquire Lewis glycolipids from plasma rather than synthesizing their Lewis antigens intrinsically.',
      ],
    ],
    3,
    'Lewis red-cell phenotypes reflect adsorption of circulating Lewis substances.',
    'elsevier',
    219,
    'Immunohematology: Lewis blood group system',
  ),
  item(
    'ibb-r26-004',
    'immunoserology-blood-banking',
    'Blood groups',
    'case',
    'A lesson contrasts red-cell ABO typing with soluble ABH substances in saliva. Which genetic activity is directly associated with formation of H substance in secretions?',
    [
      [
        'Expression of the D antigen',
        'RhD expression concerns a red-cell protein, not synthesis of soluble H substance.',
      ],
      [
        'A functional Se allele',
        'The secretor gene product acts on type 1 precursor chains to form H substance in secretions.',
      ],
      [
        'Loss of all A and B transferases alone',
        'An ABO group O phenotype does not by itself establish secretor status.',
      ],
      [
        'Synthesis of an immunoglobulin light chain',
        'Antibody light-chain synthesis is unrelated to secretor glycosyltransferase activity.',
      ],
    ],
    1,
    'Red-cell ABO typing and ABH secretor status concern related carbohydrates but different genetic activities.',
    'elsevier',
    214,
    'Immunohematology: H and secretor genes',
  ),
  item(
    'ibb-r26-005',
    'immunoserology-blood-banking',
    'Blood groups',
    'case',
    'An ABO teaching table lists naturally occurring anti-A and anti-B in plasma, assuming ordinary ABO phenotypes. Which group normally lacks both antibodies?',
    [
      ['Group O', 'Group O plasma normally contains both anti-A and anti-B.'],
      ['Group A', 'Group A plasma normally contains anti-B.'],
      [
        'Group AB',
        'Group AB individuals express both A and B antigens and normally lack the corresponding anti-A and anti-B.',
      ],
      ['Group B', 'Group B plasma normally contains anti-A.'],
    ],
    2,
    'Distinguish red-cell ABO antigens from the expected antibodies in the plasma compartment.',
    'elsevier',
    216,
    'Immunohematology: expected ABO plasma antibodies',
  ),
  item(
    'ibb-r26-006',
    'immunoserology-blood-banking',
    'Antibody identification',
    'recall',
    'In paroxysmal cold hemoglobinuria, which description fits the classic Donath-Landsteiner antibody?',
    [
      [
        'A biphasic IgG anti-P that binds in the cold and causes complement-mediated lysis on warming',
        'The classic antibody sensitizes cells and fixes complement in the cold; hemolysis occurs during warming to 37 degrees Celsius.',
      ],
      [
        'An IgE antibody against pollen',
        'IgE-mediated allergy does not describe the Donath-Landsteiner hemolysin.',
      ],
      [
        'An enzyme that synthesizes ABO antigens',
        'A glycosyltransferase is not the biphasic hemolytic antibody.',
      ],
      [
        'An IgM anti-I that is by definition identical to the Donath-Landsteiner antibody',
        'Cold agglutinins such as anti-I are distinct from the classic biphasic IgG anti-P.',
      ],
    ],
    0,
    'The Donath-Landsteiner hemolysin is classically biphasic IgG anti-P.',
    'elsevier',
    351,
    'Immunohematology: paroxysmal cold hemoglobinuria',
  ),

  item(
    'ubf-r26-001',
    'urine-body-fluids',
    'Urine microscopy',
    'case',
    'An oval fat body contains droplets producing Maltese-cross patterns under polarized light. Which lipid component is responsible for this birefringence?',
    [
      [
        'Hemoglobin',
        'Hemoglobin is a heme protein and does not account for the lipid Maltese-cross pattern.',
      ],
      [
        'Cholesterol esters',
        'Cholesterol esters in lipid droplets are birefringent. Starch artifacts can also form crosses, so cell morphology still matters.',
      ],
      [
        'Neutral triglycerides alone',
        'Neutral fat does not produce the characteristic cholesterol-ester birefringence.',
      ],
      ['Urea', 'Dissolved urea does not produce the intracellular lipid pattern.'],
    ],
    1,
    'Interpret Maltese crosses with cell and droplet morphology; the pattern alone is not specific for oval fat bodies.',
    'linne',
    437,
    'Urinalysis: lipid droplets and oval fat bodies',
  ),
  item(
    'ubf-r26-002',
    'urine-body-fluids',
    'Urine microscopy',
    'case',
    'A urine sediment at alkaline pH contains colorless rectangular prisms with a coffin-lid appearance. Which crystal type best fits these findings?',
    [
      ['Cystine', 'Cystine typically forms colorless hexagonal plates, usually in acidic urine.'],
      [
        'Uric acid',
        'Uric acid commonly has rhombic or rosette forms in acidic urine rather than classic coffin lids.',
      ],
      [
        'Ammonium biurate',
        'Ammonium biurate commonly resembles thorny spheres rather than rectangular coffin lids.',
      ],
      [
        'Triple phosphate (struvite)',
        'Magnesium ammonium phosphate commonly forms coffin-lid prisms in alkaline urine.',
      ],
    ],
    3,
    'Combine crystal morphology with urine pH; coffin-lid struvite crystals favor alkaline urine.',
    'linne',
    448,
    'Urinalysis: normal alkaline crystals',
  ),
  item(
    'ubf-r26-003',
    'urine-body-fluids',
    'Urine chemistry',
    'case',
    'A urine specimen is left exposed to light and air before urobilinogen testing. Which chemical change can lower the detectable urobilinogen?',
    [
      [
        'Oxidation of urobilinogen to urobilin',
        'Urobilinogen is unstable and oxidizes to urobilin, reducing the amount available for the urobilinogen reaction.',
      ],
      [
        'Conversion of urobilinogen into glucose',
        'Urobilinogen is not converted to glucose during specimen storage.',
      ],
      [
        'Conversion of all urinary protein into urobilinogen',
        'Protein degradation does not generate urobilinogen in the collection container.',
      ],
      [
        'Creation of conjugated bilirubin from sodium',
        'Sodium is not a precursor of bilirubin, and this does not explain urobilinogen loss.',
      ],
    ],
    0,
    'Use appropriately handled fresh urine for urobilinogen testing because oxidation can cause a falsely low result.',
    'linne',
    429,
    'Urinalysis: urobilinogen stability',
  ),
  item(
    'ubf-r26-004',
    'urine-body-fluids',
    'Cerebrospinal fluid',
    'case',
    'After centrifugation, a CSF specimen has a yellow supernatant. Which term describes this appearance without assigning its cause?',
    [
      [
        'Pleocytosis',
        'Pleocytosis denotes increased cells and does not name a yellow supernatant.',
      ],
      [
        'A positive Gram stain',
        'Color alone cannot establish the presence or Gram reaction of bacteria.',
      ],
      [
        'Xanthochromia',
        'Xanthochromia describes yellow discoloration of CSF supernatant; pigment sources and the clinical setting must be assessed separately.',
      ],
      [
        'A definitive diagnosis of subarachnoid hemorrhage',
        'A yellow supernatant has several possible causes and cannot alone establish that diagnosis.',
      ],
    ],
    2,
    'Xanthochromia is an observed supernatant color; its interpretation requires additional evidence.',
    'linne',
    470,
    'Body fluids: CSF color and xanthochromia',
  ),
  item(
    'ubf-r26-005',
    'urine-body-fluids',
    'Other body fluids',
    'case',
    'A stool preparation stained with Sudan III shows many orange-red droplets. Which component is this stain intended to demonstrate?',
    [
      [
        'Human globin',
        'Immunochemical fecal blood tests target human globin; Sudan III is a fat stain.',
      ],
      [
        'Fat',
        'Sudan III demonstrates fecal fat droplets and can support investigation of steatorrhea. It does not identify its cause.',
      ],
      ['Parasite DNA', 'Nucleic acid targets require molecular testing, not a Sudan fat stain.'],
      ['Leukocyte nuclei', 'Sudan III is not a nuclear stain for counting fecal leukocytes.'],
    ],
    1,
    'A positive fecal fat stain demonstrates lipid; it does not determine the cause of malabsorption.',
    'ciulla',
    954,
    'Urinalysis and body fluids: fecal fat examination',
  ),
  item(
    'ubf-r26-006',
    'urine-body-fluids',
    'Renal physiology',
    'case',
    'A nephron segment reabsorbs sodium chloride but is nearly impermeable to water, helping dilute tubular fluid. Which segment is described?',
    [
      [
        'Thin descending limb',
        'The thin descending limb permits water movement and does not perform the described salt-without-water transport.',
      ],
      [
        'Glomerular capillary',
        'Glomerular filtration is distinct from selective tubular reabsorption of salt.',
      ],
      ['Renal pelvis', 'The renal pelvis collects urine; it is not the tubular diluting segment.'],
      [
        'Thick ascending limb of the loop of Henle',
        'Salt reabsorption with very low water permeability makes this limb a diluting segment.',
      ],
    ],
    3,
    'The thick ascending limb separates salt reabsorption from water movement and contributes to urinary concentration mechanisms.',
    'linne',
    405,
    'Urinalysis: loop of Henle physiology',
  ),

  item(
    'mic-r26-001',
    'microbiology',
    'Bacteriology',
    'recall',
    'In a growth-factor exercise with Haemophilus influenzae, both X and V are required. Which pairing identifies these factors?',
    [
      [
        'X is hemin; V is NAD.',
        'H. influenzae requires the heme-related X factor and the nicotinamide coenzyme V factor.',
      ],
      ['X is lactose; V is bile salt.', 'These are not the X and V growth-factor designations.'],
      [
        'X is crystal violet; V is neutral red.',
        'These are components of selective or differential media, not the required Haemophilus factors.',
      ],
      ['X is sodium chloride; V is urea.', 'Salt and urea do not define the X and V factors.'],
    ],
    0,
    'H. influenzae requires X (hemin) and V (NAD) growth factors.',
    'elsevier',
    39,
    'Microbiology: Haemophilus growth factors',
  ),
  item(
    'mic-r26-002',
    'microbiology',
    'Bacteriology',
    'case',
    'A cultured isolate has branching, beaded bacterial filaments, grows aerobically, and is partially acid-fast with a modified stain. Which genus should these findings prompt the laboratory to investigate?',
    [
      [
        'Actinomyces',
        'Actinomyces is generally anaerobic and non-acid-fast, unlike this combination.',
      ],
      [
        'Candida',
        'Candida is a yeast; modified acid-fast bacterial filaments do not fit its usual morphology.',
      ],
      [
        'Nocardia',
        'Aerobic branching filaments with partial acid-fastness support investigating Nocardia. Additional testing is required for identification.',
      ],
      [
        'Streptococcus',
        'Streptococci are cocci rather than branching, partially acid-fast filaments.',
      ],
    ],
    2,
    'Nocardia is an aerobic filamentous bacterium; partial acid-fastness is a clue, not species confirmation.',
    'elsevier',
    79,
    'Microbiology: Nocardia identification',
  ),
  item(
    'mic-r26-003',
    'microbiology',
    'Bacteriology',
    'case',
    'An isolate forms pink colonies on MacConkey agar. Which property is primarily being demonstrated by this differential color reaction?',
    [
      [
        'Endospore production',
        'Spore formation is not the target of the lactose and pH-indicator system.',
      ],
      [
        'Lactose fermentation with acid production',
        'Lactose metabolism lowers the pH and produces the pink neutral-red reaction.',
      ],
      [
        'A positive coagulase reaction',
        'Coagulase requires a separate test and is not measured by this medium.',
      ],
      [
        'Definitive identification as Escherichia coli',
        'Multiple organisms ferment lactose; pink colonies alone do not identify a species.',
      ],
    ],
    1,
    'MacConkey differentiates lactose fermentation; colony color is a metabolic clue rather than species confirmation.',
    'elsevier',
    16,
    'Microbiology: selective and differential media',
  ),
  item(
    'mic-r26-004',
    'microbiology',
    'Microbial molecular testing',
    'case',
    'A pathogen PCR shows no target amplification, but its internal amplification control also fails. The assay requires this control to amplify in a valid negative specimen. What is the appropriate interpretation?',
    [
      [
        'A valid negative pathogen result',
        'Failure of the required internal control prevents acceptance of the target-negative result.',
      ],
      [
        'A confirmed positive pathogen result',
        'A failed control does not demonstrate the pathogen target.',
      ],
      [
        'Proof that no inhibitor is present',
        'Inhibition is one possible explanation for control failure rather than something excluded by it.',
      ],
      [
        'An invalid result requiring investigation and repeat testing under the assay procedure',
        'The control failure can reflect inhibition or another analytical failure; resolve it before reporting a valid negative.',
      ],
    ],
    3,
    'A target-negative molecular result must meet the assay control criteria before it can be reported as valid.',
    'elsevier',
    283,
    'Molecular diagnostics: PCR inhibition and internal controls',
  ),
  item(
    'mic-r26-005',
    'microbiology',
    'Bacteriology',
    'case',
    'A bacterium grows both in room air and under anaerobic conditions. Which oxygen-use category is consistent with this observation?',
    [
      ['Facultative anaerobe', 'Facultative anaerobes can grow with or without oxygen.'],
      [
        'Obligate aerobe',
        'An obligate aerobe requires oxygen and would not fit growth under truly anaerobic conditions.',
      ],
      [
        'Obligate anaerobe',
        'An obligate anaerobe cannot sustain growth in ordinary atmospheric oxygen.',
      ],
      [
        'An organism defined as requiring reduced oxygen only',
        'That definition describes a microaerophilic requirement rather than growth in both stated conditions.',
      ],
    ],
    0,
    'Facultative anaerobes can grow in both aerobic and anaerobic environments.',
    'elsevier',
    18,
    'Microbiology: oxygen requirements',
  ),
  item(
    'mic-r26-006',
    'microbiology',
    'Bacteriology',
    'case',
    'A mixed culture is inoculated onto colistin-nalidixic acid (CNA) blood agar to favor recovery of gram-positive organisms. What gives this medium its selective effect?',
    [
      [
        'Neutral red changes color when lactose is fermented.',
        'That describes the differential system of MacConkey agar, not the selective agents in CNA.',
      ],
      [
        'All organisms are killed by the sheep blood.',
        'Blood provides enrichment and allows hemolysis assessment; it does not sterilize the plate.',
      ],
      [
        'Colistin and nalidixic acid suppress many gram-negative organisms.',
        'The antimicrobial agents select against much of the gram-negative flora while permitting recovery of many gram-positive organisms.',
      ],
      [
        'The plate contains no source of nutrients.',
        'A nutrient-free plate would not selectively support the desired organisms.',
      ],
    ],
    2,
    'Selective media suppress competing organisms; the selective agents in CNA are colistin and nalidixic acid.',
    'elsevier',
    17,
    'Microbiology: CNA medium',
  ),

  item(
    'par-r26-001',
    'parasitology',
    'Cestodes',
    'case',
    'A stool sample contains eggs with a thick, radially striated embryophore consistent with Taenia. Why should egg morphology alone not be used to name T. solium rather than T. saginata?',
    [
      [
        'Taenia eggs are always operculated.',
        'Taenia eggs are not operculated; the limitation is shared egg morphology.',
      ],
      [
        'The eggs of these two species are morphologically indistinguishable.',
        'Species determination requires other evidence, such as suitable proglottid or scolex features or validated molecular testing.',
      ],
      ['Neither species produces eggs.', 'Both adult intestinal tapeworms produce eggs.'],
      [
        'Every radially striated egg is diagnostic of T. solium.',
        'The characteristic shell supports Taenia but does not separate these two species.',
      ],
    ],
    1,
    'Identify Taenia eggs at the appropriate taxonomic level; do not infer the species from shared egg morphology.',
    'elsevier',
    90,
    'Parasitology: Taenia morphology',
  ),
  item(
    'par-r26-002',
    'parasitology',
    'Cestodes',
    'case',
    'A cestode investigation shows packets containing multiple eggs, each with a six-hooked oncosphere. Which parasite is characteristically associated with these egg packets?',
    [
      [
        'Enterobius vermicularis',
        'Enterobius is a nematode with individual asymmetrical eggs, not cestode egg packets.',
      ],
      [
        'Trichuris trichiura',
        'Trichuris eggs have bipolar plugs rather than the described packets.',
      ],
      [
        'Schistosoma haematobium',
        'Schistosome eggs have a spine and contain a miracidium rather than a six-hooked oncosphere.',
      ],
      [
        'Dipylidium caninum',
        'Dipylidium characteristically passes packets of eggs containing hexacanth oncospheres.',
      ],
    ],
    3,
    'Egg packets are a useful morphological clue to Dipylidium caninum.',
    'elsevier',
    91,
    'Parasitology: Dipylidium egg packets',
  ),
  item(
    'par-r26-003',
    'parasitology',
    'Trematodes',
    'case',
    'A life-cycle diagram traces human Fasciola hepatica infection after ingestion of contaminated aquatic plants. Which stage on the plant is infective to humans?',
    [
      [
        'Metacercaria',
        'Encysted metacercariae on aquatic vegetation such as watercress are ingested by the human host.',
      ],
      [
        'Unembryonated egg',
        'Eggs must undergo environmental development and a snail stage; ingestion of fresh eggs does not produce this infection.',
      ],
      [
        'Miracidium',
        'The miracidium infects the snail intermediate host, not humans eating vegetation.',
      ],
      [
        'Adult fluke',
        'The adult develops in the definitive host after ingestion of metacercariae.',
      ],
    ],
    0,
    'Fasciola infection from aquatic vegetation involves metacercariae, not direct ingestion of infective eggs.',
    'ciulla',
    828,
    'Parasitology: Fasciola life cycle',
  ),
  item(
    'par-r26-004',
    'parasitology',
    'Blood parasites',
    'recall',
    'Which Leishmania form is sought within human tissue macrophages in a stained preparation?',
    [
      ['A proglottid', 'A proglottid is a tapeworm segment, not a Leishmania stage.'],
      [
        'A filariform larva',
        'Filariform larvae are nematode stages and do not describe this intracellular protozoan.',
      ],
      [
        'An amastigote',
        'Leishmania amastigotes occur in host macrophages. A nucleus and kinetoplast are useful microscopic features.',
      ],
      ['An operculated egg', 'Leishmania is a protozoan and does not produce a helminth egg.'],
    ],
    2,
    'Leishmania amastigotes are the human tissue stage; promastigotes occur in the sandfly and in culture.',
    'ciulla',
    824,
    'Parasitology: Leishmania tissue stage',
  ),
  item(
    'par-r26-005',
    'parasitology',
    'Blood parasites',
    'case',
    'A thin blood film contains intraerythrocytic parasites arranged as a four-membered Maltese-cross tetrad. Which genus is most strongly suggested by this finding?',
    [
      [
        'Giardia',
        'Giardia is an intestinal flagellate and does not form intraerythrocytic tetrads.',
      ],
      [
        'Babesia',
        'Babesia can form characteristic intraerythrocytic tetrads. Their absence does not exclude babesiosis.',
      ],
      [
        'Leishmania',
        'Leishmania amastigotes occur chiefly in macrophages rather than as red-cell tetrads.',
      ],
      ['Entamoeba', 'Intestinal Entamoeba species do not produce this blood-stage arrangement.'],
    ],
    1,
    'A Maltese-cross tetrad in a red cell is a characteristic clue to Babesia.',
    'elsevier',
    92,
    'Parasitology: Babesia blood morphology',
  ),
  item(
    'par-r26-006',
    'parasitology',
    'Blood parasites',
    'recall',
    'In the tissue-cyst stage of Toxoplasma gondii, what are the slowly multiplying organisms within the cyst called?',
    [
      [
        'Tachyzoites',
        'Tachyzoites are the rapidly multiplying form rather than the slowly multiplying tissue-cyst organisms.',
      ],
      [
        'Microfilariae',
        'Microfilariae are offspring of filarial nematodes, not Toxoplasma stages.',
      ],
      ['Cercariae', 'Cercariae are trematode larvae released by a snail.'],
      [
        'Bradyzoites',
        'Tissue cysts contain bradyzoites, the slowly multiplying form of Toxoplasma.',
      ],
    ],
    3,
    'Distinguish slowly multiplying Toxoplasma bradyzoites in tissue cysts from rapidly multiplying tachyzoites.',
    'elsevier',
    90,
    'Parasitology: Toxoplasma tissue cysts',
  ),

  item(
    'hem-r26-001',
    'hematology',
    'Anemias',
    'case',
    'With pH, temperature, and carbon dioxide held constant, an increase in red-cell 2,3-BPG shifts the oxygen dissociation curve to the right. What does this shift mean?',
    [
      [
        'Hemoglobin has lower oxygen affinity and releases oxygen more readily.',
        '2,3-BPG stabilizes deoxygenated hemoglobin; the right shift favors unloading at a given oxygen tension.',
      ],
      [
        'Hemoglobin binds oxygen more tightly at every tissue oxygen tension.',
        'Greater affinity corresponds to a left shift, not the stated right shift.',
      ],
      [
        'All heme iron has become ferric.',
        'The shift concerns oxygen affinity, not complete oxidation to methemoglobin.',
      ],
      [
        'Red cells have lost all hemoglobin.',
        'An affinity change does not mean that hemoglobin is absent.',
      ],
    ],
    0,
    'A right shift means reduced hemoglobin oxygen affinity and favors oxygen delivery to tissues.',
    'elsevier',
    107,
    'Hematology: oxygen dissociation curve',
  ),
  item(
    'hem-r26-002',
    'hematology',
    'Anemias',
    'recall',
    'Which iron state defines methemoglobin and prevents the affected heme from binding oxygen normally?',
    [
      ['Ferrous iron, Fe2+', 'Functional oxygen-binding heme normally contains ferrous iron.'],
      ['Metallic iron, Fe0', 'Metallic iron is not the oxidation state defining methemoglobin.'],
      [
        'Ferric iron, Fe3+',
        'Oxidation of heme iron from ferrous to ferric forms methemoglobin, whose affected heme cannot bind oxygen.',
      ],
      [
        'Calcium replacing iron in every heme',
        'Methemoglobinemia involves iron oxidation, not substitution of calcium for iron.',
      ],
    ],
    2,
    'Methemoglobin contains ferric iron; oxygen transport requires functional ferrous heme.',
    'linne',
    316,
    'Hematology: hemoglobin derivatives',
  ),
  item(
    'hem-r26-003',
    'hematology',
    'Anemias',
    'recall',
    'In alpha-thalassemia with marked alpha-chain deficiency, hemoglobin H forms from an excess of which chains?',
    [
      [
        'Four alpha chains',
        'Alpha chains are deficient in this disorder rather than present in excess.',
      ],
      [
        'Four beta chains',
        'Hemoglobin H is a beta-chain tetramer (beta4), formed when alpha-chain supply is markedly reduced.',
      ],
      ['Four gamma chains', 'A gamma4 tetramer is hemoglobin Bart, not hemoglobin H.'],
      [
        'Two alpha and two delta chains',
        'Alpha2 delta2 describes hemoglobin A2 rather than hemoglobin H.',
      ],
    ],
    1,
    'Hemoglobin H is beta4; hemoglobin Bart is gamma4.',
    'jarreau',
    72,
    'Hematology: alpha-thalassemia and hemoglobin H',
  ),
  item(
    'hem-r26-004',
    'hematology',
    'Anemias',
    'case',
    'An alkaline hemoglobin electrophoresis band lies at the expected S position. Why is this finding alone insufficient to identify HbS definitively?',
    [
      [
        'All hemoglobins remain at the origin at alkaline pH.',
        'Hemoglobins do separate at alkaline pH, but some variants share migration positions.',
      ],
      [
        'The band directly measures the beta-globin DNA sequence.',
        'Protein migration does not sequence DNA.',
      ],
      [
        'An S-position band always proves homozygous sickle cell disease.',
        'Co-migration and the complete hemoglobin pattern must be considered before assigning identity or genotype.',
      ],
      [
        'Variants such as HbD and HbG can co-migrate with HbS.',
        'Alkaline co-migration requires an additional validated separation or identification method to resolve the variant.',
      ],
    ],
    3,
    'A hemoglobin migration position can suggest a group of variants; co-migrating variants require further identification.',
    'jarreau',
    71,
    'Hematology: alkaline hemoglobin electrophoresis',
  ),
  item(
    'hem-r26-005',
    'hematology',
    'Anemias',
    'case',
    'A smear from a patient after splenectomy contains red cells with a single dense, round purple inclusion identified as a Howell-Jolly body. What material forms this inclusion?',
    [
      [
        'A nuclear DNA remnant',
        'Howell-Jolly bodies are nuclear remnants normally removed by splenic pitting.',
      ],
      [
        'A cluster of iron-containing siderosomes',
        'Iron-containing granules are Pappenheimer bodies, not Howell-Jolly bodies.',
      ],
      [
        'Denatured hemoglobin precipitated as a Heinz body',
        'Heinz bodies are denatured hemoglobin inclusions best demonstrated by supravital staining.',
      ],
      [
        'A platelet membrane receptor',
        'A Howell-Jolly body is an erythrocyte nuclear remnant, not a platelet surface structure.',
      ],
    ],
    0,
    'Howell-Jolly bodies contain DNA and become more apparent when splenic removal is impaired or absent.',
    'linne',
    343,
    'Hematology: red-cell inclusions',
  ),
  item(
    'hem-r26-006',
    'hematology',
    'Hemostasis',
    'recall',
    'Unfractionated heparin accelerates inhibition of thrombin and factor Xa principally by enhancing which circulating inhibitor?',
    [
      [
        'Plasminogen',
        'Plasminogen is the precursor of the fibrinolytic enzyme plasmin, not the principal heparin cofactor.',
      ],
      [
        'Fibrinogen',
        'Fibrinogen is the substrate converted to fibrin rather than the inhibitor enhanced by heparin.',
      ],
      [
        'Antithrombin',
        'Heparin enhances antithrombin-mediated inhibition of coagulation serine proteases, including thrombin and Xa.',
      ],
      [
        'Von Willebrand factor',
        'Von Willebrand factor mediates platelet adhesion and carries factor VIII; it is not the principal heparin-dependent inhibitor.',
      ],
    ],
    2,
    'Antithrombin is the major cofactor for the anticoagulant effect of unfractionated heparin.',
    'ciulla',
    414,
    'Hemostasis: heparin and antithrombin',
  ),

  item(
    'hml-r26-001',
    'histopathology-lab-management-laws',
    'Histopathology',
    'case',
    'A fixed bone specimen remains too hard for routine paraffin microtomy because of its mineral content. Which processing step addresses this obstacle?',
    [
      [
        'Bluing',
        'Bluing changes the color of a hematoxylin stain and does not remove bone mineral.',
      ],
      [
        'Decalcification',
        'Decalcification removes calcium mineral so that the preserved tissue can be processed and sectioned.',
      ],
      [
        'Coverslipping',
        'Coverslipping protects an already prepared section rather than softening mineralized tissue.',
      ],
      [
        'Eosin counterstaining',
        'Eosin colors tissue components; it does not remove calcium mineral.',
      ],
    ],
    1,
    'Fixation preserves tissue; decalcification removes mineral that would interfere with routine sectioning.',
    'alba',
    469,
    'Histology technique: fixation and decalcification',
  ),
  item(
    'hml-r26-002',
    'histopathology-lab-management-laws',
    'Histopathology',
    'case',
    'A demonstration aims to show neutral lipid droplets that may be extracted during routine paraffin processing. Which preparation best preserves this target for a fat stain?',
    [
      [
        'A routine paraffin section after full alcohol and xylene processing',
        'Organic-solvent processing can extract the lipid target before staining.',
      ],
      [
        'A section treated only with strong acid to remove all mineral',
        'Decalcification does not specifically preserve neutral lipid for a fat stain.',
      ],
      [
        'A fully dewaxed paraffin section with no remaining lipid',
        'Staining cannot reliably demonstrate lipid that has already been extracted.',
      ],
      [
        'A frozen section prepared with a suitable lipid-preserving method',
        'Frozen preparation can retain lipids that are lost during routine solvent-based paraffin processing.',
      ],
    ],
    3,
    'Choose tissue preparation to preserve the target; frozen sections are useful when demonstrating retained neutral fat.',
    'alba',
    467,
    'Histology technique: frozen sections and fat demonstration',
  ),
  item(
    'hml-r26-003',
    'histopathology-lab-management-laws',
    'Histopathology',
    'recall',
    'During preparation of a hematoxylin staining system, oxidation produces the dye compound that subsequently complexes with a mordant. What is this oxidation product?',
    [
      [
        'Hematein',
        'Oxidation converts hematoxylin to hematein, which forms a staining complex with a suitable metal mordant.',
      ],
      [
        'Hemosiderin',
        'Hemosiderin is an iron-storage pigment rather than an oxidation product of hematoxylin.',
      ],
      ['Eosin', 'Eosin is a separate synthetic dye, not oxidized hematoxylin.'],
      ['Bilirubin', 'Bilirubin is a heme breakdown pigment rather than a hematoxylin derivative.'],
    ],
    0,
    'Hematoxylin is oxidized to hematein before formation of the mordant-dye staining complex.',
    'alba',
    491,
    'Histology technique: hematoxylin oxidation',
  ),
  item(
    'hml-r26-004',
    'histopathology-lab-management-laws',
    'Histopathology',
    'recall',
    'An alum hematoxylin formulation contains an aluminum salt. What is the role of the aluminum in this staining system?',
    [
      [
        'It replaces the tissue with paraffin.',
        'Paraffin embedding is a separate processing step, not the function of the aluminum salt.',
      ],
      [
        'It is the eosin counterstain.',
        'The aluminum salt is not the acidic cytoplasmic dye eosin.',
      ],
      [
        'It acts as a mordant in the dye-tissue staining complex.',
        'Aluminum complexes with hematein and supports binding of the stain to tissue targets.',
      ],
      [
        'It serves only as a coverslip adhesive.',
        'A mordant contributes to staining rather than coverslip attachment.',
      ],
    ],
    2,
    'A mordant participates in dye binding; alum supplies aluminum for alum hematoxylin staining.',
    'alba',
    491,
    'Histology technique: hematoxylin mordants',
  ),
  item(
    'hml-r26-005',
    'histopathology-lab-management-laws',
    'Histopathology',
    'case',
    'A hematoxylin procedure intentionally stains beyond the desired endpoint, then uses controlled differentiation to remove excess stain. Which staining approach is being used?',
    [
      [
        'Progressive staining to the final endpoint without differentiation',
        'That describes building stain to the intended endpoint rather than intentionally overstaining and removing excess.',
      ],
      [
        'Regressive staining',
        'Regressive staining intentionally overstains and then differentiates to obtain the desired contrast.',
      ],
      [
        'Decalcification',
        'Decalcification removes mineral and does not name a staining endpoint strategy.',
      ],
      [
        'Paraffin infiltration',
        'Infiltration supplies support for sectioning and is not the described staining process.',
      ],
    ],
    1,
    'Regressive staining reaches the endpoint by removing excess stain after initial overstaining.',
    'alba',
    491,
    'Histology technique: regressive staining',
  ),
  item(
    'hml-r26-006',
    'histopathology-lab-management-laws',
    'Histopathology',
    'recall',
    'In routine hematoxylin and eosin staining, eosin colors many cytoplasmic proteins pink. Which dye property explains this interaction?',
    [
      [
        'Eosin is a metal mordant with no color of its own.',
        'Eosin is a colored dye, not the aluminum or iron mordant used with hematein.',
      ],
      [
        'Eosin removes calcium mineral before sectioning.',
        'This describes decalcification rather than eosin counterstaining.',
      ],
      [
        'Eosin is converted to hematoxylin inside the tissue.',
        'The two dyes remain chemically distinct.',
      ],
      [
        'Eosin is an acidic, negatively charged dye that binds positively charged protein groups.',
        'Electrostatic interaction of anionic eosin with cationic protein groups produces eosinophilic cytoplasmic staining.',
      ],
    ],
    3,
    'Eosin is an acidic counterstain for many cytoplasmic and extracellular proteins.',
    'alba',
    494,
    'Histology technique: acid dyes and cytoplasmic staining',
  ),
];
