// Web curriculum — adapted from RN modules with web-friendly section types

// Every module shares the brand accent. It's a CSS variable so it follows the
// light/dark theme; build tints with tint() rather than appending hex alpha.
export const BRAND_COLOR = 'var(--accent)';

/** A see-through version of a colour, e.g. tint(color, 10) for a 10% wash. */
export function tint(color: string, percent: number) {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

export interface TextSection    { type: 'text';    heading?: string; body: string }
export interface CalloutSection { type: 'callout'; label: string; text: string; color?: string }
export interface TableSection   { type: 'table';   heading: string; leftHeader: string; rightHeader: string; rows: { left: string; right: string }[] }
export interface StepsSection   { type: 'steps';   heading: string; steps: { label: string; detail: string }[] }
export interface TermsSection   { type: 'terms';   heading: string; terms: { term: string; definition: string }[] }

export type Section = TextSection | CalloutSection | TableSection | StepsSection | TermsSection;

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  sections: Section[];
  takeaways: string[];
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  color: string;
  lessons: Lesson[];
}

// ── Module 1: Foundations ──────────────────────────────────────────────────────
const mod1: Module = {
  id: 'mod1', number: 1,
  title: 'Foundations',
  subtitle: 'Genetics, cell biology & the origin of immune cells',
  color: BRAND_COLOR,
  lessons: [
    {
      id: 'mod1-l1', title: 'DNA, Genes & Proteins', duration: '7 min',
      sections: [
        { type: 'text', heading: 'The Blueprint of Life',
          body: 'Every one of your ~37 trillion cells contains the same DNA — roughly 3 billion base pairs coiled into 23 pairs of chromosomes. DNA is written in a 4-letter alphabet (A, T, G, C), and specific stretches called genes encode the instructions to build proteins — the molecular machines that do almost everything in biology, including running your immune system.' },
        { type: 'steps', heading: 'The Central Dogma: DNA → RNA → Protein',
          steps: [
            { label: 'Transcription', detail: 'RNA polymerase unwinds the DNA double helix and reads a template strand, building a complementary mRNA molecule one nucleotide at a time.' },
            { label: 'RNA Processing', detail: 'In eukaryotes, introns are spliced out and a 5′ cap and poly-A tail are added to stabilise the mRNA before it exits the nucleus.' },
            { label: 'Translation', detail: 'Ribosomes read mRNA in triplets called codons. Each codon specifies one amino acid. The ribosome assembles the amino acid chain until it hits a stop codon.' },
            { label: 'Protein Folding', detail: 'The new polypeptide folds into its 3D shape — sometimes with help from chaperone proteins. Shape determines function.' },
          ],
        },
        { type: 'callout', label: 'Why it matters for immunology', color: 'blue',
          text: 'Every immune cell you will learn about expresses specific proteins (receptors, cytokines, enzymes) encoded by genes. Understanding how genes become proteins is the foundation for understanding how immune cells are made and how they function.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Gene', definition: 'A segment of DNA that encodes instructions for making a specific protein or functional RNA molecule.' },
            { term: 'Transcription', definition: 'The process of copying a gene\'s DNA sequence into mRNA, carried out by RNA polymerase in the nucleus.' },
            { term: 'Translation', definition: 'The process of reading mRNA codons at the ribosome to assemble a chain of amino acids into a protein.' },
            { term: 'Codon', definition: 'A three-nucleotide sequence in mRNA that specifies a particular amino acid (or a stop signal).' },
            { term: 'Transcription Factor', definition: 'A protein that binds to specific DNA sequences to turn genes on or off; cytokines often work by activating transcription factors in immune cells.' },
          ],
        },
      ],
      takeaways: [
        'DNA → mRNA (transcription) → protein (translation) — this "Central Dogma" underlies all immune cell function.',
        'Genes are regulated by transcription factors; cytokines activate TFs like STAT proteins to switch immune programs on.',
        'mRNA vaccines exploit the Central Dogma: deliver mRNA instructions, your ribosomes make the antigen.',
      ],
      quiz: [
        { id: 'q1', question: 'Which enzyme reads DNA and makes an mRNA copy?', options: ['DNA polymerase', 'RNA polymerase', 'Reverse transcriptase', 'Helicase'], correctIndex: 1, explanation: 'RNA polymerase unwinds the double helix and synthesises the mRNA strand complementary to the template DNA strand during transcription.' },
        { id: 'q2', question: 'What is a codon?', options: ['An amino acid', 'A three-nucleotide mRNA sequence specifying one amino acid', 'An exon', 'A type of ribosome'], correctIndex: 1, explanation: 'Codons are three-base sequences read by the ribosome. There are 64 possible codons encoding 20 amino acids plus start and stop signals.' },
        { id: 'q3', question: 'What happens during RNA processing in eukaryotes?', options: ['Amino acids are assembled into a chain', 'Introns are spliced out and a 5′ cap and poly-A tail are added', 'DNA is replicated', 'Proteins are folded by chaperones'], correctIndex: 1, explanation: 'Before mRNA exits the nucleus, introns are spliced out and a 5′ cap and poly-A tail are added to stabilise it — this happens between transcription and translation.' },
      ],
    },
    {
      id: 'mod1-l2', title: 'Cell Biology for Immunologists', duration: '6 min',
      sections: [
        { type: 'text', heading: 'Why Cell Biology Matters',
          body: 'Immune cells are just cells — which means they obey the same rules as all eukaryotic cells. Understanding their organelles helps you understand how they work: how they make proteins to fight infection, how they communicate, and how they respond to signals.' },
        { type: 'table', heading: 'Key Organelles & Their Immune Roles',
          leftHeader: 'Organelle', rightHeader: 'Role in Immune Cells',
          rows: [
            { left: 'Nucleus', right: 'Stores DNA; site of transcription. When a T cell is activated, transcription factors like NF-κB enter the nucleus to switch on immune genes.' },
            { left: 'Rough ER', right: 'Ribosomes here translate mRNA for secretory proteins — including antibodies and cytokines.' },
            { left: 'Golgi Apparatus', right: 'Packages and ships proteins. Antibodies are glycosylated and packaged here before secretion.' },
            { left: 'Lysosomes', right: 'Contain digestive enzymes. Macrophages use lysosomes to destroy phagocytosed bacteria.' },
            { left: 'Mitochondria', right: 'Supply ATP for energy-intensive processes like cell migration, proliferation, and cytokine production.' },
            { left: 'Cytoskeleton', right: 'Network of filaments that enables immune cells to migrate to infection sites and form the immunological synapse with T cells.' },
          ],
        },
        { type: 'callout', label: 'Secretory Pathway', color: 'green',
          text: 'Antibodies and cytokines follow the secretory pathway: made on rough ER ribosomes → packaged in Golgi → exported in vesicles → secreted into the extracellular space. Disruption of any step impairs immune function.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Organelle', definition: 'A membrane-bound compartment within a cell specialised for a particular function.' },
            { term: 'Endoplasmic Reticulum (ER)', definition: 'Network of membranes; rough ER (with ribosomes) folds secretory proteins; smooth ER handles lipids.' },
            { term: 'Golgi Apparatus', definition: 'Modifies, packages, and sorts proteins for secretion or delivery to other organelles.' },
            { term: 'Lysosome', definition: 'Acidic organelle containing hydrolytic enzymes that degrade foreign material and cellular debris.' },
          ],
        },
      ],
      takeaways: [
        'The rough ER and Golgi are the assembly line for secretory proteins — antibodies and cytokines are made here.',
        'Lysosomes are the macrophage\'s "stomach" — they digest phagocytosed pathogens.',
        'Cytoskeletal dynamics allow immune cells to migrate, shape-change, and form the immunological synapse.',
      ],
      quiz: [
        { id: 'q1', question: 'Where are antibodies made within a plasma cell?', options: ['Nucleus', 'Smooth ER', 'Rough ER ribosomes → Golgi', 'Mitochondria'], correctIndex: 2, explanation: 'Antibodies are secretory proteins. They are synthesised on rough ER ribosomes, folded and modified in the ER lumen, then packaged in the Golgi for secretion.' },
        { id: 'q2', question: 'What do lysosomes allow macrophages to do?', options: ['Generate ATP for migration', 'Digest phagocytosed pathogens using hydrolytic enzymes', 'Present antigens on MHC II', 'Synthesise antibodies'], correctIndex: 1, explanation: 'Lysosomes contain digestive enzymes. Macrophages use them to destroy bacteria and debris they have engulfed by phagocytosis.' },
        { id: 'q3', question: 'What role does the cytoskeleton play in immune cells?', options: ['It stores genetic material', 'It enables migration to infection sites and formation of the immunological synapse', 'It produces cytokines', 'It packages antibodies for secretion'], correctIndex: 1, explanation: 'The cytoskeleton is a network of filaments that lets immune cells change shape, migrate toward infection sites, and form stable contacts like the immunological synapse with T cells.' },
      ],
    },
    {
      id: 'mod1-l3', title: 'Hematopoiesis: The Origin of Immune Cells', duration: '8 min',
      sections: [
        { type: 'text', heading: 'All Blood Cells Come From One Ancestor',
          body: 'Every immune cell in your body — from neutrophils to T cells — originates from a single cell type: the hematopoietic stem cell (HSC), found in bone marrow. This process of generating all blood cells is called hematopoiesis, and it produces billions of new cells every day.' },
        { type: 'steps', heading: 'The Hematopoietic Hierarchy',
          steps: [
            { label: 'Hematopoietic Stem Cell (HSC)', detail: 'Self-renewing multipotent stem cell in the bone marrow. Gives rise to all blood and immune cell types. A single HSC can reconstitute the entire immune system.' },
            { label: 'Common Myeloid Progenitor (CMP)', detail: 'Gives rise to the "innate" arm: red blood cells, platelets, granulocytes (neutrophils, eosinophils, basophils, mast cells), and monocytes/macrophages.' },
            { label: 'Common Lymphoid Progenitor (CLP)', detail: 'Gives rise to the "adaptive" arm: T cells (mature in thymus), B cells (mature in bone marrow), and NK cells.' },
            { label: 'Maturation & Tissue Residence', detail: 'Mature cells circulate in blood or take up residence in tissues (e.g., Kupffer cells in liver, microglia in brain). Dendritic cells can arise from both myeloid and lymphoid progenitors.' },
          ],
        },
        { type: 'table', heading: 'Myeloid vs Lymphoid Lineages',
          leftHeader: 'Myeloid', rightHeader: 'Lymphoid',
          rows: [
            { left: 'Neutrophils', right: 'T cells (CD4⁺, CD8⁺, Treg)' },
            { left: 'Macrophages / Monocytes', right: 'B cells → Plasma cells' },
            { left: 'Dendritic cells', right: 'NK cells' },
            { left: 'Mast cells, Basophils, Eosinophils', right: 'Innate Lymphoid Cells (ILCs)' },
            { left: 'Red blood cells, Platelets', right: '—' },
          ],
        },
        { type: 'callout', label: 'Clinical relevance', color: 'amber',
          text: 'Bone marrow transplantation works because donated HSCs can repopulate an entire immune system. CAR-T therapy starts by taking T cells (lymphoid lineage) from the patient and engineering them before infusion back.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Hematopoiesis', definition: 'The process by which all blood and immune cells are produced from hematopoietic stem cells in the bone marrow.' },
            { term: 'Hematopoietic Stem Cell (HSC)', definition: 'A multipotent progenitor capable of self-renewal and differentiation into all blood cell lineages.' },
            { term: 'Common Myeloid Progenitor', definition: 'HSC-derived precursor giving rise to granulocytes, monocytes/macrophages, red blood cells, and platelets.' },
            { term: 'Common Lymphoid Progenitor', definition: 'HSC-derived precursor giving rise to T cells, B cells, and NK cells.' },
          ],
        },
      ],
      takeaways: [
        'All blood and immune cells arise from hematopoietic stem cells in the bone marrow.',
        'Two main branches: myeloid (innate cells + red blood cells) and lymphoid (T cells, B cells, NK cells).',
        'Bone marrow transplants work by replacing a patient\'s HSCs with a donor\'s healthy stem cells.',
      ],
      quiz: [
        { id: 'q1', question: 'What is the common ancestor of all blood and immune cells?', options: ['Neutrophil', 'Monocyte', 'Hematopoietic stem cell', 'Dendritic cell'], correctIndex: 2, explanation: 'The HSC is the multipotent stem cell in bone marrow from which all blood cell lineages — myeloid and lymphoid — derive.' },
        { id: 'q2', question: 'T cells and B cells arise from which progenitor?', options: ['Common myeloid progenitor', 'Common lymphoid progenitor', 'Megakaryocyte', 'Monocyte'], correctIndex: 1, explanation: 'T cells, B cells, and NK cells all derive from the Common Lymphoid Progenitor (CLP).' },
        { id: 'q3', question: 'Why does bone marrow transplantation work as a treatment?', options: ['It replaces damaged lymph nodes', 'Donated hematopoietic stem cells can repopulate the patient\'s entire immune system', 'It directly replaces antibodies', 'It removes the need for a thymus'], correctIndex: 1, explanation: 'Because HSCs are multipotent and self-renewing, a donor\'s healthy HSCs can rebuild a patient\'s entire blood and immune system after transplantation.' },
      ],
    },
    {
      id: 'mod1-l4', title: 'The Lymphatic System', duration: '6 min',
      sections: [
        { type: 'text', heading: 'More Than Just Drainage Pipes',
          body: 'The lymphatic system is a network of vessels, nodes, and organs that drains interstitial fluid from tissues and returns it to the bloodstream as lymph. But crucially for immunology, it is also the superhighway that brings antigens and immune cells together — making it the site where most adaptive immune responses are initiated.' },
        { type: 'table', heading: 'Primary vs Secondary Lymphoid Organs',
          leftHeader: 'Primary (where cells mature)', rightHeader: 'Secondary (where responses are launched)',
          rows: [
            { left: 'Bone marrow: B cell maturation, HSC niche', right: 'Lymph nodes: filter lymph; T & B cell meetings' },
            { left: 'Thymus: T cell maturation & selection', right: 'Spleen: filters blood; responds to blood-borne antigens' },
            { left: '', right: 'Tonsils/Peyer\'s patches: mucosal immunity' },
          ],
        },
        { type: 'text', heading: 'Lymph Node Architecture',
          body: 'Lymph nodes are bean-shaped organs scattered along lymphatic vessels. They are organised into zones: the cortex (B cell follicles with germinal centres), the paracortex (T cell zone where dendritic cells present antigens), and the medulla (macrophages and plasma cells). When an infection drains from a tissue into a lymph node, antigen-loaded dendritic cells activate T cells in the paracortex — launching the adaptive response.' },
        { type: 'callout', label: 'Swollen lymph nodes', color: 'blue',
          text: 'During an infection, lymph nodes near the affected tissue swell (lymphadenopathy) because immune cells are rapidly proliferating inside. This is why doctors feel for swollen nodes — it tells them where an infection is occurring.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Lymph', definition: 'Interstitial fluid that has entered lymphatic capillaries; contains immune cells, antigens, and cellular debris.' },
            { term: 'Lymph Node', definition: 'Secondary lymphoid organ where antigens from the periphery are presented to T and B cells to initiate adaptive immunity.' },
            { term: 'Spleen', definition: 'Large secondary lymphoid organ that filters blood and mounts responses to blood-borne antigens.' },
            { term: 'Thymus', definition: 'Primary lymphoid organ where T cell precursors mature and undergo positive and negative selection.' },
            { term: 'Germinal Centre', definition: 'A microstructure within B cell follicles in lymph nodes where B cells undergo affinity maturation and class switching.' },
          ],
        },
      ],
      takeaways: [
        'Lymph nodes are where dendritic cells present antigens to T and B cells — the epicentre of adaptive immune responses.',
        'Primary lymphoid organs (bone marrow, thymus) produce immune cells; secondary organs (lymph nodes, spleen) are where they act.',
        'Swollen lymph nodes signal active local immune responses — a useful clinical sign.',
      ],
      quiz: [
        { id: 'q1', question: 'Where do T cells mature and undergo selection?', options: ['Bone marrow', 'Spleen', 'Thymus', 'Lymph node'], correctIndex: 2, explanation: 'T cell precursors migrate from the bone marrow to the thymus where positive selection (must recognise MHC) and negative selection (must not react to self) occur.' },
        { id: 'q2', question: 'In which zone of a lymph node do dendritic cells present antigens to T cells?', options: ['Cortex', 'Paracortex', 'Medulla', 'Germinal centre'], correctIndex: 1, explanation: 'The paracortex is the T cell zone of a lymph node, where antigen-loaded dendritic cells activate T cells and launch the adaptive response.' },
        { id: 'q3', question: 'What is the main function of the spleen?', options: ['T cell maturation', 'B cell maturation', 'Filtering blood and responding to blood-borne antigens', 'Producing hematopoietic stem cells'], correctIndex: 2, explanation: 'The spleen is a secondary lymphoid organ that filters blood and mounts immune responses against blood-borne antigens, distinct from the thymus and bone marrow which are primary lymphoid organs.' },
      ],
    },
  ],
};

