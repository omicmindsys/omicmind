import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   Three modules, carried on type alone.

   Nothing in these cards is photographed or drawn. Each is a short
   dossier and its interest comes from the hierarchy — a category
   label, the module's name, what it does, what it is for, and where it
   sits in the plan — with hairlines rather than colour separating one
   block from the next. Each card takes one step of the brand ramp for
   its label, its rules and its hover bloom, so the three read as one
   system without any of them becoming the loud one.
------------------------------------------------------------------ */
const MODULES = [
  {
    eyebrow: 'Breast Cancer Pack',
    title: 'OM Breast',
    trademark: true,
    description:
      'AI-powered breast cancer pathology intelligence for biomarker quantification, spatial immune profiling, molecular phenotype prediction, and treatment-response research.',
    tags: ['H&E', 'IHC', 'Biomarkers', 'Spatial', 'Molecular'],
    purposeLabel: 'Focus',
    purpose: 'Full-panel biomarker quantification and spatial immune profiling in invasive breast carcinoma.',
    /* The complete panel, shown in the card's detail view. */
    tiers: [
      {
        tier: 'Tier A',
        name: 'RUO Quantification',
        items: [
          'H&E tumor mask & tumor percentage',
          'ER/PR nuclear positivity %, intensity distribution (0, 1+, 2+, 3+)',
          'Allred Score (0–8)',
          'H-Score (0–300)',
          'Ki-67 global proliferation index',
          'Automated top-3 hotspot proliferation index',
          'HER2 membrane completeness & intensity scoring assistance',
          'CD3/CD8 intratumoral vs. stromal immune density per mm²',
        ],
      },
      {
        tier: 'Tier B',
        name: 'Research Models',
        items: [
          'H&E-based PIK3CA mutation probability',
          'TP53 mutation score',
          'Homologous Recombination Deficiency (HRD) morphology phenotype score',
        ],
      },
      {
        tier: 'Tier C',
        name: 'Decision Layer',
        items: ['Neoadjuvant chemotherapy complete response (pCR) prediction score'],
      },
    ],
    from: '#7C3AED',
    to: '#A78BFA',
  },
  {
    eyebrow: 'RESEARCH',
    title: 'OM LUNG IMMUNE',
    features: [
      'Histologic subtype assistance',
      'Assay-specific PD-L1 TPS',
      'CD8 spatial density',
      'Inflamed, excluded and desert phenotypes',
      'Cohort export for translational research',
    ],
    purposeLabel: 'Commercial Purpose',
    purpose: 'Enter pharma biomarker and IO workflows.',
    highlight: 'Flagship asset',
    from: '#A855F7',
    to: '#E879F9',
  },
  {
    eyebrow: 'FLAGSHIP ASSET',
    title: 'LUNG IO-RESISTANCE',
    features: [
      'Outcome-linked pretreatment cohort',
      'Spatial resistance signature',
      'Locked external validation',
      'Patent and prospective protocol',
      'Mechanism and wet-lab confirmation',
    ],
    purposeLabel: 'Fundraising Purpose',
    purpose: 'Demonstrate an asset, not merely software.',
    from: '#D946EF',
    to: '#F9A8D4',
  },
];

/* The hairline between one block of the dossier and the next: the
   card's own accent at the left, fading out across the measure, so the
   division is felt rather than drawn. */
