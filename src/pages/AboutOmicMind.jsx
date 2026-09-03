import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck2,
  Globe2,
  HeartPulse,
  Landmark,
  Layers,
  Lightbulb,
  Microscope,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { routeLinkProps } from '../router.jsx';
import heTissue from '../assets/h&eclassification.webp';
import ihcStain from '../assets/ihc3.webp';
import quantIhc from '../assets/quantihc.webp';
import spatialMap from '../assets/spatial.webp';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   About OmicMind AI

   Built on the same shell the other chapter pages use: white ground,
   #111827 copy, the site's violet→pink ramp (#7C3AED → #A855F7 →
   #EC4899) kept for accents, and the same eyebrow, card, radius and
   shadow vocabulary. Nothing here introduces a token the rest of the
   site does not already use.
================================================================ */

/* The chapter's own tab row. Only this page exists as a route today, so
   it is the only entry carrying an href; the rest are marked inert and
   rendered as plain tabs rather than as links that would go nowhere. The
   moment one of them gets a page, giving it an `href` here is the whole
   of the change. */
const SUB_NAV = [
  { label: 'About Us', href: '/company/about' },
  { label: 'Leadership' },
  { label: 'Advisory Board' },
  { label: 'Careers' },
  { label: 'Newsroom' },
  { label: 'Partners' },
  { label: 'Contact Us' },
];

const HERO_MARKS = [
  { Icon: Sparkles, label: 'AI-Driven Innovation' },
  { Icon: Microscope, label: 'Science & Clinical Excellence' },
  { Icon: HeartPulse, label: 'Patient-Centric Impact' },
];

/* The four tiles laid over the hero panel. Each carries a real frame from
   the site's own imagery rather than a stand-in, and each is placed and
   sized as a share of the panel, so the scatter holds its arrangement at
   every width instead of needing geometry per breakpoint. */
const HERO_TILES = [
  { src: heTissue, alt: 'H&E tissue section', style: { top: '6%', right: '30%', width: '30%' } },
  { src: ihcStain, alt: 'IHC stain', style: { top: '26%', right: '3%', width: '36%' } },
  { src: spatialMap, alt: 'Spatial heatmap', style: { top: '56%', right: '26%', width: '32%' } },
  { src: quantIhc, alt: 'Quantified IHC field', style: { top: '78%', right: '2%', width: '24%' } },
];

/* The counts are the ones supplied for this page — they are claims about
   the company, and they are rendered exactly as given, not rounded,
   embellished or added to. */
const STATS = [
  { Icon: Building2, value: '100+', label: 'Research Institutions Collaborated' },
  { Icon: Globe2, value: '40+', label: 'Countries Served' },
  { Icon: Layers, value: '1M+', label: 'WSI Slides Analyzed' },
  { Icon: Activity, value: '50+', label: 'Biomarkers Supported' },
  {
    Icon: ShieldCheck,
    value: null,
    headline: 'Secure & Compliant',
    label: 'HIPAA, GDPR & ISO 27001 Certified',
  },
];

/* ---- Leadership ----

   Left empty on purpose. These cards name real people, give them titles
   and put words in their mouths, and none of that is inventable: a
   plausible-looking name and biography on a company's own About page
   reads as a statement of fact about a person who either does not exist
   or did not say it. The layout, the carousel and the card are finished
   and waiting — fill `name`, `title`, `bio` and optionally `linkedin`
   and `photo` here, and each card renders in full. Until then each shows
   as an unfilled slot rather than as a fabricated colleague. */
const LEADERSHIP = [
  { name: '', title: '', bio: '', linkedin: '', photo: '' },
  { name: '', title: '', bio: '', linkedin: '', photo: '' },
  { name: '', title: '', bio: '', linkedin: '', photo: '' },
  { name: '', title: '', bio: '', linkedin: '', photo: '' },
];

const VALUES = [
  {
    Icon: Scale,
    title: 'Integrity',
    body: 'Evidence before claims. Every result is traceable to the data and the method that produced it.',
  },
  {
    Icon: Lightbulb,
    title: 'Innovation',
    body: 'Research-grade methods, built to survive contact with routine clinical practice.',
  },
  {
    Icon: Users,
    title: 'Collaboration',
    body: 'Pathologists, oncologists and data scientists working on one shared specimen record.',
  },
  {
    Icon: TrendingUp,
    title: 'Impact',
    body: 'Measured where it counts — earlier answers, better stratification, better outcomes.',
  },
];

