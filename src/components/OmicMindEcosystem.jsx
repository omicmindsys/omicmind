import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import normalBreastOne from '../assets/normalbreastone.webp';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   Every illustration is drawn in a fixed 320 x 180 viewBox and rendered
   at w-full, so all coordinates scale with the card and no breakpoint
   ever needs its own geometry.
------------------------------------------------------------------ */
const VB_W = 320;
const VB_H = 180;

const CAPTION = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 8.5,
  fontWeight: 600,
  letterSpacing: '0.08em',
};

const PILL_TEXT = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 8.5,
  fontWeight: 600,
  letterSpacing: '0.02em',
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
        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#EC4899" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.28" />
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
        fill="#ffffff"
        stroke="rgba(124,58,237,0.18)"
        strokeWidth="1.2"
      />
      <path d="M10 33h300" stroke="rgba(124,58,237,0.12)" strokeWidth="1" />
      <circle cx="24" cy="22.5" r="2.2" fill="rgba(124,58,237,0.35)" />
      <circle cx="33" cy="22.5" r="2.2" fill="rgba(217,70,239,0.32)" />
      <circle cx="42" cy="22.5" r="2.2" fill="rgba(236,72,153,0.3)" />
      <rect x="58" y="18.5" width="64" height="8" rx="4" fill="rgba(124,58,237,0.1)" />

      {/* Whole-slide preview */}
      <rect
        x="22"
        y="44"
        width="112"
        height="72"
        rx="8"
        fill={`url(#${id}-fill)`}
        stroke="rgba(124,58,237,0.2)"
        strokeWidth="1.1"
      />
      <g className="eco1-cells">
        <circle cx="48" cy="66" r="7" fill="none" stroke="rgba(124,58,237,0.5)" strokeWidth="1.3" />
        <circle cx="48" cy="66" r="2.2" fill="rgba(124,58,237,0.55)" />
        <circle cx="78" cy="60" r="5" fill="none" stroke="rgba(168,85,247,0.5)" strokeWidth="1.3" />
        <circle cx="78" cy="60" r="1.8" fill="rgba(168,85,247,0.5)" />
        <circle cx="64" cy="92" r="6" fill="none" stroke="rgba(217,70,239,0.45)" strokeWidth="1.3" />
        <circle cx="64" cy="92" r="1.9" fill="rgba(217,70,239,0.5)" />
        <circle cx="100" cy="88" r="4.4" fill="none" stroke="rgba(236,72,153,0.45)" strokeWidth="1.3" />
        <circle cx="104" cy="66" r="3.4" fill="none" stroke="rgba(236,72,153,0.4)" strokeWidth="1.2" />
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
          <text x={BAR_TRACK} y={m.y} fill="#6B7280" {...CAPTION}>
            {m.label}
          </text>
          <rect x={BAR_TRACK} y={m.y + 6} width="152" height="6" rx="3" fill="rgba(124,58,237,0.1)" />
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
            fill="#ffffff"
            stroke="rgba(124,58,237,0.22)"
            strokeWidth="1.1"
          />
          <circle cx={f.x + 14} cy="141" r="3.2" fill={`url(#${id}-ring)`} />
          <text x={f.x + 24} y="144" fill="#4B5563" {...PILL_TEXT}>
            {f.label}
          </text>
          {i < FLOW.length - 1 && (
            <>
              <line
                x1={f.x + 82}
                y1="141"
                x2={f.x + 94}
                y2="141"
                stroke="rgba(124,58,237,0.35)"
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

      <text x="82" y="20" fill="#9CA3AF" textAnchor="middle" {...CAPTION}>
        MOLECULAR NETWORK
      </text>
      <text x={HM_X + hmW / 2} y="20" fill="#9CA3AF" textAnchor="middle" {...CAPTION}>
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
          stroke="rgba(124,58,237,0.45)"
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
              stroke="rgba(236,72,153,0.55)"
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
            fill="#ffffff"
            stroke="rgba(124,58,237,0.5)"
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
      <text x={HM_X} y={HM_Y + hmH + 32} fill="#9CA3AF" {...CAPTION}>
        LOW
      </text>
      <text x={HM_X + hmW} y={HM_Y + hmH + 32} fill="#9CA3AF" textAnchor="end" {...CAPTION}>
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
        stroke="rgba(124,58,237,0.22)"
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
          <circle cx={p.x} cy={PIPE_Y} r={PIPE_R} fill="#ffffff" />
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
            <circle cx={p.x} cy={PIPE_Y} r="3" fill="#7C3AED" />
            {[0, 120, 240].map((a) => {
              const rad = ((a + i * 30) * Math.PI) / 180;
              return (
                <g key={a}>
                  <line
                    x1={p.x + Math.cos(rad) * 4}
                    y1={PIPE_Y + Math.sin(rad) * 4}
                    x2={p.x + Math.cos(rad) * 8}
                    y2={PIPE_Y + Math.sin(rad) * 8}
                    stroke="rgba(124,58,237,0.45)"
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
          <text x={p.x} y={PIPE_Y + 28} fill="#6B7280" textAnchor="middle" {...CAPTION}>
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
        fill="#ffffff"
        stroke="rgba(124,58,237,0.16)"
        strokeWidth="1.1"
      />
      <text x={CHART.x + 14} y={CHART.y + 16} fill="#9CA3AF" {...CAPTION}>
        PREDICTED RESPONSE
      </text>
      {GRIDLINES.map((y) => (
        <line
          key={y}
          x1={CHART.x + 14}
          y1={y}
          x2={CHART.x + CHART.w - 14}
          y2={y}
          stroke="rgba(124,58,237,0.08)"
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
   twice. `cta` is optional — a card without one simply ends at its
   feature list. */
const products = [
  {
    title: 'OmicMind Computational Pathology AI',
    desc: 'Transforms routine H&E and IHC whole-slide images into quantitative, spatial and predictive research insights for translational medicine and biopharma development.',
    features: [
      'Tissue and tumor segmentation',
      'Quantitative biomarker analysis',
      'Molecular phenotype prediction',
      'Treatment-response research',
      'Clinical-trial cohort stratification',
    ],
    cta: 'Explore Pathology AI',
    Visual: ClinicalVisual,
  },
  {
    title: 'OmicMind Multiomics Intelligence',
    desc: 'Connects tissue morphology with genomics, transcriptomics, spatial biology and clinical outcomes to reveal disease mechanisms, biomarkers and patient subgroups.',
    features: [
      'Multimodal data integration',
      'Biomarker discovery and validation',
      'Spatial microenvironment analysis',
      'Patient and cohort stratification',
      'Biological knowledge graphs',
    ],
    cta: 'Explore Multiomics',
    Visual: BiomarkerVisual,
  },
  {
    title: 'OmicMind Drug Discovery AI',
    desc: 'Uses patient-derived pathology and multiomic intelligence to prioritize therapeutic targets, identify responsive disease populations and support biomarker-guided drug development.',
    features: [
      'Target identification and prioritization',
      'Disease and pathway modelling',
      'Biomarker-guided indication selection',
      'Drug-response modelling',
      'Translational program intelligence',
    ],
    Visual: DrugVisual,
  },
];

const ECOSYSTEM_FLOW = ['OmicMind Core', 'Clinical AI', 'Biomarker Discovery', 'Drug Discovery'];

export default function OmicMindEcosystem() {
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
      className="relative w-full overflow-hidden bg-white pb-24 pt-20 lg:pb-32 lg:pt-24"
    >
      {/* Hairline divider separating this chapter from the section above */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(17,24,39,0) 0%, rgba(124,58,237,0.16) 30%, rgba(236,72,153,0.16) 70%, rgba(17,24,39,0) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Soft purple / pink gradient lighting */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(52% 38% at 22% 20%, rgba(124,58,237,0.07) 0%, rgba(255,255,255,0) 70%), radial-gradient(52% 38% at 80% 76%, rgba(236,72,153,0.06) 0%, rgba(255,255,255,0) 70%)',
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
            <h2 className="font-serif text-4xl font-semibold leading-[1.12] tracking-[-0.01em] text-[#111827] sm:text-5xl lg:text-[3.5rem]">
              <span className="block">OmicMind</span>
              <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]">
                AI Ecosystem
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl font-sans text-base leading-relaxed text-gray-600 sm:text-lg">
              From clinical intelligence to biomarker discovery and therapeutic innovation, OmicMind
              AI transforms biological data into actionable insights across the healthcare and life
              sciences ecosystem.
            </p>

            {/* Ecosystem flow: Core → Clinical → Biomarker → Drug */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2">
              {ECOSYSTEM_FLOW.map((step, i) => (
                <React.Fragment key={step}>
                  <span
                    className={`rounded-full border px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      i === 0
                        ? 'border-purple-200 bg-purple-50/70 text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899]'
                        : 'border-gray-200 bg-white text-gray-500'
                    }`}
                  >
                    {step}
                  </span>
                  {i < ECOSYSTEM_FLOW.length - 1 && (
                    <svg
                      width="14"
                      height="8"
                      viewBox="0 0 14 8"
                      className="shrink-0"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 4h11M8.4 1.2L11.4 4l-3 2.8"
                        fill="none"
                        stroke="rgba(124,58,237,0.45)"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
              aspect at every width and is never cropped or stretched. */}
          <div className="mx-auto w-full max-w-2xl lg:max-w-none">
            <div
              className="relative rounded-[24px] p-px shadow-[0_18px_44px_-26px_rgba(76,29,149,0.5)]"
              style={{
                backgroundImage:
                  'linear-gradient(150deg, rgba(255,255,255,0.92) 0%, rgba(124,58,237,0.50) 34%, rgba(236,72,153,0.30) 64%, rgba(255,255,255,0.55) 100%)',
              }}
            >
              <div className="overflow-hidden rounded-[23px] bg-white">
                <img
                  src={normalBreastOne}
                  alt="Whole-slide H&E section of breast tissue, with a 5 mm scale bar"
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Product cards ---------------- */}
        <div
          ref={gridRef}
          className="mt-16 grid grid-cols-1 gap-7 md:mt-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {products.map(({ title, desc, features, cta, Visual }, i) => (
            <article
              key={title}
              className={`eco-card group relative ${
                i === 2 ? 'md:col-span-2 lg:col-span-1' : ''
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

              <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-gray-200 bg-white p-6 shadow-[0_2px_12px_rgba(17,24,39,0.05)] transition-all duration-[380ms] ease-out group-hover:-translate-y-2 group-hover:border-transparent group-hover:shadow-[0_26px_54px_-18px_rgba(124,58,237,0.3)] sm:p-7">
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
                    className="rounded-[18px] border border-gray-100 p-3 transition-transform duration-[380ms] ease-out group-hover:scale-[1.03]"
                    style={{
                      backgroundImage:
                        'linear-gradient(160deg, rgba(124,58,237,0.045) 0%, rgba(236,72,153,0.03) 100%)',
                    }}
                  >
                    <Visual />
                  </div>
                </div>

                <h3 className="relative mt-7 font-serif text-[1.5rem] font-semibold leading-tight tracking-[-0.01em] text-[#111827]">
                  {title}
                  <span className="align-super font-sans text-[0.6rem] font-medium text-gray-400">
                    &trade;
                  </span>
                </h3>

                <p className="relative mt-3 font-sans text-[14.5px] leading-relaxed text-gray-600">
                  {desc}
                </p>

                <ul className="relative mt-6 space-y-2.5 border-t border-gray-100 pt-5 [text-wrap:pretty]">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span
                        className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundImage:
                            'linear-gradient(135deg, rgba(124,58,237,0.14), rgba(236,72,153,0.12))',
                        }}
                        aria-hidden="true"
                      >
                        <svg width="9" height="9" viewBox="0 0 10 10">
                          <path
                            d="M2 5.3l2 2L8 3"
                            fill="none"
                            stroke="#7C3AED"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="font-sans text-[13.5px] leading-snug text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* ---- Call to action ----
                    Held to the foot of the card with `mt-auto`, so the
                    buttons line up across the row whatever length each
                    feature list runs to. The pill is the same gradient
                    language the Hero's primary action uses, sized for a
                    card rather than a page. */}
                {cta && (
                  <div className="relative mt-auto pt-7">
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
      </div>
    </section>
  );
}
