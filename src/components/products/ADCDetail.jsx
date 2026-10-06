import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { Trademark } from './ProductCard.jsx';
import BiopharmaLifecycle from './BiopharmaLifecycle.jsx';
import InputChip from './InputChip.jsx';
import InsightCard from './InsightCard.jsx';
import { HeterogeneityMap, RelationArcs, SameAverage, TargetExpressionMap, TargetLegend, TMELegend } from './ADCVisuals.jsx';
import {
  DownConnector,
  InputModules,
  ModelNode,
  OutputCard,
  Plus,
  Reveal,
  SectionHeading,
  StoryClosing,
  StoryOverview,
} from './StoryParts.jsx';

/* Lists whose cards enter one after another as they scroll into view. */
const stagger = {
  variants: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, margin: '-60px' },
};

const PANEL = 'rounded-[20px] border border-white/[0.08] bg-white/[0.02]';

/* ---------------- Terms that combine into one result ----------------
   A + B + C ↓ Result — used beside the target and heterogeneity maps. */
function Combine({ terms, result }) {
  return (
    <div className="flex flex-col items-center">
      {terms.map((t, i) => (
        <Fragment key={t}>
          {i > 0 && <Plus className="my-1.5" />}
          <InputChip className="px-4 py-2 text-[13px]">{t}</InputChip>
        </Fragment>
      ))}
      <DownConnector className="my-2" />
      <ModelNode label="Result" sublabel={result} />
    </div>
  );
}

/* ------------------------------------------------------------------
   The ADC ResponseAI™ story, rendered inside ProductDetail in place of
   the standard layout. All copy comes from `product.story`.

   Reads as one argument: what goes in → which signals matter → how the
   model relates them → why target expression alone is not enough →
   what comes out → where it fits in ADC development.
------------------------------------------------------------------ */
export default function ADCDetail({ product, headingRef }) {
  const { category, href, story } = product;
  const { overview, inputs, signals, analysis, target, heterogeneity, outputs, applications, closing, cta } = story;

  return (
    <div className="space-y-16 sm:space-y-20">
      <StoryOverview product={product} headingRef={headingRef} eyebrow={category} overview={overview} />

      <Reveal aria-labelledby="adc-inputs" className="space-y-8">
        <SectionHeading id="adc-inputs" step="01" title={inputs.title} />
        <InputModules modules={inputs.modules} flow={inputs.flow} model={<>ADC ResponseAI<Trademark /></>} />
      </Reveal>

      <Reveal aria-labelledby="adc-signals" className="space-y-8">
        <SectionHeading id="adc-signals" step="02" title={signals.title} />
        <motion.ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4" {...stagger}>
          {signals.items.map((item, i) => (
            <InsightCard key={item.title} {...item} step={String(i + 1).padStart(2, '0')} />
          ))}
        </motion.ul>
      </Reveal>

      <Reveal aria-labelledby="adc-analysis" className="space-y-8">
        <SectionHeading id="adc-analysis" step="03" title={analysis.title}>
          {analysis.description}
        </SectionHeading>
        <div className={`p-5 sm:p-7 lg:px-6 lg:pb-8 lg:pt-4 ${PANEL}`}>
          <RelationArcs count={analysis.stages.length} pairs={analysis.relations} />
          <BiopharmaLifecycle stages={analysis.stages} />
        </div>
        <p className="hidden font-sans text-[12px] text-slate-500 lg:block">{analysis.footnote}</p>
      </Reveal>

      <Reveal aria-labelledby="adc-target" className="space-y-8">
        <SectionHeading id="adc-target" step="04" title={target.title}>
          {target.description}
        </SectionHeading>
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
          <div className="space-y-4">
            <div className={`p-3 sm:p-4 ${PANEL}`}>
              <TargetExpressionMap />
            </div>
            <TargetLegend />
          </div>
          <div className="flex flex-col justify-center gap-6">
            <div className={`p-5 sm:p-6 ${PANEL}`}>
              <Combine terms={target.terms} result={target.result} />
            </div>
            <SameAverage note={target.note} labels={target.compare} />
          </div>
        </div>
      </Reveal>

      <Reveal aria-labelledby="adc-heterogeneity" className="space-y-8">
        <SectionHeading id="adc-heterogeneity" step="05" title={heterogeneity.title}>
          {heterogeneity.description}
        </SectionHeading>
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
          <div className="space-y-4">
            <div className={`p-3 sm:p-4 ${PANEL}`}>
              <HeterogeneityMap />
            </div>
            <TMELegend />
          </div>
          <div className={`flex items-center justify-center p-5 sm:p-6 ${PANEL}`}>
            <Combine terms={heterogeneity.terms} result={heterogeneity.result} />
          </div>
        </div>
      </Reveal>

      <Reveal aria-labelledby="adc-outputs" className="space-y-8">
        <SectionHeading id="adc-outputs" step="06" title={outputs.title} />
        <motion.ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" {...stagger}>
          {outputs.items.map((item) => (
            <OutputCard key={item.title} {...item} />
          ))}
        </motion.ul>
        <p className="font-sans text-[12px] text-slate-500">{outputs.footnote}</p>
      </Reveal>

      <Reveal aria-labelledby="adc-applications" className="space-y-10">
        <SectionHeading id="adc-applications" step="07" title={applications.title}>
          {applications.description}
        </SectionHeading>
        <div className={`p-5 sm:p-7 lg:px-6 lg:py-8 ${PANEL}`}>
          <BiopharmaLifecycle stages={applications.stages} />
        </div>
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
