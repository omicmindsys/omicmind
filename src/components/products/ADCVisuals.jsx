import { motion, useReducedMotion } from 'framer-motion';
import { fill, outline, seeded, toPath } from './tissueGeometry.js';

/* ------------------------------------------------------------------
   Illustrations for ADC ResponseAI™. Schematic only: cells carry more
   or fewer antigen marks by target-expression level, antibody–drug
   conjugates dock onto target-positive cells, and stroma / immune cells
   stand in for the tumor microenvironment.

   Target scale — one restrained hue at falling intensity, so it never
   competes with the shared compartment colours (stroma lavender,
   immune blue):
     high → pink 0.6   medium → pink 0.32   low → pink 0.14   negative → slate
------------------------------------------------------------------ */
export const TARGET_LEVELS = [
  { key: 'negative', label: 'Target-negative', short: 'NEG', fill: 'rgba(100,116,139,0.10)', stroke: 'rgba(148,163,184,0.55)', marks: 0 },
  { key: 'low', label: 'Target-low', short: 'LOW', fill: 'rgba(249,168,212,0.14)', stroke: 'rgba(249,168,212,0.5)', marks: 2 },
  { key: 'medium', label: 'Target-medium', short: 'MED', fill: 'rgba(244,114,182,0.32)', stroke: 'rgba(249,168,212,0.75)', marks: 4 },
  { key: 'high', label: 'Target-positive', short: 'HIGH', fill: 'rgba(236,72,153,0.6)', stroke: '#F9A8D4', marks: 6 },
];

const STROMA = '#A78BFA';
const IMMUNE = '#93C5FD';
const ANTIGEN = '#F9A8D4';

const CAPTION = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 8.5,
  fontWeight: 600,
  letterSpacing: '0.08em',
};

/* ---------------- Building blocks ---------------- */

/* A tumor cell: membrane, nucleus, and antigen marks on the surface —
   the number of marks is the expression level. */
function TargetCell({ x, y, r, level, phase = 0 }) {
  const L = TARGET_LEVELS[level];
  return (
    <g>
      {Array.from({ length: L.marks }, (_, k) => {
        const a = phase + (k / L.marks) * Math.PI * 2;
        const c = Math.cos(a);
        const s = Math.sin(a);
        return (
          <g key={k}>
            <line x1={x + c * r} y1={y + s * r} x2={x + c * (r + r * 0.32)} y2={y + s * (r + r * 0.32)} stroke={ANTIGEN} strokeOpacity="0.7" strokeWidth={r * 0.13} />
            <circle cx={x + c * (r + r * 0.38)} cy={y + s * (r + r * 0.38)} r={r * 0.12} fill={ANTIGEN} />
          </g>
        );
      })}
      <circle cx={x} cy={y} r={r} fill={L.fill} stroke={L.stroke} strokeWidth={r * 0.12} />
      <circle cx={x} cy={y} r={r * 0.36} fill="#8E83D9" fillOpacity="0.7" />
    </g>
  );
}

/* An antibody–drug conjugate in local coordinates: the arm tips sit at
   the origin facing +y, the payload hangs off the stem. */
function ADCGlyph({ s = 1 }) {
  return (
    <g strokeLinecap="round" fill="none">
      <path d={`M${-3.2 * s} 0 L0 ${-4 * s} L${3.2 * s} 0`} stroke="#E9D5FF" strokeWidth={1.2 * s} />
      <path d={`M0 ${-4 * s} V${-9.5 * s}`} stroke="#E9D5FF" strokeWidth={1.2 * s} />
      <path d={`M0 ${-9.5 * s} l${2.2 * s} ${-1.6 * s}`} stroke="#C4B5FD" strokeWidth={0.8 * s} />
      <circle cx={2.9 * s} cy={-11.6 * s} r={1.7 * s} fill="#EC4899" stroke="#FBCFE8" strokeWidth={0.6 * s} />
    </g>
  );
}

