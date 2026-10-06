import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { dist, fill, inPoly, outline, scatter, toPath } from './tissueGeometry.js';

/* ------------------------------------------------------------------
   Spatial-biology illustrations for SpatialTME™. Both are schematic:
   cell positions are generated from a fixed seed so they are identical
   on every render, and nothing here represents measured patient data.

   Cell types share one palette across the card visual, the tissue map,
   the legend and the marker tags:
     tumor  → soft pink    immune → blue    stroma → lavender
------------------------------------------------------------------ */
export const CELL_TYPES = {
  tumor: { label: 'Tumor cells', short: 'Tumor', color: '#F9A8D4' },
  immune: { label: 'Immune cells', short: 'Immune', color: '#93C5FD' },
  stroma: { label: 'Stromal cells', short: 'Stroma', color: '#A78BFA' },
};

const CAPTION = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 8.5,
  fontWeight: 600,
  letterSpacing: '0.08em',
};

/* Immune → nearest tumor cell, for pairs closer than `reach`. */
function interactions(immune, tumor, reach) {
  return immune.flatMap((p) => {
    let best = null;
    let bestD = Infinity;
    for (const t of tumor) {
      const d = dist(p, t);
      if (d < bestD) {
        bestD = d;
        best = t;
      }
    }
    return bestD < reach ? [[p, best]] : [];
  });
}

/* ---------------- Shared cell marks ---------------- */

function TumorCell({ p, r = 5.4 }) {
  const c = CELL_TYPES.tumor.color;
  return (
    <g>
      <circle cx={p[0]} cy={p[1]} r={r} fill={c} fillOpacity="0.2" stroke={c} strokeOpacity="0.7" strokeWidth="0.9" />
      <circle cx={p[0]} cy={p[1]} r={r * 0.3} fill={c} fillOpacity="0.85" />
    </g>
  );
}

function ImmuneCell({ p, r = 3.2 }) {
  return <circle cx={p[0]} cy={p[1]} r={r} fill={CELL_TYPES.immune.color} fillOpacity="0.9" />;
}

function StromalCell({ p, angle, rx = 6.5, ry = 1.9 }) {
  return (
    <ellipse
      cx={p[0]}
      cy={p[1]}
      rx={rx}
      ry={ry}
      fill={CELL_TYPES.stroma.color}
      fillOpacity="0.5"
      transform={`rotate(${angle} ${p[0]} ${p[1]})`}
    />
  );
}

/* Tumor–immune contact lines; a slow, staggered breathing when motion
   is allowed, static otherwise. */
function Links({ pairs, reduce, opacity = 0.45, width = 0.8 }) {
  return pairs.map(([a, b], i) =>
    reduce ? (
      <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#C4B5FD" strokeOpacity={opacity} strokeWidth={width} />
    ) : (
      <motion.line
        key={i}
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke="#C4B5FD"
        strokeWidth={width}
        initial={{ strokeOpacity: opacity * 0.4 }}
        animate={{ strokeOpacity: [opacity * 0.4, opacity, opacity * 0.4] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: (i % 7) * 0.45 }}
      />
    )
  );
}

/* ==================================================================
   Compact visual — the carousel card and the story header.
   Same 320 × 180 frame as the other product illustrations.
================================================================== */
const SV = (() => {
  const nest = outline(108, 100, 64, 44, 7);
  const tumor = fill(nest, 13, 11, 4);
  const immune = [
    ...scatter([150, 58, 214, 150], 16, 21, (p) => !inPoly(p, nest)),
    ...scatter([128, 72, 172, 132], 5, 23, (p) => inPoly(p, nest)),
    ...scatter([24, 48, 70, 152], 3, 29, (p) => !inPoly(p, nest)),
  ];
  const stroma = scatter([20, 42, 222, 160], 22, 31, (p) => !inPoly(p, outline(108, 100, 74, 54, 7))).map(
    (p, i) => ({ p, angle: 50 + ((i * 37) % 80) })
  );
  return { nest: toPath(nest), tumor, immune, stroma, links: interactions(immune, tumor, 20) };
})();

