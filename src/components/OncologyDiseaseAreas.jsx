import React, { useEffect, useRef } from 'react';
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
    eyebrow: 'RUO QUANT',
    title: 'OM BREAST',
    features: [
      'Tumour and compartment segmentation',
      'ER/PR quantification and H-score',
      'Ki-67 global and hotspot analysis',
      'HER2 scoring assistance',
      'CD3/CD8 spatial density',
    ],
    purposeLabel: 'Commercial Purpose',
    purpose: 'Validate the platform, reporting and multi-stain workflow.',
    highlight: 'Ship second',
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

function ModuleCard({
  eyebrow,
  title,
  features,
  purposeLabel,
  purpose,
  highlight,
  from,
  to,
  wide,
}) {
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
          </h3>

          <Rule to={to} />

          {/* 3 — what it does */}
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
          </div>
        </div>
      </div>
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
