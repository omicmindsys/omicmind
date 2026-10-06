import { motion } from 'framer-motion';
import { CELL_TYPES } from './SpatialVisuals.jsx';

/* ------------------------------------------------------------------
   An output biomarker with a small schematic indicator. Indicators are
   UI representations of what the biomarker expresses — never a value.

   indicator.kind:
     'categories' — equal segments naming the classes (e.g. phenotypes)
     'scale'      — a Low → High track with an example marker position
     'split'      — a two-part bar naming the two populations compared
     'signature'  — a small bar profile
     'composite'  — several cell-type signals merging into one score
------------------------------------------------------------------ */

const LABEL = 'font-sans text-[10.5px] font-medium text-slate-500';

function Indicator({ kind, labels = [], position = 0.65 }) {
  if (kind === 'categories') {
    const tints = [CELL_TYPES.immune.color, CELL_TYPES.stroma.color, '#64748B'];
    return (
      <div>
        <div className="flex gap-1">
          {labels.map((l, i) => (
            <span key={l} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: tints[i % 3], opacity: 0.7 }} />
          ))}
        </div>
        <div className={`mt-2 flex ${LABEL}`}>
          {labels.map((l) => (
            <span key={l} className="flex-1 text-center first:text-left last:text-right">
              {l}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'scale') {
    return (
      <div>
        <div className="relative h-1.5 rounded-full bg-gradient-to-r from-white/10 via-[#A78BFA]/45 to-[#EC4899]/55">
          <span
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0E1626] bg-white"
            style={{ left: `${position * 100}%` }}
          />
        </div>
        <div className={`mt-2 flex justify-between ${LABEL}`}>
          <span>{labels[0] ?? 'Low'}</span>
          <span>{labels[1] ?? 'High'}</span>
        </div>
      </div>
    );
  }

  if (kind === 'split') {
    return (
      <div>
        <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
          <span className="rounded-l-full" style={{ width: `${position * 100}%`, backgroundColor: CELL_TYPES.stroma.color, opacity: 0.75 }} />
          <span className="flex-1 rounded-r-full" style={{ backgroundColor: CELL_TYPES.immune.color, opacity: 0.75 }} />
        </div>
        <div className={`mt-2 flex justify-between ${LABEL}`}>
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      </div>
    );
  }

  if (kind === 'signature') {
    const heights = [0.45, 0.8, 0.6, 1, 0.55, 0.7, 0.35];
    return (
      <div className="flex h-7 items-end gap-1" aria-hidden="true">
        {heights.map((h, i) => (
          <span
            key={i}
            className="w-2 rounded-sm bg-gradient-to-t from-[#A78BFA]/40 to-[#C4B5FD]/80"
            style={{ height: `${h * 100}%` }}
          />
        ))}
        {labels[0] && <span className={`ml-2 self-center ${LABEL}`}>{labels[0]}</span>}
      </div>
    );
  }

  if (kind === 'composite') {
    const inputs = [CELL_TYPES.tumor.color, CELL_TYPES.immune.color, CELL_TYPES.stroma.color];
    return (
      <svg viewBox="0 0 200 34" className="h-8 w-full max-w-[220px]" aria-hidden="true">
        {inputs.map((c, i) => (
          <g key={c}>
            <rect x="0" y={3 + i * 11} width="46" height="4" rx="2" fill={c} fillOpacity="0.7" />
            <path
              d={`M50 ${5 + i * 11} C 80 ${5 + i * 11}, 84 16, 112 16`}
              fill="none"
              stroke="rgba(196,181,253,0.4)"
              strokeWidth="1"
            />
          </g>
        ))}
        <rect x="116" y="13" width="84" height="6" rx="3" fill="url(#composite-bar)" />
        <defs>
          <linearGradient id="composite-bar" x1="0" x2="1">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return null;
}

export const biomarkerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function BiomarkerCard({ title, indicator }) {
  return (
    <motion.li
      variants={biomarkerItem}
      className="flex h-full flex-col justify-between gap-5 rounded-[18px] border border-white/[0.08] bg-white/[0.025] p-5"
    >
      <h5 className="font-sans text-[15px] font-semibold leading-snug text-slate-100">{title}</h5>
      {indicator && <Indicator {...indicator} />}
    </motion.li>
  );
}
