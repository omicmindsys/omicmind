import { motion } from 'framer-motion';
import { ICONS } from './InsightCard.jsx';

/* ------------------------------------------------------------------
   The drug-development journey as a numbered track: horizontal from
   `lg`, a vertical timeline below it. One rail runs behind the nodes,
   shading from lavender into pink along the direction of travel.

   A stage is a label, or { label, icon } to show an icon in its node
   in place of the step number.
------------------------------------------------------------------ */
export default function BiopharmaLifecycle({ stages }) {
  /* One column per stage from `lg`; the rail runs from the centre of the
     first node to the centre of the last. */
  const vars = {
    '--cols': `repeat(${stages.length}, minmax(0, 1fr))`,
    '--rail': `${100 / (stages.length * 2)}%`,
  };

  return (
    <ol className="relative grid gap-5 lg:gap-4 lg:[grid-template-columns:var(--cols)]" style={vars}>
      <span
        className="pointer-events-none absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-[#A78BFA]/60 to-[#EC4899]/50 lg:bottom-auto lg:left-[var(--rail)] lg:right-[var(--rail)] lg:top-[15px] lg:h-px lg:w-auto lg:bg-gradient-to-r"
        aria-hidden="true"
      />
      {stages.map((entry, i) => {
        const stage = typeof entry === 'string' ? entry : entry.label;
        const Icon = typeof entry === 'string' ? null : ICONS[entry.icon];
        return (
          <motion.li
            key={stage}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: 'easeOut' }}
            className="relative flex items-center gap-4 lg:flex-col lg:items-center lg:gap-3 lg:text-center"
          >
            <span
              className={`relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-[#0E1626] font-sans text-[12px] font-semibold tabular-nums ${
                i === stages.length - 1
                  ? 'border-[#EC4899]/50 text-[#FBCFE8]'
                  : 'border-[#C4B5FD]/40 text-[#DDD6FE]'
              }`}
            >
              {Icon ? (
                <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} aria-hidden="true" />
              ) : (
                String(i + 1).padStart(2, '0')
              )}
            </span>
            <span className="font-sans text-[13.5px] font-medium leading-snug text-slate-200 lg:max-w-[11rem]">
              {stage}
            </span>
          </motion.li>
        );
      })}
    </ol>
  );
}
