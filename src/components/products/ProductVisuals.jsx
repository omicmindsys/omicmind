import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="55%" stopColor="#D946EF" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.26" />
        <stop offset="100%" stopColor="#EC4899" stopOpacity="0.18" />
      </linearGradient>
      <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.36" />
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

export function ClinicalVisual() {
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
        fill="#101B2E"
        stroke="rgba(167,139,250,0.31)"
        strokeWidth="1.2"
      />
      <path d="M10 33h300" stroke="rgba(167,139,250,0.24)" strokeWidth="1" />
      <circle cx="24" cy="22.5" r="2.2" fill="rgba(167,139,250,0.47)" />
      <circle cx="33" cy="22.5" r="2.2" fill="rgba(232,121,249,0.44)" />
      <circle cx="42" cy="22.5" r="2.2" fill="rgba(244,114,182,0.43)" />
      <rect x="58" y="18.5" width="64" height="8" rx="4" fill="rgba(167,139,250,0.22)" />

      {/* Whole-slide preview */}
      <rect
        x="22"
        y="44"
        width="112"
        height="72"
        rx="8"
        fill={`url(#${id}-fill)`}
        stroke="rgba(167,139,250,0.33)"
        strokeWidth="1.1"
      />
      <g className="eco1-cells">
        <circle cx="48" cy="66" r="7" fill="none" stroke="rgba(167,139,250,0.59)" strokeWidth="1.3" />
        <circle cx="48" cy="66" r="2.2" fill="rgba(167,139,250,0.62)" />
        <circle cx="78" cy="60" r="5" fill="none" stroke="rgba(192,132,252,0.59)" strokeWidth="1.3" />
        <circle cx="78" cy="60" r="1.8" fill="rgba(192,132,252,0.59)" />
        <circle cx="64" cy="92" r="6" fill="none" stroke="rgba(232,121,249,0.55)" strokeWidth="1.3" />
        <circle cx="64" cy="92" r="1.9" fill="rgba(232,121,249,0.59)" />
        <circle cx="100" cy="88" r="4.4" fill="none" stroke="rgba(244,114,182,0.55)" strokeWidth="1.3" />
        <circle cx="104" cy="66" r="3.4" fill="none" stroke="rgba(244,114,182,0.51)" strokeWidth="1.2" />
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
          <text x={BAR_TRACK} y={m.y} fill="#CBD5E1" {...CAPTION}>
            {m.label}
          </text>
          <rect x={BAR_TRACK} y={m.y + 6} width="152" height="6" rx="3" fill="rgba(167,139,250,0.22)" />
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
            fill="#101B2E"
            stroke="rgba(167,139,250,0.35)"
            strokeWidth="1.1"
          />
          <circle cx={f.x + 14} cy="141" r="3.2" fill={`url(#${id}-ring)`} />
          <text x={f.x + 24} y="144" fill="#E2E8F0" {...PILL_TEXT}>
            {f.label}
          </text>
          {i < FLOW.length - 1 && (
            <>
              <line
                x1={f.x + 82}
                y1="141"
                x2={f.x + 94}
                y2="141"
                stroke="rgba(167,139,250,0.47)"
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

export function BiomarkerVisual() {
  const id = 'eco-v2';
  const hmW = HM_COLS * HM_CELL_W + (HM_COLS - 1) * HM_GAP;
  const hmH = HM_ROWS * HM_CELL_H + (HM_ROWS - 1) * HM_GAP;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-auto w-full" aria-hidden="true">
      <Defs id={id} />

      <text x="82" y="20" fill="#94A3B8" textAnchor="middle" {...CAPTION}>
        MOLECULAR NETWORK
      </text>
      <text x={HM_X + hmW / 2} y="20" fill="#94A3B8" textAnchor="middle" {...CAPTION}>
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
          stroke="rgba(167,139,250,0.55)"
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
              stroke="rgba(244,114,182,0.62)"
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
            fill="#101B2E"
            stroke="rgba(167,139,250,0.59)"
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
      <text x={HM_X} y={HM_Y + hmH + 32} fill="#94A3B8" {...CAPTION}>
        LOW
      </text>
      <text x={HM_X + hmW} y={HM_Y + hmH + 32} fill="#94A3B8" textAnchor="end" {...CAPTION}>
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

export function DrugVisual() {
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
        stroke="rgba(167,139,250,0.35)"
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
          <circle cx={p.x} cy={PIPE_Y} r={PIPE_R} fill="#101B2E" />
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
            <circle cx={p.x} cy={PIPE_Y} r="3" fill="#A78BFA" />
            {[0, 120, 240].map((a) => {
              const rad = ((a + i * 30) * Math.PI) / 180;
              return (
                <g key={a}>
                  <line
                    x1={p.x + Math.cos(rad) * 4}
                    y1={PIPE_Y + Math.sin(rad) * 4}
                    x2={p.x + Math.cos(rad) * 8}
                    y2={PIPE_Y + Math.sin(rad) * 8}
                    stroke="rgba(167,139,250,0.55)"
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
          <text x={p.x} y={PIPE_Y + 28} fill="#CBD5E1" textAnchor="middle" {...CAPTION}>
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
        fill="#101B2E"
        stroke="rgba(167,139,250,0.29)"
        strokeWidth="1.1"
      />
      <text x={CHART.x + 14} y={CHART.y + 16} fill="#94A3B8" {...CAPTION}>
        PREDICTED RESPONSE
      </text>
      {GRIDLINES.map((y) => (
        <line
          key={y}
          x1={CHART.x + 14}
          y1={y}
          x2={CHART.x + CHART.w - 14}
          y2={y}
          stroke="rgba(167,139,250,0.19)"
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


/* ------------------------------------------------------------------
   Ambient motion for whichever illustrations are mounted inside
   `scopeRef`. The carousel and the detail view mount and unmount as the
   visitor moves between them, so each calls this on its own scope and
   the tweens are created and reverted with the markup they drive.
   `key` re-runs the setup when the illustrations inside the scope are
   swapped out.
------------------------------------------------------------------ */
export function useProductVisualMotion(scopeRef, key) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(scope);

      /* Shared particle flow — each dot carries its own path in data attrs */
      const flow = (selector, { duration, repeatDelay, step }) =>
        q(selector).forEach((dot, i) => {
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

      // Clinical — readout bars filling, detection box sweeping the slide
      if (q('.eco1-bar').length) {
        gsap.from(q('.eco1-bar'), {
          scaleX: 0,
          transformOrigin: `${BAR_TRACK}px center`,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: scope, start: 'top 85%' },
        });
      }
      if (q('.eco1-scan').length) {
        gsap
          .timeline({ repeat: -1, repeatDelay: 1.1 })
          .fromTo(q('.eco1-scan'), { attr: { x: 34, y: 52 }, opacity: 0 }, { opacity: 1, duration: 0.3 })
          .to(q('.eco1-scan'), { attr: { x: 74, y: 74 }, duration: 1.6, ease: 'sine.inOut' }, 0.1)
          .to(q('.eco1-scan'), { opacity: 0, duration: 0.35 }, 1.5);
      }

      // Biomarker — network breathing, candidate ring pulsing, column scan
      if (q('.eco2-edge').length) {
        gsap.to(q('.eco2-edge'), {
          opacity: 0.85,
          duration: 1.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.11, from: 'random' },
        });
        gsap.fromTo(
          q('.eco2-hit'),
          { attr: { r: 10.2 }, opacity: 0.7 },
          { attr: { r: 17 }, opacity: 0, duration: 2.2, ease: 'sine.out', repeat: -1 }
        );
        gsap.to(q('.eco2-scan'), {
          attr: { x: HM_X + (HM_COLS - 1) * (HM_CELL_W + HM_GAP) },
          duration: 3.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
        gsap.to(q('.eco2-cell'), {
          opacity: (i, t) => Math.min(0.92, Number(t.getAttribute('opacity')) + 0.24),
          duration: 1.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.06, from: 'random' },
        });
      }

      // Drug — rotating molecule, prediction curve drawing in. Each
      // illustration's curve drives its own area and tip.
      q('.eco3-molecule').forEach((molecule) => {
        gsap.to(molecule, {
          rotation: 360,
          transformOrigin: `${PIPE[1].x}px ${PIPE_Y}px`,
          duration: 18,
          ease: 'none',
          repeat: -1,
        });
      });
      q('.eco3-curve').forEach((path) => {
        const svg = path.ownerSVGElement;
        const area = svg.querySelector('.eco3-area');
        const tip = svg.querySelector('.eco3-tip');
        const len = path.getTotalLength();
        gsap.set(path, { attr: { 'stroke-dasharray': len, 'stroke-dashoffset': len } });
        gsap
          .timeline({ repeat: -1, repeatDelay: 1.6, scrollTrigger: { trigger: scope, start: 'top 85%' } })
          .to(path, { attr: { 'stroke-dashoffset': 0 }, duration: 1.5, ease: 'power2.out' })
          .to(area, { opacity: 1, duration: 0.6 }, 0.5)
          .to(tip, { opacity: 1, duration: 0.3 }, 1.3)
          .to([area, tip], { opacity: 0, duration: 0.4 }, 2.6)
          .set(path, { attr: { 'stroke-dashoffset': len } }, 3.1);
      });
    }, scope);

    return () => ctx.revert();
  }, [scopeRef, key]);
}
