import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// One visual per application module. `hometwo.webp` is the H&E tissue field
// already in the asset folder — the whole-slide morphology the first module
// describes — and is used nowhere else in the app.
import pathologyImg from '../assets/ihc3.webp';
import quantihcImg from '../assets/quantihc.webp';
import genomicsImg from '../assets/genomics.webp';
import transcriptomicsImg from '../assets/transcroptics.webp';
import spatialImg from '../assets/spatial.webp';
import clinicalImg from '../assets/clinical.webp';

gsap.registerPlugin(ScrollTrigger);

// The grid's column gap, in px — Tailwind `gap-x-6`. The link between two
// modules in the same row spans exactly this, so the packet crossing it
// travels the same distance the gap does and the two can never drift apart.
const PIPE_GAP = 24;

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const hubIcon = (
  <svg viewBox="0 0 24 24" className="h-11 w-11" {...stroke}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="3.6" r="1.6" />
    <circle cx="20.4" cy="7.8" r="1.6" />
    <circle cx="20.4" cy="16.2" r="1.6" />
    <circle cx="12" cy="20.4" r="1.6" />
    <circle cx="3.6" cy="16.2" r="1.6" />
    <circle cx="3.6" cy="7.8" r="1.6" />
    <path d="M12 5.2v3.8M14.7 10.7l4.2-2.1M14.7 13.3l4.2 2.1M12 15v3.8M9.3 13.3l-4.2 2.1M9.3 10.7L5.1 8.6" />
  </svg>
);

const icons = {
  // Whole-slide pathology image
  histopathology: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
      <rect x="3" y="3.5" width="18" height="17" rx="2.5" />
      <path d="M3 8.2h18" />
      <circle cx="8.4" cy="12.8" r="2.3" />
      <circle cx="14.8" cy="11.9" r="1.7" />
      <circle cx="11.6" cy="17" r="1.9" />
      <circle cx="17.6" cy="16.4" r="1.3" />
      <circle cx="8.4" cy="12.8" r="0.55" fill="currentColor" stroke="none" />
    </svg>
  ),
  // IHC stained tissue with AI overlay
  ihc: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
      <rect x="3" y="3.5" width="18" height="17" rx="2.5" />
      <path d="M9 4v16M15 4v16M3.5 9.5h17M3.5 15h17" opacity="0.4" />
      <rect x="9" y="9.5" width="6" height="5.5" fill="currentColor" stroke="none" opacity="0.75" />
      <path
        d="M17.9 4.6l.62 1.68 1.68.62-1.68.62-.62 1.68-.62-1.68-1.68-.62 1.68-.62z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  ),
  // DNA helix with sequencing read-out
  genomics: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
      <path d="M7.4 2.9c0 4.3 6.4 4.5 6.4 9.1s-6.4 4.7-6.4 9.1" />
      <path d="M13.8 2.9c0 4.3-6.4 4.5-6.4 9.1s6.4 4.7 6.4 9.1" />
      <path d="M8.6 6h4M7.8 9.4h5.6M7.8 14.6h5.6M8.6 18h4" />
      <path d="M17.4 19v-2.6M19.2 19v-5.4M21 19v-3.4" />
    </svg>
  ),
  // Clustered RNA expression heatmap
  transcriptomics: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
      <path d="M6.5 2.8v1.4h11V2.8M12 4.2v1.4" opacity="0.65" />
      <rect x="3" y="6" width="18" height="14" rx="2.2" />
      <path d="M9 6.5v13M15 6.5v13M3.5 10.6h17M3.5 15.2h17" opacity="0.4" />
      <rect x="3.5" y="6.5" width="5.5" height="4.1" fill="currentColor" stroke="none" opacity="0.75" />
      <rect x="9" y="10.6" width="6" height="4.6" fill="currentColor" stroke="none" opacity="0.4" />
      <rect x="15" y="15.2" width="5.5" height="4.3" fill="currentColor" stroke="none" opacity="0.6" />
    </svg>
  ),
  // Spatial cellular interaction network
  spatial: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
      <path d="M2.8 5.6c5-2 13.4-2 18.4 0v12.8c-5 2-13.4 2-18.4 0z" opacity="0.4" />
      <circle cx="6.4" cy="8.2" r="1.5" />
      <circle cx="17.2" cy="7.8" r="1.3" />
      <circle cx="12" cy="12.2" r="1.9" />
      <circle cx="6.8" cy="16.4" r="1.3" />
      <circle cx="17.6" cy="16" r="1.5" />
      <path d="M7.7 9.4l2.6 1.7M13.6 11.2l2.4-2.2M10.6 13.5l-2.6 2M13.7 13.4l2.6 1.7" />
    </svg>
  ),
  // Clinical dashboard with predictive analytics
  outcomes: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
      <rect x="2.5" y="3.5" width="19" height="17" rx="2.5" />
      <path d="M2.5 8h19" />
      <circle cx="5.5" cy="5.75" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="7.7" cy="5.75" r="0.55" fill="currentColor" stroke="none" />
      <path d="M5.8 16.8l3.6-3.4 3 1.9 5.6-4.8" />
      <path d="M15.4 10.5H18v2.6" />
    </svg>
  ),
};

/* ================================================================
   Card colour themes

   One shade per application, sweeping the brand ramp from lavender
   through orchid and magenta to rose and back to mauve — so the six read
   as one family rather than six choices. Every surface stays near white
   (alpha 0.90–0.96) to hold the text contrast; `wash` is the same ramp a
   step richer, cross-faded in on hover.
================================================================ */
const themes = {
  // 01 · Soft Lavender → Purple
  lavender: {
    surface:
      'linear-gradient(155deg, rgba(243,240,255,0.94) 0%, rgba(255,255,255,0.90) 54%, rgba(237,233,254,0.94) 100%)',
    wash:
      'radial-gradient(115% 85% at 100% 0%, rgba(124,58,237,0.13) 0%, rgba(124,58,237,0) 62%), linear-gradient(155deg, rgba(233,227,254,0.96) 0%, rgba(250,249,255,0.93) 54%, rgba(224,216,253,0.96) 100%)',
    edge:
      'linear-gradient(150deg, rgba(139,92,246,0.50) 0%, rgba(196,181,253,0.26) 45%, rgba(17,24,39,0.06) 100%)',
    glow: 'linear-gradient(135deg, rgba(124,58,237,0.34), rgba(167,139,250,0.30))',
    shadow: '0 8px 26px -16px rgba(76,29,149,0.45)',
    shadowHover: '0 26px 54px -18px rgba(91,33,182,0.38)',
  },
  // 02 · Lilac → Orchid
  lilac: {
    surface:
      'linear-gradient(155deg, rgba(246,241,255,0.94) 0%, rgba(255,255,255,0.90) 54%, rgba(243,232,255,0.94) 100%)',
    wash:
      'radial-gradient(115% 85% at 100% 0%, rgba(168,85,247,0.13) 0%, rgba(168,85,247,0) 62%), linear-gradient(155deg, rgba(238,229,255,0.96) 0%, rgba(251,249,255,0.93) 54%, rgba(233,213,255,0.96) 100%)',
    edge:
      'linear-gradient(150deg, rgba(168,85,247,0.48) 0%, rgba(216,180,254,0.26) 45%, rgba(17,24,39,0.06) 100%)',
    glow: 'linear-gradient(135deg, rgba(168,85,247,0.32), rgba(217,70,239,0.28))',
    shadow: '0 8px 26px -16px rgba(107,33,168,0.45)',
    shadowHover: '0 26px 54px -18px rgba(126,34,206,0.38)',
  },
  // 03 · Violet → Magenta
  violet: {
    surface:
      'linear-gradient(155deg, rgba(244,238,255,0.94) 0%, rgba(255,255,255,0.90) 52%, rgba(250,232,255,0.94) 100%)',
    wash:
      'radial-gradient(115% 85% at 100% 0%, rgba(192,38,211,0.12) 0%, rgba(192,38,211,0) 62%), linear-gradient(155deg, rgba(235,225,255,0.96) 0%, rgba(252,249,255,0.93) 52%, rgba(245,214,254,0.96) 100%)',
    edge:
      'linear-gradient(150deg, rgba(168,85,247,0.46) 0%, rgba(232,121,249,0.28) 45%, rgba(17,24,39,0.06) 100%)',
    glow: 'linear-gradient(135deg, rgba(168,85,247,0.30), rgba(232,121,249,0.30))',
    shadow: '0 8px 26px -16px rgba(112,26,117,0.42)',
    shadowHover: '0 26px 54px -18px rgba(147,51,234,0.36)',
  },
  // 04 · Orchid → Blush
  orchid: {
    surface:
      'linear-gradient(155deg, rgba(251,238,255,0.94) 0%, rgba(255,255,255,0.90) 52%, rgba(253,236,246,0.94) 100%)',
    wash:
      'radial-gradient(115% 85% at 100% 0%, rgba(217,70,239,0.12) 0%, rgba(217,70,239,0) 62%), linear-gradient(155deg, rgba(248,226,255,0.96) 0%, rgba(255,250,253,0.93) 52%, rgba(252,224,241,0.96) 100%)',
    edge:
      'linear-gradient(150deg, rgba(217,70,239,0.42) 0%, rgba(244,114,182,0.28) 45%, rgba(17,24,39,0.06) 100%)',
    glow: 'linear-gradient(135deg, rgba(217,70,239,0.30), rgba(244,114,182,0.30))',
    shadow: '0 8px 26px -16px rgba(134,25,143,0.40)',
    shadowHover: '0 26px 54px -18px rgba(192,38,211,0.34)',
  },
  // 05 · Blush Pink → Rose
  blush: {
    surface:
      'linear-gradient(155deg, rgba(253,238,246,0.94) 0%, rgba(255,255,255,0.90) 54%, rgba(255,233,241,0.94) 100%)',
    wash:
      'radial-gradient(115% 85% at 100% 0%, rgba(236,72,153,0.12) 0%, rgba(236,72,153,0) 62%), linear-gradient(155deg, rgba(252,228,241,0.96) 0%, rgba(255,250,252,0.93) 54%, rgba(254,220,235,0.96) 100%)',
    edge:
      'linear-gradient(150deg, rgba(236,72,153,0.40) 0%, rgba(249,168,212,0.30) 45%, rgba(17,24,39,0.06) 100%)',
    glow: 'linear-gradient(135deg, rgba(236,72,153,0.30), rgba(244,114,182,0.28))',
    shadow: '0 8px 26px -16px rgba(157,23,77,0.38)',
    shadowHover: '0 26px 54px -18px rgba(219,39,119,0.32)',
  },
  // 06 · Mauve → Violet
  mauve: {
    surface:
      'linear-gradient(155deg, rgba(248,240,250,0.94) 0%, rgba(255,255,255,0.90) 52%, rgba(238,233,254,0.94) 100%)',
    wash:
      'radial-gradient(115% 85% at 100% 0%, rgba(147,51,234,0.12) 0%, rgba(147,51,234,0) 62%), linear-gradient(155deg, rgba(242,229,247,0.96) 0%, rgba(252,250,255,0.93) 52%, rgba(228,220,253,0.96) 100%)',
    edge:
      'linear-gradient(150deg, rgba(192,132,252,0.44) 0%, rgba(196,181,253,0.28) 45%, rgba(17,24,39,0.06) 100%)',
    glow: 'linear-gradient(135deg, rgba(147,51,234,0.30), rgba(167,139,250,0.30))',
    shadow: '0 8px 26px -16px rgba(88,28,135,0.42)',
    shadowHover: '0 26px 54px -18px rgba(126,34,206,0.36)',
  },
};

