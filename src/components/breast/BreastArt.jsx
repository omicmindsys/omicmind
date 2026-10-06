import React from 'react';

/* ------------------------------------------------------------------
   Illustration set for the Breast Cancer solution page.

   Same conventions as the Research page set: every drawing lives in a
   fixed viewBox and renders at w-full, so one set of coordinates scales
   to every breakpoint. Gradient ids are namespaced per illustration
   because several of these render more than once on a page.
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
   Ambient background — a stylised breast tissue field used behind
   the hero. Deliberately low contrast so headline text stays crisp.
================================================================= */
export function TissueField({ className = '' }) {
  const id = 'omb-field';

  /* Duct / lobule structures */
  const ducts = [
    { cx: 150, cy: 190, rx: 96, ry: 62, rot: -14 },
    { cx: 430, cy: 120, rx: 74, ry: 50, rot: 18 },
    { cx: 700, cy: 236, rx: 110, ry: 66, rot: -6 },
    { cx: 1010, cy: 140, rx: 82, ry: 54, rot: 22 },
    { cx: 1250, cy: 268, rx: 96, ry: 58, rot: -18 },
    { cx: 300, cy: 400, rx: 88, ry: 52, rot: 10 },
    { cx: 880, cy: 424, rx: 104, ry: 60, rot: -12 },
  ];

  /* Scattered nuclei */
  const nuclei = [];
  for (let i = 0; i < 190; i += 1) {
    const x = (i * 137.5) % 1440;
    const y = (i * 289.7) % 520;
    nuclei.push([x, y, 1.6 + ((i * 7) % 5) * 0.42]);
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

      {ducts.map((d, i) => (
        <g key={i} transform={`rotate(${d.rot} ${d.cx} ${d.cy})`}>
          <ellipse cx={d.cx} cy={d.cy} rx={d.rx} ry={d.ry} fill={BRAND.violet} opacity="0.05" />
          <ellipse
            cx={d.cx}
            cy={d.cy}
            rx={d.rx}
            ry={d.ry}
            stroke={BRAND.purple}
            strokeOpacity="0.13"
            strokeWidth="1.2"
          />
          <ellipse
            cx={d.cx}
            cy={d.cy}
            rx={d.rx * 0.52}
            ry={d.ry * 0.5}
            fill={BRAND.pink}
            opacity="0.05"
          />
        </g>
      ))}

      <g fill={BRAND.violet} opacity="0.14">
        {nuclei.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
    </svg>
  );
}

/* =================================================================
   HERO — the breast pathology stack: whole slide viewer with AI
   heatmap, biomarker scoring, molecular prediction and a spatial
   immune map, stitched together by an inference graph.
================================================================= */
export function BreastHeroArt({ className = '' }) {
  const id = 'omb-hero';

  /* Duct structures inside the slide */
  const ducts = [
    { cx: 132, cy: 168, rx: 52, ry: 38, rot: -16 },
    { cx: 224, cy: 200, rx: 44, ry: 32, rot: 14 },
    { cx: 310, cy: 160, rx: 38, ry: 30, rot: -6 },
    { cx: 176, cy: 250, rx: 40, ry: 26, rot: 20 },
    { cx: 302, cy: 254, rx: 46, ry: 28, rot: -22 },
  ];

  const nuclei = [
    [118, 156], [146, 178], [168, 148], [192, 190], [214, 164],
    [238, 206], [262, 172], [286, 198], [310, 162], [332, 192],
    [140, 226], [186, 244], [230, 232], [274, 250], [320, 228],
    [104, 200], [352, 214],
  ];

  /* AI heatmap tiles over the slide */
  const heat = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 6; c += 1) {
      const o = [0.05, 0.1, 0.2, 0.3, 0.16, 0.08][(r * 3 + c * 2) % 6];
      heat.push({ x: 74 + c * 49, y: 110 + r * 47, o, warm: (r + c) % 3 === 0 });
    }
  }

  const scores = [
    { label: 'ER', value: '95%', w: 129 },
    { label: 'PR', value: '82%', w: 111 },
    { label: 'HER2', value: '2+', w: 74 },
    { label: 'Ki-67', value: '24%', w: 46 },
  ];

  const calls = [
    { label: 'HRD signature', value: 'High' },
    { label: 'MSI status', value: 'Stable' },
    { label: 'TMB estimate', value: '7.4' },
  ];

  return (
    <svg
      viewBox="0 0 600 520"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Breast whole slide image with AI heatmap, quantitative biomarker scoring, molecular prediction and a spatial immune map connected as one pipeline"
    >
      <Defs id={id} />

      {/* Ambient lighting */}
      <circle cx="150" cy="130" r="190" fill={`url(#${id}-halo)`} />
      <circle cx="470" cy="400" r="180" fill={`url(#${id}-haloPink)`} />

      {/* ---- Inference graph behind the cards ---- */}
      <g opacity="0.85">
        <path
          className="bhero-wire"
          d="M386 196 C 396 196, 394 186, 404 186"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <path
          className="bhero-wire"
          d="M168 314 C 168 334, 148 334, 148 352"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <path
          className="bhero-wire"
          d="M320 314 C 320 336, 392 336, 400 352"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <path
          className="bhero-wire"
          d="M492 300 C 492 330, 470 330, 470 352"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
      </g>

      {/* ================= Slide viewer ================= */}
      <g className="bhero-float-a">
        <Panel id={id} x={56} y={64} w={330} h={250} r={18} />

        <circle cx="78" cy="86" r="3.4" fill="#E9D5FF" />
        <circle cx="90" cy="86" r="3.4" fill="#FBCFE8" />
        <circle cx="102" cy="86" r="3.4" fill="#EDE9FE" />
        <text x="118" y="89.5" style={LABEL} fill="#475569">
          Breast WSI · H&amp;E
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
          {/* Duct and lobule morphology */}
          {ducts.map((d, i) => (
            <g key={i} transform={`rotate(${d.rot} ${d.cx} ${d.cy})`}>
              <ellipse cx={d.cx} cy={d.cy} rx={d.rx} ry={d.ry} fill={BRAND.violet} opacity="0.12" />
              <ellipse
                cx={d.cx}
                cy={d.cy}
                rx={d.rx * 0.55}
                ry={d.ry * 0.52}
                fill={BRAND.pink}
                opacity="0.13"
              />
              <ellipse
                cx={d.cx}
                cy={d.cy}
                rx={d.rx}
                ry={d.ry}
                stroke={BRAND.purple}
                strokeOpacity="0.28"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* AI heatmap */}
          <g>
            {heat.map((t, i) => (
              <rect
                key={i}
                className="bhero-heat"
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

          {/* Detected nuclei */}
          <g>
            {nuclei.map(([cx, cy], i) => (
              <circle
                key={i}
                className="bhero-nucleus"
                cx={cx}
                cy={cy}
                r="3.4"
                fill="none"
                stroke={BRAND.fuchsia}
                strokeWidth="1.3"
                opacity="0.75"
              />
            ))}
          </g>

          {/* Region of interest the model flagged */}
          <rect
            x="196"
            y="168"
            width="104"
            height="76"
            rx="10"
            stroke={BRAND.pink}
            strokeWidth="1.4"
            strokeDasharray="6 5"
            fill="none"
          />

          {/* Scanning sweep */}
          <rect className="bhero-scan" x="72" y="106" width="3" height="194" fill={`url(#${id}-scan)`} />
        </g>

        <rect x="196" y="150" width="70" height="16" rx="8" fill={BRAND.pink} opacity="0.92" />
        <text x="231" y="161" style={CAPTION} fill="#FFFFFF" textAnchor="middle">
          INVASIVE
        </text>
      </g>

      {/* ================= Biomarker scoring ================= */}
      <g className="bhero-float-b">
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
                className="bhero-bar"
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
      <g className="bhero-float-c">
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
              <circle className="bhero-node" cx="84" cy={y + 10} r="3.2" fill={`url(#${id}-bar)`} />
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
      <g className="bhero-float-d">
        <Panel id={id} x={300} y={352} w={256} h={136} r={16} />
        <text x="316" y="378" style={LABEL} fill="#111827">
          Spatial Immune Map
        </text>
        <rect x="316" y="386" width="34" height="2" rx="1" fill={`url(#${id}-bar)`} />

        <clipPath id={`${id}-map`}>
          <rect x="316" y="396" width="112" height="76" rx="10" />
        </clipPath>
        <rect x="316" y="396" width="112" height="76" rx="10" fill="#FDFBFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-map)`}>
          <ellipse cx="352" cy="424" rx="34" ry="24" fill={BRAND.violet} opacity="0.16" />
          <ellipse cx="404" cy="452" rx="30" ry="20" fill={BRAND.pink} opacity="0.14" />
          <ellipse cx="398" cy="410" rx="22" ry="16" fill={BRAND.fuchsia} opacity="0.12" />
          {[
            [330, 410], [344, 432], [360, 416], [372, 440], [388, 424],
            [402, 446], [416, 428], [336, 452], [356, 460], [408, 464],
            [324, 434], [420, 408],
          ].map(([cx, cy], i) => (
            <circle key={i} className="bhero-nucleus" cx={cx} cy={cy} r="2.6" fill={BRAND.violet} opacity="0.8" />
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
          { k: 'CD3', v: 'high', w: 66 },
          { k: 'CD8', v: 'high', w: 58 },
          { k: 'FOXP3', v: 'low', w: 26 },
        ].map((l, i) => {
          const y = 408 + i * 26;
          return (
            <g key={l.k}>
              <text x="444" y={y} style={LABEL} fill="#475569">
                {l.k}
              </text>
              <rect x="444" y={y + 6} width="92" height="5" rx="2.5" fill="#F3E8FF" />
              <rect
                className="bhero-bar"
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
        <circle className="bhero-node" cx="395" cy="191" r="3.6" fill={BRAND.fuchsia} />
        <circle className="bhero-node" cx="158" cy="333" r="3.6" fill={BRAND.violet} />
        <circle className="bhero-node" cx="360" cy="336" r="3.6" fill={BRAND.pink} />
        <circle className="bhero-node" cx="481" cy="330" r="3.6" fill={BRAND.purple} />
      </g>
    </svg>
  );
}

/* =================================================================
   SECTION 1 — feature card visuals (360 x 200)
================================================================= */
export function FeatureArt({ name, className = '' }) {
  const id = `omb-f-${name}`;

  const frame = (
    <rect x="6" y="6" width="348" height="188" rx="16" fill="#FDFBFF" stroke="#F3E8FF" />
  );

  const shapes = {
    /* IHC field with AI scoring overlay */
    ihc: (
      <>
        {frame}
        <clipPath id={`${id}-clip`}>
          <rect x="18" y="18" width="188" height="164" rx="12" />
        </clipPath>
        <rect x="18" y="18" width="188" height="164" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-clip)`}>
          <ellipse cx="70" cy="66" rx="46" ry="32" fill={BRAND.violet} opacity="0.1" />
          <ellipse cx="150" cy="118" rx="52" ry="36" fill={BRAND.pink} opacity="0.09" />
          <ellipse cx="60" cy="146" rx="38" ry="26" fill={BRAND.fuchsia} opacity="0.08" />

          {/* Positive (filled) and negative (outlined) nuclei */}
          {[
            [42, 46, 1], [64, 62, 1], [88, 44, 0], [110, 70, 1], [132, 50, 0],
            [154, 74, 1], [176, 52, 0], [46, 92, 1], [70, 108, 1], [96, 90, 0],
            [120, 112, 1], [144, 94, 1], [168, 116, 0], [188, 92, 1], [40, 136, 0],
            [66, 152, 1], [92, 134, 1], [118, 158, 0], [144, 140, 1], [170, 162, 1],
            [190, 138, 0], [30, 68, 1], [30, 112, 0],
          ].map(([cx, cy, pos], i) =>
            pos ? (
              <circle key={i} className="art-cell" cx={cx} cy={cy} r="5" fill={BRAND.fuchsia} opacity="0.5" />
            ) : (
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
            )
          )}

          <rect
            x="96"
            y="82"
            width="86"
            height="62"
            rx="10"
            fill="none"
            stroke={BRAND.pink}
            strokeWidth="1.4"
            strokeDasharray="6 5"
          />
        </g>

        <rect x="96" y="26" width="70" height="16" rx="8" fill={BRAND.violet} opacity="0.9" />
        <text x="131" y="37" style={CAPTION} fill="#FFFFFF" textAnchor="middle">
          AI SCORING
        </text>

        {/* Score readout */}
        {[
          { k: 'ER', v: '95%', w: 118 },
          { k: 'PR', v: '82%', w: 102 },
          { k: 'HER2', v: '2+', w: 68 },
          { k: 'Ki-67', v: '24%', w: 42 },
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

    /* Spatial tissue map with immune neighbourhoods */
    spatial: (
      <>
        {frame}
        <clipPath id={`${id}-clip`}>
          <rect x="18" y="18" width="222" height="164" rx="12" />
        </clipPath>
        <rect x="18" y="18" width="222" height="164" rx="12" fill="#FFFFFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-clip)`}>
          {/* Tumour, stroma and immune compartments */}
          <path
            d="M18 60 C 70 30, 120 52, 158 40 C 196 28, 232 44, 246 34 L246 96 C 210 108, 168 92, 122 104 C 76 116, 44 100, 18 112 Z"
            fill={BRAND.violet}
            opacity="0.13"
          />
          <path
            d="M18 112 C 52 100, 84 116, 124 106 C 164 96, 208 110, 246 96 L246 148 C 206 160, 166 146, 122 156 C 78 166, 48 152, 18 162 Z"
            fill={BRAND.pink}
            opacity="0.12"
          />
          <ellipse cx="176" cy="140" rx="42" ry="28" fill={BRAND.fuchsia} opacity="0.14" />

          {/* Immune cells */}
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

        {/* Marker legend */}
        {[
          { k: 'CD3', c: BRAND.violet },
          { k: 'CD8', c: BRAND.fuchsia },
          { k: 'CD68', c: BRAND.purple },
          { k: 'FOXP3', c: BRAND.pink },
        ].map((m, i) => {
          const y = 46 + i * 34;
          return (
            <g key={m.k}>
              <circle cx="262" cy={y - 3} r="4" fill={m.c} />
              <text x="274" y={y} style={LABEL} fill="#475569">
                {m.k}
              </text>
              <rect x="262" y={y + 8} width="76" height="5" rx="2.5" fill="#F3E8FF" />
              <rect x="262" y={y + 8} width={[62, 48, 34, 22][i]} height="5" rx="2.5" fill={`url(#${id}-bar)`} />
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
          <ellipse cx="44" cy="90" rx="22" ry="16" fill={BRAND.violet} opacity="0.16" />
          <ellipse cx="70" cy="112" rx="20" ry="14" fill={BRAND.pink} opacity="0.14" />
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
          { k: 'HRD', v: 'High' },
          { k: 'MSI', v: 'Stable' },
          { k: 'TMB', v: '7.4' },
          { k: 'PIK3CA', v: 'Alt' },
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

    /* Unified reporting dashboard */
    report: (
      <>
        {frame}
        <rect x="18" y="18" width="324" height="30" rx="10" fill="#FFFFFF" stroke="#F3E8FF" />
        <circle cx="34" cy="33" r="3.2" fill={BRAND.violet} opacity="0.5" />
        <text x="46" y="36.5" style={LABEL} fill="#111827">
          Case Report · BR-2418
        </text>
        <rect x="266" y="25" width="62" height="16" rx="8" fill={`url(#${id}-brandSoft)`} />
        <text x="297" y="36" style={CAPTION} fill={BRAND.violet} textAnchor="middle">
          SIGNED
        </text>

        {/* KPI tiles */}
        {[
          { k: 'ER', v: '95%' },
          { k: 'Ki-67', v: '24%' },
          { k: 'TILs', v: '18%' },
        ].map((t, i) => (
          <g key={t.k}>
            <rect x={18 + i * 110} y="58" width="98" height="44" rx="10" fill="#FFFFFF" stroke="#F3E8FF" />
            <text x={30 + i * 110} y="76" style={CAPTION} fill="#94A3B8">
              {t.k.toUpperCase()}
            </text>
            <text x={30 + i * 110} y="93" style={{ ...VALUE, fontSize: 13 }} fill={BRAND.violet}>
              {t.v}
            </text>
          </g>
        ))}

        {/* Bar chart */}
        <rect x="18" y="112" width="208" height="70" rx="10" fill="#FFFFFF" stroke="#F3E8FF" />
        <g>
          {[30, 46, 22, 54, 38, 60, 44].map((h, i) => (
            <rect
              key={i}
              x={32 + i * 27}
              y={168 - h}
              width="14"
              height={h}
              rx="4"
              fill={`url(#${id}-bar)`}
              opacity={0.45 + (i % 3) * 0.2}
            />
          ))}
          <line x1="30" y1="170" x2="214" y2="170" stroke="#F3E8FF" strokeWidth="1.2" />
        </g>

        {/* Donut */}
        <rect x="234" y="112" width="108" height="70" rx="10" fill="#FFFFFF" stroke="#F3E8FF" />
        <circle cx="268" cy="147" r="22" stroke="#F3E8FF" strokeWidth="7" fill="none" />
        <circle
          cx="268"
          cy="147"
          r="22"
          stroke={`url(#${id}-brand)`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="104 138"
          fill="none"
          transform="rotate(-90 268 147)"
        />
        {['Tumour', 'Stroma', 'Immune'].map((l, i) => (
          <g key={l}>
            <circle cx="302" cy={136 + i * 14} r="3" fill={[BRAND.violet, BRAND.fuchsia, BRAND.pink][i]} />
            <text x="310" y={139 + i * 14} style={{ ...CAPTION, letterSpacing: '0.04em' }} fill="#64748B">
              {l}
            </text>
          </g>
        ))}
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
  const id = `omb-s-${name}${uid}`;
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
        <ellipse cx="13" cy="16" rx="5" ry="3.4" {...common} strokeOpacity="0.55" />
        <circle cx="21" cy="17" r="2.4" {...common} strokeOpacity="0.55" />
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
    biomarker: (
      <>
        <circle cx="14" cy="14" r="8" {...common} />
        <path d="M20 20 L27 27" {...common} />
        <path d="M10 15 L12.5 15 L14 11 L16 18 L17.5 14 L18.5 15" {...common} strokeOpacity="0.65" />
      </>
    ),
    spatial: (
      <>
        <path d="M5 9 L12 6 L20 9 L27 6 L27 23 L20 26 L12 23 L5 26 Z" {...common} />
        <path d="M12 6 L12 23 M20 9 L20 26" {...common} strokeOpacity="0.4" />
        <circle cx="16" cy="16" r="2.2" {...common} strokeOpacity="0.7" />
      </>
    ),
    molecular: (
      <>
        <path d="M10 5 C 10 12, 22 12, 22 19 C 22 26, 10 26, 10 27" {...common} strokeOpacity="0.75" />
        <path d="M22 5 C 22 12, 10 12, 10 19 C 10 26, 22 26, 22 27" {...common} strokeOpacity="0.75" />
        <path d="M11.5 9.5 L20.5 9.5 M11 16 L21 16 L21 16 M11.5 22.5 L20.5 22.5" {...common} strokeOpacity="0.45" />
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
  const id = `omb-a-${name}`;
  const stroke = `url(#${id}-brand)`;

  const shapes = {
    lab: (
      <>
        <rect x="24" y="22" width="80" height="58" rx="9" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.4" />
        <rect x="34" y="34" width="60" height="34" rx="6" fill={`url(#${id}-brandSoft)`} />
        <path d="M44 58 L56 46 L66 54 L84 40" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M64 80 L64 90 M48 92 L80 92" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="150" cy="46" r="18" stroke={stroke} strokeWidth="1.8" fill="none" />
        <path d="M150 28 L150 18 M163 59 L176 72" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <rect x="126" y="84" width="66" height="10" rx="5" fill={`url(#${id}-brandSoft)`} />
        <circle cx="150" cy="46" r="7" fill={BRAND.pink} opacity="0.35" />
        <path d="M28 106 L192 106" stroke="#F3E8FF" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
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
    translational: (
      <>
        <rect x="20" y="30" width="70" height="58" rx="10" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.4" />
        <ellipse cx="46" cy="52" rx="16" ry="11" fill={BRAND.violet} opacity="0.16" />
        <ellipse cx="66" cy="70" rx="14" ry="10" fill={BRAND.pink} opacity="0.14" />
        {[[38, 48], [54, 58], [70, 48], [46, 72], [72, 78]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill={BRAND.fuchsia} opacity="0.6" />
        ))}
        <path d="M96 59 L124 59" stroke={stroke} strokeWidth="1.8" strokeDasharray="5 5" strokeLinecap="round" />
        <path d="M118 53 L126 59 L118 65" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M148 26 C 148 42, 182 42, 182 58 C 182 74, 148 74, 148 90" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M182 26 C 182 42, 148 42, 148 58 C 148 74, 182 74, 182 90" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M152 36 L178 36 M147 58 L183 58 M152 80 L178 80" stroke={stroke} strokeWidth="1.4" strokeOpacity="0.45" strokeLinecap="round" />
        <path d="M28 108 L192 108" stroke="#F3E8FF" strokeWidth="1.6" strokeLinecap="round" />
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
