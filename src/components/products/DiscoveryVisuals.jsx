import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { RotateCw } from 'lucide-react';

/* ------------------------------------------------------------------
   Illustrations for Biomarker & Drug Discovery™: the card's discovery
   pipeline, the animated signal branches and the discovery flywheel.
   All schematic.
------------------------------------------------------------------ */

const CAPTION = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 8.5,
  fontWeight: 600,
  letterSpacing: '0.08em',
};

const PINK = '#F9A8D4';
const LAVENDER = '#A78BFA';
const BLUE = '#93C5FD';

/* ==================================================================
   Card / header visual — Tissue → Signals → Biomarkers → Targets →
   Drugs, left to right, with one pulse travelling the line.
================================================================== */
const STAGES = [
  { x: 44, label: 'TISSUE' },
  { x: 102, label: 'SIGNALS' },
  { x: 160, label: 'BIOMARKERS' },
  { x: 218, label: 'TARGETS' },
  { x: 276, label: 'DRUGS' },
];
const CY = 90;

function Glyph({ i, x }) {
  switch (i) {
    case 0: // patient tissue — a small cluster of cells
      return (
        <g>
          <ellipse cx={x} cy={CY} rx="18" ry="15" fill="rgba(249,168,212,0.08)" stroke={PINK} strokeOpacity="0.45" strokeWidth="1" />
          {[
            [-8, -5],
            [1, -8],
            [9, -2],
            [-6, 5],
            [4, 6],
            [-1, -1],
          ].map(([dx, dy], k) => (
            <g key={k}>
              <circle cx={x + dx} cy={CY + dy} r="3.6" fill={PINK} fillOpacity="0.18" stroke={PINK} strokeOpacity="0.7" strokeWidth="0.8" />
              <circle cx={x + dx} cy={CY + dy} r="1.1" fill={PINK} />
            </g>
          ))}
        </g>
      );
    case 1: // biological signals — a small signal trace
      return (
        <g>
          <rect x={x - 19} y={CY - 15} width="38" height="30" rx="6" fill="rgba(167,139,250,0.06)" stroke={LAVENDER} strokeOpacity="0.35" strokeWidth="1" />
          <polyline
            points={`${x - 15},${CY + 7} ${x - 9},${CY + 6} ${x - 6},${CY - 6} ${x - 3},${CY + 5} ${x + 1},${CY + 3} ${x + 4},${CY - 10} ${x + 8},${CY + 6} ${x + 15},${CY + 5}`}
            fill="none"
            stroke={LAVENDER}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </g>
      );
    case 2: { // biomarkers — a small network with one highlighted node
      const nodes = [
        [-11, -8],
        [9, -10],
        [-12, 9],
        [10, 8],
        [0, 0],
      ];
      return (
        <g>
          {nodes.slice(0, 4).map(([dx, dy], k) => (
            <line key={k} x1={x} y1={CY} x2={x + dx} y2={CY + dy} stroke={LAVENDER} strokeOpacity="0.45" strokeWidth="1" />
          ))}
          <line x1={x - 11} y1={CY - 8} x2={x + 9} y2={CY - 10} stroke={LAVENDER} strokeOpacity="0.3" strokeWidth="1" />
          {nodes.map(([dx, dy], k) => (
            <circle
              key={k}
              cx={x + dx}
              cy={CY + dy}
              r={k === 4 ? 4.4 : 3}
              fill={k === 4 ? '#EC4899' : '#101B2E'}
              stroke={k === 4 ? '#F9A8D4' : BLUE}
              strokeWidth="1.1"
            />
          ))}
        </g>
      );
    }
    case 3: // therapeutic target — reticle
      return (
        <g fill="none" stroke={LAVENDER} strokeWidth="1.1">
          <circle cx={x} cy={CY} r="15" strokeOpacity="0.4" />
          <circle cx={x} cy={CY} r="9" strokeOpacity="0.7" />
          <circle cx={x} cy={CY} r="3" fill="#E879F9" stroke="none" />
          <path d={`M${x} ${CY - 19}v6M${x} ${CY + 13}v6M${x - 19} ${CY}h6M${x + 13} ${CY}h6`} strokeOpacity="0.6" />
        </g>
      );
    default: { // drug opportunity — a small molecule
      const hex = Array.from({ length: 6 }, (_, k) => {
        const a = (Math.PI / 3) * k - Math.PI / 2;
        return [x - 3 + 9 * Math.cos(a), CY + 9 * Math.sin(a)];
      });
      return (
        <g>
          <polygon points={hex.map((p) => p.join(',')).join(' ')} fill="rgba(236,72,153,0.08)" stroke={PINK} strokeWidth="1.2" />
          <line x1={hex[1][0]} y1={hex[1][1]} x2={hex[1][0] + 8} y2={hex[1][1] - 6} stroke={PINK} strokeWidth="1.2" />
          <circle cx={hex[1][0] + 9.5} cy={hex[1][1] - 7} r="2.4" fill={PINK} />
          <line x1={hex[3][0]} y1={hex[3][1]} x2={hex[3][0]} y2={hex[3][1] + 7} stroke={PINK} strokeWidth="1.2" />
          <circle cx={hex[3][0]} cy={hex[3][1] + 9} r="2.4" fill={LAVENDER} />
        </g>
      );
    }
  }
}

