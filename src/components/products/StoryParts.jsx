import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { Trademark } from './ProductCard.jsx';
import { DetailVisual, ViewFullProduct } from './DetailParts.jsx';
import InputChip from './InputChip.jsx';
import { ICONS, staggerItem } from './InsightCard.jsx';

/* ------------------------------------------------------------------
   Building blocks shared by the flagship product stories
   (ResponseAIDetail, SpatialTMEDetail, …).
------------------------------------------------------------------ */

export const EASE = [0.22, 1, 0.36, 1];
export const LINE = 'rgba(196,181,253,0.38)';

/* Lists whose items enter one after another as they scroll into view. */
export const STAGGER = {
  variants: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, margin: '-60px' },
};

/* Each story section rises in once as it scrolls into view. */
export function Reveal({ as = 'section', className = '', children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({ id, step, title, children }) {
  return (
    <div className="max-w-3xl">
      <p className="font-sans text-[11px] font-semibold uppercase leading-none tracking-[0.16em] text-slate-500">
        {step}
      </p>
      <h4
        id={id}
        className="mt-3 font-serif text-[1.45rem] font-semibold leading-tight tracking-[-0.01em] text-[#F8FAFC] sm:text-[1.7rem]"
      >
        <Emphasis text={title} plain />
      </h4>
      {children && (
        <p className="mt-3 font-sans text-[15px] leading-relaxed text-slate-400 [text-wrap:pretty]">{children}</p>
      )}
    </div>
  );
}

/* "[word]" → the word in the brand gradient. `plain` drops the gradient
   (the brackets are then just removed). */
export function Emphasis({ text, plain = false }) {
  return text.split(/(\[[^\]]+\])/).map((part, i) => {
    if (part.startsWith('[')) {
      return plain ? (
        <Fragment key={i}>{part.slice(1, -1)}</Fragment>
      ) : (
        <span
          key={i}
          className="bg-gradient-to-r from-[#C4B5FD] via-[#E879F9] to-[#F9A8D4] bg-clip-text text-transparent"
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function DownConnector({ className = '' }) {
  return (
    <span
      className={`mx-auto block h-7 w-px bg-gradient-to-b from-[#C4B5FD]/50 to-[#C4B5FD]/10 ${className}`}
      aria-hidden="true"
    />
  );
}

export function ModelNode({ label, sublabel }) {
  return (
    <div className="mx-auto rounded-[16px] bg-gradient-to-br from-[#A78BFA]/70 via-[#D946EF]/40 to-[#EC4899]/60 p-px shadow-[0_14px_34px_-20px_rgba(124,58,237,0.7)]">
      <div className="rounded-[15px] bg-[#121B2E] px-5 py-3.5 text-center">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C4B5FD]">{label}</p>
        {sublabel && <p className="mt-1 font-serif text-[15px] font-semibold text-white">{sublabel}</p>}
      </div>
    </div>
  );
}

export function Plus({ className = '' }) {
  return (
    <span
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 font-sans text-[12px] font-semibold leading-none text-[#C4B5FD] ${className}`}
      aria-hidden="true"
    >
      +
    </span>
  );
}

/* Input modalities as chips beside a short vertical flow:
   sources joined by "+" → the model → the result.

   layout="row" suits a longer list of sources: one panel, the sources
   as a wrapping row of modules, the flow continuing beneath them. */
export function ModalityFlow({ modalities, flow, note, modelSublabel, layout = 'split' }) {
  const tail = (
    <>
      <DownConnector className="my-2" />
      <ModelNode label={flow.model} sublabel={modelSublabel ?? flow.modelName} />
      <DownConnector className="my-2" />
      <InputChip tone="accent" className="px-4 py-2 text-[13px]">
        {flow.result}
      </InputChip>
    </>
  );

  if (layout === 'row') {
    return (
      <div className="flex flex-col items-center rounded-[20px] border border-white/[0.08] bg-white/[0.02] px-5 py-6 sm:px-8 sm:py-8">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Input modalities</p>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-2.5">
          {flow.sources.map((s, i) => (
            <li key={s.label} className="flex items-center gap-2">
              {i > 0 && <Plus />}
              <span className="rounded-[12px] border border-white/[0.12] bg-[#121B2E] px-4 py-2.5 font-sans text-[13px] font-semibold text-slate-100">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex flex-col items-center">{tail}</div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      <div className="flex flex-col justify-center rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Input modalities</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {modalities.map((m) => (
            <InputChip key={m.label} tone={m.optional ? 'optional' : 'default'}>
              {m.label}
            </InputChip>
          ))}
        </div>
        {note && (
          <p className="mt-5 border-t border-white/[0.06] pt-4 font-sans text-[13.5px] leading-relaxed text-slate-400">
            {note}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        {flow.sources.map((s, i) => (
          <Fragment key={s.label}>
            {i > 0 && <Plus className="my-2" />}
            <InputChip tone={s.optional ? 'optional' : 'default'}>{s.label}</InputChip>
          </Fragment>
        ))}
        {tail}
      </div>
    </div>
  );
}

/* Header of a story: name, tagline and overview on the left, the visual
   on the right. On phones: name → visual → overview. */
export function StoryOverview({ product, headingRef, eyebrow, subtitle, overview, visual }) {
  const { id, name, trademark, Visual } = product;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.05fr_1fr] md:gap-x-10 md:gap-y-5 lg:gap-x-14">
      <div className="md:col-start-1 md:row-start-1 md:self-end">
        <h3
          ref={headingRef}
          id={`product-detail-${id}`}
          tabIndex={-1}
          className="font-serif text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.01em] text-[#F8FAFC] outline-none sm:text-[2.25rem] lg:text-[2.6rem]"
        >
          {name}
          {trademark && <Trademark />}
        </h3>
        {eyebrow && (
          <p className="mt-3 font-sans text-[11.5px] font-semibold uppercase leading-snug tracking-[0.14em] text-[#C4B5FD]">
            {eyebrow}
          </p>
        )}
        {subtitle && (
          <p className="mt-3 font-serif text-[1.05rem] italic leading-snug text-[#DDD6FE] sm:text-[1.15rem]">
            {subtitle}
          </p>
        )}
      </div>

      <div className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-center">
        {visual ?? <DetailVisual Visual={Visual} />}
      </div>

      <p className="max-w-xl font-sans text-[15px] leading-relaxed text-slate-300 sm:text-base md:col-start-1 md:row-start-2 md:self-start">
        <Emphasis text={overview} plain />
      </p>
    </div>
  );
}

/* Closing statement and the story's two actions. "Request Demo" scrolls
   to the footer's demo call-to-action, the site's only demo entry point. */
export function StoryClosing({ label, question, followUp, coda, cta, href, onPrimary }) {
  const requestDemo = () => {
    document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Reveal className="border-t border-white/[0.08] pt-14 text-center sm:pt-16">
      {label && (
        <p className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      )}
      <p className="mx-auto max-w-3xl font-serif text-[1.85rem] font-semibold leading-[1.18] tracking-[-0.015em] text-white [text-wrap:balance] sm:text-[2.4rem] lg:text-[2.75rem]">
        <Emphasis text={question} />
      </p>
      {followUp && (
        <p className="mx-auto mt-4 max-w-2xl font-serif text-[1.25rem] leading-snug text-slate-300 [text-wrap:balance] sm:text-[1.5rem]">
          <Emphasis text={followUp} />
        </p>
      )}

      {coda && (
        <div className="mx-auto mt-12 max-w-4xl border-t border-white/[0.06] pt-10">
          <p className="font-serif text-[1.25rem] font-semibold leading-snug text-slate-100 sm:text-[1.45rem]">
            {coda.statement}
          </p>
          <ol className="mt-5 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2" aria-label={coda.label ?? 'Discovery journey'}>
            {coda.chain.map((step, i) => (
              <li key={step} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="font-sans text-[13px] text-[#C4B5FD]/70" aria-hidden="true">
                    →
                  </span>
                )}
                <InputChip tone={i === coda.chain.length - 1 ? 'accent' : 'default'}>{step}</InputChip>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <ViewFullProduct href={href} onClick={onPrimary}>
          {cta.primary}
        </ViewFullProduct>
        {cta.secondary && (
          <button
            type="button"
            onClick={requestDemo}
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 font-sans text-[14px] font-semibold text-slate-200 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD]"
          >
            {cta.secondary}
          </button>
        )}
      </div>
    </Reveal>
  );
}

/* ---------------- Inputs ----------------
   The data modules on the left; the flow they feed on the right. */
export function InputModules({ modules, flow, model, modelLabel = 'Model' }) {
  return (
    <div className="grid gap-6 md:grid-cols-[1.15fr_1fr] md:gap-8">
      <motion.ul className="grid content-center gap-2.5" {...STAGGER}>
        {modules.map((m) => {
          const Icon = ICONS[m.icon];
          return (
            <motion.li
              key={m.label}
              variants={staggerItem}
              className="flex items-center gap-3.5 rounded-[14px] border border-white/[0.08] bg-white/[0.025] px-4 py-3"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#C4B5FD]/20 bg-[#7C3AED]/10 text-[#C4B5FD]">
                {Icon && <Icon className="h-[17px] w-[17px]" strokeWidth={1.75} aria-hidden="true" />}
              </span>
              <div className="min-w-0">
                <p className="font-sans text-[14px] font-semibold leading-snug text-slate-100">{m.label}</p>
                <p className="mt-0.5 font-sans text-[12.5px] leading-snug text-slate-400">{m.detail}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>

      <div className={`flex flex-col items-center justify-center p-5 sm:p-6 rounded-[20px] border border-white/[0.08] bg-white/[0.02]`}>
        {flow.sources.map((s, i) => (
          <Fragment key={s}>
            {i > 0 && <Plus className="my-1.5" />}
            <InputChip>{s}</InputChip>
          </Fragment>
        ))}
        <DownConnector className="my-2" />
        <ModelNode label={modelLabel} sublabel={model} />
        <DownConnector className="my-2" />
        <InputChip tone="accent" className="px-4 py-2 text-[13px]">
          {flow.result}
        </InputChip>
      </div>
    </div>
  );
}

/* ---------------- Outputs ----------------
   Compact cards: icon, name, one line on what it describes. */
export function OutputCard({ icon, title, body }) {
  const Icon = ICONS[icon];
  return (
    <motion.li
      variants={staggerItem}
      className="flex gap-3.5 rounded-[16px] border border-white/[0.08] bg-white/[0.025] px-4 py-4 transition-colors duration-300 hover:border-white/[0.14]"
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#EC4899]/25 bg-[#EC4899]/[0.08] text-[#F9A8D4]">
        {Icon && <Icon className="h-[17px] w-[17px]" strokeWidth={1.75} aria-hidden="true" />}
      </span>
      <div className="min-w-0">
        <p className="font-sans text-[14px] font-semibold leading-snug text-slate-100">{title}</p>
        <p className="mt-1 font-sans text-[12.5px] leading-snug text-slate-400">{body}</p>
      </div>
    </motion.li>
  );
}
