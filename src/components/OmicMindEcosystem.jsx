import React, { useEffect, useRef, useState } from 'react';
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

/* Hover / focus for the architecture cards. The lift sits on `.eco-card`,
   inside `.foundation-node`, because GSAP's entrance writes an inline
   transform on the outer node that would override it. The purple-pink
   border is a second gradient layer faded in over the resting one, and a
   soft lavender band sweeps the face once. Touch devices skip the hover
   state; keyboard focus gets the same treatment; reduced motion keeps the
   colour and shadow changes but drops the movement. */
const ECO_CARD_CSS = `
  .eco-card {
    transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease-out;
    box-shadow: 0 1px 2px rgba(23, 32, 42, 0.04);
  }
  .eco-card-accent { opacity: 0; transition: opacity 280ms ease-out; }
  .eco-card-sheen {
    transform: translateX(-120%);
    opacity: 0;
    transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease-out;
  }
  .eco-card:focus-visible { outline: none; }
  @media (hover: hover) {
    .eco-card:hover { transform: translateY(-5px); box-shadow: 0 16px 32px -18px rgba(124, 58, 237, 0.38), 0 6px 14px -10px rgba(236, 72, 153, 0.18); }
    .eco-card:hover .eco-card-accent { opacity: 1; }
    .eco-card:hover .eco-card-sheen { transform: translateX(120%); opacity: 1; }
  }
  .eco-card:focus-visible { transform: translateY(-5px); box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.35), 0 16px 32px -18px rgba(124, 58, 237, 0.38); }
  .eco-card:focus-visible .eco-card-accent { opacity: 1; }
  .eco-card:focus-visible .eco-card-sheen { transform: translateX(120%); opacity: 1; }
  /* The sequential wave: on the active card, a pink-to-purple border, face
     tint and shadow fade in, slide from pink to purple, and fade back out
     inside one run, so the card ends in its resting look. */
  .eco-live-layer { opacity: 0; background-size: 300% 100%; background-position: 0% 50%; }
  .eco-card.is-live .eco-live-layer {
    animation: eco-live-fade 820ms ease-in-out both, eco-live-shift 820ms ease-in-out both;
  }
  @keyframes eco-live-fade { 0% { opacity: 0; } 22% { opacity: 1; } 72% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes eco-live-shift { from { background-position: 0% 50%; } to { background-position: 100% 50%; } }
  @media (prefers-reduced-motion: reduce) {
    .eco-card, .eco-card:hover, .eco-card:focus-visible { transform: none !important; }
    .eco-card-sheen { display: none; }
    .eco-card.is-live .eco-live-layer { animation: none; }
  }
`;

/* Pink end on the left of each 300%-wide gradient, purple on the right, so
   sliding the position across reads as pink turning to purple. */
const LIVE_BORDER = 'linear-gradient(90deg, #EC4899 0%, #D946EF 35%, #A855F7 65%, #7C3AED 100%)';
const LIVE_TINT =
  'linear-gradient(90deg, rgba(236,72,153,0.16) 0%, rgba(217,70,239,0.14) 35%, rgba(168,85,247,0.14) 65%, rgba(124,58,237,0.16) 100%)';

/* Architecture order the wave runs through: three branches, then the trunk. */
const WAVE_ORDER = [...FOUNDATION_BRANCHES, ...FOUNDATION_TRUNK];
const WAVE_STEP_MS = 1020; // 820ms transition + 200ms pause

