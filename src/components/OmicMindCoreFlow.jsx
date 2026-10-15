import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import quantIhc from '../assets/quantihc.webp';
import heField from '../assets/h&eclassification.webp';
import spatialMap from '../assets/spatial.webp';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   OmicMind Core workflow — Integrate → Learn → Predict

   Sits directly under the OmicMind Core section's closing statement, on
   the same navy ground. Three cards: the data rows of the first feed the
   core in the second, which fans out to the capability rows of the third.
   On desktop the curves between them are drawn from the measured positions
   of each row's port; below `lg` the cards stack and an arrow stands
   between each pair.

   Every class, keyframe and SVG id carries the `ocf-` prefix so none of it
   reaches another section.
================================================================ */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/* A site image cropped to its scientific content, for the small tiles. */
function Crop({ src, position, scale }) {
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      className="h-full w-full object-cover"
      style={{ objectPosition: position, transform: `scale(${scale})`, transformOrigin: position }}
    />
  );
}

const helixIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
    <path d="M8 3c0 4.5 8 4.5 8 9s-8 4.5-8 9" />
    <path d="M16 3c0 4.5-8 4.5-8 9s8 4.5 8 9" />
    <path d="M9.2 6h5.6M8.6 9.4h6.8M8.6 14.6h6.8M9.2 18h5.6" />
  </svg>
);

const clinicalIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
    <rect x="4.5" y="4" width="15" height="17" rx="2.2" />
    <path d="M9 4V2.8h6V4" />
    <path d="M8 13h2l1.4-2.6 2 4.6 1.4-2H16" />
  </svg>
);

/* ---------- 1 · Integrate ---------- */
const DATA_ROWS = [
  {
    label: 'Tissue Morphology',
    rgb: '96, 165, 250',
    visual: <Crop src={heField} position="50% 72%" scale={1.8} />,
  },
  {
    label: 'Biomarker Expression',
    rgb: '129, 140, 248',
    visual: <Crop src={quantIhc} position="72% 38%" scale={2.4} />,
  },
  {
    label: 'Spatial Biology',
    rgb: '167, 139, 250',
    visual: <Crop src={spatialMap} position="56% 27%" scale={5} />,
  },
  { label: 'Molecular Data', rgb: '192, 132, 252', icon: helixIcon },
  { label: 'Clinical Outcomes', rgb: '232, 121, 249', icon: clinicalIcon },
];

/* ---------- 3 · Predict ---------- */
const PREDICT_ROWS = [
  {
    label: 'Biomarker Discovery',
    rgb: '167, 139, 250',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M15.4 15.4 21 21" />
        <path d="M7.4 11.2h1.6l1-2 1.6 4 1-2h1" />
      </svg>
    ),
  },
  { label: 'Molecular Prediction', rgb: '180, 136, 251', icon: helixIcon },
  {
    label: 'Therapy Response',
    rgb: '192, 132, 252',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <path d="M3.4 20.4h17.2" />
        <path d="M4.6 16.4l4.2-4.6 3.4 2.6 6.8-8" />
        <path d="M15.6 6.4h3.4v3.4" />
      </svg>
    ),
  },
  {
    label: 'Patient Stratification',
    rgb: '216, 130, 250',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <circle cx="6.5" cy="7" r="2.4" />
        <circle cx="17.5" cy="7" r="2.4" />
        <path d="M2.8 15.5a3.7 3.7 0 017.4 0M13.8 15.5a3.7 3.7 0 017.4 0" />
        <path d="M12 3v18" strokeDasharray="1.6 2.6" />
      </svg>
    ),
  },
  {
    label: 'Trial Enrichment',
    rgb: '232, 121, 249',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <path d="M3.5 4.5h17l-6.5 8v6l-4 2v-8z" />
      </svg>
    ),
  },
  {
    label: 'ADC Intelligence',
    rgb: '244, 114, 182',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <path d="M12 13 6 5.5M12 13l6-7.5M12 13v8" />
        <circle cx="4.6" cy="9" r="1.6" />
        <circle cx="19.4" cy="9" r="1.6" />
      </svg>
    ),
  },
];

