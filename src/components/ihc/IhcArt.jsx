import React from 'react';

/* ------------------------------------------------------------------
   Illustration set for the IHC Analysis application page.

   Same conventions as the Breast, Lung and Research sets: every
   drawing lives in a fixed viewBox and renders at w-full, so a single
   set of coordinates scales to every breakpoint. Gradient ids are
   namespaced per illustration because several of these render more
   than once on a page (desktop + mobile tracks, for instance).
------------------------------------------------------------------ */

const BRAND = {
  violet: '#7C3AED',
  purple: '#A855F7',
  fuchsia: '#D946EF',
  pink: '#EC4899',
};

const LABEL = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: '0.02em',
};

const CAPTION = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 7.5,
  fontWeight: 700,
  letterSpacing: '0.09em',
};

const VALUE = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 9.5,
  fontWeight: 700,
  letterSpacing: '0.01em',
};

const BIG = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: '-0.015em',
};

function Defs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-brand`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={BRAND.violet} />
        <stop offset="52%" stopColor={BRAND.fuchsia} />
        <stop offset="100%" stopColor={BRAND.pink} />
      </linearGradient>
      <linearGradient id={`${id}-brandSoft`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={BRAND.violet} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BRAND.pink} stopOpacity="0.10" />
      </linearGradient>
      <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={BRAND.violet} />
        <stop offset="100%" stopColor={BRAND.pink} />
      </linearGradient>
      <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={BRAND.violet} stopOpacity="0.65" />
        <stop offset="100%" stopColor={BRAND.pink} stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id={`${id}-scan`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={BRAND.fuchsia} stopOpacity="0" />
        <stop offset="50%" stopColor={BRAND.fuchsia} stopOpacity="0.85" />
        <stop offset="100%" stopColor={BRAND.fuchsia} stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={BRAND.purple} stopOpacity="0.22" />
        <stop offset="100%" stopColor={BRAND.purple} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-haloPink`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={BRAND.pink} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BRAND.pink} stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-card`} x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#4C1D95" floodOpacity="0.12" />
      </filter>
    </defs>
  );
}

function Panel({ id, x, y, w, h, r = 14 }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      fill="#FFFFFF"
      stroke="#EDE9FE"
      strokeWidth="1.2"
      filter={`url(#${id}-card)`}
    />
  );
}

/* Semicircular gauge used by the research and decision visuals.
   `value` is 0–1; the arc is drawn as a dashed stroke so the fill is a
   single dashoffset away from being animated. */
function Gauge({ id, cx, cy, r, value, label, caption, stroke }) {
  const len = Math.PI * r;
  const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  return (
    <g>
      <path d={d} stroke="#F3E8FF" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path
        className="ihc-gauge"
        d={d}
        stroke={stroke || `url(#${id}-bar)`}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${len * value} ${len}`}
      />
      <text x={cx} y={cy - 4} style={BIG} fill="#111827" textAnchor="middle">
        {label}
      </text>
      {caption && (
        <text x={cx} y={cy + 12} style={CAPTION} fill="#94A3B8" textAnchor="middle">
          {caption}
        </text>
      )}
    </g>
  );
}

/* =================================================================
   Ambient background — a stylised IHC-stained field: tumour nests
   ringed by stroma, with positively and negatively stained nuclei
   scattered through it. Deliberately low contrast so the headline
   stays the highest-contrast element on the page.
================================================================= */
export function IhcField({ className = '' }) {
  const id = 'omi-field';

  /* Tumour nests */
  const nests = [];
  for (let i = 0; i < 34; i += 1) {
    const x = (i * 227.3) % 1440;
    const y = (i * 131.7) % 520;
    const rx = 42 + ((i * 11) % 5) * 12;
    const ry = 28 + ((i * 7) % 4) * 9;
    nests.push([x, y, rx, ry, (i * 37) % 180]);
  }

  /* Stromal bands threading between the nests */
  const stroma = [
    'M-40 132 C 200 92, 360 190, 560 158 C 760 126, 900 214, 1120 182 C 1300 156, 1380 200, 1480 186',
    'M-40 320 C 180 286, 320 372, 540 344 C 740 318, 880 400, 1090 372 C 1280 348, 1390 386, 1480 372',
    'M-40 466 C 220 436, 380 512, 620 486 C 840 462, 980 528, 1200 502 C 1340 486, 1420 508, 1480 500',
  ];

  /* Stained nuclei — the filled ones read as DAB-positive */
  const nuclei = [];
  for (let i = 0; i < 210; i += 1) {
    const x = (i * 197.7) % 1440;
    const y = (i * 149.3) % 520;
    nuclei.push([x, y, 2 + ((i * 5) % 4) * 0.5, i % 3 === 0]);
  }

  return (
    <svg
      viewBox="0 0 1440 520"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <Defs id={id} />

      {stroma.map((d, i) => (
        <g key={i}>
          <path d={d} stroke={BRAND.purple} strokeOpacity="0.12" strokeWidth="10" strokeLinecap="round" />
          <path d={d} stroke={BRAND.pink} strokeOpacity="0.09" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}

      {nests.map(([cx, cy, rx, ry, rot], i) => (
        <g key={i} transform={`rotate(${rot} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={BRAND.violet} opacity="0.05" />
          <ellipse
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            stroke={i % 3 === 0 ? BRAND.pink : BRAND.purple}
            strokeOpacity="0.12"
            strokeWidth="1.2"
            strokeDasharray={i % 4 === 0 ? '7 6' : undefined}
          />
        </g>
      ))}

      {nuclei.map(([x, y, r, positive], i) =>
        positive ? (
          <circle key={i} cx={x} cy={y} r={r} fill={BRAND.fuchsia} opacity="0.16" />
        ) : (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="none"
            stroke={BRAND.violet}
            strokeOpacity="0.14"
            strokeWidth="1"
          />
        )
      )}
    </svg>
  );
}

