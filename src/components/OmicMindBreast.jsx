import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const icons = {
  // Pathology heatmap with biomarker score readout
  biomarker: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M3.5 15h17" />
      <path d="M9 3.5v11.5M15 3.5v11.5M3.5 9.2h17" opacity="0.45" />
      <rect x="9" y="9.2" width="6" height="5.8" fill="currentColor" stroke="none" opacity="0.85" />
      <rect x="15" y="3.5" width="5.5" height="5.7" fill="currentColor" stroke="none" opacity="0.35" />
      <path d="M6 17.7h11" />
      <path d="M6 19.6h6.5" opacity="0.6" />
    </svg>
  ),
  // Tissue region with immune-cell distribution
  immune: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
      <path d="M12 2.6l8 4.6v9.6L12 21.4l-8-4.6V7.2z" />
      <path d="M8.2 12.8c1.7-2.5 5.6-3.1 7.8-1.1" opacity="0.55" />
      <circle cx="9.2" cy="9.6" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="12.7" cy="8.3" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15.1" cy="11.5" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="9.8" cy="14.4" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="13.3" cy="15.3" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  ),
  // Neural network linking pathology slide to molecular signature
  prediction: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
      <rect x="2.2" y="7.4" width="4.8" height="9.2" rx="1.3" />
      <circle cx="4.6" cy="12" r="1.1" />
      <circle cx="12" cy="6.4" r="1.7" />
      <circle cx="12" cy="17.6" r="1.7" />
      <circle cx="18.6" cy="12" r="1.9" />
      <path d="M7.3 10.5l3.2-2.7M7.3 13.5l3.2 2.7M13.5 7.5l3.6 3.1M13.5 16.5l3.6-3.1" />
    </svg>
  ),
  // Clinical report dashboard with analytics
  reporting: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
      <rect x="2.5" y="3.5" width="19" height="17" rx="2.5" />
      <path d="M2.5 8h19" />
      <circle cx="5.5" cy="5.8" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="7.7" cy="5.8" r="0.55" fill="currentColor" stroke="none" />
      <path d="M6 12h5.2M6 15h5.2M6 17.8h3.2" />
      <path d="M14.8 17.8v-3.6M17.4 17.8v-6.2M20 17.8v-2.4" />
    </svg>
  ),
};

/* ------------------------------------------------------------------
   Illustrations. Fixed 320 x 180 viewBox rendered at w-full, so every
   coordinate scales with the card and no breakpoint needs its own
   geometry.
------------------------------------------------------------------ */
const VB_W = 320;
const VB_H = 180;

const CAPTION = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 8.5,
  fontWeight: 600,
  letterSpacing: '0.07em',
};

function Defs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7C3AED" />
        <stop offset="55%" stopColor="#D946EF" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#EC4899" stopOpacity="0.09" />
      </linearGradient>
    </defs>
  );
}

/* === 1. Quantitative biomarker analysis — IHC + scoring readout === */
const SCORES = [
  { label: 'ER', y: 44, w: 132, value: '92%' },
  { label: 'PR', y: 74, w: 104, value: '71%' },
  { label: 'HER2', y: 104, w: 58, value: '1+' },
  { label: 'Ki-67', y: 134, w: 88, value: '58%' },
];
const SCORE_X = 158;
const SCORE_W = 150;

