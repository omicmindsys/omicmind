import { ClinicalVisual, DrugVisual } from './ProductVisuals.jsx';
import { SpatialVisual } from './SpatialVisuals.jsx';
import { HistoQuantVisual } from './HistoQuantVisuals.jsx';
import { DiscoveryVisual } from './DiscoveryVisuals.jsx';
import { ADCVisual } from './ADCVisuals.jsx';
import { DrugDevVisual } from './DrugDevVisuals.jsx';

/* ------------------------------------------------------------------
   Single source of truth for the AI Products carousel and its detail
   view. Every card, detail panel and navigation tab is rendered from
   this array — add, remove or reorder products here only.

   name       full product name, without the ™ (rendered separately)
   shortName  label used in the compact product navigation
   trademark  render a superscript ™ after the name
   tagline    the 2–3 line summary shown on the carousel card
   description  the longer line shown in the detail view
   href       dedicated product page, when one exists; the
              "View Full Product" action is shown only when set
------------------------------------------------------------------ */
export const products = [
  {
    id: 'response-ai',
    name: 'OmicMind ResponseAI',
    shortName: 'ResponseAI',
    trademark: true,
    featured: true,
    tagline: 'Multimodal AI for predicting patient response to cancer therapies.',
    modalities: ['Pathology', 'Molecular', 'Clinical'],
    description:
      'Multimodal AI for predicting which patients are most likely to respond to a specific cancer therapy by integrating pathology, molecular, clinical, and treatment-outcome data.',
    inputs: ['H&E', 'IHC / Multiplex IHC', 'NGS', 'Clinical & outcome data'],
    analysis: [
      'Target-antigen expression',
      'Tumor heterogeneity',
      'Tumor–immune interactions',
      'Molecular & clinical features',
    ],
    outputs: ['Response prediction', 'Resistance patterns', 'Biomarker insights', 'Patient stratification'],
    href: '/platform/treatment-response-predict',
    Visual: ClinicalVisual,

    /* Flagship story — rendered by ResponseAIDetail in place of the
       standard Inputs / AI Analysis / Outputs layout. */
    story: {
      layout: 'response',
      subtitle: 'Predicting therapeutic response through multimodal patient intelligence.',
      overview:
        'OmicMind ResponseAI™ is a multimodal AI platform designed to predict which patients are most likely to respond to a specific cancer therapy by integrating pathology, molecular, clinical, and treatment-outcome data.',
      multimodal: {
        title: 'Multimodal Intelligence',
        description:
          'ResponseAI™ combines H&E, IHC, NGS, clinical characteristics, treatment history, and longitudinal outcomes to identify patient-level patterns associated with therapeutic response and resistance.',
        inputs: ['H&E', 'IHC', 'NGS', 'Clinical Characteristics', 'Treatment History', 'Longitudinal Outcomes'],
        model: 'AI Model',
        outputs: ['Response', 'Resistance', 'Biomarkers', 'Risk'],
      },
      example: {
        title: 'NSCLC',
        subtitle: 'For non-small cell lung cancer, the model can integrate:',
        groups: [
          { label: 'Pathology', short: 'H&E', items: ['H&E'] },
          { label: 'Immune / IHC', short: 'IHC', items: ['PD-L1', 'CD3', 'CD8', 'FOXP3', 'CD68'] },
          { label: 'Molecular', short: 'Molecular', items: ['EGFR', 'KRAS', 'STK11', 'KEAP1', 'TP53'] },
          {
            label: 'Clinical',
            short: 'Clinical',
            items: ['Clinical variables', 'Treatment history', 'Treatment outcomes'],
          },
        ],
        result: 'Patient-level response insights',
        statement:
          'This enables a deeper view of the patient by connecting tumor morphology, immune microenvironment, molecular alterations, and clinical context.',
      },
      insights: {
        title: 'Actionable Patient & Biological Insights',
        items: [
          {
            icon: 'gauge',
            title: 'Therapy Response Probability',
            body: 'Predict likelihood of response to therapy.',
          },
          {
            icon: 'split',
            title: 'Responder / Non-Responder Stratification',
            body: 'Identify patient groups with different response patterns.',
          },
          {
            icon: 'users',
            title: 'Patient Risk Groups',
            body: 'Stratify patients according to predicted clinical risk.',
          },
          {
            icon: 'dna',
            title: 'Multimodal Biomarker Signatures',
            body: 'Identify combinations of biological signals associated with response.',
          },
          {
            icon: 'trend',
            title: 'Potential PFS / OS Risk Scores',
            body: 'Generate model-derived progression and survival risk signals.',
          },
          {
            icon: 'compare',
            title: 'Response & Resistance Patterns',
            body: 'Identify biological patterns associated with treatment response or resistance.',
          },
        ],
      },
      biopharma: {
        title: 'Built for Biopharma',
        description:
          'ResponseAI™ can support the drug-development lifecycle through clinical-trial enrichment, retrospective trial analysis, patient stratification, drug-response modeling, biomarker discovery, and companion-diagnostic hypothesis generation.',
        stages: [
          'Clinical Trial Enrichment',
          'Retrospective Trial Analysis',
          'Patient Stratification',
          'Drug-Response Modeling',
          'Biomarker Discovery',
          'Companion-Diagnostic Hypothesis Generation',
        ],
      },
      /* Words wrapped in [brackets] carry the brand gradient. */
      closing: {
        question: 'Which patient is most likely to [respond] to this therapy?',
        followUp: 'And what [biological signals] explain the response?',
      },
      cta: { primary: 'Explore ResponseAI™', secondary: 'Request Demo' },
    },
  },
  {
    id: 'spatial-tme',
    name: 'OmicMind SpatialTME',
    shortName: 'SpatialTME',
    trademark: true,
    category: 'AI Tumor Microenvironment & Immunotherapy Intelligence',
    tagline:
      'Decodes tumor–immune spatial organization to identify biomarkers and patterns associated with immunotherapy response.',
    modalities: ['H&E', 'IHC / Multiplex IHC', 'Spatial Biology', 'Clinical Data'],
    description:
      'Decodes tumor–immune spatial organization to identify biomarkers and patterns associated with immunotherapy response.',
    inputs: ['H&E / IF images', 'Spatial data', 'Immune cell markers', 'Clinical data'],
    analysis: [
      'Spatial immune architecture',
      'Cell–cell interactions',
      'Tumor microenvironment',
      'Biomarker discovery',
    ],
    outputs: ['Spatial maps', 'Immune signatures', 'Treatment response insights', 'Clinical reporting'],
    href: '/platform/spatial',
    Visual: SpatialVisual,

    /* Full story — rendered by SpatialTMEDetail. */
    story: {
      layout: 'spatial',
      overview:
        'OmicMind SpatialTME™ uses AI to decode the spatial architecture of the tumor microenvironment and identify tumor–immune patterns associated with immunotherapy response.',
      inputs: {
        title: 'What Does SpatialTME™ Analyze?',
        modalities: [
          { label: 'H&E' },
          { label: 'IHC / Multiplex IHC' },
          { label: 'Optional NGS', optional: true },
          { label: 'Clinical Outcome Data' },
        ],
        flow: {
          sources: [
            { label: 'H&E + IHC / Multiplex IHC' },
            { label: 'Optional NGS', optional: true },
            { label: 'Clinical Outcomes' },
          ],
          model: 'Spatial AI',
          result: 'Spatial Tumor–Immune Insights',
        },
      },
      markers: {
        title: 'Example Spatial Biology Panel',
        groups: [
          { key: 'tumor', label: 'Tumor', markers: ['PanCK'] },
          { key: 'immune', label: 'Immune', markers: ['CD3', 'CD8', 'FOXP3', 'CD68'] },
          { key: 'checkpoint', label: 'Immunotherapy', markers: ['PD-L1'] },
        ],
        panel: [
          { label: 'H&E' },
          { label: 'PanCK', group: 'tumor' },
          { label: 'PD-L1', group: 'checkpoint' },
          { label: 'CD3', group: 'immune' },
          { label: 'CD8', group: 'immune' },
          { label: 'FOXP3', group: 'immune' },
          { label: 'CD68', group: 'immune' },
        ],
      },
      analysis: {
        title: 'What Does the AI Identify?',
        items: [
          {
            icon: 'scatter',
            title: 'Immune-cell Density & Distribution',
            body: 'How many immune cells are present, and where they sit across the tissue.',
          },
          {
            icon: 'infiltrate',
            title: 'Tumor Infiltration',
            body: 'The extent to which immune cells penetrate tumor regions.',
          },
          {
            icon: 'exclude',
            title: 'Immune Exclusion',
            body: 'Immune cells held at the tumor margin or within surrounding stroma.',
          },
          {
            icon: 'ruler',
            title: 'Cell-to-Cell Proximity & Distances',
            body: 'Measured distances between tumor, immune, and stromal cells.',
          },
          {
            icon: 'neighborhood',
            title: 'Spatial Neighborhoods',
            body: 'Recurring local cell communities and their composition.',
          },
          {
            icon: 'link',
            title: 'Tumor–Immune Interactions',
            body: 'Contacts and co-localization between tumor and immune cells.',
          },
        ],
      },
      biomarkers: {
        title: 'SpatialTME™ Biomarkers',
        items: [
          {
            title: 'Inflamed / Excluded / Desert Phenotypes',
            indicator: { kind: 'categories', labels: ['Inflamed', 'Excluded', 'Desert'] },
          },
          { title: 'CD8+ Infiltration Score', indicator: { kind: 'scale', labels: ['Low', 'High'], position: 0.72 } },
          { title: 'Immune-Exclusion Score', indicator: { kind: 'scale', labels: ['Low', 'High'], position: 0.38 } },
          { title: 'Treg / CD8+ Ratio', indicator: { kind: 'split', labels: ['Treg', 'CD8+'], position: 0.35 } },
          { title: 'Macrophage Signature', indicator: { kind: 'signature', labels: ['CD68+ profile'] } },
          { title: 'Composite Spatial TME Biomarker', indicator: { kind: 'composite' } },
        ],
        footnote: 'Indicators are illustrative representations only — they do not show patient values.',
      },
      applications: {
        title: 'Built for Immunotherapy Development',
        description:
          'Designed to support immunotherapy development, mechanism-of-action studies, combination-therapy selection, translational research, patient stratification, and novel biomarker discovery.',
        stages: [
          { label: 'Immunotherapy Development', icon: 'flask' },
          { label: 'Mechanism-of-Action Studies', icon: 'target' },
          { label: 'Combination Therapy', icon: 'combine' },
          { label: 'Translational Research', icon: 'translate' },
          { label: 'Patient Stratification', icon: 'users' },
          { label: 'Biomarker Discovery', icon: 'search' },
        ],
      },
      closing: {
        label: 'Core Question',
        question:
          'How does the [spatial organization] of the tumor microenvironment influence [immunotherapy response]?',
      },
      cta: { primary: 'Explore SpatialTME™' },
    },
  },
  {
    id: 'histoquant',
    name: 'OmicMind HistoQuant',
    shortName: 'HistoQuant',
    trademark: true,
    category: 'AI-Powered Quantitative Digital Pathology',
    tagline: 'Automatically identifies and quantifies tumor, stromal, immune, and cellular compartments.',
    modalities: ['H&E', 'IHC', 'Cellular Analysis', 'Spatial Features'],
    description:
      'Automatically identifies and quantifies tumor, stromal, immune, and cellular compartments to transform pathology images into structured quantitative insights.',
    inputs: ['H&E', 'IHC', 'Whole-slide images'],
    analysis: ['Tissue classification', 'Cell detection', 'Biomarker quantification'],
    outputs: ['Quantitative pathology', 'Cellular measurements', 'Tissue insights'],
    href: '/platform/biomarker-quantification',
    Visual: HistoQuantVisual,

    /* Full story — rendered by HistoQuantDetail. */
    story: {
      layout: 'histo',
      overview:
        'HistoQuant™ automatically identifies and quantifies tumor, stromal, immune, and other cellular compartments, extracting high-dimensional morphological and spatial features.',
      process: {
        title: 'Pathology → Quantification',
        stages: [
          { label: 'Pathology Image', icon: 'microscope' },
          { label: 'Cell & Tissue Detection', icon: 'detect' },
          { label: 'Classification', icon: 'classify' },
          { label: 'Morphological Analysis', icon: 'shapes' },
          { label: 'Spatial Analysis', icon: 'spatial' },
          { label: 'Quantitative Data', icon: 'data' },
        ],
      },
      measures: {
        title: 'What Does HistoQuant™ Measure?',
        intro:
          'The platform converts complex pathology images into measurable cellular, tissue, morphological, and spatial features.',
        items: [
          {
            icon: 'composition',
            title: 'Cell & Tissue Composition',
            body: 'The proportions of tumor, stromal, immune, and other cells in the tissue.',
          },
          {
            icon: 'grid',
            title: 'Cell Density & Distribution',
            body: 'How densely each cell type is packed, and how it is spread across the tissue.',
          },
          {
            icon: 'layers',
            title: 'Tumor–Stroma Architecture',
            body: 'How tumor and stromal compartments are arranged relative to each other.',
          },
          {
            icon: 'shapes',
            title: 'Nuclear & Cellular Morphology',
            body: 'Size, shape, and other morphological features of nuclei and cells.',
          },
          {
            icon: 'intensity',
            title: 'IHC Expression & Intensity',
            body: 'Marker expression and staining intensity measured from IHC images.',
          },
          {
            icon: 'spatial',
            title: 'Cellular Proximity & Spatial Relationships',
            body: 'Distances and spatial relationships between cells and cell types.',
          },
          {
            icon: 'heterogeneity',
            title: 'Tumor Heterogeneity',
            body: 'Variation in cellular and morphological features across the tumor.',
          },
          {
            icon: 'signature',
            title: 'Tissue-Level Morphological Signatures',
            body: 'Combined morphological features that summarize the tissue as a whole.',
          },
        ],
      },
      analysis: {
        title: 'Cellular & Tissue Analysis',
        intro: 'From pixels to cells, from cells to tissue, from tissue to quantitative data.',
        stages: [
          { title: 'Pixels', caption: 'Pathology image' },
          { title: 'Cells', caption: 'Cell detection' },
          { title: 'Tissue', caption: 'Classification' },
          { title: 'Data', caption: 'Measurement & spatial analysis' },
        ],
        footnote: 'Schematic illustration — not patient data.',
      },
      outputs: {
        title: 'HistoQuant™ Outputs',
        description: 'HistoQuant™ converts pathology images into structured quantitative data for downstream analysis.',
        items: [
          { icon: 'count', title: 'Cell Counts', type: 'Counts' },
          { icon: 'grid', title: 'Density Scores', type: 'Scores' },
          { icon: 'shapes', title: 'Morphological Features', type: 'Feature set' },
          { icon: 'intensity', title: 'IHC Expression Profiles', type: 'Profiles' },
          { icon: 'spatial', title: 'Spatial Features', type: 'Feature set' },
          { icon: 'composition', title: 'Tissue Composition', type: 'Proportions' },
          { icon: 'signature', title: 'Quantitative Pathology Signatures', type: 'Signatures' },
        ],
      },
      foundation: {
        title: 'From Pathology to Multimodal Intelligence',
        description:
          'These features form the computational foundation for downstream molecular, spatial, clinical, and treatment-response models.',
        features: 'Quantitative Pathology Features',
        models: [
          { label: 'Molecular Models', icon: 'dna' },
          { label: 'Spatial Models', icon: 'spatial' },
          { label: 'Clinical Models', icon: 'clinical' },
          { label: 'Treatment Response', icon: 'chart' },
        ],
      },
      applications: {
        title: 'Research & Pharma Applications',
        items: [
          {
            icon: 'microscope',
            title: 'Quantitative Histopathology',
            body: 'Turn H&E and IHC images into measurable tissue and cellular features.',
          },
          {
            icon: 'intensity',
            title: 'Biomarker Development',
            body: 'Quantify IHC expression and morphological features as candidate biomarkers.',
          },
          {
            icon: 'translate',
            title: 'Translational Research',
            body: 'Connect quantitative pathology features with molecular and clinical data.',
          },
          {
            icon: 'users',
            title: 'Patient Stratification',
            body: 'Group patients by their quantitative tissue and cellular profiles.',
          },
          {
            icon: 'clipboard',
            title: 'Clinical Research',
            body: 'Provide structured pathology data for clinical research analyses.',
          },
          {
            icon: 'pill',
            title: 'Drug Development',
            body: 'Supply quantitative pathology features to downstream treatment-response models.',
          },
        ],
      },
      closing: {
        statement: 'Turn pathology images into [quantitative biological intelligence].',
        followUp: 'From cells and tissues to structured features that power next-generation multimodal models.',
      },
      cta: { primary: 'Explore HistoQuant™', secondary: 'Request Demo' },
    },
  },
  {
    id: 'biomarker-drug-discovery',
    name: 'OmicMind Biomarker & Drug Discovery',
    shortName: 'Biomarker',
    trademark: true,
    category: 'From Patient Biology to Therapeutic Innovation',
    tagline:
      'Integrates multimodal biological and clinical signals to uncover biomarkers, targets, and therapeutic opportunities.',
    modalities: ['H&E', 'IHC', 'Spatial TME', 'NGS', 'Clinical & Outcomes'],
    description:
      'Integrates pathology, molecular, spatial, clinical, and treatment intelligence to uncover biomarkers, therapeutic targets, and precision drug-development opportunities.',
    inputs: ['Pathology', 'Molecular data', 'Biomarkers', 'Clinical data'],
    analysis: ['Biomarker discovery', 'Molecular signatures', 'Target identification', 'Patient biology'],
    outputs: ['Candidate biomarkers', 'Therapeutic targets', 'Translational insights'],
    href: null,
    Visual: DiscoveryVisual,

    /* Full story — rendered by DiscoveryDetail. */
    story: {
      layout: 'discovery',
      overview:
        'OmicMind integrates pathology, molecular, spatial, clinical, and treatment-response intelligence to discover novel biomarkers, therapeutic targets, and opportunities for precision drug development.',
      multimodal: {
        title: 'Multimodal Discovery',
        description:
          'OmicMind connects signals across pathology, spatial biology, molecular data, clinical context, and treatment outcomes to identify biological patterns associated with disease, response, resistance, and patient outcomes.',
        modalities: [
          { label: 'H&E' },
          { label: 'IHC' },
          { label: 'Spatial TME' },
          { label: 'NGS' },
          { label: 'Clinical Data' },
          { label: 'Treatment & Outcomes' },
        ],
        flow: {
          sources: [
            { label: 'H&E + IHC' },
            { label: 'Spatial TME' },
            { label: 'NGS' },
            { label: 'Clinical Data' },
            { label: 'Treatment & Outcomes' },
          ],
          model: 'OmicMind',
          modelName: 'Intelligence',
          result: 'Biological Patterns',
        },
      },
      signals: {
        title: 'From Data to Biological Signals',
        source: 'Multimodal Data',
        items: [
          { label: 'Disease Biology', icon: 'dna' },
          { label: 'Treatment Response', icon: 'activity' },
          { label: 'Treatment Resistance', icon: 'exclude' },
          { label: 'Patient Outcomes', icon: 'users' },
        ],
        result: 'Patterns & Associations',
      },
      biomarkers: {
        title: 'Biomarker Discovery',
        description:
          'Discover and characterize biological signatures that can help explain disease behavior, treatment response, resistance, and patient differences.',
        items: [
          {
            icon: 'gauge',
            title: 'Predictive & Prognostic Biomarkers',
            body: 'Signals associated with treatment benefit or with disease course.',
          },
          {
            icon: 'layers',
            title: 'Multimodal Biomarker Signatures',
            body: 'Combined pathology, spatial, molecular, and clinical features.',
          },
          {
            icon: 'compare',
            title: 'Response & Resistance Signatures',
            body: 'Biological patterns that separate responders from non-responders.',
          },
          {
            icon: 'split',
            title: 'Patient Subgroups',
            body: 'Groups of patients that share biological characteristics.',
          },
          {
            icon: 'microscope',
            title: 'Image-Derived Molecular Biomarkers',
            body: 'Molecular characteristics inferred from tissue morphology.',
          },
          {
            icon: 'testtube',
            title: 'Companion-Diagnostic Hypotheses',
            body: 'Candidate biomarkers to explore for companion-diagnostic development.',
          },
        ],
      },
      therapeutic: {
        title: 'Therapeutic Discovery',
        description: 'Translate biological insights into actionable opportunities for precision drug development.',
        progression: [
          { label: 'Biological Signal', icon: 'activity' },
          { label: 'Mechanism', icon: 'network' },
          { label: 'Target', icon: 'target' },
          { label: 'Therapeutic Opportunity', icon: 'pill' },
        ],
        items: [
          {
            icon: 'target',
            title: 'Novel Therapeutic Targets',
            body: 'Candidate targets suggested by patient biology.',
          },
          {
            icon: 'network',
            title: 'Mechanisms of Response & Resistance',
            body: 'Biological mechanisms behind why patients respond or resist.',
          },
          {
            icon: 'signature',
            title: 'Drug-Response Signatures',
            body: 'Patterns associated with response to a specific therapy.',
          },
          {
            icon: 'combine',
            title: 'Combination-Therapy Opportunities',
            body: 'Biological rationale for combining therapies.',
          },
          {
            icon: 'users',
            title: 'Patient Populations for Targeted Therapies',
            body: 'Patients whose biology matches a targeted approach.',
          },
          {
            icon: 'repurpose',
            title: 'Drug Repurposing Opportunities',
            body: 'Existing therapies that may fit newly identified biology.',
          },
        ],
      },
      flywheel: {
        title: 'The OmicMind Discovery Flywheel',
        steps: ['Tissue', 'Biology', 'Biomarkers', 'Response', 'Mechanism', 'Targets', 'Therapeutics'],
        centerTitle: 'Continuous discovery',
        centerNote: 'Each layer of data strengthens the next.',
        statement:
          'OmicMind turns increasingly rich biological and clinical data into a continuous discovery engine for precision medicine and drug development.',
      },
      applications: {
        title: 'Built for Precision Drug Development',
        description:
          'Support target discovery, translational research, biomarker-led drug development, clinical-trial strategy, patient stratification, combination-therapy research, and precision medicine programs.',
        stages: [
          { label: 'Target Discovery', icon: 'target' },
          { label: 'Translational Research', icon: 'translate' },
          { label: 'Biomarker Development', icon: 'testtube' },
          { label: 'Patient Stratification', icon: 'users' },
          { label: 'Clinical-Trial Strategy', icon: 'clipboard' },
          { label: 'Precision Medicine', icon: 'dna' },
        ],
      },
      closing: {
        label: 'Core Question',
        question:
          'What [biological signals] can reveal the next [biomarker], [target], or [therapeutic opportunity]?',
        coda: {
          statement: 'From Patient Biology to Therapeutic Innovation.',
          chain: ['Tissue', 'Biology', 'Biomarkers', 'Response', 'Mechanism', 'Targets', 'Therapeutics'],
        },
      },
      cta: { primary: 'Explore Discovery Intelligence', secondary: 'Request Demo' },
    },
  },
  {
    id: 'adc-response-ai',
    name: 'OmicMind ADC ResponseAI',
    shortName: 'ADC ResponseAI',
    trademark: true,
    category: 'AI-Powered ADC Response & Patient Stratification',
    tagline: 'Identifies patient and biological signals associated with ADC response and resistance.',
    modalities: ['H&E', 'IHC', 'NGS', 'Clinical'],
    description:
      'Integrates pathology, molecular, spatial, and clinical signals to identify patients most likely to respond to antibody–drug conjugates and reveal features associated with response and resistance.',
    inputs: ['H&E', 'IHC / Multiplex IHC', 'NGS', 'Clinical & Outcomes'],
    analysis: ['Target-antigen expression', 'Antigen density', 'Tumor heterogeneity', 'Spatial context'],
    outputs: ['ADC response probability', 'Patient stratification', 'Target profile', 'Response & resistance signatures'],
    href: null,
    Visual: ADCVisual,

    /* Full story — rendered by ADCDetail. */
    story: {
      layout: 'adc',
      overview:
        'OmicMind ADC ResponseAI™ integrates pathology, molecular, spatial, and clinical data to identify patients most likely to respond to antibody–drug conjugates and uncover biological features associated with response and resistance.',
      inputs: {
        title: 'What Does ADC ResponseAI™ Analyze?',
        modules: [
          { label: 'H&E', detail: 'Tumor morphology and tissue architecture', icon: 'microscope' },
          { label: 'IHC / Multiplex IHC', detail: 'Target-antigen staining and co-expression', icon: 'layers' },
          { label: 'NGS', detail: 'Genomic alterations and molecular context', icon: 'dna' },
          { label: 'Clinical Data', detail: 'Patient and disease characteristics', icon: 'clinical' },
          { label: 'Treatment & Outcome Data', detail: 'Prior therapy, response, and follow-up', icon: 'activity' },
        ],
        flow: {
          sources: ['Pathology', 'Molecular', 'Spatial', 'Clinical', 'Treatment Outcomes'],
          result: 'Patient-Level ADC Insights',
        },
      },
      signals: {
        title: 'Key Signals',
        items: [
          { icon: 'target', title: 'Target-Antigen Expression', body: 'Whether tumor cells express the ADC target.' },
          { icon: 'intensity', title: 'Expression Intensity', body: 'How strongly the target is expressed per cell.' },
          { icon: 'heterogeneity', title: 'Tumor Heterogeneity', body: 'How expression varies across the tumor.' },
          { icon: 'grid', title: 'Antigen-Positive Cell Density', body: 'How many target-positive cells are present.' },
          { icon: 'spatial', title: 'Spatial Distribution', body: 'Where target-positive cells sit in the tissue.' },
          { icon: 'neighborhood', title: 'Tumor Microenvironment', body: 'Stroma and immune context around the tumor.' },
          { icon: 'dna', title: 'Molecular Alterations', body: 'Genomic features that may shape response.' },
          { icon: 'clinical', title: 'Clinical Characteristics', body: 'Patient, disease, and treatment-history context.' },
        ],
      },
      analysis: {
        title: 'AI Analysis',
        description:
          'The platform evaluates multimodal biological and clinical features to identify patterns associated with ADC response and resistance.',
        stages: [
          { label: 'Target Expression', icon: 'target' },
          { label: 'Antigen Distribution', icon: 'grid' },
          { label: 'Tumor Heterogeneity', icon: 'heterogeneity' },
          { label: 'Spatial Context', icon: 'spatial' },
          { label: 'Molecular Features', icon: 'dna' },
          { label: 'Clinical Features', icon: 'clinical' },
          { label: 'Response / Resistance Patterns', icon: 'compare' },
        ],
        /* Features evaluated together — drawn as arcs over the track. */
        relations: [
          [0, 1],
          [1, 3],
          [0, 2],
          [2, 4],
          [3, 6],
          [4, 6],
          [5, 6],
        ],
        footnote: 'Arcs connect features the model evaluates together; pink arcs feed the response / resistance patterns.',
      },
      target: {
        title: 'Understanding the Target',
        description: 'Target expression varies cell by cell — in level, in density, and in where it sits.',
        terms: ['Antigen Expression', 'Antigen Density', 'Spatial Distribution'],
        result: 'Target Profile',
        compare: ['Evenly spread', 'Clustered'],
        note: 'The same share of target-positive cells, arranged differently — why target expression alone may not tell the complete patient story.',
      },
      heterogeneity: {
        title: 'Beyond Target Expression',
        description: 'One tumor can hold regions with very different target expression, inside its own microenvironment.',
        terms: ['Tumor Heterogeneity', 'Spatial Distribution', 'Tumor Microenvironment'],
        result: 'ADC Response Context',
      },
      outputs: {
        title: 'ADC ResponseAI™ Outputs',
        items: [
          { icon: 'gauge', title: 'ADC Response Probability', body: 'Model-derived likelihood of benefit from the ADC.' },
          { icon: 'split', title: 'Responder / Non-Responder Stratification', body: 'Patients grouped by predicted response.' },
          { icon: 'chart', title: 'Target-Expression Score', body: 'Quantified target level across the tumor.' },
          { icon: 'spatial', title: 'Spatial Target-Distribution Profile', body: 'How target-positive cells are arranged in tissue.' },
          { icon: 'users', title: 'Patient Risk Groups', body: 'Subgroups sharing biological and clinical features.' },
          { icon: 'signature', title: 'Response & Resistance Signatures', body: 'Feature patterns linked to response or resistance.' },
          { icon: 'layers', title: 'Potential Multimodal ADC Biomarker', body: 'Combined features to explore as a biomarker.' },
        ],
        footnote: 'Output types the model is designed to generate — not patient results.',
      },
      applications: {
        title: 'Built for ADC Development',
        description:
          'Designed to support ADC clinical-trial enrichment, patient selection, retrospective trial analysis, target-expression assessment, biomarker discovery, response stratification, combination-therapy research, and companion-diagnostic hypothesis generation.',
        stages: [
          { label: 'Target Assessment', icon: 'target' },
          { label: 'Patient Selection', icon: 'users' },
          { label: 'Trial Enrichment', icon: 'clipboard' },
          { label: 'Response Stratification', icon: 'split' },
          { label: 'Biomarker Discovery', icon: 'search' },
          { label: 'Companion-Diagnostic Hypothesis', icon: 'testtube' },
        ],
      },
      closing: {
        label: 'Core Question',
        question:
          'Which patients are [most likely to respond] to this ADC — and what [biological features] drive that response?',
        coda: {
          statement: 'From target expression to patient-level ADC response.',
          label: 'From pathology to ADC response',
          chain: ['Pathology', 'Molecular Signals', 'Spatial Context', 'Clinical Features', 'ADC Response'],
        },
      },
      cta: { primary: 'Explore ADC ResponseAI™', secondary: 'Request Demo' },
    },
  },
  {
    id: 'drug-development-intelligence',
    name: 'OmicMind Drug Development Intelligence',
    shortName: 'Drug Development',
    trademark: true,
    category: 'AI-Powered Translational & Clinical Development Intelligence',
    tagline:
      'Connects patient biology, biomarkers, treatment response, and clinical outcomes to guide drug-development decisions.',
    modalities: ['Biology', 'Biomarkers', 'Clinical', 'Outcomes'],
    description:
      'Connects patient biology, biomarkers, treatment response, and clinical outcomes to help biopharma teams make better drug-development decisions.',
    inputs: ['Patient Biology', 'Biomarkers', 'Clinical Data', 'Treatment Outcomes'],
    analysis: ['Patient subgroups', 'Responder populations', 'Response & resistance', 'Mechanisms of action'],
    outputs: ['Responder profiles', 'Biomarker signatures', 'Patient stratification', 'Trial enrichment'],
    href: null,
    Visual: DrugDevVisual,

    /* Full story — rendered by DrugDevDetail. */
    story: {
      layout: 'drugdev',
      overview:
        'OmicMind Drug Development Intelligence™ connects patient biology, biomarkers, treatment response, clinical outcomes, and therapeutic mechanisms to help biopharma teams make better decisions across the drug-development lifecycle.',
      evidence: {
        title: 'Connect the Evidence',
        description:
          'The platform integrates pathology, spatial, molecular, clinical, and treatment-response data to identify the patients, biomarkers, mechanisms, and therapeutic contexts most relevant to a drug program.',
        modules: [
          { label: 'H&E', detail: 'Tumor morphology and tissue architecture', icon: 'microscope' },
          { label: 'IHC', detail: 'Protein and target expression', icon: 'layers' },
          { label: 'Spatial Biology', detail: 'Tumor and immune cells in context', icon: 'spatial' },
          { label: 'NGS', detail: 'Genomic alterations and molecular subtypes', icon: 'dna' },
          { label: 'Clinical Data', detail: 'Patient and disease characteristics', icon: 'clinical' },
          { label: 'Treatment Response', detail: 'How patients responded to therapy', icon: 'activity' },
          { label: 'Longitudinal Outcomes', detail: 'Progression and survival over time', icon: 'timeline' },
        ],
        flow: {
          sources: ['Pathology', 'Molecular', 'Spatial', 'Clinical', 'Treatment', 'Outcomes'],
          model: 'Intelligence',
          result: 'Drug Development Insights',
        },
      },
      intelligence: {
        title: 'What Does OmicMind Analyze?',
        items: [
          { icon: 'users', title: 'Patient & Molecular Subgroups', body: 'Patients who share biology and molecular features.' },
          { icon: 'gauge', title: 'Biomarker-Defined Responder Populations', body: 'Populations defined by biomarkers linked to benefit.' },
          { icon: 'compare', title: 'Treatment Response & Resistance Patterns', body: 'What separates patients who respond from those who don’t.' },
          { icon: 'neighborhood', title: 'Tumor & Immune Microenvironment', body: 'Tumor–immune context that may shape treatment effect.' },
          { icon: 'network', title: 'Mechanism-of-Action Signatures', body: 'Biological patterns consistent with how a drug acts.' },
          { icon: 'combine', title: 'Potential Combination Opportunities', body: 'Biological rationale for pairing therapies.' },
          { icon: 'clipboard', title: 'Clinical-Trial Enrichment Opportunities', body: 'Patient groups that may sharpen a trial’s signal.' },
          { icon: 'activity', title: 'Translational Biomarkers & Pharmacodynamic Signals', body: 'Markers that track biology and drug activity.' },
        ],
      },
      decision: {
        title: 'From Patient Biology to Development Decisions',
        steps: [
          { label: 'Patient Biology', icon: 'microscope', note: 'Start from the tissue, molecular, and clinical profile of each patient.' },
          { label: 'Biomarker Signals', icon: 'activity', note: 'Surface the biomarkers that vary meaningfully between patients.' },
          { label: 'Responder Population', icon: 'users', note: 'Define the patients whose biology is associated with benefit.' },
          { label: 'Treatment Response', icon: 'chart', note: 'Relate that population to observed treatment response.' },
          { label: 'Mechanism & Resistance', icon: 'network', note: 'Explain why patients respond — and why others resist.' },
          { label: 'Clinical Strategy', icon: 'clipboard', note: 'Translate the evidence into enrichment, indication, and combination strategy.' },
          { label: 'Drug Development Decision', icon: 'decision', note: 'Inform the program decision with connected, explainable evidence.' },
        ],
      },
      outputs: {
        title: 'Development Intelligence Outputs',
        items: [
          { icon: 'users', title: 'Responder Population Profiles', body: 'Biology and characteristics of likely responders.' },
          { icon: 'signature', title: 'Predictive Biomarker Signatures', body: 'Feature patterns associated with treatment benefit.' },
          { icon: 'split', title: 'Patient Stratification Models', body: 'Patients grouped by predicted benefit.' },
          { icon: 'network', title: 'Mechanism-of-Action Insights', body: 'Biology consistent with the drug’s mechanism.' },
          { icon: 'exclude', title: 'Resistance Hypotheses', body: 'Candidate explanations for non-response.' },
          { icon: 'clipboard', title: 'Trial-Enrichment Strategies', body: 'Biomarker-led options for selecting trial patients.' },
          { icon: 'combine', title: 'Combination-Therapy Hypotheses', body: 'Rationale for therapies that may work together.' },
          { icon: 'testtube', title: 'Translational Biomarker Candidates', body: 'Markers to carry from research into the clinic.' },
        ],
        footnote: 'Output types the platform is designed to generate — not program results.',
      },
      lifecycle: {
        title: 'Intelligence Across the Drug-Development Lifecycle',
        description: 'One connected evidence base informs every stage, from target validation to clinical development.',
        stages: [
          { label: 'Target Validation', icon: 'target' },
          { label: 'Translational Research', icon: 'translate' },
          { label: 'Biomarker Strategy', icon: 'testtube' },
          { label: 'Patient Enrichment', icon: 'users' },
          { label: 'Clinical-Trial Design', icon: 'clipboard' },
          { label: 'Indication Selection', icon: 'detect' },
          { label: 'Combination Development', icon: 'combine' },
          { label: 'Clinical Development', icon: 'clinical' },
        ],
        band: {
          label: 'Connected evidence',
          layers: ['Biology', 'Biomarkers', 'Response', 'Outcomes'],
        },
      },
      applications: {
        title: 'Built for Biopharma',
        description:
          'Designed to support target validation, translational research, clinical-trial design, patient enrichment, biomarker strategy, indication selection, combination-therapy development, retrospective trial analysis, and companion-diagnostic programs.',
        items: [
          { icon: 'target', title: 'Target Validation', body: 'Check a target against patient biology.' },
          { icon: 'translate', title: 'Translational Research', body: 'Connect preclinical hypotheses to patients.' },
          { icon: 'clipboard', title: 'Clinical-Trial Design', body: 'Shape eligibility and endpoints with evidence.' },
          { icon: 'users', title: 'Patient Enrichment', body: 'Focus trials on patients most likely to benefit.' },
          { icon: 'testtube', title: 'Biomarker Strategy', body: 'Choose and sequence biomarkers for a program.' },
          { icon: 'detect', title: 'Indication Selection', body: 'Find the tumor types where biology fits best.' },
          { icon: 'combine', title: 'Combination-Therapy Development', body: 'Prioritise combinations with biological rationale.' },
          { icon: 'chart', title: 'Retrospective Trial Analysis', body: 'Revisit completed trials for responder signals.' },
          { icon: 'flask', title: 'Companion-Diagnostic Programs', body: 'Support biomarker-led diagnostic development.' },
        ],
      },
      closing: {
        label: 'Core Question',
        question:
          'For this drug, [which patients] should we treat, [why will they respond], and how can we [develop the program more efficiently]?',
        coda: {
          statement: 'Connect the evidence. Understand the biology. Make better development decisions.',
          label: 'From biology to development',
          chain: ['Biology', 'Biomarkers', 'Response', 'Mechanism', 'Clinical Strategy', 'Development'],
        },
      },
      cta: { primary: 'Explore Drug Development Intelligence™', secondary: 'Request Demo' },
    },
  },
  {
    id: 'trial-ai',
    name: 'OmicMind TrialAI',
    shortName: 'TrialAI',
    trademark: true,
    tagline: 'Identifies eligible, biomarker-defined populations and optimizes clinical trial cohorts.',
    description:
      'AI-powered clinical trial intelligence that uses multimodal patient data to identify eligible, biomarker-defined populations and optimize trial cohorts.',
    inputs: ['Pathology', 'Molecular data', 'Clinical data', 'Biomarkers'],
    analysis: ['Patient matching', 'Biomarker eligibility', 'Cohort optimization'],
    outputs: ['Eligible populations', 'Biomarker-defined cohorts', 'Trial optimization'],
    href: null,
    Visual: DrugVisual,
  },
];
