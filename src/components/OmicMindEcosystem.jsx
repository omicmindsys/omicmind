import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import normalBreastOne from '../assets/normalbreastone.webp';
import classifiedField from '../assets/h&eclassification.webp';
import cellReadout from '../assets/carcinocell.webp';
import ProductCarousel from './products/ProductCarousel.jsx';

gsap.registerPlugin(ScrollTrigger);

/* Foundation Layer flow chart: three tissue modules branch from the layer
   and merge into the trunk that feeds the AI Products. */
const FOUNDATION_BRANCHES = ['HistoQuant™', 'HistoMolecular™', 'SpatialTME™'];
const FOUNDATION_TRUNK = ['ResponseAI™', 'Biomarker & Drug Discovery™'];

const FLOW_STROKE = 'rgba(124,58,237,0.35)';

function FlowLine({ className = '' }) {
  return <span className={`w-px bg-[rgba(124,58,237,0.35)] ${className}`} aria-hidden="true" />;
}

/* A short connector ending in a chevron, pointing into the next node */
function FlowArrow() {
  return (
    <span className="flex flex-col items-center" aria-hidden="true">
      <FlowLine className="block h-6" />
      <svg viewBox="0 0 10 6" className="-mt-px h-1.5 w-2.5">
        <path
          d="M1 1l4 4 4-4"
          fill="none"
          stroke={FLOW_STROKE}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function FlowNode({ children }) {
  return (
    <div
      className="foundation-node w-full max-w-[280px] rounded-2xl p-px"
      style={{
        backgroundImage:
          'linear-gradient(150deg, rgba(124,58,237,0.35) 0%, rgba(23,32,42,0.10) 50%, rgba(236,72,153,0.30) 100%)',
      }}
    >
      <div className="rounded-[15px] bg-[#FBF8F4] px-5 py-3 text-center font-serif text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-[#17202A]">
        {children}
      </div>
    </div>
  );
}

/* The chart's two ends: the layer it starts from and the products it feeds */
function FlowLabel({ children }) {
  return (
    <span className="foundation-node rounded-full border border-[#A855F7]/40 bg-[#A855F7]/10 px-4 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em]">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] to-[#BE185D]">
        {children}
      </span>
    </span>
  );
}

export default function OmicMindEcosystem() {
  const sectionRef = useRef(null);
  /* `plateRef` is only ever read from — it is the box the scroll position is
     measured against. Nothing is written to it, so the slide it wraps cannot
     move. The only things written to on this section's plate are the two clip
     rectangles below, and all either one does is get taller or shorter. */
  const plateRef = useRef(null);
  const heCurtainRef = useRef(null);
  const cellCurtainRef = useRef(null);
  const foundationRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      /* ---- The two views draw down; the slide does not move ----
         Neither overlay is transformed at all — nothing here rotates, flips,
         scales or shifts. Each is uncovered instead: the rectangle that clips
         it is anchored at its top edge and grows downward, so the image
         appears from its own top edge to its own bottom, the way a blind is
         let down. Growing a height is not a transform, so the images cannot
         move or distort while it happens; they only become more or less of
         themselves. The slide behind them is not a target of anything.

         Both are on one timeline at position 0, driven by one scrub, so both
         read the same progress: whatever fraction of one is uncovered, the
         same fraction of the other is too, and they cannot drift apart.
         `scrub` ties that progress to the scroll position rather than to a
         clock and carries the smoothing — it trails the scroll by a beat and
         eases into rest — so the tweens themselves are linear rather than
         fighting it. Scrolling back up runs the same path backwards, closing
         each image from the bottom up.

         The rectangles are authored at their full height in the markup, so the
         images are whole before a line of this runs — with JavaScript slow,
         refused or reduced, or with the section already scrolled past on load,
         what shows is both images complete rather than both missing. */
      const curtain = gsap.timeline({
        scrollTrigger: {
          trigger: plateRef.current,
          start: 'top 88%',
          end: 'top 28%',
          scrub: 1,
        },
      });
      curtain
        .fromTo(heCurtainRef.current, { attr: { height: 0 } }, { attr: { height: 410 }, ease: 'none' }, 0)
        .fromTo(
          cellCurtainRef.current,
          { attr: { height: 0 } },
          { attr: { height: 310.7 }, ease: 'none' },
          0
        );

      // Foundation Layer modules fade up in chain order
      gsap.from('.foundation-node', {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: foundationRef.current, start: 'top 80%' },
      });

      // Drifting background particles
      gsap.utils.toArray('.eco-dust').forEach((dot, i) => {
        gsap.to(dot, {
          y: i % 2 === 0 ? -24 : 20,
          x: i % 3 === 0 ? 14 : -12,
          duration: 7 + (i % 4) * 1.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.4,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#F3EEE7] pb-24 pt-20 lg:pb-32 lg:pt-24"
      style={{ backgroundImage: 'linear-gradient(135deg, #F7F3ED 0%, #EDE5DA 100%)' }}
    >
      {/* Hairline divider separating this chapter from the section above */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(167,139,250,0.40) 30%, rgba(244,114,182,0.36) 70%, rgba(255,255,255,0) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Soft purple / pink gradient lighting */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(56% 42% at 22% 18%, rgba(124,58,237,0.07) 0%, rgba(124,58,237,0) 70%), radial-gradient(52% 40% at 80% 78%, rgba(124,58,237,0.08) 0%, rgba(124,58,237,0) 72%), radial-gradient(46% 34% at 52% 50%, rgba(236,72,153,0.05) 0%, rgba(236,72,153,0) 76%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle drifting AI particles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[
          { left: '9%', top: '22%', s: 4 },
          { left: '88%', top: '18%', s: 3 },
          { left: '18%', top: '78%', s: 3 },
          { left: '80%', top: '84%', s: 4 },
          { left: '52%', top: '9%', s: 3 },
        ].map((d, i) => (
          <span
            key={i}
            className="eco-dust absolute rounded-full"
            style={{
              left: d.left,
              top: d.top,
              width: d.s,
              height: d.s,
              backgroundImage: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              opacity: 0.26,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* ---------------- Specimen plate ----------------
            Centred on its own above the product cards, which keep the full
            width. */}
        <div>
          {/* ---------------- Specimen plate ----------------
              The same 1px-padding gradient shell the rest of the site frames
              its imagery with, so the brand ramp sits on the plate's edge and
              nowhere on the slide itself — no wash, no tint, nothing over the
              image. It is laid in at `h-auto w-full`, so it holds its own
              aspect at every width and is never cropped or stretched. The
              plate carries no transform and nothing drives one: it is upright
              and still at every scroll position. The ref on it is read-only —
              it is the box the overlays' scroll position is measured against,
              nothing more. */}
          <div className="mx-auto w-full max-w-2xl">
            <div
              ref={plateRef}
              className="relative rounded-[24px] p-px shadow-[0_18px_44px_-26px_rgba(76,29,149,0.5)]"
              style={{
                backgroundImage:
                  'linear-gradient(150deg, rgba(255,255,255,0.92) 0%, rgba(124,58,237,0.50) 34%, rgba(236,72,153,0.30) 64%, rgba(255,255,255,0.55) 100%)',
              }}
            >
              <div className="relative overflow-hidden rounded-[23px] bg-[#0B1424]">
                <img
                  src={normalBreastOne}
                  alt="Whole-slide H&E section of breast tissue, with a 5 mm scale bar"
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />

                {/* ---------------- Magnified views ----------------
                    The same arrangement the Core chapter's plate carries, and
                    the same geometry: both slides are 1280 x 559, so the
                    coordinates transfer across unchanged. The H&E
                    classification sits top-right, the carcinoma cell view
                    bottom-left, and the specimen reads between them.

                    Each is drawn as a plain rectangle at its own intrinsic
                    ratio, with no mask, no crop and no rounded corner anywhere
                    on either — every pixel of both files is on screen, in its
                    own shape. Their boxes are the files' own proportions to
                    within a fraction of a percent, and `preserveAspectRatio`
                    is left at its default `meet`, so neither can be stretched
                    even if a number here were rounded: an image fits inside
                    its box rather than filling it.

                    Drawn as one SVG at `inset-0` on a `viewBox` of the
                    slide's own pixel dimensions. The image is `h-auto
                    w-full`, so its box always carries its intrinsic ratio and
                    the two coincide exactly: every coordinate below is a
                    position on the slide itself and stays on it at every
                    width, with no breakpoints and nothing taking layout space.

                    Each clip rectangle is wider and taller than the image it
                    uncovers, by the reach of that image's shadow on every
                    side. A clip is applied after a filter, not before it, so a
                    rectangle cut to the image's own bounds would have taken
                    the shadow off with it; the margin is what lets the shadow
                    be uncovered along with the image it belongs to. Each is
                    authored here at full height — the state with no JavaScript
                    is both images whole.

                    The ids carry this section's own prefix. The Core chapter's
                    plate defines a clip and a filter of its own on the same
                    page, and two definitions sharing one id would leave both
                    plates reading whichever the document happened to define
                    first. */}
                <svg
                  viewBox="0 0 1280 559"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <clipPath id="ecoCurtainCell">
                      <rect ref={cellCurtainRef} x="65" y="235" width="310" height="310.7" />
                    </clipPath>
                    <clipPath id="ecoCurtainHE">
                      <rect ref={heCurtainRef} x="815" y="-10" width="325.2" height="410" />
                    </clipPath>

                    <filter id="ecoSlideShadow" x="-25%" y="-25%" width="150%" height="150%">
                      <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#0F172A" floodOpacity="0.32" />
                    </filter>
                  </defs>

                  {/* Bottom-left — the carcinoma cell view, 557 x 559 */}
                  <image
                    href={cellReadout}
                    x="120"
                    y="290"
                    width="200"
                    height="200.7"
                    filter="url(#ecoSlideShadow)"
                    clipPath="url(#ecoCurtainCell)"
                  />

                  {/* Top-right — the classified H&E slide, 454 x 633 */}
                  <image
                    href={classifiedField}
                    x="870"
                    y="45"
                    width="215.2"
                    height="300"
                    filter="url(#ecoSlideShadow)"
                    clipPath="url(#ecoCurtainHE)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- The Foundation Layer ----------------
            A flow chart set directly above the product carousel, ending in
            the arrow that hands off to it. From `md` the three tissue
            modules branch off one bus and merge back into ResponseAI™;
            below `md` the same nodes stack in a single column, so every
            connector stays vertical and nothing can overflow. */}
        <div ref={foundationRef} className="mx-auto mt-16 w-full max-w-3xl md:mt-20">
          <div className="flex flex-col items-center">
            <FlowLabel>Foundation Layer</FlowLabel>
            {/* Root → bus (the column arrows take this role below `md`) */}
            <FlowLine className="hidden h-6 md:block" />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3">
            <span
              className="pointer-events-none absolute left-[16.667%] right-[16.667%] top-0 hidden h-px bg-[rgba(124,58,237,0.35)] md:block"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute bottom-0 left-[16.667%] right-[16.667%] hidden h-px bg-[rgba(124,58,237,0.35)] md:block"
              aria-hidden="true"
            />
            {FOUNDATION_BRANCHES.map((name) => (
              <div key={name} className="flex flex-col items-center md:px-3">
                <FlowArrow />
                <FlowNode>{name}</FlowNode>
                <FlowLine className="hidden min-h-6 flex-1 md:block" />
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center">
            {FOUNDATION_TRUNK.map((name) => (
              <React.Fragment key={name}>
                <FlowArrow />
                <FlowNode>{name}</FlowNode>
              </React.Fragment>
            ))}
            <FlowArrow />
            <FlowLabel>AI Products</FlowLabel>
          </div>
        </div>

        {/* ---------------- AI Products ----------------
            Horizontal carousel that expands in place into each product's
            story. Content lives in products/productsData.js. */}
        <ProductCarousel />
      </div>
    </section>
  );
}