function BiomarkerVisual() {
  const id = 'brst-v1';

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" aria-hidden="true">
      <Defs id={id} />

      <text x="12" y="20" fill="#9CA3AF" {...CAPTION}>
        IHC ANALYSIS
      </text>
      <text x={SCORE_X + SCORE_W} y="20" fill="#9CA3AF" textAnchor="end" {...CAPTION}>
        AI SCORING
      </text>

      {/* Stained tissue patch */}
      <rect
        x="12"
        y="28"
        width="130"
        height="126"
        rx="10"
        fill={`url(#${id}-fill)`}
        stroke="rgba(124,58,237,0.2)"
        strokeWidth="1.1"
      />
      {[
        [42, 56, 8, 0.7],
        [76, 48, 6, 0.42],
        [108, 62, 7, 0.6],
        [56, 88, 9, 0.8],
        [96, 96, 6.5, 0.5],
        [36, 118, 6, 0.34],
        [72, 128, 7.5, 0.66],
        [112, 120, 5.5, 0.44],
      ].map(([cx, cy, r, o], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-ring)`} opacity={o} />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(124,58,237,0.35)" strokeWidth="1" />
        </g>
      ))}
      {/* AI nucleus detections */}
      {[
        [42, 56, 8],
        [56, 88, 9],
        [72, 128, 7.5],
      ].map(([cx, cy, r], i) => (
        <rect
          key={i}
          className="brst1-detect"
          x={cx - r - 3}
          y={cy - r - 3}
          width={(r + 3) * 2}
          height={(r + 3) * 2}
          rx="3"
          fill="none"
          stroke="#D946EF"
          strokeWidth="1.2"
          strokeDasharray="3 2.5"
          opacity="0.5"
        />
      ))}

      {/* Quantitative scores */}
      {SCORES.map((s) => (
        <g key={s.label}>
          <text x={SCORE_X} y={s.y} fill="#6B7280" {...CAPTION}>
            {s.label}
          </text>
          <text x={SCORE_X + SCORE_W} y={s.y} fill="#7C3AED" textAnchor="end" {...CAPTION}>
            {s.value}
          </text>
          <rect
            x={SCORE_X}
            y={s.y + 6}
            width={SCORE_W}
            height="6"
            rx="3"
            fill="rgba(124,58,237,0.1)"
          />
          <rect
            className="brst1-bar"
            x={SCORE_X}
            y={s.y + 6}
            width={s.w}
            height="6"
            rx="3"
            fill={`url(#${id}-bar)`}
          />
        </g>
      ))}
    </svg>
  );
}

/* === 2. Spatial immune architecture — tissue map + immune populations === */
const IMMUNE_MARKERS = [
  { label: 'CD3', color: '#7C3AED', dot: 34 },
  { label: 'CD8', color: '#A855F7', dot: 108 },
  { label: 'CD68', color: '#D946EF', dot: 182 },
  { label: 'FOXP3', color: '#EC4899', dot: 256 },
];
const IMMUNE_CELLS = [
  [58, 44, '#7C3AED'],
  [92, 36, '#A855F7'],
  [128, 52, '#7C3AED'],
  [166, 40, '#D946EF'],
  [212, 50, '#7C3AED'],
  [250, 42, '#A855F7'],
  [46, 78, '#D946EF'],
  [84, 92, '#EC4899'],
  [122, 84, '#A855F7'],
  [158, 100, '#7C3AED'],
  [198, 88, '#EC4899'],
  [240, 96, '#D946EF'],
  [64, 118, '#A855F7'],
  [104, 124, '#7C3AED'],
  [148, 116, '#D946EF'],
  [190, 126, '#A855F7'],
  [232, 118, '#7C3AED'],
  [272, 78, '#EC4899'],
];
const TUMOUR = 'M104 58 C 132 40, 186 44, 206 68 C 224 90, 208 118, 172 122 C 134 126, 96 108, 96 86 Z';