/* =================================================================
   HERO — the IHC analysis stack: a stained whole slide with an AI
   tumour mask, the quantitative biomarker readout, the spatial immune
   map and the tiered model outputs, stitched into one pipeline.
================================================================= */
export function IhcHeroArt({ className = '' }) {
  const id = 'omi-hero';

  /* Tumour nests inside the slide */
  const nests = [
    { cx: 118, cy: 168, rx: 46, ry: 33, rot: -14 },
    { cx: 204, cy: 200, rx: 40, ry: 28, rot: 16 },
    { cx: 282, cy: 162, rx: 34, ry: 27, rot: -8 },
    { cx: 158, cy: 246, rx: 36, ry: 24, rot: 22 },
    { cx: 272, cy: 248, rx: 42, ry: 26, rot: -20 },
  ];

  /* Positively (filled) and negatively (outlined) stained nuclei */
  const nuclei = [];
  for (let i = 0; i < 46; i += 1) {
    const x = 76 + ((i * 53) % 262);
    const y = 118 + ((i * 71) % 164);
    nuclei.push([x, y, i % 3 !== 0]);
  }

  /* AI confidence heatmap over the slide */
  const heat = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 6; c += 1) {
      const o = [0.06, 0.11, 0.21, 0.3, 0.15, 0.08][(r * 3 + c * 2) % 6];
      heat.push({ x: 62 + c * 48, y: 110 + r * 45, o, warm: (r + c) % 3 === 0 });
    }
  }

  const scores = [
    { label: 'ER', value: '95%', w: 128 },
    { label: 'PR', value: '82%', w: 110 },
    { label: 'HER2', value: '2+', w: 74 },
    { label: 'Ki-67', value: '24%', w: 46 },
  ];

  const research = [
    { label: 'PIK3CA', value: '0.68' },
    { label: 'TP53', value: '0.41' },
    { label: 'HRD phenotype', value: '0.72' },
  ];

  return (
    <svg
      viewBox="0 0 600 540"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Immunohistochemistry whole slide image with an AI tumour mask, quantitative ER, PR, HER2 and Ki-67 scoring, a spatial immune density map and research-model outputs feeding a pCR prediction"
    >
      <Defs id={id} />

      {/* Ambient lighting */}
      <circle cx="140" cy="130" r="190" fill={`url(#${id}-halo)`} />
      <circle cx="460" cy="420" r="180" fill={`url(#${id}-haloPink)`} />

      {/* ---- Inference graph behind the cards ---- */}
      <g opacity="0.85">
        <path
          className="ihc-wire"
          d="M368 190 C 380 190, 378 178, 392 178"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <path
          className="ihc-wire"
          d="M152 306 C 152 322, 138 322, 138 340"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <path
          className="ihc-wire"
          d="M300 306 C 300 328, 372 328, 380 344"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <path
          className="ihc-wire"
          d="M478 296 C 478 320, 456 320, 456 344"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
      </g>

      {/* ================= Slide viewer + tumour mask ================= */}
      <g className="ihc-float-a">
        <Panel id={id} x={44} y={60} w={324} h={246} r={18} />

        <circle cx="66" cy="82" r="3.4" fill="#E9D5FF" />
        <circle cx="78" cy="82" r="3.4" fill="#FBCFE8" />
        <circle cx="90" cy="82" r="3.4" fill="#EDE9FE" />
        <text x="106" y="85.5" style={LABEL} fill="#475569">
          Breast IHC · H&amp;E + mask
        </text>
        <rect x="282" y="74" width="70" height="17" rx="8.5" fill={`url(#${id}-brandSoft)`} />
        <text x="317" y="85.5" style={CAPTION} fill={BRAND.violet} textAnchor="middle">
          TUMOR 62%
        </text>

        <clipPath id={`${id}-slide`}>
          <rect x="60" y="102" width="292" height="190" rx="12" />
        </clipPath>
        <rect x="60" y="102" width="292" height="190" rx="12" fill="#FDFBFF" stroke="#F3E8FF" />

        <g clipPath={`url(#${id}-slide)`}>
          {/* Tumour nest morphology */}
          {nests.map((n, i) => (
            <g key={i} transform={`rotate(${n.rot} ${n.cx} ${n.cy})`}>
              <ellipse cx={n.cx} cy={n.cy} rx={n.rx} ry={n.ry} fill={BRAND.violet} opacity="0.12" />
              <ellipse
                cx={n.cx}
                cy={n.cy}
                rx={n.rx}
                ry={n.ry}
                stroke={BRAND.purple}
                strokeOpacity="0.3"
                strokeWidth="1.2"
              />
            </g>
          ))}

          {/* AI confidence tiles */}
          {heat.map((t, i) => (
            <rect
              key={i}
              className="ihc-heat"
              x={t.x}
              y={t.y}
              width="46"
              height="43"
              rx="6"
              fill={t.warm ? BRAND.pink : BRAND.violet}
              opacity={t.o}
            />
          ))}

          {/* Stained nuclei */}
          {nuclei.map(([x, y, positive], i) =>
            positive ? (
              <circle key={i} className="ihc-nucleus" cx={x} cy={y} r="3.6" fill={BRAND.fuchsia} opacity="0.6" />
            ) : (
              <circle
                key={i}
                className="ihc-nucleus"
                cx={x}
                cy={y}
                r="3.6"
                fill="none"
                stroke={BRAND.violet}
                strokeOpacity="0.45"
                strokeWidth="1.2"
              />
            )
          )}

          {/* The digital tumour mask itself */}
          <path
            d="M74 152 C 104 118, 152 128, 190 116 C 232 104, 274 118, 320 110 L332 176 C 302 200, 258 186, 214 200 C 168 214, 122 200, 78 214 Z"
            fill={BRAND.fuchsia}
            opacity="0.1"
          />
          <path
            className="ihc-mask"
            d="M74 152 C 104 118, 152 128, 190 116 C 232 104, 274 118, 320 110 L332 176 C 302 200, 258 186, 214 200 C 168 214, 122 200, 78 214 Z"
            stroke={BRAND.fuchsia}
            strokeWidth="1.6"
            strokeDasharray="7 6"
            fill="none"
          />

          {/* Scanning sweep */}
          <rect className="ihc-scan" x="60" y="102" width="3" height="190" fill={`url(#${id}-scan)`} />
        </g>

        <text x="60" y="284" style={CAPTION} fill={BRAND.violet}>
          H&amp;E TUMOR MASK · RUO
        </text>
      </g>

      {/* ================= Quantitative readout ================= */}
      <g className="ihc-float-b">
        <Panel id={id} x={392} y={96} w={172} h={200} r={16} />

        <text x="410" y="122" style={LABEL} fill="#111827">
          Tier A · Quantify
        </text>
        <rect x="410" y="130" width="24" height="2" rx="1" fill={`url(#${id}-bar)`} />

        {scores.map((s, i) => {
          const y = 154 + i * 34;
          return (
            <g key={s.label}>
              <text x="410" y={y} style={LABEL} fill="#475569">
                {s.label}
              </text>
              <text x="546" y={y} style={VALUE} fill={BRAND.violet} textAnchor="end">
                {s.value}
              </text>
              <rect x="410" y={y + 7} width="136" height="6" rx="3" fill="#F3E8FF" />
              <rect className="ihc-bar" x="410" y={y + 7} width={s.w} height="6" rx="3" fill={`url(#${id}-bar)`} />
            </g>
          );
        })}

        <rect x="410" y="272" width="64" height="15" rx="7.5" fill={`url(#${id}-brandSoft)`} />
        <text x="442" y="282.5" style={CAPTION} fill={BRAND.violet} textAnchor="middle">
          ALLRED 8
        </text>
        <rect x="480" y="272" width="66" height="15" rx="7.5" fill={`url(#${id}-brandSoft)`} />
        <text x="513" y="282.5" style={CAPTION} fill={BRAND.violet} textAnchor="middle">
          H-SCORE 245
        </text>
      </g>

      {/* ================= Spatial immune map ================= */}
      <g className="ihc-float-c">
        <Panel id={id} x={36} y={344} w={252} h={162} r={16} />

        <text x="54" y="370" style={LABEL} fill="#111827">
          Spatial immune profile
        </text>

        <clipPath id={`${id}-imm`}>
          <rect x="54" y="380" width="128" height="108" rx="10" />
        </clipPath>
        <rect x="54" y="380" width="128" height="108" rx="10" fill="#FDFBFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-imm)`}>
          <path
            d="M54 380 C 84 396, 118 380, 148 392 C 168 400, 178 394, 182 390 L182 428 C 152 442, 118 424, 84 438 C 68 444, 58 442, 54 440 Z"
            fill={BRAND.violet}
            opacity="0.14"
          />
          <path
            d="M54 440 C 74 430, 106 446, 136 434 C 158 425, 174 434, 182 428 L182 488 L54 488 Z"
            fill={BRAND.pink}
            opacity="0.11"
          />
          {[
            [66, 396], [88, 408], [110, 392], [132, 406], [154, 396], [172, 410],
            [70, 428], [96, 440], [120, 424], [146, 442], [168, 430], [62, 458],
            [88, 470], [114, 456], [140, 472], [166, 462], [102, 414], [130, 462],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              className="ihc-node"
              cx={cx}
              cy={cy}
              r="3.2"
              fill={i % 3 === 0 ? BRAND.pink : BRAND.violet}
              opacity="0.75"
            />
          ))}
          <circle
            cx="120"
            cy="424"
            r="26"
            stroke={BRAND.fuchsia}
            strokeWidth="1.2"
            strokeDasharray="5 5"
            fill="none"
            opacity="0.65"
          />
        </g>

        {[
          { k: 'CD3 intratumoral', v: '412/mm²' },
          { k: 'CD8 intratumoral', v: '186/mm²' },
          { k: 'CD3 stromal', v: '1180/mm²' },
          { k: 'CD8 stromal', v: '604/mm²' },
        ].map((m, i) => {
          const y = 396 + i * 25;
          return (
            <g key={m.k}>
              <circle cx="198" cy={y - 3.5} r="3" fill={i < 2 ? BRAND.violet : BRAND.pink} opacity="0.8" />
              <text x="208" y={y} style={{ ...CAPTION, fontSize: 6.5 }} fill="#94A3B8">
                {m.k.toUpperCase()}
              </text>
              <text x="208" y={y + 11} style={VALUE} fill={BRAND.violet}>
                {m.v}
              </text>
            </g>
          );
        })}
      </g>

      {/* ================= Research models + decision layer ================= */}
      <g className="ihc-float-d">
        <Panel id={id} x={306} y={330} w={258} h={186} r={16} />

        <text x="324" y="356" style={LABEL} fill="#111827">
          Tier B · Research models
        </text>

        {research.map((r, i) => {
          const y = 378 + i * 22;
          return (
            <g key={r.label}>
              <text x="324" y={y + 8} style={{ ...CAPTION, fontSize: 7.5 }} fill="#94A3B8">
                {r.label.toUpperCase()}
              </text>
              <rect x="432" y={y + 1} width="80" height="6" rx="3" fill="#F3E8FF" />
              <rect
                className="ihc-bar"
                x="432"
                y={y + 1}
                width={80 * Number(r.value)}
                height="6"
                rx="3"
                fill={`url(#${id}-bar)`}
              />
              <text x="546" y={y + 8} style={VALUE} fill={BRAND.violet} textAnchor="end">
                {r.value}
              </text>
            </g>
          );
        })}

        <path d="M324 450 L546 450" stroke="#F3E8FF" strokeWidth="1.2" />

        <text x="324" y="470" style={LABEL} fill="#111827">
          Tier C · pCR
        </text>
        <text x="324" y="484" style={{ ...CAPTION, fontSize: 7 }} fill="#94A3B8">
          PREDICTIVE MODEL · RUO
        </text>

        <Gauge id={id} cx={492} cy={496} r={36} value={0.63} label="0.63" caption="pCR SCORE" />
      </g>
    </svg>
  );
}

