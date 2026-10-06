import { Trademark } from './ProductCard.jsx';
import { DownConnector, LINE, ModelNode, Reveal, SectionHeading, StoryClosing, StoryOverview } from './StoryParts.jsx';
import InputChip from './InputChip.jsx';
import InsightCard from './InsightCard.jsx';
import BiopharmaLifecycle from './BiopharmaLifecycle.jsx';

/* Curves fanning between a column of `count` evenly spaced rows and one
   centre point. Drawn on a stretched 100 × 100 box so it always spans the
   column height; strokes stay hairline at any size. */
function Fan({ count, direction }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const y = ((i + 0.5) / count) * 100;
        const d =
          direction === 'in' ? `M0 ${y} C 55 ${y}, 45 50, 100 50` : `M0 50 C 55 50, 45 ${y}, 100 ${y}`;
        return (
          <path key={i} d={d} fill="none" stroke={LINE} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        );
      })}
    </svg>
  );
}

/* ---------------- Multimodal Intelligence ----------------
   inputs ⟩ AI model ⟩ outputs, fanned on wide screens and stacked with
   simple connectors on phones. Each row of a column is the same height
   (auto-rows-fr), so the fan's evenly spaced ends meet the chips. */
function MultimodalDiagram({ inputs, model, outputs }) {
  return (
    <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7">
      <div className="flex flex-col md:grid md:grid-cols-[minmax(0,1fr)_72px_auto_72px_minmax(0,0.8fr)] md:items-stretch">
        <div>
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 md:hidden">
            Inputs
          </p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:h-full md:grid-cols-1 md:auto-rows-fr md:gap-2.5">
            {inputs.map((item) => (
              <li key={item} className="flex items-center md:justify-end">
                <InputChip className="w-full justify-center md:w-auto">{item}</InputChip>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:block">
          <Fan count={inputs.length} direction="in" />
        </div>
        <DownConnector className="my-3 md:hidden" />

        <div className="flex items-center justify-center">
          <ModelNode label={model} sublabel={<>ResponseAI<Trademark /></>} />
        </div>

        <div className="hidden md:block">
          <Fan count={outputs.length} direction="out" />
        </div>
        <DownConnector className="my-3 md:hidden" />

        <div>
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 md:hidden">
            Outputs
          </p>
          <ul className="grid grid-cols-2 gap-2 md:h-full md:grid-cols-1 md:auto-rows-fr md:gap-2.5">
            {outputs.map((item) => (
              <li key={item} className="flex items-center">
                <InputChip tone="accent" className="w-full justify-center md:w-auto">
                  {item}
                </InputChip>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------------- NSCLC example ----------------
   Four data groups joined by "+", converging on ResponseAI™ and then on
   the patient-level result. */
function NsclcExample({ groups, result }) {
  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
        {groups.map((g, i) => (
          <li
            key={g.label}
            className="relative rounded-[18px] border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5"
          >
            {i > 0 && (
              <span
                className="absolute -left-[26px] top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0E1626] font-sans text-[13px] font-semibold text-[#C4B5FD] lg:inline-flex"
                aria-hidden="true"
              >
                +
              </span>
            )}
            <p className="font-sans text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-[#C4B5FD]">
              {g.label}
            </p>
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {g.items.map((item) => (
                <InputChip key={item}>{item}</InputChip>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {/* Converge: four columns into one on wide screens, a plain line below */}
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="hidden h-10 w-full lg:block"
        aria-hidden="true"
      >
        {[12.5, 37.5, 62.5, 87.5].map((x) => (
          <path
            key={x}
            d={`M${x} 0 C ${x} 22, 50 18, 50 40`}
            fill="none"
            stroke={LINE}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <DownConnector className="my-1 lg:hidden" />

      <div className="flex flex-col items-center">
        <ModelNode label="Integrated by" sublabel={<>ResponseAI<Trademark /></>} />
        <DownConnector className="my-1" />
        <InputChip tone="accent" className="px-4 py-2 text-[13px]">
          {result}
        </InputChip>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   The flagship ResponseAI™ story, rendered inside ProductDetail in place
   of the standard layout. All copy comes from `product.story`.
------------------------------------------------------------------ */
export default function ResponseAIDetail({ product, headingRef }) {
  const { href, story } = product;
  const { subtitle, overview, multimodal, example, insights, biopharma, closing, cta } = story;

  return (
    <div className="space-y-16 sm:space-y-20">
      <StoryOverview product={product} headingRef={headingRef} subtitle={subtitle} overview={overview} />

      {/* ---------------- Multimodal Intelligence ---------------- */}
      <Reveal aria-labelledby="responseai-multimodal" className="space-y-8">
        <SectionHeading id="responseai-multimodal" step="01" title={multimodal.title}>
          {multimodal.description}
        </SectionHeading>
        <MultimodalDiagram inputs={multimodal.inputs} model={multimodal.model} outputs={multimodal.outputs} />
      </Reveal>

      {/* ---------------- NSCLC ---------------- */}
      <Reveal aria-labelledby="responseai-nsclc" className="space-y-8">
        <SectionHeading id="responseai-nsclc" step="02 · Example" title={example.title}>
          {example.subtitle}
        </SectionHeading>
        <NsclcExample groups={example.groups} result={example.result} />
        <p className="mx-auto max-w-2xl border-l-2 border-[#C4B5FD]/40 pl-4 font-serif text-[15.5px] italic leading-relaxed text-slate-300 [text-wrap:pretty] sm:text-base">
          {example.statement}
        </p>
      </Reveal>

      {/* ---------------- Actionable insights ---------------- */}
      <Reveal aria-labelledby="responseai-insights" className="space-y-8">
        <SectionHeading id="responseai-insights" step="03" title={insights.title} />
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {insights.items.map((item, i) => (
            <InsightCard key={item.title} {...item} step={String(i + 1).padStart(2, '0')} />
          ))}
        </ul>
      </Reveal>

      {/* ---------------- Built for Biopharma ---------------- */}
      <Reveal aria-labelledby="responseai-biopharma" className="space-y-10">
        <SectionHeading id="responseai-biopharma" step="04" title={biopharma.title}>
          {biopharma.description}
        </SectionHeading>
        <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7 lg:px-6 lg:py-8">
          <BiopharmaLifecycle stages={biopharma.stages} />
        </div>
      </Reveal>

      <StoryClosing question={closing.question} followUp={closing.followUp} cta={cta} href={href} />
    </div>
  );
}
