import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Boxes,
  Combine,
  Layers,
  Microscope,
  Network,
  ScrollText,
  Sparkles,
  Target,
  Telescope,
  TrendingUp,
  Waypoints,
  Workflow,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   Shared pieces — lifted verbatim from the sibling chapter pages so
   this one inherits their exact metrics rather than approximating.
================================================================ */

function Eyebrow({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50/60 px-3.5 py-1.5 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#7C3AED] ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899]" />
      {children}
    </span>
  );
}

function PrimaryButton({ children, className = '' }) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <span
        className="btn-glow pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] blur-[16px]"
        aria-hidden="true"
      />
      <button
        type="button"
        className="btn-primary relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-7 py-3.5 font-sans text-[15px] font-semibold tracking-[0.01em] text-white shadow-[0_8px_26px_rgba(124,58,237,0.34)] outline-none ring-1 ring-inset ring-white/25 sm:w-auto"
      >
        {children}
        <ArrowRight className="btn-arrow h-4 w-4" strokeWidth={2.25} />
      </button>
    </span>
  );
}

function SecondaryButton({ children, className = '' }) {
  return (
    <button
      type="button"
      className={`btn-secondary inline-flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-7 py-3.5 font-sans text-[15px] font-semibold tracking-[0.01em] text-[#111827] outline-none transition-colors duration-300 hover:border-purple-300 hover:text-[#7C3AED] sm:w-auto ${className}`}
    >
      {children}
    </button>
  );
}

/* The section's own label, hung on a dotted rule that runs the full
   measure — the divider the other chapters use to open a grid. */
function DottedLabel({ children }) {
  return (
    <div className="flex items-center gap-5" data-reveal>
      <span
        className="hidden h-px flex-1 sm:block"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, rgba(124,58,237,0.32) 0 4px, transparent 4px 10px)',
        }}
        aria-hidden="true"
      />
      <Eyebrow className="shrink-0">{children}</Eyebrow>
      <span
        className="hidden h-px flex-1 sm:block"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, rgba(124,58,237,0.32) 0 4px, transparent 4px 10px)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}

/* The soft violet/pink lighting the chapter pages wash their sections with */
function Lighting({ variant = 'a' }) {
  const images = {
    a: 'radial-gradient(52% 58% at 84% 12%, rgba(124,58,237,0.10) 0%, rgba(255,255,255,0) 70%), radial-gradient(46% 52% at 8% 78%, rgba(236,72,153,0.08) 0%, rgba(255,255,255,0) 72%)',
    b: 'radial-gradient(50% 55% at 12% 14%, rgba(168,85,247,0.09) 0%, rgba(255,255,255,0) 70%), radial-gradient(44% 50% at 90% 84%, rgba(236,72,153,0.07) 0%, rgba(255,255,255,0) 72%)',
    c: 'radial-gradient(50% 55% at 50% 0%, rgba(59,130,246,0.09) 0%, rgba(255,255,255,0) 70%), radial-gradient(44% 50% at 88% 88%, rgba(168,85,247,0.08) 0%, rgba(255,255,255,0) 72%)',
  };
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ backgroundImage: images[variant] }}
      aria-hidden="true"
    />
  );
}

/* A number that counts up once, the first time it is scrolled into view.
   Every value it is given is a count of what is actually described on this
   page — stages in the workflow, parameters in the list above it — never a
   measurement or a result. */
function Counter({ to, suffix = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = `${to}${suffix}`;
      return undefined;
    }

    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: to,
      duration: 1.3,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = `${Math.round(obj.v)}${suffix}`;
      },
      scrollTrigger: { trigger: el, start: 'top 94%', once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [to, suffix]);

  return <span ref={ref}>{`0${suffix}`}</span>;
}

/* ================================================================
   Content
================================================================ */

/* The eight parameters named in the platform specification. They are
   what the system measures, not what any one slide returns. */
const PARAMETERS = [
  { label: 'Tumor percentage', icon: Layers },
  { label: 'Biomarker-positive cell percentage', icon: Target },
  { label: 'Staining intensity', icon: Activity },
  { label: 'H-score-related features', icon: ScrollText },
  { label: 'Proliferation index', icon: TrendingUp },
  { label: 'Membrane staining characteristics', icon: Combine },
  { label: 'Immune-cell density', icon: Network },
  { label: 'Compartment-specific biomarker expression', icon: Boxes },
];

/* H&E → Segmentation → Cell Detection → Biomarker Quantification →
   Structured Data. One accent per stage, walking the purple→pink→blue
   ramp the rest of the site uses. */
