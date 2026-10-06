import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ICONS } from './InsightCard.jsx';

/* ------------------------------------------------------------------
   Illustrations for Drug Development Intelligence™: the card's layers
   of evidence converging on a development decision, the step-by-step
   decision journey and the evidence layer beneath the lifecycle.
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

/* Advance an index 0 … n-1 every `ms` while `ref` is on screen. */
function useCycle(ref, n, ms) {
  const inView = useInView(ref, { margin: '-40px' });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => clearInterval(t);
  }, [inView, reduce, n, ms]);
  return { i, reduce };
}

/* ==================================================================
   Card / header visual — four layers of evidence, top to bottom, each
   feeding the development decision on the right. The layers light in
   order, then the decision.
================================================================== */
const ROWS = [
  { y: 56, label: 'PATIENT BIOLOGY' },
  { y: 83, label: 'BIOMARKERS' },
  { y: 110, label: 'TREATMENT RESPONSE' },
  { y: 137, label: 'CLINICAL OUTCOMES' },
];
const ROW_X0 = 22;
const ROW_X1 = 170;
const NODE = { x: 254, y: 96 };

function RowGlyph({ i, x, y }) {
  switch (i) {
    case 0: // patient tissue — a small cell cluster
      return (
        <g>
          {[
            [-4, -3],
            [3, -4],
            [5, 3],
            [-3, 4],
            [0, 0],
          ].map(([dx, dy], k) => (
            <circle key={k} cx={x + dx} cy={y + dy} r="2.6" fill={PINK} fillOpacity="0.2" stroke={PINK} strokeOpacity="0.75" strokeWidth="0.7" />
          ))}
        </g>
      );
    case 1: // biomarker signal — expression bars
      return (
        <g>
          {[4, 8, 5, 10].map((h, k) => (
            <rect key={k} x={x - 7 + k * 3.8} y={y + 5 - h} width="2.4" height={h} rx="0.8" fill={k === 3 ? '#E879F9' : LAVENDER} fillOpacity={k === 3 ? 0.9 : 0.6} />
          ))}
        </g>
      );
    case 2: // treatment response — waterfall bars around a baseline
      return (
        <g>
          <line x1={x - 8} y1={y - 1} x2={x + 8} y2={y - 1} stroke="rgba(226,232,240,0.35)" strokeWidth="0.6" />
          {[-5, -3, -1, 2, 4, 6].map((h, k) => (
            <rect
              key={k}
              x={x - 7.5 + k * 2.6}
              y={h < 0 ? y - 1 + h : y - 1}
              width="1.8"
              height={Math.abs(h)}
              fill={h > 0 ? PINK : BLUE}
              fillOpacity="0.75"
            />
          ))}
        </g>
      );
    default: // clinical outcomes — a step curve
      return (
        <path
          d={`M${x - 8} ${y - 6} H${x - 4} V${y - 3} H${x} V${y} H${x + 3} V${y + 3} H${x + 8}`}
          fill="none"
          stroke={BLUE}
          strokeWidth="1.1"
        />
      );
  }
}

const curve = (y) => [
  [ROW_X1, y],
  [ROW_X1 + 34, y],
  [NODE.x - 70, NODE.y],
  [NODE.x - 40, NODE.y],
];
const connector = (y) => {
  const [a, b, c, d] = curve(y);
  return `M${a[0]} ${a[1]} C ${b[0]} ${b[1]}, ${c[0]} ${c[1]}, ${d[0]} ${d[1]}`;
};
/* Points along a connector, for the pulse's keyframes. */
const samples = (y, n = 14) => {
  const [a, b, c, d] = curve(y);
  return Array.from({ length: n + 1 }, (_, k) => {
    const t = k / n;
    const u = 1 - t;
    const f = (i) => u * u * u * a[i] + 3 * u * u * t * b[i] + 3 * u * t * t * c[i] + t * t * t * d[i];
    return [f(0), f(1)];
  });
};

