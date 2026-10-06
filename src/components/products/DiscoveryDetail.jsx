import { motion } from 'framer-motion';
import BiopharmaLifecycle from './BiopharmaLifecycle.jsx';
import InputChip from './InputChip.jsx';
import InsightCard, { ICONS, staggerItem } from './InsightCard.jsx';
import { Branch, DiscoveryFlywheel } from './DiscoveryVisuals.jsx';
import { DownConnector, ModalityFlow, ModelNode, Reveal, SectionHeading, StoryClosing, StoryOverview } from './StoryParts.jsx';

/* Lists whose cards enter one after another as they scroll into view. */
const stagger = {
  variants: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, margin: '-60px' },
};

/* ---------------- From data to biological signals ----------------
   Multimodal data branching into four kinds of signal, which join
   again as patterns & associations. */
function SignalMap({ source, signals, result }) {
  return (
    <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7">
      <div className="flex justify-center">
        <InputChip className="px-4 py-2 text-[13px]">{source}</InputChip>
      </div>
      <Branch count={signals.length} direction="out" className="hidden lg:block" />
      <DownConnector className="my-2 lg:hidden" />

      <motion.ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6" {...stagger}>
        {signals.map((s) => {
          const Icon = ICONS[s.icon];
          return (
            <motion.li
              key={s.label}
              variants={staggerItem}
              className="flex flex-col items-center gap-2.5 rounded-[16px] border border-white/[0.1] bg-[#121B2E] px-3 py-4 text-center"
            >
              {Icon && <Icon className="h-5 w-5 text-[#C4B5FD]" strokeWidth={1.75} aria-hidden="true" />}
              <span className="font-sans text-[13.5px] font-semibold leading-snug text-slate-100">{s.label}</span>
            </motion.li>
          );
        })}
      </motion.ul>

      <Branch count={signals.length} direction="in" className="hidden lg:block" />
      <DownConnector className="my-2 lg:hidden" />
      <div className="flex justify-center">
        <ModelNode label="Output" sublabel={result} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   The Biomarker & Drug Discovery™ story, rendered inside ProductDetail
   in place of the standard layout. All copy comes from `product.story`.
------------------------------------------------------------------ */
export default function DiscoveryDetail({ product, headingRef }) {
  const { category, href, story } = product;
  const { overview, multimodal, signals, biomarkers, therapeutic, flywheel, applications, closing, cta } = story;

  return (
    <div className="space-y-16 sm:space-y-20">
      <StoryOverview product={product} headingRef={headingRef} eyebrow={category} overview={overview} />

      <Reveal aria-labelledby="discovery-multimodal" className="space-y-8">
        <SectionHeading id="discovery-multimodal" step="01" title={multimodal.title}>
          {multimodal.description}
        </SectionHeading>
        <ModalityFlow modalities={multimodal.modalities} flow={multimodal.flow} layout="row" />
      </Reveal>

      <Reveal aria-labelledby="discovery-signals" className="space-y-8">
        <SectionHeading id="discovery-signals" step="02" title={signals.title} />
        <SignalMap source={signals.source} signals={signals.items} result={signals.result} />
      </Reveal>

      <Reveal aria-labelledby="discovery-biomarkers" className="space-y-8">
        <SectionHeading id="discovery-biomarkers" step="03" title={biomarkers.title}>
          {biomarkers.description}
        </SectionHeading>
        <motion.ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3" {...stagger}>
          {biomarkers.items.map((item, i) => (
            <InsightCard key={item.title} {...item} step={String(i + 1).padStart(2, '0')} />
          ))}
        </motion.ul>
      </Reveal>

      <Reveal aria-labelledby="discovery-therapeutic" className="space-y-8">
        <SectionHeading id="discovery-therapeutic" step="04" title={therapeutic.title}>
          {therapeutic.description}
        </SectionHeading>
        <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7 lg:px-6 lg:py-8">
          <BiopharmaLifecycle stages={therapeutic.progression} />
        </div>
        <motion.ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3" {...stagger}>
          {therapeutic.items.map((item, i) => (
            <InsightCard key={item.title} {...item} step={String(i + 1).padStart(2, '0')} />
          ))}
        </motion.ul>
      </Reveal>

      {/* ---------------- Centrepiece: the flywheel ---------------- */}
      <Reveal
        aria-labelledby="discovery-flywheel"
        className="rounded-[24px] border border-white/[0.08] px-5 py-10 sm:px-8 sm:py-12"
        style={{
          backgroundImage:
            'radial-gradient(60% 55% at 50% 45%, rgba(124,58,237,0.13) 0%, rgba(124,58,237,0) 72%), linear-gradient(rgba(255,255,255,0.015), rgba(255,255,255,0.015))',
        }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">05</p>
          <h4
            id="discovery-flywheel"
            className="mt-3 font-serif text-[1.6rem] font-semibold leading-tight tracking-[-0.01em] text-[#F8FAFC] sm:text-[2rem]"
          >
            {flywheel.title}
          </h4>
        </div>
        <div className="mt-10">
          <DiscoveryFlywheel steps={flywheel.steps} centerTitle={flywheel.centerTitle} centerNote={flywheel.centerNote} />
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center font-serif text-[1.05rem] italic leading-relaxed text-slate-300 [text-wrap:balance] sm:text-[1.15rem]">
          {flywheel.statement}
        </p>
      </Reveal>

      <Reveal aria-labelledby="discovery-applications" className="space-y-10">
        <SectionHeading id="discovery-applications" step="06" title={applications.title}>
          {applications.description}
        </SectionHeading>
        <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7 lg:px-6 lg:py-8">
          <BiopharmaLifecycle stages={applications.stages} />
        </div>
      </Reveal>

      <StoryClosing label={closing.label} question={closing.question} coda={closing.coda} cta={cta} href={href} />
    </div>
  );
}