function SpatialVisual() {
  const id = 'brst-v2';

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" aria-hidden="true">
      <Defs id={id} />

      {/* Tissue field */}
      <rect
        x="12"
        y="14"
        width="296"
        height="124"
        rx="12"
        fill="rgba(124,58,237,0.03)"
        stroke="rgba(124,58,237,0.16)"
        strokeWidth="1.1"
      />

      {/* Tumour compartment */}
      <path
        d={TUMOUR}
        fill={`url(#${id}-fill)`}
        stroke="rgba(124,58,237,0.4)"
        strokeWidth="1.3"
        strokeDasharray="5 3"
      />
      <text x="151" y="90" fill="#9CA3AF" textAnchor="middle" {...CAPTION}>
        TUMOUR
      </text>

      {/* Neighbourhood radius probing the invasive margin */}
      <circle
        className="brst2-radius"
        cx="206"
        cy="68"
        r="14"
        fill="none"
        stroke="rgba(236,72,153,0.5)"
        strokeWidth="1.3"
      />

      {/* Immune populations */}
      {IMMUNE_CELLS.map(([cx, cy, color], i) => (
        <circle
          key={i}
          className="brst2-cell"
          cx={cx}
          cy={cy}
          r="3.4"
          fill={color}
          opacity="0.75"
        />
      ))}

      {/* Legend */}
      {IMMUNE_MARKERS.map((m) => (
        <g key={m.label}>
          <circle cx={m.dot} cy="158" r="3.4" fill={m.color} />
          <text x={m.dot + 9} y="161" fill="#6B7280" {...CAPTION}>
            {m.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* === 3. Molecular prediction — morphology to genomics === */
const NET_L1 = [46, 74, 102, 130];
const NET_L2 = [46, 74, 102, 130];
const L1_X = 116;
const L2_X = 164;
const OUT = [
  { label: 'HRD', y: 36 },
  { label: 'MSI', y: 64 },
  { label: 'TMB', y: 92 },
  { label: 'TP53', y: 120 },
];
const OUT_X = 208;
const OUT_W = 100;

function MolecularVisual() {
  const id = 'brst-v3';

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" aria-hidden="true">
      <Defs id={id} />

      <text x="10" y="20" fill="#9CA3AF" {...CAPTION}>
        MORPHOLOGY
      </text>
      <text x={OUT_X + OUT_W} y="20" fill="#9CA3AF" textAnchor="end" {...CAPTION}>
        PREDICTED
      </text>

      {/* Source tissue */}
      <rect
        x="10"
        y="54"
        width="66"
        height="66"
        rx="9"
        fill={`url(#${id}-fill)`}
        stroke="rgba(124,58,237,0.22)"
        strokeWidth="1.1"
      />
      {[
        [30, 74, 6],
        [54, 68, 4.6],
        [40, 98, 5.4],
        [60, 104, 4],
      ].map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(124,58,237,0.5)" strokeWidth="1.2" />
          <circle cx={cx} cy={cy} r={r * 0.34} fill="rgba(124,58,237,0.5)" />
        </g>
      ))}

      {/* Encoder edges */}
      {NET_L1.map((y1) => (
        <line
          key={`s${y1}`}
          className="brst3-edge"
          x1="78"
          y1="87"
          x2={L1_X - 6}
          y2={y1}
          stroke="rgba(124,58,237,0.4)"
          strokeWidth="1"
          opacity="0.4"
        />
      ))}
      {NET_L1.map((y1) =>
        NET_L2.map((y2) => (
          <line
            key={`${y1}-${y2}`}
            className="brst3-edge"
            x1={L1_X + 6}
            y1={y1}
            x2={L2_X - 6}
            y2={y2}
            stroke="rgba(168,85,247,0.4)"
            strokeWidth="0.9"
            opacity="0.3"
          />
        ))
      )}
      {NET_L2.map((y2, i) => (
        <line
          key={`o${y2}`}
          className="brst3-edge"
          x1={L2_X + 6}
          y1={y2}
          x2={OUT_X - 2}
          y2={OUT[i].y + 5}
          stroke="rgba(217,70,239,0.45)"
          strokeWidth="1"
          opacity="0.45"
        />
      ))}

      {/* Hidden layers */}
      {[
        [L1_X, NET_L1],
        [L2_X, NET_L2],
      ].map(([x, ys]) =>
        ys.map((y) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="5"
            fill="#ffffff"
            stroke="rgba(124,58,237,0.55)"
            strokeWidth="1.4"
          />
        ))
      )}

      {/* Signal travelling through the network */}
      {NET_L1.map((y, i) => (
        <circle
          key={`p${y}`}
          className="brst3-particle"
          r="2.4"
          fill="#ffffff"
          stroke="#D946EF"
          strokeWidth="1.5"
          cx="78"
          cy="87"
          opacity="0"
          data-fromx="78"
          data-fromy="87"
          data-tox={OUT_X - 2}
          data-toy={OUT[i].y + 5}
        />
      ))}

      {/* Predicted molecular outputs */}
      {OUT.map((o) => (
        <g key={o.label} className="brst3-out">
          <rect
            x={OUT_X}
            y={o.y}
            width={OUT_W}
            height="22"
            rx="11"
            fill="#ffffff"
            stroke="rgba(217,70,239,0.3)"
            strokeWidth="1.1"
          />
          <circle cx={OUT_X + 14} cy={o.y + 11} r="3.4" fill={`url(#${id}-ring)`} />
          <text x={OUT_X + 24} y={o.y + 14} fill="#4B5563" {...CAPTION}>
            {o.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* === 4. Unified clinical reporting — integrated report dashboard === */
const REPORT_BARS = [
  { x: 170, h: 26 },
  { x: 194, h: 40 },
  { x: 218, h: 32 },
  { x: 242, h: 48 },
  { x: 266, h: 38 },
];
const BAR_BASE = 108;

function ReportVisual() {
  const id = 'brst-v4';

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" aria-hidden="true">
      <Defs id={id} />

      {/* Report frame */}
      <rect
        x="14"
        y="12"
        width="292"
        height="156"
        rx="12"
        fill="#ffffff"
        stroke="rgba(124,58,237,0.18)"
        strokeWidth="1.2"
      />
      <path d="M14 40h292" stroke="rgba(124,58,237,0.12)" strokeWidth="1" />
      <rect x="28" y="21" width="86" height="9" rx="4.5" fill="rgba(124,58,237,0.14)" />
      <rect x="122" y="22" width="42" height="7" rx="3.5" fill="rgba(124,58,237,0.08)" />
      <rect x="248" y="19" width="44" height="14" rx="7" fill={`url(#${id}-ring)`} />
      <text
        x="270"
        y="28.5"
        fill="#ffffff"
        textAnchor="middle"
        {...CAPTION}
        fontSize="7.5"
      >
        AI
      </text>

      {/* Slide thumbnail */}
      <rect
        x="28"
        y="52"
        width="112"
        height="56"
        rx="8"
        fill={`url(#${id}-fill)`}
        stroke="rgba(124,58,237,0.2)"
        strokeWidth="1.1"
      />
      {[
        [52, 70, 6],
        [80, 64, 4.4],
        [66, 92, 5.2],
        [106, 86, 4.8],
        [118, 68, 3.6],
      ].map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(124,58,237,0.45)"
          strokeWidth="1.2"
        />
      ))}

      {/* Morphology summary lines */}
      {[
        [120, 100],
        [128, 84],
        [136, 62],
      ].map(([y, w]) => (
        <rect key={y} x="28" y={y} width={w} height="5" rx="2.5" fill="rgba(124,58,237,0.1)" />
      ))}

      {/* Spatial / biomarker metrics chart */}
      <line
        x1="162"
        y1={BAR_BASE}
        x2="292"
        y2={BAR_BASE}
        stroke="rgba(124,58,237,0.16)"
        strokeWidth="1"
      />
      {REPORT_BARS.map((b) => (
        <rect
          key={b.x}
          className="brst4-bar"
          x={b.x}
          y={BAR_BASE - b.h}
          width="14"
          height={b.h}
          rx="3"
          fill={`url(#${id}-bar)`}
          opacity="0.85"
        />
      ))}
      <text x="162" y="56" fill="#9CA3AF" {...CAPTION}>
        METRICS
      </text>

      {/* Molecular prediction chips */}
      {[
        { x: 162, w: 60, label: 'HRD' },
        { x: 228, w: 64, label: 'MSI-L' },
      ].map((c) => (
        <g key={c.label}>
          <rect
            x={c.x}
            y="118"
            width={c.w}
            height="20"
            rx="10"
            fill="#ffffff"
            stroke="rgba(217,70,239,0.3)"
            strokeWidth="1.1"
          />
          <circle cx={c.x + 12} cy="128" r="3" fill={`url(#${id}-ring)`} />
          <text x={c.x + 21} y="131" fill="#4B5563" {...CAPTION} fontSize="7.5">
            {c.label}
          </text>
        </g>
      ))}

      {/* Signed summary footer */}
      <path d="M28 150h264" stroke="rgba(124,58,237,0.1)" strokeWidth="1" />
      <rect x="28" y="156" width="120" height="5" rx="2.5" fill="rgba(124,58,237,0.1)" />
      <rect
        className="brst4-stamp"
        x="238"
        y="153"
        width="54"
        height="11"
        rx="5.5"
        fill="rgba(124,58,237,0.1)"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
const features = [
  {
    number: '01',
    title: 'Quantitative Biomarker Analysis',
    icon: icons.biomarker,
    accent: '#7C3AED',
    tint: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(168,85,247,0.08))',
    Visual: BiomarkerVisual,
    lead: 'Automated scoring of clinically relevant biomarkers including:',
    chips: ['ER', 'PR', 'HER2', 'Ki-67'],
    closing:
      'The platform applies standardized AI algorithms to reduce inter-observer variability while producing reproducible quantitative measurements suitable for clinical and research workflows.',
  },
  {
    number: '02',
    title: 'Spatial Immune Architecture',
    icon: icons.immune,
    accent: '#8B5CF6',
    tint: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(217,70,239,0.08))',
    Visual: SpatialVisual,
    lead: 'Cancer biology depends not only on which cells are present, but where they are located.',
    body: 'OmicMind Breast™ characterizes the spatial relationships between tumor cells, stromal compartments, and immune populations including:',
    chips: ['CD3', 'CD8', 'CD68', 'FOXP3'],
    closing:
      'These spatial patterns provide additional biological context that may support prognostic assessment and biomarker discovery.',
  },
  {
    number: '03',
    title: 'Molecular Prediction',
    icon: icons.prediction,
    accent: '#D946EF',
    tint: 'linear-gradient(135deg, rgba(217,70,239,0.12), rgba(236,72,153,0.08))',
    Visual: MolecularVisual,
    lead: 'Leveraging multimodal AI, the platform predicts molecular characteristics directly from pathology images by learning associations between tissue morphology and genomic biology.',
    body: 'Potential outputs include:',
    chips: [
      'HRD signatures',
      'MSI status',
      'TMB estimation',
      'PIK3CA alterations',
      'TP53 mutations',
      'BRCA1/2 alterations',
      'ESR1-associated patterns',
    ],
    closing:
      'These predictions are designed to complement—not replace—established molecular testing workflows.',
  },
  {
    number: '04',
    title: 'Unified Clinical Reporting',
    icon: icons.reporting,
    accent: '#EC4899',
    tint: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(244,114,182,0.08))',
    Visual: ReportVisual,
    lead: 'All analytical outputs are consolidated into an integrated pathology report that combines:',
    chips: [
      'Tissue morphology',
      'Biomarker scoring',
      'Spatial metrics',
      'Molecular predictions',
      'AI-generated visualizations',
    ],
    closing:
      'The result is a comprehensive summary designed to support clinical decision-making while fitting naturally into existing digital pathology workflows.',
  },
];

function BreastFeatureCard({ feature }) {
  const { Visual } = feature;

  return (
    <li className="breast-item relative h-full">
      <article className="group relative h-full rounded-[24px]">
        {/* Purple/pink gradient glow revealed on hover */}
        <div
          className="pointer-events-none absolute -inset-[3px] rounded-[26px] opacity-0 blur-[10px] transition-opacity duration-[350ms] ease-out group-hover:opacity-100"
          style={{ backgroundImage: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(236,72,153,0.35))' }}
          aria-hidden="true"
        />

        <div className="relative flex h-full flex-col rounded-[24px] border border-gray-200 bg-white p-7 shadow-[0_2px_12px_rgba(17,24,39,0.05)] transition-all duration-[350ms] ease-out group-hover:-translate-y-1.5 group-hover:border-purple-200 group-hover:shadow-[0_22px_48px_-16px_rgba(124,58,237,0.28)] sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <div className="breast-icon-float w-fit">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl border transition-transform duration-[350ms] ease-out group-hover:scale-110"
                style={{
                  backgroundImage: feature.tint,
                  color: feature.accent,
                  borderColor: `${feature.accent}26`,
                }}
              >
                {feature.icon}
              </div>
            </div>

            <span
              className="font-sans text-xs font-semibold tracking-[0.22em]"
              style={{ color: `${feature.accent}66` }}
            >
              {feature.number}
            </span>
          </div>

          <h3 className="mt-7 font-serif text-[1.6rem] font-semibold leading-tight tracking-[-0.01em] text-[#111827]">
            {feature.title}
          </h3>

          {/* Illustration */}
          <div
            className="mt-6 rounded-[18px] border border-gray-100 p-3"
            style={{
              backgroundImage:
                'linear-gradient(160deg, rgba(124,58,237,0.045) 0%, rgba(236,72,153,0.03) 100%)',
            }}
          >
            <Visual />
          </div>

          <p className="mt-6 font-sans text-[15px] leading-relaxed text-gray-600">{feature.lead}</p>

          {feature.body && (
            <p className="mt-3 font-sans text-[15px] leading-relaxed text-gray-600">
              {feature.body}
            </p>
          )}

          <ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
            {feature.chips.map((chip) => (
              <li
                key={chip}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 font-sans text-[12.5px] font-medium text-gray-700"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${feature.accent}, #EC4899)`,
                  }}
                  aria-hidden="true"
                />
                {chip}
              </li>
            ))}
          </ul>

          <p className="mt-5 font-sans text-[14.5px] leading-relaxed text-gray-500">
            {feature.closing}
          </p>
        </div>
      </article>
    </li>
  );
}

export default function OmicMindBreast() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

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

      // Card fade-up with stagger
      gsap.from('.breast-item', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
      });

      // Gentle floating icons
      gsap.to('.breast-icon-float', {
        y: -7,
        duration: 2.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
      });

      /* ---- Illustration motion ---- */

      // Card 1 — score bars filling, AI detections breathing
      gsap.from('.brst1-bar', {
        scaleX: 0,
        transformOrigin: `${SCORE_X}px center`,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: gridRef.current, start: 'top 78%' },
      });
      gsap.to('.brst1-detect', {
        opacity: 1,
        duration: 1.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
      });

      // Card 2 — immune cells drifting, neighbourhood radius expanding
      gsap.utils.toArray('.brst2-cell').forEach((cell, i) => {
        gsap.to(cell, {
          x: i % 3 === 0 ? 4 : -3,
          y: i % 2 === 0 ? -3.5 : 3,
          duration: 3 + (i % 4) * 0.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.12,
        });
      });
      gsap.fromTo(
        '.brst2-radius',
        { attr: { r: 12 }, opacity: 0.6 },
        { attr: { r: 34 }, opacity: 0, duration: 2.6, ease: 'sine.out', repeat: -1 }
      );

      // Card 3 — encoder edges shimmering, predictions lighting up
      gsap.to('.brst3-edge', {
        opacity: 0.8,
        duration: 1.7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.05, from: 'random' },
      });
      gsap.utils.toArray('.brst3-particle').forEach((dot, i) => {
        const { fromx, fromy, tox, toy } = dot.dataset;
        gsap
          .timeline({ repeat: -1, repeatDelay: 0.7, delay: i * 0.36 })
          .set(dot, { attr: { cx: fromx, cy: fromy }, opacity: 0 })
          .to(dot, { opacity: 1, duration: 0.26 }, 0)
          .to(dot, { attr: { cx: tox, cy: toy }, duration: 1.5, ease: 'none' }, 0)
          .to(dot, { opacity: 0, duration: 0.3 }, 1.2);
      });
      gsap.to('.brst3-out', {
        opacity: 0.55,
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.28,
      });

      // Card 4 — metric bars growing, AI stamp pulsing
      gsap.from('.brst4-bar', {
        scaleY: 0,
        transformOrigin: `center ${BAR_BASE}px`,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: gridRef.current, start: 'top 78%' },
      });
      gsap.to('.brst4-stamp', {
        opacity: 0.45,
        duration: 1.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-white pb-24 pt-10 lg:pb-32 lg:pt-16">
      {/* Subtle purple / pink accent gradients */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(50% 34% at 16% 14%, rgba(124,58,237,0.06) 0%, rgba(255,255,255,0) 70%), radial-gradient(50% 34% at 84% 80%, rgba(236,72,153,0.05) 0%, rgba(255,255,255,0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div ref={headerRef} className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-purple-100 bg-purple-50/60 px-4 py-1.5 font-sans text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[#7C3AED]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899]"
              aria-hidden="true"
            />
            OmicMind Breast&trade;
          </span>

          <div className="mx-auto mt-7 max-w-2xl space-y-4 text-left sm:text-center">
            <p className="font-sans text-base leading-relaxed text-[#1F2937] sm:text-lg">
              OmicMind Breast&trade; is the flagship clinical application built on the OmicMind
              Foundation Model.
            </p>
            <p className="font-sans text-base leading-relaxed text-gray-600">
              Designed specifically for breast oncology, the platform combines quantitative
              pathology, biomarker analysis, spatial immune profiling, and AI-driven molecular
              prediction into a single computational workflow.
            </p>
            <p className="font-sans text-base leading-relaxed text-gray-600">
              Rather than replacing existing pathology practice, OmicMind Breast&trade; augments
              clinical interpretation by delivering standardized measurements, reproducible
              analyses, and deeper biological context from routine FFPE tissue.
            </p>
          </div>
        </div>

        <ol
          ref={gridRef}
          className="relative mt-20 grid list-none grid-cols-1 gap-y-10 p-0 md:mt-24 md:grid-cols-2 md:gap-x-12 md:gap-y-14"
        >
          {features.map((feature) => (
            <BreastFeatureCard key={feature.title} feature={feature} />
          ))}
        </ol>
      </div>
    </section>
  );
}
