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
   violet accent, no glows. Depth comes from two planes moving at two
   rates: footage and copy.
================================================================ */

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

export default function Hero() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const panRef = useRef(null);
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
         Copy climbs in editorial order — headline, index, rule, body,
         actions — while the footage slides in beside it. */
      if (prefersReducedMotion) {
        gsap.set('.hero-reveal, .hero-line, .hero-media', {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
        gsap.set('.hero-rule', { autoAlpha: 1, scaleX: 1 });
      } else {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
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
           stops. Only the video frame tilts — not the copy. Capped at 4.5deg so it reads as depth, not motion. */
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

        // Foreground Content: Move up fastest
        scrollTl.fromTo(
          contentRef.current,
          { y: 0, z: 0 },
          { y: isMobile ? -80 : -200, z: isMobile ? 20 : 50, ease: 'none' },
          0
        );

        /* ---------- 2. Mouse-based 3D Tilt & Pan (Desktop Only) ---------- */
        /* The pointer pan writes to `panRef`, a plane inside `contentRef`,
           so it never competes with the scroll scrub for the same `y` — two
           writers on one property is what made the copy stutter on scroll.
           `quickTo` retargets a single tween rather than starting a new one
           on every mousemove event. */
        if (!isMobile && panRef.current) {
          const pan = panRef.current;
          const panX = gsap.quickTo(pan, 'x', { duration: 1.5, ease: 'power2.out' });
          const panY = gsap.quickTo(pan, 'y', { duration: 1.5, ease: 'power2.out' });
          const tiltPanX = gsap.quickTo(pan, 'rotationX', { duration: 1.5, ease: 'power2.out' });
          const tiltPanY = gsap.quickTo(pan, 'rotationY', { duration: 1.5, ease: 'power2.out' });

          const handleMouseMove = (e) => {
            const { innerWidth, innerHeight } = window;
            // Normalize mouse position between -1 and 1
            const x = (e.clientX / innerWidth - 0.5) * 2;
            const y = (e.clientY / innerHeight - 0.5) * 2;

            // The footage itself stays put; only the copy pans and tilts.
            panX(x * 15);
            panY(y * 15);
            tiltPanX(y * -2);
            tiltPanY(x * 2);
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

      {/* ---------- Content ----------
          Two columns from `lg` up: the headline, index and hairline read
          down the left; the footage holds the right, with the description
          and actions directly beneath it. Below `lg` it stacks in that same
          order. */}
      <div className="relative z-10 w-full">
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-10 pt-32 sm:pt-36 lg:px-10 lg:pb-14 lg:pt-44">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
            <div className="min-w-0">
              <div ref={contentRef} style={{ transformStyle: 'preserve-3d' }}>
                <div ref={panRef} style={{ transformStyle: 'preserve-3d' }}>
                  {/* Headline */}
                  <h1 className="font-sans text-[clamp(2.75rem,5.9vw,5.5rem)] font-normal leading-[1.06] tracking-[-0.04em] text-[#0B0D12]">
                    <span className="hero-line block opacity-0">One intelligence engine.</span>
                    <span className="hero-line block opacity-0">From tissue to therapeutics.</span>
                  </h1>

                  {/* Index of readouts — a quiet line of the platform's own vocabulary,
                      directly beneath the headline. One line where the column
                      allows; otherwise it wraps between whole terms. */}
                  <p className="hero-reveal mt-12 font-sans text-[13.5px] font-normal leading-[1.9] tracking-[-0.005em] text-[#64748B] opacity-0">
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
              </div>

              {/* Hairline */}
              <span
                className="hero-rule mt-10 mb-10 block h-px w-full origin-left bg-[#111827]/10 opacity-0 lg:mt-14 lg:mb-14"
                aria-hidden="true"
              />
            </div>

            {/* ---------- The footage ----------
                The right-hand column: the video in a clipped frame, cropped
                with `LOGO_CROP` so the generator's mark stays out of view. */}
            <div ref={mediaRef} className="hero-media relative w-full min-w-0 opacity-0">
              <div
                ref={frameRef}
                className="relative w-full overflow-hidden rounded-xl border border-[#111827]/10"
                style={{ willChange: 'transform' }}
              >
                <div className="relative aspect-video w-full overflow-hidden" aria-hidden="true">
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
              </div>

              {/* Description, actions and index — directly beneath the footage. */}
              <div className="mt-10 lg:mt-14">
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
                      className="group relative inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-sans text-[15px] font-medium tracking-[-0.01em] text-white"
                      style={{ backgroundImage: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}
                    >
                      {/* Deeper purple-to-pink hover surface over the brand gradient. */}
                      <span
                        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-[350ms] ease-out group-hover:opacity-100"
                        style={{ backgroundImage: 'linear-gradient(135deg, #6D28D9 0%, #DB2777 100%)' }}
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
                      className="group relative inline-flex items-center gap-2.5 rounded-full border border-[#7C3AED]/30 px-7 py-3.5 font-sans text-[15px] font-normal tracking-[-0.01em] text-[#6D28D9] transition-colors duration-300 hover:border-[#EC4899]/50"
                      style={{ backgroundImage: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(236,72,153,0.08) 100%)' }}
                    >
                      {/* Soft pink-purple wash that deepens on hover. */}
                      <span
                        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-[350ms] ease-out group-hover:opacity-100"
                        style={{ backgroundImage: 'linear-gradient(135deg, rgba(124,58,237,0.10) 0%, rgba(244,114,182,0.16) 100%)' }}
                        aria-hidden="true"
                      />
                      <span className="relative">Explore Platform</span>
                      <ArrowRight
                        className="relative h-4 w-4 text-[#EC4899] transition-transform duration-300 ease-out group-hover:translate-x-1"
                        strokeWidth={1.75}
                      />
                    </button>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
