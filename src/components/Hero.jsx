import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Filename case matters: the asset ships as `Histopathology.mp4`, and a
// lowercase import resolves on Windows but breaks a Linux build.
import histopathologyVideo from '../assets/Histopathology.mp4';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   Hero composition

   Editorial and type-led, on a warm white ground: one large, regular-weight
   headline carries the frame on its own, with generous space around it.
   Beneath a hairline, the supporting copy and actions read down the left
   and the footage holds the right — never laid over each other, so each is
   seen at full clarity. Colour is used sparingly: near-black type, a single
   violet accent, no glows. Depth comes from three planes moving at three
   rates: footage, a few fine points, copy.
================================================================ */

/* Molecular data particles — the finest layer, deliberately low-contrast
   and kept clear of the middle of the frame. */
const DOTS = [
  { x: '6%', y: '22%', s: 4, o: 0.55 },
  { x: '2%', y: '62%', s: 3, o: 0.45 },
  { x: '13%', y: '86%', s: 3, o: 0.4 },
  { x: '31%', y: '12%', s: 2, o: 0.5 },
  { x: '88%', y: '9%', s: 3, o: 0.45 },
  { x: '96%', y: '34%', s: 4, o: 0.4 },
  { x: '93%', y: '72%', s: 3, o: 0.45 },
  { x: '78%', y: '92%', s: 2, o: 0.4 },
  { x: '66%', y: '6%', s: 3, o: 0.35 },
  { x: '46%', y: '94%', s: 3, o: 0.35 },
];

/* Glowing analysis nodes — two brand tones, nothing else. */
const NODES = [
  { x: '9%', y: '40%', s: 9, tone: 'violet' },
  { x: '91%', y: '22%', s: 8, tone: 'pink' },
  { x: '84%', y: '84%', s: 10, tone: 'violet' },
];

/* ---------- Framing the generator's logo out ----------

   The source carries a generator's mark in one corner. The file itself is
   not ours to edit and is not edited — what changes is where the frame is
   pointed. The video is laid into its box slightly larger than the box and
   pinned to the corner diagonally opposite the mark, so the mark falls past
   the clipped edge and the box shows the rest of the frame.

   That is a crop, not a stretch: the video keeps `object-cover` and its own
   proportions throughout, so nothing is squeezed, and the overhang is
   clipped by the frame's `overflow-hidden`. It costs a zoom equal to the
   overhang — 12%, which is the smallest step that clears a corner mark of
   the usual size with room to spare, and far too little to reach the tissue
   in the middle of the frame. Stated as a percentage of the box, it holds
   the same crop at every width, so it behaves identically on a desktop, a
   tablet and a phone.

   `anchor` pins the enlarged video to a corner of the box; `objectPosition`
   points the same way, so that if the box's ratio is ever changed away from
   the video's, the internal crop is taken from the mark's side too rather
   than evenly from both. To move the crop to a different corner, set both to
   the corner diagonally opposite the mark:

     mark bottom-right → { left: 0, top: 0 }        'left top'   (current)
     mark bottom-left  → { right: 0, top: 0 }       'right top'
     mark top-right    → { left: 0, bottom: 0 }     'left bottom'
     mark top-left     → { right: 0, bottom: 0 }    'right bottom' */
const LOGO_CROP = {
  size: '112%',
  anchor: { left: 0, top: 0 },
  objectPosition: 'left top',
};

/* The readouts the platform produces — the site's own vocabulary, set as
   a quiet index rule beneath the calls to action. */
const MODALITIES = [
  'H&E',
  'Quantitative Pathology',
  'Molecular Prediction',
  'Spatial TME',
  'Therapy Response',
  'Biomarker Discovery',
];

/* Line work matched to the icon set used across the site's sections, so the
   Hero speaks the same visual language as the chapters below it. */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/* The path a specimen travels, in five stages. Set as glass cards laid over
   the footage — the same material as the floating readout panels, so they
   read as interface rather than as copy. */