// Explicit desktop grid placement — written as full literal class strings so Tailwind's
// scanner picks them up. Left column feeds the hub from the right, right column from the left.
const applications = [
  {
    number: '01',
    title: 'Digital Pathology',
    desc: 'Learns tumor morphology, tissue architecture and cellular phenotypes from H&E whole-slide images.',
    icon: icons.histopathology,
    image: pathologyImg,
    accent: '#7C3AED',
    tint: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(168,85,247,0.08))',
    theme: themes.lavender,
    side: 'left',
    placement: 'lg:col-start-1 lg:row-start-1',
  },
  {
    number: '02',
    title: 'Quantitative IHC',
    desc: 'Measures biomarker expression and spatial distribution across ER, PR, HER2, Ki-67, PD-L1 and additional markers.',
    icon: icons.ihc,
    image: quantihcImg,
    accent: '#8B5CF6',
    tint: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(168,85,247,0.08))',
    theme: themes.lilac,
    side: 'left',
    placement: 'lg:col-start-1 lg:row-start-2',
  },
  {
    number: '03',
    title: 'Genomics',
    desc: 'Links mutations, genomic signatures and molecular states—including MSI, HRD and TMB—with tissue phenotype.',
    icon: icons.genomics,
    image: genomicsImg,
    accent: '#A855F7',
    tint: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(217,70,239,0.08))',
    theme: themes.violet,
    side: 'left',
    placement: 'lg:col-start-1 lg:row-start-3',
  },
  {
    number: '04',
    title: 'Transcriptomics',
    desc: 'Connects gene-expression programs with histologic patterns, biological pathways and disease states.',
    icon: icons.transcriptomics,
    image: transcriptomicsImg,
    accent: '#D946EF',
    tint: 'linear-gradient(135deg, rgba(217,70,239,0.12), rgba(236,72,153,0.08))',
    theme: themes.orchid,
    side: 'right',
    placement: 'lg:col-start-3 lg:row-start-1',
  },
  {
    number: '05',
    title: 'Spatial Biology',
    desc: 'Maps tumor–immune architecture, cellular neighborhoods and interactions within the tumor microenvironment.',
    icon: icons.spatial,
    image: spatialImg,
    accent: '#EC4899',
    tint: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(244,114,182,0.08))',
    theme: themes.blush,
    side: 'right',
    placement: 'lg:col-start-3 lg:row-start-2',
  },
  {
    number: '06',
    title: 'Clinical Outcomes',
    desc: 'Links treatments, response, recurrence and survival data with pathology and multiomic profiles to develop predictive research models.',
    icon: icons.outcomes,
    image: clinicalImg,
    accent: '#7C3AED',
    tint: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.08))',
    theme: themes.mauve,
    side: 'right',
    placement: 'lg:col-start-3 lg:row-start-3',
  },
];

/* Data particles scattered through the ambient field. Kept off the centre
   column so nothing ever drifts across the hub or the connectors. */
const PARTICLES = [
  { x: '6%', y: '18%', s: 5, tone: '#A855F7', o: 0.5 },
  { x: '13%', y: '46%', s: 3, tone: '#EC4899', o: 0.45 },
  { x: '4%', y: '72%', s: 4, tone: '#7C3AED', o: 0.4 },
  { x: '21%', y: '88%', s: 3, tone: '#D946EF', o: 0.35 },
  { x: '94%', y: '22%', s: 4, tone: '#EC4899', o: 0.45 },
  { x: '87%', y: '55%', s: 3, tone: '#A855F7', o: 0.4 },
  { x: '96%', y: '78%', s: 5, tone: '#7C3AED', o: 0.35 },
  { x: '78%', y: '10%', s: 3, tone: '#D946EF', o: 0.4 },
];

function ApplicationCard({ app, nextAccent }) {
  return (
    <li className="app-item group relative min-h-[420px] sm:min-h-[460px]">
      {/* ---- Link to the next module in the same row ----
          Sits in the column gap and only appears once the grid is three
          across, so it never points at a module on another row or off the
          side of a phone. It stays put while the card it belongs to lifts
          away from it on hover. */}
      {nextAccent && (
        <span
          className="pipe-link pointer-events-none absolute left-full top-1/2 z-[1] hidden h-px w-6 -translate-y-1/2 lg:block"
          aria-hidden="true"
        >
          <span
            className="pipe-rail absolute inset-0 origin-left rounded-full"
            style={{
              backgroundImage: `linear-gradient(90deg, ${app.accent}80, ${nextAccent})`,
            }}
          />
          {/* Illumination that lifts as either end of the link is hovered */}
          <span
            className="absolute -inset-y-[1.5px] inset-x-0 rounded-full opacity-0 blur-[2px] transition-opacity duration-[350ms] ease-out group-hover:opacity-100"
            style={{
              backgroundImage: `linear-gradient(90deg, ${app.accent}, ${nextAccent})`,
            }}
          />

          {/* The arrow, centred in the gap */}
          <svg
            className="absolute left-1/2 top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 overflow-visible"
            viewBox="0 0 9 9"
            fill="none"
          >
            <path
              d="M2.6 1.2L6 4.5L2.6 7.8"
              stroke={nextAccent}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* One packet crossing the gap — the row's ambient data flow */}
          <span
            className="pipe-packet absolute top-1/2 h-[7px] w-[7px] rounded-full opacity-0"
            style={{
              left: 0,
              marginTop: -3.5,
              marginLeft: -3.5,
              backgroundColor: '#ffffff',
              boxShadow: `0 0 10px 2px ${nextAccent}`,
            }}
          />
        </span>
      )}

      {/* The card's shade travels as custom properties, so the per-card hover
          shadow and accent can still be expressed as Tailwind classes. */}
      <article
        className="relative h-full rounded-[26px]"
        style={{
          '--card-shadow': app.theme.shadow,
          '--card-shadow-hover': app.theme.shadowHover,
          '--card-accent': app.accent,
        }}
      >
        {/* Gradient border glow on hover, in the card's own shade */}
        <div
          className="pointer-events-none absolute -inset-[3px] rounded-[29px] opacity-0 blur-[14px] transition-opacity duration-[350ms] ease-out group-hover:opacity-100"
          style={{ backgroundImage: app.theme.glow }}
          aria-hidden="true"
        />

        {/* Gradient hairline: a 1px shell carrying the card's ramp, so it
            reads as an edge-lit module at rest rather than only on hover. */}
        <div
          className="relative h-full rounded-[26px] p-px shadow-[var(--card-shadow)] transition-all duration-[350ms] ease-out group-hover:-translate-y-2 group-hover:shadow-[var(--card-shadow-hover)]"
          style={{ backgroundImage: app.theme.edge }}
        >
          <div
            className="relative flex h-full flex-col overflow-hidden rounded-[25px]"
            style={{ backgroundImage: app.theme.surface }}
          >
            {/* ---- The module's own image, filling the card ----
                The card's shade stays underneath as the ground the image
                loads onto, so there is never a bare frame while it arrives. */}
            <img
              src={app.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
            />

            {/* Readability gradient — near-clear across the top of the frame,
                deepening only over the band the type actually occupies. */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.06) 30%, rgba(0,0,0,0.34) 56%, rgba(0,0,0,0.64) 78%, rgba(0,0,0,0.82) 100%)',
              }}
              aria-hidden="true"
            />

            {/* A little more of it on a phone, where the card is at its widest
                and the description runs to its most lines. */}
            <span
              className="pointer-events-none absolute inset-0 sm:hidden"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(0,0,0,0) 42%, rgba(0,0,0,0.14) 100%)',
              }}
              aria-hidden="true"
            />

            {/* The card's own shade over the photograph, so six different
                figures still read as one family. */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(155deg, ${app.accent}2E 0%, rgba(0,0,0,0) 46%, ${app.accent}24 100%)`,
              }}
              aria-hidden="true"
            />

            {/* Hover deepens the gradient rather than moving anything */}
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[350ms] ease-out group-hover:opacity-100"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.22) 100%)',
              }}
              aria-hidden="true"
            />

            {/* Top sheen along the module's upper edge */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent, ${app.accent}80, transparent)`,
              }}
              aria-hidden="true"
            />

            {/* The index, held at the top corner where the image is clearest */}
            <span
              className="absolute right-6 top-6 rounded-full border px-2.5 py-1 font-sans text-xs font-semibold tracking-[0.22em] backdrop-blur-md sm:right-7 sm:top-7"
              style={{
                color: 'rgba(255,255,255,0.92)',
                borderColor: 'rgba(255,255,255,0.32)',
                backgroundColor: 'rgba(255,255,255,0.14)',
              }}
            >
              {app.number}
            </span>

            {/* ---- Content, anchored to the foot of the image ---- */}
            <div className="relative mt-auto flex flex-col p-7 sm:p-8">
              <div className="app-icon-float w-fit">
                <div
                  className="relative flex h-14 w-14 items-center justify-center rounded-2xl border shadow-[0_10px_24px_-14px_rgba(0,0,0,0.75)] backdrop-blur-md transition-transform duration-[350ms] ease-out group-hover:scale-110"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${app.accent}66, ${app.accent}2E)`,
                    color: '#ffffff',
                    borderColor: 'rgba(255,255,255,0.34)',
                  }}
                >
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    style={{
                      backgroundImage:
                        'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 60%)',
                    }}
                    aria-hidden="true"
                  />
                  <span className="relative">{app.icon}</span>
                </div>
              </div>

              <h3 className="relative mt-5 font-serif text-[1.5rem] font-bold leading-tight tracking-[-0.01em] text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">
                {app.title}
              </h3>

              {/* Accent rule under the title, drawing out on hover */}
              <span
                className="relative mt-3 block h-[2px] w-9 origin-left rounded-full transition-transform duration-[420ms] ease-out group-hover:scale-x-[2.6]"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.92), ${app.accent} 62%, ${app.accent}00 100%)`,
                }}
                aria-hidden="true"
              />

              <p className="relative mt-4 font-sans text-[13.5px] leading-relaxed text-white/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]">
                {app.desc}
              </p>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}

/* ================================================================
   Specimen-centric composition

   The section's opening is no longer a wall of copy: the same three
   paragraphs now sit inside a working diagram of the platform. One
   specimen feeds five modalities, the five feed one core, and the core
   feeds the intelligence the copy describes. Every mark here is drawn
   from the brand ramp the cards below already use.
================================================================ */

// Every connector in the constellation is cut to the same length, so one
// dash figure drives the draw-on for all five.
const LINK_LEN = 44;

