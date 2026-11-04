import type { Question } from './types';

type Choice = readonly [text: string, rationale: string];
function item(
  id: string,
  subjectId: string,
  topic: string,
  page: number,
  stem: string,
  choices: readonly Choice[],
  takeaway: string,
  kind: Question['kind'] = 'case',
): Question {
  return {
    id,
    subjectId,
    topic,
    kind,
    difficulty: kind === 'case' ? 'Application' : 'Foundation',
    stem,
    options: choices.map(([text, rationale], i) => ({
      id: String.fromCharCode(65 + i),
      text,
      rationale,
    })),
    correctOptionId: 'A',
    takeaway,
    version: 1,
    source: {
      title: 'Medical Laboratory Science Review',
      edition: '5th edition (Harr, 2019)',
      pdfPage: page,
      chapter:
        subjectId === 'microbiology'
          ? '8 Microbiology'
          : subjectId === 'parasitology'
            ? id === 'para-h5-011'
              ? '8.11 Parasitology (PDF pages 701–702)'
              : '8.11 Parasitology'
            : page < 300
              ? '5 Laboratory Operations'
              : '10 Education and Management',
    },
  };
}
const management = 'histopathology-lab-management-laws';
const micro = 'microbiology';
const para = 'parasitology';

// Original items grounded in the retained, page-marked Harr extraction; not publisher questions.
// The correct option is stored as A; session presentation already shuffles option order.
export const harrLaboratoryQuestions: Question[] = [
  item(
    'lm-h5-001',
    management,
    'Quality assessment',
    265,
    'A supervisor wants to spot a gradual drift in control results across successive runs. Which display preserves the time order needed for this task?',
    [
      [
        'A Levey-Jennings chart',
        'It plots control measurements against successive runs, making drift visible.',
      ],
      [
        'A histogram without run labels',
        'A histogram summarizes frequency but loses the chronological sequence.',
      ],
      [
        'A method-comparison scatterplot without run order',
        'A comparison scatterplot relates paired measurements but does not preserve successive control runs.',
      ],
      [
        'A table containing only the monthly control mean',
        'A summary mean hides the within-month chronological pattern.',
      ],
    ],
    'Time-ordered control charts reveal patterns that a frequency summary can hide.',
  ),
  item(
    'lm-h5-002',
    management,
    'Quality assessment',
    265,
    'A control monitor adds each new deviation from the target to all previous deviations. What is the principle of this monitor?',
    [
      ['Cumulative summation', 'CUSUM accumulates signed deviations from the target mean.'],
      ['Ranking independent patient results', 'Ranks do not accumulate control deviations.'],
      [
        'Calculating the median only',
        'A median is a central value, not a running sum of deviations.',
      ],
      [
        'Discarding negative deviations',
        'Discarding negative values would bias the cumulative record.',
      ],
    ],
    'CUSUM retains the direction and accumulation of deviations from the target.',
  ),
  item(
    'lm-h5-003',
    management,
    'Quality assessment',
    266,
    'Two control products have identical assigned analyte values, but only one behaves like patient specimens during the assay. Which property favors that product?',
    [
      ['A specimen-like matrix', 'Control matrix should resemble the material routinely tested.'],
      [
        'An unrelated solvent matrix',
        'A dissimilar matrix can behave differently in the analytical process.',
      ],
      [
        'Matching analyte concentration regardless of matrix',
        'Equal assigned concentration does not ensure specimen-like analytical behavior.',
      ],
      [
        'Aqueous composition assumed equivalent without evaluation',
        'A non-specimen matrix may respond differently and should not be assumed equivalent.',
      ],
    ],
    'Control selection considers matrix and stability, not just assigned concentration.',
  ),
  item(
    'lm-h5-004',
    management,
    'Quality assessment',
    267,
    'After a reagent lot change, both control levels remain consistently above their earlier means rather than rising gradually. Which pattern best fits?',
    [
      ['A shift', 'A sustained displacement to one side of the mean is a shift.'],
      [
        'A progressive trend',
        'A trend moves progressively upward or downward rather than stepping to a new level.',
      ],
      [
        'Unchanged analytical performance',
        'The persistent displacement is evidence of changed performance.',
      ],
      [
        'A patient-specific biological change',
        'Two control materials do not share a patient-specific physiological change.',
      ],
    ],
    'A stepwise change suggests a shift; progressive drift suggests a trend.',
  ),
  item(
    'lm-h5-005',
    management,
    'Quality assessment',
    267,
    'Control values rise progressively while a reagent slowly evaporates. What error pattern is most consistent with this mechanism?',
    [
      [
        'A systematic trend',
        'Progressive changes in the test system can move successive results in one direction.',
      ],
      [
        'A single transcription error only',
        'A single transcription error does not explain progressive movement across runs.',
      ],
      ['Purely random scatter', 'Random scatter does not have the sustained direction described.'],
      [
        'An improved detection limit',
        'Drift in controls does not demonstrate a better detection limit.',
      ],
    ],
    'A changing reagent condition can cause systematic drift before a rejection limit is crossed.',
  ),
  item(
    'lm-h5-006',
    management,
    'Laboratory statistics',
    270,
    'A comparison method reads 3 units too high at both a low and a high concentration. Which error model fits the stated observations?',
    [
      ['Constant error', 'The absolute difference stays the same across concentrations.'],
      [
        'Proportional error only',
        'Pure proportional error changes its absolute magnitude with concentration.',
      ],
      ['No method bias', 'A consistent positive difference is bias.'],
      [
        'Random imprecision alone',
        'A consistent equal positive offset is systematic, not merely random scatter.',
      ],
    ],
    'A constant absolute offset differs from a constant percentage error.',
  ),
  item(
    'lm-h5-007',
    management,
    'Laboratory statistics',
    270,
    'A method overreads by approximately 8% throughout its measuring range. Why is the absolute error larger in high samples?',
    [
      [
        'The error is proportional to concentration',
        'A fixed percentage produces a larger numerical difference at higher concentrations.',
      ],
      [
        'The error is a fixed absolute offset',
        'A fixed offset would be the same number of units at both levels.',
      ],
      [
        'A fixed absolute offset becomes a larger percentage at higher concentration',
        'For a fixed offset, relative error decreases rather than increases as concentration rises.',
      ],
      [
        'Random scatter explains the same positive percentage at every level',
        'A sustained concentration-related positive difference suggests proportional bias.',
      ],
    ],
    'Proportional bias increases in absolute magnitude with the analyte level.',
  ),
  item(
    'lm-h5-008',
    management,
    'Laboratory statistics',
    272,
    'Paired methods correlate closely, but the candidate consistently reports higher results. Which conclusion is justified?',
    [
      [
        'High correlation alone does not establish agreement',
        'Methods can track one another closely while retaining systematic bias.',
      ],
      [
        'The methods are interchangeable because correlation is high',
        'Correlation does not rule out clinically important offsets.',
      ],
      ['A high correlation proves a zero intercept', 'The intercept must be assessed separately.'],
      [
        'Bias can be ignored when values span a wide range',
        'A wide range can increase correlation while bias remains.',
      ],
    ],
    'Examine bias and the regression relationship, not correlation alone.',
  ),
  item(
    'lm-h5-009',
    management,
    'Laboratory statistics',
    272,
    'A method comparison gives y = 6 + 1.00x. Which component describes the constant error?',
    [
      ['The intercept of 6', 'The intercept predicts a fixed offset independent of x.'],
      ['The slope of 1.00', 'A slope of one implies no proportional difference in this model.'],
      [
        'The slope-minus-one difference of zero',
        'That difference addresses proportional bias, not the nonzero constant offset.',
      ],
      [
        'The product 6x',
        'The fitted model adds six; it does not multiply the concentration by six.',
      ],
    ],
    'In a linear comparison, the intercept represents constant offset.',
  ),
  item(
    'lm-h5-010',
    management,
    'Laboratory statistics',
    272,
    'For y = 0 + 1.15x, what systematic behavior does the candidate method show?',
    [
      [
        'A positive proportional bias of 15%',
        'The slope exceeds one by 0.15 with no intercept offset.',
      ],
      [
        'A constant positive offset of 15 units',
        'The error scales with x; it is not fixed at 15 units.',
      ],
      ['A negative proportional bias', 'A slope above one predicts higher, not lower, results.'],
      ['Perfect agreement over the range', 'Agreement would require slope one and intercept zero.'],
    ],
    'A nonunit slope signals a concentration-dependent difference.',
  ),
  item(
    'lm-h5-011',
    management,
    'Laboratory statistics',
    270,
    'Replicate measurements from two instruments have SDs of 4 and 2 units. What is the larger-variance to smaller-variance ratio?',
    [
      ['4', 'The variance ratio is 4 squared divided by 2 squared, or 16/4.'],
      ['2', 'This divides standard deviations without squaring them.'],
      ['8', 'The product of the standard deviations is not the variance ratio.'],
      ['0.5', 'This reverses the SD ratio and does not compare variances.'],
    ],
    'Variance is SD squared; a variance ratio is not an SD ratio.',
  ),
  item(
    'lm-h5-012',
    management,
    'Laboratory statistics',
    270,
    'A candidate method has a mean of 106 units and the comparison method has a mean of 100 units. Using candidate minus comparison, what is the bias?',
    [
      ['+6 units', 'Subtracting 100 from 106 gives a positive difference of 6.'],
      ['-6 units', 'This reverses the stated subtraction order.'],
      ['+206 units', 'Adding means does not calculate bias.'],
      ['0 units', 'The means differ, so the measured bias is not zero.'],
    ],
    'State the subtraction convention when reporting signed bias.',
  ),
  item(
    'lm-h5-013',
    management,
    'Laboratory statistics',
    275,
    'Among 80 people with an independently established condition, 72 test positive. What is the sensitivity in this evaluation?',
    [
      ['90%', 'Sensitivity is 72 true positives divided by 80 affected people.'],
      ['10%', 'This is the false-negative fraction.'],
      ['72%', 'The numerator alone is not a percentage of the affected group.'],
      [
        'Cannot be calculated without true negatives',
        'Sensitivity uses affected people; true negatives are not required.',
      ],
    ],
    'Sensitivity uses the affected group as its denominator.',
  ),
  item(
    'lm-h5-014',
    management,
    'Laboratory statistics',
    275,
    'A study has 30 true-positive and 10 false-positive results. What proportion of positive results are true positives?',
    [
      ['75%', 'Positive predictive value is 30 divided by 30 + 10.'],
      ['25%', 'This is the false-positive share of positive results.'],
      ['33.3%', 'Dividing false positives by true positives is not predictive value.'],
      ['100%', 'The positive group includes false positives.'],
    ],
    'Positive predictive value conditions on the observed positive test result.',
  ),
  item(
    'lm-h5-015',
    management,
    'Laboratory statistics',
    275,
    'A study has 180 true negatives and 20 false negatives. What is the negative predictive value?',
    [
      ['90%', 'NPV is 180 divided by the 200 negative results.'],
      ['10%', 'This is the false-negative share of all negative results.'],
      [
        'Cannot be calculated without false positives',
        'False positives do not enter the NPV denominator.',
      ],
      ['180%', 'A count is not a percentage and probability cannot exceed 100%.'],
    ],
    'Negative predictive value asks how often a negative result is truly negative.',
  ),
  item(
    'lm-h5-016',
    management,
    'Laboratory statistics',
    276,
    'A laboratory mean is 112 units; its peer-group mean is 100 and peer-group SD is 4. What is the signed standard deviation index?',
    [
      ['+3', 'SDI = (112 - 100)/4 = +3.'],
      ['+12', 'The difference must be divided by the peer SD.'],
      ['-3', 'The laboratory mean is higher, so this subtraction gives a positive sign.'],
      ['+28', 'Dividing the laboratory mean alone by SD omits the peer mean.'],
    ],
    'SDI expresses the laboratory-to-peer difference in peer SD units.',
  ),
  item(
    'lm-h5-017',
    management,
    'Quality assessment',
    276,
    "A delta check flags an unexpectedly large change from a patient's earlier result. What does the flag establish?",
    [
      [
        'A discrepancy requiring investigation, not a proven cause',
        'True clinical change, specimen error, contamination, or analytical error can cause the discrepancy.',
      ],
      [
        'Definite specimen misidentification',
        'Misidentification is possible but is not proved by the flag.',
      ],
      ['Definite disease progression', 'Technical and preanalytical causes remain possible.'],
      [
        'Automatic invalidation of all controls',
        'A patient delta discrepancy does not by itself invalidate control results.',
      ],
    ],
    'A delta check is an investigation trigger rather than a diagnosis.',
  ),
  item(
    'lm-h5-018',
    management,
    'Management',
    770,
    'A supervisor sets a turnaround-time objective, assigns tasks, oversees implementation, and evaluates outcomes. Which sequence best describes these activities?',
    [
      [
        'Planning, organizing, directing, controlling',
        'These are the four core management functions described in the source.',
      ],
      [
        'Controlling, directing, organizing, planning',
        'This reverses the sequence from objective setting through evaluation.',
      ],
      [
        'Planning, controlling, organizing, directing',
        'Task assignment is organizing, while outcome evaluation belongs at the end.',
      ],
      [
        'Organizing, planning, controlling, directing',
        'The objective is set before task assignment, and evaluation follows implementation.',
      ],
    ],
    'Management connects objectives, organization, execution, and evaluation.',
  ),
  item(
    'lm-h5-019',
    management,
    'Management',
    770,
    'Which management activity is illustrated by comparing actual reagent use with the planned budget and correcting excessive waste?',
    [
      ['Controlling', 'Controlling evaluates resource use and outcomes and modifies the process.'],
      ['Planning only', 'Planning sets objectives; this example evaluates execution against them.'],
      [
        'Organizing only',
        'Organizing assigns resources and responsibilities rather than assessing actual performance against a plan.',
      ],
      [
        'Directing only',
        'Directing guides execution, while comparison and corrective action are controlling.',
      ],
    ],
    'Controlling closes the loop between plans and actual performance.',
  ),
  item(
    'lm-h5-020',
    management,
    'Management',
    769,
    'A manager redesigns a role to provide meaningful responsibility, recognition, and opportunities for achievement. Which theory most directly emphasizes these motivators?',
    [
      [
        "Herzberg's motivation theory",
        'Achievement, responsibility, recognition, and growth are job-related motivators.',
      ],
      [
        "Maslow's hierarchy identified solely by its order of needs",
        'The scenario specifically emphasizes job-design motivators rather than a hierarchy of needs.',
      ],
      [
        "McGregor's theory identified solely by assumptions about employee participation",
        "The stated achievement and recognition emphasis is more directly Herzberg's framework.",
      ],
      [
        'A theory focused only on salary and workplace conditions',
        "Herzberg's job-related motivators include achievement, responsibility, recognition, and growth.",
      ],
    ],
    'Meaningful work and opportunities for growth can support motivation.',
  ),
  item(
    'lm-h5-021',
    management,
    'Management',
    766,
    'A training assessment judges each learner against an established competency checklist rather than ranking colleagues. What assessment approach is this?',
    [
      ['Criterion referenced', 'Performance is compared with predetermined competencies.'],
      ['Norm referenced', 'Norm referencing compares performance with the group.'],
      [
        'Percentile ranking within the class',
        'Percentiles compare learners with a group rather than a predetermined competency standard.',
      ],
      [
        'A class-mean grading curve',
        'A curve derives performance categories from group results, not the stated checklist.',
      ],
    ],
    'Criterion-referenced assessment evaluates performance against explicit standards.',
  ),
  item(
    'lm-h5-022',
    management,
    'Management',
    768,
    'A learner physically performs an instrument calibration while an instructor observes technique. Which educational domain is most directly demonstrated by the hands-on execution?',
    [
      ['Psychomotor', 'Performing the physical procedure demonstrates psychomotor skill.'],
      [
        'Affective only',
        'Affective objectives emphasize attitudes and values rather than motor execution.',
      ],
      ['Cognitive only', 'Knowledge informs the task, but physical execution is psychomotor.'],
      [
        'Affective valuation of the result alone',
        'Valuing a result differs from the hands-on execution emphasized in the question.',
      ],
    ],
    'Distinguish knowing a procedure from physically performing it.',
  ),
  item(
    'lm-h5-023',
    management,
    'Management',
    766,
    'A learner interprets a calibration curve and explains why a result is outside the measuring range. Which educational domain is emphasized?',
    [
      ['Cognitive', 'Analysis and application of knowledge are cognitive objectives.'],
      ['Psychomotor only', 'The stated task is interpretation, not manual execution.'],
      ['Affective only', 'The task asks for analysis rather than a value judgment or attitude.'],
      [
        'Motor coordination alone',
        'The stated emphasis is analysis of the curve and result, not only physical coordination.',
      ],
    ],
    'Cognitive objectives address understanding, analysis, and problem solving.',
  ),
  item(
    'lm-h5-024',
    management,
    'Management',
    768,
    'A training course states an objective of troubleshooting but tests only memorized instrument names. Which assessment quality is most directly threatened?',
    [
      [
        'Validity relative to the stated objective',
        'An assessment should measure the abilities specified by its objectives.',
      ],
      [
        'Reliability alone',
        'A test may produce consistent scores while consistently measuring the wrong skill.',
      ],
      [
        'Objectivity of scoring alone',
        'Objective scoring does not resolve a mismatch between assessed content and learning objectives.',
      ],
      [
        'Practicality alone',
        'Convenient administration does not establish that troubleshooting is being assessed.',
      ],
    ],
    'Align assessment tasks with the skills the course promises to teach.',
  ),
  item(
    'lm-h5-025',
    management,
    'Management',
    769,
    'A class divides a laboratory problem among small-group members and combines their reasoning into a solution. What is the main educational benefit of this case-study approach?',
    [
      [
        'Collaborative problem solving using higher-level reasoning',
        'Case discussion integrates contributions and application of knowledge.',
      ],
      [
        'Eliminating the need to evaluate evidence',
        'Reasoning about evidence remains central to a case study.',
      ],
      [
        'Replacing all practical training',
        'Discussion does not establish every hands-on competency.',
      ],
      [
        'Guaranteeing every proposed answer is correct',
        'Group participation does not guarantee accuracy.',
      ],
    ],
    'Case-based collaboration should integrate evidence, not merely pool opinions.',
  ),
  item(
    'lm-h5-026',
    management,
    'Management',
    771,
    'A costing exercise traces the reagent consumed specifically by one assay to that assay. How is this cost classified in that exercise?',
    [
      ['Direct cost', 'Costs specifically attributable to the test are direct costs.'],
      [
        'Indirect overhead unrelated to a specific assay',
        'The consumed reagent can be traced specifically to the assay in this exercise.',
      ],
      [
        'Fixed cost regardless of the number of tests',
        'Reagent consumption usually varies with the test volume rather than remaining fixed.',
      ],
      [
        'Reimbursement received from the payer',
        'Reagent consumption is an expense, not payment for the service.',
      ],
    ],
    'Direct costs can be traced specifically to the service being costed.',
  ),
  item(
    'lm-h5-027',
    management,
    'Management',
    772,
    'A hypothetical service has fixed costs of 6,000 units, reimbursement of 30 per test, and variable costs of 10 per test. What volume breaks even?',
    [
      ['300 tests', 'Break-even volume is 6000/(30 - 10) = 300 tests.'],
      ['200 tests', 'This divides fixed cost by reimbursement without subtracting variable cost.'],
      ['600 tests', 'This divides fixed cost only by variable cost.'],
      ['150 tests', 'Adding reimbursement and variable cost gives the wrong denominator.'],
    ],
    'Break-even volume uses the contribution per test: revenue minus variable cost.',
  ),
  item(
    'lm-h5-028',
    management,
    'Management',
    772,
    'With fixed costs above zero, a hypothetical service receives 10 units per test but spends 12 in variable cost. Can increasing volume alone produce break-even under this model?',
    [
      [
        'No; each additional test has negative contribution',
        'Reimbursement minus variable cost is negative, so added volume does not recover fixed cost.',
      ],
      [
        'Yes; any increase in volume guarantees profit',
        'Negative contribution makes each additional test increase the deficit.',
      ],
      [
        'Yes; ignore variable cost in the formula',
        'The break-even model explicitly includes variable cost.',
      ],
      [
        'Yes; divide fixed cost by total revenue plus cost',
        'Adding costs to revenue does not calculate contribution.',
      ],
    ],
    'A positive contribution margin is necessary to recover positive fixed costs.',
  ),
  item(
    'lm-h5-029',
    management,
    'Management',
    773,
    'A staffing budget includes worked hours but omits paid vacation and paid sick leave. What is missing from the wage estimate?',
    [
      ['Paid nonproductive hours', 'Total paid hours include paid leave as well as hours worked.'],
      ['Only unpaid volunteer time', 'Unpaid time does not explain the missing wages described.'],
      ['Only reagent expense', 'Reagent costs do not account for the omitted paid employee time.'],
      [
        'Nothing; wages cover worked hours exclusively',
        'Paid leave still contributes to the wage budget.',
      ],
    ],
    'A wage budget must account for paid time, including paid leave.',
  ),
  item(
    'lm-h5-030',
    management,
    'Management',
    772,
    'A hypothetical insurer pays a laboratory a fixed amount per enrolled member for a defined period regardless of individual test use. What payment model is described?',
    [
      [
        'Capitation',
        'Capitation bases payment on covered members rather than each test performed.',
      ],
      [
        'A separate fee for every test',
        'That describes fee-for-service rather than the stated model.',
      ],
      [
        'Payment based on actual reagent costs plus a surcharge',
        'That is cost-based charging rather than a fixed per-member amount.',
      ],
      [
        'Payment for each billable procedure performed',
        'Procedure-based payment varies with individual service use rather than covered-member count.',
      ],
    ],
    'Distinguish per-member reimbursement from reimbursement per procedure.',
  ),
  item(
    'micro-h5-001',
    micro,
    'Bacteriology',
    612,
    'A catalase-positive coccus uses glucose only in the open oxidation-fermentation tube, not the sealed tube. Which metabolic interpretation best fits?',
    [
      [
        'Oxidative utilization without demonstrated fermentation',
        'Growth and acid production confined to the open tube indicate oxygen-dependent utilization.',
      ],
      [
        'Fermentation demonstrated in both tubes',
        'The sealed tube is negative in the stated result.',
      ],
      ['No glucose utilization', 'The open tube shows utilization.'],
      [
        'Obligate anaerobic glucose metabolism',
        'The positive reaction occurs with oxygen, not in the sealed tube.',
      ],
    ],
    'Interpret the open and sealed O-F tubes together.',
  ),
  item(
    'micro-h5-002',
    micro,
    'Bacteriology',
    612,
    'A coagulase-negative staphylococcus from a urine culture is novobiocin resistant. Between S. epidermidis and S. saprophyticus, which is favored?',
    [
      ['S. saprophyticus', 'Novobiocin resistance favors S. saprophyticus in this comparison.'],
      ['S. epidermidis', 'S. epidermidis is usually novobiocin susceptible.'],
      [
        'Both species are established equally by resistance',
        'The reaction helps differentiate these two candidates.',
      ],
      [
        'Neither can be a staphylococcus because coagulase is negative',
        'Many staphylococci are coagulase negative.',
      ],
    ],
    'Use novobiocin as a differentiating clue within an appropriate identification scheme.',
  ),
  item(
    'micro-h5-003',
    micro,
    'Bacteriology',
    614,
    'Why can stabbing blood agar enhance demonstration of an oxygen-labile streptococcal hemolysin?',
    [
      [
        'The stab creates a locally reduced-oxygen environment',
        'Streptolysin O is oxygen labile and can be better expressed below the surface.',
      ],
      ['It converts cocci into bacilli', 'Agar stabbing does not change bacterial cell shape.'],
      [
        'It supplies a specific coagulase substrate',
        'The purpose described concerns streptococcal hemolysis, not coagulase.',
      ],
      ['It proves resistance to all antibiotics', 'Hemolysis is not a universal resistance test.'],
    ],
    'Oxygen conditions can affect observed hemolysis.',
  ),
  item(
    'micro-h5-004',
    micro,
    'Bacteriology',
    614,
    'A beta-hemolytic streptococcus is PYR positive but CAMP and hippurate negative. Which presumptive group best fits this combination?',
    [
      ['Group A', 'The cited scheme associates this combination with group A streptococci.'],
      [
        'Group B',
        'Group B typically has positive CAMP and hippurate reactions and a negative PYR test.',
      ],
      [
        'A coagulase-positive staphylococcus',
        'The specimen is described as a streptococcus; this is not a coagulase identification scheme.',
      ],
      ['An acid-fast bacillus', 'Acid-fast bacilli are not beta-hemolytic cocci in this scheme.'],
    ],
    'Combine reactions rather than assigning a group from hemolysis alone.',
  ),
  item(
    'micro-h5-005',
    micro,
    'Bacteriology',
    614,
    'A trainee labels any bacitracin-inhibited beta-hemolytic streptococcus as confirmed group A. What is the key limitation?',
    [
      [
        'Other streptococcal groups may also be inhibited',
        'Bacitracin inhibition alone lacks sufficient specificity for confirmation.',
      ],
      ['Group A organisms cannot hemolyze blood agar', 'Group A streptococci are beta hemolytic.'],
      [
        'All beta-hemolytic organisms are staphylococci',
        'Beta hemolysis does not define that genus.',
      ],
      [
        "Bacitracin identifies the patient's antibodies",
        'This is an organism reaction, not a patient antibody measurement.',
      ],
    ],
    'A presumptive screening reaction is not species or group confirmation.',
  ),
  item(
    'micro-h5-006',
    micro,
    'Bacteriology',
    616,
    'In a presumptive pneumococcal workup, colonies disappear after an appropriate bile-solubility reaction. What process explains this?',
    [
      ['Bile-salt-enhanced autolysis', 'Deoxycholate promotes lysis of pneumococcal cells.'],
      [
        'Increased capsule production visible as larger colonies',
        'The observed reaction is colony dissolution, not enlargement.',
      ],
      [
        'Conversion of the organism to a yeast',
        'Bile solubility does not transform bacteria into fungi.',
      ],
      [
        'Fermentation producing new colonies',
        'The reaction removes visible colonies rather than producing them.',
      ],
    ],
    'Bile solubility reflects lysis rather than growth inhibition alone.',
  ),
  item(
    'micro-h5-007',
    micro,
    'Mycology',
    658,
    'A yeast is urease positive, germ-tube negative, and produces dark pigment on niger-seed medium. Which presumptive identification is supported?',
    [
      [
        'Cryptococcus neoformans',
        'The combination of urease and pigment supports this presumptive identification.',
      ],
      [
        'Candida albicans established by a positive germ tube',
        'The observed germ-tube result is negative.',
      ],
      [
        'A dermatophyte identified from macroconidia',
        'The described tests concern a yeast and do not demonstrate dermatophyte macroconidia.',
      ],
      [
        'Any yeast without further qualification',
        'The combined reactions provide a more specific presumptive clue.',
      ],
    ],
    'Interpret yeast reactions together and retain the distinction between presumptive and definitive identification.',
  ),
  item(
    'micro-h5-008',
    micro,
    'Mycology',
    658,
    'A germ-tube-positive yeast is reported as definitively C. albicans solely from that test. Which organism creates an important limitation?',
    [
      ['Candida dubliniensis', 'C. dubliniensis can also produce germ tubes.'],
      ['A human erythrocyte', 'An erythrocyte is not a germ-tube-forming yeast.'],
      ['Mycobacterium tuberculosis', 'This bacterium is not identified by yeast germ tubes.'],
      ['Schistosoma mansoni', 'This helminth is not a yeast.'],
    ],
    'A positive germ tube is presumptive and is not unique to C. albicans.',
  ),
  item(
    'micro-h5-009',
    micro,
    'Mycology',
    658,
    'Urease-positive yeast isolates are being compared. Which finding favors Trichosporon over Cryptococcus in the cited morphological scheme?',
    [
      [
        'Arthroconidia',
        'Trichosporon produces arthroconidia, whereas Cryptococcus does not in this scheme.',
      ],
      ['Urease positivity alone', 'Both candidates can produce urease.'],
      ['A bacterial endospore', 'This is not a yeast arthroconidial structure.'],
      ['A blood-group antigen', 'Blood-group antigen testing does not differentiate these yeasts.'],
    ],
    'Shared biochemical reactions may require morphological differentiation.',
  ),
  item(
    'micro-h5-010',
    micro,
    'Mycology',
    660,
    'A yeast grows around a carbohydrate disk on a carbohydrate-free basal medium. What ability is demonstrated?',
    [
      [
        'Assimilation of the supplied carbohydrate as a carbon source',
        'Localized growth indicates use of that carbohydrate for growth.',
      ],
      [
        'Gas-producing fermentation necessarily',
        'Growth-based assimilation does not by itself demonstrate fermentative gas production.',
      ],
      [
        'Resistance to the carbohydrate as an antibiotic',
        'The disk supplies a nutrient rather than an antimicrobial in this test.',
      ],
      [
        'Formation of a capsule necessarily',
        'Capsule formation is not the endpoint of this assay.',
      ],
    ],
    'Do not equate carbohydrate assimilation with carbohydrate fermentation.',
  ),
  item(
    'micro-h5-011',
    micro,
    'Mycology',
    660,
    'A cultured yeast develops a pink-to-coral colony pigment. Which genus is a useful identification consideration?',
    [
      ['Rhodotorula', 'Pink or coral pigmentation is a characteristic clue for this genus.'],
      ['Plasmodium', 'Plasmodium is a blood parasite, not a cultured pigmented yeast.'],
      ['Streptococcus', 'This bacterial genus does not explain the yeast morphology.'],
      ['Taenia', 'Taenia is a cestode, not a yeast genus.'],
    ],
    'Colony pigment is an identification clue that must be integrated with other findings.',
  ),
  item(
    'micro-h5-012',
    micro,
    'Mycology',
    660,
    'Thick-walled terminal structures develop on cornmeal Tween 80 medium during a Candida workup. Which term describes these structures?',
    [
      [
        'Chlamydoconidia',
        'The medium supports production of thick-walled terminal chlamydoconidia.',
      ],
      ['Bacterial endospores', 'These are fungal structures rather than bacterial endospores.'],
      ['Helminth opercula', 'An operculum is an egg feature, not a yeast growth structure.'],
      [
        'Erythrocyte inclusions',
        'The structures develop in fungal culture, not within erythrocytes.',
      ],
    ],
    'Use precise morphological terminology when interpreting fungal structures.',
  ),
  item(
    'micro-h5-013',
    micro,
    'Mycology',
    662,
    'A subcutaneous fungal infection follows a thorn injury during gardening. Which route of acquisition fits sporotrichosis?',
    [
      [
        'Traumatic inoculation from vegetation',
        'Sporothrix can enter skin through thorns or splinters.',
      ],
      ['Ingestion of a malarial blood stage', 'Malaria is not the cause or route described.'],
      [
        'An ABO-incompatible transfusion',
        'Transfusion incompatibility does not produce traumatic fungal inoculation.',
      ],
      ['A reagent-strip reaction', 'A laboratory strip reaction is not an infectious route.'],
    ],
    'Exposure history can connect a subcutaneous infection with traumatic implantation.',
  ),
  item(
    'micro-h5-014',
    micro,
    'Mycology',
    662,
    'A tissue yeast shows multiple narrow attachments arranged around a central parent cell, producing a wheel-like profile. Which organism is classically associated with this morphology?',
    [
      [
        'Paracoccidioides brasiliensis',
        'Multiple peripheral buds create the characteristic wheel-like appearance.',
      ],
      [
        'An Enterococcus species',
        'Enterococci are bacteria and do not form budding tissue yeasts.',
      ],
      ['A Taenia egg', 'A cestode egg is not a budding yeast.'],
      ['A Giardia trophozoite', 'Giardia is a flagellated protozoan with different morphology.'],
    ],
    'Arrangement of budding cells can provide a strong fungal identification clue.',
  ),
  item(
    'micro-h5-015',
    micro,
    'Mycology',
    664,
    'A dermatophyte culture has macroconidia but no microconidia in an adequate preparation. Which genus is supported by the absence of microconidia in the cited scheme?',
    [
      [
        'Epidermophyton',
        'Absence of microconidia is a differentiating feature of this dermatophyte genus.',
      ],
      [
        'Trichophyton identified solely by abundant microconidia',
        'That proposed finding conflicts with the stated absence.',
      ],
      ['A blood-stage Plasmodium', 'A blood parasite is not a dermatophyte.'],
      ['A gram-negative enteric bacillus', 'Bacterial growth does not produce fungal conidia.'],
    ],
    'Interpret presence and absence of fungal structures in an adequate culture preparation.',
  ),
  item(
    'micro-h5-016',
    micro,
    'Mycology',
    668,
    'A mold with a Penicillium-like appearance also demonstrates thermal conversion to a yeast phase. Which candidate warrants consideration?',
    [
      [
        'Talaromyces marneffei',
        'Thermal dimorphism distinguishes this organism from ordinary Penicillium-like molds.',
      ],
      [
        'A routine non-dimorphic Penicillium established without further testing',
        'The yeast conversion is an important distinction that should not be ignored.',
      ],
      [
        'Staphylococcus epidermidis',
        'A staphylococcus does not form the stated mold and yeast phases.',
      ],
      ['Schistosoma haematobium', 'A trematode does not display fungal thermal dimorphism.'],
    ],
    'A dimorphic fungal identification requires appropriate laboratory containment and confirmatory procedures.',
  ),
  item(
    'para-h5-001',
    para,
    'Intestinal protozoa',
    686,
    'A trophozoite interpreted as Trichomonas vaginalis is reported from a routine intestinal specimen. Which inconsistency should trigger review?',
    [
      [
        'Its usual habitat is the urogenital tract',
        'T. vaginalis is site-specific and is not a normal intestinal parasite.',
      ],
      [
        'It is normally an adult intestinal cestode',
        'T. vaginalis is a protozoan, not a tapeworm.',
      ],
      ['It always has a thick-shelled egg', 'Trichomonads do not form helminth eggs.'],
      ['It is normally an erythrocyte parasite', 'That habitat does not describe T. vaginalis.'],
    ],
    'Specimen site is part of parasite identification, not merely administrative metadata.',
  ),
  item(
    'para-h5-002',
    para,
    'Diagnostic methods',
    686,
    'An ameba from oral material resembles an intestinal ameba but contains ingested neutrophils. Which organism deserves consideration?',
    [
      [
        'Entamoeba gingivalis',
        'Oral habitat and ingested polymorphonuclear leukocytes support E. gingivalis.',
      ],
      ['A malaria schizont', 'A blood-stage malaria organism does not fit an oral ameba.'],
      ['An Enterobius egg', 'An egg is not an ameboid trophozoite.'],
      ['A cryptococcal yeast', 'A budding yeast does not explain the amebic morphology described.'],
    ],
    'Combine body site, nuclear features, and ingested material when reviewing an ameba.',
  ),
  item(
    'para-h5-003',
    para,
    'Diagnostic methods',
    687,
    'Motile amebae are observed in CSF during an acute illness after warm freshwater exposure. Which free-living ameba is a key concern?',
    [
      [
        'Naegleria fowleri',
        'Warm freshwater exposure and amebae in CSF fit primary amebic meningoencephalitis.',
      ],
      [
        'Entamoeba coli',
        'This intestinal ameba does not explain the stated acute CSF presentation.',
      ],
      [
        'Iodamoeba butschlii',
        'This intestinal organism does not fit the exposure-site combination.',
      ],
      [
        'Giardia duodenalis',
        'Giardia is an intestinal flagellate rather than the described CSF ameba.',
      ],
    ],
    "Amebae in CSF require urgent escalation through the laboratory's established procedures.",
  ),
  item(
    'para-h5-004',
    para,
    'Nematodes',
    687,
    'A patient has tissue larval migration after accidental exposure to infective dog-ascarid eggs. Why may an ordinary stool egg search fail to establish this infection?',
    [
      [
        'Humans harbor migrating larvae rather than the normal egg-producing adult intestinal cycle',
        'Toxocara tissue infection is investigated with the host-stage distinction in mind.',
      ],
      ['All helminths disappear upon entering human tissues', 'Larvae can persist in tissues.'],
      ['Toxocara is a yeast with no larval stage', 'Toxocara is a nematode with larval stages.'],
      [
        'Any negative stool test excludes all parasites',
        'Specimen suitability depends on organism and life-cycle stage.',
      ],
    ],
    'Choose diagnostic methods for the parasite stage actually present in the host.',
  ),
  item(
    'para-h5-005',
    para,
    'Trematodes',
    689,
    'An operculated egg is found in sputum during investigation of a lung-fluke infection. Why might eggs also be found in stool?',
    [
      [
        'Egg-containing sputum may be swallowed',
        'Paragonimus eggs can reach stool after sputum is swallowed.',
      ],
      [
        'The same egg must be produced by a second intestinal species',
        'A second infection is not necessary to explain both specimen sites.',
      ],
      [
        'Every stool egg originates in the lung',
        'Many intestinal parasites produce eggs directly in the gut.',
      ],
      ['Urine routinely transforms into stool', 'That is not the anatomical explanation.'],
    ],
    "An egg's specimen site may reflect passage from another organ.",
  ),
  item(
    'para-h5-006',
    para,
    'Trematodes',
    695,
    'Two schistosome eggs differ in spine position. Which pairing is correct?',
    [
      [
        'S. mansoni: prominent lateral spine; S. haematobium: terminal spine',
        'These characteristic positions help distinguish the two species.',
      ],
      [
        'S. mansoni: terminal spine; S. haematobium: prominent lateral spine',
        'This reverses the characteristic positions.',
      ],
      [
        'Both are identified by polar filaments',
        'Polar filaments are associated with H. nana eggs, not this distinction.',
      ],
      ['Both are operculated like lung-fluke eggs', 'Schistosome eggs are nonoperculated.'],
    ],
    'Spine position is a key schistosome egg feature.',
  ),
  item(
    'para-h5-007',
    para,
    'Cestodes',
    689,
    'A life-cycle diagram places an adult Echinococcus granulosus in a dog and a hydatid cyst in a human. Which interpretation is correct?',
    [
      [
        'Dog: definitive host; human: accidental intermediate host',
        'The adult occupies the definitive host, while the human harbors the larval cyst.',
      ],
      [
        'Human: definitive host because a cyst is present',
        'A larval cyst does not make the host definitive.',
      ],
      ['Dog: arthropod vector', 'A dog is a mammalian host rather than an arthropod vector.'],
      [
        'Both hosts must carry an adult intestinal worm',
        'The described human stage is a hydatid cyst.',
      ],
    ],
    'Host classification depends on parasite development, not the severity of disease.',
  ),
  item(
    'para-h5-008',
    para,
    'Cestodes',
    695,
    'An egg contains a six-hooked embryo and delicate polar filaments between the embryo and outer shell. Which cestode is favored?',
    [
      ['Hymenolepis nana', 'The combination of oncosphere and polar filaments supports H. nana.'],
      [
        'Taenia species identified by a radially striated shell',
        'Taenia shell striations are a different feature and do not explain polar filaments.',
      ],
      [
        'Schistosoma mansoni',
        'This trematode has a lateral-spined egg, not a six-hooked cestode embryo.',
      ],
      ['Trichuris trichiura', 'Trichuris eggs have bipolar plugs rather than this cestode embryo.'],
    ],
    'Distinguish polar filaments, shell striations, plugs, and spines.',
  ),
  item(
    'para-h5-009',
    para,
    'Blood parasites',
    698,
    'A learner expects the same T. cruzi form in peripheral blood and cardiac muscle. Which correction is appropriate?',
    [
      [
        'Blood contains trypomastigotes; tissues contain amastigotes',
        'T. cruzi has different circulating and tissue forms.',
      ],
      ['Both sites normally contain adult helminths', 'T. cruzi is a protozoan, not a helminth.'],
      [
        'Only an intestinal cyst occurs in either site',
        "That is not the stated parasite's blood-tissue cycle.",
      ],
      [
        'Tissue forms must be malaria gametocytes',
        'Malaria gametocytes do not describe tissue T. cruzi.',
      ],
    ],
    'Life-cycle stage and specimen site determine the morphology expected.',
  ),
  item(
    'para-h5-010',
    para,
    'Blood parasites',
    700,
    'Which pair of human malaria species classically shares reticulocyte preference, Schuffner stippling, and a true relapse stage?',
    [
      [
        'P. vivax and P. ovale',
        'Both favor young red cells and can have dormant liver stages associated with relapse.',
      ],
      ['P. falciparum and P. malariae', 'This pair does not share the stated set of features.'],
      ['Babesia and T. cruzi', 'These are not a pair of Plasmodium species.'],
      [
        'Giardia and Cryptosporidium',
        'These intestinal parasites do not infect erythrocytes as malaria species.',
      ],
    ],
    'Integrate red-cell preference and life-cycle biology with smear morphology.',
  ),
  item(
    'para-h5-011',
    para,
    'Blood parasites',
    701,
    'An isolate suspected to be P. knowlesi looks falciparum-like as an early ring and malariae-like at later stages. What is the best interpretation?',
    [
      [
        'Morphological overlap can complicate species identification',
        'The source describes resemblance to different species at different stages.',
      ],
      [
        'A change in appearance proves two infections',
        'Developmental variation alone does not prove a mixed infection.',
      ],
      ['Later stages must be a yeast', 'The stated overlap is between malaria species.'],
      [
        'Early-ring morphology always establishes the species uniquely',
        'Early rings can be similar among human malaria species.',
      ],
    ],
    'Recognize the limits of morphology and follow validated confirmation pathways.',
  ),
  item(
    'para-h5-012',
    para,
    'Diagnostic methods',
    692,
    'A laboratory wants to evaluate live protozoan movement in a freshly collected stool specimen. Which preparation directly addresses that goal?',
    [
      [
        'A prompt direct wet preparation',
        'A fresh direct preparation can demonstrate trophozoite motility.',
      ],
      ['A fixed permanent stained smear', 'Fixation prevents observation of live movement.'],
      [
        'A formalin-preserved concentrate as a live motility test',
        'Formalin preservation does not preserve living motility.',
      ],
      ['A dried blood-group card', 'This is not a preparation for stool protozoan movement.'],
    ],
    'The purpose of a preparation determines whether living motility can be assessed.',
  ),
  item(
    'para-h5-013',
    para,
    'Diagnostic methods',
    692,
    'A routine ova-and-parasite workup combines concentration with a permanent stained smear. Why use both?',
    [
      [
        'Concentration improves recovery of selected stages; staining improves protozoan detail',
        'The methods provide complementary recovery and morphological information.',
      ],
      [
        'Both methods preserve live motility equally',
        'Preservation and staining do not preserve living motility.',
      ],
      [
        'A permanent stain eliminates the need for any specimen identification',
        'Correct specimen identification remains essential.',
      ],
      [
        'Concentration guarantees detection of every parasite',
        'No single concentration method detects all parasites reliably.',
      ],
    ],
    'Complementary methods address different stages and identification needs.',
  ),
  item(
    'para-h5-014',
    para,
    'Diagnostic methods',
    692,
    'Iodine highlights a large glycogen vacuole in an amebic cyst; the corresponding vacuole looks clear on a permanent stain. Which interpretation fits?',
    [
      [
        'Iodamoeba butschlii is a useful morphological consideration',
        'Its characteristic glycogen vacuole stains with iodine but appears clear in the permanent preparation.',
      ],
      [
        'The vacuole must contain a malarial pigment',
        'The specimen is an amebic cyst, not a blood-stage parasite.',
      ],
      [
        'The clear space proves every organism has lysed',
        'A recognizable vacuole can be an expected staining feature.',
      ],
      ['The object must be a schistosome spine', 'A vacuole is not an external egg spine.'],
    ],
    'Different preparations can emphasize different features of the same organism.',
  ),
  item(
    'para-h5-015',
    para,
    'Diagnostic methods',
    692,
    'An investigation asks whether recovered Schistosoma eggs remain viable. Which observed event directly supports viability in a hatching test?',
    [
      ['Release of living miracidia', 'Hatching with motile living larvae supports egg viability.'],
      [
        'An unchanged photograph of an egg shell',
        'Shell appearance alone does not establish that the egg is alive.',
      ],
      ['A positive urine protein pad', 'Protein testing does not assess egg viability.'],
      [
        'A high peripheral platelet count',
        'Platelet count is not the endpoint of a miracidial hatching test.',
      ],
    ],
    'Viability assessment requires evidence beyond identifying an egg shell.',
  ),
  item(
    'para-h5-016',
    para,
    'Diagnostic methods',
    694,
    'Why is non-nutrient agar seeded with E. coli used in a culture approach for Acanthamoeba?',
    [
      [
        'The bacteria provide a food source for the amebae',
        'Acanthamoeba feeds on the seeded bacteria and can be recovered from the surface.',
      ],
      [
        'E. coli transforms into Acanthamoeba',
        'The bacteria and amebae remain distinct organisms.',
      ],
      [
        'The agar demonstrates a blood-group antibody',
        'This is a culture method, not immunohematology.',
      ],
      [
        'Bacteria eliminate all protozoan growth',
        'The bacterial lawn supports rather than universally eliminates amebic recovery.',
      ],
    ],
    'In selected cultures, a second organism can supply nutrients rather than represent contamination.',
  ),
  item(
    'para-h5-017',
    para,
    'Diagnostic methods',
    695,
    'A concentration procedure lyses red cells from blood and examines the sediment for microfilariae. Which method is being applied?',
    [
      ['Knott concentration', 'Knott concentration processes blood to recover microfilariae.'],
      ['A urine protein precipitation test', 'This does not concentrate blood microfilariae.'],
      ['A stool occult blood assay', 'Occult blood testing does not recover microfilariae.'],
      [
        'A serum electrophoresis stain',
        'Protein electrophoresis does not provide this parasite concentration step.',
      ],
    ],
    'Match a concentration method to the specimen and parasite sought.',
  ),
  item(
    'para-h5-018',
    para,
    'Nematodes',
    701,
    'Strongyloides infection persists after a patient leaves an endemic area, even without a new environmental exposure. Which life-cycle feature explains this?',
    [
      [
        'Internal autoinfection',
        'Autoinfection allows the infection to continue within the same host.',
      ],
      [
        'An obligatory new bite for every parasite generation',
        'That would not explain persistence without new exposure.',
      ],
      ['Conversion into an intestinal cestode', 'Strongyloides does not become a tapeworm.'],
      ['Absence of any developing larvae', 'Larval development is central to the life cycle.'],
    ],
    'Absence of recent travel does not exclude an autoinfective parasite.',
  ),
  item(
    'para-h5-019',
    para,
    'Diagnostic methods',
    701,
    'Routine concentrated stool and ordinary permanent stains are negative despite concern for coccidian oocysts or microsporidial spores. Which limitation should be considered?',
    [
      [
        'Special stains or targeted assays may be needed',
        'Routine O&P methods may miss Cryptosporidium and microsporidia.',
      ],
      [
        'A negative routine study excludes all intestinal organisms',
        'The routine examination does not have universal sensitivity.',
      ],
      [
        'All such organisms are adult nematodes',
        'Coccidia and microsporidia are not adult nematodes.',
      ],
      [
        'Only a coagulation mixing study can resolve the concern',
        'A coagulation assay does not investigate intestinal parasites.',
      ],
    ],
    'A negative general examination does not substitute for organism-directed testing.',
  ),
  item(
    'para-h5-020',
    para,
    'Diagnostic methods',
    703,
    'Why are red cells lysed in a thick malaria film but preserved in a thin film?',
    [
      [
        'Thick films concentrate blood for detection; thin films retain cellular context for morphology',
        'Laking permits thick-film examination, while fixation preserves red-cell relationships in thin films.',
      ],
      [
        'Thin films must destroy all parasite morphology',
        'Thin films are used to assess parasite morphology.',
      ],
      [
        'Thick films contain less blood than thin films',
        'The thick preparation examines a larger amount of blood.',
      ],
      [
        'Both preparations are interchangeable in every respect',
        'Their preparation and diagnostic strengths differ.',
      ],
    ],
    'Thick and thin blood films provide complementary detection and morphological information.',
  ),
];