/* Where an ADC docks on a cell when approaching along unit vector u
   (pointing from the cell outwards), and the glyph rotation that faces
   its arms into the cell. */
function dock(cell, u, gap = 1.45) {
  const d = [cell.x + u[0] * cell.r * gap, cell.y + u[1] * cell.r * gap];
  const deg = (Math.atan2(u[0], -u[1]) * 180) / Math.PI;
  return { d, deg };
}

/* ---------------- Seeded heterogeneous tumor nest ----------------
   Expression falls from left to right with seeded noise, so the patch
   reads as heterogeneous rather than banded. */
function buildNest({ cx, cy, rx, ry, spacing, seed, r, x0, x1 }) {
  const poly = outline(cx, cy, rx, ry, seed);
  const rand = seeded(seed + 7);
  const cells = fill(poly, spacing, seed + 2, r * 0.6).map(([x, y]) => {
    const t = (x - x0) / (x1 - x0);
    const base = 3 - t * 3.6;
    const level = Math.max(0, Math.min(3, Math.round(base + (rand() - 0.5) * 1.3)));
    return { x, y, r: r * (0.88 + rand() * 0.24), level, phase: rand() * Math.PI };
  });
  return { poly, path: toPath(poly), cells };
}

const CARD_NEST = buildNest({ cx: 106, cy: 92, rx: 62, ry: 34, spacing: 15.5, seed: 11, r: 4.6, x0: 52, x1: 160 });

/* ADCs that animate in, each toward a target-positive cell. */
const CARD_TARGETS = CARD_NEST.cells
  .filter((c) => c.level === 3)
  .sort((a, b) => a.y - b.y)
  .slice(0, 3);
const APPROACH = [-0.6, -0.8];

/* ADCs already bound, so the card reads at rest: on the remaining
   target-positive cells, approached from below. */
const CARD_BOUND = CARD_NEST.cells
  .filter((c) => c.level === 3 && !CARD_TARGETS.includes(c))
  .sort((a, b) => b.y - a.y)
  .slice(0, 2);
const BOUND_FROM = [0.5, 0.87];

/* Microenvironment: stroma fibres and an immune cluster at the edges. */
const CARD_STROMA = [
  [30, 128, 22],
  [44, 140, 35],
  [168, 52, 18],
  [182, 62, 40],
  [176, 132, -20],
  [158, 140, 30],
  [34, 56, -25],
];
const CARD_IMMUNE = [
  [184, 106],
  [190, 114],
  [180, 118],
  [189, 98],
  [28, 96],
  [33, 104],
];

/* Patients, stratified — schematic only. */
const PATIENTS = [1, 1, 1, 1, 0, 0, 0];

