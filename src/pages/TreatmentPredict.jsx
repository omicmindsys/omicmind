import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity,
  ArrowDown,
  Beaker,
  BrainCircuit,
  Building2,
  ClipboardList,
  Dna,
  FlaskConical,
  Gauge,
  Layers,
  Microscope,
  Network,
  ScanSearch,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Waypoints,
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
    <div className={`tp-tile rounded-xl border px-4 py-3.5 ${className}`} style={{ '--t': a }}>
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
      className="tp-card relative scroll-mt-28 overflow-hidden rounded-[28px] border p-6 backdrop-blur-xl sm:p-9 lg:p-12"
      style={{ '--a': section.a, '--b': section.b }}
    >
      <span className="tp-card-glow pointer-events-none absolute inset-0 rounded-[28px]" aria-hidden="true" />
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

          <div className="mt-7">{children}</div>
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
  { id: 'multimodal-research', n: '01', title: 'Multimodal Treatment Response Research', icon: Layers, a: '124, 58, 237', b: '168, 85, 247' },
  { id: 'outcome-data', n: '02', title: 'Treatment & Clinical Outcome Data', icon: ClipboardList, a: '94, 234, 212', b: '59, 130, 246' },
  { id: 'research-outputs', n: '03', title: 'Exploratory Research Outputs', icon: Gauge, a: '168, 85, 247', b: '236, 72, 153' },
  { id: 'model-development', n: '04', title: 'Treatment-Specific Model Development', icon: Target, a: '59, 130, 246', b: '124, 58, 237' },
  { id: 'predictive-architecture', n: '05', title: 'OmicMind Predictive Architecture', icon: Waypoints, a: '94, 234, 212', b: '124, 58, 237' },
  { id: 'pharma-biotech', n: '06', title: 'Pharma & Biotechnology Research', icon: Building2, a: '236, 72, 153', b: '168, 85, 247' },
  { id: 'co-development', n: '07', title: 'Research & Co-Development Positioning', icon: ShieldCheck, a: '236, 72, 153', b: '59, 130, 246' },
];

/* The five feature families named in the supplied text */
const MODALITIES = [
  { label: 'H&E morphology', icon: Microscope, a: '168, 85, 247' },
  { label: 'Quantitative IHC', icon: ScanSearch, a: '236, 72, 153' },
  { label: 'Spatial tumor microenvironment features', icon: Network, a: '94, 234, 212' },
  { label: 'Genomic alterations', icon: Dna, a: '59, 130, 246' },
  { label: 'Clinical variables', icon: ClipboardList, a: '147, 197, 253' },
];

/* Treatment exposure is the research input; the four below are the outcome
   measures named in the supplied text */
const OUTCOME_DATA = [
  'Response classification',
  'Recurrence',
  'Progression-free survival',
  'Overall survival',
];

const RESEARCH_OUTPUTS = [
  { title: 'Response probability', icon: Gauge, a: '168, 85, 247', meter: true },
  { title: 'Patient stratification groups', icon: Users, a: '59, 130, 246', groups: true },
  { title: 'Multimodal biomarker signatures', icon: Layers, a: '94, 234, 212' },
  { title: 'Resistance-associated features', icon: Activity, a: '236, 72, 153' },
  { title: 'Research risk scores', icon: TrendingUp, a: '244, 114, 182' },
];

const MODEL_SCOPE = [
  { label: 'Clearly defined treatment', icon: FlaskConical, a: '59, 130, 246' },
  { label: 'Patient population', icon: Users, a: '124, 58, 237' },
  { label: 'Clinical endpoint', icon: Target, a: '236, 72, 153' },
];

const ARCHITECTURE = [
  { label: 'Quantitative biomarker analysis', icon: ScanSearch, a: '94, 234, 212' },
  { label: 'Molecular research models', icon: Dna, a: '59, 130, 246' },
  { label: 'Appropriate clinical evidence', icon: ClipboardList, a: '124, 58, 237' },
  { label: 'Treatment response research', icon: BrainCircuit, a: '236, 72, 153' },
];

const PHARMA_PROGRAMS = [
  { title: 'Retrospective clinical-trial analysis', icon: ClipboardList, a: '236, 72, 153' },
  { title: 'Exploratory biomarker development', icon: Beaker, a: '168, 85, 247' },
  { title: 'Patient stratification research', icon: Users, a: '59, 130, 246' },
  { title: 'Prospective co-development programs', icon: Building2, a: '94, 234, 212' },
];

/* ================================================================ */