const PIPELINE = [
  {
    key: 'he',
    step: '01',
    name: 'H&E',
    icon: Microscope,
    body: 'Whole-slide H&E and immunohistochemistry images enter the platform at full resolution.',
    a: '124, 58, 237',
    b: '168, 85, 247',
  },
  {
    key: 'segmentation',
    step: '02',
    name: 'Segmentation',
    icon: Layers,
    body: 'Tissue segmentation separates tumor from stroma and the remaining tissue compartments.',
    a: '168, 85, 247',
    b: '217, 70, 239',
  },
  {
    key: 'detection',
    step: '03',
    name: 'Cell Detection',
    icon: Waypoints,
    body: 'Individual cells are detected and classified across each segmented compartment.',
    a: '236, 72, 153',
    b: '217, 70, 239',
  },
  {
    key: 'quantification',
    step: '04',
    name: 'Biomarker Quantification',
    icon: Target,
    body: 'Biomarker-specific image analysis converts those detections into measured parameters.',
    a: '99, 102, 241',
    b: '124, 58, 237',
  },
  {
    key: 'structured',
    step: '05',
    name: 'Structured Data',
    icon: Boxes,
    body: 'Every measurement leaves as a reproducible, machine-readable record ready for analysis.',
    a: '59, 130, 246',
    b: '96, 165, 250',
  },
];

/* The three cancer areas, in the order their sections appear. The rail
   above them scrolls to each rather than hiding the other two. */
const AREAS = [
  { id: 'breast-cancer', label: 'Breast Cancer', a: '236, 72, 153', b: '168, 85, 247' },
  { id: 'nsclc', label: 'NSCLC', a: '59, 130, 246', b: '124, 58, 237' },
  { id: 'colorectal-cancer', label: 'Colorectal Cancer', a: '124, 58, 237', b: '59, 130, 246' },
];

/* Each card names its biomarker and, on hover or tap, the measurements the
   platform derives for it. Every reveal below is drawn from the platform
   specification's own wording — measurement types, never results. */
const BREAST = [
  {
    key: 'er',
    name: 'ER',
    full: 'Estrogen Receptor',
    a: '124, 58, 237',
    b: '168, 85, 247',
    reveals: [
      'Positive tumor-cell percentage',
      'Intensity distribution',
      'Research scoring metrics',
    ],
  },
  {
    key: 'pr',
    name: 'PR',
    full: 'Progesterone Receptor',
    a: '168, 85, 247',
    b: '217, 70, 239',
    reveals: [
      'Positive tumor-cell percentage',
      'Intensity distribution',
      'Research scoring metrics',
    ],
  },
  {
    key: 'her2',
    name: 'HER2',
    full: 'Membrane staining analysis',
    a: '236, 72, 153',
    b: '217, 70, 239',
    reveals: ['Membrane staining intensity', 'Membrane staining completeness'],
  },
  {
    key: 'ki67',
    name: 'Ki-67',
    full: 'Proliferation analysis',
    a: '59, 130, 246',
    b: '99, 102, 241',
    reveals: ['Global proliferation quantification', 'Regional hotspot analysis'],
  },
];

/* NSCLC — what the platform reads from the slide, and what the current
   lung architecture specifically includes. */
const NSCLC_READOUTS = [
  {
    key: 'he-seg',
    name: 'H&E tumor segmentation',
    full: 'Morphology',
    a: '99, 102, 241',
    b: '124, 58, 237',
    reveals: ['Tumor and non-tumor compartments', 'Whole-slide coverage'],
  },
  {
    key: 'tumor-pct',
    name: 'Tumor percentage',
    full: 'Estimation',
    a: '124, 58, 237',
    b: '168, 85, 247',
    reveals: ['Segmentation-derived estimate', 'Reported per slide region'],
  },
  {
    key: 'pdl1',
    name: 'PD-L1',
    full: 'Quantitative analysis',
    a: '59, 130, 246',
    b: '96, 165, 250',
    reveals: ['Quantitative expression analysis', 'Assay-specific scoring support'],
  },
  {
    key: 'cd8',
    name: 'CD8 density',
    full: 'Immune-cell measurement',
    a: '236, 72, 153',
    b: '168, 85, 247',
    reveals: ['Immune-cell density', 'Compartment-resolved measurement'],
  },
];

const NSCLC_ARCHITECTURE = [
  {
    step: '01',
    name: 'Histologic subtyping assistance',
    body: 'Morphological analysis supports subtype characterization directly from the H&E slide.',
    icon: Microscope,
    a: '124, 58, 237',
    b: '168, 85, 247',
  },
  {
    step: '02',
    name: 'Assay-specific PD-L1 scoring',
    body: 'PD-L1 quantification is handled per assay rather than through one generic readout.',
    icon: ScrollText,
    a: '59, 130, 246',
    b: '124, 58, 237',
  },
  {
    step: '03',
    name: 'Immune exclusion analysis',
    body: 'Immune-cell distribution is measured across tumor and surrounding compartments.',
    icon: Network,
    a: '236, 72, 153',
    b: '99, 102, 241',
  },
];

/* Colorectal — the four mismatch-repair proteins, the two immune markers,
   and tumor budding. */