export function DiscoveryVisual() {
  const reduce = useReducedMotion();
  const x0 = STAGES[0].x + 22;
  const x1 = STAGES[STAGES.length - 1].x - 22;

  return (
    <svg viewBox="0 0 320 180" className="h-auto w-full" aria-hidden="true">
      <rect x="10" y="12" width="300" height="156" rx="12" fill="#101B2E" stroke="rgba(167,139,250,0.31)" strokeWidth="1.2" />
      <path d="M10 33h300" stroke="rgba(167,139,250,0.24)" strokeWidth="1" />
      <circle cx="24" cy="22.5" r="2.2" fill="rgba(167,139,250,0.47)" />
      <circle cx="33" cy="22.5" r="2.2" fill="rgba(232,121,249,0.44)" />
      <circle cx="42" cy="22.5" r="2.2" fill="rgba(244,114,182,0.43)" />
      <text x="58" y="25.5" fill="#94A3B8" {...CAPTION}>
        DISCOVERY PIPELINE
      </text>

      {/* Connectors between stages */}
      {STAGES.slice(0, -1).map((s, i) => (
        <g key={s.label}>
          <line x1={s.x + 22} y1={CY} x2={STAGES[i + 1].x - 23} y2={CY} stroke="rgba(167,139,250,0.4)" strokeWidth="1" />
          <path
            d={`M${STAGES[i + 1].x - 26} ${CY - 2.5}L${STAGES[i + 1].x - 23} ${CY}L${STAGES[i + 1].x - 26} ${CY + 2.5}`}
            fill="none"
            stroke="rgba(167,139,250,0.6)"
            strokeWidth="1"
          />
        </g>
      ))}

      {STAGES.map((s, i) => (
        <g key={s.label}>
          <Glyph i={i} x={s.x} />
          <text x={s.x} y="134" textAnchor="middle" fill={i === STAGES.length - 1 ? '#F8FAFC' : '#CBD5E1'} {...CAPTION} fontSize="7.2">
            {s.label}
          </text>
        </g>
      ))}

      {/* Progress rail along the bottom */}
      <rect x="26" y="150" width="268" height="3" rx="1.5" fill="rgba(167,139,250,0.14)" />
      <rect x="26" y="150" width="268" height="3" rx="1.5" fill="url(#discovery-rail)" opacity="0.7" />
      <defs>
        <linearGradient id="discovery-rail" x1="0" x2="1">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>

      {!reduce && (
        <motion.circle
          r="2.4"
          cy={CY}
          fill="#ffffff"
          stroke="#A855F7"
          strokeWidth="1.4"
          initial={{ cx: x0, opacity: 0 }}
          animate={{ cx: [x0, x1], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.2, ease: 'linear', repeat: Infinity, repeatDelay: 0.8 }}
        />
      )}
    </svg>
  );
}

