import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity,
  ArrowDown,
  BrainCircuit,
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
    <div className={`ol-tile rounded-xl border px-4 py-3.5 ${className}`} style={{ '--t': a }}>
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
      className="ol-card relative scroll-mt-28 overflow-hidden rounded-[28px] border p-6 backdrop-blur-xl sm:p-9 lg:p-12"
      style={{ '--a': section.a, '--b': section.b }}
    >
      <span className="ol-card-glow pointer-events-none absolute inset-0 rounded-[28px]" aria-hidden="true" />
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
  { id: 'quantitative-biomarkers', n: '01', title: 'Quantitative Lung Biomarkers', icon: Gauge, a: '124, 58, 237', b: '168, 85, 247' },
  { id: 'tumor-microenvironment', n: '02', title: 'Lung Tumor Microenvironment', icon: Network, a: '94, 234, 212', b: '59, 130, 246' },
  { id: 'molecular-intelligence', n: '03', title: 'Lung Molecular Intelligence', icon: Dna, a: '168, 85, 247', b: '236, 72, 153' },
  { id: 'treatment-research', n: '04', title: 'Lung Treatment Research', icon: BrainCircuit, a: '236, 72, 153', b: '59, 130, 246' },
];

/* The four data layers named in the opening paragraph */
const LAYERS = [
  { label: 'H&E morphology', icon: Microscope, a: '168, 85, 247' },
  { label: 'PD-L1 analysis', icon: ScanSearch, a: '236, 72, 153' },
  { label: 'Tumor microenvironment profiling', icon: Network, a: '94, 234, 212' },
  { label: 'Molecular information', icon: Dna, a: '59, 130, 246' },
];

const BIOMARKER_GROUPS = [
  { group: 'Central lung biomarkers', a: '236, 72, 153', items: ['PD-L1', 'CD8 density'] },
  { group: 'Additional translational panels', a: '94, 234, 212', items: ['PanCK', 'CD3', 'CD8', 'FOXP3', 'CD68'] },
  { group: 'Genomic driver alterations', a: '59, 130, 246', items: ['EGFR', 'KRAS', 'KRAS G12C', 'ALK', 'ROS1'] },
];

/* The levels a single specimen can be studied at */
const LEVELS = [
  { label: 'Tissue morphology', icon: Microscope, a: '168, 85, 247' },
  { label: 'Immune-checkpoint biomarkers', icon: ScanSearch, a: '236, 72, 153' },
  { label: 'Tumor content', icon: Activity, a: '244, 114, 182' },
  { label: 'Immune composition', icon: Users, a: '94, 234, 212' },
  { label: 'Spatial immune features', icon: Shapes, a: '59, 130, 246' },
  { label: 'Genomic driver alterations', icon: Dna, a: '124, 58, 237' },
];

const QUANT_READOUTS = [
  {
    group: 'H&E',
    a: '59, 130, 246',
    icon: Percent,
    items: ['Tumor areas', 'Tumor content', 'NSCLC histological patterns'],
  },
  {
    group: 'PD-L1',
    a: '236, 72, 153',
    icon: ScanSearch,
    items: ['Quantitative analysis', 'PD-L1 scoring'],
  },
  {
    group: 'Immune cells',
    a: '94, 234, 212',
    icon: Users,
    items: ['CD8 density', 'CD8 immune-exclusion analysis'],
  },
  {
    group: 'Histological patterns',
    a: '168, 85, 247',
    icon: Crosshair,
    items: ['Adenocarcinoma-versus-squamous assistance'],
  },
];

const TME_MARKERS = ['PanCK', 'CD3', 'CD8', 'FOXP3', 'CD68'];

const TME_CELLS = [
  { label: 'CD8-positive lymphocytes', a: '94, 234, 212' },
  { label: 'FOXP3-positive regulatory T cells', a: '59, 130, 246' },
  { label: 'CD68-positive macrophages', a: '168, 85, 247' },
];

const TME_OUTPUTS = [
  'CD8 infiltration',
  'Immune exclusion',
  'Tumor-to-immune distance',
  'Treg distribution',
  'Macrophage localization',
  'Inflamed, excluded or desert immune phenotypes',
];

const MOLECULAR_TARGETS = ['EGFR', 'KRAS', 'KRAS G12C', 'ALK', 'ROS1'];

const MOLECULAR_OUTPUTS = [
  { label: 'Molecular probabilities', icon: Gauge, a: '168, 85, 247' },
  { label: 'Confidence scores', icon: BrainCircuit, a: '59, 130, 246' },
  { label: 'Predictive tissue heatmaps', icon: Flame, a: '236, 72, 153' },
];

