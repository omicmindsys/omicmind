import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Filename case matters: the asset ships as `Histopathology.mp4`, and a
// lowercase import resolves on Windows but breaks a Linux build.
import histopathologyVideo from '../assets/Histopathology.mp4';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   Hero composition

   The frame is split in two on a plain white ground: the copy reads down
   the left, the footage holds the right, and neither is ever laid over the
   other — which is what lets the text be read at full contrast and the
   footage be seen at full clarity, instead of each compromising the other.
   Depth comes from three planes moving at three rates: footage, floating
   instrumentation, copy.

   The palette is inverted from what it was, and it had to be: every value
   here was picked to carry white type on near-black. Left as it stood, the
   copy would have gone from legible to invisible the moment the ground
   turned. The brand violet and pink are unchanged as hues — they are simply
   taken at the weights that hold against white rather than against black.
================================================================ */

/* Floating readout panels. Each declares its own breakpoint: the frame
   gets more crowded as it gets wider, never the other way round. */
const PANELS = [
 
  
  
];

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
const MODALITIES = ['Histopathology', 'IHC Analysis', 'Spatial Biology', 'Genomics'];

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

        float('.hero-panel', 8, 5);
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

  /* CTA hover: scale and glow, driven straight from GSAP so it matches the
     easing of everything else on the page. */
  const ctaHover = (e, isEnter) => {
    const btn = e.currentTarget;
    const glow = btn.querySelector('.cta-glow');
    gsap.to(btn, { scale: isEnter ? 1.04 : 1, duration: 0.45, ease: 'power3.out' });
    if (glow) {
      gsap.to(glow, { opacity: isEnter ? 0 : 0.5, duration: 0.5, ease: 'power2.out' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full flex items-center bg-[#050816] overflow-hidden"
      style={{
        perspective: '1200px', // Enables 3D space for the layered elements
        /* Depth, and nothing else: two very wide, very faint pools — one
           navy, one violet — so the ground reads as lit space rather than
           as a flat black rectangle. Neither reaches the type. */
        backgroundImage:
          'radial-gradient(58% 46% at 20% 16%, rgba(23,42,94,0.55) 0%, rgba(5,8,22,0) 68%), radial-gradient(54% 44% at 84% 76%, rgba(58,26,120,0.42) 0%, rgba(5,8,22,0) 70%)',
      }}
    >

      {/* ---------- Floating instrumentation ---------- */}
      <div ref={fxRef} className="absolute inset-0 z-[5] pointer-events-none" aria-hidden="true">
        {DOTS.map((d, i) => (
          <span
            key={`dot-${i}`}
            className="hero-dot absolute rounded-full opacity-0 bg-gradient-to-br from-[#A855F7] to-[#EC4899]"
            data-o={d.o}
            style={{
              left: d.x,
              top: d.y,
              width: d.s,
              height: d.s,
              boxShadow: '0 0 12px 2px rgba(168,85,247,0.35)',
            }}
          />
        ))}

        {NODES.map((n, i) => (
          <span
            key={`node-${i}`}
            className="hero-node absolute rounded-full opacity-0"
            style={{
              left: n.x,
              top: n.y,
              width: n.s,
              height: n.s,
              backgroundColor: n.tone === 'pink' ? '#EC4899' : '#A855F7',
              boxShadow:
                n.tone === 'pink'
                  ? '0 0 0 5px rgba(236,72,153,0.12), 0 0 22px 5px rgba(236,72,153,0.4)'
                  : '0 0 0 5px rgba(168,85,247,0.12), 0 0 22px 5px rgba(168,85,247,0.4)',
            }}
          />
        ))}

        {PANELS.map((p) => (
          <div
            key={p.label}
            className={`hero-panel absolute opacity-0 ${p.pos} ${p.show} items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl backdrop-saturate-150`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] shadow-[0_8px_20px_-6px_rgba(168,85,247,0.9)]">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-sans text-[12px] font-semibold tracking-[0.01em] text-white">
                {p.label}
              </span>
              <span className="font-sans text-[10.5px] font-medium tracking-[0.06em] text-gray-300/80">
                {p.meta}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* ---------- Content ----------
          One column below `lg`, two from `lg` up in even halves: the copy on
          the left, the footage on the right, centred against each other. The
          halves are `minmax(0, 1fr)` rather than a bare `1fr` so a long
          unbroken word or a wide card can never push a track past its share
          and set the page scrolling sideways. Stacked, each takes the full
          width in turn — copy first, footage beneath it, which is the order
          they are meant to be read in. */}
      <div className="relative z-10 w-full">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:px-10 lg:py-24 xl:gap-16">
          <div
            ref={contentRef}
            className="w-full min-w-0 max-w-[42rem] lg:max-w-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Eyebrow — the small label the entrance timeline animates
                first, directly above the headline. Was previously referenced
                by the GSAP timeline but missing from the markup, which is
                what produced the "GSAP target .hero-eyebrow not found"
                console warning. */}
            <span className="hero-eyebrow inline-flex items-center gap-2 opacity-0 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C4B5FD] backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
              AI-Powered Biomarker Intelligence
            </span>

            {/* Headline */}
            <h1
              className="mt-8 font-serif font-semibold text-[#F8FAFC] tracking-[-0.02em] leading-[1.04] text-[2.75rem] sm:text-[3.6rem] lg:text-[3.1rem] xl:text-[3.6rem]"
            >
              <span className="hero-line block opacity-0">From Tissue to Validated</span>
              
                
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#E879F9] to-[#F9A8D4]">
                  Biomarker and therapeutic intelligence
                </span>{' '}
                
              
            </h1>

            {/* Editorial rule */}
            <span
              className="hero-rule mt-9 block h-px w-40 origin-left rounded-full opacity-0 bg-gradient-to-r from-[#A855F7] via-[#E879F9] to-transparent"
              aria-hidden="true"
            />

            {/* Description */}
            <p className="hero-reveal mt-8 max-w-xl font-sans text-lg lg:text-xl leading-relaxed tracking-[0.01em] text-slate-300 opacity-0">
              A specimen-centric AI platform integrating digital pathology, biomarker quantification, spatial biology and multiomics to support translational research, patient stratification and biomarker development.
            </p>

            {/* Calls to action */}
            <div className="hero-reveal mt-9 flex flex-wrap items-center gap-4 opacity-0">
              <MagneticButton>
                <button
                  type="button"
                  onMouseEnter={(e) => ctaHover(e, true)}
                  onMouseLeave={(e) => ctaHover(e, false)}
                  className="group relative inline-flex items-center gap-2.5 rounded-full px-8 py-4 font-sans text-base font-semibold tracking-[0.01em] text-white"
                >
                  <span
                    className="cta-glow pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] opacity-50 blur-[18px]"
                    aria-hidden="true"
                  />
                  {/* Dark-red hover halo: fades in as the purple glow above
                      fades out, so the lit edge matches the hover surface. */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-[18px] transition-opacity duration-[350ms] ease-out group-hover:opacity-90"
                    style={{ backgroundImage: 'linear-gradient(135deg, #350B0E, #641820)' }}
                    aria-hidden="true"
                  />
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] ring-1 ring-inset ring-white/25"
                    aria-hidden="true"
                  />
                  {/* Dark-red hover surface, layered over the normal gradient
                      so the default look is untouched. */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 ring-1 ring-inset ring-white/25 transition-opacity duration-[350ms] ease-out group-hover:opacity-100"
                    style={{ backgroundImage: 'linear-gradient(135deg, #350B0E, #641820)' }}
                    aria-hidden="true"
                  />
                  <span className="relative">Request Demo</span>
                  <ArrowRight
                    className="relative h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1"
                    strokeWidth={2.25}
                  />
                </button>
              </MagneticButton>

              <MagneticButton>
                <button
                  type="button"
                  onMouseEnter={(e) => ctaHover(e, true)}
                  onMouseLeave={(e) => ctaHover(e, false)}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-8 py-4 font-sans text-base font-semibold tracking-[0.01em] text-slate-100 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.11]"
                >
                  Explore Platform
                  <ArrowRight
                    className="h-5 w-5 text-[#C4B5FD] transition-transform duration-300 ease-out group-hover:translate-x-1"
                    strokeWidth={2.25}
                  />
                </button>
              </MagneticButton>
            </div>

            {/* Index of readouts — set as Hero highlights: the four terms the
                platform is known for, sized to be read from across the room and
                painted in the brand gradient. */}
            <div className="hero-reveal mt-10 flex flex-wrap items-center gap-x-3 gap-y-2.5 opacity-0 sm:gap-x-3.5">
              {MODALITIES.map((m, i) => (
                <React.Fragment key={m}>
                  {i > 0 && (
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-[#A855F7] to-[#EC4899] shadow-[0_0_10px_1px_rgba(168,85,247,0.55)]"
                      aria-hidden="true"
                    />
                  )}
                  <span className="whitespace-nowrap font-sans text-[clamp(1.05rem,2.05vw,1.4rem)] font-extrabold leading-tight tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#E879F9] to-[#F9A8D4]">
                    {m}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ---------- The footage, and the pathway beneath it ----------
              The right-hand column holds both, and holds them as one thing:
              the frame, and directly under it the five stages of the pathway.
              They enter together, drift together on the scroll and sit to the
              top of the row together, which is what keeps the stages reading
              as the footage's own caption rather than as a second block that
              happens to be nearby.

              The frame itself is a plain one: a rounded, clipped frame with a
              hairline edge, holding the video on `object-cover` so it fills
              the box at its own proportions — cropped at the edges, never
              stretched, never letterboxed. The box is stated as an aspect
              ratio rather than a height, so the column's width decides how
              tall it stands and the frame stays exact at every size — one
              landscape rectangle at `16 / 9`, at every width, which is also
              the ratio that takes the least off the sides of the footage.

              The video inside it is laid out a little past that rectangle and
              pinned to one corner, which is what keeps the generator's mark
              out of view; `LOGO_CROP` above carries the whole of that, and
              the reasoning with it.

              Against white the frame has to state its own edge, and states it
              quietly: a hairline slate rule, corners rounded just enough to
              soften them, and a wide low-opacity shadow that lifts the
              rectangle off the page without darkening anything around it.
              Nothing is laid over the footage — no scrim, no gradient, no
              blur, no filter, and no transform beyond the level drift on the
              wrapper — so what shows is the footage at its own resolution.

              From `lg` up it leaves the row's centre line and sits to the top
              instead, dropped by the same `mt-8` the headline carries so the
              two begin together. The copy column is much the taller of the
              two, so holding the frame high is what keeps the pair reading as
              one composition rather than as a small block adrift beside a
              long one. */}
          <div
            ref={mediaRef}
            className="hero-media relative w-full min-w-0 opacity-0 lg:mt-8 lg:self-start"
          >
            <div className="relative w-full overflow-hidden rounded-lg border border-white/10 shadow-[0_22px_60px_-30px_rgba(0,0,0,0.9)] sm:rounded-xl">
              <div className="relative aspect-video w-full overflow-hidden">
                <video
                  ref={videoRef}
                  src={histopathologyVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  controls={false}
                  onLoadedMetadata={(e) => {
                    if (e.currentTarget.currentTime > 0) e.currentTarget.currentTime = 0;
                  }}
                  className="absolute object-cover"
                  style={{
                    ...LOGO_CROP.anchor,
                    width: LOGO_CROP.size,
                    height: LOGO_CROP.size,
                    objectPosition: LOGO_CROP.objectPosition,
                  }}
                />
              </div>
            </div>
            {/* ---------- Specimen pathway ----------
                The five stages, read directly beneath the footage and inside
                the same column, close enough that they belong to it. Stacked
                one per row they would have handed back every bit of height
                this pass set out to save, so they run two to a row from `sm`
                up — five items into two columns leaves the last one short, and
                it takes the full width rather than sitting beside a gap. One
                per row only on the narrowest screens, where two would leave
                nothing but wrapped words. */}
            <div className="mt-5 sm:mt-6">
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                {KEYWORDS.map((k, i) => (
                  <span
                    key={k.label}
                    className={`hero-panel pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-3.5 opacity-0 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.75)] backdrop-blur-md transition-colors duration-300 ease-out hover:border-white/25 hover:bg-white/[0.10] ${
                      i === KEYWORDS.length - 1 ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <span
                      className="mt-[1px] flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white shadow-[0_8px_20px_-8px_rgba(168,85,247,0.9)]"
                      aria-hidden="true"
                    >
                      {k.icon}
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="font-sans text-[13px] font-semibold leading-snug tracking-[0.01em] text-slate-100 lg:text-[12.5px]">
                        {k.step && (
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4B5FD] to-[#F9A8D4]">
                            {k.step}.{' '}
                          </span>
                        )}
                        {k.label}
                      </span>
                      <span className="font-sans text-[11px] font-normal leading-[1.45] tracking-[0.01em] text-slate-400 lg:text-[10.5px]">
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