/* Compliance statements, rendered exactly as supplied. The qualifier on
   the last one is part of the claim and is kept with it. */
const CERTIFICATIONS = [
  { Icon: ShieldCheck, label: 'HIPAA Compliant' },
  { Icon: BadgeCheck, label: 'GDPR' },
  { Icon: FileCheck2, label: 'ISO 27001 Certified' },
  { Icon: Landmark, label: 'CE IVDR Compliant' },
  { Icon: FileCheck2, label: 'FDA Compliant (Planned)' },
];

/* ================================================================
   Shared pieces — the same ones the other chapter pages define.
================================================================ */

function SectionLabel({ children }) {
  return (
    <h2 className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#7C3AED]">
      {children}
    </h2>
  );
}

function Lighting({ variant = 'a' }) {
  const images = {
    a: 'radial-gradient(52% 58% at 84% 12%, rgba(124,58,237,0.10) 0%, rgba(255,255,255,0) 70%), radial-gradient(46% 52% at 8% 78%, rgba(236,72,153,0.08) 0%, rgba(255,255,255,0) 72%)',
    b: 'radial-gradient(50% 55% at 12% 14%, rgba(168,85,247,0.09) 0%, rgba(255,255,255,0) 70%), radial-gradient(44% 50% at 90% 84%, rgba(236,72,153,0.07) 0%, rgba(255,255,255,0) 72%)',
  };
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ backgroundImage: images[variant] }}
      aria-hidden="true"
    />
  );
}

const HEX = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

/* The one brand mark on the page. lucide dropped its brand set at v1, so
   this is drawn rather than imported — a solid glyph, set a shade smaller
   than the outlined icons around it so the two read at the same weight. */
function LinkedInMark({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4V9z" />
    </svg>
  );
}

/* The helix at the centre of the hero panel — geometry and gradient only,
   so it stays sharp at any size and costs the page nothing to load. */
function Helix() {
  /* Two strands a half-period apart, with rungs struck between them at a
     fixed interval. Generated rather than hand-plotted so the curve is
     actually periodic and the rungs actually land on it. */
  const H = 420;
  const midX = 110;
  const amp = 62;
  const turns = 2.4;
  const at = (t, phase) => ({
    x: midX + amp * Math.sin(t * Math.PI * 2 * turns + phase),
    y: t * H,
  });
  const strand = (phase) =>
    Array.from({ length: 81 }, (_, i) => {
      const { x, y } = at(i / 80, phase);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');

  const rungs = Array.from({ length: 17 }, (_, i) => {
    const t = (i + 0.5) / 17;
    const a = at(t, 0);
    const b = at(t, Math.PI);
    /* Rungs seen near edge-on are the ones at the crossings; fading them
       is what reads as depth rather than as a flat ladder. */
    const openness = Math.abs(Math.sin(t * Math.PI * 2 * turns));
    return { a, b, o: 0.25 + openness * 0.65 };
  });

  return (
    <svg viewBox="0 0 220 420" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="abtStrandA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5F3FF" />
          <stop offset="1" stopColor="#C4B5FD" />
        </linearGradient>
        <linearGradient id="abtStrandB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F9A8D4" />
          <stop offset="1" stopColor="#E879F9" />
        </linearGradient>
      </defs>

      {rungs.map(({ a, b, o }, i) => (
        <line
          key={i}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke="#DDD6FE"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={o * 0.55}
        />
      ))}

      <path d={strand(0)} fill="none" stroke="url(#abtStrandA)" strokeWidth="5" strokeLinecap="round" />
      <path
        d={strand(Math.PI)}
        fill="none"
        stroke="url(#abtStrandB)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {rungs.map(({ a, b, o }, i) => (
        <g key={`n-${i}`} opacity={o}>
          <circle cx={a.x} cy={a.y} r="3.6" fill="#EDE9FE" />
          <circle cx={b.x} cy={b.y} r="3.6" fill="#FBCFE8" />
        </g>
      ))}
    </svg>
  );
}