const COLORECTAL = [
  {
    key: 'mlh1',
    name: 'MLH1',
    full: 'Structured assessment',
    a: '124, 58, 237',
    b: '168, 85, 247',
    reveals: ['Structured staining assessment', 'Tumor-compartment readout'],
  },
  {
    key: 'pms2',
    name: 'PMS2',
    full: 'Structured assessment',
    a: '139, 92, 246',
    b: '192, 132, 252',
    reveals: ['Structured staining assessment', 'Tumor-compartment readout'],
  },
  {
    key: 'msh2',
    name: 'MSH2',
    full: 'Structured assessment',
    a: '168, 85, 247',
    b: '217, 70, 239',
    reveals: ['Structured staining assessment', 'Tumor-compartment readout'],
  },
  {
    key: 'msh6',
    name: 'MSH6',
    full: 'Structured assessment',
    a: '217, 70, 239',
    b: '236, 72, 153',
    reveals: ['Structured staining assessment', 'Tumor-compartment readout'],
  },
  {
    key: 'cd3',
    name: 'CD3',
    full: 'Immune-cell measurement',
    a: '236, 72, 153',
    b: '168, 85, 247',
    reveals: ['Immune-cell density', 'Measured across tumor compartments'],
  },
  {
    key: 'cd8',
    name: 'CD8',
    full: 'Immune-cell measurement',
    a: '99, 102, 241',
    b: '168, 85, 247',
    reveals: ['Immune-cell density', 'Measured across tumor compartments'],
  },
  {
    key: 'budding',
    name: 'Tumor Budding',
    full: 'Morphological quantification',
    a: '59, 130, 246',
    b: '96, 165, 250',
    reveals: ['Bud detection and quantification', 'Reproducible structured counts'],
  },
];

/* What the resulting measurements are used for */
const FOUNDATION = [
  {
    name: 'Cohort characterization',
    body: 'Describe a whole cohort on the same measured parameters rather than on mixed manual reads.',
    icon: Boxes,
    a: '124, 58, 237',
    b: '168, 85, 247',
  },
  {
    name: 'Translational research',
    body: 'Carry tissue measurements into translational programmes as structured, comparable variables.',
    icon: Telescope,
    a: '168, 85, 247',
    b: '217, 70, 239',
  },
  {
    name: 'Biomarker validation',
    body: 'Test and validate candidate biomarkers against reproducible quantitative readouts.',
    icon: BadgeCheck,
    a: '236, 72, 153',
    b: '217, 70, 239',
  },
  {
    name: 'Spatial analysis',
    body: 'Retain where each measurement came from, so compartment and neighbourhood analysis stays possible.',
    icon: Waypoints,
    a: '99, 102, 241',
    b: '124, 58, 237',
  },
  {
    name: 'Advanced AI-driven insight',
    body: 'Feed downstream models the structured tissue features they need to learn from.',
    icon: Sparkles,
    a: '59, 130, 246',
    b: '96, 165, 250',
  },
];

