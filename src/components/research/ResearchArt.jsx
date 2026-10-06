import React from 'react';

/* ------------------------------------------------------------------
   Illustration set for the Research page.

   Same conventions as the homepage sections: every drawing lives in a
   fixed viewBox and renders at w-full, so a single set of coordinates
   scales to every breakpoint and no illustration needs breakpoint
   specific geometry. Gradient ids are namespaced per illustration
   because several of these render many times on one page.
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

/* Shared gradient / shadow defs, id-namespaced per illustration */
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
      <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={BRAND.violet} stopOpacity="0.65" />
        <stop offset="100%" stopColor={BRAND.pink} stopOpacity="0.25" />
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
      <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
  );
}

/* Rounded panel used as the base of every "floating card" */
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
   HERO — a collage of the research stack: whole slide viewer,
   AI heatmap, cell detection and molecular readout, stitched
   together by an inference graph.
================================================================= */
export function HeroArt({ className = '' }) {
  const id = 'omr-hero';

  /* Tissue morphology inside the slide viewer */
  const tissue = [
    { cx: 140, cy: 168, rx: 62, ry: 44, rot: -18, fill: BRAND.violet, o: 0.13 },
    { cx: 236, cy: 196, rx: 74, ry: 40, rot: 12, fill: BRAND.pink, o: 0.11 },
    { cx: 320, cy: 158, rx: 52, ry: 38, rot: -8, fill: BRAND.fuchsia, o: 0.1 },
    { cx: 190, cy: 240, rx: 58, ry: 30, rot: 22, fill: BRAND.purple, o: 0.12 },
    { cx: 356, cy: 232, rx: 46, ry: 34, rot: -26, fill: BRAND.violet, o: 0.09 },
  ];

  /* Nuclei the detector has picked up */
  const nuclei = [
    [126, 158], [152, 176], [174, 150], [198, 188], [222, 162],
    [246, 200], [268, 170], [292, 196], [316, 162], [338, 190],
    [160, 220], [206, 236], [252, 224], [300, 240], [346, 220],
  ];

  return (
    <svg
      viewBox="0 0 600 520"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Whole slide imaging, AI heatmap inference, cell detection and molecular readout connected as one research pipeline"
    >
      <Defs id={id} />

      {/* Ambient lighting */}
      <circle cx="150" cy="130" r="190" fill={`url(#${id}-halo)`} />
      <circle cx="470" cy="380" r="180" fill={`url(#${id}-haloPink)`} />

      {/* ---- Inference graph behind the cards ---- */}
      <g opacity="0.85">
        <path
          className="hero-wire"
          d="M420 250 C 470 250, 470 214, 508 214"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <path
          className="hero-wire"
          d="M150 330 C 150 372, 120 372, 120 396"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <path
          className="hero-wire"
          d="M300 330 C 300 366, 360 366, 388 392"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <path
          className="hero-wire"
          d="M262 430 C 320 430, 330 430, 372 430"
          stroke={`url(#${id}-line)`}
          strokeWidth="1.6"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
      </g>

      {/* ================= Whole slide viewer ================= */}
      <g className="hero-float-a">
        <Panel id={id} x={64} y={72} w={356} h={258} r={18} />

        {/* Window chrome */}
        <circle cx="86" cy="94" r="3.4" fill="#E9D5FF" />
        <circle cx="98" cy="94" r="3.4" fill="#FBCFE8" />
        <circle cx="110" cy="94" r="3.4" fill="#EDE9FE" />
        <text x="126" y="97.5" style={LABEL} fill="#475569">
          Whole Slide Imaging
        </text>
        <rect x="332" y="86" width="70" height="17" rx="8.5" fill={`url(#${id}-brandSoft)`} />
        <text x="367" y="97.5" style={CAPTION} fill={BRAND.violet} textAnchor="middle">
          40× WSI
        </text>

        {/* Tissue field */}
        <clipPath id={`${id}-slide`}>
          <rect x="80" y="116" width="324" height="196" rx="12" />
        </clipPath>
        <rect x="80" y="116" width="324" height="196" rx="12" fill="#FDFBFF" stroke="#F3E8FF" />
        <g clipPath={`url(#${id}-slide)`}>
          {tissue.map((t, i) => (
            <ellipse
              key={i}
              cx={t.cx}
              cy={t.cy}
              rx={t.rx}
              ry={t.ry}
              fill={t.fill}
              opacity={t.o}
              transform={`rotate(${t.rot} ${t.cx} ${t.cy})`}
            />
          ))}

          {/* Patch grid the model tiles the slide into */}
          <g stroke={BRAND.violet} strokeOpacity="0.16" strokeWidth="0.8">
            {[0, 1, 2, 3, 4, 5].map((c) => (
              <line key={`v${c}`} x1={80 + c * 54} y1="116" x2={80 + c * 54} y2="312" />
            ))}
            {[0, 1, 2, 3].map((r) => (
              <line key={`h${r}`} x1="80" y1={116 + r * 49} x2="404" y2={116 + r * 49} />
            ))}
          </g>

          {/* Active patch under inference */}
          <rect
            x="188"
            y="165"
            width="54"
            height="49"
            fill={BRAND.fuchsia}
            fillOpacity="0.1"
            stroke={BRAND.fuchsia}
            strokeWidth="1.3"
            strokeDasharray="4 3"
          />

          {/* Detected nuclei */}
          {nuclei.map(([cx, cy], i) => (
            <circle
              key={i}
              className="hero-nucleus"
              cx={cx}
              cy={cy}
              r="4.2"
              fill="none"
              stroke={i % 3 === 0 ? BRAND.pink : BRAND.violet}
              strokeOpacity="0.55"
              strokeWidth="1.2"
            />
          ))}

          {/* Scan sweep */}
          <rect
            className="hero-scan"
            x="80"
            y="116"
            width="46"
            height="196"
            fill={`url(#${id}-brandSoft)`}
          />
        </g>
      </g>

      {/* ================= AI heatmap card ================= */}
      <g className="hero-float-b">
        <Panel id={id} x={396} y={148} w={172} h={140} r={16} />
        <text x={412} y={172} style={CAPTION} fill="#94A3B8">
          AI HEATMAP
        </text>
        <g>
          {Array.from({ length: 24 }).map((_, i) => {
            const col = i % 6;
            const row = Math.floor(i / 6);
            /* Deterministic intensity ramp — hot core, cool edges */
            const heat = [
              0.12, 0.2, 0.34, 0.5, 0.3, 0.16,
              0.22, 0.44, 0.78, 0.92, 0.55, 0.24,
              0.3, 0.62, 0.95, 0.86, 0.48, 0.2,
              0.14, 0.28, 0.46, 0.38, 0.24, 0.12,
            ][i];
            return (
              <rect
                key={i}
                className="hero-heat"
                x={412 + col * 23}
                y={182 + row * 21}
                width={20}
                height={18}
                rx={4}
                fill={heat > 0.6 ? BRAND.pink : heat > 0.35 ? BRAND.fuchsia : BRAND.violet}
                opacity={0.14 + heat * 0.62}
              />
            );
          })}
        </g>
        <text x={412} y={278} style={LABEL} fill="#475569">
          Tumor probability
        </text>
        <text x={552} y={278} style={LABEL} fill={BRAND.pink} textAnchor="end">
          0.94
        </text>
      </g>

      {/* ================= Cell detection card ================= */}
      <g className="hero-float-c">
        <Panel id={id} x={36} y={382} w={226} h={108} r={16} />
        <text x={54} y={406} style={CAPTION} fill="#94A3B8">
          CELL DETECTION
        </text>
        <text
          x={54}
          y={438}
          style={{ ...LABEL, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}
          fill="#0F172A"
        >
          128,470
        </text>
        <text x={54} y={456} style={LABEL} fill="#64748B">
          nuclei segmented
        </text>
        {/* Class distribution */}
        <g>
          <rect x={54} y={466} width={104} height={6} rx={3} fill={BRAND.violet} opacity="0.85" />
          <rect x={160} y={466} width={52} height={6} rx={3} fill={BRAND.fuchsia} opacity="0.7" />
          <rect x={214} y={466} width={30} height={6} rx={3} fill={BRAND.pink} opacity="0.55" />
        </g>
      </g>

      {/* ================= Molecular readout card ================= */}
      <g className="hero-float-d">
        <Panel id={id} x={296} y={366} w={252} h={124} r={16} />
        <text x={316} y={390} style={CAPTION} fill="#94A3B8">
          MOLECULAR SIGNAL
        </text>

        {/* Double helix */}
        <g transform="translate(316 398)">
          <path
            className="hero-helix"
            d="M0 8 C 14 0, 28 32, 42 24 C 56 16, 70 48, 84 40"
            stroke={BRAND.violet}
            strokeOpacity="0.75"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            className="hero-helix"
            d="M0 40 C 14 48, 28 16, 42 24 C 56 32, 70 0, 84 8"
            stroke={BRAND.pink}
            strokeOpacity="0.7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {[6, 20, 34, 48, 62, 76].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1={i % 2 ? 14 : 34}
              x2={x}
              y2={i % 2 ? 34 : 14}
              stroke={BRAND.fuchsia}
              strokeOpacity="0.35"
              strokeWidth="1.4"
            />
          ))}
        </g>

        {/* Expression bars */}
        <g transform="translate(422 398)">
          {[
            ['HER2', 78],
            ['ER', 54],
            ['Ki-67', 92],
          ].map(([name, val], i) => (
            <g key={name} transform={`translate(0 ${i * 18})`}>
              <text x={0} y={8} style={{ ...LABEL, fontSize: 8 }} fill="#64748B">
                {name}
              </text>
              <rect x={34} y={2} width={78} height={6} rx={3} fill="#F1F5F9" />
              <rect
                className="hero-bar"
                x={34}
                y={2}
                width={(78 * val) / 100}
                height={6}
                rx={3}
                fill={`url(#${id}-brand)`}
              />
            </g>
          ))}
        </g>
      </g>

      {/* Graph nodes riding the wires */}
      {[
        [420, 250],
        [508, 214],
        [150, 330],
        [300, 330],
        [388, 392],
      ].map(([cx, cy], i) => (
        <g key={i} className="hero-node">
          <circle cx={cx} cy={cy} r="7" fill={BRAND.purple} opacity="0.16" />
          <circle cx={cx} cy={cy} r="3.2" fill={`url(#${id}-brand)`} />
        </g>
      ))}
    </svg>
  );
}

