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

   The footage is the hero — every layer here is arranged around it, on
   the left third and along the right edge, so the centre of the frame is
   never covered. Depth comes from four planes moving at four rates:
   glow, footage, floating instrumentation, copy.
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
  const glowRef = useRef(null);
  const fxRef = useRef(null);
  const chipsRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      /* ---------- Entrance ----------
         Copy climbs in editorial order — eyebrow, headline, rule, body,
         actions, index — then the instrumentation settles around it. */
      if (prefersReducedMotion) {
        gsap.set('.hero-eyebrow, .hero-reveal, .hero-line, .hero-panel, .hero-node', {
          autoAlpha: 1,
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

        /* Slow drift on the coloured light itself */
        const drift = { ease: 'sine.inOut', repeat: -1, yoyo: true };
        gsap.to('.hero-glow-a', { xPercent: 8, yPercent: 6, scale: 1.1, duration: 11, ...drift });
        gsap.to('.hero-glow-b', { xPercent: -7, yPercent: 8, scale: 1.08, duration: 13, ...drift });

        /* ---------- 1. Layered Scroll Parallax ---------- */
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2, // Smooth scrub
          },
        });

        // Video: Slow zoom-in and slight pan
        scrollTl.fromTo(
          videoRef.current,
          { scale: 1, yPercent: 0 },
          { scale: isMobile ? 1.05 : 1.15, yPercent: 10, ease: 'none' },
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

        // Decorative Glows
        scrollTl.fromTo(glowRef.current, { y: 0 }, { y: -100, ease: 'none' }, 0);

        // Specimen pathway: the gentlest of the moving planes. The wrapper
        // carries the scroll drift while the labels themselves carry the
        // ambient float, so the two never write `y` to the same element.
        scrollTl.fromTo(
          chipsRef.current,
          { y: 0 },
          { y: isMobile ? -40 : -110, ease: 'none' },
          0
        );

        /* ---------- 2. Mouse-based 3D Tilt & Pan (Desktop Only) ---------- */
        if (!isMobile) {
          const handleMouseMove = (e) => {
            const { innerWidth, innerHeight } = window;
            // Normalize mouse position between -1 and 1
            const x = (e.clientX / innerWidth - 0.5) * 2;
            const y = (e.clientY / innerHeight - 0.5) * 2;

            // Pan the background video slightly in opposition to mouse
            gsap.to(videoRef.current, {
              x: x * -20,
              y: y * -20,
              duration: 1.5,
              ease: 'power2.out',
            });

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
      gsap.to(glow, { opacity: isEnter ? 1 : 0.5, duration: 0.5, ease: 'power2.out' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex items-center bg-[#030712] overflow-hidden"
      style={{ perspective: '1200px' }} // Enables 3D space for the layered elements
    >

      {/* ---------- Background footage ----------
          A full-bleed stage pinned to the Hero box: the full width, and at
          minimum the full viewport height. The footage inside it runs on
          `object-cover`, so it fills any aspect ratio — ultrawide desktop
          through to a narrow phone — at its own proportions, never
          stretched; only the edges crop, and `object-position: center center`
          keeps the centre of the frame in view on every one of them.

          The over-scan the parallax spends lives on the carrier below rather
          than on the footage itself. The carrier is laid in 4% larger than
          the stage on every side, evenly, which leaves the footage free to
          sit on a plain `inset-0` / 100% x 100% box — dead centre, carrying
          no offset of its own to bias the crop toward one edge. The scroll
          tween scales and drifts the footage and the mouse pan translates it
          by up to 20px; the carrier's bleed absorbs that travel so a corner
          pan never pulls a bare strip of page background into frame, and the
          stage clips whatever the transforms push past the edge. */}
      <div
        className="absolute inset-0 z-0 h-full min-h-screen w-full overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute left-[-4%] top-[-4%] h-[108%] w-[108%] pointer-events-none">
          <video
            ref={videoRef}
            src={histopathologyVideo}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            style={{ objectPosition: 'center center', transformOrigin: 'center center' }}
          />
        </div>
      </div>

      {/* Very subtle transparent gradient overlay for minimal blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/10 via-transparent to-[#030712]/20 z-0 pointer-events-none" />

      {/* Readability scrim — sized to the copy and nothing more. It runs
          up from the bottom on a phone, where the text spans the width,
          and in from the left everywhere else, which leaves the middle and
          right of the frame completely unveiled. */}
      <div
        className="absolute inset-0 z-0 pointer-events-none md:hidden"
        style={{
          backgroundImage:
            'linear-gradient(to top, rgba(3,7,18,0.72) 0%, rgba(3,7,18,0.34) 42%, rgba(3,7,18,0) 74%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none hidden md:block"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(3,7,18,0.58) 0%, rgba(3,7,18,0.30) 34%, rgba(3,7,18,0.06) 58%, rgba(3,7,18,0) 74%)',
        }}
        aria-hidden="true"
      />

      {/* Decorative Glows */}
      <div ref={glowRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="hero-glow-a absolute top-[8%] left-[6%] w-[42%] h-[52%] rounded-full bg-purple-600/20 blur-[150px]" />
        <div className="hero-glow-b absolute bottom-[8%] right-[8%] w-[48%] h-[58%] rounded-full bg-pink-600/[0.14] blur-[160px]" />
      </div>

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

      {/* ---------- Content ---------- */}
      <div className="relative z-10 w-full">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-32 md:py-36 lg:px-10">
          <div
            ref={contentRef}
            className="max-w-[42rem] lg:max-w-[46rem]"
            style={{ transformStyle: 'preserve-3d' }}
          >
           

            {/* Headline */}
            <h1
              className="mt-8 font-serif font-semibold text-white tracking-[-0.02em] leading-[1.04] text-[2.75rem] sm:text-[3.6rem] lg:text-[4.25rem] xl:text-[5rem]"
              style={{ textShadow: '0 2px 40px rgba(3,7,18,0.55)' }}
            >
              <span className="hero-line block opacity-0">From Tissue to Validated</span>
              
                
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#C4B5FD] via-[#E879F9] to-[#F9A8D4]">
                  Biomarker and therapeutic intelligence
                </span>{' '}
                
              
            </h1>

            {/* Editorial rule */}
            <span
              className="hero-rule mt-9 block h-px w-40 origin-left rounded-full opacity-0 bg-gradient-to-r from-[#A855F7] via-[#E879F9] to-transparent"
              aria-hidden="true"
            />

            {/* Description */}
            <p className="hero-reveal mt-8 max-w-xl font-sans text-lg lg:text-xl leading-relaxed tracking-[0.01em] text-gray-200/90 opacity-0">
              A specimen-centric AI platform integrating digital pathology, biomarker quantification, spatial biology and multiomics to support translational research, patient stratification and biomarker development.
            </p>

            {/* Calls to action */}
            <div className="hero-reveal mt-11 flex flex-wrap items-center gap-4 opacity-0">
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
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] ring-1 ring-inset ring-white/25"
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
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.07] px-8 py-4 font-sans text-base font-semibold tracking-[0.01em] text-white shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-colors duration-300 hover:border-white/35 hover:bg-white/[0.12]"
                >
                  Explore Platform
                  <ArrowRight
                    className="h-5 w-5 text-purple-200 transition-transform duration-300 ease-out group-hover:translate-x-1"
                    strokeWidth={2.25}
                  />
                </button>
              </MagneticButton>
            </div>

            {/* Index of readouts — set as Hero highlights: the four terms the
                platform is known for, sized to be read from across the room and
                painted in the brand gradient. The glyphs carry their own drop
                shadow so they hold up over the brightest frames of the footage. */}
            <div className="hero-reveal mt-14 flex flex-wrap items-center gap-x-3 gap-y-2.5 opacity-0 sm:flex-nowrap sm:gap-x-3.5">
              {MODALITIES.map((m, i) => (
                <React.Fragment key={m}>
                  {i > 0 && (
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-[#A855F7] to-[#EC4899] shadow-[0_0_10px_1px_rgba(168,85,247,0.55)]"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className="whitespace-nowrap font-sans text-[clamp(1.05rem,2.05vw,1.4rem)] font-extrabold leading-tight tracking-[-0.01em] text-transparent bg-clip-text bg-gradient-to-r from-[#DDD6FE] via-[#E879F9] to-[#F9A8D4]"
                    style={{ filter: 'drop-shadow(0 2px 18px rgba(3,7,18,0.85)) drop-shadow(0 0 26px rgba(168,85,247,0.35))' }}
                  >
                    {m}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ---------- Specimen pathway ----------
              The five stages stacked as one column of glass labels.

              Below `lg` the frame is too narrow to float anything without
              landing on the headline, so the column rides the copy in normal
              flow. From `lg` up it lifts out to the right edge of the frame
              and centres itself vertically — the band the existing readout
              panels leave open between the top and bottom one.

              Width and offset are both set as a share of the frame, and the
              column is only as wide as the two lines of each stage need: the
              cards grow with the screen but stay clear of the copy's lane, at
              any width from `lg` up. */}
          <div
            ref={chipsRef}
            className="mt-10 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:right-[1.5%] lg:mt-0 lg:flex lg:w-[19%] lg:min-w-[13.5rem] lg:max-w-[19rem] lg:items-center"
          >
            <div className="flex w-full flex-col gap-3 sm:gap-3.5">
              {KEYWORDS.map((k) => (
                <span
                  key={k.label}
                  className="hero-panel pointer-events-auto flex w-[19rem] items-start gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-3.5 py-3.5 opacity-0 shadow-[0_18px_45px_-24px_rgba(168,85,247,0.95)] ring-1 ring-inset ring-white/5 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 ease-out hover:border-white/30 hover:bg-white/[0.11] sm:w-[20rem] lg:w-full"
                >
                  <span
                    className="mt-[1px] flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white shadow-[0_8px_20px_-8px_rgba(168,85,247,0.9)]"
                    aria-hidden="true"
                  >
                    {k.icon}
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-sans text-[13px] font-semibold leading-snug tracking-[0.01em] text-white lg:text-[12.5px]">
                      {k.step && (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4B5FD] to-[#F9A8D4]">
                          {k.step}.{' '}
                        </span>
                      )}
                      {k.label}
                    </span>
                    <span className="font-sans text-[11px] font-normal leading-[1.45] tracking-[0.01em] text-gray-300/75 lg:text-[10.5px]">
                      {k.desc}
                    </span>
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
