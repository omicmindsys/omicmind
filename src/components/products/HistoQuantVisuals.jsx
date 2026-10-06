import { motion } from 'framer-motion';
import { fill, inPoly, outline, scatter, seeded, toPath } from './tissueGeometry.js';

/* ------------------------------------------------------------------
   Computational-pathology illustrations for HistoQuant™. Schematic
   only: one seeded tissue patch, drawn the way the pipeline sees it at
   each stage — raw image, detected cells, classified tissue, data.

   Compartment colours (shared with the legend and SpatialTME™):
     tumor → soft pink   stroma → lavender   immune → blue   other → neutral
------------------------------------------------------------------ */
export const COMPARTMENTS = {
  tumor: { label: 'Tumor', color: '#F9A8D4' },
  stroma: { label: 'Stroma', color: '#A78BFA' },
  immune: { label: 'Immune', color: '#93C5FD' },
  other: { label: 'Other Cells', color: '#CBD5E1' },
};

const CAPTION = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 8.5,
  fontWeight: 600,
  letterSpacing: '0.08em',
};

/* H&E-like tones for the raw image: eosin haze, hematoxylin nuclei. */
const EOSIN = 'rgba(244,163,203,0.16)';
const EOSIN_DEEP = 'rgba(244,163,203,0.26)';
const HEMATOXYLIN = '#8E83D9';

/* ---------------- One tissue patch, in a W × H box ---------------- */
function buildPatch(W, H, seed) {
  const s = W / 200;
  const tumorPoly = outline(W * 0.36, H * 0.44, W * 0.27, H * 0.33, seed);
  const immuneCentre = [W * 0.79, H * 0.68];
  const nearImmune = (p) => Math.hypot(p[0] - immuneCentre[0], p[1] - immuneCentre[1]) < W * 0.13;
  const r = seeded(seed + 1);

  const tumor = fill(tumorPoly, 13 * s, seed + 2, 3 * s).map((p) => ({
    p,
    cls: 'tumor',
    rx: (4.4 + r() * 1.4) * s,
    ry: (3.6 + r() * 1.2) * s,
    a: r() * 180,
  }));
  const immune = scatter([W * 0.62, H * 0.48, W * 0.96, H * 0.92], 16, seed + 3, (p) => nearImmune(p) && !inPoly(p, tumorPoly)).map(
    (p) => ({ p, cls: 'immune', rx: 2.5 * s, ry: 2.5 * s, a: 0 })
  );
  const stroma = scatter([4 * s, 4 * s, W - 4 * s, H - 4 * s], 34, seed + 4, (p) => !inPoly(p, outline(W * 0.36, H * 0.44, W * 0.3, H * 0.36, seed)) && !nearImmune(p)).map(
    (p, i) => ({ p, cls: 'stroma', rx: 6 * s, ry: 1.8 * s, a: 25 + ((i * 29) % 50) })
  );
  const other = scatter([W * 0.66, 6 * s, W - 6 * s, H * 0.4], 4, seed + 5, (p) => !inPoly(p, tumorPoly)).map((p) => ({
    p,
    cls: 'other',
    rx: 3.4 * s,
    ry: 3.4 * s,
    a: 0,
  }));

  return {
    W,
    H,
    s,
    tumorPath: toPath(tumorPoly),
    immuneCentre,
    immuneR: W * 0.15,
    cells: [...stroma, ...tumor, ...other, ...immune],
  };
}

const counts = (cells) =>
  cells.reduce((acc, c) => ({ ...acc, [c.cls]: (acc[c.cls] ?? 0) + 1 }), { tumor: 0, stroma: 0, immune: 0, other: 0 });

