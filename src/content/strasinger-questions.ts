import type { Question } from './types';

type Choice = readonly [text: string, rationale: string];
function q(
  n: number,
  topic: string,
  kind: Question['kind'],
  stem: string,
  choices: readonly Choice[],
  answer: number,
  takeaway: string,
  pdfPage: number,
  chapter: string,
): Question {
  return {
    id: `ubf-s7-${String(n).padStart(3, '0')}`,
    subjectId: 'urine-body-fluids',
    topic,
    kind,
    difficulty: kind === 'case' ? 'Application' : 'Foundation',
    stem,
    options: choices.map(([text, rationale], i) => ({
      id: String.fromCharCode(65 + i),
      text,
      rationale,
    })),
    correctOptionId: String.fromCharCode(65 + answer),
    takeaway,
    source: {
      title: 'Urinalysis and Body Fluids',
      edition: '7th edition (Strasinger and Di Lorenzo, 2021)',
      pdfPage,
      chapter,
    },
    version: 1,
  };
}

// Original questions based on inspected explanatory pages; no publisher questions are imported.
// References use 1-based PDF viewer pages, not the book's printed page numbers.
export const strasingerQuestions: Question[] = [
  q(
    1,
    'Urine chemistry',
    'case',
    'An unrefrigerated urine specimen is left on a bench for several hours. Its glucose result falls while bacteria multiply. Which process best explains the glucose change?',
    [
      [
        'Bacterial use of glucose',
        'Bacterial metabolism consumes glucose in an inadequately preserved specimen.',
      ],
      [
        'Concentration of urine by evaporation',
        'Evaporation would tend to concentrate glucose, not explain its loss.',
      ],
      [
        'Increased glucose filtration after collection',
        'Renal filtration no longer changes the contents of the collected specimen.',
      ],
      [
        'Adsorption of bilirubin onto a reagent pad',
        'Bilirubin-pad chemistry does not explain glucose consumption before testing.',
      ],
    ],
    0,
    'An old specimen can acquire analytical abnormalities after collection; assess collection and preservation before interpretation.',
    120,
    '3: Introduction to Urinalysis — specimen integrity',
  ),
  q(
    2,
    'Urine chemistry',
    'case',
    'A urine sample was refrigerated appropriately. What should happen before routine reagent-strip chemistry is performed?',
    [
      [
        'Add formalin to accelerate the reactions',
        'Formalin can interfere with several chemical reactions and is not a warming substitute.',
      ],
      [
        'Allow the sample to reach room temperature and mix it',
        'Strip enzyme reactions are temperature dependent; mixing restores representative sampling.',
      ],
      [
        'Test only the clear upper layer while cold',
        'A cold, unmixed aliquot may yield unrepresentative or less sensitive reactions.',
      ],
      [
        'Remove all cells by discarding the sediment first',
        'Routine strip testing uses a well-mixed uncentrifuged specimen, not sediment-depleted urine.',
      ],
    ],
    1,
    'Control specimen temperature and mixing before testing refrigerated urine.',
    121,
    '3: Introduction to Urinalysis — preservation',
  ),
  q(
    3,
    'Urine chemistry',
    'case',
    'A concentrated first-morning specimen is requested after a very dilute random urine gives equivocal screening results. Why can this improve detection?',
    [
      [
        'It removes all interfering medications',
        'Collection timing does not eliminate every medication or metabolite.',
      ],
      [
        'It prevents all urinary crystals from forming',
        'Crystal formation is not abolished by first-morning collection.',
      ],
      [
        'Chemicals and formed elements may be more concentrated',
        'Overnight concentration can reveal constituents not apparent in a dilute random sample.',
      ],
      [
        'It converts a screening result into a definitive diagnosis',
        'Improved detection does not replace clinical correlation or confirmatory testing.',
      ],
    ],
    2,
    'Specimen concentration affects screening sensitivity; first-morning urine can provide a useful controlled specimen.',
    122,
    '3: Introduction to Urinalysis — first-morning specimen',
  ),
  q(
    4,
    'Urine chemistry',
    'case',
    'A 24-hour urine collection reaches the laboratory. Before a small aliquot is removed for quantitative chemistry, which step is essential?',
    [
      [
        'Use only the last void because it is freshest',
        'The last void alone does not represent the complete timed collection.',
      ],
      [
        'Estimate volume from the container label',
        'An estimate cannot substitute for an accurately measured collection volume.',
      ],
      [
        'Discard all sediment without mixing',
        'Unmixed sampling can produce a nonrepresentative aliquot.',
      ],
      [
        'Mix the full collection and measure its total volume',
        'Concentration and the actual collected volume are needed to calculate timed excretion.',
      ],
    ],
    3,
    'Timed excretion depends on both analyte concentration and a complete, accurately measured collection.',
    122,
    '3: Introduction to Urinalysis — timed specimens',
  ),
  q(
    5,
    'Urine chemistry',
    'case',
    'A technologist leaves excess urine on a reagent strip and holds it vertically. Unexpected adjacent-pad colors appear. What technical error is most plausible?',
    [
      [
        'Runover of reagents between pads',
        'Excess fluid can carry chemicals from one pad to an adjacent reaction area.',
      ],
      [
        'Selective removal of all urinary glucose',
        'Strip orientation does not selectively eliminate glucose from the specimen.',
      ],
      [
        'Normal independent color development on properly isolated pads',
        'The vertical, fluid-covered strip specifically permits abnormal transfer between pads.',
      ],
      [
        "A change in the patient's renal function during testing",
        'An immediate pad artifact should first prompt a technique check.',
      ],
    ],
    0,
    'Remove excess urine and read the strip in the recommended orientation to limit reagent runover.',
    165,
    '6: Chemical Examination of Urine — strip technique',
  ),
  q(
    6,
    'Urine chemistry',
    'recall',
    'Why should a strip result be compared with the chart supplied for that specific reagent-strip product?',
    [
      [
        'Every manufacturer uses identical reactions and colors',
        'Products can differ in reagents, timing, sensitivity, and color scales.',
      ],
      [
        'Manufacturer-specific colors and reaction timing are part of the method',
        'The supplied instructions and chart define interpretation for that product.',
      ],
      [
        'A color chart replaces the need for quality control',
        'A chart does not establish that the reagents are functioning correctly.',
      ],
      [
        'The chart makes storage conditions irrelevant',
        'Moisture, heat, and chemical exposure can still damage reagent strips.',
      ],
    ],
    1,
    'Do not interchange reagent-strip charts or ignore product-specific instructions.',
    166,
    '6: Chemical Examination of Urine — strip handling',
  ),
  q(
    7,
    'Urine chemistry',
    'case',
    'An opened bottle of reagent strips is stored uncapped in a humid room. Why is a desiccant-containing, tightly closed original container preferred?',
    [
      [
        'It makes all reactions independent of temperature',
        'Reaction temperature remains important even with correct storage.',
      ],
      [
        'It removes drug pigments from patient urine',
        'Packaging cannot remove interfering pigments from a specimen.',
      ],
      [
        'It limits moisture and light damage to the reagent pads',
        'The original protected container helps maintain reagent integrity.',
      ],
      [
        'It sterilizes a contaminated urine specimen',
        'Storage packaging does not sterilize patient specimens.',
      ],
    ],
    2,
    'Strip storage is part of analytical quality, not merely a packaging preference.',
    166,
    '6: Chemical Examination of Urine — strip storage',
  ),
  q(
    8,
    'Urine chemistry',
    'case',
    'A trainee proposes distilled water as the only negative quality-control material for urine strips. What is the best objection?',
    [
      [
        'Water always contains pathological amounts of albumin',
        'That is not why water is unsuitable as the sole negative control.',
      ],
      [
        'Negative controls should contain every analyte at high concentration',
        'That describes neither the purpose nor the expected values of negative controls.',
      ],
      [
        'Controls are unnecessary if the expiration date is valid',
        'An unexpired bottle can still be damaged or handled incorrectly.',
      ],
      [
        'The strip reactions are designed for a urine-like ionic matrix',
        'A suitable negative control challenges the method in an appropriate matrix.',
      ],
    ],
    3,
    'Use appropriate positive and negative control materials and resolve out-of-range controls.',
    167,
    '6: Chemical Examination of Urine — quality control',
  ),
  q(
    9,
    'Urine chemistry',
    'case',
    'A sample from a patient taking phenazopyridine has intensely orange urine. Controls pass, but several strip colors are atypical. What should the technologist consider?',
    [
      [
        'Specimen pigment interference despite acceptable reagent controls',
        'Patient-specific pigment can mask color reactions even when controls are acceptable.',
      ],
      [
        'Controls prove every patient result is interference-free',
        'Controls assess reagent performance but do not exclude specimen-specific interference.',
      ],
      [
        'Orange urine confirms bilirubinuria by itself',
        'Color alone is nonspecific and may reflect medication.',
      ],
      [
        'The atypical colors must all be reported as maximum positives',
        'Uninterpretable color should not be converted into unsupported positive results.',
      ],
    ],
    0,
    'Passing controls do not exclude interference within an individual specimen.',
    167,
    '6: Chemical Examination of Urine — confirmatory testing',
  ),
  q(
    10,
    'Urine chemistry',
    'recall',
    'What principle underlies the traditional urine reagent-strip protein pad?',
    [
      [
        'Nitrite reduction by bacteria',
        'Nitrate reduction is relevant to nitrite screening, not the protein indicator reaction.',
      ],
      [
        'A protein-dependent indicator color change at buffered pH',
        'Protein accepts hydrogen ions from the indicator while the pad is buffered.',
      ],
      [
        'Precipitation of protein by sulfosalicylic acid',
        'SSA precipitation is a separate protein method, not the indicator-pad principle.',
      ],
      [
        'Direct oxidation of albumin by glucose oxidase',
        'Glucose oxidase is used for glucose detection, not this protein-indicator reaction.',
      ],
    ],
    1,
    'The protein error of indicators produces color without requiring a bulk change in specimen pH.',
    171,
    '6: Chemical Examination of Urine — protein reactions',
  ),
  q(
    11,
    'Urine chemistry',
    'case',
    'Highly buffered alkaline urine produces a protein-pad color despite no confirmed protein increase. What mechanism can produce this false-positive reaction?',
    [
      [
        'Failure of a glucose-specific enzyme reaction',
        'The protein pad is not based on the glucose oxidase reaction.',
      ],
      [
        'Bacterial conversion of nitrate to nitrite',
        'That process is detected by the nitrite pad, not the protein indicator.',
      ],
      [
        "Overriding the pad's acid buffer",
        'An alkaline shift can change indicator color independently of protein.',
      ],
      [
        'Selective inhibition of every albumin amino group',
        'This would not account for the specified alkaline false-positive mechanism.',
      ],
    ],
    2,
    'A protein-pad color must be interpreted with specimen pH, buffering, and technique in mind.',
    171,
    '6: Chemical Examination of Urine — protein interference',
  ),
  q(
    12,
    'Urine chemistry',
    'case',
    'An adolescent has negative first-morning protein but positive protein after several hours upright. Which explanation best fits this collection pattern?',
    [
      [
        'All proteinuria must reflect permanent glomerular destruction',
        'Proteinuria can be transient or posture related.',
      ],
      [
        'A positive daytime result proves monoclonal light-chain disease',
        'The posture-dependent pattern does not establish a monoclonal disorder.',
      ],
      [
        'Refrigeration converts albumin to glucose overnight',
        'This conversion does not explain the collection pattern.',
      ],
      [
        'Orthostatic proteinuria',
        'Postural proteinuria appears after upright activity and disappears after recumbency.',
      ],
    ],
    3,
    'Comparing controlled first-morning and upright specimens helps evaluate a posture-related protein pattern.',
    170,
    '6: Chemical Examination of Urine — orthostatic proteinuria',
  ),
  q(
    13,
    'Urine chemistry',
    'case',
    'Glucose is present in urine while the paired blood glucose is not elevated. Which mechanism can explain this finding?',
    [
      [
        'Impaired tubular glucose reabsorption',
        'Glucose can escape reabsorption without hyperglycemia when tubular handling is impaired.',
      ],
      [
        'Glucose must always indicate a high current blood glucose',
        'Renal glucosuria can occur without concurrent hyperglycemia.',
      ],
      [
        'Postrenal addition of inflammatory protein alone',
        'Adding protein to urine does not explain true glucosuria with a normal paired blood glucose.',
      ],
      [
        'Bacterial consumption of glucose alone',
        'Consumption would lower glucose rather than explain its escape into urine.',
      ],
    ],
    0,
    'Interpret urinary glucose with blood glucose and renal tubular handling, not as an isolated diagnosis.',
    174,
    '6: Chemical Examination of Urine — renal glycosuria',
  ),
  q(
    14,
    'Urine chemistry',
    'recall',
    'In a glucose oxidase-peroxidase urine pad, what links glucose oxidation to the final chromogen reaction?',
    [
      ['Formation of nitrite', 'Nitrite belongs to a separate reagent-pad reaction.'],
      [
        'Generation of hydrogen peroxide',
        'Glucose oxidase produces peroxide, which participates in the peroxidase color step.',
      ],
      [
        'Formation of calcium oxalate crystals',
        'Crystal formation does not link these enzyme reactions.',
      ],
      [
        'Binding of hydrogen ions to protein',
        'That mechanism belongs to the protein-indicator reaction, not glucose oxidation.',
      ],
    ],
    1,
    'The glucose pad couples a glucose-specific enzyme step to peroxide-dependent color formation.',
    174,
    '6: Chemical Examination of Urine — glucose oxidase reaction',
  ),
  q(
    15,
    'Urine chemistry',
    'case',
    'A urine container is contaminated with a strong oxidizing cleaning agent. Which glucose-pad error is plausible?',
    [
      [
        'A guaranteed negative glucose result',
        'An oxidizing contaminant may instead generate color.',
      ],
      [
        'A reliable quantitative measurement of all sugars',
        'A contaminated specimen cannot become an accurate all-sugar assay.',
      ],
      [
        'A false-positive color reaction',
        'Oxidizing agents can drive chromogen oxidation without urinary glucose.',
      ],
      [
        'Elimination of the need for a fresh specimen',
        'The interference warrants investigation rather than acceptance of contamination.',
      ],
    ],
    2,
    'Collection-container contamination can create chemistry results unrelated to patient physiology.',
    175,
    '6: Chemical Examination of Urine — glucose interference',
  ),
  q(
    16,
    'Urine chemistry',
    'case',
    'A reducing substance inhibits color formation in a susceptible glucose oxidase-peroxidase strip. What direction of error should be considered?',
    [
      [
        'False increase due to additional albumin',
        'Albumin does not account for inhibition of chromogen oxidation.',
      ],
      [
        'Conversion of the result into a direct blood glucose value',
        'A urine strip does not directly measure blood glucose.',
      ],
      [
        'Greater apparent glucose from more complete chromogen oxidation',
        'A reducing interferent opposes rather than enhances chromogen oxidation.',
      ],
      [
        'A falsely decreased glucose result',
        'Reducing substances such as ascorbate can oppose chromogen oxidation in susceptible methods.',
      ],
    ],
    3,
    'Interference depends on the strip formulation; consult product information when ascorbate interference is suspected.',
    175,
    '6: Chemical Examination of Urine — glucose interference',
  ),
  q(
    17,
    'Urine chemistry',
    'recall',
    'Which statement best describes an important limitation of a conventional urine nitroprusside ketone pad?',
    [
      [
        'It does not detect beta-hydroxybutyrate',
        'The reaction detects acetoacetate but does not measure beta-hydroxybutyrate.',
      ],
      [
        'It measures only beta-hydroxybutyrate',
        'Acetoacetate, rather than beta-hydroxybutyrate, is the principal target.',
      ],
      [
        'It responds equally to all ketone bodies',
        'The reaction has unequal specificity and does not measure all ketones.',
      ],
      [
        'It cannot detect acetoacetate',
        'Acetoacetate is the principal ketone detected by the reaction.',
      ],
    ],
    0,
    'A conventional urine ketone pad is not a measurement of total ketone bodies.',
    177,
    '6: Chemical Examination of Urine — ketone reactions',
  ),
  q(
    18,
    'Urine chemistry',
    'case',
    'A patient with prolonged vomiting and little food intake has urinary ketones. Which interpretation is most appropriate?',
    [
      [
        'Ketonuria proves diabetes in every case',
        'Reduced carbohydrate availability can produce ketones without diabetes.',
      ],
      [
        'Fat metabolism can increase when carbohydrate availability is limited',
        'Poor intake and vomiting can shift energy production toward fat metabolism.',
      ],
      [
        'Ketones are produced only by urinary bacteria',
        'They are products of systemic fat metabolism.',
      ],
      [
        'A positive ketone pad proves a bacterial UTI',
        'The ketone pad is not an infection-specific assay.',
      ],
    ],
    1,
    'Ketonuria has multiple contexts; correlate it with intake, symptoms, and other findings.',
    176,
    '6: Chemical Examination of Urine — ketone significance',
  ),
  q(
    19,
    'Urine chemistry',
    'case',
    'After a crush injury, a patient has red-brown urine with a positive blood pad but few intact RBCs. Which additional substance can produce this reaction?',
    [
      [
        'Urobilinogen from increased intestinal pigment metabolism',
        'Urobilinogen is measured by a different pad and does not explain heme activity.',
      ],
      ['Conjugated bilirubin only', 'The bilirubin pad uses a different chemical reaction.'],
      [
        'Myoglobin released from damaged muscle',
        'Myoglobin contains heme and reacts on the blood pad.',
      ],
      ['Uromodulin alone', 'Uromodulin is a cast-matrix protein, not a heme pigment.'],
    ],
    2,
    'A blood-pad result detects heme activity and should be correlated with microscopy and clinical context.',
    178,
    '6: Chemical Examination of Urine — myoglobinuria',
  ),
  q(
    20,
    'Urine chemistry',
    'recall',
    'Which catalytic property is used by the urine reagent-strip blood pad?',
    [
      ['Glucose oxidase activity', 'That enzyme is used in the glucose pad.'],
      [
        'Bacterial nitrate reductase activity',
        'Nitrate reduction is relevant to nitrite screening.',
      ],
      ['Albumin precipitation', 'The blood-pad reaction is not a protein precipitation test.'],
      [
        'Heme-associated pseudoperoxidase activity',
        'Hemoglobin and myoglobin catalyze oxidation of the blood-pad chromogen.',
      ],
    ],
    3,
    'Heme-associated catalysis explains why hemoglobin and myoglobin can both trigger the blood pad.',
    178,
    '6: Chemical Examination of Urine — blood reactions',
  ),
  q(
    21,
    'Urine chemistry',
    'case',
    'A person voids frequently, leaving little time for urine to remain in the bladder. Why might nitrite screening be negative despite nitrate-reducing bacteria?',
    [
      [
        'Insufficient time for nitrate conversion to detectable nitrite',
        'The screening reaction depends on bacterial contact with urinary nitrate over time.',
      ],
      [
        'Every bacterial cell is directly counted by the nitrite pad',
        'The pad detects a metabolic product, not individual bacterial cells.',
      ],
      [
        'Nitrite forms only in refrigerated urine',
        'Nitrite formation is not restricted to refrigeration.',
      ],
      [
        'Frequent voiding makes urine culture unnecessary',
        'A negative nitrite screen does not exclude infection.',
      ],
    ],
    0,
    'Nitrite screening depends on organism capability, substrate, and bladder dwell time.',
    184,
    '6: Chemical Examination of Urine — nitrite limitations',
  ),
  q(
    22,
    'Urine chemistry',
    'recall',
    'A positive nitrite-pad color should be interpreted as which type of result?',
    [
      [
        'An exact bacterial count per milliliter',
        'Shade intensity does not provide an exact organism count.',
      ],
      [
        'A qualitative screening result',
        'The result is reported as positive or negative rather than degree of bacteriuria.',
      ],
      ['Identification of the bacterial species', 'Nitrite does not identify a species.'],
      ['Proof of antimicrobial susceptibility', 'The reaction supplies no susceptibility result.'],
    ],
    1,
    'A nitrite pad is a qualitative screen, not a culture count or organism identification.',
    183,
    '6: Chemical Examination of Urine — nitrite reaction',
  ),
  q(
    23,
    'Urine chemistry',
    'case',
    'Dilute alkaline urine gives positive leukocyte esterase but few intact leukocytes are seen. Which explanation can reconcile the results?',
    [
      [
        'Every positive esterase reaction must be bacterial contamination',
        'Esterase can be detected in inflammatory cells or after their lysis.',
      ],
      [
        'Only intact cells can produce any esterase-pad signal',
        'Esterases from lysed cells may remain detectable.',
      ],
      [
        'Leukocytes have lysed, but their esterases remain detectable',
        'Chemical detection can persist when intact cells are no longer readily visible.',
      ],
      [
        'A positive esterase result requires a positive nitrite result',
        'Leukocyte enzyme activity and bacterial nitrate reduction are different processes.',
      ],
    ],
    2,
    'Chemical and microscopic findings need correlation; cell lysis can explain apparent disagreement.',
    184,
    '6: Chemical Examination of Urine — leukocyte esterase',
  ),
  q(
    24,
    'Urine chemistry',
    'case',
    'Glucose-rich urine gives a higher refractometric specific gravity than its strip-based specific gravity suggests. Which method distinction helps explain this?',
    [
      [
        'Both methods respond equally to every dissolved substance',
        'The strip and refractometer have different solute responses.',
      ],
      [
        'The strip directly weighs every dissolved molecule',
        'The strip responds to ionic concentration through a polyelectrolyte reaction.',
      ],
      [
        'Glucose always produces a strong positive protein-pad result',
        'That does not explain the specific-gravity method difference.',
      ],
      [
        'The strip is primarily responsive to ionic solutes',
        'Large nonionic molecules such as glucose affect refractometry differently from the strip reaction.',
      ],
    ],
    3,
    'Specific-gravity methods have different analytical responses; method discrepancies can be informative.',
    185,
    '6: Chemical Examination of Urine — specific gravity',
  ),
  q(
    25,
    'Urine microscopy',
    'case',
    'A laboratory centrifuges 10 mL of urine and resuspends the sediment in 0.5 mL. What is the sediment concentration factor?',
    [
      [
        '20-fold',
        'The concentration factor is starting volume divided by final sediment volume: 10 / 0.5 = 20.',
      ],
      ['5-fold', 'This does not equal starting volume divided by final volume.'],
      ['0.05-fold', 'That is the inverse ratio and represents dilution rather than concentration.'],
      ['100-fold', 'A 100-fold concentration would require a 0.1-mL final volume from 10 mL.'],
    ],
    0,
    'Standardized starting and final volumes make sediment results more comparable.',
    194,
    '7: Microscopic Examination of Urine — sediment preparation',
  ),
  q(
    26,
    'Urine microscopy',
    'recall',
    'Why should urine sediment be gently but thoroughly resuspended before a slide is prepared?',
    [
      [
        'To make all crystals disappear',
        'Resuspension does not selectively dissolve all crystals.',
      ],
      [
        'To distribute elements without excessive cellular disruption',
        'Uniform suspension improves representativeness while gentle handling preserves fragile elements.',
      ],
      [
        'To replace the need for microscope calibration',
        'Good mixing does not calibrate the microscope.',
      ],
      [
        'To make the final sediment volume irrelevant',
        'A consistent final volume is still required to control the concentration factor.',
      ],
    ],
    1,
    'Consistent preparation is essential for interpreting urine microscopy counts.',
    194,
    '7: Microscopic Examination of Urine — sediment preparation',
  ),
  q(
    27,
    'Urine microscopy',
    'case',
    'An unstained urine sediment is examined with very intense bright-field illumination. Which clinically relevant structure is especially easy to overlook?',
    [
      [
        'A large opaque foreign fiber',
        'A conspicuous opaque artifact is less affected by low optical contrast.',
      ],
      [
        'An air bubble with a strongly refractile edge',
        'Air bubbles have strong optical contrast.',
      ],
      [
        'A hyaline cast with a low refractive index',
        'Its refractive index is similar to urine, so reduced illumination improves visibility.',
      ],
      [
        'A heavily pigmented crystal clump',
        'Strong pigmentation is not the low-contrast problem described.',
      ],
    ],
    2,
    'Appropriate illumination helps prevent missing low-contrast sediment elements.',
    201,
    '7: Microscopic Examination of Urine — bright-field microscopy',
  ),
  q(
    28,
    'Urine microscopy',
    'recall',
    'Which microscopy method is particularly useful for enhancing low-contrast hyaline casts without relying solely on staining?',
    [
      [
        'Increasing bright-field light to maximum',
        'Excess light can obscure low-refractive-index elements.',
      ],
      ['Macroscopic color inspection only', 'Gross inspection cannot identify individual casts.'],
      [
        'Counting only the top layer of an unmixed sample',
        'Unmixed sampling can omit sediment elements entirely.',
      ],
      [
        'Phase-contrast microscopy',
        'Phase contrast enhances visibility through differences in optical phase.',
      ],
    ],
    3,
    'Choose an optical method that improves contrast for the structure being sought.',
    201,
    '7: Microscopic Examination of Urine — phase contrast',
  ),
  q(
    29,
    'Urine microscopy',
    'case',
    'A separate aliquot of sediment is treated with dilute acetic acid to help distinguish RBCs from yeast. What finding supports RBC identity?',
    [
      [
        'The suspected cells lyse',
        'Acetic acid lyses RBCs while yeast and several other mimics remain.',
      ],
      [
        'The structures remain strongly refractile and unaffected',
        'Persistence would favor an acid-resistant mimic rather than RBC lysis.',
      ],
      [
        'Multilobed nuclei become apparent',
        'Multilobed nuclei support WBCs rather than mature erythrocytes.',
      ],
      [
        'Maltese crosses appear under polarized light',
        'That finding favors lipid-containing structures rather than RBCs.',
      ],
    ],
    0,
    'Use a separate aliquot for destructive identification aids; do not lose the original sediment findings.',
    204,
    '7: Microscopic Examination of Urine — red blood cells',
  ),
  q(
    30,
    'Urine microscopy',
    'recall',
    'Which finding most directly favors yeast over an erythrocyte in urine sediment?',
    [
      [
        'A smooth nonnucleated outline alone',
        'That feature can fit an RBC and is insufficient to establish yeast.',
      ],
      [
        'A clearly attached bud',
        'Budding is an identifying clue for yeast rather than mature RBCs.',
      ],
      ['Absence of a nucleus alone', 'Lack of a visible nucleus is not specific for yeast.'],
      ['A rounded outline alone', 'Many sediment constituents are rounded.'],
    ],
    1,
    'Identification should rely on distinguishing structures, not shape alone.',
    214,
    '7: Microscopic Examination of Urine — yeast',
  ),
  q(
    31,
    'Urine microscopy',
    'case',
    'Urinary RBCs appear shrunken and crenated in a concentrated specimen. Which physical process accounts for this appearance?',
    [
      [
        'Water enters cells until they swell',
        'Water entry is the expected direction in dilute, not concentrated, urine.',
      ],
      [
        'The cells lose hemoglobin after hypotonic swelling',
        'Hypotonic swelling and ghost formation fit dilute urine instead.',
      ],
      [
        'Water leaves the cells in the concentrated medium',
        'Cell water loss produces shrinkage and crenation.',
      ],
      [
        'Budding produces smaller daughter cells',
        'Budding is a yeast feature, not an explanation for crenated RBCs.',
      ],
    ],
    2,
    'Urine concentration can alter RBC appearance and complicate identification.',
    204,
    '7: Microscopic Examination of Urine — RBC morphology',
  ),
  q(
    32,
    'Urine microscopy',
    'case',
    'A dilute specimen contains faint, enlarged membrane outlines with little remaining hemoglobin. What are these structures most consistent with?',
    [
      [
        'Triple-phosphate crystals',
        'These crystals are geometric rather than empty cellular membranes.',
      ],
      ['Budding yeast', 'Budding and refractile cell walls favor yeast, not pale membrane ghosts.'],
      ['Squamous nuclei', 'Squamous cells have a surrounding broad cytoplasmic sheet and nucleus.'],
      [
        'Ghost RBCs after swelling and hemolysis',
        'Hypotonic urine can cause RBC swelling, hemoglobin loss, and residual membranes.',
      ],
    ],
    3,
    'Dilute urine can lyse RBCs, reducing the number of easily recognized intact cells.',
    204,
    '7: Microscopic Examination of Urine — ghost cells',
  ),
  q(
    33,
    'Urine microscopy',
    'recall',
    'What is the principal purpose of Sternheimer-Malbin staining in routine sediment examination?',
    [
      [
        'Improve structural visibility and nucleus-cytoplasm contrast',
        'The supravital stain improves delineation of cells and casts.',
      ],
      [
        'Determine an exact urine glucose concentration',
        'This stain is not a quantitative chemistry assay.',
      ],
      [
        'Prove that every stained cell is malignant',
        'Staining improves morphology but does not establish malignancy by itself.',
      ],
      [
        'Remove all formed elements before counting',
        'The goal is visualization, not elimination of formed elements.',
      ],
    ],
    0,
    'A sediment stain is an identification aid rather than a substitute for complete urinalysis correlation.',
    196,
    '7: Microscopic Examination of Urine — sediment stains',
  ),
  q(
    34,
    'Urine microscopy',
    'recall',
    'Which stain can confirm yellow-brown iron-containing hemosiderin granules in urinary cells?',
    [
      ['Sudan III', 'Sudan dyes are used for neutral lipid, not specifically for iron.'],
      ['Prussian blue', 'Prussian blue demonstrates iron-containing hemosiderin.'],
      [
        'Gram stain alone',
        'Gram staining classifies bacteria and does not specifically establish hemosiderin.',
      ],
      [
        'Acetic acid alone',
        'Acetic acid aids some cellular distinctions but is not an iron stain.',
      ],
    ],
    1,
    'Match confirmatory stains to the suspected inclusion or constituent.',
    196,
    '7: Microscopic Examination of Urine — stain characteristics',
  ),
  q(
    35,
    'Urine microscopy',
    'case',
    'A sediment contains very large, flat cells with abundant irregular cytoplasm and small central nuclei. Which epithelial type best fits?',
    [
      ['Renal tubular cells exclusively', 'RTE cells are smaller and often have eccentric nuclei.'],
      [
        'Neutrophils',
        'Neutrophils have granular cytoplasm and multilobed nuclei, not broad flat sheets.',
      ],
      [
        'Squamous epithelial cells',
        'Large size and abundant flat cytoplasm are characteristic of squamous cells.',
      ],
      ['RBCs', 'RBCs are smaller and lack nuclei.'],
    ],
    2,
    'Recognizing squamous morphology helps distinguish common contamination from renal epithelial findings.',
    207,
    '7: Microscopic Examination of Urine — epithelial cells',
  ),
  q(
    36,
    'Urine microscopy',
    'case',
    'Numerous epithelial cells with eccentric nuclei are identified as renal tubular cells rather than squamous cells. Why does the distinction matter?',
    [
      [
        'Both cell types always have identical significance',
        'The site of cellular origin changes the interpretation.',
      ],
      [
        'Squamous cells prove glomerulonephritis',
        'Squamous cells usually arise from lower tract or genital surfaces.',
      ],
      [
        'Renal tubular cells can only enter urine from skin contamination',
        'Their origin is within the nephron.',
      ],
      [
        'Increased RTE cells can indicate tubular injury',
        'Tubular cell shedding can reflect renal tubular damage or necrosis.',
      ],
    ],
    3,
    'Correct epithelial classification can separate a contamination clue from evidence of renal injury.',
    210,
    '7: Microscopic Examination of Urine — renal tubular epithelium',
  ),
  q(
    37,
    'Urine microscopy',
    'recall',
    'Which substance forms most of the protein framework of urinary casts?',
    [
      ['Uromodulin', 'Uromodulin is the major cast-matrix protein.'],
      ['Bilirubin', 'Bilirubin may pigment structures but is not the main cast framework.'],
      ['Calcium pyrophosphate', 'This is a crystal constituent, not the routine cast matrix.'],
      ['Glucose', 'Glucose does not form the protein matrix.'],
    ],
    0,
    'Casts are molds formed within renal tubules, with uromodulin as their principal matrix.',
    216,
    '7: Microscopic Examination of Urine — cast formation',
  ),
  q(
    38,
    'Urine microscopy',
    'case',
    'A few colorless hyaline casts appear after strenuous exercise, without other concerning findings. Which conclusion is best supported?',
    [
      [
        'Any hyaline cast proves irreversible renal failure',
        'Hyaline casts can increase transiently with exercise and other stressors.',
      ],
      [
        'Interpret the casts in context rather than assigning a diagnosis from them alone',
        'Hyaline casts are nonspecific and may occur with physiological stress.',
      ],
      ['All hyaline casts contain bacteria', 'A hyaline cast is primarily a protein matrix.'],
      ['Hyaline casts originate in the bladder wall', 'Casts form within the kidney.'],
    ],
    1,
    'Cast type and accompanying findings matter more than the mere presence of a cast.',
    217,
    '7: Microscopic Examination of Urine — hyaline casts',
  ),
  q(
    39,
    'Urine microscopy',
    'case',
    'An apparent clump of erythrocytes is being considered an RBC cast. What must be confirmed before reporting it as a cast?',
    [
      ['A positive urine glucose reaction', 'Glucose does not establish a cast framework.'],
      ['A budding cell at one end', 'Budding would raise a yeast identification question.'],
      [
        'RBCs incorporated in a true cast matrix',
        'A cell clump alone lacks the tubular protein mold required for a cast.',
      ],
      ['A squamous cell attached to every RBC', 'That is not a criterion for an RBC cast.'],
    ],
    2,
    'A clinically important cast identification requires confirmation of both the matrix and its contents.',
    218,
    '7: Microscopic Examination of Urine — RBC cast confirmation',
  ),
  q(
    40,
    'Urine microscopy',
    'case',
    'A broad, highly refractile urinary cast has notched sides and broken ends. Which description best fits?',
    [
      [
        'A fresh hyaline cast with no degeneration',
        'Fresh hyaline casts have low contrast and lack the characteristic brittle appearance.',
      ],
      ['An isolated RBC', 'A single RBC is not an elongated tubular mold.'],
      ['A motile flagellate', 'A cast is not motile and lacks flagella.'],
      [
        'A waxy cast associated with prolonged tubular stasis',
        'Waxy casts have a rigid, refractile appearance with jagged ends or notches.',
      ],
    ],
    3,
    'Waxy and broad casts suggest prolonged stasis and should be correlated with renal findings.',
    223,
    '7: Microscopic Examination of Urine — waxy and broad casts',
  ),
  q(
    41,
    'Urine microscopy',
    'case',
    'A refrigerated acidic urine develops pink granular sediment that largely disappears after warming. Which material is most likely?',
    [
      [
        'Amorphous urates',
        'Urates can precipitate with cooling and produce a pink sediment from adsorbed pigment.',
      ],
      [
        'A permanent sheet of squamous epithelium',
        'Warming does not selectively dissolve epithelial sheets in this way.',
      ],
      [
        'A heavy bacterial culture confirmed by color alone',
        'Pink precipitate alone does not establish bacteriuria.',
      ],
      [
        'A collection of WBC casts',
        'Warming-related crystal dissolution is not a WBC-cast characteristic.',
      ],
    ],
    0,
    'Temperature and pH help distinguish precipitated material from cells or casts.',
    227,
    '7: Microscopic Examination of Urine — amorphous urates',
  ),
  q(
    42,
    'Urine microscopy',
    'recall',
    'A colorless envelope-shaped urinary crystal is most characteristic of which substance?',
    [
      ['Cystine', 'Cystine classically forms colorless hexagonal plates.'],
      [
        'Calcium oxalate dihydrate',
        'The dihydrate commonly has an octahedral envelope appearance.',
      ],
      ['Leucine', 'Leucine forms yellow-brown spheres with concentric and radial markings.'],
      ['Cholesterol', 'Cholesterol commonly forms flat plates with notched corners.'],
    ],
    1,
    'Crystal morphology should be correlated with urine pH, polarization, and specimen history.',
    228,
    '7: Microscopic Examination of Urine — calcium oxalate',
  ),
  q(
    43,
    'Urine microscopy',
    'case',
    'Colorless hexagonal plates are found in acidic urine. Which crystal should be considered first?',
    [
      [
        'Ammonium biurate',
        'Ammonium biurate forms spiculated spheres, typically in alkaline old urine.',
      ],
      [
        'Triple phosphate',
        'Triple phosphate is associated with coffin-lid forms rather than hexagonal plates.',
      ],
      ['Cystine', 'Colorless hexagonal plates in acid urine are characteristic of cystine.'],
      ['Calcium carbonate', 'Calcium carbonate often forms small spheres or dumbbells.'],
    ],
    2,
    'An abnormal crystal identity needs confirmation and clinical correlation rather than shape-only diagnosis.',
    232,
    '7: Microscopic Examination of Urine — abnormal crystals',
  ),
  q(
    44,
    'Urine microscopy',
    'case',
    'A report calls a refractile flat crystal cholesterol. Which additional feature is most supportive?',
    [
      ['Rapid flagellar motion', 'Motility is not a cholesterol-crystal feature.'],
      ['A multilobed nucleus', 'Crystals do not have nuclei.'],
      ['A bud joined by a narrow neck', 'That feature favors yeast.'],
      [
        'A plate with notched corners and associated lipid findings',
        'Notched plates and concordant lipiduria support cholesterol identification.',
      ],
    ],
    3,
    'Use morphology together with associated sediment and chemistry findings to identify crystals.',
    233,
    '7: Microscopic Examination of Urine — cholesterol crystals',
  ),
  q(
    45,
    'Cerebrospinal fluid',
    'case',
    'A clear CSF specimen arrives for cell counting. Why should visual clarity not be used to cancel the count?',
    [
      [
        'A clear specimen can still contain an abnormal number of cells',
        'Visible turbidity is not required for clinically relevant cellular findings.',
      ],
      [
        'Clear CSF never contains any protein',
        'CSF normally contains protein at lower concentrations than plasma.',
      ],
      [
        'Only bloody specimens can contain leukocytes',
        'Leukocytes can be present without blood contamination.',
      ],
      ['All clear specimens are sterile', 'Appearance alone does not establish sterility.'],
    ],
    0,
    'CSF appearance does not replace indicated microscopic and microbiological examination.',
    282,
    '10: Cerebrospinal Fluid — cell count',
  ),
  q(
    46,
    'Cerebrospinal fluid',
    'case',
    'CSF cell counting is delayed for hours at room temperature. Which analytical concern is most important?',
    [
      [
        'Cells multiply and create a falsely high WBC count',
        'Human leukocytes do not multiply in the collected sample to explain this delay effect.',
      ],
      [
        'Cell lysis can lower the measured count',
        'CSF cells, especially granulocytes, deteriorate rapidly after collection.',
      ],
      [
        'The count becomes independent of cellular preservation',
        'Preservation strongly affects how many intact cells remain for counting.',
      ],
      ['The delay guarantees that all erythrocytes stay intact', 'RBCs can also lyse in CSF.'],
    ],
    1,
    'Prompt processing protects CSF cellular results from preanalytical loss.',
    282,
    '10: Cerebrospinal Fluid — cell stability',
  ),
  q(
    47,
    'Cerebrospinal fluid',
    'recall',
    'What is the purpose of cytocentrifugation when preparing a CSF differential?',
    [
      [
        'To obtain a glucose result from cell morphology',
        'Glucose measurement needs a chemical assay rather than a concentrated slide.',
      ],
      ['To measure glucose without reagents', 'Cytocentrifugation is not a glucose assay.'],
      [
        'To concentrate scarce cells into a small examination area',
        'A concentrated monolayer improves the chance of identifying relevant cells.',
      ],
      [
        'To remove every cell before staining',
        'The cells are the material needed for the differential.',
      ],
    ],
    2,
    'A low-count fluid benefits from cell concentration, while preparation artifacts still require recognition.',
    284,
    '10: Cerebrospinal Fluid — cytocentrifugation',
  ),
  q(
    48,
    'Cerebrospinal fluid',
    'case',
    'A CSF differential slide has prominent nucleoli and nuclear clefting not expected from the chamber count. What preparation-related possibility should be considered?',
    [
      [
        'The chamber count identifies every malignant lineage',
        'A chamber count does not establish lineage or malignancy.',
      ],
      [
        'All cellular distortion proves leukemia',
        'Preparation artifacts can mimic pathological changes.',
      ],
      [
        'Centrifugation prevents all morphological artifacts',
        'Cytocentrifugation can itself distort cells.',
      ],
      [
        'Cytocentrifugation-related cellular distortion',
        'This preparation may cause vacuoles, clefting, prominent nucleoli, and cellular clumping.',
      ],
    ],
    3,
    'Correlate cytospin morphology with specimen counts and preparation quality before assigning significance.',
    284,
    '10: Cerebrospinal Fluid — cytocentrifugation artifacts',
  ),
  q(
    49,
    'Cerebrospinal fluid',
    'case',
    'Oligoclonal bands are found in CSF. Why should a paired serum sample be examined?',
    [
      [
        'To distinguish CSF-restricted bands from systemic bands entering the fluid',
        'Paired patterns help assess local immunoglobulin production versus systemic contribution.',
      ],
      [
        'To prove that every band is albumin',
        'Oligoclonal bands reflect immunoglobulin patterns, not a blanket albumin identity.',
      ],
      [
        'To replace all clinical assessment',
        'Banding patterns must still be interpreted in clinical context.',
      ],
      [
        'To make band detection independent of the analytical method',
        'Method sensitivity and handling remain important.',
      ],
    ],
    0,
    'CSF-restricted banding is more informative than an unpaired CSF pattern.',
    292,
    '10: Cerebrospinal Fluid — oligoclonal bands',
  ),
  q(
    50,
    'Cerebrospinal fluid',
    'recall',
    'Why are albumin measurements used when evaluating the source of increased CSF IgG?',
    [
      ['Albumin is the same molecule as IgG', 'Albumin and IgG are distinct proteins.'],
      [
        'They help assess blood-CSF barrier contribution',
        'Paired albumin and IgG relationships help account for protein entering from blood.',
      ],
      [
        'Albumin proves every CSF infection is viral',
        'Albumin does not identify an infectious agent.',
      ],
      [
        'A normal serum albumin eliminates the need to test CSF',
        'CSF and serum relationships, not serum albumin alone, are relevant.',
      ],
    ],
    1,
    'Interpret immunoglobulin increases with paired protein measurements and barrier function.',
    292,
    '10: Cerebrospinal Fluid — albumin and IgG indices',
  ),
  q(
    51,
    'Cerebrospinal fluid',
    'case',
    'CSF glucose is being interpreted without a blood glucose result. What important comparison is missing?',
    [
      [
        'Urine ketone-pad intensity',
        'A urine ketone result is not the reference comparison for CSF glucose.',
      ],
      [
        'The percentage of squamous epithelial cells',
        'Squamous-cell percentage does not define CSF glucose interpretation.',
      ],
      [
        'The circulating glucose concentration',
        'CSF glucose depends on plasma glucose and transport across the barrier.',
      ],
      [
        'The color of a serum separator cap alone',
        'Container color does not supply a glucose concentration.',
      ],
    ],
    2,
    'A CSF glucose concentration should be evaluated relative to blood glucose and collection timing.',
    293,
    '10: Cerebrospinal Fluid — glucose',
  ),
  q(
    52,
    'Cerebrospinal fluid',
    'case',
    'An elevated CSF lactate is found after severe CNS hypoxia. Which interpretation avoids overcalling infection?',
    [
      [
        'Any elevated lactate proves bacterial meningitis',
        'Hypoxia can elevate CSF lactate without bacterial infection.',
      ],
      [
        'Lactate can only originate from urinary bacteria',
        'Lactate is also produced by tissue metabolism.',
      ],
      [
        'A lactate elevation excludes tissue injury',
        'Tissue oxygen deprivation is one cause of elevated lactate.',
      ],
      [
        'Lactate elevation is not specific for meningitis',
        'Oxygen deprivation and tissue injury can also raise CSF lactate.',
      ],
    ],
    3,
    'CSF lactate is a contextual laboratory signal, not an organism-specific result.',
    293,
    '10: Cerebrospinal Fluid — lactate',
  ),
  q(
    53,
    'Cerebrospinal fluid',
    'case',
    'A suspected meningitis specimen has a negative Gram stain. Which conclusion is justified?',
    [
      [
        'A negative smear does not exclude infection',
        'Low organism numbers and method sensitivity can produce a negative smear despite infection.',
      ],
      [
        'All additional microbiological studies should be canceled',
        'Further studies may still be indicated by the clinical and laboratory findings.',
      ],
      [
        'The result identifies a viral species',
        'A negative Gram stain does not specify a viral agent.',
      ],
      [
        'The result excludes all fungal infection',
        'A negative smear does not establish absence of fungi either.',
      ],
    ],
    0,
    'Interpret a CSF Gram stain with its detection limits and other test results.',
    294,
    '10: Cerebrospinal Fluid — Gram stain',
  ),
  q(
    54,
    'Cerebrospinal fluid',
    'case',
    'A CSF total nucleated cell count uses an undiluted sample. Sixty cells are counted in a total chamber volume of 0.5 microliter. What is the concentration?',
    [
      [
        '30 cells/microliter',
        'Multiplying by the volume instead of dividing reverses the conversion.',
      ],
      [
        '120 cells/microliter',
        'Concentration is counted cells divided by counted volume: 60 / 0.5 = 120.',
      ],
      ['60 cells/microliter', 'That would apply if the counted volume were 1 microliter.'],
      [
        '600 cells/microliter',
        'That would require a 0.1-microliter volume for the same undiluted count.',
      ],
    ],
    1,
    'Always use the actual counted volume and dilution factor in hemocytometer calculations.',
    283,
    '10: Cerebrospinal Fluid — calculating cell counts',
  ),
  q(
    55,
    'Synovial fluid',
    'recall',
    'Which constituent is primarily responsible for the characteristic viscosity of normal synovial fluid?',
    [
      ['Free hemoglobin', 'Hemoglobin is not the normal lubricant responsible for viscosity.'],
      ['Bacterial nitrite', 'Nitrite does not provide the physiological viscosity.'],
      [
        'Polymerized hyaluronic acid',
        "Hyaluronate molecules contribute the fluid's viscosity and lubrication.",
      ],
      ['Uromodulin casts', 'Uromodulin casts arise in renal tubules, not the joint cavity.'],
    ],
    2,
    'Synovial viscosity reflects the hyaluronate component and its polymerization.',
    321,
    '12: Synovial Fluid — viscosity',
  ),
  q(
    56,
    'Synovial fluid',
    'case',
    'A very viscous synovial sample is difficult to count. Which pretreatment targets the material causing its viscosity?',
    [
      [
        'Add an unlimited amount of acetic acid',
        'Acetic acid can form a mucin clot and cause cell clumping.',
      ],
      ['Discard all visible cells', 'Discarding cells invalidates the count.'],
      [
        'Use an unmeasured water dilution',
        'Uncontrolled dilution and cell lysis would compromise enumeration.',
      ],
      [
        'Use a validated hyaluronidase pretreatment',
        'Hyaluronidase reduces hyaluronate-associated viscosity and can facilitate counting.',
      ],
    ],
    3,
    'Use validated fluid-specific preparation rather than assuming blood-count diluents are suitable.',
    321,
    '12: Synovial Fluid — cell counts',
  ),
  q(
    57,
    'Synovial fluid',
    'case',
    'A trainee uses an acetic-acid WBC diluent on synovial fluid and a clot forms. What best explains the problem?',
    [
      [
        'Acid causes mucin clot formation',
        'Synovial hyaluronate can form a clot in acidic conditions.',
      ],
      [
        'The clot is the intended endpoint of every synovial WBC count',
        'Clotting is undesirable during enumeration and may trap cells.',
      ],
      [
        'The result demonstrates urate-specific birefringence',
        'A mucin clot does not establish crystal composition or polarization.',
      ],
      [
        'The clot makes a numerical dilution correction unnecessary',
        'Clumping compromises distribution and cannot be solved by ignoring dilution.',
      ],
    ],
    0,
    'A diluent suitable for another fluid may be unsuitable for synovial fluid.',
    321,
    '12: Synovial Fluid — dilution limitations',
  ),
  q(
    58,
    'Synovial fluid',
    'case',
    'A joint aspirate is being evaluated for crystals. Why should powdered anticoagulants and dirty slides be avoided?',
    [
      [
        'They eliminate every pathological crystal',
        'The main concern here is introduction of mimics, not guaranteed crystal removal.',
      ],
      [
        'They may introduce particles mistaken for clinically significant crystals',
        'Precipitates, powder, dust, and scratches can complicate crystal identification.',
      ],
      ['They make all crystals monosodium urate', 'Artifacts do not establish an MSU identity.'],
      [
        'They replace the need for polarized microscopy',
        'Clean preparation remains necessary alongside appropriate optical confirmation.',
      ],
    ],
    1,
    'Crystal analysis depends on specimen handling and artifact recognition as well as microscopy.',
    322,
    '12: Synovial Fluid — crystal artifacts',
  ),
  q(
    59,
    'Synovial fluid',
    'case',
    "Rhomboid crystals in joint fluid are blue when their long axis is parallel to the compensator's slow axis. Which identity is most consistent?",
    [
      [
        'Monosodium urate',
        'MSU shows negative birefringence and is yellow in the parallel orientation.',
      ],
      ['Uromodulin', 'Uromodulin is a urinary cast protein rather than this synovial crystal.'],
      [
        'Calcium pyrophosphate dihydrate',
        'CPPD is typically rhomboid and positively birefringent in compensated polarized light.',
      ],
      ['An intact erythrocyte', 'An RBC is not a rhomboid positively birefringent crystal.'],
    ],
    2,
    'Crystal shape, orientation, and compensated birefringence should agree before identification.',
    324,
    '12: Synovial Fluid — crystal polarization',
  ),
  q(
    60,
    'Synovial fluid',
    'recall',
    'What should a compensated-polarized crystal interpretation specify or control?',
    [
      ['Only whether the fluid looks cloudy', 'Cloudiness alone cannot identify a crystal.'],
      [
        'The urinary glucose concentration',
        'Urine glucose is not required to define synovial birefringence.',
      ],
      [
        "The length of the patient's fast alone",
        'Fasting duration does not define the compensator relationship.',
      ],
      [
        "The crystal's orientation relative to the slow axis",
        'The observed color reverses when the crystal orientation changes.',
      ],
    ],
    3,
    'Colors without a known compensator orientation are insufficient for positive versus negative birefringence.',
    324,
    '12: Synovial Fluid — compensated polarization',
  ),
  q(
    61,
    'Synovial fluid',
    'case',
    'Joint fluid contains a high neutrophil count. Why should the count alone not be used to distinguish septic arthritis from crystal inflammation?',
    [
      [
        'Inflammatory and septic count ranges can overlap',
        'The text emphasizes overlap, making microscopy, microbiology, and context important.',
      ],
      [
        'Neutrophils are never present in infection',
        'Neutrophils are commonly increased in infection.',
      ],
      [
        'Any high count identifies a specific bacterium',
        'Cell counts do not identify a bacterial species.',
      ],
      [
        'Crystal-related inflammation always has zero cells',
        'Crystal inflammation can produce marked leukocytosis.',
      ],
    ],
    0,
    'Use the complete synovial analysis rather than a single inflammatory count to assign an etiology.',
    321,
    '12: Synovial Fluid — count interpretation',
  ),
  q(
    62,
    'Synovial fluid',
    'case',
    'A stained joint-fluid smear shows crystals inside neutrophils. What additional preparation remains important for crystal identification?',
    [
      [
        'A urine protein precipitation test',
        'Urine protein testing does not identify a synovial crystal.',
      ],
      [
        'An unstained wet preparation with polarized microscopy',
        'A stained smear should not replace wet-preparation crystal examination and polarization.',
      ],
      [
        'Only gross color inspection',
        'Gross color is nonspecific and cannot establish crystal type.',
      ],
      ['A red-cell count without microscopy', 'A cell count cannot identify crystal composition.'],
    ],
    1,
    'Crystal identification should use the appropriate fresh wet preparation and optical methods.',
    323,
    '12: Synovial Fluid — slide preparation',
  ),
  q(
    63,
    'Serous fluids',
    'recall',
    'Which mechanism favors a systemic transudative effusion rather than a locally inflammatory exudate?',
    [
      [
        'Marked local capillary permeability from inflammation',
        'Local permeability changes favor an exudative mechanism.',
      ],
      [
        'A malignant process affecting the cavity lining',
        'Local malignancy can produce an exudative effusion.',
      ],
      [
        'Increased hydrostatic pressure with otherwise intact membranes',
        'Systemic pressure imbalance can promote transudation without primary local inflammation.',
      ],
      ['Direct bacterial membrane injury', 'Local infection and membrane injury favor exudation.'],
    ],
    2,
    'Mechanisms of fluid formation provide context for the biochemical classification of an effusion.',
    332,
    '13: Serous Fluid — effusion mechanisms',
  ),
  q(
    64,
    'Serous fluids',
    'case',
    'A bloody pleural fluid has hematocrit 18%, while peripheral blood hematocrit is 32%. What is the fluid-to-blood hematocrit ratio?',
    [
      ['About 18%', 'The fluid hematocrit alone is not the requested ratio.'],
      ['About 32%', 'The blood hematocrit alone is not the requested ratio.'],
      ['About 178%', 'This reverses the numerator and denominator.'],
      ['About 56%', '18 / 32 × 100 = 56.25%, exceeding one half of the blood hematocrit.'],
    ],
    3,
    'Comparing fluid and blood hematocrits is more informative than simply calling an effusion bloody.',
    333,
    '13: Serous Fluid — pleural appearance',
  ),
  q(
    65,
    'Serous fluids',
    'case',
    'A milky pleural effusion has abundant triglyceride-rich material after thoracic duct injury. Which description fits best?',
    [
      ['Chylous effusion', 'Thoracic lymph leakage introduces triglyceride-rich chylous material.'],
      [
        'A cholesterol-rich pseudochylous effusion solely because it is milky',
        'Milky appearance alone does not establish pseudochyle.',
      ],
      ['Pure hemothorax', 'Blood-rich fluid is a different mechanism and appearance.'],
      ['A normal clear pleural specimen', 'The described material is not normal clear fluid.'],
    ],
    0,
    'Differentiate causes of milky fluid using lipid composition and context.',
    334,
    '13: Serous Fluid — chylous effusions',
  ),
  q(
    66,
    'Serous fluids',
    'case',
    'A longstanding inflammatory pleural effusion contains cholesterol crystals and relatively little triglyceride-rich material. Which description is most consistent?',
    [
      [
        'New thoracic duct leakage established by appearance alone',
        'The cholesterol-rich pattern favors a different mechanism than fresh chyle leakage.',
      ],
      [
        'Pseudochylous effusion',
        'Chronic inflammation may produce cholesterol-rich pseudochylous material.',
      ],
      [
        'An RBC cast suspension',
        'Renal casts are not the characteristic finding in pleural fluid.',
      ],
      ['A synovial mucin clot', 'This is a pleural lipid finding, not a joint-fluid clot.'],
    ],
    1,
    'Milky effusions are not all chylous; composition helps distinguish pseudochyle.',
    334,
    '13: Serous Fluid — pseudochylous effusions',
  ),
  q(
    67,
    'Serous fluids',
    'case',
    'A serous-fluid differential shows large multinucleated cells with prominent nucleoli. What is the safest laboratory interpretation before declaring malignancy?',
    [
      [
        'Multinucleation alone proves metastatic carcinoma',
        'Reactive mesothelial cells can also be multinucleated with prominent nucleoli.',
      ],
      [
        'All cells in effusions are leukocytes',
        'Serous fluids also contain mesothelial and other tissue cells.',
      ],
      [
        'Consider reactive mesothelial cells and refer suspicious morphology appropriately',
        'Reactive cells can resemble malignancy, so expert cytological correlation may be needed.',
      ],
      [
        'Discard the slide because tissue cells are never relevant',
        'Tissue-cell morphology is an important part of effusion examination.',
      ],
    ],
    2,
    'Reactive mesothelial atypia can mimic malignancy; avoid diagnosis from a single morphological feature.',
    334,
    '13: Serous Fluid — mesothelial cells',
  ),
  q(
    68,
    'Serous fluids',
    'case',
    'Concurrent serum albumin is 3.6 g/dL and ascitic-fluid albumin is 1.0 g/dL. What is the serum-ascites albumin gradient?',
    [
      ['0.28 g/dL', 'This is approximately a fluid-to-serum ratio, not a gradient.'],
      ['4.6 g/dL', 'Adding the concentrations does not calculate the gradient.'],
      ['3.6 g/dL', 'The serum concentration alone does not account for fluid albumin.'],
      ['2.6 g/dL', 'The gradient is serum minus ascitic albumin: 3.6 - 1.0 = 2.6 g/dL.'],
    ],
    3,
    'The serum-ascites albumin gradient is a subtraction using concurrent concentrations in matching units.',
    339,
    '13: Serous Fluid — serum-ascites albumin gradient',
  ),
  q(
    69,
    'Serous fluids',
    'case',
    'Pleural protein is 3.6 g/dL and concurrent serum protein is 6.0 g/dL. Which calculation correctly gives the pleural-fluid-to-serum protein ratio?',
    [
      ['3.6 / 6.0 = 0.60', 'Divide the fluid value by the serum value using the same units.'],
      ['6.0 / 3.6 = 1.67', 'That reverses the requested ratio.'],
      ['6.0 - 3.6 = 2.4', 'A difference is not a fluid-to-serum ratio.'],
      ['3.6 + 6.0 = 9.6', 'A sum is not a fluid-to-serum ratio.'],
    ],
    0,
    'Be explicit about numerator, denominator, and units when interpreting fluid-to-serum comparisons.',
    333,
    '13: Serous Fluid — fluid-serum protein comparison',
  ),
  q(
    70,
    'Serous fluids',
    'case',
    'A serous-fluid smear contains cells suspicious for malignancy. What is the appropriate next laboratory action?',
    [
      [
        'Automatically classify every effusion as benign',
        'Suspicious cells warrant further evaluation rather than dismissal.',
      ],
      [
        'Refer the suspicious findings for cytology or pathologist review',
        'The text directs suspicious tissue-cell findings to appropriate expert examination.',
      ],
      [
        'Identify the cancer type from gross fluid color alone',
        'Fluid color cannot establish tumor lineage.',
      ],
      [
        'Replace the result with the urine sediment count',
        "A different specimen's count does not resolve suspicious effusion morphology.",
      ],
    ],
    1,
    'Recognize suspicious morphology and route it through the appropriate cytological review workflow.',
    333,
    '13: Serous Fluid — differential examination',
  ),
  q(
    71,
    'Other body fluids',
    'recall',
    'Which structure contributes fructose-rich fluid that supports sperm energy metabolism?',
    [
      [
        'Prostate gland',
        'The prostate principally contributes acidic fluid with enzymes and other constituents, not the fructose-rich vesicular fraction.',
      ],
      [
        'Epididymis',
        'The epididymis primarily supports sperm maturation and storage, not fructose-rich accessory-gland secretion.',
      ],
      [
        'Seminal vesicles',
        'Seminal vesicle secretions provide fructose-rich transport and support fluid.',
      ],
      [
        'Seminiferous tubules',
        'These tubules support sperm production rather than the fructose-rich accessory-gland fraction.',
      ],
    ],
    2,
    'Knowing the sources of semen fractions helps interpret biochemical and collection findings.',
    303,
    '11: Semen — physiology',
  ),
  q(
    72,
    'Other body fluids',
    'case',
    'A patient reports losing the first fraction during semen collection. Why must this be documented before interpreting sperm concentration?',
    [
      [
        'Every semen fraction contains exactly the same number of sperm',
        'The fractions differ in composition and sperm contribution.',
      ],
      [
        'The missing fraction makes a blood count unnecessary',
        'A blood count does not address incomplete semen collection.',
      ],
      [
        'Incomplete collection guarantees a normal fertility assessment',
        'Incomplete collection can distort results and cannot establish normal fertility.',
      ],
      [
        'The first fraction contains a substantial share of sperm',
        'Losing the sperm-rich early fraction may falsely lower the measured concentration or total count.',
      ],
    ],
    3,
    'Collection completeness is an essential preanalytical variable in semen analysis.',
    303,
    '11: Semen — specimen collection',
  ),
  q(
    73,
    'Other body fluids',
    'case',
    'A semen sample has concentration 24 million sperm/mL and a measured volume of 2.5 mL. What is the total sperm count in the ejaculate?',
    [
      ['60 million', 'Total count is concentration multiplied by volume: 24 × 2.5 = 60 million.'],
      ['9.6 million', 'Dividing by volume does not give total sperm in the ejaculate.'],
      ['24 million', 'The concentration is not the total count when volume differs from 1 mL.'],
      ['26.5 million', 'Adding concentration and volume mixes incompatible quantities.'],
    ],
    0,
    'Sperm concentration and total sperm count are distinct measurements.',
    306,
    '11: Semen — concentration and total count',
  ),
  q(
    74,
    'Other body fluids',
    'case',
    'Many sperm are immotile, but an eosin-nigrosin vitality preparation shows most exclude the dye. What does this demonstrate?',
    [
      [
        'Dye exclusion proves rapid progressive movement',
        'Vitality and movement are different properties.',
      ],
      [
        'Many sperm are viable despite absent movement',
        'Living cells exclude the dye; an immotile cell is not necessarily dead.',
      ],
      [
        'All unstained structures must be bacteria',
        'Dye exclusion in identified sperm is a vitality observation.',
      ],
      [
        'The result directly identifies an antibody specificity',
        'Vitality staining is not an antisperm-antibody identification assay.',
      ],
    ],
    1,
    'Distinguish sperm vitality from motility rather than assuming all immotile sperm are nonviable.',
    311,
    '11: Semen — sperm vitality',
  ),
  q(
    75,
    'Other body fluids',
    'case',
    'An enzyme treatment is used to liquefy a semen specimen before counting. Why must the treatment and any dilution be recorded?',
    [
      [
        'Treatments never influence any semen measurement',
        'Treatments can affect measured characteristics and sample concentration.',
      ],
      [
        'The dilution factor should always be ignored',
        'Ignoring dilution produces an incorrect concentration.',
      ],
      [
        'They can affect motility, morphology, biochemistry, and concentration calculations',
        'The text notes treatment effects and the need to account for dilution.',
      ],
      [
        'Recording treatment replaces all quality control',
        'Documentation does not remove the need for analytical controls.',
      ],
    ],
    2,
    'Preparation steps that change a specimen must be reflected in calculation and interpretation.',
    305,
    '11: Semen — liquefaction',
  ),
  q(
    76,
    'Other body fluids',
    'case',
    'A BAL sample is examined for its predominant nucleated-cell population. Which cell type is normally prominent in the recovered alveolar material?',
    [
      [
        'Neutrophils',
        'A prominent neutrophilic pattern suggests inflammation rather than the usual macrophage-predominant background.',
      ],
      [
        'Eosinophils',
        'Eosinophils normally form a small portion of BAL cells rather than the predominant population.',
      ],
      [
        'Lymphocytes',
        'Lymphocytes are present normally but are not usually the most frequent BAL cell type.',
      ],
      ['Macrophages', 'Macrophages are normally the most frequent cells described in BAL fluid.'],
    ],
    3,
    'Interpret BAL cellular patterns relative to the sampled respiratory compartment.',
    348,
    '14: Bronchoalveolar Lavage Fluid — macrophages',
  ),
  q(
    77,
    'Other body fluids',
    'case',
    'Sequential BAL aliquots become progressively more bloody. Which process should be considered?',
    [
      [
        'Diffuse alveolar hemorrhage',
        'Increasing blood across successive aliquots is a clue to alveolar hemorrhage.',
      ],
      [
        'Simple procedure-related contamination established with certainty',
        'The increasing sequential pattern raises concern for alveolar hemorrhage rather than proving contamination.',
      ],
      [
        'A nonbloody macrophage-predominant lavage',
        'Progressive bloodiness cannot be described as a nonbloody collection.',
      ],
      [
        'An exclusively old resolved hemorrhage with no current blood',
        'Increasing fresh blood across aliquots favors an active bleeding process.',
      ],
    ],
    0,
    'Collection sequence can add information to the interpretation of a bloody BAL specimen.',
    347,
    '14: Bronchoalveolar Lavage Fluid — appearance',
  ),
  q(
    78,
    'Other body fluids',
    'case',
    'BAL macrophages contain hemosiderin. What process does this finding support in the appropriate clinical context?',
    [
      [
        'A collection artifact consisting only of fresh extracellular RBCs',
        'Intracellular iron pigment indicates processing of blood rather than fresh cells alone.',
      ],
      [
        'Prior alveolar bleeding with erythrocyte breakdown',
        'Iron pigment accumulates after macrophages process blood from an earlier hemorrhage.',
      ],
      [
        'Recent systemic bilirubin elevation without pulmonary bleeding',
        'Bilirubin elevation alone does not explain iron-laden alveolar macrophages.',
      ],
      [
        'A specific bacterial species without microbiological testing',
        'Hemosiderin does not identify an organism.',
      ],
    ],
    1,
    'Macrophage contents can provide evidence of earlier events in the sampled tissue.',
    349,
    '14: Bronchoalveolar Lavage Fluid — erythrocytes',
  ),
  q(
    79,
    'Other body fluids',
    'case',
    'A BAL specimen contains clumps and clots. Why should its automated count be interpreted cautiously?',
    [
      [
        'Clots improve uniform cell distribution',
        'Clots can trap cells and prevent representative enumeration.',
      ],
      [
        'All automated instruments are validated for every fluid type',
        'Instrument validation and operating limits depend on specimen type.',
      ],
      [
        'Trapped or unevenly distributed cells can compromise enumeration',
        'Clumps and clots undermine the assumption of a uniform suspension.',
      ],
      [
        'Clotting identifies a specific pulmonary infection',
        'Clotting alone does not identify a pathogen.',
      ],
    ],
    2,
    'Report specimen limitations and use validated methods rather than accepting a count from a compromised suspension.',
    348,
    '14: Bronchoalveolar Lavage Fluid — cell counts',
  ),
  q(
    80,
    'Other body fluids',
    'case',
    'Amniotic fluid is submitted for bilirubin measurement. Which handling step specifically protects the analyte?',
    [
      [
        'Expose the fluid to bright light to stabilize the pigment',
        'Light exposure can lower measurable bilirubin.',
      ],
      [
        'Delay separation from cells until all other testing is finished',
        'Prompt handling and separation reduce cellular and particulate interference.',
      ],
      [
        'Use the same handling for every amniotic-fluid assay',
        'Handling varies with the analyte and intended test.',
      ],
      [
        'Protect the specimen from light immediately',
        'Bilirubin is photosensitive, so light protection begins at collection.',
      ],
    ],
    3,
    'Amniotic-fluid handling should be chosen for the requested assay, including light protection for bilirubin.',
    355,
    '15: Amniotic Fluid — handling and processing',
  ),
  q(
    81,
    'Other body fluids',
    'recall',
    'Which material in amniotic fluid provides fetal cells for cytogenetic examination?',
    [
      [
        'Sloughed fetal epithelial cells',
        'Fetal cells in the fluid can be cultured or examined for chromosome abnormalities.',
      ],
      [
        'Only maternal erythrocytes',
        'Mature maternal RBCs do not provide the intended fetal-cell cytogenetic material.',
      ],
      [
        'Cell-free maternal albumin',
        'Albumin is a soluble protein and does not supply fetal chromosomes.',
      ],
      [
        'Dissolved fetal bilirubin',
        'Bilirubin can support chemical testing but does not provide cells for cytogenetics.',
      ],
    ],
    0,
    'Cellular and soluble components of amniotic fluid support different types of laboratory testing.',
    355,
    '15: Amniotic Fluid — fetal cells',
  ),
  q(
    82,
    'Other body fluids',
    'case',
    'An amniotic-fluid AFP result is reported as a multiple of the median. Why must gestational age be considered?',
    [
      [
        'AFP concentration is constant throughout gestation',
        'AFP production and fluid concentration change during gestation.',
      ],
      [
        'The expected median concentration changes with gestational age',
        'Interpretation compares the result with the appropriate gestational-age reference.',
      ],
      [
        'The median is a unitless substitute for the collection date',
        'A multiple of the median requires the relevant reference population and gestational age.',
      ],
      [
        'Any AFP increase proves one specific defect',
        'AFP is not specific enough to establish a diagnosis in isolation.',
      ],
    ],
    1,
    'Gestational-age-dependent biomarkers must be interpreted against the appropriate reference.',
    357,
    '15: Amniotic Fluid — alpha-fetoprotein',
  ),
  q(
    83,
    'Other body fluids',
    'case',
    'A fecal immunochemical test targets human globin. Why is it more oriented toward lower-GI bleeding than blood originating far upstream?',
    [
      [
        'It detects only plant peroxidase',
        'The immunochemical method detects human hemoglobin epitopes, not plant peroxidase.',
      ],
      [
        'It measures bilirubin produced only by the colon',
        'Bilirubin is not the target described.',
      ],
      [
        'Globin from upper-GI blood can be degraded before reaching the stool',
        'Degradation reduces immunochemical reactivity of blood originating upstream.',
      ],
      [
        'The assay selectively amplifies upper-GI globin',
        'The described immunochemical method does not amplify degraded globin from upstream sources.',
      ],
    ],
    2,
    'Assay targets and analyte degradation affect the anatomical sensitivity of fecal blood tests.',
    372,
    '16: Fecal Analysis — immunochemical blood testing',
  ),
  q(
    84,
    'Other body fluids',
    'case',
    'A fresh, visibly bloody neonatal stool is tested by an alkali-denaturation method. The extracted hemoglobin remains pink. Which property explains this result?',
    [
      [
        'Adult hemoglobin is completely resistant to alkali',
        'Adult hemoglobin denatures more readily under the test conditions.',
      ],
      [
        'All red pigments are bilirubin',
        'The test evaluates extracted hemoglobin, not every pigment.',
      ],
      [
        'A pink result proves a specific cause of bleeding',
        'Hemoglobin type does not by itself establish why bleeding occurred.',
      ],
      [
        'Fetal hemoglobin is relatively alkali resistant',
        'The Apt principle differentiates alkali-resistant HbF from more readily denatured adult hemoglobin.',
      ],
    ],
    3,
    'The Apt test distinguishes hemoglobin behavior; interpretation still requires the specimen and clinical context.',
    373,
    '16: Fecal Analysis — Apt test',
  ),
];