export default function TreatmentPredict() {
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
        gsap.set('[data-reveal], .tp-hero-copy > *, .tp-stage', { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.tp-hero-copy > *', { autoAlpha: 0, y: 26, duration: 0.9, stagger: 0.1 }, 0.15)
        .from('.tp-stage', { autoAlpha: 0, y: 30, scale: 0.96, duration: 1.05 }, 0.35);

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

  const [s1, s2, s3, s4, s5, s6, s7] = SECTIONS;

  return (
    <>
      <Navbar />

      <style>{`
        .tp-card {
          background-color: rgba(11, 16, 32, 0.55);
          border-color: rgba(255, 255, 255, 0.09);
          box-shadow: 0 30px 70px -44px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.04);
          transition: border-color 380ms ease-out, box-shadow 380ms ease-out;
        }
        .tp-card:hover {
          border-color: rgba(var(--a), 0.34);
          box-shadow:
            0 30px 70px -44px rgba(0, 0, 0, 0.9),
            0 0 40px -14px rgba(var(--a), 0.35),
            0 0 60px -24px rgba(var(--b), 0.3);
        }
        .tp-card-glow {
          background-image:
            radial-gradient(48% 60% at 100% 0%, rgba(var(--a), 0.13) 0%, rgba(0, 0, 0, 0) 72%),
            radial-gradient(44% 56% at 0% 100%, rgba(var(--b), 0.08) 0%, rgba(0, 0, 0, 0) 74%);
        }
        .tp-tile {
          border-color: rgba(255, 255, 255, 0.09);
          background-color: rgba(255, 255, 255, 0.04);
          transition: border-color 300ms ease-out, background-color 300ms ease-out, box-shadow 300ms ease-out, transform 300ms ease-out;
        }
        .tp-tile:hover {
          border-color: rgba(var(--t), 0.4);
          background-color: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 34px -14px rgba(var(--t), 0.55);
          transform: translateY(-2px);
        }
        @media (prefers-reduced-motion: reduce) {
          .tp-tile:hover { transform: none; }
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
              <div className="tp-hero-copy w-full min-w-0 max-w-2xl lg:max-w-none">
                <Eyebrow>Platform · Treatment Predict™</Eyebrow>

                <h1 className="mt-7 break-words font-serif text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.015em] text-white sm:text-[3rem] lg:text-[3.4rem]">
                  Multimodal Treatment Response Research{' '}
                  <span className="mt-2 block italic text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#E879F9] to-[#93C5FD]">
                    and Patient Stratification
                  </span>
                </h1>

                <p className={`mt-7 max-w-xl ${bodyText} sm:text-[17px]`}>
                  <Hl>Treatment Predict™</Hl> represents the advanced predictive layer of the Omic
                  Mind platform.
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

              {/* Hero visual — schematic of the multimodal research layer */}
              <div className="tp-stage relative w-full min-w-0">
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
                      Multimodal research inputs
                    </span>
                    <span className="font-sans text-[11px] font-medium text-white/45">
                      Illustrative schematic
                    </span>
                  </div>

                  <div className="relative mt-4">
                    <ul className="grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2">
                      {MODALITIES.map((m) => (
                        <li key={m.label} className="min-w-0">
                          <Tile icon={m.icon} label={m.label} a={m.a} className="h-full" />
                        </li>
                      ))}
                    </ul>

                    <FlowArrow />

                    <div className="tp-tile rounded-xl border px-4 py-3.5" style={{ '--t': '124, 58, 237' }}>
                      <p className="flex items-start gap-2.5 font-sans text-[13.5px] font-semibold leading-snug text-white">
                        <BrainCircuit
                          className="mt-[1px] h-4 w-4 shrink-0 text-[#C4B5FD]"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 break-words">Treatment Predict™ research models</span>
                      </p>
                    </div>

                    <FlowArrow />

                    <div className="tp-tile rounded-xl border px-4 py-3.5" style={{ '--t': '236, 72, 153' }}>
                      <GroupLabel>Research objective</GroupLabel>
                      <p className="mt-2 break-words font-sans text-[13.5px] font-medium leading-[1.6] text-white/85">
                        Patient subgroups associated with different therapeutic outcomes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTIONS
        ============================================================ */}
        <section
          className="relative pb-24 lg:pb-32"
          style={{ backgroundImage: 'linear-gradient(180deg, #050816 0%, #081225 18%, #0B1020 60%, #02050B 100%)' }}
        >
          <Lighting variant="b" />
          <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-6 px-6 lg:gap-8 lg:px-10">
            {/* 01 */}
            <Section
              section={s1}
              aside={
                <div className="rounded-2xl border border-white/[0.09] bg-[#02050B]/60 p-4 sm:p-5">
                  <GroupLabel>Feature families</GroupLabel>
                  <ul className="mt-3 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2">
                    {MODALITIES.map((m) => (
                      <li key={m.label} className="min-w-0">
                        <Tile icon={m.icon} label={m.label} a={m.a} className="h-full" />
                      </li>
                    ))}
                  </ul>

                  <FlowArrow />

                  <Tile
                    icon={ClipboardList}
                    group="Linked to"
                    label="Well-curated treatment and clinical outcome data"
                    a="94, 234, 212"
                  />
                </div>
              }
            >
              <p className={bodyText}>
                It is designed for research programs in which <Hl>pathology</Hl>, <Hl>biomarker</Hl>,{' '}
                <Hl>molecular</Hl> and <Hl>spatial</Hl> features can be linked to{' '}
                <Hl>well-curated treatment and clinical outcome data</Hl>. The objective is to
                investigate whether combinations of H&amp;E morphology, quantitative IHC, spatial
                tumor microenvironment features, genomic alterations and clinical variables can
                identify <Hl>patient subgroups associated with different therapeutic outcomes</Hl>.
              </p>
            </Section>

            {/* 02 */}
            <Section
              section={s2}
              aside={
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-white/[0.09] bg-[#02050B]/60 p-4 sm:p-5">
                    <GroupLabel>Research input</GroupLabel>
                    <div className="mt-3">
                      <Tile icon={FlaskConical} label="Treatment exposure" a="94, 234, 212" />
                    </div>

                    <FlowArrow />

                    <GroupLabel>Outcome data</GroupLabel>
                    <ul className="mt-3 grid list-none grid-cols-1 gap-2.5 p-0">
                      {OUTCOME_DATA.map((o) => (
                        <li key={o} className="min-w-0">
                          <div
                            className="tp-tile flex items-center gap-3 rounded-xl border px-4 py-3"
                            style={{ '--t': '59, 130, 246' }}
                          >
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{
                                backgroundColor: 'rgb(59, 130, 246)',
                                boxShadow: '0 0 8px rgba(59,130,246,0.8)',
                              }}
                              aria-hidden="true"
                            />
                            <span className="min-w-0 break-words font-sans text-[13px] font-medium text-white/85">
                              {o}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-4 py-3.5">
                    <p className="font-sans text-[12.5px] leading-[1.6] text-white/60">
                      Combined with tissue data according to the study design.
                    </p>
                  </div>
                </div>
              }
            >
              <p className={bodyText}>
                A <Hl>Treatment Predict™ research study</Hl> may combine tissue data with{' '}
                <Hl>treatment exposure</Hl>, <Hl>response classification</Hl>, <Hl>recurrence</Hl>,{' '}
                <Hl>progression-free survival</Hl> or <Hl>overall survival</Hl>.
              </p>
            </Section>

            {/* 03 */}
            <Section
              section={s3}
              aside={
                <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
                  {RESEARCH_OUTPUTS.map((o) => {
                    const Icon = o.icon;
                    return (
                      <li
                        key={o.title}
                        className="tp-tile flex min-w-0 flex-col rounded-2xl border p-4"
                        style={{ '--t': o.a }}
                      >
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-white/[0.12]"
                          style={{ backgroundColor: `rgba(${o.a}, 0.14)` }}
                          aria-hidden="true"
                        >
                          <Icon className="h-4 w-4" style={{ color: `rgb(${o.a})` }} strokeWidth={1.8} />
                        </span>
                        <span className="mt-3 break-words font-sans text-[13.5px] font-semibold leading-snug text-white">
                          {o.title}
                        </span>
                        {o.meter && (
                          <span
                            className="mt-3 block h-2 w-full rounded-full"
                            style={{ backgroundImage: 'linear-gradient(90deg, #3B82F6, #A855F7, #EC4899)' }}
                            aria-hidden="true"
                          />
                        )}
                        {o.groups && (
                          <span className="mt-3 flex flex-wrap gap-1.5" aria-hidden="true">
                            {[
                              ['Group A', '59, 130, 246'],
                              ['Group B', '168, 85, 247'],
                              ['Group C', '236, 72, 153'],
                            ].map(([t, c]) => (
                              <span
                                key={t}
                                className="rounded-full border px-2.5 py-0.5 font-sans text-[11px] font-semibold text-white/90"
                                style={{ borderColor: `rgba(${c}, 0.5)`, backgroundColor: `rgba(${c}, 0.16)` }}
                              >
                                {t}
                              </span>
                            ))}
                          </span>
                        )}
                      </li>
                    );
                  })}
                  <li className="min-w-0 rounded-2xl border border-white/[0.09] bg-white/[0.03] p-4">
                    <GroupLabel>Exploratory</GroupLabel>
                    <p className="mt-2 font-sans text-[12.5px] leading-[1.6] text-white/60">
                      Outputs depend on the study design.
                    </p>
                  </li>
                </ul>
              }
            >
              <p className={bodyText}>
                Depending on the study design, <Hl>exploratory outputs</Hl> may include response
                probability, patient stratification groups, multimodal biomarker signatures,
                resistance-associated features or research risk scores.
              </p>
            </Section>

            {/* 04 */}
            <Section
              section={s4}
              aside={
                <div className="flex flex-col gap-4">
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
                      Model scope
                    </span>
                    <p className="mt-4 break-words font-serif text-[1.35rem] font-semibold italic leading-[1.3] text-white sm:text-[1.5rem]">
                      Treatment Predict™ should not be presented as a generic therapy-response tool.
                    </p>
                  </div>

                  <div>
                    <GroupLabel>Each model must be developed around</GroupLabel>
                    <ul className="mt-3 grid list-none grid-cols-1 gap-2.5 p-0">
                      {MODEL_SCOPE.map((m) => (
                        <li key={m.label} className="min-w-0">
                          <Tile icon={m.icon} label={m.label} a={m.a} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              }
            >
              <p className={bodyText}>
                <Hl>Treatment Predict™ should not be presented as a generic therapy-response tool.</Hl>{' '}
                Each model must be developed around a <Hl>clearly defined treatment</Hl>,{' '}
                <Hl>patient population</Hl> and <Hl>clinical endpoint</Hl>.
              </p>
            </Section>

            {/* 05 */}
            <Section
              section={s5}
              aside={
                <div className="rounded-2xl border border-white/[0.09] bg-[#02050B]/60 p-4 sm:p-5">
                  <GroupLabel>Sequence</GroupLabel>
                  <div className="mt-3">
                    {ARCHITECTURE.map((a, i) => (
                      <React.Fragment key={a.label}>
                        {i > 0 && <FlowArrow />}
                        <Tile icon={a.icon} label={a.label} a={a.a} />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              }
            >
              <p className={bodyText}>
                The current <Hl>OmicMind architecture</Hl> correctly places this type of predictive
                modeling after <Hl>quantitative biomarker analysis</Hl> and{' '}
                <Hl>molecular research models</Hl>, once <Hl>appropriate clinical evidence</Hl> is
                available.
              </p>
            </Section>

            {/* 06 */}
            <Section
              section={s6}
              aside={
                <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
                  {PHARMA_PROGRAMS.map((p) => {
                    const Icon = p.icon;
                    return (
                      <li
                        key={p.title}
                        className="tp-tile flex min-w-0 flex-col rounded-2xl border p-4"
                        style={{ '--t': p.a }}
                      >
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-white/[0.12]"
                          style={{ backgroundColor: `rgba(${p.a}, 0.14)` }}
                          aria-hidden="true"
                        >
                          <Icon className="h-4 w-4" style={{ color: `rgb(${p.a})` }} strokeWidth={1.8} />
                        </span>
                        <span className="mt-3 break-words font-sans text-[13.5px] font-semibold leading-snug text-white">
                          {p.title}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              }
            >
              <p className={bodyText}>
                For <Hl>pharmaceutical and biotechnology partners</Hl>, Treatment Predict™ can
                provide a framework for retrospective clinical-trial analysis, exploratory biomarker
                development, patient stratification research and prospective co-development
                programs.
              </p>
            </Section>

            {/* 07 */}
            <Section
              section={s7}
              aside={
                <div className="flex flex-col gap-4">
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
                      Positioning
                    </span>
                    <p className="mt-4 break-words font-serif text-[1.35rem] font-semibold italic leading-[1.3] text-white sm:text-[1.5rem]">
                      Research &amp; Co-Development Program
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.09] bg-[#02050B]/60 p-4 sm:p-5">
                    <GroupLabel>Until sufficiently trained and validated</GroupLabel>
                    <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                      <Tag a="196, 181, 253">Individual therapy-specific models</Tag>
                      <Tag a="147, 197, 253">Research and co-development program</Tag>
                    </ul>
                  </div>
                </div>
              }
            >
              <p className={bodyText}>
                Until individual therapy-specific models are sufficiently trained and validated,
                this capability should be presented as a{' '}
                <span className="rounded-md bg-[#EC4899]/15 px-1.5 py-0.5 font-semibold text-[#F9A8D4]">
                  research and co-development program
                </span>{' '}
                rather than a validated clinical treatment-selection.
              </p>
            </Section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
