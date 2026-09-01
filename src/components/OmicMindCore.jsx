import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import normalBreast from '../assets/normalbreast.webp';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   All three illustrations are drawn in a fixed 320 x 180 viewBox and
   rendered at w-full, so every coordinate below scales with the card
   and nothing needs breakpoint-specific geometry.
------------------------------------------------------------------ */
const VB_W = 320;
const VB_H = 180;

const LABEL = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: '0.04em',
};

const CAPTION = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 8.5,
  fontWeight: 600,
  letterSpacing: '0.08em',
};

/* Shared gradient + glow defs, id-namespaced per illustration */
function Defs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#EC4899" stopOpacity="0.35" />
      </linearGradient>
      <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7C3AED" />
        <stop offset="55%" stopColor="#D946EF" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#EC4899" stopOpacity="0.1" />
      </linearGradient>
    </defs>
  );
}

/* ==================================================================
   1. Multimodal Biological Understanding
   Four biological modalities converging into a single representation.
================================================================== */
const MODALITIES = [
  { label: 'Histology', x: 50, y: 36 },
  { label: 'Spatial', x: 270, y: 36 },
  { label: 'Genomic', x: 50, y: 144 },
  { label: 'Molecular', x: 270, y: 144 },
];

const HUB = { x: 160, y: 90, r: 27 };

