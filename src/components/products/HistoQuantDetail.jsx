import { motion } from 'framer-motion';
import { Trademark } from './ProductCard.jsx';
import { DetailVisual } from './DetailParts.jsx';
import BiopharmaLifecycle from './BiopharmaLifecycle.jsx';
import InputChip from './InputChip.jsx';
import InsightCard, { ICONS, staggerItem } from './InsightCard.jsx';
import { CompartmentLegend, HistoQuantHeaderVisual, PathologyPipeline } from './HistoQuantVisuals.jsx';
import { DownConnector, LINE, ModelNode, Reveal, SectionHeading, StoryClosing, StoryOverview } from './StoryParts.jsx';

/* Lists whose cards enter one after another as they scroll into view. */
const stagger = {
  variants: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, margin: '-60px' },
};

/* ---------------- Outputs ----------------
   Compact data cards: what the output is, and the kind of data it is. */
function OutputCard({ icon, title, type }) {
  const Icon = ICONS[icon];
  return (
    <motion.li
      variants={staggerItem}
      className="flex items-center gap-3.5 rounded-[16px] border border-white/[0.08] bg-white/[0.025] px-4 py-3.5"
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#C4B5FD]/20 bg-[#7C3AED]/10 text-[#C4B5FD]">
        {Icon && <Icon className="h-[17px] w-[17px]" strokeWidth={1.75} aria-hidden="true" />}
      </span>
      <div className="min-w-0">
        <p className="font-sans text-[14px] font-semibold leading-snug text-slate-100">{title}</p>
        <p className="mt-0.5 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">{type}</p>
      </div>
    </motion.li>
  );
}

/* ---------------- Computational foundation ----------------
   HistoQuant™ → features → the four downstream model families. */
function Foundation({ features, models }) {
  return (
    <div
      className="rounded-[22px] border border-white/[0.08] p-5 sm:p-8"
      style={{
        backgroundImage:
          'radial-gradient(70% 60% at 50% 0%, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0) 70%), linear-gradient(rgba(255,255,255,0.02), rgba(255,255,255,0.02))',
      }}
    >
      <div className="flex flex-col items-center">
        <ModelNode label="Source" sublabel={<>HistoQuant<Trademark /></>} />
        <DownConnector className="my-2" />
        <InputChip tone="accent" className="px-4 py-2 text-[13px]">
          {features}
        </InputChip>
      </div>

      {/* One feature set branching into four model families */}
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="hidden h-12 w-full lg:block" aria-hidden="true">
        {[12.5, 37.5, 62.5, 87.5].map((x) => (
          <path
            key={x}
            d={`M50 0 C 50 20, ${x} 18, ${x} 40`}
            fill="none"
            stroke={LINE}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <DownConnector className="my-2 lg:hidden" />

      <motion.ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6" {...stagger}>
        {models.map((m) => {
          const Icon = ICONS[m.icon];
          return (
            <motion.li
              key={m.label}
              variants={staggerItem}
              className="flex flex-col items-center gap-2.5 rounded-[16px] border border-white/[0.1] bg-[#121B2E] px-3 py-4 text-center"
            >
              {Icon && <Icon className="h-5 w-5 text-[#C4B5FD]" strokeWidth={1.75} aria-hidden="true" />}
              <span className="font-sans text-[13.5px] font-semibold leading-snug text-slate-100">{m.label}</span>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}

/* ------------------------------------------------------------------
   The HistoQuant™ story, rendered inside ProductDetail in place of the
   standard layout. All copy comes from `product.story`.

   Reads as one transformation: image → cells → features → data →
   the downstream OmicMind models.
------------------------------------------------------------------ */
export default function HistoQuantDetail({ product, headingRef }) {
  const { category, href, story } = product;
  const { overview, process, measures, analysis, outputs, foundation, applications, closing, cta } = story;

  return (
    <div className="space-y-16 sm:space-y-20">
      <StoryOverview
        product={product}
        headingRef={headingRef}
        eyebrow={category}
        overview={overview}
        visual={<DetailVisual Visual={HistoQuantHeaderVisual} />}
      />

      <Reveal aria-labelledby="histoquant-process" className="space-y-10">
        <SectionHeading id="histoquant-process" step="01" title={process.title} />
        <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7 lg:px-6 lg:py-8">
          <BiopharmaLifecycle stages={process.stages} />
        </div>
      </Reveal>

      <Reveal aria-labelledby="histoquant-measures" className="space-y-8">
        <SectionHeading id="histoquant-measures" step="02" title={measures.title}>
          {measures.intro}
        </SectionHeading>
        <motion.ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4" {...stagger}>
          {measures.items.map((item, i) => (
            <InsightCard key={item.title} {...item} step={String(i + 1).padStart(2, '0')} />
          ))}
        </motion.ul>
      </Reveal>

      <Reveal aria-labelledby="histoquant-analysis" className="space-y-8">
        <SectionHeading id="histoquant-analysis" step="03" title={analysis.title}>
          {analysis.intro}
        </SectionHeading>
        <CompartmentLegend />
        <PathologyPipeline stages={analysis.stages} />
        <p className="font-sans text-[12px] text-slate-500">{analysis.footnote}</p>
      </Reveal>

      <Reveal aria-labelledby="histoquant-outputs" className="space-y-8">
        <SectionHeading id="histoquant-outputs" step="04" title={outputs.title}>
          {outputs.description}
        </SectionHeading>
        <motion.ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" {...stagger}>
          {outputs.items.map((item) => (
            <OutputCard key={item.title} {...item} />
          ))}
        </motion.ul>
      </Reveal>

      <Reveal aria-labelledby="histoquant-foundation" className="space-y-8">
        <SectionHeading id="histoquant-foundation" step="05" title={foundation.title}>
          {foundation.description}
        </SectionHeading>
        <Foundation features={foundation.features} models={foundation.models} />
      </Reveal>

      <Reveal aria-labelledby="histoquant-applications" className="space-y-8">
        <SectionHeading id="histoquant-applications" step="06" title={applications.title} />
        <motion.ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3" {...stagger}>
          {applications.items.map((item, i) => (
            <InsightCard key={item.title} {...item} step={String(i + 1).padStart(2, '0')} />
          ))}
        </motion.ul>
      </Reveal>

      <StoryClosing question={closing.statement} followUp={closing.followUp} cta={cta} href={href} />
    </div>
  );
}
