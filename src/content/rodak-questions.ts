import type { Question } from './types';

type Choice = readonly [text: string, rationale: string];
/** Original educational items; references use 1-based PDF viewer pages. */
function q(
  n: number,
  topic: string,
  page: number,
  chapter: string,
  kind: Question['kind'],
  stem: string,
  choices: readonly Choice[],
  takeaway: string,
): Question {
  // Keep source-order answers stable while avoiding one fixed answer position.
  const offset = n % 4;
  const ordered = [...choices.slice(offset), ...choices.slice(0, offset)];
  return {
    id: `hema-r7-${String(n).padStart(3, '0')}`,
    subjectId: 'hematology',
    topic,
    kind,
    difficulty: kind === 'case' ? 'Application' : 'Foundation',
    stem,
    options: ordered.map(([text, rationale], i) => ({
      id: String.fromCharCode(65 + i),
      text,
      rationale,
    })),
    correctOptionId: String.fromCharCode(65 + ((4 - offset) % 4)),
    takeaway,
    source: {
      title: "Rodak's Hematology: Clinical Principles and Applications",
      edition: '7th edition (Keohane et al., 2025)',
      pdfPage: page,
      chapter,
    },
    version: 1,
  };
}

const manual = '12 Manual, Semiautomated, and Point-of-Care Testing in Hematology';
const iron = '17 Disorders of Iron Kinetics and Heme Metabolism';
const dna = '18 Anemias Caused by Defects of DNA Metabolism';
const destruction = '20 Introduction to Increased Destruction of Erythrocytes';
const platelet = '11 Platelet Production, Structure, and Function';
const leukocyte = '26 Nonmalignant Leukocyte Disorders';
const hemostasis = '35 Normal Hemostasis';
const laboratory = '41 Laboratory Evaluation of Hemostasis';