function FlowNode({ children, live = false }) {
  return (
    <div className="foundation-node w-full max-w-[280px]">
      <div
        tabIndex={0}
        className={`eco-card relative rounded-2xl p-px ${live ? 'is-live' : ''}`}
        style={{
          backgroundImage:
            'linear-gradient(150deg, rgba(124,58,237,0.35) 0%, rgba(23,32,42,0.10) 50%, rgba(236,72,153,0.30) 100%)',
        }}
      >
        {/* Wave: soft pink-purple shadow under the active card */}
        <span
          className="eco-live-layer pointer-events-none absolute inset-0 rounded-2xl"
          style={{ boxShadow: '0 14px 30px -14px rgba(168,85,247,0.5), 0 6px 16px -10px rgba(236,72,153,0.3)' }}
          aria-hidden="true"
        />
        {/* Purple-pink border, faded in on hover / focus */}
        <span
          className="eco-card-accent pointer-events-none absolute inset-0 rounded-2xl"
          style={{ backgroundImage: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)' }}
          aria-hidden="true"
        />
        {/* Wave: pink-to-purple border */}
        <span
          className="eco-live-layer pointer-events-none absolute inset-0 rounded-2xl"
          style={{ backgroundImage: LIVE_BORDER }}
          aria-hidden="true"
        />
        <div className="relative overflow-hidden rounded-[15px] bg-[#FBF8F4] px-5 py-3 text-center font-serif text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-[#17202A]">
          {/* Wave: pink-to-purple tint across the face */}
          <span
            className="eco-live-layer pointer-events-none absolute inset-0"
            style={{ backgroundImage: LIVE_TINT }}
            aria-hidden="true"
          />
          {/* Lavender light passing across the face */}
          <span
            className="eco-card-sheen pointer-events-none absolute inset-y-0 left-0 w-full"
            style={{
              backgroundImage:
                'linear-gradient(100deg, rgba(167,139,250,0) 20%, rgba(196,181,253,0.22) 45%, rgba(244,114,182,0.10) 60%, rgba(167,139,250,0) 80%)',
            }}
            aria-hidden="true"
          />
          <span className="relative">{children}</span>
        </div>
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
  const [liveCard, setLiveCard] = useState(-1);

  /* The pink-to-purple wave through the architecture cards. It steps only
     while the flow chart is on screen, and not at all for reduced motion. */
  useEffect(() => {
    const el = foundationRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let timer = null;
    const stop = () => {
      clearInterval(timer);
      timer = null;
      setLiveCard(-1);
    };
    const start = () => {
      if (timer) return;
      setLiveCard(0);
      timer = setInterval(() => setLiveCard((i) => (i + 1) % WAVE_ORDER.length), WAVE_STEP_MS);
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, []);

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
        .fromTo(heCurtainRef.current, { attr: { height: 0 } }, { attr: { height: 340 }, ease: 'none' }, 0)
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
      className="relative w-full overflow-hidden bg-[#F5F3FF] pb-24 pt-20 lg:pb-32 lg:pt-24"
      style={{ backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #F5F3FF 52%, #EEF6FF 100%)' }}
    >
      <style>{ECO_CARD_CSS}</style>
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
            'radial-gradient(56% 42% at 22% 18%, rgba(167,139,250,0.12) 0%, rgba(167,139,250,0) 70%), radial-gradient(52% 40% at 80% 78%, rgba(244,114,182,0.08) 0%, rgba(244,114,182,0) 72%), radial-gradient(46% 34% at 52% 50%, rgba(196,181,253,0.08) 0%, rgba(196,181,253,0) 76%)',
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
                    classification sits top-left, above the carcinoma cell view
                    at bottom-left, and the specimen reads beside them.

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
                      <rect ref={heCurtainRef} x="65" y="-25" width="275" height="340" />
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

                  {/* Top-left — the classified H&E slide, 454 x 633, sized
                      to clear the cell view beneath it */}
                  <image
                    href={classifiedField}
                    x="120"
                    y="30"
                    width="165"
                    height="230"
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
                <FlowNode live={WAVE_ORDER[liveCard] === name}>{name}</FlowNode>
                <FlowLine className="hidden min-h-6 flex-1 md:block" />
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center">
            {FOUNDATION_TRUNK.map((name) => (
              <React.Fragment key={name}>
                <FlowArrow />
                <FlowNode live={WAVE_ORDER[liveCard] === name}>{name}</FlowNode>
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
