import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import tissueVideo from '../assets/tissue.mp4';

gsap.registerPlugin(ScrollTrigger);

/* The gaps the connectors have to span, in Tailwind units, so a rail is
   always exactly as long as the space between two stages:
     x: gap-x-6 (24px) on tablet, gap-x-8 (32px) from lg
     y: gap-y-10 (40px) on a phone, gap-y-12 (48px) tablet, gap-y-16 (64px) lg
   Change a gap on the grid and the matching rail width below moves with it. */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/* ------------------------------------------------------------------
   Six minimal line icons, one per stage, all drawn in the same
   24 x 24 box and inheriting `currentColor` so each takes its stage's
   accent without a second definition.
------------------------------------------------------------------ */
const icons = {
  // 01 — a slide under a lens
  slide: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <rect x="3" y="4.5" width="12.5" height="15" rx="1.6" />
      <path d="M3 9h12.5M7.6 4.5v15" />
      <circle cx="16.6" cy="15.4" r="4.1" />
      <path d="M19.6 18.4 22 20.8" />
    </svg>
  ),
  // 03 — stacked omics layers over a helix turn
  omics: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <path d="M12 2.6 21 7l-9 4.4L3 7z" />
      <path d="M3 12.2l9 4.4 9-4.4" />
      <path d="M3 17.1l9 4.3 9-4.3" />
    </svg>
  ),
  // 04 — a small neural mesh
  integrate: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <circle cx="12" cy="12" r="2.6" />
      <circle cx="4.4" cy="6.2" r="1.5" />
      <circle cx="19.6" cy="6.2" r="1.5" />
      <circle cx="4.4" cy="17.8" r="1.5" />
      <circle cx="19.6" cy="17.8" r="1.5" />
      <path d="M5.6 7.1 9.9 10.4M18.4 7.1 14.1 10.4M5.6 16.9 9.9 13.6M18.4 16.9 14.1 13.6" />
    </svg>
  ),
  // 02 — a marker found against a signal
  biomarker: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 1.8v3.2M12 19v3.2M1.8 12H5M19 12h3.2" />
    </svg>
  ),
  // 06 — a compound bonded to a target
  drug: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <path d="M7.6 3.2a4.4 4.4 0 0 1 6.2 6.2l-4.4 4.4a4.4 4.4 0 0 1-6.2-6.2z" />
      <path d="M5.2 5.6l6.2 6.2" />
      <circle cx="17.6" cy="17.6" r="3.4" />
      <path d="M15.2 15.2 12 12" />
    </svg>
  ),
  // 05 — outcome, read as a pulse
  clinical: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <path d="M20.4 8.6c0-2.7-2-4.6-4.4-4.6-1.7 0-3.1.9-4 2.3-.9-1.4-2.3-2.3-4-2.3C5.6 4 3.6 5.9 3.6 8.6c0 5 8.4 10.4 8.4 10.4s8.4-5.4 8.4-10.4z" />
      <path d="M3.9 11.6h3.4l1.5-2.6 2 5 1.5-2.4h3.3" />
    </svg>
  ),
};

/* ------------------------------------------------------------------
   The six stages, in order. `link` says which way this stage hands
   off to the next at each breakpoint, so one card definition drives the
   whole chain:

     lg — serpentine across three columns: 01→02→03 ↓ 04→05→06
     sm — serpentine across two columns
     xs — a single column, every stage dropping into the next

   The last stage carries no link.
------------------------------------------------------------------ */
const STAGES = [
  {
    no: '01',
    title: 'Pathology Slides',
    body: 'AI-powered whole-slide imaging and feature extraction.',
    icon: icons.slide,
    from: '#7C3AED',
    to: '#A78BFA',
    lg: 'right',
    sm: 'right',
  },
  {
    no: '02',
    title: 'Biomarker Analysis',
    body: 'Identify and validate predictive and prognostic biomarkers.',
    icon: icons.biomarker,
    from: '#8B5CF6',
    to: '#C4B5FD',
    lg: 'right',
    sm: 'down',
  },
  {
    no: '03',
    title: 'Multiomics Profiling',
    body: 'Genomics, transcriptomics, proteomics, spatial and more.',
    icon: icons.omics,
    from: '#A855F7',
    to: '#D8B4FE',
    lg: 'down',
    sm: 'left',
  },
  {
    no: '04',
    title: 'AI Integration',
    body: 'Deep learning models integrate multi-modal data.',
    icon: icons.integrate,
    from: '#C026D3',
    to: '#E879F9',
    lg: 'left',
    sm: 'down',
  },
  {
    no: '05',
    title: 'Therapy Response',
    body: 'Deliver precision therapy and improve patient outcomes.',
    icon: icons.clinical,
    from: '#D946EF',
    to: '#F0ABFC',
    lg: 'left',
    sm: 'right',
  },
  {
    no: '06',
    title: 'Drug Discovery & Biomarker',
    body: 'AI designs and prioritizes therapeutics and predicts response.',
    icon: icons.drug,
    from: '#EC4899',
    to: '#F9A8D4',
  },
];