export function DrugDevVisual() {
  const ref = useRef(null);
  /* 0–3: an evidence layer; 4: the decision. */
  const { i: active, reduce } = useCycle(ref, ROWS.length + 1, 1100);
  const lit = (k) => reduce || k <= active;
  const deciding = reduce || active === ROWS.length;

  return (
    <svg ref={ref} viewBox="0 0 320 180" className="h-auto w-full" aria-hidden="true">
      <rect x="10" y="12" width="300" height="156" rx="12" fill="#101B2E" stroke="rgba(167,139,250,0.31)" strokeWidth="1.2" />
      <path d="M10 33h300" stroke="rgba(167,139,250,0.24)" strokeWidth="1" />
      <circle cx="24" cy="22.5" r="2.2" fill="rgba(167,139,250,0.47)" />
      <circle cx="33" cy="22.5" r="2.2" fill="rgba(232,121,249,0.44)" />
      <circle cx="42" cy="22.5" r="2.2" fill="rgba(244,114,182,0.43)" />
      <text x="58" y="25.5" fill="#94A3B8" {...CAPTION}>
        DEVELOPMENT EVIDENCE
      </text>

      {/* Progression down the layers */}
      <line x1={ROW_X0 + 15} y1={ROWS[0].y + 9} x2={ROW_X0 + 15} y2={ROWS[3].y - 9} stroke="rgba(196,181,253,0.18)" strokeWidth="1" strokeDasharray="2 2" />

      {ROWS.map((r, k) => {
        const on = lit(k);
        const current = !reduce && k === active;
        return (
          <g key={r.label}>
            <path
              d={connector(r.y)}
              fill="none"
              stroke={on ? 'rgba(232,121,249,0.55)' : 'rgba(167,139,250,0.22)'}
              strokeWidth={current ? 1.3 : 1}
              style={{ transition: 'stroke 0.5s ease' }}
            />
            <rect
              x={ROW_X0}
              y={r.y - 10}
              width={ROW_X1 - ROW_X0}
              height="20"
              rx="6"
              fill={current ? 'rgba(124,58,237,0.16)' : 'rgba(255,255,255,0.025)'}
              stroke={on ? 'rgba(196,181,253,0.5)' : 'rgba(255,255,255,0.08)'}
              strokeWidth="0.9"
              style={{ transition: 'fill 0.5s ease, stroke 0.5s ease' }}
            />
            <RowGlyph i={k} x={ROW_X0 + 15} y={r.y} />
            <text x={ROW_X0 + 30} y={r.y + 2.6} fill={on ? '#E2E8F0' : '#94A3B8'} {...CAPTION} fontSize="7" style={{ transition: 'fill 0.5s ease' }}>
              {r.label}
            </text>
          </g>
        );
      })}

      {/* One pulse travelling from the current layer to the decision */}
      {!reduce && active < ROWS.length && (
        <motion.circle
          key={active}
          r="2"
          fill="#ffffff"
          stroke="#A855F7"
          strokeWidth="1.2"
          initial={{ cx: ROW_X1, cy: ROWS[active].y, opacity: 0 }}
          animate={{
            cx: samples(ROWS[active].y).map((p) => p[0]),
            cy: samples(ROWS[active].y).map((p) => p[1]),
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      )}

      {/* Development decision */}
      <rect
        x={NODE.x - 40}
        y={NODE.y - 22}
        width="80"
        height="44"
        rx="10"
        fill={deciding ? 'rgba(124,58,237,0.2)' : '#121B2E'}
        stroke={deciding ? '#F9A8D4' : 'rgba(196,181,253,0.45)'}
        strokeWidth="1.1"
        style={{ transition: 'fill 0.5s ease, stroke 0.5s ease' }}
      />
      {/* Milestone flag */}
      <g transform={`translate(${NODE.x - 4} ${NODE.y - 15})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 0V11" stroke="#E9D5FF" strokeWidth="1.1" />
        <path d="M0 0.5H8L6.2 3.2L8 6H0" fill={deciding ? 'rgba(236,72,153,0.6)' : 'rgba(167,139,250,0.3)'} stroke={deciding ? PINK : LAVENDER} strokeWidth="0.9" style={{ transition: 'fill 0.5s ease' }} />
      </g>
      <text x={NODE.x} y={NODE.y + 7} textAnchor="middle" fill="#F8FAFC" {...CAPTION} fontSize="6.8">
        DEVELOPMENT
      </text>
      <text x={NODE.x} y={NODE.y + 16} textAnchor="middle" fill="#F8FAFC" {...CAPTION} fontSize="6.8">
        DECISION
      </text>

      {/* Footer rail */}
      <rect x="22" y="154" width="276" height="3" rx="1.5" fill="rgba(167,139,250,0.14)" />
      <motion.rect
        x="22"
        y="154"
        height="3"
        rx="1.5"
        fill="url(#drugdev-rail)"
        animate={{ width: reduce ? 276 : (276 * (active + 1)) / (ROWS.length + 1) }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <defs>
        <linearGradient id="drugdev-rail" x1="0" x2="1">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ==================================================================
   From Patient Biology to Development Decisions. Connected nodes —
   horizontal from `lg`, vertical below. The highlight walks the
   journey while it is on screen; choosing a step stops the walk and
   keeps that step selected. The selected step's note shows beneath.
================================================================== */
export function DecisionJourney({ steps }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-80px' });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const n = steps.length;

  useEffect(() => {
    if (!inView || reduce || pinned) return undefined;
    const t = setInterval(() => setActive((a) => (a + 1) % n), 1800);
    return () => clearInterval(t);
  }, [inView, reduce, pinned, n]);

  const choose = (i) => {
    setPinned(true);
    setActive(i);
  };

  const vars = {
    '--cols': `repeat(${n}, minmax(0, 1fr))`,
    '--rail': `${100 / (n * 2)}%`,
  };
  const progress = n > 1 ? active / (n - 1) : 1;

  return (
    <div ref={ref}>
      <ol className="relative grid gap-3 lg:gap-3 lg:[grid-template-columns:var(--cols)]" style={vars} aria-label="Decision journey">
        {/* Rail, and its filled part up to the selected step */}
        <span
          className="pointer-events-none absolute bottom-5 left-[19px] top-5 w-px bg-white/10 lg:bottom-auto lg:left-[var(--rail)] lg:right-[var(--rail)] lg:top-[19px] lg:h-px lg:w-auto"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute left-[19px] top-5 block w-px bg-gradient-to-b from-[#A78BFA] to-[#EC4899] transition-all duration-500 lg:hidden"
          style={{ height: `calc((100% - 40px) * ${progress})` }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute left-[var(--rail)] top-[19px] hidden h-px bg-gradient-to-r from-[#A78BFA] to-[#EC4899] transition-all duration-500 lg:block"
          style={{ width: `calc((100% - 2 * var(--rail)) * ${progress})` }}
          aria-hidden="true"
        />

        {steps.map((s, i) => {
          const Icon = ICONS[s.icon];
          const current = i === active;
          const passed = i < active;
          const last = i === n - 1;
          return (
            <li key={s.label} className="relative">
              <button
                type="button"
                onClick={() => choose(i)}
                aria-pressed={current}
                className="group/step flex w-full items-center gap-4 rounded-[14px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] lg:flex-col lg:gap-3 lg:text-center"
              >
                <span
                  className={`relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-[#0E1626] transition-all duration-500 ${
                    current
                      ? 'border-[#C4B5FD] text-white shadow-[0_0_0_5px_rgba(124,58,237,0.18)]'
                      : passed
                        ? 'border-[#C4B5FD]/50 text-[#DDD6FE]'
                        : last
                          ? 'border-[#EC4899]/45 text-[#FBCFE8]'
                          : 'border-white/15 text-slate-400 group-hover/step:border-white/30 group-hover/step:text-slate-200'
                  }`}
                >
                  {Icon && <Icon className="h-[17px] w-[17px]" strokeWidth={1.75} aria-hidden="true" />}
                </span>
                <span
                  className={`font-sans text-[13.5px] font-semibold leading-snug transition-colors duration-500 lg:max-w-[9.5rem] ${
                    current ? 'text-white' : passed ? 'text-slate-200' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* The selected step, in one line */}
      <div className="mt-8 flex min-h-[3.25rem] items-center justify-center border-t border-white/[0.06] pt-5" aria-live="polite">
        <motion.p
          key={active}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="max-w-2xl text-center font-sans text-[14px] leading-relaxed text-slate-300"
        >
          <span className="mr-2 font-sans text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#C4B5FD]">
            {String(active + 1).padStart(2, '0')}
          </span>
          {steps[active].note}
        </motion.p>
      </div>
    </div>
  );
}

/* ==================================================================
   Evidence layer beneath the lifecycle track: one continuous band of
   connected evidence, tied up to every stage. Column centres match
   BiopharmaLifecycle's equal grid; the ties are drawn from `lg`.
================================================================== */
export function EvidenceBand({ count, label, layers }) {
  const reduce = useReducedMotion();
  const W = 1000;
  const H = 40;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="hidden h-10 w-full lg:block" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => {
          const x = ((i + 0.5) / count) * W;
          return (
            <motion.line
              key={i}
              x1={x}
              y1="0"
              x2={x}
              y2={H}
              stroke="rgba(196,181,253,0.45)"
              strokeWidth="1"
              strokeDasharray="2 4"
              vectorEffect="non-scaling-stroke"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: 0.5 + i * 0.07, ease: 'easeOut' }}
            />
          );
        })}
      </svg>
      <div className="mt-6 rounded-[14px] bg-gradient-to-r from-[#A78BFA]/50 via-[#D946EF]/30 to-[#EC4899]/50 p-px lg:mt-0">
        <div className="flex flex-col items-center gap-2 rounded-[13px] bg-[#121B2E] px-4 py-3 sm:flex-row sm:justify-between">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C4B5FD]">{label}</p>
          <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {layers.map((l, i) => (
              <li key={l} className="flex items-center gap-3 font-sans text-[12.5px] font-medium text-slate-300">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-[#C4B5FD]/50" aria-hidden="true" />}
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