// ── Module 2: The Immune System ────────────────────────────────────────────────
const mod2: Module = {
  id: 'mod2', number: 2,
  title: 'The Immune System',
  subtitle: 'Innate defences, adaptive responses & immune memory',
  color: BRAND_COLOR,
  lessons: [
    {
      id: 'mod2-l1', title: 'Innate vs Adaptive Immunity', duration: '7 min',
      sections: [
        { type: 'text', heading: 'Two Arms of Defense',
          body: 'Your immune system has two distinct but interconnected arms. The innate immune system is fast (minutes to hours), non-specific, and uses pre-built pattern recognition to detect common microbial features. The adaptive immune system is slow (days to weeks for a first response), highly specific, and generates immunological memory for faster future responses.' },
        { type: 'table', heading: 'Innate vs Adaptive: Side by Side',
          leftHeader: 'Innate Immunity', rightHeader: 'Adaptive Immunity',
          rows: [
            { left: 'Minutes to hours response time', right: 'Days to weeks (first exposure)' },
            { left: 'Non-specific / broad recognition', right: 'Highly specific — one antigen per clone' },
            { left: 'No immunological memory', right: 'Creates memory cells for faster re-response' },
            { left: 'Pattern recognition (PRRs / PAMPs)', right: 'Antigen-specific receptors (TCR, BCR)' },
            { left: 'Neutrophils, macrophages, NK cells', right: 'T cells, B cells, plasma cells' },
            { left: 'Physical barriers, phagocytosis, complement', right: 'Antibodies, cytotoxic killing, help signals' },
          ],
        },
        { type: 'text', heading: 'Bridging the Gap: Dendritic Cells',
          body: 'Dendritic cells (DCs) are the crucial link between innate and adaptive immunity. They patrol tissues, engulf pathogens with their innate receptors, then migrate to lymph nodes and present processed antigen peptides on MHC molecules to T cells — kickstarting the adaptive response.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'PRR (Pattern Recognition Receptor)', definition: 'Innate immune receptors (e.g., Toll-like receptors) that detect conserved microbial structures called PAMPs.' },
            { term: 'PAMP', definition: 'Pathogen-Associated Molecular Pattern — conserved microbial molecules (LPS, flagellin, viral RNA) recognised by PRRs.' },
            { term: 'Antigen', definition: 'Any molecule (usually a protein fragment from a pathogen) that is specifically recognised by lymphocyte receptors (TCR or BCR).' },
            { term: 'Immunological Memory', definition: 'Long-lived memory T and B cells that remain after an infection and respond faster and more strongly upon re-exposure.' },
          ],
        },
      ],
      takeaways: [
        'Innate = fast, broad, no memory. Adaptive = slow initially, specific, generates lifelong memory.',
        'Dendritic cells bridge the two systems by carrying antigens from tissues to lymph nodes.',
        'Vaccines work by priming the adaptive immune system to create memory — without the disease.',
      ],
      quiz: [
        { id: 'q1', question: 'Which feature is unique to adaptive immunity?', options: ['Speed of response', 'Use of phagocytosis', 'Immunological memory', 'Pattern recognition receptors'], correctIndex: 2, explanation: 'Only the adaptive immune system generates memory cells that persist after infection and provide faster, stronger responses on re-exposure — the basis of vaccination.' },
        { id: 'q2', question: 'Which cell type bridges innate and adaptive immunity?', options: ['Neutrophil', 'NK cell', 'Dendritic cell', 'Mast cell'], correctIndex: 2, explanation: 'Dendritic cells sense pathogens with innate receptors, then migrate to lymph nodes and present antigen peptides on MHC molecules to naïve T cells, initiating the adaptive response.' },
        { id: 'q3', question: 'What do pattern recognition receptors (PRRs) detect?', options: ['Specific antigens unique to one pathogen', 'PAMPs — conserved molecular patterns shared across many microbes', 'Self-MHC molecules', 'Antibody isotypes'], correctIndex: 1, explanation: 'PRRs like Toll-like receptors recognise PAMPs (Pathogen-Associated Molecular Patterns) — conserved structures like LPS or flagellin shared broadly across classes of microbes, allowing fast, non-specific detection.' },
      ],
    },
    {
      id: 'mod2-l2', title: 'The Innate Immune Cells', duration: '8 min',
      sections: [
        { type: 'text', heading: 'The First Responders',
          body: 'When a pathogen breaches the body\'s barriers, innate immune cells are the first to act. They don\'t need prior exposure — they are pre-programmed to recognise and destroy common threats using pattern recognition, phagocytosis, and chemical weapons.' },
        { type: 'terms', heading: 'Innate Cell Types',
          terms: [
            { term: 'Neutrophils', definition: 'The most abundant circulating granulocyte (~60% of white blood cells). First to arrive at infection sites; kill bacteria by phagocytosis, degranulation (releasing antimicrobial enzymes), and NETs (neutrophil extracellular traps — sticky webs of DNA that catch bacteria). Short-lived (~24–48 hours).' },
            { term: 'Macrophages', definition: 'Tissue-resident phagocytes derived from monocytes. Engulf and destroy pathogens, present antigens to T cells, secrete cytokines (TNF-α, IL-1β, IL-6) to coordinate inflammation. Long-lived and self-renewing. Can polarise to pro-inflammatory (M1) or anti-inflammatory (M2) states.' },
            { term: 'Dendritic Cells (DCs)', definition: 'Professional antigen-presenting cells that patrol tissues, capture antigens, mature, and migrate to lymph nodes to present to T cells. The key bridge between innate and adaptive immunity.' },
            { term: 'Natural Killer (NK) Cells', definition: 'Innate lymphocytes that kill virus-infected and tumour cells without prior sensitisation. Detect "missing self" — cells that have downregulated MHC I (a tumour/virus evasion strategy). Kill via perforin/granzyme and ADCC.' },
            { term: 'Mast Cells', definition: 'Tissue-resident cells that release histamine and other mediators in response to IgE-allergen cross-linking (allergies) and some pathogens. Important in allergy and antiparasitic responses.' },
            { term: 'Complement System', definition: 'A cascade of ~30 serum proteins activated by pathogens (classical, lectin, or alternative pathways). Leads to opsonisation (C3b coating), inflammation (C3a, C5a), and direct lysis via the membrane attack complex (MAC).' },
          ],
        },
        { type: 'callout', label: 'The Inflammatory Response', color: 'red',
          text: 'When macrophages detect a pathogen, they release IL-1β, IL-6, and TNF-α. These cytokines cause vasodilation (redness), increased vascular permeability (swelling), fever, and the recruitment of more neutrophils and monocytes. This is inflammation — painful, but essential.' },
      ],
      takeaways: [
        'Neutrophils are the immediate first responders; macrophages are the durable tissue sentinels.',
        'NK cells kill cells lacking MHC I — a clever way to detect virally infected and cancer cells.',
        'Complement opsonises pathogens and punches holes in bacterial membranes via the MAC.',
      ],
      quiz: [
        { id: 'q1', question: 'How do NK cells detect tumour cells?', options: ['Via TCR recognition of tumour antigen', 'Via missing MHC I expression ("missing self")', 'Via IgE-mediated degranulation', 'Via complement activation'], correctIndex: 1, explanation: 'NK cells check for MHC I expression. Healthy cells display MHC I, which inhibits NK cells. Virally infected and tumour cells often downregulate MHC I — NK cells detect this "missing self" and kill.' },
        { id: 'q2', question: 'What are neutrophil extracellular traps (NETs)?', options: ['Antibody-coated vesicles', 'Sticky webs of DNA that catch and trap bacteria', 'A type of cytokine receptor', 'Phagocytic vacuoles in macrophages'], correctIndex: 1, explanation: 'NETs are sticky webs of DNA released by neutrophils that physically trap and help kill bacteria — one of several neutrophil weapons alongside phagocytosis and degranulation.' },
        { id: 'q3', question: 'Which cytokines drive the redness, swelling, and fever of inflammation?', options: ['IL-4 and IL-13', 'IL-1β, IL-6, and TNF-α', 'IL-10 and TGF-β', 'IL-2 and IFN-γ'], correctIndex: 1, explanation: 'When macrophages detect a pathogen, they release IL-1β, IL-6, and TNF-α, which cause vasodilation, vascular permeability, fever, and recruitment of more immune cells.' },
      ],
    },
    {
      id: 'mod2-l3', title: 'Cytokines, MHC & Antigen Presentation', duration: '9 min',
      sections: [
        { type: 'text', heading: 'The Immune System\'s Communication Network',
          body: 'Cytokines are small secreted proteins that allow immune cells to "talk" to each other. They can activate, inhibit, recruit, or direct the differentiation of target cells. Meanwhile, MHC molecules are the display system that lets T cells inspect what\'s happening inside cells.' },
        { type: 'terms', heading: 'Key Cytokines',
          terms: [
            { term: 'IL-2', definition: 'Produced by activated T cells; the key survival and proliferation signal for T cells. Anti-IL-2R antibodies (like basiliximab) block T cell proliferation in transplant rejection.' },
            { term: 'IL-4 & IL-13', definition: 'Produced by Th2 cells and ILC2s; drive antibody class-switching to IgE and IgG1, and promote allergic responses and anti-parasitic immunity.' },
            { term: 'IL-12', definition: 'Produced by dendritic cells and macrophages in response to bacterial infection; drives T cell differentiation toward Th1 and NK cell activation. Critical for anti-intracellular pathogen responses.' },
            { term: 'IFN-γ (Interferon-gamma)', definition: 'Produced by Th1 cells and NK cells; activates macrophages to kill intracellular pathogens more effectively. The master cytokine of cell-mediated immunity.' },
            { term: 'TNF-α', definition: 'Pro-inflammatory cytokine from macrophages; drives fever, inflammation, and neutrophil recruitment. At very high levels (sepsis) causes dangerous vasodilation and organ failure.' },
            { term: 'IL-10', definition: 'Anti-inflammatory cytokine from Tregs and macrophages; dampens immune responses to prevent excessive damage.' },
          ],
        },
        { type: 'table', heading: 'MHC Class I vs Class II',
          leftHeader: 'MHC Class I', rightHeader: 'MHC Class II',
          rows: [
            { left: 'On all nucleated cells', right: 'Only on professional APCs (DCs, macrophages, B cells)' },
            { left: 'Presents intracellular peptides (viral, self, tumour)', right: 'Presents extracellular antigen peptides (bacterial, engulfed)' },
            { left: 'Recognised by CD8⁺ T cells → killing', right: 'Recognised by CD4⁺ T cells → help signals' },
            { left: 'β2-microglobulin non-covalently associated', right: 'Two non-covalent α and β chains' },
          ],
        },
      ],
      takeaways: [
        'Cytokines are the immune system\'s messaging system — they determine which type of response is mounted.',
        'MHC I: presents what\'s inside a cell (to CD8⁺ killers). MHC II: presents what was engulfed (to CD4⁺ helpers).',
        'IL-12 drives Th1 (cellular immunity); IL-4 drives Th2 (antibody/allergy). The balance determines the type of immune response.',
      ],
      quiz: [
        { id: 'q1', question: 'Which cytokine is primarily responsible for driving Th1 differentiation and macrophage activation?', options: ['IL-4', 'IL-10', 'IFN-γ', 'IL-12'], correctIndex: 3, explanation: 'IL-12 (from DCs and macrophages) drives naive T cells to differentiate into Th1 cells, which then produce IFN-γ to activate macrophages — a positive feedback loop for clearing intracellular pathogens.' },
        { id: 'q2', question: 'Which cells express MHC Class I molecules?', options: ['Only dendritic cells', 'Only B cells', 'All nucleated cells', 'Only macrophages'], correctIndex: 2, explanation: 'MHC Class I is expressed on virtually all nucleated cells, allowing CD8⁺ T cells to survey the intracellular contents of any cell — unlike MHC II, which is restricted to professional antigen-presenting cells.' },
        { id: 'q3', question: 'Which cytokine dampens immune responses to prevent excessive tissue damage?', options: ['TNF-α', 'IL-12', 'IL-10', 'IFN-γ'], correctIndex: 2, explanation: 'IL-10, produced by Tregs and macrophages, is an anti-inflammatory cytokine that reins in immune responses to limit collateral damage.' },
      ],
    },
    {
      id: 'mod2-l4', title: 'T & B Cell Activation & Memory', duration: '10 min',
      sections: [
        { type: 'text', heading: 'The Adaptive Response',
          body: 'The adaptive immune system can produce an almost unlimited variety of specific receptors — T cell receptors (TCR) and B cell receptors (BCR) — through a process called VDJ recombination. When a cell with the right receptor encounters its antigen, it is selected to proliferate (clonal selection) and differentiate into effector cells.' },
        { type: 'steps', heading: 'T Cell Activation: Three Signals',
          steps: [
            { label: 'Signal 1: Antigen Recognition', detail: 'The TCR binds to a peptide-MHC complex on a dendritic cell. CD4 or CD8 co-receptors stabilise the interaction. This is antigen-specific.' },
            { label: 'Signal 2: Co-stimulation', detail: 'CD28 on the T cell binds B7 (CD80/CD86) on the APC. Without this signal, the T cell becomes anergic (unresponsive) — not activated. This "two-key" system prevents accidental activation.' },
            { label: 'Signal 3: Cytokine Context', detail: 'Cytokines in the environment determine T cell fate: IL-12 → Th1 (cellular immunity); IL-4 → Th2 (antibody); TGF-β + IL-6 → Th17 (mucosal); TGF-β alone → Treg (suppression).' },
          ],
        },
        { type: 'steps', heading: 'B Cell Activation & Antibody Production',
          steps: [
            { label: 'Antigen Binding', detail: 'The BCR (membrane-bound antibody) binds its specific antigen. The B cell internalises and presents the antigen on MHC II.' },
            { label: 'T Cell Help', detail: 'A Tfh (follicular helper T) cell recognises the same antigen on the B cell\'s MHC II and provides co-stimulation (CD40L–CD40) and cytokines (IL-4, IL-21).' },
            { label: 'Germinal Centre Reaction', detail: 'Activated B cells enter germinal centres in lymph nodes. Somatic hypermutation introduces random mutations; B cells with higher-affinity receptors are selected to survive (affinity maturation).' },
            { label: 'Plasma Cells & Memory', detail: 'Selected B cells differentiate into plasma cells (antibody factories) or memory B cells. Class-switch recombination changes the antibody isotype (IgM → IgG/IgA/IgE) guided by cytokines.' },
          ],
        },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Clonal Selection', definition: 'The process by which antigen binding to a lymphocyte\'s receptor triggers that specific clone to proliferate and differentiate.' },
            { term: 'Somatic Hypermutation', definition: 'Rapid mutation of antibody variable regions in germinal centres, enabling affinity maturation.' },
            { term: 'Affinity Maturation', definition: 'The process of selecting B cells with progressively higher-affinity antibodies through iterative cycles of mutation and selection in germinal centres.' },
            { term: 'Class-Switch Recombination', definition: 'B cell mechanism for switching antibody isotype (e.g., IgM to IgG) while maintaining the same antigen specificity.' },
            { term: 'Memory Cell', definition: 'Long-lived lymphocytes generated after infection or vaccination that respond faster and more strongly upon re-exposure.' },
          ],
        },
      ],
      takeaways: [
        'T cells require three signals to activate: antigen, co-stimulation, and cytokine context — all must align.',
        'Germinal centres are where B cells compete to produce the best (highest-affinity) antibodies.',
        'Memory B and T cells are the molecular basis of vaccination — they give you faster, stronger responses to repeat exposures.',
      ],
      quiz: [
        { id: 'q1', question: 'What happens to a T cell that receives signal 1 (antigen) but NOT signal 2 (co-stimulation)?', options: ['It becomes a memory cell', 'It differentiates into Th1', 'It becomes anergic — unresponsive', 'It undergoes apoptosis immediately'], correctIndex: 2, explanation: 'Without CD28–B7 co-stimulation (signal 2), antigen recognition alone leads to anergy — the T cell becomes functionally unresponsive. This is a peripheral tolerance mechanism to prevent autoimmunity.' },
        { id: 'q2', question: 'Somatic hypermutation occurs in which structure?', options: ['Thymus', 'Bone marrow', 'Germinal centres in lymph nodes', 'Spleen red pulp'], correctIndex: 2, explanation: 'Germinal centres are specialised microstructures in lymph node follicles where B cells undergo somatic hypermutation and are selected for higher affinity antibodies — a process called affinity maturation.' },
        { id: 'q3', question: 'What does class-switch recombination change about an antibody?', options: ['Its antigen specificity', 'Its isotype (e.g. IgM to IgG), while keeping the same antigen specificity', 'Its amino acid sequence in the variable region', 'Its binding affinity through mutation'], correctIndex: 1, explanation: 'Class-switch recombination changes which antibody isotype (IgM, IgG, IgA, IgE) a B cell produces, while the antigen-binding specificity stays the same — distinct from somatic hypermutation, which changes affinity.' },
      ],
    },
  ],
};

