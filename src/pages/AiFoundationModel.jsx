import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  CloudCog,
  Combine,
  Fingerprint,
  GitBranch,
  Layers,
  Microscope,
  Network,
  RefreshCw,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Telescope,
  Waypoints,
  Workflow,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import aiModelVideo from '../assets/aimodel.mp4';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   AI Foundation Model

   A chapter page, built on the same shell the other chapter pages use:
   white ground, #111827 copy, the site's violet→pink ramp
   (#7C3AED → #A855F7 → #EC4899) reserved for accents, and the same
   eyebrow, button, card and section rhythm. Nothing here introduces a
   colour, a radius or a shadow the rest of the site does not already
   use.
================================================================ */

/* The three claims that sit under the hero copy. */
const HERO_FEATURES = [
  {
    Icon: Layers,
    title: 'Multimodal Pretraining',
    body: 'Trained across pathology, omics, imaging and EHR data',
  },
  {
    Icon: BrainCircuit,
    title: 'Foundation-first Architecture',
    body: 'Powers every AI module from a single core model',
  },
  {
    Icon: RefreshCw,
    title: 'Continuously Learning',
    body: 'Improves with new validated clinical data over time',
  },
];

/* The capabilities the model is stated in terms of, in the order they
   run: what it is trained on, what that training yields, and what is
   put around it before anything downstream may use it. */
const CAPABILITIES = [
  {
    Icon: Layers,
    title: 'Multimodal Pretraining',
    body: 'Self-supervised pretraining across whole-slide pathology, molecular assays, radiology and clinical text.',
  },
  {
    Icon: Combine,
    title: 'Cross-Modal Embeddings',
    body: 'One shared representation space, so a morphological pattern and its molecular correlate sit side by side.',
  },
  {
    Icon: GitBranch,
    title: 'Transfer Learning',
    body: 'Task heads inherit the base representation, reaching useful accuracy on a fraction of the labelled data.',
  },
  {
    Icon: Telescope,
    title: 'Zero-Shot Inference',
    body: 'Query cohorts and phenotypes the model was never explicitly trained to name, straight from the embedding.',
  },
  {
    Icon: Waypoints,
    title: 'Model Fine-Tuning',
    body: 'Adapt the core to a site, a scanner, a stain protocol or a trial endpoint without retraining from scratch.',
  },
  {
    Icon: Workflow,
    title: 'Foundation-to-Module Pipeline',
    body: 'A single promotion path from the base model to every downstream module, versioned end to end.',
  },
  {
    Icon: Boxes,
    title: 'Data Harmonization Engine',
    body: 'Scanner, stain and site variation normalised at ingest, so a cohort reads consistently wherever it came from.',
  },
  {
    Icon: RefreshCw,
    title: 'Continual Learning',
    body: 'Validated clinical data folds back into the base model on a controlled cadence, without catastrophic drift.',
  },
  {
    Icon: ScrollText,
    title: 'Model Governance & Audit',
    body: 'Every weight, dataset and evaluation carries a lineage record, reproducible on demand.',
  },
  {
    Icon: Fingerprint,
    title: 'Explainability Layer',
    body: 'Region attributions and per-modality contributions returned with the prediction, not reconstructed after it.',
  },
];

/* The capability cards that ring the hero visual. */
const CORE_CARDS = [
  { label: 'PRETRAINING', pos: 'left-[-4%] top-[8%]', tilt: '-7deg', delay: 0 },
  { label: 'MULTIMODAL FUSION', pos: 'right-[-6%] top-[20%]', tilt: '6deg', delay: 0.1 },
  { label: 'EMBEDDINGS', pos: 'left-[-8%] top-[52%]', tilt: '5deg', delay: 0.2 },
  { label: 'FINE-TUNING', pos: 'right-[-2%] top-[64%]', tilt: '-5deg', delay: 0.3 },
  { label: 'INFERENCE ENGINE', pos: 'left-[16%] bottom-[-4%]', tilt: '3deg', delay: 0.4 },
];

/* The stat band.

   `value` is deliberately left as an em dash on the two counts the brief
   gave as `X`. A parameter count and a modality count are claims about a
   real product, and inventing plausible-looking figures for them would put
   numbers on the page that nobody has stood behind. Fill these two in and
   the band renders them; until then it reads as a label with its figure
   pending, which is honest and is one edit away from done. */
const STATS = [
  { Icon: Network, value: '—', unit: 'Billion+', label: 'Parameters' },
  { Icon: Microscope, value: '—', unit: '+', label: 'Data Modalities' },
  { Icon: ShieldCheck, value: null, label: 'Enterprise Grade Security' },
  { Icon: CloudCog, value: null, label: 'Global Scalable Cloud' },
  { Icon: Sparkles, value: null, label: 'Proven Clinical Validation' },
];

/* ================================================================
   Shared pieces — the same ones the other chapter pages define, so
   this page inherits their exact metrics rather than approximating.
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

/* The soft violet/pink lighting the chapter pages wash their sections
   with — three fixed recipes, no per-section tuning. */
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

/* ================================================================ */

export default function AiFoundationModel() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);

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

  /* ---- Hero entrance, scroll reveals and the core's ambient motion ---- */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set('[data-reveal], .afm-card', { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      /* Hero copy, then the stage it sits beside */
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .from('.afm-hero-copy > *', { autoAlpha: 0, y: 26, duration: 0.9, stagger: 0.12 }, 0.15)
        .from('.afm-stage', { autoAlpha: 0, y: 30, scale: 0.96, duration: 1.1 }, 0.3)
        .from('.afm-card', { autoAlpha: 0, y: 18, scale: 0.92, duration: 0.7, stagger: 0.09 }, 0.75);

      /* The cards breathe around the footage, each on its own clock so the
         ring of them never pulses in unison. */
      gsap.utils.toArray('.afm-card').forEach((card, i) => {
        gsap.to(card, {
          y: gsap.utils.random(-9, -4),
          duration: gsap.utils.random(3.4, 4.8),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1.6 + i * 0.16,
        });
      });

      /* Everything below the hero arrives on its own approach */
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 38,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });

      /* Card hover: the same lift the other chapter grids use */
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

  return (
    <>
      <Navbar />

      <main ref={rootRef} className="relative w-full bg-white text-[#111827]">
        {/* ============================================================
            1 — HERO
        ============================================================ */}
        <section ref={heroRef} className="relative overflow-hidden bg-white">
          {/* ---------- Background footage ----------
              The backmost layer of the hero and the full size of it: absolutely
              inset to the section, so it follows the hero's own height at every
              breakpoint rather than a figure of its own, and `overflow-hidden`
              on the section clips it to that box exactly. There is no gap it can
              leave — `h-full w-full` fills the layer, `object-cover` fills the
              frame at the footage's own proportions, and `center` keeps the
              middle of it in view. Cropped at the edges, never stretched, never
              letterboxed, and never scaled up, so it stays at its own
              resolution. Nothing blurs or filters it.

              Everything else in the hero sits above it: the content wrapper
              already carries `z-10`, and this layer carries `z-0` and takes no
              pointer events, so no button, link or hover behaves any
              differently for being over footage now. */}
          <div
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            aria-hidden="true"
          >
            <video
              className="h-full w-full object-cover"
              style={{ objectPosition: 'center center' }}
              src={aiModelVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              controls={false}
              disablePictureInPicture
            />

            {/* ---- Legibility veil ----
                White, not black. The hero's copy is #111827 on what used to be
                a white ground, and it is not ours to restyle here — so what
                goes over the footage has to lift the page back towards white
                behind that copy rather than darken it, or the text would be
                the thing that disappears. It is weighted to where the words
                actually are and clears away from where they are not: down the
                page on a phone, where the copy stacks above everything, and in
                from the left on a wider screen, where it holds one column. The
                far side stays all but uncovered, so the footage reads at
                nearly full strength across the half of the frame that has no
                text on it. */}
            <span
              className="absolute inset-0 md:hidden"
              style={{
                backgroundImage:
                  'linear-gradient(to bottom, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.62) 40%, rgba(255,255,255,0.34) 72%, rgba(255,255,255,0.20) 100%)',
              }}
            />
            <span
              className="absolute inset-0 hidden md:block"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.56) 32%, rgba(255,255,255,0.22) 62%, rgba(255,255,255,0.08) 100%)',
              }}
            />
          </div>

          <Lighting variant="a" />

          {/* The same faint violet graph paper the other chapters open on */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(124,58,237,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.045) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(70% 60% at 50% 30%, #000 0%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(70% 60% at 50% 30%, #000 0%, transparent 100%)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-20 pt-[122px] lg:px-10 lg:pb-28 lg:pt-[168px]">
            <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
              {/* ---- Copy ---- */}
              <div className="afm-hero-copy w-full min-w-0 max-w-2xl lg:max-w-none">
                <Eyebrow>AI Foundation Model</Eyebrow>

                <h1 className="mt-7 font-serif text-[2.5rem] font-semibold leading-[1.07] tracking-[-0.015em] text-[#111827] sm:text-[3.1rem] lg:text-[3.4rem]">
                  The Foundation Model Powering Oncology AI.
                  <span className="mt-2 block italic text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]">
                    One Model. Infinite Applications.
                  </span>
                </h1>

                <p className="mt-7 max-w-xl font-sans text-base font-normal leading-[1.7] tracking-[-0.005em] text-gray-600 [text-wrap:pretty] sm:text-lg">
                  OmicMind&rsquo;s foundation model is pretrained on multimodal oncology data —
                  pathology, genomics, imaging, and clinical records — enabling every downstream AI
                  module.
                </p>

                {/* Three claims, on one row from `sm` up */}
                <div className="mt-11 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-5">
                  {HERO_FEATURES.map(({ Icon, title, body }) => (
                    <div key={title} className="flex flex-col gap-2.5">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white shadow-[0_8px_20px_-8px_rgba(124,58,237,0.9)]"
                        aria-hidden="true"
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                      </span>
                      <span className="font-sans text-[15px] font-semibold leading-snug tracking-[-0.005em] text-[#111827]">
                        {title}
                      </span>
                      <span className="font-sans text-[13px] font-normal leading-[1.55] text-gray-600">
                        {body}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-11 flex flex-wrap items-center gap-4">
                  <PrimaryButton>Request Demo</PrimaryButton>
                  <SecondaryButton>Read the Technical Brief</SecondaryButton>
                </div>
              </div>

              {/* ---- Stage: the core, ringed by what it serves ----
                   The cards are placed as a share of the stage and the stage
                   holds a square aspect, so the whole arrangement scales as
                   one piece and needs no per-breakpoint geometry. Below `sm`
                   the outermost cards would hang off a narrow screen, so they
                   are pulled in to the stage's own edges there. */}
              <div className="afm-stage relative mx-auto w-full max-w-[30rem] lg:max-w-none">
                <div className="relative mx-auto aspect-square w-full max-w-[32rem]">
                  {/* The footage now runs full-bleed behind the whole hero,
                      so this box keeps only the frame it used to occupy: the
                      stage's proportions, which hold the grid column's width
                      and so the hero's height, and the anchor the capability
                      cards are positioned against. Their placements are a
                      share of this box, so they have not moved. */}

                  {CORE_CARDS.map(({ label, pos, tilt }) => (
                    <span
                      key={label}
                      className={`afm-card absolute ${pos} inline-flex items-center gap-2 rounded-xl border border-purple-100 bg-white/95 px-3 py-2 shadow-[0_14px_38px_-20px_rgba(76,29,149,0.55)] sm:px-3.5 sm:py-2.5`}
                      style={{ transform: `rotate(${tilt})` }}
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899]"
                        aria-hidden="true"
                      />
                      <span className="whitespace-nowrap font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4C1D95] sm:text-[11px]">
                        {label}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Blend into the white below, the way the other chapters close */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32"
            style={{ backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0), #FFFFFF)' }}
            aria-hidden="true"
          />
        </section>

        {/* ============================================================
            2 — CAPABILITIES
        ============================================================ */}
        <section className="relative overflow-hidden bg-white pb-24 pt-16 lg:pb-32 lg:pt-20">
          <Lighting variant="b" />

          <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
            <DottedLabel>Explore Foundation Model Capabilities</DottedLabel>

            {/* Five across from `xl`, so the ten read as the two rows they
                are; three at `lg`, two at `sm`, one below that. */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 xl:grid-cols-5">
              {CAPABILITIES.map(({ Icon, title, body }) => (
                <article
                  key={title}
                  data-hover-card
                  data-reveal
                  className="group relative flex h-full flex-col rounded-[22px] border border-gray-200 bg-white p-6 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)] transition-colors duration-300 hover:border-purple-200"
                >
                  {/* The violet wash the other grids lift their cards with */}
                  <span
                    className="card-glow pointer-events-none absolute -inset-[3px] rounded-[25px] opacity-0 blur-[10px]"
                    style={{
                      backgroundImage:
                        'radial-gradient(80% 70% at 50% 0%, rgba(124,58,237,0.16) 0%, rgba(255,255,255,0) 72%), radial-gradient(70% 60% at 80% 100%, rgba(236,72,153,0.12) 0%, rgba(255,255,255,0) 72%)',
                    }}
                    aria-hidden="true"
                  />

                  <span
                    className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white shadow-[0_8px_20px_-8px_rgba(124,58,237,0.9)]"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>

                  <h3 className="relative mt-5 font-sans text-[15px] font-semibold leading-snug tracking-[-0.005em] text-[#111827]">
                    {title}
                  </h3>
                  <p className="relative mt-2.5 font-sans text-[13px] font-normal leading-[1.6] text-gray-600 [text-wrap:pretty]">
                    {body}
                  </p>

                  <span className="relative mt-5 inline-flex items-center gap-1.5 pt-1 font-sans text-[12.5px] font-semibold tracking-[0.01em] text-[#7C3AED]">
                    Explore Capability
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1"
                      strokeWidth={2.25}
                    />
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            3 — STAT BAND
        ============================================================ */}
        <section className="relative bg-white pb-24 lg:pb-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div
              data-reveal
              className="relative overflow-hidden rounded-[28px] px-7 py-10 shadow-[0_30px_80px_-40px_rgba(49,10,101,0.75)] sm:px-10 lg:px-12 lg:py-12"
              style={{
                backgroundImage:
                  'linear-gradient(140deg, #17102E 0%, #251545 46%, #3B1D6B 100%)',
              }}
            >
              {/* Interior lighting, kept off the copy's lane */}
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(45% 70% at 88% 8%, rgba(168,85,247,0.30) 0%, rgba(23,16,46,0) 70%), radial-gradient(40% 60% at 4% 96%, rgba(236,72,153,0.18) 0%, rgba(23,16,46,0) 72%)',
                }}
                aria-hidden="true"
              />

              <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-14">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
                  {STATS.map(({ Icon, value, unit, label }) => (
                    <div key={label} className="flex flex-col gap-2.5">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-purple-200"
                        aria-hidden="true"
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                      </span>
                      {value && (
                        <dd className="font-serif text-[1.75rem] font-semibold leading-none tracking-[-0.01em] text-white">
                          {value}
                          {unit && (
                            <span className="ml-1 font-sans text-[13px] font-semibold tracking-[0.02em] text-purple-200">
                              {unit}
                            </span>
                          )}
                        </dd>
                      )}
                      <dt className="font-sans text-[13px] font-medium leading-snug tracking-[0.01em] text-purple-100/85">
                        {label}
                      </dt>
                    </div>
                  ))}
                </dl>

                {/* The band's own call to action, set apart by a rule on
                    the wide layout and by stacking order on the narrow one */}
                <div className="lg:w-[19rem] lg:border-l lg:border-white/15 lg:pl-12">
                  <p className="font-serif text-2xl font-semibold leading-[1.2] tracking-[-0.01em] text-white">
                    Build. Integrate. Transform.
                  </p>
                  <p className="mt-3 font-sans text-[13.5px] font-normal leading-[1.6] text-purple-100/80">
                    Put the foundation model behind your own pipelines, on your own data.
                  </p>
                  <button
                    type="button"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-sans text-[15px] font-semibold tracking-[0.01em] text-[#3B1D6B] shadow-[0_10px_30px_-14px_rgba(0,0,0,0.7)] transition-colors duration-300 hover:bg-purple-50 sm:w-auto lg:w-full"
                  >
                    Request Demo
                    <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            4 — CLOSING BAR
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
                  <Sparkles className="h-[18px] w-[18px] -rotate-45 text-white" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="font-serif text-2xl font-semibold leading-[1.2] tracking-[-0.01em] text-[#111827]">
                    Not sure where to start?
                  </p>
                  <p className="mt-2 max-w-xl font-sans text-[14.5px] font-normal leading-[1.6] text-gray-600 [text-wrap:pretty]">
                    Our foundation model powers every module — talk to our team to see it in action.
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-wrap items-center gap-4 lg:w-auto lg:shrink-0">
                <SecondaryButton>Talk to an Expert</SecondaryButton>
                <PrimaryButton>Schedule a Demo</PrimaryButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