/* ---------- 2 · Learn: the core and its four inputs ---------- */
const SATELLITES = [
  {
    label: 'Histopathology',
    left: '14%',
    top: '13%',
    at: [56, 52],
    rgb: '96, 165, 250',
    visual: <Crop src={heField} position="50% 72%" scale={1.8} />,
  },
  {
    label: 'Spatial Biology',
    left: '86%',
    top: '13%',
    at: [344, 52],
    rgb: '167, 139, 250',
    visual: <Crop src={spatialMap} position="56% 27%" scale={5} />,
  },
  {
    label: 'Molecular Data',
    left: '14%',
    top: '80%',
    at: [56, 320],
    rgb: '192, 132, 252',
    icon: helixIcon,
  },
  {
    label: 'Clinical Data',
    left: '86%',
    top: '80%',
    at: [344, 320],
    rgb: '244, 114, 182',
    icon: clinicalIcon,
  },
];

const CORE_AT = [200, 176];

const MESH_POINTS = [
  [150, 138], [178, 122], [222, 122], [250, 138],
  [126, 172], [160, 166], [192, 156], [208, 186], [240, 166], [274, 172],
  [134, 214], [168, 206], [200, 222], [232, 206], [266, 214],
  [152, 250], [184, 244], [216, 244], [248, 250],
];
const MESH_EDGES = [];
MESH_POINTS.forEach((a, i) => {
  MESH_POINTS.slice(i + 1).forEach((b) => {
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 50) MESH_EDGES.push([a, b]);
  });
});

function LearnVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px] lg:max-w-none">
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="ocf-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0B1020" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ocf-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
          <linearGradient id="ocf-brain" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.24" />
            <stop offset="55%" stopColor="#8B5CF6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.24" />
          </linearGradient>
          <filter id="ocf-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Luminous lines from each input into the core */}
        {SATELLITES.map((s) => {
          const d = `M${s.at[0]} ${s.at[1]} L${CORE_AT[0]} ${CORE_AT[1]}`;
          return (
            <g key={s.label}>
              <path
                d={d}
                stroke={`rgb(${s.rgb})`}
                strokeOpacity="0.55"
                strokeWidth="1.4"
                style={{ filter: `drop-shadow(0 0 4px rgba(${s.rgb}, 0.8))` }}
              />
              <path className="ocf-flow" d={d} stroke="#F8FAFC" strokeOpacity="0.75" strokeWidth="1.4" strokeLinecap="round" />
            </g>
          );
        })}

        <circle className="ocf-pulse" cx={CORE_AT[0]} cy={CORE_AT[1]} r="120" fill="url(#ocf-glow)" />

        <g transform={`translate(${CORE_AT[0]} ${CORE_AT[1]}) scale(0.68) translate(-200 -200)`}>
          <circle cx="200" cy="200" r="182" fill="#0B1020" fillOpacity="0.6" />
          <g className="ocf-spin">
            <circle cx="200" cy="200" r="168" fill="none" stroke="url(#ocf-ring)" strokeOpacity="0.75" strokeWidth="1.8" strokeDasharray="120 38 18 38" />
            <circle cx="368" cy="200" r="5" fill="#F472B6" />
            <circle cx="32" cy="200" r="4.4" fill="#60A5FA" />
          </g>
          <g stroke="url(#ocf-ring)" strokeWidth="2.2" fill="url(#ocf-brain)" strokeLinejoin="round">
            <path d="M197 108 C168 94 128 104 118 134 C94 142 86 174 100 194 C86 214 94 248 120 256 C128 284 164 296 188 282 C193 288 197 290 197 290 Z" />
            <path d="M203 108 C232 94 272 104 282 134 C306 142 314 174 300 194 C314 214 306 248 280 256 C272 284 236 296 212 282 C207 288 203 290 203 290 Z" />
          </g>
          <g stroke="#E9D5FF" strokeOpacity="0.4" strokeWidth="1.2">
            {MESH_EDGES.map(([a, b], i) => (
              <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
            ))}
          </g>
          {MESH_POINTS.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="6" fill={i % 3 === 0 ? '#60A5FA' : i % 3 === 1 ? '#A78BFA' : '#F472B6'} opacity="0.5" filter="url(#ocf-soft)" />
              <circle className="ocf-node" style={{ animationDelay: `${(i % 6) * 0.45}s` }} cx={x} cy={y} r="3" fill="#F8FAFC" />
            </g>
          ))}
        </g>
      </svg>

      {/* The four inputs, laid over the line ends */}
      {SATELLITES.map((s) => (
        <div
          key={s.label}
          className="absolute flex w-[32%] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: s.left, top: s.top }}
        >
          <span
            className="flex aspect-square w-[64%] items-center justify-center overflow-hidden rounded-full border bg-[#0B1020]"
            style={{
              color: `rgb(${s.rgb})`,
              borderColor: `rgba(${s.rgb}, 0.5)`,
              boxShadow: `0 0 18px -4px rgba(${s.rgb}, 0.7)`,
            }}
          >
            {s.visual || s.icon}
          </span>
          <span className="mt-1.5 whitespace-nowrap text-center font-sans text-[10.5px] font-medium leading-tight text-[#BFDBFE]/80 sm:text-[11.5px] lg:text-[10.5px] xl:text-[11.5px]">
            {s.label}
          </span>
        </div>
      ))}

      {/* The core's name, under the brain */}
      <p
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-[1.05rem] font-semibold tracking-[-0.01em] sm:text-lg lg:text-[0.9rem] xl:text-lg"
        style={{ top: '75%' }}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93C5FD] via-[#C4B5FD] to-[#F9A8D4]">
          OmicMind Core™
        </span>
      </p>

      {/* Desktop ports where the flow enters and leaves the card */}
      <span data-ocf="learn-in" className="ocf-port absolute -left-[34px] top-[calc(44%-5px)] hidden h-2.5 w-2.5 rounded-full bg-[#A78BFA] shadow-[0_0_10px_1px_rgba(167,139,250,0.8)] lg:block" />
      <span data-ocf="learn-out" className="ocf-port absolute -right-[34px] top-[calc(44%-5px)] hidden h-2.5 w-2.5 rounded-full bg-[#C084FC] shadow-[0_0_10px_1px_rgba(192,132,252,0.8)] lg:block" />
    </div>
  );
}