// ── Module 3: When It Goes Wrong ───────────────────────────────────────────────
const mod3: Module = {
  id: 'mod3', number: 3,
  title: 'When It Goes Wrong',
  subtitle: 'Autoimmunity, allergies, HIV & cancer immune evasion',
  color: BRAND_COLOR,
  lessons: [
    {
      id: 'mod3-l1', title: 'Autoimmunity & Self-Tolerance', duration: '8 min',
      sections: [
        { type: 'text', heading: 'When the Immune System Turns on Itself',
          body: 'Self-tolerance is the immune system\'s ability to distinguish "self" from "non-self" and not attack the body\'s own healthy cells. When tolerance breaks down, the immune system mounts a destructive attack against self-antigens — this is autoimmunity. It affects ~5% of the population.' },
        { type: 'steps', heading: 'How Tolerance Is Established (and Broken)',
          steps: [
            { label: 'Central Tolerance', detail: 'In the thymus, T cells that react too strongly to self-antigens are deleted (clonal deletion). Similarly, self-reactive B cells are eliminated in the bone marrow. But this isn\'t perfect — some escape.' },
            { label: 'Peripheral Tolerance', detail: 'Self-reactive cells that escape central deletion are kept in check by: Regulatory T cells (Tregs) that suppress them; anergy (no co-stimulation); and activation-induced cell death.' },
            { label: 'Tolerance Failure', detail: 'Triggers include molecular mimicry (pathogen antigens resembling self-antigens), bystander activation (non-specific immune activation during infection), and genetic susceptibility (certain HLA alleles increase risk dramatically).' },
          ],
        },
        { type: 'terms', heading: 'Common Autoimmune Diseases',
          terms: [
            { term: 'Rheumatoid Arthritis (RA)', definition: 'Autoimmune attack on synovial joint lining by T cells and autoantibodies (anti-CCP, rheumatoid factor); progressive joint destruction. Treated with methotrexate and anti-TNF biologics.' },
            { term: 'Systemic Lupus Erythematosus (SLE)', definition: 'Anti-nuclear antibodies (especially anti-dsDNA) form immune complexes deposited in kidneys, skin, and joints. Causes multi-organ damage. More common in women.' },
            { term: 'Type 1 Diabetes', definition: 'CD8⁺ T cells destroy insulin-producing pancreatic β-cells; autoantibodies against insulin and glutamic acid decarboxylase (GAD) are diagnostic markers.' },
            { term: 'Multiple Sclerosis (MS)', definition: 'Th1 and Th17 cells infiltrate the CNS and attack the myelin sheath around neurons, causing progressive neurological damage.' },
          ],
        },
      ],
      takeaways: [
        'Central tolerance (thymus/bone marrow) deletes self-reactive lymphocytes; peripheral tolerance catches escapees.',
        'Molecular mimicry: pathogen antigens can look like self-antigens, triggering autoimmunity (e.g., rheumatic fever after strep).',
        'Most autoimmune diseases are treated by broadly suppressing inflammation — the goal is targeted tolerance restoration.',
      ],
      quiz: [
        { id: 'q1', question: 'What is molecular mimicry in the context of autoimmunity?', options: ['A pathogen copying host cell DNA', 'A pathogen antigen resembling a self-antigen, leading to cross-reactive immune attack', 'T cells imitating B cells', 'Complement mimicking antibodies'], correctIndex: 1, explanation: 'Molecular mimicry: immune responses raised against a pathogen antigen that resembles a self-antigen can cross-react with self-tissues. Classic example: Streptococcus M protein mimics cardiac myosin → rheumatic fever.' },
        { id: 'q2', question: 'Where does central tolerance for T cells occur?', options: ['Bone marrow', 'Lymph nodes', 'Thymus', 'Spleen'], correctIndex: 2, explanation: 'In the thymus, T cells that react too strongly to self-antigens are deleted through clonal deletion — this is central tolerance for the T cell lineage.' },
        { id: 'q3', question: 'In Type 1 Diabetes, what do CD8⁺ T cells destroy?', options: ['Thyroid hormone receptors', 'Insulin-producing pancreatic β-cells', 'Synovial joint lining', 'Myelin sheath around neurons'], correctIndex: 1, explanation: 'Type 1 Diabetes results from CD8⁺ T cells destroying insulin-producing β-cells in the pancreas, with autoantibodies against insulin and GAD serving as diagnostic markers.' },
      ],
    },
    {
      id: 'mod3-l2', title: 'Allergies & Hypersensitivity', duration: '7 min',
      sections: [
        { type: 'text', heading: 'When the Immune System Overreacts',
          body: 'Allergies are immune responses to harmless substances (allergens) that are inappropriate and damaging. They are classified into four hypersensitivity types (Coombs & Gell); the most common is Type I — IgE-mediated, which includes hay fever, food allergies, and anaphylaxis.' },
        { type: 'steps', heading: 'Type I Hypersensitivity Mechanism',
          steps: [
            { label: 'Sensitisation (first exposure)', detail: 'Dendritic cells present allergen peptides in a Th2 context (IL-4 present). Th2 cells help B cells class-switch to produce IgE specific to the allergen.' },
            { label: 'IgE Binding to Mast Cells', detail: 'IgE antibodies bind to FcεRI receptors on mast cells and basophils throughout the body. The mast cells are now "loaded" and waiting.' },
            { label: 'Re-exposure & Cross-linking', detail: 'On second exposure, allergen cross-links two IgE molecules on the mast cell surface. This triggers mast cell degranulation within seconds.' },
            { label: 'Early Phase (0–30 min)', detail: 'Histamine, prostaglandins, and leukotrienes are released. Cause: vasodilation, itch, mucus, bronchospasm (asthma), and oedema.' },
            { label: 'Late Phase (6–24 hours)', detail: 'Newly synthesised cytokines (IL-4, IL-5, IL-13) recruit eosinophils. Causes persistent inflammation, airway remodelling in chronic asthma.' },
          ],
        },
        { type: 'callout', label: 'Anaphylaxis', color: 'red',
          text: 'Severe systemic anaphylaxis occurs when massive mast cell/basophil degranulation causes vasodilation throughout the body — blood pressure drops, airways narrow, and the reaction can be fatal within minutes. Treatment: intramuscular epinephrine (adrenaline), which reverses vasodilation and bronchospasm.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Allergen', definition: 'An antigen that triggers an inappropriate IgE-mediated immune response in atopic individuals.' },
            { term: 'Atopy', definition: 'The genetic tendency to develop allergic diseases (hay fever, eczema, asthma); associated with high IgE levels and Th2-biased responses.' },
            { term: 'Histamine', definition: 'A preformed mediator stored in mast cell granules; causes vasodilation, increased vascular permeability, itching, and bronchoconstriction when released.' },
            { term: 'Anaphylaxis', definition: 'A severe, potentially fatal systemic allergic reaction involving massive mast cell degranulation. Treated with epinephrine.' },
          ],
        },
      ],
      takeaways: [
        'Allergies are IgE-mediated; first exposure sensitises, second exposure triggers rapid mast cell degranulation.',
        'Histamine causes the immediate symptoms (itch, sneezing, hives); late-phase eosinophils cause chronic inflammation.',
        'Anaphylaxis requires immediate epinephrine — it reverses the vasodilation and bronchoconstriction within minutes.',
      ],
      quiz: [
        { id: 'q1', question: 'What triggers mast cell degranulation in a Type I allergic reaction?', options: ['Complement activation', 'TCR recognition of allergen-MHC', 'Cross-linking of IgE on the mast cell surface by allergen', 'NK cell-mediated contact'], correctIndex: 2, explanation: 'Pre-formed IgE (from prior sensitisation) is bound to FcεRI on mast cells. When allergen cross-links two IgE molecules simultaneously, the FcεRI signals cause immediate degranulation and histamine release.' },
        { id: 'q2', question: 'What is the first-line emergency treatment for anaphylaxis?', options: ['Oral antihistamines', 'Intramuscular epinephrine', 'Inhaled corticosteroids', 'IV antibiotics'], correctIndex: 1, explanation: 'Epinephrine (adrenaline), given intramuscularly, reverses the vasodilation and bronchospasm of anaphylaxis and can be lifesaving within minutes.' },
        { id: 'q3', question: 'What causes the late-phase allergic response, 6–24 hours after exposure?', options: ['Histamine released from mast cells', 'Complement-mediated cell lysis', 'Newly synthesised cytokines (IL-4, IL-5, IL-13) recruiting eosinophils', 'Direct viral cytotoxicity'], correctIndex: 2, explanation: 'While histamine drives the immediate symptoms, the late phase is driven by newly made cytokines that recruit eosinophils, causing persistent inflammation and, in chronic asthma, airway remodelling.' },
      ],
    },
    {
      id: 'mod3-l3', title: 'HIV & AIDS', duration: '9 min',
      sections: [
        { type: 'text', heading: 'A Virus That Targets the Immune System\'s Hub',
          body: 'Human Immunodeficiency Virus (HIV) is a retrovirus that specifically targets CD4⁺ T cells — the very cells that coordinate the entire adaptive immune response. Over years, HIV gradually depletes CD4⁺ T cells until the immune system can no longer defend against opportunistic infections, defining AIDS.' },
        { type: 'steps', heading: 'HIV Life Cycle',
          steps: [
            { label: '1. Attachment', detail: 'HIV surface glycoprotein gp120 binds CD4 on the T cell (or macrophage). A co-receptor (CCR5 or CXCR4) is also required for fusion.' },
            { label: '2. Fusion & Entry', detail: 'gp41 mediates fusion of the viral envelope with the host cell membrane. The viral core — RNA genome + enzymes — enters the cytoplasm.' },
            { label: '3. Reverse Transcription', detail: 'HIV\'s reverse transcriptase converts the single-stranded RNA genome into double-stranded DNA. This is the step targeted by nucleoside reverse transcriptase inhibitors (NRTIs).' },
            { label: '4. Integration', detail: 'Viral integrase inserts the HIV DNA (now called a provirus) into the host cell\'s chromosome — where it can lie dormant for years. This is why HIV cannot be cured by current drugs.' },
            { label: '5. Transcription & Translation', detail: 'When the host T cell is activated, it inadvertently activates the provirus. HIV proteins are made using the host\'s ribosomes.' },
            { label: '6. Assembly & Budding', detail: 'New viral particles assemble at the cell membrane, bud off, and mature. HIV protease cleaves viral precursor proteins to produce infectious virions.' },
          ],
        },
        { type: 'callout', label: 'AIDS Definition', color: 'red',
          text: 'AIDS is diagnosed when: CD4⁺ T cell count falls below 200 cells/µL (normal ~500–1200) OR an AIDS-defining illness occurs (e.g., Pneumocystis pneumonia, Kaposi\'s sarcoma, CMV retinitis). The depletion of CD4⁺ T cells paralyses both cellular and humoral immunity.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Retrovirus', definition: 'A virus with an RNA genome that uses reverse transcriptase to convert RNA to DNA before integrating into the host genome.' },
            { term: 'Reverse Transcriptase', definition: 'HIV enzyme that converts viral RNA to DNA; inhibited by NRTIs (e.g., tenofovir) and NNRTIs — key antiretroviral drugs.' },
            { term: 'Provirus', definition: 'HIV DNA integrated into the host chromosome; can remain latent for years, making HIV incurable with current antiretrovirals.' },
            { term: 'ART (Antiretroviral Therapy)', definition: 'Combination of drugs targeting multiple HIV enzymes (reverse transcriptase, protease, integrase, entry). Suppresses viral load to undetectable levels — U=U (Undetectable = Untransmittable).' },
          ],
        },
      ],
      takeaways: [
        'HIV uses gp120 to bind CD4 and a co-receptor to enter T cells, then integrates as a provirus.',
        'Reverse transcriptase (RNA → DNA) is HIV\'s Achilles heel — most antiretrovirals target this or related steps.',
        'U=U: with effective ART, viral load becomes undetectable and the virus cannot be sexually transmitted.',
      ],
      quiz: [
        { id: 'q1', question: 'Why does HIV cause AIDS even though it\'s a viral infection?', options: ['HIV directly destroys red blood cells', 'HIV progressively depletes CD4⁺ T cells, crippling the immune system\'s ability to fight all infections', 'HIV produces a toxin that kills all white blood cells', 'HIV causes bone marrow failure'], correctIndex: 1, explanation: 'CD4⁺ T cells orchestrate both cellular and humoral immune responses. As HIV depletes them over years, the immune system loses its commander — leaving the body vulnerable to ordinarily harmless opportunistic infections.' },
        { id: 'q2', question: 'What CD4⁺ T cell count is used to diagnose AIDS?', options: ['Below 800 cells/µL', 'Below 500 cells/µL', 'Below 200 cells/µL', 'Below 50 cells/µL'], correctIndex: 2, explanation: 'AIDS is diagnosed when CD4⁺ T cell count falls below 200 cells/µL (normal is roughly 500–1200) or an AIDS-defining illness occurs.' },
        { id: 'q3', question: 'What does HIV integrase do?', options: ['Converts viral RNA into DNA', 'Inserts the HIV DNA (provirus) into the host cell\'s chromosome', 'Cleaves viral precursor proteins', 'Binds CD4 to initiate entry'], correctIndex: 1, explanation: 'Integrase inserts the reverse-transcribed HIV DNA into the host genome as a provirus, where it can remain latent for years — this is why HIV cannot be cured by current antiretrovirals alone.' },
      ],
    },
    {
      id: 'mod3-l4', title: 'Cancer & Immune Evasion', duration: '8 min',
      sections: [
        { type: 'text', heading: 'The Immune System Can — and Should — Fight Cancer',
          body: 'Your immune system constantly surveys for abnormal cells and destroys them — a process called immunosurveillance. But cancers that successfully grow have evolved strategies to escape this surveillance. Understanding these escape mechanisms is the foundation for modern immunotherapy.' },
        { type: 'steps', heading: 'The Three Es of Cancer Immunoediting',
          steps: [
            { label: 'Elimination', detail: 'The immune system (CD8⁺ T cells, NK cells, macrophages) detects and destroys early cancer cells. Most potential cancers are eliminated here — we never know about them.' },
            { label: 'Equilibrium', detail: 'A stalemate: the immune system controls but cannot eliminate the tumour. Tumour cells are under immune pressure and evolve; resistant variants emerge over months to years.' },
            { label: 'Escape', detail: 'Immune-resistant tumour clones break free. The tumour grows clinically — this is the cancer we diagnose and treat.' },
          ],
        },
        { type: 'terms', heading: 'Tumour Immune Evasion Mechanisms',
          terms: [
            { term: 'PD-L1 Upregulation', definition: 'Tumours express PD-L1 on their surface. PD-L1 binds PD-1 on T cells, sending an inhibitory "turn off" signal — effectively telling T cells to stop attacking. Blocked by checkpoint inhibitors.' },
            { term: 'MHC I Downregulation', definition: 'Tumour cells reduce MHC I expression so CD8⁺ T cells cannot "see" the tumour antigen. NK cells compensate by detecting "missing self".' },
            { term: 'Immunosuppressive TME', definition: 'The tumour microenvironment (TME) is enriched in Tregs, MDSCs (myeloid-derived suppressor cells), and anti-inflammatory cytokines (TGF-β, IL-10) that paralyse effector T cells.' },
            { term: 'T Cell Exhaustion', definition: 'Chronic antigen stimulation in the TME leads to a dysfunctional T cell state with upregulated inhibitory receptors (PD-1, Tim-3, Lag-3) and reduced cytokine production.' },
          ],
        },
      ],
      takeaways: [
        'The immune system normally eliminates cancer; only cells that evade immunity grow into clinical tumours.',
        'PD-L1 on tumour cells = the "don\'t kill me" signal; PD-1 on T cells receives it. Checkpoint inhibitors block this interaction.',
        'T cell exhaustion is the enemy of anti-tumour immunity — reversal is the goal of immunotherapy.',
      ],
      quiz: [
        { id: 'q1', question: 'How does PD-L1 on tumour cells help them evade immunity?', options: ['It activates the complement cascade', 'It binds PD-1 on T cells, sending an inhibitory signal that suppresses anti-tumour T cell activity', 'It increases MHC I expression to hide tumour antigens', 'It stimulates Treg proliferation via IL-2'], correctIndex: 1, explanation: 'PD-L1 (programmed death-ligand 1) on tumour cells binds PD-1 on T cells, triggering an inhibitory signal that reduces T cell cytokine production and proliferation — effectively exhausting the anti-tumour response.' },
        { id: 'q2', question: 'During which phase of cancer immunoediting is the tumour controlled but not eliminated?', options: ['Elimination', 'Equilibrium', 'Escape', 'Evasion'], correctIndex: 1, explanation: 'During equilibrium, the immune system holds the tumour in check without fully eliminating it. Resistant tumour variants evolve under this pressure, sometimes over years, before breaking free in the escape phase.' },
        { id: 'q3', question: 'What is the role of myeloid-derived suppressor cells (MDSCs) in the tumour microenvironment?', options: ['They present tumour antigens to activate T cells', 'They paralyse effector T cells, creating an immunosuppressive environment', 'They directly kill tumour cells', 'They produce antibodies against the tumour'], correctIndex: 1, explanation: 'MDSCs, along with Tregs and anti-inflammatory cytokines like TGF-β and IL-10, help create an immunosuppressive tumour microenvironment that blunts effector T cell function.' },
      ],
    },
  ],
};

// ── Module 4: Treatments ──────────────────────────────────────────────────────
const mod4: Module = {
  id: 'mod4', number: 4,
  title: 'Treatments',
  subtitle: 'mRNA vaccines, CAR-T therapy & checkpoint inhibitors',
  color: BRAND_COLOR,
  lessons: [
    {
      id: 'mod4-l1', title: 'mRNA Vaccines', duration: '8 min',
      sections: [
        { type: 'text', heading: 'A New Vaccine Technology',
          body: 'Traditional vaccines use weakened or killed pathogens, or pathogen proteins, to stimulate immunity. mRNA vaccines deliver instructions — a piece of mRNA encoding a pathogen antigen — that your own cells read and use to make the antigen temporarily. This triggers immunity without any live virus and without touching your DNA.' },
        { type: 'steps', heading: 'How mRNA Vaccines Work',
          steps: [
            { label: '1. mRNA Design', detail: 'Scientists identify an immunogenic antigen (e.g., SARS-CoV-2 spike protein). They synthesise mRNA encoding this protein, with chemical modifications (pseudouridine) to prevent the innate immune system from attacking it before it\'s translated — Katalin Karikó\'s Nobel-winning insight.' },
            { label: '2. Lipid Nanoparticle Delivery', detail: 'Bare mRNA is rapidly degraded in the body. It is encapsulated in lipid nanoparticles (LNPs) — tiny fat bubbles that protect the mRNA and help it enter cells by fusing with the cell membrane.' },
            { label: '3. Translation by Host Ribosomes', detail: 'Inside the cell (usually muscle cells and dendritic cells at the injection site), ribosomes translate the mRNA into the spike protein antigen. The mRNA is then degraded within days — it does not persist.' },
            { label: '4. Antigen Presentation', detail: 'Dendritic cells at the injection site take up antigen, present it on MHC I and II, and migrate to lymph nodes. There they activate both CD8⁺ and CD4⁺ T cells.' },
            { label: '5. Adaptive Immune Response', detail: 'CD4⁺ T cells help B cells produce anti-spike antibodies. CD8⁺ T cells learn to kill cells displaying the spike protein. Memory T and B cells form for long-term protection.' },
          ],
        },
        { type: 'callout', label: 'Does the mRNA change your DNA?', color: 'green',
          text: 'No. mRNA vaccine mRNA never enters the nucleus (where DNA is stored) and has no mechanism to integrate into DNA. It stays in the cytoplasm, is translated by ribosomes, and is degraded within a few days. The Central Dogma flows DNA → RNA → Protein, not the reverse.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Lipid Nanoparticle (LNP)', definition: 'The delivery vehicle for mRNA vaccines — tiny lipid vesicles that protect mRNA from degradation and facilitate cellular uptake.' },
            { term: 'Pseudouridine', definition: 'A modified nucleoside used in vaccine mRNA (replacing uridine) that prevents innate immune recognition and improves stability — Karikó & Weissman\'s key invention.' },
            { term: 'Adjuvant', definition: 'A substance that enhances vaccine immunogenicity. In mRNA vaccines, the LNPs themselves act as adjuvants by activating innate immune cells.' },
          ],
        },
      ],
      takeaways: [
        'mRNA vaccines deliver mRNA instructions that ribosomes translate into antigen — no live virus, no DNA alteration.',
        'Lipid nanoparticles protect the fragile mRNA and help it enter cells; they also act as built-in adjuvants.',
        'The mRNA degrades within days; only immune memory persists.',
      ],
      quiz: [
        { id: 'q1', question: 'Why can\'t mRNA vaccines alter your DNA?', options: ['The mRNA is too small to enter the nucleus', 'mRNA stays in the cytoplasm and is degraded within days — it has no mechanism to integrate into chromosomal DNA', 'Vaccines are injected into muscle, not into the bloodstream', 'RNA is chemically identical to DNA so the immune system ignores it'], correctIndex: 1, explanation: 'mRNA cannot be reverse-transcribed into DNA (no reverse transcriptase in most human cells) and cannot enter the nucleus. It is degraded by cellular RNases within a few days after translation.' },
        { id: 'q2', question: 'What is the role of lipid nanoparticles (LNPs) in mRNA vaccines?', options: ['They directly trigger antibody production', 'They protect the fragile mRNA and help it enter cells, also acting as an adjuvant', 'They replace the need for ribosomes', 'They convert mRNA into DNA'], correctIndex: 1, explanation: 'Bare mRNA degrades rapidly in the body. LNPs encapsulate and protect it, help it fuse with and enter cells, and themselves act as an adjuvant by activating innate immune cells.' },
        { id: 'q3', question: 'Why did Karikó and Weissman modify vaccine mRNA with pseudouridine?', options: ['To make the mRNA larger', 'To prevent innate immune recognition and improve mRNA stability', 'To help the mRNA enter the nucleus', 'To make the antigen more potent'], correctIndex: 1, explanation: 'Pseudouridine replaces regular uridine in vaccine mRNA, preventing the innate immune system from destroying it before translation — a Nobel-winning insight that made effective mRNA vaccines possible.' },
      ],
    },
    {
      id: 'mod4-l2', title: 'CAR-T Cell Therapy', duration: '9 min',
      sections: [
        { type: 'text', heading: 'Engineering T Cells to Kill Cancer',
          body: 'CAR-T cell therapy is a form of adoptive cell therapy where a patient\'s own T cells are genetically engineered to express a Chimeric Antigen Receptor (CAR) — an artificial receptor that targets a cancer cell antigen. Once infused back, CAR-T cells can seek and destroy cancer cells with extraordinary precision.' },
        { type: 'steps', heading: 'The CAR-T Manufacturing Process',
          steps: [
            { label: '1. Leukapheresis', detail: 'A patient\'s blood is processed through a machine that selects and collects T cells while returning the rest of the blood.' },
            { label: '2. Viral Transduction', detail: 'A modified retrovirus (or lentivirus) carries the CAR gene into the T cells\' genome. The CAR is a fusion protein: an antibody-derived antigen-binding domain (scFv) fused to T cell signaling domains (CD3ζ) and co-stimulatory domains (CD28 or 4-1BB).' },
            { label: '3. Expansion', detail: 'Modified T cells are expanded in culture over 1–2 weeks to produce billions of CAR-T cells.' },
            { label: '4. Lymphodepletion', detail: 'The patient receives chemotherapy to deplete existing T cells. This creates "space" in the immune system for the CAR-T cells to expand.' },
            { label: '5. Infusion & Action', detail: 'CAR-T cells are infused into the patient. They home to tumour sites and kill cancer cells that express the target antigen (e.g., CD19 on B cell leukaemias) — without requiring MHC presentation.' },
          ],
        },
        { type: 'callout', label: 'Cytokine Release Syndrome (CRS)', color: 'amber',
          text: 'As CAR-T cells activate and kill cancer cells, they release massive amounts of cytokines (especially IL-6). This can cause CRS — fever, hypotension, and organ damage. Treatment: IL-6 receptor blockade with tocilizumab. Severe CRS (grade 3–4) can be life-threatening.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'CAR (Chimeric Antigen Receptor)', definition: 'An engineered receptor combining an antibody-derived antigen-binding domain with T cell signaling domains, allowing T cells to recognise tumour antigens without MHC.' },
            { term: 'scFv', definition: 'Single-chain variable fragment — the antigen-binding portion of the CAR, derived from a monoclonal antibody.' },
            { term: 'CD19', definition: 'A surface marker expressed on B cells and most B cell leukaemias/lymphomas; the target of FDA-approved CAR-T therapies (e.g., tisagenlecleucel).' },
            { term: 'CRS', definition: 'Cytokine Release Syndrome — a potentially severe adverse effect of CAR-T therapy caused by massive cytokine release from activated T cells.' },
          ],
        },
      ],
      takeaways: [
        'CARs let T cells recognise tumour antigens without MHC — bypassing one key immune evasion mechanism.',
        'CAR-T therapy can achieve remissions in blood cancers that were previously untreatable.',
        'CRS and neurotoxicity are serious side effects that require intensive monitoring and management.',
      ],
      quiz: [
        { id: 'q1', question: 'Why is CAR-T therapy more versatile than normal T cell immunity for targeting cancer?', options: ['CARs respond faster than TCRs', 'CARs recognise tumour antigens directly without requiring MHC presentation — bypassing MHC I downregulation', 'CAR-T cells produce more antibodies', 'CAR-T cells live for only 24 hours'], correctIndex: 1, explanation: 'Normal TCR-mediated killing requires MHC I to display the tumour antigen — but many tumours downregulate MHC I. CARs use antibody-derived binding and bypass MHC entirely, so tumour MHC I loss doesn\'t protect the cancer.' },
        { id: 'q2', question: 'Why do patients receive lymphodepleting chemotherapy before CAR-T infusion?', options: ['To kill remaining cancer cells directly', 'To create space for the infused CAR-T cells to expand', 'To reduce CRS risk to zero', 'To remove the need for leukapheresis'], correctIndex: 1, explanation: 'Lymphodepletion clears out existing T cells, creating room and reducing competition for resources so the infused CAR-T cells can expand effectively in the patient.' },
        { id: 'q3', question: 'How is Cytokine Release Syndrome (CRS) typically treated?', options: ['Increasing the CAR-T dose', 'IL-6 receptor blockade with tocilizumab', 'Stopping all immunosuppression', 'A second round of leukapheresis'], correctIndex: 1, explanation: 'CRS is driven by massive cytokine release, especially IL-6, as CAR-T cells activate. Tocilizumab blocks the IL-6 receptor and is the standard treatment for moderate-to-severe CRS.' },
      ],
    },
    {
      id: 'mod4-l3', title: 'Checkpoint Inhibitors', duration: '7 min',
      sections: [
        { type: 'text', heading: 'Releasing the Brakes on Anti-Tumour Immunity',
          body: 'Immune checkpoints are natural "off switches" on T cells that prevent excessive immune activity and autoimmunity. Tumours exploit these checkpoints to silence anti-tumour T cells. Checkpoint inhibitors are monoclonal antibodies that block these off-switches — releasing the brakes and allowing T cells to attack cancer.' },
        { type: 'table', heading: 'Key Checkpoint Pathways',
          leftHeader: 'Checkpoint', rightHeader: 'Mechanism & Drugs',
          rows: [
            { left: 'PD-1/PD-L1 axis', right: 'PD-1 on T cells + PD-L1 on tumour → T cell exhaustion. Blocked by nivolumab/pembrolizumab (anti-PD-1) or atezolizumab (anti-PD-L1).' },
            { left: 'CTLA-4', right: 'Competes with CD28 for B7 binding; dampens T cell activation. Blocked by ipilimumab (anti-CTLA-4). Increases co-stimulation signal.' },
            { left: 'LAG-3', right: 'Inhibitory receptor on exhausted T cells; next-generation checkpoint target. Relatlimab (anti-LAG-3) + nivolumab approved 2022.' },
            { left: 'TIM-3', right: 'Marker of T cell exhaustion in tumour microenvironment. Under clinical investigation.' },
          ],
        },
        { type: 'callout', label: 'Nobel Prize 2018', color: 'purple',
          text: 'James Allison (CTLA-4) and Tasuku Honjo (PD-1) shared the 2018 Nobel Prize in Physiology or Medicine for discovering the checkpoint pathways that led to checkpoint inhibitor immunotherapy — one of the most significant advances in cancer treatment in decades.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Immune Checkpoint', definition: 'A regulatory mechanism that limits T cell activity to prevent autoimmunity. Cancer exploits these to evade immunity.' },
            { term: 'PD-1 (Programmed Death-1)', definition: 'Inhibitory receptor on T cells. Blockade with nivolumab or pembrolizumab reinvigorates exhausted anti-tumour T cells.' },
            { term: 'CTLA-4', definition: 'Inhibitory receptor competing with co-stimulatory CD28. Blocked by ipilimumab — the first checkpoint inhibitor approved for melanoma (2011).' },
            { term: 'irAEs (Immune-related Adverse Events)', definition: 'Side effects of checkpoint inhibitors caused by increased self-reactivity — essentially mild autoimmunity. Can affect any organ. Managed with corticosteroids.' },
          ],
        },
      ],
      takeaways: [
        'Checkpoint inhibitors block tumour-induced T cell exhaustion — they reinvigorate existing anti-tumour T cells.',
        'PD-1/PD-L1 blockade works best in tumours with high mutational burden (many neoantigens).',
        'The cost of releasing immune brakes: irAEs (immune-related adverse events) resemble autoimmune diseases.',
      ],
      quiz: [
        { id: 'q1', question: 'Why did CTLA-4 and PD-1 discoveries win the 2018 Nobel Prize?', options: ['They explained the Central Dogma', 'They led to checkpoint inhibitor immunotherapy — a transformative cancer treatment that works by removing immune brakes', 'They discovered CAR-T cell therapy', 'They developed the first mRNA vaccine'], correctIndex: 1, explanation: 'Allison and Honjo discovered that blocking CTLA-4 and PD-1 could unleash T cells against cancer. This led to checkpoint inhibitor drugs that have produced durable responses in melanoma, lung cancer, and many others.' },
        { id: 'q2', question: 'What does ipilimumab block?', options: ['PD-1', 'PD-L1', 'CTLA-4', 'LAG-3'], correctIndex: 2, explanation: 'Ipilimumab is an anti-CTLA-4 antibody, approved in 2011 for melanoma as the first checkpoint inhibitor — it blocks CTLA-4\'s competition with CD28 for B7 binding, increasing T cell co-stimulation.' },
        { id: 'q3', question: 'What are irAEs (immune-related adverse events)?', options: ['Allergic reactions to the antibody itself', 'Side effects resembling mild autoimmunity, caused by increased self-reactivity from checkpoint blockade', 'Infections caused by immunosuppression', 'Tumour resistance to the drug'], correctIndex: 1, explanation: 'By releasing the brakes on T cells generally, not just anti-tumour T cells, checkpoint inhibitors can increase self-reactivity — causing irAEs that resemble autoimmune disease and are managed with corticosteroids.' },
      ],
    },
  ],
};