/* ================================================================ */

export default function AboutOmicMind() {
  const rootRef = useRef(null);
  const railRef = useRef(null);

  /* ---- Smooth scroll (same configuration the rest of the site uses) ---- */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
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

  /* ---- Entrance, reveals and the hero's ambient motion ---- */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set('[data-reveal], .abt-tile', { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .from('.abt-hero-copy > *', { autoAlpha: 0, y: 26, duration: 0.9, stagger: 0.11 }, 0.15)
        .from('.abt-hero-panel', { autoAlpha: 0, y: 28, scale: 0.97, duration: 1.1 }, 0.3)
        .from('.abt-tile', { autoAlpha: 0, y: 20, scale: 0.9, duration: 0.75, stagger: 0.1 }, 0.7);

      /* The helix turns slowly on its vertical axis, and the tiles breathe
         on their own clocks so the scatter never pulses in unison. */
      gsap.to('.abt-helix', {
        rotationY: 360,
        duration: 26,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      });

      gsap.utils.toArray('.abt-tile').forEach((tile, i) => {
        gsap.to(tile, {
          y: gsap.utils.random(-10, -5),
          duration: gsap.utils.random(3.6, 5),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1.6 + i * 0.18,
        });
      });

      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 38,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });

      gsap.utils.toArray('[data-hover-card]').forEach((card) => {
        const glow = card.querySelector('.card-glow');
        const enter = () => {
          gsap.to(card, { y: -8, duration: 0.4, ease: 'power3.out' });
          if (glow) gsap.to(glow, { opacity: 1, duration: 0.4, ease: 'power2.out' });
        };
        const leave = () => {
          gsap.to(card, { y: 0, duration: 0.4, ease: 'power3.out' });
          if (glow) gsap.to(glow, { opacity: 0, duration: 0.35, ease: 'power2.out' });
        };
        card.addEventListener('mouseenter', enter);
        card.addEventListener('mouseleave', leave);
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  /* The rail scrolls by one card and stops on it, so a nudge never leaves
     a card half off the edge. */
  const nudgeRail = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('[data-rail-card]');
    const step = card ? card.getBoundingClientRect().width + 24 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />

      <main ref={rootRef} className="relative w-full bg-white text-[#111827]">
        {/* ============================================================
            SUB-NAVIGATION + BREADCRUMB
        ============================================================ */}
        <div className="relative border-b border-gray-200 bg-white/95 pt-[86px]">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <nav aria-label="Company sections">
              {/* The row scrolls rather than wraps on a narrow screen, so the
                  tabs keep one line and the active one can always be reached. */}
              <ul className="-mb-px flex items-center gap-7 overflow-x-auto whitespace-nowrap pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SUB_NAV.map(({ label, href }) => {
                  const active = Boolean(href);
                  return (
                    <li key={label}>
                      <a
                        {...(href
                          ? routeLinkProps(href)
                          : { href: '#', onClick: (e) => e.preventDefault() })}
                        aria-current={active ? 'page' : undefined}
                        className={`inline-block border-b-2 pb-3.5 pt-1 font-sans text-[13.5px] font-semibold tracking-[0.01em] transition-colors duration-200 ${
                          active
                            ? 'border-[#7C3AED] text-[#7C3AED]'
                            : 'border-transparent text-gray-500 hover:text-[#7C3AED]'
                        }`}
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-6 pt-5 lg:px-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 font-sans text-[12.5px] font-medium text-gray-500">
              <li>
                <a {...routeLinkProps('/')} className="transition-colors hover:text-[#7C3AED]">
                  Home
                </a>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5 text-gray-400" strokeWidth={2.25} />
              </li>
              <li className="text-[#111827]">Company</li>
            </ol>
          </nav>
        </div>

        {/* ============================================================
            1 — HERO
        ============================================================ */}
        <section className="relative overflow-hidden bg-white">
          <Lighting variant="a" />

          <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-32 pt-12 lg:px-10 lg:pb-40 lg:pt-16">
            <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
              {/* ---- Copy ---- */}
              <div className="abt-hero-copy w-full min-w-0 max-w-2xl lg:max-w-none">
                <h1 className="font-serif text-[2.5rem] font-semibold leading-[1.07] tracking-[-0.015em] text-[#111827] sm:text-[3.1rem] lg:text-[3.4rem]">
                  About OmicMind AI
                </h1>

                <p className="mt-4 font-serif text-xl font-semibold italic leading-snug tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] sm:text-2xl lg:text-[1.75rem]">
                  AI-Powered Intelligence for Precision Medicine
                </p>

                <p className="mt-7 max-w-xl font-sans text-base font-normal leading-[1.7] tracking-[-0.005em] text-gray-600 [text-wrap:pretty] sm:text-lg">
                  OmicMind AI integrates digital pathology with multi-omics intelligence, learning
                  the relationships between tissue morphology and molecular biology on a single
                  specimen record. The platform turns routinely collected biomedical data into
                  insight clinicians and researchers can act on — supporting earlier diagnosis,
                  more accurate prognosis, and treatment matched to the individual patient.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  {HERO_MARKS.map(({ Icon, label }) => (
                    <span key={label} className="inline-flex items-center gap-2.5">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white shadow-[0_8px_20px_-8px_rgba(124,58,237,0.9)]"
                        aria-hidden="true"
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.9} />
                      </span>
                      <span className="font-sans text-[14px] font-semibold tracking-[-0.005em] text-[#111827]">
                        {label}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* ---- Panel: the helix, ringed by specimen tiles ----
                   The tiles are placed and sized as a share of the panel and
                   the panel holds a fixed ratio, so the whole scatter scales
                   as one piece and needs no geometry per breakpoint. */}
              <div className="abt-hero-panel relative mx-auto w-full max-w-[34rem] lg:max-w-none">
                <div
                  className="relative aspect-[5/6] w-full overflow-hidden rounded-[28px] shadow-[0_40px_90px_-45px_rgba(49,10,101,0.8)] sm:aspect-[6/5] lg:aspect-[5/6]"
                  style={{
                    backgroundImage:
                      'linear-gradient(150deg, #4C1D95 0%, #6D28D9 42%, #8B5CF6 74%, #A855F7 100%)',
                  }}
                >
                  {/* Interior lighting */}
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage:
                        'radial-gradient(50% 45% at 22% 14%, rgba(255,255,255,0.20) 0%, rgba(76,29,149,0) 70%), radial-gradient(48% 46% at 88% 88%, rgba(236,72,153,0.28) 0%, rgba(76,29,149,0) 72%)',
                    }}
                    aria-hidden="true"
                  />

                  {/* The helix, held left of centre so the tiles have the
                      right of the panel to scatter across */}
                  <div
                    className="absolute inset-y-[8%] left-[2%] w-[46%]"
                    style={{ perspective: '900px' }}
                  >
                    <div className="abt-helix h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
                      <Helix />
                    </div>
                  </div>

                  {/* Specimen tiles, cut to hexagons */}
                  {HERO_TILES.map(({ src, alt, style }) => (
                    <span
                      key={alt}
                      className="abt-tile absolute block"
                      style={{ ...style, aspectRatio: '1 / 1.1547' }}
                    >
                      <span
                        className="block h-full w-full overflow-hidden shadow-[0_18px_40px_-18px_rgba(23,10,46,0.9)]"
                        style={{ clipPath: HEX, WebkitClipPath: HEX }}
                      >
                        <img
                          src={src}
                          alt={alt}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            2 — STAT BAR (rides the hero's bottom edge)
        ============================================================ */}
        <section className="relative z-20 -mt-24 bg-transparent lg:-mt-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div
              data-reveal
              className="rounded-[26px] border border-gray-200 bg-white px-7 py-9 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] sm:px-9 lg:px-11"
            >
              <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
                {STATS.map(({ Icon, value, headline, label }) => (
                  <div key={label} className="flex items-start gap-4">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-50 text-[#7C3AED] ring-1 ring-inset ring-purple-100"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <dd className="font-serif text-[1.9rem] font-semibold leading-none tracking-[-0.015em] text-[#111827]">
                        {value ?? (
                          <span className="text-[1.15rem] leading-tight">{headline}</span>
                        )}
                      </dd>
                      <dt className="mt-2 font-sans text-[13px] font-medium leading-[1.45] text-gray-600">
                        {label}
                      </dt>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ============================================================
            3 — MISSION & VISION
        ============================================================ */}
        <section className="relative overflow-hidden bg-white pb-20 pt-20 lg:pb-24 lg:pt-24">
          <Lighting variant="b" />

          <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
            <div
              data-reveal
              className="grid grid-cols-1 items-center gap-12 rounded-[28px] border border-gray-200 bg-white px-7 py-11 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.4)] sm:px-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-14 lg:px-14 lg:py-14"
            >
              {/* ---- Mission ---- */}
              <div>
                <SectionLabel>Our Mission</SectionLabel>
                <span
                  className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white shadow-[0_10px_24px_-10px_rgba(124,58,237,0.9)]"
                  aria-hidden="true"
                >
                  <Target className="h-[22px] w-[22px]" strokeWidth={1.8} />
                </span>
                <p className="mt-5 font-sans text-[15px] font-normal leading-[1.7] text-gray-600 [text-wrap:pretty] sm:text-base">
                  To democratize access to advanced pathology and multi-omics AI — putting methods
                  that were confined to a handful of research centres into the hands of any
                  laboratory, anywhere, working from the tissue it already collects. Better answers
                  should not depend on the postcode of the specimen.
                </p>
              </div>

              {/* ---- Badge ---- */}
              <div className="mx-auto lg:px-2">
                <div className="relative flex h-[190px] w-[190px] items-center justify-center">
                  <span
                    className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-purple-200"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute inset-[14px] rounded-full border border-purple-100"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute inset-[26px] rounded-full bg-gradient-to-br from-[#F5F3FF] to-[#FDF2F8]"
                    aria-hidden="true"
                  />
                  <span className="relative text-center font-sans text-[13px] font-bold uppercase leading-[1.35] tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]">
                    OmicMind
                    <br />
                    AI
                  </span>
                </div>
              </div>

              {/* ---- Vision ---- */}
              <div>
                <SectionLabel>Our Vision</SectionLabel>
                <span
                  className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white shadow-[0_10px_24px_-10px_rgba(124,58,237,0.9)]"
                  aria-hidden="true"
                >
                  <Eye className="h-[22px] w-[22px]" strokeWidth={1.8} />
                </span>
                <p className="mt-5 font-sans text-[15px] font-normal leading-[1.7] text-gray-600 [text-wrap:pretty] sm:text-base">
                  To be the global leader in AI-driven precision medicine: one specimen-centric
                  model that reads morphology and molecular signal together, trusted in research
                  and in the clinic, and held to the standard of evidence that decisions about
                  patients require.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            4 — LEADERSHIP
        ============================================================ */}
        <section className="relative bg-white pb-20 lg:pb-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div
              data-reveal
              className="rounded-[28px] border border-gray-200 bg-white px-7 py-10 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.4)] sm:px-9 lg:px-11 lg:py-12"
            >
              <div className="flex items-center justify-between gap-6">
                <SectionLabel>Leadership Team</SectionLabel>

                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-[#7C3AED] transition-colors hover:text-[#6D28D9]"
                  >
                    View All
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
                  </a>

                  <span className="hidden items-center gap-2 sm:inline-flex">
                    <button
                      type="button"
                      onClick={() => nudgeRail(-1)}
                      aria-label="Previous profiles"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors duration-200 hover:border-purple-300 hover:text-[#7C3AED]"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeRail(1)}
                      aria-label="Next profiles"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors duration-200 hover:border-purple-300 hover:text-[#7C3AED]"
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
                    </button>
                  </span>
                </div>
              </div>

              {/* The rail scrolls horizontally and snaps, so a nudge or a
                  swipe both land a card square against the edge. */}
              <div
                ref={railRef}
                className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {LEADERSHIP.map((person, i) => {
                  const filled = Boolean(person.name);
                  return (
                    <article
                      key={person.name || `slot-${i}`}
                      data-rail-card
                      className="flex w-[16.5rem] shrink-0 snap-start flex-col items-center rounded-[22px] border border-gray-200 bg-white px-6 py-7 text-center shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)] transition-colors duration-300 hover:border-purple-200 sm:w-[17.5rem]"
                    >
                      {person.photo ? (
                        <img
                          src={person.photo}
                          alt={person.name}
                          loading="lazy"
                          decoding="async"
                          className="h-[88px] w-[88px] rounded-full object-cover ring-1 ring-purple-100"
                        />
                      ) : (
                        <span
                          className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-purple-50 text-purple-300 ring-1 ring-inset ring-purple-100"
                          aria-hidden="true"
                        >
                          <UserRound className="h-9 w-9" strokeWidth={1.5} />
                        </span>
                      )}

                      {filled ? (
                        <>
                          <h3 className="mt-5 font-sans text-[15.5px] font-semibold tracking-[-0.005em] text-[#111827]">
                            {person.name}
                          </h3>
                          <p className="mt-1 font-sans text-[12.5px] font-semibold tracking-[0.01em] text-[#7C3AED]">
                            {person.title}
                          </p>
                          <p className="mt-3 font-sans text-[12.5px] font-normal leading-[1.6] text-gray-600 [text-wrap:pretty]">
                            {person.bio}
                          </p>
                        </>
                      ) : (
                        /* An unfilled slot, and visibly so — no invented name
                           sits here waiting to be mistaken for a real one. */
                        <div className="mt-5 w-full" aria-label="Profile to be added">
                          <span className="mx-auto block h-3 w-28 rounded-full bg-gray-100" />
                          <span className="mx-auto mt-2.5 block h-2.5 w-20 rounded-full bg-purple-100" />
                          <span className="mx-auto mt-4 block h-2 w-full rounded-full bg-gray-100" />
                          <span className="mx-auto mt-2 block h-2 w-4/5 rounded-full bg-gray-100" />
                        </div>
                      )}

                      <span className="mt-auto pt-5">
                        {person.linkedin ? (
                          <a
                            href={person.linkedin}
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label={`${person.name} on LinkedIn`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors duration-200 hover:border-purple-300 hover:text-[#7C3AED]"
                          >
                            <LinkedInMark className="h-[15px] w-[15px]" />
                          </a>
                        ) : (
                          <span
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-300"
                            aria-hidden="true"
                          >
                            <LinkedInMark className="h-[15px] w-[15px]" />
                          </span>
                        )}
                      </span>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            5 + 6 — VALUES and CERTIFICATIONS
        ============================================================ */}
        <section className="relative overflow-hidden bg-white pb-24 lg:pb-32">
          <Lighting variant="a" />

          <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-8">
              {/* ---- Values ---- */}
              <div
                data-reveal
                className="rounded-[28px] border border-gray-200 bg-white px-7 py-10 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.4)] sm:px-9 lg:px-10"
              >
                <SectionLabel>Our Values</SectionLabel>

                <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
                  {VALUES.map(({ Icon, title, body }) => (
                    <div key={title}>
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white shadow-[0_8px_20px_-8px_rgba(124,58,237,0.9)]"
                        aria-hidden="true"
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                      </span>
                      <h3 className="mt-4 font-sans text-[14.5px] font-semibold tracking-[-0.005em] text-[#111827]">
                        {title}
                      </h3>
                      <p className="mt-2 font-sans text-[12.5px] font-normal leading-[1.6] text-gray-600 [text-wrap:pretty]">
                        {body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ---- Certifications ---- */}
              <div
                data-reveal
                className="rounded-[28px] border border-gray-200 bg-white px-7 py-10 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.4)] sm:px-9 lg:px-10"
              >
                <SectionLabel>Certifications &amp; Compliance</SectionLabel>

                <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-5">
                  {CERTIFICATIONS.map(({ Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-3 rounded-[18px] border border-gray-200 bg-white px-3 py-5 text-center transition-colors duration-300 hover:border-purple-200"
                    >
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-50 text-[#7C3AED] ring-1 ring-inset ring-purple-100"
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </span>
                      <span className="font-sans text-[11.5px] font-semibold leading-[1.4] tracking-[0.01em] text-[#111827]">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