/* A data or capability row: a tile, its label, and — on desktop — a port
   on the card edge facing the core. */
function FlowRow({ row, port, side }) {
  return (
    <li className="relative z-[1] flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0E1430] px-3 py-2.5">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
        style={{
          color: `rgb(${row.rgb})`,
          borderColor: `rgba(${row.rgb}, 0.45)`,
          backgroundColor: `rgba(${row.rgb}, 0.08)`,
          boxShadow: `0 0 14px -6px rgba(${row.rgb}, 0.8)`,
        }}
      >
        {row.visual || row.icon}
      </span>
      <span className="font-sans text-[14px] font-medium leading-snug tracking-[-0.01em] text-[#E2E8F0]">
        {row.label}
      </span>
      <span
        data-ocf={port}
        className={`ocf-port absolute top-[calc(50%-4px)] hidden h-2 w-2 rounded-full lg:block ${
          side === 'right' ? '-right-[33px]' : '-left-[33px]'
        }`}
        style={{ backgroundColor: `rgb(${row.rgb})`, boxShadow: `0 0 10px 1px rgba(${row.rgb}, 0.8)` }}
        aria-hidden="true"
      />
    </li>
  );
}

function RowList({ rows, port, side, from, to }) {
  return (
    <ul className="relative mt-6 flex flex-1 flex-col gap-2.5 lg:justify-between">
      {/* The thread linking the rows, running behind the tiles */}
      <span
        className="pointer-events-none absolute bottom-5 left-[30px] top-5 w-px"
        style={{ backgroundImage: `linear-gradient(180deg, ${from}, ${to})`, opacity: 0.55 }}
        aria-hidden="true"
      />
      {rows.map((r) => (
        <FlowRow key={r.label} row={r} port={port} side={side} />
      ))}
    </ul>
  );
}

