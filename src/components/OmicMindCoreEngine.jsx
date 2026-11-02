import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import quantIhc from '../assets/quantihc.webp';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   OmicMind Core

   The engine every application sits on. Four data domains across the top,
   each feeding a curved, lit pathway down into the central core; six
   capabilities flank the core, three to a side. Dark navy ground, white and
   light-blue type, blue / violet / magenta accents.

   Everything visual here is inline SVG and Tailwind — no new dependency —
   and every class, keyframe and SVG id carries the `omc-` prefix so none of
   it can reach another section.
================================================================ */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/* The four data domains. `rgb` is each card's accent, and the colour its
   pathway leaves the card in. */
const DOMAINS = [
  {
    title: 'Tissue Morphology',
    lead: 'H&E and histopathology',
    rgb: '96, 165, 250',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <path d="M9.6 3.2l2.6 1.5-3 5.2-2.6-1.5z" />
        <path d="M8.2 8.5l-1.6 2.8a4.6 4.6 0 002 6.3" />
        <path d="M12.6 12.4a4.6 4.6 0 01-1.7 5.9" />
        <path d="M4.5 20.6h15" />
        <path d="M14.4 20.4a4.6 4.6 0 00-.9-8.4" />
      </svg>
    ),
  },
  {
    title: 'Spatial Biology',
    lead: 'Cellular neighborhoods',
    rgb: '167, 139, 250',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <circle cx="7" cy="7.5" r="3" />
        <circle cx="17" cy="7" r="2.4" />
        <circle cx="12" cy="16.5" r="3.4" />
        <circle cx="4.6" cy="17.6" r="1.6" />
        <circle cx="19.4" cy="16.4" r="1.8" />
        <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Molecular Data',
    lead: 'Genomics, transcriptomics and proteomics',
    rgb: '232, 121, 249',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <path d="M8 3c0 4.5 8 4.5 8 9s-8 4.5-8 9" />
        <path d="M16 3c0 4.5-8 4.5-8 9s8 4.5 8 9" />
        <path d="M9.2 6h5.6M8.6 9.4h6.8M8.6 14.6h6.8M9.2 18h5.6" />
      </svg>
    ),
  },
  {
    title: 'Clinical & Outcomes',
    lead: 'Patient data and real-world evidence',
    rgb: '244, 114, 182',
    tags: ['Age / Sex', 'Diagnosis', 'Treatment', 'Response', 'Outcomes'],
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <rect x="4.5" y="4" width="15" height="17" rx="2.2" />
        <path d="M9 4V2.8h6V4" />
        <path d="M8 13h2l1.4-2.6 2 4.6 1.4-2H16" />
      </svg>
    ),
  },
];

/* Three capabilities to each side of the core. */
const CAPS_LEFT = [
  {
    title: 'Cross-modal Learning',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <circle cx="8" cy="12" r="5" />
        <circle cx="16" cy="12" r="5" />
      </svg>
    ),
  },
  {
    title: 'Biological Context',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <circle cx="12" cy="12" r="8.4" />
        <circle cx="12" cy="12" r="3.4" />
        <path d="M12 1.8v3.2M12 19v3.2M1.8 12H5M19 12h3.2" />
      </svg>
    ),
  },
  {
    title: 'Scalable Architecture',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <path d="M12 2.6 21 7l-9 4.4L3 7z" />
        <path d="M3 12.2l9 4.4 9-4.4" />
        <path d="M3 17.1l9 4.3 9-4.3" />
      </svg>
    ),
  },
];

const CAPS_RIGHT = [
  {
    title: 'Biomarker & Signature Discovery',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M15.4 15.4 21 21" />
        <path d="M7.4 11.2h1.6l1-2 1.6 4 1-2h1" />
      </svg>
    ),
  },
  {
    title: 'Therapy Response Modeling',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <path d="M3.4 20.4h17.2" />
        <path d="M4.6 16.4l4.2-4.6 3.4 2.6 6.8-8" />
        <path d="M15.6 6.4h3.4v3.4" />
      </svg>
    ),
  },
  {
    title: 'Patient Stratification',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <circle cx="6.5" cy="7" r="2.4" />
        <circle cx="17.5" cy="7" r="2.4" />
        <path d="M2.8 15.5a3.7 3.7 0 017.4 0M13.8 15.5a3.7 3.7 0 017.4 0" />
        <path d="M12 3v18" strokeDasharray="1.6 2.6" />
      </svg>
    ),
  },
];

