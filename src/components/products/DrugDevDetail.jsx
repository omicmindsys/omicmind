import { motion } from 'framer-motion';
import BiopharmaLifecycle from './BiopharmaLifecycle.jsx';
import InsightCard from './InsightCard.jsx';
import { DecisionJourney, EvidenceBand } from './DrugDevVisuals.jsx';
import { InputModules, OutputCard, Reveal, SectionHeading, STAGGER, StoryClosing, StoryOverview } from './StoryParts.jsx';

const PANEL = 'rounded-[20px] border border-white/[0.08] bg-white/[0.02]';

/* ------------------------------------------------------------------
   The Drug Development Intelligence™ story, rendered inside
   ProductDetail in place of the standard layout. All copy comes from
   `product.story`.

   Reads as one argument: connect the evidence → analyse it → follow it
   to a decision → what comes out → where it applies across the
   lifecycle and in biopharma programs.
------------------------------------------------------------------ */
export default function DrugDevDetail({ product, headingRef }) {
  const { category, href, story } = product;
  const { overview, evidence, intelligence, decision, outputs, lifecycle, applications, closing, cta } = story;

  return (
    <div className="space-y-16 sm:space-y-20">
      <StoryOverview product={product} headingRef={headingRef} eyebrow={category} overview={overview} />

      <Reveal aria-labelledby="drugdev-evidence" className="space-y-8">
        <SectionHeading id="drugdev-evidence" step="01" title={evidence.title}>
          {evidence.description}
        </SectionHeading>
        <InputModules modules={evidence.modules} flow={evidence.flow} model={evidence.flow.model} modelLabel="OmicMind" />
      </Reveal>

      <Reveal aria-labelledby="drugdev-intelligence" className="space-y-8">
        <SectionHeading id="drugdev-intelligence" step="02" title={intelligence.title} />
        <motion.ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4" {...STAGGER}>
          {intelligence.items.map((item, i) => (
            <InsightCard key={item.title} {...item} step={String(i + 1).padStart(2, '0')} />
          ))}
        </motion.ul>
      </Reveal>

      {/* ---------------- Centrepiece: the decision journey ---------------- */}
      <Reveal
        aria-labelledby="drugdev-decision"
        className="rounded-[24px] border border-white/[0.08] px-5 py-10 sm:px-8 sm:py-12"
        style={{
          backgroundImage:
            'radial-gradient(60% 55% at 50% 40%, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0) 72%), linear-gradient(rgba(255,255,255,0.015), rgba(255,255,255,0.015))',
        }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">03</p>
          <h4
            id="drugdev-decision"
            className="mt-3 font-serif text-[1.6rem] font-semibold leading-tight tracking-[-0.01em] text-[#F8FAFC] sm:text-[2rem]"
          >
            {decision.title}
          </h4>
          {decision.description && (
            <p className="mt-3 font-sans text-[15px] leading-relaxed text-slate-400">{decision.description}</p>
          )}
        </div>
        <div className="mt-10">
          <DecisionJourney steps={decision.steps} />
        </div>
      </Reveal>

      <Reveal aria-labelledby="drugdev-outputs" className="space-y-8">
        <SectionHeading id="drugdev-outputs" step="04" title={outputs.title} />
        <motion.ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" {...STAGGER}>
          {outputs.items.map((item) => (
            <OutputCard key={item.title} {...item} />
          ))}
        </motion.ul>
        <p className="font-sans text-[12px] text-slate-500">{outputs.footnote}</p>
      </Reveal>

      <Reveal aria-labelledby="drugdev-lifecycle" className="space-y-10">
        <SectionHeading id="drugdev-lifecycle" step="05" title={lifecycle.title}>
          {lifecycle.description}
        </SectionHeading>
        <div className={`p-5 sm:p-7 lg:px-6 lg:py-8 ${PANEL}`}>
          <BiopharmaLifecycle stages={lifecycle.stages} />
          <EvidenceBand count={lifecycle.stages.length} label={lifecycle.band.label} layers={lifecycle.band.layers} />
        </div>
      </Reveal>

      <Reveal aria-labelledby="drugdev-applications" className="space-y-8">
        <SectionHeading id="drugdev-applications" step="06" title={applications.title}>
          {applications.description}
        </SectionHeading>
        <motion.ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3" {...STAGGER}>
          {applications.items.map((item, i) => (
            <InsightCard key={item.title} {...item} step={String(i + 1).padStart(2, '0')} />
          ))}
        </motion.ul>
      </Reveal>

      <StoryClosing
        label={closing.label}
        question={closing.question}
        coda={closing.coda}
        cta={cta}
        href={href}
        onPrimary={() => headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
      />
    </div>
  );
}