export function SpatialVisual() {
  const reduce = useReducedMotion();

  return (
    <svg viewBox="0 0 320 180" className="h-auto w-full" aria-hidden="true">
      <rect x="10" y="12" width="300" height="156" rx="12" fill="#101B2E" stroke="rgba(167,139,250,0.31)" strokeWidth="1.2" />
      <path d="M10 33h300" stroke="rgba(167,139,250,0.24)" strokeWidth="1" />
      <circle cx="24" cy="22.5" r="2.2" fill="rgba(167,139,250,0.47)" />
      <circle cx="33" cy="22.5" r="2.2" fill="rgba(232,121,249,0.44)" />
      <circle cx="42" cy="22.5" r="2.2" fill="rgba(244,114,182,0.43)" />
      <text x="58" y="25.5" fill="#94A3B8" {...CAPTION}>
        SPATIAL MAP
      </text>

      <path d={SV.nest} fill="rgba(249,168,212,0.05)" stroke="rgba(249,168,212,0.55)" strokeWidth="1" strokeDasharray="3 2.5" />
      {SV.stroma.map(({ p, angle }, i) => (
        <StromalCell key={i} p={p} angle={angle} rx={5} ry={1.5} />
      ))}
      {SV.tumor.map((p, i) => (
        <TumorCell key={i} p={p} r={4.2} />
      ))}
      <Links pairs={SV.links} reduce={reduce} opacity={0.6} width={0.7} />
      {SV.immune.map((p, i) => (
        <ImmuneCell key={i} p={p} r={2.6} />
      ))}

      {/* Legend */}
      <g>
        <path d="M232 46v108" stroke="rgba(167,139,250,0.18)" strokeWidth="1" />
        {Object.values(CELL_TYPES).map((t, i) => (
          <g key={t.short} transform={`translate(246 ${70 + i * 26})`}>
            <circle cx="0" cy="-3" r="3.4" fill={t.color} fillOpacity="0.85" />
            <text x="10" y="0" fill="#CBD5E1" {...CAPTION}>
              {t.short.toUpperCase()}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ==================================================================
   Tissue map — the annotated, larger visual in the story.
   640 × 360. Annotations are HTML laid over the SVG by percentage so
   they stay legible at every width; below `sm` they move into the
   legend under the map instead.
================================================================== */
const MAP_W = 640;
const MAP_H = 360;

const TM = (() => {
  /* Main nest — infiltrated on its right flank */
  const nest = outline(240, 196, 150, 112, 3);
  const nestCells = fill(nest, 17, 5, 5);
  /* Small nest top-right — ringed by stroma, immune cells held outside */
  const excl = outline(548, 92, 54, 40, 9);
  const exclCells = fill(excl, 16, 13, 5);
  const exclRing = outline(548, 92, 74, 58, 9);

  const insideAny = (p) => inPoly(p, nest) || inPoly(p, exclRing);

  const infiltrating = [
    ...scatter([285, 110, 395, 300], 30, 41, (p) => inPoly(p, nest)),
    ...scatter([380, 120, 452, 310], 20, 43, (p) => !insideAny(p)),
  ];
  const excluded = scatter([460, 12, 636, 176], 26, 47, (p) => !inPoly(p, exclRing) && !inPoly(p, nest));
  const sparse = scatter([16, 16, 240, 350], 9, 53, (p) => !inPoly(p, nest));

  /* Stroma: a capsule around the small nest, plus scattered fibres */
  const capsule = exclRing
    .filter((_, i) => i % 2 === 0)
    .map(([x, y]) => {
      const a = (Math.atan2(y - 92, x - 548) * 180) / Math.PI + 90;
      return { p: [x + (548 - x) * 0.12, y + (92 - y) * 0.12], angle: a };
    });
  const fibres = scatter([12, 12, 628, 348], 70, 59, (p) => !insideAny(p) && !inPoly(p, outline(240, 196, 162, 124, 3))).map(
    (p, i) => ({ p, angle: 20 + ((i * 41) % 120) })
  );

  const tumor = [...nestCells, ...exclCells];
  const immune = [...infiltrating, ...excluded, ...sparse];
  const links = interactions(infiltrating, nestCells, 22);

  /* One highlighted measurement: an infiltrating cell deep in the flank */
  const probe = links
    .filter(([p]) => inPoly(p, nest))
    .reduce((best, pair) => (!best || dist(pair[0], [330, 215]) < dist(best[0], [330, 215]) ? pair : best), null);

  return {
    edge: nest[Math.round((125 / 360) * nest.length)],
    nest: toPath(nest),
    excl: toPath(excl),
    exclRing: toPath(exclRing),
    tumor,
    immune,
    stroma: [...capsule, ...fibres],
    links,
    probe,
  };
})();

/* Region annotations: (x, y) is the point on the map a leader starts
   from, `at` is where its label sits — both in map units. */
const ANNOTATIONS = [
  { key: 'boundary', label: 'Tumor boundary', x: TM.edge[0], y: TM.edge[1], at: [TM.edge[0] - 24, 334] },
  { key: 'immune', label: 'Immune-rich region', x: 392, y: 118, at: [300, 42] },
  { key: 'excluded', label: 'Excluded region', x: 590, y: 142, at: [578, 210] },
  { key: 'neighborhood', label: 'Spatial neighborhood', x: 378, y: 294, at: [404, 336] },
];

export function SpatialMap() {
  const reduce = useReducedMotion();
  const [focus, setFocus] = useState(null);
  const dim = (type) => (focus && focus !== type ? 0.18 : 1);

  const [pa, pb] = TM.probe ?? [];

  return (
    <figure className="rounded-[20px] border border-white/[0.08] bg-[#0B1322] p-3 sm:p-4">
      <div className="relative">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="block h-auto w-full" role="img" aria-labelledby="spatial-map-title">
          <title id="spatial-map-title">
            Schematic tissue map: a tumor nest infiltrated by immune cells on one flank, a second nest whose immune cells are held
            outside a stromal capsule, and a circled spatial neighborhood.
          </title>

          {/* Faint analysis grid */}
          <g stroke="rgba(148,163,184,0.06)" strokeWidth="1">
            {Array.from({ length: MAP_W / 40 - 1 }, (_, i) => (
              <path key={`v${i}`} d={`M${(i + 1) * 40} 0V${MAP_H}`} />
            ))}
            {Array.from({ length: MAP_H / 40 - 1 }, (_, i) => (
              <path key={`h${i}`} d={`M0 ${(i + 1) * 40}H${MAP_W}`} />
            ))}
          </g>

          {/* Regions */}
          <ellipse cx="388" cy="210" rx="72" ry="112" fill="rgba(147,197,253,0.07)" />
          <path d={TM.exclRing} fill="none" stroke="rgba(167,139,250,0.4)" strokeWidth="1" strokeDasharray="4 3" />
          <circle cx="378" cy="252" r="42" fill="none" stroke="rgba(196,181,253,0.6)" strokeWidth="1" strokeDasharray="2 3" />

          {/* Cells */}
          <g style={{ opacity: dim('stroma'), transition: 'opacity 0.3s' }}>
            {TM.stroma.map(({ p, angle }, i) => (
              <StromalCell key={i} p={p} angle={angle} />
            ))}
          </g>
          <g style={{ opacity: dim('tumor'), transition: 'opacity 0.3s' }}>
            <path d={TM.nest} fill="rgba(249,168,212,0.05)" stroke="rgba(249,168,212,0.6)" strokeWidth="1.2" />
            <path d={TM.excl} fill="rgba(249,168,212,0.05)" stroke="rgba(249,168,212,0.6)" strokeWidth="1.2" />
            {TM.tumor.map((p, i) => (
              <TumorCell key={i} p={p} />
            ))}
          </g>
          <g style={{ opacity: focus && focus !== 'immune' ? 0.18 : 1, transition: 'opacity 0.3s' }}>
            <Links pairs={TM.links} reduce={reduce} />
            {TM.immune.map((p, i) => (
              <ImmuneCell key={i} p={p} />
            ))}
          </g>

          {/* Distance probe */}
          {pa && (
            <g stroke="#F8FAFC" strokeOpacity="0.85" strokeWidth="1">
              <line x1={pa[0]} y1={pa[1]} x2={pb[0]} y2={pb[1]} strokeDasharray="2 2" />
              <circle cx={pa[0]} cy={pa[1]} r="5.5" fill="none" />
              <circle cx={pb[0]} cy={pb[1]} r="7.5" fill="none" />
            </g>
          )}

          {/* Annotation leaders (labels themselves are HTML, from sm) */}
          <g className="hidden sm:inline" stroke="rgba(226,232,240,0.35)" strokeWidth="1">
            {ANNOTATIONS.map((a) => (
              <g key={a.key}>
                <line x1={a.x} y1={a.y} x2={a.at[0]} y2={a.at[1] + (a.y > a.at[1] ? 8 : -8)} />
                <circle cx={a.x} cy={a.y} r="2" fill="#E2E8F0" stroke="none" />
              </g>
            ))}
          </g>
        </svg>

        {/* Annotation labels */}
        <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
          {ANNOTATIONS.map((a) => (
            <span
              key={a.key}
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/15 bg-[#0B1322]/90 px-2.5 py-1 font-sans text-[10.5px] font-semibold tracking-[0.02em] text-slate-200"
              style={{ left: `${(a.at[0] / MAP_W) * 100}%`, top: `${(a.at[1] / MAP_H) * 100}%` }}
            >
              {a.label}
            </span>
          ))}
          {pa && (
            <span
              className="absolute -translate-x-full -translate-y-full whitespace-nowrap rounded bg-[#0B1322]/80 px-1 font-sans text-[10px] font-semibold text-slate-200"
              style={{
                left: `${((Math.min(pa[0], pb[0]) - 8) / MAP_W) * 100}%`,
                top: `${((Math.min(pa[1], pb[1]) - 6) / MAP_H) * 100}%`,
              }}
            >
              Cell–cell distance
            </span>
          )}
        </div>
      </div>

      {/* Legend — the cell types double as highlight toggles */}
      <figcaption className="mt-3 flex flex-col gap-3 border-t border-white/[0.06] px-1 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Highlight a cell type">
          {Object.entries(CELL_TYPES).map(([key, t]) => (
            <button
              key={key}
              type="button"
              aria-pressed={focus === key}
              onClick={() => setFocus((f) => (f === key ? null : key))}
              onMouseEnter={() => setFocus(key)}
              onMouseLeave={() => setFocus(null)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-sans text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] ${
                focus === key ? 'border-white/30 bg-white/[0.06] text-white' : 'border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </div>
        <p className="font-sans text-[11px] text-slate-500">Schematic illustration — not patient data</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-[11.5px] text-slate-400 sm:hidden">
          {ANNOTATIONS.map((a) => (
            <li key={a.key}>{a.label}</li>
          ))}
          <li>Cell–cell distance</li>
        </ul>
      </figcaption>
    </figure>
  );
}