// ── Module 5: Research Skills ─────────────────────────────────────────────────
const mod5: Module = {
  id: 'mod5', number: 5,
  title: 'Research Skills',
  subtitle: 'Reading papers, lab techniques & bioinformatics',
  color: BRAND_COLOR,
  lessons: [
    {
      id: 'mod5-l1', title: 'How to Read a Scientific Paper', duration: '7 min',
      sections: [
        { type: 'text', heading: 'Don\'t Read Papers Like a Textbook',
          body: 'Scientific papers are not written to be read front-to-back on a first pass. They are written for experts. As a student, you need a strategic approach: extract the key claims, assess the evidence, and judge the conclusions — without getting lost in unfamiliar jargon.' },
        { type: 'steps', heading: 'The SPAR Method: Strategic Paper Reading',
          steps: [
            { label: '1. Scan the Abstract', detail: 'Read the abstract (150–300 words) to understand: What question did they ask? What did they find? Is this relevant to me? If no → stop here.' },
            { label: '2. Read the Introduction Last Paragraph & Conclusion', detail: 'The last paragraph of the intro states the specific question/hypothesis. The conclusion summarises what was learned. Together these frame the study.' },
            { label: '3. Study the Figures & Legends', detail: 'Figures are the heart of a paper. Read each figure legend carefully — it should tell you the experiment and what the authors conclude. Do the data actually support the conclusion?' },
            { label: '4. Interrogate the Methods (if needed)', detail: 'If a figure is central to the claim, check the methods section: how was the experiment done? Are there controls? What are the limitations?' },
            { label: '5. Read the Discussion', detail: 'The discussion interprets results and compares to existing literature. Look for: What do the authors claim? What do they admit they can\'t explain? What are the limitations they acknowledge?' },
          ],
        },
        { type: 'table', heading: 'Paper Anatomy Quick Reference',
          leftHeader: 'Section', rightHeader: 'What You Find Here',
          rows: [
            { left: 'Abstract', right: 'Summary of the whole paper: question, approach, key results, conclusion.' },
            { left: 'Introduction', right: 'Background, gap in knowledge, specific hypothesis or question.' },
            { left: 'Methods', right: 'How experiments were done; reproducibility details.' },
            { left: 'Results', right: 'Data and observations — without interpretation (ideally).' },
            { left: 'Discussion', right: 'Interpretation, comparison to prior work, limitations, future directions.' },
            { left: 'References', right: 'Papers that support claims made in the text.' },
          ],
        },
        { type: 'terms', heading: 'Critical Reading Vocabulary',
          terms: [
            { term: 'p-value', definition: 'Probability that results at least as extreme as observed would occur if there were no real effect. p < 0.05 is conventionally "significant" — but this is a threshold, not a truth-guarantee.' },
            { term: 'Confidence Interval', definition: 'A range of values likely to contain the true effect size. A 95% CI that doesn\'t cross zero indicates statistical significance.' },
            { term: 'Control Group', definition: 'A comparison group that receives no treatment (or vehicle only). Without a control, you cannot attribute any change to the experimental intervention.' },
            { term: 'Confounding Variable', definition: 'An unmeasured factor that correlates with both the independent variable and the outcome — can create spurious associations.' },
            { term: 'Peer Review', definition: 'Evaluation by independent expert scientists before publication. Not perfect, but the main quality filter in science.' },
          ],
        },
      ],
      takeaways: [
        'Read Abstract → Figures → Conclusion before committing to a full paper read.',
        'Figures are the core evidence — ask: do the data actually support what the authors claim?',
        'p < 0.05 is a convention, not proof — always ask about effect size, controls, and reproducibility.',
      ],
      quiz: [
        { id: 'q1', question: 'What is the most efficient first step when approaching a new scientific paper?', options: ['Read the methods section in full', 'Read the abstract to judge relevance', 'Email the authors', 'Read the results section and then the introduction'], correctIndex: 1, explanation: 'The abstract gives you the research question, approach, key findings, and conclusion in ~250 words. It\'s the most efficient way to decide whether a paper is worth your time to read fully.' },
        { id: 'q2', question: 'What does a p-value of less than 0.05 conventionally indicate?', options: ['The result is definitely true', 'The result is statistically significant by convention, though not proof', 'The sample size was too small', 'The study had no control group'], correctIndex: 1, explanation: 'p < 0.05 is a widely used significance threshold, meaning results this extreme would be unlikely under pure chance — but it is a convention, not a guarantee of truth or importance.' },
        { id: 'q3', question: 'What information does the Methods section of a paper provide?', options: ['The authors\' opinions on future research', 'How the experiments were done, including reproducibility details', 'A summary of the entire study', 'A list of related papers'], correctIndex: 1, explanation: 'The Methods section describes exactly how the experiments were performed, which is essential for assessing whether the results are reliable and reproducible.' },
      ],
    },
    {
      id: 'mod5-l2', title: 'Lab Techniques in Immunology', duration: '9 min',
      sections: [
        { type: 'text', heading: 'How Immunologists Measure the Immune System',
          body: 'Immunology research relies on a toolkit of laboratory techniques for measuring cells, proteins, and gene expression. Understanding these techniques helps you read papers critically — you need to know what each assay can and cannot tell you.' },
        { type: 'terms', heading: 'Core Techniques',
          terms: [
            { term: 'Flow Cytometry (FACS)', definition: 'Cells are stained with fluorescent antibodies targeting specific surface or intracellular markers, then passed through a laser beam. A detector records fluorescence from each cell simultaneously. Can identify and count dozens of cell populations at once. FACS (Fluorescence-Activated Cell Sorting) also physically sorts live cells into tubes.' },
            { term: 'ELISA (Enzyme-Linked Immunosorbent Assay)', definition: 'A plate-based assay that uses antibodies to capture and detect specific proteins (e.g., cytokines in serum). A capture antibody binds the target → sample is added → detection antibody + enzyme substrate → colour change proportional to protein amount. Very sensitive and quantitative.' },
            { term: 'Western Blot', definition: 'Proteins are separated by size on an SDS-PAGE gel, transferred to a membrane, and detected with specific antibodies. Confirms protein identity (correct size) and allows semi-quantitative comparison between samples.' },
            { term: 'PCR (Polymerase Chain Reaction)', definition: 'Amplifies specific DNA sequences exponentially using a heat-stable polymerase. Used to detect pathogen DNA (diagnostic PCR), genotype samples, or confirm gene editing.' },
            { term: 'qRT-PCR (Quantitative Real-Time PCR)', definition: 'Converts mRNA to cDNA (reverse transcription) then amplifies with real-time fluorescence detection. The most accurate method to measure gene expression levels in a specific sample.' },
            { term: 'ELISPOT', definition: 'Detects cells secreting a specific cytokine or antibody by capturing their secretions on a plate and detecting as "spots". Used to count antigen-specific T cells after vaccination or infection.' },
            { term: 'Histology / Immunohistochemistry (IHC)', definition: 'Tissue sections are stained with antibodies to visualise where specific proteins are located in a tissue. Essential for seeing inflammation, tumour-infiltrating lymphocytes, and tissue pathology in context.' },
          ],
        },
        { type: 'callout', label: 'Choosing the Right Technique', color: 'blue',
          text: 'Which technique to use depends on what you\'re measuring: Cell numbers/phenotype → flow cytometry. Secreted protein levels → ELISA. Intracellular signaling protein → western blot. Gene expression → qRT-PCR. Tissue location → IHC.' },
      ],
      takeaways: [
        'Flow cytometry identifies cell types by surface markers and can sort live cells — the workhorse of immunophenotyping.',
        'ELISA quantifies proteins in solution; western blot identifies proteins by size in cell lysates.',
        'Match the technique to the question: each assay has specific strengths and blind spots.',
      ],
      quiz: [
        { id: 'q1', question: 'A researcher wants to count how many CD4⁺ T cells are in a blood sample and check which are also PD-1⁺. Which technique is best?', options: ['Western blot', 'ELISA', 'Flow cytometry', 'qRT-PCR'], correctIndex: 2, explanation: 'Flow cytometry allows simultaneous detection of multiple surface markers (CD4, PD-1) on individual cells. A researcher can gate on CD4⁺ cells and then see what fraction co-express PD-1 — impossible with bulk techniques like ELISA or western blot.' },
        { id: 'q2', question: 'Which technique would best measure the concentration of a specific cytokine in serum?', options: ['Western blot', 'ELISA', 'Flow cytometry', 'Immunohistochemistry'], correctIndex: 1, explanation: 'ELISA uses capture and detection antibodies to quantify a specific protein in solution, such as a cytokine in serum, producing a sensitive, quantitative readout.' },
        { id: 'q3', question: 'What can immunohistochemistry (IHC) reveal that flow cytometry cannot?', options: ['The exact number of cells of a given type', 'The amount of a soluble protein in blood', 'Where a protein is physically located within intact tissue', 'The DNA sequence of a gene'], correctIndex: 2, explanation: 'IHC stains intact tissue sections, preserving spatial information about where a protein sits — such as tumour-infiltrating lymphocytes — which flow cytometry loses by breaking tissue into single cells.' },
      ],
    },
    {
      id: 'mod5-l3', title: 'Computational Biology & RNA-seq', duration: '9 min',
      sections: [
        { type: 'text', heading: 'Big Data in Immunology',
          body: 'Modern immunology generates enormous datasets — RNA sequencing can measure the expression of all ~20,000 human genes simultaneously across thousands of samples or millions of individual cells. Making sense of this data requires bioinformatics: the application of computational methods to biological questions.' },
        { type: 'steps', heading: 'The RNA-seq Pipeline',
          steps: [
            { label: '1. RNA Extraction & Library Prep', detail: 'RNA is extracted from cells and converted to cDNA. Adaptors are added to each fragment — these identify which sample a read comes from and allow sequencing.' },
            { label: '2. Sequencing', detail: 'A next-generation sequencer (e.g., Illumina) reads millions of short fragments (reads) — 50–150 base pairs — from each cDNA library.' },
            { label: '3. Alignment', detail: 'Reads are mapped back to a reference genome (or transcriptome) using alignment tools (STAR, HISAT2). This determines which gene each read came from.' },
            { label: '4. Counting & Normalisation', detail: 'Reads mapped to each gene are counted. Counts are normalised for sequencing depth and gene length (e.g., TPM or DESeq2 normalised counts).' },
            { label: '5. Differential Expression Analysis', detail: 'Statistical tests (DESeq2, edgeR) identify genes significantly up- or down-regulated between conditions (e.g., activated vs resting T cells).' },
            { label: '6. Visualisation & Interpretation', detail: 'Results displayed as volcano plots (fold-change vs significance), heatmaps, and pathway enrichment analyses to understand biological meaning.' },
          ],
        },
        { type: 'table', heading: 'Bulk RNA-seq vs Single-Cell RNA-seq',
          leftHeader: 'Bulk RNA-seq', rightHeader: 'Single-Cell RNA-seq (scRNA-seq)',
          rows: [
            { left: 'Measures average expression across thousands of cells', right: 'Measures expression in each individual cell' },
            { left: 'Cannot identify cell types in a mixed sample', right: 'Identifies cell types by clustering their transcriptome profiles' },
            { left: 'High sensitivity for rare transcripts', right: 'Lower sensitivity per cell (dropout problem)' },
            { left: 'Cheaper and more established', right: 'Expensive but reveals cellular heterogeneity' },
            { left: 'Output: gene counts per sample', right: 'Output: UMAP plots, cell-type clusters, pseudotime trajectories' },
          ],
        },
        { type: 'terms', heading: 'Bioinformatics Vocabulary',
          terms: [
            { term: 'Differential Gene Expression (DGE)', definition: 'Statistically significant differences in RNA levels between experimental conditions. Genes are called "DEGs" (differentially expressed genes).' },
            { term: 'UMAP', definition: 'Uniform Manifold Approximation and Projection — a dimensionality reduction algorithm used to visualise high-dimensional scRNA-seq data as 2D scatter plots, where similar cells cluster together.' },
            { term: 'Volcano Plot', definition: 'A scatter plot with log2(fold-change) on x-axis and −log10(p-value) on y-axis. Significant DEGs appear as dots in the upper-left (down) or upper-right (up) corners.' },
            { term: 'Pathway Enrichment', definition: 'Analysis that identifies biological pathways (e.g., from KEGG or Gene Ontology) statistically over-represented in a list of DEGs.' },
            { term: 'Drop-seq / 10x Genomics', definition: 'High-throughput scRNA-seq platforms that encapsulate individual cells in droplets with barcoded beads, enabling profiling of tens of thousands of cells per run.' },
          ],
        },
      ],
      takeaways: [
        'RNA-seq measures gene expression genome-wide; scRNA-seq does this at single-cell resolution.',
        'The pipeline: extract RNA → sequence → align → count → differential expression → visualise.',
        'UMAP plots cluster cells by transcriptomic similarity — clusters often correspond to distinct cell types.',
      ],
      quiz: [
        { id: 'q1', question: 'What key advantage does single-cell RNA-seq have over bulk RNA-seq?', options: ['It measures protein levels rather than RNA', 'It reveals gene expression at the level of individual cells, uncovering cell-type heterogeneity hidden in bulk averages', 'It is cheaper and requires less computational power', 'It measures genomic DNA rather than mRNA'], correctIndex: 1, explanation: 'Bulk RNA-seq averages gene expression across all cells in a sample, masking the diversity within. scRNA-seq measures each cell individually, allowing identification of rare cell types, subpopulations, and transitional states.' },
        { id: 'q2', question: 'What does a volcano plot display in RNA-seq analysis?', options: ['Cell locations on a UMAP', 'log2(fold-change) versus −log10(p-value) to highlight significant gene expression changes', 'The raw sequencing reads', 'The structure of the reference genome'], correctIndex: 1, explanation: 'A volcano plot puts fold-change on one axis and statistical significance on the other, making genes that are both strongly changed and statistically significant stand out as dots in the upper corners.' },
        { id: 'q3', question: 'What is the purpose of the alignment step in an RNA-seq pipeline?', options: ['To normalise read counts for sequencing depth', 'To map sequencing reads back to a reference genome and determine which gene they came from', 'To visualise results as a heatmap', 'To extract RNA from cells'], correctIndex: 1, explanation: 'Alignment tools like STAR or HISAT2 map each short sequencing read to a reference genome or transcriptome, identifying which gene each read originated from before counting can occur.' },
      ],
    },
  ],
};