const STEPS = [
  {
    n: '1',
    title: 'Integrate',
    subtitle: 'Multimodal Biology',
    description: 'Build a unified view of each tumor.',
    border: 'linear-gradient(160deg, rgba(96,165,250,0.7) 0%, rgba(129,140,248,0.4) 50%, rgba(167,139,250,0.6) 100%)',
    glow: '96, 165, 250',
    body: <RowList rows={DATA_ROWS} port="integrate" side="right" from="#60A5FA" to="#E879F9" />,
  },
  {
    n: '2',
    title: 'Learn',
    subtitle: 'Cross-Modal Relationships',
    description: 'Connect what the tissue looks like with the biology underneath.',
    border: 'linear-gradient(160deg, rgba(96,165,250,0.7) 0%, rgba(167,139,250,0.7) 50%, rgba(232,121,249,0.7) 100%)',
    glow: '167, 139, 250',
    center: true,
    body: (
      <div className="mt-6 flex flex-1 items-center">
        <LearnVisual />
      </div>
    ),
  },
  {
    n: '3',
    title: 'Predict',
    subtitle: 'Therapeutic Intelligence',
    description: 'Translate tumor biology into research-ready predictions.',
    border: 'linear-gradient(160deg, rgba(167,139,250,0.6) 0%, rgba(192,132,252,0.4) 50%, rgba(244,114,182,0.7) 100%)',
    glow: '232, 121, 249',
    body: <RowList rows={PREDICT_ROWS} port="predict" side="left" from="#A78BFA" to="#F472B6" />,
  },
];

/* Position of `el`'s centre within `root`, summed through offsetParents so
   the GSAP entrance transforms don't skew the measurement. */
function centreWithin(el, root) {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  let n = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent;
  }
  return n === root ? [x, y] : null;
}

const curve = ([x1, y1], [x2, y2]) => {
  const mx = (x1 + x2) / 2;
  return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
};