export const rodakQuestions: Question[] = [
  q(
    1,
    'RBC indices',
    203,
    manual,
    'case',
    'A CBC has hemoglobin 12.0 g/dL and RBC count 4.0 × 10^12/L. What is the calculated mean cell hemoglobin?',
    [
      ['30 pg', 'MCH = hemoglobin × 10 / RBC count: 12 × 10 / 4 = 30 pg.'],
      ['3 pg', 'This omits the factor of 10 in the conventional-unit formula.'],
      ['48 pg', 'Multiplying hemoglobin by the RBC count does not calculate MCH.'],
      ['300 pg', 'This introduces an extra factor of 10.'],
    ],
    'MCH reports average hemoglobin mass per RBC, in picograms.',
  ),
  q(
    2,
    'RBC indices',
    203,
    manual,
    'case',
    'Hemoglobin is 10 g/dL and hematocrit is 32%. Which value is the calculated MCHC?',
    [
      ['31.25 g/dL', 'MCHC = 10 × 100 / 32 = 31.25 g/dL.'],
      ['3.2 g/dL', 'This reverses the relevant ratio and omits its scale.'],
      ['32 pg', 'Picograms measure MCH, not MCHC.'],
      ['320 g/dL', 'Multiplying the two input values does not produce MCHC.'],
    ],
    'MCHC is a concentration: hemoglobin divided by the packed RBC volume.',
  ),
  q(
    3,
    'RBC indices',
    203,
    manual,
    'recall',
    'Which index describes average RBC volume rather than hemoglobin mass or concentration?',
    [
      ['MCV', 'Mean cell volume describes the average volume of an erythrocyte.'],
      ['MCH', 'MCH describes mean hemoglobin mass per cell.'],
      ['MCHC', 'MCHC describes mean hemoglobin concentration in RBCs.'],
      ['Reticulocyte percentage', 'This describes the fraction of immature RBCs.'],
    ],
    'Keep cell volume, hemoglobin mass, and hemoglobin concentration conceptually separate.',
  ),
  q(
    4,
    'RBC indices',
    203,
    manual,
    'case',
    "An adult sample has MCV 72 fL and MCHC 29 g/dL. Using the chapter's adult classification, how are its RBCs described?",
    [
      [
        'Microcytic and hypochromic',
        'Both cell volume and cellular hemoglobin concentration are decreased.',
      ],
      ['Macrocytic and normochromic', 'An MCV of 72 fL does not describe macrocytosis.'],
      [
        'Normocytic and hyperchromic',
        'Neither the volume nor concentration supports this description.',
      ],
      [
        'Macrocytic and hypochromic',
        'The reduced MCHC supports hypochromia, but the MCV supports microcytosis.',
      ],
    ],
    'Use MCV for size and MCHC for hemoglobin concentration; morphology is not a final diagnosis.',
  ),
  q(
    5,
    'RBC indices',
    203,
    manual,
    'case',
    'An analyzer reports a markedly implausible MCHC in a specimen with visible cold-dependent RBC clumping. What is the best interpretation?',
    [
      [
        'Investigate an analytical artifact from agglutination',
        'Cold agglutinins can distort RBC measurements and markedly elevate calculated MCHC.',
      ],
      [
        'Accept the value as true hyperchromia without checking the specimen',
        'An implausible concentration and visible clumping require investigation.',
      ],
      [
        'This is sufficient to diagnose iron deficiency',
        'Iron deficiency is not established by a markedly elevated MCHC.',
      ],
      [
        'MCHC is unrelated to hemoglobin or hematocrit',
        'MCHC is calculated from these measurements.',
      ],
    ],
    "An implausible index is a quality signal; resolve interference using the laboratory's validated procedure.",
  ),
  q(
    6,
    'RBC indices',
    202,
    manual,
    'recall',
    'When is the hemoglobin-times-three check of hematocrit most appropriately applied?',
    [
      [
        'When RBCs are normocytic and normochromic',
        'The rule assumes ordinary RBC size and hemoglobin concentration.',
      ],
      [
        'As an exact identity in every anemia',
        'Microcytosis and hypochromia can invalidate the relationship.',
      ],
      [
        'Only when RBCs are markedly microcytic and hypochromic',
        'These changes undermine the normal-size, normal-concentration assumption.',
      ],
      [
        'As a replacement for measured CBC results',
        'It is a plausibility check, not a replacement for testing.',
      ],
    ],
    'The rule of three is an approximate consistency check with morphological assumptions.',
  ),
  q(
    7,
    'RBC indices',
    203,
    manual,
    'recall',
    'What material does new methylene blue reveal when used for a manual reticulocyte count?',
    [
      [
        'Residual ribosomal RNA',
        'Supravital staining reveals the residual RNA network of immature RBCs.',
      ],
      [
        'Residual nuclear DNA as a Howell-Jolly body',
        'Reticulocytes are defined by RNA remnants, not a solitary nuclear fragment.',
      ],
      [
        'Iron granules confirmed by Prussian blue',
        'Iron inclusions are not the RNA network defining reticulocytes.',
      ],
      [
        'Precipitated denatured hemoglobin as a Heinz body',
        'Heinz bodies are distinct from reticular RNA material.',
      ],
    ],
    'Reticulocytes are nonnucleated cells with residual RNA, reflecting recent RBC production.',
  ),
  q(
    8,
    'RBC indices',
    204,
    manual,
    'case',
    'A manual count identifies 24 reticulocytes among 1200 RBCs, including the reticulocytes in the RBC denominator. What is the reticulocyte percentage?',
    [
      ['2.0%', '24 / 1200 × 100 = 2.0%.'],
      ['0.2%', 'This is tenfold too low.'],
      ['20%', 'This is tenfold too high.'],
      ['24%', 'The number counted is not itself the percentage.'],
    ],
    'A reticulocyte is included in both the reticulocyte numerator and total RBC denominator.',
  ),
  q(
    9,
    'RBC indices',
    205,
    manual,
    'case',
    'RBC count is 3.0 × 10^12/L and reticulocytes are 4%. What is the absolute reticulocyte count?',
    [
      ['120 × 10^9/L', '0.04 × 3.0 × 10^12/L = 0.12 × 10^12/L = 120 × 10^9/L.'],
      ['12 × 10^9/L', 'This loses one factor of 10.'],
      ['4 × 10^9/L', 'A percentage must be multiplied by the RBC concentration.'],
      ['750 × 10^9/L', 'Dividing RBC count by the reticulocyte number is not the formula.'],
    ],
    'Absolute reticulocytes combine the reticulocyte fraction with the RBC concentration.',
  ),
  q(
    10,
    'RBC indices',
    205,
    manual,
    'case',
    'Using an assumed reference hematocrit of 45%, what is the corrected reticulocyte percentage when observed reticulocytes are 6% and patient hematocrit is 30%?',
    [
      ['4%', 'Corrected reticulocytes = 6 × 30 / 45 = 4%.'],
      ['9%', 'This reverses the hematocrit correction and raises the value.'],
      ['6%', 'This leaves the anemia correction unapplied.'],
      ['0.4%', 'This adds an unnecessary tenfold reduction.'],
    ],
    'In anemia, correction adjusts the reticulocyte percentage for the reduced RBC compartment.',
  ),
  q(
    11,
    'RBC indices',
    205,
    manual,
    'case',
    'A corrected reticulocyte percentage is 4% and the supplied maturation time is 2 days. What is the reticulocyte production index?',
    [
      ['2', 'RPI = corrected reticulocyte percentage / maturation time = 4 / 2.'],
      ['8', 'Multiplication does not correct for prolonged maturation.'],
      ['4', 'This omits the maturation-time correction.'],
      ['0.5', 'This reverses numerator and denominator.'],
    ],
    'RPI adjusts for both anemia and prolonged circulation of prematurely released reticulocytes.',
  ),
  q(
    12,
    'RBC indices',
    204,
    manual,
    'recall',
    'A Miller disc has a small square one-ninth the area of its large square. How is the RBC denominator estimated when RBCs are counted in the small square and reticulocytes in the large square?',
    [
      [
        'Multiply the small-square RBC count by nine',
        'The multiplication estimates the RBCs represented by the larger reticulocyte-counting area.',
      ],
      [
        'Divide the small-square RBC count by nine',
        'This reduces rather than scales the denominator to the larger area.',
      ],
      [
        'Use only the number of reticulocytes',
        'Reticulocytes alone cannot provide the total RBC denominator.',
      ],
      [
        'Assume both squares have equal area',
        'Their ninefold area difference is essential to the calculation.',
      ],
    ],
    'Counting-area ratios must be included when numerator and denominator use different areas.',
  ),

  q(
    13,
    'Specimen quality',
    195,
    manual,
    'recall',
    'How does EDTA prevent clotting in a routine CBC specimen?',
    [
      [
        'It chelates calcium',
        'Binding calcium prevents the calcium-dependent formation of fibrin.',
      ],
      [
        'It directly cross-links fibrin',
        'Fibrin cross-linking stabilizes a clot rather than preventing it.',
      ],
      [
        'It converts plasminogen to plasmin',
        'EDTA anticoagulation is calcium binding, not activation of fibrinolysis.',
      ],
      [
        'It supplies additional calcium for coagulation',
        'EDTA reduces available calcium rather than supplying it.',
      ],
    ],
    'EDTA preserves routine hematology specimens by binding calcium.',
  ),
  q(
    14,
    'Specimen quality',
    195,
    manual,
    'case',
    'Before analyzing an EDTA tube that has stood upright, what preparation is necessary?',
    [
      [
        'Mix appropriately and inspect for clots',
        'Settling and clot formation can make the sampled aliquot unrepresentative.',
      ],
      ['Sample the top without mixing', 'The cell distribution can differ after settling.'],
      [
        'Remove a visible clot and assume the remaining counts are valid',
        'A clot can remove cells and compromise the specimen.',
      ],
      ['Replace whole blood with its serum', 'A routine CBC requires anticoagulated whole blood.'],
    ],
    'Representative sampling starts with a well-mixed, clot-free whole-blood specimen.',
  ),
  q(
    15,
    'Specimen quality',
    201,
    manual,
    'case',
    'A microhematocrit capillary leaks from its inadequately sealed outer end during centrifugation. Which bias is expected?',
    [
      [
        'A falsely decreased packed cell volume',
        'Packed RBCs are preferentially lost through the leaking outer end.',
      ],
      [
        'A falsely increased packed cell volume',
        'Preferential RBC loss from the outer end biases the packed-cell reading downward.',
      ],
      [
        'An unaffected result because the RBCs remain completely trapped',
        'A defective seal permits packed RBC loss.',
      ],
      [
        'A result that can be corrected solely by excluding the buffy coat',
        'Buffy-coat exclusion does not restore blood lost through a leaking seal.',
      ],
    ],
    'A poorly sealed microhematocrit tube invalidates the packed-cell measurement.',
  ),
  q(
    16,
    'Specimen quality',
    201,
    manual,
    'case',
    'An inadequately filled EDTA tube produces RBC shrinkage. How can the measured microhematocrit be affected?',
    [
      [
        'It can be falsely decreased',
        'Excess anticoagulant relative to blood can shrink RBCs and lower their packed volume.',
      ],
      [
        'It must be falsely increased',
        'RBC shrinkage reduces rather than increases packed red-cell volume.',
      ],
      [
        'It is necessarily unaffected because the anticoagulant is dry',
        'An excessive anticoagulant-to-blood ratio can still alter cells.',
      ],
      [
        'It can be accepted as proof of in-vivo microcytosis',
        'A collection artifact must be resolved before interpreting cell size.',
      ],
    ],
    'Correct filling helps preserve the intended blood-to-anticoagulant ratio.',
  ),
  q(
    17,
    'Specimen quality',
    201,
    manual,
    'case',
    'Microhematocrit tubes are centrifuged for less than the time required for complete packing. What is the likely effect?',
    [
      [
        'Falsely elevated hematocrit',
        'Incomplete packing leaves excessive space within the RBC column.',
      ],
      [
        'No possible effect on hematocrit',
        'Packing conditions are part of the measurement procedure.',
      ],
      [
        'Falsely decreased hematocrit from excessive RBC compression',
        'The cells are incompletely, not excessively, packed.',
      ],
      [
        'A change that can be resolved by including the buffy coat',
        'Adding the buffy coat introduces another upward error.',
      ],
    ],
    'Use validated centrifugation conditions so packed-cell volume is reproducible.',
  ),
  q(
    18,
    'Specimen quality',
    202,
    manual,
    'case',
    'A trainee includes the buffy coat in the red-cell column when reading a microhematocrit. What happens?',
    [
      [
        'The hematocrit is falsely elevated',
        'Leukocytes and platelets are incorrectly included in the RBC volume.',
      ],
      [
        'The hematocrit is falsely decreased',
        'Including an extra layer increases, rather than decreases, the reading.',
      ],
      [
        'Only the calculated leukocyte differential changes',
        'The error directly concerns the volume read as RBCs.',
      ],
      [
        'The result is valid because the buffy coat belongs in the RBC column',
        'Leukocytes and platelets should not be read as packed RBCs.',
      ],
    ],
    'Exclude the buffy coat when reading the packed RBC column.',
  ),
  q(
    19,
    'Specimen quality',
    202,
    manual,
    'case',
    'A blood sample is diluted by IV fluid during collection. What is the expected direction of its hematocrit artifact?',
    [
      [
        'Falsely decreased',
        'Added cell-free fluid reduces the fraction of the specimen occupied by RBCs.',
      ],
      ['Falsely increased', 'Dilution adds fluid rather than red-cell volume.'],
      [
        'Unaffected because hematocrit ignores plasma volume',
        'Hematocrit is the RBC volume fraction of whole blood.',
      ],
      [
        'Correctable by multiplying every result by three',
        'The unknown contamination fraction cannot be resolved by the rule of three.',
      ],
    ],
    'Collection-site contamination can produce dilutional CBC errors.',
  ),
  q(
    20,
    'Specimen quality',
    196,
    manual,
    'case',
    'A manual counting chamber has 0.1-mm depth. Counting 160 cells across 4 mm² after a 1:20 dilution gives which concentration?',
    [
      [
        '8000 cells/µL',
        '160 × 20 / (4 × 0.1) = 8000 cells per cubic millimeter, equivalent to per µL.',
      ],
      ['800 cells/µL', 'This omits the reciprocal-depth factor of 10.'],
      ['80 cells/µL', 'Both volume and dilution must be incorporated.'],
      ['3200 cells/µL', 'Cells times dilution still must be divided by the counted volume.'],
    ],
    'Manual counts divide dilution-adjusted cells by the actual counted chamber volume.',
  ),
  q(
    21,
    'Specimen quality',
    196,
    manual,
    'recall',
    'What volume overlies a 1-mm² counting area when chamber depth is 0.1 mm?',
    [
      ['0.1 µL', 'Area × depth = 0.1 mm³, and 1 mm³ equals 1 µL.'],
      ['1 µL', 'This ignores the one-tenth-millimeter chamber depth.'],
      ['10 µL', 'This incorrectly inverts the depth.'],
      ['0.1 mL', 'A milliliter is 1000 times a microliter.'],
    ],
    'Dimensional analysis prevents chamber-count unit errors.',
  ),
  q(
    22,
    'Specimen quality',
    828,
    laboratory,
    'recall',
    'Which specimen preparation is generally used for routine plasma clot-based coagulation assays?',
    [
      [
        'Platelet-poor plasma from citrated whole blood',
        'Most clot-based procedures use platelet-poor plasma prepared from sodium-citrate specimens.',
      ],
      [
        'Serum after complete clot formation',
        'Clotting consumes or alters components needed for coagulation testing.',
      ],
      [
        'Unseparated EDTA blood for every coagulation test',
        'EDTA is not the general specimen for routine plasma clot-based assays.',
      ],
      ['A dried blood film', 'A film is for morphology rather than plasma clotting assays.'],
    ],
    'Choose specimen processing for the assay: clot-based tests and platelet-function tests have different needs.',
  ),

  q(
    23,
    'Anemias',
    294,
    iron,
    'case',
    "A patient's ferritin decreases over serial measurements while hemoglobin and RBC morphology remain normal. Which process can explain this sequence?",
    [
      [
        'Storage iron depletion preceding overt anemia',
        'Loss of storage iron can occur before RBC production and hemoglobin become abnormal.',
      ],
      [
        'Iron depletion is impossible unless MCV is already low',
        'Normal MCV does not exclude early iron depletion.',
      ],
      [
        'The ferritin fall proves iron overload',
        'Declining ferritin in this setting does not indicate increasing stores.',
      ],
      [
        'All circulating RBCs must already be microcytic',
        'Earlier-produced RBCs may retain normal size.',
      ],
    ],
    'Iron deficiency can precede anemia; a normal CBC does not exclude depleted stores.',
  ),
  q(
    24,
    'Anemias',
    294,
    iron,
    'case',
    'Why may reticulocyte hemoglobin fall before the overall MCV becomes abnormal during developing iron restriction?',
    [
      [
        'Reticulocytes reflect recent erythropoiesis while older cells remain in circulation',
        'Recent cells respond to current iron availability before the whole RBC population does.',
      ],
      [
        'Reticulocytes circulate without any hemoglobin',
        'They contain hemoglobin as well as residual RNA.',
      ],
      [
        'MCV directly measures tissue ferritin',
        'MCV measures average cell volume rather than iron stores.',
      ],
      [
        'Iron restriction selectively enlarges every old RBC',
        'This is not the mechanism of the early reticulocyte change.',
      ],
    ],
    'Reticulocyte parameters can reflect newer production conditions than whole-population indices.',
  ),
  q(
    25,
    'Anemias',
    294,
    iron,
    'recall',
    'Why does zinc protoporphyrin increase when iron is unavailable for heme formation?',
    [
      [
        'Zinc is incorporated into protoporphyrin instead of iron',
        'Iron-restricted heme synthesis permits zinc protoporphyrin accumulation.',
      ],
      [
        'Zinc replaces all globin chains',
        'The described substitution involves protoporphyrin, not globin.',
      ],
      [
        'Zinc converts ferritin directly into transferrin',
        'Zinc substitution occurs at protoporphyrin, not by interconverting iron proteins.',
      ],
      [
        'Iron restriction prevents any protoporphyrin from existing',
        'Protoporphyrin can accumulate when iron insertion is impaired.',
      ],
    ],
    'Zinc protoporphyrin is a signal of impaired iron incorporation, interpreted with other findings.',
  ),
  q(
    26,
    'Anemias',
    294,
    iron,
    'recall',
    'What happens to soluble transferrin receptor in established iron-starved erythropoiesis?',
    [
      [
        'It can increase as cells express and shed more transferrin receptors',
        'Iron-starved cells increase receptor expression to capture available iron.',
      ],
      [
        'It must disappear because RBCs stop using iron',
        'Iron-restricted cells still seek iron for hemoglobin synthesis.',
      ],
      [
        'It becomes a direct measure of iron stored in ferritin',
        'Receptor expression reflects iron demand and erythropoiesis rather than storage ferritin itself.',
      ],
      [
        'It necessarily stays unchanged despite altered receptor expression',
        'Increased expression and shedding can raise the soluble concentration.',
      ],
    ],
    'Soluble transferrin receptor relates to iron demand and erythropoiesis; it is not the same as ferritin.',
  ),
  q(
    27,
    'Anemias',
    295,
    iron,
    'case',
    'Serum iron is 30 µg/dL and TIBC is 400 µg/dL. What is transferrin saturation?',
    [
      ['7.5%', '30 / 400 × 100 = 7.5%.'],
      ['13.3%', 'This does not follow iron divided by TIBC times 100.'],
      ['30%', 'Serum iron is not itself a percentage.'],
      ['75%', 'This is a tenfold scaling error.'],
    ],
    'Use matching iron and TIBC units before calculating percentage saturation.',
  ),
  q(
    28,
    'Anemias',
    294,
    iron,
    'recall',
    'Which red-cell population change is represented by an increasing RDW during developing iron deficiency?',
    [
      [
        'Increasing variation in cell size',
        'New smaller RBCs alongside older cells broaden the size distribution.',
      ],
      [
        'Increasing average hemoglobin concentration with no size variation',
        'RDW concerns the breadth of the size distribution rather than MCHC.',
      ],
      [
        'A direct increase in the average RBC volume only',
        'An average MCV and distribution width measure different aspects of cell size.',
      ],
      [
        'Proof that every RBC has the same diameter',
        'A broader distribution means more, not less, size variation.',
      ],
    ],
    'RDW describes heterogeneity; an average MCV can conceal a mixed-size population.',
  ),
  q(
    29,
    'Anemias',
    294,
    iron,
    'case',
    'A person with longstanding blood loss develops iron restriction. Which mechanism links reduced hemoglobin synthesis to microcytosis?',
    [
      [
        'Additional precursor divisions produce smaller cells',
        'Delayed hemoglobinization allows further divisions during RBC development.',
      ],
      [
        'Fewer precursor divisions produce progressively smaller cells',
        'Additional, rather than fewer, divisions contribute to iron-restricted microcytosis.',
      ],
      [
        'Osmotic swelling enlarges the RBCs',
        'Swelling increases volume and does not explain microcytosis.',
      ],
      [
        'Iron loss changes MCHC alone while cell size cannot change',
        'Iron-restricted production affects both hemoglobinization and cell size.',
      ],
    ],
    'Microcytosis can result from extra divisions during impaired hemoglobin synthesis.',
  ),
  q(
    30,
    'Anemias',
    295,
    iron,
    'recall',
    'TIBC is primarily an indirect measure of which plasma protein?',
    [
      ['Transferrin', 'TIBC reflects available iron-binding capacity associated with transferrin.'],
      ['Haptoglobin', 'Haptoglobin binds free hemoglobin rather than transporting serum iron.'],
      ['Fibrinogen', 'Fibrinogen is a clotting substrate, not the basis of TIBC.'],
      ['Myeloperoxidase', 'MPO is a leukocyte enzyme rather than the serum iron carrier.'],
    ],
    'Do not confuse the iron carrier transferrin with iron stores or hemoglobin scavengers.',
  ),
  q(
    31,
    'Anemias',
    317,
    dna,
    'case',
    'Why can chronic hemolysis increase folate requirements even when ordinary dietary intake is unchanged?',
    [
      [
        'Accelerated cell production increases folate demand',
        'Increased turnover requires more DNA synthesis during replacement erythropoiesis.',
      ],
      [
        'Folate has no role in proliferating cells',
        'Its role in cell replication explains the increased need.',
      ],
      [
        'Hemolysis converts all folate to ferritin',
        'These are different molecules with different functions.',
      ],
      [
        'Reticulocytes remove all dietary folate before absorption',
        'This is not the mechanism described.',
      ],
    ],
    'Nutrient adequacy depends on demand as well as intake.',
  ),
  q(
    32,
    'Anemias',
    317,
    dna,
    'recall',
    'Which vitamin distinction is relevant when food preparation reduces nutrient availability?',
    [
      [
        'Folate is heat labile, while vitamin B12 is more heat stable',
        'The chapter contrasts folate loss with cooking against B12 stability.',
      ],
      [
        'Folate is heat stable while vitamin B12 is always destroyed by cooking',
        'This reverses the distinction described in the chapter.',
      ],
      ['Both are unaffected by prolonged cooking', 'Folate can be lost with overcooking.'],
      [
        'Cooking loss is the sole explanation for every B12 deficiency',
        'B12 deficiency can arise from impaired absorption and other mechanisms.',
      ],
    ],
    'Folate and B12 can both affect erythropoiesis but differ in dietary handling and absorption.',
  ),
  q(
    33,
    'Anemias',
    318,
    dna,
    'case',
    'Loss of gastric parietal cells reduces intrinsic factor. Which nutrient-absorption step is directly impaired?',
    [
      [
        'Ileal absorption of the vitamin B12–intrinsic factor complex',
        'Intrinsic factor binding is required for receptor-mediated B12 absorption in ileal enterocytes.',
      ],
      [
        'Absorption of B12 solely by gastric parietal cells',
        'Parietal cells secrete intrinsic factor; uptake of its B12 complex occurs in the ileum.',
      ],
      [
        'Direct transport of free B12 by transferrin',
        'Transferrin transports iron rather than mediating this B12 absorption step.',
      ],
      [
        'Conversion of ferritin into circulating B12',
        'Ferritin is an iron-storage protein, not a B12 precursor.',
      ],
    ],
    'Intrinsic factor connects gastric function to vitamin B12 uptake in the ileum.',
  ),
  q(
    34,
    'Anemias',
    318,
    dna,
    'recall',
    'What releases vitamin B12 from haptocorrin in the small intestine before intrinsic-factor binding?',
    [
      [
        'Pancreatic proteases',
        'Proteases such as trypsin release B12 from its early binding protein.',
      ],
      [
        'Intrinsic factor directly digesting haptocorrin',
        'Intrinsic factor binds released B12; it is not the protease that releases it.',
      ],
      [
        'Ileal receptors acting before digestion of the carrier',
        'The complex must progress through the luminal release and binding stages first.',
      ],
      [
        'Transcobalamin digesting all dietary proteins in the stomach',
        'Transcobalamin transports absorbed B12 rather than acting as a gastric protease.',
      ],
    ],
    'Normal B12 absorption depends on several organs, not only dietary intake.',
  ),
  q(
    35,
    'Anemias',
    318,
    dna,
    'recall',
    'Which circulating complex is the metabolically active transport form of vitamin B12 described in the chapter?',
    [
      [
        'Holotranscobalamin',
        'Vitamin B12 bound to transcobalamin is delivered to cell-surface receptors.',
      ],
      ['Hemoglobin–haptoglobin', 'This complex salvages free hemoglobin.'],
      ['Factor VIII–VWF', 'This complex stabilizes a coagulation cofactor.'],
      ['Fibrin–D-dimer', 'D-dimer is a fibrin degradation fragment rather than a vitamin carrier.'],
    ],
    'B12 transport and absorption use distinct carrier proteins at different stages.',
  ),
  q(
    36,
    'Anemias',
    351,
    destruction,
    'recall',
    'Which plasma protein initially binds free hemoglobin dimers released during intravascular RBC destruction?',
    [
      ['Haptoglobin', 'Haptoglobin rapidly binds free hemoglobin dimers for salvage.'],
      ['Transferrin', 'Transferrin carries iron, not intact hemoglobin dimers.'],
      ['Intrinsic factor', 'Intrinsic factor is involved in B12 absorption.'],
      [
        'Fibrinogen',
        'Fibrinogen is a clotting substrate rather than the primary hemoglobin scavenger.',
      ],
    ],
    'Haptoglobin participates in conserving hemoglobin iron after intravascular hemolysis.',
  ),
  q(
    37,
    'Anemias',
    351,
    destruction,
    'case',
    'Why can marked intravascular RBC fragmentation increase plasma LDH?',
    [
      [
        'Damaged RBCs release intracellular LDH into plasma',
        'Membrane rupture releases both hemoglobin and LDH.',
      ],
      ['LDH is produced only by urine bacteria', 'RBCs contain LDH before membrane rupture.'],
      [
        'All free hemoglobin is converted directly into LDH',
        'LDH and hemoglobin are separate intracellular components.',
      ],
      [
        'The event selectively increases intrinsic factor',
        'Intrinsic factor is unrelated to the released enzyme.',
      ],
    ],
    'LDH release is compatible with hemolysis but is not specific for RBC destruction alone.',
  ),
  q(
    38,
    'Anemias',
    350,
    destruction,
    'recall',
    'Why is bilirubin conjugation important in normal heme disposal?',
    [
      [
        'Glucuronic-acid conjugation makes bilirubin more water soluble',
        'Hepatocytes modify lipid-soluble unconjugated bilirubin for excretion.',
      ],
      [
        'It makes bilirubin lipid soluble so it can remain albumin-bound',
        'Unconjugated bilirubin is the poorly water-soluble form transported with albumin.',
      ],
      [
        'It is the initial binding of free hemoglobin to haptoglobin',
        'Hemoglobin scavenging precedes pigment disposal and is a different process.',
      ],
      [
        'It occurs only after bilirubin has been excreted into the intestine',
        'Hepatic conjugation occurs before biliary delivery to the intestine.',
      ],
    ],
    'Heme breakdown and hepatic conjugation are linked stages in pigment elimination.',
  ),
  q(
    39,
    'Anemias',
    350,
    destruction,
    'case',
    'Total bilirubin is 2.4 mg/dL and direct bilirubin is 0.5 mg/dL. What is the calculated indirect bilirubin?',
    [
      ['1.9 mg/dL', 'Indirect bilirubin is total minus direct: 2.4 − 0.5 = 1.9 mg/dL.'],
      ['2.9 mg/dL', 'Adding direct to total double counts a component.'],
      ['0.5 mg/dL', 'This is the supplied direct value.'],
      ['4.8 mg/dL', 'The ratio of total to direct is not the indirect concentration.'],
    ],
    'Indirect bilirubin is calculated by subtraction when total and direct results use matching units.',
  ),
  q(
    40,
    'Anemias',
    204,
    manual,
    'case',
    'An RBC inclusion is suspected to contain iron. Which stain can support identification of Pappenheimer bodies?',
    [
      ['Prussian blue', 'An iron stain can confirm iron-containing Pappenheimer inclusions.'],
      [
        'A platelet aggregation agonist',
        'An agonist measures platelet response rather than intracellular iron.',
      ],
      ['A D-dimer reagent', 'D-dimer assays detect fibrin degradation products.'],
      [
        'An intrinsic-factor binding assay',
        'This evaluates B12-related mechanisms rather than RBC iron inclusions.',
      ],
    ],
    'Special stains can distinguish inclusions that are not reliably identified by appearance alone.',
  ),

  q(
    41,
    'Platelets',
    176,
    platelet,
    'recall',
    'Which marrow cell produces platelets?',
    [
      ['Megakaryocyte', 'Megakaryocyte cytoplasm gives rise to platelets.'],
      ['Mature erythrocyte', 'Mature RBCs do not shed platelets.'],
      ['Plasma cell', 'Plasma cells produce immunoglobulins.'],
      ['Segmented neutrophil', 'Neutrophils are phagocytes rather than platelet precursors.'],
    ],
    'Platelets arise from megakaryocytes, not by division of circulating platelets.',
  ),
  q(
    42,
    'Platelets',
    176,
    platelet,
    'recall',
    'Which process explains the polyploid nucleus of a megakaryocyte?',
    [
      [
        'DNA replication without completion of cytokinesis',
        'Endomitosis increases DNA content without generating ordinary daughter cells.',
      ],
      [
        'Repeated loss of chromosomes with each division',
        'Polyploidy reflects additional chromosome copies, not progressive loss.',
      ],
      ['Fusion of circulating RBC nuclei', 'Circulating mature RBCs lack nuclei.'],
      [
        'Ordinary cytokinesis producing separate diploid daughter cells',
        'Endomitosis retains replicated DNA within one enlarging cell.',
      ],
    ],
    'Endomitosis allows abundant cytoplasmic production without ordinary cell division.',
  ),
  q(
    43,
    'Platelets',
    176,
    platelet,
    'recall',
    'Which growth factor is central to recruitment and differentiation of megakaryocyte progenitors?',
    [
      ['Thrombopoietin', 'TPO promotes megakaryocytic production.'],
      [
        'Erythropoietin as the principal platelet-lineage regulator',
        'Erythropoietin chiefly supports the erythroid lineage rather than serving as TPO.',
      ],
      [
        'G-CSF as the principal platelet-lineage regulator',
        'G-CSF primarily supports granulocytic production.',
      ],
      [
        'Tissue plasminogen activator',
        'TPA initiates fibrinolysis rather than recruiting platelet progenitors.',
      ],
    ],
    'Thrombopoietin is a principal regulator of the platelet-producing lineage.',
  ),
  q(
    44,
    'Platelets',
    185,
    platelet,
    'case',
    'At a high-shear vascular injury, which platelet receptor complex interacts with VWF for initial tethering?',
    [
      ['GPIb/IX/V', 'The GPIbα component binds VWF and slows the platelet at the damaged surface.'],
      ['P2Y12 alone', 'P2Y12 is an ADP signaling receptor rather than the VWF tether.'],
      [
        'GPIIb/IIIa as the initial VWF tether',
        'Activated αIIbβ3 principally supports ligand-mediated platelet aggregation.',
      ],
      ['GPVI as the VWF tether', 'GPVI is associated with collagen-triggered activation.'],
    ],
    'Platelet adhesion through VWF is distinct from subsequent platelet-to-platelet aggregation.',
  ),
  q(
    45,
    'Platelets',
    185,
    platelet,
    'recall',
    'Which activated platelet integrin binds fibrinogen to support platelet-to-platelet aggregation?',
    [
      ['αIIbβ3 (GPIIb/IIIa)', 'Its activated form binds ligands that bridge platelets.'],
      ['GPIb/IX/V', 'This receptor is especially important for VWF-dependent tethering.'],
      ['P2Y12', 'P2Y12 is an ADP signaling receptor rather than the aggregation-ligand integrin.'],
      ['GPVI', 'GPVI is a collagen receptor involved in activation.'],
    ],
    'Aggregation uses activated αIIbβ3 and bridging ligands such as fibrinogen.',
  ),
  q(
    46,
    'Platelets',
    185,
    platelet,
    'recall',
    'What is the principal substrate of ADAMTS13 in platelet-related hemostasis?',
    [
      ['Large VWF multimers', 'The VWF-cleaving protease limits multimer size.'],
      [
        'Fibrinogen as the substrate for clot production',
        'Thrombin, rather than ADAMTS13, converts fibrinogen to fibrin.',
      ],
      ['Cross-linked fibrin during clot lysis', 'Plasmin, rather than ADAMTS13, digests fibrin.'],
      [
        'Prothrombin during thrombin generation',
        'That is a prothrombinase reaction rather than VWF cleavage.',
      ],
    ],
    'VWF multimer processing is one mechanism regulating platelet adhesion.',
  ),
  q(
    47,
    'Platelets',
    185,
    platelet,
    'recall',
    'Which platelet receptor directly participates in collagen-triggered activation?',
    [
      ['GPVI', 'Collagen binding to GPVI initiates platelet signaling.'],
      ['P2Y12 as the collagen-binding site', 'P2Y12 is an ADP receptor.'],
      [
        'GPIIb/IIIa as the direct collagen signaling receptor',
        'Its main role here is binding aggregation ligands after activation.',
      ],
      [
        'Thrombomodulin as the platelet collagen receptor',
        'Thrombomodulin participates in endothelial anticoagulant regulation.',
      ],
    ],
    'Different platelet receptors recognize collagen, VWF, ADP, and aggregation ligands.',
  ),
  q(
    48,
    'Platelets',
    185,
    platelet,
    'case',
    'A flow-cytometric study detects increased surface P-selectin on platelets. What does this support?',
    [
      [
        'Platelet activation with granule-membrane redistribution',
        'P-selectin moves from α-granule membranes to the platelet surface during activation.',
      ],
      [
        'A resting platelet with P-selectin confined to granule membranes',
        'Increased surface expression indicates redistribution from that resting arrangement.',
      ],
      [
        'A direct measure of total platelet number alone',
        'An activation marker addresses cell state rather than only the count.',
      ],
      [
        'A direct measure of platelet DNA ploidy',
        'Platelets are nonnucleated; the marker concerns membrane redistribution.',
      ],
    ],
    'Surface-marker redistribution can reveal platelet activation.',
  ),
  q(
    49,
    'Platelets',
    187,
    platelet,
    'recall',
    'Why does exposed phosphatidylserine on an activated platelet support coagulation?',
    [
      [
        'It provides a surface for coagulation-complex assembly',
        'Tenase and prothrombinase assemble on the procoagulant phospholipid surface.',
      ],
      [
        'It functions only as a freely soluble enzyme',
        'Phosphatidylserine is a membrane phospholipid providing an assembly surface.',
      ],
      [
        'It removes every calcium ion from the local reaction',
        'Calcium supports assembly of these complexes.',
      ],
      [
        'It prevents all coagulation-factor binding',
        'The surface promotes, rather than universally prevents, assembly.',
      ],
    ],
    'Activated platelets link primary hemostasis to localized coagulation.',
  ),
  q(
    50,
    'Platelets',
    187,
    platelet,
    'recall',
    'Dense-granule secretion primarily amplifies platelet responses through which type of contents?',
    [
      [
        'Small-molecule platelet agonists and vasoactive substances',
        'Dense granules release small molecules that amplify primary hemostasis.',
      ],
      [
        'Predominantly large coagulation proteins such as fibrinogen',
        'These are characteristic α-granule contents rather than the dense-granule emphasis.',
      ],
      [
        'Only proteins that inhibit all neighboring platelets',
        'Dense-granule contents amplify activation rather than universally suppress it.',
      ],
      [
        'Only digestive enzymes for vitamin B12 absorption',
        'These granules function in hemostasis rather than intestinal absorption.',
      ],
    ],
    'Granule release amplifies local platelet activation and supports hemostasis.',
  ),
  q(
    51,
    'Platelets',
    188,
    platelet,
    'case',
    'Which endothelial mediator counterbalances platelet activation by increasing platelet cAMP?',
    [
      [
        'Prostacyclin (PGI2)',
        'The endothelial eicosanoid pathway inhibits platelet activation through increased cAMP.',
      ],
      ['Thromboxane A2', 'TXA2 supports platelet activation rather than this inhibitory response.'],
      ['Collagen', 'Exposed collagen is a platelet activating surface.'],
      ['ADP', 'ADP is a platelet agonist.'],
    ],
    'Intact endothelium actively suppresses inappropriate platelet activation.',
  ),
  q(
    52,
    'Platelets',
    188,
    platelet,
    'recall',
    'Which platelet α-granule protein is associated with heparin neutralization?',
    [
      [
        'Platelet factor 4',
        'PF4 is listed among α-granule proteins with heparin-neutralizing properties.',
      ],
      [
        'Plasminogen',
        'Its relevant role is supporting fibrinolysis rather than heparin neutralization.',
      ],
      [
        'Plasminogen activator inhibitor-1',
        'PAI-1 regulates fibrinolysis by inhibiting activators.',
      ],
      ['Fibronectin', 'Fibronectin serves an adhesion role rather than the stated PF4 function.'],
    ],
    'Platelet α-granules contain proteins with functions beyond simple platelet aggregation.',
  ),
  q(
    53,
    'Platelets',
    198,
    manual,
    'case',
    'Platelets form rosettes around neutrophils in an EDTA specimen. What is this morphology called?',
    [
      ['Platelet satellitism', 'Satellitism describes platelet adherence around neutrophils.'],
      [
        'RBC rouleaux',
        'Rouleaux consists of stacked red cells rather than platelets around neutrophils.',
      ],
      ['Neutrophil hypersegmentation', 'That term describes nuclear lobulation.'],
      ['Reticulocytosis', 'Reticulocytosis describes increased immature RBCs.'],
    ],
    'Reviewing the blood film can reveal platelet-count artifacts caused by satellitism.',
  ),
  q(
    54,
    'Platelets',
    198,
    manual,
    'recall',
    'In the described manual platelet-count method, what is the purpose of ammonium oxalate diluent?',
    [
      [
        'Lysing nonnucleated RBCs to facilitate platelet counting',
        'Removing RBC interference makes platelets easier to enumerate.',
      ],
      [
        'Preserving all RBCs while selectively lysing platelets',
        'That would remove the cells being counted.',
      ],
      [
        'Inducing platelet aggregation before enumeration',
        'Aggregates interfere with reliable counting.',
      ],
      [
        'Replacing the need to account for dilution',
        'The dilution factor remains essential in the count calculation.',
      ],
    ],
    'Diluent selection depends on which cells should remain visible for a manual count.',
  ),

  q(
    55,
    'Leukocyte disorders',
    490,
    leukocyte,
    'case',
    'A well patient and several relatives have bilobed neutrophils with very coarse, mature chromatin. Which interpretation best avoids a false left shift?',
    [
      [
        'Consider inherited Pelger-Huët anomaly in mature neutrophils',
        'Hypolobulation with mature coarse chromatin can be inherited rather than immature-cell release.',
      ],
      [
        'Classify every bilobed cell as a myeloblast',
        'Nuclear lobe number alone does not establish a blast.',
      ],
      [
        'Diagnose acute leukemia from this finding alone',
        'A benign inherited anomaly can produce this morphology.',
      ],
      [
        'Treat all affected cells as nucleated RBCs',
        'These are granulocytes, not erythroid precursors.',
      ],
    ],
    'Maturity depends on chromatin and cytoplasm as well as nuclear shape.',
  ),
  q(
    56,
    'Leukocyte disorders',
    490,
    leukocyte,
    'recall',
    'Inherited Pelger-Huët anomaly is associated with a defect in which protein?',
    [
      [
        'Lamin B receptor',
        'The LBR gene product participates in nuclear segmentation and chromatin organization.',
      ],
      ['Intrinsic factor', 'Intrinsic factor is involved in B12 absorption.'],
      ['Fibrinogen', 'Fibrinogen is a coagulation substrate.'],
      ['Transferrin', 'Transferrin transports iron.'],
    ],
    'A nuclear-envelope defect can alter granulocyte shape without making the cell immature.',
  ),
  q(
    57,
    'Leukocyte disorders',
    490,
    leukocyte,
    'case',
    'New neutrophil hypolobulation appears in a patient with other evidence of myeloid dysplasia. What distinction matters?',
    [
      [
        'Acquired pseudo-Pelger morphology can accompany myeloid neoplasia',
        'Acquired forms occur in MDS and other conditions and require clinical correlation.',
      ],
      [
        'All Pelger-like morphology must be benign and inherited',
        'Acquired forms have different implications.',
      ],
      [
        'Hypolobulation proves a particular infection by itself',
        'The morphology has multiple possible associations.',
      ],
      [
        'The finding measures plasma vitamin K directly',
        'Nuclear morphology is not a vitamin K assay.',
      ],
    ],
    'Use history, other morphology, and additional studies to distinguish acquired from inherited changes.',
  ),
  q(
    58,
    'Leukocyte disorders',
    491,
    leukocyte,
    'recall',
    'Which morphological feature favors a Pelger-type mature neutrophil over an immature granulocyte?',
    [
      [
        'Very coarse, densely clumped chromatin with mature cytoplasm',
        'These mature features persist despite reduced lobulation.',
      ],
      [
        'Fine open chromatin with prominent nucleoli',
        'These favor cellular immaturity rather than classic Pelger morphology.',
      ],
      [
        'A high nuclear-to-cytoplasmic ratio with basophilic cytoplasm',
        'These features favor an immature granulocyte rather than a classic mature Pelger cell.',
      ],
      [
        'Hypolobulation without considering chromatin or cytoplasm',
        'Nuclear contour alone cannot reliably establish maturity.',
      ],
    ],
    'Avoid interpreting nuclear contour in isolation.',
  ),
  q(
    59,
    'Leukocyte disorders',
    491,
    leukocyte,
    'case',
    'Large dark cytoplasmic granules occur in neutrophils and also in lymphocytes and monocytes in a storage-disorder context. Which process is favored over ordinary toxic granulation?',
    [
      [
        'Alder-Reilly-type inclusions',
        'Reilly bodies may occur across leukocyte lineages, unlike ordinary neutrophil toxic granulation.',
      ],
      [
        'Toxic granulation as an obligatory finding in every leukocyte type',
        'The distribution across lineages argues against that simplification.',
      ],
      [
        'Platelet satellitism',
        'Satellitism describes platelets attached around cells, not intracellular granules.',
      ],
      ['RBC polychromasia', 'Polychromasia is an erythrocyte feature.'],
    ],
    'Distribution across cell lineages helps distinguish morphologically similar inclusions.',
  ),
  q(
    60,
    'Leukocyte disorders',
    491,
    leukocyte,
    'case',
    'Thrombocytopenia, giant platelets, and Döhle-like leukocyte inclusions occur together in an inherited pattern. Which anomaly fits this combination?',
    [
      [
        'May-Hegglin anomaly',
        'The combination of giant platelets, variable thrombocytopenia, and Döhle-like inclusions is characteristic.',
      ],
      ['Isolated Pelger-Huët anomaly', 'Pelger anomaly primarily concerns nuclear hypolobulation.'],
      [
        'Iron depletion alone',
        'Iron depletion does not explain this inherited platelet-inclusion combination.',
      ],
      [
        'An isolated increase in transferrin saturation',
        'An iron-binding measurement does not explain these morphological changes.',
      ],
    ],
    'Interpret platelet and leukocyte morphology together when investigating inherited disorders.',
  ),
  q(
    61,
    'Leukocyte disorders',
    496,
    leukocyte,
    'recall',
    'What do classic Döhle bodies in reactive neutrophils consist of?',
    [
      [
        'Aggregated ribosomal RNA or rough-endoplasmic-reticulum remnants',
        'They appear as pale blue-gray cytoplasmic inclusions, often near the membrane.',
      ],
      ['Cross-linked fibrin D domains', 'Those are the basis of D-dimer, not Döhle bodies.'],
      [
        'Whole mature RBCs',
        'Döhle bodies are intracellular material rather than intact erythrocytes.',
      ],
      ['Only iron crystals in RBCs', 'That describes a different cell and inclusion class.'],
    ],
    'A named inclusion should be linked to its composition and cell type.',
  ),
  q(
    62,
    'Leukocyte disorders',
    496,
    leukocyte,
    'case',
    'Neutrophils show toxic granulation after G-CSF administration. Which interpretation is best?',
    [
      [
        'The finding can reflect stimulated granulopoiesis and is not specific for bacterial infection',
        'Toxic changes can accompany G-CSF, inflammation, pregnancy, and infection.',
      ],
      ['Toxic granulation proves one bacterial species', 'The appearance is not species-specific.'],
      [
        'The granules must be platelet fragments',
        'Toxic granulation is within the neutrophil cytoplasm.',
      ],
      [
        'The finding establishes inherited Pelger anomaly',
        'Pelger anomaly concerns nuclear segmentation.',
      ],
    ],
    'Reactive morphology must be interpreted with clinical and medication context.',
  ),
  q(
    63,
    'Leukocyte disorders',
    496,
    leukocyte,
    'case',
    'A freshly prepared blood film shows irregular neutrophil vacuoles together with Döhle bodies and toxic granulation. What process is supported?',
    [
      [
        'Reactive phagocytic activity',
        'Toxic vacuoles accompanying other toxic changes support a reactive process.',
      ],
      [
        'Isolated autophagic change without associated reactive morphology',
        'Associated toxic granulation and Döhle bodies support a reactive pattern.',
      ],
      [
        'Inherited Pelger-Huët anomaly based on vacuoles alone',
        'Pelger morphology primarily concerns nuclear hypolobulation and chromatin.',
      ],
      [
        'A species-specific identification without further testing',
        'Reactive morphology does not identify a single organism.',
      ],
    ],
    'The associated changes and specimen freshness help interpret neutrophil vacuolation.',
  ),
  q(
    64,
    'Leukocyte disorders',
    497,
    leukocyte,
    'case',
    'A delayed blood film shows small widespread neutrophil vacuoles and pyknotic nuclei. Why should storage artifact be considered?',
    [
      [
        'Delayed film preparation permits autophagic and degenerative changes',
        'The chapter associates these changes with delayed preparation.',
      ],
      [
        'Pyknosis always indicates a newly formed blast',
        'Pyknosis is associated with degeneration rather than youthful open chromatin.',
      ],
      [
        'Storage-related degeneration is impossible in anticoagulated blood',
        'Anticoagulation does not indefinitely preserve leukocyte morphology.',
      ],
      [
        'Any vacuole proves bacterial ingestion',
        'Autophagic and storage-related vacuoles need to be distinguished from phagocytic changes.',
      ],
    ],
    'Specimen age is part of the interpretation of blood-cell morphology.',
  ),
  q(
    65,
    'Leukocyte disorders',
    497,
    leukocyte,
    'case',
    'A dense, rounded nuclear remnant could be mistaken for a nucleated RBC. Which feature supports an apoptotic neutrophil instead?',
    [
      [
        'Residual cytoplasmic neutrophil granules',
        'Apoptotic neutrophils retain granulocytic cytoplasm, while nucleated RBCs are agranular.',
      ],
      [
        'Cytoplasmic hemoglobin without granulocytic granules',
        'That would favor an erythroid cell rather than a degenerating neutrophil.',
      ],
      [
        'Relying only on the number of dense nuclear fragments',
        'Degeneration alters nuclear contour; cytoplasmic lineage features remain important.',
      ],
      ['Only the round nuclear shape', 'Both possibilities can have dense rounded nuclei.'],
    ],
    'Use cytoplasm as well as nuclear remnants to classify degenerating cells.',
  ),
  q(
    66,
    'Leukocyte disorders',
    497,
    leukocyte,
    'case',
    'A febrile patient with tick exposure has morulae within neutrophils. Which organism is classically associated with this host-cell location?',
    [
      [
        'Anaplasma phagocytophilum',
        'Granulocytic anaplasmosis classically produces morulae in neutrophils.',
      ],
      [
        'Ehrlichia chaffeensis',
        'This species is classically associated with monocytic ehrlichiosis.',
      ],
      [
        'Döhle bodies composed of RNA remnants',
        'These are reactive inclusions rather than clusters of intracellular bacteria.',
      ],
      [
        'Alder-Reilly granules',
        'These are metachromatic storage-related inclusions rather than morulae.',
      ],
    ],
    'Host-cell location is a diagnostic clue; morphology should be correlated with confirmatory testing.',
  ),
  q(
    67,
    'Leukocyte disorders',
    487,
    leukocyte,
    'case',
    'Marrow macrophages have abundant wrinkled blue-gray cytoplasm, suggesting Gaucher cells. Why is an enzyme or genetic study useful?',
    [
      [
        'Similar pseudo-Gaucher cells can arise in high-cell-turnover conditions',
        'Morphology alone may not distinguish true enzyme deficiency from a mimic.',
      ],
      [
        'All macrophages with abundant cytoplasm are diagnostic of Gaucher disease',
        'Pseudo-Gaucher cells limit morphological specificity.',
      ],
      [
        'Routine staining always distinguishes true and pseudo-Gaucher cells',
        'The chapter notes that routine stains may not distinguish them.',
      ],
      [
        'Pseudo-Gaucher cells imply complete absence of cell turnover',
        'They may arise when increased turnover overwhelms substrate-processing capacity.',
      ],
    ],
    'Recognize morphological mimics and confirm suspected storage disorders appropriately.',
  ),
  q(
    68,
    'Leukocyte disorders',
    486,
    leukocyte,
    'recall',
    'Which reaction is supported by neutrophil myeloperoxidase?',
    [
      [
        'Formation of microbicidal oxidants from hydrogen peroxide',
        'MPO supports conversion of H2O2 into HOCl and related antimicrobial intermediates.',
      ],
      ['Binding vitamin B12 to intrinsic factor', 'That is a digestive absorption mechanism.'],
      [
        'Cross-linking fibrin through factor XIII',
        'Factor XIIIa, not MPO, performs fibrin cross-linking.',
      ],
      ['Transporting serum iron on transferrin', 'MPO is an enzyme, not the serum iron carrier.'],
    ],
    'MPO contributes to phagocyte killing and may also be used in differential-count methods.',
  ),

  q(
    69,
    'Hemostasis',
    678,
    hemostasis,
    'recall',
    'What chiefly reinforces the initial platelet plug during secondary hemostasis?',
    [
      [
        'Fibrin formation',
        'Coagulation generates thrombin and fibrin to stabilize the initial plug.',
      ],
      [
        'Vasoconstriction alone as permanent reinforcement',
        'Vasoconstriction contributes to the initial response but does not form the fibrin reinforcement.',
      ],
      [
        'Fibrinolysis before any fibrin has formed',
        'Fibrinolysis removes clot material rather than providing initial fibrin reinforcement.',
      ],
      [
        'Platelet count normalization without fibrin generation',
        'A normal count does not substitute for secondary hemostasis.',
      ],
    ],
    'Platelet plug formation and fibrin reinforcement are connected parts of hemostasis.',
  ),
  q(
    70,
    'Hemostasis',
    683,
    hemostasis,
    'recall',
    'Which coagulation factor is a transglutaminase that stabilizes fibrin?',
    [
      ['Factor XIII', 'Activated XIII cross-links fibrin, unlike the serine-protease factors.'],
      ['Factor VII', 'VIIa is a serine protease involved with tissue factor.'],
      ['Factor IX', 'IXa is a serine protease in intrinsic tenase.'],
      ['Factor X', 'Xa is the protease in prothrombinase.'],
    ],
    'Not every coagulation enzyme is a serine protease; factor XIIIa cross-links fibrin.',
  ),
  q(
    71,
    'Hemostasis',
    684,
    hemostasis,
    'recall',
    'Which pairing forms the enzymatic core of intrinsic tenase?',
    [
      ['IXa with VIIIa', 'IXa is the protease and VIIIa its cofactor for activation of X.'],
      ['Xa with Va', 'That pair forms prothrombinase.'],
      ['Thrombin with fibrinogen', 'That reaction produces fibrin rather than intrinsic tenase.'],
      ['TPA with PAI-1', 'This is a fibrinolytic activator–inhibitor interaction.'],
    ],
    'Identify each coagulation complex by its protease, cofactor, and substrate.',
  ),
  q(
    72,
    'Hemostasis',
    684,
    hemostasis,
    'recall',
    'What is the main substrate activated by the Xa–Va prothrombinase complex?',
    [
      ['Prothrombin', 'Prothrombinase converts prothrombin to thrombin.'],
      ['Fibrinogen', 'Thrombin acts on fibrinogen after prothrombinase has generated thrombin.'],
      [
        'Factor X',
        'Factor X is activated by tenase complexes; Xa is already part of prothrombinase.',
      ],
      [
        'Plasminogen',
        'Plasminogen activators initiate fibrinolysis rather than this coagulation step.',
      ],
    ],
    'Prothrombinase generation of thrombin links factor activation to fibrin production.',
  ),
  q(
    73,
    'Hemostasis',
    683,
    hemostasis,
    'recall',
    'Besides participating in platelet adhesion, VWF serves as a carrier for which coagulation factor?',
    [
      ['Factor VIII', 'VWF carries and stabilizes VIII in circulation.'],
      [
        'Factor XIII as its sole physiological function',
        "VWF's carrier role described here is for VIII.",
      ],
      ['Factor IX', 'IX is a serine-protease precursor, not the factor carried by VWF.'],
      ['Factor X', 'X is activated by tenase and is not the factor stabilized by VWF.'],
    ],
    'VWF links platelet adhesion with factor VIII stability.',
  ),
  q(
    74,
    'Hemostasis',
    684,
    hemostasis,
    'recall',
    'Why are calcium and a phospholipid surface important in localized coagulation?',
    [
      [
        'They support assembly of activated coagulation complexes at cell surfaces',
        'Calcium helps factors associate with negatively charged phospholipids at the injury site.',
      ],
      [
        'They act only by removing all circulating coagulation factors',
        'Their central role here is promoting local assembly, not universal removal.',
      ],
      [
        'They replace the need for any coagulation enzyme',
        'The surface supports enzymes rather than replacing them.',
      ],
      [
        'They ensure fibrin forms uniformly throughout all blood',
        'Localization helps confine clotting to appropriate surfaces.',
      ],
    ],
    'Coagulation is a spatially organized process, not simply free enzymes reacting everywhere.',
  ),
  q(
    75,
    'Hemostasis',
    679,
    hemostasis,
    'recall',
    'Which endothelial surface protein participates in activation of the protein C anticoagulant system?',
    [
      ['Thrombomodulin', 'Endothelial thrombomodulin supports the protein C regulatory pathway.'],
      [
        'Exposed collagen as the anticoagulant activator',
        'Collagen exposure promotes platelet responses rather than this inhibitory pathway.',
      ],
      [
        'Tissue factor',
        'Tissue factor initiates the procoagulant pathway rather than acting as thrombomodulin.',
      ],
      [
        'Platelet GPIIb/IIIa',
        'This platelet integrin supports aggregation rather than endothelial protein C activation.',
      ],
    ],
    'Intact endothelium limits coagulation through active regulatory mechanisms.',
  ),
  q(
    76,
    'Hemostasis',
    696,
    hemostasis,
    'recall',
    'What is the immediate enzymatic effect of tissue plasminogen activator in fibrinolysis?',
    [
      [
        'Conversion of plasminogen to plasmin',
        'TPA activates the protease precursor that digests fibrin.',
      ],
      [
        'Conversion of prothrombin to thrombin as prothrombinase',
        'That reaction belongs to coagulation rather than TPA-mediated fibrinolysis.',
      ],
      [
        'Cross-linking soluble fibrin into stable fibrin',
        'Factor XIIIa, not TPA, cross-links fibrin.',
      ],
      [
        'Inactivation of every plasmin molecule',
        'TPA promotes plasmin generation; antiplasmin limits free plasmin.',
      ],
    ],
    'TPA activates the fibrinolytic system rather than directly producing a fibrin clot.',
  ),
  q(
    77,
    'Hemostasis',
    696,
    hemostasis,
    'recall',
    'How does PAI-1 restrain fibrinolysis?',
    [
      [
        'It inhibits plasminogen activators such as TPA and UPA',
        'Inactivating activators reduces conversion of plasminogen to plasmin.',
      ],
      ['It cross-links all fibrin as factor XIIIa', 'Cross-linking is the factor XIIIa mechanism.'],
      [
        'It acts as the primary receptor for platelet VWF adhesion',
        'That role belongs to GPIb/IX/V.',
      ],
      [
        'It serves as the principal protease digesting fibrin',
        'Plasmin digests fibrin; PAI-1 restrains its generation.',
      ],
    ],
    'Fibrinolysis can be regulated at the activator level before plasmin is generated.',
  ),
  q(
    78,
    'Hemostasis',
    696,
    hemostasis,
    'recall',
    'Which inhibitor primarily neutralizes free plasmin?',
    [
      ['α2-antiplasmin', 'It rapidly inactivates circulating free plasmin.'],
      ['PAI-1', 'PAI-1 chiefly inhibits plasminogen activators rather than free plasmin itself.'],
      ['TPA', 'TPA promotes plasmin generation rather than neutralizing free plasmin.'],
      [
        'GPIIb/IIIa',
        'This is a platelet aggregation receptor rather than a soluble plasmin inhibitor.',
      ],
    ],
    'Activators and the active fibrinolytic enzyme are controlled by different inhibitors.',
  ),
  q(
    79,
    'Hemostasis',
    697,
    hemostasis,
    'recall',
    'Why is D-dimer more specific for cross-linked fibrin breakdown than general fibrinogen degradation products?',
    [
      [
        'It contains linked D domains from separate fibrin molecules',
        'Factor XIIIa cross-links fibrin; plasmin digestion releases the linked D-domain product.',
      ],
      [
        'It is formed simply by digesting uncross-linked fibrinogen',
        'The linked domains require prior cross-linking of fibrin.',
      ],
      [
        'It is the same molecule as all unmodified fibrinogen',
        'It is a degradation fragment, not intact fibrinogen.',
      ],
      [
        'It directly identifies the anatomical location of every clot',
        'Its molecular origin does not itself localize a clot.',
      ],
    ],
    'D-dimer reflects cross-linked fibrin formation and breakdown, not a clot location or diagnosis by itself.',
  ),
  q(
    80,
    'Hemostasis',
    697,
    hemostasis,
    'recall',
    'How does activated thrombin-activatable fibrinolysis inhibitor reduce fibrinolysis?',
    [
      [
        'It removes exposed C-terminal lysines from fibrin',
        'Removing binding sites reduces attachment of plasminogen and TPA to fibrin.',
      ],
      [
        'It directly converts all plasminogen to plasmin',
        'That would promote rather than inhibit fibrinolysis.',
      ],
      [
        'It cross-links fibrin as a substitute for factor XIIIa',
        'Its stated action is removing terminal lysine residues, not fibrin cross-linking.',
      ],
      [
        'It serves as the principal activator of tissue factor',
        'The described mechanism concerns access of fibrinolytic proteins to fibrin.',
      ],
    ],
    'Fibrin-surface modification regulates access of the fibrinolytic machinery.',
  ),
];