const KEYWORDS = [
  {
    label: 'Specimen Data Engine',
    desc: 'Connecting FFPE tissue, H&E, IHC and molecular data',
    // Microscope over a mounted slide
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke}>
        <path d="M9.6 3.2l2.6 1.5-3 5.2-2.6-1.5z" />
        <path d="M8.2 8.5l-1.6 2.8a4.6 4.6 0 002 6.3" />
        <path d="M12.6 12.4a4.6 4.6 0 01-1.7 5.9" />
        <path d="M4.5 20.6h15" />
        <path d="M14.4 20.4a4.6 4.6 0 00-.9-8.4" />
      </svg>
    ),
  },
  {
    label: 'Pathology Foundation Models',
    desc: 'Learning morphology, biomarkers and disease phenotypes',
    // Whole-slide scan frame with tissue detail
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke}>
        <rect x="3" y="3.5" width="18" height="17" rx="2.5" />
        <path d="M3 8.2h18" />
        <path d="M4.6 18.2l4.1-4.3 2.9 2.4 3.4-3.6 4.4 5.5" />
        <circle cx="8.6" cy="11.4" r="1.15" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Multimodal Biomarker Intelligence',
    desc: 'Integrating pathology, spatial biology and multiomics',
    // Scored expression bars with a rising trend
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke}>
        <path d="M3.4 20.4h17.2" />
        <path d="M6.4 20.4v-5.2M11 20.4V9.6M15.6 20.4v-7.4M20.2 20.4V5.4" />
        <path d="M4.6 10.4l4.2-3.6 3.4 2.2 5.2-5" />
        <path d="M14.8 3.6h2.9v2.9" />
      </svg>
    ),
  },
  {
    label: 'Treatment & Trial Intelligence',
    desc: 'Supporting response modelling and cohort stratification',
    // Helix threaded through an interaction network
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke}>
        <path d="M7.6 3.1c0 4.2 6.2 4.4 6.2 8.9s-6.2 4.6-6.2 8.9" />
        <path d="M13.8 3.1c0 4.2-6.2 4.4-6.2 8.9s6.2 4.6 6.2 8.9" />
        <path d="M8.8 6.2h3.8M8 9.5h5.4M8 14.5h5.4" />
        <circle cx="18.6" cy="7.4" r="1.5" />
        <circle cx="20.4" cy="14" r="1.4" />
        <circle cx="17.2" cy="19" r="1.4" />
        <path d="M18.9 8.9l1.2 3.7M19.6 15.3l-1.5 2.5" opacity="0.7" />
      </svg>
    ),
  },
  {
    label: 'Therapeutics Discovery',
    desc: 'Translating patient-derived insights into drug-target hypotheses',
    // Clinical cross reading out a response curve
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" {...stroke}>
        <rect x="2.8" y="3.4" width="18.4" height="17.2" rx="2.6" />
        <path d="M8.2 8.9h2.2V6.7h3.2v2.2h2.2v3.2h-2.2v2.2h-3.2v-2.2H8.2z" />
        <path d="M5.6 18.1h3.1l1.5-2.3 2 3.4 1.6-2.4h4.6" />
      </svg>
    ),
  },
];