// ── Module 6: From Bench to Bedside — Biomedical Research ───────────────────────
const mod6: Module = {
  id: 'mod6', number: 6,
  title: 'Biomedical Research',
  subtitle: 'Turning immunology into discovery — methods and how students get started',
  color: BRAND_COLOR,
  lessons: [
    {
      id: 'mod6-l1', title: 'From Lessons to the Lab', duration: '8 min',
      sections: [
        { type: 'text', heading: 'Why translational science exists',
          body: 'Everything you have learned so far — T cells, antibodies, checkpoints, cytokines — started as a discovery in someone\'s lab. Translational research is the work of moving a finding from a test tube ("the bench") to a treatment that helps a patient ("the bedside"). It is slow, collaborative, and where immunology becomes medicine: checkpoint inhibitors, mRNA vaccines, and CAR-T all walked this path.' },
        { type: 'steps', heading: 'The translational pipeline',
          steps: [
            { label: 'Basic science', detail: 'Curiosity-driven work in cells and model organisms reveals how something works — e.g., the discovery that T cells carry an "off switch" (CTLA-4, PD-1).' },
            { label: 'Preclinical', detail: 'A hypothesis is tested in cell cultures and animal models for safety and efficacy. Most candidate ideas fail here — and that is a normal, useful result.' },
            { label: 'Translational ("T1")', detail: 'Promising biology is turned into a candidate drug, vaccine, or diagnostic and prepared for human study.' },
            { label: 'Clinical trials', detail: 'Phase I (safety, small), Phase II (does it work?), Phase III (large, vs. standard of care). Then regulators (e.g., the FDA) review the evidence.' },
            { label: 'Clinical practice & beyond', detail: 'Approved therapies enter clinics; post-marketing studies ("T4") track real-world safety and effectiveness across whole populations.' },
          ],
        },
        { type: 'callout', label: 'A real example', color: '#14B8A6',
          text: 'Jim Allison spent years studying CTLA-4 as basic biology. Blocking it freed T cells to attack tumors in mice (preclinical), which led to ipilimumab — the first checkpoint inhibitor approved for melanoma in 2011. Bench to bedside took roughly two decades. He shared the 2018 Nobel Prize for it.' },
        { type: 'table', heading: 'Types of biomedical research',
          leftHeader: 'Type', rightHeader: 'What it asks',
          rows: [
            { left: 'Basic / fundamental', right: 'How does this system work? (mechanism)' },
            { left: 'Translational', right: 'Can we turn this mechanism into a therapy or test?' },
            { left: 'Clinical', right: 'Is it safe and effective in real patients?' },
            { left: 'Epidemiological / population', right: 'Who gets the disease, and what patterns predict it?' },
            { left: 'Computational / dry-lab', right: 'What can we learn from existing data without a wet lab?' },
          ],
        },
      ],
      takeaways: [
        'Translational research moves discoveries from the bench to the bedside through preclinical work, clinical trials, and regulatory review.',
        'Most ideas fail in preclinical or early trials — that is expected and still scientifically valuable.',
        'Checkpoint inhibitors, mRNA vaccines, and CAR-T are all immunology discoveries that completed this pipeline.',
      ],
      quiz: [
        { id: 'q1', question: 'What is the main goal of translational research?', options: ['To publish as many papers as possible', 'To move a discovery from the lab toward a real treatment or test', 'To replace clinical trials', 'To study only animal models'], correctIndex: 1, explanation: 'Translational research bridges basic discovery and clinical application — turning mechanisms into therapies, diagnostics, or vaccines.' },
        { id: 'q2', question: 'Which phase of a clinical trial primarily tests safety in a small group?', options: ['Phase I', 'Phase II', 'Phase III', 'Phase IV'], correctIndex: 0, explanation: 'Phase I trials are small and focus on safety and dosing. Efficacy is the focus of Phase II and III.' },
        { id: 'q3', question: 'Which type of research asks "who gets the disease, and what patterns predict it"?', options: ['Basic / fundamental research', 'Translational research', 'Epidemiological / population research', 'Computational / dry-lab research'], correctIndex: 2, explanation: 'Epidemiological research studies patterns of disease across populations — who is affected and what factors predict risk — distinct from basic mechanism-focused research.' },
      ],
    },
    {
      id: 'mod6-l2', title: 'Core Lab Methods', duration: '9 min',
      sections: [
        { type: 'text', heading: 'The immunologist\'s toolkit',
          body: 'Research questions are answered with techniques. You do not need to master these before joining a lab — you will learn them hands-on — but recognizing what each one measures makes papers far easier to read and helps you understand what a lab actually does day to day.' },
        { type: 'terms', heading: 'Techniques you will see in almost every immunology paper',
          terms: [
            { term: 'Flow cytometry / FACS', definition: 'Passes single cells through a laser to count and sort them by surface markers tagged with fluorescent antibodies. The workhorse for "how many of which immune cell."' },
            { term: 'ELISA', definition: 'Enzyme-Linked Immunosorbent Assay — uses antibodies to measure the concentration of a specific protein (e.g., a cytokine) in a sample, read out as a color change.' },
            { term: 'PCR / qPCR', definition: 'Polymerase Chain Reaction amplifies a target DNA sequence; quantitative PCR measures how much is present. RT-qPCR does the same for RNA (gene expression).' },
            { term: 'Western blot', definition: 'Separates proteins by size and uses antibodies to detect a specific one — confirms a protein is present and roughly how much.' },
            { term: 'Cell culture', definition: 'Growing cells in a dish under controlled conditions, so you can treat them and observe responses. The foundation of most wet-lab experiments.' },
            { term: 'CRISPR-Cas9', definition: 'A gene-editing tool that cuts DNA at a chosen sequence, letting researchers knock out or alter genes to test their function.' },
            { term: 'Immunohistochemistry (IHC)', definition: 'Uses antibodies with a visible stain to show where a protein sits within a tissue slice under a microscope.' },
            { term: 'Sequencing (DNA/RNA)', definition: 'Reads the exact order of bases. RNA-seq measures which genes are active; single-cell sequencing does this one cell at a time.' },
          ],
        },
        { type: 'callout', label: 'Wet lab vs. dry lab', color: '#14B8A6',
          text: 'A "wet lab" works with physical samples — cells, blood, reagents. A "dry lab" works with data and code (bioinformatics, statistics, modeling). Many modern labs do both, and dry-lab skills are increasingly valuable — which is exactly why the Machine Learning module is part of this app.' },
      ],
      takeaways: [
        'Flow cytometry, ELISA, PCR, and Western blot are the core measurement tools of immunology.',
        'CRISPR lets researchers edit genes to test what each one does.',
        'Dry-lab (computational) skills now complement wet-lab work in most research groups.',
      ],
      quiz: [
        { id: 'q1', question: 'Which technique would you use to count how many CD8⁺ T cells are in a blood sample?', options: ['Western blot', 'Flow cytometry', 'ELISA', 'PCR'], correctIndex: 1, explanation: 'Flow cytometry identifies and counts cells by their surface markers using fluorescent antibodies — ideal for quantifying a specific immune-cell population.' },
        { id: 'q2', question: 'What does RNA-seq measure?', options: ['The amount of a single protein', 'Which genes are being expressed and how strongly', 'The number of cells in a sample', 'The 3D structure of an antibody'], correctIndex: 1, explanation: 'RNA sequencing reads the mRNA in a sample to reveal gene expression across the transcriptome.' },
        { id: 'q3', question: 'What is the key difference between a "wet lab" and a "dry lab"?', options: ['A wet lab only studies water-borne pathogens', 'A wet lab works with physical samples; a dry lab works with data and code', 'A dry lab cannot use CRISPR', 'There is no real difference'], correctIndex: 1, explanation: 'A wet lab handles physical materials like cells and reagents, while a dry lab focuses on data, code, and computational analysis — many modern labs combine both.' },
      ],
    },
    {
      id: 'mod6-l3', title: 'Getting Into Research as a Student', duration: '9 min',
      sections: [
        { type: 'text', heading: 'You can start earlier than you think',
          body: 'You do not need a degree to contribute to research. High-school and undergraduate students join labs every year — usually by being curious, reliable, and willing to learn unglamorous tasks. The hardest part is simply getting your foot in the door, and that is a process you can actually plan for.' },
        { type: 'steps', heading: 'A realistic path into a lab',
          steps: [
            { label: 'Find labs that excite you', detail: 'Look up university department websites and read faculty "research interests." Note 5–10 labs whose work connects to something you learned here — say, a lab studying checkpoint inhibitors or autoimmunity.' },
            { label: 'Read one of their recent papers', detail: 'You will not understand all of it — that is fine. Understanding the abstract and the main figure is enough to write a genuine, specific email.' },
            { label: 'Send a short, specific cold email', detail: 'Address the professor by name, say what you found interesting in their work, state that you are looking for research experience, and attach a short résumé. Keep it under 150 words. Ask for a brief meeting, not a job.' },
            { label: 'Follow up once', detail: 'Professors get many emails. A single polite follow-up after 1–2 weeks is normal and often what gets a reply.' },
            { label: 'Say yes to starter tasks', detail: 'You may begin by washing glassware, making solutions, or organizing data. Doing small things carefully is how you earn bigger responsibilities and eventually your own project.' },
          ],
        },
        { type: 'table', heading: 'Where to look for opportunities',
          leftHeader: 'Opportunity', rightHeader: 'What it is',
          rows: [
            { left: 'University labs (volunteer/intern)', right: 'Email faculty directly; the most common entry point.' },
            { left: 'Summer research programs', right: 'Structured, often-paid programs (e.g., NIH, SIMR, RSI, university REUs) with applications months ahead.' },
            { left: 'Community college / local hospitals', right: 'Smaller institutions are often very open to motivated students.' },
            { left: 'Science fairs & mentorship programs', right: 'Programs that pair students with mentors for an independent project.' },
            { left: 'Citizen science & open data', right: 'Projects like Foldit, or public datasets you can analyze from home with code.' },
          ],
        },
        { type: 'callout', label: 'What labs actually want', color: '#14B8A6',
          text: 'Not a genius — a reliable, honest, curious person who shows up, follows protocols carefully, records everything, and asks good questions. Enthusiasm and consistency beat a perfect transcript almost every time.' },
        { type: 'terms', heading: 'Things that help you stand out',
          terms: [
            { term: 'A lab notebook habit', definition: 'Recording exactly what you did and saw, every time. Reproducibility starts with good notes, and mentors notice this immediately.' },
            { term: 'Basic data skills', definition: 'Comfort with a spreadsheet, and ideally a little Python or R, makes you useful on day one — especially for dry-lab work.' },
            { term: 'Reading papers', definition: 'Being able to summarize a paper\'s question, method, and finding shows you can engage with real science.' },
            { term: 'Scientific honesty', definition: 'Reporting what actually happened — including failed experiments and surprising results — is the single most important trait a researcher can have.' },
          ],
        },
      ],
      takeaways: [
        'The main route into a lab is a short, specific cold email to a professor whose work you have actually read.',
        'Summer research programs, local hospitals, and open datasets are all valid entry points.',
        'Labs value reliability, careful note-taking, and honesty over raw talent.',
      ],
      quiz: [
        { id: 'q1', question: 'What makes a cold email to a professor most effective?', options: ['Sending the same generic email to 100 professors', 'Referencing something specific from their actual research and keeping it short', 'Demanding a paid position immediately', 'Listing every class you have ever taken'], correctIndex: 1, explanation: 'A specific, concise email that shows you read their work — and asks for a brief conversation rather than a job — gets far more replies than a generic mass email.' },
        { id: 'q2', question: 'Which trait do research mentors value most in a new student?', options: ['A perfect GPA', 'Reliability and careful, honest record-keeping', 'Already knowing every technique', 'Working alone without asking questions'], correctIndex: 1, explanation: 'Reproducible science depends on people who show up, follow protocols carefully, and report what truly happened. That reliability matters more than prior expertise.' },
        { id: 'q3', question: 'Besides emailing university labs directly, what is another valid entry point into research as a student?', options: ['Only PhD programs accept students', 'Structured summer research programs (e.g. NIH, SIMR, RSI, university REUs)', 'There are no other options', 'Research requires a college degree first'], correctIndex: 1, explanation: 'Summer research programs, local hospitals, science fairs with mentorship, and citizen science/open-data projects are all valid ways in, alongside directly emailing faculty.' },
      ],
    },
    {
      id: 'mod6-l4', title: 'Designing a Sound Study', duration: '8 min',
      sections: [
        { type: 'text', heading: 'A good question, tested fairly',
          body: 'Whether you are running a pipette or a Python script, the logic of a sound experiment is the same: a clear hypothesis, the right comparisons, and controls that rule out alternative explanations. Understanding this lets you spot strong vs. weak studies — and design your own.' },
        { type: 'terms', heading: 'The vocabulary of experimental design',
          terms: [
            { term: 'Hypothesis', definition: 'A specific, testable prediction — e.g., "Blocking PD-1 will increase T-cell killing of tumor cells."' },
            { term: 'Independent variable', definition: 'The thing you deliberately change (e.g., adding a PD-1 blocker or not).' },
            { term: 'Dependent variable', definition: 'The outcome you measure (e.g., number of tumor cells killed).' },
            { term: 'Control group', definition: 'An otherwise-identical group that does not receive the treatment, so you can tell the treatment caused the effect.' },
            { term: 'Positive / negative control', definition: 'A condition expected to work (positive) or to do nothing (negative) — they confirm the experiment itself is functioning.' },
            { term: 'Confounder', definition: 'A hidden variable that could explain your result instead of the treatment. Good design controls for these.' },
            { term: 'Replication', definition: 'Repeating the experiment (and having others repeat it) to confirm the result is real and not chance.' },
            { term: 'Blinding & randomization', definition: 'Hiding group assignments and assigning subjects randomly to prevent bias from creeping into results.' },
          ],
        },
        { type: 'callout', label: 'Ethics is part of the method', color: '#14B8A6',
          text: 'Research with humans or animals must be approved by an oversight board (an IRB for humans, IACUC for animals) and requires informed consent. Ethical review is not bureaucracy — it is what makes research trustworthy and protects the people it aims to help.' },
        { type: 'text', heading: 'Why reproducibility matters',
          body: 'A result that no one else can reproduce is not yet knowledge. Strong studies share their methods and data so others can check them. As you read papers, ask: was there a proper control? How many times was this repeated? Could something other than the treatment explain the result? These same questions apply with even more force to data-driven studies — which is where the Machine Learning module picks up.' },
      ],
      takeaways: [
        'A sound experiment pairs a clear hypothesis with the right controls to rule out alternative explanations.',
        'Controls, replication, blinding, and randomization are what separate strong studies from weak ones.',
        'Human and animal research requires ethical review (IRB / IACUC) and informed consent.',
      ],
      quiz: [
        { id: 'q1', question: 'Why is a control group essential in an experiment?', options: ['It makes the experiment bigger', 'It lets you attribute the observed effect to the treatment rather than chance or other factors', 'It is required for funding only', 'It replaces the need for replication'], correctIndex: 1, explanation: 'Without an otherwise-identical control group, you cannot tell whether the treatment — or something else entirely — caused the result.' },
        { id: 'q2', question: 'What is a confounder?', options: ['The main treatment being tested', 'A hidden variable that could explain the result instead of the treatment', 'The measured outcome', 'A type of control'], correctIndex: 1, explanation: 'A confounder is an uncontrolled variable correlated with both the treatment and outcome, which can create a misleading apparent effect.' },
        { id: 'q3', question: 'What must happen before research can be conducted on human or animal subjects?', options: ['Nothing extra is required beyond a hypothesis', 'Approval by an oversight board (IRB for humans, IACUC for animals) and informed consent where applicable', 'Only a faculty advisor\'s signature', 'Publication in a journal first'], correctIndex: 1, explanation: 'Ethical review boards like an IRB (humans) or IACUC (animals) must approve research involving living subjects, and informed consent is required for human studies — this protects participants and keeps research trustworthy.' },
      ],
    },
  ],
};