const glyphs = {
  // Tissue block / specimen
  specimen: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <path d="M4 7.4l8-3.6 8 3.6v9.2l-8 3.6-8-3.6z" />
      <path d="M4 7.4l8 3.6 8-3.6M12 11v9.2" opacity="0.55" />
      <circle cx="9.1" cy="14.2" r="1.05" fill="currentColor" stroke="none" opacity="0.8" />
      <circle cx="15.2" cy="15.4" r="0.85" fill="currentColor" stroke="none" opacity="0.6" />
    </svg>
  ),
  // Modalities converging into one stream
  streams: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <path d="M2.8 4.6h5.2M2.8 9.4h4M2.8 14.6h4M2.8 19.4h5.2" />
      <path d="M8 4.6c4.6 0 3.4 6.2 7.4 6.2M6.8 9.4c4 0 4.4 2.2 8.6 2.2M6.8 14.6c4 0 4.4-2.2 8.6-2.2M8 19.4c4.6 0 3.4-6.2 7.4-6.2" opacity="0.75" />
      <circle cx="18" cy="12" r="2.3" />
    </svg>
  ),
  // Neural core
  core: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <circle cx="12" cy="12" r="2.6" />
      <circle cx="12" cy="4.2" r="1.4" />
      <circle cx="19.2" cy="8.1" r="1.4" />
      <circle cx="19.2" cy="15.9" r="1.4" />
      <circle cx="12" cy="19.8" r="1.4" />
      <circle cx="4.8" cy="15.9" r="1.4" />
      <circle cx="4.8" cy="8.1" r="1.4" />
      <path d="M12 5.6v3.8M14.3 10.8l3.6-1.8M14.3 13.2l3.6 1.8M12 14.6v3.8M9.7 13.2l-3.6 1.8M9.7 10.8L6.1 9" />
    </svg>
  ),
  // Intelligence read out of the model
  intelligence: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
      <path d="M9.2 18.4h5.6M10 21h4" />
      <path d="M12 3.2a6 6 0 00-3.4 10.9c.5.4.8 1 .8 1.6v.7h5.2v-.7c0-.6.3-1.2.8-1.6A6 6 0 0012 3.2z" />
      <path d="M10.4 11.2l1.6-2 1.6 2" opacity="0.75" />
    </svg>
  ),
  // Biomarker model curve
  model: (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" {...stroke}>
      <path d="M3.4 19.2h17.2" />
      <path d="M4.8 15.6c3.2 0 3.6-8.4 7.2-8.4s4 6 7.8 6" />
      <circle cx="12" cy="7.2" r="1.5" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  ),
  // Molecular phenotype
  phenotype: (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" {...stroke}>
      <circle cx="6.4" cy="7.2" r="2.2" />
      <circle cx="17.4" cy="6.6" r="1.8" />
      <circle cx="12" cy="16.6" r="2.4" />
      <path d="M8.2 8.6l2.6 5.6M15.9 8.1l-2.5 6.2M8.6 6.9h6.9" />
    </svg>
  ),
  // Treatment response trace
  response: (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" {...stroke}>
      <rect x="2.8" y="4.2" width="18.4" height="15.6" rx="2.4" />
      <path d="M5.6 14.8h2.8l1.7-3.4 2.4 5.2 1.9-4 1.3 2.2h2.7" />
    </svg>
  ),
  // Cohort stratification
  cohort: (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" {...stroke}>
      <circle cx="7" cy="6.6" r="2" />
      <circle cx="17" cy="6.6" r="2" />
      <path d="M3.4 12.4c0-2 1.6-2.9 3.6-2.9s3.6.9 3.6 2.9M13.4 12.4c0-2 1.6-2.9 3.6-2.9s3.6.9 3.6 2.9" />
      <path d="M4.4 16.4h6.2M13.4 16.4h6.2M4.4 19.4h4.2M13.4 19.4h4.2" opacity="0.7" />
    </svg>
  ),
  // Drug target
  target: (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" {...stroke}>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <path d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4" opacity="0.7" />
    </svg>
  ),
  // Dataset
  dataset: (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" {...stroke}>
      <ellipse cx="12" cy="6" rx="7.4" ry="2.8" />
      <path d="M4.6 6v12c0 1.55 3.31 2.8 7.4 2.8s7.4-1.25 7.4-2.8V6" />
      <path d="M4.6 12c0 1.55 3.31 2.8 7.4 2.8s7.4-1.25 7.4-2.8" opacity="0.6" />
    </svg>
  ),
  // Organ pack
  organ: (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" {...stroke}>
      <path d="M12 20.4s-7-4.3-7-9.2a3.9 3.9 0 017-2.4 3.9 3.9 0 017 2.4c0 4.9-7 9.2-7 9.2z" />
      <path d="M8.6 11.6h2l1.1-2 1.5 3.6 1-1.6h2.2" opacity="0.8" />
    </svg>
  ),
  // Validated application
  validated: (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" {...stroke}>
      <path d="M12 2.9l7.2 2.6v6.1c0 4.3-3 7.5-7.2 9.5-4.2-2-7.2-5.2-7.2-9.5V5.5z" />
      <path d="M8.9 12l2.2 2.2 4-4.4" />
    </svg>
  ),
  // Data flowing back round
  loop: (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" {...stroke}>
      <path d="M20 12a8 8 0 01-13.7 5.6" />
      <path d="M4 12a8 8 0 0113.7-5.6" />
      <path d="M17.7 2.9v3.5h-3.5M6.3 21.1v-3.5h3.5" />
    </svg>
  ),
  // A stronger model each turn
  stronger: (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" {...stroke}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="7.4" strokeDasharray="2.6 3.4" opacity="0.75" />
      <path d="M12 1.6v2.6M12 19.8v2.6M1.6 12h2.6M19.8 12h2.6" opacity="0.6" />
    </svg>
  ),
};

/* A thin molecular scatter behind the heading — the section's own weather,
   kept well clear of the type itself. */
const INTRO_DOTS = [
  { x: '6%', y: '18%', s: 5, tone: '#A855F7', o: 0.4 },
  { x: '15%', y: '58%', s: 3, tone: '#EC4899', o: 0.34 },
  { x: '24%', y: '30%', s: 4, tone: '#7C3AED', o: 0.3 },
  { x: '33%', y: '78%', s: 3, tone: '#D946EF', o: 0.26 },
  { x: '68%', y: '76%', s: 3, tone: '#A855F7', o: 0.28 },
  { x: '77%', y: '26%', s: 4, tone: '#D946EF', o: 0.32 },
  { x: '86%', y: '62%', s: 3, tone: '#EC4899', o: 0.3 },
  { x: '94%', y: '20%', s: 5, tone: '#7C3AED', o: 0.36 },
];

/* ================================================================
   Heading backdrop — an abstract AI network

   Two mirrored node clusters sit outside the heading's measure, joined by
   the edges between them. Drawn once, at very low contrast, so the type
   always wins; the reveal only fades the whole layer in.
================================================================ */
const HEAD_NODES = [
  { x: 68, y: 88 }, { x: 194, y: 44 }, { x: 146, y: 212 }, { x: 268, y: 150 },
  { x: 90, y: 322 }, { x: 232, y: 356 }, { x: 356, y: 264 }, { x: 330, y: 72 },
  { x: 1132, y: 88 }, { x: 1006, y: 44 }, { x: 1054, y: 212 }, { x: 932, y: 150 },
  { x: 1110, y: 322 }, { x: 968, y: 356 }, { x: 844, y: 264 }, { x: 870, y: 72 },
];

const HEAD_EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 3], [0, 4], [2, 4], [4, 5], [5, 6], [3, 6], [1, 7],
  [3, 7], [2, 6], [6, 5], [7, 3],
  [8, 9], [8, 10], [9, 11], [10, 11], [8, 12], [10, 12], [12, 13], [13, 14],
  [11, 14], [9, 15], [11, 15], [10, 14], [14, 13], [15, 11],
];

/* ================================================================
   Intelligence Engine geometry

   Every ring, tick, satellite and inbound particle in the hub is derived
   from these four numbers, so the SVG layers and the GSAP tweens that
   drive them can never drift apart. The 324px field is the 260px core
   disc plus the `-inset-8` ring zone — it stays inside the 340px hub
   column at every breakpoint.
================================================================ */
const ENGINE_FIELD = 324;
const ENGINE_C = ENGINE_FIELD / 2;
const ENGINE_ORBIT_R = 147;
const ENGINE_CORE_R = 130;

// One satellite per application, spaced evenly around the ring with the
// first at the bottom, on the bearing of the spine that carries the
// engine's output down into the pipeline.
const ENGINE_ANGLES = [90, 150, 210, 270, 330, 30];

const ENGINE_NODES = ENGINE_ANGLES.map((deg, i) => {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    accent: applications[i].accent,
    x: +(ENGINE_C + ENGINE_ORBIT_R * cos).toFixed(2),
    y: +(ENGINE_C + ENGINE_ORBIT_R * sin).toFixed(2),
    // Where an inbound particle dissolves into the core's rim.
    ix: +(ENGINE_C + (ENGINE_CORE_R - 6) * cos).toFixed(2),
    iy: +(ENGINE_C + (ENGINE_CORE_R - 6) * sin).toFixed(2),
  };
});

