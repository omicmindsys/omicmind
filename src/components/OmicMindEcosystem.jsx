import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import normalBreastOne from '../assets/normalbreastone.webp';
import classifiedField from '../assets/h&eclassification.webp';
import cellReadout from '../assets/carcinocell.webp';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   Every illustration is drawn in a fixed 320 x 180 viewBox and rendered
   at w-full, so all coordinates scale with the card and no breakpoint
   ever needs its own geometry.
------------------------------------------------------------------ */
const VB_W = 320;
const VB_H = 180;

const CAPTION = {
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontSize: 8.5,
  fontWeight: 600,
  letterSpacing: '0.08em',
};

const PILL_TEXT = {
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontSize: 8.5,
  fontWeight: 600,
  letterSpacing: '0.02em',
};

function Defs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="55%" stopColor="#D946EF" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.26" />
        <stop offset="100%" stopColor="#EC4899" stopOpacity="0.18" />
      </linearGradient>
      <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.36" />
        <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

/* ==================================================================
   1. Omio Clinical AI — digital pathology dashboard + clinical workflow
================================================================== */
const METRICS = [
  { label: 'ER', y: 48, w: 118 },
  { label: 'PR', y: 76, w: 84 },
  { label: 'HER2', y: 104, w: 136 },
];
const FLOW = [
  { x: 22, label: 'Scan' },
  { x: 120, label: 'Analyse' },
  { x: 218, label: 'Report' },
];
const BAR_X = 152;
const BAR_TRACK = 146;