// ── Module 7: Machine Learning for Biomedicine ─────────────────────────────────
const mod7: Module = {
  id: 'mod7', number: 7,
  title: 'Machine Learning',
  subtitle: 'How computers learn patterns from data — and how to do it without fooling yourself',
  color: BRAND_COLOR,
  lessons: [
    {
      id: 'mod7-l1', title: 'What Is Machine Learning?', duration: '8 min',
      sections: [
        { type: 'text', heading: 'Learning from examples, not rules',
          body: 'Machine learning (ML) is a branch of artificial intelligence focused on systems that learn patterns from data and use them to make predictions or decisions. Instead of a human writing every rule by hand, the model learns from examples. In biomedicine this powers tools that flag tumors on scans, predict disease flares, and find structure in single-cell data.' },
        { type: 'text', heading: 'Features and labels',
          body: 'ML usually starts with data containing input variables called features (e.g., age, lab values, gene expression) and sometimes an output variable called the target or label (e.g., disease vs. no disease). The model studies the relationship between features and target, then applies what it learned to new, unseen data.' },
        { type: 'table', heading: 'The four ways models learn',
          leftHeader: 'Learning type', rightHeader: 'How it works',
          rows: [
            { left: 'Supervised', right: 'Learns from labeled examples (inputs + correct answers). Used for classification and regression.' },
            { left: 'Unsupervised', right: 'Finds structure in data without labels — clustering, dimensionality reduction, anomaly detection.' },
            { left: 'Semi-supervised', right: 'Uses a little labeled data plus lots of unlabeled data — helpful when labels are expensive.' },
            { left: 'Reinforcement', right: 'An agent learns by taking actions and receiving rewards or penalties (robotics, games, control).' },
          ],
        },
        { type: 'callout', label: 'Everyday examples', color: '#6366F1',
          text: 'Predicting house prices from size and location (regression), classifying email as spam (classification), recommending movies from past viewing (recommendation), and flagging unusual transactions as possible fraud (anomaly detection) are all machine learning.' },
      ],
      takeaways: [
        'Machine learning systems learn patterns from examples instead of being programmed with explicit rules.',
        'Features are the inputs; the label/target is the answer the model tries to predict.',
        'Supervised learning uses labeled data; unsupervised learning finds structure without labels.',
      ],
      quiz: [
        { id: 'q1', question: 'In machine learning, what is a "feature"?', options: ['The final prediction', 'An input variable the model uses to make predictions', 'The correct answer for a training example', 'A type of model'], correctIndex: 1, explanation: 'Features are the input variables (e.g., age, lab values). The target/label is the answer; the model learns the relationship between them.' },
        { id: 'q2', question: 'Which learning type finds structure in data without any labels?', options: ['Supervised learning', 'Unsupervised learning', 'Reinforcement learning', 'Semi-supervised learning'], correctIndex: 1, explanation: 'Unsupervised learning works without labeled answers — clustering, dimensionality reduction, and anomaly detection are its common tasks.' },
        { id: 'q3', question: 'Predicting a house price from its size and location is an example of which ML task?', options: ['Classification', 'Regression', 'Clustering', 'Reinforcement learning'], correctIndex: 1, explanation: 'Predicting a continuous numeric value, like a price, is regression — as opposed to classification, which predicts a category.' },
      ],
    },
    {
      id: 'mod7-l2', title: 'Tasks & Models', duration: '10 min',
      sections: [
        { type: 'text', heading: 'Match the task to the model',
          body: 'The job determines the tool. Classification predicts a category (spam vs. not spam, benign vs. malignant). Regression predicts a continuous number (price, risk score, time to failure). Clustering groups similar points; anomaly detection flags rare patterns. Once you know your task, you can pick a model — and it is almost always best to start simple.' },
        { type: 'table', heading: 'Common models and where they shine',
          leftHeader: 'Model', rightHeader: 'Best for',
          rows: [
            { left: 'Linear regression', right: 'Predicting numbers when the relationship is roughly linear. Fast, interpretable baseline.' },
            { left: 'Logistic regression', right: 'Classification with interpretable probabilities; a strong baseline for medical risk.' },
            { left: 'K-nearest neighbors', right: 'Small/medium data where similar samples share labels. Sensitive to scaling.' },
            { left: 'Decision trees', right: 'Rule-based, easy to visualize, captures nonlinearity. Can overfit if unpruned.' },
            { left: 'Random forests', right: 'Many trees combined — stable and accurate on tabular data with little tuning.' },
            { left: 'Gradient boosted trees', right: 'XGBoost / LightGBM / CatBoost — often the strongest for structured/tabular data.' },
            { left: 'Support vector machines', right: 'High-dimensional data (e.g., biology, text); kernels model nonlinear patterns.' },
            { left: 'Naive Bayes', right: 'Fast text/sparse-data classification; makes a strong independence assumption.' },
            { left: 'Neural networks', right: 'Images, language, audio, large complex data; need more data and compute.' },
          ],
        },
        { type: 'callout', label: 'High-yield pattern', color: '#6366F1',
          text: 'For everyday tabular data (rows and columns, like a clinical spreadsheet), tree-based models — especially gradient boosting — are usually the strongest. Neural networks dominate for images, language, and audio. Always compare against a simple baseline first.' },
      ],
      takeaways: [
        'Classification predicts categories; regression predicts continuous numbers.',
        'For tabular data, tree-based models (especially gradient boosting) are usually strongest.',
        'Neural networks excel at images, language, and audio but need more data and compute.',
      ],
      quiz: [
        { id: 'q1', question: 'You want to predict a patient\'s continuous risk score from lab values. Which task is this?', options: ['Classification', 'Regression', 'Clustering', 'Anomaly detection'], correctIndex: 1, explanation: 'Predicting a continuous numeric value is regression. Predicting a category would be classification.' },
        { id: 'q2', question: 'For a standard tabular clinical dataset, which model family is often the strongest?', options: ['Neural networks', 'Gradient boosted trees', 'K-nearest neighbors', 'Naive Bayes'], correctIndex: 1, explanation: 'Gradient boosted trees (XGBoost, LightGBM, CatBoost) frequently outperform other models on structured/tabular data, though a simple baseline should always be compared first.' },
        { id: 'q3', question: 'Which model family generally excels at images, language, and audio data?', options: ['Linear regression', 'Decision trees', 'Neural networks', 'Naive Bayes'], correctIndex: 2, explanation: 'Neural networks dominate for images, language, and audio, though they typically need more data and compute than tree-based models used for tabular data.' },
      ],
    },
    {
      id: 'mod7-l3', title: 'The ML Workflow & Data Prep', duration: '10 min',
      sections: [
        { type: 'text', heading: 'Most of the work is the data',
          body: 'Newcomers think ML is about choosing a fancy model. In practice, the quality of the data and the care of the workflow matter far more. Poor data leads to poor models, even with advanced algorithms — "garbage in, garbage out."' },
        { type: 'steps', heading: 'A typical machine learning workflow',
          steps: [
            { label: 'Define the problem & metric', detail: 'State what you are predicting and how you will measure success — chosen to match the real-world goal.' },
            { label: 'Collect & understand the data', detail: 'Explore distributions, missing values, and obvious errors before modeling.' },
            { label: 'Clean & preprocess', detail: 'Fix errors and duplicates, handle missing data, encode categories, scale features when needed. Fit preprocessing on training data only.' },
            { label: 'Split the data', detail: 'Train / validation / test, or cross-validation. Keep the test set untouched until the very end.' },
            { label: 'Baseline, then train', detail: 'Start with a simple model, then train candidate models.' },
            { label: 'Compare, tune, evaluate', detail: 'Compare with goal-matched metrics, tune hyperparameters, then evaluate once on the held-out test set.' },
            { label: 'Interpret & deploy', detail: 'Check for bias, leakage, and overfitting; then deploy, monitor, and update as data changes.' },
          ],
        },
        { type: 'terms', heading: 'Data & preparation concepts',
          terms: [
            { term: 'Numeric vs. categorical', definition: 'Numeric inputs are numbers (age, lab values). Categorical inputs are groups — ordinal (ordered, like cancer stage) or nominal (unordered, like blood type).' },
            { term: 'One-hot encoding', definition: 'Turning a categorical variable into 0/1 columns so a model can use it.' },
            { term: 'Feature scaling', definition: 'Putting numeric features on a comparable scale — important for KNN, SVMs, linear models, and neural networks.' },
            { term: 'Hyperparameters', definition: 'Settings chosen before/around training (e.g., number of trees, learning rate, tree depth) — not learned from data like model parameters are.' },
            { term: 'Feature selection', definition: 'Reducing input variables to cut noise and speed up models — but it must be done inside the training folds to avoid leakage.' },
          ],
        },
        { type: 'callout', label: 'The cardinal sin: data leakage', color: '#6366F1',
          text: 'Data leakage is when information outside the training data sneaks into preprocessing, feature selection, or tuning — for example, scaling the whole dataset before splitting, or picking features using all the labels. Leakage makes results look great but they collapse on real new data. Fit everything on training data only, and use the test set exactly once.' },
      ],
      takeaways: [
        'Data quality and a careful workflow usually matter more than the choice of model.',
        'Always start with a simple baseline before reaching for complex models.',
        'Data leakage — letting test information influence training — is the most dangerous, easy-to-miss mistake.',
      ],
      quiz: [
        { id: 'q1', question: 'Why should preprocessing (like scaling) be fit on the training data only?', options: ['It runs faster that way', 'To avoid data leakage that makes results look better than they really are', 'Because the test set has no features', 'It is not important which data you use'], correctIndex: 1, explanation: 'Fitting preprocessing on the full dataset lets test-set information leak into training, inflating performance estimates. Fit on training data, then apply to validation/test.' },
        { id: 'q2', question: 'What is a hyperparameter?', options: ['A value learned automatically during training', 'A setting chosen before/around training, like learning rate or number of trees', 'The model\'s final prediction', 'A type of input feature'], correctIndex: 1, explanation: 'Hyperparameters (e.g., tree depth, learning rate) are configured by the user or a tuning process; model parameters are what the model learns from data.' },
        { id: 'q3', question: 'What is one-hot encoding used for?', options: ['Scaling numeric features', 'Turning a categorical variable into 0/1 columns so a model can use it', 'Removing missing values', 'Splitting data into train/test sets'], correctIndex: 1, explanation: 'One-hot encoding converts a categorical variable (e.g. blood type) into separate binary columns, since most models require numeric input rather than category labels.' },
      ],
    },
    {
      id: 'mod7-l4', title: 'Evaluation, Validation & Trust', duration: '11 min',
      sections: [
        { type: 'text', heading: 'Did it really work?',
          body: 'A model that scores well on paper can still be useless — or dangerous — in the real world. Trustworthy ML depends on choosing the right metric, validating without leakage, and sanity-checking that the model found real signal rather than noise. This is especially true in medicine, where errors have real costs.' },
        { type: 'table', heading: 'Choosing the right metric',
          leftHeader: 'Metric', rightHeader: 'When it matters',
          rows: [
            { left: 'Accuracy', right: 'Balanced classes with similar error costs. Misleading when classes are imbalanced.' },
            { left: 'Precision', right: 'When false positives are costly (unnecessary alarms or treatment).' },
            { left: 'Recall (sensitivity)', right: 'When false negatives are costly (missing a real disease case).' },
            { left: 'F1 score', right: 'Balances precision and recall for an important, rare positive class.' },
            { left: 'PR-AUC', right: 'Imbalanced problems with a rare positive class — clearer than ROC-AUC there.' },
            { left: 'ROC-AUC', right: 'How well the model ranks positives above negatives across thresholds.' },
            { left: 'MAE / RMSE', right: 'Regression error. RMSE punishes large errors more and shares the target\'s units.' },
            { left: 'Brier score', right: 'How well predicted probabilities match reality (calibration).' },
          ],
        },
        { type: 'terms', heading: 'Validation & trust concepts',
          terms: [
            { term: 'Cross-validation', definition: 'Splitting data into folds so each fold takes a turn as validation — a more stable performance estimate than one split.' },
            { term: 'Nested cross-validation', definition: 'An outer loop estimates performance while an inner loop handles tuning and feature selection — giving a less biased estimate after tuning.' },
            { term: 'Grouped / stratified splitting', definition: 'Grouped keeps all samples from one patient on one side of the split (no leakage). Stratified preserves class ratios across folds.' },
            { term: 'Overfitting vs. underfitting', definition: 'Overfitting learns noise and fails on new data; underfitting is too simple to capture the real pattern. Both hurt generalization.' },
            { term: 'Class imbalance', definition: 'When one class is rare, accuracy is misleading — a model can "win" by always predicting the majority. Use PR-AUC, F1, and strong baselines.' },
            { term: 'Calibration', definition: 'Whether a predicted "30% risk" really happens ~30% of the time. Matters when probabilities are used as risk estimates.' },
            { term: 'SHAP analysis', definition: 'Estimates how much each feature pushed a prediction up or down — aids interpretation, but does not prove causation.' },
            { term: 'Permutation (label-shuffle) test', definition: 'Shuffle the labels and re-run; if performance stays similar, the original result may be noise, not real signal.' },
            { term: 'External validation', definition: 'Testing on an independently collected dataset — the strongest evidence that a model truly generalizes.' },
          ],
        },
        { type: 'callout', label: 'Why this module sits next to immunology', color: '#6366F1',
          text: 'Predicting something like a lupus flare from gene expression brings every one of these ideas together: imbalanced classes, repeated samples per patient (needs grouped splitting), leakage-safe pipelines, strong baselines, permutation tests, and external validation. Good ML, like good immunology, is about not fooling yourself.' },
      ],
      takeaways: [
        'Pick metrics that match the real-world goal — accuracy alone is misleading on imbalanced data.',
        'Leakage-safe validation (often nested, grouped, stratified cross-validation) gives trustworthy estimates.',
        'Permutation tests, calibration checks, and external validation confirm a model found real signal.',
      ],
      quiz: [
        { id: 'q1', question: 'A disease affects 5% of patients. A model predicts "no disease" for everyone and is 95% accurate. What is wrong?', options: ['Nothing — 95% is excellent', 'Accuracy is misleading on imbalanced data; the model catches zero real cases (recall = 0)', 'It overfit the test set', 'It needs a larger learning rate'], correctIndex: 1, explanation: 'With imbalanced classes, high accuracy can hide total failure on the rare positive class. Recall, F1, and PR-AUC reveal that the model detects no true cases.' },
        { id: 'q2', question: 'What does a permutation (label-shuffle) test check?', options: ['Whether the model trains fast enough', 'Whether performance reflects real signal rather than noise', 'Which features to scale', 'The best learning rate'], correctIndex: 1, explanation: 'If a model performs similarly after labels are randomly shuffled, its original performance likely reflects noise or leakage rather than a genuine predictive signal.' },
        { id: 'q3', question: 'What does external validation test for?', options: ['Whether the model trains quickly', 'Whether a model truly generalises, by testing on an independently collected dataset', 'The model\'s hyperparameters', 'Whether the data has missing values'], correctIndex: 1, explanation: 'External validation — testing on data collected independently of the original study — is the strongest evidence that a model\'s performance will hold up beyond the data it was built on.' },
      ],
    },
  ],
};

// ── Module 8: Clinical Immunology ──────────────────────────────────────────────
const mod8: Module = {
  id: 'mod8', number: 8,
  title: 'Clinical Immunology',
  subtitle: 'Transplants, immunodeficiencies & living with a broken immune system',
  color: BRAND_COLOR,
  lessons: [
    {
      id: 'mod8-l1', title: 'Transplant Rejection & Tolerance', duration: '8 min',
      sections: [
        { type: 'text', heading: 'Why the Body Attacks New Organs',
          body: 'HLA genes — the human version of MHC — are the most polymorphic genes in the genome, meaning almost no two unrelated people have an identical set. A transplanted organ carries donor HLA molecules that the recipient\'s T cells can recognise as foreign, either directly (donor antigen-presenting cells in the graft activate recipient T cells) or indirectly (recipient antigen-presenting cells process and present donor HLA peptides). Either route can trigger a full adaptive attack on the new organ.' },
        { type: 'table', heading: 'Types of Transplant Rejection',
          leftHeader: 'Type', rightHeader: 'Mechanism & Timeline',
          rows: [
            { left: 'Hyperacute', right: 'Minutes to hours. Pre-existing antibodies (e.g. ABO mismatch) bind donor blood vessels and trigger complement. Now rare thanks to pre-transplant crossmatching.' },
            { left: 'Acute', right: 'Weeks to months. Mainly T cell-mediated direct allorecognition. The most common type, and usually reversible with stronger immunosuppression.' },
            { left: 'Chronic', right: 'Months to years. Slow vessel wall thickening driven by both antibodies and T cells. The leading cause of long-term graft failure.' },
          ],
        },
        { type: 'steps', heading: 'How Immunosuppressants Prevent Rejection',
          steps: [
            { label: 'Calcineurin inhibitors', detail: 'Cyclosporine and tacrolimus block the enzyme calcineurin, preventing the transcription factor NFAT from switching on the IL-2 gene — starving T cells of the signal they need to proliferate.' },
            { label: 'Corticosteroids', detail: 'Broadly dampen inflammatory gene expression and cytokine production across many immune cell types.' },
            { label: 'mTOR inhibitors', detail: 'Sirolimus blocks a signal downstream of the IL-2 receptor, stopping T cell proliferation even if IL-2 is present.' },
            { label: 'Antiproliferatives', detail: 'Mycophenolate blocks a step in DNA synthesis that rapidly dividing lymphocytes depend on more heavily than most other cells.' },
          ],
        },
        { type: 'callout', label: 'GVHD: rejection in reverse', color: 'purple',
          text: 'Graft-versus-host disease (GVHD) is the mirror image of organ rejection. It happens after bone marrow/stem cell transplants, when donor T cells — now living inside the recipient — recognise the recipient\'s tissues as foreign and attack them, rather than the recipient attacking the graft.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'HLA (Human Leukocyte Antigen)', definition: 'The human version of MHC genes; extremely polymorphic, making donor-recipient matching difficult and central to transplant rejection.' },
            { term: 'Allorecognition', definition: 'The process by which T cells recognise genetically different (allogeneic) cells or tissue as foreign.' },
            { term: 'Calcineurin inhibitor', definition: 'A class of immunosuppressant (e.g. tacrolimus) that blocks T cell activation by preventing IL-2 gene transcription.' },
            { term: 'Graft-versus-host disease (GVHD)', definition: 'A complication of stem cell transplantation where donor immune cells attack the recipient\'s own tissues.' },
          ],
        },
      ],
      takeaways: [
        'Transplant rejection is driven by T cells recognising donor HLA as foreign, either directly or indirectly.',
        'Hyperacute, acute, and chronic rejection differ in timeline, mechanism, and how preventable/treatable they are.',
        'GVHD is the reverse problem — donor T cells attacking the recipient — seen specifically in stem cell transplants.',
      ],
      quiz: [
        { id: 'q1', question: 'Which type of transplant rejection happens within minutes to hours and is driven by pre-existing antibodies?', options: ['Acute rejection', 'Chronic rejection', 'Hyperacute rejection', 'GVHD'], correctIndex: 2, explanation: 'Hyperacute rejection is caused by pre-formed antibodies (e.g. against ABO blood group antigens) that immediately activate complement on the donor vessels — now rare due to pre-transplant crossmatching.' },
        { id: 'q2', question: 'How do calcineurin inhibitors like tacrolimus suppress the immune system?', options: ['They kill all lymphocytes directly', 'They block NFAT-driven transcription of the IL-2 gene', 'They neutralise antibodies', 'They block antigen presentation entirely'], correctIndex: 1, explanation: 'Calcineurin inhibitors prevent the transcription factor NFAT from entering the nucleus, blocking IL-2 gene transcription and starving T cells of the proliferation signal.' },
        { id: 'q3', question: 'What is the difference between direct and indirect allorecognition?', options: ['There is no real difference', 'Direct: donor antigen-presenting cells activate recipient T cells; indirect: recipient APCs present processed donor HLA peptides', 'Direct only happens in GVHD; indirect only in organ rejection', 'Direct involves antibodies; indirect involves T cells'], correctIndex: 1, explanation: 'In direct allorecognition, donor APCs within the graft directly activate recipient T cells. In indirect allorecognition, recipient APCs process and present donor HLA peptides — both routes can trigger rejection.' },
      ],
    },
    {
      id: 'mod8-l2', title: 'Primary Immunodeficiencies: SCID & DiGeorge', duration: '8 min',
      sections: [
        { type: 'text', heading: 'When the Immune System Fails to Develop',
          body: 'Primary immunodeficiencies (PIDs) are genetic — present from birth, even if symptoms appear later — as opposed to secondary immunodeficiencies, which are acquired (such as from HIV infection, chemotherapy, or malnutrition). Over 450 genes are now known to cause primary immunodeficiencies, each disrupting a different piece of immune development or function.' },
        { type: 'table', heading: 'SCID vs DiGeorge Syndrome',
          leftHeader: 'Severe Combined Immunodeficiency (SCID)', rightHeader: 'DiGeorge Syndrome',
          rows: [
            { left: 'Genetic cause: mutations in genes like IL2RG or ADA', right: 'Genetic cause: a deletion on chromosome 22 (22q11.2)' },
            { left: 'Mechanism: T and B lymphocytes fail to develop properly', right: 'Mechanism: the thymus forms small or absent, limiting T cell maturation' },
            { left: 'Presentation: severe, recurrent infections from birth; fatal within ~1 year if untreated', right: 'Presentation: highly variable — heart defects, low calcium, and a spectrum of T cell deficiency' },
            { left: 'Treatment: bone marrow/HSC transplant, or gene therapy', right: 'Treatment: thymus transplant in severe cases; supportive care in milder cases' },
          ],
        },
        { type: 'callout', label: 'The "Bubble Boy" story', color: 'blue',
          text: 'David Vetter, born in 1971 with X-linked SCID, lived 12 years inside a sterile plastic enclosure because almost any infection could have killed him. His case drove major advances in bone marrow transplantation and, decades later, the gene therapy approaches now used to treat SCID directly.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Severe Combined Immunodeficiency (SCID)', definition: 'A group of genetic disorders causing near-total absence of functional T and B lymphocytes, leading to life-threatening infections from infancy.' },
            { term: 'DiGeorge Syndrome', definition: 'A genetic condition caused by a 22q11.2 chromosomal deletion, often resulting in thymic hypoplasia and reduced T cell production.' },
            { term: 'Thymic hypoplasia', definition: 'Underdevelopment of the thymus, limiting the gland\'s capacity to mature T cells.' },
            { term: 'Primary immunodeficiency', definition: 'A genetic disorder present from birth that impairs immune system development or function.' },
          ],
        },
      ],
      takeaways: [
        'Primary immunodeficiencies are genetic; secondary ones are acquired (e.g. HIV, chemotherapy, malnutrition).',
        'SCID knocks out both T and B cell development; DiGeorge mainly limits T cell maturation via a small thymus.',
        'Bone marrow transplant and, increasingly, gene therapy can correct SCID by replacing the faulty stem cells.',
      ],
      quiz: [
        { id: 'q1', question: 'What is the underlying genetic cause of DiGeorge syndrome?', options: ['A mutation in the IL2RG gene', 'A deletion on chromosome 22 (22q11.2)', 'A BTK gene mutation', 'An extra copy of chromosome 21'], correctIndex: 1, explanation: 'DiGeorge syndrome is caused by a deletion in the 22q11.2 region of chromosome 22, which often disrupts thymus development.' },
        { id: 'q2', question: 'Why is untreated SCID life-threatening from infancy?', options: ['It causes severe allergies', 'T and B lymphocytes fail to develop, leaving the infant unable to fight infections', 'It only affects skin immunity', 'It causes autoimmune attacks on healthy tissue'], correctIndex: 1, explanation: 'SCID prevents normal T and B cell development, so infants lack both arms of adaptive immunity and are highly vulnerable to infections that healthy infants would easily clear.' },
        { id: 'q3', question: 'David Vetter, the "Bubble Boy," had X-linked SCID. What did his case help drive forward?', options: ['The invention of the first vaccine', 'Advances in bone marrow transplantation and later gene therapy for SCID', 'The discovery of HLA genes', 'The first checkpoint inhibitor'], correctIndex: 1, explanation: 'David Vetter\'s 12 years living in a sterile enclosure due to X-linked SCID helped drive major advances in bone marrow transplantation, and decades later, the gene therapy approaches now used to treat SCID directly.' },
      ],
    },
    {
      id: 'mod8-l3', title: 'Antibody Deficiencies & Other PIDs', duration: '7 min',
      sections: [
        { type: 'text', heading: 'When B Cells Can\'t Make Antibodies',
          body: 'Humoral immunodeficiencies affect the body\'s ability to produce functional antibodies. They span a wide spectrum — from selective IgA deficiency, the most common primary immunodeficiency overall (roughly 1 in 500 people), which is often entirely asymptomatic, to X-linked agammaglobulinemia, which leaves patients with essentially no circulating antibodies at all.' },
        { type: 'terms', heading: 'Common Antibody Deficiencies',
          terms: [
            { term: 'X-linked Agammaglobulinemia (XLA)', definition: 'Caused by mutations in the BTK gene, which B cells need to mature. Patients have no mature B cells and develop recurrent bacterial infections once maternal antibodies wane around 6 months of age.' },
            { term: 'Common Variable Immunodeficiency (CVID)', definition: 'The most common symptomatic antibody deficiency, usually diagnosed in adulthood. Causes low antibody levels through a variety of underlying defects, not a single gene.' },
            { term: 'Selective IgA Deficiency', definition: 'The most common primary immunodeficiency overall. Most people are asymptomatic, but it matters clinically — patients can have severe reactions to IgA-containing blood products.' },
          ],
        },
        { type: 'callout', label: 'IVIG: borrowed immunity', color: 'green',
          text: 'Intravenous immunoglobulin (IVIG) pools purified antibodies from thousands of healthy blood donors. Patients who can\'t make their own antibodies receive regular IVIG infusions — essentially ongoing passive immunity as a long-term treatment.' },
        { type: 'text', heading: 'Why Timing Matters',
          body: 'Newborns are protected for the first months of life by maternal IgG antibodies that crossed the placenta. This is why XLA often isn\'t noticed until around 6 months — that\'s when borrowed maternal protection runs out and the infant\'s own (absent) antibody production becomes the only line of defence.' },
      ],
      takeaways: [
        'Antibody deficiencies range from harmless (selective IgA deficiency) to severe (XLA, CVID).',
        'XLA is caused by a BTK mutation that blocks B cell maturation entirely.',
        'IVIG treats antibody deficiencies by supplying pooled donor antibodies on an ongoing basis.',
      ],
      quiz: [
        { id: 'q1', question: 'What gene is mutated in X-linked Agammaglobulinemia?', options: ['IL2RG', 'BTK', 'ADA', 'RAG1'], correctIndex: 1, explanation: 'XLA is caused by mutations in BTK, a gene essential for B cell maturation. Without it, B cells fail to mature and patients cannot produce antibodies.' },
        { id: 'q2', question: 'Why do XLA symptoms typically appear around 6 months of age rather than at birth?', options: ['The BTK gene only activates at 6 months', 'Maternal IgG antibodies protect the infant until they wane around that age', 'Vaccines cause the symptoms to appear', 'It takes 6 months for bacteria to become dangerous'], correctIndex: 1, explanation: 'Maternal antibodies cross the placenta and protect infants for the first few months of life. Once these wane, infants who cannot make their own antibodies become vulnerable.' },
        { id: 'q3', question: 'What is the most common primary immunodeficiency overall, and how does it usually present?', options: ['XLA — always severe', 'CVID — always diagnosed in infancy', 'Selective IgA deficiency — most people are asymptomatic', 'SCID — always fatal without treatment'], correctIndex: 2, explanation: 'Selective IgA deficiency is the most common primary immunodeficiency, affecting roughly 1 in 500 people, and most are entirely asymptomatic — though it matters clinically for reactions to IgA-containing blood products.' },
      ],
    },
    {
      id: 'mod8-l4', title: 'Diagnosing & Living with Immune Disorders', duration: '8 min',
      sections: [
        { type: 'text', heading: 'Red Flags for Immunodeficiency',
          body: 'Recurrent, unusually severe, or hard-to-treat infections are the main clue that prompts immunodeficiency testing — for example, four or more ear infections in a year, two or more pneumonias, infections that need IV antibiotics to clear, or failure to gain weight and grow normally in infancy.' },
        { type: 'steps', heading: 'The Diagnostic Workup',
          steps: [
            { label: 'Lymphocyte subset counts', detail: 'Flow cytometry counts and identifies T cells, B cells, and NK cells to see which populations are missing or reduced.' },
            { label: 'Immunoglobulin quantification', detail: 'Blood tests measure IgG, IgA, IgM, and IgE levels to spot antibody deficiencies.' },
            { label: 'Functional testing', detail: 'Checking antibody response to past vaccines reveals whether the immune system can actually mount a useful response, not just whether the right cells are present.' },
            { label: 'Genetic testing', detail: 'Sequencing confirms the specific mutated gene, which guides treatment choice and family genetic counselling.' },
          ],
        },
        { type: 'callout', label: 'Live vaccines: handle with care', color: 'red',
          text: 'Live-attenuated vaccines (like MMR and varicella) contain weakened but still-replicating pathogens. In patients with significant T cell deficiencies (such as SCID), these vaccines can cause the very disease they\'re meant to prevent — so inactivated vaccines are used instead whenever a T cell defect is suspected.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Flow cytometry', definition: 'A laboratory technique that identifies and counts cell types based on surface markers tagged with fluorescent antibodies.' },
            { term: 'Functional testing', definition: 'Assessing whether immune cells actually work — e.g. whether antibody levels rise appropriately after a vaccine — rather than just counting cells.' },
            { term: 'Live-attenuated vaccine', definition: 'A vaccine containing a weakened but still-living version of a pathogen; risky for patients with significant T cell deficiencies.' },
          ],
        },
      ],
      takeaways: [
        'Recurrent or unusually severe infections, especially needing IV antibiotics, are the main red flag for immunodeficiency.',
        'Diagnosis combines cell counts, antibody levels, functional response testing, and genetic confirmation.',
        'Patients with T cell deficiencies must avoid live vaccines, which can cause disease rather than prevent it.',
      ],
      quiz: [
        { id: 'q1', question: 'Why are live-attenuated vaccines dangerous for some immunodeficient patients?', options: ['They cause severe allergic reactions in everyone', 'The weakened pathogen can still replicate and cause disease if T cell immunity is too weak to control it', 'They contain no active ingredient and just don\'t work', 'They are too expensive to administer safely'], correctIndex: 1, explanation: 'Live-attenuated vaccines rely on the immune system controlling a weakened, still-replicating pathogen. Without sufficient T cell function, that weakened pathogen can spread uncontrolled.' },
        { id: 'q2', question: 'What does flow cytometry reveal in an immunodeficiency workup?', options: ['The exact DNA sequence of a mutated gene', 'Which lymphocyte populations (T, B, NK cells) are present or missing', 'Antibody levels in the blood', 'Past vaccine history'], correctIndex: 1, explanation: 'Flow cytometry identifies and counts specific cell populations based on surface markers, revealing which lymphocyte types are deficient.' },
        { id: 'q3', question: 'What does immunoglobulin quantification measure in a diagnostic workup?', options: ['The number of T cells', 'Levels of IgG, IgA, IgM, and IgE in the blood', 'The exact mutated gene', 'Response to a skin prick test'], correctIndex: 1, explanation: 'Immunoglobulin quantification measures the blood levels of each antibody class, helping reveal antibody deficiencies like CVID or selective IgA deficiency.' },
      ],
    },
  ],
};

