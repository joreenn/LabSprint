import type { Question } from './types';

type Choice = readonly [text: string, rationale: string];

/** Original items grounded in the retained, page-marked Harr extraction. */
function q(
  id: string,
  subjectId: string,
  topic: string,
  kind: Question['kind'],
  stem: string,
  correct: Choice,
  distractors: readonly [Choice, Choice, Choice],
  takeaway: string,
  pdfPage: number,
  chapter: string,
): Question {
  const choices = [correct, ...distractors];
  const offset = Number(id.split('-').at(-1)) % 4;
  const ordered = [...choices.slice(offset), ...choices.slice(0, offset)];
  return {
    id,
    subjectId,
    topic,
    kind,
    difficulty: kind === 'case' ? 'Application' : 'Foundation',
    stem,
    options: ordered.map(([text, rationale], i) => ({
      id: String.fromCharCode(65 + i),
      text,
      rationale,
    })),
    correctOptionId: String.fromCharCode(65 + ordered.indexOf(correct)),
    takeaway,
    source: {
      title: 'Medical Laboratory Science Review',
      edition: '5th edition (Harr, 2019)',
      pdfPage,
      chapter,
    },
    version: 1,
  };
}

const chemistry = 'chemistry';
const immuno = 'immunoserology-blood-banking';