/* ================================================================
   A biomarker card. It reveals its measurement list on hover, on focus
   and on tap — the tap path matters, because hover alone would hide the
   detail entirely on a phone.
================================================================ */
function BiomarkerCard({ item, open, onOpen, onClose, onToggle }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={onClose}
      onClick={onToggle}
      data-reveal
      className="bq-card group relative flex h-full flex-col rounded-[22px] border bg-white/70 p-6 text-left backdrop-blur-sm outline-none transition-all duration-[380ms] ease-out hover:-translate-y-1.5 focus-visible:-translate-y-1.5"
      style={{ '--a': item.a, '--b': item.b }}
    >
      {/* Corner glow, this card's own two accents */}
      <span className="bq-card-glow pointer-events-none absolute inset-0 rounded-[22px]" aria-hidden="true" />

      <span
        className="relative flex h-11 w-11 items-center justify-center rounded-[14px] text-white shadow-[0_10px_22px_-12px_rgba(124,58,237,0.9)]"
        style={{
          backgroundImage: `linear-gradient(140deg, rgb(${item.a}), rgb(${item.b}))`,
        }}
        aria-hidden="true"
      >
        <Target className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </span>

      <h4 className="relative mt-5 font-sans text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-[#111827]">
        {item.name}
      </h4>
      <p className="relative mt-1.5 font-sans text-[12.5px] font-medium leading-[1.5] text-gray-500">
        {item.full}
      </p>

      {/* The reveal. A 0fr → 1fr grid row, so it opens to its own height
          without a measured max-height and without a layout jump. */}
      <span
        className={`relative mt-4 grid transition-[grid-template-rows,opacity] duration-[420ms] ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <span className="overflow-hidden">
          <span
            className="block h-px w-full"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(${item.a}, 0.45), rgba(${item.b}, 0.25), rgba(255,255,255,0))`,
            }}
          />
          <span className="mt-3.5 block font-sans text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#7C3AED]">
            Measures
          </span>
          <span className="mt-2.5 block space-y-2">
            {item.reveals.map((r) => (
              <span key={r} className="flex items-start gap-2.5">
                <span
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    backgroundImage: `linear-gradient(90deg, rgb(${item.a}), rgb(${item.b}))`,
                  }}
                />
                <span className="font-sans text-[13px] font-normal leading-[1.55] text-gray-600">
                  {r}
                </span>
              </span>
            ))}
          </span>
        </span>
      </span>

      {/* The affordance, shown only while the card is closed */}
      <span
        className={`relative mt-auto pt-5 font-sans text-[12px] font-semibold tracking-[0.01em] text-[#7C3AED] transition-opacity duration-300 ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      >
        Hover to see measurements
      </span>
    </button>
  );
}

/* ================================================================ */

export default function BiomarkerQuantification() {
  const rootRef = useRef(null);
  const lenisRef = useRef(null);

  const [openCard, setOpenCard] = useState(null);
  const [stage, setStage] = useState(0);
  const [area, setArea] = useState(AREAS[0].id);

  /* ---- Smooth scroll (same configuration the rest of the site uses) ---- */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* ---- This page is white; the global shell is near-black ---- */
  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const prev = {
      colorScheme: html.style.colorScheme,
      htmlBg: html.style.backgroundColor,
      bodyBg: body.style.backgroundColor,
      bodyColor: body.style.color,
    };

    html.style.colorScheme = 'light';
    html.style.backgroundColor = '#FFFFFF';
    body.style.backgroundColor = '#FFFFFF';
    body.style.color = '#111827';

    return () => {
      html.style.colorScheme = prev.colorScheme;
      html.style.backgroundColor = prev.htmlBg;
      body.style.backgroundColor = prev.bodyBg;
      body.style.color = prev.bodyColor;
    };
  }, []);

  /* ---- Hero entrance, scroll reveals, and the rail's active area ---- */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set('[data-reveal], .bq-hero-copy > *, .bq-stage', { autoAlpha: 1, y: 0, scale: 1 });
      } else {
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro
          .from('.bq-hero-copy > *', { autoAlpha: 0, y: 26, duration: 0.9, stagger: 0.1 }, 0.15)
          .from('.bq-stage', { autoAlpha: 0, y: 30, scale: 0.96, duration: 1.05 }, 0.35);

        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 34,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          });
        });
      }

      /* The rail follows the reader rather than only the reader's clicks */
      AREAS.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (self.isActive) setArea(id);
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  /* Jump to an area through Lenis, so the rail and the smooth scroller
     never fight each other over the same scroll position. */
  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setArea(id);
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -96 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const active = PIPELINE[stage];

  return (
    <>
      <Navbar />

      {/* The accent system for this page. Every rule reads the `--a` / `--b`
          pair the element sets on itself, so one rule set tints every card
          on the page with its own colours. */}
      <style>{`
        .bq-card {
          border-color: rgba(var(--a), 0.16);
          box-shadow:
            0 10px 30px -22px rgba(15, 23, 42, 0.35),
            0 0 0 0 rgba(var(--a), 0);
        }
        .bq-card:hover,
        .bq-card:focus-visible {
          border-color: rgba(var(--a), 0.42);
          box-shadow:
            0 22px 46px -26px rgba(15, 23, 42, 0.42),
            0 0 26px -6px rgba(var(--a), 0.30),
            0 0 44px -12px rgba(var(--b), 0.26);
        }
        .bq-card-glow {
          background-image:
            radial-gradient(60% 48% at 100% 0%, rgba(var(--a), 0.10) 0%, rgba(255, 255, 255, 0) 72%),
            radial-gradient(56% 46% at 0% 100%, rgba(var(--b), 0.09) 0%, rgba(255, 255, 255, 0) 74%);
          opacity: 0;
          transition: opacity 380ms ease-out;
        }
        .bq-card:hover .bq-card-glow,
        .bq-card:focus-visible .bq-card-glow {
          opacity: 1;
        }
      `}</style>

      <main ref={rootRef} className="relative w-full bg-white text-[#111827]">
        {/* ============================================================
            1 — HERO
        ============================================================ */}
        <section className="relative overflow-hidden bg-white">
          <Lighting variant="a" />

          {/* A faint measurement lattice, so the hero reads as instrumented
              rather than as a plain white page. */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(124,58,237,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.055) 1px, transparent 1px)',
              backgroundSize: '58px 58px',
              maskImage: 'radial-gradient(78% 70% at 50% 34%, #000 0%, transparent 82%)',
              WebkitMaskImage: 'radial-gradient(78% 70% at 50% 34%, #000 0%, transparent 82%)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-20 pt-[122px] lg:px-10 lg:pb-28 lg:pt-[168px]">
            <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
              {/* ---- Copy ---- */}
              <div className="bq-hero-copy w-full min-w-0 max-w-2xl lg:max-w-none">
                <Eyebrow>Platform · Biomarker Quant™</Eyebrow>

                <h1 className="mt-7 font-serif text-[2.4rem] font-semibold leading-[1.07] tracking-[-0.015em] text-[#111827] sm:text-[3rem] lg:text-[3.3rem]">
                  AI-Powered Tissue and
                  <span className="mt-2 block italic text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]">
                    IHC Biomarker Quantification
                  </span>
                </h1>

                <p className="mt-7 max-w-xl font-sans text-base font-normal leading-[1.7] tracking-[-0.005em] text-gray-600 [text-wrap:pretty] sm:text-lg">
                  <span className="font-semibold text-[#111827]">Biomarker Quant™</span> converts
                  H&amp;E and immunohistochemistry whole-slide images into structured, reproducible
                  and machine-readable biomarker measurements.
                </p>

                <p className="mt-5 max-w-xl font-sans text-[15px] font-normal leading-[1.7] text-gray-600 [text-wrap:pretty]">
                  The platform combines tissue segmentation, tumor identification, cell detection
                  and biomarker-specific image analysis to quantify clinically and biologically
                  relevant features directly from digital pathology slides.
                </p>

                <div className="mt-11 flex flex-wrap items-center gap-4">
                  <PrimaryButton>Schedule a Demo</PrimaryButton>
                  <SecondaryButton>Talk to an Expert</SecondaryButton>
                </div>
              </div>

              {/* ---- Stage: the shape of the record that leaves the platform ---- */}
              <div className="bq-stage relative mx-auto w-full max-w-[32rem] lg:max-w-none">
                <div
                  className="relative overflow-hidden rounded-[26px] p-7 shadow-[0_30px_80px_-40px_rgba(49,10,101,0.75)] sm:p-8"
                  style={{
                    backgroundImage:
                      'linear-gradient(150deg, #1B1036 0%, #150F2E 46%, #101A38 100%)',
                  }}
                >
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage:
                        'radial-gradient(56% 44% at 88% 4%, rgba(168,85,247,0.28) 0%, rgba(0,0,0,0) 70%), radial-gradient(50% 40% at 4% 96%, rgba(236,72,153,0.20) 0%, rgba(0,0,0,0) 72%)',
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="pointer-events-none absolute inset-0 rounded-[26px]"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)' }}
                    aria-hidden="true"
                  />

                  <div className="relative flex items-center justify-between gap-4">
                    <span className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/60">
                      Structured output
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-2.5 py-1 font-sans text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899]" />
                      Research use
                    </span>
                  </div>

                  <p className="relative mt-5 font-sans text-[13px] font-normal leading-[1.6] text-white/70 [text-wrap:pretty]">
                    Rather than relying only on broad visual categories, Biomarker Quant™ can
                    measure parameters such as:
                  </p>

                  <ul className="relative mt-5 space-y-2.5">
                    {PARAMETERS.map(({ label, icon: Icon }) => (
                      <li
                        key={label}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.05] px-3.5 py-2.5"
                      >
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white"
                          aria-hidden="true"
                        >
                          <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
                        </span>
                        <span className="font-sans text-[13px] font-medium leading-snug text-white/90">
                          {label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            2 — THE PIPELINE
        ============================================================ */}
        <section className="relative overflow-hidden bg-white pb-24 pt-4 lg:pb-32 lg:pt-8">
          <Lighting variant="b" />

          <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
            <DottedLabel>From slide to structured data</DottedLabel>

            <h2
              data-reveal
              className="mx-auto mt-10 max-w-3xl text-center font-serif text-[2rem] font-semibold leading-[1.14] tracking-[-0.012em] text-[#111827] sm:text-[2.5rem]"
            >
              One measured path, end to end
            </h2>
            <p
              data-reveal
              className="mx-auto mt-5 max-w-2xl text-center font-sans text-[15px] font-normal leading-[1.7] text-gray-600 [text-wrap:pretty]"
            >
              Select a stage to see what it contributes. Each one hands its result to the next, so
              every number that leaves the platform can be traced back to the pixels it came from.
            </p>

            {/* The five stages */}
            <ol
              data-reveal
              className="mt-12 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:mt-14 lg:grid-cols-5 lg:gap-2.5"
            >
              {PIPELINE.map((s, i) => {
                const Icon = s.icon;
                const isActive = i === stage;
                const isPast = i < stage;
                return (
                  <li key={s.key} className="relative">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onMouseEnter={() => setStage(i)}
                      onFocus={() => setStage(i)}
                      onClick={() => setStage(i)}
                      className="group relative flex w-full flex-col items-start gap-3 rounded-[20px] border p-5 text-left outline-none transition-all duration-[380ms] ease-out"
                      style={{
                        borderColor: isActive
                          ? `rgba(${s.a}, 0.45)`
                          : isPast
                            ? `rgba(${s.a}, 0.24)`
                            : 'rgba(226, 232, 240, 0.9)',
                        backgroundImage: isActive
                          ? `linear-gradient(150deg, rgba(${s.a}, 0.10), rgba(${s.b}, 0.06))`
                          : 'none',
                        backgroundColor: isActive ? 'transparent' : '#FFFFFF',
                        boxShadow: isActive
                          ? `0 18px 40px -26px rgba(15,23,42,0.42), 0 0 26px -8px rgba(${s.a}, 0.38)`
                          : '0 10px 30px -26px rgba(15,23,42,0.32)',
                      }}
                    >
                      <span className="flex w-full items-center justify-between gap-3">
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-transform duration-[380ms] ease-out group-hover:scale-105"
                          style={{
                            backgroundImage: `linear-gradient(140deg, rgb(${s.a}), rgb(${s.b}))`,
                            boxShadow: `0 10px 22px -12px rgba(${s.a}, 0.95)`,
                          }}
                          aria-hidden="true"
                        >
                          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                        </span>
                        <span
                          className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em]"
                          style={{ color: `rgb(${s.a})` }}
                        >
                          {s.step}
                        </span>
                      </span>

                      <span className="font-sans text-[14.5px] font-semibold leading-snug tracking-[-0.005em] text-[#111827]">
                        {s.name}
                      </span>

                      {/* The progress rule: filled up to the selected stage */}
                      <span className="mt-1 block h-[3px] w-full overflow-hidden rounded-full bg-slate-100">
                        <span
                          className="block h-full rounded-full transition-all duration-[520ms] ease-out"
                          style={{
                            width: i <= stage ? '100%' : '0%',
                            backgroundImage: `linear-gradient(90deg, rgb(${s.a}), rgb(${s.b}))`,
                          }}
                        />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* What the selected stage does */}
            <div
              data-reveal
              className="relative mt-6 overflow-hidden rounded-[22px] border p-6 sm:p-7"
              style={{
                borderColor: `rgba(${active.a}, 0.24)`,
                backgroundImage: `linear-gradient(150deg, rgba(${active.a}, 0.07), rgba(${active.b}, 0.04))`,
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <span
                  className="inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
                  style={{
                    backgroundImage: `linear-gradient(90deg, rgb(${active.a}), rgb(${active.b}))`,
                  }}
                >
                  {active.step} · {active.name}
                </span>
                <p
                  key={active.key}
                  className="font-sans text-[15px] font-normal leading-[1.65] text-gray-700 [text-wrap:pretty]"
                >
                  {active.body}
                </p>
              </div>
            </div>

            {/* Counts of what this page describes — never a measurement */}
            <dl
              data-reveal
              className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 rounded-[22px] border border-purple-100 bg-[#FBFAFF] px-7 py-8 sm:grid-cols-4 sm:px-9"
            >
              {[
                { n: 5, s: '', label: 'Stages from slide to structured record' },
                { n: 8, s: '', label: 'Quantitative parameters measured' },
                { n: 3, s: '', label: 'Cancer areas covered below' },
                { n: 2, s: '', label: 'Stain types: H&E and IHC' },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="font-serif text-[2.1rem] font-semibold leading-none tracking-[-0.015em] text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] sm:text-[2.4rem]">
                    <Counter to={item.n} suffix={item.s} />
                  </dt>
                  <dd className="mt-2.5 font-sans text-[12.5px] font-medium leading-[1.5] text-gray-600">
                    {item.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ============================================================
            3 — THE AREA RAIL
        ============================================================ */}
        <section className="relative bg-white pb-12">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div
              data-reveal
              className="sticky top-[92px] z-30 mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-2 rounded-full border border-purple-100 bg-white/85 p-1.5 shadow-[0_14px_36px_-26px_rgba(15,23,42,0.5)] backdrop-blur-xl"
            >
              {AREAS.map((a) => {
                const isActive = a.id === area;
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => jumpTo(a.id)}
                    className="relative inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 font-sans text-[13px] font-semibold tracking-[0.005em] outline-none transition-all duration-300 sm:flex-none sm:px-6"
                    style={{
                      color: isActive ? '#FFFFFF' : '#475569',
                      backgroundImage: isActive
                        ? `linear-gradient(90deg, rgb(${a.a}), rgb(${a.b}))`
                        : 'none',
                      boxShadow: isActive
                        ? `0 10px 24px -14px rgba(${a.a}, 0.95)`
                        : 'none',
                    }}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            4 — BREAST CANCER
        ============================================================ */}
        <section
          id="breast-cancer"
          className="relative scroll-mt-28 overflow-hidden bg-white pb-24 pt-10 lg:pb-32"
        >
          <Lighting variant="a" />

          <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
            <DottedLabel>Cancer area 01</DottedLabel>

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              <div>
                <h2
                  data-reveal
                  className="font-serif text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.012em] text-[#111827] sm:text-[2.6rem]"
                >
                  Breast{' '}
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] via-[#D946EF] to-[#A855F7]">
                    Cancer
                  </span>
                </h2>
                <p
                  data-reveal
                  className="mt-6 font-sans text-[15px] font-normal leading-[1.7] text-gray-600 [text-wrap:pretty]"
                >
                  In Breast Cancer, the platform can analyze{' '}
                  <span className="font-semibold text-[#111827]">ER, PR, HER2 and Ki-67</span>.
                </p>
                <p
                  data-reveal
                  className="mt-4 font-sans text-[15px] font-normal leading-[1.7] text-gray-600 [text-wrap:pretty]"
                >
                  ER and PR can be characterized by positive tumor-cell percentage, intensity
                  distribution and research scoring metrics. HER2 analysis can evaluate membrane
                  staining intensity and completeness, while Ki-67 analysis can quantify global
                  proliferation and regional hotspots.
                </p>
                <p
                  data-reveal
                  className="mt-4 font-sans text-[15px] font-normal leading-[1.7] text-gray-600 [text-wrap:pretty]"
                >
                  These quantitative breast capabilities are already included in the OmicMind
                  platform specification.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {BREAST.map((item) => (
                  <BiomarkerCard
                    key={item.key}
                    item={item}
                    open={openCard === `breast-${item.key}`}
                    onOpen={() => setOpenCard(`breast-${item.key}`)}
                    onClose={() => setOpenCard((c) => (c === `breast-${item.key}` ? null : c))}
                    onToggle={() =>
                      setOpenCard((c) => (c === `breast-${item.key}` ? null : `breast-${item.key}`))
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            5 — NSCLC
        ============================================================ */}
        <section
          id="nsclc"
          className="relative scroll-mt-28 overflow-hidden bg-[#FBFAFF] pb-24 pt-20 lg:pb-32 lg:pt-24"
        >
          <Lighting variant="c" />

          <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
            <DottedLabel>Cancer area 02</DottedLabel>

            <div className="mt-10 max-w-3xl">
              <h2
                data-reveal
                className="font-serif text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.012em] text-[#111827] sm:text-[2.6rem]"
              >
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#7C3AED]">
                  NSCLC
                </span>
              </h2>
              <p
                data-reveal
                className="mt-6 font-sans text-[15px] font-normal leading-[1.7] text-gray-600 [text-wrap:pretty]"
              >
                In NSCLC, Biomarker Quant™ can support H&amp;E-based tumor segmentation, tumor
                percentage estimation and quantitative analysis of{' '}
                <span className="font-semibold text-[#111827]">PD-L1</span>, together with
                immune-cell measurements such as{' '}
                <span className="font-semibold text-[#111827]">CD8 density</span>.
              </p>
            </div>

            {/* What the platform reads */}
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {NSCLC_READOUTS.map((item) => (
                <BiomarkerCard
                  key={item.key}
                  item={item}
                  open={openCard === `nsclc-${item.key}`}
                  onOpen={() => setOpenCard(`nsclc-${item.key}`)}
                  onClose={() => setOpenCard((c) => (c === `nsclc-${item.key}` ? null : c))}
                  onToggle={() =>
                    setOpenCard((c) => (c === `nsclc-${item.key}` ? null : `nsclc-${item.key}`))
                  }
                />
              ))}
            </div>

            {/* The lung architecture, as a three-step visual chain */}
            <p
              data-reveal
              className="mt-16 font-sans text-[15px] font-normal leading-[1.7] text-gray-600"
            >
              The current lung architecture specifically includes:
            </p>

            <ol
              data-reveal
              className="relative mt-8 grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-3 lg:gap-8"
            >
              {NSCLC_ARCHITECTURE.map((c, i) => {
                const Icon = c.icon;
                return (
                  <li key={c.name} className="group relative">
                    {/* The rail into the next capability */}
                    {i < NSCLC_ARCHITECTURE.length - 1 && (
                      <span
                        className="pointer-events-none absolute left-full top-1/2 hidden h-px w-8 -translate-y-1/2 lg:block"
                        style={{
                          backgroundImage: `linear-gradient(90deg, rgba(${c.a}, 0.7), rgba(${NSCLC_ARCHITECTURE[i + 1].a}, 0.35))`,
                        }}
                        aria-hidden="true"
                      />
                    )}

                    <div
                      className="bq-card relative flex h-full flex-col rounded-[22px] border bg-white/70 p-6 backdrop-blur-sm transition-all duration-[380ms] ease-out hover:-translate-y-1.5"
                      style={{ '--a': c.a, '--b': c.b }}
                    >
                      <span
                        className="bq-card-glow pointer-events-none absolute inset-0 rounded-[22px]"
                        aria-hidden="true"
                      />

                      <span className="relative flex items-center justify-between gap-3">
                        <span
                          className="flex h-11 w-11 items-center justify-center rounded-[14px] text-white"
                          style={{
                            backgroundImage: `linear-gradient(140deg, rgb(${c.a}), rgb(${c.b}))`,
                            boxShadow: `0 10px 22px -12px rgba(${c.a}, 0.95)`,
                          }}
                          aria-hidden="true"
                        >
                          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                        </span>
                        <span
                          className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em]"
                          style={{ color: `rgb(${c.a})` }}
                        >
                          {c.step}
                        </span>
                      </span>

                      <h3 className="relative mt-5 font-sans text-[15.5px] font-semibold leading-snug tracking-[-0.005em] text-[#111827]">
                        {c.name}
                      </h3>
                      <p className="relative mt-2.5 font-sans text-[13.5px] font-normal leading-[1.6] text-gray-600 [text-wrap:pretty]">
                        {c.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ============================================================
            6 — COLORECTAL CANCER
        ============================================================ */}
        <section
          id="colorectal-cancer"
          className="relative scroll-mt-28 overflow-hidden bg-white pb-24 pt-20 lg:pb-32 lg:pt-24"
        >
          <Lighting variant="b" />

          <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
            <DottedLabel>Cancer area 03</DottedLabel>

            <div className="mt-10 max-w-3xl">
              <h2
                data-reveal
                className="font-serif text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.012em] text-[#111827] sm:text-[2.6rem]"
              >
                Colorectal{' '}
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#3B82F6]">
                  Cancer
                </span>
              </h2>
              <p
                data-reveal
                className="mt-6 font-sans text-[15px] font-normal leading-[1.7] text-gray-600 [text-wrap:pretty]"
              >
                In Colorectal Cancer, the platform can support structured assessment of{' '}
                <span className="font-semibold text-[#111827]">MLH1, PMS2, MSH2 and MSH6</span>,
                together with tumor budding and{' '}
                <span className="font-semibold text-[#111827]">
                  CD3/CD8 immune-cell measurements
                </span>{' '}
                across tumor compartments.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {COLORECTAL.map((item) => (
                <BiomarkerCard
                  key={item.key}
                  item={item}
                  open={openCard === `crc-${item.key}`}
                  onOpen={() => setOpenCard(`crc-${item.key}`)}
                  onClose={() => setOpenCard((c) => (c === `crc-${item.key}` ? null : c))}
                  onToggle={() =>
                    setOpenCard((c) => (c === `crc-${item.key}` ? null : `crc-${item.key}`))
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            7 — THE QUANTITATIVE FOUNDATION
        ============================================================ */}
        <section className="relative bg-white pb-24 lg:pb-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div
              data-reveal
              className="relative overflow-hidden rounded-[28px] px-7 py-12 shadow-[0_30px_80px_-40px_rgba(49,10,101,0.75)] sm:px-10 lg:px-14 lg:py-16"
              style={{
                backgroundImage: 'linear-gradient(150deg, #1B1036 0%, #150F2E 46%, #101A38 100%)',
              }}
            >
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(50% 44% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(0,0,0,0) 70%), radial-gradient(46% 40% at 92% 94%, rgba(236,72,153,0.20) 0%, rgba(0,0,0,0) 72%), radial-gradient(44% 38% at 60% 50%, rgba(59,130,246,0.16) 0%, rgba(0,0,0,0) 74%)',
                }}
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute inset-0 rounded-[28px]"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.09)' }}
                aria-hidden="true"
              />

              <div className="relative max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899]" />
                  Platform foundation
                </span>

                <h2 className="mt-7 font-serif text-[2rem] font-semibold leading-[1.14] tracking-[-0.012em] text-white sm:text-[2.5rem]">
                  The Quantitative Foundation of{' '}
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#E879F9] to-[#93C5FD]">
                    OmicMind
                  </span>
                </h2>

                <p className="mt-6 font-sans text-[15px] font-normal leading-[1.75] text-white/75 [text-wrap:pretty] sm:text-base">
                  Biomarker Quant™ forms the quantitative foundation of Omic Mind. The resulting
                  tissue measurements can be used for cohort characterization, translational
                  research, biomarker validation, spatial analysis and development of more advanced
                  AI-driven biological insights.
                </p>
              </div>

              <ul className="relative mt-12 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-5">
                {FOUNDATION.map((f) => {
                  const Icon = f.icon;
                  return (
                    <li
                      key={f.name}
                      className="group relative flex h-full flex-col rounded-[20px] border border-white/[0.10] bg-white/[0.05] p-5 transition-all duration-[380ms] ease-out hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/[0.09]"
                      style={{
                        boxShadow: `inset 0 0 26px -14px rgba(${f.b}, 0.6)`,
                      }}
                    >
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-transform duration-[380ms] ease-out group-hover:scale-105"
                        style={{
                          backgroundImage: `linear-gradient(140deg, rgb(${f.a}), rgb(${f.b}))`,
                          boxShadow: `0 10px 22px -12px rgba(${f.a}, 0.95)`,
                        }}
                        aria-hidden="true"
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                      </span>
                      <h3 className="mt-4 font-sans text-[14px] font-semibold leading-snug tracking-[-0.005em] text-white">
                        {f.name}
                      </h3>
                      <p className="mt-2 font-sans text-[12.5px] font-normal leading-[1.6] text-white/65 [text-wrap:pretty]">
                        {f.body}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* ============================================================
            8 — CTA
        ============================================================ */}
        <section className="relative bg-white pb-24 lg:pb-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div
              data-reveal
              className="flex flex-col items-start gap-7 rounded-[28px] border border-purple-100 bg-[#F5F3FF] px-7 py-9 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-12"
            >
              <div className="flex items-start gap-4">
                <span
                  className="mt-0.5 flex h-11 w-11 shrink-0 rotate-45 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#7C3AED] to-[#EC4899] shadow-[0_10px_24px_-10px_rgba(124,58,237,0.9)]"
                  aria-hidden="true"
                >
                  <Workflow className="h-[18px] w-[18px] -rotate-45 text-white" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="font-serif text-2xl font-semibold leading-[1.2] tracking-[-0.01em] text-[#111827]">
                    See Biomarker Quant™ on your own slides
                  </p>
                  <p className="mt-2 max-w-xl font-sans text-[14.5px] font-normal leading-[1.6] text-gray-600 [text-wrap:pretty]">
                    Walk through the measurements the platform returns and how they feed the rest of
                    OmicMind.
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-wrap items-center gap-4 lg:w-auto lg:shrink-0">
                <SecondaryButton>Talk to an Expert</SecondaryButton>
                <PrimaryButton>Schedule a Demo</PrimaryButton>
              </div>
            </div>

            <p
              data-reveal
              className="mx-auto mt-10 max-w-3xl text-center font-sans text-[12.5px] font-normal leading-[1.6] text-gray-400"
            >
              Biomarker Quant™ is described here for research, quantitative analysis, biomarker
              measurement and translational applications.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
