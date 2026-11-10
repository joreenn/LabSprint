import type { Question } from './types';

const references = {
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

// Original items from checked 1-based PDF-viewer pages, not publisher questions.
// Objective trace and duplicate review: docs/CONTENT-CONTINUATION-2026-11-11.md.
export const microParasiteContinuation: Question[] = [
  item(
    'micro-c26-001',
    'microbiology',
    'Bacteriology',
    'recall',
    'During Gram staining, iodine is applied after crystal violet and before decolorization. What is its principal role?',
    [
      [
        'It acts as a mordant by forming a complex with crystal violet.',
        'Iodine forms the crystal violet-iodine complex, which is retained differently by the two major cell-wall types during decolorization.',
      ],
      [
        'It is the final pink counterstain.',
        'Safranin supplies the usual counterstain; iodine is the mordant.',
      ],
      [
        'It removes the primary stain from all bacteria.',
        'Decolorization is a separate step and should not remove the primary complex equally from all bacteria.',
      ],
      [
        'It digests all bacterial cell walls before staining.',
        'The method depends on cell-wall differences rather than complete digestion of both cell-wall types.',
      ],
    ],
    0,
    'Gram iodine forms the crystal violet-iodine complex; it is distinct from the decolorizer and counterstain.',
    'elsevier',
    15,
    'Microbiology: Gram stain mechanism',
  ),
  item(
    'micro-c26-002',
    'microbiology',
    'Bacteriology',
    'case',
    'A lesson compares a vegetative Bacillus cell with its dormant endospore under dry, unfavorable conditions. What is the main biological advantage of endospore formation?',
    [
      [
        'Rapid multiplication into many offspring inside one spore',
        'Endospore formation is a survival process rather than production of numerous offspring.',
      ],
      [
        'Preservation of viability through adverse conditions',
        'A dormant endospore allows the organism to persist when conditions are unsuitable for vegetative growth.',
      ],
      [
        'Conversion of the bacterium into a virus',
        'An endospore remains a bacterial structure and does not become a virus.',
      ],
      [
        "Permanent elimination of the organism's genetic material",
        'The organism must retain genetic information to germinate and resume vegetative growth.',
      ],
    ],
    1,
    'Bacterial endospores favor survival and persistence rather than reproductive multiplication.',
    'elsevier',
    24,
    'Microbiology: bacterial endospores',
  ),
  item(
    'micro-c26-003',
    'microbiology',
    'Bacteriology',
    'case',
    'With appropriate controls, a bacterial catalase reaction produces immediate bubbles after exposure to hydrogen peroxide. Which gas accounts for the bubbles?',
    [
      [
        'Hydrogen sulfide',
        'Hydrogen sulfide production is assessed by other biochemical reactions, not by the catalase reaction.',
      ],
      ['Nitrogen', 'Catalase does not generate nitrogen from hydrogen peroxide.'],
      [
        'Oxygen',
        'Catalase decomposes hydrogen peroxide into water and molecular oxygen; the released oxygen forms bubbles.',
      ],
      ['Methane', 'Methane is not a product of catalase-mediated hydrogen peroxide decomposition.'],
    ],
    2,
    'Catalase converts hydrogen peroxide to water and oxygen; the oxygen causes visible bubbling.',
    'ciulla',
    682,
    'Bacteriology: catalase reaction',
  ),
  item(
    'micro-c26-004',
    'microbiology',
    'Bacteriology',
    'recall',
    'Which property is the basis of Lancefield serologic grouping of streptococci?',
    [
      [
        'The number of cells in each chain',
        'Chain length is an arrangement feature and does not establish a Lancefield group.',
      ],
      [
        'The shade of colony pigment alone',
        'Colony color is not the group-specific serologic target.',
      ],
      [
        'The diameter of any hemolytic zone alone',
        'Hemolysis patterns and Lancefield serologic groups describe different properties.',
      ],
      [
        'Reactivity of group-specific cell-wall antigens',
        'Lancefield grouping detects antigenic differences in the bacterial cell wall.',
      ],
    ],
    3,
    'A streptococcal hemolysis pattern and its cell-wall antigen group are separate observations.',
    'ciulla',
    637,
    'Bacteriology: Lancefield grouping',
  ),
  item(
    'micro-c26-005',
    'microbiology',
    'Bacteriology',
    'case',
    'At the validated reading time, an inoculated TSI tube has blackening in the butt. Which additional biochemical property is indicated by this black reaction?',
    [
      [
        'Hydrogen sulfide production',
        'Hydrogen sulfide reacts with the iron-containing detection system to produce a black precipitate.',
      ],
      [
        'A positive indole reaction',
        'Indole is detected using a separate reagent system and is not identified by TSI blackening.',
      ],
      [
        'Definitive identification of Salmonella from color alone',
        'Several organisms can produce hydrogen sulfide; blackening is a biochemical clue rather than a species identification.',
      ],
      [
        'Absence of all sulfur metabolism',
        'The black reaction supports sulfide production rather than excluding sulfur metabolism.',
      ],
    ],
    0,
    'TSI blackening indicates hydrogen sulfide production and must be interpreted with the rest of the identification scheme.',
    'elsevier',
    32,
    'Microbiology: TSI hydrogen sulfide detection',
  ),
  item(
    'micro-c26-006',
    'microbiology',
    'Bacteriology',
    'recall',
    'An indole test detects a product formed when bacterial tryptophanase acts on which substrate?',
    [
      ['Urea', 'Urease acts on urea to form ammonia; this is a different biochemical test.'],
      [
        'Tryptophan',
        'Tryptophanase breaks down tryptophan, releasing indole along with pyruvate and ammonia.',
      ],
      ['Lactose', 'Lactose utilization is not the substrate reaction measured by an indole test.'],
      ['Hydrogen peroxide', 'Hydrogen peroxide is the substrate for catalase, not tryptophanase.'],
    ],
    1,
    'Indole production reflects tryptophan breakdown by tryptophanase.',
    'ciulla',
    683,
    'Bacteriology: indole test',
  ),
  item(
    'micro-c26-007',
    'microbiology',
    'Specimen collection',
    'case',
    'Two specimens are proposed for anaerobic culture of a deep abscess: a superficial swab left in room air, or a properly collected deep aspirate in an appropriate anaerobic transport system. Why is the latter preferable?',
    [
      [
        'Exposure to room air is required for every anaerobe.',
        'Atmospheric oxygen can impair recovery of oxygen-sensitive anaerobes.',
      ],
      [
        'Any surface swab is guaranteed to represent the deep lesion.',
        'A superficial swab can sample colonizing organisms and may not represent a deep abscess.',
      ],
      [
        'It samples the infected site and limits oxygen exposure during transport.',
        'A deep aspirate better represents the lesion, while appropriate anaerobic transport helps maintain the viability of oxygen-sensitive organisms.',
      ],
      [
        'Anaerobic transport eliminates the need for culture controls.',
        "Specimen transport does not replace the laboratory's required culture and quality-control procedures.",
      ],
    ],
    2,
    'For anaerobic investigation, collect a representative deep specimen and preserve suitable transport conditions.',
    'elsevier',
    48,
    'Microbiology: anaerobic specimen transport',
  ),
  item(
    'micro-c26-008',
    'microbiology',
    'Mycology',
    'case',
    'An educational fungal micrograph shows septate hyphae and an unbranched conidiophore ending in a swollen vesicle with phialides and chains of conidia. Which genus is most consistent with this conidial head?',
    [
      [
        'Candida',
        'Candida typically shows yeast cells and, depending on the species and conditions, pseudohyphae or hyphae rather than this conidial head.',
      ],
      [
        'Rhizopus',
        'Rhizopus produces spores within a sporangium rather than phialides arranged on an Aspergillus-type vesicle.',
      ],
      [
        'Mucor',
        'Mucor also produces sporangia rather than the described phialide-bearing conidial head.',
      ],
      [
        'Aspergillus',
        'The terminal vesicle bearing phialides and conidial chains is characteristic of Aspergillus. Further features are needed for species identification.',
      ],
    ],
    3,
    'An Aspergillus conidial head has a terminal vesicle, phialides, and chains of conidia.',
    'elsevier',
    70,
    'Mycology: Aspergillus conidial structures',
  ),
  item(
    'micro-c26-009',
    'microbiology',
    'Mycology',
    'case',
    'A reference image of a dimorphic fungus in its mold phase shows large, thick-walled macroconidia with prominent fingerlike surface projections. Which organism is classically associated with these tuberculate macroconidia?',
    [
      [
        'Histoplasma capsulatum',
        'Tuberculate macroconidia are a classic mold-phase clue to Histoplasma; morphology alone is not definitive confirmation.',
      ],
      [
        'Cryptococcus neoformans',
        'Cryptococcus is a yeast and does not produce this characteristic mold-phase macroconidium.',
      ],
      [
        'Candida albicans',
        'Candida chlamydoconidia are not the tuberculate macroconidia described here.',
      ],
      [
        'Trichophyton rubrum',
        'Dermatophyte conidial morphology differs from the characteristic tuberculate macroconidia of Histoplasma.',
      ],
    ],
    0,
    'Tuberculate macroconidia are an important Histoplasma mold-phase clue, distinct from its tissue yeast form.',
    'elsevier',
    78,
    'Mycology: Histoplasma mold morphology',
  ),
  item(
    'micro-c26-010',
    'microbiology',
    'Virology',
    'case',
    'For a person with a documented completed hepatitis B vaccine series and no passive antibody administration, a teaching panel shows HBsAg negative, total anti-HBc negative, and anti-HBs positive. Which interpretation best fits this pattern?',
    [
      [
        'Resolved natural infection, established by a positive core antibody',
        'The stated total anti-HBc is negative; resolved natural infection usually leaves a positive total anti-HBc.',
      ],
      [
        'The pattern is consistent with immunity from vaccination.',
        'Vaccination induces antibody to surface antigen without producing anti-HBc. Interpret the actual result with vaccination documentation and assay criteria.',
      ],
      [
        'Active HBV infection is proven by HBsAg positivity.',
        'HBsAg is negative in the stated panel.',
      ],
      [
        'All three markers are antibodies against the viral core.',
        'HBsAg is a surface antigen, anti-HBs targets surface antigen, and anti-HBc targets core antigen.',
      ],
    ],
    1,
    'HBV vaccination produces anti-HBs without anti-HBc; natural infection and vaccination have different serologic patterns.',
    'elsevier',
    204,
    'Immunology and serology: hepatitis B markers, Table 6-4',
  ),
  item(
    'micro-c26-011',
    'microbiology',
    'Virology',
    'case',
    'A clinician suspects acute hepatitis A in a symptomatic patient without recent HAV vaccination. Which antibody measurement most directly supports current or recent HAV infection?',
    [
      [
        'IgG anti-HAV alone',
        'IgG anti-HAV can persist after past infection or vaccination and alone does not establish recent infection.',
      ],
      [
        'Anti-HBs',
        'Anti-HBs is an antibody to hepatitis B surface antigen, not a marker of HAV infection.',
      ],
      [
        'IgM anti-HAV',
        'IgM anti-HAV is used to support current or recent HAV infection. Interpret it with symptoms, exposure history, and possible false positivity.',
      ],
      ['Total serum IgE', 'Total IgE is not a virus-specific marker of acute hepatitis A.'],
    ],
    2,
    'IgM anti-HAV supports recent HAV infection in the appropriate clinical setting; IgG alone does not date the infection.',
    'elsevier',
    203,
    'Immunology and serology: hepatitis A markers',
  ),
  item(
    'micro-c26-012',
    'microbiology',
    'Bacteriology',
    'case',
    'A genetics exercise describes transfer of an antibiotic-resistance plasmid from a donor bacterium to a recipient by direct cell-to-cell contact. Which process is being illustrated?',
    [
      [
        'Transduction',
        'Transduction transfers bacterial genetic material through a bacteriophage rather than the stated direct-contact process.',
      ],
      [
        'Transformation',
        'Transformation involves uptake of extracellular DNA rather than direct donor-recipient conjugative transfer.',
      ],
      [
        'Endospore formation',
        'Sporulation is a survival process and does not describe plasmid transfer between the two cells.',
      ],
      [
        'Conjugation',
        'Conjugation permits direct transfer of genetic material, including conjugative plasmids, between bacterial cells.',
      ],
    ],
    3,
    'Conjugation can disseminate plasmid-borne resistance genes by direct transfer between bacteria.',
    'elsevier',
    18,
    'Microbiology: plasmids and conjugation',
  ),

  item(
    'para-c26-001',
    'parasitology',
    'Diagnostic methods',
    'case',
    'An intestinal amebic cyst has morphology compatible with the E. histolytica/E. dispar group. Can routine cyst morphology alone establish which of these two species is present?',
    [
      [
        'No; species-specific antigen or molecular testing is needed when differentiation is required.',
        'The cysts are morphologically indistinguishable. Use an assay validated for species differentiation rather than assigning identity from cyst appearance.',
      ],
      [
        'Yes; every four-nucleate cyst is necessarily E. histolytica.',
        'Nuclear number alone cannot distinguish E. histolytica from E. dispar.',
      ],
      [
        'Yes; stool color directly determines the species.',
        'Stool color is not a species-specific identification method.',
      ],
      [
        'No; neither organism ever produces a cyst.',
        'Both organisms can be present as intestinal cysts; shared morphology is the limitation.',
      ],
    ],
    0,
    'E. histolytica and E. dispar cannot be distinguished by routine cyst morphology alone.',
    'ciulla',
    811,
    'Parasitology: Entamoeba species differentiation',
  ),
  item(
    'para-c26-002',
    'parasitology',
    'Intestinal protozoa',
    'case',
    'A stained stool preparation contains round organisms dominated by a large central vacuolar body, with a thin rim of cytoplasm and small peripheral nuclei. Which organism best fits this classic vacuolar appearance?',
    [
      [
        'Giardia duodenalis',
        'Giardia trophozoites and cysts have characteristic nuclei and internal structures rather than this dominant central vacuolar body.',
      ],
      [
        'Blastocystis species',
        'The classic vacuolar form of Blastocystis has a prominent central body with a peripheral cytoplasmic rim containing nuclei. The finding alone does not establish the cause of symptoms.',
      ],
      [
        'Trichuris trichiura',
        'Trichuris is a helminth whose eggs have bipolar plugs rather than a protozoal vacuolar body.',
      ],
      [
        'Taenia species',
        'Taenia eggs have an embryophore and oncosphere rather than the described protozoal structure.',
      ],
    ],
    1,
    'A large central vacuolar body and peripheral nuclei are clues to the vacuolar form of Blastocystis.',
    'ciulla',
    812,
    'Parasitology: Blastocystis morphology',
  ),
  item(
    'para-c26-003',
    'parasitology',
    'Intestinal protozoa',
    'case',
    'An intestinal trophozoite in a permanent stain has two nuclei with fragmented karyosomes and no distinct peripheral chromatin. Which organism is favored among these choices?',
    [
      [
        'Entamoeba coli',
        'E. coli trophozoites ordinarily have one nucleus with coarse peripheral chromatin, unlike the described binucleate pattern.',
      ],
      [
        'Balantidium coli',
        'Balantidium has a conspicuous macronucleus and cilia rather than two similar nuclei with fragmented karyosomes.',
      ],
      [
        'Dientamoeba fragilis',
        'Many D. fragilis trophozoites are binucleate, with fragmented karyosomes and no distinct peripheral chromatin. Some trophozoites are uninucleate.',
      ],
      [
        'Cryptosporidium species',
        'Cryptosporidium is sought as a small oocyst in stool, not as this binucleate trophozoite.',
      ],
    ],
    2,
    'Binucleate trophozoites with fragmented karyosomes suggest Dientamoeba fragilis; nuclear number can vary.',
    'ciulla',
    815,
    'Parasitology: Dientamoeba trophozoites',
  ),
  item(
    'para-c26-004',
    'parasitology',
    'Intestinal protozoa',
    'case',
    'A stool preparation shows elongated oocysts measuring approximately 30 by 15 micrometers, with internal sporoblast material. Which coccidian organism best fits this size and shape?',
    [
      [
        'Cryptosporidium species',
        'Cryptosporidium oocysts are much smaller, usually about 4-6 micrometers and round.',
      ],
      [
        'Cyclospora cayetanensis',
        'Cyclospora oocysts are approximately 8-10 micrometers and spherical, rather than the described large elongated form.',
      ],
      [
        'Giardia duodenalis',
        'Giardia is not a coccidian and its cyst morphology does not match this elongated oocyst.',
      ],
      [
        'Cystoisospora belli',
        'The relatively large, elongated oocyst fits Cystoisospora belli, called Isospora belli in the cited edition.',
      ],
    ],
    3,
    'Cystoisospora belli oocysts are larger and more elongated than the common Cryptosporidium and Cyclospora oocysts.',
    'ciulla',
    817,
    'Parasitology: Cystoisospora oocyst morphology',
  ),
  item(
    'para-c26-005',
    'parasitology',
    'Intestinal protozoa',
    'case',
    'Round stool oocysts measure approximately 8-10 micrometers and show variable uptake of a modified acid-fast stain. Which candidate best fits this combination among the choices?',
    [
      [
        'Cyclospora cayetanensis',
        'Cyclospora oocysts are spherical and approximately 8-10 micrometers, with variable acid-fast staining. Size helps distinguish them from smaller Cryptosporidium oocysts.',
      ],
      [
        'Cryptosporidium species',
        'Cryptosporidium oocysts are generally approximately 4-6 micrometers, smaller than the stated structures.',
      ],
      ['Cystoisospora belli', 'Cystoisospora typically has much larger, elongated oocysts.'],
      [
        'Enterobius vermicularis',
        'Enterobius is a nematode with asymmetrical eggs rather than round coccidian oocysts of this size.',
      ],
    ],
    0,
    'Use measured size and morphology with staining: Cyclospora oocysts are roughly 8-10 micrometers, larger than Cryptosporidium.',
    'ciulla',
    817,
    'Parasitology: Cyclospora oocyst morphology',
  ),
  item(
    'para-c26-006',
    'parasitology',
    'Nematodes',
    'case',
    'While comparing known Ascaris eggs, a student finds an elongated egg about 90 micrometers long filled with disorganized refractile granules. Compared with the smaller, more rounded fertilized form, which interpretation is favored?',
    [
      [
        'A Taenia egg',
        'Taenia eggs have a radially striated embryophore and a six-hooked oncosphere rather than this elongated granular Ascaris form.',
      ],
      [
        'An unfertilized Ascaris egg',
        'Unfertilized Ascaris eggs are generally larger and more elongated, with disorganized granular contents.',
      ],
      [
        'A Trichuris egg with bipolar plugs',
        'The described specimen lacks the characteristic bipolar plugs of a Trichuris egg.',
      ],
      [
        'A fully developed fertilized Ascaris egg, proven by the granules alone',
        'Granular disorganized contents in a large elongated egg favor the unfertilized form rather than proving larval development.',
      ],
    ],
    1,
    'Unfertilized Ascaris eggs are often larger and more elongated than fertilized eggs; assess shell and contents together.',
    'ciulla',
    833,
    'Parasitology: Ascaris egg forms, Figures 8-17 and 8-18',
  ),
  item(
    'para-c26-007',
    'parasitology',
    'Nematodes',
    'recall',
    'Which stage of Necator americanus normally initiates human infection by penetrating exposed skin in contaminated soil?',
    [
      [
        'An unembryonated egg',
        'Hookworm eggs passed in stool must develop in the environment; they do not directly penetrate skin.',
      ],
      [
        'An adult worm',
        'Adult hookworms inhabit the intestine rather than serving as the soil stage that penetrates skin.',
      ],
      [
        'A filariform larva',
        'The infective filariform larva penetrates skin and subsequently migrates within the host.',
      ],
      [
        'A rhabditiform larva',
        'The rhabditiform form is a feeding developmental stage; it is not the usual infective skin-penetrating stage.',
      ],
    ],
    2,
    'Necator infection begins with skin penetration by an infective filariform larva.',
    'ciulla',
    834,
    'Parasitology: hookworm transmission',
  ),
  item(
    'para-c26-008',
    'parasitology',
    'Trematodes',
    'case',
    'A Clonorchis sinensis life-cycle exercise asks which food exposure can carry its infective metacercariae to a human host. Which exposure fits?',
    [
      [
        'Ingestion of a flea',
        'Flea ingestion is associated with Dipylidium transmission, not the Clonorchis life cycle.',
      ],
      [
        'Eating undercooked beef containing Taenia cysticerci',
        'That exposure relates to beef tapeworm taeniasis rather than Clonorchis.',
      ],
      [
        'Eating aquatic plants carrying Fasciola metacercariae',
        'Aquatic vegetation is the classic vehicle for Fasciola rather than Clonorchis metacercariae.',
      ],
      [
        'Eating raw or undercooked freshwater fish containing metacercariae',
        'Clonorchis metacercariae encyst in freshwater fish and are acquired when infected fish is eaten without adequate cooking.',
      ],
    ],
    3,
    'Clonorchis infection is acquired from metacercariae in freshwater fish, distinct from plant-associated Fasciola exposure.',
    'ciulla',
    827,
    'Parasitology: Clonorchis transmission',
  ),
  item(
    'para-c26-009',
    'parasitology',
    'Cestodes',
    'case',
    'In a comparison limited to adult Taenia solium and T. saginata, which scolex finding favors T. solium?',
    [
      [
        'An armed rostellum with hooks',
        'T. solium has an armed rostellum, while T. saginata lacks rostellar hooks.',
      ],
      [
        'Four suckers without consideration of the rostellum',
        'Both species have four suckers, so that feature alone does not separate them.',
      ],
      [
        'Radial striations of an egg shell',
        'Egg-shell morphology is not a scolex finding and does not distinguish these two species.',
      ],
      [
        'A six-hooked oncosphere inside an egg',
        'The oncosphere belongs to the egg stage; both species share this egg feature.',
      ],
    ],
    0,
    'Scolex armature helps distinguish adult T. solium from T. saginata when egg morphology cannot.',
    'elsevier',
    90,
    'Parasitology: Taenia scolex comparison',
  ),
  item(
    'para-c26-010',
    'parasitology',
    'Cestodes',
    'case',
    'An archived teaching preparation from a confirmed Echinococcus hydatid cyst shows numerous small larval heads floating in the cyst fluid as part of hydatid sand. What are these structures called?',
    [
      [
        'Malarial gametocytes',
        'Gametocytes are blood stages of Plasmodium, not structures produced within a hydatid cyst.',
      ],
      [
        'Protoscolices',
        'Hydatid cyst brood capsules produce larval scolices, called protoscolices, which may be released into the fluid.',
      ],
      [
        'Adult tapeworm proglottids',
        "Adult proglottids occur in the definitive host's intestinal tapeworm, not as the larval heads in this cyst.",
      ],
      [
        'Operculated fluke eggs',
        'A hydatid cyst is a cestode larval structure rather than a collection of trematode eggs.',
      ],
    ],
    1,
    'Hydatid sand can contain protoscolices released from brood capsules within an Echinococcus cyst.',
    'elsevier',
    91,
    'Parasitology: hydatid cyst contents',
  ),
  item(
    'para-c26-011',
    'parasitology',
    'Blood parasites',
    'recall',
    'During ordinary mosquito-borne malaria transmission, which Plasmodium stage is introduced into the human host by an infected female Anopheles mosquito?',
    [
      [
        'A blood-stage gametocyte',
        'The mosquito ingests gametocytes from an infected human; gametocytes are not the stage normally injected into the next human.',
      ],
      [
        'An intestinal helminth egg',
        'Plasmodium is a protozoan and is not transmitted as a helminth egg.',
      ],
      [
        'A sporozoite',
        "Sporozoites from the mosquito's salivary glands enter the human host and initially invade liver cells.",
      ],
      [
        'A hypnozoite',
        'A hypnozoite is a dormant liver stage of particular malaria species, not the stage injected by the mosquito.',
      ],
    ],
    2,
    'Mosquitoes transmit Plasmodium sporozoites to humans and acquire gametocytes from infected human blood.',
    'ciulla',
    818,
    'Parasitology: malaria transmission stages',
  ),
  item(
    'para-c26-012',
    'parasitology',
    'Blood parasites',
    'case',
    'A malaria teaching film includes mature crescent-shaped, banana-like gametocytes. Which species is classically associated with this mature gametocyte shape?',
    [
      [
        'Plasmodium vivax',
        'Mature P. vivax gametocytes are generally round or oval rather than characteristically crescent-shaped.',
      ],
      [
        'Plasmodium ovale',
        'P. ovale gametocytes are generally round or oval, not the classic banana shape.',
      ],
      [
        'Plasmodium malariae',
        'P. malariae gametocytes are generally rounded rather than crescent-shaped.',
      ],
      [
        'Plasmodium falciparum',
        'Mature P. falciparum gametocytes characteristically have a crescent or banana-like shape. This describes the sexual blood stage, not every parasite form.',
      ],
    ],
    3,
    'Crescent-shaped mature gametocytes are a classic P. falciparum clue; identify the parasite stage before applying morphology.',
    'ciulla',
    818,
    'Parasitology: mature malaria gametocytes',
  ),
];