/* Serpentine placement. The DOM stays in reading order 01 → 06 for
   screen readers and keyboard order; only the grid coordinates snake. */
const PLACE_LG = [
  'lg:col-start-1 lg:row-start-1',
  'lg:col-start-2 lg:row-start-1',
  'lg:col-start-3 lg:row-start-1',
  'lg:col-start-3 lg:row-start-2',
  'lg:col-start-2 lg:row-start-2',
  'lg:col-start-1 lg:row-start-2',
];

const PLACE_SM = [
  'sm:col-start-1 sm:row-start-1',
  'sm:col-start-2 sm:row-start-1',
  'sm:col-start-2 sm:row-start-2',
  'sm:col-start-1 sm:row-start-2',
  'sm:col-start-1 sm:row-start-3',
  'sm:col-start-2 sm:row-start-3',
];

/* ---------- One link in the chain ----------
   A rail laid into the grid's gap, with a lit head at the far end and a
   particle that runs its length. `dir` orients it; `show` carries the
   breakpoint classes that switch it on for exactly one layout. */
function Rail({ dir, show, from, to }) {
  const horizontal = dir === 'right' || dir === 'left';

  const geometry =
    dir === 'right'
      ? 'left-full top-1/2 h-px w-6 -translate-y-1/2 lg:w-8'
      : dir === 'left'
        ? 'right-full top-1/2 h-px w-6 -translate-y-1/2 lg:w-8'
        : 'left-1/2 top-full h-10 w-px -translate-x-1/2 sm:h-12 lg:h-16';

  // Which end the flow arrives at, so the arrow and the particle agree
  const headSide =
    dir === 'right'
      ? 'right-[-1px] top-1/2 -translate-y-1/2'
      : dir === 'left'
        ? 'left-[-1px] top-1/2 -translate-y-1/2'
        : 'bottom-[-1px] left-1/2 -translate-x-1/2';

  const gradient =
    dir === 'right'
      ? `linear-gradient(90deg, ${from}00, ${from}CC, ${to}E6)`
      : dir === 'left'
        ? `linear-gradient(270deg, ${from}00, ${from}CC, ${to}E6)`
        : `linear-gradient(180deg, ${from}00, ${from}CC, ${to}E6)`;

  return (
    <span
      className={`wf-rail pointer-events-none absolute ${geometry} ${show}`}
      data-dir={dir}
      aria-hidden="true"
    >
      {/* The track itself, drawn on scroll from the stage it leaves */}
      <span
        className="wf-rail-line absolute inset-0 rounded-full"
        style={{
          backgroundImage: gradient,
          transformOrigin: dir === 'left' ? 'right center' : horizontal ? 'left center' : 'top center',
        }}
      />

      {/* Arrowhead, so direction of travel is never ambiguous */}
      <span className={`absolute ${headSide}`}>
        <svg
          viewBox="0 0 8 8"
          className="h-2 w-2"
          style={{
            color: to,
            transform:
              dir === 'right'
                ? 'rotate(0deg)'
                : dir === 'left'
                  ? 'rotate(180deg)'
                  : 'rotate(90deg)',
          }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.4 1.2 5.6 4 2.4 6.8" />
        </svg>
      </span>

      {/* The data particle running the length of the rail */}
      <span
        className="wf-particle absolute h-[5px] w-[5px] rounded-full opacity-0"
        style={{
          top: horizontal ? '50%' : 0,
          left: horizontal ? 0 : '50%',
          marginTop: horizontal ? -2.5 : 0,
          marginLeft: horizontal ? 0 : -2.5,
          backgroundColor: to,
          boxShadow: `0 0 10px 2px ${to}A6`,
        }}
      />
    </span>
  );
}

function StageCard({ stage, index }) {
  const { no, title, body, icon, from, to, lg, sm } = stage;

  return (
    <li
      className={`wf-stage group relative ${PLACE_SM[index]} ${PLACE_LG[index]}`}
    >
      {/* ---- The links out of this stage, one per layout ---- */}
      {lg && <Rail dir={lg} show="hidden lg:block" from={from} to={to} />}
      {sm && <Rail dir={sm} show="hidden sm:block lg:hidden" from={from} to={to} />}
      {index < STAGES.length - 1 && (
        <Rail dir="down" show="block sm:hidden" from={from} to={to} />
      )}

      {/* ---- The glass pane ----
          One translucent white wash on one white hairline, over a very soft
          neutral shadow. The card still carries no fill of its own, and the
          backdrop blur is kept to 4px, so the tissue reads straight through
          it rather than being smeared behind it.

          The purple and pink live entirely in the shadow stack: two soft
          outer rings, which the browser clips to the area *outside* the
          border box, plus a 1px inset ring that tints the edge line itself.
          Neither can reach the card's interior, so the glass — and the video
          through it — stays uncoloured. */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/25 bg-white/[0.08] p-6 shadow-[0_8px_26px_-16px_rgba(0,0,0,0.5),0_0_14px_-2px_rgba(168,85,247,0.20),0_0_26px_-6px_rgba(236,72,153,0.16),inset_0_0_0_1px_rgba(217,70,239,0.10)] backdrop-blur-sm transition-all duration-[380ms] ease-out group-hover:-translate-y-1 group-hover:border-white/45 group-hover:bg-white/[0.13] group-hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55),0_0_20px_-2px_rgba(168,85,247,0.34),0_0_36px_-6px_rgba(236,72,153,0.26),inset_0_0_0_1px_rgba(217,70,239,0.20)]">
        {/* Top sheen, so the pane reads as glass rather than a flat tile */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            backgroundImage:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
          }}
          aria-hidden="true"
        />

        {/* ---- Icon and number on one line ---- */}
        <div className="relative flex items-center justify-between gap-3">
          <span
            className="wf-node relative flex h-11 w-11 items-center justify-center rounded-[14px] border border-white/30 bg-white/10 text-white transition-all duration-[380ms] ease-out group-hover:scale-105 group-hover:border-white/50"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.45))' }}
          >
            {/* The ring that pulses once as the chain reaches this stage */}
            <span
              className="wf-ring pointer-events-none absolute inset-0 rounded-[14px] opacity-0"
              style={{ border: '1px solid rgba(255,255,255,0.9)' }}
              aria-hidden="true"
            />
            {icon}
          </span>

          <span
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
          >
            {no}
          </span>
        </div>

        {/* ---- Title ---- */}
        <h3
          className="relative mt-5 font-serif text-[1.2rem] font-semibold leading-tight tracking-[-0.01em] text-white"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55)' }}
        >
          {title}
        </h3>

        {/* Short rule, separating the title from the description */}
        <span
          className="relative mt-3.5 block h-px w-9 rounded-full transition-all duration-[380ms] ease-out group-hover:w-14"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(255,255,255,0.85), rgba(255,255,255,0.18))',
          }}
          aria-hidden="true"
        />

        {/* ---- Description ---- */}
        <p
          className="relative mt-3.5 font-sans text-[13.5px] font-medium leading-relaxed text-white/85 [text-wrap:pretty]"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          {body}
        </p>
      </div>
    </li>
  );
}

