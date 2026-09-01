import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WorkflowJourney from './WorkflowJourney.jsx';
import OncologyDiseaseAreas from './OncologyDiseaseAreas.jsx';

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

// The grid's row gap, in px — Tailwind `gap-y-8`. Same contract as above,
// for the links that drop out of one row into the next.
const PIPE_GAP_Y = 32;

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
    from: '#7C3AED',
    to: '#A78BFA',
    surface:
      'linear-gradient(155deg, rgba(243,240,255,0.94) 0%, rgba(255,255,255,0.90) 54%, rgba(237,233,254,0.94) 100%)',
    wash:
      'radial-gradient(115% 85% at 100% 0%, rgba(124,58,237,0.13) 0%, rgba(124,58,237,0) 62%), linear-gradient(155deg, rgba(233,227,254,0.96) 0%, rgba(250,249,255,0.93) 54%, rgba(224,216,253,0.96) 100%)',
    edge:
      'linear-gradient(150deg, rgba(255,255,255,0.92) 0%, rgba(139,92,246,0.55) 34%, rgba(196,181,253,0.30) 62%, rgba(255,255,255,0.55) 100%)',
    glow: 'linear-gradient(135deg, rgba(124,58,237,0.40), rgba(167,139,250,0.34))',
    shadow: '0 10px 30px -18px rgba(76,29,149,0.50), 0 2px 10px -6px rgba(76,29,149,0.28)',
    shadowHover:
      '0 34px 60px -22px rgba(91,33,182,0.44), 0 6px 18px -10px rgba(124,58,237,0.30)',
  },
  // 02 · Lilac → Orchid
  lilac: {
    from: '#8B5CF6',
    to: '#C084FC',
    surface:
      'linear-gradient(155deg, rgba(246,241,255,0.94) 0%, rgba(255,255,255,0.90) 54%, rgba(243,232,255,0.94) 100%)',
    wash:
      'radial-gradient(115% 85% at 100% 0%, rgba(168,85,247,0.13) 0%, rgba(168,85,247,0) 62%), linear-gradient(155deg, rgba(238,229,255,0.96) 0%, rgba(251,249,255,0.93) 54%, rgba(233,213,255,0.96) 100%)',
    edge:
      'linear-gradient(150deg, rgba(255,255,255,0.92) 0%, rgba(168,85,247,0.54) 34%, rgba(216,180,254,0.30) 62%, rgba(255,255,255,0.55) 100%)',
    glow: 'linear-gradient(135deg, rgba(168,85,247,0.38), rgba(217,70,239,0.32))',
    shadow: '0 10px 30px -18px rgba(107,33,168,0.50), 0 2px 10px -6px rgba(107,33,168,0.28)',
    shadowHover:
      '0 34px 60px -22px rgba(126,34,206,0.44), 0 6px 18px -10px rgba(168,85,247,0.30)',
  },
  // 03 · Violet → Magenta
  violet: {
    from: '#A855F7',
    to: '#E879F9',
    surface:
      'linear-gradient(155deg, rgba(244,238,255,0.94) 0%, rgba(255,255,255,0.90) 52%, rgba(250,232,255,0.94) 100%)',
    wash:
      'radial-gradient(115% 85% at 100% 0%, rgba(192,38,211,0.12) 0%, rgba(192,38,211,0) 62%), linear-gradient(155deg, rgba(235,225,255,0.96) 0%, rgba(252,249,255,0.93) 52%, rgba(245,214,254,0.96) 100%)',
    edge:
      'linear-gradient(150deg, rgba(255,255,255,0.92) 0%, rgba(168,85,247,0.52) 34%, rgba(232,121,249,0.32) 62%, rgba(255,255,255,0.55) 100%)',
    glow: 'linear-gradient(135deg, rgba(168,85,247,0.36), rgba(232,121,249,0.34))',
    shadow: '0 10px 30px -18px rgba(112,26,117,0.48), 0 2px 10px -6px rgba(112,26,117,0.26)',
    shadowHover:
      '0 34px 60px -22px rgba(147,51,234,0.42), 0 6px 18px -10px rgba(217,70,239,0.28)',
  },
  // 04 · Orchid → Blush
  orchid: {
    from: '#D946EF',
    to: '#F472B6',
    surface:
      'linear-gradient(155deg, rgba(251,238,255,0.94) 0%, rgba(255,255,255,0.90) 52%, rgba(253,236,246,0.94) 100%)',
    wash:
      'radial-gradient(115% 85% at 100% 0%, rgba(217,70,239,0.12) 0%, rgba(217,70,239,0) 62%), linear-gradient(155deg, rgba(248,226,255,0.96) 0%, rgba(255,250,253,0.93) 52%, rgba(252,224,241,0.96) 100%)',
    edge:
      'linear-gradient(150deg, rgba(255,255,255,0.92) 0%, rgba(217,70,239,0.50) 34%, rgba(244,114,182,0.32) 62%, rgba(255,255,255,0.55) 100%)',
    glow: 'linear-gradient(135deg, rgba(217,70,239,0.36), rgba(244,114,182,0.34))',
    shadow: '0 10px 30px -18px rgba(134,25,143,0.46), 0 2px 10px -6px rgba(134,25,143,0.26)',
    shadowHover:
      '0 34px 60px -22px rgba(192,38,211,0.40), 0 6px 18px -10px rgba(236,72,153,0.28)',
  },
  // 05 · Blush Pink → Rose
  blush: {
    from: '#EC4899',
    to: '#F9A8D4',
    surface:
      'linear-gradient(155deg, rgba(253,238,246,0.94) 0%, rgba(255,255,255,0.90) 54%, rgba(255,233,241,0.94) 100%)',
    wash:
      'radial-gradient(115% 85% at 100% 0%, rgba(236,72,153,0.12) 0%, rgba(236,72,153,0) 62%), linear-gradient(155deg, rgba(252,228,241,0.96) 0%, rgba(255,250,252,0.93) 54%, rgba(254,220,235,0.96) 100%)',
    edge:
      'linear-gradient(150deg, rgba(255,255,255,0.92) 0%, rgba(236,72,153,0.48) 34%, rgba(249,168,212,0.34) 62%, rgba(255,255,255,0.55) 100%)',
    glow: 'linear-gradient(135deg, rgba(236,72,153,0.36), rgba(244,114,182,0.32))',
    shadow: '0 10px 30px -18px rgba(157,23,77,0.44), 0 2px 10px -6px rgba(157,23,77,0.24)',
    shadowHover:
      '0 34px 60px -22px rgba(219,39,119,0.38), 0 6px 18px -10px rgba(236,72,153,0.26)',
  },
  // 06 · Mauve → Violet
  mauve: {
    from: '#9333EA',
    to: '#EC4899',
    surface:
      'linear-gradient(155deg, rgba(248,240,250,0.94) 0%, rgba(255,255,255,0.90) 52%, rgba(238,233,254,0.94) 100%)',
    wash:
      'radial-gradient(115% 85% at 100% 0%, rgba(147,51,234,0.12) 0%, rgba(147,51,234,0) 62%), linear-gradient(155deg, rgba(242,229,247,0.96) 0%, rgba(252,250,255,0.93) 52%, rgba(228,220,253,0.96) 100%)',
    edge:
      'linear-gradient(150deg, rgba(255,255,255,0.92) 0%, rgba(147,51,234,0.50) 34%, rgba(236,72,153,0.32) 62%, rgba(255,255,255,0.55) 100%)',
    glow: 'linear-gradient(135deg, rgba(147,51,234,0.38), rgba(236,72,153,0.32))',
    shadow: '0 10px 30px -18px rgba(88,28,135,0.48), 0 2px 10px -6px rgba(88,28,135,0.26)',
    shadowHover:
      '0 34px 60px -22px rgba(126,34,206,0.42), 0 6px 18px -10px rgba(236,72,153,0.28)',
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

/* ---- The lit link between two modules ----
   Each link lives in the grid's own gutter, so the packet that crosses it
   travels exactly the distance the gap does and the two can never drift
   apart. Which links are visible is a matter of how many columns the grid
   is currently running: the six modules chain 01 through 06 at every
   breakpoint, but the shape of that chain changes with the layout, so the
   parent hands each card the accents for the neighbours it actually has. */
function PipeH({ from, to, className }) {
  return (
    <span
      className={`pipe-link pointer-events-none absolute left-full top-1/2 z-[2] h-px w-6 -translate-y-1/2 ${className}`}
      aria-hidden="true"
    >
      <span
        className="pipe-rail absolute inset-0 origin-left rounded-full"
        style={{ backgroundImage: `linear-gradient(90deg, ${from}73, ${to})` }}
      />

      {/* Illumination that lifts as either end of the link is hovered */}
      <span
        className="absolute -inset-y-[2px] inset-x-0 rounded-full opacity-0 blur-[3px] transition-opacity duration-[420ms] ease-out group-hover:opacity-100"
        style={{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
      />

      {/* The arrow, centred in the gutter */}
      <svg
        className="absolute left-1/2 top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 overflow-visible"
        viewBox="0 0 9 9"
        fill="none"
      >
        <path
          d="M2.6 1.2L6 4.5L2.6 7.8"
          stroke={to}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* One packet crossing the gutter — the chain's ambient data flow */}
      <span
        className="pipe-packet absolute top-1/2 h-[7px] w-[7px] rounded-full opacity-0"
        style={{
          left: 0,
          marginTop: -3.5,
          marginLeft: -3.5,
          backgroundColor: '#ffffff',
          boxShadow: `0 0 10px 2px ${to}`,
        }}
      />
    </span>
  );
}

/* The same link turned through ninety degrees, for the drop out of one row
   into the next — and for the single column a phone runs. */
function PipeV({ from, to, className }) {
  return (
    <span
      className={`pipe-link pointer-events-none absolute left-1/2 top-full z-[2] h-8 w-px -translate-x-1/2 ${className}`}
      aria-hidden="true"
    >
      <span
        className="pipe-rail-v absolute inset-0 origin-top rounded-full"
        style={{ backgroundImage: `linear-gradient(180deg, ${from}73, ${to})` }}
      />

      <span
        className="absolute -inset-x-[2px] inset-y-0 rounded-full opacity-0 blur-[3px] transition-opacity duration-[420ms] ease-out group-hover:opacity-100"
        style={{ backgroundImage: `linear-gradient(180deg, ${from}, ${to})` }}
      />

      <svg
        className="absolute left-1/2 top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 overflow-visible"
        viewBox="0 0 9 9"
        fill="none"
      >
        <path
          d="M1.2 2.6L4.5 6L7.8 2.6"
          stroke={to}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span
        className="pipe-packet-v absolute left-1/2 h-[7px] w-[7px] rounded-full opacity-0"
        style={{
          top: 0,
          marginTop: -3.5,
          marginLeft: -3.5,
          backgroundColor: '#ffffff',
          boxShadow: `0 0 10px 2px ${to}`,
        }}
      />
    </span>
  );
}

function ApplicationCard({ app, links }) {
  const t = app.theme;

  return (
    <li className="app-item group relative min-h-[430px] sm:min-h-[470px]">
      {/* ---- Links out of this module ----
          Three columns: across to the next module in the row, and down out
          of the first row into the second. Two columns: the same chain, one
          pair at a time. One column: straight down, 01 through 06. */}
      {links.lgRight && (
        <PipeH from={app.accent} to={links.lgRight} className="hidden lg:block" />
      )}
      {links.smRight && (
        <PipeH
          from={app.accent}
          to={links.smRight}
          className="hidden sm:block lg:hidden"
        />
      )}
      {links.lgDown && (
        <PipeV from={app.accent} to={links.lgDown} className="hidden lg:block" />
      )}
      {links.smDown && (
        <PipeV
          from={app.accent}
          to={links.smDown}
          className="hidden sm:block lg:hidden"
        />
      )}
      {links.xsDown && (
        <PipeV from={app.accent} to={links.xsDown} className="block sm:hidden" />
      )}

      {/* The card's shade travels as custom properties, so the per-card hover
          shadow and accent can still be expressed as Tailwind classes. */}
      <article
        className="relative h-full rounded-[28px]"
        style={{
          '--card-shadow': t.shadow,
          '--card-shadow-hover': t.shadowHover,
          '--card-accent': app.accent,
        }}
      >
        {/* Bloom sitting just outside the glass, lit on hover */}
        <div
          className="pointer-events-none absolute -inset-[5px] rounded-[33px] opacity-0 blur-[18px] transition-opacity duration-[420ms] ease-out group-hover:opacity-100"
          style={{ backgroundImage: t.glow }}
          aria-hidden="true"
        />

        {/* Glass hairline: a 1px shell carrying a lit rim from white through
            the card's own shade, so the module reads as edge-lit at rest. */}
        <div
          className="relative h-full rounded-[28px] p-px shadow-[var(--card-shadow)] transition-all duration-[420ms] ease-out group-hover:-translate-y-2 group-hover:shadow-[var(--card-shadow-hover)]"
          style={{ backgroundImage: t.edge }}
        >
          <div
            className="relative flex h-full flex-col overflow-hidden rounded-[27px]"
            style={{ backgroundImage: t.surface }}
          >
            {/* ---- The module's own image, filling the card ----
                The card's shade stays underneath as the ground the image
                loads onto, so there is never a bare frame while it arrives. */}
            <img
              src={app.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
            />

            {/* Readability gradient — near-clear across the top of the frame,
                deepening only over the band the type actually occupies. The
                dark end carries a trace of violet rather than pure black, so
                it sits inside the section's palette. */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(10,4,24,0) 0%, rgba(10,4,24,0.08) 30%, rgba(10,4,24,0.38) 56%, rgba(10,4,24,0.68) 78%, rgba(10,4,24,0.86) 100%)',
              }}
              aria-hidden="true"
            />

            {/* A little more of it on a phone, where the card is at its widest
                and the description runs to its most lines. */}
            <span
              className="pointer-events-none absolute inset-0 sm:hidden"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(10,4,24,0) 42%, rgba(10,4,24,0.16) 100%)',
              }}
              aria-hidden="true"
            />

            {/* ---- The module's shade over the photograph ----
                Each card carries two stops of the brand ramp — lavender and
                violet at the head of the journey, magenta and rose at its
                end — so six different figures still read as one family. */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(158deg, ${t.from}52 0%, ${t.from}1A 34%, rgba(0,0,0,0) 56%, ${t.to}3D 100%)`,
              }}
              aria-hidden="true"
            />

            {/* Hover brightens the same ramp rather than moving anything */}
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[420ms] ease-out group-hover:opacity-100"
              style={{
                backgroundImage: `linear-gradient(158deg, ${t.from}42 0%, rgba(0,0,0,0) 52%, ${t.to}38 100%)`,
              }}
              aria-hidden="true"
            />

            {/* Inner glow: light caught inside the glass, plus the faint white
                rim that gives the surface its thickness. */}
            <span
              className="pointer-events-none absolute inset-0 rounded-[27px]"
              style={{
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.50), inset 0 0 0 1px rgba(255,255,255,0.16), inset 0 -90px 90px -70px rgba(255,255,255,0.28)',
              }}
              aria-hidden="true"
            />

            {/* On hover the rim takes the card's own accent */}
            <span
              className="pointer-events-none absolute inset-0 rounded-[27px] opacity-0 transition-opacity duration-[420ms] ease-out group-hover:opacity-100"
              style={{
                boxShadow: `inset 0 0 0 1px ${app.accent}7A, inset 0 0 44px -10px ${app.accent}8C`,
              }}
              aria-hidden="true"
            />

            {/* Top sheen along the module's upper edge */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent, ${app.accent}99, transparent)`,
              }}
              aria-hidden="true"
            />

            {/* The index, held at the top corner where the image is clearest */}
            <span
              className="absolute right-6 top-6 flex items-center gap-2 rounded-full border px-3 py-1 font-sans text-xs font-semibold tracking-[0.22em] backdrop-blur-md sm:right-7 sm:top-7"
              style={{
                color: 'rgba(255,255,255,0.94)',
                borderColor: 'rgba(255,255,255,0.34)',
                backgroundColor: 'rgba(255,255,255,0.16)',
                boxShadow:
                  '0 6px 18px -12px rgba(10,4,24,0.9), inset 0 1px 0 rgba(255,255,255,0.35)',
              }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: '#ffffff',
                  boxShadow: `0 0 8px 1.5px ${app.accent}`,
                }}
                aria-hidden="true"
              />
              {app.number}
            </span>

            {/* ---- Content, anchored to the foot of the image ----
                It sits on a frosted plate cut out of the photograph itself:
                the blur fades in from nothing about a third of the way up,
                so the type has glass under it without the image losing its
                full-bleed edge. */}
            <div className="relative mt-auto">
              <div
                className="pointer-events-none absolute inset-0 backdrop-blur-[3px]"
                style={{
                  maskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 34%)',
                  WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 34%)',
                }}
                aria-hidden="true"
              />

              <div className="relative flex flex-col p-7 sm:p-8">
                <div className="app-icon-float w-fit">
                  <div
                    className="relative flex h-14 w-14 items-center justify-center rounded-2xl border shadow-[0_12px_26px_-14px_rgba(10,4,24,0.85)] backdrop-blur-md transition-transform duration-[420ms] ease-out group-hover:scale-110"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${t.from}73, ${t.to}33)`,
                      color: '#ffffff',
                      borderColor: 'rgba(255,255,255,0.38)',
                    }}
                  >
                    <span
                      className="pointer-events-none absolute inset-0 rounded-2xl"
                      style={{
                        backgroundImage:
                          'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 60%)',
                      }}
                      aria-hidden="true"
                    />
                    <span className="relative">{app.icon}</span>
                  </div>
                </div>

                <h3 className="relative mt-5 font-serif text-[1.5rem] font-bold leading-tight tracking-[-0.012em] text-white [text-shadow:0_1px_16px_rgba(10,4,24,0.6)]">
                  {app.title}
                </h3>

                {/* Accent rule under the title, drawing out on hover */}
                <span
                  className="relative mt-3 block h-[2px] w-9 origin-left rounded-full transition-transform duration-[520ms] ease-out group-hover:scale-x-[2.6]"
                  style={{
                    backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.95), ${app.accent} 62%, ${app.accent}00 100%)`,
                  }}
                  aria-hidden="true"
                />

                <p className="relative mt-4 font-sans text-[13.5px] leading-relaxed tracking-[0.002em] text-white/[0.88] [text-shadow:0_1px_12px_rgba(10,4,24,0.65)]">
                  {app.desc}
                </p>
              </div>
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

