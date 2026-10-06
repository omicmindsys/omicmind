import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WorkflowJourney from './WorkflowJourney.jsx';
import OncologyDiseaseAreas from './OncologyDiseaseAreas.jsx';

gsap.registerPlugin(ScrollTrigger);

/* Data particles scattered through the ambient field. Kept off the centre
   column so nothing ever drifts across the content. */
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

export default function FoundationModel() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

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
      className="relative w-full overflow-hidden rounded-t-[3rem] bg-[#0B1020] pb-24 pt-24 lg:pb-32 lg:pt-32"
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
              'linear-gradient(to right, rgba(167,139,250,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(167,139,250,0.10) 1px, transparent 1px)',
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
                'radial-gradient(circle, rgba(124,58,237,0.26) 0%, rgba(124,58,237,0) 70%)',
            }}
          />
          <div
            className="absolute -right-[10%] bottom-[2%] h-[48%] w-[50%] rounded-full blur-[100px]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(236,72,153,0.22) 0%, rgba(236,72,153,0) 70%)',
            }}
          />
        </div>

        {/* Very subtle radial brand glow */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(60% 45% at 50% 55%, rgba(30,58,138,0.30) 0%, rgba(124,58,237,0.12) 45%, rgba(11,16,32,0) 75%)',
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

        {/* ---------- Oncology disease areas ----------
            The exploration layer, sitting directly under the workflow.
            It carries its own heading and ground. */}
        <OncologyDiseaseAreas />
      </div>
    </section>
  );
}