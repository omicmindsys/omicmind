import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity,
  ArrowDown,
  BrainCircuit,
  Building2,
  ClipboardList,
  Crosshair,
  Dna,
  FlaskConical,
  Flame,
  Gauge,
  Layers,
  Microscope,
  Network,
  Percent,
  ScanSearch,
  Shapes,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

/* The near-black navy ground this page sits on (matches the Home Page) */
const PAGE_BG = '#050816';

/* ================================================================
   Shared pieces
================================================================ */

function Eyebrow({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899]" />
      {children}
    </span>
  );
}

function Lighting({ variant = 'a' }) {
  const images = {
    a: 'radial-gradient(52% 58% at 84% 10%, rgba(124,58,237,0.20) 0%, rgba(0,0,0,0) 70%), radial-gradient(46% 52% at 6% 80%, rgba(30,58,138,0.18) 0%, rgba(0,0,0,0) 72%)',
    b: 'radial-gradient(50% 55% at 10% 12%, rgba(236,72,153,0.12) 0%, rgba(0,0,0,0) 70%), radial-gradient(44% 50% at 92% 86%, rgba(59,130,246,0.14) 0%, rgba(0,0,0,0) 72%)',
  };
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ backgroundImage: images[variant] }}
      aria-hidden="true"
    />
  );
}

function GroupLabel({ children }) {
  return (
    <span className="block font-sans text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#C4B5FD]">
      {children}
    </span>
  );
}

function Tag({ children, a = '168, 85, 247' }) {
  return (
    <li className="inline-flex max-w-full items-start gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-3.5 py-1.5 font-sans text-[12.5px] font-medium leading-[1.45] text-white/85">
      <span
        className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: `rgb(${a})`, boxShadow: `0 0 8px rgba(${a}, 0.8)` }}
      />
      <span className="min-w-0 break-words">{children}</span>
    </li>
  );
}

function Hl({ children }) {
  return <span className="font-semibold text-white">{children}</span>;
}

/* A small glass tile used inside the asides — an optional group label above
   an icon + short label. Layout helper only. */
function Tile({ icon: Icon, label, group, a = '168, 85, 247', className = '' }) {
  return (
    <div className={`oc-tile rounded-xl border px-4 py-3.5 ${className}`} style={{ '--t': a }}>
      {group && <GroupLabel>{group}</GroupLabel>}
      <p
        className={`flex items-start gap-2.5 font-sans text-[13.5px] font-semibold leading-snug text-white ${
          group ? 'mt-2' : ''
        }`}
      >
        {Icon && (
          <Icon
            className="mt-[1px] h-4 w-4 shrink-0"
            style={{ color: `rgb(${a})` }}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        )}
        <span className="min-w-0 break-words">{label}</span>
      </p>
    </div>
  );
}

/* A numbered glass card: number + icon + title on the left column, an
   optional `aside` on the right from lg up. */