/* What the platform supports — the second paragraph's own list, lifted out
   as interactive pills so each concept can be read on its own. */
const INSIGHTS = [
  { label: 'Biomarker Models', icon: glyphs.model, accent: '#7C3AED' },
  { label: 'Molecular Phenotype Predictions', icon: glyphs.phenotype, accent: '#A855F7' },
  { label: 'Treatment-Response Research', icon: glyphs.response, accent: '#C026D3' },
  { label: 'Clinical-Trial Cohort Stratification', icon: glyphs.cohort, accent: '#DB2777' },
  { label: 'Drug-Target Insights', icon: glyphs.target, accent: '#8B5CF6' },
];

/* Molecular Phenotype Predictions and Drug-Target Insights read as a pair,
   so they're pulled onto a row of their own beneath the freely wrapping
   ones and given equal tracks. */
const INSIGHT_ROW = ['Molecular Phenotype Predictions', 'Drug-Target Insights'];
const INSIGHTS_LEAD = INSIGHTS.filter((item) => !INSIGHT_ROW.includes(item.label));
const INSIGHTS_PAIR = INSIGHT_ROW.map((label) =>
  INSIGHTS.find((item) => item.label === label)
);

/* One insight pill, shared so the paired row renders identically to the
   pills wrapping above it. */