function Rule({ to }) {
  return (
    <span
      className="relative my-6 block h-px w-full"
      style={{ backgroundImage: `linear-gradient(90deg, ${to}59, ${to}1A 45%, transparent 100%)` }}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------
   The detail view a module can carry (OM Breast's full Tier A / B / C
   panel). Rendered through a portal: the page's <main> sets
   `perspective`, which would otherwise trap a fixed overlay inside it.
   Escape or the backdrop closes it; focus moves to the close button on
   open and back to the card's action on close.
------------------------------------------------------------------ */
function ModuleDetail({ open, onClose, eyebrow, title, trademark, purposeLabel, purpose, tiers, from, to }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = overflow;
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] overflow-y-auto overscroll-contain bg-[#050816]/75 px-4 py-10 backdrop-blur-sm sm:px-6 sm:py-16"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="oda-detail-title"
            className="relative mx-auto max-w-3xl rounded-[24px] p-px shadow-[0_28px_60px_-24px_rgba(124,58,237,0.45)]"
            style={{
              backgroundImage: `linear-gradient(150deg, rgba(255,255,255,0.4) 0%, ${from}80 34%, ${to}4D 64%, rgba(255,255,255,0.2) 100%)`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-[23px] bg-[#0B1020] p-7 sm:p-10">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ backgroundImage: `linear-gradient(90deg, transparent, ${to}99, transparent)` }}
                aria-hidden="true"
              />

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] sm:right-7 sm:top-7"
              >
                <X className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              </button>

              <span
                className="inline-flex w-fit items-center rounded-full border px-3 py-1.5 font-sans text-[10px] font-semibold uppercase leading-none tracking-[0.22em]"
                style={{ borderColor: `${to}3D`, backgroundColor: `${from}1A`, color: to }}
              >
                {eyebrow}
              </span>

              <h3
                id="oda-detail-title"
                className="mt-5 pr-12 font-serif text-[1.65rem] font-semibold uppercase leading-tight tracking-[0.01em] text-white sm:text-[2rem]"
              >
                {title}
                {trademark && <Tm />}
              </h3>

              <p className="mt-5 font-sans text-[10px] font-semibold uppercase leading-none tracking-[0.18em]" style={{ color: to }}>
                {purposeLabel}
              </p>
              <p className="mt-2.5 max-w-2xl font-sans text-[15px] leading-relaxed text-slate-300 [text-wrap:pretty]">
                {purpose}
              </p>

              <div className="mt-8 space-y-4">
                {tiers.map((t, i) => (
                  <section
                    key={t.tier}
                    aria-labelledby={`oda-tier-${i}`}
                    className="rounded-[18px] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: to }}>
                        {t.tier}
                      </span>
                      <h4 id={`oda-tier-${i}`} className="font-sans text-[15px] font-semibold text-white">
                        {t.name}
                      </h4>
                    </div>
                    <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                      {t.items.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span
                            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
                            aria-hidden="true"
                          />
                          <span className="font-sans text-[13.5px] leading-relaxed text-slate-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function Tm() {
  return <span className="ml-0.5 align-super text-[0.5em] font-medium normal-case">&trade;</span>;
}

function ModuleCard({
  eyebrow,
  title,
  trademark,
  description,
  tags,
  features,
  purposeLabel,
  purpose,
  highlight,
  tiers,
  from,
  to,
  wide,
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  const detailButtonRef = useRef(null);
  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    requestAnimationFrame(() => detailButtonRef.current?.focus({ preventScroll: true }));
  }, []);

  return (
    <li
      className={`oda-card group relative h-full list-none ${
        wide ? 'sm:col-span-2 lg:col-span-1' : ''
      }`}
    >
      {/* Outer bloom — off at rest, lifted in on hover */}
      <div
        className="pointer-events-none absolute -inset-[6px] rounded-[30px] opacity-0 blur-[16px] transition-opacity duration-[380ms] ease-out group-hover:opacity-100"
        style={{ backgroundImage: `linear-gradient(140deg, ${from}47, ${to}3D)` }}
        aria-hidden="true"
      />

      {/* Gradient hairline shell — the same 1px-padding construction the
          rest of the chapter uses, so the border carries the brand ramp */}
      <div
        className="relative h-full rounded-[24px] p-px shadow-[0_10px_30px_-20px_rgba(76,29,149,0.45)] transition-all duration-[380ms] ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_54px_-22px_rgba(124,58,237,0.36)]"
        style={{
          backgroundImage: `linear-gradient(150deg, rgba(255,255,255,0.55) 0%, ${from}80 34%, ${to}4D 64%, rgba(255,255,255,0.28) 100%)`,
        }}
      >
        {/* The glass the dossier is set on. It carries no fill of its own
            beyond a few percent of white, so the section's ground reads
            through it and the card stays a card rather than a panel. */}
        <div className="relative flex h-full flex-col overflow-hidden rounded-[23px] bg-white/[0.045] p-7 backdrop-blur-xl sm:p-8">
          {/* Top sheen, so the card still reads as glass at its edge */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ backgroundImage: `linear-gradient(90deg, transparent, ${to}99, transparent)` }}
            aria-hidden="true"
          />

          {/* 1 — category */}
          <span
            className="relative inline-flex w-fit items-center rounded-full border px-3 py-1.5 font-sans text-[10px] font-semibold uppercase leading-none tracking-[0.22em]"
            style={{ borderColor: `${to}3D`, backgroundColor: `${from}1A`, color: to }}
          >
            {eyebrow}
          </span>

          {/* 2 — the module's name, the loudest thing on the card */}
          <h3 className="relative mt-5 font-serif text-[1.5rem] font-semibold uppercase leading-tight tracking-[0.01em] text-white [text-wrap:balance] sm:text-[1.65rem]">
            {title}
            {trademark && <Tm />}
          </h3>

          <Rule to={to} />

          {/* 3 — what it is and the data it reads, for a module that
              carries a description in place of the capability list */}
          {description && (
            <p className="relative font-sans text-[13.5px] leading-relaxed text-slate-300 [text-wrap:pretty]">
              {description}
            </p>
          )}
          {tags && (
            <ul className="relative mt-4 flex flex-wrap gap-1.5" aria-label="Data modalities">
              {tags.map((t) => (
                <li
                  key={t}
                  className="whitespace-nowrap rounded-full border px-2.5 py-1 font-sans text-[10.5px] font-semibold leading-none tracking-[0.04em]"
                  style={{ borderColor: `${to}33`, color: to }}
                >
                  {t}
                </li>
              ))}
            </ul>
          )}

          {/* 3 — what it does */}
          {features && (
          <ul className="relative space-y-3 [text-wrap:pretty]">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
                  aria-hidden="true"
                />
                <span className="font-sans text-[13.5px] leading-relaxed text-slate-300">{f}</span>
              </li>
            ))}
          </ul>
          )}

          {/* ---- The foot of the dossier ----
              Held down with `mt-auto`, so the purpose and the status line
              up across the row however many lines the capabilities above
              them run to. The third card carries no status; its purpose
              simply sits where the others' does. */}
          <div className="relative mt-auto">
            <Rule to={to} />

            {/* 4 — purpose heading */}
            <p
              className="font-sans text-[10px] font-semibold uppercase leading-none tracking-[0.18em]"
              style={{ color: to }}
            >
              {purposeLabel}
            </p>

            {/* 5 — purpose description */}
            <p className="mt-2.5 font-sans text-[13.5px] leading-relaxed text-slate-300 [text-wrap:pretty]">
              {purpose}
            </p>

            {/* 6 — where it sits in the plan */}
            {highlight && (
              <>
                <Rule to={to} />
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase leading-none tracking-[0.16em] text-white">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: to, boxShadow: `0 0 8px 1.5px ${to}` }}
                    aria-hidden="true"
                  />
                  {highlight}
                </span>
              </>
            )}

            {/* 6 — or, for a module with a full panel, the way into it */}
            {tiers && (
              <>
                <Rule to={to} />
                <button
                  ref={detailButtonRef}
                  type="button"
                  onClick={() => setDetailOpen(true)}
                  aria-haspopup="dialog"
                  className="group/btn inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase leading-none tracking-[0.16em] text-white transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD]"
                >
                  View full panel
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {tiers && (
        <ModuleDetail
          open={detailOpen}
          onClose={closeDetail}
          eyebrow={eyebrow}
          title={title}
          trademark={trademark}
          purposeLabel={purposeLabel}
          purpose={purpose}
          tiers={tiers}
          from={from}
          to={to}
        />
      )}
    </li>
  );
}

export default function OncologyDiseaseAreas() {
  const rootRef = useRef(null);
  const headRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // Header fade-up
      gsap.from(headRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
      });

      // The three modules land in reading order, left to right.
      gsap.from('.oda-card', {
        y: 44,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.11,
        scrollTrigger: { trigger: gridRef.current, start: 'top 86%' },
      });

      // The ground under the grid settles in first, so the cards land on
      // a field rather than on bare white.
      gsap.from('.oda-field', {
        opacity: 0,
        duration: 1.3,
        ease: 'power2.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 90%' },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative mt-24 lg:mt-32">
      {/* ---------------- Header ---------------- */}
      <div ref={headRef} className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-4xl font-semibold leading-[1.12] tracking-[-0.01em] text-[#F8FAFC] sm:text-5xl lg:text-[3.25rem]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#E879F9] to-[#F9A8D4]">
            Oncology Disease Areas
          </span>
        </h2>

        {/* Editorial rule, echoing the one the other chapters carry */}
        <span
          className="mx-auto mt-8 block h-px w-40 rounded-full bg-gradient-to-r from-transparent via-[#A855F7] to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* ---------------- The three modules ---------------- */}
      <div ref={gridRef} className="relative mt-14 lg:mt-16">
        {/* ---- The ground the three modules sit on ----
            A dark field lifted by one purple and one pink radial, with a
            faint molecular lattice across it. Decoration only: it sits
            behind the grid and never touches the type. */}
        <div
          className="oda-field pointer-events-none absolute -inset-x-6 -inset-y-10 -z-10 overflow-hidden sm:-inset-x-10"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(46% 40% at 14% 10%, rgba(124,58,237,0.22) 0%, rgba(124,58,237,0) 70%), radial-gradient(48% 42% at 88% 90%, rgba(236,72,153,0.18) 0%, rgba(236,72,153,0) 70%), radial-gradient(60% 46% at 50% 50%, rgba(30,58,138,0.28) 0%, rgba(11,16,32,0) 76%)',
            }}
          />

          <svg
            className="absolute inset-0 h-full w-full"
            style={{
              maskImage: 'radial-gradient(72% 64% at 50% 50%, #000 0%, transparent 84%)',
              WebkitMaskImage: 'radial-gradient(72% 64% at 50% 50%, #000 0%, transparent 84%)',
            }}
          >
            <defs>
              <pattern id="oda-molecule" width="180" height="156" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="rgba(167,139,250,0.22)" strokeWidth="1" strokeLinecap="round">
                  <path d="M90 12 L156 50 L156 126 L90 164 L24 126 L24 50 Z" />
                  <path d="M90 12 L90 88 M90 88 L156 126 M90 88 L24 126" />
                </g>
                <g fill="rgba(192,132,252,0.38)">
                  <circle cx="90" cy="12" r="2.4" />
                  <circle cx="156" cy="50" r="2" />
                  <circle cx="24" cy="50" r="2" />
                  <circle cx="90" cy="88" r="2.8" />
                </g>
                <g fill="rgba(244,114,182,0.34)">
                  <circle cx="156" cy="126" r="2" />
                  <circle cx="24" cy="126" r="2" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#oda-molecule)" />
          </svg>
        </div>

        {/* Three across in one row from `lg`; two on a tablet with the
            third taking the full width beneath them, rather than sitting
            beside a gap; one to a row on a phone. `items-stretch` plus
            `h-full` on each shell keeps the row's cards to a shared
            height, and the cards grow to their content on a phone. */}
        <ol className="relative grid grid-cols-1 items-stretch gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {MODULES.map((module, i) => (
            <ModuleCard key={module.title} {...module} wide={i === 2} />
          ))}
        </ol>
      </div>
    </div>
  );
}
