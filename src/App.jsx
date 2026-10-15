import React, { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import OmicMindBreast from './components/OmicMindBreast.jsx'
import FoundationModel from './components/FoundationModel.jsx'
import OmicMindEcosystem from './components/OmicMindEcosystem.jsx'
import OncologyDiseaseAreas from './components/OncologyDiseaseAreas.jsx'
import OmicMindCoreEngine from './components/OmicMindCoreEngine.jsx'
import OmicMindCoreFlow from './components/OmicMindCoreFlow.jsx'
import Footer from './components/Footer.jsx'

gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef(null);
  const heroWrapperRef = useRef(null);
  const suitesWrapperRef = useRef(null);
  
  // Spotlight effect motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // 1. Lenis Smooth Scroll — skipped for visitors who ask for reduced
    // motion, who get the browser's native scrolling instead.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = prefersReducedMotion ? null : new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })

    // Integrate Lenis with GSAP ScrollTrigger
    const tick = (time) => {
      lenis.raf(time * 1000)
    }
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }

    // 2. Global Mouse Spotlight Listener
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3. Seamless Section Transitions (Continuous 3D Environment)
    const ctx = gsap.context(() => {
      /* The Hero carries no scroll transition of its own: it used to scale
         down and fade to transparent as the next section rose, which let the
         page's near-black ground show through and read as the Hero turning
         black. It now simply scrolls away in normal document flow. */

      /* The suites wrapper carries no transform of its own: any `y`/`z` offset
         here reads as a transient margin-top and tears a strip of bare page
         background between the Hero and "Modern Oncology Requires Morphology".
         It rides normal document flow instead, directly under the Hero. */
    }, containerRef);

    return () => {
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
      }
      window.removeEventListener('mousemove', handleMouseMove);
      ctx.revert();
    }
  }, [cursorX, cursorY])

  return (
    <>
      {/* Fixed navbar — kept outside <main> so its `position: fixed` is not
          captured by main's `perspective`/`overflow-hidden` containing block. */}
      <Navbar background="#F6F5F3" />

      <main ref={containerRef} className="relative min-h-screen w-full bg-[#030712] text-gray-50 selection:bg-purple-500/30 overflow-hidden" style={{ perspective: '1200px' }}>

      {/* Global Mouse Spotlight */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[100px] mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />

      {/* Sections wrapped for overlapping GSAP animations */}
      <div ref={heroWrapperRef} className="relative z-10 w-full" style={{ transformOrigin: 'bottom center' }}>
        <Hero />
      </div>

      {/* Re-writing the Suites wrapper correctly for standard flow */}
      <div ref={suitesWrapperRef} className="relative z-20 w-full bg-[#030712] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] rounded-t-[3rem]">
        {/* Oncology disease areas, directly under the Hero. It is drawn on the
            same dark ground and in the same centred container it had inside
            the Foundation Model section, so it reads exactly as before. */}
        <section className="relative w-full overflow-hidden rounded-t-[3rem] bg-[#0B1020] pb-24 lg:pb-32">
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <OncologyDiseaseAreas />
          </div>
        </section>

        <OmicMindEcosystem />

        <OmicMindCoreEngine />

        <OmicMindCoreFlow />

        <FoundationModel />

      </div>
      </main>

      {/* Footer kept outside <main> so it is untouched by main's
          perspective / overflow-hidden and the parallax transforms. */}
      <Footer />
    </>
  )
}

export default App