function Section({ section, children, aside }) {
  const Icon = section.icon;
  return (
    <article
      id={section.id}
      data-reveal
      className="oc-card relative scroll-mt-28 overflow-hidden rounded-[28px] border p-6 backdrop-blur-xl sm:p-9 lg:p-12"
      style={{ '--a': section.a, '--b': section.b }}
    >
      <span className="oc-card-glow pointer-events-none absolute inset-0 rounded-[28px]" aria-hidden="true" />
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0), rgba(${section.a}, 0.7), rgba(${section.b}, 0.5), rgba(0,0,0,0))`,
        }}
        aria-hidden="true"
      />

      <div
        className={`relative grid grid-cols-1 gap-8 ${
          aside ? 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14' : ''
        }`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <span
              className="font-serif text-[2.6rem] font-semibold leading-none tracking-[-0.02em] text-transparent bg-clip-text sm:text-[3.2rem]"
              style={{ backgroundImage: `linear-gradient(120deg, rgb(${section.a}), rgb(${section.b}))` }}
            >
              {section.n}
            </span>
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-white"
              style={{
                backgroundImage: `linear-gradient(140deg, rgb(${section.a}), rgb(${section.b}))`,
                boxShadow: `0 10px 24px -10px rgba(${section.a}, 0.9)`,
              }}
              aria-hidden="true"
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
          </div>
          <h2 className="mt-6 break-words font-serif text-[1.85rem] font-semibold leading-[1.14] tracking-[-0.012em] text-white sm:text-[2.2rem]">
            {section.title}
          </h2>

          <div className="mt-7 flex flex-col gap-5">{children}</div>
        </div>

        {aside && <div className="min-w-0 lg:self-center">{aside}</div>}
      </div>
    </article>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center py-1.5" aria-hidden="true">
      <ArrowDown className="h-4 w-4 text-white/35" strokeWidth={1.8} />
    </div>
  );
}

const bodyText =
  'font-sans text-[15px] font-normal leading-[1.75] text-white/75 [text-wrap:pretty] sm:text-base';

/* ================================================================
   Content
================================================================ */

const SECTIONS = [
  { id: 'quantitative-biomarkers', n: '01', title: 'Quantitative CRC Biomarkers', icon: Gauge, a: '124, 58, 237', b: '168, 85, 247' },
  { id: 'tumor-microenvironment', n: '02', title: 'CRC Tumor Microenvironment', icon: Network, a: '94, 234, 212', b: '59, 130, 246' },
  { id: 'molecular-intelligence', n: '03', title: 'CRC Molecular Intelligence', icon: Dna, a: '168, 85, 247', b: '236, 72, 153' },
  { id: 'treatment-research', n: '04', title: 'CRC Treatment Research', icon: BrainCircuit, a: '236, 72, 153', b: '59, 130, 246' },
];

/* The four data layers named in the opening paragraph */
const LAYERS = [
  { label: 'Digital histopathology', icon: Microscope, a: '168, 85, 247' },
  { label: 'Mismatch-repair IHC', icon: ScanSearch, a: '236, 72, 153' },
  { label: 'Spatial immune profiling', icon: Network, a: '94, 234, 212' },
  { label: 'Molecular information', icon: Dna, a: '59, 130, 246' },
];

const BIOMARKER_GROUPS = [
  { group: 'Mismatch-repair proteins', a: '236, 72, 153', items: ['MLH1', 'PMS2', 'MSH2', 'MSH6'] },
  { group: 'Immune panels', a: '94, 234, 212', items: ['CD3', 'CD8', 'FOXP3', 'CD68'] },
  { group: 'Molecular alterations', a: '59, 130, 246', items: ['MSI-H/dMMR', 'BRAF V600E', 'KRAS', 'NRAS'] },
];

/* The levels a single specimen can be studied at */
const LEVELS = [
  { label: 'Tumor morphology', icon: Microscope, a: '168, 85, 247' },
  { label: 'Mismatch-repair biology', icon: ScanSearch, a: '236, 72, 153' },
  { label: 'Tumor budding', icon: Activity, a: '244, 114, 182' },
  { label: 'Immune infiltration', icon: Users, a: '94, 234, 212' },
  { label: 'Spatial immune features', icon: Shapes, a: '59, 130, 246' },
  { label: 'Genomic alterations', icon: Dna, a: '124, 58, 237' },
];

const QUANT_READOUTS = [
  {
    group: 'H&E',
    a: '59, 130, 246',
    icon: Percent,
    items: ['Tumor segmentation', 'Tumor-budding analysis'],
  },
  {
    group: 'Mismatch repair',
    a: '236, 72, 153',
    icon: ScanSearch,
    items: ['MLH1', 'PMS2', 'MSH2', 'MSH6', 'Retained or lost expression'],
  },
  {
    group: 'Immune cells',
    a: '94, 234, 212',
    icon: Users,
    items: ['CD3 and CD8 in the tumor core', 'CD3 and CD8 at the invasive margin'],
  },
  {
    group: 'Molecular linkage',
    a: '168, 85, 247',
    icon: Crosshair,
    items: ['Molecular MSI information where available'],
  },
];

const TME_MARKERS = ['CD3', 'CD8', 'FOXP3', 'CD68'];

const TME_CELLS = [
  { label: 'CD3-positive T cells', a: '94, 234, 212' },
  { label: 'CD8-positive lymphocytes', a: '59, 130, 246' },
  { label: 'FOXP3-positive regulatory T cells', a: '196, 181, 253' },
  { label: 'CD68-positive macrophages', a: '168, 85, 247' },
];

const TME_OUTPUTS = [
  'Tumor-core immunity',
  'Invasive-margin immunity',
  'Immune exclusion',
  'Tumor–immune proximity',
  'Cellular neighborhood features',
];

const MOLECULAR_TARGETS = ['MSI-H/dMMR', 'BRAF V600E', 'KRAS', 'NRAS'];

const MOLECULAR_OUTPUTS = [
  { label: 'Molecular probability scores', icon: Gauge, a: '168, 85, 247' },
  { label: 'Confidence estimates', icon: BrainCircuit, a: '59, 130, 246' },
  { label: 'Tissue heatmaps', icon: Flame, a: '236, 72, 153' },
];

const TREATMENT_COHORTS = ['Anti-EGFR', 'Immunotherapy'];

const TREATMENT_FEATURES = [
  { label: 'H&E morphology', icon: Microscope, a: '168, 85, 247' },
  { label: 'MMR expression', icon: ScanSearch, a: '236, 72, 153' },
  { label: 'MSI, RAS and BRAF status', icon: Dna, a: '59, 130, 246' },
  { label: 'Immune spatial features', icon: Network, a: '94, 234, 212' },
  { label: 'Clinical metadata', icon: FlaskConical, a: '147, 197, 253' },
];

/* For Biopharma */
const BIOPHARMA_AUDIENCES = [
  { label: 'Pharmaceutical companies', icon: Building2, a: '168, 85, 247' },
  { label: 'Biotechnology companies', icon: FlaskConical, a: '236, 72, 153' },
  { label: 'CROs', icon: ClipboardList, a: '94, 234, 212' },
  { label: 'Academic research groups', icon: Microscope, a: '59, 130, 246' },
];

const BIOPHARMA_SUPPORT = [
  'Retrospective tissue studies',
  'Biomarker quantification',
  'Spatial tumor microenvironment analysis',
  'Molecular phenotype research',
  'Cohort characterization',
  'Multimodal biomarker-development programs',
];

const BIOPHARMA_MODELS = [
  'Archived FFPE cohorts',
  'Retrospective clinical-trial tissue',
  'Biomarker discovery studies',
  'Molecular enrichment projects',
  'Tumor microenvironment research',
  'Therapy-specific multimodal models',
];

/* Our Initial Oncology Programs */
const PROGRAMS = [
  {
    title: 'Breast Cancer',
    icon: ScanSearch,
    a: '236, 72, 153',
    body: 'Quantitative ER, PR, HER2 and Ki-67 analysis combined with spatial immune profiling and morphology-derived molecular research.',
  },
  {
    title: 'NSCLC',
    icon: Layers,
    a: '59, 130, 246',
    body: 'Integrated H&E, PD-L1, tumor microenvironment and genomic intelligence for lung cancer biomarker research.',
  },
  {
    title: 'Colorectal Cancer',
    icon: Dna,
    a: '168, 85, 247',
    body: 'MMR, tumor budding, CD3/CD8 spatial analysis and morphology-derived MSI, BRAF and RAS research.',
  },
];

/* ================================================================ */

export default function OMColorectal() {
  const rootRef = useRef(null);
  const lenisRef = useRef(null);

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

  /* ---- Paint the document ground so overscroll never shows the default ---- */
  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const prev = { htmlBg: html.style.backgroundColor, bodyBg: body.style.backgroundColor };
    html.style.backgroundColor = PAGE_BG;
    body.style.backgroundColor = PAGE_BG;
    return () => {
      html.style.backgroundColor = prev.htmlBg;
      body.style.backgroundColor = prev.bodyBg;
    };
  }, []);

  /* ---- Hero entrance and scroll reveals ---- */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set('[data-reveal], .oc-hero-copy > *, .oc-stage', { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.oc-hero-copy > *', { autoAlpha: 0, y: 26, duration: 0.9, stagger: 0.1 }, 0.15)
        .from('.oc-stage', { autoAlpha: 0, y: 30, scale: 0.96, duration: 1.05 }, 0.35);

      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 34,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -96 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [s1, s2, s3, s4] = SECTIONS;

  return (
    <>
      <Navbar />

      <style>{`
        .oc-card {
          background-color: rgba(11, 16, 32, 0.55);
          border-color: rgba(255, 255, 255, 0.09);
          box-shadow: 0 30px 70px -44px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.04);
          transition: border-color 380ms ease-out, box-shadow 380ms ease-out;
        }
        .oc-card:hover {
          border-color: rgba(var(--a), 0.34);
          box-shadow:
            0 30px 70px -44px rgba(0, 0, 0, 0.9),
            0 0 40px -14px rgba(var(--a), 0.35),
            0 0 60px -24px rgba(var(--b), 0.3);
        }
        .oc-card-glow {
          background-image:
            radial-gradient(48% 60% at 100% 0%, rgba(var(--a), 0.13) 0%, rgba(0, 0, 0, 0) 72%),
            radial-gradient(44% 56% at 0% 100%, rgba(var(--b), 0.08) 0%, rgba(0, 0, 0, 0) 74%);
        }
        .oc-tile {
          border-color: rgba(255, 255, 255, 0.09);
          background-color: rgba(255, 255, 255, 0.04);
          transition: border-color 300ms ease-out, background-color 300ms ease-out, box-shadow 300ms ease-out, transform 300ms ease-out;
        }
        .oc-tile:hover {
          border-color: rgba(var(--t), 0.4);
          background-color: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 34px -14px rgba(var(--t), 0.55);
          transform: translateY(-2px);
        }
        @media (prefers-reduced-motion: reduce) {
          .oc-tile:hover { transform: none; }
        }
      `}</style>

      <main
        ref={rootRef}
        className="relative w-full overflow-hidden text-white selection:bg-purple-500/30"
        style={{ backgroundColor: PAGE_BG }}
      >
        {/* ============================================================
            HERO
        ============================================================ */}
        <section className="relative overflow-hidden" style={{ backgroundColor: '#050816' }}>
          <Lighting variant="a" />
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)',
              backgroundSize: '58px 58px',
              maskImage: 'radial-gradient(78% 70% at 50% 34%, #000 0%, transparent 82%)',
              WebkitMaskImage: 'radial-gradient(78% 70% at 50% 34%, #000 0%, transparent 82%)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-20 pt-[122px] lg:px-10 lg:pb-28 lg:pt-[168px]">
            <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
              <div className="oc-hero-copy w-full min-w-0 max-w-2xl lg:max-w-none">
                <Eyebrow>Products · Colorectal Program</Eyebrow>

                <h1 className="mt-7 break-words font-serif text-[2.6rem] font-semibold leading-[1.06] tracking-[-0.015em] text-white sm:text-[3.4rem] lg:text-[3.9rem]">
                  OM Colorectal™
                </h1>

                <p className="mt-4 font-serif text-[1.25rem] font-medium italic leading-[1.3] text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#E879F9] to-[#93C5FD] sm:text-[1.5rem]">
                  Multimodal AI for Colorectal Cancer Tissue, Immune and Molecular Stratification
                </p>

                <p className={`mt-7 max-w-xl ${bodyText} sm:text-[17px]`}>
                  <Hl>OM Colorectal™</Hl> combines digital histopathology, mismatch-repair IHC,
                  spatial immune profiling and molecular information to characterize{' '}
                  <Hl>colorectal cancer across multiple biological layers</Hl>.
                </p>

                {/* Section index */}
                <nav aria-label="On this page" className="mt-10">
                  <ol className="grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
                    {SECTIONS.map((s) => (
                      <li key={s.id} className="min-w-0">
                        <a
                          href={`#${s.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            jumpTo(s.id);
                          }}
                          className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 backdrop-blur-md transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.08]"
                        >
                          <span
                            className="shrink-0 font-sans text-[11px] font-semibold tracking-[0.14em]"
                            style={{ color: `rgb(${s.b})` }}
                          >
                            {s.n}
                          </span>
                          <span className="min-w-0 break-words font-sans text-[13px] font-medium leading-snug text-white/80 group-hover:text-white">
                            {s.title}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              {/* Hero visual — the four data layers feeding one research platform */}
              <div className="oc-stage relative w-full min-w-0">
                <div className="relative overflow-hidden rounded-[26px] border border-white/[0.12] bg-[#0B1020]/70 p-4 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-5">
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage:
                        'radial-gradient(60% 50% at 100% 0%, rgba(168,85,247,0.16) 0%, rgba(0,0,0,0) 70%), radial-gradient(50% 45% at 0% 100%, rgba(59,130,246,0.14) 0%, rgba(0,0,0,0) 72%)',
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 font-sans text-[12px] font-semibold text-white/85">
                      <Layers className="h-4 w-4 text-[#C4B5FD]" strokeWidth={1.8} aria-hidden="true" />
                      Colorectal tissue
                    </span>
                    <span className="font-sans text-[11px] font-medium text-white/45">
                      Illustrative schematic
                    </span>
                  </div>

                  <div className="relative mt-4">
                    <ul className="grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2">
                      {LAYERS.map((l) => (
                        <li key={l.label} className="min-w-0">
                          <Tile icon={l.icon} label={l.label} a={l.a} className="h-full" />
                        </li>
                      ))}
                    </ul>

                    <FlowArrow />

                    <div className="oc-tile rounded-xl border px-4 py-3.5" style={{ '--t': '124, 58, 237' }}>
                      <GroupLabel>Multiple biological layers</GroupLabel>
                      <p className="mt-2 break-words font-sans text-[13.5px] font-medium leading-[1.6] text-white/85">
                        Omic Mind characterizes colorectal cancer around the same specimen
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            PROGRAM OVERVIEW + SECTIONS
        ============================================================ */}
        <section
          className="relative pb-24 lg:pb-32"
          style={{ backgroundImage: 'linear-gradient(180deg, #050816 0%, #081225 18%, #0B1020 60%, #02050B 100%)' }}
        >
          <Lighting variant="b" />
          <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-6 px-6 lg:gap-8 lg:px-10">
            {/* Program design — the markers the program is built around */}
            <article
              data-reveal
              className="oc-card relative overflow-hidden rounded-[28px] border p-6 backdrop-blur-xl sm:p-9 lg:p-12"
              style={{ '--a': '59, 130, 246', '--b': '124, 58, 237' }}
            >
              <span className="oc-card-glow pointer-events-none absolute inset-0 rounded-[28px]" aria-hidden="true" />
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, rgba(0,0,0,0), rgba(59,130,246,0.7), rgba(124,58,237,0.5), rgba(0,0,0,0))',
                }}
                aria-hidden="true"
              />

              <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
                <div className="min-w-0">
                  <GroupLabel>Program design</GroupLabel>
                  <p className={`mt-4 ${bodyText}`}>
                    <Hl>CRC</Hl> provides a strong setting for multimodal AI because tumor
                    morphology, mismatch-repair biology, tumor budding, immune infiltration and
                    genomic alterations such as <Hl>MSI, BRAF and RAS</Hl> can all contribute
                    meaningful translational information.
                  </p>

                  <ul className="mt-7 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2 lg:grid-cols-3">
                    {LEVELS.map((l) => (
                      <li key={l.label} className="min-w-0">
                        <Tile icon={l.icon} label={l.label} a={l.a} className="h-full" />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="min-w-0 lg:self-center">
                  <div className="rounded-2xl border border-white/[0.09] bg-[#02050B]/60 p-4 sm:p-5">
                    <div className="flex flex-col gap-5">
                      <div>
                        <GroupLabel>Routine imaging input</GroupLabel>
                        <div className="mt-3">
                          <Tile icon={Microscope} label="H&E morphology" a="168, 85, 247" />
                        </div>
                      </div>

                      {BIOMARKER_GROUPS.map((g) => (
                        <div key={g.group}>
                          <GroupLabel>{g.group}</GroupLabel>
                          <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                            {g.items.map((m) => (
                              <Tag key={m} a={g.a}>
                                {m}
                              </Tag>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 01 — Quantitative CRC Biomarkers */}
            <Section
              section={s1}
              aside={
                <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
                  {QUANT_READOUTS.map((q) => {
                    const Icon = q.icon;
                    return (
                      <li
                        key={q.group}
                        className="oc-tile flex min-w-0 flex-col rounded-2xl border p-4"
                        style={{ '--t': q.a }}
                      >
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-white/[0.12]"
                          style={{ backgroundColor: `rgba(${q.a}, 0.14)` }}
                          aria-hidden="true"
                        >
                          <Icon className="h-4 w-4" style={{ color: `rgb(${q.a})` }} strokeWidth={1.8} />
                        </span>
                        <span className="mt-3 break-words font-sans text-[13.5px] font-semibold leading-snug text-white">
                          {q.group}
                        </span>
                        <ul className="mt-3 flex list-none flex-col gap-1.5 p-0">
                          {q.items.map((it) => (
                            <li
                              key={it}
                              className="flex items-start gap-2 font-sans text-[12.5px] leading-[1.5] text-white/70"
                            >
                              <span
                                className="mt-[7px] h-1 w-1 shrink-0 rounded-full"
                                style={{ backgroundColor: `rgb(${q.a})` }}
                                aria-hidden="true"
                              />
                              <span className="min-w-0 break-words">{it}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              }
            >
              <p className={bodyText}>
                <Hl>Biomarker Quant™</Hl> can perform H&amp;E-based tumor segmentation and
                tumor-budding analysis while providing structured assessment of the{' '}
                <Hl>four key mismatch-repair proteins</Hl>: MLH1, PMS2, MSH2 and MSH6.
              </p>
              <p className={bodyText}>
                The system can characterize <Hl>retained or lost expression patterns</Hl> and link
                these results with molecular MSI information where available.
              </p>
              <p className={bodyText}>
                <Hl>CD3</Hl> and <Hl>CD8</Hl> measurements can also be quantified separately within
                the tumor core and invasive margin.
              </p>
              <p className="font-sans text-[14px] leading-[1.7] text-white/60 [text-wrap:pretty]">
                Tumor-core and invasive-margin CD3/CD8 quantification is already part of the
                existing OM Colorectal™ specification.
              </p>
            </Section>

            {/* 02 — CRC Tumor Microenvironment */}
            <Section
              section={s2}
              aside={
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-white/[0.09] bg-[#02050B]/60 p-4 sm:p-5">
                    <GroupLabel>Markers</GroupLabel>
                    <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                      {TME_MARKERS.map((m) => (
                        <Tag key={m} a="94, 234, 212">
                          {m}
                        </Tag>
                      ))}
                    </ul>

                    <FlowArrow />

                    <GroupLabel>Mapped populations</GroupLabel>
                    <ul className="mt-3 grid list-none grid-cols-1 gap-2.5 p-0">
                      {TME_CELLS.map((c) => (
                        <li key={c.label} className="min-w-0">
                          <div
                            className="oc-tile flex items-center gap-3 rounded-xl border px-4 py-3"
                            style={{ '--t': c.a }}
                          >
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: `rgb(${c.a})`, boxShadow: `0 0 8px rgba(${c.a}, 0.8)` }}
                              aria-hidden="true"
                            />
                            <span className="min-w-0 break-words font-sans text-[13px] font-medium text-white/85">
                              {c.label}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <Tile icon={Target} group="Compartment" label="Tumor core" a="236, 72, 153" className="h-full" />
                      <Tile icon={Shapes} group="Compartment" label="Invasive margin" a="59, 130, 246" className="h-full" />
                    </div>
                  </div>

                  <div>
                    <GroupLabel>Potential outputs</GroupLabel>
                    <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                      {TME_OUTPUTS.map((o) => (
                        <Tag key={o} a="196, 181, 253">
                          {o}
                        </Tag>
                      ))}
                    </ul>
                  </div>
                </div>
              }
            >
              <p className={bodyText}>
                <Hl>Spatial TME™</Hl> can map immune-cell organization across different colorectal
                tumor compartments.
              </p>
              <p className={bodyText}>
                Rather than generating a single immune-cell measurement for the entire tissue
                section, Omic Mind can quantify <Hl>CD3</Hl> and <Hl>CD8</Hl> density within the{' '}
                <Hl>tumor core</Hl> and <Hl>invasive margin</Hl> and analyze how these cells are
                organized spatially relative to malignant tissue.
              </p>
              <p className={bodyText}>
                Extended panels can incorporate FOXP3 and CD68 to study regulatory T cells and
                macrophages.
              </p>
              <p className={bodyText}>
                The resulting CRC spatial profile may include tumor-core immunity, invasive-margin
                immunity, immune exclusion, tumor–immune proximity and cellular neighborhood
                features.
              </p>
              <p className={bodyText}>
                Tumor budding can also be analyzed in relation to local immune architecture,
                providing an additional link between morphology and tumor microenvironment biology.
              </p>
            </Section>

            {/* 03 — CRC Molecular Intelligence */}
            <Section
              section={s3}
              aside={
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-white/[0.09] bg-[#02050B]/60 p-4 sm:p-5">
                    <GroupLabel>Initial research targets</GroupLabel>
                    <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                      {MOLECULAR_TARGETS.map((t) => (
                        <Tag key={t} a="168, 85, 247">
                          {t}
                        </Tag>
                      ))}
                    </ul>

                    <FlowArrow />

                    <Tile
                      icon={ShieldCheck}
                      group="Ground truth"
                      label="Validated PCR, NGS or IHC"
                      a="94, 234, 212"
                    />

                    <FlowArrow />

                    <ul className="grid list-none grid-cols-1 gap-2.5 p-0">
                      {MOLECULAR_OUTPUTS.map((o) => (
                        <li key={o.label} className="min-w-0">
                          <Tile icon={o.icon} label={o.label} a={o.a} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className="relative overflow-hidden rounded-2xl border p-5 sm:p-6"
                    style={{
                      borderColor: 'rgba(236, 72, 153, 0.4)',
                      backgroundImage:
                        'linear-gradient(140deg, rgba(236,72,153,0.16) 0%, rgba(168,85,247,0.12) 55%, rgba(59,130,246,0.1) 100%)',
                      boxShadow: '0 0 44px -18px rgba(236, 72, 153, 0.6)',
                    }}
                  >
                    <span className="inline-flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F9A8D4]">
                      <ShieldCheck className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                      Research positioning
                    </span>
                    <p className="mt-4 break-words font-serif text-[1.35rem] font-semibold italic leading-[1.3] text-white sm:text-[1.5rem]">
                      Retrospective cohort enrichment and image-derived biomarker discovery.
                    </p>
                  </div>
                </div>
              }
            >
              <p className={bodyText}>
                <Hl>Molecular Predict™</Hl> can investigate morphology associated with{' '}
                <Hl>MSI-H/dMMR</Hl>, <Hl>BRAF V600E</Hl> and <Hl>KRAS/NRAS</Hl> molecular states.
                These targets are already part of the existing colorectal architecture.
              </p>
              <p className={bodyText}>
                H&amp;E images can be paired with validated PCR, NGS or IHC ground truth during
                model development.
              </p>
              <p className={bodyText}>
                The system can then produce molecular probability scores, confidence estimates and
                tissue heatmaps for research applications such as retrospective cohort enrichment
                and image-derived biomarker discovery.
              </p>
            </Section>

            {/* 04 — CRC Treatment Research */}
            <Section
              section={s4}
              aside={
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-white/[0.09] bg-[#02050B]/60 p-4 sm:p-5">
                    <GroupLabel>Defined research cohorts</GroupLabel>
                    <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                      {TREATMENT_COHORTS.map((c) => (
                        <Tag key={c} a="236, 72, 153">
                          {c}
                        </Tag>
                      ))}
                    </ul>

                    <FlowArrow />

                    <GroupLabel>Combined features</GroupLabel>
                    <ul className="mt-3 grid list-none grid-cols-1 gap-2.5 p-0">
                      {TREATMENT_FEATURES.map((f) => (
                        <li key={f.label} className="min-w-0">
                          <Tile icon={f.icon} label={f.label} a={f.a} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className="relative overflow-hidden rounded-2xl border p-5 sm:p-6"
                    style={{
                      borderColor: 'rgba(59, 130, 246, 0.4)',
                      backgroundImage:
                        'linear-gradient(140deg, rgba(59,130,246,0.16) 0%, rgba(124,58,237,0.12) 55%, rgba(236,72,153,0.1) 100%)',
                      boxShadow: '0 0 44px -18px rgba(59, 130, 246, 0.6)',
                    }}
                  >
                    <span className="inline-flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#93C5FD]">
                      <Target className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                      Study design
                    </span>
                    <p className="mt-4 break-words font-serif text-[1.35rem] font-semibold italic leading-[1.3] text-white sm:text-[1.5rem]">
                      Treatment-response research, not therapy selection.
                    </p>
                  </div>
                </div>
              }
            >
              <p className={bodyText}>
                <Hl>Treatment Predict™</Hl> can later be applied to clearly defined CRC treatment
                cohorts containing reliable therapy and outcome information.
              </p>
              <p className={bodyText}>
                Research programs may investigate multimodal features within molecularly defined{' '}
                <Hl>anti-EGFR</Hl> or <Hl>immunotherapy</Hl> cohorts, combining H&amp;E morphology,
                MMR expression, MSI/RAS/BRAF status, immune spatial features and clinical metadata.
              </p>
              <p className={bodyText}>
                Until specific models are trained and validated, this capability should remain
                positioned as{' '}
                <span className="rounded-md bg-[#EC4899]/15 px-1.5 py-0.5 font-semibold text-[#F9A8D4]">
                  treatment-response research and pharma co-development
                </span>
                , not as a validated therapy-selection system.
              </p>
            </Section>

            {/* For Biopharma */}
            <article
              id="for-biopharma"
              data-reveal
              className="oc-card relative scroll-mt-28 overflow-hidden rounded-[28px] border p-6 backdrop-blur-xl sm:p-9 lg:p-12"
              style={{ '--a': '124, 58, 237', '--b': '236, 72, 153' }}
            >
              <span className="oc-card-glow pointer-events-none absolute inset-0 rounded-[28px]" aria-hidden="true" />
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, rgba(0,0,0,0), rgba(124,58,237,0.7), rgba(236,72,153,0.5), rgba(0,0,0,0))',
                }}
                aria-hidden="true"
              />

              <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
                <div className="min-w-0">
                  <GroupLabel>For Biopharma</GroupLabel>
                  <h2 className="mt-4 break-words font-serif text-[1.85rem] font-semibold leading-[1.14] tracking-[-0.012em] text-white sm:text-[2.2rem]">
                    Built for Translational Oncology and Biomarker Co-Development
                  </h2>

                  <div className="mt-7 flex flex-col gap-5">
                    <p className={bodyText}>
                      <Hl>Omic Mind</Hl> is designed to support pharmaceutical companies,
                      biotechnology companies, CROs and academic research groups working across
                      oncology drug development and translational research.
                    </p>
                    <p className={bodyText}>
                      The platform can support retrospective tissue studies, biomarker
                      quantification, spatial tumor microenvironment analysis, molecular phenotype
                      research, cohort characterization and multimodal biomarker-development
                      programs.
                    </p>
                    <p className={bodyText}>
                      By linking tissue morphology, quantitative IHC, spatial biology and molecular
                      information within one <Hl>specimen-centric platform</Hl>, Omic Mind aims to
                      provide a unified infrastructure for studying the biological complexity of
                      cancer.
                    </p>
                  </div>

                  <ul className="mt-7 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2">
                    {BIOPHARMA_AUDIENCES.map((x) => (
                      <li key={x.label} className="min-w-0">
                        <Tile icon={x.icon} label={x.label} a={x.a} className="h-full" />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="min-w-0 lg:self-center">
                  <div className="rounded-2xl border border-white/[0.09] bg-[#02050B]/60 p-4 sm:p-5">
                    <div className="flex flex-col gap-5">
                      <div>
                        <GroupLabel>Platform support</GroupLabel>
                        <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                          {BIOPHARMA_SUPPORT.map((s) => (
                            <Tag key={s} a="94, 234, 212">
                              {s}
                            </Tag>
                          ))}
                        </ul>
                      </div>

                      <FlowArrow />

                      <div>
                        <GroupLabel>Potential collaboration models</GroupLabel>
                        <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                          {BIOPHARMA_MODELS.map((m) => (
                            <Tag key={m} a="168, 85, 247">
                              {m}
                            </Tag>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Our Initial Oncology Programs */}
            <article
              id="oncology-programs"
              data-reveal
              className="oc-card relative scroll-mt-28 overflow-hidden rounded-[28px] border p-6 backdrop-blur-xl sm:p-9 lg:p-12"
              style={{ '--a': '236, 72, 153', '--b': '124, 58, 237' }}
            >
              <span className="oc-card-glow pointer-events-none absolute inset-0 rounded-[28px]" aria-hidden="true" />
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, rgba(0,0,0,0), rgba(236,72,153,0.7), rgba(124,58,237,0.5), rgba(0,0,0,0))',
                }}
                aria-hidden="true"
              />

              <div className="relative">
                <GroupLabel>Programs</GroupLabel>
                <h2 className="mt-4 break-words font-serif text-[1.85rem] font-semibold leading-[1.14] tracking-[-0.012em] text-white sm:text-[2.2rem]">
                  Our Initial Oncology Programs
                </h2>

                <ul className="mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
                  {PROGRAMS.map((p) => {
                    const Icon = p.icon;
                    return (
                      <li
                        key={p.title}
                        className="oc-tile flex min-w-0 flex-col rounded-2xl border p-5"
                        style={{ '--t': p.a }}
                      >
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/[0.12]"
                          style={{ backgroundColor: `rgba(${p.a}, 0.14)` }}
                          aria-hidden="true"
                        >
                          <Icon className="h-[18px] w-[18px]" style={{ color: `rgb(${p.a})` }} strokeWidth={1.8} />
                        </span>
                        <span className="mt-4 break-words font-serif text-[1.25rem] font-semibold leading-snug text-white">
                          {p.title}
                        </span>
                        <p className="mt-3 break-words font-sans text-[13.5px] font-normal leading-[1.7] text-white/70 [text-wrap:pretty]">
                          {p.body}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