// Fine measurement ticks around the outermost ring.
const ENGINE_TICKS = Array.from({ length: 48 }, (_, i) => {
  const rad = (i * 360 / 48 * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const long = i % 4 === 0;
  const r1 = long ? 150 : 154;
  return {
    x1: +(ENGINE_C + r1 * cos).toFixed(2),
    y1: +(ENGINE_C + r1 * sin).toFixed(2),
    x2: +(ENGINE_C + 159 * cos).toFixed(2),
    y2: +(ENGINE_C + 159 * sin).toFixed(2),
    long,
  };
});

// A short radial fan just inside the glass rim, so the core reads as an
// instrument rather than a plain disc. Coordinates are in the core's own
// 260px viewBox.
const CORE_FAN = Array.from({ length: 60 }, (_, i) => {
  const rad = (i * 6 * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x1: +(130 + 116 * cos).toFixed(2),
    y1: +(130 + 116 * sin).toFixed(2),
    x2: +(130 + 122 * cos).toFixed(2),
    y2: +(130 + 122 * sin).toFixed(2),
  };
});

/* Molecular motes drifting in the space around the engine. */
const ENGINE_MOTES = [
  { x: '4%', y: '14%', s: 4, tone: '#A855F7', o: 0.5 },
  { x: '90%', y: '9%', s: 3, tone: '#EC4899', o: 0.45 },
  { x: '-2%', y: '58%', s: 3, tone: '#D946EF', o: 0.4 },
  { x: '96%', y: '48%', s: 4, tone: '#7C3AED', o: 0.42 },
  { x: '12%', y: '92%', s: 3, tone: '#EC4899', o: 0.38 },
  { x: '84%', y: '90%', s: 4, tone: '#A855F7', o: 0.44 },
];

/* The five modalities orbiting the core. Geometry is fixed in the 400×400
   viewBox the connector SVG uses, and each label position is that same
   point expressed as a percentage — one source of truth for both layers. */
const MODALITY_NODES = [
  {
    label: 'Pathology Images',
    accent: '#7C3AED',
    icon: icons.histopathology,
    pos: { left: '50%', top: '16.25%' },
    line: { x1: 200, y1: 92, x2: 200, y2: 136 },
  },
  {
    label: 'Biomarker Expression',
    accent: '#A855F7',
    icon: icons.ihc,
    pos: { left: '82.1%', top: '39.57%' },
    line: { x1: 302.7, y1: 166.6, x2: 260.9, y2: 180.2 },
  },
  {
    label: 'Spatial Biology',
    accent: '#D946EF',
    icon: icons.spatial,
    pos: { left: '69.85%', top: '77.3%' },
    line: { x1: 263.5, y1: 287.4, x2: 237.6, y2: 251.8 },
  },
  {
    label: 'Genomic Data',
    accent: '#EC4899',
    icon: icons.genomics,
    pos: { left: '30.15%', top: '77.3%' },
    line: { x1: 136.5, y1: 287.4, x2: 162.4, y2: 251.8 },
  },
  {
    label: 'Clinical Context',
    accent: '#8B5CF6',
    icon: icons.outcomes,
    pos: { left: '17.9%', top: '39.57%' },
    line: { x1: 97.3, y1: 166.6, x2: 139.1, y2: 180.2 },
  },
];

/* The journey the specimen makes, as four glass stages. */
const FLOW_STAGES = [
  { label: 'Tumor Specimen', icon: glyphs.specimen, accent: '#7C3AED', tissue: true },
  { label: 'Multimodal Biological Data', icon: glyphs.streams, accent: '#A855F7' },
  { label: 'OmicMind Foundation Model', icon: glyphs.core, accent: '#D946EF' },
  { label: 'Biological & Clinical Intelligence', icon: glyphs.intelligence, accent: '#EC4899' },
];

/* What the platform supports — the second paragraph's own list, lifted out
   as interactive pills so each concept can be read on its own. */
const INSIGHTS = [
  { label: 'Biomarker Models', icon: glyphs.model, accent: '#7C3AED' },
  { label: 'Molecular Phenotype Predictions', icon: glyphs.phenotype, accent: '#A855F7' },
  { label: 'Treatment-Response Research', icon: glyphs.response, accent: '#C026D3' },
  { label: 'Clinical-Trial Cohort Stratification', icon: glyphs.cohort, accent: '#DB2777' },
  { label: 'Drug-Target Insights', icon: glyphs.target, accent: '#8B5CF6' },
];

/* The compounding loop: each link makes the next one stronger. */
const COMPOUNDING = [
  { label: 'Dataset', icon: glyphs.dataset, accent: '#7C3AED' },
  { label: 'Organ Pack', icon: glyphs.organ, accent: '#9333EA' },
  { label: 'Validated Application', icon: glyphs.validated, accent: '#C026D3' },
  { label: 'More Data', icon: glyphs.loop, accent: '#DB2777' },
  { label: 'Stronger Foundation Model', icon: glyphs.stronger, accent: '#7C3AED' },
];

/* ================================================================
   Closing synthesis — the specimen → data → intelligence stage

   The closing paragraph already names every concept the platform runs
   on; this stage draws them. Six intake concepts feed thin connectors
   into the engine node, the paragraph reads underneath as the main
   content, and five application concepts fan back out. Everything
   apart from the paragraph is decoration — no wording is repeated,
   restated or replaced.
================================================================ */

// Concepts named in the first half of the closing paragraph.
const CLOSING_INPUTS = [
  { label: 'Tissue Morphology', icon: icons.histopathology, accent: '#7C3AED' },
  { label: 'Protein Expression', icon: icons.ihc, accent: '#8B5CF6' },
  { label: 'Genomic Alterations', icon: icons.genomics, accent: '#A855F7' },
  { label: 'Transcriptomic Programs', icon: icons.transcriptomics, accent: '#C026D3' },
  { label: 'Spatial Context', icon: icons.spatial, accent: '#D946EF' },
  { label: 'Clinical Outcomes', icon: icons.outcomes, accent: '#EC4899' },
];

// Concepts named in the second half.
const CLOSING_OUTPUTS = [
  { label: 'Biomarker Development', icon: glyphs.model, accent: '#7C3AED' },
  { label: 'Molecular Phenotype Prediction', icon: glyphs.phenotype, accent: '#9333EA' },
  { label: 'Treatment-Response Research', icon: glyphs.response, accent: '#C026D3' },
  { label: 'Clinical-Trial Cohort Stratification', icon: glyphs.cohort, accent: '#DB2777' },
  { label: 'Drug-Target Discovery', icon: glyphs.target, accent: '#8B5CF6' },
];

// Connector anchors, held in the strips' own 600×78 space so a hovered
// concept and the line it owns can never drift apart.
const CLOSING_IN_X = [40, 144, 248, 352, 456, 560];
const CLOSING_OUT_X = [60, 180, 300, 420, 540];

// A faint molecular net behind the glass — nodes and the edges between
// them, drawn once in a 600×300 space and scaled to the container.
const CLOSING_NET_NODES = [
  [38, 44], [112, 98], [74, 180], [168, 46], [212, 144], [286, 88],
  [300, 198], [368, 54], [430, 142], [512, 94], [560, 184], [478, 216],
  [150, 234], [248, 264], [382, 248], [566, 46],
];
const CLOSING_NET_EDGES = [
  [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [4, 6], [5, 7],
  [7, 8], [8, 9], [9, 10], [8, 11], [10, 11], [2, 12], [12, 13],
  [13, 6], [13, 14], [14, 11], [9, 15], [6, 14],
];

// Motes drifting inside the glass. The last three are desktop-only, so
// phones carry roughly half the particle count.
const CLOSING_PARTICLES = [
  { x: '8%', y: '22%', s: 4, tone: '#A855F7', o: 0.4, wide: false },
  { x: '21%', y: '72%', s: 3, tone: '#EC4899', o: 0.32, wide: false },
  { x: '46%', y: '14%', s: 3, tone: '#D946EF', o: 0.3, wide: false },
  { x: '78%', y: '64%', s: 4, tone: '#7C3AED', o: 0.34, wide: false },
  { x: '91%', y: '28%', s: 3, tone: '#A855F7', o: 0.3, wide: false },
  { x: '34%', y: '42%', s: 3, tone: '#C026D3', o: 0.26, wide: true },
  { x: '63%', y: '84%', s: 4, tone: '#EC4899', o: 0.28, wide: true },
  { x: '88%', y: '80%', s: 3, tone: '#8B5CF6', o: 0.3, wide: true },
];

/* One concept, as an interactive glass tag. Hover lifts it, warms the
   glow and brightens the connector it owns — and that connector lives
   in a sibling SVG, so the active index is held by the parent. */
function ConceptTag({ item, active, dimmed, onActivate, onRelease }) {
  return (
    <span className="fm-closing-node inline-block">
      <button
        type="button"
        onMouseEnter={onActivate}
        onMouseLeave={onRelease}
        onFocus={onActivate}
        onBlur={onRelease}
        className="group flex cursor-default items-center gap-1.5 rounded-full border px-2.5 py-1.5 backdrop-blur-xl transition-[transform,box-shadow,border-color,opacity] duration-[350ms] ease-out hover:-translate-y-1 hover:scale-[1.05] focus:outline-none focus-visible:-translate-y-1 focus-visible:scale-[1.05] sm:gap-2 sm:px-3.5 sm:py-2"
        style={{
          borderColor: active ? `${item.accent}66` : `${item.accent}30`,
          backgroundImage: `linear-gradient(135deg, ${item.accent}1C, ${item.accent}08)`,
          boxShadow: active
            ? `0 0 0 5px ${item.accent}14, 0 18px 32px -18px ${item.accent}`
            : `0 10px 24px -20px ${item.accent}`,
          opacity: dimmed ? 0.5 : 1,
        }}
      >
        <span
          className="flex items-center justify-center [&_svg]:h-[15px] [&_svg]:w-[15px]"
          style={{ color: item.accent }}
          aria-hidden="true"
        >
          {item.icon}
        </span>
        <span
          className="whitespace-nowrap font-sans text-[9.5px] font-semibold tracking-[0.015em] transition-colors duration-300 sm:text-[11px]"
          style={{ color: active ? item.accent : '#374151' }}
        >
          {item.label}
        </span>
      </button>
    </span>
  );
}

function ClosingSynthesis() {
  const [activeIn, setActiveIn] = useState(null);
  const [activeOut, setActiveOut] = useState(null);

  // A connector reads at full strength on its own hover, and steps back
  // while a neighbour is held.
  const linkStyle = (isActive, activeIndex) => ({
    strokeWidth: isActive ? 2.8 : 1.4,
    opacity: activeIndex === null ? 0.75 : isActive ? 1 : 0.22,
    transition: 'stroke-width 320ms ease, opacity 320ms ease',
  });

  return (
    <div className="fm-closing-stage relative mx-auto mt-20 w-full max-w-5xl lg:mt-24">
      {/* Soft radial glow sitting behind the glass */}
      <div
        className="pointer-events-none absolute -inset-x-6 -inset-y-12 rounded-[3rem] blur-[70px] sm:-inset-x-12"
        style={{
          backgroundImage:
            'radial-gradient(55% 60% at 50% 45%, rgba(124,58,237,0.14) 0%, rgba(236,72,153,0.09) 48%, rgba(255,255,255,0) 76%)',
        }}
        aria-hidden="true"
      />

      {/* Slowly turning aura — the glowing border read as light rather
          than as a hard stroke. Desktop and tablet only. */}
      <div
        className="fm-closing-aura pointer-events-none absolute -inset-[3px] hidden rounded-[2.2rem] opacity-45 blur-2xl sm:block"
        style={{
          backgroundImage:
            'conic-gradient(from 0deg, rgba(124,58,237,0.35), rgba(217,70,239,0.3), rgba(236,72,153,0.35), rgba(168,85,247,0.3), rgba(124,58,237,0.35))',
        }}
        aria-hidden="true"
      />

      {/* Gradient hairline wrapping the glass panel */}
      <div
        className="fm-closing-shell relative rounded-[2rem] p-[1.5px] shadow-[0_36px_90px_-52px_rgba(124,58,237,0.7)]"
        style={{
          backgroundImage:
            'linear-gradient(150deg, rgba(124,58,237,0.5) 0%, rgba(217,70,239,0.28) 45%, rgba(236,72,153,0.5) 100%)',
        }}
      >
        <div className="relative overflow-hidden rounded-[calc(2rem-1.5px)] bg-white/75 px-5 py-10 backdrop-blur-2xl sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          {/* ---------- Decorative field inside the glass ---------- */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {/* Molecular network, masked away from the middle so the
                paragraph never has to compete with it */}
            <svg
              viewBox="0 0 600 300"
              preserveAspectRatio="xMidYMid slice"
              className="fm-closing-net absolute inset-0 h-full w-full opacity-50 sm:opacity-80 lg:opacity-100"
              style={{
                maskImage: 'radial-gradient(68% 54% at 50% 50%, transparent 0%, #000 80%)',
                WebkitMaskImage: 'radial-gradient(68% 54% at 50% 50%, transparent 0%, #000 80%)',
              }}
            >
              {CLOSING_NET_EDGES.map(([a, b]) => (
                <line
                  key={`cs-edge-${a}-${b}`}
                  x1={CLOSING_NET_NODES[a][0]}
                  y1={CLOSING_NET_NODES[a][1]}
                  x2={CLOSING_NET_NODES[b][0]}
                  y2={CLOSING_NET_NODES[b][1]}
                  stroke="rgba(168,85,247,0.16)"
                  strokeWidth="0.9"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {CLOSING_NET_NODES.map(([cx, cy], i) => (
                <circle
                  key={`cs-net-${i}`}
                  className="fm-closing-net-dot"
                  cx={cx}
                  cy={cy}
                  r={i % 3 === 0 ? 3 : 2.1}
                  fill={i % 2 === 0 ? '#A855F7' : '#EC4899'}
                  opacity="0.34"
                />
              ))}
            </svg>

            {/* Gentle floating particles */}
            {CLOSING_PARTICLES.map((p, i) => (
              <span
                key={`cs-particle-${i}`}
                className={`fm-closing-particle absolute rounded-full ${p.wide ? 'hidden sm:block' : ''}`}
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.s,
                  height: p.s,
                  opacity: p.o,
                  backgroundColor: p.tone,
                  boxShadow: `0 0 10px 2px ${p.tone}55`,
                }}
              />
            ))}
          </div>

          {/* ---------- The flow ---------- */}
          <div className="relative z-10">
            {/* Stage 1 · the specimen everything is read from */}
            <div className="flex flex-col items-center" aria-hidden="true">
              <span className="fm-closing-node flex h-11 w-11 items-center justify-center rounded-2xl border border-[#7C3AED]/25 bg-white/80 text-[#7C3AED] shadow-[0_14px_30px_-20px_rgba(124,58,237,0.9)] backdrop-blur-xl">
                {glyphs.specimen}
              </span>
              <span
                className="mt-2.5 block h-6 w-[2px] rounded-full sm:h-8"
                style={{
                  backgroundImage:
                    'linear-gradient(180deg, rgba(124,58,237,0.55), rgba(217,70,239,0.15))',
                }}
              />
            </div>

            {/* Stage 2 · tissue, molecular and spatial concepts */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:mt-4 sm:gap-3">
              {CLOSING_INPUTS.map((item, i) => (
                <ConceptTag
                  key={item.label}
                  item={item}
                  active={activeIn === i}
                  dimmed={activeIn !== null && activeIn !== i}
                  onActivate={() => setActiveIn(i)}
                  onRelease={() => setActiveIn(null)}
                />
              ))}
            </div>

            {/* Connectors converging on the engine */}
            <svg
              viewBox="0 0 600 78"
              preserveAspectRatio="none"
              className="mt-2 hidden h-[54px] w-full sm:block lg:h-[68px]"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="fmClosingIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#D946EF" stopOpacity="0.95" />
                </linearGradient>
              </defs>
              {CLOSING_IN_X.map((x, i) => (
                <line
                  key={`cs-in-${i}`}
                  className="fm-closing-link"
                  x1={x}
                  y1="2"
                  x2="300"
                  y2="76"
                  stroke="url(#fmClosingIn)"
                  strokeLinecap="round"
                  strokeDasharray="4 7"
                  vectorEffect="non-scaling-stroke"
                  style={linkStyle(activeIn === i, activeIn)}
                />
              ))}
            </svg>

            {/* Phones keep the hierarchy with a single quiet spine */}
            <span
              className="mx-auto mt-3 block h-6 w-[2px] rounded-full sm:hidden"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(168,85,247,0.15), rgba(217,70,239,0.6))',
              }}
              aria-hidden="true"
            />

            {/* Stage 3 · the engine */}
            <div className="flex justify-center" aria-hidden="true">
              <div className="fm-closing-node relative h-[74px] w-[74px] sm:h-[88px] sm:w-[88px]">
                <div
                  className="fm-closing-hub-glow pointer-events-none absolute -inset-4 rounded-full opacity-70 blur-2xl"
                  style={{
                    backgroundImage:
                      'conic-gradient(from 0deg, rgba(124,58,237,0.5), rgba(217,70,239,0.45), rgba(236,72,153,0.5), rgba(168,85,247,0.45), rgba(124,58,237,0.5))',
                  }}
                />
                <div className="fm-closing-hub-ring pointer-events-none absolute -inset-[7px] rounded-full border border-dashed border-[#A855F7]/40" />
                <div
                  className="absolute inset-0 rounded-full p-[2px] shadow-[0_18px_44px_-20px_rgba(124,58,237,0.6)]"
                  style={{ backgroundImage: 'linear-gradient(135deg, #7C3AED, #D946EF, #EC4899)' }}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white/90 text-[#7C3AED] backdrop-blur-xl [&_svg]:h-7 [&_svg]:w-7 sm:[&_svg]:h-8 sm:[&_svg]:w-8">
                    {glyphs.core}
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 4 · the paragraph, unchanged, carrying the section */}
            <p className="fm-closing mx-auto mt-8 max-w-3xl text-center font-sans text-base leading-[1.7] text-gray-600 sm:mt-9 sm:text-lg">
              A specimen-centric AI engine connecting tissue morphology, protein expression,
              genomic alterations, transcriptomic programs, spatial context and clinical
              outcomes around each tumor specimen. The integrated data foundation supports
              biomarker development, molecular phenotype prediction, treatment-response
              research, clinical-trial cohort stratification and drug-target discovery.
            </p>

            {/* Connectors fanning back out into the applications */}
            <svg
              viewBox="0 0 600 78"
              preserveAspectRatio="none"
              className="mt-6 hidden h-[54px] w-full sm:block lg:h-[68px]"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="fmClosingOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D946EF" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {CLOSING_OUT_X.map((x, i) => (
                <line
                  key={`cs-out-${i}`}
                  className="fm-closing-link"
                  x1="300"
                  y1="2"
                  x2={x}
                  y2="76"
                  stroke="url(#fmClosingOut)"
                  strokeLinecap="round"
                  strokeDasharray="4 7"
                  vectorEffect="non-scaling-stroke"
                  style={linkStyle(activeOut === i, activeOut)}
                />
              ))}
            </svg>

            <span
              className="mx-auto mt-6 block h-6 w-[2px] rounded-full sm:hidden"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(217,70,239,0.6), rgba(236,72,153,0.15))',
              }}
              aria-hidden="true"
            />

            {/* Stage 5 · what the foundation supports */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:mt-4 sm:gap-3">
              {CLOSING_OUTPUTS.map((item, i) => (
                <ConceptTag
                  key={item.label}
                  item={item}
                  active={activeOut === i}
                  dimmed={activeOut !== null && activeOut !== i}
                  onActivate={() => setActiveOut(i)}
                  onRelease={() => setActiveOut(null)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Nuclei scattered on a slide — the specimen the whole diagram starts
   from, drawn rather than photographed so it stays weightless. */
const SPECIMEN_NUCLEI = [
  [18, 20, 5.4, 0.5],
  [33, 34, 4.1, 0.42],
  [48, 16, 3.4, 0.5],
  [58, 33, 5.9, 0.36],
  [74, 21, 4.4, 0.48],
  [88, 37, 3.6, 0.4],
  [101, 18, 5.1, 0.44],
  [116, 32, 4.2, 0.5],
  [131, 19, 3.5, 0.38],
  [142, 36, 4.8, 0.34],
  [26, 44, 3.1, 0.3],
  [67, 46, 3.4, 0.28],
  [110, 45, 3, 0.3],
];

const specimenVisual = (
  <svg viewBox="0 0 160 56" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="fmSlide" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F5F0FF" />
        <stop offset="55%" stopColor="#FDF4FF" />
        <stop offset="100%" stopColor="#FCE7F3" />
      </linearGradient>
    </defs>
    <rect x="0.5" y="0.5" width="159" height="55" rx="9" fill="url(#fmSlide)" stroke="rgba(168,85,247,0.22)" />
    {SPECIMEN_NUCLEI.map(([cx, cy, r, o], i) => (
      <circle
        key={`nucleus-${i}`}
        cx={cx}
        cy={cy}
        r={r}
        fill={i % 3 === 0 ? '#A855F7' : '#EC4899'}
        opacity={o}
      />
    ))}
    <path d="M8 47c22-9 44 6 66-2s42 8 78-3" fill="none" stroke="rgba(124,58,237,0.18)" strokeWidth="1.2" />
  </svg>
);

/* ---------- The constellation ----------
   Hover state is held in React rather than CSS: a modality has to be able
   to brighten its own connector, and that connector lives in a different
   element tree (the SVG under the labels). */
function SpecimenConstellation() {
  const [active, setActive] = useState(null);

  return (
    <div className="fm-constellation relative mx-auto w-full max-w-[26rem] sm:max-w-[30rem]">
      <div className="relative aspect-square w-full">
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="fmLinkRamp" gradientUnits="userSpaceOnUse" cx="200" cy="200" r="200">
              <stop offset="0%" stopColor="#D946EF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.3" />
            </radialGradient>
          </defs>

          {/* The orbit the five modalities sit on */}
          <circle
            cx="200"
            cy="200"
            r="135"
            fill="none"
            stroke="rgba(168,85,247,0.18)"
            strokeWidth="1"
            strokeDasharray="2.5 7"
          />

          {MODALITY_NODES.map((n, i) => (
            <line
              key={`link-${n.label}`}
              className="link-line"
              x1={n.line.x1}
              y1={n.line.y1}
              x2={n.line.x2}
              y2={n.line.y2}
              stroke="url(#fmLinkRamp)"
              strokeLinecap="round"
              strokeDasharray={LINK_LEN}
              style={{
                strokeWidth: active === i ? 3.2 : 1.7,
                opacity: active === null ? 0.8 : active === i ? 1 : 0.32,
                transition: 'stroke-width 320ms ease, opacity 320ms ease',
              }}
            />
          ))}

          {/* Data travelling down each connector into the core */}
          {MODALITY_NODES.map((n) => (
            <circle
              key={`flow-${n.label}`}
              className="link-flow hidden sm:block"
              r="3.1"
              fill="#ffffff"
              opacity="0"
              data-x1={n.line.x1}
              data-y1={n.line.y1}
              data-x2={n.line.x2}
              data-y2={n.line.y2}
              style={{ filter: `drop-shadow(0 0 5px ${n.accent})` }}
            />
          ))}
        </svg>

        {/* Core. The centring transform lives on the wrapper, so GSAP owns
            the inner element's transform outright. */}
        <div className="absolute left-1/2 top-1/2 h-[8.75rem] w-[8.75rem] -translate-x-1/2 -translate-y-1/2 sm:h-[10rem] sm:w-[10rem]">
          <div className="core-illum relative h-full w-full">
            <div
              className="core-halo pointer-events-none absolute -inset-5 rounded-full opacity-70 blur-2xl"
              style={{
                backgroundImage:
                  'conic-gradient(from 0deg, rgba(124,58,237,0.45), rgba(217,70,239,0.4), rgba(236,72,153,0.45), rgba(168,85,247,0.4), rgba(124,58,237,0.45))',
              }}
              aria-hidden="true"
            />
            <div
              className="core-orbit pointer-events-none absolute -inset-[10px] rounded-full border border-dashed border-[#A855F7]/40"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 rounded-full p-[2px] shadow-[0_18px_50px_-20px_rgba(124,58,237,0.55)]"
              style={{ backgroundImage: 'linear-gradient(135deg, #7C3AED, #D946EF, #EC4899)' }}
            >
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white/90 px-4 text-center backdrop-blur-xl">
                <span className="text-[#7C3AED]" aria-hidden="true">
                  {glyphs.core}
                </span>
                <span className="mt-1.5 font-serif text-[12.5px] font-semibold leading-tight tracking-[-0.005em] text-[#111827] sm:mt-2 sm:text-[14px]">
                  OmicMind
                  <br />
                  Foundation Model
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* The five modalities */}
        {MODALITY_NODES.map((n, i) => (
          <div key={n.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={n.pos}>
            <div className="modality-node">
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group flex w-[5.5rem] cursor-default flex-col items-center gap-2 focus:outline-none sm:w-[7rem]"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border backdrop-blur-xl transition-transform duration-[350ms] ease-out group-hover:scale-110 group-focus-visible:scale-110 sm:h-14 sm:w-14"
                  style={{
                    color: n.accent,
                    borderColor: `${n.accent}33`,
                    backgroundImage: `linear-gradient(135deg, ${n.accent}1F, ${n.accent}0A)`,
                    boxShadow:
                      active === i
                        ? `0 0 0 7px ${n.accent}14, 0 16px 34px -16px ${n.accent}`
                        : `0 10px 26px -18px ${n.accent}`,
                    transitionProperty: 'transform, box-shadow',
                  }}
                  aria-hidden="true"
                >
                  {n.icon}
                </span>
                <span
                  className="text-center font-sans text-[9.5px] font-semibold leading-tight tracking-[0.005em] transition-colors duration-300 sm:text-[11px]"
                  style={{ color: active === i ? n.accent : '#374151' }}
                >
                  {n.label}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Everything above is read from one block of tissue — said once, at
          the foot of the diagram, so the drawing doesn't have to. */}
      <div className="mt-1 flex justify-center sm:mt-3">
        <span className="flex items-center gap-2.5 rounded-full border border-[#A855F7]/25 bg-white/75 py-2 pl-3 pr-4 shadow-[0_12px_32px_-22px_rgba(124,58,237,0.9)] backdrop-blur-xl">
          <span className="block h-5 w-5 text-[#7C3AED]" aria-hidden="true">
            {glyphs.specimen}
          </span>
          <span className="font-sans text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#6D28D9] sm:text-[10.5px]">
            Same Tumor Specimen
          </span>
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   HeadingNetwork

   The abstract AI graph sitting behind the section's opening. Purely
   decorative: no text, no hit area, and a radial mask that lets it fall
   away long before it reaches the heading's measure.
================================================================ */
function HeadingNetwork() {
  // The wrapper is transform-only — GSAP reveals and parallaxes it — so the
  // edge fade lives on the SVG, whose box the mask exactly matches.
  return (
    <div
      className="fm-head-net pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <svg
        className="h-[420px] w-[1200px] max-w-none shrink-0"
        viewBox="0 0 1200 420"
        fill="none"
        style={{
          maskImage:
            'radial-gradient(64% 76% at 50% 50%, #000 18%, rgba(0,0,0,0.55) 58%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(64% 76% at 50% 50%, #000 18%, rgba(0,0,0,0.55) 58%, transparent 100%)',
        }}
      >
        <defs>
          <linearGradient
            id="fm-head-edge"
            x1="0"
            y1="0"
            x2="1200"
            y2="420"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>

        <g stroke="url(#fm-head-edge)" strokeOpacity="0.22" strokeWidth="1">
          {HEAD_EDGES.map(([a, b], i) => (
            <line
              key={`head-edge-${i}`}
              x1={HEAD_NODES[a].x}
              y1={HEAD_NODES[a].y}
              x2={HEAD_NODES[b].x}
              y2={HEAD_NODES[b].y}
            />
          ))}
        </g>

        {HEAD_NODES.map((n, i) => (
          <circle
            key={`head-node-${i}`}
            className="fm-head-node"
            cx={n.x}
            cy={n.y}
            r={i % 3 === 0 ? 3.4 : 2.2}
            fill="url(#fm-head-edge)"
            opacity="0.4"
          />
        ))}
      </svg>
    </div>
  );
}

/* ================================================================
   EngineCore

   The section's centrepiece, built as concentric layers rather than a
   single disc: an outer measured ring, two counter-rotating arc tracks,
   six satellites aimed at the six applications, particles falling inward
   into the core, a breathing set of emitted rings, and a glass core with
   its own instrument fan. `children` is the untouched hub content.
================================================================ */
function EngineCore({ children }) {
  return (
    <div className="hub-node relative flex h-[260px] w-[260px] items-center justify-center rounded-full">
      {/* Rotating gradient glow, sitting furthest back */}
      <div
        className="hub-glow pointer-events-none absolute -inset-7 rounded-full opacity-70 blur-2xl"
        style={{
          backgroundImage:
            'conic-gradient(from 0deg, rgba(124,58,237,0.5), rgba(217,70,239,0.45), rgba(236,72,153,0.5), rgba(168,85,247,0.45), rgba(124,58,237,0.5))',
        }}
        aria-hidden="true"
      />

      {/* Rings emitted by the core, one behind the other */}
      {[0, 1, 2].map((i) => (
        <span
          key={`engine-pulse-${i}`}
          className="engine-pulse pointer-events-none absolute inset-0 rounded-full border border-[#A855F7]/40 opacity-0"
          aria-hidden="true"
        />
      ))}

      {/* ---- Ring zone: the band between the core rim and the column edge ---- */}
      <svg
        className="engine-rings pointer-events-none absolute -inset-8 z-[1]"
        viewBox={`0 0 ${ENGINE_FIELD} ${ENGINE_FIELD}`}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="fm-engine-arc"
            x1="0"
            y1="0"
            x2={ENGINE_FIELD}
            y2={ENGINE_FIELD}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>

        {/* Outermost boundary and its measurement ticks */}
        <circle cx={ENGINE_C} cy={ENGINE_C} r="161" stroke="rgba(168,85,247,0.16)" strokeWidth="1" />
        <g className="engine-ticks" stroke="url(#fm-engine-arc)" strokeLinecap="round">
          {ENGINE_TICKS.map((t, i) => (
            <line
              key={`engine-tick-${i}`}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              strokeWidth={t.long ? 1.4 : 0.9}
              strokeOpacity={t.long ? 0.34 : 0.18}
            />
          ))}
        </g>

        {/* Dotted orbit track — the layer the satellites ride on */}
        <g className="hub-ring">
          <circle
            cx={ENGINE_C}
            cy={ENGINE_C}
            r={ENGINE_ORBIT_R}
            stroke="url(#fm-engine-arc)"
            strokeOpacity="0.30"
            strokeWidth="1.2"
            strokeDasharray="2 11"
            strokeLinecap="round"
          />
        </g>

        {/* Two lit arc segments, turning against each other */}
        <g className="engine-arc-a">
          <circle
            cx={ENGINE_C}
            cy={ENGINE_C}
            r={ENGINE_ORBIT_R}
            stroke="url(#fm-engine-arc)"
            strokeOpacity="0.75"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="132 792"
          />
        </g>
        <g className="engine-arc-b">
          <circle
            cx={ENGINE_C}
            cy={ENGINE_C}
            r="137"
            stroke="url(#fm-engine-arc)"
            strokeOpacity="0.5"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="74 787"
            strokeDashoffset="240"
          />
        </g>

        {/* Six satellites, each on the bearing of its own application */}
        {ENGINE_NODES.map((n, i) => (
          <g key={`engine-node-${i}`} className="engine-node">
            <circle cx={n.x} cy={n.y} r="9" fill={n.accent} opacity="0.13" />
            <circle cx={n.x} cy={n.y} r="4.2" fill={n.accent} opacity="0.9" />
            <circle cx={n.x} cy={n.y} r="1.7" fill="#ffffff" opacity="0.85" />
          </g>
        ))}

        {/* Data falling inward from each satellite into the core */}
        {ENGINE_NODES.map((n, i) => (
          <circle
            key={`engine-flow-${i}`}
            className="engine-flow"
            cx={n.x}
            cy={n.y}
            r="2.6"
            fill={n.accent}
            opacity="0"
            data-x1={n.x}
            data-y1={n.y}
            data-x2={n.ix}
            data-y2={n.iy}
          />
        ))}
      </svg>

      {/* ---- The core itself ---- */}
      <div
        className="absolute inset-0 rounded-full p-[2px] shadow-[0_18px_50px_-18px_rgba(124,58,237,0.5)]"
        style={{ backgroundImage: 'linear-gradient(135deg, #7C3AED, #D946EF, #EC4899)' }}
        aria-hidden="true"
      >
        <div
          className="h-full w-full rounded-full backdrop-blur-xl"
          style={{
            backgroundImage:
              'radial-gradient(72% 72% at 50% 34%, rgba(255,255,255,0.98) 0%, rgba(250,246,255,0.95) 46%, rgba(247,238,255,0.94) 76%, rgba(253,240,249,0.95) 100%)',
          }}
        />
      </div>

      {/* Instrument fan and inner rings, drawn inside the glass */}
      <svg
        className="core-instrument pointer-events-none absolute inset-0"
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="130"
          cy="130"
          r="120"
          stroke="rgba(168,85,247,0.18)"
          strokeWidth="1"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
        <circle cx="130" cy="130" r="102" stroke="rgba(236,72,153,0.12)" strokeWidth="1" />
        <g
          className="core-fan"
          stroke="url(#fm-engine-arc)"
          strokeOpacity="0.22"
          strokeWidth="0.9"
          strokeLinecap="round"
        >
          {CORE_FAN.map((t, i) => (
            <line key={`core-fan-${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
          ))}
        </g>
      </svg>

      {/* Soft bloom directly beneath the mark */}
      <span
        className="engine-bloom pointer-events-none absolute left-[55px] top-[55px] h-[150px] w-[150px] rounded-full blur-2xl"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(168,85,247,0.30) 0%, rgba(236,72,153,0.16) 48%, rgba(255,255,255,0) 74%)',
        }}
        aria-hidden="true"
      />

      {children}
    </div>
  );
}

export default function FoundationModel() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Phones drop the per-connector flow particles: the diagram still reads,
    // and the paint cost goes with them.
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // Header fade-up
      gsap.from(headerRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
      });

      // The AI network behind the heading arrives a beat later and stays put
      gsap.from('.fm-head-net', {
        opacity: 0,
        scale: 0.94,
        duration: 1.6,
        ease: 'power2.out',
        delay: 0.2,
        scrollTrigger: { trigger: '.fm-header-stage', start: 'top 88%' },
      });

      // Its nodes breathe independently, so the graph never looks printed on.
      // Phones skip it: the network sits outside a narrow viewport anyway.
      if (!isMobile) gsap.utils.toArray('.fm-head-node').forEach((node, i) => {
        gsap.to(node, {
          opacity: gsap.utils.random(0.16, 0.7),
          duration: gsap.utils.random(2.2, 4.4),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.16,
        });
      });

      // A single lit node running the length of the editorial rule
      gsap
        .timeline({ repeat: -1, repeatDelay: 2.4 })
        .set('.fm-head-spark', { x: 0, opacity: 0 })
        .to('.fm-head-spark', { opacity: 1, duration: 0.3 }, 0)
        .to('.fm-head-spark', { x: 155, duration: 2, ease: 'power1.inOut' }, 0)
        .to('.fm-head-spark', { opacity: 0, duration: 0.4 }, 1.6);

      // Hub reveal
      gsap.from('.hub-cell', {
        scale: 0.88,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
      });

      // The six modules land in reading order — 01 through 06, across the
      // first row and then the second.
      gsap.from('.app-item', {
        y: 44,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.11,
        scrollTrigger: { trigger: '.fm-pipeline', start: 'top 86%' },
      });

      // The in-row links draw left to right, a beat behind the modules
      gsap.from('.pipe-rail', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.11,
        delay: 0.36,
        scrollTrigger: { trigger: '.fm-pipeline', start: 'top 86%' },
      });

      // The spine drops from the engine into the grid
      gsap.from('.hub-spine', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
      });

      // Data crossing the grid, one column gap at a time. The stagger is
      // what does the work: 01→02 fires, then 02→03, and each row reads as
      // a ripple travelling across it.
      gsap.utils.toArray('.pipe-packet').forEach((packet, i) => {
        gsap
          .timeline({ repeat: -1, repeatDelay: 1.9, delay: i * 0.26 })
          .set(packet, { x: 0, opacity: 0 })
          .to(packet, { opacity: 1, duration: 0.16 }, 0)
          .to(packet, { x: PIPE_GAP, duration: 0.62, ease: 'none' }, 0)
          .to(packet, { opacity: 0, duration: 0.2 }, 0.5);
      });

      // Floating hub
      gsap.to('.hub-node', {
        y: -12,
        duration: 3.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Gently rotating glow around the hub
      gsap.to('.hub-glow', {
        rotation: 360,
        duration: 24,
        ease: 'none',
        repeat: -1,
      });

      // Subtle floating card icons
      gsap.to('.app-icon-float', {
        y: -7,
        duration: 2.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
      });

      /* ================================================================
         Intelligence Engine

         The engine assembles as the grid is scrolled into place — the ring
         field opens outward, the satellites settle, and only then does the
         core begin drawing data inward. Everything after that is ambient:
         two counter-rotating arcs, a slow ring emission, and six inbound
         packets, all transform- or attribute-only.
      ================================================================ */

      // The ring field opens outward as the grid arrives
      gsap.from('.engine-rings', {
        scale: 0.72,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out',
        delay: 0.15,
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
      });

      gsap.from('.engine-node', {
        scale: 0,
        opacity: 0,
        duration: 0.7,
        ease: 'back.out(2)',
        stagger: 0.08,
        delay: 0.5,
        transformOrigin: 'center center',
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
      });

      // The core's own instrument layers gather strength on scroll
      gsap.fromTo(
        '.core-instrument, .engine-bloom',
        { scale: 0.9, opacity: 0.2 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 84%',
            end: 'center 60%',
            scrub: 1.1,
          },
        }
      );

      // Orbit track and arcs, turning against each other and the hub's glow
      gsap.to('.hub-ring', {
        rotation: -360,
        duration: 46,
        ease: 'none',
        repeat: -1,
        svgOrigin: `${ENGINE_C} ${ENGINE_C}`,
      });
      gsap.to('.engine-arc-a', {
        rotation: 360,
        duration: 18,
        ease: 'none',
        repeat: -1,
        svgOrigin: `${ENGINE_C} ${ENGINE_C}`,
      });
      gsap.to('.engine-arc-b', {
        rotation: -360,
        duration: 27,
        ease: 'none',
        repeat: -1,
        svgOrigin: `${ENGINE_C} ${ENGINE_C}`,
      });
      gsap.to('.engine-ticks', {
        rotation: 360,
        duration: 120,
        ease: 'none',
        repeat: -1,
        svgOrigin: `${ENGINE_C} ${ENGINE_C}`,
      });

      // Rings emitted by the core, a beat apart
      gsap.utils.toArray('.engine-pulse').forEach((ring, i) => {
        gsap.fromTo(
          ring,
          { scale: 1, opacity: 0.5 },
          {
            scale: 1.34,
            opacity: 0,
            duration: 3.6,
            ease: 'power2.out',
            repeat: -1,
            delay: i * 1.2,
          }
        );
      });

      // Data falling inward from each satellite into the core. Straight
      // radial runs, so a linear tween on cx/cy is the whole path.
      if (!isMobile) {
        gsap.utils.toArray('.engine-flow').forEach((flow, i) => {
          const { x1, y1, x2, y2 } = flow.dataset;

          gsap
            .timeline({ repeat: -1, repeatDelay: 1.1, delay: i * 0.38 })
            .set(flow, { attr: { cx: x1, cy: y1 }, opacity: 0 })
            .to(flow, { opacity: 0.9, duration: 0.26 }, 0)
            .to(flow, { attr: { cx: x2, cy: y2 }, duration: 1.35, ease: 'none' }, 0)
            .to(flow, { opacity: 0, duration: 0.3 }, 1.05);
        });
      }

      // Molecular motes drifting in the space around the engine. Phones keep
      // the motes but not their drift, so the field stays still and cheap.
      if (!isMobile) gsap.utils.toArray('.engine-mote').forEach((mote, i) => {
        gsap.to(mote, {
          y: gsap.utils.random(-16, -6),
          x: gsap.utils.random(-10, 10),
          duration: gsap.utils.random(4.5, 8),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.31,
        });
      });

      // Ambient particles, each on its own drift
      gsap.utils.toArray('.fm-particle').forEach((particle, i) => {
        gsap.to(particle, {
          y: gsap.utils.random(-20, -7),
          x: gsap.utils.random(-9, 9),
          duration: gsap.utils.random(4, 7.5),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.18,
        });
      });

      // Depth: the ambient layers travel at their own rates against the
      // scroll, so the field sits behind the content rather than on it.
      const depth = (selector, yPercent) =>
        gsap.to(selector, {
          yPercent,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

      depth('.fm-wave', -9);
      depth('.fm-particles', -16);
      depth('.fm-grid', 5);
      depth('.fm-head-net', -12);

      // The engine sits a plane behind the row, so it lags it slightly as
      // the block passes — enough to separate the planes, never enough to
      // pull the spine away from the modules it feeds.
      if (!isMobile) {
        gsap.fromTo(
          '.hub-visual',
          { y: 12 },
          {
            y: -12,
            ease: 'none',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );

        depth('.engine-motes', -12);
      }

      /* ================================================================
         Specimen composition

         Six beats, in the order the eye reads them: the specimen arrives,
         the modalities connect, data flows inward, the core lights, the
         insight pills land, and the compounding chain grows. The three
         that describe a journey are scrubbed to the scroll; the rest are
         short reveals, so nothing feels tied to the scrollbar that
         shouldn't be.
      ================================================================ */

      // Molecular scatter behind the heading
      gsap.utils.toArray('.fm-intro-dot').forEach((dot, i) => {
        gsap.to(dot, {
          y: gsap.utils.random(-15, -5),
          x: gsap.utils.random(-8, 8),
          duration: gsap.utils.random(3.6, 6.4),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.24,
        });
      });

      // The copy and the diagram arrive together, from opposite sides
      gsap.from('.fm-copy', {
        x: -32,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.fm-copy', start: 'top 82%' },
      });

      // 2 · Modalities settle onto their orbit
      gsap.from('.modality-node', {
        scale: 0.62,
        opacity: 0,
        duration: 0.9,
        ease: 'back.out(1.5)',
        stagger: 0.11,
        scrollTrigger: { trigger: '.fm-constellation', start: 'top 78%' },
      });

      // ...and their connections draw inward as the section is scrolled
      gsap.fromTo(
        '.link-line',
        { strokeDashoffset: LINK_LEN },
        {
          strokeDashoffset: 0,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.fm-constellation',
            start: 'top 82%',
            end: 'center 56%',
            scrub: 1.1,
          },
        }
      );

      // 4 · The core gathers strength as the last connection lands
      gsap.fromTo(
        '.core-illum',
        { scale: 0.88, opacity: 0.35 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.fm-constellation',
            start: 'top 74%',
            end: 'center 54%',
            scrub: 1.1,
          },
        }
      );

      gsap.to('.core-halo', { rotation: 360, duration: 28, ease: 'none', repeat: -1 });
      gsap.to('.core-orbit', { rotation: -360, duration: 54, ease: 'none', repeat: -1 });

      // 3 · Data travelling down each connector into the core. Straight
      // lines, so a linear tween on the attributes is the whole path.
      if (!isMobile) {
        gsap.utils.toArray('.link-flow').forEach((flow, i) => {
          const { x1, y1, x2, y2 } = flow.dataset;

          gsap
            .timeline({ repeat: -1, repeatDelay: 0.6, delay: i * 0.44 })
            .set(flow, { attr: { cx: x1, cy: y1 }, opacity: 0 })
            .to(flow, { opacity: 1, duration: 0.28 }, 0)
            .to(flow, { attr: { cx: x2, cy: y2 }, duration: 1.5, ease: 'none' }, 0)
            .to(flow, { opacity: 0, duration: 0.3 }, 1.2);
        });
      }

      // 5 · Insight pills land one after another
      gsap.from('.insight-pill', {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.fm-insights', start: 'top 90%' },
      });

      // 1 · The specimen's journey, stage by stage
      gsap.from('.flow-stage', {
        y: 42,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.13,
        scrollTrigger: { trigger: '.fm-flow', start: 'top 84%' },
      });

      gsap.from('.flow-link', {
        scaleX: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.13,
        delay: 0.22,
        scrollTrigger: { trigger: '.fm-flow', start: 'top 84%' },
      });

      gsap.from('.flow-link-v', {
        scaleY: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.13,
        delay: 0.22,
        scrollTrigger: { trigger: '.fm-flow', start: 'top 84%' },
      });

      // 6 · The journey's last leg: the connector draws out of the stages,
      //     the glass lands under it, and the line stays live afterwards.
      gsap.from('.fm-net-link', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.fm-network', start: 'top 88%' },
      });

      gsap.from('.fm-net-card', {
        y: 26,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.22,
        scrollTrigger: { trigger: '.fm-network', start: 'top 88%' },
      });

      if (!isMobile) {
        const linkEl = document.querySelector('.fm-net-link');
        const packet = document.querySelector('.fm-net-packet');
        if (linkEl && packet) {
          gsap
            .timeline({ repeat: -1, repeatDelay: 1.5, delay: 0.9 })
            .set(packet, { y: 0, opacity: 0 })
            .to(packet, { opacity: 1, duration: 0.2 }, 0)
            .to(packet, { y: linkEl.offsetHeight, duration: 1.15, ease: 'none' }, 0)
            .to(packet, { opacity: 0, duration: 0.25 }, 0.95);
        }
      }

      gsap.from('.cda-node', {
        y: 28,
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.fm-network', start: 'top 82%' },
      });

      gsap.fromTo(
        '.cda-progress',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.fm-network',
            start: 'top 78%',
            end: 'bottom 68%',
            scrub: 1.2,
          },
        }
      );

      // 7 · The closing synthesis, in the same voice as the reveals above.
      // One trigger drives the whole stage so the order stays fixed:
      // container → concept nodes → connectors → paragraph.
      const closingIn = { trigger: '.fm-closing-stage', start: 'top 88%' };

      gsap.from('.fm-closing-shell', {
        y: 34,
        scale: 0.985,
        opacity: 0,
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: closingIn,
      });

      gsap.from('.fm-closing-node', {
        y: 16,
        scale: 0.9,
        opacity: 0,
        duration: 0.62,
        ease: 'power3.out',
        stagger: 0.07,
        delay: 0.25,
        scrollTrigger: closingIn,
      });

      gsap.from('.fm-closing-link', {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.06,
        delay: 0.5,
        scrollTrigger: closingIn,
      });

      gsap.from('.fm-closing', {
        y: 26,
        opacity: 0,
        duration: 0.95,
        ease: 'power3.out',
        delay: 0.62,
        scrollTrigger: closingIn,
      });

      // Data drifting along the connectors. Dash offset only — the
      // hover state owns opacity and stroke width, so the two never
      // write to the same property.
      if (!isMobile) {
        gsap.to('.fm-closing-link', {
          strokeDashoffset: -44,
          duration: 3.4,
          ease: 'none',
          repeat: -1,
          stagger: { each: 0.22, from: 'center' },
        });

        gsap.utils.toArray('.fm-closing-net-dot').forEach((dot, i) => {
          gsap.to(dot, {
            opacity: 0.72,
            duration: gsap.utils.random(1.8, 3.2),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.19,
          });
        });
      }

      // The glass keeps breathing very slightly after it has landed
      gsap.to('.fm-closing-aura', { rotation: 360, duration: 44, ease: 'none', repeat: -1 });
      gsap.to('.fm-closing-hub-ring', { rotation: -360, duration: 38, ease: 'none', repeat: -1 });
      gsap.to('.fm-closing-hub-glow', {
        scale: 1.1,
        opacity: 0.9,
        duration: 3.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      gsap.utils.toArray('.fm-closing-particle').forEach((particle, i) => {
        gsap.to(particle, {
          y: gsap.utils.random(-17, -6),
          x: gsap.utils.random(-8, 8),
          duration: gsap.utils.random(5, 8.5),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.28,
        });
      });

      // Each node breathes a ring outward, a beat apart
      gsap.utils.toArray('.cda-ring').forEach((ring, i) => {
        gsap.fromTo(
          ring,
          { scale: 1, opacity: 0.75 },
          {
            scale: 1.4,
            opacity: 0,
            duration: 2.6,
            ease: 'power2.out',
            repeat: -1,
            repeatDelay: 0.6,
            delay: i * 0.5,
          }
        );
      });


    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* This is now the first chapter under the Hero, so the section carries the
     rounded top edge that meets the dark wrapper, plus a full opening
     padding — not the tighter lead-in it used when it followed another
     white section. */
  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden rounded-t-[3rem] bg-white pb-24 pt-24 lg:pb-32 lg:pt-32"
    >
      {/* ---------- Ambient field ----------
          Four layers, each deliberately faint: a blueprint grid masked away
          at the edges, two gradient waves, the original brand glow, and a
          scatter of data particles. Everything here is decoration — it sits
          under `z-10` content and never reaches full strength. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="fm-grid absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.06) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(72% 58% at 50% 45%, #000 0%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(72% 58% at 50% 45%, #000 0%, transparent 80%)',
          }}
        />

        <div className="fm-wave absolute inset-0">
          <div
            className="absolute -left-[12%] top-[4%] h-[46%] w-[52%] rounded-full blur-[90px]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(124,58,237,0.11) 0%, rgba(124,58,237,0) 70%)',
            }}
          />
          <div
            className="absolute -right-[10%] bottom-[2%] h-[48%] w-[50%] rounded-full blur-[100px]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(236,72,153,0.10) 0%, rgba(236,72,153,0) 70%)',
            }}
          />
        </div>

        {/* Very subtle radial brand glow */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(60% 45% at 50% 55%, rgba(124,58,237,0.06) 0%, rgba(236,72,153,0.04) 45%, rgba(255,255,255,0) 75%)',
          }}
        />

        <div className="fm-particles absolute inset-0">
          {PARTICLES.map((p, i) => (
            <span
              key={`fm-particle-${i}`}
              className="fm-particle absolute rounded-full"
              style={{
                left: p.x,
                top: p.y,
                width: p.s,
                height: p.s,
                opacity: p.o,
                backgroundColor: p.tone,
                boxShadow: `0 0 12px 2px ${p.tone}59`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Halo lifting the heading off the page — the section's focal point */}
        <div
          className="pointer-events-none absolute left-1/2 top-[-6%] h-[360px] w-[820px] max-w-[94vw] -translate-x-1/2 rounded-full blur-[100px]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(168,85,247,0.16) 0%, rgba(236,72,153,0.09) 45%, rgba(255,255,255,0) 72%)',
          }}
          aria-hidden="true"
        />

        {/* Molecular scatter drifting behind the section's opening */}
        <div
          className="fm-intro-field pointer-events-none absolute inset-x-0 top-0 h-[300px] sm:h-[380px]"
          aria-hidden="true"
        >
          {INTRO_DOTS.map((d, i) => (
            <span
              key={`intro-dot-${i}`}
              className="fm-intro-dot absolute rounded-full"
              style={{
                left: d.x,
                top: d.y,
                width: d.s,
                height: d.s,
                opacity: d.o,
                backgroundColor: d.tone,
                boxShadow: `0 0 10px 2px ${d.tone}45`,
              }}
            />
          ))}
        </div>

        {/* ---------- Section hero ----------
            The heading sits on its own stage so the abstract AI network can
            be anchored to the type rather than to the section, and so the
            reveal below still staggers only the heading's own children. */}
        <div className="fm-header-stage relative py-6 sm:py-8">
          <HeadingNetwork />

          <div ref={headerRef} className="relative mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-[2.75rem] font-semibold leading-[1.06] tracking-[-0.02em] text-[#111827] sm:text-[3.5rem] lg:text-[4.25rem]">
              <span className="block">One Intelligence Engine.</span>
              <span className="fm-head-gradient block italic text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]">
                From Tissue to Therapeutics.
              </span>
            </h2>

            {/* Editorial rule, echoing the one in the Hero — now a length of
                track with a single lit node running along it. */}
            <span
              className="relative mx-auto mt-10 block h-px w-40 rounded-full bg-gradient-to-r from-transparent via-[#A855F7] to-transparent"
              aria-hidden="true"
            >
              <span
                className="fm-head-spark absolute left-0 top-[-2px] h-[5px] w-[5px] rounded-full opacity-0"
                style={{
                  backgroundColor: '#D946EF',
                  boxShadow: '0 0 10px 2px rgba(217,70,239,0.65)',
                }}
              />
            </span>
          </div>
        </div>

        {/* ---------- Specimen → model composition ----------
            Desktop reads as two columns: the argument on the left, the
            machine it describes on the right. Below `lg` the diagram drops
            beneath the copy and centres itself. */}
        <div className="relative mt-16 grid grid-cols-1 items-center gap-y-14 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:gap-x-16 xl:gap-x-20">
          <div className="fm-copy relative">
            <p className="max-w-2xl font-sans text-lg font-normal leading-[1.65] tracking-[-0.005em] text-[#1F2937] sm:text-xl">
              OmicMind is a specimen-centric foundation model that learns from pathology
              images, biomarker expression, spatial biology, genomic data and clinical
              context linked to the same tumor specimen.
            </p>

            <p className="mt-6 max-w-2xl font-sans text-base leading-[1.7] text-gray-600 sm:text-lg">
              By connecting tissue morphology with molecular and spatial signals, the
              platform supports the development of{' '}
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">
                biomarker models, molecular phenotype predictions, treatment-response
                research, clinical-trial cohort stratification and drug-target insights.
              </span>
            </p>

            {/* The same five concepts, made touchable */}
            <ul className="fm-insights mt-8 flex list-none flex-wrap gap-2.5 p-0">
              {INSIGHTS.map((item) => (
                <li key={item.label} className="insight-pill">
                  <span
                    className="group flex items-center gap-2 rounded-full border bg-white/70 py-2 pl-2.5 pr-4 shadow-[var(--pill-shadow)] backdrop-blur-xl transition-all duration-[350ms] ease-out hover:-translate-y-1 hover:bg-white/90 hover:shadow-[var(--pill-shadow-hover)]"
                    style={{
                      borderColor: `${item.accent}2E`,
                      '--pill-shadow': `0 10px 26px -20px ${item.accent}`,
                      '--pill-shadow-hover': `0 18px 34px -18px ${item.accent}`,
                    }}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-[350ms] ease-out group-hover:scale-110"
                      style={{
                        color: item.accent,
                        backgroundImage: `linear-gradient(135deg, ${item.accent}24, ${item.accent}0F)`,
                      }}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <span className="font-sans text-[11.5px] font-semibold leading-tight tracking-[0.005em] text-[#374151] transition-colors duration-300 group-hover:text-[#111827] sm:text-xs">
                      {item.label}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <SpecimenConstellation />
        </div>

        {/* ---------- The specimen's journey ----------
            Four glass stages. On a phone they chain vertically; from `lg`
            they run left to right with a lit connector between each. */}
        <ol className="fm-flow relative mt-20 grid list-none grid-cols-1 gap-y-9 p-0 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 lg:mt-24 lg:grid-cols-4 lg:gap-x-6">
          {FLOW_STAGES.map((stage, i) => (
            <li key={stage.label} className="relative">
              {i > 0 && (
                <>
                  <span
                    className="flow-link-v absolute -top-9 left-1/2 h-9 w-px origin-top -translate-x-1/2 sm:hidden"
                    style={{
                      backgroundImage:
                        'linear-gradient(180deg, rgba(124,58,237,0.55), rgba(236,72,153,0.25))',
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="flow-link absolute -left-6 top-1/2 hidden h-px w-6 origin-left -translate-y-1/2 lg:block"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, rgba(124,58,237,0.5), rgba(217,70,239,0.7))',
                    }}
                    aria-hidden="true"
                  />
                </>
              )}

              <div
                className="flow-stage group relative flex h-full flex-col items-center justify-center gap-4 rounded-[26px] border border-white/70 p-6 text-center shadow-[0_10px_32px_-24px_rgba(88,28,135,0.6)] backdrop-blur-xl transition-all duration-[350ms] ease-out hover:-translate-y-1.5 hover:border-white/90 hover:shadow-[0_26px_50px_-28px_rgba(124,58,237,0.55)]"
                style={{
                  backgroundImage:
                    'linear-gradient(155deg, rgba(255,255,255,0.88) 0%, rgba(250,246,255,0.8) 52%, rgba(253,242,250,0.86) 100%)',
                }}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border transition-transform duration-[350ms] ease-out group-hover:scale-110"
                  style={{
                    color: stage.accent,
                    borderColor: `${stage.accent}26`,
                    backgroundImage: `linear-gradient(135deg, ${stage.accent}1F, ${stage.accent}0A)`,
                  }}
                  aria-hidden="true"
                >
                  {stage.icon}
                </span>

                <span className="font-sans text-[13.5px] font-semibold leading-snug tracking-[-0.005em] text-[#111827] sm:text-sm">
                  {stage.label}
                </span>

                {stage.tissue && (
                  <span className="mt-auto block h-14 w-full overflow-hidden rounded-xl" aria-hidden="true">
                    {specimenVisual}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* ---------- Compounding data advantage ----------
            The loop the third paragraph describes, drawn as a chain that
            fills in as the reader scrolls through it.

            The journey above does not stop at its last stage: the connector
            below carries straight on into this paragraph, which sits on the
            same glass the stages use. What used to be an empty run of margin
            is now the length of line the data travels down. */}
        <div className="fm-network relative mt-4 lg:mt-5">
          {/* Connector out of the specimen's journey */}
          <span
            className="fm-net-link relative mx-auto block h-10 w-px origin-top lg:h-12"
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(124,58,237,0.55) 0%, rgba(217,70,239,0.45) 58%, rgba(236,72,153,0.14) 100%)',
            }}
            aria-hidden="true"
          >
            {/* Data running down the line into the paragraph. Centred with
                margins, so GSAP owns the transform outright. */}
            <span
              className="fm-net-packet absolute h-[7px] w-[7px] rounded-full opacity-0"
              style={{
                left: '50%',
                top: 0,
                marginLeft: -3.5,
                marginTop: -3.5,
                backgroundColor: '#D946EF',
                boxShadow: '0 0 12px 3px rgba(217,70,239,0.5)',
              }}
            />
            {/* The node the line lands on */}
            <span
              className="absolute left-1/2 top-full h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                backgroundColor: '#D946EF',
                boxShadow: '0 0 10px 2px rgba(217,70,239,0.45)',
              }}
            />
          </span>

          <div className="fm-net-card group relative mx-auto mt-4 max-w-[52rem]">
            {/* Soft purple/pink bloom, lifting as the block is hovered */}
            <div
              className="pointer-events-none absolute -inset-[6px] rounded-[30px] opacity-0 blur-[16px] transition-opacity duration-[380ms] ease-out group-hover:opacity-100"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, rgba(124,58,237,0.26), rgba(236,72,153,0.26))',
              }}
              aria-hidden="true"
            />

            {/* Gradient hairline shell, the same one the stages above carry */}
            <div
              className="relative rounded-[24px] p-px shadow-[0_10px_34px_-26px_rgba(88,28,135,0.7)] transition-all duration-[380ms] ease-out group-hover:-translate-y-1 group-hover:shadow-[0_26px_54px_-26px_rgba(124,58,237,0.4)]"
              style={{
                backgroundImage:
                  'linear-gradient(150deg, rgba(139,92,246,0.42) 0%, rgba(232,121,249,0.24) 46%, rgba(17,24,39,0.06) 100%)',
              }}
            >
              <div
                className="relative overflow-hidden rounded-[23px] px-7 py-7 backdrop-blur-xl sm:px-10 sm:py-8"
                style={{
                  backgroundImage:
                    'linear-gradient(155deg, rgba(255,255,255,0.90) 0%, rgba(250,246,255,0.84) 52%, rgba(253,242,250,0.90) 100%)',
                }}
              >
                {/* Top sheen along the panel's upper edge */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)',
                  }}
                  aria-hidden="true"
                />

                {/* A breath of the brand ramp in the corner, brightening on hover */}
                <div
                  className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full opacity-60 blur-3xl transition-opacity duration-[380ms] ease-out group-hover:opacity-100"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(217,70,239,0.22) 0%, rgba(217,70,239,0) 70%)',
                  }}
                  aria-hidden="true"
                />

                <p className="relative mx-auto max-w-3xl text-center font-sans text-base leading-[1.7] text-gray-600 sm:text-lg">
                  A shared AI and data architecture allows every new dataset, organ pack and
                  validated application to strengthen the same underlying platform
                  accelerating product expansion and creating a compounding data advantage.
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-10">
            {/* The track, and over it the lit progress that grows on scroll */}
            <span
              className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-[#A855F7]/20 lg:block"
              aria-hidden="true"
            />
            <span
              className="cda-progress absolute left-[10%] right-[10%] top-8 hidden h-[2px] origin-left rounded-full lg:block"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(124,58,237,0.85), rgba(217,70,239,0.85), rgba(236,72,153,0.85))',
              }}
              aria-hidden="true"
            />

            <ol className="relative grid list-none grid-cols-2 gap-x-4 gap-y-9 p-0 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
              {COMPOUNDING.map((step) => (
                <li key={step.label} className="cda-node flex flex-col items-center text-center">
                  <span className="relative flex h-16 w-16 items-center justify-center">
                    <span
                      className="cda-ring pointer-events-none absolute inset-0 rounded-full"
                      style={{ border: `1px solid ${step.accent}59` }}
                      aria-hidden="true"
                    />
                    <span
                      className="relative flex h-16 w-16 items-center justify-center rounded-full border shadow-[0_12px_30px_-22px_rgba(88,28,135,0.9)] backdrop-blur-xl transition-transform duration-[350ms] ease-out hover:scale-110"
                      style={{
                        color: step.accent,
                        borderColor: `${step.accent}33`,
                        backgroundImage: `linear-gradient(135deg, ${step.accent}17, rgba(255,255,255,0.9))`,
                      }}
                      aria-hidden="true"
                    >
                      {step.icon}
                    </span>
                  </span>
                  <span className="mt-3.5 max-w-[8.5rem] font-sans text-[11.5px] font-semibold leading-tight tracking-[0.005em] text-[#374151] sm:text-xs">
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ---------- The intelligence engine and its pipeline ----------
            The engine states the platform once; the six applications read
            left to right beneath it as a single connected pipeline rather
            than six separate tiles. One trigger drives both, so the engine
            is always assembled before the row begins to arrive. */}
        <div ref={gridRef} className="relative mt-20 md:mt-24">
          <div className="hub-cell relative flex flex-col items-center">
            <div className="hub-visual relative flex flex-col items-center">
              <div className="relative">
                {/* Molecular motes drifting through the space around the engine */}
                <div className="engine-motes pointer-events-none absolute -inset-16" aria-hidden="true">
                  {ENGINE_MOTES.map((m, i) => (
                    <span
                      key={`engine-mote-${i}`}
                      className="engine-mote absolute rounded-full"
                      style={{
                        left: m.x,
                        top: m.y,
                        width: m.s,
                        height: m.s,
                        opacity: m.o,
                        backgroundColor: m.tone,
                        boxShadow: `0 0 10px 2px ${m.tone}4D`,
                      }}
                    />
                  ))}
                </div>

                <EngineCore>
                  <div className="relative z-10 flex flex-col items-center px-9 text-center">
                    <div
                      className="engine-mark relative flex h-[74px] w-[74px] items-center justify-center rounded-[22px] border shadow-[0_14px_30px_-16px_rgba(124,58,237,0.75)]"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, rgba(124,58,237,0.16), rgba(236,72,153,0.10))',
                        color: '#7C3AED',
                        borderColor: 'rgba(124,58,237,0.18)',
                      }}
                    >
                      {/* Top sheen, so the mark reads as glass rather than a flat tile */}
                      <span
                        className="pointer-events-none absolute inset-0 rounded-[22px] opacity-70"
                        style={{
                          backgroundImage:
                            'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 62%)',
                        }}
                        aria-hidden="true"
                      />
                      <span className="relative">{hubIcon}</span>
                    </div>

                    <h3 className="mt-4 font-serif text-[1.55rem] font-semibold leading-tight tracking-[-0.01em] text-[#111827]">
                      OmicMind 
      Intelligence Engine

                    </h3>
                  </div>
                </EngineCore>
              </div>

              {/* The spine carrying the engine's output down into the pipeline */}
              <span
                className="hub-spine relative mt-10 block h-12 w-[2px] origin-top rounded-full sm:h-16"
                style={{
                  backgroundImage:
                    'linear-gradient(180deg, rgba(217,70,239,0.75) 0%, rgba(236,72,153,0.45) 60%, rgba(236,72,153,0.12) 100%)',
                }}
                aria-hidden="true"
              >
                <span
                  className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
                  style={{
                    backgroundColor: '#D946EF',
                    boxShadow: '0 0 12px 3px rgba(217,70,239,0.5)',
                  }}
                />
              </span>
            </div>
          </div>

          {/* ---------- Six intelligence modules, 3 × 2 ----------
              Three columns from `lg`, two where three would squeeze the
              descriptions, one on a phone. Every module is the same width,
              and the grid stretches them to a shared height, so the row
              breaks read as rows rather than as six loose tiles. */}
          <ol className="fm-pipeline relative mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-8 p-0 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {applications.map((app, i) => (
              <ApplicationCard
                key={app.title}
                app={app}
                /* Links join modules within a row, so the last column carries
                   none — and neither does any layout narrower than three. */
                nextAccent={i % 3 === 2 ? undefined : applications[i + 1]?.accent}
              />
            ))}
          </ol>
        </div>

        {/* Closing statement — the six applications read back as one engine.
            Set on the same measure and in the same secondary voice as the
            copy above the grid, so it lands as a summation rather than a
            seventh card. The paragraph now sits inside the synthesis
            stage, which draws the concepts it names without repeating a
            word of them. */}
        <ClosingSynthesis />
      </div>
    </section>
  );
}
