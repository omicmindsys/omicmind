import React, { useEffect, useMemo, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDown,
  BrainCircuit,
  Dna,
  Flame,
  FlaskConical,
  Gauge,
  Layers,
  Microscope,
  ShieldCheck,
  Target,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import molecularImg from '../assets/molecular.webp';

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

/* ================================================================
   Illustrative H&E tile with a heatmap overlay. Deterministic
   (seeded) so it renders identically on every load — decoration,
   never data.
================================================================ */

function seeded(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildTissue(seed) {
  const rand = seeded(seed);
  const nuclei = [];
  for (let i = 0; i < 150; i += 1) {
    nuclei.push({
      x: rand() * 320,
      y: rand() * 220,
      rx: 2 + rand() * 2.6,
      ry: 1.6 + rand() * 1.8,
      rot: Math.round(rand() * 180),
      o: 0.45 + rand() * 0.45,
    });
  }
  return nuclei;
}

function TissueSchematic() {
  const nuclei = useMemo(() => buildTissue(42), []);
  return (
    <svg viewBox="0 0 320 220" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <radialGradient id="mp-eosin" cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor="#F5C6DA" />
          <stop offset="100%" stopColor="#D98DB4" />
        </radialGradient>
        <radialGradient id="mp-heat-a" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EC4899" stopOpacity="0.75" />
          <stop offset="55%" stopColor="#A855F7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mp-heat-b" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="220" fill="url(#mp-eosin)" />
      {nuclei.map((n, i) => (
        <ellipse
          key={i}
          cx={n.x}
          cy={n.y}
          rx={n.rx}
          ry={n.ry}
          transform={`rotate(${n.rot} ${n.x.toFixed(1)} ${n.y.toFixed(1)})`}
          fill="#5B2A86"
          opacity={n.o}
        />
      ))}
      <ellipse cx="205" cy="95" rx="92" ry="70" fill="url(#mp-heat-a)" />
      <ellipse cx="82" cy="165" rx="70" ry="48" fill="url(#mp-heat-b)" />
    </svg>
  );
}

/* ================================================================
   Content
================================================================ */

const SECTIONS = [
  { id: 'primary-input', n: '01', title: 'H&E as the Primary Imaging Input', icon: Microscope, a: '124, 58, 237', b: '168, 85, 247' },
  { id: 'research-outputs', n: '02', title: 'Probability-Based Research Outputs', icon: Gauge, a: '168, 85, 247', b: '236, 72, 153' },
  { id: 'applications', n: '03', title: 'Initial Research Applications', icon: Target, a: '59, 130, 246', b: '124, 58, 237' },
  { id: 'research-use-only', n: '04', title: 'Research Use Only', icon: ShieldCheck, a: '236, 72, 153', b: '168, 85, 247' },
];

const GROUND_TRUTH = ['NGS', 'PCR', 'FISH', 'IHC'];

const IMAGE_FEATURES = [
  'Tissue architecture',
  'Cell morphology',
  'Stromal patterns',
  'Tumor heterogeneity',
];

const OUTPUTS = [
  { title: 'Biomarker likelihood score', icon: Gauge, a: '168, 85, 247' },
  { title: 'Model confidence', icon: BrainCircuit, a: '59, 130, 246' },
  { title: 'High / Intermediate / Low probability classification', icon: Layers, a: '236, 72, 153', tiers: true },
  { title: 'Predictive heatmaps', icon: Flame, a: '244, 114, 182', heat: true },
];

const DISEASES = [
  {
    name: 'Breast Cancer',
    a: '236, 72, 153',
    b: '168, 85, 247',
    targets: ['PIK3CA', 'TP53', 'HRD-associated morphology'],
    text: (
      <>
        In <Hl>Breast Cancer</Hl>, initial research targets can include PIK3CA, TP53 and
        HRD-associated morphology, which are already defined within the current breast program
        architecture.
      </>
    ),
  },
  {
    name: 'NSCLC',
    a: '59, 130, 246',
    b: '124, 58, 237',
    targets: ['EGFR', 'KRAS G12C', 'ALK/ROS1-associated morphology'],
    text: (
      <>
        In <Hl>NSCLC</Hl>, research models can investigate EGFR, KRAS G12C and selected
        ALK/ROS1-associated morphology.
      </>
    ),
  },
  {
    name: 'Colorectal Cancer',
    a: '94, 234, 212',
    b: '59, 130, 246',
    targets: ['MSI-H/dMMR likelihood', 'BRAF V600E', 'KRAS/NRAS-associated morphology'],
    text: (
      <>
        In <Hl>Colorectal Cancer</Hl>, Molecular Predict™ can focus initially on MSI-H/dMMR
        likelihood, BRAF V600E and KRAS/NRAS-associated morphology.
      </>
    ),
  },
];

const RUO_USES = [
  'Molecular prescreening',
  'Retrospective cohort enrichment',
  'Biomarker discovery',
  'Exploratory research',
];

/* A numbered glass card: number + icon + title on the left column, an
   optional `aside` on the right from lg up, and an optional full-width
   `wide` block underneath. */
function Section({ section, children, aside, wide }) {
  const Icon = section.icon;
  return (
    <article
      id={section.id}
      data-reveal
      className="mp-card relative scroll-mt-28 overflow-hidden rounded-[28px] border p-6 backdrop-blur-xl sm:p-9 lg:p-12"
      style={{ '--a': section.a, '--b': section.b }}
    >
      <span className="mp-card-glow pointer-events-none absolute inset-0 rounded-[28px]" aria-hidden="true" />
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

      {wide && <div className="relative mt-10">{wide}</div>}
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

/* ================================================================ */

export default function MolecularPredict() {
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
        gsap.set('[data-reveal], .mp-hero-copy > *, .mp-stage', { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.mp-hero-copy > *', { autoAlpha: 0, y: 26, duration: 0.9, stagger: 0.1 }, 0.15)
        .from('.mp-stage', { autoAlpha: 0, y: 30, scale: 0.96, duration: 1.05 }, 0.35);

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
        .mp-card {
          background-color: rgba(11, 16, 32, 0.55);
          border-color: rgba(255, 255, 255, 0.09);
          box-shadow: 0 30px 70px -44px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.04);
          transition: border-color 380ms ease-out, box-shadow 380ms ease-out;
        }
        .mp-card:hover {
          border-color: rgba(var(--a), 0.34);
          box-shadow:
            0 30px 70px -44px rgba(0, 0, 0, 0.9),
            0 0 40px -14px rgba(var(--a), 0.35),
            0 0 60px -24px rgba(var(--b), 0.3);
        }
        .mp-card-glow {
          background-image:
            radial-gradient(48% 60% at 100% 0%, rgba(var(--a), 0.13) 0%, rgba(0, 0, 0, 0) 72%),
            radial-gradient(44% 56% at 0% 100%, rgba(var(--b), 0.08) 0%, rgba(0, 0, 0, 0) 74%);
        }
        .mp-tile {
          border-color: rgba(255, 255, 255, 0.09);
          background-color: rgba(255, 255, 255, 0.04);
          transition: border-color 300ms ease-out, background-color 300ms ease-out, box-shadow 300ms ease-out, transform 300ms ease-out;
        }
        .mp-tile:hover {
          border-color: rgba(var(--t), 0.4);
          background-color: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 34px -14px rgba(var(--t), 0.55);
          transform: translateY(-2px);
        }
        @media (prefers-reduced-motion: reduce) {
          .mp-tile:hover { transform: none; }
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
              <div className="mp-hero-copy w-full min-w-0 max-w-2xl lg:max-w-none">
                <Eyebrow>Platform · Molecular Predict™</Eyebrow>

                <h1 className="mt-7 break-words font-serif text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.015em] text-white sm:text-[3rem] lg:text-[3.4rem]">
                  H&amp;E-to-Molecular{' '}
                  <span className="mt-2 block italic text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#E879F9] to-[#93C5FD]">
                    Biomarker Prediction
                  </span>
                </h1>

                <p className={`mt-7 max-w-xl ${bodyText} sm:text-[17px]`}>
                  <Hl>Molecular Predict™</Hl> investigates whether clinically and biologically
                  relevant molecular phenotypes can be inferred directly from routine H&amp;E
                  morphology.
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

              {/* Hero visual — illustrative H&E tile with a heatmap overlay */}
              <div className="mp-stage relative w-full min-w-0">
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
                      <Microscope className="h-4 w-4 text-[#C4B5FD]" strokeWidth={1.8} aria-hidden="true" />
                      H&amp;E whole-slide image
                    </span>
                    <span className="font-sans text-[11px] font-medium text-white/45">
                      Illustrative schematic
                    </span>
                  </div>

                  <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/[0.09]">
                    <img
                      src={molecularImg}
                      width={1944}
                      height={809}
                      alt="H&E whole-slide image used for molecular biomarker prediction"
                      loading="eager"
                      decoding="async"
                      className="block h-auto w-full"
                    />
                  </div>

                  <div className="relative mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.04] px-3.5 py-2.5">
                      <Flame className="h-4 w-4 shrink-0 text-[#F472B6]" strokeWidth={1.8} aria-hidden="true" />
                      <span className="min-w-0 font-sans text-[12.5px] font-medium text-white/80">
                        Predictive heatmaps
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.04] px-3.5 py-2.5">
                      <Dna className="h-4 w-4 shrink-0 text-[#93C5FD]" strokeWidth={1.8} aria-hidden="true" />
                      <span className="min-w-0 font-sans text-[12.5px] font-medium text-white/80">
                        Molecular phenotypes
                      </span>
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
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="mp-tile rounded-xl border px-4 py-3.5" style={{ '--t': '168, 85, 247' }}>
                      <GroupLabel>Primary imaging input</GroupLabel>
                      <p className="mt-2 flex items-center gap-2 font-sans text-[13.5px] font-semibold text-white">
                        <Microscope className="h-4 w-4 shrink-0 text-[#C4B5FD]" strokeWidth={1.8} aria-hidden="true" />
                        H&amp;E whole-slide image
                      </p>
                    </div>
                    <div className="mp-tile rounded-xl border px-4 py-3.5" style={{ '--t': '94, 234, 212' }}>
                      <GroupLabel>Ground truth</GroupLabel>
                      <ul className="mt-2 grid list-none grid-cols-4 gap-1.5 p-0">
                        {GROUND_TRUTH.map((g) => (
                          <li
                            key={g}
                            className="flex items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.05] px-1 py-1.5 font-sans text-[12px] font-semibold text-white"
                          >
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <FlowArrow />

                  <div className="mp-tile rounded-xl border px-4 py-3.5" style={{ '--t': '59, 130, 246' }}>
                    <p className="flex items-center gap-2 font-sans text-[13.5px] font-semibold text-white">
                      <BrainCircuit className="h-4 w-4 shrink-0 text-[#93C5FD]" strokeWidth={1.8} aria-hidden="true" />
                      Deep-learning models
                    </p>
                    <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                      {IMAGE_FEATURES.map((f) => (
                        <Tag key={f} a="147, 197, 253">
                          {f}
                        </Tag>
                      ))}
                    </ul>
                  </div>

                  <FlowArrow />

                  <div className="mp-tile rounded-xl border px-4 py-3.5" style={{ '--t': '236, 72, 153' }}>
                    <p className="flex items-center gap-2 font-sans text-[13.5px] font-semibold text-white">
                      <Dna className="h-4 w-4 shrink-0 text-[#F9A8D4]" strokeWidth={1.8} aria-hidden="true" />
                      Morphological signatures
                    </p>
                  </div>
                </div>
              }
            >
              <p className={bodyText}>
                The <Hl>H&amp;E whole-slide image</Hl> serves as the primary imaging input, while
                validated molecular results from <Hl>NGS</Hl>, <Hl>PCR</Hl>, <Hl>FISH</Hl> or{' '}
                <Hl>IHC</Hl> provide <Hl>ground truth</Hl> for model development.{' '}
                <Hl>Deep-learning</Hl> models can analyze tissue architecture, cell morphology,
                stromal patterns, tumor heterogeneity and other image-derived features to identify{' '}
                <Hl>morphological signatures</Hl> associated with specific molecular states.
              </p>
            </Section>

            {/* 02 */}
            <Section
              section={s2}
              aside={
                <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
                  {OUTPUTS.map((o) => {
                    const Icon = o.icon;
                    return (
                      <li
                        key={o.title}
                        className="mp-tile flex min-w-0 flex-col rounded-2xl border p-4"
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
                        {o.tiers && (
                          <span className="mt-3 flex flex-wrap gap-1.5" aria-hidden="true">
                            {[
                              ['High', '236, 72, 153'],
                              ['Intermediate', '168, 85, 247'],
                              ['Low', '59, 130, 246'],
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
                        {o.heat && (
                          <span
                            className="mt-3 block h-2 w-full rounded-full"
                            style={{ backgroundImage: 'linear-gradient(90deg, #3B82F6, #A855F7, #EC4899)' }}
                            aria-hidden="true"
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              }
            >
              <p className={bodyText}>
                Instead of providing a definitive molecular diagnosis, <Hl>Molecular Predict™</Hl> is
                designed to generate probability-based research outputs. These may include a{' '}
                <Hl>biomarker likelihood score</Hl>, <Hl>model confidence</Hl>,{' '}
                <Hl>high/intermediate/low probability classification</Hl> and{' '}
                <Hl>predictive heatmaps</Hl> highlighting tissue regions most strongly associated
                with a particular molecular phenotype.
              </p>
            </Section>

            {/* 03 */}
            <Section
              section={s3}
              wide={
                <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
                  {DISEASES.map((d) => (
                    <li
                      key={d.name}
                      className="mp-tile relative flex min-w-0 flex-col overflow-hidden rounded-2xl border p-5 sm:p-6"
                      style={{ '--t': d.a }}
                    >
                      <span
                        className="pointer-events-none absolute inset-x-0 top-0 h-px"
                        style={{
                          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0), rgba(${d.a}, 0.8), rgba(${d.b}, 0.5), rgba(0,0,0,0))`,
                        }}
                        aria-hidden="true"
                      />
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-white"
                          style={{
                            backgroundImage: `linear-gradient(140deg, rgb(${d.a}), rgb(${d.b}))`,
                            boxShadow: `0 10px 22px -10px rgba(${d.a}, 0.9)`,
                          }}
                          aria-hidden="true"
                        >
                          <FlaskConical className="h-[17px] w-[17px]" strokeWidth={1.8} />
                        </span>
                        <h3 className="min-w-0 break-words font-serif text-[1.35rem] font-semibold leading-tight text-white">
                          {d.name}
                        </h3>
                      </div>

                      <p className="mt-5 font-sans text-[14.5px] leading-[1.7] text-white/75 [text-wrap:pretty]">
                        {d.text}
                      </p>

                      <div className="mt-auto pt-6">
                        <GroupLabel>Research targets</GroupLabel>
                        <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                          {d.targets.map((t) => (
                            <Tag key={t} a={d.a}>
                              {t}
                            </Tag>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              }
            />

            {/* 04 */}
            <Section
              section={s4}
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
                      Research Use Only
                    </span>
                    <p className="mt-4 font-serif text-[1.35rem] font-semibold italic leading-[1.3] text-white sm:text-[1.5rem]">
                      Confirmatory molecular testing remains the reference.
                    </p>
                  </div>

                  <div>
                    <GroupLabel>Supporting</GroupLabel>
                    <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                      {RUO_USES.map((u) => (
                        <Tag key={u} a="196, 181, 253">
                          {u}
                        </Tag>
                      ))}
                    </ul>
                  </div>
                </div>
              }
            >
              <p className={bodyText}>
                The initial positioning of Molecular Predict™ should remain{' '}
                <span className="rounded-md bg-[#EC4899]/15 px-1.5 py-0.5 font-semibold text-[#F9A8D4]">
                  Research Use Only
                </span>
                , supporting molecular prescreening, retrospective cohort enrichment, biomarker
                discovery and exploratory research.{' '}
                <Hl>Confirmatory molecular testing remains the reference.</Hl>
              </p>
            </Section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