function InsightPill({ item, className = '' }) {
  return (
    <li className={`insight-pill flex ${className}`}>
      <span
        className="group flex w-full items-center gap-2 rounded-full border bg-white/70 py-2 pl-2.5 pr-4 shadow-[var(--pill-shadow)] backdrop-blur-xl transition-all duration-[350ms] ease-out hover:-translate-y-1 hover:bg-white/90 hover:shadow-[var(--pill-shadow-hover)]"
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
  const gridRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Phones drop the per-connector flow particles: the diagram still reads,
    // and the paint cost goes with them.
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

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

      // The molecular ground under the grid settles in first, so the
      // modules land on a field rather than on bare white.
      gsap.from('.fm-stage-field', {
        opacity: 0,
        duration: 1.3,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.fm-pipeline', start: 'top 90%' },
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

      // The links that drop out of one row into the next draw downward,
      // a beat behind the ones that run across.
      gsap.from('.pipe-rail-v', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.09,
        delay: 0.5,
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

      // The same flow, dropping out of one row into the next. It runs on a
      // slightly longer cycle than the packets crossing the rows, so the two
      // never pulse in lockstep and the grid reads as a network rather than
      // a metronome.
      gsap.utils.toArray('.pipe-packet-v').forEach((packet, i) => {
        gsap
          .timeline({ repeat: -1, repeatDelay: 2.3, delay: 0.45 + i * 0.31 })
          .set(packet, { y: 0, opacity: 0 })
          .to(packet, { opacity: 1, duration: 0.16 }, 0)
          .to(packet, { y: PIPE_GAP_Y, duration: 0.72, ease: 'none' }, 0)
          .to(packet, { opacity: 0, duration: 0.22 }, 0.56);
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
        {/* ---------- End-to-end workflow ----------
            The seven-stage chain, opening the section. It carries its own
            heading and its own ground. */}
        <WorkflowJourney />

        {/* ---------- The intelligence engine and its pipeline ----------
            The engine states the platform once; the six applications read
            left to right beneath it as a single connected pipeline rather
            than six separate tiles. One trigger drives both, so the engine
            is always assembled before the row begins to arrive. */}
        <div ref={gridRef} className="relative mt-16 md:mt-20">
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
                      OmicMind Intelligence Engine
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
          <div className="fm-grid-stage relative mt-10 lg:mt-12">
            {/* ---- The ground the six modules sit on ----
                A white field lifted by one purple and one pink radial, with
                a minimal molecular lattice drawn faintly across it. Every
                layer here is decoration: it sits behind the grid, never
                darkens the page, and never touches the type. */}
            <div
              className="fm-stage-field pointer-events-none absolute -inset-x-6 -inset-y-12 -z-10 overflow-hidden sm:-inset-x-10"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(46% 40% at 16% 12%, rgba(124,58,237,0.10) 0%, rgba(124,58,237,0) 70%), radial-gradient(48% 42% at 86% 88%, rgba(236,72,153,0.09) 0%, rgba(236,72,153,0) 70%), radial-gradient(60% 46% at 50% 50%, rgba(168,85,247,0.05) 0%, rgba(255,255,255,0) 76%)',
                }}
              />

              {/* Molecular lattice — a repeating network of nodes and bonds,
                  masked away at the edges so it never reads as a border. */}
              <svg
                className="fm-stage-mesh absolute inset-0 h-full w-full"
                style={{
                  maskImage:
                    'radial-gradient(70% 62% at 50% 50%, #000 0%, transparent 82%)',
                  WebkitMaskImage:
                    'radial-gradient(70% 62% at 50% 50%, #000 0%, transparent 82%)',
                }}
              >
                <defs>
                  <pattern
                    id="fm-molecule"
                    width="180"
                    height="156"
                    patternUnits="userSpaceOnUse"
                  >
                    <g
                      fill="none"
                      stroke="rgba(124,58,237,0.16)"
                      strokeWidth="1"
                      strokeLinecap="round"
                    >
                      <path d="M90 12 L156 50 L156 126 L90 164 L24 126 L24 50 Z" />
                      <path d="M90 12 L90 88 M90 88 L156 126 M90 88 L24 126" />
                    </g>
                    <g fill="rgba(168,85,247,0.30)">
                      <circle cx="90" cy="12" r="2.4" />
                      <circle cx="156" cy="50" r="2" />
                      <circle cx="24" cy="50" r="2" />
                      <circle cx="90" cy="88" r="2.8" />
                    </g>
                    <g fill="rgba(236,72,153,0.26)">
                      <circle cx="156" cy="126" r="2" />
                      <circle cx="24" cy="126" r="2" />
                    </g>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#fm-molecule)" />
              </svg>
            </div>

            <ol className="fm-pipeline relative grid list-none grid-cols-1 gap-x-6 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((app, i) => (
                <ApplicationCard
                  key={app.title}
                  app={app}
                  /* The chain runs 01 → 06 whatever the layout, but its shape
                     changes with the column count, so each module is handed
                     the accents of the neighbours it has at each breakpoint:
                     across within a row, and down out of one row into the
                     next. The last module in a chain carries none. */
                  links={{
                    lgRight: i % 3 === 2 ? undefined : applications[i + 1]?.accent,
                    lgDown: i < 3 ? applications[i + 3]?.accent : undefined,
                    smRight: i % 2 === 0 ? applications[i + 1]?.accent : undefined,
                    smDown: i < 4 ? applications[i + 2]?.accent : undefined,
                    xsDown: applications[i + 1]?.accent,
                  }}
                />
              ))}
            </ol>
          </div>
        </div>

        {/* ---------- Oncology disease areas ----------
            The exploration layer, sitting directly under the intelligence
            engine and its modules. It carries its own heading and ground. */}
        <OncologyDiseaseAreas />
      </div>
    </section>
  );
}