export default function Hero() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const fxRef = useRef(null);
  const mediaRef = useRef(null);
  const frameRef = useRef(null);

  /* The footage must always open on its own first frame: a browser that
     restores a media position across a soft reload, or a source that has
     already buffered past 0, would otherwise drop the viewer into the middle
     of the sequence. Rewind as soon as metadata lands, then start playback. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    /* Held as properties, not only as attributes: iOS and several Android
       browsers grant autoplay only to a track that is muted and inline at the
       moment `play()` is called, and `defaultMuted` is what keeps that true
       across the reload the rewind below is written for. */
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const startFromBeginning = () => {
      if (video.currentTime > 0) video.currentTime = 0;
      const played = video.play();
      if (played && typeof played.catch === 'function') played.catch(() => {});
    };

    /* A page handed back from the back/forward cache keeps its media exactly
       where the viewer left it — mid-sequence — so rewind on that too. */
    const handlePageShow = (event) => {
      if (event.persisted) startFromBeginning();
    };

    video.addEventListener('loadedmetadata', startFromBeginning);
    window.addEventListener('pageshow', handlePageShow);
    if (video.readyState >= 1) startFromBeginning();

    return () => {
      video.removeEventListener('loadedmetadata', startFromBeginning);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      /* ---------- Entrance ----------
         Copy climbs in editorial order — eyebrow, headline, rule, body,
         actions, index — then the instrumentation settles around it. */
      if (prefersReducedMotion) {
        gsap.set('.hero-eyebrow, .hero-reveal, .hero-line, .hero-panel, .hero-node, .hero-media', {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
        gsap.set('.hero-rule', { autoAlpha: 1, scaleX: 1 });
        gsap.set('.hero-dot', { autoAlpha: (i, t) => Number(t.dataset.o) || 1, scale: 1 });
      } else {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo('.hero-eyebrow', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.2)
          .fromTo(
            '.hero-line',
            { autoAlpha: 0, y: 46 },
            { autoAlpha: 1, y: 0, duration: 1.15, stagger: 0.13 },
            0.4
          )
          .fromTo(
            '.hero-rule',
            { autoAlpha: 0, scaleX: 0 },
            { autoAlpha: 1, scaleX: 1, duration: 1, ease: 'expo.out' },
            0.85
          )
          .fromTo(
            '.hero-reveal',
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.11 },
            0.9
          )
          .fromTo(
            '.hero-panel',
            { autoAlpha: 0, y: 26, scale: 0.94 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 1, stagger: 0.13 },
            1.15
          )
          .fromTo(
            '.hero-node',
            { autoAlpha: 0, scale: 0.5 },
            { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.08 },
            1.25
          )
          .fromTo(
            '.hero-dot',
            { autoAlpha: 0, scale: 0.4 },
            {
              autoAlpha: (i, t) => Number(t.dataset.o) || 1,
              scale: 1,
              duration: 0.7,
              stagger: 0.04,
            },
            1.3
          );

        /* The footage arrives with the copy rather than after it: one short,
           level slide in from its own side of the frame and nothing else —
           no tilt, no rotation, no overshoot. */
        tl.fromTo(
          mediaRef.current,
          { autoAlpha: 0, x: 48 },
          { autoAlpha: 1, x: 0, duration: 1.15 },
          0.35
        );

        /* ---------- Ambient float ----------
           Delayed past the entrance so the two never write `y` at once. */
        const float = (selector, range, dur) =>
          gsap.utils.toArray(selector).forEach((el, i) => {
            gsap.to(el, {
              y: gsap.utils.random(-range, -range * 0.4),
              x: gsap.utils.random(-range * 0.5, range * 0.5),
              duration: gsap.utils.random(dur, dur * 1.6),
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              delay: 2.6 + i * 0.12,
            });
          });

        // The pathway cells share hairline borders, so they hold still.
        float('.hero-node', 14, 3.8);
        float('.hero-dot', 10, 4.2);

        /* ---------- 1. Layered Scroll Parallax ---------- */
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2, // Smooth scrub
          },
        });

        // Footage column: a small, level drift and no zoom at all. The frame
        // is a fixed box in the grid now rather than a full-bleed stage, so
        // there is no bleeding edge for a drift to expose and therefore no
        // reason to scale — and not scaling is what keeps it sharp, since any
        // enlargement resamples the frame for motion nobody asked for.
        scrollTl.fromTo(
          mediaRef.current,
          { y: 0 },
          { y: isMobile ? -30 : -90, ease: 'none' },
          0
        );

        /* ---------- Scroll tilt on the footage frame ----------
           Driven by scroll velocity rather than position, so the frame only
           leans while the page is moving (Lenis smooths the scroll, so
           velocities run low — hence the small divisor) and eases back to level once it
           stops. Only the video frame tilts — not the copy, not the pathway
           cards beneath it. Capped at 4.5deg so it reads as depth, not motion. */
        const frame = frameRef.current;
        if (frame) {
          gsap.set(frame, { transformPerspective: 1400, transformOrigin: '50% 50%' });
          const tiltX = gsap.quickTo(frame, 'rotationX', { duration: 1.1, ease: 'power3.out' });
          const tiltY = gsap.quickTo(frame, 'rotationY', { duration: 1.1, ease: 'power3.out' });
          const lift = gsap.quickTo(frame, 'y', { duration: 1.1, ease: 'power3.out' });
          const settle = gsap.delayedCall(0.15, () => {
            tiltX(0);
            tiltY(0);
            lift(0);
          }).pause();

          ScrollTrigger.create({
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            onUpdate: (self) => {
              const v = gsap.utils.clamp(-1, 1, self.getVelocity() / 900);
              tiltX(v * 4.5);
              tiltY(v * -2);
              lift(v * -20);
              settle.restart(true);
            },
          });
        }

        // Instrumentation: leaves faster than the footage, slower than the copy
        scrollTl.fromTo(
          fxRef.current,
          { y: 0 },
          { y: isMobile ? -60 : -150, ease: 'none' },
          0
        );

        // Foreground Content: Move up fastest
        scrollTl.fromTo(
          contentRef.current,
          { y: 0, z: 0 },
          { y: isMobile ? -80 : -200, z: isMobile ? 20 : 50, ease: 'none' },
          0
        );

        // The specimen pathway no longer scrubs on a plane of its own: it
        // sits inside the copy column and travels with it. Its labels keep
        // their own entrance and ambient float, which is the whole of the
        // motion they ever had that was theirs.

        /* ---------- 2. Mouse-based 3D Tilt & Pan (Desktop Only) ---------- */
        if (!isMobile) {
          const handleMouseMove = (e) => {
            const { innerWidth, innerHeight } = window;
            // Normalize mouse position between -1 and 1
            const x = (e.clientX / innerWidth - 0.5) * 2;
            const y = (e.clientY / innerHeight - 0.5) * 2;

            // The footage itself stays put. Every other plane still travels
            // with the pointer, so the depth reads exactly as before, while
            // the frame behind them holds steady and undistorted.

            // Floating instrumentation travels furthest — that spread is
            // what separates it from the footage behind it.
            gsap.to(fxRef.current, {
              x: x * 34,
              y: y * 26,
              duration: 1.5,
              ease: 'power2.out',
            });

            // Pan and tilt the foreground content (creates layered depth)
            gsap.to(contentRef.current, {
              x: x * 15,
              y: y * 15,
              rotationX: y * -2,
              rotationY: x * 2,
              duration: 1.5,
              ease: 'power2.out',
            });
          };

          const heroEl = heroRef.current;
          heroEl.addEventListener('mousemove', handleMouseMove);

          return () => {
            heroEl.removeEventListener('mousemove', handleMouseMove);
          };
        }
      }

      return undefined;
    }, heroRef);

    return () => ctx.revert();
  }, []);

  /* CTA hover: a slight scale, driven straight from GSAP so it matches the
     easing of everything else on the page. */
  const ctaHover = (e, isEnter) => {
    gsap.to(e.currentTarget, { scale: isEnter ? 1.02 : 1, duration: 0.45, ease: 'power3.out' });
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden bg-[#F6F5F3]"
      style={{
        perspective: '1200px', // Enables 3D space for the layered elements
        /* Warm white ground: a soft warm grey at the top — the same #F6F5F3
           the home navbar fills with once scrolled, so the two read as one
           canvas — lifting to near-white and settling back to warm grey.
           Kept flat on purpose: the type is the image here.
           `bg-[#F6F5F3]` above is the flat fallback. */
        backgroundImage: 'linear-gradient(180deg, #F6F5F3 0%, #FAFAF9 55%, #F3F2EF 100%)',
      }}
    >

      {/* ---------- Background footage ----------
          Full-bleed behind everything. Cropped with `LOGO_CROP` so the
          generator's mark stays out of view; `videoRef` gives it the
          autoplay and rewind handling set up above. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <video
          ref={videoRef}
          src={histopathologyVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute object-cover"
          style={{
            ...LOGO_CROP.anchor,
            width: LOGO_CROP.size,
            height: LOGO_CROP.size,
            objectPosition: LOGO_CROP.objectPosition,
          }}
        />
      </div>

      {/* ---------- Floating instrumentation ----------
          Kept to a few fine, unlit points — motion without ornament. */}
      <div ref={fxRef} className="absolute inset-0 z-[5] pointer-events-none" aria-hidden="true">
        {DOTS.map((d, i) => (
          <span
            key={`dot-${i}`}
            className="hero-dot absolute rounded-full bg-[#7C3AED] opacity-0"
            data-o={d.o * 0.6}
            style={{ left: d.x, top: d.y, width: d.s, height: d.s }}
          />
        ))}

        {NODES.map((n, i) => (
          <span
            key={`node-${i}`}
            className="hero-node absolute rounded-full opacity-0"
            style={{
              left: n.x,
              top: n.y,
              width: n.s * 0.7,
              height: n.s * 0.7,
              backgroundColor: n.tone === 'pink' ? '#DB2777' : '#7C3AED',
              boxShadow: n.tone === 'pink' ? '0 0 0 5px rgba(219,39,119,0.08)' : '0 0 0 5px rgba(124,58,237,0.08)',
            }}
          />
        ))}
      </div>

      {/* ---------- Content ----------
          Editorial composition. The headline leads on its own, across about
          60% of the frame, and breaks naturally. A hairline closes it; below,
          the supporting copy and actions take the narrower left column and
          the footage with its pathway the wider right one. Below `lg` it all
          stacks in reading order: headline → copy → actions → footage. */}
      <div className="relative z-10 w-full">
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-20 pt-32 sm:pt-36 lg:px-10 lg:pb-28 lg:pt-44">
          <div ref={contentRef} style={{ transformStyle: 'preserve-3d' }}>
            {/* Label */}
            <p className="hero-eyebrow flex items-center gap-2.5 font-sans text-[13px] font-medium tracking-[0.01em] text-[#64748B] opacity-0">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" aria-hidden="true" />
              AI-powered biomarker intelligence
            </p>

            {/* Headline */}
            <h1 className="mt-7 font-sans text-[clamp(2.75rem,5.9vw,5.5rem)] font-normal leading-[1.06] tracking-[-0.04em] text-[#0B0D12] lg:max-w-[66%]">
              <span className="hero-line block opacity-0">One intelligence engine.</span>
              <span className="hero-line block opacity-0">From tissue to therapeutics.</span>
            </h1>
          </div>

          {/* Hairline */}
          <span
            className="hero-rule mt-14 block h-px w-full origin-left bg-[#111827]/10 opacity-0 lg:mt-20"
            aria-hidden="true"
          />

          <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 xl:gap-24">
            <div className="min-w-0">
              {/* Description */}
              <p className="hero-reveal max-w-[30rem] font-sans text-[clamp(1.05rem,1.3vw,1.2rem)] font-normal leading-[1.6] tracking-[-0.01em] text-[#4B5563] opacity-0">
                A specimen-centric AI platform integrating digital pathology, biomarker quantification, spatial biology and multiomics to support translational research, patient stratification and biomarker development.
              </p>

              {/* Calls to action */}
              <div className="hero-reveal mt-9 flex flex-wrap items-center gap-3 opacity-0">
                <MagneticButton>
                  <button
                    type="button"
                    onMouseEnter={(e) => ctaHover(e, true)}
                    onMouseLeave={(e) => ctaHover(e, false)}
                    className="group relative inline-flex items-center gap-2.5 rounded-full bg-[#111827] px-7 py-3.5 font-sans text-[15px] font-medium tracking-[-0.01em] text-white"
                  >
                    {/* Dark-red hover surface over the near-black pill. */}
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-[350ms] ease-out group-hover:opacity-100"
                      style={{ backgroundImage: 'linear-gradient(135deg, #350B0E, #641820)' }}
                      aria-hidden="true"
                    />
                    <span className="relative">Request Demo</span>
                    <ArrowRight
                      className="relative h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                      strokeWidth={1.75}
                    />
                  </button>
                </MagneticButton>

                <MagneticButton>
                  <button
                    type="button"
                    onMouseEnter={(e) => ctaHover(e, true)}
                    onMouseLeave={(e) => ctaHover(e, false)}
                    className="group inline-flex items-center gap-2.5 rounded-full border border-[#111827]/15 px-7 py-3.5 font-sans text-[15px] font-normal tracking-[-0.01em] text-[#111827] transition-colors duration-300 hover:border-[#111827]/35"
                  >
                    Explore Platform
                    <ArrowRight
                      className="h-4 w-4 text-[#6D28D9] transition-transform duration-300 ease-out group-hover:translate-x-1"
                      strokeWidth={1.75}
                    />
                  </button>
                </MagneticButton>
              </div>

              {/* Index of readouts — a quiet line of the platform's own vocabulary. */}
              <p className="hero-reveal mt-12 max-w-[30rem] font-sans text-[13.5px] font-normal leading-[1.9] tracking-[-0.005em] text-[#64748B] opacity-0">
                {MODALITIES.map((m, i) => (
                  <React.Fragment key={m}>
                    {i > 0 && (
                      <>
                        {' '}
                        <span className="mx-1 text-[#7C3AED]/60" aria-hidden="true">
                          →
                        </span>{' '}
                      </>
                    )}
                    <span className="whitespace-nowrap">{m}</span>
                  </React.Fragment>
                ))}
              </p>
            </div>

            {/* ---------- The pathway ----------
                The right-hand column: the five stages, entering and drifting
                together. */}
            <div ref={mediaRef} className="hero-media relative w-full min-w-0 opacity-0">
              {/* ---------- Specimen pathway ----------
                  Hairline cells, two to a row from `sm` (the fifth spans the
                  row), one per row on the narrowest screens. */}
              <div className="mt-5 grid w-full grid-cols-1 gap-px overflow-hidden rounded-xl border border-[#111827]/10 bg-[#111827]/10 sm:mt-6 sm:grid-cols-2">
                {KEYWORDS.map((k, i) => (
                  <span
                    key={k.label}
                    className={`hero-panel flex w-full items-start gap-3 bg-[#F8F7F5] px-4 py-4 opacity-0 transition-colors duration-300 ease-out hover:bg-white ${
                      i === KEYWORDS.length - 1 ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <span className="mt-[1px] flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#7C3AED]/20 text-[#6D28D9]" aria-hidden="true">
                      {k.icon}
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="font-sans text-[13.5px] font-medium leading-snug tracking-[-0.01em] text-[#111827]">
                        {k.label}
                      </span>
                      <span className="font-sans text-[12px] font-normal leading-[1.5] text-[#64748B]">
                        {k.desc}
                      </span>
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