const TREATMENT_COHORTS = ['Immunotherapy', 'Targeted therapy'];

const TREATMENT_FEATURES = [
  { label: 'Pathology', icon: Microscope, a: '168, 85, 247' },
  { label: 'PD-L1', icon: ScanSearch, a: '236, 72, 153' },
  { label: 'Spatial immune features', icon: Network, a: '94, 234, 212' },
  { label: 'Genomic information', icon: Dna, a: '59, 130, 246' },
  { label: 'Treatment and clinical outcomes', icon: FlaskConical, a: '147, 197, 253' },
];

/* ================================================================ */

export default function OMLung() {
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
        gsap.set('[data-reveal], .ol-hero-copy > *, .ol-stage', { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.ol-hero-copy > *', { autoAlpha: 0, y: 26, duration: 0.9, stagger: 0.1 }, 0.15)
        .from('.ol-stage', { autoAlpha: 0, y: 30, scale: 0.96, duration: 1.05 }, 0.35);

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
        .ol-card {
          background-color: rgba(11, 16, 32, 0.55);
          border-color: rgba(255, 255, 255, 0.09);
          box-shadow: 0 30px 70px -44px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.04);
          transition: border-color 380ms ease-out, box-shadow 380ms ease-out;
        }
        .ol-card:hover {
          border-color: rgba(var(--a), 0.34);
          box-shadow:
            0 30px 70px -44px rgba(0, 0, 0, 0.9),
            0 0 40px -14px rgba(var(--a), 0.35),
            0 0 60px -24px rgba(var(--b), 0.3);
        }
        .ol-card-glow {
          background-image:
            radial-gradient(48% 60% at 100% 0%, rgba(var(--a), 0.13) 0%, rgba(0, 0, 0, 0) 72%),
            radial-gradient(44% 56% at 0% 100%, rgba(var(--b), 0.08) 0%, rgba(0, 0, 0, 0) 74%);
        }
        .ol-tile {
          border-color: rgba(255, 255, 255, 0.09);
          background-color: rgba(255, 255, 255, 0.04);
          transition: border-color 300ms ease-out, background-color 300ms ease-out, box-shadow 300ms ease-out, transform 300ms ease-out;
        }
        .ol-tile:hover {
          border-color: rgba(var(--t), 0.4);
          background-color: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 34px -14px rgba(var(--t), 0.55);
          transform: translateY(-2px);
        }
        @media (prefers-reduced-motion: reduce) {
          .ol-tile:hover { transform: none; }
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
              <div className="ol-hero-copy w-full min-w-0 max-w-2xl lg:max-w-none">
                <Eyebrow>Products · Lung Program</Eyebrow>

                <h1 className="mt-7 break-words font-serif text-[2.6rem] font-semibold leading-[1.06] tracking-[-0.015em] text-white sm:text-[3.4rem] lg:text-[3.9rem]">
                  OM Lung™
                </h1>

                <p className="mt-4 font-serif text-[1.25rem] font-medium italic leading-[1.3] text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#E879F9] to-[#93C5FD] sm:text-[1.5rem]">
                  Multimodal AI for NSCLC Tissue, Immune and Molecular Intelligence
                </p>

                <p className={`mt-7 max-w-xl ${bodyText} sm:text-[17px]`}>
                  <Hl>OM Lung™</Hl> combines H&amp;E morphology, PD-L1 analysis, tumor
                  microenvironment profiling and molecular information to create an{' '}
                  <Hl>integrated research platform for non-small cell lung cancer</Hl>.
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
              <div className="ol-stage relative w-full min-w-0">
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
                      NSCLC tissue
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

                    <div className="ol-tile rounded-xl border px-4 py-3.5" style={{ '--t': '124, 58, 237' }}>
                      <GroupLabel>Integrated research platform</GroupLabel>
                      <p className="mt-2 break-words font-sans text-[13.5px] font-medium leading-[1.6] text-white/85">
                        Omic Mind brings these layers together around the same specimen
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
              className="ol-card relative overflow-hidden rounded-[28px] border p-6 backdrop-blur-xl sm:p-9 lg:p-12"
              style={{ '--a': '59, 130, 246', '--b': '124, 58, 237' }}
            >
              <span className="ol-card-glow pointer-events-none absolute inset-0 rounded-[28px]" aria-hidden="true" />
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
                    <Hl>NSCLC</Hl> is highly suited to multimodal analysis because tissue
                    morphology, immune-checkpoint biomarkers and genomic driver alterations each
                    provide distinct biological information. Omic Mind brings these layers together
                    around the <Hl>same specimen</Hl>.
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

            {/* 01 — Quantitative Lung Biomarkers */}
            <Section
              section={s1}
              aside={
                <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
                  {QUANT_READOUTS.map((q) => {
                    const Icon = q.icon;
                    return (
                      <li
                        key={q.group}
                        className="ol-tile flex min-w-0 flex-col rounded-2xl border p-4"
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
                <Hl>Biomarker Quant™</Hl> can analyze H&amp;E tissue to identify tumor areas,
                estimate tumor content and support research classification of major{' '}
                <Hl>NSCLC histological patterns</Hl>.
              </p>
              <p className={bodyText}>
                A central component of <Hl>OM Lung™</Hl> is quantitative analysis of{' '}
                <Hl>PD-L1</Hl>, together with immune-cell measurements such as CD8 density.
              </p>
              <p className={bodyText}>
                Additional translational panels may include PanCK, CD3, CD8, FOXP3 and CD68.
              </p>
              <p className="font-sans text-[14px] leading-[1.7] text-white/60 [text-wrap:pretty]">
                The current lung architecture already includes adenocarcinoma-versus-squamous
                assistance, PD-L1 scoring and CD8 immune-exclusion analysis.
              </p>
            </Section>

            {/* 02 — Lung Tumor Microenvironment */}
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
                            className="ol-tile flex items-center gap-3 rounded-xl border px-4 py-3"
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
                      <Tile icon={Target} group="Compartment" label="Tumor nests" a="236, 72, 153" className="h-full" />
                      <Tile icon={Shapes} group="Compartment" label="Stromal compartments" a="59, 130, 246" className="h-full" />
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
                <Hl>Spatial TME™</Hl> can characterize where immune cells are located relative to
                NSCLC tumor tissue.
              </p>
              <p className={bodyText}>
                The platform can distinguish CD8-positive lymphocytes located{' '}
                <Hl>within tumor nests</Hl> from those concentrated at tumor boundaries or{' '}
                <Hl>restricted to stromal compartments</Hl>. FOXP3-positive regulatory T cells and
                CD68-positive macrophages can also be mapped relative to tumor and cytotoxic T-cell
                populations.
              </p>
              <p className={bodyText}>
                Potential outputs include CD8 infiltration, immune exclusion, tumor-to-immune
                distance, Treg distribution, macrophage localization and inflamed, excluded or
                desert immune phenotypes.
              </p>
              <p className={bodyText}>
                This provides a richer description of the tumor immune environment than PD-L1
                measurement alone.
              </p>
            </Section>

            {/* 03 — Lung Molecular Intelligence */}
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
                      label="Molecular testing"
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
                      Molecular testing remains the ground-truth reference.
                    </p>
                  </div>
                </div>
              }
            >
              <p className={bodyText}>
                <Hl>Molecular Predict™</Hl> can investigate whether H&amp;E morphology contains
                detectable signatures associated with major <Hl>NSCLC genomic alterations</Hl>.
              </p>
              <p className={bodyText}>
                Initial research targets can include <Hl>EGFR</Hl> and <Hl>KRAS</Hl>, including
                KRAS G12C where case numbers allow, with exploratory work in ALK and ROS1. These
                targets are already identified in the current OM Lung™ architecture.
              </p>
              <p className={bodyText}>
                H&amp;E-derived molecular probabilities can be presented alongside confidence scores
                and predictive tissue heatmaps while molecular testing remains the ground-truth
                reference.
              </p>
            </Section>

            {/* 04 — Lung Treatment Research */}
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
                      Dedicated models developed and validated first.
                    </p>
                  </div>
                </div>
              }
            >
              <p className={bodyText}>
                <Hl>Treatment Predict™</Hl> can subsequently support defined NSCLC research cohorts
                in which pathology, PD-L1, spatial immune features and genomic information are
                linked with treatment and clinical outcomes.
              </p>
              <p className={bodyText}>
                Potential projects may include retrospective analysis of immunotherapy or
                targeted-therapy cohorts, but treatment-specific claims should only be made once{' '}
                <Hl>dedicated models have been developed and validated</Hl>.
              </p>
              <p className={bodyText}>
                The objective is to provide pharmaceutical partners with a{' '}
                <span className="rounded-md bg-[#EC4899]/15 px-1.5 py-0.5 font-semibold text-[#F9A8D4]">
                  multimodal framework
                </span>{' '}
                for exploring new treatment-associated biomarkers rather than simply relying on a
                single tissue marker.
              </p>
            </Section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