/* =================================================================
   TIER A / TIER B — capability card visuals (360 x 200)
================================================================= */
export function PackArt({ name, className = '' }) {
  const id = `omi-p-${name}`;

  const frame = (
    <rect x="6" y="6" width="348" height="188" rx="16" fill="#FDFBFF" stroke="#F3E8FF" />
  );

  const researchTag = (
    <>
      <rect x="252" y="16" width="88" height="16" rx="8" fill={`url(#${id}-brandSoft)`} />
      <text x="296" y="27" style={{ ...CAPTION, fontSize: 7 }} fill={BRAND.violet} textAnchor="middle">
        RESEARCH MODEL
      </text>
    </>
  );

  const shapes = {
    /* ---------- H&E tumour mask and tumour percentage ---------- */
    tumormask: (
      <>
        {frame}
        <clipPath id={`${id}-clip`}>
          <rect x="18" y="18" width="196" height="164" rx="12" />
        </clipPath>
        <rect x="18" y="18" width="196" height="164" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-clip)`}>
          <ellipse cx="72" cy="66" rx="44" ry="30" fill={BRAND.violet} opacity="0.11" />
          <ellipse cx="152" cy="112" rx="50" ry="34" fill={BRAND.violet} opacity="0.1" />
          <ellipse cx="64" cy="148" rx="36" ry="24" fill={BRAND.pink} opacity="0.08" />

          {[
            [40, 44], [62, 60], [86, 42], [108, 68], [130, 48], [152, 72],
            [174, 50], [196, 74], [44, 90], [68, 106], [92, 88], [116, 110],
            [140, 92], [164, 114], [188, 90], [38, 134], [64, 150], [90, 132],
            [116, 156], [142, 138], [168, 160], [192, 136],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              className="art-cell"
              cx={cx}
              cy={cy}
              r="4"
              fill={BRAND.violet}
              opacity={i % 3 === 0 ? 0.42 : 0.2}
            />
          ))}

          {/* The mask contour */}
          <path
            d="M28 74 C 60 42, 108 54, 146 44 C 182 34, 206 46, 214 40 L214 106 C 184 126, 140 112, 96 126 C 60 138, 40 130, 28 138 Z"
            fill={BRAND.fuchsia}
            opacity="0.13"
          />
          <path
            className="art-mask"
            d="M28 74 C 60 42, 108 54, 146 44 C 182 34, 206 46, 214 40 L214 106 C 184 126, 140 112, 96 126 C 60 138, 40 130, 28 138 Z"
            stroke={BRAND.fuchsia}
            strokeWidth="1.6"
            strokeDasharray="7 6"
            fill="none"
          />
        </g>

        {/* Tumour percentage donut */}
        <g transform="rotate(-90 288 92)">
          <circle cx="288" cy="92" r="34" stroke="#F3E8FF" strokeWidth="11" fill="none" />
          <circle
            className="art-ring"
            cx="288"
            cy="92"
            r="34"
            stroke={`url(#${id}-bar)`}
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 34 * 0.62} ${2 * Math.PI * 34}`}
          />
        </g>
        <text x="288" y="94" style={BIG} fill="#111827" textAnchor="middle">
          62%
        </text>
        <text x="288" y="110" style={{ ...CAPTION, fontSize: 7 }} fill="#94A3B8" textAnchor="middle">
          TUMOR AREA
        </text>
        <rect x="240" y="142" width="96" height="16" rx="8" fill={`url(#${id}-brandSoft)`} />
        <text x="288" y="153" style={{ ...CAPTION, fontSize: 7 }} fill={BRAND.violet} textAnchor="middle">
          DIGITAL MASK
        </text>
      </>
    ),

    /* ---------- ER / PR nuclear positivity and scoring ---------- */
    erpr: (
      <>
        {frame}
        <clipPath id={`${id}-clip`}>
          <rect x="18" y="18" width="150" height="164" rx="12" />
        </clipPath>
        <rect x="18" y="18" width="150" height="164" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-clip)`}>
          <ellipse cx="60" cy="62" rx="40" ry="28" fill={BRAND.violet} opacity="0.09" />
          <ellipse cx="120" cy="126" rx="44" ry="30" fill={BRAND.pink} opacity="0.08" />
          {[
            [36, 42, 3], [58, 56, 2], [80, 40, 1], [102, 62, 3], [124, 44, 0],
            [146, 66, 2], [34, 86, 3], [58, 100, 1], [82, 84, 2], [106, 104, 3],
            [130, 88, 0], [152, 108, 2], [38, 128, 1], [62, 144, 3], [86, 126, 2],
            [110, 150, 0], [134, 132, 3], [156, 152, 1],
          ].map(([cx, cy, grade], i) =>
            grade === 0 ? (
              <circle
                key={i}
                className="art-cell"
                cx={cx}
                cy={cy}
                r="5"
                fill="none"
                stroke={BRAND.violet}
                strokeOpacity="0.4"
                strokeWidth="1.3"
              />
            ) : (
              <circle
                key={i}
                className="art-cell"
                cx={cx}
                cy={cy}
                r="5"
                fill={BRAND.fuchsia}
                opacity={0.22 + grade * 0.22}
              />
            )
          )}
        </g>

        {/* Intensity distribution */}
        {[
          { k: '0', v: '12%', w: 20 },
          { k: '1+', v: '18%', w: 30 },
          { k: '2+', v: '34%', w: 57 },
          { k: '3+', v: '36%', w: 60 },
        ].map((s, i) => {
          const y = 44 + i * 26;
          return (
            <g key={s.k}>
              <text x="184" y={y} style={LABEL} fill="#475569">
                {s.k}
              </text>
              <rect x="206" y={y - 7} width="100" height="6" rx="3" fill="#F3E8FF" />
              <rect className="art-bar" x="206" y={y - 7} width={s.w * 1.66} height="6" rx="3" fill={`url(#${id}-bar)`} />
              <text x="340" y={y} style={VALUE} fill={BRAND.violet} textAnchor="end">
                {s.v}
              </text>
            </g>
          );
        })}

        <rect x="184" y="150" width="72" height="18" rx="9" fill={`url(#${id}-brandSoft)`} />
        <text x="220" y="162" style={{ ...CAPTION, fontSize: 7 }} fill={BRAND.violet} textAnchor="middle">
          ALLRED 8/8
        </text>
        <rect x="264" y="150" width="76" height="18" rx="9" fill={`url(#${id}-brandSoft)`} />
        <text x="302" y="162" style={{ ...CAPTION, fontSize: 7 }} fill={BRAND.violet} textAnchor="middle">
          H-SCORE 245
        </text>
      </>
    ),

    /* ---------- Ki-67 index with ranked proliferation hotspots ---------- */
    ki67: (
      <>
        {frame}
        <clipPath id={`${id}-clip`}>
          <rect x="18" y="18" width="204" height="164" rx="12" />
        </clipPath>
        <rect x="18" y="18" width="204" height="164" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-clip)`}>
          {[
            [64, 62, 0.3], [140, 58, 0.16], [188, 108, 0.24], [70, 140, 0.12],
            [126, 128, 0.2], [196, 52, 0.1],
          ].map(([cx, cy, o], i) => (
            <circle key={i} className="art-heat" cx={cx} cy={cy} r="38" fill={BRAND.pink} opacity={o} />
          ))}
          {Array.from({ length: 40 }, (_, i) => {
            const cx = 28 + ((i * 37) % 186);
            const cy = 30 + ((i * 53) % 146);
            return (
              <circle
                key={i}
                className="art-cell"
                cx={cx}
                cy={cy}
                r="3.4"
                fill={i % 3 === 0 ? BRAND.fuchsia : BRAND.violet}
                opacity={i % 3 === 0 ? 0.6 : 0.24}
              />
            );
          })}

          {/* Ranked hotspots */}
          {[
            [64, 62, '1'], [188, 108, '2'], [126, 128, '3'],
          ].map(([cx, cy, n]) => (
            <g key={n}>
              <circle
                className="art-node"
                cx={cx}
                cy={cy}
                r="26"
                stroke={BRAND.fuchsia}
                strokeWidth="1.5"
                strokeDasharray="5 5"
                fill="none"
              />
              <circle cx={cx + 20} cy={cy - 20} r="8" fill={BRAND.violet} />
              <text x={cx + 20} y={cy - 17} style={{ ...CAPTION, fontSize: 8 }} fill="#FFFFFF" textAnchor="middle">
                {n}
              </text>
            </g>
          ))}
        </g>

        <text x="238" y="44" style={{ ...CAPTION, fontSize: 7 }} fill="#94A3B8">
          GLOBAL INDEX
        </text>
        <text x="238" y="66" style={BIG} fill="#111827">
          24%
        </text>
        <path d="M238 78 L340 78" stroke="#F3E8FF" strokeWidth="1.2" />

        {[
          { k: 'HOTSPOT 1', v: '41%' },
          { k: 'HOTSPOT 2', v: '36%' },
          { k: 'HOTSPOT 3', v: '32%' },
        ].map((h, i) => {
          const y = 100 + i * 26;
          return (
            <g key={h.k}>
              <text x="238" y={y} style={{ ...CAPTION, fontSize: 7 }} fill="#94A3B8">
                {h.k}
              </text>
              <text x="340" y={y} style={VALUE} fill={BRAND.violet} textAnchor="end">
                {h.v}
              </text>
              <rect x="238" y={y + 6} width="102" height="4" rx="2" fill="#F3E8FF" />
              <rect
                className="art-bar"
                x="238"
                y={y + 6}
                width={102 - i * 14}
                height="4"
                rx="2"
                fill={`url(#${id}-bar)`}
              />
            </g>
          );
        })}
      </>
    ),

    /* ---------- HER2 membrane completeness and intensity ---------- */
    her2: (
      <>
        {frame}
        <clipPath id={`${id}-clip`}>
          <rect x="18" y="18" width="186" height="164" rx="12" />
        </clipPath>
        <rect x="18" y="18" width="186" height="164" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-clip)`}>
          {/* Membrane-stained cells: the dash pattern reads as completeness */}
          {[
            [56, 56, 1], [116, 48, 0.72], [172, 62, 0.9], [48, 116, 0.55],
            [108, 112, 1], [166, 122, 0.78], [76, 164, 0.66], [146, 168, 0.88],
          ].map(([cx, cy, complete], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="20" fill={BRAND.violet} opacity="0.05" />
              <circle
                className="art-cell"
                cx={cx}
                cy={cy}
                r="20"
                stroke={BRAND.fuchsia}
                strokeWidth="3.4"
                strokeLinecap="round"
                fill="none"
                opacity="0.72"
                strokeDasharray={`${2 * Math.PI * 20 * complete} ${2 * Math.PI * 20}`}
                transform={`rotate(${-90 + i * 24} ${cx} ${cy})`}
              />
              <circle cx={cx} cy={cy} r="6" fill={BRAND.violet} opacity="0.28" />
            </g>
          ))}
        </g>

        <text x="222" y="44" style={{ ...CAPTION, fontSize: 7 }} fill="#94A3B8">
          MEMBRANE SCORE
        </text>
        <text x="222" y="70" style={{ ...BIG, fontSize: 26 }} fill="#111827">
          2+
        </text>
        <rect x="278" y="50" width="62" height="18" rx="9" fill={`url(#${id}-brandSoft)`} />
        <text x="309" y="62" style={{ ...CAPTION, fontSize: 6.5 }} fill={BRAND.violet} textAnchor="middle">
          EQUIVOCAL
        </text>

        {[
          { k: 'COMPLETENESS', v: '78%', w: 92 },
          { k: 'INTENSITY', v: 'MODERATE', w: 68 },
          { k: 'STAINED CELLS', v: '64%', w: 75 },
        ].map((m, i) => {
          const y = 100 + i * 28;
          return (
            <g key={m.k}>
              <text x="222" y={y} style={{ ...CAPTION, fontSize: 7 }} fill="#94A3B8">
                {m.k}
              </text>
              <text x="340" y={y} style={{ ...VALUE, fontSize: 8.5 }} fill={BRAND.violet} textAnchor="end">
                {m.v}
              </text>
              <rect x="222" y={y + 6} width="118" height="5" rx="2.5" fill="#F3E8FF" />
              <rect className="art-bar" x="222" y={y + 6} width={m.w} height="5" rx="2.5" fill={`url(#${id}-bar)`} />
            </g>
          );
        })}
      </>
    ),

    /* ---------- CD3 / CD8 spatial immune density ---------- */
    immune: (
      <>
        {frame}
        <clipPath id={`${id}-clip`}>
          <rect x="18" y="18" width="200" height="164" rx="12" />
        </clipPath>
        <rect x="18" y="18" width="200" height="164" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-clip)`}>
          {/* Intratumoral compartment */}
          <path
            d="M18 58 C 60 30, 112 48, 152 36 C 186 26, 208 38, 218 32 L218 96 C 186 112, 140 96, 96 110 C 60 122, 38 112, 18 122 Z"
            fill={BRAND.violet}
            opacity="0.15"
          />
          {/* Stromal compartment */}
          <path
            d="M18 122 C 44 110, 82 126, 124 114 C 164 103, 200 116, 218 96 L218 182 L18 182 Z"
            fill={BRAND.pink}
            opacity="0.11"
          />

          {[
            [40, 70], [64, 56], [88, 78], [112, 62], [136, 82], [160, 66],
            [184, 84], [206, 68], [50, 120], [76, 134], [102, 118], [128, 140],
            [154, 124], [180, 144], [204, 126], [34, 152], [90, 164], [144, 166],
            [198, 158], [122, 92], [56, 96], [172, 104],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              className="art-cell"
              cx={cx}
              cy={cy}
              r="3.4"
              fill={i % 3 === 0 ? BRAND.pink : BRAND.violet}
              opacity="0.78"
            />
          ))}

          <circle cx="128" cy="140" r="28" stroke={BRAND.violet} strokeWidth="1.2" strokeDasharray="5 5" fill="none" opacity="0.65" />
          <circle cx="160" cy="66" r="22" stroke={BRAND.pink} strokeWidth="1.2" strokeDasharray="5 5" fill="none" opacity="0.65" />
          <path d="M128 140 L160 66" stroke={BRAND.fuchsia} strokeWidth="1.1" strokeDasharray="4 4" opacity="0.55" />
        </g>

        {[
          { k: 'CD3 INTRATUMORAL', v: '412 /mm²', c: BRAND.violet, w: 62 },
          { k: 'CD8 INTRATUMORAL', v: '186 /mm²', c: BRAND.fuchsia, w: 34 },
          { k: 'CD3 STROMAL', v: '1180 /mm²', c: BRAND.purple, w: 108 },
          { k: 'CD8 STROMAL', v: '604 /mm²', c: BRAND.pink, w: 74 },
        ].map((m, i) => {
          const y = 46 + i * 34;
          return (
            <g key={m.k}>
              <circle cx="238" cy={y - 3.5} r="3.2" fill={m.c} />
              <text x="248" y={y} style={{ ...CAPTION, fontSize: 6.5 }} fill="#94A3B8">
                {m.k}
              </text>
              <text x="238" y={y + 12} style={{ ...VALUE, fontSize: 9 }} fill={BRAND.violet}>
                {m.v}
              </text>
              <rect x="238" y={y + 19} width="102" height="4" rx="2" fill="#F3E8FF" />
              <rect className="art-bar" x="238" y={y + 19} width={m.w} height="4" rx="2" fill={`url(#${id}-bar)`} />
            </g>
          );
        })}
      </>
    ),

    /* ---------- PIK3CA mutation probability (research) ---------- */
    pik3ca: (
      <>
        {frame}
        {researchTag}
        <clipPath id={`${id}-clip`}>
          <rect x="18" y="44" width="132" height="138" rx="12" />
        </clipPath>
        <rect x="18" y="44" width="132" height="138" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-clip)`}>
          {/* Morphology tiles feeding the model */}
          {Array.from({ length: 12 }, (_, i) => {
            const c = i % 4;
            const r = Math.floor(i / 4);
            const o = [0.08, 0.18, 0.3, 0.12][(i * 3) % 4];
            return (
              <rect
                key={i}
                className="art-heat"
                x={22 + c * 32}
                y={48 + r * 44}
                width="30"
                height="42"
                rx="6"
                fill={i % 3 === 0 ? BRAND.pink : BRAND.violet}
                opacity={o}
              />
            );
          })}
          {Array.from({ length: 22 }, (_, i) => (
            <circle
              key={i}
              className="art-cell"
              cx={26 + ((i * 41) % 118)}
              cy={52 + ((i * 59) % 126)}
              r="3"
              fill={BRAND.violet}
              opacity="0.3"
            />
          ))}
        </g>

        <text x="26" y="36" style={{ ...CAPTION, fontSize: 7 }} fill="#94A3B8">
          H&amp;E MORPHOLOGY
        </text>

        <path
          className="art-flow"
          d="M158 112 L188 112"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 5"
          strokeLinecap="round"
        />
        <path d="M182 106 L190 112 L182 118" stroke={BRAND.fuchsia} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        <Gauge id={id} cx={268} cy={132} r={44} value={0.68} label="0.68" caption="PROBABILITY" />
        <text x="268" y="164" style={{ ...CAPTION, fontSize: 7 }} fill={BRAND.violet} textAnchor="middle">
          PIK3CA · PREDICTED
        </text>
      </>
    ),

    /* ---------- TP53 mutation score (research) ---------- */
    tp53: (
      <>
        {frame}
        {researchTag}
        <clipPath id={`${id}-clip`}>
          <rect x="18" y="44" width="132" height="138" rx="12" />
        </clipPath>
        <rect x="18" y="44" width="132" height="138" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-clip)`}>
          <ellipse cx="60" cy="86" rx="38" ry="26" fill={BRAND.violet} opacity="0.1" />
          <ellipse cx="112" cy="142" rx="40" ry="28" fill={BRAND.pink} opacity="0.09" />
          {Array.from({ length: 26 }, (_, i) => (
            <circle
              key={i}
              className="art-cell"
              cx={26 + ((i * 43) % 118)}
              cy={52 + ((i * 61) % 124)}
              r={i % 4 === 0 ? 4.6 : 3.2}
              fill={i % 4 === 0 ? BRAND.fuchsia : BRAND.violet}
              opacity={i % 4 === 0 ? 0.5 : 0.26}
            />
          ))}
          {/* Pleomorphism callouts — the morphology the model keys on */}
          <circle cx="74" cy="98" r="18" stroke={BRAND.fuchsia} strokeWidth="1.3" strokeDasharray="4 4" fill="none" opacity="0.7" />
          <circle cx="118" cy="146" r="16" stroke={BRAND.violet} strokeWidth="1.3" strokeDasharray="4 4" fill="none" opacity="0.7" />
        </g>

        <text x="26" y="36" style={{ ...CAPTION, fontSize: 7 }} fill="#94A3B8">
          NUCLEAR PLEOMORPHISM
        </text>

        {/* Score distribution with the case marker */}
        <text x="176" y="60" style={{ ...CAPTION, fontSize: 7 }} fill="#94A3B8">
          TP53 SCORE
        </text>
        <text x="340" y="62" style={{ ...BIG, fontSize: 18 }} fill="#111827" textAnchor="end">
          0.41
        </text>

        <path
          d="M176 128 C 196 128, 200 88, 224 88 C 248 88, 254 118, 276 118 C 298 118, 306 96, 340 96"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M176 128 C 196 128, 200 88, 224 88 C 248 88, 254 118, 276 118 C 298 118, 306 96, 340 96 L340 142 L176 142 Z"
          fill={`url(#${id}-brandSoft)`}
        />

        <rect x="176" y="142" width="164" height="6" rx="3" fill="#F3E8FF" />
        <rect className="art-bar" x="176" y="142" width={164 * 0.41} height="6" rx="3" fill={`url(#${id}-bar)`} />
        <g className="art-node">
          <circle cx={176 + 164 * 0.41} cy="145" r="6" fill="#FFFFFF" stroke={BRAND.fuchsia} strokeWidth="2" />
        </g>
        <text x="176" y="166" style={{ ...CAPTION, fontSize: 6.5 }} fill="#94A3B8">
          0.0
        </text>
        <text x="340" y="166" style={{ ...CAPTION, fontSize: 6.5 }} fill="#94A3B8" textAnchor="end">
          1.0
        </text>
      </>
    ),

    /* ---------- HRD morphology phenotype score (research) ---------- */
    hrd: (
      <>
        {frame}
        {researchTag}
        <clipPath id={`${id}-clip`}>
          <rect x="18" y="44" width="132" height="138" rx="12" />
        </clipPath>
        <rect x="18" y="44" width="132" height="138" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-clip)`}>
          {/* Solid, pushing-margin growth pattern */}
          <path
            d="M18 96 C 44 74, 74 92, 100 78 C 122 66, 142 76, 150 70 L150 124 C 124 142, 92 124, 62 138 C 42 148, 28 142, 18 148 Z"
            fill={BRAND.violet}
            opacity="0.13"
          />
          <path
            d="M18 96 C 44 74, 74 92, 100 78 C 122 66, 142 76, 150 70"
            stroke={BRAND.fuchsia}
            strokeWidth="1.5"
            strokeDasharray="6 5"
            fill="none"
            opacity="0.75"
          />
          {Array.from({ length: 30 }, (_, i) => (
            <circle
              key={i}
              className="art-cell"
              cx={26 + ((i * 47) % 118)}
              cy={52 + ((i * 67) % 124)}
              r="3.2"
              fill={i % 3 === 0 ? BRAND.fuchsia : BRAND.violet}
              opacity={i % 3 === 0 ? 0.5 : 0.26}
            />
          ))}
        </g>

        <text x="26" y="36" style={{ ...CAPTION, fontSize: 7 }} fill="#94A3B8">
          GROWTH ARCHITECTURE
        </text>

        {/* Phenotype feature profile */}
        {[
          { k: 'SOLID GROWTH', w: 104 },
          { k: 'PUSHING MARGIN', w: 88 },
          { k: 'TIL DENSITY', w: 118 },
          { k: 'NUCLEAR GRADE', w: 132 },
        ].map((f, i) => {
          const y = 62 + i * 22;
          return (
            <g key={f.k}>
              <text x="176" y={y} style={{ ...CAPTION, fontSize: 6.5 }} fill="#94A3B8">
                {f.k}
              </text>
              <rect x="176" y={y + 5} width="140" height="4" rx="2" fill="#F3E8FF" />
              <rect className="art-bar" x="176" y={y + 5} width={f.w} height="4" rx="2" fill={`url(#${id}-bar)`} />
            </g>
          );
        })}

        <path d="M176 158 L340 158" stroke="#F3E8FF" strokeWidth="1.2" />
        <text x="176" y="176" style={{ ...CAPTION, fontSize: 7 }} fill="#94A3B8">
          HRD PHENOTYPE
        </text>
        <text x="340" y="178" style={{ ...BIG, fontSize: 18 }} fill={BRAND.violet} textAnchor="end">
          0.72
        </text>
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 360 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <Defs id={id} />
      {shapes[name]}
    </svg>
  );
}