/* Draw a patch at a pipeline stage: 'raw' | 'detect' | 'classify'. */
function Patch({ patch, mode, x = 0, y = 0, labels = false }) {
  const { W, H, s, cells, tumorPath, immuneCentre, immuneR } = patch;

  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Tissue ground */}
      <rect width={W} height={H} rx={6 * s} fill={mode === 'raw' ? EOSIN : '#0F1A2C'} />
      {mode === 'raw' && <path d={tumorPath} fill={EOSIN_DEEP} />}

      {/* Region overlays once the tissue is classified */}
      {mode === 'classify' && (
        <>
          <path d={tumorPath} fill="rgba(249,168,212,0.07)" stroke={COMPARTMENTS.tumor.color} strokeOpacity="0.6" strokeWidth={0.9 * s} strokeDasharray={`${3 * s} ${2.5 * s}`} />
          <circle cx={immuneCentre[0]} cy={immuneCentre[1]} r={immuneR} fill="rgba(147,197,253,0.06)" stroke={COMPARTMENTS.immune.color} strokeOpacity="0.5" strokeWidth={0.9 * s} strokeDasharray={`${3 * s} ${2.5 * s}`} />
        </>
      )}

      {cells.map((c, i) => {
        const color = COMPARTMENTS[c.cls].color;
        const t = `rotate(${c.a} ${c.p[0]} ${c.p[1]})`;
        if (mode === 'raw') {
          return (
            <g key={i}>
              {c.cls !== 'stroma' && <ellipse cx={c.p[0]} cy={c.p[1]} rx={c.rx * 1.15} ry={c.ry * 1.15} fill="rgba(244,163,203,0.22)" transform={t} />}
              <ellipse
                cx={c.p[0]}
                cy={c.p[1]}
                rx={c.cls === 'stroma' ? c.rx * 0.7 : c.rx * 0.45}
                ry={c.cls === 'stroma' ? c.ry : c.ry * 0.5}
                fill={HEMATOXYLIN}
                fillOpacity={c.cls === 'immune' ? 0.95 : 0.75}
                transform={t}
              />
            </g>
          );
        }
        const stroke = mode === 'detect' ? 'rgba(226,232,240,0.7)' : color;
        return (
          <g key={i}>
            <ellipse
              cx={c.p[0]}
              cy={c.p[1]}
              rx={c.rx}
              ry={c.ry}
              fill={mode === 'classify' ? color : 'none'}
              fillOpacity="0.16"
              stroke={stroke}
              strokeOpacity={mode === 'detect' ? 1 : 0.85}
              strokeWidth={0.7 * s}
              transform={t}
            />
            {c.cls !== 'stroma' && (
              <circle cx={c.p[0]} cy={c.p[1]} r={Math.min(c.rx, c.ry) * 0.38} fill={mode === 'detect' ? HEMATOXYLIN : color} fillOpacity="0.9" />
            )}
          </g>
        );
      })}

      {labels && mode === 'classify' && (
        <g {...CAPTION} fontSize={7.5 * s}>
          {[
            { text: 'TUMOR', x: W * 0.45, y: H * 0.1, c: COMPARTMENTS.tumor.color },
            { text: 'IMMUNE', x: immuneCentre[0] - immuneR * 0.9, y: immuneCentre[1] - immuneR - 4 * s, c: COMPARTMENTS.immune.color },
            { text: 'STROMA', x: W * 0.47, y: H * 0.95, c: COMPARTMENTS.stroma.color },
          ].map((l) => (
            <g key={l.text}>
              <rect x={l.x - 3 * s} y={l.y - 8 * s} width={l.text.length * 5.4 * s + 6 * s} height={11 * s} rx={5.5 * s} fill="#0B1322" fillOpacity="0.85" stroke={l.c} strokeOpacity="0.5" strokeWidth={0.6 * s} />
              <text x={l.x} y={l.y} fill={l.c}>
                {l.text}
              </text>
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

/* ==================================================================
   Compact visual — card and story header (320 × 180, like the others).
   The tile is raw H&E on the left and segmented on the right, split by
   the analysis line; the rail beside it names the pipeline.
================================================================== */
const CARD_PATCH = buildPatch(150, 118, 17);
const PIPELINE = ['Image', 'Detect', 'Classify', 'Quantify', 'Data'];

function HistoQuantFrame({ labels }) {
  const id = labels ? 'hq-header' : 'hq-card';
  const TX = 18;
  const TY = 42;
  const SPLIT = 62;

  return (
    <svg viewBox="0 0 320 180" className="h-auto w-full" aria-hidden="true">
      <defs>
        <clipPath id={`${id}-raw`}>
          <rect x={TX} y={TY} width={SPLIT} height={CARD_PATCH.H} />
        </clipPath>
        <clipPath id={`${id}-seg`}>
          <rect x={TX + SPLIT} y={TY} width={CARD_PATCH.W - SPLIT} height={CARD_PATCH.H} />
        </clipPath>
      </defs>

      <rect x="10" y="12" width="300" height="156" rx="12" fill="#101B2E" stroke="rgba(167,139,250,0.31)" strokeWidth="1.2" />
      <path d="M10 33h300" stroke="rgba(167,139,250,0.24)" strokeWidth="1" />
      <circle cx="24" cy="22.5" r="2.2" fill="rgba(167,139,250,0.47)" />
      <circle cx="33" cy="22.5" r="2.2" fill="rgba(232,121,249,0.44)" />
      <circle cx="42" cy="22.5" r="2.2" fill="rgba(244,114,182,0.43)" />
      <text x="58" y="25.5" fill="#94A3B8" {...CAPTION}>
        QUANTITATIVE PATHOLOGY
      </text>

      <g clipPath={`url(#${id}-raw)`}>
        <Patch patch={CARD_PATCH} mode="raw" x={TX} y={TY} />
      </g>
      <g clipPath={`url(#${id}-seg)`}>
        <Patch patch={CARD_PATCH} mode="classify" x={TX} y={TY} labels={labels} />
      </g>
      <rect x={TX} y={TY} width={CARD_PATCH.W} height={CARD_PATCH.H} rx="6" fill="none" stroke="rgba(167,139,250,0.3)" strokeWidth="1" />
      <line x1={TX + SPLIT} y1={TY - 3} x2={TX + SPLIT} y2={TY + CARD_PATCH.H + 3} stroke="#E9D5FF" strokeOpacity="0.8" strokeWidth="1" />

      {/* Pipeline rail */}
      <path d="M190 54V146" stroke="rgba(167,139,250,0.3)" strokeWidth="1" />
      {PIPELINE.map((step, i) => {
        const y = 54 + i * 23;
        const last = i === PIPELINE.length - 1;
        return (
          <g key={step}>
            <circle cx="190" cy={y} r="3.4" fill={last ? '#EC4899' : '#101B2E'} stroke={last ? '#EC4899' : '#A78BFA'} strokeWidth="1.2" />
            <text x="200" y={y + 3} fill={last ? '#F8FAFC' : '#CBD5E1'} {...CAPTION}>
              {step.toUpperCase()}
            </text>
            {last && (
              <g>
                {[0.9, 0.6, 0.75, 0.4].map((w, k) => (
                  <rect key={k} x={242 + k * 15} y={y + 6 - w * 14} width="10" height={w * 14} rx="1.5" fill="#A78BFA" fillOpacity={0.35 + k * 0.12} />
                ))}
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function HistoQuantVisual() {
  return <HistoQuantFrame labels={false} />;
}

/* Header variant: the same drawing with classification labels. */
export function HistoQuantHeaderVisual() {
  return <HistoQuantFrame labels />;
}

/* ==================================================================
   Pixels → Cells → Tissue → Data. One patch shown at four stages;
   the panels appear in sequence as the section scrolls into view.
================================================================== */
const STAGE_PATCH = buildPatch(200, 150, 23);

function DataPanel({ patch }) {
  const n = counts(patch.cells);
  const total = n.tumor + n.stroma + n.immune + n.other;
  const rows = [
    { label: 'Cell density', w: 0.72 },
    { label: 'Morphology', w: 0.55 },
    { label: 'IHC intensity', w: 0.64 },
    { label: 'Proximity', w: 0.42 },
  ];

  return (
    <svg viewBox="0 0 200 150" className="block h-auto w-full" aria-hidden="true">
      <rect width="200" height="150" rx="6" fill="#0F1A2C" />
      <text x="12" y="20" fill="#94A3B8" {...CAPTION} fontSize="7.5">
        COMPOSITION
      </text>
      {(() => {
        let x = 12;
        return Object.entries(COMPARTMENTS).map(([k, c]) => {
          const w = (n[k] / total) * 176;
          const el = <rect key={k} x={x} y="27" width={Math.max(w - 1.5, 0)} height="9" rx="2" fill={c.color} fillOpacity="0.75" />;
          x += w;
          return el;
        });
      })()}
      <text x="12" y="58" fill="#94A3B8" {...CAPTION} fontSize="7.5">
        FEATURES
      </text>
      {rows.map((r, i) => (
        <g key={r.label}>
          <text x="12" y={76 + i * 18} fill="#CBD5E1" {...CAPTION} fontSize="7.5" letterSpacing="0.02em">
            {r.label}
          </text>
          <rect x="88" y={70 + i * 18} width="100" height="5" rx="2.5" fill="rgba(167,139,250,0.18)" />
          <rect x="88" y={70 + i * 18} width={100 * r.w} height="5" rx="2.5" fill="url(#hq-data-bar)" />
        </g>
      ))}
      <defs>
        <linearGradient id="hq-data-bar" x1="0" x2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const panel = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function PathologyPipeline({ stages }) {
  const views = [
    <svg key="raw" viewBox="0 0 200 150" className="block h-auto w-full" aria-hidden="true">
      <Patch patch={STAGE_PATCH} mode="raw" />
    </svg>,
    <svg key="detect" viewBox="0 0 200 150" className="block h-auto w-full" aria-hidden="true">
      <Patch patch={STAGE_PATCH} mode="detect" />
    </svg>,
    <svg key="classify" viewBox="0 0 200 150" className="block h-auto w-full" aria-hidden="true">
      <Patch patch={STAGE_PATCH} mode="classify" />
    </svg>,
    <DataPanel key="data" patch={STAGE_PATCH} />,
  ];

  return (
    <motion.ol
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {stages.map((stage, i) => (
        <motion.li key={stage.title} variants={panel} className="relative">
          {i > 0 && (
            <span
              className="absolute -left-[19px] top-[38%] hidden h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-[#0E1626] text-[#C4B5FD] lg:inline-flex"
              aria-hidden="true"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
                <path d="M4 10h11M10.5 5.5L15 10l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          <figure className="h-full rounded-[18px] border border-white/[0.08] bg-white/[0.025] p-2.5">
            <div className="overflow-hidden rounded-[12px]">{views[i]}</div>
            <figcaption className="px-1.5 pb-1 pt-3">
              <p className="flex items-baseline gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C4B5FD]">
                <span className="tabular-nums text-slate-500">{String(i + 1).padStart(2, '0')}</span>
                {stage.title}
              </p>
              <p className="mt-1.5 font-sans text-[13.5px] font-medium text-slate-200">{stage.caption}</p>
            </figcaption>
          </figure>
        </motion.li>
      ))}
    </motion.ol>
  );
}

export function CompartmentLegend() {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tissue compartments">
      {Object.entries(COMPARTMENTS).map(([k, c]) => (
        <li
          key={k}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-sans text-[12.5px] font-medium text-slate-200"
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} aria-hidden="true" />
          {c.label}
        </li>
      ))}
    </ul>
  );
}