function ClinicalVisual() {
  const id = 'eco-v1';

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" aria-hidden="true">
      <Defs id={id} />

      {/* Dashboard frame */}
      <rect
        x="10"
        y="12"
        width="300"
        height="156"
        rx="12"
        fill="#101B2E"
        stroke="rgba(167,139,250,0.31)"
        strokeWidth="1.2"
      />
      <path d="M10 33h300" stroke="rgba(167,139,250,0.24)" strokeWidth="1" />
      <circle cx="24" cy="22.5" r="2.2" fill="rgba(167,139,250,0.47)" />
      <circle cx="33" cy="22.5" r="2.2" fill="rgba(232,121,249,0.44)" />
      <circle cx="42" cy="22.5" r="2.2" fill="rgba(244,114,182,0.43)" />
      <rect x="58" y="18.5" width="64" height="8" rx="4" fill="rgba(167,139,250,0.22)" />

      {/* Whole-slide preview */}
      <rect
        x="22"
        y="44"
        width="112"
        height="72"
        rx="8"
        fill={`url(#${id}-fill)`}
        stroke="rgba(167,139,250,0.33)"
        strokeWidth="1.1"
      />
      <g className="eco1-cells">
        <circle cx="48" cy="66" r="7" fill="none" stroke="rgba(167,139,250,0.59)" strokeWidth="1.3" />
        <circle cx="48" cy="66" r="2.2" fill="rgba(167,139,250,0.62)" />
        <circle cx="78" cy="60" r="5" fill="none" stroke="rgba(192,132,252,0.59)" strokeWidth="1.3" />
        <circle cx="78" cy="60" r="1.8" fill="rgba(192,132,252,0.59)" />
        <circle cx="64" cy="92" r="6" fill="none" stroke="rgba(232,121,249,0.55)" strokeWidth="1.3" />
        <circle cx="64" cy="92" r="1.9" fill="rgba(232,121,249,0.59)" />
        <circle cx="100" cy="88" r="4.4" fill="none" stroke="rgba(244,114,182,0.55)" strokeWidth="1.3" />
        <circle cx="104" cy="66" r="3.4" fill="none" stroke="rgba(244,114,182,0.51)" strokeWidth="1.2" />
      </g>
      {/* AI detection box sweeping the slide */}
      <rect
        className="eco1-scan"
        x="38"
        y="54"
        width="30"
        height="26"
        rx="4"
        fill="none"
        stroke="#D946EF"
        strokeWidth="1.3"
        strokeDasharray="4 3"
      />

      {/* Biomarker readouts */}
      {METRICS.map((m) => (
        <g key={m.label}>
          <text x={BAR_TRACK} y={m.y} fill="#CBD5E1" {...CAPTION}>
            {m.label}
          </text>
          <rect x={BAR_TRACK} y={m.y + 6} width="152" height="6" rx="3" fill="rgba(167,139,250,0.22)" />
          <rect
            className="eco1-bar"
            x={BAR_TRACK}
            y={m.y + 6}
            width={m.w}
            height="6"
            rx="3"
            fill={`url(#${id}-bar)`}
          />
        </g>
      ))}

      {/* Clinical workflow rail */}
      {FLOW.map((f, i) => (
        <g key={f.label}>
          <rect
            x={f.x}
            y="130"
            width="80"
            height="22"
            rx="11"
            fill="#101B2E"
            stroke="rgba(167,139,250,0.35)"
            strokeWidth="1.1"
          />
          <circle cx={f.x + 14} cy="141" r="3.2" fill={`url(#${id}-ring)`} />
          <text x={f.x + 24} y="144" fill="#E2E8F0" {...PILL_TEXT}>
            {f.label}
          </text>
          {i < FLOW.length - 1 && (
            <>
              <line
                x1={f.x + 82}
                y1="141"
                x2={f.x + 94}
                y2="141"
                stroke="rgba(167,139,250,0.47)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle
                className="eco1-particle"
                r="2.2"
                fill="#ffffff"
                stroke="#A855F7"
                strokeWidth="1.5"
                cx={f.x + 82}
                cy="141"
                opacity="0"
                data-fromx={f.x + 82}
                data-fromy="141"
                data-tox={f.x + 94}
                data-toy="141"
              />
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ==================================================================
   2. Omio Biomarker Discovery — molecular network + biomarker heatmap
================================================================== */
const NET_NODES = [
  { x: 38, y: 60, r: 5.5 },
  { x: 76, y: 44, r: 4.4 },
  { x: 112, y: 66, r: 5 },
  { x: 52, y: 98, r: 4.6 },
  { x: 92, y: 106, r: 6.2, hit: true },
  { x: 126, y: 100, r: 4.2 },
  { x: 70, y: 134, r: 4.4 },
];
const NET_EDGES = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [4, 5],
  [2, 5],
  [3, 6],
  [4, 6],
  [1, 4],
];

const HM_COLS = 6;
const HM_ROWS = 5;
const HM_CELL_W = 20;
const HM_CELL_H = 18;
const HM_GAP = 3;
const HM_X = 168;
const HM_Y = 34;
// Deterministic pseudo-intensities so the map looks measured, not random.
const HM_VALUES = Array.from({ length: HM_COLS * HM_ROWS }, (_, k) => {
  const c = k % HM_COLS;
  const r = Math.floor(k / HM_COLS);
  return 0.1 + ((Math.sin(c * 1.7 + r * 2.3) + 1) / 2) * 0.62;
});

function BiomarkerVisual() {
  const id = 'eco-v2';
  const hmW = HM_COLS * HM_CELL_W + (HM_COLS - 1) * HM_GAP;
  const hmH = HM_ROWS * HM_CELL_H + (HM_ROWS - 1) * HM_GAP;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" aria-hidden="true">
      <Defs id={id} />

      <text x="82" y="20" fill="#94A3B8" textAnchor="middle" {...CAPTION}>
        MOLECULAR NETWORK
      </text>
      <text x={HM_X + hmW / 2} y="20" fill="#94A3B8" textAnchor="middle" {...CAPTION}>
        BIOMARKER MAP
      </text>

      {/* Network edges */}
      {NET_EDGES.map(([a, b], i) => (
        <line
          key={i}
          className="eco2-edge"
          x1={NET_NODES[a].x}
          y1={NET_NODES[a].y}
          x2={NET_NODES[b].x}
          y2={NET_NODES[b].y}
          stroke="rgba(167,139,250,0.55)"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.42"
        />
      ))}

      {/* Network nodes — one flagged as a discovered candidate */}
      {NET_NODES.map((n, i) =>
        n.hit ? (
          <g key={i}>
            <circle
              className="eco2-hit"
              cx={n.x}
              cy={n.y}
              r={n.r + 4}
              fill="none"
              stroke="rgba(244,114,182,0.62)"
              strokeWidth="1.4"
            />
            <circle cx={n.x} cy={n.y} r={n.r} fill={`url(#${id}-ring)`} />
          </g>
        ) : (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill="#101B2E"
            stroke="rgba(167,139,250,0.59)"
            strokeWidth="1.4"
          />
        )
      )}

      {/* Biomarker heatmap */}
      {HM_VALUES.map((v, k) => {
        const c = k % HM_COLS;
        const r = Math.floor(k / HM_COLS);
        return (
          <rect
            key={k}
            className="eco2-cell"
            x={HM_X + c * (HM_CELL_W + HM_GAP)}
            y={HM_Y + r * (HM_CELL_H + HM_GAP)}
            width={HM_CELL_W}
            height={HM_CELL_H}
            rx="3.5"
            fill={`url(#${id}-ring)`}
            opacity={v}
          />
        );
      })}

      {/* Column scan highlight sweeping the map */}
      <rect
        className="eco2-scan"
        x={HM_X}
        y={HM_Y - 3}
        width={HM_CELL_W}
        height={hmH + 6}
        rx="4"
        fill="none"
        stroke="#EC4899"
        strokeWidth="1.4"
      />

      {/* Intensity legend */}
      <rect x={HM_X} y={HM_Y + hmH + 12} width={hmW} height="7" rx="3.5" fill={`url(#${id}-bar)`} />
      <text x={HM_X} y={HM_Y + hmH + 32} fill="#94A3B8" {...CAPTION}>
        LOW
      </text>
      <text x={HM_X + hmW} y={HM_Y + hmH + 32} fill="#94A3B8" textAnchor="end" {...CAPTION}>
        HIGH
      </text>
    </svg>
  );
}

/* ==================================================================
   3. Omio Drug Discovery AI — pipeline + molecular sim + prediction
================================================================== */
const PIPE = [
  { x: 40, label: 'Target' },
  { x: 120, label: 'Molecule' },
  { x: 200, label: 'Response' },
  { x: 280, label: 'Translate' },
];
const PIPE_Y = 44;
const PIPE_R = 15;

const CHART = { x: 20, y: 92, w: 280, h: 68 };
// Plot band sits below the chart caption (baseline y=108) and above the
// frame's bottom padding, so the curve can never escape its box.
const PLOT_TOP = 114;
const PLOT_BASE = 152;
const GRIDLINES = [122, 134, 146];
const CURVE = 'M34 150 C 76 148, 100 142, 132 132 S 206 116, 286 114';
const CURVE_AREA = `${CURVE} L286 ${PLOT_BASE} L34 ${PLOT_BASE} Z`;

function DrugVisual() {
  const id = 'eco-v3';

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" aria-hidden="true">
      <Defs id={id} />

      {/* Pipeline rail */}
      <line
        x1={PIPE[0].x}
        y1={PIPE_Y}
        x2={PIPE[PIPE.length - 1].x}
        y2={PIPE_Y}
        stroke="rgba(167,139,250,0.35)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* Data travelling down the pipeline */}
      {PIPE.slice(0, -1).map((p, i) => (
        <circle
          key={i}
          className="eco3-particle"
          r="2.4"
          fill="#ffffff"
          stroke="#A855F7"
          strokeWidth="1.6"
          cx={p.x + PIPE_R}
          cy={PIPE_Y}
          opacity="0"
          data-fromx={p.x + PIPE_R}
          data-fromy={PIPE_Y}
          data-tox={PIPE[i + 1].x - PIPE_R}
          data-toy={PIPE_Y}
        />
      ))}

      {/* Pipeline stages */}
      {PIPE.map((p, i) => (
        <g key={p.label}>
          <circle cx={p.x} cy={PIPE_Y} r={PIPE_R} fill="#101B2E" />
          <circle cx={p.x} cy={PIPE_Y} r={PIPE_R} fill={`url(#${id}-fill)`} />
          <circle
            cx={p.x}
            cy={PIPE_Y}
            r={PIPE_R}
            fill="none"
            stroke={`url(#${id}-ring)`}
            strokeWidth="1.5"
          />
          {/* Molecular cluster mark, rotating on the second stage */}
          <g
            className={i === 1 ? 'eco3-molecule' : undefined}
            style={i === 1 ? { transformOrigin: `${p.x}px ${PIPE_Y}px` } : undefined}
          >
            <circle cx={p.x} cy={PIPE_Y} r="3" fill="#A78BFA" />
            {[0, 120, 240].map((a) => {
              const rad = ((a + i * 30) * Math.PI) / 180;
              return (
                <g key={a}>
                  <line
                    x1={p.x + Math.cos(rad) * 4}
                    y1={PIPE_Y + Math.sin(rad) * 4}
                    x2={p.x + Math.cos(rad) * 8}
                    y2={PIPE_Y + Math.sin(rad) * 8}
                    stroke="rgba(167,139,250,0.55)"
                    strokeWidth="1.1"
                  />
                  <circle
                    cx={p.x + Math.cos(rad) * 9.6}
                    cy={PIPE_Y + Math.sin(rad) * 9.6}
                    r="1.9"
                    fill="#D946EF"
                  />
                </g>
              );
            })}
          </g>
          <text x={p.x} y={PIPE_Y + 28} fill="#CBD5E1" textAnchor="middle" {...CAPTION}>
            {p.label}
          </text>
        </g>
      ))}

      {/* Prediction model chart */}
      <rect
        x={CHART.x}
        y={CHART.y}
        width={CHART.w}
        height={CHART.h}
        rx="10"
        fill="#101B2E"
        stroke="rgba(167,139,250,0.29)"
        strokeWidth="1.1"
      />
      <text x={CHART.x + 14} y={CHART.y + 16} fill="#94A3B8" {...CAPTION}>
        PREDICTED RESPONSE
      </text>
      {GRIDLINES.map((y) => (
        <line
          key={y}
          x1={CHART.x + 14}
          y1={y}
          x2={CHART.x + CHART.w - 14}
          y2={y}
          stroke="rgba(167,139,250,0.19)"
          strokeWidth="1"
        />
      ))}
      <path className="eco3-area" d={CURVE_AREA} fill={`url(#${id}-area)`} opacity="0" />
      <path
        className="eco3-curve"
        d={CURVE}
        fill="none"
        stroke={`url(#${id}-bar)`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle className="eco3-tip" cx="286" cy={PLOT_TOP} r="3.4" fill="#EC4899" opacity="0" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Titles carry no trademark character here: the card renders a superscript
   ™ of its own after {title}, so putting one in the string would print it
   twice. 'cta' is optional — a card without one simply ends at its core
   question.

   Each card's body is a list of labelled blocks, rendered in the order
   given: 'label' is the small-caps line, 'body' the prose beneath it. A
   block may instead carry 'items' — term / text pairs — for content that
   reads as a short glossary rather than a paragraph. 'question' is the
   card's closing line and is framed on its own at the foot of the card. */
const products = [
  {
    title: 'OmicMind ResponseAI',
    subtitle:
      'OmicMind ResponseAI™ is a multimodal AI platform designed to predict which patients are most likely to respond to a specific cancer therapy by integrating pathology, molecular, clinical, and treatment-outcome data.',
    blocks: [
      {
        label: 'Multimodal Intelligence',
        body: 'ResponseAI™ combines H&E, IHC, NGS, clinical characteristics, treatment history, and longitudinal outcomes to identify patient-level patterns associated with therapeutic response and resistance.',
      },
      {
        label: 'NSCLC',
        body: [
          'For non-small cell lung cancer, the model can integrate:',
          'H&E + PD-L1 + CD3/CD8/FOXP3/CD68 + EGFR/KRAS/STK11/KEAP1/TP53 + clinical variables + treatment/outcomes',
          'This enables a deeper view of the patient by connecting tumor morphology, immune microenvironment, molecular alterations, and clinical context.',
        ],
      },
      {
        body: 'Omic ResponseAI™ generates actionable patient and biological insights, including:',
        list: [
          'Therapy response probability',
          'Responder / non-responder stratification',
          'Patient risk groups',
          'Multimodal biomarker signatures',
          'Potential PFS / OS risk scores',
          'Response and resistance patterns',
        ],
      },
      {
        label: 'Built for Biopharma',
        body: 'ResponseAI™ can support the drug-development lifecycle through clinical-trial enrichment, retrospective trial analysis, patient stratification, drug-response modeling, biomarker discovery, and companion-diagnostic hypothesis generation.',
      },
    ],
    question:
      'Which patient is most likely to respond to this therapy and what biological signals explain the response?',
    cta: 'Explore ResponseAI',
    Visual: ClinicalVisual,
  },
  {
    title: 'OmicMind SpatialTME',
    subtitle: 'AI Tumor Microenvironment & Immunotherapy Biomarker Model',
    blocks: [
      {
        body: 'OmicMind SpatialTME™ uses AI to decode the spatial architecture of the tumor microenvironment and identify tumor–immune patterns associated with immunotherapy response.',
      },
      {
        label: 'Inputs',
        body: 'H&E + IHC / Multiplex IHC, with optional NGS and clinical outcome data for multimodal validation.',
      },
      {
        label: 'Core Panel',
        body: [
          'H&E + PanCK + PD-L1 + CD3 + CD8 + FOXP3 + CD68',
          'The model identifies and characterizes tumor, stromal, and immune cells, quantifying their spatial organization and interactions, including:',
        ],
        list: [
          'Immune-cell density and distribution',
          'Tumor infiltration',
          'Immune exclusion',
          'Cell-to-cell proximity and distances',
          'Spatial neighborhoods',
          'Tumor–immune interactions',
        ],
      },
      {
        label: 'Outputs',
        body: 'SpatialTME™ generates quantitative spatial biomarkers, including:',
        list: [
          'Inflamed / Excluded / Desert phenotypes',
          'CD8+ infiltration score',
          'Immune-exclusion score',
          'Treg / CD8+ ratio',
          'Macrophage signature',
          'Composite spatial TME biomarker',
        ],
      },
      {
        label: 'Pharma Applications',
        body: 'Designed to support immunotherapy development, mechanism-of-action studies, combination-therapy selection, translational research, patient stratification, and novel biomarker discovery.',
      },
    ],
    question:
      'How does the spatial organization of the tumor microenvironment influence immunotherapy response?',
    cta: 'Explore SpatialTME',
    Visual: BiomarkerVisual,
  },
  {
    title: 'OmicMind HistoQuant',
    subtitle: 'AI-Powered Quantitative Histopathology & Tissue Intelligence',
    blocks: [
      {
        body: 'OmicMind HistoQuant™ transforms routine H&E and IHC pathology into quantitative, spatially resolved data — converting tissue morphology into measurable biological features for clinical research, biomarker discovery, and AI-powered pathology.',
      },
      {
        label: 'Inputs',
        body: 'H&E | IHC | Multiplex IHC | Whole-Slide Images (WSI)',
      },
      {
        label: 'AI Analysis',
        body: [
          'HistoQuant™ automatically identifies and quantifies tumor, stromal, immune, and other cellular compartments, extracting high-dimensional morphological and spatial features.',
          'The platform measures:',
        ],
        list: [
          'Cell and tissue composition',
          'Cell density and distribution',
          'Tumor–stroma architecture',
          'Nuclear and cellular morphology',
          'IHC expression and intensity',
          'Cellular proximity and spatial relationships',
          'Tumor heterogeneity',
          'Tissue-level morphological signatures',
        ],
      },
      {
        label: 'Outputs',
        body: [
          'HistoQuant™ converts pathology images into structured quantitative data, including:',
          'Cell counts | Density scores | Morphological features | IHC expression profiles | Spatial features | Tissue composition | Quantitative pathology signatures',
          'These features form the computational foundation for downstream molecular, spatial, clinical, and treatment-response models.',
        ],
      },
      {
        label: 'Research & Pharma Applications',
        body: 'HistoQuant™ enables quantitative pathology, cohort characterization, biomarker development, translational research, clinical-trial analysis, treatment-response research, and AI model development.',
      },
    ],
    question: '“What measurable biological information can we extract from the tissue?”',
    cta: 'Explore HistoQuant',
    Visual: DrugVisual,
  },
  {
    title: 'OmicMind Biomarker & Drug Discovery',
    trademark: false,
    subtitle: 'From Patient Biology to Therapeutic Innovation',
    blocks: [
      {
        body: 'OmicMind integrates pathology, molecular, spatial, clinical, and treatment-response intelligence to discover novel biomarkers, therapeutic targets, and opportunities for precision drug development.',
      },
      {
        label: 'Multimodal Discovery',
        body: [
          'OmicMind connects signals across:',
          'H&E + IHC + Spatial TME + NGS + Clinical Data + Treatment & Outcomes',
          'to identify biological patterns associated with disease, treatment response, resistance, and patient outcomes.',
        ],
      },
      {
        label: 'Biomarker Discovery',
        body: 'Discover and characterize:',
        list: [
          'Predictive and prognostic biomarkers',
          'Multimodal biomarker signatures',
          'Response and resistance signatures',
          'Patient subgroups',
          'Image-derived molecular biomarkers',
          'Companion-diagnostic hypotheses',
        ],
      },
      {
        label: 'Therapeutic Discovery',
        body: 'Translate these biological insights into:',
        list: [
          'Novel therapeutic targets',
          'Mechanisms of response and resistance',
          'Drug-response signatures',
          'Combination-therapy opportunities',
          'Patient populations for targeted therapies',
          'Drug repurposing opportunities',
        ],
      },
      {
        label: 'Pharma Applications',
        body: 'Support target discovery, translational research, biomarker-led drug development, clinical-trial strategy, patient stratification, combination-therapy research, and precision medicine programs.',
      },
    ],
    question: '“What biological signals can reveal the next biomarker, target, or therapeutic opportunity?”',
    coda: {
      label: 'The OmicMind Discovery Flywheel',
      chain: 'Tissue → Biology → Biomarkers → Response → Mechanism → Targets → Therapeutics',
      body: 'OmicMind turns increasingly rich biological and clinical data into a continuous discovery engine for precision medicine and drug development.',
    },
    cta: 'Explore Discovery',
    Visual: DrugVisual,
  },
  {
    eyebrow: 'ADC Module',
    title: 'OmicMind ADC ResponseAI',
    subtitle: 'AI-Powered ADC Response & Patient Stratification Model',
    blocks: [
      {
        body: 'OmicMind ADC ResponseAI™ integrates pathology, molecular, spatial, and clinical data to identify patients most likely to respond to antibody–drug conjugates and uncover biological features associated with response and resistance.',
      },
      {
        label: 'Inputs',
        body: [
          'H&E + IHC / Multiplex IHC + NGS + Clinical Data + Treatment & Outcome Data',
          'Key signals may include target-antigen expression, expression intensity, tumor heterogeneity, antigen-positive cell density, spatial distribution, tumor microenvironment, molecular alterations, and clinical characteristics.',
        ],
      },
      {
        label: 'AI Analysis',
        body: 'The platform evaluates:',
        list: [
          'Target-antigen expression and distribution',
          'Tumor heterogeneity',
          'Antigen-positive cell density',
          'Tumor–stroma architecture',
          'Spatial tumor–immune interactions',
          'Molecular and clinical features',
          'Response and resistance-associated patterns',
        ],
      },
      {
        label: 'Outputs',
        list: [
          'ADC response probability',
          'Responder / non-responder stratification',
          'Target-expression score',
          'Spatial target-distribution profile',
          'Patient risk groups',
          'Response and resistance signatures',
          'Potential multimodal ADC biomarker',
        ],
      },
      {
        label: 'Pharma Applications',
        body: 'Designed to support ADC clinical-trial enrichment, patient selection, retrospective trial analysis, target-expression assessment, biomarker discovery, response stratification, combination-therapy research, and companion-diagnostic hypothesis generation.',
      },
    ],
    question:
      '“Which patients are most likely to respond to this ADC — and what biological features drive that response?”',
    cta: 'Explore ADC ResponseAI',
    Visual: ClinicalVisual,
  },
  {
    title: 'OmicMind Drug Development Intelligence',
    subtitle: 'AI-Powered Translational & Clinical Development Intelligence',
    blocks: [
      {
        body: [
          'OmicMind Drug Development Intelligence™ connects patient biology, biomarkers, treatment response, clinical outcomes, and therapeutic mechanisms to help biopharma teams make better decisions across the drug-development lifecycle.',
          'The platform integrates H&E + IHC + spatial biology + NGS + clinical data + treatment response + longitudinal outcomes to identify the patients, biomarkers, mechanisms, and therapeutic contexts most relevant to a drug program.',
        ],
      },
      {
        label: 'AI Intelligence',
        body: 'OmicMind analyzes:',
        list: [
          'Patient and molecular subgroups',
          'Biomarker-defined responder populations',
          'Treatment response and resistance patterns',
          'Tumor and immune microenvironment',
          'Mechanism-of-action signatures',
          'Potential combination opportunities',
          'Clinical-trial enrichment opportunities',
          'Translational biomarkers and pharmacodynamic signals',
        ],
      },
      {
        label: 'Outputs',
        list: [
          'Responder population profiles',
          'Predictive biomarker signatures',
          'Patient stratification models',
          'Mechanism-of-action insights',
          'Resistance hypotheses',
          'Trial-enrichment strategies',
          'Combination-therapy hypotheses',
          'Translational biomarker candidates',
        ],
      },
      {
        label: 'Pharma Applications',
        body: 'Designed to support target validation, translational research, clinical-trial design, patient enrichment, biomarker strategy, indication selection, combination-therapy development, retrospective trial analysis, and companion-diagnostic programs.',
      },
    ],
    question:
      '“For this drug, which patients should we treat, why will they respond, and how can we develop the program more efficiently?”',
    cta: 'Explore Drug Development',
    Visual: BiomarkerVisual,
  },
  {
    title: 'OmicMind TrialAI',
    subtitle: 'AI-Powered Clinical Trial Intelligence & Patient Enrichment',
    blocks: [
      {
        body: 'OmicMind TrialAI™ uses multimodal patient intelligence to identify biomarker-defined populations, optimize trial cohorts, and connect the right patients with the right clinical studies.',
      },
      {
        label: 'Inputs',
        body: 'H&E + IHC + NGS + Spatial TME + Clinical Data + Treatment History + Outcomes + Trial Criteria',
      },
      {
        label: 'AI Analysis',
        body: 'TrialAI™ integrates patient biology with protocol requirements to identify:',
        list: [
          'Trial eligibility',
          'Biomarker-defined patient populations',
          'Potential responder subgroups',
          'Inclusion/exclusion patterns',
          'Treatment-response signatures',
          'Patient risk and stratification profiles',
          'Cohort characteristics and enrichment opportunities',
        ],
      },
      {
        label: 'Outputs',
        list: [
          'Patient–trial matching',
          'Biomarker-defined cohorts',
          'Responder enrichment scores',
          'Eligibility intelligence',
          'Patient stratification',
          'Trial cohort analytics',
          'Potential enrollment opportunities',
        ],
      },
      {
        label: 'Pharma Applications',
        body: 'TrialAI™ can support clinical-trial feasibility, cohort design, patient enrichment, biomarker strategy, retrospective trial analysis, site and population planning, and precision-medicine trial development.',
      },
    ],
    questionLabel: 'The Core Question',
    question:
      '“Which patients are most relevant for this trial — and which biological features define the optimal trial population?”',
    coda: {
      label: 'OmicMind Clinical Development Loop',
      chain:
        'Patient Biology → Biomarker → Response Prediction → Patient Enrichment → Clinical Trial → Outcomes → Model Learning',
      body: 'From patient stratification to smarter clinical development.',
    },
    cta: 'Explore TrialAI',
    Visual: DrugVisual,
  },
];

const ECOSYSTEM_FLOW = [
  'Omic Mind AI Ecosystem',
  'Clinical AI',
  'Treatment Response',
  'Biomarker Discovery',
  'Drug Discovery',
  'Clinical & Experimental Data',
];

const FOUNDATION_LAYER = [
  'HistoQuant™',
  'HistoMolecular™',
  'SpatialTME™',
  'ResponseAI™',
  'Biomarker & Drug Discovery',
];

export default function OmicMindEcosystem() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  /* `plateRef` is only ever read from — it is the box the scroll position is
     measured against. Nothing is written to it, so the slide it wraps cannot
     move. The only things written to on this section's plate are the two clip
     rectangles below, and all either one does is get taller or shorter. */
  const plateRef = useRef(null);
  const heCurtainRef = useRef(null);
  const cellCurtainRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // Header fade-up
      gsap.from(headerRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
      });

      /* ---- The two views draw down; the slide does not move ----
         Neither overlay is transformed at all — nothing here rotates, flips,
         scales or shifts. Each is uncovered instead: the rectangle that clips
         it is anchored at its top edge and grows downward, so the image
         appears from its own top edge to its own bottom, the way a blind is
         let down. Growing a height is not a transform, so the images cannot
         move or distort while it happens; they only become more or less of
         themselves. The slide behind them is not a target of anything.

         Both are on one timeline at position 0, driven by one scrub, so both
         read the same progress: whatever fraction of one is uncovered, the
         same fraction of the other is too, and they cannot drift apart.
         `scrub` ties that progress to the scroll position rather than to a
         clock and carries the smoothing — it trails the scroll by a beat and
         eases into rest — so the tweens themselves are linear rather than
         fighting it. Scrolling back up runs the same path backwards, closing
         each image from the bottom up.

         The rectangles are authored at their full height in the markup, so the
         images are whole before a line of this runs — with JavaScript slow,
         refused or reduced, or with the section already scrolled past on load,
         what shows is both images complete rather than both missing. */
      const curtain = gsap.timeline({
        scrollTrigger: {
          trigger: plateRef.current,
          start: 'top 88%',
          end: 'top 28%',
          scrub: 1,
        },
      });
      curtain
        .fromTo(heCurtainRef.current, { attr: { height: 0 } }, { attr: { height: 410 }, ease: 'none' }, 0)
        .fromTo(
          cellCurtainRef.current,
          { attr: { height: 0 } },
          { attr: { height: 310.7 }, ease: 'none' },
          0
        );

      // Staggered card entrance
      gsap.from('.eco-card', {
        y: 64,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.16,
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
      });

      // Floating illustrations
      gsap.to('.eco-float', {
        y: -8,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.45,
      });

      /* Shared particle flow — each dot carries its own path in data attrs */
      const flow = (selector, { duration, repeatDelay, step }) =>
        gsap.utils.toArray(selector).forEach((dot, i) => {
          const { fromx, fromy, tox, toy } = dot.dataset;
          gsap
            .timeline({ repeat: -1, repeatDelay, delay: i * step })
            .set(dot, { attr: { cx: fromx, cy: fromy }, opacity: 0 })
            .to(dot, { opacity: 1, duration: 0.26 }, 0)
            .to(dot, { attr: { cx: tox, cy: toy }, duration, ease: 'none' }, 0)
            .to(dot, { opacity: 0, duration: 0.28 }, duration - 0.28);
        });

      flow('.eco1-particle', { duration: 1.1, repeatDelay: 0.8, step: 0.5 });
      flow('.eco3-particle', { duration: 1.2, repeatDelay: 0.7, step: 0.42 });

      // Card 1 — readout bars filling, detection box sweeping the slide
      gsap.from('.eco1-bar', {
        scaleX: 0,
        transformOrigin: `${BAR_TRACK}px center`,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: gridRef.current, start: 'top 78%' },
      });
      gsap
        .timeline({ repeat: -1, repeatDelay: 1.1 })
        .fromTo(
          '.eco1-scan',
          { attr: { x: 34, y: 52 }, opacity: 0 },
          { opacity: 1, duration: 0.3 }
        )
        .to('.eco1-scan', { attr: { x: 74, y: 74 }, duration: 1.6, ease: 'sine.inOut' }, 0.1)
        .to('.eco1-scan', { opacity: 0, duration: 0.35 }, 1.5);

      // Card 2 — network breathing, candidate ring pulsing, column scan
      gsap.to('.eco2-edge', {
        opacity: 0.85,
        duration: 1.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.11, from: 'random' },
      });
      gsap.fromTo(
        '.eco2-hit',
        { attr: { r: 10.2 }, opacity: 0.7 },
        { attr: { r: 17 }, opacity: 0, duration: 2.2, ease: 'sine.out', repeat: -1 }
      );
      gsap.to('.eco2-scan', {
        attr: { x: HM_X + (HM_COLS - 1) * (HM_CELL_W + HM_GAP) },
        duration: 3.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
      gsap.to('.eco2-cell', {
        opacity: (i, t) => Math.min(0.92, Number(t.getAttribute('opacity')) + 0.24),
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.06, from: 'random' },
      });

      // Card 3 — rotating molecule, prediction curve drawing in
      gsap.to('.eco3-molecule', {
        rotation: 360,
        transformOrigin: `${PIPE[1].x}px ${PIPE_Y}px`,
        duration: 18,
        ease: 'none',
        repeat: -1,
      });

      gsap.utils.toArray('.eco3-curve').forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, { attr: { 'stroke-dasharray': len, 'stroke-dashoffset': len } });
        gsap
          .timeline({
            repeat: -1,
            repeatDelay: 1.6,
            scrollTrigger: { trigger: gridRef.current, start: 'top 78%' },
          })
          .to(path, { attr: { 'stroke-dashoffset': 0 }, duration: 1.5, ease: 'power2.out' })
          .to('.eco3-area', { opacity: 1, duration: 0.6 }, 0.5)
          .to('.eco3-tip', { opacity: 1, duration: 0.3 }, 1.3)
          .to(['.eco3-area', '.eco3-tip'], { opacity: 0, duration: 0.4 }, 2.6)
          .set(path, { attr: { 'stroke-dashoffset': len } }, 3.1);
      });

      // Drifting background particles
      gsap.utils.toArray('.eco-dust').forEach((dot, i) => {
        gsap.to(dot, {
          y: i % 2 === 0 ? -24 : 20,
          x: i % 3 === 0 ? 14 : -12,
          duration: 7 + (i % 4) * 1.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.4,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#F3EEE7] pb-24 pt-20 lg:pb-32 lg:pt-24"
      style={{ backgroundImage: 'linear-gradient(135deg, #F7F3ED 0%, #EDE5DA 100%)' }}
    >
      {/* Hairline divider separating this chapter from the section above */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(167,139,250,0.40) 30%, rgba(244,114,182,0.36) 70%, rgba(255,255,255,0) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Soft purple / pink gradient lighting */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(56% 42% at 22% 18%, rgba(124,58,237,0.07) 0%, rgba(124,58,237,0) 70%), radial-gradient(52% 40% at 80% 78%, rgba(124,58,237,0.08) 0%, rgba(124,58,237,0) 72%), radial-gradient(46% 34% at 52% 50%, rgba(236,72,153,0.05) 0%, rgba(236,72,153,0) 76%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle drifting AI particles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[
          { left: '9%', top: '22%', s: 4 },
          { left: '88%', top: '18%', s: 3 },
          { left: '18%', top: '78%', s: 3 },
          { left: '80%', top: '84%', s: 4 },
          { left: '52%', top: '9%', s: 3 },
        ].map((d, i) => (
          <span
            key={i}
            className="eco-dust absolute rounded-full"
            style={{
              left: d.left,
              top: d.top,
              width: d.s,
              height: d.s,
              backgroundImage: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              opacity: 0.26,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* ---------------- Header and specimen plate ----------------
            Two columns from `lg`, where each half still clears ~580px: the
            chapter's copy and its flow strip on the left, the reference
            specimen on the right, centred against each other. Below `lg` the
            grid collapses and the plate falls beneath the copy, in that
            order. The product cards below keep the full width. */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* ---------------- Header ---------------- */}
          <div ref={headerRef} className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-4xl font-semibold leading-[1.12] tracking-[-0.01em] text-[#17202A] sm:text-5xl lg:text-[3.5rem]">
              <span className="block">OmicMind</span>
              <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] via-[#A21CAF] to-[#BE185D]">
                AI Ecosystem
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl font-sans text-base leading-relaxed text-[#374151] sm:text-lg">
              From clinical intelligence to biomarker discovery and therapeutic innovation, OmicMind
              AI transforms biological data into actionable insights across the healthcare and life
              sciences ecosystem.
            </p>

            {/* Ecosystem flow: Core → Clinical → Biomarker → Drug */}
            <div className="mt-9 flex flex-col items-center justify-center gap-y-2">
              {ECOSYSTEM_FLOW.map((step, i) => (
                <React.Fragment key={step}>
                  <span
                    className={`rounded-full border px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      i === 0
                        ? 'border-[#A855F7]/40 bg-[#A855F7]/10 text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] to-[#BE185D]'
                        : 'border-[#17202A]/15 bg-white/60 text-[#4B5563]'
                    }`}
                  >
                    {step}
                  </span>
                  {i < ECOSYSTEM_FLOW.length - 1 && (
                    <span
                      className="shrink-0 font-sans text-sm leading-none text-[rgba(124,58,237,0.45)]"
                      aria-hidden="true"
                    >
                      ↓
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ---------------- Specimen plate ----------------
              The same 1px-padding gradient shell the rest of the site frames
              its imagery with, so the brand ramp sits on the plate's edge and
              nowhere on the slide itself — no wash, no tint, nothing over the
              image. It is laid in at `h-auto w-full`, so it holds its own
              aspect at every width and is never cropped or stretched. The
              plate carries no transform and nothing drives one: it is upright
              and still at every scroll position. The ref on it is read-only —
              it is the box the overlays' scroll position is measured against,
              nothing more. */}
          <div className="mx-auto w-full max-w-2xl lg:max-w-none">
            <div
              ref={plateRef}
              className="relative rounded-[24px] p-px shadow-[0_18px_44px_-26px_rgba(76,29,149,0.5)]"
              style={{
                backgroundImage:
                  'linear-gradient(150deg, rgba(255,255,255,0.92) 0%, rgba(124,58,237,0.50) 34%, rgba(236,72,153,0.30) 64%, rgba(255,255,255,0.55) 100%)',
              }}
            >
              <div className="relative overflow-hidden rounded-[23px] bg-[#0B1424]">
                <img
                  src={normalBreastOne}
                  alt="Whole-slide H&E section of breast tissue, with a 5 mm scale bar"
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />

                {/* ---------------- Magnified views ----------------
                    The same arrangement the Core chapter's plate carries, and
                    the same geometry: both slides are 1280 x 559, so the
                    coordinates transfer across unchanged. The H&E
                    classification sits top-right, the carcinoma cell view
                    bottom-left, and the specimen reads between them.

                    Each is drawn as a plain rectangle at its own intrinsic
                    ratio, with no mask, no crop and no rounded corner anywhere
                    on either — every pixel of both files is on screen, in its
                    own shape. Their boxes are the files' own proportions to
                    within a fraction of a percent, and `preserveAspectRatio`
                    is left at its default `meet`, so neither can be stretched
                    even if a number here were rounded: an image fits inside
                    its box rather than filling it.

                    Drawn as one SVG at `inset-0` on a `viewBox` of the
                    slide's own pixel dimensions. The image is `h-auto
                    w-full`, so its box always carries its intrinsic ratio and
                    the two coincide exactly: every coordinate below is a
                    position on the slide itself and stays on it at every
                    width, with no breakpoints and nothing taking layout space.

                    Each clip rectangle is wider and taller than the image it
                    uncovers, by the reach of that image's shadow on every
                    side. A clip is applied after a filter, not before it, so a
                    rectangle cut to the image's own bounds would have taken
                    the shadow off with it; the margin is what lets the shadow
                    be uncovered along with the image it belongs to. Each is
                    authored here at full height — the state with no JavaScript
                    is both images whole.

                    The ids carry this section's own prefix. The Core chapter's
                    plate defines a clip and a filter of its own on the same
                    page, and two definitions sharing one id would leave both
                    plates reading whichever the document happened to define
                    first. */}
                <svg
                  viewBox="0 0 1280 559"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <clipPath id="ecoCurtainCell">
                      <rect ref={cellCurtainRef} x="65" y="235" width="310" height="310.7" />
                    </clipPath>
                    <clipPath id="ecoCurtainHE">
                      <rect ref={heCurtainRef} x="815" y="-10" width="325.2" height="410" />
                    </clipPath>

                    <filter id="ecoSlideShadow" x="-25%" y="-25%" width="150%" height="150%">
                      <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#0F172A" floodOpacity="0.32" />
                    </filter>
                  </defs>

                  {/* Bottom-left — the carcinoma cell view, 557 x 559 */}
                  <image
                    href={cellReadout}
                    x="120"
                    y="290"
                    width="200"
                    height="200.7"
                    filter="url(#ecoSlideShadow)"
                    clipPath="url(#ecoCurtainCell)"
                  />

                  {/* Top-right — the classified H&E slide, 454 x 633 */}
                  <image
                    href={classifiedField}
                    x="870"
                    y="45"
                    width="215.2"
                    height="300"
                    filter="url(#ecoSlideShadow)"
                    clipPath="url(#ecoCurtainHE)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Product cards ---------------- */}
        <div
          ref={gridRef}
          className="mt-16 grid grid-cols-1 gap-7 md:mt-20 md:grid-cols-2 lg:grid-cols-6 lg:gap-8"
        >
          {products.map(({ eyebrow, title, subtitle, blocks, question, questionLabel = 'Core Question', coda, trademark = true, cta, Visual }, i) => (
            <article
              key={title}
              className={`eco-card group relative lg:col-span-2 ${
                /* A lone last card spans the 2-up row. On the 3-up grid (six
                   half-columns, two per card) an unfilled last row is centred
                   rather than hugging the left edge. */
                i === products.length - 1 && products.length % 2 === 1 ? 'md:col-span-2' : ''
              } ${
                products.length % 3 === 1 && i === products.length - 1
                  ? 'lg:col-start-3'
                  : products.length % 3 === 2 && i === products.length - 2
                    ? 'lg:col-start-2'
                    : ''
              }`}
            >
              {/* Purple→pink gradient border, revealed on hover */}
              <div
                className="pointer-events-none absolute -inset-[1.5px] rounded-[25.5px] opacity-0 transition-opacity duration-[380ms] ease-out group-hover:opacity-100"
                style={{ backgroundImage: 'linear-gradient(135deg, #7C3AED, #D946EF, #EC4899)' }}
                aria-hidden="true"
              />
              {/* Outer glow */}
              <div
                className="pointer-events-none absolute -inset-[6px] rounded-[30px] opacity-0 blur-[14px] transition-opacity duration-[380ms] ease-out group-hover:opacity-100"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, rgba(124,58,237,0.34), rgba(236,72,153,0.34))',
                }}
                aria-hidden="true"
              />

              <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#131C2E] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-[380ms] ease-out group-hover:-translate-y-2 group-hover:border-transparent group-hover:bg-[#4A1115] group-hover:shadow-[0_26px_54px_-18px_rgba(124,58,237,0.3)] sm:p-7">
                {/* Light sweep on hover */}
                <div
                  className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 transition-transform duration-[900ms] ease-out group-hover:translate-x-[340%]"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(168,85,247,0.10) 50%, rgba(255,255,255,0) 100%)',
                  }}
                  aria-hidden="true"
                />

                {/* Illustration — outer node floats (GSAP), inner scales (CSS hover) */}
                <div className="eco-float">
                  <div
                    className="rounded-[18px] border border-white/[0.07] p-3 transition-transform duration-[380ms] ease-out group-hover:scale-[1.03]"
                    style={{
                      backgroundImage:
                        'linear-gradient(160deg, rgba(124,58,237,0.16) 0%, rgba(236,72,153,0.10) 100%)',
                    }}
                  >
                    <Visual />
                  </div>
                </div>

                {/* ---- Product name and model line ----
                    The name keeps the section's serif display face; the model
                    line beneath it stays sans and quiet, so the two read as a
                    title and its subtitle rather than as two headings. */}
                {eyebrow && (
                  <p className="relative mt-7 font-sans text-[10.5px] font-semibold uppercase leading-none tracking-[0.14em] text-[#C4B5FD]">
                    {eyebrow}
                  </p>
                )}
                <h3 className={`relative ${eyebrow ? 'mt-3' : 'mt-7'} font-serif text-[1.5rem] font-semibold leading-tight tracking-[-0.01em] text-[#F8FAFC]`}>
                  {title}
                  {trademark && (
                    <span className="align-super font-sans text-[0.6rem] font-medium text-slate-500">
                      &trade;
                    </span>
                  )}
                </h3>

                <p className="relative mt-2.5 font-sans text-[13.5px] font-medium leading-snug text-slate-400 [text-wrap:pretty]">
                  {subtitle}
                </p>

                {/* ---- Labelled content blocks ----
                    A definition list: every label is the same small-caps line
                    in the brand's single accent, every body the same grey
                    prose, so the eye can find Purpose, Inputs, Outputs and
                    Pharma Use in the same place on all three cards. Nothing
                    is clipped or collapsed — the card grows to whatever its
                    content needs and the row's cards match on the tallest.
                    'break-words' is what keeps long unbroken marker strings
                    (EGFR/KRAS/STK11/KEAP1/TP53) inside the card on a narrow
                    phone instead of pushing the page sideways. */}
                <dl className="relative mt-6 space-y-4 border-t border-white/10 pt-5 [text-wrap:pretty]">
                  {blocks.map(({ label, body: text, items, list }, b) => (
                    <div key={label ?? b}>
                      {label && (
                        <dt className="font-sans text-[10.5px] font-semibold uppercase leading-none tracking-[0.14em] text-[#C4B5FD]">
                          {label}
                        </dt>
                      )}
                      {/* 'body' may be a single paragraph or several. */}
                      {text &&
                        [].concat(text).map((para, p) => (
                          <dd
                            key={p}
                            className={`${label || p > 0 ? 'mt-2' : ''} break-words font-sans text-[13.5px] leading-relaxed text-slate-300`}
                          >
                            {para}
                          </dd>
                        ))}
                      {list && (
                        <dd>
                          <ul className="mt-2 list-disc space-y-1 pl-4 marker:text-[#C4B5FD]">
                            {list.map((entry) => (
                              <li
                                key={entry}
                                className="break-words font-sans text-[13.5px] leading-relaxed text-slate-300"
                              >
                                {entry}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      )}
                      {items && (
                        <dd className="mt-2 space-y-1.5">
                          {items.map(({ term, text: value }) => (
                            <p
                              key={term}
                              className="break-words font-sans text-[13.5px] leading-relaxed text-slate-300"
                            >
                              <span className="font-semibold text-slate-100">{term}:</span>{' '}
                              {value}
                            </p>
                          ))}
                        </dd>
                      )}
                    </div>
                  ))}
                </dl>

                {/* ---- Core question ----
                    The line each product exists to answer, framed at the foot
                    of the card. 'mt-auto' holds it against the bottom, so the
                    three frames line up across the row however long the
                    blocks above them run. The tint is the section's own
                    purple/pink ramp at a fraction of its strength — enough to
                    lift the line off the card, not enough to become a
                    second colour. */}
                <div className="relative mt-auto pt-7">
                  <div
                    className="rounded-[16px] border border-[#A855F7]/25 px-4 py-3.5"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, rgba(124,58,237,0.16) 0%, rgba(236,72,153,0.10) 100%)',
                    }}
                  >
                    <p className="font-sans text-[10.5px] font-semibold uppercase leading-none tracking-[0.14em] text-[#C4B5FD]">
                      {questionLabel}
                    </p>
                    <p className="mt-2.5 font-serif text-[14.5px] italic leading-relaxed text-slate-100 [text-wrap:pretty]">
                      {question}
                    </p>
                  </div>
                </div>

                {/* ---- Coda ----
                    Optional closing note set under the core question: a label,
                    a chain line and a short line of prose. */}
                {coda && (
                  <div className="relative pt-6 [text-wrap:pretty]">
                    <p className="font-sans text-[10.5px] font-semibold uppercase leading-none tracking-[0.14em] text-[#C4B5FD]">
                      {coda.label}
                    </p>
                    <p className="mt-2 break-words font-sans text-[13.5px] font-semibold leading-relaxed text-slate-100">
                      {coda.chain}
                    </p>
                    <p className="mt-2 break-words font-sans text-[13.5px] leading-relaxed text-slate-300">
                      {coda.body}
                    </p>
                  </div>
                )}

                {/* ---- Call to action ----
                    Sits directly under the core question, which is the
                    element now carrying `mt-auto` — so the pair travels to
                    the foot of the card together whatever length the blocks
                    above them run to. The pill is unchanged: the same
                    gradient language the Hero's primary action uses, sized
                    for a card rather than a page. */}
                {cta && (
                  <div className="relative pt-6">
                    <button
                      type="button"
                      className="group/cta relative inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-sans text-[14px] font-semibold tracking-[0.01em] text-white"
                    >
                      <span
                        className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-[14px] transition-opacity duration-[380ms] ease-out group-hover:opacity-70"
                        style={{ backgroundImage: 'linear-gradient(90deg, #7C3AED, #EC4899)' }}
                        aria-hidden="true"
                      />
                      <span
                        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] ring-1 ring-inset ring-white/25"
                        aria-hidden="true"
                      />
                      <span className="relative">{cta}</span>
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="relative h-4 w-4 transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 10h11M10.5 5.5L15 10l-4.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* ---------------- Foundation layer ----------------
            The chain the three models sit in, set after the cards in the
            same pill-and-arrow vocabulary as the header's flow strip. The
            row wraps on narrow screens rather than scrolling. */}
        <div className="mx-auto mt-16 max-w-5xl text-center md:mt-20">
          <p className="font-sans text-[10.5px] font-semibold uppercase leading-none tracking-[0.14em] text-[#4B5563]">
            The Foundation Layer
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2.5">
            {FOUNDATION_LAYER.map((step, i) => (
              <React.Fragment key={step}>
                <span className="rounded-full border border-[#17202A]/15 bg-white/60 px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#263238]">
                  {step}
                </span>
                {i < FOUNDATION_LAYER.length - 1 && (
                  <span
                    className="shrink-0 font-sans text-sm leading-none text-[rgba(124,58,237,0.45)]"
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="mt-6 font-serif text-lg italic leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] via-[#A21CAF] to-[#BE185D] sm:text-xl">
            From tissue morphology to measurable biology — at scale.
          </p>
        </div>
      </div>
    </section>
  );
}