/* =================================================================
   TIER C — the pCR decision model (420 x 260)
================================================================= */
export function PcrArt({ className = '' }) {
  const id = 'omi-pcr';

  const inputs = [
    { k: 'HISTOLOGY', v: 'Grade 3 · solid' },
    { k: 'BIOMARKERS', v: 'ER 95 · Ki-67 24' },
    { k: 'IMMUNE ARCHITECTURE', v: 'TIL high' },
  ];

  return (
    <svg
      viewBox="0 0 420 260"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Histology, biomarker and immune architecture inputs combining through AI modelling into a research-use pathological complete response prediction score"
    >
      <Defs id={id} />

      <circle cx="80" cy="60" r="120" fill={`url(#${id}-halo)`} />
      <circle cx="340" cy="210" r="110" fill={`url(#${id}-haloPink)`} />

      {/* Input rows */}
      {inputs.map((n, i) => {
        const y = 40 + i * 56;
        return (
          <g key={n.k}>
            <rect x="16" y={y} width="150" height="40" rx="12" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.2" />
            <circle cx="38" cy={y + 20} r="9" fill={`url(#${id}-brandSoft)`} />
            <circle className="pcr-node" cx="38" cy={y + 20} r="3.4" fill={BRAND.fuchsia} />
            <text x="56" y={y + 17} style={{ ...CAPTION, fontSize: 6.5 }} fill="#94A3B8">
              {n.k}
            </text>
            <text x="56" y={y + 30} style={{ ...VALUE, fontSize: 8.5 }} fill="#111827">
              {n.v}
            </text>

            <path
              className="pcr-wire"
              d={`M170 ${y + 20} C 196 ${y + 20}, 200 130, 226 130`}
              stroke={`url(#${id}-line)`}
              strokeWidth="1.5"
              strokeDasharray="5 6"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );
      })}

      {/* AI modelling core */}
      <circle cx="248" cy="130" r="30" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.2" />
      <circle className="pcr-core" cx="248" cy="130" r="22" fill={`url(#${id}-brandSoft)`} />
      {[
        [240, 120], [258, 122], [236, 138], [256, 140], [248, 130],
      ].map(([cx, cy], i) => (
        <circle key={i} className="pcr-node" cx={cx} cy={cy} r="2.6" fill={BRAND.violet} opacity="0.8" />
      ))}
      <path
        d="M240 120 L248 130 L258 122 M236 138 L248 130 L256 140"
        stroke={BRAND.fuchsia}
        strokeWidth="1.1"
        strokeOpacity="0.6"
        fill="none"
        strokeLinecap="round"
      />
      <text x="248" y="176" style={{ ...CAPTION, fontSize: 6.5 }} fill="#94A3B8" textAnchor="middle">
        AI MODELING
      </text>

      <path
        className="pcr-wire"
        d="M280 130 L308 130"
        stroke={`url(#${id}-line)`}
        strokeWidth="1.6"
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
      <path d="M302 124 L310 130 L302 136" stroke={BRAND.fuchsia} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* pCR readout */}
      <rect x="318" y="74" width="88" height="112" rx="16" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.2" filter={`url(#${id}-card)`} />
      <text x="362" y="98" style={{ ...CAPTION, fontSize: 6.5 }} fill="#94A3B8" textAnchor="middle">
        pCR PREDICTION
      </text>
      <Gauge id={id} cx={362} cy={146} r={32} value={0.63} label="0.63" />
      <rect x="330" y="158" width="64" height="16" rx="8" fill={`url(#${id}-brandSoft)`} />
      <text x="362" y="169" style={{ ...CAPTION, fontSize: 6.5 }} fill={BRAND.violet} textAnchor="middle">
        RESEARCH USE
      </text>
    </svg>
  );
}