// ── Module 9: Microbiome & Immunity ────────────────────────────────────────────
const mod9: Module = {
  id: 'mod9', number: 9,
  title: 'Microbiome & Immunity',
  subtitle: 'The trillions of microbes shaping your immune system',
  color: BRAND_COLOR,
  lessons: [
    {
      id: 'mod9-l1', title: 'Meet Your Microbiome', duration: '6 min',
      sections: [
        { type: 'text', heading: 'You Are Not Just Human Cells',
          body: 'Roughly 38 trillion bacterial cells live in and on the human body — in the same order of magnitude as the number of human cells. Collectively, this community of bacteria, archaea, fungi, and viruses is called the microbiome. The gut, especially the colon, hosts by far the largest and most studied community, but the skin, mouth, and respiratory and urogenital tracts each have their own distinct microbial neighbourhoods.' },
        { type: 'steps', heading: 'How Your Microbiome Is Built',
          steps: [
            { label: 'Birth', detail: 'Vaginal delivery exposes the infant to maternal vaginal and gut bacteria; babies born by C-section initially acquire more skin-associated microbes instead.' },
            { label: 'Infancy', detail: 'Breast milk contains human milk oligosaccharides (HMOs) that the infant cannot digest but that selectively feed beneficial bacteria like Bifidobacterium.' },
            { label: 'Weaning', detail: 'Introducing solid food dramatically increases microbial diversity as new fibres and nutrients become available.' },
            { label: 'Childhood onward', detail: 'By around age 3, the gut microbiome stabilises into an adult-like community, though diet, geography, illness, and antibiotics continue to reshape it throughout life.' },
          ],
        },
        { type: 'table', heading: 'Major Phyla in the Healthy Gut',
          leftHeader: 'Phylum', rightHeader: 'Examples & Role',
          rows: [
            { left: 'Firmicutes', right: 'Includes Lactobacillus and Clostridium species; many are major producers of short-chain fatty acids.' },
            { left: 'Bacteroidetes', right: 'Includes Bacteroides species; specialise in breaking down complex plant carbohydrates humans can\'t digest alone.' },
            { left: 'Actinobacteria', right: 'Includes Bifidobacterium, especially abundant in breastfed infants.' },
            { left: 'Proteobacteria', right: 'Includes E. coli; normally a small fraction — overgrowth is often a sign of dysbiosis.' },
          ],
        },
        { type: 'callout', label: 'More genes than you', color: 'blue',
          text: 'The collective microbiome encodes roughly 100 times more unique genes than the human genome itself — a vast, mostly untapped metabolic toolkit living inside you.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Microbiome', definition: 'The collective community of microorganisms (bacteria, archaea, fungi, viruses) living in and on a host, along with their genetic material.' },
            { term: 'Microbiota', definition: 'The living microorganisms themselves, as opposed to their collective genetic content.' },
            { term: 'Human milk oligosaccharide (HMO)', definition: 'A complex sugar in breast milk that the infant cannot digest but that selectively nourishes beneficial gut bacteria.' },
            { term: 'Commensal', definition: 'A microorganism that lives in or on a host without typically causing harm, often providing some benefit.' },
          ],
        },
      ],
      takeaways: [
        'The human body hosts roughly as many bacterial cells as human cells, dominated by the gut microbiome.',
        'Birth mode, breastfeeding, and early diet all shape which microbes establish themselves first.',
        'The gut microbiome stabilises into an adult-like community by about age 3, but keeps changing with diet and life events.',
      ],
      quiz: [
        { id: 'q1', question: 'What do human milk oligosaccharides (HMOs) do?', options: ['Provide direct nutrition for the infant', 'Selectively feed beneficial bacteria like Bifidobacterium', 'Kill harmful gut bacteria', 'Replace the need for solid food'], correctIndex: 1, explanation: 'Infants cannot digest HMOs directly — instead, these sugars selectively nourish beneficial bacteria such as Bifidobacterium, helping shape a healthy early microbiome.' },
        { id: 'q2', question: 'Which gut phylum is most associated with breaking down complex plant carbohydrates?', options: ['Proteobacteria', 'Actinobacteria', 'Bacteroidetes', 'Firmicutes'], correctIndex: 2, explanation: 'Bacteroidetes species specialise in fermenting complex plant fibres that human digestive enzymes alone cannot break down.' },
        { id: 'q3', question: 'How does the gene content of the microbiome compare to the human genome?', options: ['It is roughly equal', 'It encodes roughly 100 times more unique genes than the human genome', 'It has no genes of its own', 'It is smaller than the human genome'], correctIndex: 1, explanation: 'The collective microbiome encodes roughly 100 times more unique genes than the human genome — a vast metabolic toolkit beyond human DNA alone.' },
      ],
    },
    {
      id: 'mod9-l2', title: 'The Gut-Immune Axis', duration: '8 min',
      sections: [
        { type: 'text', heading: 'Your Gut Is an Immune Organ',
          body: 'Roughly 70-80% of the body\'s immune cells reside in gut-associated lymphoid tissue (GALT). This makes sense given the challenge involved: a single layer of epithelial cells separates trillions of microbes from the bloodstream, so the immune system must constantly distinguish harmless commensals from genuine threats — without overreacting to the former or underreacting to the latter.' },
        { type: 'table', heading: 'How Microbes Train Immune Cells',
          leftHeader: 'Microbial Signal', rightHeader: 'Immune Effect',
          rows: [
            { left: 'Short-chain fatty acids (SCFAs, e.g. butyrate)', right: 'Promote regulatory T cell (Treg) differentiation, helping dampen unnecessary inflammation.' },
            { left: 'Segmented filamentous bacteria', right: 'Induce Th17 cells, which support the mucosal barrier\'s antimicrobial defences.' },
            { left: 'Microbial antigens crossing the gut lining', right: 'Stimulate secretory IgA production by B cells in Peyer\'s patches.' },
            { left: 'Microbial cell-wall fragments (e.g. peptidoglycan)', right: 'Provide low-level, tonic stimulation of innate pattern-recognition receptors, keeping the immune system primed.' },
          ],
        },
        { type: 'callout', label: 'Germ-free mice tell the story', color: 'green',
          text: 'Mice raised in completely sterile, germ-free environments develop underdeveloped GALT, fewer regulatory T cells, and weaker immune responses overall. This is strong evidence that gut microbes are required for normal immune system development — not just passive bystanders.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Gut-associated lymphoid tissue (GALT)', definition: 'The collection of lymphoid structures along the gastrointestinal tract, including Peyer\'s patches, that house most of the body\'s immune cells.' },
            { term: 'Short-chain fatty acid (SCFA)', definition: 'A metabolite (e.g. butyrate) produced when gut bacteria ferment dietary fibre; promotes regulatory T cell development.' },
            { term: 'Secretory IgA', definition: 'An antibody form secreted across mucosal surfaces that neutralises microbes without triggering strong inflammation.' },
          ],
        },
      ],
      takeaways: [
        'The majority of the body\'s immune cells are located in gut-associated lymphoid tissue.',
        'Gut bacteria actively shape immune development — SCFAs promote Tregs, while certain bacteria induce Th17 cells.',
        'Germ-free mice studies show that microbes are necessary, not optional, for normal immune system development.',
      ],
      quiz: [
        { id: 'q1', question: 'What immune effect do short-chain fatty acids like butyrate have?', options: ['They activate complement directly', 'They promote regulatory T cell (Treg) differentiation', 'They destroy commensal bacteria', 'They block antibody production'], correctIndex: 1, explanation: 'SCFAs such as butyrate, produced by bacterial fermentation of dietary fibre, promote Treg differentiation, helping keep gut inflammation in check.' },
        { id: 'q2', question: 'What does the germ-free mouse model demonstrate?', options: ['Microbes have no effect on immune development', 'Microbes are required for normal immune system development', 'All bacteria are harmful to the immune system', 'The immune system develops the same with or without microbes'], correctIndex: 1, explanation: 'Germ-free mice have underdeveloped GALT and fewer Tregs, showing that normal microbial exposure is necessary for proper immune development.' },
        { id: 'q3', question: 'What immune cell type do segmented filamentous bacteria induce in the gut?', options: ['Regulatory T cells (Tregs)', 'Th17 cells, supporting mucosal barrier defence', 'NK cells', 'Mast cells'], correctIndex: 1, explanation: 'Segmented filamentous bacteria specifically induce Th17 cells, which support the antimicrobial defences of the mucosal barrier — distinct from the Treg-promoting effect of SCFAs.' },
      ],
    },
    {
      id: 'mod9-l3', title: 'Dysbiosis & Disease', duration: '7 min',
      sections: [
        { type: 'text', heading: 'When the Balance Breaks',
          body: 'Dysbiosis describes an imbalance in the composition or function of the microbial community — not simply "bad bacteria taking over," but often a loss of overall diversity and depletion of beneficial species. Antibiotics, diet, infection, and stress can all trigger it.' },
        { type: 'table', heading: 'Conditions Linked to Dysbiosis',
          leftHeader: 'Condition', rightHeader: 'Microbiome Connection',
          rows: [
            { left: 'Inflammatory Bowel Disease (Crohn\'s, ulcerative colitis)', right: 'Reduced microbial diversity, fewer SCFA-producing species, and expansion of pro-inflammatory bacteria.' },
            { left: 'Allergies & asthma ("hygiene hypothesis")', right: 'Reduced early-life microbial exposure correlates with higher allergy risk, possibly through insufficient Treg induction.' },
            { left: 'Obesity & metabolic syndrome', right: 'Certain microbiome profiles appear to extract more calories from food and affect fat-storage signalling — though causality is still debated.' },
            { left: 'C. difficile infection', right: 'Antibiotic-driven loss of competing bacteria allows toxin-producing C. difficile to overgrow unchecked.' },
          ],
        },
        { type: 'callout', label: 'Correlation vs causation', color: 'orange',
          text: 'Most human dysbiosis-disease links come from observational studies — the microbiome simply looks different in sick versus healthy people. It\'s often unclear whether dysbiosis causes disease, results from it, or both feed into each other. Treat bold "your gut bacteria cause X" headlines with healthy skepticism.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Dysbiosis', definition: 'An imbalance in the composition, diversity, or function of a microbial community, associated with various diseases.' },
            { term: 'Hygiene hypothesis', definition: 'The idea that reduced early-life microbial exposure may impair proper immune development, increasing allergy and autoimmune risk.' },
            { term: 'Clostridioides difficile (C. diff)', definition: 'A toxin-producing bacterium that can overgrow and cause severe colitis after antibiotics deplete competing gut flora.' },
          ],
        },
      ],
      takeaways: [
        'Dysbiosis is an imbalance in microbial diversity or function, not just the presence of "bad" bacteria.',
        'Dysbiosis is linked to IBD, allergies, metabolic syndrome, and C. difficile infection — with varying strength of evidence.',
        'Most evidence is correlational, so causation between dysbiosis and disease is often genuinely unclear.',
      ],
      quiz: [
        { id: 'q1', question: 'What allows C. difficile to overgrow and cause infection?', options: ['A high-fibre diet', 'Antibiotics depleting the competing bacteria that normally keep it in check', 'Excess stomach acid', 'A deficiency in vitamin C'], correctIndex: 1, explanation: 'Antibiotics can wipe out the diverse bacterial competition that normally suppresses C. difficile, allowing it to overgrow and produce disease-causing toxins.' },
        { id: 'q2', question: 'Why should claims that "gut bacteria cause disease X" often be treated with caution?', options: ['The microbiome has no real effect on health', 'Most evidence is observational/correlational, so cause and effect are often unclear', 'Bacteria cannot be studied scientifically', 'Dysbiosis has been fully proven to never affect humans'], correctIndex: 1, explanation: 'Much of the human evidence linking dysbiosis to disease is correlational — the microbiome differs between sick and healthy people, but whether dysbiosis is a cause, a consequence, or both is frequently still unresolved.' },
        { id: 'q3', question: 'According to the hygiene hypothesis, what increases allergy and asthma risk?', options: ['Too much dietary fibre', 'Reduced early-life microbial exposure, possibly through insufficient Treg induction', 'Excessive antibiotic resistance', 'High SCFA production'], correctIndex: 1, explanation: 'The hygiene hypothesis proposes that reduced early-life microbial exposure may impair proper immune development — including insufficient Treg induction — raising allergy and autoimmune risk.' },
      ],
    },
    {
      id: 'mod9-l4', title: 'Probiotics, Prebiotics & Fecal Transplants', duration: '7 min',
      sections: [
        { type: 'text', heading: 'Can You Fix Your Microbiome?',
          body: 'A large industry has grown around manipulating the microbiome for health. Probiotics are live beneficial microorganisms (such as specific Lactobacillus or Bifidobacterium strains); prebiotics are non-digestible fibres, like inulin, that feed beneficial bacteria already present; synbiotics combine both approaches.' },
        { type: 'callout', label: 'Evidence: strong in some places, thin in others', color: 'orange',
          text: 'Probiotics have solid evidence for specific, well-studied uses — such as preventing antibiotic-associated diarrhea or treating certain cases of infectious diarrhea in children — but much weaker or absent evidence for many broader marketed claims like general "gut health" or "immunity boosting." Crucially, benefits are strain-specific: a result shown for one probiotic strain doesn\'t automatically apply to a different product.' },
        { type: 'steps', heading: 'Fecal Microbiota Transplant (FMT)',
          steps: [
            { label: 'What it is', detail: 'Processed stool from a healthy, screened donor is transferred into a patient\'s gut — via colonoscopy, enema, or oral capsules — to restore a healthy microbial community.' },
            { label: 'Strongest evidence', detail: 'Recurrent C. difficile infection. FMT cures roughly 85-90% of cases that failed standard antibiotic treatment, far outperforming antibiotics alone.' },
            { label: 'Emerging research', detail: 'IBD, metabolic syndrome, and even some neurological and psychiatric conditions are under active investigation — but evidence there is far less established than for C. difficile.' },
          ],
        },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Probiotic', definition: 'A live microorganism, taken as a supplement or in food, intended to confer a health benefit.' },
            { term: 'Prebiotic', definition: 'A non-digestible food component, typically fibre, that selectively nourishes beneficial gut bacteria.' },
            { term: 'Fecal microbiota transplant (FMT)', definition: 'A procedure transferring stool from a healthy donor into a patient to restore a healthy gut microbial community.' },
          ],
        },
      ],
      takeaways: [
        'Probiotic benefits are strain-specific — strong evidence for one strain doesn\'t generalise to all probiotic products.',
        'FMT has strong, well-established evidence specifically for treating recurrent C. difficile infection.',
        'Microbiome-based treatments for conditions like IBD or metabolic disease remain promising but far less proven.',
      ],
      quiz: [
        { id: 'q1', question: 'For which condition does FMT have the strongest clinical evidence?', options: ['Seasonal allergies', 'Recurrent C. difficile infection', 'The common cold', 'Type 1 diabetes'], correctIndex: 1, explanation: 'FMT cures roughly 85-90% of recurrent C. difficile infections that failed antibiotics, making it the best-established use of the procedure.' },
        { id: 'q2', question: 'Why can\'t evidence for one probiotic strain be assumed to apply to a different probiotic product?', options: ['All probiotics are identical regardless of strain', 'Probiotic effects are strain-specific, so results don\'t automatically generalise', 'Probiotics never have any measurable effect', 'Only prebiotics show strain-specific effects'], correctIndex: 1, explanation: 'Probiotic benefits depend on the specific strain studied — a different strain, even of the same bacterial species, may behave very differently.' },
        { id: 'q3', question: 'What is the key difference between a probiotic and a prebiotic?', options: ['They are the same thing', 'A probiotic is a live beneficial microorganism; a prebiotic is a fibre that feeds bacteria already present', 'A prebiotic is always a live microorganism', 'A probiotic always requires a colonoscopy to administer'], correctIndex: 1, explanation: 'Probiotics introduce live beneficial microorganisms directly, while prebiotics are non-digestible fibres (like inulin) that selectively nourish beneficial bacteria already living in the gut.' },
      ],
    },
  ],
};