function MultimodalVisual() {
  const id = 'omc-v1';

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" aria-hidden="true">
      <Defs id={id} />

      {/* Converging connectors */}
      {MODALITIES.map((m) => {
        const vx = HUB.x - m.x;
        const vy = HUB.y - m.y;
        const len = Math.hypot(vx, vy);
        const ux = vx / len;
        const uy = vy / len;
        const x1 = m.x + ux * 34;
        const y1 = m.y + uy * 22;
        const x2 = HUB.x - ux * (HUB.r + 5);
        const y2 = HUB.y - uy * (HUB.r + 5);

        return (
          <g key={m.label}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(124,58,237,0.28)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Particle travelling inward */}
            <circle
              className="v1-particle"
              r="2.6"
              fill="#ffffff"
              stroke="#A855F7"
              strokeWidth="1.6"
              cx={x1}
              cy={y1}
              opacity="0"
              data-fromx={x1}
              data-fromy={y1}
              data-tox={x2}
              data-toy={y2}
            />
          </g>
        );
      })}

      {/* Modality chips */}
      {MODALITIES.map((m) => (
        <g key={m.label}>
          <rect
            x={m.x - 44}
            y={m.y - 13}
            width="88"
            height="26"
            rx="13"
            fill="#ffffff"
            stroke="rgba(124,58,237,0.2)"
            strokeWidth="1.2"
          />
          <circle cx={m.x - 30} cy={m.y} r="3.6" fill={`url(#${id}-ring)`} />
          <text x={m.x - 20} y={m.y + 3.2} fill="#4B5563" {...LABEL}>
            {m.label}
          </text>
        </g>
      ))}

      {/* Central unified representation */}
      <circle
        className="v1-pulse"
        cx={HUB.x}
        cy={HUB.y}
        r={HUB.r}
        fill="none"
        stroke="rgba(168,85,247,0.4)"
        strokeWidth="1.4"
      />
      <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill={`url(#${id}-fill)`} />
      <circle
        cx={HUB.x}
        cy={HUB.y}
        r={HUB.r}
        fill="none"
        stroke={`url(#${id}-ring)`}
        strokeWidth="1.8"
      />
      <g className="v1-lattice" style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}>
        <circle cx={HUB.x} cy={HUB.y} r="4.6" fill="#7C3AED" />
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const r = (a * Math.PI) / 180;
          return (
            <g key={a}>
              <line
                x1={HUB.x + Math.cos(r) * 7}
                y1={HUB.y + Math.sin(r) * 7}
                x2={HUB.x + Math.cos(r) * 16}
                y2={HUB.y + Math.sin(r) * 16}
                stroke="rgba(124,58,237,0.5)"
                strokeWidth="1.2"
              />
              <circle
                cx={HUB.x + Math.cos(r) * 18.5}
                cy={HUB.y + Math.sin(r) * 18.5}
                r="2.4"
                fill="#D946EF"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ==================================================================
   2. Cross-Modal Attention Architecture
   An attention map between morphology tokens and molecular signals.
================================================================== */
const ATT_ROWS = [34, 68, 102, 136];
const ATT_LX = 58;
const ATT_RX = 262;
// Attention weights drive stroke opacity, so the mesh reads as a learned map.
const WEIGHTS = [
  [0.5, 0.14, 0.08, 0.2],
  [0.12, 0.62, 0.16, 0.09],
  [0.09, 0.18, 0.24, 0.55],
  [0.22, 0.1, 0.5, 0.14],
];

function AttentionVisual() {
  const id = 'omc-v2';

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" aria-hidden="true">
      <Defs id={id} />

      <text x={ATT_LX} y="14" fill="#9CA3AF" textAnchor="middle" {...CAPTION}>
        MORPHOLOGY
      </text>
      <text x={ATT_RX} y="14" fill="#9CA3AF" textAnchor="middle" {...CAPTION}>
        MOLECULAR
      </text>

      {/* Attention mesh */}
      {ATT_ROWS.map((ly, i) =>
        ATT_ROWS.map((ry, j) => {
          const w = WEIGHTS[i][j];
          const strong = w > 0.4;
          return (
            <line
              key={`${i}-${j}`}
              className={strong ? 'v2-link-strong' : 'v2-link'}
              x1={ATT_LX + 13}
              y1={ly}
              x2={ATT_RX - 13}
              y2={ry}
              stroke={strong ? `url(#${id}-line)` : 'rgba(124,58,237,0.5)'}
              strokeWidth={strong ? 1.6 : 1}
              strokeLinecap="round"
              opacity={strong ? 0.75 : w}
            />
          );
        })
      )}

      {/* Flowing data along the strongest attention paths */}
      {ATT_ROWS.map((ly, i) => {
        const j = WEIGHTS[i].indexOf(Math.max(...WEIGHTS[i]));
        return (
          <circle
            key={`p-${i}`}
            className="v2-particle"
            r="2.6"
            fill="#ffffff"
            stroke="#D946EF"
            strokeWidth="1.6"
            cx={ATT_LX + 13}
            cy={ly}
            opacity="0"
            data-fromx={ATT_LX + 13}
            data-fromy={ly}
            data-tox={ATT_RX - 13}
            data-toy={ATT_ROWS[j]}
          />
        );
      })}

      {/* Morphology tokens — tissue patches */}
      {ATT_ROWS.map((y, i) => (
        <g key={`l-${i}`}>
          <rect
            x={ATT_LX - 13}
            y={y - 11}
            width="26"
            height="22"
            rx="5"
            fill="#ffffff"
            stroke="rgba(124,58,237,0.35)"
            strokeWidth="1.2"
          />
          <circle cx={ATT_LX - 5} cy={y - 3} r="2.8" fill="rgba(124,58,237,0.5)" />
          <circle cx={ATT_LX + 5} cy={y + 3} r="2.2" fill="rgba(168,85,247,0.45)" />
          <circle cx={ATT_LX + 6} cy={y - 5} r="1.5" fill="rgba(217,70,239,0.4)" />
        </g>
      ))}

      {/* Molecular signal tokens */}
      {ATT_ROWS.map((y, i) => (
        <g key={`r-${i}`}>
          <rect
            x={ATT_RX - 13}
            y={y - 11}
            width="26"
            height="22"
            rx="5"
            fill="#ffffff"
            stroke="rgba(236,72,153,0.35)"
            strokeWidth="1.2"
          />
          <path
            d={`M${ATT_RX - 7} ${y + 4} L${ATT_RX - 2.5} ${y - 4} L${ATT_RX + 2.5} ${y + 2} L${
              ATT_RX + 7
            } ${y - 5}`}
            fill="none"
            stroke="rgba(236,72,153,0.65)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
    </svg>
  );
}

/* ==================================================================
   3. Reconstruction of Missing Biological Layers
   Tissue Image → AI Analysis → Predicted Molecular Layer
================================================================== */
const STAGE_Y = 30;
const STAGE_H = 84;
const STAGES = [
  { x: 10, w: 84, label: ['Tissue', 'Image'] },
  { x: 118, w: 84, label: ['AI', 'Analysis'] },
  { x: 226, w: 84, label: ['Predicted', 'Molecular Layer'] },
];

// 4 x 4 reconstruction grid inside stage 3
const CELL = 17;
const CELL_GAP = 3;
const GRID_X = 226 + (84 - (CELL * 4 + CELL_GAP * 3)) / 2;
const GRID_Y = STAGE_Y + (STAGE_H - (CELL * 4 + CELL_GAP * 3)) / 2;
// Cells the model has to reconstruct rather than observe directly
const MISSING = new Set([1, 4, 6, 9, 11, 14]);

function ReconstructionVisual() {
  const id = 'omc-v3';

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" aria-hidden="true">
      <Defs id={id} />

      {/* Stage frames + captions */}
      {STAGES.map((s) => (
        <g key={s.label.join(' ')}>
          <rect
            x={s.x}
            y={STAGE_Y}
            width={s.w}
            height={STAGE_H}
            rx="12"
            fill="#ffffff"
            stroke="rgba(124,58,237,0.18)"
            strokeWidth="1.2"
          />
          {s.label.map((line, li) => (
            <text
              key={line}
              x={s.x + s.w / 2}
              y={STAGE_Y + STAGE_H + 18 + li * 11}
              fill="#6B7280"
              textAnchor="middle"
              {...CAPTION}
            >
              {line}
            </text>
          ))}
        </g>
      ))}

      {/* Arrows between stages, with travelling data */}
      {[
        { x1: 96, x2: 116 },
        { x1: 204, x2: 224 },
      ].map((a, i) => (
        <g key={i}>
          <line
            x1={a.x1}
            y1={STAGE_Y + STAGE_H / 2}
            x2={a.x2 - 4}
            y2={STAGE_Y + STAGE_H / 2}
            stroke="rgba(124,58,237,0.4)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d={`M${a.x2 - 6} ${STAGE_Y + STAGE_H / 2 - 3.4} L${a.x2 - 1} ${STAGE_Y + STAGE_H / 2} L${
              a.x2 - 6
            } ${STAGE_Y + STAGE_H / 2 + 3.4}`}
            fill="none"
            stroke="rgba(124,58,237,0.55)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            className="v3-particle"
            r="2.4"
            fill="#ffffff"
            stroke="#A855F7"
            strokeWidth="1.6"
            cx={a.x1}
            cy={STAGE_Y + STAGE_H / 2}
            opacity="0"
            data-fromx={a.x1}
            data-fromy={STAGE_Y + STAGE_H / 2}
            data-tox={a.x2 - 4}
            data-toy={STAGE_Y + STAGE_H / 2}
          />
        </g>
      ))}

      {/* Stage 1 — routine H&E tissue */}
      <g>
        <path d="M14 52h76" stroke="rgba(124,58,237,0.14)" strokeWidth="1" />
        <circle cx="34" cy="70" r="7.5" fill="none" stroke="rgba(124,58,237,0.45)" strokeWidth="1.3" />
        <circle cx="34" cy="70" r="2.2" fill="rgba(124,58,237,0.55)" />
        <circle cx="58" cy="63" r="5.5" fill="none" stroke="rgba(168,85,247,0.45)" strokeWidth="1.3" />
        <circle cx="58" cy="63" r="1.8" fill="rgba(168,85,247,0.5)" />
        <circle cx="48" cy="88" r="6.2" fill="none" stroke="rgba(217,70,239,0.4)" strokeWidth="1.3" />
        <circle cx="48" cy="88" r="1.9" fill="rgba(217,70,239,0.45)" />
        <circle cx="72" cy="86" r="4.4" fill="none" stroke="rgba(236,72,153,0.4)" strokeWidth="1.3" />
      </g>

      {/* Stage 2 — attention/encoder lattice */}
      <g className="v3-engine" style={{ transformOrigin: '160px 72px' }}>
        <circle cx="160" cy="72" r="19" fill={`url(#${id}-fill)`} />
        <circle cx="160" cy="72" r="19" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="1.6" />
        <circle cx="160" cy="72" r="3.8" fill="#7C3AED" />
        {[30, 90, 150, 210, 270, 330].map((a) => {
          const r = (a * Math.PI) / 180;
          return (
            <g key={a}>
              <line
                x1={160 + Math.cos(r) * 6}
                y1={72 + Math.sin(r) * 6}
                x2={160 + Math.cos(r) * 12.5}
                y2={72 + Math.sin(r) * 12.5}
                stroke="rgba(124,58,237,0.45)"
                strokeWidth="1.1"
              />
              <circle
                cx={160 + Math.cos(r) * 14.5}
                cy={72 + Math.sin(r) * 14.5}
                r="2"
                fill="#D946EF"
              />
            </g>
          );
        })}
      </g>

      {/* Stage 3 — molecular layer being reconstructed */}
      {Array.from({ length: 16 }, (_, k) => {
        const col = k % 4;
        const row = Math.floor(k / 4);
        const x = GRID_X + col * (CELL + CELL_GAP);
        const y = GRID_Y + row * (CELL + CELL_GAP);
        const missing = MISSING.has(k);

        return missing ? (
          <rect
            key={k}
            className="v3-cell"
            x={x}
            y={y}
            width={CELL}
            height={CELL}
            rx="3.5"
            fill={`url(#${id}-ring)`}
            stroke="rgba(124,58,237,0.35)"
            strokeWidth="1"
            opacity="0.12"
          />
        ) : (
          <rect
            key={k}
            x={x}
            y={y}
            width={CELL}
            height={CELL}
            rx="3.5"
            fill="rgba(124,58,237,0.1)"
            stroke="rgba(124,58,237,0.16)"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
const features = [
  {
    title: 'Multimodal Biological Intelligence',
    body: 'Integrates tissue morphology, biomarker expression, spatial context and molecular profiles around the same tumor specimen to create a unified representation of disease biology.',
    Visual: MultimodalVisual,
  },
  {
    title: 'Cross-Modal Learning Architecture',
    body: 'Learns associations between visible tissue architecture and underlying biological states across pathology, spatial and multiomic datasets.',
    Visual: AttentionVisual,
  },
  {
    title: 'From Tissue to Therapeutic Insight',
    body: 'Develops research models that connect tumor morphology with molecular phenotypes, treatment response, clinical outcomes and biological pathways—supporting cohort enrichment, confirmatory-testing prioritization and drug-target discovery.',
    Visual: ReconstructionVisual,
  },
];

export default function OmicMindCore() {
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

      // Feature blocks fade-up, staggered
      gsap.from('.feature-card', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
      });

      /* Particle flow — shared by all three illustrations. Each dot carries its
         own start/end in data attributes so one routine drives every visual. */
      const flow = (selector, { duration, repeatDelay, step }) =>
        gsap.utils.toArray(selector).forEach((dot, i) => {
          const { fromx, fromy, tox, toy } = dot.dataset;
          gsap
            .timeline({ repeat: -1, repeatDelay, delay: i * step })
            .set(dot, { attr: { cx: fromx, cy: fromy }, opacity: 0 })
            .to(dot, { opacity: 1, duration: 0.28 }, 0)
            .to(dot, { attr: { cx: tox, cy: toy }, duration, ease: 'none' }, 0)
            .to(dot, { opacity: 0, duration: 0.3 }, duration - 0.3);
        });

      flow('.v1-particle', { duration: 1.7, repeatDelay: 0.7, step: 0.3 });
      flow('.v2-particle', { duration: 1.9, repeatDelay: 0.6, step: 0.34 });
      flow('.v3-particle', { duration: 1.3, repeatDelay: 0.9, step: 0.55 });

      // Card 1 — pulse ring + slowly turning lattice
      gsap.fromTo(
        '.v1-pulse',
        { attr: { r: HUB.r }, opacity: 0.55 },
        {
          attr: { r: HUB.r + 11 },
          opacity: 0,
          duration: 2.6,
          ease: 'sine.out',
          repeat: -1,
        }
      );
      gsap.to('.v1-lattice', {
        rotation: 360,
        transformOrigin: `${HUB.x}px ${HUB.y}px`,
        duration: 34,
        ease: 'none',
        repeat: -1,
      });

      // Card 2 — attention weights shimmering
      gsap.to('.v2-link', {
        opacity: (i, t) => Number(t.getAttribute('opacity')) * 2.1,
        duration: 1.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.09, from: 'random' },
      });
      gsap.to('.v2-link-strong', {
        opacity: 0.35,
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.22,
      });

      // Card 3 — engine breathing, missing layers filling in
      gsap.to('.v3-engine', {
        scale: 1.06,
        transformOrigin: '160px 72px',
        duration: 2.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
      gsap.to('.v3-cell', {
        opacity: 0.85,
        duration: 1.1,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.5,
        stagger: { each: 0.18, from: 'start' },
      });

      // Drifting background particles
      gsap.utils.toArray('.omc-dust').forEach((dot, i) => {
        gsap.to(dot, {
          y: i % 2 === 0 ? -26 : 22,
          x: i % 3 === 0 ? 16 : -12,
          duration: 7 + (i % 4) * 1.6,
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
            'radial-gradient(55% 40% at 18% 22%, rgba(124,58,237,0.07) 0%, rgba(255,255,255,0) 70%), radial-gradient(55% 40% at 82% 78%, rgba(236,72,153,0.06) 0%, rgba(255,255,255,0) 70%), radial-gradient(45% 35% at 50% 50%, rgba(168,85,247,0.05) 0%, rgba(255,255,255,0) 75%)',
        }}
        aria-hidden="true"
      />

      {/* Very soft AI network pattern */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        style={{ opacity: 0.5 }}
      >
        <defs>
          <pattern id="omc-net" width="88" height="88" patternUnits="userSpaceOnUse">
            <path
              d="M44 0v88M0 44h88M0 0l88 88M88 0L0 88"
              fill="none"
              stroke="rgba(124,58,237,0.055)"
              strokeWidth="1"
            />
            <circle cx="44" cy="44" r="1.6" fill="rgba(168,85,247,0.14)" />
            <circle cx="0" cy="0" r="1.2" fill="rgba(236,72,153,0.12)" />
            <circle cx="88" cy="88" r="1.2" fill="rgba(236,72,153,0.12)" />
          </pattern>
          <radialGradient id="omc-net-fade" cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="omc-net-mask">
            <rect width="100%" height="100%" fill="url(#omc-net-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#omc-net)" mask="url(#omc-net-mask)" />
      </svg>

      {/* Subtle drifting AI particles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[
          { left: '12%', top: '18%', s: 4 },
          { left: '86%', top: '26%', s: 3 },
          { left: '22%', top: '72%', s: 3 },
          { left: '74%', top: '80%', s: 4 },
          { left: '48%', top: '12%', s: 3 },
          { left: '58%', top: '88%', s: 3 },
        ].map((d, i) => (
          <span
            key={i}
            className="omc-dust absolute rounded-full"
            style={{
              left: d.left,
              top: d.top,
              width: d.s,
              height: d.s,
              backgroundImage: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              opacity: 0.28,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* ---------------- Header and specimen plate ----------------
            Two columns from `lg`, where each half still clears ~580px: the
            chapter's copy on the left, the reference specimen on the right,
            centred against each other. Below `lg` the grid collapses to one
            column and the plate falls beneath the text, in that order. */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* ---------------- Header ---------------- */}
          <div ref={headerRef} className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-4xl font-semibold leading-[1.12] tracking-[-0.01em] sm:text-5xl lg:text-[3.5rem]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]">
                OmicMind Core
              </span>
            </h2>

            {/* Subheading — the section's second line, in the same serif
                italic gradient the other chapter headers use */}
            <p className="mt-4 font-serif text-xl font-semibold italic leading-snug tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] sm:mt-5 sm:text-2xl lg:text-[1.75rem]">
              Connecting Tissue Morphology to Molecular Biology
            </p>

            {/* ---- Body copy ----
                Both paragraphs carry the same `mx-auto max-w-2xl`, so they sit
                on identical left and right boundaries at every breakpoint, and
                both are set `text-left`: the heading and subheading above stay
                centred, while the prose reads down a straight left edge instead
                of a ragged centred one. They cannot share a wrapper — the header
                staggers its own children — so the measure is stated on each. */}
            <p className="mx-auto mt-8 max-w-2xl text-left font-sans text-lg font-normal leading-[1.7] tracking-[-0.005em] text-[#1F2937] [text-wrap:pretty] sm:text-xl">
              OmicMind Core is a{' '}
              <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">
                specimen-centric multimodal AI engine
              </span>{' '}
              designed to learn relationships across H&E pathology, quantitative IHC,
              spatial biology, genomics, transcriptomics and clinical outcomes.
            </p>

            <p className="mx-auto mt-6 max-w-2xl text-left font-sans text-base font-normal leading-[1.7] tracking-[-0.005em] text-gray-600 [text-wrap:pretty] sm:text-lg">
              Through cross-modal learning, the platform identifies
              biological patterns associated with molecular phenotypes—supporting biomarker
              discovery, treatment-response research, clinical-trial cohort stratification
              and drug-target prioritization from routinely collected tumor tissue.
            </p>
          </div>

          {/* ---------------- Specimen plate ----------------
              The same 1px-padding gradient shell the rest of the site frames
              its imagery with, so the plate carries the brand ramp on its
              edge without any of it touching the section. The slide is laid
              in at `h-auto w-full`: it keeps its own aspect at every width,
              so it is never cropped, stretched or letterboxed. */}
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
                  src={normalBreast}
                  alt="Whole-slide H&E section of normal breast tissue, with a 2.5 mm scale bar"
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Three feature blocks ---------------- */}
        <div
          ref={gridRef}
          className="mt-16 grid grid-cols-1 gap-7 md:mt-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {features.map(({ title, body, Visual }, i) => (
            <article
              key={title}
              className={`feature-card group relative ${
                i === 2 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Purple/pink hover glow */}
              <div
                className="pointer-events-none absolute -inset-[3px] rounded-[26px] opacity-0 blur-[10px] transition-opacity duration-[350ms] ease-out group-hover:opacity-100"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, rgba(124,58,237,0.32), rgba(236,72,153,0.32))',
                }}
                aria-hidden="true"
              />

              <div className="relative flex h-full flex-col rounded-[24px] border border-gray-200 bg-white p-6 shadow-[0_2px_12px_rgba(17,24,39,0.05)] transition-all duration-[350ms] ease-out group-hover:-translate-y-1.5 group-hover:border-purple-200 group-hover:shadow-[0_22px_48px_-16px_rgba(124,58,237,0.28)] sm:p-7">
                {/* Illustration */}
                <div
                  className="rounded-[18px] border border-gray-100 p-3"
                  style={{
                    backgroundImage:
                      'linear-gradient(160deg, rgba(124,58,237,0.045) 0%, rgba(236,72,153,0.03) 100%)',
                  }}
                >
                  <Visual />
                </div>

                <h3 className="mt-7 font-serif text-[1.45rem] font-semibold leading-tight tracking-[-0.01em] text-[#111827]">
                  {title}
                </h3>

                <p className="mt-3 font-sans text-[14.5px] leading-relaxed text-gray-600">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
