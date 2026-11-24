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
} as const;
type Choice = readonly [text: string, rationale: string];
function item(
  id: string,
  subjectId: string,
  topic: string,
  kind: Question['kind'],
  stem: string,
  choices: readonly [Choice, Choice, Choice, Choice],
  correctIndex: number,
  reference: keyof typeof references,
  pdfPage: number,
  chapter: string,
  takeaway: string,
): Question {
  const [title, edition] = references[reference];
  return {
    id,
    subjectId,
    topic,
    kind,
    difficulty: kind === 'case' ? 'Application' : 'Foundation',
    stem,
    options: choices.map(([text, rationale], index) => ({
      id: String.fromCharCode(65 + index),
      text,
      rationale,
    })),
    correctOptionId: String.fromCharCode(65 + correctIndex),
    source: { title, edition, pdfPage, chapter },
    takeaway,
    version: 1,
  };
}

// Original learning questions based on the supplied books, not copied review items.
export const thinTopicQuestions: Question[] = [
  item(
    'cc-t26-001',
    'chemistry',
    'Liver function',
    'recall',
    'Which hepatocyte enzyme directly catalyzes the attachment of glucuronic acid to bilirubin?',
    [
      [
        'UDP-glucuronosyltransferase',
        'This enzyme conjugates bilirubin with glucuronic acid, enabling normal biliary handling.',
      ],
      [
        'Biliverdin reductase',
        'Biliverdin reductase produces bilirubin from biliverdin earlier in heme breakdown; it does not conjugate bilirubin.',
      ],
      [
        'Heme oxygenase',
        'Heme oxygenase initiates heme degradation to biliverdin, before bilirubin is formed.',
      ],
      [
        'Beta-glucuronidase',
        'Beta-glucuronidase removes glucuronic acid groups rather than catalyzing bilirubin conjugation.',
      ],
    ],
    0,
    'elsevier',
    257,
    'Clinical Chemistry - bilirubin metabolism, Figure 8-3',
    'Bilirubin conjugation is catalyzed by UDP-glucuronosyltransferase.',
  ),
  item(
    'cc-t26-002',
    'chemistry',
    'Liver function',
    'recall',
    'Before hepatic conjugation, most circulating unconjugated bilirubin travels in plasma bound to which protein?',
    [
      ['Transferrin', 'Transferrin transports iron, not most circulating unconjugated bilirubin.'],
      [
        'Albumin',
        'Albumin carries poorly water-soluble unconjugated bilirubin to the liver by noncovalent binding.',
      ],
      [
        'Haptoglobin',
        'Haptoglobin binds free hemoglobin released into plasma, rather than acting as the main unconjugated bilirubin carrier.',
      ],
      [
        'Fibrinogen',
        'Fibrinogen is a coagulation protein; it is not the principal bilirubin transport protein.',
      ],
    ],
    1,
    'elsevier',
    257,
    'Clinical Chemistry - bilirubin metabolism, Figure 8-3',
    'Unconjugated bilirubin is transported to the liver largely bound to albumin.',
  ),
  item(
    'cc-t26-003',
    'chemistry',
    'Liver function',
    'case',
    'After a prolonged episode of cholestasis, a chemistry discussion attributes part of the direct-reacting bilirubin to a fraction covalently attached to albumin. Which fraction is being discussed?',
    [
      [
        'Free unconjugated bilirubin',
        'The unconjugated fraction ordinarily travels noncovalently bound to albumin; that is different from the covalent delta fraction.',
      ],
      [
        'Biliverdin',
        'Biliverdin is a green heme-breakdown intermediate, not a bilirubin fraction covalently attached to albumin.',
      ],
      [
        'Delta bilirubin',
        'Delta bilirubin is bilirubin covalently linked to albumin and contributes to the direct diazo reaction.',
      ],
      [
        'Urobilinogen',
        'Urobilinogen is produced by intestinal metabolism of bilirubin, not by covalent attachment of bilirubin to albumin.',
      ],
    ],
    2,
    'elsevier',
    256,
    'Clinical Chemistry - bilirubin fractions; direct diazo reactivity also described on PDF page 258',
    'Delta bilirubin is the covalently albumin-bound bilirubin fraction; direct-reacting bilirubin is not exclusively free conjugated bilirubin.',
  ),
  item(
    'cc-t26-004',
    'chemistry',
    'Liver function',
    'recall',
    'A liver teaching diagram highlights resident phagocytic macrophages lining the sinusoidal vascular spaces. Which cells should be labeled?',
    [
      [
        'Hepatocytes',
        'Hepatocytes perform most hepatic metabolic and synthetic work; the resident sinusoidal macrophages have a different name.',
      ],
      [
        'Cholangiocytes',
        'Cholangiocytes line bile ducts rather than serving as the resident sinusoidal macrophages.',
      ],
      [
        'Glomerular podocytes',
        'Podocytes belong to the renal filtration barrier, not hepatic sinusoids.',
      ],
      [
        'Kupffer cells',
        'Kupffer cells are resident hepatic macrophages that phagocytose material in the sinusoidal circulation.',
      ],
    ],
    3,
    'elsevier',
    256,
    'Clinical Chemistry - liver cell types',
    'Kupffer cells are the liver’s resident sinusoidal macrophages.',
  ),
  item(
    'cc-t26-005',
    'chemistry',
    'Liver function',
    'case',
    'A teaching model assumes complete blockage of bile flow into the intestine. What happens to the intestinal formation of urobilinogen from bilirubin?',
    [
      [
        'It falls because less bilirubin reaches intestinal bacteria.',
        'Intestinal bacteria need bilirubin substrate to produce urobilinogen; complete obstruction reduces delivery of that substrate.',
      ],
      [
        'It rises because albumin directly becomes urobilinogen.',
        'Albumin is not converted directly into urobilinogen; bacterial processing of bilirubin is required.',
      ],
      [
        'It is unchanged because the intestine produces bilirubin independently of bile.',
        'The usual intestinal substrate is delivered in bile, so blocking bile flow changes urobilinogen production.',
      ],
      [
        'It rises because renal tubular cells supply urobilinogen to the intestine.',
        'Renal tubular cells do not replace biliary delivery of bilirubin to the intestinal lumen.',
      ],
    ],
    0,
    'elsevier',
    257,
    'Clinical Chemistry - posthepatic jaundice and bilirubin pathway',
    'Complete biliary obstruction reduces intestinal bilirubin delivery and therefore urobilinogen formation.',
  ),
  item(
    'cc-t26-006',
    'chemistry',
    'Liver function',
    'case',
    'In a patient with established advanced chronic liver disease, albumin is low and prothrombin time is prolonged. Other causes and medication effects have been evaluated. Which hepatic function do these findings help assess?',
    [
      [
        'Leakage of aminotransferases from injured cells only',
        'AST and ALT assess cellular injury; albumin and prothrombin time provide information about synthesis rather than simply enzyme leakage.',
      ],
      [
        'Synthesis of plasma proteins and coagulation factors',
        'Albumin and many coagulation factors are synthesized in the liver. Reduced synthesis can contribute to this pattern, although the tests are not specific by themselves.',
      ],
      [
        'Glomerular filtration of creatinine',
        'Creatinine-based renal assessment does not directly explain the paired hepatic synthetic markers.',
      ],
      [
        'Conjugation of bilirubin alone',
        'Bilirubin conjugation is a separate metabolic step and is not directly measured by either albumin concentration or prothrombin time.',
      ],
    ],
    1,
    'elsevier',
    258,
    'Clinical Chemistry - alcoholic cirrhosis laboratory findings',
    'Albumin and prothrombin time help assess hepatic synthetic function, with other causes considered.',
  ),

  item(
    'ubf-t26-001',
    'urine-body-fluids',
    'Renal physiology',
    'recall',
    'Which vascular sequence correctly describes blood flow immediately into and out of a glomerular capillary tuft?',
    [
      [
        'Efferent arteriole → glomerulus → afferent arteriole',
        'This reverses the direction of the afferent and efferent arterioles.',
      ],
      [
        'Renal vein → glomerulus → renal artery',
        'Renal veins drain the kidney; they do not normally supply the glomerular capillary tuft.',
      ],
      [
        'Afferent arteriole → glomerulus → efferent arteriole',
        'The afferent arteriole delivers blood to the tuft and the efferent arteriole carries it away.',
      ],
      [
        'Ureter → glomerulus → collecting duct',
        'The ureter and collecting duct carry urine or tubular fluid, not the glomerular blood supply.',
      ],
    ],
    2,
    'linne',
    403,
    'Renal Physiology and Urinalysis - glomerulus',
    'Afferent brings blood into the glomerulus; efferent carries blood away.',
  ),
  item(
    'ubf-t26-002',
    'urine-body-fluids',
    'Renal physiology',
    'recall',
    'With an intact normal glomerular filtration barrier, which material is expected in the initial filtrate in Bowman’s space?',
    [
      [
        'Whole blood with unchanged numbers of red cells',
        'Red blood cells are normally retained in the circulation by an intact filtration barrier.',
      ],
      [
        'Plasma with all large proteins at their original concentrations',
        'The barrier strongly restricts large plasma proteins, so initial filtrate does not have the same protein composition as plasma.',
      ],
      [
        'Water with glucose and electrolytes completely excluded',
        'Glucose and many small electrolytes are freely filtered; they are not all excluded from the initial filtrate.',
      ],
      [
        'Water and small solutes, with blood cells and most large proteins retained',
        'Glomerular filtration produces a relatively protein-poor ultrafiltrate while retaining blood cells and most large proteins.',
      ],
    ],
    3,
    'linne',
    404,
    'Renal Physiology and Urinalysis - glomerular filtrate',
    'Normal glomerular filtrate contains water and small solutes but is largely free of cells and large proteins.',
  ),
  item(
    'ubf-t26-003',
    'urine-body-fluids',
    'Renal physiology',
    'recall',
    'Which nephron segment carries out bulk reabsorption of filtered water and electrolytes before the loop of Henle?',
    [
      [
        'Proximal convoluted tubule',
        'Bulk reabsorption begins in the proximal tubule, returning much of the filtered water and solute to the circulation.',
      ],
      [
        'Bowman’s space',
        'Bowman’s space receives the glomerular filtrate; it is not the main tubular site of bulk reabsorption.',
      ],
      [
        'Collecting duct alone',
        'The collecting duct regulates final water handling, after bulk reabsorption has already occurred upstream.',
      ],
      [
        'Distal convoluted tubule',
        'The distal tubule modifies electrolyte handling after much of the filtered water and solute has already been reabsorbed proximally.',
      ],
    ],
    0,
    'linne',
    404,
    'Renal Physiology and Urinalysis - proximal convoluted tubule',
    'Bulk reabsorption of filtered water and solutes starts in the proximal tubule.',
  ),
  item(
    'ubf-t26-004',
    'urine-body-fluids',
    'Renal physiology',
    'case',
    'A diagram shows a dissolved organic acid moving from peritubular blood into the renal tubular lumen. Which process is represented?',
    [
      [
        'Tubular reabsorption',
        'Reabsorption moves material from the tubular fluid toward the blood, the reverse of the arrow shown.',
      ],
      [
        'Tubular secretion',
        'Secretion transfers substances from blood into tubular fluid for possible urinary elimination.',
      ],
      [
        'Glomerular filtration',
        'Filtration occurs across the glomerular barrier into Bowman’s space, not across a tubular epithelial segment from peritubular blood.',
      ],
      [
        'Bladder emptying',
        'Bladder emptying expels stored urine from the body and is not transport across a renal tubule.',
      ],
    ],
    1,
    'linne',
    405,
    'Renal Physiology and Urinalysis - proximal tubular secretion',
    'Secretion moves substances into the tubular lumen; reabsorption moves them back toward blood.',
  ),
  item(
    'ubf-t26-005',
    'urine-body-fluids',
    'Renal physiology',
    'case',
    'As fluid travels through the water-permeable descending limb of Henle into a hyperosmotic medulla, what movement helps concentrate the tubular fluid?',
    [
      [
        'Water moves into the lumen against the osmotic gradient.',
        'That direction would dilute the tubular fluid and is opposite to the osmotic movement described.',
      ],
      [
        'All filtered sodium is secreted from blood into the lumen.',
        'Complete sodium secretion is not the concentrating mechanism of the water-permeable descending limb.',
      ],
      [
        'Water leaves the lumen by osmosis.',
        'The hyperosmotic medullary interstitium draws water out of the descending limb, leaving the tubular fluid more concentrated.',
      ],
      [
        'The glomerulus stops producing filtrate at this segment.',
        'Filtration occurs upstream and does not switch off locally as fluid enters the loop.',
      ],
    ],
    2,
    'linne',
    405,
    'Renal Physiology and Urinalysis - descending loop of Henle',
    'Water loss from the descending limb into the hyperosmotic medulla concentrates tubular fluid.',
  ),
  item(
    'ubf-t26-006',
    'urine-body-fluids',
    'Renal physiology',
    'case',
    'A physiology exercise increases ADH action while renal responsiveness and the medullary gradient remain intact. Which collecting-duct response is expected?',
    [
      [
        'Lower water permeability and more dilute urine',
        'ADH promotes water permeability; reducing it would oppose the normal antidiuretic response.',
      ],
      [
        'Replacement of tubular water transport by glomerular protein filtration',
        'ADH regulates tubular water permeability; it does not replace that process with glomerular protein filtration.',
      ],
      [
        'Reduced water reabsorption despite increased water permeability',
        'With a functioning medullary gradient, increasing water permeability promotes rather than reduces water reabsorption.',
      ],
      [
        'Greater water reabsorption and a tendency toward more concentrated urine',
        'ADH increases collecting-duct water permeability, allowing water reabsorption along an available medullary osmotic gradient.',
      ],
    ],
    3,
    'linne',
    405,
    'Renal Physiology and Urinalysis - collecting tubules and ADH',
    'With an intact medullary gradient, ADH promotes collecting-duct water reabsorption.',
  ),

  item(
    'mic-t26-001',
    'microbiology',
    'Microbial molecular testing',
    'recall',
    'In a conventional PCR cycle, what is the immediate purpose of the denaturation step?',
    [
      [
        'Separate the two DNA template strands',
        'Denaturation disrupts base pairing so the individual strands can serve as templates in subsequent steps.',
      ],
      [
        'Allow primers to pair with their complementary target sequences',
        'Primer binding is the purpose of annealing, after the template strands have separated.',
      ],
      [
        'Extend a bound primer by adding nucleotides',
        'Nucleotide addition occurs during extension rather than being the purpose of denaturation.',
      ],
      [
        'Remove contaminating target DNA from the reagents',
        'Denaturation separates DNA strands but does not remove contaminating target DNA from a reaction.',
      ],
    ],
    0,
    'elsevier',
    282,
    'Molecular Diagnostics - PCR cycle stages',
    'PCR denaturation separates template strands; annealing and extension perform different jobs.',
  ),
  item(
    'mic-t26-002',
    'microbiology',
    'Microbial molecular testing',
    'recall',
    'A PCR primer pair is designed to bind opposite template strands on either side of a pathogen target. What is the principal role of these primers?',
    [
      [
        'Maintain the reaction mixture at its required pH',
        'Buffer components maintain pH; primers supply target-complementary starting sequences.',
      ],
      [
        'Provide sequence-specific starting points for DNA synthesis',
        'Complementary primer binding supplies starting points for polymerase and helps determine the region amplified.',
      ],
      [
        'Supply magnesium as a polymerase cofactor',
        'Magnesium is a separate reaction component; oligonucleotide primers do not supply this metal cofactor.',
      ],
      [
        'Catalyze nucleotide addition during extension',
        'DNA polymerase catalyzes nucleotide addition; primers provide the starting sequences.',
      ],
    ],
    1,
    'elsevier',
    282,
    'Molecular Diagnostics - forward and reverse PCR primers',
    'Primers define where PCR synthesis starts through complementary target binding.',
  ),
  item(
    'mic-t26-003',
    'microbiology',
    'Microbial molecular testing',
    'case',
    'An RNA-virus assay includes a reverse-transcription step before DNA amplification. What product makes the RNA target accessible to the subsequent PCR?',
    [
      [
        'A peptide translated from viral RNA',
        'A peptide is a protein product and is not the DNA template needed for PCR.',
      ],
      [
        'Additional viral RNA copied from RNA',
        'More RNA alone is not the cDNA product that allows subsequent DNA-directed PCR.',
      ],
      [
        'Complementary DNA synthesized from the RNA',
        'Reverse transcriptase produces cDNA from RNA, allowing a DNA-directed PCR to amplify the corresponding sequence.',
      ],
      [
        'Host genomic DNA without conversion of the viral RNA',
        'Host genomic DNA does not substitute for a cDNA copy of the RNA-virus target.',
      ],
    ],
    2,
    'elsevier',
    283,
    'Molecular Diagnostics - reverse-transcriptase PCR',
    'Reverse transcription provides a cDNA template for PCR when the original target is RNA.',
  ),
  item(
    'mic-t26-004',
    'microbiology',
    'Microbial molecular testing',
    'case',
    'A validated respiratory panel amplifies several pathogen targets using multiple primer pairs in the same reaction. Which PCR format is described?',
    [
      [
        'Single-target end-point PCR only',
        'A single-target assay does not describe the deliberate use of multiple primer pairs for different targets.',
      ],
      [
        'Single-target reverse-transcription PCR',
        'Reverse transcription converts RNA to cDNA. A single-target version does not describe simultaneous amplification of distinct targets.',
      ],
      [
        'Single-target real-time PCR',
        'Real-time monitoring describes when a signal is measured; a single-target assay does not match the multiple-target format in the question.',
      ],
      [
        'Multiplex PCR',
        'Multiplex PCR combines primer pairs to detect more than one target in the same reaction.',
      ],
    ],
    3,
    'elsevier',
    283,
    'Molecular Diagnostics - multiplex PCR',
    'Multiplex PCR uses multiple primer pairs for multiple targets within one reaction.',
  ),
  item(
    'mic-t26-005',
    'microbiology',
    'Microbial molecular testing',
    'case',
    'A pathogen PCR run produces the expected target signal in a no-template reagent control, which was intended to contain no target DNA. What concern must be investigated before interpreting specimen results?',
    [
      [
        'Contamination of reagents or reaction setup with target nucleic acid',
        'A target signal in a no-template control raises concern for contamination and possible false-positive specimen findings; follow the validated investigation procedure.',
      ],
      [
        'Proof that every patient specimen contains the pathogen',
        'The control has no patient specimen, so its signal cannot establish infection in all submitted specimens.',
      ],
      [
        'Successful measurement of patient antibody titers',
        'PCR signals do not measure antibody titers, and a reagent-control signal does not establish serologic status.',
      ],
      [
        'A routine expected negative-control reaction requiring no action',
        'A target-positive no-template control contradicts its expected result and cannot simply be ignored.',
      ],
    ],
    0,
    'elsevier',
    283,
    'Molecular Diagnostics - PCR controls and carryover contamination',
    'Unexpected target amplification in a no-template control requires contamination assessment.',
  ),
  item(
    'mic-t26-006',
    'microbiology',
    'Microbial molecular testing',
    'recall',
    'Why is preventing RNase contamination especially important when preparing RNA for a pathogen molecular assay?',
    [
      [
        'RNases stabilize the RNA by preventing strand cleavage.',
        'RNases cleave RNA rather than protecting it against degradation.',
      ],
      [
        'RNases can degrade the RNA target before analysis.',
        'RNase-mediated degradation can reduce intact target RNA and compromise an RNA-based assay.',
      ],
      [
        'RNases perform the reverse-transcription reaction.',
        'Reverse transcriptase synthesizes cDNA; RNases do not perform that conversion.',
      ],
      [
        'RNases amplify low-copy RNA targets.',
        'RNases degrade RNA instead of generating additional copies of a target.',
      ],
    ],
    1,
    'elsevier',
    279,
    'Molecular Diagnostics - nucleic acid isolation and RNA stability',
    'Protect RNA from RNases to preserve the target for analysis.',
  ),

  item(
    'mic-t26-007',
    'microbiology',
    'Antimicrobial susceptibility',
    'recall',
    'What is the directly measured result of a standardized antimicrobial disk-diffusion test before applying interpretive criteria?',
    [
      [
        'The radius of the inhibition zone alone',
        'Standard disk-diffusion interpretation uses the full zone diameter rather than reporting the radius alone.',
      ],
      [
        'An exact MIC obtained directly in micrograms per milliliter',
        'Disk diffusion measures a zone; the observed diameter is not itself a directly measured MIC.',
      ],
      [
        'The diameter of a zone of growth inhibition',
        'Zone diameters, measured in millimeters, are compared with the applicable interpretive criteria.',
      ],
      [
        'The percentage reduction in viable bacteria',
        'A viable-count reduction is a different endpoint; routine disk diffusion directly measures an inhibition-zone diameter.',
      ],
    ],
    2,
    'ciulla',
    678,
    'Bacteriology - disk diffusion interpretation',
    'Disk diffusion measures inhibition-zone diameter, not a direct MIC.',
  ),
  item(
    'mic-t26-008',
    'microbiology',
    'Antimicrobial susceptibility',
    'case',
    'Two different organism-drug pairs each produce a 20-mm inhibition zone. Why should the laboratory avoid automatically assigning the same susceptibility category to both?',
    [
      [
        'Zone diameter is never used to interpret susceptibility.',
        'Validated disk-diffusion methods do use zone diameters; the problem is treating one diameter as a universal breakpoint.',
      ],
      [
        'A 20-mm zone proves every antibacterial agent will work.',
        'No single zone size establishes universal susceptibility across organisms and antimicrobial agents.',
      ],
      [
        'Only the color of the bacterial colony determines the category.',
        'Colony color does not replace validated organism-drug-specific susceptibility criteria.',
      ],
      [
        'Interpretation depends on the applicable organism-drug and method-specific breakpoint table.',
        'The same diameter can have different meanings for different organism-drug combinations. Use the current validated standard rather than a universal cutoff.',
      ],
    ],
    3,
    'ciulla',
    678,
    'Bacteriology - standardized interpretation of disk-diffusion zones',
    'Apply current organism-drug-specific breakpoints; a zone diameter has no universal susceptible cutoff.',
  ),
  item(
    'mic-t26-009',
    'microbiology',
    'Antimicrobial susceptibility',
    'case',
    'A gradient-diffusion susceptibility strip has an elliptical inhibition zone. In a straightforward valid reading, where is the MIC obtained?',
    [
      [
        'At the strip scale where the inhibition boundary intersects the strip',
        'The intersection of the inhibition ellipse with the calibrated concentration scale provides the gradient-diffusion MIC, using the method’s reading rules.',
      ],
      [
        'At the highest concentration printed on every strip',
        'The highest printed concentration is a scale limit, not automatically the isolate’s MIC.',
      ],
      [
        'At the midpoint of the long axis of the ellipse',
        'The method uses the inhibition boundary where it intersects the strip, not the geometric midpoint of the ellipse.',
      ],
      [
        'From the diameter table for a different antimicrobial disk',
        'Disk-diffusion breakpoint tables do not replace the concentration reading on the appropriate gradient strip.',
      ],
    ],
    0,
    'ciulla',
    678,
    'Bacteriology - gradient diffusion',
    'Gradient diffusion relates the inhibition ellipse to the strip’s concentration scale.',
  ),
  item(
    'mic-t26-010',
    'microbiology',
    'Antimicrobial susceptibility',
    'recall',
    'Which endpoint distinguishes the minimum bactericidal concentration from the minimum inhibitory concentration?',
    [
      [
        'Detection of any bacterial DNA regardless of viability',
        'Detecting DNA alone does not establish the viable-count reduction that defines the bactericidal endpoint.',
      ],
      [
        'At least a 99.9% reduction in the original viable bacterial population',
        'The MBC is based on killing at least 99.9% of the original viable inoculum; the MIC is based on inhibition of visible growth.',
      ],
      [
        'The first visible growth at any drug concentration',
        'First visible growth is neither the MIC definition nor the bactericidal endpoint.',
      ],
      [
        'A fixed inhibition-zone diameter shared by all organisms',
        'Neither MBC nor MIC is defined by one universal disk-diffusion diameter.',
      ],
    ],
    1,
    'ciulla',
    677,
    'Bacteriology - dilution tests and MBC',
    'MIC concerns growth inhibition; MBC concerns a defined reduction in viable bacteria.',
  ),
  item(
    'mic-t26-011',
    'microbiology',
    'Antimicrobial susceptibility',
    'recall',
    'A bacterial resistance mechanism destroys the beta-lactam ring of a susceptible antimicrobial molecule. Which enzyme class is responsible?',
    [
      [
        'Catalase',
        'Catalase breaks down hydrogen peroxide; it does not hydrolyze the beta-lactam ring.',
      ],
      [
        'Coagulase',
        'Coagulase participates in plasma clotting reactions, not beta-lactam hydrolysis.',
      ],
      [
        'Beta-lactamase',
        'Beta-lactamases hydrolyze beta-lactam rings, inactivating drugs within their particular substrate spectrum.',
      ],
      ['Urease', 'Urease hydrolyzes urea rather than the beta-lactam ring.'],
    ],
    2,
    'ciulla',
    765,
    'Bacteriology - rationale 316, beta-lactam ring hydrolysis',
    'Beta-lactamases inactivate susceptible beta-lactam drugs by ring hydrolysis; their substrate ranges differ.',
  ),
  item(
    'mic-t26-012',
    'microbiology',
    'Antimicrobial susceptibility',
    'case',
    'In an appropriate staphylococcal workup, a validated induction test shows flattening of the clindamycin inhibition zone on the side facing erythromycin. What does this D-shaped zone indicate?',
    [
      [
        'A positive coagulase reaction',
        'Coagulase is assessed by a separate test and is not read from this paired antimicrobial zone pattern.',
      ],
      [
        'Loss of bacterial viability in the untreated control',
        'The D-shaped interaction concerns a resistance phenotype rather than absence of growth in a no-drug viability control.',
      ],
      [
        'Unconditional susceptibility to clindamycin',
        'Flattening in a positive induction test contradicts treating the isolate as unconditionally susceptible to clindamycin.',
      ],
      [
        'Inducible clindamycin resistance',
        'Erythromycin-associated blunting of the clindamycin zone is the characteristic positive D-test pattern for inducible clindamycin resistance.',
      ],
    ],
    3,
    'ciulla',
    679,
    'Bacteriology - D-zone test',
    'A positive D-test detects inducible clindamycin resistance in the appropriate organism context.',
  ),
];
