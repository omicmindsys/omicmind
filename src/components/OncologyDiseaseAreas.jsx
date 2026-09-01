import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import breastImg from '../assets/breastcancer.webp';
import lungImg from '../assets/lungcancer.webp';
import colorectalImg from '../assets/colorectal.webp';
/* Gastric deliberately carries the pancreatic photograph — the asset the
   brief specifies for this card. Not a mismatch to be "corrected". */
import gastricImg from '../assets/pancreatic.webp';
import ovarianImg from '../assets/ovarian.webp';
import panCancerImg from '../assets/pancancer.webp';

gsap.registerPlugin(ScrollTrigger);

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/* ------------------------------------------------------------------
   Six minimal marks, one per disease area, all drawn in the same
   24 x 24 box and inheriting `currentColor` so each takes its card's
   accent without a second definition. Deliberately abstract — these
   read as anatomy at a glance without pretending to be diagrams.
------------------------------------------------------------------ */
const icons = {
  breast: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <path d="M10 21.2 15.4 9.6" />
      <path d="M14 21.2 8.6 9.6" />
      <path d="M8.6 9.6c-1.6-2.6-.8-5.2 1.6-6.2 2.4-1 4.8.6 5.4 3 .3 1.3 0 2.4-1 3.2" />
    </svg>
  ),
  lung: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <path d="M12 3.2v7.6" />
      <path d="M10.1 10.8c-1.2 0-2.1.8-2.3 2l-1 5.8c-.3 1.7.8 3 2.3 3h1.1c1 0 1.8-.8 1.8-1.8v-7.2c0-1-.8-1.8-1.9-1.8z" />
      <path d="M13.9 10.8c1.2 0 2.1.8 2.3 2l1 5.8c.3 1.7-.8 3-2.3 3h-1.1c-1 0-1.8-.8-1.8-1.8v-7.2c0-1 .8-1.8 1.9-1.8z" />
    </svg>
  ),
  colorectal: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <path d="M7 3.4v4.4a3.4 3.4 0 0 0 3.4 3.4h3.2A3.4 3.4 0 0 1 17 14.6v6" />
      <path d="M4.4 3.4h5.2" />
      <path d="M14.4 20.6h5.2" />
    </svg>
  ),
  gastric: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <path d="M8.8 3.2v3.4c0 3-2.4 3.6-2.4 7.2 0 3.6 2.8 6.2 6.2 6.2 3 0 5.2-1.9 5.2-4.5 0-2.4-1.6-3.8-3.4-3.8" />
      <path d="M8.8 6.6h3.8" />
    </svg>
  ),
  ovarian: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <path d="M12 21.2v-6.2" />
      <path d="M12 15c-3.4 0-6-2.4-6-5.5S8.6 4 12 4s6 2.4 6 5.5S15.4 15 12 15z" />
      <circle cx="12" cy="9.5" r="2" />
    </svg>
  ),
  panCancer: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <circle cx="12" cy="12" r="2.8" />
      <circle cx="12" cy="3.8" r="1.5" />
      <circle cx="19.1" cy="7.9" r="1.5" />
      <circle cx="19.1" cy="16.1" r="1.5" />
      <circle cx="12" cy="20.2" r="1.5" />
      <circle cx="4.9" cy="16.1" r="1.5" />
      <circle cx="4.9" cy="7.9" r="1.5" />
      <path d="M12 5.3v3.9M17.8 8.7 14.4 10.6M17.8 15.3 14.4 13.4M12 18.7v-3.9M6.2 15.3 9.6 13.4M6.2 8.7 9.6 10.6" />
    </svg>
  ),
};

/* Six steps of the brand ramp — violet through lavender to pink — so the
   grid reads as one system while every area stays individually legible. */
const AREAS = [
  { no: '01', title: 'Breast Cancer', icon: icons.breast, img: breastImg, from: '#7C3AED', to: '#A78BFA' },
  { no: '02', title: 'Lung Cancer', icon: icons.lung, img: lungImg, from: '#8B5CF6', to: '#C4B5FD' },
  { no: '03', title: 'Colorectal Cancer', icon: icons.colorectal, img: colorectalImg, from: '#A855F7', to: '#D8B4FE' },
  { no: '04', title: 'Pancreatic Cancer', icon: icons.gastric, img: gastricImg, from: '#C026D3', to: '#E879F9' },
  { no: '05', title: 'Ovarian Cancer', icon: icons.ovarian, img: ovarianImg, from: '#D946EF', to: '#F0ABFC' },
  { no: '06', title: 'Pan-Cancer Analysis', icon: icons.panCancer, img: panCancerImg, from: '#EC4899', to: '#F9A8D4' },
];