/* ---------- Applications built on the core ----------
   Six products, each with a small visual drawn in the card's own accent.
   OmicQuant reuses the site's HER2 IHC slide, cropped to the stained tissue,
   with a quantitative bar read over it; the rest are inline SVG. */
const PRODUCTS = [
  {
    name: 'OmicQuant™',
    label: 'Biomarker Quantification',
    rgb: '96, 165, 250',
    visual: (
      <div className="relative h-full w-full">
        <div className="absolute inset-[6%] overflow-hidden rounded-full border border-[#60A5FA]/40 shadow-[0_6px_16px_-8px_rgba(37,99,235,0.35)]">
          <img
            src={quantIhc}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: '18% 30%', transform: 'scale(1.9)', transformOrigin: '18% 30%' }}
          />
        </div>
        <svg viewBox="0 0 40 30" className="absolute -bottom-1 -right-1 h-[44%] w-[56%] rounded-md border border-[#DDE3EE] bg-white/95 p-1 shadow-[0_4px_12px_-6px_rgba(23,32,51,0.25)]">
          <path d="M3 27h34" stroke="#94A3B8" strokeOpacity="0.5" strokeWidth="0.8" />
          <rect x="6" y="17" width="5" height="10" rx="1" fill="#60A5FA" />
          <rect x="14" y="10" width="5" height="17" rx="1" fill="#818CF8" />
          <rect x="22" y="13" width="5" height="14" rx="1" fill="#A78BFA" />
          <rect x="30" y="5" width="5" height="22" rx="1" fill="#E879F9" />
        </svg>
      </div>
    ),
  },
  {
    name: 'OmicMolecular™',
    label: 'Molecular Prediction',
    rgb: '129, 140, 248',
    visual: (
      <svg viewBox="0 0 80 80" className="h-full w-full" fill="none" strokeLinecap="round">
        <defs>
          <linearGradient id="omc-p-helix" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#E879F9" />
          </linearGradient>
        </defs>
        <path d="M28 6c0 17 24 17 24 34S28 57 28 74" stroke="url(#omc-p-helix)" strokeWidth="2.4" />
        <path d="M52 6c0 17-24 17-24 34s24 17 24 34" stroke="url(#omc-p-helix)" strokeWidth="2.4" strokeOpacity="0.75" />
        <g stroke="#8B5CF6" strokeOpacity="0.55" strokeWidth="1.6">
          <path d="M31 13h18M35 21h10M35 59h10M31 67h18M33 31h14M33 49h14" />
        </g>
        <g fill="#7C3AED">
          <circle cx="31" cy="13" r="1.8" /><circle cx="49" cy="13" r="1.8" />
          <circle cx="31" cy="67" r="1.8" /><circle cx="49" cy="67" r="1.8" />
        </g>
      </svg>
    ),
  },
  {
    name: 'OmicSpatial™',
    label: 'Spatial TME Analysis',
    rgb: '167, 139, 250',
    visual: (
      <svg viewBox="0 0 80 80" className="h-full w-full">
        <circle cx="40" cy="40" r="35" fill="none" stroke="#A78BFA" strokeOpacity="0.3" strokeDasharray="2 4" />
        {[
          [26, 26, '#60A5FA'], [32, 20, '#60A5FA'], [20, 32, '#60A5FA'], [30, 31, '#60A5FA'], [24, 22, '#60A5FA'],
          [52, 24, '#E879F9'], [58, 30, '#E879F9'], [50, 31, '#E879F9'], [56, 20, '#E879F9'],
          [40, 52, '#A78BFA'], [34, 57, '#A78BFA'], [46, 58, '#A78BFA'], [40, 62, '#A78BFA'], [47, 50, '#A78BFA'], [33, 49, '#A78BFA'],
          [22, 50, '#F472B6'], [60, 50, '#60A5FA'], [40, 38, '#172033'],
        ].map(([x, y, c], i) => (
          <circle key={i} cx={x} cy={y} r={i === 17 ? 2.4 : 3.2} fill={c} fillOpacity={i === 17 ? 1 : 0.85} />
        ))}
        <g stroke="#526078" strokeOpacity="0.35" strokeWidth="0.8">
          <path d="M40 38L28 27M40 38L53 27M40 38l0 14" />
        </g>
      </svg>
    ),
  },
  {
    name: 'OmicResponse™',
    label: 'Therapy Response',
    rgb: '192, 132, 252',
    visual: (
      <svg viewBox="0 0 80 80" className="h-full w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 10v58h60" stroke="#94A3B8" strokeOpacity="0.55" strokeWidth="1.4" />
        <g stroke="#94A3B8" strokeOpacity="0.15" strokeWidth="0.8">
          <path d="M12 25h60M12 40h60M12 55h60" />
        </g>
        <path d="M12 16h14l0 8h12l0 6h16l0 4h18" stroke="#60A5FA" strokeWidth="2.2" />
        <path d="M12 16h10l0 14h10l0 16h12l0 10h28" stroke="#F472B6" strokeWidth="2.2" strokeOpacity="0.85" />
        <circle cx="72" cy="34" r="2.4" fill="#60A5FA" />
        <circle cx="72" cy="56" r="2.4" fill="#F472B6" />
      </svg>
    ),
  },
  {
    name: 'OmicADC™',
    label: 'ADC Intelligence',
    rgb: '232, 121, 249',
    visual: (
      <svg viewBox="0 0 80 80" className="h-full w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="omc-p-adc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#E879F9" />
          </linearGradient>
        </defs>
        {/* Antibody: two arms and a stem */}
        <g stroke="url(#omc-p-adc)" strokeWidth="6" strokeOpacity="0.9">
          <path d="M40 44 22 22" />
          <path d="M40 44 58 22" />
          <path d="M40 44v26" />
        </g>
        <g stroke="#F8FAFC" strokeOpacity="0.5" strokeWidth="1.2">
          <path d="M34 37 20 20M46 37l14-17" />
        </g>
        {/* Linkers and payloads */}
        <g stroke="#94A3B8" strokeOpacity="0.8" strokeWidth="1.2">
          <path d="M28 32l-10 4M52 32l10 4M40 58h-12M40 58h12" />
        </g>
        <g fill="#F472B6">
          <circle cx="16" cy="37" r="3.4" /><circle cx="64" cy="37" r="3.4" />
          <circle cx="26" cy="58" r="3.4" /><circle cx="54" cy="58" r="3.4" />
        </g>
      </svg>
    ),
  },
  {
    name: 'OmicTrial™',
    label: 'Clinical Trial Matching',
    rgb: '244, 114, 182',
    visual: (
      <svg viewBox="0 0 80 80" className="h-full w-full" fill="none" strokeLinecap="round">
        {[
          [20, 30, '#60A5FA', 0.55], [60, 30, '#A78BFA', 0.55],
          [28, 52, '#818CF8', 0.55], [52, 52, '#E879F9', 0.55],
        ].map(([x, y, c, o], i) => (
          <g key={i} stroke={c} strokeOpacity={o} strokeWidth="1.8">
            <circle cx={x} cy={y - 6} r="4.2" />
            <path d={`M${x - 7} ${y + 8}a7 7 0 0 1 14 0`} />
          </g>
        ))}
        <g stroke="#F472B6" strokeWidth="2.2">
          <circle cx="40" cy="30" r="5.4" />
          <path d="M31 47a9 9 0 0 1 18 0" />
        </g>
        <circle cx="40" cy="38" r="20" stroke="#F472B6" strokeOpacity="0.35" strokeDasharray="2 4" />
        <circle cx="55" cy="18" r="6" fill="#F472B6" />
        <path d="M52.4 18l2 2 3.4-3.8" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/* ---------- The core's pie chart ----------
   Multimodal data shares, one slice per capability, drawn clockwise from
   twelve o'clock on the 400-wide core box. Arcs, and the outward nudge a
   hovered slice takes along its bisector, computed once at module load. */
const PIE_R = 110;
const PIE_SLICES = [
  { concept: 'Biomarker & Signature Discovery', share: 0.2, from: '#A78BFA', to: '#7C3AED', rgb: '124, 58, 237' },
  { concept: 'Therapy Response Modeling', share: 0.18, from: '#60A5FA', to: '#2563EB', rgb: '37, 99, 235' },
  { concept: 'Patient Stratification', share: 0.16, from: '#2DD4BF', to: '#0D9488', rgb: '13, 148, 136' },
  { concept: 'Cross-modal Learning', share: 0.16, from: '#F472B6', to: '#DB2777', rgb: '219, 39, 119' },
  { concept: 'Biological Context', share: 0.15, from: '#C4B5FD', to: '#8B5CF6', rgb: '139, 92, 246' },
  { concept: 'Scalable Architecture', share: 0.15, from: '#818CF8', to: '#4F46E5', rgb: '79, 70, 229' },
];
const PIE_PATHS = [];
PIE_SLICES.reduce((start, s) => {
  const end = start + s.share * Math.PI * 2;
  const mid = (start + end) / 2;
  const pt = (a) => `${(200 + PIE_R * Math.cos(a)).toFixed(2)} ${(200 + PIE_R * Math.sin(a)).toFixed(2)}`;
  PIE_PATHS.push({
    d: `M200 200 L${pt(start)} A${PIE_R} ${PIE_R} 0 ${s.share > 0.5 ? 1 : 0} 1 ${pt(end)} Z`,
    dx: (Math.cos(mid) * 7).toFixed(2),
    dy: (Math.sin(mid) * 7).toFixed(2),
  });
  return end;
}, -Math.PI / 2);

/* Shown one at a time beneath the pie as scrolling turns it. */
const CONCEPTS = PIE_SLICES.map((s) => s.concept);
const SLICE_BY_CONCEPT = Object.fromEntries(PIE_SLICES.map((s) => [s.concept, s]));

/* The pie's footprint inside the core box, for the HTML light and shadow
   layers that sit on it: a 220-wide circle centred in 400. */
const PIE_BOX = { left: '22.5%', top: '22.5%', width: '55%', height: '55%' };

/* Pathways from the four card centres (12.5 / 37.5 / 62.5 / 87.5% of the
   row) down to the core, on a 1000-wide box. */
const PATHS = [
  'M125 0 C125 90 470 70 492 160',
  'M375 0 C375 80 488 90 496 160',
  'M625 0 C625 80 512 90 504 160',
  'M875 0 C875 90 530 70 508 160',
];

function CoreVisual({ hovered, onHover }) {
  const wrapRef = useRef(null);
  const pieRef = useRef(null);
  const [active, setActive] = useState(0);

  /* Scroll position drives both the pie's turn (one clockwise revolution
     across the core's pass through the viewport, reversing on the way back
     up) and which concept is showing. No autoplay, no scroll locking. */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      const scrollTrigger = {
        trigger: wrapRef.current,
        start: 'top 90%',
        end: 'bottom 10%',
        onUpdate: (self) => setActive(Math.min(CONCEPTS.length - 1, Math.floor(self.progress * CONCEPTS.length))),
      };
      if (reduced) {
        ScrollTrigger.create(scrollTrigger);
      } else {
        gsap.to(pieRef.current, {
          rotation: 360,
          svgOrigin: '200 200',
          ease: 'none',
          scrollTrigger: { ...scrollTrigger, scrub: 0.8 },
        });
      }
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  /* Cursor depth: tilt, lift, light and ring parallax all read three CSS
     variables on the wrapper, eased toward the pointer in a single rAF loop
     that stops once settled, so there is no React render per move. Fine
     pointers only; touch and reduced motion keep the static chart. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const target = { x: 0, y: 0, lift: 0 };
    const cur = { x: 0, y: 0, lift: 0 };
    let frame = 0;
    const tick = () => {
      let moving = false;
      Object.keys(cur).forEach((k) => {
        const d = target[k] - cur[k];
        if (Math.abs(d) < 0.001) {
          cur[k] = target[k];
        } else {
          cur[k] += d * 0.1;
          moving = true;
        }
        el.style.setProperty(`--omc-${k}`, cur[k].toFixed(4));
      });
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const move = (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      target.x = clamp(((e.clientX - r.left) / r.width) * 2 - 1);
      target.y = clamp(((e.clientY - r.top) / r.height) * 2 - 1);
      target.lift = 1;
      kick();
    };
    const leave = () => {
      target.x = 0;
      target.y = 0;
      target.lift = 0;
      kick();
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-full w-full" style={{ perspective: '900px' }}>
      {/* Back layer: glow and orbits, drifting against the cursor */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        style={{ transform: 'translate3d(calc(var(--omc-x, 0) * -7px), calc(var(--omc-y, 0) * -7px), 0)' }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="omc-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.22" />
            <stop offset="45%" stopColor="#6366F1" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#F5F7FA" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="omc-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>

        {/* Glow */}
        <circle className="omc-pulse" cx="200" cy="200" r="200" fill="url(#omc-glow)" />

        {/* Orbits */}
        <circle cx="200" cy="200" r="182" fill="none" stroke="#A78BFA" strokeOpacity="0.18" strokeDasharray="2 7" />
        <g className="omc-spin">
          <circle cx="200" cy="200" r="158" fill="none" stroke="url(#omc-ring)" strokeOpacity="0.7" strokeWidth="1.2" strokeDasharray="120 38 18 38" />
          <circle cx="358" cy="200" r="3.5" fill="#F472B6" />
          <circle cx="42" cy="200" r="3" fill="#60A5FA" />
        </g>
        <g className="omc-spin-rev">
          <circle cx="200" cy="200" r="134" fill="none" stroke="#60A5FA" strokeOpacity="0.28" strokeDasharray="1 5" />
          <circle cx="200" cy="66" r="2.6" fill="#A78BFA" />
        </g>
      </svg>

      {/* Front layer: the pie, tilting toward the cursor and lifting on entry */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform:
            'rotateX(calc(var(--omc-y, 0) * -10deg)) rotateY(calc(var(--omc-x, 0) * 10deg)) translateZ(calc(var(--omc-lift, 0) * 16px))',
        }}
      >
        {/* Ambient shadow, sinking and drifting away from the light */}
        <div
          className="absolute rounded-full"
          style={{
            ...PIE_BOX,
            background: 'radial-gradient(closest-side, rgba(76,29,149,0.26), rgba(76,29,149,0))',
            transform:
              'translate3d(calc(var(--omc-x, 0) * -8px), calc(14px + var(--omc-y, 0) * -8px + var(--omc-lift, 0) * 6px), -30px) scale(calc(1.06 + var(--omc-lift, 0) * 0.05))',
            opacity: 'calc(0.8 + var(--omc-lift, 0) * 0.2)',
          }}
          aria-hidden="true"
        />

        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            {PIE_SLICES.map((s, i) => (
              <linearGradient key={i} id={`omc-slice-${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={s.from} />
                <stop offset="100%" stopColor={s.to} />
              </linearGradient>
            ))}
            <radialGradient id="omc-pie-sheen" cx="38%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="100%" stopColor="#172033" stopOpacity="0.12" />
            </radialGradient>
          </defs>

          <circle cx="200" cy="200" r={PIE_R} fill="#FFFFFF" />
          <g ref={pieRef} stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round">
            {PIE_PATHS.map((p, i) => {
              const s = PIE_SLICES[i];
              const on = hovered === i;
              return (
                <path
                  key={s.concept}
                  d={p.d}
                  fill={`url(#omc-slice-${i})`}
                  className="pointer-events-auto motion-reduce:![transform:none] motion-reduce:!transition-none"
                  style={{
                    transformBox: 'view-box',
                    transformOrigin: '200px 200px',
                    transform: on ? `translate(${p.dx}px, ${p.dy}px) scale(1.035)` : 'translate(0px, 0px) scale(1)',
                    filter: `drop-shadow(0 0 ${on ? 10 : 0}px rgba(${s.rgb}, ${on ? 0.55 : 0}))`,
                    transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1), filter 500ms ease',
                  }}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && onHover(i)}
                  onPointerLeave={() => onHover(null)}
                />
              );
            })}
          </g>
          <circle cx="200" cy="200" r={PIE_R} fill="url(#omc-pie-sheen)" />
        </svg>

        {/* Soft light that follows the cursor across the glass */}
        <div
          className="absolute rounded-full"
          style={{
            ...PIE_BOX,
            background:
              'radial-gradient(circle at calc(50% + var(--omc-x, 0) * 26%) calc(45% + var(--omc-y, 0) * 26%), rgba(255,255,255,calc(var(--omc-lift, 0) * 0.3)) 0%, rgba(255,255,255,0) 55%)',
            transform: 'translateZ(1px)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Concepts, crossfading in step with the pie's rotation */}
      <div className="pointer-events-none absolute inset-x-0 top-[80.5%] h-8" aria-live="polite">
        {CONCEPTS.map((c, i) => (
          <span
            key={c}
            className={`absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#A78BFA]/30 bg-white/90 px-3.5 py-1 font-sans text-[12.5px] font-medium tracking-[-0.005em] text-[#4C1D95] shadow-[0_6px_16px_-10px_rgba(124,58,237,0.45)] transition-all duration-500 ease-out motion-reduce:transition-none sm:text-[13px] ${
              i === active ? 'translate-y-0 opacity-100' : i < active ? '-translate-y-2 opacity-0' : 'translate-y-2 opacity-0'
            }`}
            aria-hidden={i !== active}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function Capability({ cap, side, lit }) {
  const right = side === 'right';
  const accent = lit ? SLICE_BY_CONCEPT[cap.title] : null;
  return (
    <li
      className={`omc-cap relative flex items-center gap-3.5 rounded-2xl border border-[#DDE3EE] bg-white px-4 py-3.5 shadow-[0_8px_24px_-18px_rgba(23,32,51,0.25)] backdrop-blur-sm lg:border-0 lg:shadow-none lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none ${
        right ? '' : 'lg:flex-row-reverse lg:text-right'
      }`}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A78BFA]/30 bg-gradient-to-br from-[#3B82F6]/15 via-[#8B5CF6]/15 to-[#EC4899]/15 bg-white text-[#7C3AED] shadow-[0_6px_16px_-8px_rgba(124,58,237,0.35)] transition-[color,border-color,box-shadow] duration-500 ease-out"
        style={
          accent
            ? {
                color: accent.to,
                borderColor: `rgba(${accent.rgb}, 0.55)`,
                boxShadow: `0 0 0 4px rgba(${accent.rgb}, 0.08), 0 8px 22px -8px rgba(${accent.rgb}, 0.6)`,
              }
            : undefined
        }
      >
        {cap.icon}
      </span>
      <span
        className="font-sans text-[15px] font-medium leading-snug tracking-[-0.01em] text-[#172033] transition-colors duration-500 ease-out"
        style={accent ? { color: accent.to } : undefined}
      >
        {cap.title}
      </span>
      {/* Hairline reaching toward the core, desktop only */}
      <span
        className={`pointer-events-none absolute top-1/2 hidden h-px w-10 transition-shadow duration-500 ease-out xl:w-14 lg:block ${
          right
            ? 'right-full mr-3 bg-gradient-to-l from-[#A78BFA]/60 to-transparent'
            : 'left-full ml-3 bg-gradient-to-r from-[#60A5FA]/60 to-transparent'
        }`}
        style={
          accent
            ? {
                backgroundImage: `linear-gradient(to ${right ? 'left' : 'right'}, rgba(${accent.rgb}, 0.95), rgba(${accent.rgb}, 0.1))`,
                boxShadow: `0 0 6px rgba(${accent.rgb}, 0.6)`,
              }
            : undefined
        }
        aria-hidden="true"
      />
    </li>
  );
}

export default function OmicMindCoreEngine() {
  const sectionRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const hoveredConcept = hovered === null ? null : PIE_SLICES[hovered].concept;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const reveal = (targets, trigger, vars) =>
        gsap.from(targets, {
          y: 36,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          ...vars,
          scrollTrigger: { trigger, start: 'top 82%' },
        });

      reveal('.omc-head > *', '.omc-head', { stagger: 0.12 });
      reveal('.omc-card', '.omc-cards', { stagger: 0.1 });

      gsap.from('.omc-path, .omc-flow', {
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.omc-paths', start: 'top 85%' },
      });

      gsap.from('.omc-core', {
        scale: 0.85,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.omc-core', start: 'top 85%' },
      });

      reveal('.omc-cap', '.omc-engine', { y: 20, stagger: 0.08, delay: 0.2 });
      reveal('.omc-prod', '.omc-prods', { y: 28, stagger: 0.08 });
      reveal('.omc-close > *', '.omc-close', { y: 16, stagger: 0.12 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden rounded-t-[3rem] bg-[#F5F7FA] pb-24 pt-24 lg:pb-32 lg:pt-32"
    >
      <style>{`
        .omc-spin { transform-origin: 200px 200px; animation: omc-spin 40s linear infinite; }
        .omc-spin-rev { transform-origin: 200px 200px; animation: omc-spin 60s linear infinite reverse; }
        .omc-pulse { transform-origin: 200px 200px; animation: omc-pulse 5s ease-in-out infinite; }
        .omc-node { animation: omc-node 3s ease-in-out infinite; }
        .omc-flow { stroke-dasharray: 3 14; animation: omc-flow 2.4s linear infinite; }
        @keyframes omc-spin { to { transform: rotate(360deg); } }
        @keyframes omc-pulse { 0%, 100% { opacity: 0.75; transform: scale(0.97); } 50% { opacity: 1; transform: scale(1.03); } }
        @keyframes omc-node { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
        @keyframes omc-flow { to { stroke-dashoffset: -34; } }
        @media (prefers-reduced-motion: reduce) {
          .omc-spin, .omc-spin-rev, .omc-pulse, .omc-node, .omc-flow { animation: none; }
        }
      `}</style>

      {/* Ambient ground: a faint blue-to-magenta wash and a fine grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(48% 36% at 50% 62%, rgba(124,58,237,0.06) 0%, rgba(124,58,237,0) 70%), radial-gradient(40% 30% at 12% 12%, rgba(59,130,246,0.05) 0%, rgba(59,130,246,0) 70%), radial-gradient(40% 30% at 88% 14%, rgba(236,72,153,0.05) 0%, rgba(236,72,153,0) 70%), linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(221,227,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(221,227,238,1) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(70% 60% at 50% 45%, #000 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 45%, #000 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* ---------------- Header ---------------- */}
        <div className="omc-head mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-4xl font-semibold leading-[1.12] tracking-[-0.01em] sm:text-5xl lg:text-[3.25rem]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#DB2777]">
              OmicMind Core™
            </span>
          </h2>
          <p className="mt-5 font-sans text-lg font-medium leading-snug tracking-[-0.01em] text-[#172033] sm:text-xl">
            The Multimodal Intelligence Engine Behind Every OmicMind Application
          </p>
          <span
            className="mx-auto mt-7 block h-px w-40 rounded-full bg-gradient-to-r from-transparent via-[#A855F7] to-transparent"
            aria-hidden="true"
          />
          <p className="mx-auto mt-7 max-w-2xl font-sans text-base leading-relaxed text-[#526078] sm:text-[17px]">
            OmicMind Core connects tissue morphology with spatial, molecular, and clinical biology to
            learn patterns associated with biomarkers, therapeutic response, and patient outcomes.
          </p>
        </div>

        {/* ---------------- Data domains ---------------- */}
        <ul className="omc-cards mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
          {DOMAINS.map((d) => (
            <li
              key={d.title}
              className="omc-card relative flex h-full flex-col rounded-2xl border p-5 backdrop-blur-sm"
              style={{
                borderColor: '#DDE3EE',
                backgroundColor: '#FFFFFF',
                backgroundImage: `linear-gradient(160deg, rgba(${d.rgb}, 0.08) 0%, rgba(255,255,255,0) 55%)`,
                boxShadow: `0 14px 34px -22px rgba(23,32,51,0.22), 0 10px 28px -24px rgba(${d.rgb}, 0.5)`,
              }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{ color: `rgb(${d.rgb})`, borderColor: `rgba(${d.rgb}, 0.4)`, backgroundColor: `rgba(${d.rgb}, 0.08)` }}
              >
                {d.icon}
              </span>
              <h3 className="mt-4 font-sans text-[17px] font-semibold tracking-[-0.01em] text-[#172033]">
                {d.title}
              </h3>
              <p className="mt-1.5 font-sans text-[14px] leading-relaxed text-[#526078]">{d.lead}</p>
              {d.tags && (
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {d.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border px-2.5 py-1 font-sans text-[11.5px] font-medium text-[#172033]/80"
                      style={{ borderColor: `rgba(${d.rgb}, 0.3)`, backgroundColor: `rgba(${d.rgb}, 0.08)` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {/* Port the pathway leaves from, desktop only */}
              <span
                className="absolute -bottom-[5px] left-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 rounded-full lg:block"
                style={{ backgroundColor: `rgb(${d.rgb})`, boxShadow: `0 0 0 3px #FFFFFF, 0 0 8px 1px rgba(${d.rgb}, 0.45)` }}
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>

        {/* ---------------- Pathways ----------------
            Desktop: four curves from the card ports into the core. Below
            `lg`, where the cards wrap, a single lit stem stands in. */}
        <svg
          viewBox="0 0 1000 160"
          preserveAspectRatio="none"
          className="omc-paths hidden h-40 w-full lg:block"
          aria-hidden="true"
        >
          <defs>
            {DOMAINS.map((d, i) => (
              <linearGradient key={d.title} id={`omc-path-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`rgb(${d.rgb})`} stopOpacity="0.9" />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.9" />
              </linearGradient>
            ))}
          </defs>
          {PATHS.map((p, i) => (
            <g key={p}>
              <path
                className="omc-path"
                d={p}
                fill="none"
                stroke={`url(#omc-path-${i})`}
                strokeWidth="1.6"
                vectorEffect="non-scaling-stroke"
                style={{ filter: `drop-shadow(0 0 3px rgba(${DOMAINS[i].rgb}, 0.35))` }}
              />
              <path
                className="omc-flow"
                d={p}
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity="0.9"
                strokeWidth="1.6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>
        <span
          className="mx-auto mt-6 block h-14 w-px bg-gradient-to-b from-[#60A5FA] via-[#A78BFA] to-[#F472B6] shadow-[0_0_6px_rgba(167,139,250,0.35)] lg:hidden"
          aria-hidden="true"
        />

        {/* ---------------- Engine ----------------
            Desktop: three capabilities | core | three capabilities. Below
            `lg` it stacks — three above the core, three below — and on a
            tablet each trio sits in a row of three. */}
        <div className="omc-engine mt-6 grid grid-cols-1 items-center gap-8 lg:mt-0 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-10 xl:gap-14">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-12">
            {CAPS_LEFT.map((c) => (
              <Capability key={c.title} cap={c} side="left" lit={hoveredConcept === c.title} />
            ))}
          </ul>

          <div className="omc-core mx-auto flex w-full max-w-[340px] flex-col items-center lg:w-[340px] xl:w-[380px] xl:max-w-[380px]">
            <div className="aspect-square w-full">
              <CoreVisual hovered={hovered} onHover={setHovered} />
            </div>
            <p className="-mt-4 font-serif text-2xl font-semibold tracking-[-0.01em]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#DB2777]">
                OmicMind Core™
              </span>
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-12">
            {CAPS_RIGHT.map((c) => (
              <Capability key={c.title} cap={c} side="right" lit={hoveredConcept === c.title} />
            ))}
          </ul>
        </div>

        {/* ---------------- Applications ----------------
            Six products, fed by the core above. One row from `lg`, three
            to a row on a tablet, two on a phone. Each card is a 1px
            blue-violet-magenta gradient shell around a navy face. */}
        <span
          className="mx-auto mt-12 block h-12 w-px bg-gradient-to-b from-[#A78BFA] to-[#A78BFA]/0 lg:mt-14"
          aria-hidden="true"
        />
        <ul className="omc-prods mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {PRODUCTS.map((p) => (
            <li
              key={p.name}
              className="omc-prod group rounded-2xl p-px"
              style={{
                backgroundImage:
                  'linear-gradient(160deg, rgba(96,165,250,0.45) 0%, #DDE3EE 50%, rgba(232,121,249,0.45) 100%)',
                boxShadow: `0 16px 36px -24px rgba(23,32,51,0.22), 0 14px 30px -26px rgba(${p.rgb}, 0.55)`,
              }}
            >
              <div
                className="flex h-full flex-col items-center rounded-[15px] px-3 pb-5 pt-5 text-center sm:px-4"
                style={{
                  backgroundImage: `radial-gradient(80% 55% at 50% 30%, rgba(${p.rgb}, 0.10) 0%, rgba(${p.rgb}, 0) 70%), linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)`,
                }}
              >
                <p className="font-sans text-[15px] font-semibold tracking-[-0.01em] text-[#172033]">
                  {p.name}
                </p>
                <div className="my-4 h-[72px] w-[72px] transition-transform duration-500 ease-out group-hover:scale-105 sm:h-20 sm:w-20" aria-hidden="true">
                  {p.visual}
                </div>
                <span
                  className="mb-3 block h-px w-8 rounded-full"
                  style={{ backgroundColor: `rgba(${p.rgb}, 0.6)` }}
                  aria-hidden="true"
                />
                <p className="font-sans text-[13px] leading-snug text-[#526078]">{p.label}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* ---------------- Closing statement ---------------- */}
        <div className="omc-close mx-auto mt-16 max-w-3xl text-center lg:mt-20">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <span className="h-px max-w-[120px] flex-1 bg-gradient-to-r from-transparent to-[#A78BFA]/60" aria-hidden="true" />
            <p className="font-sans text-[15px] font-semibold uppercase tracking-[0.2em] text-[#172033] sm:text-lg sm:tracking-[0.24em]">
              One Core. Multiple Possibilities.
            </p>
            <span className="h-px max-w-[120px] flex-1 bg-gradient-to-l from-transparent to-[#A78BFA]/60" aria-hidden="true" />
          </div>
          <p className="mt-4 font-sans text-[11.5px] font-medium uppercase tracking-[0.22em] text-[#526078] sm:text-[12.5px] sm:tracking-[0.28em]">
            A Healthier Tomorrow Through Deeper Biology
          </p>
        </div>
      </div>
    </section>
  );
}