/* ==================================================================
   One node branching into `count` columns ('out'), or `count` columns
   joining into one ('in'). Drawn for wide screens, where the columns
   are an even grid; the dashes drift slowly along the direction of
   flow when motion is allowed.
================================================================== */
export function Branch({ count, direction = 'out', className = '' }) {
  const reduce = useReducedMotion();
  const W = 1000;
  const H = 56;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={`h-14 w-full ${className}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const x = ((i + 0.5) / count) * W;
        const d = direction === 'out' ? `M${W / 2} 0 C ${W / 2} ${H * 0.55}, ${x} ${H * 0.45}, ${x} ${H}` : `M${x} 0 C ${x} ${H * 0.55}, ${W / 2} ${H * 0.45}, ${W / 2} ${H}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="rgba(196,181,253,0.18)" strokeWidth="1" />
            {reduce ? (
              <path d={d} fill="none" stroke="rgba(196,181,253,0.5)" strokeWidth="1" strokeDasharray="3 7" />
            ) : (
              <motion.path
                d={d}
                fill="none"
                stroke="rgba(196,181,253,0.55)"
                strokeWidth="1"
                strokeDasharray="3 7"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ duration: 1.6, ease: 'linear', repeat: Infinity }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ==================================================================
   The Discovery Flywheel. A ring of stages; the highlight advances
   stage by stage while the wheel is on screen, and each stage it
   passes stays lit until the loop starts over — every layer feeding
   the next. Phones get the same loop as a vertical list.
================================================================== */
const R = 150;
const C = 200;
const GAP_DEG = 15;

const polar = (deg, r = R) => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};

export function DiscoveryFlywheel({ steps, centerTitle, centerNote }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-80px' });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(steps.length - 1);
  const n = steps.length;

  useEffect(() => {
    if (!inView || reduce) return undefined;
    const t = setInterval(() => setActive((a) => (a + 1) % n), 1500);
    return () => clearInterval(t);
  }, [inView, reduce, n]);

  const angleOf = (i) => -90 + (i * 360) / n;
  const lit = (i) => reduce || i <= active;

  return (
    <div ref={ref}>
      {/* Ring — from sm */}
      <div className="relative mx-auto hidden aspect-square w-full max-w-[480px] sm:block">
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <marker id="flywheel-head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M1 1L8 5L1 9" fill="none" stroke="#C4B5FD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          <circle cx={C} cy={C} r={R + 34} fill="none" stroke="rgba(167,139,250,0.06)" />
          <circle cx={C} cy={C} r={R - 46} fill="rgba(124,58,237,0.05)" stroke="rgba(167,139,250,0.12)" />
          {steps.map((_, i) => {
            const a0 = angleOf(i) + GAP_DEG;
            const a1 = angleOf(i + 1) - GAP_DEG;
            const [x0, y0] = polar(a0);
            const [x1, y1] = polar(a1);
            /* Arc i joins stage i to the next; the closing arc lights as the loop completes. */
            const on = reduce || i < active || (i === n - 1 && active === n - 1);
            return (
              <path
                key={i}
                d={`M${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`}
                fill="none"
                stroke={on ? 'rgba(232,121,249,0.75)' : 'rgba(167,139,250,0.3)'}
                strokeWidth={on ? 1.6 : 1.1}
                markerEnd="url(#flywheel-head)"
                style={{ transition: 'stroke 0.5s ease, stroke-width 0.5s ease' }}
              />
            );
          })}
        </svg>

        {/* Centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-[170px] text-center">
            <RotateCw className="mx-auto h-6 w-6 text-[#C4B5FD]" strokeWidth={1.6} aria-hidden="true" />
            <p className="mt-2 font-serif text-[1.05rem] font-semibold leading-snug text-white">{centerTitle}</p>
            {centerNote && <p className="mt-1 font-sans text-[11.5px] leading-snug text-slate-400">{centerNote}</p>}
          </div>
        </div>

        {/* Stage nodes */}
        <ol aria-label="Discovery flywheel stages">
          {steps.map((step, i) => {
            const [x, y] = polar(angleOf(i));
            const current = !reduce && i === active;
            return (
              <li
                key={step}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(x / 400) * 100}%`, top: `${(y / 400) * 100}%` }}
                aria-current={current ? 'step' : undefined}
              >
                <span
                  className={`block whitespace-nowrap rounded-full p-px transition-all duration-500 ${
                    current ? 'bg-gradient-to-r from-[#A78BFA] to-[#EC4899]' : lit(i) ? 'bg-[#C4B5FD]/40' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans text-[12.5px] font-semibold transition-colors duration-500 ${
                      current ? 'bg-[#1A1433] text-white' : 'bg-[#0E1626] ' + (lit(i) ? 'text-slate-100' : 'text-slate-400')
                    }`}
                  >
                    <span className="tabular-nums text-[10.5px] text-slate-500">{String(i + 1).padStart(2, '0')}</span>
                    {step}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Loop as a list — phones */}
      <ol className="space-y-2 sm:hidden" aria-label="Discovery flywheel stages">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#C4B5FD]/40 font-sans text-[11px] font-semibold tabular-nums text-[#DDD6FE]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-sans text-[14px] font-semibold text-slate-100">{step}</span>
          </li>
        ))}
        <li className="flex items-center gap-3 pt-1 text-[#C4B5FD]">
          <RotateCw className="ml-1.5 h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span className="font-sans text-[13px] font-medium">Back to {steps[0]} — {centerTitle.toLowerCase()}</span>
        </li>
      </ol>
    </div>
  );
}
