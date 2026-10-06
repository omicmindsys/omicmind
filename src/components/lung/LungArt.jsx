import React from 'react';

/* ------------------------------------------------------------------
   Illustration set for the Lung Cancer solution page.

   Same conventions as the Breast and Research sets: every drawing
   lives in a fixed viewBox and renders at w-full, so one set of
   coordinates scales to every breakpoint. Gradient ids are namespaced
   per illustration because several of these render more than once on
   a page (desktop + mobile workflow tracks, for instance).
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

/* =================================================================
   Ambient background — a stylised alveolar field with a bronchial
   tree, used behind the hero. Deliberately low contrast so the
   headline stays the highest-contrast element on the page.
================================================================= */
export function AlveolarField({ className = '' }) {
  const id = 'oml-field';

  /* Alveolar sacs — open air spaces ringed by septal walls */
  const alveoli = [];
  for (let i = 0; i < 128; i += 1) {
    const x = (i * 173.3) % 1440;
    const y = (i * 97.7) % 520;
    const r = 13 + ((i * 13) % 5) * 4.5;
    alveoli.push([x, y, r]);
  }

  /* Bronchial branches threading between the sacs */
  const airways = [
    'M-40 470 C 180 430, 250 300, 420 268 C 560 240, 640 168, 760 150',
    'M420 268 C 470 340, 560 372, 690 386',
    'M760 150 C 900 132, 1010 196, 1130 214 C 1260 234, 1360 190, 1480 176',
    'M1130 214 C 1160 300, 1080 356, 990 400',
  ];

  /* Scattered nuclei along the septa */
  const nuclei = [];
  for (let i = 0; i < 170; i += 1) {
    const x = (i * 211.7) % 1440;
    const y = (i * 143.3) % 520;
    nuclei.push([x, y, 1.5 + ((i * 7) % 4) * 0.45]);
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

      {airways.map((d, i) => (
        <g key={i}>
          <path d={d} stroke={BRAND.purple} strokeOpacity="0.14" strokeWidth="9" strokeLinecap="round" />
          <path d={d} stroke={BRAND.pink} strokeOpacity="0.10" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}

      {alveoli.map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill={BRAND.violet} opacity="0.04" />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={i % 4 === 0 ? BRAND.pink : BRAND.purple}
            strokeOpacity="0.13"
            strokeWidth="1.2"
          />
        </g>
      ))}

      <g fill={BRAND.violet} opacity="0.13">
        {nuclei.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
    </svg>
  );
}

/* =================================================================
   HERO — the lung pathology stack: whole slide viewer with an AI
   tumour heatmap, PD-L1 scoring, molecular prediction and a spatial
   immune map, stitched together by an inference graph.
================================================================= */
export function LungHeroArt({ className = '' }) {
  const id = 'oml-hero';

  /* Alveolar architecture inside the slide */
  const alveoli = [
    { cx: 116, cy: 152, r: 26 },
    { cx: 166, cy: 190, r: 21 },
    { cx: 124, cy: 224, r: 19 },
    { cx: 206, cy: 148, r: 23 },
    { cx: 96, cy: 194, r: 15 },
    { cx: 178, cy: 254, r: 22 },
    { cx: 232, cy: 214, r: 17 },
    { cx: 116, cy: 268, r: 16 },
  ];

  /* Dense tumour nest — the region the model flags */
  const tumourNuclei = [];
  for (let i = 0; i < 26; i += 1) {
    const cx = 208 + ((i * 37) % 88);
    const cy = 176 + ((i * 53) % 62);
    tumourNuclei.push([cx, cy]);
  }

  /* AI heatmap tiles over the slide */
  const heat = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 6; c += 1) {
      const o = [0.05, 0.09, 0.2, 0.3, 0.15, 0.07][(r * 3 + c * 2) % 6];
      heat.push({ x: 74 + c * 49, y: 110 + r * 47, o, warm: c >= 3 && r >= 1 });
    }
  }

  const scores = [
    { label: 'PD-L1 TPS', value: '65%', w: 91 },
    { label: 'CPS', value: '42', w: 59 },
    { label: 'CD8 density', value: 'High', w: 118 },
    { label: 'Ki-67', value: '31%', w: 43 },
  ];

  const calls = [
    { label: 'EGFR pattern', value: 'Likely' },
    { label: 'ALK fusion', value: 'Low' },
    { label: 'KRAS G12C', value: '0.71' },
  ];

  return (
    <svg
      viewBox="0 0 600 520"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Lung whole slide image with an AI tumour heatmap, PD-L1 biomarker scoring, molecular prediction and a spatial immune map connected as one pipeline"
    >
      <Defs id={id} />

      {/* Ambient lighting */}
      <circle cx="150" cy="130" r="190" fill={`url(#${id}-halo)`} />
      <circle cx="470" cy="400" r="180" fill={`url(#${id}-haloPink)`} />

      {/* ---- Inference graph behind the cards ---- */}
      <g opacity="0.85">
        <path
          className="lhero-wire"
          d="M386 196 C 396 196, 394 186, 404 186"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <path
          className="lhero-wire"
          d="M168 314 C 168 334, 148 334, 148 352"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <path
          className="lhero-wire"
          d="M320 314 C 320 336, 392 336, 400 352"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <path
          className="lhero-wire"
          d="M492 300 C 492 330, 470 330, 470 352"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
      </g>

      {/* ================= Slide viewer ================= */}
      <g className="lhero-float-a">
        <Panel id={id} x={56} y={64} w={330} h={250} r={18} />

        <circle cx="78" cy="86" r="3.4" fill="#E9D5FF" />
        <circle cx="90" cy="86" r="3.4" fill="#FBCFE8" />
        <circle cx="102" cy="86" r="3.4" fill="#EDE9FE" />
        <text x="118" y="89.5" style={LABEL} fill="#475569">
          Lung WSI · H&amp;E
        </text>
        <rect x="302" y="78" width="68" height="17" rx="8.5" fill={`url(#${id}-brandSoft)`} />
        <text x="336" y="89.5" style={CAPTION} fill={BRAND.violet} textAnchor="middle">
          40× SCAN
        </text>

        <clipPath id={`${id}-slide`}>
          <rect x="72" y="106" width="298" height="194" rx="12" />
        </clipPath>
        <rect x="72" y="106" width="298" height="194" rx="12" fill="#FDFBFF" stroke="#F3E8FF" />

        <g clipPath={`url(#${id}-slide)`}>
          {/* Airway threading through the field */}
          <path
            d="M62 288 C 120 268, 150 214, 214 202 C 268 192, 320 156, 386 148"
            stroke={BRAND.purple}
            strokeOpacity="0.2"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Alveolar architecture */}
          {alveoli.map((a, i) => (
            <g key={i}>
              <circle cx={a.cx} cy={a.cy} r={a.r} fill={BRAND.violet} opacity="0.08" />
              <circle
                cx={a.cx}
                cy={a.cy}
                r={a.r}
                stroke={BRAND.purple}
                strokeOpacity="0.3"
                strokeWidth="1.1"
              />
              <circle cx={a.cx} cy={a.cy} r={a.r * 0.42} fill="#FFFFFF" opacity="0.55" />
            </g>
          ))}

          {/* Solid tumour nest */}
          <path
            d="M204 172 C 236 156, 288 160, 304 186 C 318 210, 300 240, 266 246 C 232 252, 202 232, 200 208 Z"
            fill={BRAND.pink}
            opacity="0.16"
          />
          {tumourNuclei.map(([cx, cy], i) => (
            <circle
              key={i}
              className="lhero-nucleus"
              cx={cx}
              cy={cy}
              r="3.2"
              fill={BRAND.fuchsia}
              opacity="0.55"
            />
          ))}

          {/* AI heatmap */}
          <g>
            {heat.map((t, i) => (
              <rect
                key={i}
                className="lhero-heat"
                x={t.x}
                y={t.y}
                width="47"
                height="45"
                rx="7"
                fill={t.warm ? BRAND.pink : BRAND.violet}
                opacity={t.o}
              />
            ))}
          </g>

          {/* Tiling grid */}
          <g stroke={BRAND.violet} strokeOpacity="0.15" strokeWidth="0.8">
            {[0, 1, 2, 3, 4, 5, 6].map((c) => (
              <line key={`v${c}`} x1={72 + c * 49} y1="106" x2={72 + c * 49} y2="300" />
            ))}
            {[0, 1, 2, 3, 4].map((r) => (
              <line key={`h${r}`} x1="72" y1={106 + r * 47} x2="370" y2={106 + r * 47} />
            ))}
          </g>

          {/* Segmentation contour around the tumour */}
          <path
            className="lhero-contour"
            d="M196 168 C 234 148, 294 152, 312 184 C 328 212, 306 248, 266 254 C 226 260, 194 236, 192 208 Z"
            stroke={BRAND.pink}
            strokeWidth="1.6"
            strokeDasharray="6 5"
            fill="none"
          />

          {/* Scanning sweep */}
          <rect className="lhero-scan" x="72" y="106" width="3" height="194" fill={`url(#${id}-scan)`} />
        </g>

        <rect x="196" y="120" width="106" height="16" rx="8" fill={BRAND.pink} opacity="0.92" />
        <text x="249" y="131" style={CAPTION} fill="#FFFFFF" textAnchor="middle">
          ADENOCARCINOMA
        </text>
      </g>

      {/* ================= Biomarker scoring ================= */}
      <g className="lhero-float-b">
        <Panel id={id} x={404} y={110} w={172} h={190} r={16} />
        <text x="420" y="136" style={LABEL} fill="#111827">
          Biomarker Scoring
        </text>
        <rect x="420" y="144" width="34" height="2" rx="1" fill={`url(#${id}-bar)`} />

        {scores.map((s, i) => {
          const y = 168 + i * 32;
          return (
            <g key={s.label}>
              <text x="420" y={y} style={LABEL} fill="#475569">
                {s.label}
              </text>
              <text x="560" y={y} style={VALUE} fill={BRAND.violet} textAnchor="end">
                {s.value}
              </text>
              <rect x="420" y={y + 7} width="140" height="6" rx="3" fill="#F3E8FF" />
              <rect
                className="lhero-bar"
                x="420"
                y={y + 7}
                width={s.w}
                height="6"
                rx="3"
                fill={`url(#${id}-bar)`}
              />
            </g>
          );
        })}
      </g>

      {/* ================= Molecular prediction ================= */}
      <g className="lhero-float-c">
        <Panel id={id} x={56} y={352} w={220} h={136} r={16} />
        <text x="72" y="378" style={LABEL} fill="#111827">
          Molecular Prediction
        </text>
        <rect x="72" y="386" width="34" height="2" rx="1" fill={`url(#${id}-bar)`} />

        {calls.map((c, i) => {
          const y = 400 + i * 26;
          return (
            <g key={c.label}>
              <rect x="72" y={y} width="188" height="20" rx="10" fill="#FCFAFF" stroke="#F3E8FF" />
              <circle className="lhero-node" cx="84" cy={y + 10} r="3.2" fill={`url(#${id}-bar)`} />
              <text x="95" y={y + 13.5} style={LABEL} fill="#475569">
                {c.label}
              </text>
              <text x="248" y={y + 13.5} style={VALUE} fill={BRAND.pink} textAnchor="end">
                {c.value}
              </text>
            </g>
          );
        })}
      </g>

      {/* ================= Spatial immune map ================= */}
      <g className="lhero-float-d">
        <Panel id={id} x={300} y={352} w={256} h={136} r={16} />
        <text x="316" y="378" style={LABEL} fill="#111827">
          Tumour Microenvironment
        </text>
        <rect x="316" y="386" width="34" height="2" rx="1" fill={`url(#${id}-bar)`} />

        <clipPath id={`${id}-map`}>
          <rect x="316" y="396" width="112" height="76" rx="10" />
        </clipPath>
        <rect x="316" y="396" width="112" height="76" rx="10" fill="#FDFBFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-map)`}>
          <path
            d="M316 396 C 348 404, 372 392, 404 400 L428 400 L428 430 C 396 440, 360 424, 316 434 Z"
            fill={BRAND.violet}
            opacity="0.16"
          />
          <path
            d="M316 434 C 356 424, 396 442, 428 430 L428 472 L316 472 Z"
            fill={BRAND.pink}
            opacity="0.13"
          />
          <ellipse cx="382" cy="428" rx="26" ry="18" fill={BRAND.fuchsia} opacity="0.14" />
          {[
            [330, 410], [344, 432], [360, 416], [372, 440], [388, 424],
            [402, 446], [416, 428], [336, 452], [356, 460], [408, 464],
            [324, 434], [420, 408],
          ].map(([cx, cy], i) => (
            <circle key={i} className="lhero-nucleus" cx={cx} cy={cy} r="2.6" fill={BRAND.violet} opacity="0.8" />
          ))}
          <circle
            cx="372"
            cy="432"
            r="26"
            stroke={BRAND.pink}
            strokeWidth="1.2"
            strokeDasharray="5 5"
            fill="none"
          />
        </g>

        {[
          { k: 'CD8+ T cells', v: 'high', w: 70 },
          { k: 'Stroma', v: 'mid', w: 50 },
          { k: 'Macrophage', v: 'low', w: 28 },
        ].map((l, i) => {
          const y = 408 + i * 26;
          return (
            <g key={l.k}>
              <text x="444" y={y} style={LABEL} fill="#475569">
                {l.k}
              </text>
              <rect x="444" y={y + 6} width="92" height="5" rx="2.5" fill="#F3E8FF" />
              <rect
                className="lhero-bar"
                x="444"
                y={y + 6}
                width={l.w}
                height="5"
                rx="2.5"
                fill={`url(#${id}-bar)`}
              />
            </g>
          );
        })}
      </g>

      {/* Graph nodes sitting on the connectors */}
      <g>
        <circle className="lhero-node" cx="395" cy="191" r="3.6" fill={BRAND.fuchsia} />
        <circle className="lhero-node" cx="158" cy="333" r="3.6" fill={BRAND.violet} />
        <circle className="lhero-node" cx="360" cy="336" r="3.6" fill={BRAND.pink} />
        <circle className="lhero-node" cx="481" cy="330" r="3.6" fill={BRAND.purple} />
      </g>
    </svg>
  );
}