export default function OmicMindCoreFlow() {
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const [links, setLinks] = useState({ w: 0, h: 0, into: [], out: [] });

  /* Desktop connectors, redrawn whenever the layout moves. */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    const measure = () => {
      if (window.innerWidth < 1024) {
        setLinks((l) => (l.into.length ? { w: 0, h: 0, into: [], out: [] } : l));
        return;
      }
      const at = (sel) => [...wrap.querySelectorAll(sel)].map((el) => centreWithin(el, wrap)).filter(Boolean);
      const [learnIn] = at('[data-ocf="learn-in"]');
      const [learnOut] = at('[data-ocf="learn-out"]');
      if (!learnIn || !learnOut) return;
      setLinks({
        w: wrap.offsetWidth,
        h: wrap.offsetHeight,
        into: at('[data-ocf="integrate"]').map((p) => ({ d: curve(p, learnIn), x1: p[0], x2: learnIn[0] })),
        out: at('[data-ocf="predict"]').map((p) => ({ d: curve(learnOut, p), x1: learnOut[0], x2: p[0] })),
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.from('.ocf-card', {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: { trigger: wrapRef.current, start: 'top 82%' },
      });
      gsap.from('.ocf-links', {
        opacity: 0,
        duration: 1.2,
        delay: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: wrapRef.current, start: 'top 82%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#070B1A] pb-24 lg:pb-32">
      <style>{`
        .ocf-spin { transform-origin: 200px 200px; animation: ocf-spin 40s linear infinite; }
        .ocf-pulse { transform-origin: ${CORE_AT[0]}px ${CORE_AT[1]}px; animation: ocf-pulse 5s ease-in-out infinite; }
        .ocf-node { animation: ocf-node 3s ease-in-out infinite; }
        .ocf-flow { stroke-dasharray: 3 14; animation: ocf-flow 2.4s linear infinite; }
        @keyframes ocf-spin { to { transform: rotate(360deg); } }
        @keyframes ocf-pulse { 0%, 100% { opacity: 0.75; transform: scale(0.97); } 50% { opacity: 1; transform: scale(1.03); } }
        @keyframes ocf-node { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
        @keyframes ocf-flow { to { stroke-dashoffset: -34; } }
        @media (prefers-reduced-motion: reduce) {
          .ocf-spin, .ocf-pulse, .ocf-node, .ocf-flow { animation: none; }
        }
      `}</style>

      {/* Ambient wash, continuing the Core section's ground */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(40% 50% at 20% 50%, rgba(59,130,246,0.10) 0%, rgba(59,130,246,0) 70%), radial-gradient(36% 50% at 50% 50%, rgba(124,58,237,0.14) 0%, rgba(124,58,237,0) 70%), radial-gradient(40% 50% at 82% 50%, rgba(236,72,153,0.10) 0%, rgba(236,72,153,0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div ref={wrapRef} className="relative mx-auto max-w-2xl lg:max-w-none">
          {/* Desktop connectors: data rows → core, core → capabilities */}
          {links.into.length > 0 && (
            <svg
              className="ocf-links pointer-events-none absolute inset-0 z-20 hidden lg:block"
              width={links.w}
              height={links.h}
              aria-hidden="true"
            >
              <defs>
                {links.into.map((l, i) => (
                  <linearGradient key={i} id={`ocf-in-${i}`} gradientUnits="userSpaceOnUse" x1={l.x1} y1="0" x2={l.x2} y2="0">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                ))}
                {links.out.map((l, i) => (
                  <linearGradient key={i} id={`ocf-out-${i}`} gradientUnits="userSpaceOnUse" x1={l.x1} y1="0" x2={l.x2} y2="0">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#F472B6" />
                  </linearGradient>
                ))}
              </defs>
              {[...links.into.map((l, i) => [l, `ocf-in-${i}`, '96,165,250']), ...links.out.map((l, i) => [l, `ocf-out-${i}`, '232,121,249'])].map(
                ([l, id, glow]) => (
                  <g key={id}>
                    <path
                      d={l.d}
                      fill="none"
                      stroke={`url(#${id})`}
                      strokeOpacity="0.85"
                      strokeWidth="1.4"
                      style={{ filter: `drop-shadow(0 0 3px rgba(${glow}, 0.7))` }}
                    />
                    <path className="ocf-flow" d={l.d} fill="none" stroke="#F8FAFC" strokeOpacity="0.7" strokeWidth="1.4" strokeLinecap="round" />
                  </g>
                )
              )}
            </svg>
          )}

          <ol
            aria-label="OmicMind Core workflow: Integrate, Learn, Predict"
            className="relative grid grid-cols-1 items-stretch p-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)_minmax(0,1fr)] lg:gap-14 xl:gap-16"
          >
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex list-none flex-col">
                <div
                  className="ocf-card relative flex-1 rounded-[22px] p-px"
                  style={{ backgroundImage: s.border, boxShadow: `0 24px 54px -30px rgba(${s.glow}, 0.75)` }}
                >
                  <div
                    className="relative flex h-full flex-col rounded-[21px] p-6 sm:p-7"
                    style={{
                      backgroundImage: `radial-gradient(90% 40% at 50% 0%, rgba(${s.glow}, 0.12) 0%, rgba(${s.glow}, 0) 70%), linear-gradient(180deg, #0D1328 0%, #0A0F22 100%)`,
                    }}
                  >
                    {/* Top sheen */}
                    <span
                      className="pointer-events-none absolute inset-x-6 top-0 h-px"
                      style={{ backgroundImage: `linear-gradient(90deg, transparent, rgba(${s.glow}, 0.8), transparent)` }}
                      aria-hidden="true"
                    />

                    <div className="flex items-start gap-4">
                      <span className="font-serif text-[3.25rem] font-semibold leading-[0.9] sm:text-[3.75rem]" aria-hidden="true">
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#93C5FD] via-[#A78BFA] to-[#F472B6]">
                          {s.n}
                        </span>
                      </span>
                      <div className="pt-1">
                        <h3 className="font-sans text-lg font-semibold uppercase tracking-[0.18em] text-[#F8FAFC] sm:text-xl">
                          <span className="sr-only">{s.n}. </span>
                          {s.title}
                        </h3>
                        <p className="mt-1 font-sans text-[14.5px] font-medium text-[#93C5FD]">{s.subtitle}</p>
                      </div>
                    </div>
                    <p className="mt-4 font-sans text-[14.5px] leading-relaxed text-[#BFDBFE]/75 [text-wrap:pretty]">
                      {s.description}
                    </p>

                    {s.body}
                  </div>
                </div>

                {/* Stacked layouts: the arrow to the next step */}
                {i < STEPS.length - 1 && (
                  <div className="flex flex-col items-center py-4 lg:hidden" aria-hidden="true">
                    <span className="h-6 w-px bg-gradient-to-b from-[#60A5FA]/0 to-[#A78BFA]" />
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#A78BFA]/40 bg-[#0D1328] text-[#C4B5FD] shadow-[0_0_16px_-4px_rgba(167,139,250,0.7)]">
                      <ArrowDown className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <span className="h-6 w-px bg-gradient-to-b from-[#A78BFA] to-[#F472B6]/0" />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
