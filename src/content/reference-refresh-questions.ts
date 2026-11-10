import type { Question } from './types';

const references = {
  harr5: ['Medical Laboratory Science Review', '5th edition (Harr, 2019)'],
  harr4: ['Medical Laboratory Science Review', '4th edition (Harr, 2013)'],
  apollon: ['Apollon Reviewer', 'Edition not stated in supplied scan'],
  hubbard: ['A Concise Review of Clinical Laboratory Science', '2nd edition (Hubbard, 2010)'],
  rodak: [
    "Rodak's Hematology: Clinical Principles and Applications",
    '7th edition (Keohane et al., 2025)',
  ],
  strasinger: ['Urinalysis and Body Fluids', '7th edition (Strasinger and Di Lorenzo, 2021)'],
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

// Original scenarios from checked PDF-viewer pages; no publisher items are imported.
// Editorial objectives and overlap review: docs/CONTENT-REFRESH-2026-11-10.md.
export const referenceRefreshQuestions: Question[] = [
  item(
    'cc-n26-001',
    'chemistry',
    'Instrumentation',
    'case',
    'A chloride analyzer generates silver ions at a constant rate. The run ends when excess free silver ions first appear. Why does a specimen with more chloride require a longer titration?',
    [
      [
        'Chloride increases the light-path length.',
        'This is an electrochemical titration; its endpoint does not depend on an optical path.',
      ],
      [
        'More silver ions must be generated to precipitate the chloride.',
        'Silver reacts with chloride to form AgCl. At a constant generation rate, more chloride requires more charge and more time.',
      ],
      [
        'Chloride is converted to glucose before detection.',
        'No carbohydrate conversion is involved in coulometric chloride measurement.',
      ],
      [
        'The reference electrode consumes all plasma sodium first.',
        'The titration measures chloride through silver precipitation, not sodium consumption.',
      ],
    ],
    1,
    'In coulometric chloride analysis, generated charge at the endpoint reflects the amount of chloride titrated.',
    'harr5',
    296,
    'Clinical Chemistry: coulometric chloride measurement',
  ),
  item(
    'cc-n26-002',
    'chemistry',
    'Acid-base and electrolytes',
    'case',
    'For a teaching calculation, a solution freezes 0.558 degrees Celsius below pure water. Assume a depression of 1.86 degrees Celsius per Osm/kg. What osmolality does this represent?',
    [
      ['30 mOsm/kg', '0.558 / 1.86 equals 0.300 Osm/kg, which is 300 rather than 30 mOsm/kg.'],
      [
        '558 mOsm/kg',
        'The temperature difference must first be divided by the supplied cryoscopic constant.',
      ],
      ['300 mOsm/kg', '0.558 / 1.86 = 0.300 Osm/kg; multiplying by 1000 gives 300 mOsm/kg.'],
      [
        '1860 mOsm/kg',
        '1.86 is the temperature depression per Osm/kg, not the osmolality of this sample.',
      ],
    ],
    2,
    'Freezing-point depression depends on the number of dissolved particles; keep Osm/kg and mOsm/kg distinct.',
    'harr5',
    297,
    'Clinical Chemistry: freezing-point osmometry',
  ),
  item(
    'cc-n26-003',
    'chemistry',
    'Acid-base and electrolytes',
    'case',
    'A markedly lipemic specimen gives sodium 126 mmol/L by an indirect ISE method but 139 mmol/L by a direct ISE method. Measured osmolality is within the laboratory interval. Which analytical explanation best fits?',
    [
      [
        'The lipid fraction binds nearly all sodium into an insoluble precipitate.',
        'The principal indirect-ISE artifact is displacement of plasma water, not precipitation of sodium by lipids.',
      ],
      [
        'Direct ISE includes a larger specimen dilution than indirect ISE.',
        'Direct ISE measures the undiluted specimen; it is indirect ISE that uses dilution.',
      ],
      [
        'The patient necessarily has excess free water.',
        'The method discrepancy and normal measured osmolality support a measurement artifact rather than proving a water-balance disorder.',
      ],
      [
        'Lipid displacement of plasma water biased the diluted indirect measurement.',
        'Indirect ISE dilution assumes a usual plasma-water fraction. Marked lipid excess can produce pseudohyponatremia; direct ISE avoids this dilution effect.',
      ],
    ],
    3,
    'A sodium discrepancy between direct and indirect ISE can reflect an abnormal plasma-water fraction.',
    'harr5',
    329,
    'Clinical Chemistry: pseudohyponatremia and ISE dilution',
  ),
  item(
    'cc-n26-004',
    'chemistry',
    'Instrumentation',
    'case',
    'An HPLC method changes the proportion of organic solvent during a run. A trainee labels the run isocratic. Which correction is needed?',
    [
      [
        'Changing solvent composition makes this a gradient elution.',
        'Gradient elution varies mobile-phase composition during the run; isocratic elution holds it constant.',
      ],
      [
        'Any liquid mobile phase makes a run isocratic.',
        'Both isocratic and gradient HPLC use liquid mobile phases.',
      ],
      [
        'Isocratic means that the detector is switched off.',
        'The term describes mobile-phase composition, not detector operation.',
      ],
      [
        'A gradient is defined only by changing column length.',
        'Changing solvent proportions is sufficient to create a mobile-phase gradient.',
      ],
    ],
    0,
    'Distinguish a constant mobile-phase composition from a programmed solvent gradient.',
    'harr5',
    299,
    'Clinical Chemistry: HPLC elution modes',
  ),
  item(
    'cc-n26-005',
    'chemistry',
    'Carbohydrates',
    'case',
    'A glucose assay first uses hexokinase to form glucose-6-phosphate. A coupled dehydrogenase reaction then reduces NADP+. Which product provides the increasing ultraviolet absorbance signal?',
    [
      [
        'Ammonia',
        'Ammonia is not the reduced coenzyme produced by the coupled hexokinase glucose method.',
      ],
      [
        'NADPH',
        'Glucose-6-phosphate dehydrogenase produces NADPH, whose absorbance permits glucose quantitation.',
      ],
      [
        'Silver chloride',
        'Silver chloride precipitation belongs to chloride titration, not the hexokinase glucose reaction.',
      ],
      [
        'Bilirubin',
        'Bilirubin is not generated by this glucose assay and may instead interfere with some analytical systems.',
      ],
    ],
    1,
    'The hexokinase glucose method couples glucose phosphorylation to formation of reduced NADPH.',
    'hubbard',
    42,
    'Clinical Chemistry: methods of glucose analysis',
  ),
  item(
    'cc-n26-006',
    'chemistry',
    'Instrumentation',
    'case',
    'Two neutral analytes have similar size but differ in hydrophobicity. On a C18 reverse-phase column under unchanged mobile-phase conditions, which analyte would generally be retained longer?',
    [
      [
        'The more polar analyte, because C18 is strongly ionic.',
        'C18 is a nonpolar stationary phase, not a strongly ionic exchanger.',
      ],
      [
        'Both must have identical retention because their sizes match.',
        'Reverse-phase retention depends strongly on partitioning and hydrophobicity, not size alone.',
      ],
      [
        'The more hydrophobic analyte.',
        'A more hydrophobic neutral solute generally interacts more strongly with the nonpolar C18 stationary phase.',
      ],
      [
        'Whichever analyte has the higher starting concentration, regardless of chemistry.',
        'Within appropriate loading conditions, concentration alone does not determine the order of retention.',
      ],
    ],
    2,
    'In reverse-phase HPLC, nonpolar solutes generally interact more strongly with a nonpolar stationary phase.',
    'harr5',
    299,
    'Clinical Chemistry: reverse-phase HPLC partitioning',
  ),
  item(
    'ibb-n26-001',
    'immunoserology-blood-banking',
    'Immune cells and complement',
    'case',
    'An antigen-presenting cell displays a processed peptide to a CD4-positive helper T cell. Which class of presentation molecule normally supplies this interaction?',
    [
      [
        'MHC class I',
        'Class I presentation is primarily associated with recognition by CD8-positive cytotoxic T cells.',
      ],
      [
        'Soluble IgM',
        'IgM can bind antigen but is not the MHC presentation molecule used in this helper-T-cell interaction.',
      ],
      [
        'MHC class III',
        'Class III includes certain complement proteins; it is not the peptide-presentation class recognized by CD4 helper T cells.',
      ],
      [
        'MHC class II',
        'CD4-positive helper T cells recognize processed peptides presented in association with class II molecules.',
      ],
    ],
    3,
    'Relate CD4 helper-T-cell recognition to MHC class II peptide presentation.',
    'harr5',
    134,
    'Immunology: MHC and T-cell recognition',
  ),
  item(
    'ibb-n26-002',
    'immunoserology-blood-banking',
    'Immune cells and complement',
    'case',
    'A complement investigation focuses on factor B. Which pathway is being examined most directly through this component?',
    [
      [
        'The alternative complement pathway',
        'Factor B is a characteristic component of the alternative pathway.',
      ],
      [
        'The lectin complement pathway through mannose-binding lectin',
        'Mannose-binding lectin initiates the lectin pathway; factor B belongs to the alternative pathway.',
      ],
      [
        'The terminal membrane-attack complex alone',
        'The terminal complex uses C5b through C9; factor B acts upstream in the alternative pathway.',
      ],
      [
        'The classical complement pathway through C1 alone',
        'C1 initiates the classical pathway; factor B belongs to the alternative pathway.',
      ],
    ],
    0,
    'Complement pathways share terminal components but have distinct upstream components.',
    'harr5',
    134,
    'Immunology: complement factor B',
  ),
  item(
    'ibb-n26-003',
    'immunoserology-blood-banking',
    'Serologic methods',
    'case',
    'In a historical complement-fixation assay, controls are valid and the sensitized indicator red cells undergo complete hemolysis. What does this indicate about the test reaction?',
    [
      [
        'Specific patient antibody necessarily fixed all available complement.',
        'If complement had been consumed by the specific antigen-antibody reaction, it would not remain to lyse the indicator cells.',
      ],
      [
        'The test is negative because complement remained available for the indicator system.',
        'Hemolysis shows that complement was not fixed in the patient test reaction and remained available to lyse sensitized indicator cells.',
      ],
      [
        'The patient must have an ABO-incompatible transfusion.',
        'This is an in-vitro indicator system and does not establish a transfusion reaction.',
      ],
      [
        'The result confirms that the patient lacks all circulating complement proteins.',
        'The test uses a standardized complement reagent and cannot establish complete complement deficiency in the patient.',
      ],
    ],
    1,
    'In complement fixation, the indicator signal is inverse: hemolysis indicates a negative test when controls are valid.',
    'harr5',
    141,
    'Immunology: complement-fixation indicator system',
  ),
  item(
    'ibb-n26-004',
    'immunoserology-blood-banking',
    'Antibody identification',
    'case',
    'A red-cell suspension shows coin-stack formation in protein-rich plasma. The stacks disperse after a validated saline-replacement procedure. Which mechanism is supported?',
    [
      [
        'An ABO mixed-field reaction caused by two red-cell populations',
        'Saline-dispersible protein-associated stacks are not evidence of two antigenically distinct red-cell populations.',
      ],
      [
        'Fibrin strands from an incompletely clotted specimen',
        'Fibrin can trap cells but does not produce the characteristic reversible coin-stack arrangement described here.',
      ],
      [
        'Rouleaux caused by the surrounding protein environment',
        'Rouleaux is protein-associated stacking that can disperse when plasma is replaced with saline.',
      ],
      [
        'Definitive identification of anti-Jka',
        'This behavior does not establish the specificity of an alloantibody.',
      ],
    ],
    2,
    'Protein-associated rouleaux can mimic agglutination; a validated saline-replacement technique helps distinguish it.',
    'harr5',
    217,
    'Blood Bank: rouleaux and saline replacement',
  ),
  item(
    'ibb-n26-005',
    'immunoserology-blood-banking',
    'Immune cells and complement',
    'case',
    'A teaching model separates lymphocyte maturation from the later response to antigen in lymph nodes. Which organ should be assigned to the maturation of T lymphocytes?',
    [
      [
        'Spleen',
        'The spleen is a secondary lymphoid organ involved in responses to blood-borne antigens.',
      ],
      [
        'Peripheral lymph node',
        'Lymph nodes support antigen-driven responses rather than the primary maturation of T cells.',
      ],
      [
        'Thyroid gland',
        'The thyroid is an endocrine gland, not the primary site of T-cell maturation.',
      ],
      ['Thymus', 'The thymus provides the primary lymphoid environment for T-cell maturation.'],
    ],
    3,
    'Distinguish the thymus as a primary T-cell maturation site from secondary lymphoid organs.',
    'apollon',
    39,
    'Immunology-Serology: lymphoid organs',
  ),
  item(
    'ibb-n26-006',
    'immunoserology-blood-banking',
    'Immunoglobulins',
    'case',
    'An experiment measures the strength of binding between one antibody binding site and one antigenic determinant, without combining multiple binding interactions. Which property is being measured?',
    [
      [
        'Affinity',
        'Affinity describes the strength of an individual antigen-binding-site interaction.',
      ],
      [
        'Titer',
        'Titer describes an endpoint dilution, not the strength of a single molecular binding interaction.',
      ],
      [
        'Valence',
        'Valence refers to the number of available binding sites rather than their individual binding strength.',
      ],
      [
        'Avidity',
        'Avidity describes the combined strength of multiple interactions in a multivalent system.',
      ],
    ],
    0,
    'Affinity concerns an individual binding interaction; avidity concerns the combined multivalent interaction.',
    'apollon',
    39,
    'Immunology-Serology: antigen-antibody binding strength',
  ),
  item(
    'ubf-n26-001',
    'urine-body-fluids',
    'Urine chemistry',
    'case',
    'Urine from a patient with confirmed alkaptonuria becomes dark on standing. Which accumulated metabolite is responsible for this oxidation-related finding?',
    [
      [
        'Urea',
        'Urea does not account for the characteristic darkening caused by accumulated homogentisic acid.',
      ],
      [
        'Homogentisic acid',
        'A defect in homogentisate metabolism leads to its accumulation; oxidation promotes dark pigment formation.',
      ],
      [
        'Glucose-6-phosphate',
        'This intracellular carbohydrate intermediate is not the characteristic accumulated metabolite of alkaptonuria.',
      ],
      [
        'Creatinine alone',
        'Creatinine is normally present in urine and does not explain this characteristic metabolic pigment change.',
      ],
    ],
    1,
    'Alkaptonuria involves homogentisic acid accumulation; dark urine alone still requires investigation of other causes.',
    'strasinger',
    264,
    'Urine Screening for Metabolic Disorders: alkaptonuria',
  ),
  item(
    'ubf-n26-002',
    'urine-body-fluids',
    'Urine chemistry',
    'case',
    'A metabolic laboratory investigates abnormal branched-chain amino acid breakdown in a child with maple syrup urine disease. Which amino acid group is directly involved?',
    [
      [
        'Glycine, alanine, and serine',
        'These are not the three branched-chain amino acids involved in maple syrup urine disease.',
      ],
      [
        'Cystine, arginine, and ornithine',
        'This grouping points toward amino acid transport considerations rather than the branched-chain defect.',
      ],
      [
        'Leucine, isoleucine, and valine',
        'These branched-chain amino acids and their corresponding keto acids accumulate when their oxidative breakdown is impaired.',
      ],
      [
        'Phenylalanine, tyrosine, and tryptophan',
        'These aromatic amino acids are distinct from the branched-chain group.',
      ],
    ],
    2,
    'Maple syrup urine disease concerns branched-chain amino acid metabolism; odor is only a clue, not confirmation.',
    'strasinger',
    265,
    'Urine Screening for Metabolic Disorders: branched-chain amino acids',
  ),
  item(
    'ubf-n26-003',
    'urine-body-fluids',
    'Urine chemistry',
    'recall',
    'When urinary 5-hydroxyindoleacetic acid is measured, the laboratory is assessing a major degradation product of which signaling molecule?',
    [
      [
        'Insulin',
        'Insulin is a peptide hormone and is not degraded to 5-hydroxyindoleacetic acid.',
      ],
      [
        'Cortisol',
        'Cortisol metabolism produces steroid metabolites rather than this indole compound.',
      ],
      [
        'Acetylcholine',
        'Acetylcholine is broken down to choline and acetate, not 5-hydroxyindoleacetic acid.',
      ],
      [
        'Serotonin',
        '5-HIAA is a major metabolite of serotonin, linking the urine measurement to serotonin turnover.',
      ],
    ],
    3,
    '5-HIAA is a serotonin metabolite; collection conditions and assay-specific interferences affect interpretation.',
    'strasinger',
    266,
    'Urine Screening for Metabolic Disorders: 5-HIAA',
  ),
  item(
    'ubf-n26-004',
    'urine-body-fluids',
    'Urine chemistry',
    'case',
    'An inherited disorder causes urinary loss of cystine with lysine, arginine, and ornithine because proximal tubular reabsorption is impaired. Which mechanism distinguishes this from cystinosis?',
    [
      [
        'A renal amino acid transport defect rather than lysosomal cystine accumulation',
        'Cystinuria primarily affects transport of filtered amino acids; cystinosis involves intracellular lysosomal cystine accumulation.',
      ],
      [
        'Excess bilirubin conjugation rather than amino acid transport',
        'Bilirubin conjugation does not explain the stated amino acid loss.',
      ],
      [
        'Complete absence of glomerular filtration',
        'Filtered amino acids are reaching urine; the stated defect lies in their reabsorption.',
      ],
      [
        'Production of anti-cystine antibodies',
        'Cystinuria is an inherited transport disorder, not an antibody-mediated mechanism.',
      ],
    ],
    0,
    'Cystinuria and cystinosis can both involve cystine but have different underlying cellular mechanisms.',
    'strasinger',
    267,
    'Urine Screening for Metabolic Disorders: cystinuria versus cystinosis',
  ),
  item(
    'ubf-n26-005',
    'urine-body-fluids',
    'Urine chemistry',
    'recall',
    'Which pair of urinary heme precursors is classically increased during an acute attack of acute intermittent porphyria?',
    [
      [
        'Glucose and galactose',
        'These reducing sugars belong to carbohydrate metabolism, not the characteristic heme-precursor pattern.',
      ],
      [
        'Aminolevulinic acid and porphobilinogen',
        'The pathway block in acute intermittent porphyria permits accumulation of ALA and porphobilinogen.',
      ],
      [
        'Urea and creatinine',
        'These routine nitrogenous analytes do not identify the characteristic porphyria pathway block.',
      ],
      [
        'Bilirubin and urobilinogen only',
        'These are heme breakdown products rather than the early synthetic precursors asked for here.',
      ],
    ],
    1,
    'Match a suspected heme-synthesis disorder to the relevant precursors rather than to heme breakdown products.',
    'strasinger',
    270,
    'Urine Screening for Metabolic Disorders: common porphyrias',
  ),
  item(
    'ubf-n26-006',
    'urine-body-fluids',
    'Urine chemistry',
    'case',
    'An investigation finds a positive urine copper-reduction reaction but a negative glucose-oxidase strip. Quality controls pass and interference has been assessed. Which conclusion is justified before identifying the substance?',
    [
      [
        'The sample must contain only glucose.',
        'Copper reduction is less specific than glucose oxidase and can respond to other reducing substances.',
      ],
      [
        'The patient has a confirmed diagnosis of galactosemia.',
        'This pattern alone neither identifies the reducing substance nor confirms a metabolic diagnosis.',
      ],
      [
        'A nonglucose reducing substance, such as galactose, may be present.',
        'A reducing sugar other than glucose can reduce copper while failing to react on a glucose-specific strip; further identification is needed.',
      ],
      [
        'Both methods detect exactly the same chemical group.',
        'The methods have different selectivity, which explains why their results can disagree.',
      ],
    ],
    2,
    'A copper-reduction result is not a glucose-specific measurement or a standalone diagnosis of a metabolic disorder.',
    'strasinger',
    272,
    'Urine Screening for Metabolic Disorders: carbohydrate disorders',
  ),
  item(
    'micro-n26-001',
    'microbiology',
    'Bacteriology',
    'case',
    'At the validated reading time, a TSI tube has a red slant and yellow butt without blackening. Which carbohydrate-use pattern best explains these observations?',
    [
      [
        'No carbohydrate fermentation occurred.',
        'The acid yellow butt indicates fermentation rather than complete absence of carbohydrate use.',
      ],
      [
        'Lactose fermentation occurred without glucose use.',
        'A red slant with an acid butt does not support this interpretation in TSI.',
      ],
      [
        'Hydrogen sulfide production alone caused the yellow butt.',
        'Hydrogen sulfide is detected by blackening; it does not itself explain the acid yellow reaction.',
      ],
      [
        'Glucose was fermented, but lactose and sucrose were not.',
        'A glucose-only fermenter can retain an acid butt while the aerobic slant reverts to an alkaline red reaction.',
      ],
    ],
    3,
    'Read the slant and butt together and use the validated incubation interval when interpreting TSI.',
    'hubbard',
    283,
    'Clinical Microbiology: triple sugar iron agar',
  ),
  item(
    'micro-n26-002',
    'microbiology',
    'Bacteriology',
    'case',
    'A nitrate broth remains colorless after the nitrite-detection reagents. It turns red only after zinc is added. With valid controls, how should nitrate reduction by the organism be interpreted?',
    [
      [
        'Negative: unreduced nitrate remained for zinc to reduce chemically.',
        'Zinc converts residual nitrate to nitrite; the subsequent red color shows nitrate had not been reduced by the organism.',
      ],
      [
        'Positive: zinc proves that the organism produced all the nitrite.',
        'Nitrite formed only after adding zinc, so it cannot be attributed to bacterial reduction in this test.',
      ],
      [
        'Positive: all nitrate had already become nitrogen gas.',
        'If no nitrate remained, zinc would not generate the red nitrite reaction.',
      ],
      [
        'Invalid solely because nitrate broth was used.',
        'Nitrate broth is appropriate; with valid controls, the zinc step resolves the initial colorless reaction.',
      ],
    ],
    0,
    'A red color after zinc means residual nitrate was reduced chemically, making the bacterial nitrate-reduction result negative.',
    'hubbard',
    284,
    'Clinical Microbiology: nitrate reduction and zinc',
  ),
  item(
    'micro-n26-003',
    'microbiology',
    'Bacteriology',
    'case',
    'A urease medium becomes bright pink after inoculation, while its uninoculated control remains unchanged. Which chemical change accounts for the positive reaction?',
    [
      [
        'Glucose fermentation lowers the pH.',
        'Glucose-associated acidification would not explain the alkaline pink urease reaction.',
      ],
      [
        'Urea hydrolysis generates ammonia and raises the pH.',
        'Urease releases ammonia from urea, creating an alkaline reaction detected by the phenol-red indicator.',
      ],
      [
        'Tryptophanase produces indole.',
        'Indole production is detected by a different substrate and reagent system.',
      ],
      [
        'Ferric ions precipitate as silver chloride.',
        'Neither silver precipitation nor chloride titration is the urease test principle.',
      ],
    ],
    1,
    'Urease detection relies on alkalinization after ammonia is generated from urea.',
    'hubbard',
    284,
    'Clinical Microbiology: urea hydrolysis',
  ),
  item(
    'micro-n26-004',
    'microbiology',
    'Bacteriology',
    'case',
    'A bacterial isolate rapidly oxidizes an oxidase reagent within its specified reading interval. Which respiratory-system activity does the test support?',
    [
      [
        'Hydrolysis of urea by urease',
        'The urease test detects alkalinization after urea hydrolysis rather than oxidase-reagent oxidation.',
      ],
      [
        'Conversion of nitrate to nitrite only',
        'Nitrate reduction requires its own substrate and detection system.',
      ],
      [
        'Cytochrome c oxidase activity',
        'The oxidase reagent acts as an artificial electron donor in a system associated with cytochrome c oxidase.',
      ],
      [
        'Release of free coagulase',
        'Coagulase testing evaluates plasma clot formation, not this respiratory enzyme system.',
      ],
    ],
    2,
    'An oxidase result reflects a respiratory enzyme system and should be combined with the rest of the identification scheme.',
    'hubbard',
    284,
    'Clinical Microbiology: oxidase test principle',
  ),
  item(
    'micro-n26-005',
    'microbiology',
    'Bacteriology',
    'case',
    'A laboratory trainee needs to distinguish beta hemolysis from an alpha reaction on blood agar. Which observation best supports beta hemolysis?',
    [
      [
        'A greenish zone without complete clearing',
        'Greenish partial alteration of red cells is the usual alpha-hemolytic appearance.',
      ],
      [
        'No change in the agar around the colony',
        'An unchanged background is a nonhemolytic reaction.',
      ],
      [
        'A positive oxidase reagent on filter paper',
        'Oxidase detects a different biochemical property and does not establish the hemolysis pattern.',
      ],
      [
        'A clear zone caused by complete red-cell lysis around the colony',
        'Beta hemolysis denotes complete lysis, producing a clear zone in the blood-containing medium.',
      ],
    ],
    3,
    'Describe the observed hemolysis pattern before assigning an organism identity.',
    'hubbard',
    269,
    'Clinical Microbiology: hemolysis patterns',
  ),
  item(
    'micro-n26-006',
    'microbiology',
    'Virology',
    'case',
    'A teaching laboratory compares bacterial growth in cell-free broth with viral propagation. Why does simply adding more nutrients to the same cell-free broth fail to permit ordinary human viruses to multiply?',
    [
      [
        'Viral replication requires living host-cell machinery.',
        'Human viruses depend on living cells for the machinery and functions required for replication.',
      ],
      [
        'All viruses are killed by liquid water.',
        'Viruses can remain infectious in aqueous environments; water is not the explanation for the replication requirement.',
      ],
      [
        'Viruses reproduce only by bacterial binary fission.',
        'Viral replication involves genome replication and particle assembly rather than bacterial binary fission.',
      ],
      [
        'Every human virus has a peptidoglycan cell wall.',
        'Viruses do not have bacterial peptidoglycan walls.',
      ],
    ],
    0,
    'A nutrient medium alone does not replace the living host cells required for viral propagation.',
    'hubbard',
    326,
    'Clinical Parasitology, Mycology, and Virology: viral replication',
  ),
  item(
    'para-n26-001',
    'parasitology',
    'Intestinal protozoa',
    'case',
    'A fresh stool wet mount contains a very large motile protozoan covered with short cilia. Which organism group best fits this feature among the choices?',
    [
      [
        'Giardia duodenalis',
        'Giardia trophozoites use flagella and do not have a surface covered with cilia.',
      ],
      [
        'Balantidium coli',
        'Balantidium coli is a large ciliated intestinal protozoan; it is also called Balantioides coli in some literature.',
      ],
      ['Entamoeba histolytica', 'Entamoeba trophozoites move with pseudopods rather than cilia.'],
      [
        'Cryptosporidium species',
        'Cryptosporidium is identified by small oocysts and other directed methods, not a large ciliated trophozoite.',
      ],
    ],
    1,
    'Cilia provide a strong differentiating feature for Balantidium among the common intestinal protozoa.',
    'hubbard',
    312,
    'Clinical Parasitology: ciliated protozoa',
  ),
  item(
    'para-n26-002',
    'parasitology',
    'Nematodes',
    'case',
    'A stool specimen contains barrel-shaped eggs approximately 50 micrometers long with conspicuous plugs at both poles. Which nematode is most consistent with this combination?',
    [
      [
        'Enterobius vermicularis',
        'Enterobius eggs are characteristically flattened on one side rather than bearing two prominent polar plugs.',
      ],
      [
        'Ascaris lumbricoides',
        'Typical fertilized Ascaris eggs have a thick shell with a mammillated outer coat, not this bipolar-plug pattern.',
      ],
      [
        'Trichuris trichiura',
        'Whipworm eggs classically have a barrel or lemon shape and plugs at both poles.',
      ],
      [
        'Necator americanus',
        'Hookworm eggs are thin-shelled and contain a developing segmented embryo without these polar plugs.',
      ],
    ],
    2,
    'Use egg shape, size, shell, and polar structures together for identification.',
    'hubbard',
    315,
    'Clinical Parasitology: Trichuris egg morphology',
  ),
  item(
    'para-n26-003',
    'parasitology',
    'Cestodes',
    'case',
    "A confirmed broad fish tapeworm infection is being considered as a contributor to a patient's megaloblastic anemia. Which nutrient can the worm compete for in the intestine?",
    [
      [
        'Vitamin C',
        'Vitamin C competition is not the characteristic mechanism linking broad fish tapeworm to megaloblastic anemia.',
      ],
      [
        'Vitamin K',
        'Vitamin K deficiency primarily affects coagulation rather than explaining this characteristic megaloblastic association.',
      ],
      [
        'Sodium',
        'Sodium competition does not explain the megaloblastic anemia associated with this parasite.',
      ],
      [
        'Vitamin B12',
        'The broad fish tapeworm can absorb vitamin B12 from the host and contribute to deficiency in some infections.',
      ],
    ],
    3,
    'Dibothriocephalus latus, called Diphyllobothrium latum in the cited edition, can contribute to vitamin B12 deficiency.',
    'hubbard',
    313,
    'Clinical Parasitology: broad fish tapeworm and vitamin B12',
  ),
  item(
    'para-n26-004',
    'parasitology',
    'Blood parasites',
    'case',
    'A well-stained blood film shows a sheathed microfilaria with a tapered tail whose tip contains no nuclei. Which organism is favored among these choices?',
    [
      [
        'Wuchereria bancrofti',
        'Its microfilariae are sheathed and have a nuclear column that does not extend into the tail tip.',
      ],
      ['Loa loa', 'Loa loa is sheathed, but its nuclei extend continuously to the tail tip.'],
      [
        'Brugia malayi',
        'Brugia malayi is sheathed and characteristically has distinct terminal and subterminal tail nuclei.',
      ],
      [
        'Mansonella ozzardi',
        'Mansonella ozzardi lacks terminal tail nuclei but is unsheathed, unlike the described organism.',
      ],
    ],
    0,
    'Combine sheath presence and tail-nucleus distribution when differentiating blood microfilariae.',
    'hubbard',
    316,
    'Clinical Parasitology: microfilarial morphology',
  ),
  item(
    'para-n26-005',
    'parasitology',
    'Intestinal protozoa',
    'case',
    'A mature intestinal amebic cyst has eight nuclei with coarse peripheral chromatin and eccentric karyosomes. Which identification is best supported among these choices?',
    [
      [
        'Entamoeba histolytica/dispar',
        'Mature cysts usually have four nuclei with finer peripheral chromatin, not the described eight-nucleus pattern.',
      ],
      [
        'Entamoeba coli',
        'Mature Entamoeba coli cysts typically have eight nuclei, coarse peripheral chromatin, and eccentric karyosomes.',
      ],
      [
        'Endolimax nana',
        'Mature cysts usually have four nuclei with prominent karyosomes and no peripheral chromatin.',
      ],
      [
        'Iodamoeba buetschlii',
        'Its cyst usually has one nucleus and a prominent glycogen vacuole.',
      ],
    ],
    1,
    'Nuclear number and chromatin pattern help distinguish intestinal amebic cysts; Entamoeba coli is distinct from the bacterium Escherichia coli.',
    'hubbard',
    310,
    'Clinical Parasitology: Figure 8-1, intestinal amebic cysts',
  ),
  item(
    'para-n26-006',
    'parasitology',
    'Nematodes',
    'case',
    'A tissue biopsy from a patient exposed to inadequately cooked meat shows coiled nematode larvae encysted in striated muscle. Which parasite best matches this tissue stage?',
    [
      [
        'Trichuris trichiura',
        'Whipworm adults inhabit the intestine; encysted larvae in striated muscle are not its characteristic tissue stage.',
      ],
      [
        'Enterobius vermicularis',
        'Pinworm infection is associated with intestinal adults and perianal eggs, not encysted muscle larvae.',
      ],
      [
        'Trichinella spiralis',
        'Trichinella larvae disseminate to striated muscle and encyst, linking meat exposure with the biopsy finding.',
      ],
      [
        'Wuchereria bancrofti',
        'Wuchereria adults inhabit lymphatics and release blood microfilariae rather than producing this muscle cyst stage.',
      ],
    ],
    2,
    'Tissue site and parasite stage help distinguish Trichinella from intestinal and lymphatic nematodes.',
    'hubbard',
    315,
    'Clinical Parasitology: Trichinella muscle larvae',
  ),
  item(
    'hema-n26-001',
    'hematology',
    'Anemias',
    'case',
    'A molecular report describes the classic hemoglobin S substitution at beta-chain position 6. Which amino acid change should the report identify?',
    [
      [
        'Valine replaced by glutamic acid',
        'This reverses the direction of the classic Hb S substitution.',
      ],
      [
        'Glutamic acid replaced by lysine',
        'A beta-6 glutamic-acid-to-lysine substitution characterizes Hb C, not Hb S.',
      ],
      [
        'Complete deletion of every alpha-globin gene',
        'Alpha-globin deletion is a thalassemia mechanism rather than the Hb S point substitution.',
      ],
      [
        'Glutamic acid replaced by valine',
        'Classic Hb S has valine instead of glutamic acid at beta-chain position 6.',
      ],
    ],
    3,
    'Distinguish the specific structural substitution in Hb S from Hb C and globin-chain production defects.',
    'rodak',
    428,
    'Hemoglobinopathies: hemoglobin S molecular substitution',
  ),
  item(
    'hema-n26-002',
    'hematology',
    'Anemias',
    'case',
    'In G6PD-deficient red cells exposed to oxidative stress, why does reduced NADPH availability promote hemoglobin precipitation?',
    [
      [
        'The cells cannot adequately maintain reduced glutathione to detoxify oxidants.',
        'NADPH supports glutathione reduction. Impaired oxidant protection allows hemoglobin denaturation and Heinz-body formation.',
      ],
      [
        'Reduced NADPH directly decreases spectrin synthesis in mature red cells.',
        'The stated oxidative defect concerns glutathione recycling, not synthesis of the membrane skeleton by mature red cells.',
      ],
      [
        'Reduced NADPH is the primary cause of deficient beta-globin production.',
        'Deficient beta-globin production is a thalassemia mechanism, distinct from impaired oxidant protection.',
      ],
      [
        'Reduced NADPH prevents intrinsic-factor binding of vitamin B12.',
        'Intrinsic-factor binding is a gastrointestinal absorption step, not the red-cell antioxidant mechanism.',
      ],
    ],
    0,
    'The G6PD-NADPH-glutathione pathway protects red cells from oxidative damage.',
    'rodak',
    386,
    'Red Cell Enzyme Defects: G6PD and oxidative protection',
  ),
  item(
    'hema-n26-003',
    'hematology',
    'Anemias',
    'case',
    'In an osmotic-fragility investigation, a red-cell population lyses at a higher saline concentration than the normal comparison cells. What does this imply about that population?',
    [
      [
        'It has decreased osmotic fragility because it tolerates more water entry.',
        'Lysis in a less hypotonic solution means reduced tolerance of swelling, not increased tolerance.',
      ],
      [
        'It has increased osmotic fragility, as can occur with spherocytes.',
        'Spherocytes have less membrane surface area relative to volume and reach their swelling limit sooner.',
      ],
      [
        'It cannot take up water by osmosis.',
        'Osmotic water entry is precisely what causes lysis in this test.',
      ],
      [
        'It necessarily has a specific ABO blood group.',
        'Osmotic fragility does not identify an ABO phenotype.',
      ],
    ],
    1,
    'Increased osmotic fragility means lysis occurs in a less hypotonic solution; it is not specific for one diagnosis.',
    'rodak',
    373,
    'Red Cell Membrane Defects: osmotic fragility',
  ),
  item(
    'hema-n26-004',
    'hematology',
    'Anemias',
    'case',
    'Flow cytometry in a suspected paroxysmal nocturnal hemoglobinuria workup shows loss of GPI-linked CD55 and CD59 on a red-cell population. Which consequence follows from loss of these protective proteins?',
    [
      [
        'Resistance to all complement-mediated damage',
        'Loss of these protective proteins increases rather than eliminates complement susceptibility.',
      ],
      [
        'Failure of ABO carbohydrate synthesis alone',
        'The central consequence is impaired complement regulation, not isolated loss of ABO carbohydrate production.',
      ],
      [
        'Increased susceptibility to complement-mediated red-cell lysis',
        'Loss of GPI-linked complement-regulatory proteins leaves affected red cells vulnerable to complement-mediated hemolysis.',
      ],
      [
        'Conversion of every red cell into a nucleated precursor',
        'GPI-anchor loss does not reverse red-cell maturation.',
      ],
    ],
    2,
    'PNH involves loss of GPI-linked proteins, including complement-regulatory CD55 and CD59.',
    'rodak',
    333,
    'Bone Marrow Failure: PNH and GPI-linked proteins',
  ),
  item(
    'hema-n26-005',
    'hematology',
    'Leukocyte disorders',
    'case',
    'A CBC reports WBC 3.0 x 10^9/L and a combined neutrophil fraction of 40%. What is the absolute neutrophil count?',
    [
      ['0.12 x 10^9/L', 'Using 0.04 rather than 0.40 introduces a tenfold error.'],
      ['3.40 x 10^9/L', 'The fraction must be multiplied by the WBC count rather than added.'],
      ['7.5 x 10^9/L', 'Dividing by 0.40 reverses the required calculation.'],
      ['1.2 x 10^9/L', '3.0 x 0.40 = 1.2 x 10^9/L.'],
    ],
    3,
    'An absolute differential count is the total WBC count multiplied by the relevant cell fraction.',
    'rodak',
    253,
    'Peripheral Blood Film and CBC: absolute differential counts',
  ),
  item(
    'hema-n26-006',
    'hematology',
    'Anemias',
    'case',
    'A patient with an inflammatory disorder has low serum iron despite preserved iron stores. Which hepcidin-related mechanism can account for this mismatch?',
    [
      [
        'Increased hepcidin reduces iron absorption and limits release of stored iron.',
        'Inflammation can raise hepcidin, reducing iron availability to developing red cells despite iron remaining in storage cells.',
      ],
      [
        'Decreased hepcidin blocks intestinal iron absorption.',
        'It is increased hepcidin that restrains iron absorption and export in the stated inflammatory mechanism.',
      ],
      [
        'Increased hepcidin necessarily empties all iron stores into plasma.',
        'Increased hepcidin favors iron sequestration rather than unrestricted export to plasma.',
      ],
      [
        'Inflammation always proves that dietary iron intake is zero.',
        'Inflammatory iron restriction can occur despite adequate intake and storage.',
      ],
    ],
    0,
    'Anemia of inflammation can reflect restricted iron availability rather than complete depletion of body iron.',
    'rodak',
    306,
    'Disorders of Iron Metabolism: anemia of inflammation',
  ),
  item(
    'lm-n26-001',
    'histopathology-lab-management-laws',
    'Laboratory safety',
    'case',
    'An approved procedure requires diluting concentrated acid with water. Which approach best limits the risk of sudden boiling and splashing from localized heat?',
    [
      [
        'Pour water rapidly into the concentrated acid.',
        'Water added to concentrated acid can heat abruptly and cause dangerous splashing.',
      ],
      [
        'Add acid slowly to water with appropriate mixing, cooling, and protective equipment.',
        'Adding acid to the larger water volume helps distribute the heat of dilution; the chemical-specific procedure still governs handling.',
      ],
      [
        'Seal the vessel tightly before adding either liquid.',
        'A sealed vessel can trap heat and pressure and does not provide safe control of dilution.',
      ],
      [
        'Use the reaction vessel without eye protection.',
        'Eye and face protection appropriate to the procedure remain necessary.',
      ],
    ],
    1,
    'Acid dilution is exothermic: add acid to water using the approved chemical-specific controls.',
    'apollon',
    64,
    'Supervision and Management: chemical safety',
  ),
  item(
    'lm-n26-002',
    'histopathology-lab-management-laws',
    'Laboratory safety',
    'case',
    'A specimen arrives without a documented infectious diagnosis. A trainee proposes relaxing the normal specimen-handling precautions. What is the best response?',
    [
      [
        'Use precautions only after a positive culture.',
        'Waiting for culture confirmation leaves the initial handling period unprotected.',
      ],
      [
        'Judge infectious risk solely by whether the specimen looks clear.',
        'Visual clarity cannot establish that a specimen is free of infectious agents.',
      ],
      [
        'Maintain routine precautions and apply the procedure-specific risk assessment.',
        'The absence of a known diagnosis does not establish that a specimen is noninfectious; handling controls follow the task and risk assessment.',
      ],
      [
        'Remove gloves whenever the request lacks a warning label.',
        'A missing warning label does not justify abandoning the required handling controls.',
      ],
    ],
    2,
    'Unknown infectious status is not evidence of safety; specimen-handling precautions depend on the work and its assessed risks.',
    'apollon',
    64,
    'Supervision and Management: potentially infectious specimens',
  ),
  item(
    'lm-n26-003',
    'histopathology-lab-management-laws',
    'Laboratory safety',
    'case',
    'During a practical assessment, a student proposes drawing a liquid into a glass pipette by mouth. Which substitute should the assessor require?',
    [
      [
        'Mouth suction only if the liquid is colorless',
        'Color does not establish that a liquid is safe for oral aspiration.',
      ],
      [
        'Mouth suction only when a colleague watches',
        'Observation does not remove the ingestion and exposure hazard.',
      ],
      [
        'Direct suction through a specimen tube',
        'Changing the vessel does not eliminate the hazard of oral suction.',
      ],
      [
        'An appropriate mechanical pipetting device',
        'Mechanical pipetting avoids oral suction; the device and technique must be suitable for the material and procedure.',
      ],
    ],
    3,
    'Mechanical pipetting devices replace mouth pipetting for laboratory liquid handling.',
    'apollon',
    64,
    'Supervision and Management: pipetting safety',
  ),
  item(
    'lm-n26-004',
    'histopathology-lab-management-laws',
    'Standards and calibration',
    'case',
    'A laboratory prepares a reference solution by accurately weighing a highly pure, stable substance of known composition. Which property supports using that substance as a primary standard?',
    [
      [
        'Its composition and purity permit the amount of substance to be established reliably.',
        'A primary standard must have a well-defined composition and adequate purity and stability for accurate preparation.',
      ],
      [
        'It produces any color even if its composition is unknown.',
        'A visible signal cannot compensate for an unknown amount or composition.',
      ],
      [
        'It has the same patient identification as a clinical specimen.',
        'Patient identification does not establish chemical purity or assigned concentration.',
      ],
      [
        'It can replace every independent quality-control material.',
        'A primary standard does not eliminate the need for independent controls and other quality checks.',
      ],
    ],
    0,
    'A primary standard is defined by its suitability for establishing an amount from a pure, stable substance.',
    'apollon',
    65,
    'Supervision and Management: primary standards',
  ),
  item(
    'lm-n26-005',
    'histopathology-lab-management-laws',
    'Laboratory statistics',
    'case',
    'For a theoretical Gaussian control distribution with a stable mean and SD, approximately what fraction of individual results lies outside the interval from mean minus 2 SD to mean plus 2 SD?',
    [
      ['About 32%', 'About 32% lies outside plus or minus 1 SD, not plus or minus 2 SD.'],
      [
        'About 5%',
        'About 95% lies within plus or minus 2 SD, leaving approximately 5% across both tails.',
      ],
      [
        'About 50%',
        'Half the results lie on either side of the mean, not outside this two-sided interval.',
      ],
      ['Exactly 0%', 'A Gaussian distribution has tails beyond any finite SD interval.'],
    ],
    1,
    'Statistical control limits have an expected chance of exceedance even in a stable process; interpret them within the laboratory QC plan.',
    'harr4',
    244,
    'Clinical Chemistry: Gaussian distribution and quality-control limits',
  ),
  item(
    'lm-n26-006',
    'histopathology-lab-management-laws',
    'Quality assessment',
    'case',
    'Within a single analytical run, one control is at +2.4 SD and another is at -2.3 SD relative to their respective targets. Which multirule observation is present?',
    [
      [
        'A gradual trend established over six days',
        'These two same-run observations do not establish a sequence over six days.',
      ],
      [
        'Two consecutive results beyond +2 SD on the same side',
        'The two results are on opposite sides of their respective targets.',
      ],
      [
        'An R4s violation, suggesting excessive random error',
        'The standardized separation is 2.4 - (-2.3) = 4.7 SD; the same-run R4s criterion is exceeded.',
      ],
      [
        'Proof that the patient specimens are correctly identified',
        'Control results assess the analytical system; they do not prove specimen identity.',
      ],
    ],
    2,
    'Apply the R4s rule to controls within the same run and investigate according to the validated QC procedure.',
    'harr4',
    244,
    'Clinical Chemistry: within-run R4s quality-control rule',
  ),
];