/* =================================================================
   Tier and pipeline glyphs (32 x 32)
================================================================= */
export function IhcIcon({ name, uid = '', className = '' }) {
  const id = `omi-i-${name}${uid}`;
  const stroke = `url(#${id}-brand)`;
  const common = {
    stroke,
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  };

  const shapes = {
    /* Tier A — direct measurement */
    quantify: (
      <>
        <rect x="5" y="6" width="22" height="20" rx="4" {...common} />
        <path d="M10 21 L10 15 M15 21 L15 11 M20 21 L20 17 M25 21 L25 13" {...common} strokeOpacity="0.7" />
      </>
    ),
    /* Tier B — inference from morphology */
    predict: (
      <>
        <circle cx="9" cy="9" r="2.6" {...common} />
        <circle cx="9" cy="23" r="2.6" {...common} />
        <circle cx="18" cy="16" r="2.6" {...common} />
        <circle cx="26" cy="16" r="2.4" {...common} />
        <path d="M11.3 10.4 L15.8 14.4 M11.3 21.6 L15.8 17.6 M20.6 16 L23.6 16" {...common} strokeOpacity="0.6" />
      </>
    ),
    /* Tier C — decision support */
    decide: (
      <>
        <path d="M5 22 A 11 11 0 0 1 27 22" {...common} />
        <path d="M16 22 L22 13" {...common} strokeOpacity="0.75" />
        <circle cx="16" cy="22" r="2" {...common} />
        <path d="M8 27 L24 27" {...common} strokeOpacity="0.45" />
      </>
    ),
    mask: (
      <>
        <rect x="5" y="7" width="22" height="18" rx="4" {...common} />
        <path d="M8 18 C 12 12, 18 16, 24 11" {...common} strokeDasharray="3 3" strokeOpacity="0.75" />
        <circle cx="12" cy="21" r="1.6" {...common} strokeOpacity="0.5" />
        <circle cx="20" cy="20" r="1.6" {...common} strokeOpacity="0.5" />
      </>
    ),
    nuclei: (
      <>
        <circle cx="16" cy="16" r="11" {...common} />
        <circle cx="12" cy="13" r="2.4" {...common} strokeOpacity="0.65" />
        <circle cx="20" cy="14" r="2.4" {...common} strokeOpacity="0.65" />
        <circle cx="15" cy="21" r="2.4" {...common} strokeOpacity="0.65" />
      </>
    ),
    hotspot: (
      <>
        <rect x="5" y="6" width="22" height="20" rx="4" {...common} />
        <circle cx="13" cy="14" r="4.5" {...common} strokeOpacity="0.75" />
        <circle cx="21" cy="20" r="3" {...common} strokeOpacity="0.55" />
        <path d="M13 9.5 L13 7" {...common} strokeOpacity="0.4" />
      </>
    ),
    membrane: (
      <>
        <circle cx="16" cy="16" r="10" {...common} strokeDasharray="12 5" />
        <circle cx="16" cy="16" r="3.4" {...common} strokeOpacity="0.6" />
      </>
    ),
    immune: (
      <>
        <path d="M5 9 L12 6 L20 9 L27 6 L27 23 L20 26 L12 23 L5 26 Z" {...common} />
        <circle cx="12" cy="14" r="1.8" {...common} strokeOpacity="0.7" />
        <circle cx="20" cy="18" r="1.8" {...common} strokeOpacity="0.7" />
      </>
    ),
    histology: (
      <>
        <rect x="4" y="8" width="24" height="16" rx="3" {...common} />
        <ellipse cx="13" cy="16" rx="5" ry="3.4" {...common} strokeOpacity="0.55" />
        <circle cx="21" cy="17" r="2.4" {...common} strokeOpacity="0.55" />
      </>
    ),
    biomarker: (
      <>
        <circle cx="14" cy="14" r="8" {...common} />
        <path d="M20 20 L27 27" {...common} />
        <path d="M10 15 L12.5 15 L14 11 L16 18 L17.5 14 L18.5 15" {...common} strokeOpacity="0.65" />
      </>
    ),
    ai: (
      <>
        <rect x="8" y="8" width="16" height="16" rx="4" {...common} />
        <path d="M13 4 L13 8 M19 4 L19 8 M13 24 L13 28 M19 24 L19 28 M4 13 L8 13 M4 19 L8 19 M24 13 L28 13 M24 19 L28 19" {...common} strokeOpacity="0.55" />
        <circle cx="16" cy="16" r="3" {...common} strokeOpacity="0.75" />
      </>
    ),
    pcr: (
      <>
        <path d="M16 4 A 8 8 0 0 1 20 19 L20 23 L12 23 L12 19 A 8 8 0 0 1 16 4 Z" {...common} />
        <path d="M13 27 L19 27" {...common} strokeOpacity="0.6" />
        <path d="M13 13 L15.5 16 L19 11" {...common} strokeOpacity="0.6" />
      </>
    ),
    molecular: (
      <>
        <path d="M10 5 C 10 12, 22 12, 22 19 C 22 26, 10 26, 10 27" {...common} strokeOpacity="0.75" />
        <path d="M22 5 C 22 12, 10 12, 10 19 C 10 26, 22 26, 22 27" {...common} strokeOpacity="0.75" />
        <path d="M11.5 9.5 L20.5 9.5 M11 16 L21 16 M11.5 22.5 L20.5 22.5" {...common} strokeOpacity="0.45" />
      </>
    ),
    shield: (
      <>
        <path d="M16 4 L26 8 V16 C 26 22, 21 26, 16 28 C 11 26, 6 22, 6 16 V8 Z" {...common} />
        <path d="M12 16 L15 19 L20 13" {...common} strokeOpacity="0.7" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <Defs id={id} />
      {shapes[name]}
    </svg>
  );
}