/* =================================================================
   SECTION 1 — feature card visuals (360 x 200)
================================================================= */
export function FeatureArt({ name, className = '' }) {
  const id = `oml-f-${name}`;

  const frame = (
    <rect x="6" y="6" width="348" height="188" rx="16" fill="#FDFBFF" stroke="#F3E8FF" />
  );

  const shapes = {
    /* Whole slide with AI tumour segmentation overlay and class calls */
    detect: (
      <>
        {frame}
        <clipPath id={`${id}-clip`}>
          <rect x="18" y="18" width="200" height="164" rx="12" />
        </clipPath>
        <rect x="18" y="18" width="200" height="164" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-clip)`}>
          {/* Airway + alveolar background */}
          <path
            d="M10 160 C 56 140, 84 100, 138 88 C 176 80, 200 54, 232 46"
            stroke={BRAND.purple}
            strokeOpacity="0.2"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {[
            [46, 52, 17], [82, 78, 14], [44, 100, 13], [74, 128, 16], [110, 52, 12],
            [116, 108, 11], [40, 150, 12], [96, 160, 13], [148, 150, 14], [186, 62, 12],
          ].map(([cx, cy, r], i) => (
            <g key={i}>
              <circle className="art-cell" cx={cx} cy={cy} r={r} fill={BRAND.violet} opacity="0.09" />
              <circle
                className="art-cell"
                cx={cx}
                cy={cy}
                r={r}
                stroke={BRAND.purple}
                strokeOpacity="0.3"
                strokeWidth="1.1"
                fill="none"
              />
            </g>
          ))}

          {/* Segmented tumour region */}
          <path
            d="M120 74 C 152 56, 200 62, 212 92 C 224 122, 198 152, 164 152 C 130 152, 110 126, 112 102 Z"
            fill={BRAND.pink}
            opacity="0.16"
          />
          <path
            d="M120 74 C 152 56, 200 62, 212 92 C 224 122, 198 152, 164 152 C 130 152, 110 126, 112 102 Z"
            stroke={BRAND.pink}
            strokeWidth="1.6"
            strokeDasharray="6 5"
            fill="none"
          />
          {[
            [140, 92], [158, 82], [176, 96], [150, 110], [172, 118],
            [190, 104], [136, 124], [158, 134], [182, 136], [196, 120],
          ].map(([cx, cy], i) => (
            <circle key={i} className="art-cell" cx={cx} cy={cy} r="3.4" fill={BRAND.fuchsia} opacity="0.6" />
          ))}
        </g>

        <rect x="112" y="26" width="94" height="16" rx="8" fill={BRAND.violet} opacity="0.9" />
        <text x="159" y="37" style={CAPTION} fill="#FFFFFF" textAnchor="middle">
          TUMOUR REGION
        </text>

        {/* Classification confidences */}
        {[
          { k: 'Adenocarcinoma', v: '0.92', w: 106 },
          { k: 'Squamous', v: '0.06', w: 14 },
          { k: 'Small cell', v: '0.02', w: 8 },
          { k: 'Benign', v: '0.01', w: 6 },
        ].map((s, i) => {
          const y = 44 + i * 36;
          return (
            <g key={s.k}>
              <text x="234" y={y} style={LABEL} fill="#475569">
                {s.k}
              </text>
              <text x="338" y={y} style={VALUE} fill={BRAND.violet} textAnchor="end">
                {s.v}
              </text>
              <rect x="234" y={y + 8} width="104" height="6" rx="3" fill="#F3E8FF" />
              <rect x="234" y={y + 8} width={s.w} height="6" rx="3" fill={`url(#${id}-bar)`} />
            </g>
          );
        })}
      </>
    ),

    /* PD-L1 IHC field with membrane staining and TPS readout */
    ihc: (
      <>
        {frame}
        <clipPath id={`${id}-clip`}>
          <rect x="18" y="18" width="188" height="164" rx="12" />
        </clipPath>
        <rect x="18" y="18" width="188" height="164" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-clip)`}>
          <ellipse cx="72" cy="64" rx="48" ry="34" fill={BRAND.violet} opacity="0.09" />
          <ellipse cx="152" cy="120" rx="52" ry="36" fill={BRAND.pink} opacity="0.09" />
          <ellipse cx="58" cy="148" rx="38" ry="26" fill={BRAND.fuchsia} opacity="0.08" />

          {/* Membrane-positive (ringed) vs negative (outlined) tumour cells */}
          {[
            [42, 46, 1], [64, 62, 1], [88, 44, 0], [110, 70, 1], [132, 50, 1],
            [154, 74, 1], [176, 52, 0], [46, 92, 1], [70, 108, 0], [96, 90, 1],
            [120, 112, 1], [144, 94, 1], [168, 116, 0], [188, 92, 1], [40, 136, 1],
            [66, 152, 0], [92, 134, 1], [118, 158, 1], [144, 140, 1], [170, 162, 0],
            [190, 138, 1], [30, 68, 0], [30, 112, 1],
          ].map(([cx, cy, pos], i) =>
            pos ? (
              <g key={i}>
                <circle className="art-cell" cx={cx} cy={cy} r="5.6" fill="none" stroke={BRAND.fuchsia} strokeWidth="2.2" opacity="0.75" />
                <circle className="art-cell" cx={cx} cy={cy} r="2" fill={BRAND.violet} opacity="0.5" />
              </g>
            ) : (
              <circle
                key={i}
                className="art-cell"
                cx={cx}
                cy={cy}
                r="5"
                fill="none"
                stroke={BRAND.violet}
                strokeOpacity="0.35"
                strokeWidth="1.3"
              />
            )
          )}
        </g>

        <rect x="96" y="26" width="70" height="16" rx="8" fill={BRAND.violet} opacity="0.9" />
        <text x="131" y="37" style={CAPTION} fill="#FFFFFF" textAnchor="middle">
          PD-L1 22C3
        </text>

        {/* Score readout */}
        {[
          { k: 'TPS', v: '65%', w: 74 },
          { k: 'CPS', v: '42', w: 48 },
          { k: 'IC score', v: 'IC2', w: 62 },
          { k: 'CD8', v: 'High', w: 96 },
        ].map((s, i) => {
          const y = 44 + i * 36;
          return (
            <g key={s.k}>
              <text x="224" y={y} style={LABEL} fill="#475569">
                {s.k}
              </text>
              <text x="338" y={y} style={VALUE} fill={BRAND.violet} textAnchor="end">
                {s.v}
              </text>
              <rect x="224" y={y + 8} width="114" height="6" rx="3" fill="#F3E8FF" />
              <rect x="224" y={y + 8} width={s.w} height="6" rx="3" fill={`url(#${id}-bar)`} />
            </g>
          );
        })}
      </>
    ),

    /* Spatial tissue map: tumour, stroma and immune compartments */
    spatial: (
      <>
        {frame}
        <clipPath id={`${id}-clip`}>
          <rect x="18" y="18" width="222" height="164" rx="12" />
        </clipPath>
        <rect x="18" y="18" width="222" height="164" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-clip)`}>
          <path
            d="M18 58 C 68 34, 118 54, 158 40 C 196 26, 232 42, 246 32 L246 94 C 210 106, 168 90, 122 102 C 76 114, 44 98, 18 110 Z"
            fill={BRAND.violet}
            opacity="0.13"
          />
          <path
            d="M18 110 C 52 98, 84 114, 124 104 C 164 94, 208 108, 246 94 L246 146 C 206 158, 166 144, 122 154 C 78 164, 48 150, 18 160 Z"
            fill={BRAND.pink}
            opacity="0.12"
          />
          <ellipse cx="174" cy="138" rx="42" ry="28" fill={BRAND.fuchsia} opacity="0.14" />

          {/* Immune and stromal populations */}
          {[
            [46, 74], [68, 60], [92, 82], [116, 66], [140, 86], [164, 70],
            [188, 88], [212, 72], [56, 124], [82, 138], [108, 122], [134, 144],
            [160, 128], [186, 148], [210, 130], [40, 152], [96, 166], [150, 168],
            [204, 160], [128, 96],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              className="art-cell"
              cx={cx}
              cy={cy}
              r="3.4"
              fill={i % 3 === 0 ? BRAND.pink : BRAND.violet}
              opacity="0.75"
            />
          ))}

          {/* Neighbourhood analysis rings */}
          <circle cx="134" cy="144" r="30" stroke={BRAND.violet} strokeWidth="1.2" strokeDasharray="5 5" fill="none" opacity="0.7" />
          <circle cx="164" cy="70" r="24" stroke={BRAND.pink} strokeWidth="1.2" strokeDasharray="5 5" fill="none" opacity="0.7" />
          <path d="M134 144 L164 70" stroke={BRAND.fuchsia} strokeWidth="1.1" strokeDasharray="4 4" opacity="0.6" />
        </g>

        {/* Compartment legend */}
        {[
          { k: 'Tumour', c: BRAND.violet },
          { k: 'Immune', c: BRAND.fuchsia },
          { k: 'Stroma', c: BRAND.purple },
          { k: 'Necrosis', c: BRAND.pink },
        ].map((m, i) => {
          const y = 46 + i * 34;
          return (
            <g key={m.k}>
              <circle cx="262" cy={y - 3} r="4" fill={m.c} />
              <text x="274" y={y} style={LABEL} fill="#475569">
                {m.k}
              </text>
              <rect x="262" y={y + 8} width="76" height="5" rx="2.5" fill="#F3E8FF" />
              <rect x="262" y={y + 8} width={[62, 48, 34, 18][i]} height="5" rx="2.5" fill={`url(#${id}-bar)`} />
            </g>
          );
        })}
      </>
    ),

    /* Morphology to molecular inference network */
    molecular: (
      <>
        {frame}
        {/* Source tile */}
        <rect x="20" y="66" width="66" height="66" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <clipPath id={`${id}-tile`}>
          <rect x="20" y="66" width="66" height="66" rx="12" />
        </clipPath>
        <g clipPath={`url(#${id}-tile)`}>
          <circle cx="40" cy="86" r="13" fill={BRAND.violet} opacity="0.12" />
          <circle cx="40" cy="86" r="13" stroke={BRAND.purple} strokeOpacity="0.3" strokeWidth="1" fill="none" />
          <circle cx="70" cy="112" r="15" fill={BRAND.pink} opacity="0.13" />
          {[[34, 84], [50, 96], [64, 84], [42, 112], [66, 122], [76, 96]].map(([cx, cy], i) => (
            <circle key={i} className="art-cell" cx={cx} cy={cy} r="3" fill={BRAND.fuchsia} opacity="0.6" />
          ))}
        </g>
        <text x="53" y="148" style={CAPTION} fill="#7C3AED" textAnchor="middle">
          MORPHOLOGY
        </text>

        {/* Network layers */}
        {[
          { x: 118, ys: [58, 88, 118, 148] },
          { x: 168, ys: [72, 102, 132] },
          { x: 218, ys: [86, 116] },
        ].map((layer, li) => (
          <g key={li}>
            {layer.ys.map((y, ni) => (
              <circle
                key={ni}
                className="art-node"
                cx={layer.x}
                cy={y}
                r="5.4"
                fill="#FFFFFF"
                stroke={`url(#${id}-brand)`}
                strokeWidth="1.6"
              />
            ))}
          </g>
        ))}

        <g stroke={`url(#${id}-line)`} strokeWidth="1" opacity="0.55">
          {[58, 88, 118, 148].map((y1) =>
            [72, 102, 132].map((y2) => <line key={`${y1}-${y2}`} x1="123" y1={y1} x2="163" y2={y2} />)
          )}
          {[72, 102, 132].map((y1) =>
            [86, 116].map((y2) => <line key={`b${y1}-${y2}`} x1="173" y1={y1} x2="213" y2={y2} />)
          )}
          <line x1="88" y1="99" x2="112" y2="99" strokeDasharray="4 4" />
          <line x1="224" y1="101" x2="248" y2="101" strokeDasharray="4 4" />
        </g>

        {/* Predicted molecular calls */}
        {[
          { k: 'EGFR', v: 'Likely' },
          { k: 'ALK', v: 'Low' },
          { k: 'KRAS', v: 'G12C' },
          { k: 'TP53', v: 'Alt' },
        ].map((c, i) => {
          const y = 40 + i * 34;
          return (
            <g key={c.k}>
              <rect x="252" y={y} width="88" height="24" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
              <circle cx="266" cy={y + 12} r="3.2" fill={`url(#${id}-bar)`} />
              <text x="276" y={y + 15.5} style={LABEL} fill="#475569">
                {c.k}
              </text>
              <text x="330" y={y + 15.5} style={CAPTION} fill={BRAND.pink} textAnchor="end">
                {c.v}
              </text>
            </g>
          );
        })}
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
   SECTION 2 — workflow step glyphs (32 x 32)
================================================================= */
export function FlowIcon({ name, uid = '', className = '' }) {
  const id = `oml-s-${name}${uid}`;
  const stroke = `url(#${id}-brand)`;
  const common = { stroke, strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };

  const shapes = {
    ffpe: (
      <>
        <rect x="6" y="7" width="20" height="18" rx="3" {...common} />
        <rect x="11" y="12" width="10" height="8" rx="2" {...common} strokeOpacity="0.55" />
        <path d="M16 25 L16 29" {...common} strokeOpacity="0.5" />
      </>
    ),
    wsi: (
      <>
        <rect x="4" y="8" width="24" height="16" rx="3" {...common} />
        <circle cx="12" cy="16" r="4.4" {...common} strokeOpacity="0.55" />
        <circle cx="21" cy="17" r="2.6" {...common} strokeOpacity="0.55" />
      </>
    ),
    ai: (
      <>
        <circle cx="8" cy="10" r="2.6" {...common} />
        <circle cx="8" cy="22" r="2.6" {...common} />
        <circle cx="16" cy="16" r="2.6" {...common} />
        <circle cx="24" cy="16" r="2.6" {...common} />
        <path d="M10.4 11.2 L13.8 14.6 M10.4 20.8 L13.8 17.4 M18.6 16 L21.4 16" {...common} strokeOpacity="0.6" />
      </>
    ),
    tumour: (
      <>
        <path d="M7 17 C 7 10, 14 6, 19 8 C 25 10, 27 17, 23 22 C 19 27, 9 26, 7 20 Z" {...common} />
        <circle cx="14" cy="16" r="1.9" {...common} strokeOpacity="0.6" />
        <circle cx="20" cy="19" r="1.9" {...common} strokeOpacity="0.6" />
        <circle cx="18" cy="12" r="1.6" {...common} strokeOpacity="0.45" />
      </>
    ),
    biomarker: (
      <>
        <circle cx="14" cy="14" r="8" {...common} />
        <path d="M20 20 L27 27" {...common} />
        <path d="M10 15 L12.5 15 L14 11 L16 18 L17.5 14 L18.5 15" {...common} strokeOpacity="0.65" />
      </>
    ),
    molecular: (
      <>
        <path d="M10 5 C 10 12, 22 12, 22 19 C 22 26, 10 26, 10 27" {...common} strokeOpacity="0.75" />
        <path d="M22 5 C 22 12, 10 12, 10 19 C 10 26, 22 26, 22 27" {...common} strokeOpacity="0.75" />
        <path d="M11.5 9.5 L20.5 9.5 M11 16 L21 16 M11.5 22.5 L20.5 22.5" {...common} strokeOpacity="0.45" />
      </>
    ),
    insights: (
      <>
        <path d="M16 4 A 8 8 0 0 1 20 19 L20 23 L12 23 L12 19 A 8 8 0 0 1 16 4 Z" {...common} />
        <path d="M13 27 L19 27" {...common} strokeOpacity="0.6" />
        <path d="M16 12 L16 19" {...common} strokeOpacity="0.5" />
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

/* =================================================================
   SECTION 3 — audience visuals (220 x 130)
================================================================= */
export function SegmentArt({ name, className = '' }) {
  const id = `oml-a-${name}`;
  const stroke = `url(#${id}-brand)`;

  const shapes = {
    /* Pathology laboratory — scanner bench and signed-out slide */
    lab: (
      <>
        <rect x="24" y="22" width="80" height="58" rx="9" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.4" />
        <rect x="34" y="34" width="60" height="34" rx="6" fill={`url(#${id}-brandSoft)`} />
        <path d="M44 58 L56 46 L66 54 L84 40" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M64 80 L64 90 M48 92 L80 92" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="150" cy="46" r="18" stroke={stroke} strokeWidth="1.8" fill="none" />
        <path d="M150 28 L150 18 M163 59 L176 72" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="150" cy="46" r="7" fill={BRAND.pink} opacity="0.35" />
        <rect x="126" y="84" width="66" height="10" rx="5" fill={`url(#${id}-brandSoft)`} />
        <path d="M28 106 L192 106" stroke="#F3E8FF" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    /* Clinical research — cohort curves and tissue cohorts */
    research: (
      <>
        <rect x="20" y="26" width="84" height="66" rx="10" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.4" />
        <path d="M30 80 C 44 78, 52 58, 64 52 C 76 46, 84 40, 96 34" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M30 82 C 46 82, 56 70, 70 66 C 82 62, 90 56, 96 52" stroke={stroke} strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="4 4" strokeLinecap="round" fill="none" />
        <path d="M30 34 L30 84 L98 84" stroke="#F3E8FF" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="64" cy="52" r="3" fill={BRAND.fuchsia} opacity="0.7" />
        <circle cx="140" cy="40" r="13" stroke={stroke} strokeWidth="1.8" fill="none" />
        <circle cx="176" cy="40" r="13" stroke={stroke} strokeWidth="1.8" strokeOpacity="0.55" fill="none" />
        <circle cx="158" cy="70" r="13" stroke={stroke} strokeWidth="1.8" strokeOpacity="0.75" fill="none" />
        <path d="M152 44 L164 44 M148 52 L152 62 M170 52 L166 62" stroke={stroke} strokeWidth="1.3" strokeOpacity="0.45" />
        <rect x="126" y="92" width="66" height="10" rx="5" fill={`url(#${id}-brandSoft)`} />
        <path d="M28 112 L192 112" stroke="#F3E8FF" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    /* Pharmaceutical development — trial endpoints and compound graph */
    pharma: (
      <>
        <rect x="22" y="24" width="82" height="70" rx="10" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.4" />
        {[22, 38, 30, 50, 42].map((h, i) => (
          <rect key={i} x={34 + i * 13} y={82 - h} width="8" height={h} rx="3" fill={`url(#${id}-bar)`} opacity={0.45 + i * 0.12} />
        ))}
        <path d="M32 84 L96 84" stroke="#F3E8FF" strokeWidth="1.4" />
        <circle cx="146" cy="38" r="9" stroke={stroke} strokeWidth="1.8" fill="none" />
        <circle cx="178" cy="56" r="7" stroke={stroke} strokeWidth="1.8" fill="none" />
        <circle cx="142" cy="72" r="8" stroke={stroke} strokeWidth="1.8" fill="none" />
        <path d="M153 44 L171 51 M144 47 L143 64 M149 70 L172 61" stroke={stroke} strokeWidth="1.4" strokeOpacity="0.55" />
        <rect x="126" y="92" width="66" height="10" rx="5" fill={`url(#${id}-brandSoft)`} />
        <path d="M28 112 L192 112" stroke="#F3E8FF" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 220 130"
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
   SECTION 5 — the clinical report body (720 x 440).

   Rendered inside a DOM window frame that supplies the title bar and
   tabs, so this drawing only carries the panels themselves.
================================================================= */
export function ReportArt({ className = '' }) {
  const id = 'oml-report';

  /* Attention tiles over the thumbnail */
  const heat = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 5; c += 1) {
      const o = [0.06, 0.12, 0.24, 0.32, 0.16, 0.08][(r * 2 + c * 3) % 6];
      heat.push({ x: 34 + c * 45, y: 78 + r * 36, o, warm: c >= 2 && r >= 1 });
    }
  }

  /* Explanation grid in the bottom-right panel */
  const explain = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 7; c += 1) {
      const o = [0.1, 0.42, 0.2, 0.62, 0.3, 0.5, 0.15][(r * 3 + c) % 7];
      explain.push({ x: 518 + c * 25, y: 302 + r * 25, o, warm: (r + c) % 4 === 0 });
    }
  }

  return (
    <svg
      viewBox="0 0 720 440"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Integrated AI lung cancer report showing whole slide attention, tumour measurements, biomarker scores, spatial composition, molecular predictions and AI visual explanations"
    >
      <Defs id={id} />

      {/* ============ Whole slide + attention ============ */}
      <g className="rep-panel">
        <rect x="16" y="16" width="264" height="216" rx="14" fill="#FFFFFF" stroke="#F3E8FF" strokeWidth="1.2" />
        <text x="32" y="42" style={LABEL} fill="#111827">
          Whole Slide · AI Attention
        </text>
        <rect x="212" y="30" width="52" height="16" rx="8" fill={`url(#${id}-brandSoft)`} />
        <text x="238" y="41" style={CAPTION} fill={BRAND.violet} textAnchor="middle">
          H&amp;E
        </text>

        <clipPath id={`${id}-thumb`}>
          <rect x="32" y="58" width="232" height="158" rx="10" />
        </clipPath>
        <rect x="32" y="58" width="232" height="158" rx="10" fill="#FDFBFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-thumb)`}>
          <path
            d="M20 210 C 78 188, 108 136, 168 122 C 214 112, 252 82, 300 72"
            stroke={BRAND.purple}
            strokeOpacity="0.18"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {[
            [62, 88, 16], [98, 112, 13], [58, 132, 12], [92, 160, 15], [128, 86, 11],
            [134, 148, 12], [50, 182, 11], [112, 196, 12], [162, 188, 13], [216, 96, 12],
          ].map(([cx, cy, r], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill={BRAND.violet} opacity="0.08" />
              <circle cx={cx} cy={cy} r={r} stroke={BRAND.purple} strokeOpacity="0.26" strokeWidth="1" fill="none" />
            </g>
          ))}

          {heat.map((t, i) => (
            <rect
              key={i}
              className="rep-heat"
              x={t.x}
              y={t.y}
              width="43"
              height="34"
              rx="6"
              fill={t.warm ? BRAND.pink : BRAND.violet}
              opacity={t.o}
            />
          ))}

          <path
            d="M148 104 C 186 86, 240 96, 246 130 C 252 166, 214 188, 178 184 C 142 180, 130 148, 136 126 Z"
            stroke={BRAND.pink}
            strokeWidth="1.6"
            strokeDasharray="6 5"
            fill="none"
          />

          <rect className="rep-scan" x="32" y="58" width="3" height="158" fill={`url(#${id}-scan)`} />
        </g>
      </g>

      {/* ============ Tumour measurements ============ */}
      <g className="rep-panel">
        <rect x="16" y="244" width="264" height="180" rx="14" fill="#FFFFFF" stroke="#F3E8FF" strokeWidth="1.2" />
        <text x="32" y="270" style={LABEL} fill="#111827">
          Tumour Measurements
        </text>
        <rect x="32" y="278" width="34" height="2" rx="1" fill={`url(#${id}-bar)`} />

        {[
          { k: 'Tumour area', v: '42.6 mm²' },
          { k: 'Invasive fraction', v: '38%' },
          { k: 'Nuclei counted', v: '128,400' },
          { k: 'Mitotic index', v: '12 / 10 HPF' },
        ].map((m, i) => {
          const y = 296 + i * 30;
          return (
            <g key={m.k}>
              <rect x="32" y={y} width="232" height="24" rx="10" fill="#FCFAFF" stroke="#F3E8FF" />
              <circle className="rep-node" cx="46" cy={y + 12} r="3.2" fill={`url(#${id}-bar)`} />
              <text x="58" y={y + 15.5} style={LABEL} fill="#475569">
                {m.k}
              </text>
              <text x="252" y={y + 15.5} style={VALUE} fill={BRAND.violet} textAnchor="end">
                {m.v}
              </text>
            </g>
          );
        })}
      </g>

      {/* ============ Biomarker scores ============ */}
      <g className="rep-panel">
        <rect x="292" y="16" width="200" height="216" rx="14" fill="#FFFFFF" stroke="#F3E8FF" strokeWidth="1.2" />
        <text x="308" y="42" style={LABEL} fill="#111827">
          Biomarker Scores
        </text>
        <rect x="308" y="50" width="34" height="2" rx="1" fill={`url(#${id}-bar)`} />

        {[
          { k: 'PD-L1 TPS', v: '65%', w: 108 },
          { k: 'CPS', v: '42', w: 70 },
          { k: 'CD8 density', v: 'High', w: 140 },
          { k: 'TILs', v: '22%', w: 37 },
          { k: 'Ki-67', v: '31%', w: 52 },
        ].map((s, i) => {
          const y = 78 + i * 32;
          return (
            <g key={s.k}>
              <text x="308" y={y} style={LABEL} fill="#475569">
                {s.k}
              </text>
              <text x="476" y={y} style={VALUE} fill={BRAND.violet} textAnchor="end">
                {s.v}
              </text>
              <rect x="308" y={y + 7} width="168" height="6" rx="3" fill="#F3E8FF" />
              <rect
                className="rep-bar"
                x="308"
                y={y + 7}
                width={s.w}
                height="6"
                rx="3"
                fill={`url(#${id}-bar)`}
              />
            </g>
          );
        })}
      </g>

      {/* ============ Spatial composition ============ */}
      <g className="rep-panel">
        <rect x="292" y="244" width="200" height="180" rx="14" fill="#FFFFFF" stroke="#F3E8FF" strokeWidth="1.2" />
        <text x="308" y="270" style={LABEL} fill="#111827">
          Spatial Composition
        </text>
        <rect x="308" y="278" width="34" height="2" rx="1" fill={`url(#${id}-bar)`} />

        <circle cx="352" cy="348" r="34" stroke="#F3E8FF" strokeWidth="11" fill="none" />
        <circle
          className="rep-donut"
          cx="352"
          cy="348"
          r="34"
          stroke={`url(#${id}-brand)`}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray="132 214"
          fill="none"
          transform="rotate(-90 352 348)"
        />
        <text x="352" y="345" style={{ ...VALUE, fontSize: 13 }} fill={BRAND.violet} textAnchor="middle">
          61%
        </text>
        <text x="352" y="358" style={{ ...CAPTION, letterSpacing: '0.06em' }} fill="#94A3B8" textAnchor="middle">
          TUMOUR
        </text>

        {[
          { k: 'Tumour', v: '61%', c: BRAND.violet },
          { k: 'Stroma', v: '27%', c: BRAND.fuchsia },
          { k: 'Immune', v: '12%', c: BRAND.pink },
        ].map((l, i) => {
          const y = 324 + i * 26;
          return (
            <g key={l.k}>
              <circle cx="404" cy={y - 3} r="3.6" fill={l.c} />
              <text x="415" y={y} style={LABEL} fill="#475569">
                {l.k}
              </text>
              <text x="476" y={y} style={VALUE} fill="#111827" textAnchor="end">
                {l.v}
              </text>
            </g>
          );
        })}
      </g>

      {/* ============ Molecular predictions ============ */}
      <g className="rep-panel">
        <rect x="504" y="16" width="200" height="216" rx="14" fill="#FFFFFF" stroke="#F3E8FF" strokeWidth="1.2" />
        <text x="520" y="42" style={LABEL} fill="#111827">
          Molecular Predictions
        </text>
        <rect x="520" y="50" width="34" height="2" rx="1" fill={`url(#${id}-bar)`} />

        {[
          { k: 'EGFR pattern', v: 'Likely', c: 3 },
          { k: 'ALK fusion', v: 'Low', c: 1 },
          { k: 'KRAS G12C', v: '0.71', c: 3 },
          { k: 'TP53', v: 'Altered', c: 2 },
          { k: 'Therapy signal', v: 'IO-favour', c: 3 },
        ].map((m, i) => {
          const y = 70 + i * 32;
          return (
            <g key={m.k}>
              <rect x="520" y={y} width="168" height="24" rx="10" fill="#FCFAFF" stroke="#F3E8FF" />
              <text x="532" y={y + 15.5} style={LABEL} fill="#475569">
                {m.k}
              </text>
              <text x="662" y={y + 15.5} style={CAPTION} fill={BRAND.pink} textAnchor="end">
                {m.v}
              </text>
              <g>
                {[0, 1, 2].map((d) => (
                  <circle
                    key={d}
                    className="rep-node"
                    cx={670 + d * 6}
                    cy={y + 12}
                    r="2"
                    fill={d < m.c ? BRAND.violet : '#E9D5FF'}
                  />
                ))}
              </g>
            </g>
          );
        })}
      </g>

      {/* ============ AI visual explanation ============ */}
      <g className="rep-panel">
        <rect x="504" y="244" width="200" height="180" rx="14" fill="#FFFFFF" stroke="#F3E8FF" strokeWidth="1.2" />
        <text x="520" y="270" style={LABEL} fill="#111827">
          AI Visual Explanation
        </text>
        <rect x="520" y="278" width="34" height="2" rx="1" fill={`url(#${id}-bar)`} />

        <clipPath id={`${id}-explain`}>
          <rect x="518" y="294" width="172" height="98" rx="10" />
        </clipPath>
        <rect x="518" y="294" width="172" height="98" rx="10" fill="#FDFBFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-explain)`}>
          {explain.map((t, i) => (
            <rect
              key={i}
              className="rep-cell"
              x={t.x}
              y={t.y}
              width="21"
              height="21"
              rx="5"
              fill={t.warm ? BRAND.pink : BRAND.violet}
              opacity={t.o}
            />
          ))}
        </g>

        <text x="520" y="410" style={{ ...CAPTION, letterSpacing: '0.05em' }} fill="#94A3B8">
          REGION CONTRIBUTION · LOW
        </text>
        <rect x="640" y="404" width="48" height="6" rx="3" fill={`url(#${id}-bar)`} />
      </g>
    </svg>
  );
}