// ── Module 10: Emerging Therapies ──────────────────────────────────────────────
const mod10: Module = {
  id: 'mod10', number: 10,
  title: 'Emerging Therapies',
  subtitle: 'Gene editing, engineered antibodies & the next generation of medicine',
  color: BRAND_COLOR,
  lessons: [
    {
      id: 'mod10-l1', title: 'Gene Therapy Basics', duration: '8 min',
      sections: [
        { type: 'text', heading: 'Treating Disease by Editing the Source Code',
          body: 'Gene therapy introduces, corrects, or silences genetic material to treat disease, rather than just managing symptoms with drugs. It is especially powerful for diseases caused by a single faulty gene — including many of the primary immunodeficiencies covered in the Clinical Immunology module, like SCID.' },
        { type: 'table', heading: 'Common Gene Therapy Vectors',
          leftHeader: 'Vector', rightHeader: 'Properties',
          rows: [
            { left: 'Adeno-associated virus (AAV)', right: 'Mostly non-integrating, low immunogenicity, but limited cargo size (~4.7kb). Widely used for in vivo therapy.' },
            { left: 'Lentivirus', right: 'Integrates into the host genome, larger cargo capacity. Commonly used to modify cells (e.g. T cells, stem cells) outside the body.' },
            { left: 'Non-viral (lipid nanoparticles, naked DNA/RNA)', right: 'Generally safer delivery profile, but typically less efficient at reaching target cells than viral vectors.' },
          ],
        },
        { type: 'steps', heading: 'Ex Vivo vs In Vivo Gene Therapy',
          steps: [
            { label: 'Ex vivo', detail: 'Cells are removed from the patient (e.g. blood stem cells or T cells), genetically modified in the lab, then infused back. CAR-T cell therapy is a form of ex vivo cell engineering.' },
            { label: 'In vivo', detail: 'A vector is delivered directly into the patient\'s body, modifying cells in place — used, for example, in AAV-based therapies for inherited retinal disease and hemophilia.' },
          ],
        },
        { type: 'callout', label: 'A cautionary chapter', color: 'red',
          text: 'Early-2000s gene therapy trials for X-linked SCID used retroviral vectors and successfully restored immune function in several children — but a subset later developed leukemia, because the virus had inserted itself near a gene that controls cell growth (insertional mutagenesis). This pivotal lesson reshaped vector safety design toward today\'s safer AAV and self-inactivating lentiviral vectors.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Gene therapy', definition: 'A treatment approach that introduces, corrects, or silences genetic material to treat or prevent disease.' },
            { term: 'AAV (Adeno-associated virus)', definition: 'A small, mostly non-integrating viral vector commonly used to deliver gene therapy directly into the body.' },
            { term: 'Insertional mutagenesis', definition: 'Unintended disruption of a gene caused by a vector inserting its genetic payload at a harmful location in the host genome.' },
          ],
        },
      ],
      takeaways: [
        'Gene therapy treats disease at its genetic source, rather than just managing symptoms.',
        'Viral vectors like AAV and lentivirus deliver genetic material, but each has different cargo capacity and integration behaviour.',
        'Early SCID gene therapy trials caused leukemia in some patients via insertional mutagenesis — a key lesson driving safer modern vector design.',
      ],
      quiz: [
        { id: 'q1', question: 'What is the key difference between ex vivo and in vivo gene therapy?', options: ['Ex vivo modifies cells outside the body before reinfusion; in vivo delivers the vector directly into the patient', 'Ex vivo is always safer than in vivo', 'In vivo only works on T cells', 'There is no meaningful difference'], correctIndex: 0, explanation: 'Ex vivo therapy modifies cells like T cells or stem cells in the lab before infusing them back; in vivo therapy delivers a vector directly into the patient\'s body to modify cells in place.' },
        { id: 'q2', question: 'What went wrong in some early X-linked SCID gene therapy trials?', options: ['The vector caused immediate organ failure', 'The retroviral vector inserted near a growth-control gene, causing leukemia in some patients', 'The therapy had no effect at all', 'Patients developed severe allergic reactions to the vector'], correctIndex: 1, explanation: 'The retroviral vectors used integrated semi-randomly into the genome; in some patients, this disrupted a gene controlling cell growth, leading to leukemia — a phenomenon called insertional mutagenesis.' },
        { id: 'q3', question: 'What is a key advantage of AAV vectors for in vivo gene therapy?', options: ['Unlimited cargo capacity', 'Mostly non-integrating with low immunogenicity, though limited in cargo size', 'They always integrate into the host genome', 'They require ex vivo cell modification'], correctIndex: 1, explanation: 'AAV vectors are mostly non-integrating and provoke a relatively low immune response, making them well-suited for in vivo delivery — their main limitation is a small cargo capacity (~4.7kb).' },
      ],
    },
    {
      id: 'mod10-l2', title: 'CRISPR-Cas9 & Genome Editing', duration: '9 min',
      sections: [
        { type: 'text', heading: 'Programmable Molecular Scissors',
          body: 'CRISPR-Cas9 originated as a bacterial immune system that destroys invading viral DNA. Scientists repurposed it as a precise gene-editing tool: a guide RNA (gRNA) directs the Cas9 enzyme to a specific DNA sequence — next to a short marker called a PAM sequence — where Cas9 cuts both strands of the DNA double helix.' },
        { type: 'steps', heading: 'What Happens After the Cut',
          steps: [
            { label: 'Non-homologous end joining (NHEJ)', detail: 'The cell\'s default, error-prone repair pathway. Often used to disrupt or knock out a gene entirely.' },
            { label: 'Homology-directed repair (HDR)', detail: 'If a matching DNA template is supplied, the cell can use it to precisely insert or correct a sequence — true gene correction, though less efficient than NHEJ.' },
            { label: 'Base & prime editing', detail: 'Newer refinements that chemically convert or rewrite DNA bases without fully cutting both strands, offering more precision with fewer unwanted edits.' },
          ],
        },
        { type: 'callout', label: 'CRISPR meets immunology', color: 'purple',
          text: 'CRISPR is being used to knock out genes that limit CAR-T cell persistence, create "off-the-shelf" donor CAR-T cells by deleting genes that would otherwise trigger rejection, and directly correct the mutated gene in SCID patients\' own stem cells — converging directly with the immunodeficiency and cell-therapy topics from earlier modules.' },
        { type: 'text', heading: 'Editing Ethics: Somatic vs Germline',
          body: 'Somatic cell editing changes only the treated individual\'s own cells and is not inherited — this is the basis of all current approved and trial therapies. Germline editing changes eggs, sperm, or embryos and would be inherited by future generations. It raises serious ethical and safety concerns and is not used clinically; a widely condemned 2018 case of a scientist editing human embryos resulted in his imprisonment.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'CRISPR-Cas9', definition: 'A gene-editing system, adapted from bacterial antiviral defence, that uses a guide RNA to direct the Cas9 enzyme to cut a specific DNA sequence.' },
            { term: 'Guide RNA (gRNA)', definition: 'A short RNA sequence that directs Cas9 to its target DNA sequence by base-pairing complementarity.' },
            { term: 'Somatic vs germline editing', definition: 'Somatic editing affects only the treated individual\'s cells; germline editing affects eggs, sperm, or embryos and is inherited by offspring.' },
          ],
        },
      ],
      takeaways: [
        'CRISPR-Cas9 uses a guide RNA to direct the Cas9 enzyme to cut a specific DNA sequence.',
        'NHEJ disrupts genes (knockout); HDR with a template enables precise correction, though less efficiently.',
        'Somatic editing is used clinically and is not inherited; germline editing is not used clinically due to ethical and safety concerns.',
      ],
      quiz: [
        { id: 'q1', question: 'What role does the guide RNA play in CRISPR-Cas9 editing?', options: ['It directly cuts the DNA', 'It directs the Cas9 enzyme to a specific DNA sequence via base-pairing', 'It repairs the DNA after cutting', 'It replaces the need for a PAM sequence'], correctIndex: 1, explanation: 'The guide RNA base-pairs with a complementary DNA sequence, directing the Cas9 enzyme to cut at that exact location.' },
        { id: 'q2', question: 'Why is germline gene editing not used clinically?', options: ['It is technically impossible with current tools', 'Changes would be inherited by future generations, raising serious ethical and safety concerns', 'It only works on bacteria', 'It is identical to somatic editing in every way'], correctIndex: 1, explanation: 'Germline editing alters eggs, sperm, or embryos, meaning changes — including any unintended ones — would be passed on to all future offspring, which is why it is not used in approved clinical practice.' },
        { id: 'q3', question: 'What is the difference between NHEJ and HDR after a CRISPR-Cas9 cut?', options: ['They are the same repair process', 'NHEJ is error-prone and often disrupts a gene; HDR uses a template for precise correction', 'HDR is always more efficient than NHEJ', 'NHEJ requires a DNA template; HDR does not'], correctIndex: 1, explanation: 'NHEJ is the cell\'s default, error-prone repair pathway, often used to knock out a gene. HDR uses a supplied DNA template for precise correction, but is less efficient than NHEJ.' },
      ],
    },
    {
      id: 'mod10-l3', title: 'Bispecific Antibodies', duration: '7 min',
      sections: [
        { type: 'text', heading: 'Antibodies With Two Jobs',
          body: 'A normal antibody binds one specific target with both of its arms. A bispecific antibody is engineered so each arm recognises a different target — most commonly, one arm grabs a tumour antigen while the other grabs CD3 on a T cell, physically bridging the two and forcing that T cell to attack the tumour cell, regardless of whether it would have recognised the tumour on its own.' },
        { type: 'table', heading: 'Bispecific Antibodies vs CAR-T',
          leftHeader: 'Bispecific Antibody', rightHeader: 'CAR-T Cell Therapy',
          rows: [
            { left: 'Off-the-shelf, ready to use immediately', right: 'Personalised — manufactured individually from each patient\'s own T cells' },
            { left: 'Given as repeated infusions, like a regular drug', right: 'One-time infusion; cells can persist and expand in the body afterward' },
            { left: 'Recruits whichever T cells the patient already has at the time of dosing', right: 'Permanently re-engineers a batch of T cells with a new receptor' },
            { left: 'Effect fades once the drug clears the body', right: 'Can provide long-term surveillance if the engineered cells persist' },
          ],
        },
        { type: 'callout', label: 'Blinatumomab: proof of concept', color: 'blue',
          text: 'Blinatumomab, a CD19xCD3 bispecific antibody, was among the first approved bispecific "T-cell engagers" (BiTEs), used for relapsed B-cell acute lymphoblastic leukemia. It targets the same CD19 marker as CD19 CAR-T therapy — but as an off-the-shelf drug, not a custom-manufactured cell product.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Bispecific antibody', definition: 'An engineered antibody with two arms that each bind a different target, often used to physically link a T cell to a tumour cell.' },
            { term: 'T-cell engager (BiTE)', definition: 'A class of bispecific antibody designed to bind CD3 on T cells and an antigen on target cells, triggering the T cell to attack.' },
          ],
        },
      ],
      takeaways: [
        'Bispecific antibodies bind two different targets simultaneously, often bridging a T cell directly to a tumour cell.',
        'Unlike CAR-T, bispecifics are off-the-shelf drugs given as repeated doses, not personalised one-time cell infusions.',
        'Blinatumomab demonstrated that bispecific T-cell engagers can achieve a similar goal to CAR-T through a very different mechanism.',
      ],
      quiz: [
        { id: 'q1', question: 'How does a CD19xCD3 bispecific antibody work?', options: ['It directly kills tumour cells using complement', 'One arm binds CD19 on the tumour cell while the other binds CD3, bridging a T cell to the tumour', 'It blocks CD19 to prevent B cell development', 'It only works on T cells, not tumour cells'], correctIndex: 1, explanation: 'The bispecific antibody binds CD19 on the tumour cell with one arm and CD3 on a T cell with the other, physically bridging them and triggering the T cell to attack.' },
        { id: 'q2', question: 'What is a key practical difference between bispecific antibodies and CAR-T therapy?', options: ['Bispecifics are personalised; CAR-T is off-the-shelf', 'Bispecifics are off-the-shelf drugs given repeatedly; CAR-T is a personalised one-time cell infusion', 'They are functionally identical in every way', 'CAR-T cannot target any of the same antigens as bispecifics'], correctIndex: 1, explanation: 'Bispecific antibodies are manufactured drugs that can be given to any patient and dosed repeatedly, while CAR-T requires manufacturing a personalised cell product from each patient.' },
        { id: 'q3', question: 'What does blinatumomab target?', options: ['CD19 and CD3, bridging a tumour cell to a T cell', 'PD-1 and PD-L1', 'CTLA-4 only', 'CD4 and CD8'], correctIndex: 0, explanation: 'Blinatumomab is a CD19xCD3 bispecific T-cell engager (BiTE), binding CD19 on B-cell leukaemia cells and CD3 on T cells to trigger T cell attack — approved for relapsed B-cell ALL.' },
      ],
    },
    {
      id: 'mod10-l4', title: 'The Future of Immune Engineering', duration: '7 min',
      sections: [
        { type: 'text', heading: 'Where the Field Is Headed',
          body: 'Researchers across gene therapy, cell engineering, and antibody design are converging on the same goal: making powerful immune therapies faster to manufacture, cheaper to access, and safer to use.' },
        { type: 'table', heading: 'Active Frontiers',
          leftHeader: 'Direction', rightHeader: 'Goal',
          rows: [
            { left: 'Allogeneic ("off-the-shelf") CAR-T', right: 'Gene-edit donor T cells to remove rejection triggers, manufacture in bulk, and treat patients without the weeks-long custom manufacturing wait.' },
            { left: 'In vivo CAR-T', right: 'Deliver CAR genes directly into a patient\'s T cells inside the body, skipping lab manufacturing entirely — still early-stage research.' },
            { left: 'mRNA-based in vivo gene editing', right: 'Package CRISPR components in lipid nanoparticles, similar to mRNA vaccine delivery, for transient, controllable editing inside the body.' },
            { left: 'Combination approaches', right: 'Pair checkpoint inhibitors, bispecifics, and engineered cells to attack resistant cancers from multiple angles at once.' },
          ],
        },
        { type: 'callout', label: 'Promising, but not arrived yet', color: 'orange',
          text: 'Most of these approaches are still in early clinical trials. High manufacturing cost, accessibility and equity concerns, and the need for long-term safety data are real open questions — exciting science doesn\'t always translate quickly or evenly into available treatment.' },
        { type: 'terms', heading: 'Key Terms',
          terms: [
            { term: 'Allogeneic cell therapy', definition: 'A cell therapy manufactured from a healthy donor\'s cells rather than the patient\'s own, enabling bulk, off-the-shelf production.' },
            { term: 'In vivo gene editing', definition: 'Gene editing performed directly inside the patient\'s body, rather than on cells removed and modified in a lab.' },
            { term: 'Lipid nanoparticle (LNP)', definition: 'A fatty, microscopic delivery particle used to carry mRNA or gene-editing components into cells, as in mRNA vaccines.' },
          ],
        },
      ],
      takeaways: [
        'Allogeneic CAR-T aims to remove the wait time of personalised manufacturing by using gene-edited donor cells.',
        'In vivo gene editing and CAR-T generation are early-stage approaches that could someday skip lab manufacturing entirely.',
        'Cost, accessibility, and long-term safety data remain real barriers between promising research and widely available treatment.',
      ],
      quiz: [
        { id: 'q1', question: 'What problem does allogeneic ("off-the-shelf") CAR-T aim to solve?', options: ['The high cost of bispecific antibodies', 'The weeks-long wait required to manufacture a personalised CAR-T product for each patient', 'The risk of insertional mutagenesis', 'The need for live vaccines'], correctIndex: 1, explanation: 'Standard CAR-T must be manufactured individually from each patient\'s own T cells, which takes weeks. Allogeneic CAR-T uses gene-edited donor cells made in bulk in advance, removing that wait.' },
        { id: 'q2', question: 'Why is it important to stay cautious about emerging immune therapies discussed in this lesson?', options: ['They have all already failed in clinical trials', 'Most are still early-stage research, with real cost, access, and long-term safety questions unresolved', 'They are purely theoretical and not being tested in humans at all', 'None of them have shown any promise so far'], correctIndex: 1, explanation: 'While early results are promising, most of these approaches are still in early clinical trials, and questions about manufacturing cost, equitable access, and long-term safety remain genuinely open.' },
        { id: 'q3', question: 'What is the goal of in vivo CAR-T generation?', options: ['To replace bispecific antibodies entirely', 'To deliver CAR genes directly into a patient\'s T cells inside the body, skipping lab manufacturing', 'To make CAR-T cells permanently allogeneic', 'To remove the need for any gene delivery vector'], correctIndex: 1, explanation: 'In vivo CAR-T generation aims to engineer T cells directly inside the patient\'s body — via an engineered vector or lipid nanoparticle — avoiding the weeks-long ex vivo manufacturing process entirely.' },
      ],
    },
  ],
};

export const MODULES: Module[] = [mod1, mod2, mod3, mod4, mod5, mod6, mod7, mod8, mod9, mod10];

export function getModule(id: string) { return MODULES.find(m => m.id === id); }
export function getLesson(moduleId: string, lessonId: string) {
  return getModule(moduleId)?.lessons.find(l => l.id === lessonId);
}

// Keyed by string module id (e.g. 'mod1'), matching how components consume it.
export const MODULE_COLORS: Record<string, string> = Object.fromEntries(
  ['mod1', 'mod2', 'mod3', 'mod4', 'mod5', 'mod6', 'mod7', 'mod8', 'mod9', 'mod10'].map(id => [id, BRAND_COLOR]),
);
