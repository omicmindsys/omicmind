import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import normalBreastOne from '../assets/normalbreastone.webp';
import classifiedField from '../assets/h&eclassification.webp';
import cellReadout from '../assets/carcinocell.webp';
import ProductCarousel from './products/ProductCarousel.jsx';

gsap.registerPlugin(ScrollTrigger);

const ECOSYSTEM_FLOW = [
  'Omic Mind AI Ecosystem',
  'Clinical AI',
  'Treatment Response',
  'Biomarker Discovery',
  'Drug Discovery',
  'Clinical & Experimental Data',
];

const FOUNDATION_LAYER = [
  'HistoQuant™',
  'HistoMolecular™',
  'SpatialTME™',
  'ResponseAI™',
  'Biomarker & Drug Discovery',
];

export default function OmicMindEcosystem() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  /* `plateRef` is only ever read from — it is the box the scroll position is
     measured against. Nothing is written to it, so the slide it wraps cannot
     move. The only things written to on this section's plate are the two clip
     rectangles below, and all either one does is get taller or shorter. */
  const plateRef = useRef(null);
  const heCurtainRef = useRef(null);
  const cellCurtainRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        {/* ---------------- Header and specimen plate ----------------
            Two columns from `lg`, where each half still clears ~580px: the
            chapter's copy and its flow strip on the left, the reference
            specimen on the right, centred against each other. Below `lg` the
            grid collapses and the plate falls beneath the copy, in that
            order. The product cards below keep the full width. */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* ---------------- Header ---------------- */}
          <div ref={headerRef} className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-4xl font-semibold leading-[1.12] tracking-[-0.01em] text-[#17202A] sm:text-5xl lg:text-[3.5rem]">
              <span className="block">OmicMind</span>
              <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] via-[#A21CAF] to-[#BE185D]">
                AI Ecosystem
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl font-sans text-base leading-relaxed text-[#374151] sm:text-lg">
              From clinical intelligence to biomarker discovery and therapeutic innovation, OmicMind
              AI transforms biological data into actionable insights across the healthcare and life
              sciences ecosystem.
            </p>

            {/* Ecosystem flow: Core → Clinical → Biomarker → Drug */}
            <div className="mt-9 flex flex-col items-center justify-center gap-y-2">
              {ECOSYSTEM_FLOW.map((step, i) => (
                <React.Fragment key={step}>
                  <span
                    className={`rounded-full border px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      i === 0
                        ? 'border-[#A855F7]/40 bg-[#A855F7]/10 text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] to-[#BE185D]'
                        : 'border-[#17202A]/15 bg-white/60 text-[#4B5563]'
                    }`}
                  >
                    {step}
                  </span>
                  {i < ECOSYSTEM_FLOW.length - 1 && (
                    <span
                      className="shrink-0 font-sans text-sm leading-none text-[rgba(124,58,237,0.45)]"
                      aria-hidden="true"
                    >
                      ↓
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

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
          <div className="mx-auto w-full max-w-2xl lg:max-w-none">
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

        {/* ---------------- AI Products ----------------
            Horizontal carousel that expands in place into each product's
            story. Content lives in products/productsData.js. */}
        <ProductCarousel />

        {/* ---------------- Foundation layer ----------------
            The chain the three models sit in, set after the cards in the
            same pill-and-arrow vocabulary as the header's flow strip. The
            row wraps on narrow screens rather than scrolling. */}
        <div className="mx-auto mt-16 max-w-5xl text-center md:mt-20">
          <p className="font-sans text-[10.5px] font-semibold uppercase leading-none tracking-[0.14em] text-[#4B5563]">
            The Foundation Layer
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2.5">
            {FOUNDATION_LAYER.map((step, i) => (
              <React.Fragment key={step}>
                <span className="rounded-full border border-[#17202A]/15 bg-white/60 px-3.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#263238]">
                  {step}
                </span>
                {i < FOUNDATION_LAYER.length - 1 && (
                  <span
                    className="shrink-0 font-sans text-sm leading-none text-[rgba(124,58,237,0.45)]"
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="mt-6 font-serif text-lg italic leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] via-[#A21CAF] to-[#BE185D] sm:text-xl">
            From tissue morphology to measurable biology — at scale.
          </p>
        </div>
      </div>
    </section>
  );
}
