import { motion } from 'framer-motion';
import { Trademark } from './ProductCard.jsx';
import BiomarkerCard from './BiomarkerCard.jsx';
import BiopharmaLifecycle from './BiopharmaLifecycle.jsx';
import InputChip from './InputChip.jsx';
import InsightCard from './InsightCard.jsx';
import { CELL_TYPES, SpatialMap } from './SpatialVisuals.jsx';
import { ModalityFlow, Plus, Reveal, SectionHeading, StoryClosing, StoryOverview } from './StoryParts.jsx';

/* Marker groups take the colour of the cell type they label. */
const GROUP_DOT = {
  tumor: CELL_TYPES.tumor.color,
  immune: CELL_TYPES.immune.color,
  checkpoint: '#C4B5FD',
};

/* ---------------- Marker panel ---------------- */
function MarkerPanel({ groups, panel }) {
  return (
    <div className="space-y-4">
      <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {groups.map((g) => (
          <li key={g.label} className="rounded-[18px] border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
            <p className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GROUP_DOT[g.key] }} aria-hidden="true" />
              {g.label}
            </p>
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {g.markers.map((m) => (
                <InputChip key={m} dot={GROUP_DOT[g.key]} className="tracking-[0.02em]">
                  {m}
                </InputChip>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-[18px] border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Complete panel</p>
        <ul className="mt-3.5 flex flex-wrap items-center gap-x-1.5 gap-y-2" aria-label="Complete marker panel">
          {panel.map((m, i) => (
            <li key={m.label} className="flex items-center gap-1.5">
              {i > 0 && <Plus />}
              <InputChip dot={m.group ? GROUP_DOT[m.group] : undefined}>{m.label}</InputChip>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   The SpatialTME™ story, rendered inside ProductDetail in place of the
   standard layout. All copy comes from `product.story`.
------------------------------------------------------------------ */
export default function SpatialTMEDetail({ product, headingRef }) {
  const { category, href, story } = product;
  const { overview, inputs, markers, analysis, biomarkers, applications, closing, cta } = story;

  return (
    <div className="space-y-16 sm:space-y-20">
      <StoryOverview product={product} headingRef={headingRef} eyebrow={category} overview={overview} />

      <Reveal aria-labelledby="spatialtme-inputs" className="space-y-8">
        <SectionHeading id="spatialtme-inputs" step="01" title={inputs.title} />
        <ModalityFlow
          modalities={inputs.modalities}
          flow={inputs.flow}
          note={inputs.note}
          modelSublabel={<>SpatialTME<Trademark /></>}
        />
      </Reveal>

      <Reveal aria-labelledby="spatialtme-analysis" className="space-y-8">
        <SectionHeading id="spatialtme-analysis" step="02" title={analysis.title}>
          {analysis.intro}
        </SectionHeading>
        <SpatialMap />
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {analysis.items.map((item, i) => (
            <InsightCard key={item.title} {...item} step={String(i + 1).padStart(2, '0')} />
          ))}
        </ul>
      </Reveal>

      <Reveal aria-labelledby="spatialtme-panel" className="space-y-8">
        <SectionHeading id="spatialtme-panel" step="03" title={markers.title} />
        <MarkerPanel groups={markers.groups} panel={markers.panel} />
      </Reveal>

      <Reveal aria-labelledby="spatialtme-biomarkers" className="space-y-8">
        <SectionHeading id="spatialtme-biomarkers" step="04" title={biomarkers.title}>
          {biomarkers.intro}
        </SectionHeading>
        <motion.ul
          className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {biomarkers.items.map((item) => (
            <BiomarkerCard key={item.title} {...item} />
          ))}
        </motion.ul>
        <p className="font-sans text-[12px] text-slate-500">{biomarkers.footnote}</p>
      </Reveal>

      <Reveal aria-labelledby="spatialtme-applications" className="space-y-10">
        <SectionHeading id="spatialtme-applications" step="05" title={applications.title}>
          {applications.description}
        </SectionHeading>
        <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7 lg:px-6 lg:py-8">
          <BiopharmaLifecycle stages={applications.stages} />
        </div>
      </Reveal>

      <StoryClosing label={closing.label} question={closing.question} cta={cta} href={href} />
    </div>
  );
}