export const harrExpansionQuestions: Question[] = [
  q(
    'cc-h5-001',
    chemistry,
    'Instrumentation',
    'case',
    'A colorimeter reports 25% transmittance. Using A = 2 - log10(%T), which absorbance is closest?',
    ['0.60', '2 - log10(25) is approximately 0.602.'],
    [
      ['0.25', 'Transmittance as a decimal is not the absorbance.'],
      ['1.40', 'This is log10(25), before subtraction from 2.'],
      ['2.00', 'An absorbance of 2 corresponds to 1% transmittance.'],
    ],
    'Absorbance is logarithmically related to transmittance; it is not the transmitted fraction.',
    283,
    '6.1 Instrumentation',
  ),
  q(
    'cc-h5-002',
    chemistry,
    'Instrumentation',
    'case',
    'A highly concentrated standard gives less absorbance than predicted by the otherwise linear calibration curve. Fresh reagents do not fix the problem. Which optical fault best explains a downward deviation at high absorbance?',
    [
      'Stray light reaching the detector',
      'Extra light contributes disproportionately when the intended transmitted beam is very weak.',
    ],
    [
      [
        'Complete absence of a light source',
        'No source would not produce an otherwise usable calibration curve.',
      ],
      [
        'Exactly doubled optical path length',
        'Within linearity, doubling path length increases rather than depresses absorbance.',
      ],
      [
        'A perfectly functioning reference beam',
        'A reference beam compensates lamp fluctuations and is not itself this fault.',
      ],
    ],
    'Stray light can flatten a calibration curve at high absorbance.',
    286,
    '6.1 Instrumentation',
  ),
  q(
    'cc-h5-003',
    chemistry,
    'Instrumentation',
    'case',
    'A laboratory wants to check a spectrophotometer wavelength setting rather than its absorbance scale. Which material is best matched to that purpose?',
    [
      'A certified holmium oxide filter with narrow spectral peaks',
      'Narrow reference peaks allow comparison of measured and assigned wavelengths.',
    ],
    [
      [
        'An uncharacterized turbid sample',
        'Its scattering does not provide assigned narrow wavelength peaks.',
      ],
      [
        'A neutral density filter alone',
        'Neutral density filters are primarily used for absorbance checks.',
      ],
      ['A blank containing only water', 'Water blanking does not establish wavelength accuracy.'],
    ],
    'Match calibration material to the quantity being verified: wavelength and absorbance are different checks.',
    286,
    '6.1 Instrumentation',
  ),
  q(
    'cc-h5-004',
    chemistry,
    'Instrumentation',
    'recall',
    'In a dual-beam absorbance system, what is the main benefit of comparing sample and reference light paths?',
    [
      'Reducing the effect of source-intensity fluctuations',
      'The reference signal provides a comparison when lamp output changes.',
    ],
    [
      ['Eliminating the need for any calibration', 'Reference optics do not replace calibration.'],
      [
        'Making every sample obey Beer-Lambert behavior',
        'Chemical and optical nonlinearity can still occur.',
      ],
      [
        'Removing all specimen pigments chemically',
        'The reference beam does not chemically remove sample components.',
      ],
    ],
    'A reference path compensates lamp-output changes, not every analytical interference.',
    286,
    '6.1 Instrumentation',
  ),
  q(
    'cc-h5-005',
    chemistry,
    'Instrumentation',
    'case',
    'A sample is colored before an assay reagent generates its chromogen. Which measurement most directly estimates the pre-existing specimen absorbance?',
    [
      'A specimen blank prepared according to the assay procedure',
      'A specimen blank estimates intrinsic sample absorbance before the target reaction.',
    ],
    [
      [
        'A reagent blank without specimen',
        'That measures reagent absorbance, not the patient specimen contribution.',
      ],
      [
        'A second calibration point only',
        'Calibration alone does not isolate this sample-specific pigment.',
      ],
      ['A larger specimen volume', 'More specimen can increase the interfering contribution.'],
    ],
    'Specimen blanking and reagent blanking correct different background contributions.',
    288,
    '6.1 Instrumentation',
  ),
  q(
    'cc-h5-006',
    chemistry,
    'Instrumentation',
    'case',
    'A fluorometric method isolates the light used to excite a molecule and then isolates the light released by that molecule. Why are two wavelength-selection steps useful?',
    [
      'Excitation and emission are separate spectral characteristics',
      'The primary selector isolates excitation, while the secondary selector isolates emitted light.',
    ],
    [
      [
        'The second selector measures specimen mass',
        'It selects emitted wavelengths rather than weighing the sample.',
      ],
      [
        'Fluorescence has no characteristic emission',
        'Characteristic emission is precisely what the second selector measures.',
      ],
      [
        'Both selectors eliminate the need for a detector',
        'A detector is still needed to measure the emitted light.',
      ],
    ],
    'Fluorometry gains selectivity by using both excitation and emission wavelengths.',
    289,
    '6.1 Instrumentation',
  ),
  q(
    'cc-h5-007',
    chemistry,
    'Instrumentation',
    'recall',
    'Which feature distinguishes a chemiluminescent signal from ordinary fluorescence?',
    [
      'Chemical reaction energy produces the light signal',
      'Chemiluminescence generates light from a reaction without external optical excitation.',
    ],
    [
      [
        'Every assay requires a tungsten excitation lamp',
        'External excitation is not required for chemiluminescence.',
      ],
      ['The signal is an electrical potential only', 'The measured output is emitted light.'],
      ['No photodetector can be used', 'A photodetector is used to measure the light produced.'],
    ],
    'Chemiluminescence produces light chemically; fluorescence needs excitation light.',
    289,
    '6.1 Instrumentation',
  ),
  q(
    'cc-h5-008',
    chemistry,
    'Instrumentation',
    'recall',
    'A potassium-selective membrane uses valinomycin. What property makes this material useful?',
    [
      'Selective reversible binding of potassium ions',
      'Valinomycin provides potassium selectivity in the membrane.',
    ],
    [
      [
        'Conversion of potassium into a colored protein',
        'The electrode response is not a protein color reaction.',
      ],
      [
        'Release of light after oxidation',
        'That describes a luminescent process, not valinomycin selectivity.',
      ],
      [
        'Complete precipitation of sodium and calcium',
        'Selective ion binding does not require removing every other ion by precipitation.',
      ],
    ],
    'Ion-selective electrode membranes depend on selective interactions with the target ion.',
    294,
    '6.1 Instrumentation',
  ),
  q(
    'cc-h5-009',
    chemistry,
    'Acid-base and electrolytes',
    'case',
    'Using pH = 6.1 + log10[HCO3/(0.03 x PCO2)], what is the approximate pH when bicarbonate is 12 mmol/L and PCO2 is 40 mm Hg?',
    ['7.10', '12/(0.03 x 40) = 10, so pH = 6.1 + 1.0.'],
    [
      ['6.10', 'This omits the logarithm of the buffer ratio.'],
      ['7.40', 'That requires a bicarbonate-to-dissolved-CO2 ratio near 20 rather than 10.'],
      ['8.10', 'That would require a ratio of 100 rather than 10.'],
    ],
    'Calculate dissolved CO2 before taking the logarithm of the bicarbonate-to-CO2 ratio.',
    309,
    '6.2 Blood Gases, pH, and Electrolytes',
  ),
  q(
    'cc-h5-010',
    chemistry,
    'Acid-base and electrolytes',
    'case',
    'A blood-gas specimen is inadvertently exposed to room air. Which direction of change is expected from CO2 loss alone?',
    [
      'PCO2 decreases and pH increases',
      'Loss of dissolved CO2 reduces carbonic acid and shifts the sample toward alkalinity.',
    ],
    [
      ['PCO2 increases and pH decreases', 'This is opposite to loss of CO2 into air.'],
      ['Both PCO2 and pH decrease', 'CO2 loss tends to raise, not lower, pH.'],
      ['Neither can change after collection', 'Gas exchange can continue after sampling.'],
    ],
    'Avoid air exposure because blood gases and pH can change outside the patient.',
    311,
    '6.2 Blood Gases, pH, and Electrolytes',
  ),
  q(
    'cc-h5-011',
    chemistry,
    'Acid-base and electrolytes',
    'recall',
    'In the bicarbonate buffer equation, which change alone would lower pH?',
    [
      'A decrease in the bicarbonate-to-dissolved-CO2 ratio',
      'A smaller salt-to-acid ratio lowers the logarithmic term.',
    ],
    [
      ['An increase in that ratio', 'A larger ratio raises the calculated pH.'],
      [
        'Doubling bicarbonate while keeping dissolved CO2 fixed',
        'This increases the ratio and raises pH.',
      ],
      ['Halving dissolved CO2 while keeping bicarbonate fixed', 'This also increases the ratio.'],
    ],
    'pH follows the ratio of buffer base to dissolved CO2, not either value in isolation.',
    309,
    '6.2 Blood Gases, pH, and Electrolytes',
  ),
  q(
    'cc-h5-012',
    chemistry,
    'Acid-base and electrolytes',
    'case',
    'A blood-gas electrode is accurate at one calibrator value but has increasing proportional error away from it. Which calibration approach directly addresses the slope?',
    [
      'Two-point calibration with appropriate standards',
      'Two assigned points allow adjustment of electrode slope as well as position.',
    ],
    [
      [
        'Repeating only the same single-point calibration',
        'One point cannot establish the slope over a range.',
      ],
      [
        'Omitting calibrators and using one patient specimen',
        'An unknown specimen supplies no assigned target.',
      ],
      [
        'Changing the patient reference interval',
        'A reference interval does not correct measurement error.',
      ],
    ],
    'A single calibration point cannot establish the response slope.',
    319,
    '6.2 Blood Gases, pH, and Electrolytes',
  ),
  q(
    'cc-h5-013',
    chemistry,
    'Acid-base and electrolytes',
    'recall',
    'A primary fall in plasma bicarbonate produces metabolic acidosis. Which respiratory response tends to compensate?',
    [
      'Increased ventilation that lowers PCO2',
      'Removing CO2 raises the bicarbonate-to-CO2 ratio toward its prior value.',
    ],
    [
      [
        'Decreased ventilation that retains CO2',
        'CO2 retention would worsen the acidifying ratio change.',
      ],
      ['Stopping all ventilation', 'This rapidly causes CO2 retention rather than compensation.'],
      [
        'Increasing inspired nitrogen without changing ventilation',
        'This does not directly remove the retained acid component.',
      ],
    ],
    'Respiratory compensation for metabolic acidosis removes CO2 through increased ventilation.',
    315,
    '6.2 Blood Gases, pH, and Electrolytes',
  ),
  q(
    'cc-h5-014',
    chemistry,
    'Carbohydrates',
    'case',
    'During a mechanistic study, insulin increases after a meal. Which change is consistent with its metabolic action?',
    [
      'Increased cellular glucose uptake and glycogen formation',
      'Insulin promotes glucose use and storage.',
    ],
    [
      [
        'Increased hepatic glucose production as its main effect',
        'Insulin inhibits glucose production pathways.',
      ],
      [
        'Increased breakdown of stored fat as its defining effect',
        'Insulin promotes lipid storage rather than lipolysis.',
      ],
      [
        'Blocking all cellular entry of glucose',
        'This contradicts insulin-facilitated glucose uptake.',
      ],
    ],
    'Insulin favors glucose uptake and storage rather than mobilization of fuel reserves.',
    331,
    '6.3 Glucose, Hemoglobin, Iron, and Bilirubin',
  ),
  q(
    'cc-h5-015',
    chemistry,
    'Carbohydrates',
    'case',
    'A teaching case shows hypoglycemia with abundant circulating insulin but suppressed C-peptide. Which source best accounts for this combination?',
    [
      'Administered insulin rather than endogenous insulin release',
      'Endogenous proinsulin processing releases C-peptide with insulin; administered insulin lacks that paired release.',
    ],
    [
      ['Increased endogenous proinsulin processing', 'That would also increase C-peptide.'],
      [
        'An insulin-secreting tumor as the only explanation',
        'Endogenous secretion generally includes C-peptide.',
      ],
      [
        'Normal insulin secretion proven by low C-peptide',
        'The discordance argues against assuming normal endogenous secretion.',
      ],
    ],
    'C-peptide helps distinguish endogenous secretion from an exogenous insulin source.',
    334,
    '6.3 Glucose, Hemoglobin, Iron, and Bilirubin',
  ),
  q(
    'cc-h5-016',
    chemistry,
    'Carbohydrates',
    'recall',
    'What chemical process forms HbA1c?',
    [
      'Nonenzymatic attachment of glucose to hemoglobin',
      'Glycation proceeds without a dedicated glycating enzyme.',
    ],
    [
      [
        'Enzymatic addition of phosphate to heme iron',
        'HbA1c is not a phosphorylated heme measurement.',
      ],
      [
        'Immediate reversible coating by free plasma glucose only',
        'Stable glycation is different from a transient coating.',
      ],
      [
        'Proteolysis of the entire beta chain',
        'HbA1c formation does not require destruction of the beta chain.',
      ],
    ],
    'HbA1c is a glycated hemoglobin fraction, not an instantaneous free-glucose assay.',
    335,
    '6.3 Glucose, Hemoglobin, Iron, and Bilirubin',
  ),
  q(
    'cc-h5-017',
    chemistry,
    'Carbohydrates',
    'case',
    'A clinician needs a glycated-protein measure reflecting a shorter interval than HbA1c. Which analyte best fits?',
    [
      'Fructosamine',
      'Glycated serum proteins reflect a shorter period, approximately a few weeks.',
    ],
    [
      ['Serum sodium', 'Sodium does not measure protein glycation.'],
      ['A single urine glucose result', 'Urine glucose is not a glycated-protein measurement.'],
      [
        'Serum creatine kinase',
        'CK activity reflects enzyme release, not integrated protein glycation.',
      ],
    ],
    'Fructosamine reflects shorter-term glycation than HbA1c.',
    335,
    '6.3 Glucose, Hemoglobin, Iron, and Bilirubin',
  ),
  q(
    'cc-h5-018',
    chemistry,
    'Carbohydrates',
    'recall',
    'Which pair of hormones can promote increased glucose availability rather than the storage action of insulin?',
    ['Cortisol and growth hormone', 'Both can promote gluconeogenesis and oppose insulin effects.'],
    [
      ['Insulin and insulin', 'Insulin lowers glucose through uptake and storage.'],
      [
        'Calcitonin and renin as their defining role',
        'Their primary actions concern calcium and the renin-angiotensin system.',
      ],
      [
        'Albumin and fibrinogen',
        'These are proteins rather than the counterregulatory hormones described.',
      ],
    ],
    'Counterregulatory hormones can raise glucose by promoting fuel mobilization or production.',
    331,
    '6.3 Glucose, Hemoglobin, Iron, and Bilirubin',
  ),
  q(
    'cc-h5-019',
    chemistry,
    'Renal chemistry',
    'case',
    'For an uncorrected creatinine clearance, urine creatinine is 90 mg/dL, plasma creatinine is 1.5 mg/dL, and urine flow is 1.2 mL/min. What clearance is calculated?',
    ['72 mL/min', 'Clearance = (90/1.5) x 1.2 = 72 mL/min.'],
    [
      ['50 mL/min', 'Dividing the concentration ratio by flow reverses the required operation.'],
      ['108 mL/min', 'This omits the plasma creatinine divisor.'],
      ['1.62 mL/min', 'Multiplying the plasma value by other terms is not the clearance formula.'],
    ],
    'For the uncorrected calculation, clearance equals urine-to-plasma concentration ratio times urine flow.',
    356,
    '6.4 Creatinine, Uric Acid, BUN, and Ammonia',
  ),
  q(
    'cc-h5-020',
    chemistry,
    'Renal chemistry',
    'case',
    'A patient saves urine already present in the bladder at the start of a timed clearance collection. Why can this overestimate clearance?',
    [
      'Material formed before the timed interval is added to the measured excretion',
      'The denominator time does not include the period during which that initial urine formed.',
    ],
    [
      [
        'All creatinine is destroyed by starting the clock',
        'Timing does not chemically destroy creatinine.',
      ],
      [
        'The plasma creatinine must become zero',
        'The collection error does not force plasma creatinine to zero.',
      ],
      [
        'Every urine volume error lowers clearance',
        'Adding extra excretion can bias the calculation upward.',
      ],
    ],
    'Timed collections must match the measured excretion to the actual collection interval.',
    357,
    '6.4 Creatinine, Uric Acid, BUN, and Ammonia',
  ),
  q(
    'cc-h5-021',
    chemistry,
    'Renal chemistry',
    'case',
    'A timed Jaffe assay reduces an interference that reacts very rapidly and another that reacts slowly. What is the main analytical strategy?',
    [
      'Measure a defined absorbance change during an intermediate time window',
      'Kinetic timing helps separate creatinine-related color formation from differently timed reactions.',
    ],
    [
      [
        'Assume alkaline picrate is completely specific',
        'Jaffe chemistry has known noncreatinine reactions.',
      ],
      [
        'Use the endpoint after unlimited incubation',
        'A late endpoint can include more interfering color.',
      ],
      [
        'Replace the specimen with a water blank',
        'A water blank cannot measure the specimen creatinine.',
      ],
    ],
    'Kinetic Jaffe methods reduce some interferences through reaction timing; they do not make the reaction perfectly specific.',
    358,
    '6.4 Creatinine, Uric Acid, BUN, and Ammonia',
  ),
  q(
    'cc-h5-022',
    chemistry,
    'Renal chemistry',
    'recall',
    'In a peroxidase-coupled enzymatic creatinine method, what product of sarcosine oxidase permits color development?',
    [
      'Hydrogen peroxide',
      'Peroxidase uses the generated peroxide to oxidize a chromogenic substrate.',
    ],
    [
      ['Hemoglobin A1c', 'Glycated hemoglobin is not generated by this enzyme sequence.'],
      ['An intact immunoglobulin', 'This is an enzymatic reaction, not antibody synthesis.'],
      ['Bilirubin diglucuronide', 'That conjugated pigment is not the coupling product.'],
    ],
    'Enzymatic creatinine methods can link peroxide production to a measurable color reaction.',
    357,
    '6.4 Creatinine, Uric Acid, BUN, and Ammonia',
  ),
  q(
    'cc-h5-023',
    chemistry,
    'Renal chemistry',
    'case',
    'Two random urine samples differ greatly in water concentration. Why report albumin relative to urine creatinine rather than albumin concentration alone?',
    [
      'The ratio helps account for urine dilution differences',
      'Creatinine indexing reduces variation caused by differing fluid concentration.',
    ],
    [
      [
        'It proves that every albumin molecule originated in the kidney',
        'A ratio does not establish the origin of every protein molecule.',
      ],
      [
        'It removes the need to measure albumin',
        'Both albumin and creatinine must be measured for the ratio.',
      ],
      [
        'It makes all specimens have identical creatinine values',
        'The measured concentrations remain different.',
      ],
    ],
    'Urine albumin-to-creatinine ratios reduce the effect of variable urine concentration.',
    360,
    '6.4 Creatinine, Uric Acid, BUN, and Ammonia',
  ),
  q(
    'cc-h5-024',
    chemistry,
    'Renal chemistry',
    'recall',
    'Which distinction between urea and uric acid production is correct?',
    [
      'Urea is linked to amino-acid nitrogen metabolism; uric acid to purine catabolism',
      'The two nitrogenous compounds arise from different metabolic pathways.',
    ],
    [
      [
        'Both are formed only from glycogen breakdown',
        'Glycogen is a carbohydrate and is not their primary nitrogen source.',
      ],
      [
        'Uric acid is the product measured by every urease assay',
        'Urease acts on urea, not uric acid.',
      ],
      [
        'Urea is an immunoglobulin fragment',
        'Urea is a small nitrogenous molecule, not an antibody fragment.',
      ],
    ],
    'Do not interchange urea and uric acid: their origins and analytical methods differ.',
    360,
    '6.4 Creatinine, Uric Acid, BUN, and Ammonia',
  ),
  q(
    'cc-h5-025',
    chemistry,
    'Renal chemistry',
    'case',
    'BUN is 18 mg/dL. Using the mass conversion urea = BUN x 2.14, which urea concentration is closest?',
    ['38.5 mg/dL', '18 x 2.14 = 38.52 mg/dL.'],
    [
      ['8.4 mg/dL', 'Dividing by 2.14 converts in the wrong direction.'],
      ['18 mg/dL', 'BUN represents only the nitrogen portion of urea mass.'],
      ['180 mg/dL', 'A tenfold conversion is not the stated mass relationship.'],
    ],
    'BUN and urea are related but have different mass concentrations.',
    360,
    '6.4 Creatinine, Uric Acid, BUN, and Ammonia',
  ),
  q(
    'cc-h5-026',
    chemistry,
    'Proteins',
    'case',
    'Why is a routine serum biuret method poorly suited to very low total-protein concentrations in CSF?',
    [
      'Its analytical sensitivity is insufficient for those low concentrations',
      'The biuret reaction is useful at serum protein levels but less sensitive at low fluid levels.',
    ],
    [
      ['CSF contains no peptide bonds', 'CSF proteins contain peptide bonds.'],
      ['Biuret only recognizes glucose', 'Biuret reacts with peptide bonds rather than glucose.'],
      [
        'Every CSF specimen is too concentrated',
        'The issue is low protein concentration, not excessive concentration.',
      ],
    ],
    'Choose a protein method with sensitivity appropriate to the specimen concentration.',
    368,
    '6.5 Proteins, Electrophoresis, and Lipids',
  ),
  q(
    'cc-h5-027',
    chemistry,
    'Proteins',
    'case',
    'Serum electrophoresis is requested, but plasma is accidentally applied. Which additional band may be mistaken for a restricted protein?',
    ['Fibrinogen', 'Plasma retains fibrinogen, which can produce a band in the beta region.'],
    [
      [
        'An increased albumin fraction alone',
        'Albumin is present in both serum and plasma and is not the added clotting-protein band.',
      ],
      [
        'A true monoclonal immunoglobulin necessarily produced during collection',
        'Collection into anticoagulant does not create a new immunoglobulin clone.',
      ],
      [
        'An absent gamma region in every plasma specimen',
        'Using plasma does not universally eliminate gamma globulins.',
      ],
    ],
    'Serum avoids the fibrinogen band that can complicate plasma protein electrophoresis.',
    372,
    '6.5 Proteins, Electrophoresis, and Lipids',
  ),
  q(
    'cc-h5-028',
    chemistry,
    'Proteins',
    'recall',
    'At alkaline pH in routine serum protein electrophoresis, which major fraction migrates fastest toward the anode?',
    [
      'Albumin',
      'Albumin has a strong net negative charge at pH 8.6 and leads the major fractions.',
    ],
    [
      ['Gamma globulins', 'Most gamma globulins migrate more slowly.'],
      [
        'Every protein migrates at the same speed',
        'Differential migration creates the separation.',
      ],
      ['No proteins move because all are neutral', 'Proteins are charged under these conditions.'],
    ],
    'Charge and the support system determine protein migration; albumin leads the routine alkaline pattern.',
    371,
    '6.5 Proteins, Electrophoresis, and Lipids',
  ),
  q(
    'cc-h5-029',
    chemistry,
    'Proteins',
    'case',
    'An electrophoresis run has applied voltage but no protein migration. A broken buffer connection is found. What failed?',
    [
      'The ionic circuit needed for current flow',
      'The salt bridge supplies a conducting path across the support medium.',
    ],
    [
      [
        'Excessively prolonged staining',
        'Stain timing does not explain the broken electrical path during separation.',
      ],
      [
        'A change in the relative globulin concentration',
        'A different fraction distribution does not stop all proteins from migrating.',
      ],
      [
        'A restricted immunoglobulin band',
        'A monoclonal component changes the band pattern rather than interrupting current flow.',
      ],
    ],
    'Applied voltage alone is insufficient when the conducting buffer path is interrupted.',
    371,
    '6.5 Proteins, Electrophoresis, and Lipids',
  ),
  q(
    'cc-h5-030',
    chemistry,
    'Proteins',
    'case',
    'An elevated total protein is accompanied by low albumin and a narrow immunoglobulin band. Which explanation best integrates the findings?',
    [
      'Increased monoclonal globulin can raise total protein despite reduced albumin',
      'Total protein includes globulins as well as albumin.',
    ],
    [
      [
        'Total protein and albumin must always change in the same direction',
        'Different protein fractions can change independently.',
      ],
      [
        'Albumin is the only protein measured in total protein',
        'The assay includes other proteins.',
      ],
      [
        'A narrow band proves dehydration alone',
        'A restricted immunoglobulin band is not explained by dehydration alone.',
      ],
    ],
    'Interpret total protein with individual fractions rather than assuming it is interchangeable with albumin.',
    369,
    '6.5 Proteins, Electrophoresis, and Lipids',
  ),
  q(
    'cc-h5-031',
    chemistry,
    'Proteins',
    'recall',
    'Which protein is a major contributor to the beta region in routine serum electrophoresis?',
    ['Transferrin', 'Transferrin migrates in the beta fraction.'],
    [
      ['Albumin', 'Albumin forms a separate, faster migrating fraction.'],
      [
        'Alpha-1-antitrypsin as its principal location',
        'That protein primarily contributes to the alpha-1 region.',
      ],
      [
        'Haptoglobin as its principal location',
        'Haptoglobin primarily contributes to the alpha-2 region.',
      ],
    ],
    'Know the principal proteins behind electrophoretic fractions, not just their peak positions.',
    372,
    '6.5 Proteins, Electrophoresis, and Lipids',
  ),
  q(
    'cc-h5-032',
    chemistry,
    'Enzymes',
    'case',
    'An assay is intended to measure enzyme activity. Which condition best makes reaction velocity proportional to the amount of enzyme?',
    [
      'Substrate in sufficient excess to saturate the enzyme',
      'Under zero-order conditions with respect to substrate, the rate follows enzyme activity.',
    ],
    [
      [
        'Severe substrate depletion before the first reading',
        'Substrate limitation makes the rate depend on substrate availability.',
      ],
      ['Using no substrate', 'Without substrate, the intended reaction cannot proceed.'],
      [
        'Allowing all reactions to reach equilibrium before measuring rate',
        'At equilibrium, net reaction rate does not provide the intended activity measurement.',
      ],
    ],
    'Enzyme activity assays require controlled conditions with substrate in excess.',
    391,
    '6.6 Enzymes and Cardiac Markers',
  ),
  q(
    'cc-h5-033',
    chemistry,
    'Enzymes',
    'recall',
    'What does an enzyme change in a reversible chemical reaction?',
    [
      'The rate at which equilibrium is approached',
      'Catalysis lowers activation barriers without changing the equilibrium composition.',
    ],
    [
      [
        'The final equilibrium constant by definition',
        'A catalyst does not change the equilibrium constant.',
      ],
      [
        'The elemental identity of atoms',
        'Chemical catalysis does not change one element into another.',
      ],
      ['The requirement for conservation of mass', 'Catalyzed reactions still conserve mass.'],
    ],
    'Catalysts accelerate reactions without changing their thermodynamic equilibrium.',
    391,
    '6.6 Enzymes and Cardiac Markers',
  ),
  q(
    'cc-h5-034',
    chemistry,
    'Enzymes',
    'case',
    'An inhibitor competes with substrate for an enzyme active site. Which experimental change can overcome this inhibition?',
    [
      'Increasing substrate concentration sufficiently',
      'Substrate competes for the same binding site as a competitive inhibitor.',
    ],
    [
      [
        'Removing all substrate',
        'That prevents the desired reaction rather than overcoming inhibition.',
      ],
      ['Destroying the enzyme protein', 'Denaturation removes catalytic activity.'],
      [
        'Assuming the inhibitor irreversibly destroyed every enzyme molecule',
        'Competitive inhibition does not imply that irreversible mechanism.',
      ],
    ],
    'Competitive inhibition can be reduced by increasing substrate availability.',
    391,
    '6.6 Enzymes and Cardiac Markers',
  ),
  q(
    'cc-h5-035',
    chemistry,
    'Enzymes',
    'recall',
    'A transaminase assay supplies pyridoxal phosphate. What role does this organic molecule serve?',
    [
      'An activity-supporting coenzyme/prosthetic component',
      'Pyridoxal phosphate supports aminotransferase catalysis.',
    ],
    [
      [
        'The analyte protein being measured in every sample',
        'The reagent supplies a catalytic aid rather than the patient enzyme itself.',
      ],
      [
        'A substitute for all substrate',
        'The reaction still requires its amino-acid and keto-acid substrates.',
      ],
      [
        'A permanently inert salt with no catalytic relevance',
        'Its catalytic role is why it is supplied.',
      ],
    ],
    'Enzyme results depend on coenzyme availability as well as the amount of enzyme present.',
    392,
    '6.6 Enzymes and Cardiac Markers',
  ),
  q(
    'cc-h5-036',
    chemistry,
    'Enzymes',
    'case',
    'A hemolyzed specimen gives an unexpectedly high LD activity. Which preanalytical explanation is most relevant?',
    [
      'Release of LD from erythrocytes',
      'RBCs contain substantial LD, so in-vitro hemolysis can elevate the measured activity.',
    ],
    [
      [
        'Hemolysis removes all intracellular enzymes',
        'Cell disruption releases intracellular material.',
      ],
      [
        'Every high LD result is specific for liver disease',
        'LD occurs in several tissues and is not disease-specific.',
      ],
      [
        'LD can only be produced after the sample enters the analyzer',
        'The enzyme is already present in cells and plasma.',
      ],
    ],
    'Interpret LD with specimen quality because in-vitro hemolysis can mimic a biological increase.',
    394,
    '6.6 Enzymes and Cardiac Markers',
  ),
  q(
    'cc-h5-037',
    chemistry,
    'Endocrinology',
    'case',
    'In a teaching case, testosterone is low while LH and FSH are elevated. Which level of dysfunction best fits this feedback pattern?',
    [
      'Primary testicular dysfunction with preserved pituitary response',
      'Reduced target-gland output removes negative feedback, allowing gonadotropins to rise.',
    ],
    [
      [
        'Complete pituitary gonadotropin failure',
        'That would tend to produce low or inappropriately normal gonadotropins.',
      ],
      [
        'Normal target-gland output proven by low testosterone',
        'The low target hormone does not establish normal output.',
      ],
      [
        'Suppression of LH and FSH by excess testosterone',
        'That feedback mechanism would tend to lower gonadotropins rather than raise them.',
      ],
    ],
    'Interpret target hormones together with their pituitary regulators.',
    418,
    '6.7 Clinical Endocrinology',
  ),
  q(
    'cc-h5-038',
    chemistry,
    'Endocrinology',
    'case',
    'A laboratory receives a request to distinguish intact PTH from inactive fragments. Which assay design most directly improves that selectivity?',
    [
      'A two-site assay recognizing separate portions of the intact molecule',
      'Requiring two epitopes helps avoid measuring fragments recognized by only one antibody.',
    ],
    [
      [
        'A single antibody that binds every fragment indiscriminately',
        'This sacrifices selectivity for intact PTH.',
      ],
      ['A total protein biuret assay', 'Total protein does not specifically measure PTH.'],
      ['A urine glucose strip', 'That strip does not recognize PTH epitopes.'],
    ],
    'Immunoassay epitope selection determines which hormone forms contribute to a result.',
    421,
    '6.7 Clinical Endocrinology',
  ),
  q(
    'cc-h5-039',
    chemistry,
    'Endocrinology',
    'recall',
    'Which ovarian estrogen is generally measured to assess ovarian function?',
    ['Estradiol (E2)', 'Estradiol is the major estrogen produced by the ovaries.'],
    [
      ['Cortisol', 'Cortisol is a glucocorticoid rather than an ovarian estrogen.'],
      ['Aldosterone', 'Aldosterone is a mineralocorticoid.'],
      ['Parathyroid hormone', 'PTH regulates calcium and phosphate and is not an estrogen.'],
    ],
    'Use the hormone appropriate to the target gland and physiological question.',
    418,
    '6.7 Clinical Endocrinology',
  ),
  q(
    'cc-h5-040',
    chemistry,
    'Endocrinology',
    'case',
    'Excess ADH action causes water retention. Which paired laboratory pattern is most consistent with this mechanism?',
    [
      'Dilute plasma with urine that remains inappropriately concentrated',
      'Water retention lowers plasma osmolality while persistent ADH promotes urine concentration.',
    ],
    [
      [
        'Concentrated plasma with maximally dilute urine as the defining pattern',
        'That is opposite to the water-retaining mechanism described.',
      ],
      [
        'High plasma sodium solely because more water is retained',
        'Retaining water without proportionate solute tends to dilute sodium.',
      ],
      ['No possible effect on plasma osmolality', 'Water balance directly affects osmolality.'],
    ],
    'Evaluate plasma and urine concentration together when considering ADH-mediated water handling.',
    417,
    '6.7 Clinical Endocrinology',
  ),
  q(
    'ibb-h5-001',
    immuno,
    'Immunoglobulins',
    'recall',
    'Which portion of an antibody directly creates its antigen-combining site?',
    [
      'The variable regions of a paired heavy and light chain',
      'The interacting variable regions form the specific binding surface within Fab.',
    ],
    [
      [
        'Only the constant Fc tail',
        'Fc mediates effector interactions rather than defining the antigen-binding surface.',
      ],
      [
        'A J-chain acting alone',
        'J-chain joins polymeric units and is not the antigen-combining site.',
      ],
      ['A free complement C3 molecule', 'Complement is a different protein system.'],
    ],
    'Antigen specificity resides in the paired variable regions of the Fab portion.',
    131,
    '3.1 Basic Principles of Immunology',
  ),
  q(
    'ibb-h5-002',
    immuno,
    'Immunoglobulins',
    'recall',
    'Two antibodies bind the same antigen but have different heavy-chain constant regions. Which property can differ because of those constant regions?',
    [
      'Their complement-binding and other effector functions',
      'The constant heavy-chain region determines class-associated effector properties.',
    ],
    [
      ['Whether they contain any amino acids', 'All antibody proteins contain amino acids.'],
      [
        'Whether their antigen is physically present',
        'The antibody constant region does not create the antigen.',
      ],
      [
        'The number of chromosomes in the target cell',
        'An antibody class does not set target-cell chromosome number.',
      ],
    ],
    'Antigen binding and effector function are structurally separable antibody properties.',
    131,
    '3.1 Basic Principles of Immunology',
  ),
  q(
    'ibb-h5-003',
    immuno,
    'Immunoglobulins',
    'recall',
    'Which pair of immunoglobulin forms uses a J-chain to join antibody units?',
    [
      'Pentameric IgM and secretory dimeric IgA',
      'J-chain participates in the polymeric structures of these forms.',
    ],
    [
      [
        'Monomeric IgG and monomeric IgE',
        'These monomeric classes do not use J-chain to join units.',
      ],
      ['Albumin and transferrin', 'These are not immunoglobulin polymers.'],
      ['Every antibody molecule in serum', 'J-chain is not a universal antibody component.'],
    ],
    'J-chain is associated with polymeric IgM and secretory IgA.',
    131,
    '3.1 Basic Principles of Immunology',
  ),
  q(
    'ibb-h5-004',
    immuno,
    'Immunoglobulins',
    'case',
    'A newborn has circulating maternal antibody acquired before birth. Which immunoglobulin class accounts for this transferred protection?',
    [
      'IgG',
      'Placental transport of maternal IgG supplies passive fetal and neonatal humoral protection.',
    ],
    [
      [
        'IgM as the main placentally transported class',
        'IgM does not normally cross the placenta.',
      ],
      [
        'IgE as the main placentally transported class',
        'IgE is not the principal transferred protective class.',
      ],
      [
        'Secretory IgA transported across the placenta',
        'Secretory IgA is associated with mucosal secretions rather than this placental transfer.',
      ],
    ],
    'Maternal IgG can cross the placenta and provide passive protection.',
    133,
    '3.1 Basic Principles of Immunology',
  ),
  q(
    'ibb-h5-005',
    immuno,
    'Immunoglobulins',
    'recall',
    'After antigen activation, which B-cell descendant is specialized for secreting large amounts of antibody?',
    ['A plasma cell', 'Activated B cells can differentiate into antibody-secreting plasma cells.'],
    [
      ['An erythrocyte', 'Mature erythrocytes are not antibody-secreting B-cell descendants.'],
      [
        'A neutrophil',
        'Neutrophils are phagocytes, not differentiated antibody-secreting B cells.',
      ],
      ['A platelet', 'Platelets are megakaryocyte-derived fragments.'],
    ],
    'Plasma cells carry out the secretory arm of humoral immunity.',
    128,
    '3.1 Basic Principles of Immunology',
  ),
  q(
    'ibb-h5-006',
    immuno,
    'Immunoglobulins',
    'case',
    'A repeat antigen exposure produces a rapid, high-titer antibody response. Which class typically predominates in the classic secondary serum response?',
    [
      'IgG',
      'The secondary response is characterized by strong IgG production from immunological memory.',
    ],
    [
      [
        'IgD as the dominant secreted serum response',
        'IgD is not the typical dominant secondary serum class.',
      ],
      ['IgE in every antigen response', 'IgE is not the universal secondary-response class.'],
      [
        'No immunoglobulin because memory prevents secretion',
        'Memory supports a faster response rather than eliminating antibody production.',
      ],
    ],
    'Compare secondary IgG responses with early primary IgM responses.',
    132,
    '3.1 Basic Principles of Immunology',
  ),
  q(
    'ibb-h5-007',
    immuno,
    'Immunoglobulins',
    'case',
    'An immunofixation study shows matching narrow bands in the IgG and kappa lanes. What is the most direct interpretation?',
    [
      'A restricted IgG-kappa immunoglobulin component',
      'Coincident restricted heavy- and light-chain bands identify the immunoglobulin type.',
    ],
    [
      ['All serum proteins are absent', 'Bands demonstrate protein rather than total absence.'],
      ['An IgM-lambda component', 'That would require mu-heavy-chain and lambda bands.'],
      ['A numerical count of plasma cells', 'Immunofixation identifies proteins, not cell counts.'],
    ],
    'Interpret immunofixation by matching the heavy- and light-chain bands.',
    139,
    '3.2 Immunologic Procedures',
  ),
  q(
    'ibb-h5-008',
    immuno,
    'Immunoglobulins',
    'recall',
    'In a monoclonal gammopathy, does the label M component necessarily mean the protein is IgM?',
    [
      'No; M denotes a monoclonal component, which can have different heavy-chain classes',
      'Monoclonality is distinct from the mu heavy chain that defines IgM.',
    ],
    [
      [
        'Yes; all monoclonal proteins have mu heavy chains',
        'Monoclonal IgG, IgA, and other forms also occur.',
      ],
      ['Yes; M denotes only membrane-bound antibodies', 'The term does not mean membrane-bound.'],
      ['No; it means only an electrolyte peak', 'A monoclonal component is a protein finding.'],
    ],
    'Do not confuse M for monoclonal with the M in the class name IgM.',
    169,
    '3.6 Immunoglobulins, Complement, and Cellular Testing',
  ),
  q(
    'ibb-h5-009',
    immuno,
    'Immunoglobulins',
    'case',
    'A functional study compares the same patient before and after antigen exposure. Why can antigen-specific antibody testing add information beyond a total immunoglobulin concentration?',
    [
      'It assesses the ability to mount a specific humoral response',
      'A total concentration does not show whether an appropriate antigen-specific response occurred.',
    ],
    [
      [
        'It directly counts every neutrophil',
        'Antibody testing does not provide a neutrophil count.',
      ],
      [
        'It makes total antibody concentration biologically irrelevant',
        'Total levels and functional response answer complementary questions.',
      ],
      [
        'It proves all immune functions are normal',
        'A single response test does not establish all immune function.',
      ],
    ],
    'Quantitative immunoglobulin levels and antigen-specific response test different aspects of humoral immunity.',
    169,
    '3.6 Immunoglobulins, Complement, and Cellular Testing',
  ),
  q(
    'ibb-h5-010',
    immuno,
    'Immunoglobulins',
    'case',
    'IgA is markedly deficient in a patient with an otherwise normal B-cell count. Which conclusion is justified?',
    [
      'B-cell presence does not guarantee normal production of every immunoglobulin class',
      'Class-specific defects can exist despite a normal number of circulating B cells.',
    ],
    [
      [
        'A normal B-cell count excludes an antibody deficiency',
        'Cell number and immunoglobulin output are not equivalent.',
      ],
      ['All T cells must be absent', 'That does not follow from selective IgA deficiency.'],
      [
        'The IgA result can be ignored because cells were counted',
        'The quantitative protein result remains relevant.',
      ],
    ],
    'Interpret immune cell counts together with functional and class-specific protein results.',
    169,
    '3.6 Immunoglobulins, Complement, and Cellular Testing',
  ),
  q(
    'ibb-h5-011',
    immuno,
    'Hypersensitivity',
    'case',
    'A delayed skin reaction is dominated by sensitized T cells and macrophages rather than antibody. Which mechanism best fits?',
    [
      'Type IV hypersensitivity',
      'Delayed, cell-mediated hypersensitivity depends on T-cell responses and recruited macrophages.',
    ],
    [
      [
        'Type I hypersensitivity',
        'Type I is associated with immediate IgE-mediated mast-cell responses.',
      ],
      ['Type II hypersensitivity', 'Type II involves antibody against cell or tissue targets.'],
      ['Type III hypersensitivity', 'Type III is associated with deposited immune complexes.'],
    ],
    'Identify the effector mechanism rather than classifying every skin reaction as IgE-mediated.',
    166,
    '3.5 Hypersensitivity',
  ),
  q(
    'ibb-h5-012',
    immuno,
    'Hypersensitivity',
    'case',
    'Antigen-antibody complexes deposit in small vessels and activate local inflammatory injury. Which hypersensitivity category describes this mechanism?',
    ['Type III', 'Immune-complex deposition is characteristic of type III injury.'],
    [
      ['Type I', 'Type I is the immediate mast-cell/IgE mechanism.'],
      ['Type II', 'Type II centers on antibody binding fixed cell or tissue antigens.'],
      ['Type IV', 'Type IV is primarily T-cell mediated rather than immune-complex deposition.'],
    ],
    'Immune-complex location and effector mechanisms help distinguish hypersensitivity categories.',
    164,
    '3.5 Hypersensitivity',
  ),
  q(
    'ibb-h5-013',
    immuno,
    'Hypersensitivity',
    'case',
    'Antibody binds antigens on a patient cell surface, leading to complement-associated cell destruction. Which mechanism is being illustrated?',
    [
      'Type II antibody-mediated hypersensitivity',
      'The target is a cell-bound antigen rather than soluble deposited immune complexes.',
    ],
    [
      [
        'Type I immediate mast-cell activation only',
        'Mast-cell-bound IgE is not the cell-destructive mechanism described.',
      ],
      [
        'Type III solely because any antibody is present',
        'Presence of antibody alone does not establish immune-complex deposition.',
      ],
      [
        'Type IV because complement is a T-cell receptor',
        'Complement is not a T-cell receptor, and the mechanism is antibody-mediated.',
      ],
    ],
    'Type II reactions involve antibodies directed against fixed cellular or tissue targets.',
    165,
    '3.5 Hypersensitivity',
  ),
  q(
    'ibb-h5-014',
    immuno,
    'Hypersensitivity',
    'case',
    'Fluorescent anti-human immunoglobulin is applied directly to a tissue biopsy and reveals antibody already bound along a basement membrane. What does this approach demonstrate?',
    [
      'In-situ tissue-bound immunoglobulin',
      'The labeled reagent directly detects human antibody already attached to the tissue.',
    ],
    [
      [
        'Only soluble patient antibody added to a separate reagent substrate',
        'That describes an indirect design rather than direct tissue staining.',
      ],
      [
        'The total number of circulating platelets',
        'Tissue immunofluorescence does not count circulating platelets.',
      ],
      [
        'All circulating complement function',
        'Local staining is not a total complement functional assay.',
      ],
    ],
    'Direct tissue immunofluorescence detects deposited immunoglobulin at the tissue site.',
    166,
    '3.5 Hypersensitivity',
  ),
  q(
    'ibb-h5-015',
    immuno,
    'Hypersensitivity',
    'recall',
    'Why does allergen-specific IgE testing answer a different question from total IgE measurement?',
    [
      'It assesses antibody directed against a particular allergen',
      'Total IgE sums a class concentration without identifying all of its specificities.',
    ],
    [
      [
        'Total IgE identifies every possible allergen automatically',
        'A total concentration does not define antigen specificity.',
      ],
      [
        'Specific IgE testing measures only IgG',
        'The assay targets IgE, not a different heavy-chain class.',
      ],
      [
        'Allergen specificity is determined by sodium concentration',
        'Electrolyte concentration does not establish IgE antigen binding.',
      ],
    ],
    'Distinguish the amount of an immunoglobulin class from its antigen specificity.',
    165,
    '3.5 Hypersensitivity',
  ),
  q(
    'ibb-h5-016',
    immuno,
    'Hypersensitivity',
    'case',
    'Complement activation releases small peptides that increase vascular permeability and support inflammation. Which group contains these anaphylatoxins?',
    [
      'C3a, C4a, and C5a',
      'These complement fragments participate in inflammatory and vasoactive effects.',
    ],
    [
      [
        'Albumin, transferrin, and fibrinogen',
        'These are not the complement split products described.',
      ],
      [
        'IgG heavy, kappa, and lambda chains',
        'Immunoglobulin chains are not complement anaphylatoxins.',
      ],
      ['Sodium, potassium, and chloride', 'These ions are not complement peptides.'],
    ],
    'Complement activation produces inflammatory fragments as well as surface-bound effector components.',
    131,
    '3.1 Basic Principles of Immunology',
  ),
  q(
    'ibb-h5-017',
    immuno,
    'Serologic methods',
    'case',
    'After an indirect ELISA wash step is missed, unbound enzyme-labeled anti-human antibody remains in the well. In an assay where greater color indicates greater antibody, what error is expected?',
    [
      'A falsely increased signal',
      'Unbound enzyme conjugate can still convert substrate to colored product.',
    ],
    [
      [
        'A guaranteed true-negative result',
        'Residual enzyme can create background signal rather than guarantee a negative result.',
      ],
      ['Conversion of all IgG to IgM', 'A wash failure does not change immunoglobulin class.'],
      [
        'No effect because only bound enzymes can act',
        'Free enzyme conjugate can also act on substrate.',
      ],
    ],
    'Washing controls nonspecific enzyme signal in heterogeneous immunoassays.',
    138,
    '3.2 Immunologic Procedures',
  ),
  q(
    'ibb-h5-018',
    immuno,
    'Serologic methods',
    'case',
    'An ELISA well is allowed to develop color much longer than the validated protocol while calibrators are stopped on time. What is the main concern?',
    [
      'The sample signal may be spuriously high relative to the calibrators',
      'The enzyme has additional time to form colored product.',
    ],
    [
      [
        'The longer incubation automatically improves comparability',
        'Unequal reaction times undermine comparison with calibrators.',
      ],
      [
        'All enzymes stop exactly at the intended time without intervention',
        'The signal reaction may continue until stopped.',
      ],
      [
        'The specimen antibody class changes with time',
        'Reaction time does not change its heavy-chain class.',
      ],
    ],
    'Keep color-development timing consistent with the validated method.',
    138,
    '3.2 Immunologic Procedures',
  ),
  q(
    'ibb-h5-019',
    immuno,
    'Serologic methods',
    'case',
    'A quantitative ELISA result exceeds the highest calibrated standard. The method permits validated dilution. What provides a defensible numeric result?',
    [
      'Dilute within the validated procedure, repeat, and apply the dilution factor',
      'This brings the measurement into the calibrated range while accounting for dilution.',
    ],
    [
      [
        'Extrapolate arbitrarily beyond the calibration curve',
        'Unvalidated extrapolation does not establish accuracy beyond the range.',
      ],
      [
        'Report the highest standard as the exact patient value',
        'The sample exceeded that value and is not equal to it.',
      ],
      [
        'Use a smaller volume without documenting or validating it',
        'An uncontrolled volume change lacks a defensible correction.',
      ],
    ],
    'Out-of-range results require validated handling rather than invented numerical extrapolation.',
    138,
    '3.2 Immunologic Procedures',
  ),
  q(
    'ibb-h5-020',
    immuno,
    'Serologic methods',
    'recall',
    'Antigen is attached to inert latex particles to make antibody-induced clumping easier to see. Which method is described?',
    [
      'Passive agglutination',
      'Carrier particles provide visible aggregation of an otherwise soluble antigen-antibody interaction.',
    ],
    [
      ['Direct cell counting', 'The method detects aggregation rather than counting all cells.'],
      ['Protein electrophoresis', 'No electric-field separation is described.'],
      ['A blood-gas electrode measurement', 'The readout is clumping, not an electrode potential.'],
    ],
    'Passive agglutination uses an inert carrier to display antigen or antibody reactions.',
    141,
    '3.2 Immunologic Procedures',
  ),
  q(
    'ibb-h5-021',
    immuno,
    'Serologic methods',
    'case',
    'A specimen remains reactive through a 1:64 dilution but is nonreactive at 1:128. How is the endpoint titer conventionally expressed?',
    ['64', 'The titer is the reciprocal of the highest reactive dilution.'],
    [
      ['128', 'That dilution is nonreactive and therefore is beyond the endpoint.'],
      ['1', 'The undiluted specimen does not represent the highest reactive dilution.'],
      ['192', 'Adding dilution denominators has no role in endpoint titer reporting.'],
    ],
    'Report a titer from the last reactive dilution, not the first nonreactive dilution.',
    141,
    '3.2 Immunologic Procedures',
  ),
  q(
    'ibb-h5-022',
    immuno,
    'Serologic methods',
    'recall',
    'An Ouchterlony double-diffusion pattern shows precipitin lines crossing without fusion. What relationship does this pattern support?',
    [
      'Nonidentity of the antigenic systems',
      'Crossed lines indicate separate antigen-antibody reactions rather than shared identity.',
    ],
    [
      ['Complete identity', 'Identity produces fused lines rather than crossing lines.'],
      ['No antigen-antibody reaction anywhere', 'Visible precipitin lines demonstrate reactions.'],
      [
        'A numerical immunoglobulin concentration',
        'The qualitative pattern does not provide a concentration value.',
      ],
    ],
    'Interpret diffusion patterns by their geometry; crossed and fused lines have different meanings.',
    138,
    '3.2 Immunologic Procedures',
  ),
  q(
    'ibb-h5-023',
    immuno,
    'Serologic methods',
    'case',
    'A nephelometric assay records the early increase in scattered light as immune complexes form. Which feature distinguishes this rate approach from endpoint reading?',
    [
      'It follows change in signal over a defined early interval',
      'Rate nephelometry measures complex formation as a time-dependent process.',
    ],
    [
      [
        'It waits until all complexes have settled before reading',
        'Settling can reduce endpoint scatter and is not the early rate approach.',
      ],
      [
        'It measures only unbound sodium ions',
        'Immune nephelometry detects light scattering from particles.',
      ],
      ['It uses no time information', 'A rate requires a time interval.'],
    ],
    'A reaction rate and a final signal are different analytical observables.',
    140,
    '3.2 Immunologic Procedures',
  ),
  q(
    'ibb-h5-024',
    immuno,
    'Serologic methods',
    'case',
    'An initial protein separation reveals a restricted band. Which follow-up method identifies its immunoglobulin heavy and light chains?',
    [
      'Immunofixation electrophoresis',
      'Class- and light-chain-specific antisera characterize the restricted protein.',
    ],
    [
      [
        'Urine specific gravity',
        'Specific gravity does not identify protein heavy and light chains.',
      ],
      ['A CBC without further protein testing', 'A cell count does not type the protein band.'],
      ['A serum potassium assay', 'Potassium measurement is unrelated to immunoglobulin typing.'],
    ],
    'Electrophoretic restriction and immunochemical typing supply complementary information.',
    139,
    '3.2 Immunologic Procedures',
  ),
  q(
    'ibb-h5-025',
    immuno,
    'Serologic methods',
    'recall',
    'What does a CH50 assay evaluate?',
    [
      'Functional complement-mediated lysis of sensitized target erythrocytes',
      'The classic assay measures the serum dilution producing 50% lysis of standardized sensitized cells.',
    ],
    [
      [
        'The concentration of all immunoglobulin subclasses separately',
        'CH50 is not a subclass concentration assay.',
      ],
      ['The absolute count of CD4 T cells', 'Lymphocyte enumeration requires a different method.'],
      [
        'Only the mass of C3 regardless of function',
        'A functional lytic endpoint is broader than C3 concentration alone.',
      ],
    ],
    'Complement concentration and complement function are different measurements.',
    171,
    '3.6 Immunoglobulins, Complement, and Cellular Testing',
  ),
  q(
    'ibb-h5-026',
    immuno,
    'Serologic methods',
    'case',
    'A neutrophil respiratory-burst investigation uses dihydrorhodamine (DHR). What cellular function is being assessed?',
    [
      'Oxidative activity associated with phagocyte microbial killing',
      'The DHR assay evaluates respiratory-burst function relevant to chronic granulomatous disease.',
    ],
    [
      [
        'Placental transfer of IgG',
        'This concerns antibody transport, not neutrophil oxidative function.',
      ],
      ['ABO antigen density on red cells', 'DHR does not type ABO antigens.'],
      ['Serum albumin migration', 'That is a protein electrophoresis property.'],
    ],
    'A normal phagocyte count does not necessarily establish normal oxidative killing function.',
    171,
    '3.6 Immunoglobulins, Complement, and Cellular Testing',
  ),
  q(
    'ibb-h5-027',
    immuno,
    'Antiglobulin testing',
    'case',
    'An antiglobulin tube test is unexpectedly negative after inadequate washing of red cells. Which mechanism can explain the failure?',
    [
      'Residual unbound immunoglobulin neutralizes the antiglobulin reagent',
      'Washing removes soluble immunoglobulin that can consume reagent before it bridges cell-bound antibody.',
    ],
    [
      [
        'Washing creates all patient antibodies from nothing',
        'Washing does not manufacture antibodies.',
      ],
      [
        'The absence of a wash always increases agglutination',
        'Soluble immunoglobulin can instead produce a false-negative reaction.',
      ],
      ['Red-cell antigens become free glucose', 'No such conversion occurs.'],
    ],
    'Adequate washing is essential in tube antiglobulin methods.',
    166,
    '3.5 Hypersensitivity',
  ),
  q(
    'ibb-h5-028',
    immuno,
    'Antiglobulin testing',
    'case',
    'Red cells already have a positive DAT. Why can an antiglobulin-phase weak-D result be misleading if that pre-existing coating is not accounted for?',
    [
      'The antiglobulin reagent can detect the existing coating independently of anti-D binding',
      'A positive antiglobulin endpoint need not have been caused by the weak-D reagent.',
    ],
    [
      ['DAT positivity proves D antigen is absent', 'The DAT does not establish D antigen status.'],
      ['DAT positivity proves D antigen is present', 'The DAT is not a D phenotype determination.'],
      [
        'Existing cell-bound antibody can never affect another antiglobulin test',
        'It can confound interpretation of an antiglobulin endpoint.',
      ],
    ],
    'Separate pre-existing sensitization from sensitization produced by the test reagent.',
    199,
    '4.3 Rh Blood Group System',
  ),
  q(
    'ibb-h5-029',
    immuno,
    'Antiglobulin testing',
    'case',
    'IgG is demonstrated on patient red cells. Which preparation allows the laboratory to study the specificity of that cell-bound antibody?',
    [
      'An eluate tested against a reagent-cell panel',
      'Elution releases bound antibody so its reactions can be characterized.',
    ],
    [
      ['A urine glucose strip', 'This does not recover red-cell-bound antibody.'],
      [
        'A serum electrolyte calibrator',
        'An electrolyte calibrator has no role in antibody elution.',
      ],
      [
        'A platelet estimate alone',
        'Platelet counting does not identify red-cell antibody specificity.',
      ],
    ],
    'An eluate investigates antibody recovered from sensitized red cells.',
    216,
    '4.5 Compatibility Testing',
  ),
  q(
    'ibb-h5-030',
    immuno,
    'Antiglobulin testing',
    'recall',
    'Which pairing tests the major crossmatch interaction?',
    [
      'Recipient serum or plasma with donor red cells',
      'The combination evaluates recipient antibodies against the proposed donor cells.',
    ],
    [
      [
        'Recipient serum with recipient red cells only',
        'That combination is an autocontrol rather than a major crossmatch.',
      ],
      [
        'Donor serum with recipient red cells',
        'That is the reverse pairing historically called a minor crossmatch.',
      ],
      [
        'Donor serum with donor red cells only',
        'That is not the recipient-versus-donor interaction of the major crossmatch.',
      ],
    ],
    'A major crossmatch examines recipient antibody reactivity with donor red cells.',
    213,
    '4.5 Compatibility Testing',
  ),
  q(
    'ibb-h5-031',
    immuno,
    'Blood groups',
    'recall',
    'A routine serologic test shows which blood-group antigens are expressed on red cells. What kind of information has been obtained directly?',
    [
      'Phenotype',
      'Serologic reactivity demonstrates expressed antigen rather than directly sequencing inherited alleles.',
    ],
    [
      ['The complete DNA sequence', 'Serology alone does not sequence the underlying genes.'],
      [
        'Every possible parental genotype',
        'A phenotype does not uniquely identify all parental genotypes.',
      ],
      [
        'The complete antibody repertoire of the patient',
        'Antigen typing does not identify all circulating antibodies.',
      ],
    ],
    'Distinguish antigen expression (phenotype) from direct genetic determination.',
    187,
    '4.1 Genetics and Immunology of Blood Groups',
  ),
  q(
    'ibb-h5-032',
    immuno,
    'Blood groups',
    'case',
    'Under the usual ABO inheritance model, one parent has genotype AO and the other BO. Which set of offspring genotypes is possible?',
    [
      'AB, AO, BO, and OO',
      'Each parent can contribute either of its two alleles, producing four combinations.',
    ],
    [
      ['AB only', 'Both parents can also transmit O.'],
      [
        'AA and BB only',
        'Neither parent carries the two identical alleles needed for those combinations.',
      ],
      ['OO only', 'Either parent can transmit its A or B allele.'],
    ],
    'Use allele combinations rather than assuming an ABO phenotype always specifies one genotype.',
    189,
    '4.1 Genetics and Immunology of Blood Groups',
  ),
  q(
    'ibb-h5-033',
    immuno,
    'Blood groups',
    'case',
    'A patient lacks H antigen on red cells and has anti-H reactivity, including against group O cells. Which blood-group phenotype fits?',
    [
      'Bombay (Oh) phenotype',
      'Lack of H prevents normal A/B expression and allows anti-H formation.',
    ],
    [
      [
        'Ordinary group O solely because anti-A and anti-B are absent from cells',
        'Ordinary O red cells have abundant H antigen.',
      ],
      ['Ordinary AB phenotype', 'AB cells express A and B built on H precursor.'],
      ['Rh-negative phenotype alone', 'D-antigen status does not explain the H-antigen finding.'],
    ],
    'Ordinary group O and Bombay phenotype are not serologically equivalent.',
    189,
    '4.1 Genetics and Immunology of Blood Groups',
  ),
  q(
    'ibb-h5-034',
    immuno,
    'Blood groups',
    'case',
    'Cells react strongly with anti-A, weakly with anti-B, but the serum still reacts strongly with B reagent cells. Which phenomenon could explain this discordance?',
    [
      'Acquired B-like reactivity in a group A specimen',
      'Acquired B can produce a weak forward anti-B reaction without the expected AB reverse pattern.',
    ],
    [
      [
        'An uncomplicated, concordant AB result',
        'An ordinary AB reverse type should not strongly react with B cells.',
      ],
      [
        'D antigen determines the reverse ABO result',
        'Rh D does not account for this ABO antibody pattern.',
      ],
      [
        'A weak anti-B reaction proves inherited BB genotype',
        'Weak serologic reactivity does not prove that genotype.',
      ],
    ],
    'Resolve forward/reverse discrepancies before accepting an ABO assignment.',
    194,
    '4.2 ABO Blood Group System',
  ),
  q(
    'ibb-h5-035',
    immuno,
    'Blood groups',
    'recall',
    'The laboratory designation Rh positive ordinarily refers to which antigen?',
    ['D', 'Routine Rh-positive/negative designation concerns D rather than all Rh antigens.'],
    [
      [
        'Every antigen in the Rh system simultaneously',
        'C, c, E, and e can be present in different combinations.',
      ],
      ['H', 'H is an ABO precursor antigen, not the D antigen.'],
      ['K', 'K belongs to the Kell system.'],
    ],
    'D-negative cells may still express other Rh-system antigens.',
    198,
    '4.3 Rh Blood Group System',
  ),
  q(
    'ibb-h5-036',
    immuno,
    'Blood groups',
    'case',
    'Some D-positive cells lack particular D epitopes. After exposure, antibody can form against the missing portions. Which concept explains this?',
    [
      'Partial D antigen expression',
      'Expression of some D epitopes does not guarantee expression of every D epitope.',
    ],
    [
      ['Complete absence of every red-cell antigen', 'The cells express at least some D epitopes.'],
      ['ABO antibody excess alone', 'The finding concerns D epitope structure.'],
      [
        'All positive D reactions prove identical D structure',
        'Different epitope structures can still produce a positive serologic reaction.',
      ],
    ],
    'Antigen quantity and antigen epitope composition are distinct considerations.',
    200,
    '4.3 Rh Blood Group System',
  ),
  q(
    'ibb-h5-037',
    immuno,
    'Antibody identification',
    'case',
    'An antibody reacts more strongly with cells homozygous for the target antigen than with heterozygous cells. What interpretation best accounts for that pattern?',
    [
      'Dosage',
      'Different antigen expression can produce stronger reactions with homozygous cells.',
    ],
    [
      ['A guarantee of no antibody', 'The cells have demonstrable antibody reactivity.'],
      [
        'A change in antibody class in every tube',
        'The pattern does not require the antibody class to change.',
      ],
      [
        'A measurement of patient medication dose',
        'Dosage here refers to antigen expression, not a medication amount.',
      ],
    ],
    'Antigen dosage can explain variable panel strength without requiring multiple antibodies.',
    204,
    '4.4 Testing for Antibodies',
  ),
  q(
    'ibb-h5-038',
    immuno,
    'Antibody identification',
    'case',
    'A patient has a documented historical anti-Jka, but the current screen is negative. Which laboratory principle remains important?',
    [
      'Previously identified clinically significant antibodies may fall below detection and still matter',
      'Kidd antibodies can become undetectable and reappear after renewed antigen exposure.',
    ],
    [
      [
        'A negative current screen erases every historical antibody',
        'Antibody history remains relevant despite current test sensitivity.',
      ],
      [
        'A historical antibody permanently changes Jka into an ABO antigen',
        'Blood-group system identity does not change in this way.',
      ],
      [
        'The history proves the present specimen is mislabeled',
        'Disappearance below detection is a recognized alternative.',
      ],
    ],
    'A current negative screen does not invalidate a documented significant antibody history.',
    207,
    '4.4 Testing for Antibodies',
  ),
  q(
    'ibb-h5-039',
    immuno,
    'Antibody identification',
    'case',
    'An antibody reacts with most adult red cells but weakly or not at all with cord red cells. Which antigen difference helps explain anti-I reactivity?',
    [
      'Adult cells predominantly express I while cord cells predominantly express i',
      'Developmental expression differs between adult and neonatal erythrocytes.',
    ],
    [
      [
        'Cord cells contain no blood-group antigens at all',
        'They express many antigens, although expression patterns differ.',
      ],
      [
        'All adult cells are group AB and all cord cells group O',
        'Age does not establish ABO phenotype.',
      ],
      [
        'Anti-I is defined by binding only to hemoglobin',
        'I is a red-cell surface antigen system, not free hemoglobin.',
      ],
    ],
    'Developmental antigen expression can help interpret antibody reaction patterns.',
    205,
    '4.4 Testing for Antibodies',
  ),
  q(
    'ibb-h5-040',
    immuno,
    'Antibody identification',
    'case',
    'Most reagent cells react at the antiglobulin phase, but the patient autocontrol is negative. Which possibility warrants investigation rather than assuming an autoantibody?',
    [
      'An alloantibody to a high-frequency antigen or multiple alloantibodies',
      'Broad reagent-cell reactivity can occur without reactivity against the patient own cells.',
    ],
    [
      [
        'A warm autoantibody proven solely by broad panel reactivity',
        'Broad panel reactivity alone does not prove self-reactivity.',
      ],
      [
        'Absence of any antibody because the autocontrol is negative',
        'An alloantibody can react with reagent cells while leaving the autocontrol negative.',
      ],
      [
        'An ABO genotype determined from panel strength alone',
        'An antibody panel does not establish the full ABO genotype.',
      ],
    ],
    'Use autocontrol and the full investigation to distinguish alloantibody from autoantibody patterns.',
    213,
    '4.5 Compatibility Testing',
  ),
];