/* ==================================================================
   Card / header visual — the tissue target map on the left; Target
   Antigen → ADC Binding → Tumor Cell → Response down the right, ending
   in patients split into two groups.
================================================================== */
export function ADCVisual() {
  const reduce = useReducedMotion();
  const steps = [
    { y: 54, label: 'TARGET ANTIGEN' },
    { y: 80, label: 'ADC BINDING' },
    { y: 106, label: 'TUMOR CELL' },
    { y: 132, label: 'RESPONSE' },
  ];
  const RX = 218;

  return (
    <svg viewBox="0 0 320 180" className="h-auto w-full" aria-hidden="true">
      <rect x="10" y="12" width="300" height="156" rx="12" fill="#101B2E" stroke="rgba(236,72,153,0.3)" strokeWidth="1.2" />
      <path d="M10 33h300" stroke="rgba(167,139,250,0.24)" strokeWidth="1" />
      <circle cx="24" cy="22.5" r="2.2" fill="rgba(167,139,250,0.47)" />
      <circle cx="33" cy="22.5" r="2.2" fill="rgba(232,121,249,0.44)" />
      <circle cx="42" cy="22.5" r="2.2" fill="rgba(244,114,182,0.5)" />
      <text x="58" y="25.5" fill="#94A3B8" {...CAPTION}>
        ADC RESPONSE · TARGET MAP
      </text>

      {/* ---------------- Tissue ---------------- */}
      <rect x="20" y="42" width="180" height="106" rx="8" fill="#0F1A2C" stroke="rgba(255,255,255,0.05)" />
      {CARD_STROMA.map(([x, y, a], i) => (
        <ellipse key={i} cx={x} cy={y} rx="8" ry="1.6" fill={STROMA} fillOpacity="0.35" transform={`rotate(${a} ${x} ${y})`} />
      ))}
      {CARD_IMMUNE.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill={IMMUNE} fillOpacity="0.28" stroke={IMMUNE} strokeOpacity="0.8" strokeWidth="0.7" />
      ))}
      <path d={CARD_NEST.path} fill="rgba(249,168,212,0.04)" stroke="rgba(249,168,212,0.28)" strokeWidth="0.8" strokeDasharray="2.5 2" />
      {CARD_NEST.cells.map((c, i) => (
        <TargetCell key={i} {...c} />
      ))}

      {CARD_BOUND.map((cell, i) => {
        const { d, deg } = dock(cell, BOUND_FROM);
        return (
          <g key={i} transform={`translate(${d[0]} ${d[1]}) rotate(${deg})`} opacity="0.85">
            <ADCGlyph s={1.05} />
          </g>
        );
      })}

      {/* ADCs approaching and binding target-positive cells */}
      {CARD_TARGETS.map((cell, i) => {
        const { d, deg } = dock(cell, APPROACH);
        const glyph = (
          <g transform={`translate(${d[0]} ${d[1]}) rotate(${deg})`}>
            <ADCGlyph s={1.05} />
          </g>
        );
        if (reduce) return <g key={i}>{glyph}</g>;
        return (
          <motion.g
            key={i}
            initial={{ x: APPROACH[0] * 22, y: APPROACH[1] * 22, opacity: 0 }}
            animate={{
              x: [APPROACH[0] * 22, 0, 0, 0],
              y: [APPROACH[1] * 22, 0, 0, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 4, times: [0, 0.4, 0.85, 1], ease: 'easeOut', repeat: Infinity, delay: i * 1.3 }}
          >
            {glyph}
          </motion.g>
        );
      })}

      {/* Expression scale */}
      {TARGET_LEVELS.slice()
        .reverse()
        .map((L, i) => (
          <g key={L.key} transform={`translate(${26 + i * 44} 158)`}>
            <circle cx="3" cy="0" r="3" fill={L.fill} stroke={L.stroke} strokeWidth="0.8" />
            <text x="10" y="2.6" fill="#94A3B8" {...CAPTION} fontSize="6.6">
              {L.short}
            </text>
          </g>
        ))}

      {/* ---------------- Response chain ---------------- */}
      <line x1={RX} y1={steps[0].y} x2={RX} y2={steps[3].y} stroke="rgba(196,181,253,0.3)" strokeWidth="1" />
      {steps.map((s, i) => (
        <g key={s.label}>
          <circle
            cx={RX}
            cy={s.y}
            r="3.2"
            fill={i === steps.length - 1 ? '#EC4899' : '#101B2E'}
            stroke={i === steps.length - 1 ? '#F9A8D4' : '#C4B5FD'}
            strokeWidth="1.1"
          />
          <text x={RX + 9} y={s.y + 2.8} fill={i === steps.length - 1 ? '#F8FAFC' : '#CBD5E1'} {...CAPTION} fontSize="7">
            {s.label}
          </text>
        </g>
      ))}
      {!reduce && (
        <motion.circle
          cx={RX}
          r="1.9"
          fill="#ffffff"
          initial={{ cy: steps[0].y, opacity: 0 }}
          animate={{ cy: [steps[0].y, steps[3].y], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.6, ease: 'linear', repeat: Infinity, repeatDelay: 1 }}
        />
      )}

      {/* Patients split into two groups */}
      {PATIENTS.map((p, i) => (
        <circle
          key={i}
          cx={RX + 9 + i * 10 + (p ? 0 : 6)}
          cy="152"
          r="3"
          fill={p ? 'rgba(236,72,153,0.55)' : 'none'}
          stroke={p ? '#F9A8D4' : 'rgba(148,163,184,0.6)'}
          strokeWidth="0.9"
        />
      ))}
    </svg>
  );
}