/* =================================================================
   SECTION 1 — value icons (48 x 48 line marks)
================================================================= */
export function ValueIcon({ name, className = '' }) {
  const id = `omr-v-${name}`;
  const stroke = `url(#${id}-brand)`;

  const shapes = {
    multimodal: (
      <>
        {/* Three modality planes converging into one embedding */}
        <path d="M8 16 L24 9 L40 16 L24 23 Z" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 24 L24 31 L40 24" stroke={stroke} strokeWidth="1.8" strokeOpacity="0.6" strokeLinecap="round" />
        <path d="M8 32 L24 39 L40 32" stroke={stroke} strokeWidth="1.8" strokeOpacity="0.35" strokeLinecap="round" />
        <circle cx="24" cy="16" r="2.6" fill={stroke} />
      </>
    ),
    biomarker: (
      <>
        {/* Signal trace read through a lens */}
        <path
          d="M6 28 L12 28 L15 20 L19 34 L23 24 L27 28 L34 28"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="31" cy="18" r="9" stroke={stroke} strokeWidth="1.8" strokeOpacity="0.75" />
        <path d="M37.5 24.5 L43 30" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
      </>
    ),
    spatial: (
      <>
        {/* Hex neighbourhood with a highlighted niche */}
        {[
          [24, 12], [14, 18], [34, 18], [14, 30], [34, 30], [24, 36],
        ].map(([cx, cy], i) => (
          <path
            key={i}
            d={`M${cx} ${cy - 6} L${cx + 5.2} ${cy - 3} L${cx + 5.2} ${cy + 3} L${cx} ${cy + 6} L${cx - 5.2} ${cy + 3} L${cx - 5.2} ${cy - 3} Z`}
            stroke={stroke}
            strokeWidth="1.6"
            strokeOpacity={i === 0 || i === 5 ? 0.4 : 0.85}
            strokeLinejoin="round"
          />
        ))}
        <circle cx="24" cy="24" r="4.6" fill={stroke} fillOpacity="0.9" />
      </>
    ),
    translation: (
      <>
        {/* Flask feeding a vitals trace */}
        <path
          d="M18 8 L18 18 L10 33 A3.4 3.4 0 0 0 13 38 L23 38"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14.5 8 L21.5 8" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M25 24 L30 24 L32.5 18 L35.5 30 L38 24 L42 24"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.85"
        />
        <circle cx="15" cy="30" r="1.8" fill={stroke} fillOpacity="0.5" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 48 48"
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
   SECTION 2 — application scenes (112 x 76)
================================================================= */
export function AppArt({ name, className = '' }) {
  const id = `omr-a-${name}`;
  const grad = `url(#${id}-brand)`;
  const soft = `url(#${id}-brandSoft)`;

  const scenes = {
    cancer: (
      <>
        {[
          [26, 40, 12], [48, 30, 10], [70, 42, 11], [38, 56, 9], [62, 58, 8],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={soft} stroke={BRAND.violet} strokeOpacity="0.35" />
        ))}
        {/* The aberrant clone */}
        <circle cx="88" cy="30" r="13" fill="none" stroke={grad} strokeWidth="2" />
        <circle cx="88" cy="30" r="5" fill={grad} />
        <path d="M88 12 L88 4" stroke={BRAND.pink} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 3" />
      </>
    ),
    drug: (
      <>
        {/* Capsule */}
        <rect
          x="14"
          y="26"
          width="52"
          height="24"
          rx="12"
          fill={soft}
          stroke={BRAND.violet}
          strokeOpacity="0.45"
          transform="rotate(-18 40 38)"
        />
        <path d="M40 26 L40 50" stroke={BRAND.violet} strokeOpacity="0.45" transform="rotate(-18 40 38)" />
        {/* Ligand graph */}
        <g stroke={grad} strokeWidth="1.6">
          <path d="M76 24 L90 32 L86 48 L70 46 Z" fill="none" strokeLinejoin="round" />
          <path d="M90 32 L100 22" strokeLinecap="round" />
        </g>
        {[[76, 24], [90, 32], [86, 48], [70, 46], [100, 22]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3.4" fill={grad} />
        ))}
      </>
    ),
    validation: (
      <>
        <path
          d="M34 8 L58 16 L58 38 C58 52 46 62 34 68 C22 62 10 52 10 38 L10 16 Z"
          fill={soft}
          stroke={BRAND.violet}
          strokeOpacity="0.45"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M22 36 L30 45 L47 25"
          stroke={grad}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Cohort agreement bars */}
        {[[74, 52, 16], [84, 42, 26], [94, 32, 36]].map(([x, y, h], i) => (
          <rect key={i} x={x} y={y} width="8" height={h} rx="3" fill={grad} opacity={0.45 + i * 0.2} />
        ))}
      </>
    ),
    translational: (
      <>
        {/* Bench → bedside span */}
        <rect x="10" y="34" width="26" height="26" rx="7" fill={soft} stroke={BRAND.violet} strokeOpacity="0.45" />
        <path d="M18 42 L18 50 M23 38 L23 50 M28 45 L28 50" stroke={BRAND.violet} strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="76" y="34" width="26" height="26" rx="7" fill={soft} stroke={BRAND.pink} strokeOpacity="0.45" />
        <path d="M89 40 L89 54 M82 47 L96 47" stroke={BRAND.pink} strokeOpacity="0.8" strokeWidth="2.2" strokeLinecap="round" />
        <path
          d="M38 44 C50 20, 62 20, 74 44"
          stroke={grad}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        <path d="M68 38 L75 44 L67 47" stroke={BRAND.pink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    ),
    immuno: (
      <>
        {/* Tumour cell under immune attack */}
        <circle cx="66" cy="40" r="20" fill={soft} stroke={BRAND.violet} strokeOpacity="0.4" strokeWidth="1.6" />
        <circle cx="66" cy="40" r="7" fill={BRAND.violet} fillOpacity="0.35" />
        {[
          [22, 22], [16, 44], [30, 62],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill="none" stroke={grad} strokeWidth="1.8" />
            <path
              d={`M${cx + 7} ${cy + 2} L${46} ${40}`}
              stroke={BRAND.pink}
              strokeOpacity="0.5"
              strokeWidth="1.4"
              strokeDasharray="3 3"
              strokeLinecap="round"
            />
          </g>
        ))}
        <path d="M86 22 L94 14 M92 26 L102 20" stroke={BRAND.pink} strokeOpacity="0.5" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    spatialbio: (
      <>
        {Array.from({ length: 12 }).map((_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const cx = 24 + col * 22 + (row % 2 ? 11 : 0);
          const cy = 20 + row * 20;
          const tone = [BRAND.violet, BRAND.fuchsia, BRAND.pink][(i + row) % 3];
          return (
            <path
              key={i}
              d={`M${cx} ${cy - 10} L${cx + 8.7} ${cy - 5} L${cx + 8.7} ${cy + 5} L${cx} ${cy + 10} L${cx - 8.7} ${cy + 5} L${cx - 8.7} ${cy - 5} Z`}
              fill={tone}
              fillOpacity={0.1 + ((i * 7) % 5) * 0.09}
              stroke={tone}
              strokeOpacity="0.4"
              strokeLinejoin="round"
            />
          );
        })}
      </>
    ),
    digitalpath: (
      <>
        <rect x="8" y="16" width="76" height="46" rx="6" fill={soft} stroke={BRAND.violet} strokeOpacity="0.4" strokeWidth="1.6" />
        <rect x="8" y="16" width="76" height="11" rx="6" fill={BRAND.violet} fillOpacity="0.12" />
        <ellipse cx="34" cy="42" rx="16" ry="10" fill={BRAND.pink} fillOpacity="0.16" />
        <ellipse cx="58" cy="46" rx="13" ry="8" fill={BRAND.violet} fillOpacity="0.16" />
        <circle cx="78" cy="44" r="16" fill="#FFFFFF" fillOpacity="0.8" stroke={grad} strokeWidth="2.2" />
        <path d="M89 55 L100 66" stroke={grad} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    aimodel: (
      <>
        {[
          [18, [20, 38, 56]],
          [56, [16, 32, 48, 64]],
          [94, [30, 48]],
        ].map(([x, ys], li) => (
          <g key={li}>
            {ys.map((y) => (
              <circle key={y} cx={x} cy={y} r="5" fill={li === 2 ? grad : 'none'} stroke={grad} strokeWidth="1.8" />
            ))}
          </g>
        ))}
        <g stroke={BRAND.purple} strokeOpacity="0.3" strokeWidth="1">
          {[20, 38, 56].map((y1) =>
            [16, 32, 48, 64].map((y2) => <line key={`${y1}-${y2}`} x1="23" y1={y1} x2="51" y2={y2} />)
          )}
          {[16, 32, 48, 64].map((y1) =>
            [30, 48].map((y2) => <line key={`b${y1}-${y2}`} x1="61" y1={y1} x2="89" y2={y2} />)
          )}
        </g>
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 112 76"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <Defs id={id} />
      {scenes[name]}
    </svg>
  );
}

/* =================================================================
   SECTION 4 — research platform dashboard mockup (660 x 470)
================================================================= */
export function PlatformDashboard({ className = '' }) {
  const id = 'omr-dash';

  const nuclei = [];
  for (let r = 0; r < 6; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      nuclei.push([104 + c * 36 + (r % 2 ? 18 : 0), 118 + r * 33]);
    }
  }

  return (
    <svg
      viewBox="0 0 660 470"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="OmicMind research platform: whole slide viewer with AI heatmap, cell detection, tissue segmentation and biomarker scoring"
    >
      <Defs id={id} />

      {/* Window */}
      <rect x="4" y="6" width="652" height="458" rx="20" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="1.4" filter={`url(#${id}-card)`} />

      {/* Title bar */}
      <path d="M4 26 A20 20 0 0 1 24 6 L636 6 A20 20 0 0 1 656 26 L656 50 L4 50 Z" fill="#FCFAFF" />
      <line x1="4" y1="50" x2="656" y2="50" stroke="#F1EDFB" />
      <circle cx="28" cy="28" r="4.4" fill="#E9D5FF" />
      <circle cx="44" cy="28" r="4.4" fill="#FBCFE8" />
      <circle cx="60" cy="28" r="4.4" fill="#EDE9FE" />
      <rect x="82" y="19" width="150" height="18" rx="9" fill="#F5F3FF" />
      <text x="94" y="32" style={{ ...LABEL, fontSize: 9.5 }} fill="#6D28D9">
        OmicMind Research Studio
      </text>
      <rect x="556" y="18" width="86" height="20" rx="10" fill={`url(#${id}-brand)`} opacity="0.92" />
      <text x="599" y="32" style={{ ...LABEL, fontSize: 9 }} fill="#FFFFFF" textAnchor="middle">
        Share study
      </text>

      {/* Left tool rail */}
      <rect x="4" y="50" width="62" height="414" fill="#FCFAFF" />
      <path d="M4 444 L4 464 L66 464 L66 50" stroke="#F1EDFB" fill="none" />
      <line x1="66" y1="50" x2="66" y2="464" stroke="#F1EDFB" />
      {[92, 136, 180, 224, 268].map((cy, i) => (
        <g key={cy}>
          <rect
            x="20"
            y={cy - 15}
            width="30"
            height="30"
            rx="9"
            fill={i === 0 ? `url(#${id}-brandSoft)` : 'transparent'}
            stroke={i === 0 ? BRAND.violet : '#E2E8F0'}
            strokeOpacity={i === 0 ? 0.4 : 1}
          />
          {i === 0 && <rect x="27" y={cy - 7} width="16" height="14" rx="3" stroke={BRAND.violet} strokeWidth="1.5" />}
          {i === 1 && <circle cx="35" cy={cy} r="7" stroke="#94A3B8" strokeWidth="1.5" />}
          {i === 2 && <path d={`M27 ${cy + 5} L35 ${cy - 6} L43 ${cy + 5} Z`} stroke="#94A3B8" strokeWidth="1.5" strokeLinejoin="round" />}
          {i === 3 && <path d={`M27 ${cy} L43 ${cy} M35 ${cy - 8} L35 ${cy + 8}`} stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />}
          {i === 4 && <path d={`M28 ${cy + 6} L28 ${cy - 2} M35 ${cy + 6} L35 ${cy - 8} M42 ${cy + 6} L42 ${cy - 5}`} stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />}
        </g>
      ))}

      {/* ---------- Viewer ---------- */}
      <text x="86" y="74" style={CAPTION} fill="#94A3B8">
        WHOLE SLIDE VIEWER
      </text>
      <rect x="86" y="84" width="380" height="286" rx="14" fill="#FDFBFF" stroke="#F3E8FF" />
      <clipPath id={`${id}-view`}>
        <rect x="86" y="84" width="380" height="286" rx="14" />
      </clipPath>
      <g clipPath={`url(#${id}-view)`}>
        {/* Tissue */}
        <ellipse cx="196" cy="176" rx="92" ry="64" fill={BRAND.violet} opacity="0.11" transform="rotate(-16 196 176)" />
        <ellipse cx="330" cy="214" rx="104" ry="58" fill={BRAND.pink} opacity="0.1" transform="rotate(10 330 214)" />
        <ellipse cx="252" cy="288" rx="86" ry="46" fill={BRAND.purple} opacity="0.1" transform="rotate(-6 252 288)" />

        {/* Segmentation contours */}
        <path
          className="dash-contour"
          d="M132 168 C 158 122, 232 118, 268 152 C 300 182, 288 236, 244 250 C 196 266, 132 224, 132 168 Z"
          stroke={BRAND.violet}
          strokeOpacity="0.75"
          strokeWidth="1.8"
          strokeDasharray="6 5"
          fill="none"
        />
        <path
          className="dash-contour"
          d="M296 196 C 330 166, 402 178, 414 218 C 424 254, 372 288, 330 276 C 294 266, 274 224, 296 196 Z"
          stroke={BRAND.pink}
          strokeOpacity="0.7"
          strokeWidth="1.8"
          strokeDasharray="6 5"
          fill="none"
        />

        {/* Heatmap overlay */}
        <g className="dash-heat">
          {Array.from({ length: 20 }).map((_, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const heat = [
              0.18, 0.3, 0.52, 0.34, 0.2,
              0.34, 0.68, 0.94, 0.6, 0.28,
              0.4, 0.82, 0.88, 0.5, 0.24,
              0.2, 0.36, 0.44, 0.3, 0.16,
            ][i];
            return (
              <rect
                key={i}
                x={296 + col * 34}
                y={168 + row * 30}
                width={31}
                height={27}
                rx={6}
                fill={heat > 0.6 ? BRAND.pink : heat > 0.35 ? BRAND.fuchsia : BRAND.violet}
                opacity={heat * 0.42}
              />
            );
          })}
        </g>

        {/* Detected nuclei */}
        {nuclei.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="4.6"
            fill="none"
            stroke={i % 4 === 0 ? BRAND.pink : BRAND.violet}
            strokeOpacity="0.45"
            strokeWidth="1.1"
          />
        ))}
      </g>

      {/* Viewer chips */}
      <g>
        <rect x="98" y="96" width="88" height="22" rx="11" fill="#FFFFFF" stroke="#EDE9FE" />
        <circle cx="112" cy="107" r="3.4" fill={BRAND.pink} />
        <text x="122" y="110.5" style={{ ...LABEL, fontSize: 8.5 }} fill="#475569">
          AI Heatmap
        </text>

        <rect x="192" y="96" width="96" height="22" rx="11" fill="#FFFFFF" stroke="#EDE9FE" />
        <circle cx="206" cy="107" r="3.4" fill={BRAND.violet} />
        <text x="216" y="110.5" style={{ ...LABEL, fontSize: 8.5 }} fill="#475569">
          Cell Detection
        </text>

        <rect x="356" y="96" width="98" height="22" rx="11" fill="#FFFFFF" stroke="#EDE9FE" />
        <circle cx="370" cy="107" r="3.4" fill={BRAND.fuchsia} />
        <text x="380" y="110.5" style={{ ...LABEL, fontSize: 8.5 }} fill="#475569">
          Segmentation
        </text>
      </g>

      {/* Zoom control */}
      <rect x="98" y="332" width="120" height="24" rx="12" fill="#FFFFFF" stroke="#EDE9FE" />
      <line x1="112" y1="344" x2="204" y2="344" stroke="#E9D5FF" strokeWidth="3" strokeLinecap="round" />
      <line x1="112" y1="344" x2="172" y2="344" stroke={`url(#${id}-brand)`} strokeWidth="3" strokeLinecap="round" />
      <circle cx="172" cy="344" r="6" fill="#FFFFFF" stroke={BRAND.violet} strokeWidth="2" />
      <text x="234" y="348" style={{ ...LABEL, fontSize: 8.5 }} fill="#94A3B8">
        20× · 0.25 µm/px
      </text>

      {/* Slide strip */}
      <text x="86" y="392" style={CAPTION} fill="#94A3B8">
        STUDY COHORT
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect
            x={86 + i * 78}
            y={400}
            width={66}
            height={48}
            rx={9}
            fill="#FDFBFF"
            stroke={i === 0 ? BRAND.violet : '#F3E8FF'}
            strokeOpacity={i === 0 ? 0.55 : 1}
            strokeWidth={i === 0 ? 1.6 : 1}
          />
          <ellipse
            cx={86 + i * 78 + 26}
            cy={422}
            rx={18}
            ry={12}
            fill={i % 2 ? BRAND.pink : BRAND.violet}
            opacity="0.14"
          />
          <ellipse
            cx={86 + i * 78 + 44}
            cy={430}
            rx={13}
            ry={9}
            fill={i % 2 ? BRAND.violet : BRAND.fuchsia}
            opacity="0.12"
          />
        </g>
      ))}

      {/* ---------- Right analytics panel ---------- */}
      <rect x="484" y="66" width="156" height="304" rx="14" fill="#FCFAFF" stroke="#F1EDFB" />
      <text x="500" y="90" style={CAPTION} fill="#94A3B8">
        BIOMARKER SCORING
      </text>

      {[
        ['Ki-67 index', 92, BRAND.pink],
        ['HER2 score', 68, BRAND.fuchsia],
        ['PD-L1 CPS', 45, BRAND.violet],
        ['TIL density', 74, BRAND.purple],
      ].map(([name, val, tone], i) => (
        <g key={name} transform={`translate(500 ${104 + i * 40})`}>
          <text x="0" y="10" style={{ ...LABEL, fontSize: 8.5 }} fill="#475569">
            {name}
          </text>
          <text x="124" y="10" style={{ ...LABEL, fontSize: 8.5 }} fill="#0F172A" textAnchor="end">
            {val}%
          </text>
          <rect x="0" y="16" width="124" height="6" rx="3" fill="#EEF2F7" />
          <rect className="dash-bar" x="0" y="16" width={(124 * val) / 100} height="6" rx="3" fill={tone} opacity="0.85" />
        </g>
      ))}

      {/* Confidence donut */}
      <g transform="translate(562 316)">
        <circle r="34" fill="none" stroke="#EEF2F7" strokeWidth="9" />
        <circle
          className="dash-ring"
          r="34"
          fill="none"
          stroke={`url(#${id}-brand)`}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray="214"
          strokeDashoffset="42"
          transform="rotate(-90)"
        />
        <text y="0" style={{ ...LABEL, fontSize: 15, fontWeight: 700 }} fill="#0F172A" textAnchor="middle">
          0.96
        </text>
        <text y="14" style={{ ...LABEL, fontSize: 7.5 }} fill="#94A3B8" textAnchor="middle">
          AUROC
        </text>
      </g>

      {/* Bottom status bar */}
      <line x1="66" y1="444" x2="656" y2="444" stroke="#F1EDFB" />
      <circle cx="98" cy="455" r="3.6" fill="#34D399" />
      <text x="110" y="458.5" style={{ ...LABEL, fontSize: 8.5 }} fill="#64748B">
        Inference complete · 1,284 slides · cloud workspace synced
      </text>
      <text x="640" y="458.5" style={{ ...LABEL, fontSize: 8.5 }} fill="#94A3B8" textAnchor="end">
        v4.2 foundation model
      </text>
    </svg>
  );
}

