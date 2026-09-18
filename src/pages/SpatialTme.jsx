import React, { useEffect, useMemo, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Boxes,
  Layers,
  Microscope,
  Network,
  Target,
  Telescope,
  Waypoints,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import spatialOne from '../assets/spatialOne.webp';
import imgSpatial from '../assets/archive/spatial.webp';
import imgMultimodal from '../assets/archive/multimodal.webp';
import imgCellular from '../assets/archive/celluar.webp';
import imgBeyond from '../assets/archive/beyond.webp';
import imgResearch from '../assets/archive/spatialresearch.webp';
import imgFoundation from '../assets/archive/spatialfondation.webp';
import imgTranslational from '../assets/archive/translational.webp';
import imgInsideTumor from '../assets/insidetumor.webp';
import imgSurroundingStroma from '../assets/surroundingstorma.webp';
import imgInvasiveEdge from '../assets/invasiveedge.webp';

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

/* A small label for a group of tags inside a chapter */
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
   Illustrative tissue schematics. Deterministic (seeded) so they
   render identically on every load — decoration, never data.
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

/* An irregular tumor-nest outline around (cx, cy) */
function blob(cx, cy, r, rand) {
  const p1 = rand() * Math.PI * 2;
  const p2 = rand() * Math.PI * 2;
  const pts = [];
  for (let i = 0; i < 40; i += 1) {
    const a = (i / 40) * Math.PI * 2;
    const k = 1 + 0.1 * Math.sin(3 * a + p1) + 0.06 * Math.sin(5 * a + p2);
    pts.push(`${(cx + Math.cos(a) * r * k).toFixed(1)},${(cy + Math.sin(a) * r * k).toFixed(1)}`);
  }
  return pts.join(' ');
}

function tumorCells(cx, cy, r, step, rand) {
  const cells = [];
  for (let y = cy - r; y <= cy + r; y += step) {
    for (let x = cx - r; x <= cx + r; x += step) {
      const jx = x + (rand() - 0.5) * step * 0.5;
      const jy = y + (rand() - 0.5) * step * 0.5;
      if (Math.hypot(jx - cx, jy - cy) < r * 0.8) cells.push([jx, jy]);
    }
  }
  return cells;
}

/* Where the immune cells sit relative to the nest, per mode */
const RINGS = {
  inside: [0.05, 0.7],
  edge: [0.95, 1.2],
  stroma: [1.45, 1.95],
  desert: [1.3, 1.9],
};

function buildNest(mode, seed) {
  const rand = seeded(seed);
  const W = 160;
  const H = 120;
  const cx = 80;
  const cy = 60;
  const R = 30;
  const [lo, hi] = RINGS[mode];
  const count = mode === 'desert' ? 3 : 14;
  const immune = [];
  for (let i = 0; i < count; i += 1) {
    const a = rand() * Math.PI * 2;
    const rr = R * (lo + rand() * (hi - lo));
    immune.push([
      Math.min(W - 6, Math.max(6, cx + Math.cos(a) * rr)),
      Math.min(H - 6, Math.max(6, cy + Math.sin(a) * rr)),
    ]);
  }
  return {
    outline: blob(cx, cy, R, rand),
    tumor: tumorCells(cx, cy, R, 7, rand),
    immune,
  };
}

function StromaFibers({ w, h, n, seed }) {
  const rand = seeded(seed);
  return Array.from({ length: n }, (_, i) => {
    const y0 = rand() * h;
    const y1 = rand() * h;
    const c1 = rand() * h;
    return (
      <path
        key={i}
        d={`M -10 ${y0.toFixed(1)} Q ${(w / 2).toFixed(1)} ${c1.toFixed(1)} ${w + 10} ${y1.toFixed(1)}`}
        fill="none"
        stroke="rgba(94,234,212,0.13)"
        strokeWidth="1"
      />
    );
  });
}

function Nest({ mode, seed }) {
  const d = useMemo(() => buildNest(mode, seed), [mode, seed]);
  return (
    <svg viewBox="0 0 160 120" className="block h-auto w-full" aria-hidden="true">
      <StromaFibers w={160} h={120} n={7} seed={seed + 11} />
      <polygon
        points={d.outline}
        fill="rgba(236,72,153,0.10)"
        stroke="rgba(244,114,182,0.55)"
        strokeWidth="1"
      />
      {d.tumor.map(([x, y], i) => (
        <circle key={`t${i}`} cx={x} cy={y} r="1.7" fill="rgba(244,114,182,0.7)" />
      ))}
      {d.immune.map(([x, y], i) => (
        <g key={`i${i}`}>
          <circle cx={x} cy={y} r="4.6" fill="rgba(167,139,250,0.18)" />
          <circle cx={x} cy={y} r="2.3" fill="#C4B5FD" />
        </g>
      ))}
    </svg>
  );
}

/* ================================================================
   Chapters
================================================================ */

const CHAPTERS = [
  { id: 'spatial-tme', n: '01', title: 'Spatial TME™', icon: Waypoints, a: '124, 58, 237', b: '168, 85, 247', img: { src: imgSpatial, w: 382, h: 510 } },
  { id: 'multimodal', n: '02', title: 'Multimodal Tissue & IHC Analysis', icon: Microscope, a: '168, 85, 247', b: '236, 72, 153', img: { src: imgMultimodal, w: 378, h: 510 } },
  { id: 'cellular', n: '03', title: 'Spatial Cellular Analysis', icon: Network, a: '59, 130, 246', b: '124, 58, 237', img: { src: imgCellular, w: 381, h: 510 } },
  { id: 'beyond-positivity', n: '04', title: 'Beyond Biomarker Positivity', icon: Target, a: '236, 72, 153', b: '168, 85, 247', img: { src: imgBeyond, w: 383, h: 510 } },
  { id: 'outputs', n: '05', title: 'Spatial Research Outputs', icon: Boxes, a: '124, 58, 237', b: '59, 130, 246', img: { src: imgResearch, w: 563, h: 509 } },
  { id: 'foundation', n: '06', title: 'OmicMind Spatial Foundation', icon: Layers, a: '99, 102, 241', b: '168, 85, 247', img: { src: imgFoundation, w: 444, h: 509 } },
  { id: 'applications', n: '07', title: 'Translational Research Applications', icon: Telescope, a: '59, 130, 246', b: '236, 72, 153', img: { src: imgTranslational, w: 521, h: 509 } },
];

const MARKERS = ['PanCK', 'PD-L1', 'CD3', 'CD8', 'FOXP3', 'CD68'];

const QUANTIFIED = [
  'Intratumoral and stromal immune densities',
  'Tumor infiltration',
  'Immune exclusion',
  'Tumor-to-immune-cell distances',
  'Cell clustering',
  'Spatial neighborhoods',
];

const LOCATIONS = [
  { mode: 'inside', label: 'Inside tumor nests', seed: 21, img: imgInsideTumor },
  { mode: 'stroma', label: 'Confined to surrounding stroma', seed: 34, img: imgSurroundingStroma },
  { mode: 'edge', label: 'Concentrated at the invasive edge', seed: 55, img: imgInvasiveEdge },
];

const OUTPUTS = [
  'CD8 infiltration score',
  'Immune-exclusion score',
  'Treg/CD8 relationships',
  'Macrophage distribution',
  'Spatial immune phenotypes',
];

const FOUNDATION = [
  'Tissue compartment segmentation',
  'Single-cell geometry',
  'Synchronized multi-stain viewing',
  'Compartment-aware immune quantification',
];

const APPLICATIONS = [
  'Translational oncology',
  'Tumor microenvironment characterization',
  'Biomarker discovery',
  'Retrospective cohort analysis',
  'Research into biological mechanisms associated with therapeutic sensitivity and resistance',
];

function Chapter({ chapter, children, wide }) {
  const Icon = chapter.icon;
  return (
    <article
      id={chapter.id}
      data-reveal
      className="sp-card relative scroll-mt-28 overflow-hidden rounded-[28px] border p-6 backdrop-blur-xl sm:p-9 lg:p-12"
      style={{ '--a': chapter.a, '--b': chapter.b }}
    >
      <span className="sp-card-glow pointer-events-none absolute inset-0 rounded-[28px]" aria-hidden="true" />
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0), rgba(${chapter.a}, 0.7), rgba(${chapter.b}, 0.5), rgba(0,0,0,0))`,
        }}
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <span
              className="font-serif text-[2.6rem] font-semibold leading-none tracking-[-0.02em] text-transparent bg-clip-text sm:text-[3.2rem]"
              style={{
                backgroundImage: `linear-gradient(120deg, rgb(${chapter.a}), rgb(${chapter.b}))`,
              }}
            >
              {chapter.n}
            </span>
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-white"
              style={{
                backgroundImage: `linear-gradient(140deg, rgb(${chapter.a}), rgb(${chapter.b}))`,
                boxShadow: `0 10px 24px -10px rgba(${chapter.a}, 0.9)`,
              }}
              aria-hidden="true"
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
          </div>
          <h2 className="mt-6 break-words font-serif text-[1.85rem] font-semibold leading-[1.14] tracking-[-0.012em] text-white sm:text-[2.2rem]">
            {chapter.title}
          </h2>

          <div className="mt-7">{children}</div>
        </div>

        <div className="flex min-w-0 items-center justify-center">
          <img
            src={chapter.img.src}
            width={chapter.img.w}
            height={chapter.img.h}
            alt={chapter.title}
            loading="lazy"
            decoding="async"
            className="block h-auto max-h-[26rem] w-auto max-w-full rounded-2xl border border-white/[0.09]"
          />
        </div>
      </div>

      {wide && <div className="relative mt-10">{wide}</div>}
    </article>
  );
}

const bodyText =
  'font-sans text-[15px] font-normal leading-[1.75] text-white/75 [text-wrap:pretty] sm:text-base';

/* ================================================================ */

export default function SpatialTme() {
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

  /* ---- Paint the document ground teal so overscroll never shows the default ---- */
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
        gsap.set('[data-reveal], .sp-hero-copy > *, .sp-stage', { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.sp-hero-copy > *', { autoAlpha: 0, y: 26, duration: 0.9, stagger: 0.1 }, 0.15)
        .from('.sp-stage', { autoAlpha: 0, y: 30, scale: 0.96, duration: 1.05 }, 0.35);

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

  const [c1, c2, c3, c4, c5, c6, c7] = CHAPTERS;

  return (
    <>
      <Navbar />

      <style>{`
        .sp-card {
          background-color: rgba(11, 16, 32, 0.55);
          border-color: rgba(255, 255, 255, 0.09);
          box-shadow: 0 30px 70px -44px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.04);
          transition: border-color 380ms ease-out, box-shadow 380ms ease-out;
        }
        .sp-card:hover {
          border-color: rgba(var(--a), 0.34);
          box-shadow:
            0 30px 70px -44px rgba(0, 0, 0, 0.9),
            0 0 40px -14px rgba(var(--a), 0.35),
            0 0 60px -24px rgba(var(--b), 0.3);
        }
        .sp-card-glow {
          background-image:
            radial-gradient(48% 60% at 100% 0%, rgba(var(--a), 0.13) 0%, rgba(0, 0, 0, 0) 72%),
            radial-gradient(44% 56% at 0% 100%, rgba(var(--b), 0.08) 0%, rgba(0, 0, 0, 0) 74%);
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
              <div className="sp-hero-copy w-full min-w-0 max-w-2xl lg:max-w-none">
                <Eyebrow>Platform · Spatial TME™</Eyebrow>

                <h1 className="mt-7 break-words font-serif text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.015em] text-white sm:text-[3rem] lg:text-[3.4rem]">
                  AI-Powered Tumor Microenvironment{' '}
                  <span className="mt-2 block italic text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#E879F9] to-[#93C5FD]">
                    and Spatial Biomarker Intelligence
                  </span>
                </h1>

                {/* Chapter index */}
                <nav aria-label="On this page" className="mt-10">
                  <ol className="grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
                    {CHAPTERS.map((c) => (
                      <li key={c.id} className="min-w-0">
                        <a
                          href={`#${c.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            jumpTo(c.id);
                          }}
                          className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 backdrop-blur-md transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.08]"
                        >
                          <span
                            className="shrink-0 font-sans text-[11px] font-semibold tracking-[0.14em]"
                            style={{ color: `rgb(${c.b})` }}
                          >
                            {c.n}
                          </span>
                          <span className="min-w-0 break-words font-sans text-[13px] font-medium leading-snug text-white/80 group-hover:text-white">
                            {c.title}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              {/* Hero image */}
              <div className="sp-stage relative w-full min-w-0">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[26px] border border-white/[0.12] bg-[#052A2B] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] lg:aspect-[4/3]">
                  <img
                    src={spatialOne}
                    alt="Spatial tumor microenvironment tissue analysis"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            CHAPTERS
        ============================================================ */}
        <section
          className="relative pb-24 lg:pb-32"
          style={{ backgroundImage: 'linear-gradient(180deg, #050816 0%, #081225 18%, #0B1020 60%, #02050B 100%)' }}
        >
          <Lighting variant="b" />
          <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-6 px-6 lg:gap-8 lg:px-10">
            {/* 01 */}
            <Chapter chapter={c1}>
              <p className={`${bodyText} sm:text-[17px]`}>
                <Hl>Spatial TME™</Hl> is designed to understand not only which cells are present
                within a tumor, but where they are located and how they are spatially organized
                relative to malignant tissue.
              </p>
            </Chapter>

            {/* 02 */}
            <Chapter chapter={c2}>
              <p className={bodyText}>
                The platform can combine <Hl>H&amp;E</Hl> with <Hl>IHC</Hl> or{' '}
                <Hl>multiplex IHC</Hl> markers such as PanCK, PD-L1, CD3, CD8, FOXP3 and CD68 to
                identify tumor, stroma and immune-cell populations.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2">
                <div>
                  <GroupLabel>Markers</GroupLabel>
                  <ul className="mt-3 grid list-none grid-cols-3 gap-2 p-0">
                    {MARKERS.map((m) => (
                      <li
                        key={m}
                        className="flex items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] px-2 py-2.5 font-sans text-[13px] font-semibold tracking-[0.02em] text-white"
                      >
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <GroupLabel>Populations identified</GroupLabel>
                  <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                    <Tag a="244, 114, 182">Tumor</Tag>
                    <Tag a="94, 234, 212">Stroma</Tag>
                    <Tag a="196, 181, 253">Immune-cell populations</Tag>
                  </ul>
                </div>
              </div>
            </Chapter>

            {/* 03 */}
            <Chapter chapter={c3}>
              <p className={bodyText}>
                Once these cellular populations are detected, the system can quantify intratumoral
                and stromal immune densities, tumor infiltration, immune exclusion,
                tumor-to-immune-cell distances, cell clustering and spatial neighborhoods.
              </p>

              <ul className="mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
                {QUANTIFIED.map((q, i) => (
                  <li
                    key={q}
                    className="flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.04] px-4 py-3"
                  >
                    <span className="shrink-0 font-sans text-[11px] font-semibold tracking-[0.14em] text-[#93C5FD]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 break-words font-sans text-[13.5px] font-medium leading-snug text-white/85">
                      {q}
                    </span>
                  </li>
                ))}
              </ul>
            </Chapter>

            {/* 04 */}
            <Chapter
              chapter={c4}
              wide={
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <GroupLabel>Where CD8-positive cells are located</GroupLabel>
                    <span className="font-sans text-[11px] font-medium text-white/45">
                      Illustrative schematic
                    </span>
                  </div>
                  <ul className="mt-4 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
                    {LOCATIONS.map((l) => (
                      <li
                        key={l.mode}
                        className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#02050B]/60"
                      >
                        <img
                          src={l.img}
                          alt={l.label}
                          width={1536}
                          height={1024}
                          loading="lazy"
                          decoding="async"
                          className="block h-auto w-full max-w-full"
                        />
                        <p className="border-t border-white/[0.07] px-4 py-3 font-sans text-[13px] font-medium leading-snug text-white/85">
                          {l.label}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            >
              <p className="font-serif text-[1.5rem] font-semibold italic leading-[1.3] tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-r from-[#F9A8D4] via-[#E879F9] to-[#C4B5FD] sm:text-[1.75rem]">
                This enables Omic Mind to move beyond simple biomarker positivity.
              </p>
              <p className={`mt-5 ${bodyText}`}>
                A tumor with a high number of <Hl>CD8-positive cells</Hl> may behave biologically
                very differently depending on whether those cells are located inside tumor nests,
                confined to surrounding stroma or concentrated at the invasive edge.
              </p>
            </Chapter>

            {/* 05 */}
            <Chapter chapter={c5}>
              <p className={bodyText}>
                <Hl>Spatial TME™</Hl> can generate structured research outputs such as CD8
                infiltration score, immune-exclusion score, Treg/CD8 relationships, macrophage
                distribution and spatial immune phenotypes. Tumors may also be characterized using
                research categories such as inflamed, immune-excluded and immune-desert based on the
                architecture of their immune microenvironment.
              </p>

              <div className="mt-8">
                <GroupLabel>Structured research outputs</GroupLabel>
                <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                  {OUTPUTS.map((o) => (
                    <Tag key={o} a={c5.a}>
                      {o}
                    </Tag>
                  ))}
                </ul>
              </div>
            </Chapter>

            {/* 06 */}
            <Chapter chapter={c6}>
              <p className={bodyText}>
                The core <Hl>OmicMind</Hl> platform already includes tissue compartment
                segmentation, single-cell geometry, synchronized multi-stain viewing and
                compartment-aware immune quantification, providing the technical foundation for
                spatial research applications.
              </p>

              <ul className="mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
                {FOUNDATION.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.04] px-4 py-3"
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#A855F7] text-white"
                      aria-hidden="true"
                    >
                      <Layers className="h-3.5 w-3.5" strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0 break-words font-sans text-[13.5px] font-medium leading-snug text-white/85">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </Chapter>

            {/* 07 */}
            <Chapter chapter={c7}>
              <p className={bodyText}>
                <Hl>Spatial TME™</Hl> is intended to support translational oncology, tumor
                microenvironment characterization, biomarker discovery, retrospective cohort analysis
                and research into biological mechanisms associated with therapeutic sensitivity and
                resistance.
              </p>

              <div className="mt-8">
                <GroupLabel>Intended to support</GroupLabel>
                <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                  {APPLICATIONS.map((a) => (
                    <Tag key={a} a={c7.a}>
                      {a}
                    </Tag>
                  ))}
                </ul>
              </div>
            </Chapter>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