/* ==================================================================
   "Understanding the Target" — a larger target map whose cells appear
   level by level, labelled with leader lines.
================================================================== */
const MAP_NEST = buildNest({ cx: 200, cy: 134, rx: 150, ry: 78, spacing: 24, seed: 23, r: 7.2, x0: 70, x1: 330 });

const pick = (level, pred) =>
  MAP_NEST.cells.filter((c) => c.level === level).sort(pred)[0];

const MAP_LABELS = [
  { cell: pick(3, (a, b) => a.y - b.y), text: 'Target-positive', tx: 62, ty: 26 },
  { cell: pick(1, (a, b) => b.y - a.y), text: 'Target-low', tx: 214, ty: 246 },
  { cell: pick(0, (a, b) => a.y - b.y), text: 'Target-negative', tx: 300, ty: 26 },
].filter((l) => l.cell);

export function TargetExpressionMap() {
  const reduce = useReducedMotion();

  return (
    <svg viewBox="0 0 400 260" className="h-auto w-full" role="img" aria-label="Schematic tumor tissue with target-positive, target-low and target-negative cells">
      <rect x="1" y="1" width="398" height="258" rx="14" fill="#0F1A2C" stroke="rgba(255,255,255,0.06)" />
      <path d={MAP_NEST.path} fill="rgba(249,168,212,0.035)" stroke="rgba(249,168,212,0.25)" strokeWidth="1" strokeDasharray="4 3" />

      {[0, 1, 2, 3].map((level) => (
        <motion.g
          key={level}
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15 + level * 0.18, ease: 'easeOut' }}
        >
          {MAP_NEST.cells
            .filter((c) => c.level === level)
            .map((c, i) => (
              <TargetCell key={i} {...c} />
            ))}
        </motion.g>
      ))}

      {MAP_LABELS.map(({ cell, text, tx, ty }) => {
        const above = ty < cell.y;
        return (
          <g key={text}>
            <line x1={cell.x} y1={cell.y + (above ? -cell.r * 1.5 : cell.r * 1.5)} x2={tx} y2={ty + (above ? 6 : -10)} stroke="rgba(226,232,240,0.35)" strokeWidth="0.8" />
            <circle cx={cell.x} cy={cell.y} r={cell.r * 1.75} fill="none" stroke="rgba(226,232,240,0.5)" strokeWidth="0.8" strokeDasharray="2 2" />
            <text x={tx} y={ty} textAnchor="middle" fill="#E2E8F0" {...CAPTION} fontSize="10" letterSpacing="0.04em">
              {text}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* Two small tumors with the same share of target-positive cells: one
   spread evenly, one clustered — the same average, a different profile. */
const EVEN = Array.from({ length: 24 }, (_, i) => (i % 3 === 0 ? 3 : i % 3 === 1 ? 1 : 0));
const CLUSTERED = Array.from({ length: 24 }, (_, i) => {
  const col = i % 6;
  return col < 2 ? 3 : col < 4 ? 1 : 0;
});

function MiniTumor({ levels, label }) {
  return (
    <figure className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 84 58" className="h-auto w-full max-w-[150px]" aria-hidden="true">
        <rect x="0.5" y="0.5" width="83" height="57" rx="8" fill="#0F1A2C" stroke="rgba(255,255,255,0.06)" />
        {levels.map((lv, i) => (
          <TargetCell key={i} x={12 + (i % 6) * 12} y={12 + Math.floor(i / 6) * 11.3} r={3.6} level={lv} phase={i} />
        ))}
      </svg>
      <figcaption className="font-sans text-[11.5px] font-medium text-slate-400">{label}</figcaption>
    </figure>
  );
}

export function SameAverage({ note, labels }) {
  return (
    <div className="rounded-[16px] border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="grid grid-cols-2 gap-4">
        <MiniTumor levels={EVEN} label={labels[0]} />
        <MiniTumor levels={CLUSTERED} label={labels[1]} />
      </div>
      <p className="mt-3 border-t border-white/[0.06] pt-3 font-sans text-[13px] leading-relaxed text-slate-400">{note}</p>
    </div>
  );
}

export function TargetLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Target-expression scale">
      {TARGET_LEVELS.slice()
        .reverse()
        .map((L) => (
          <li key={L.key} className="flex items-center gap-2 font-sans text-[12px] font-medium text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full border" style={{ backgroundColor: L.fill, borderColor: L.stroke }} aria-hidden="true" />
            {L.key === 'high' ? 'High' : L.key === 'medium' ? 'Medium' : L.key === 'low' ? 'Low' : 'Negative'}
          </li>
        ))}
    </ul>
  );
}

/* ==================================================================
   "Beyond Target Expression" — one tumor in three regions of falling
   expression, inside its microenvironment.
================================================================== */
const HET_POLY = outline(200, 150, 158, 84, 41);
const HET_REGIONS = [
  { id: 'A', label: 'Region A', note: 'High expression', x0: 30, x1: 150, level: [3, 3, 2], lx: 98 },
  { id: 'B', label: 'Region B', note: 'Moderate', x0: 150, x1: 252, level: [2, 2, 1], lx: 200 },
  { id: 'C', label: 'Region C', note: 'Low', x0: 252, x1: 380, level: [1, 0, 0], lx: 304 },
];
const HET_CELLS = (() => {
  const rand = seeded(57);
  return fill(HET_POLY, 22, 43, 6).map(([x, y]) => {
    const region = HET_REGIONS.find((g) => x < g.x1) ?? HET_REGIONS[2];
    const level = region.level[Math.floor(rand() * 3)];
    return { x, y, r: 6.4 * (0.9 + rand() * 0.2), level, phase: rand() * Math.PI, region: region.id };
  });
})();
const HET_STROMA = scatterEdge(26, 61);
const HET_IMMUNE = [
  [352, 40],
  [362, 50],
  [344, 52],
  [370, 38],
  [40, 226],
  [52, 236],
  [34, 238],
  [210, 246],
  [222, 240],
];

/* Stroma fibres around the tumor margin. */
function scatterEdge(count, seed) {
  const rand = seeded(seed);
  return Array.from({ length: count }, () => {
    const a = rand() * Math.PI * 2;
    const k = 1.08 + rand() * 0.16;
    return [200 + Math.cos(a) * 158 * k, 150 + Math.sin(a) * 84 * k, (a * 180) / Math.PI + 90 + (rand() - 0.5) * 30];
  }).filter(([x, y]) => x > 10 && x < 390 && y > 10 && y < 250);
}

export function HeterogeneityMap() {
  const reduce = useReducedMotion();

  return (
    <svg viewBox="0 0 400 270" className="h-auto w-full" role="img" aria-label="Schematic heterogeneous tumor: region A high, region B moderate and region C low target expression, within stroma and immune cells">
      <rect x="1" y="1" width="398" height="268" rx="14" fill="#0F1A2C" stroke="rgba(255,255,255,0.06)" />
      <defs>
        <clipPath id="adc-het-clip">
          <path d={toPath(HET_POLY)} />
        </clipPath>
      </defs>

      {HET_STROMA.map(([x, y, a], i) => (
        <ellipse key={i} cx={x} cy={y} rx="10" ry="2" fill={STROMA} fillOpacity="0.3" transform={`rotate(${a} ${x} ${y})`} />
      ))}
      {HET_IMMUNE.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.4" fill={IMMUNE} fillOpacity="0.25" stroke={IMMUNE} strokeOpacity="0.8" strokeWidth="0.8" />
      ))}

      {/* Region tints and boundaries, clipped to the tumor */}
      <g clipPath="url(#adc-het-clip)">
        <rect x="0" y="0" width="150" height="270" fill="rgba(236,72,153,0.08)" />
        <rect x="150" y="0" width="102" height="270" fill="rgba(236,72,153,0.04)" />
        <path d="M150 0V270M252 0V270" stroke="rgba(226,232,240,0.25)" strokeWidth="1" strokeDasharray="3 4" />
      </g>
      <path d={toPath(HET_POLY)} fill="none" stroke="rgba(249,168,212,0.3)" strokeWidth="1" />

      {HET_REGIONS.map((g, gi) => (
        <motion.g
          key={g.id}
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15 + gi * 0.2, ease: 'easeOut' }}
        >
          {HET_CELLS.filter((c) => c.region === g.id).map((c, i) => (
            <TargetCell key={i} {...c} />
          ))}
        </motion.g>
      ))}

      {HET_REGIONS.map((g) => (
        <g key={g.id} transform={`translate(${g.lx} 22)`}>
          <rect x="-34" y="-11" width="68" height="30" rx="8" fill="#0E1626" fillOpacity="0.9" stroke="rgba(196,181,253,0.3)" />
          <text x="0" y="1" textAnchor="middle" fill="#F8FAFC" {...CAPTION} fontSize="9.5">
            {g.label.toUpperCase()}
          </text>
          <text x="0" y="13" textAnchor="middle" fill="#C4B5FD" {...CAPTION} fontSize="7.5" fontWeight="500" letterSpacing="0.02em">
            {g.note}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* Microenvironment key for the heterogeneity map. */
export function TMELegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Map key">
      <li className="flex items-center gap-2 font-sans text-[12px] font-medium text-slate-400">
        <span className="h-2.5 w-2.5 rounded-full border border-[#F9A8D4] bg-[#EC4899]/60" aria-hidden="true" />
        Tumor cells (by target level)
      </li>
      <li className="flex items-center gap-2 font-sans text-[12px] font-medium text-slate-400">
        <span className="h-1 w-3.5 rounded-full" style={{ backgroundColor: STROMA, opacity: 0.6 }} aria-hidden="true" />
        Stroma
      </li>
      <li className="flex items-center gap-2 font-sans text-[12px] font-medium text-slate-400">
        <span className="h-2.5 w-2.5 rounded-full border" style={{ borderColor: IMMUNE, backgroundColor: 'rgba(147,197,253,0.25)' }} aria-hidden="true" />
        Immune cells
      </li>
    </ul>
  );
}

/* ==================================================================
   AI Analysis — arcs over the feature track marking the features that
   are evaluated together. Column centres match BiopharmaLifecycle's
   equal-width grid; drawn from `lg`, where that track is horizontal.
================================================================== */
export function RelationArcs({ count, pairs }) {
  const reduce = useReducedMotion();
  const W = 1000;
  const H = 70;
  const cx = (i) => ((i + 0.5) / count) * W;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="hidden h-16 w-full lg:block" aria-hidden="true">
      {pairs.map(([a, b], i) => {
        const span = Math.abs(b - a);
        const peak = H - Math.min(H - 4, 16 + span * 11);
        const d = `M${cx(a)} ${H} C ${cx(a)} ${peak}, ${cx(b)} ${peak}, ${cx(b)} ${H}`;
        const toResult = b === count - 1;
        return (
          <motion.path
            key={`${a}-${b}`}
            d={d}
            fill="none"
            stroke={toResult ? 'rgba(244,114,182,0.55)' : 'rgba(196,181,253,0.45)'}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
          />
        );
      })}
    </svg>
  );
}