export default function WorkflowJourney() {
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

      // The molecular ground settles in first, so the chain lands on a
      // field rather than on bare white.
      gsap.from('.wf-field', {
        opacity: 0,
        duration: 1.3,
        ease: 'power2.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 90%' },
      });

      /* ---- The chain assembles itself, 01 through 06 ----
         One timeline so the order is guaranteed: a stage arrives, its
         node pulses, the rail leaving it draws, and a particle carries
         the handoff into the stage that follows. */
      const stages = gsap.utils.toArray('.wf-stage');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: gridRef.current, start: 'top 78%' },
      });

      stages.forEach((stage, i) => {
        const at = i * 0.42;

        tl.from(
          stage,
          { y: 42, opacity: 0, duration: 0.85, ease: 'power3.out' },
          at
        );

        // The node lights up as the stage activates
        tl.fromTo(
          stage.querySelector('.wf-ring'),
          { opacity: 0.85, scale: 1 },
          { opacity: 0, scale: 1.5, duration: 0.9, ease: 'power2.out' },
          at + 0.2
        );

        // The rails leaving this stage draw along their own axis
        const rails = stage.querySelectorAll('.wf-rail-line');
        rails.forEach((line) => {
          const vertical = line.parentElement.dataset.dir === 'down';
          tl.from(
            line,
            vertical
              ? { scaleY: 0, duration: 0.42, ease: 'power2.out' }
              : { scaleX: 0, duration: 0.42, ease: 'power2.out' },
            at + 0.3
          );
        });
      });

      /* ---- The flow, once the chain is built ----
         Each particle runs its own rail on a loop, offset by its position
         in the chain so the movement reads as one signal travelling the
         whole journey rather than six separate blinks. */
      gsap.utils.toArray('.wf-stage').forEach((stage, i) => {
        stage.querySelectorAll('.wf-particle').forEach((dot) => {
          const rail = dot.parentElement;
          const dir = rail.dataset.dir;

          const travel = () => {
            const span =
              dir === 'down' ? rail.offsetHeight : rail.offsetWidth;
            return dir === 'left' ? -span : span;
          };

          gsap
            .timeline({
              repeat: -1,
              repeatDelay: 1.5,
              delay: i * 0.42,
              scrollTrigger: { trigger: gridRef.current, start: 'top 78%' },
            })
            .set(dot, { x: 0, y: 0, opacity: 0 })
            .to(dot, { opacity: 1, duration: 0.2 })
            .to(
              dot,
              dir === 'down'
                ? { y: travel, duration: 1.1, ease: 'power1.inOut' }
                : { x: travel, duration: 1.1, ease: 'power1.inOut' },
              0
            )
            .to(dot, { opacity: 0, duration: 0.25 }, 0.95);
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  /* The lead-in is deliberately short: this chapter opens the white section,
     so the section's own `pt-24 / lg:pt-32` already supplies the opening. The
     `mt-24 / lg:mt-32` that used to sit here was the gap separating it from
     the capability cards above; with those gone it was stacking a second full
     opening onto the first. */
  return (
    <div ref={rootRef} className="relative mt-4 lg:mt-6">
      {/* ---------------- Header ---------------- */}
      <div ref={headRef} className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-4xl font-semibold leading-[1.12] tracking-[-0.01em] text-[#111827] sm:text-5xl lg:text-[3.25rem]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]">
            End-to-End AI Workflow from Tissue to Therapy
          </span>
        </h2>

        {/* Editorial rule, echoing the one the other chapters carry */}
        <span
          className="mx-auto mt-8 block h-px w-40 rounded-full bg-gradient-to-r from-transparent via-[#A855F7] to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* ---------------- The chain ---------------- */}
      <div ref={gridRef} className="relative mt-14 lg:mt-16">
        {/* ---- The ground the six stages sit on ----
            A white field lifted by one purple and one pink radial, with a
            faint molecular lattice across it. Decoration only: it sits
            behind the chain and never touches the type. */}
        <div
          className="wf-field pointer-events-none absolute -inset-x-6 -inset-y-10 -z-10 overflow-hidden sm:-inset-x-10"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(46% 40% at 14% 10%, rgba(124,58,237,0.10) 0%, rgba(124,58,237,0) 70%), radial-gradient(48% 42% at 88% 90%, rgba(236,72,153,0.09) 0%, rgba(236,72,153,0) 70%), radial-gradient(60% 46% at 50% 50%, rgba(168,85,247,0.05) 0%, rgba(255,255,255,0) 76%)',
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
              <pattern id="wf-molecule" width="180" height="156" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="rgba(124,58,237,0.14)" strokeWidth="1" strokeLinecap="round">
                  <path d="M90 12 L156 50 L156 126 L90 164 L24 126 L24 50 Z" />
                  <path d="M90 12 L90 88 M90 88 L156 126 M90 88 L24 126" />
                </g>
                <g fill="rgba(168,85,247,0.28)">
                  <circle cx="90" cy="12" r="2.4" />
                  <circle cx="156" cy="50" r="2" />
                  <circle cx="24" cy="50" r="2" />
                  <circle cx="90" cy="88" r="2.8" />
                </g>
                <g fill="rgba(236,72,153,0.24)">
                  <circle cx="156" cy="126" r="2" />
                  <circle cx="24" cy="126" r="2" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wf-molecule)" />
          </svg>
        </div>

        {/* ---- The card area and its background video ----
            The wrapper is sized by the grid alone, so `tissue.mp4` covers
            exactly the box the six stages occupy — at every breakpoint,
            however many columns the grid resolves to — and never the page.
            Its padding keeps the footage running a little past the cards, so
            the blooms and the hover lift are never clipped by the rounding. */}
        <div className="relative overflow-hidden rounded-[2rem] p-5 sm:p-7 lg:p-9">
          <video
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
            src={tissueVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            aria-hidden="true"
          />

          {/* A neutral scrim — no blur, no tint, no colour — carrying just
              enough density to seat white type over moving footage. The video
              itself stays completely sharp underneath it. */}
          <span
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(8,10,14,0.42) 0%, rgba(8,10,14,0.34) 46%, rgba(8,10,14,0.46) 100%)',
            }}
            aria-hidden="true"
          />

          {/* Stacked on a phone, a two-column serpentine on a tablet, and a
              three-column serpentine from `lg` — 01→02→03 down to 04→05→06.
              The rails live in the gaps named here. */}
          <ol className="relative z-10 grid list-none grid-cols-1 items-stretch gap-y-10 p-0 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {STAGES.map((stage, i) => (
              <StageCard key={stage.no} stage={stage} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