/* =================================================================
   SECTION 5 — audience illustrations (120 x 88)
================================================================= */
export function AudienceArt({ name, className = '' }) {
  const id = `omr-w-${name}`;
  const grad = `url(#${id}-brand)`;
  const soft = `url(#${id}-brandSoft)`;

  const scenes = {
    academic: (
      <>
        <path d="M60 12 L104 30 L60 48 L16 30 Z" fill={soft} stroke={grad} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M30 38 L30 60 C 30 70, 90 70, 90 60 L90 38" stroke={grad} strokeWidth="1.8" strokeOpacity="0.55" fill="none" strokeLinecap="round" />
        <path d="M104 30 L104 52" stroke={BRAND.pink} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="104" cy="56" r="4" fill={BRAND.pink} />
        <path d="M22 74 L98 74" stroke={BRAND.violet} strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    pharma: (
      <>
        <rect x="14" y="20" width="40" height="52" rx="10" fill={soft} stroke={grad} strokeWidth="1.8" />
        <path d="M34 32 L34 60 M20 46 L48 46" stroke={grad} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M72 24 L72 38 L62 62 A5 5 0 0 0 67 70 L91 70 A5 5 0 0 0 96 62 L86 38 L86 24" stroke={grad} strokeWidth="1.8" fill="none" strokeLinejoin="round" />
        <path d="M67 20 L91 20" stroke={grad} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M66 54 L92 54 L96 62 A5 5 0 0 1 91 70 L67 70 A5 5 0 0 1 62 62 Z" fill={BRAND.pink} fillOpacity="0.18" />
        <circle cx="76" cy="62" r="2.4" fill={BRAND.pink} fillOpacity="0.6" />
        <circle cx="86" cy="65" r="1.8" fill={BRAND.violet} fillOpacity="0.6" />
      </>
    ),
    biotech: (
      <>
        <path d="M40 14 L40 34 L26 66 A7 7 0 0 0 33 76 L73 76 A7 7 0 0 0 80 66 L66 34 L66 14" stroke={grad} strokeWidth="1.8" fill="none" strokeLinejoin="round" />
        <path d="M35 14 L71 14" stroke={grad} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M30 58 L76 58 L80 66 A7 7 0 0 1 73 76 L33 76 A7 7 0 0 1 26 66 Z" fill={soft} />
        <path d="M44 24 C 54 32, 44 40, 54 48" stroke={BRAND.violet} strokeOpacity="0.8" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M62 24 C 52 32, 62 40, 52 48" stroke={BRAND.pink} strokeOpacity="0.75" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M46 30 L60 30 M46 42 L60 42" stroke={BRAND.fuchsia} strokeOpacity="0.4" strokeWidth="1.4" />
        <circle cx="94" cy="30" r="4" fill={BRAND.pink} fillOpacity="0.55" />
        <circle cx="104" cy="46" r="2.6" fill={BRAND.violet} fillOpacity="0.45" />
      </>
    ),
    cro: (
      <>
        <rect x="16" y="14" width="52" height="62" rx="9" fill={soft} stroke={grad} strokeWidth="1.8" />
        <rect x="32" y="8" width="20" height="13" rx="5" fill="#FFFFFF" stroke={grad} strokeWidth="1.6" />
        <path d="M28 36 L34 42 L46 30" stroke={grad} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 54 L34 60 L46 48" stroke={BRAND.pink} strokeOpacity="0.7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M52 38 L58 38 M52 56 L58 56" stroke={BRAND.violet} strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
        {/* Delivery network */}
        <g>
          <circle cx="94" cy="26" r="6" fill="none" stroke={grad} strokeWidth="1.8" />
          <circle cx="84" cy="52" r="5" fill="none" stroke={grad} strokeWidth="1.6" strokeOpacity="0.7" />
          <circle cx="104" cy="60" r="5" fill="none" stroke={grad} strokeWidth="1.6" strokeOpacity="0.7" />
          <path d="M92 32 L86 47 M97 31 L102 55 M89 54 L99 58" stroke={BRAND.purple} strokeOpacity="0.4" strokeWidth="1.3" />
        </g>
      </>
    ),
    hospital: (
      <>
        <rect x="14" y="26" width="54" height="50" rx="9" fill={soft} stroke={grad} strokeWidth="1.8" />
        <path d="M41 12 L41 26" stroke={grad} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M41 36 L41 58 M30 47 L52 47" stroke={grad} strokeWidth="3" strokeLinecap="round" />
        <rect x="78" y="30" width="34" height="28" rx="6" fill="#FFFFFF" stroke={grad} strokeWidth="1.6" />
        <path d="M83 46 L89 46 L92 38 L96 54 L100 44 L103 46 L107 46" stroke={BRAND.pink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M95 58 L95 68 M86 68 L104 68" stroke={BRAND.violet} strokeOpacity="0.5" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 120 88"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <Defs id={id} />
      {scenes[name]}
    </svg>
  );
}

/* =================================================================
   SECTION 6 — publication / validation marks (40 x 40)
================================================================= */
export function PubIcon({ name, className = '' }) {
  const id = `omr-p-${name}`;
  const stroke = `url(#${id}-brand)`;

  const shapes = {
    paper: (
      <>
        <path d="M10 5 L24 5 L31 12 L31 35 L10 35 Z" stroke={stroke} strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M24 5 L24 12 L31 12" stroke={stroke} strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M15 19 L26 19 M15 25 L26 25 M15 30 L22 30" stroke={stroke} strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
      </>
    ),
    shield: (
      <>
        <path d="M20 5 L32 10 L32 20 C32 28 26 33 20 36 C14 33 8 28 8 20 L8 10 Z" stroke={stroke} strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M15 20 L19 24 L26 16" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    podium: (
      <>
        <rect x="7" y="7" width="26" height="18" rx="4" stroke={stroke} strokeWidth="1.7" />
        <path d="M20 25 L20 32 M13 34 L27 34" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M13 16 L17 16 M13 12 L24 12" stroke={stroke} strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
      </>
    ),
    benchmark: (
      <>
        <path d="M7 33 L33 33" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
        <rect x="10" y="21" width="5" height="10" rx="2" fill={stroke} opacity="0.45" />
        <rect x="18" y="14" width="5" height="17" rx="2" fill={stroke} opacity="0.7" />
        <rect x="26" y="8" width="5" height="23" rx="2" fill={stroke} />
      </>
    ),
    collab: (
      <>
        <circle cx="13" cy="13" r="5" stroke={stroke} strokeWidth="1.7" />
        <circle cx="28" cy="16" r="5" stroke={stroke} strokeWidth="1.7" />
        <circle cx="20" cy="30" r="5" stroke={stroke} strokeWidth="1.7" />
        <path d="M17.5 14.5 L23.5 15.5 M15 17.5 L18 25 M26 20.5 L22.5 26" stroke={stroke} strokeWidth="1.4" strokeOpacity="0.6" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 40 40"
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
   SECTION 3 — workflow step glyphs (32 x 32)
================================================================= */
export function StepIcon({ name, uid = '', className = '' }) {
  const id = `omr-s-${name}${uid}`;
  const stroke = `url(#${id}-brand)`;
  const common = { stroke, strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };

  const shapes = {
    sample: (
      <>
        <path d="M12 4 L12 12 L8 24 A4 4 0 0 0 12 29 L20 29 A4 4 0 0 0 24 24 L20 12 L20 4" {...common} fill="none" />
        <path d="M10 4 L22 4" {...common} />
        <path d="M9.4 21 L22.6 21" {...common} strokeOpacity="0.5" />
      </>
    ),
    ffpe: (
      <>
        <rect x="6" y="7" width="20" height="18" rx="3" {...common} fill="none" />
        <rect x="11" y="12" width="10" height="8" rx="2" {...common} strokeOpacity="0.55" fill="none" />
        <path d="M16 25 L16 29" {...common} strokeOpacity="0.5" />
      </>
    ),
    wsi: (
      <>
        <rect x="4" y="8" width="24" height="16" rx="3" {...common} fill="none" />
        <ellipse cx="13" cy="16" rx="5" ry="3.4" {...common} strokeOpacity="0.55" fill="none" />
        <circle cx="21" cy="17" r="2.4" {...common} strokeOpacity="0.55" fill="none" />
      </>
    ),
    ai: (
      <>
        <circle cx="8" cy="10" r="2.6" {...common} fill="none" />
        <circle cx="8" cy="22" r="2.6" {...common} fill="none" />
        <circle cx="24" cy="16" r="2.6" {...common} fill="none" />
        <circle cx="16" cy="16" r="2.6" {...common} fill="none" />
        <path d="M10.4 11.2 L13.8 14.6 M10.4 20.8 L13.8 17.4 M18.6 16 L21.4 16" {...common} strokeOpacity="0.6" />
      </>
    ),
    integrate: (
      <>
        <path d="M16 5 L26 11 L26 21 L16 27 L6 21 L6 11 Z" {...common} fill="none" />
        <path d="M16 5 L16 27 M6 11 L26 21 M26 11 L6 21" {...common} strokeOpacity="0.4" />
      </>
    ),
    biomarker: (
      <>
        <circle cx="14" cy="14" r="8" {...common} fill="none" />
        <path d="M20 20 L27 27" {...common} />
        <path d="M10 15 L12.5 15 L14 11 L16 18 L17.5 14 L18.5 15" {...common} strokeOpacity="0.65" fill="none" />
      </>
    ),
    publish: (
      <>
        <path d="M7 5 L18 5 L25 12 L25 27 L7 27 Z" {...common} fill="none" />
        <path d="M18 5 L18 12 L25 12" {...common} />
        <path d="M11.5 18 L15 21.5 L21 15" {...common} strokeOpacity="0.7" />
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