function AreaCard({ no, title,img, icon, from, to }) {
  return (
    <li className="oda-card group relative h-full list-none">
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
          backgroundImage: `linear-gradient(150deg, rgba(255,255,255,0.92) 0%, ${from}80 34%, ${to}4D 64%, rgba(255,255,255,0.55) 100%)`,
        }}
      >
        <div className="relative flex h-full min-h-[19rem] flex-col justify-end overflow-hidden rounded-[23px]">
          {/* ---- The photograph, filling the card ----
              `object-cover` with a centred origin, so the frame crops rather
              than stretching whatever aspect the source happens to be. */}
          <img
            src={img}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[700ms] ease-out group-hover:scale-[1.05]"
          />

          {/* ---- Readability wash ----
              Dark from the foot so the type always has ground under it,
              with a breath of the card's own accent across the top. Kept
              off the image's midtones, so the picture stays sharp. */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(10,4,24,0.10) 0%, rgba(10,4,24,0.34) 42%, rgba(10,4,24,0.84) 100%), linear-gradient(158deg, ${from}3D 0%, rgba(10,4,24,0) 52%)`,
            }}
            aria-hidden="true"
          />

          {/* The accent deepening as the card is hovered */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[380ms] ease-out group-hover:opacity-100"
            style={{
              backgroundImage: `linear-gradient(158deg, ${from}52 0%, rgba(10,4,24,0) 46%), linear-gradient(0deg, ${to}2E 0%, rgba(10,4,24,0) 55%)`,
            }}
            aria-hidden="true"
          />

          {/* Top sheen, so the card still reads as glass at its edge */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              backgroundImage: `linear-gradient(90deg, transparent, ${to}99, transparent)`,
            }}
            aria-hidden="true"
          />

          {/* ---- Content, anchored to the foot of the image ---- */}
          <div className="relative flex items-center gap-4 p-6">
            {/* ---- Icon ---- */}
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] border border-white/30 bg-white/15 text-white shadow-[0_10px_24px_-14px_rgba(10,4,24,0.9)] backdrop-blur-md transition-transform duration-[380ms] ease-out group-hover:scale-110">
              {/* Top sheen on the mark itself, matching the engine's */}
              <span
                className="pointer-events-none absolute inset-0 rounded-[15px] opacity-60"
                style={{
                  backgroundImage:
                    'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 62%)',
                }}
                aria-hidden="true"
              />
              <span className="relative">{icon}</span>
            </span>

            {/* ---- Number and name ---- */}
            <div className="min-w-0">
              <span
                className="block font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-transparent bg-clip-text"
                style={{ backgroundImage: `linear-gradient(120deg, ${to}, #FFFFFF)` }}
              >
                {no}
              </span>

              <h3 className="mt-1.5 font-serif text-[1.2rem] font-semibold leading-tight tracking-[-0.01em] text-white [text-shadow:0_1px_16px_rgba(10,4,24,0.65)] [text-wrap:balance]">
                {title}
              </h3>

              {/* Short accent rule, extending as the card is hovered */}
              <span
                className="mt-3 block h-px w-9 rounded-full transition-all duration-[380ms] ease-out group-hover:w-14"
                style={{ backgroundImage: `linear-gradient(90deg, ${to}, #FFFFFF)` }}
                aria-hidden="true"
              />
            </div>
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

      // The six areas land in reading order, across the first row and
      // then the second.
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
        <h2 className="font-serif text-4xl font-semibold leading-[1.12] tracking-[-0.01em] text-[#111827] sm:text-5xl lg:text-[3.25rem]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]">
            Oncology Disease Areas
          </span>
        </h2>

        {/* Editorial rule, echoing the one the other chapters carry */}
        <span
          className="mx-auto mt-8 block h-px w-40 rounded-full bg-gradient-to-r from-transparent via-[#A855F7] to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* ---------------- The six areas ---------------- */}
      <div ref={gridRef} className="relative mt-14 lg:mt-16">
        {/* ---- The ground the six areas sit on ----
            A white field lifted by one purple and one pink radial, with a
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
              <pattern id="oda-molecule" width="180" height="156" patternUnits="userSpaceOnUse">
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
            <rect width="100%" height="100%" fill="url(#oda-molecule)" />
          </svg>
        </div>

        {/* Three across from `lg` in two full rows, two on a tablet, one on
            a phone. `items-stretch` plus `h-full` on each shell keeps a
            row's cards to a shared height. */}
        <ol className="relative grid grid-cols-1 items-stretch gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {AREAS.map((area) => (
            <AreaCard key={area.title} {...area} />
          ))}
        </ol>
      </div>
    </div>
  );
}
