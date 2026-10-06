import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import ProductCard, { ArrowIcon } from './ProductCard.jsx';
import ProductDetail from './ProductDetail.jsx';
import StoryCard from './StoryCard.jsx';
import { useProductVisualMotion } from './ProductVisuals.jsx';
import { products } from './productsData.js';

const GAP = 20;
const EASE = [0.22, 1, 0.36, 1];
const pad = (n) => String(n).padStart(2, '0');
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* Cards visible at once: 4 on desktop, 2 on tablet, 1 on phones. */
function perViewFor(width) {
  if (width >= 1024) return 4;
  if (width >= 640) return 2;
  return 1;
}

const controlClass =
  'inline-flex items-center gap-2 rounded-full border border-[#17202A]/15 bg-white/60 px-4 py-2 font-sans text-sm font-semibold text-[#263238] transition-colors hover:border-[#7C3AED]/40 hover:text-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#17202A]/15 disabled:hover:text-[#263238]';

/* ------------------------------------------------------------------
   The AI Products section. Two states share one place on the page:

   • the carousel — compact, equal-height cards on a draggable track
   • the expanded product story — the full-width detail view

   Opening a card swaps the carousel for the detail view in place, so the
   card reads as unfolding into its story rather than spawning a modal.
------------------------------------------------------------------ */
export default function ProductCarousel() {
  const rootRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const cardButtonRefs = useRef([]);
  const dragMoved = useRef(false);
  const restoreFocusTo = useRef(null);

  const [viewportWidth, setViewportWidth] = useState(0);
  const [perView, setPerView] = useState(4);
  const [active, setActive] = useState(0);
  const [start, setStart] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);

  const x = useMotionValue(0);
  const total = products.length;
  const maxStart = Math.max(0, total - perView);
  const cardWidth = viewportWidth ? (viewportWidth - GAP * (perView - 1)) / perView : 0;
  const step = cardWidth + GAP;

  useProductVisualMotion(trackRef, openIndex === null ? 'carousel' : 'hidden');

  /* Measure the viewport; re-measure whenever the carousel is (re)shown. */
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;
    const measure = () => {
      setViewportWidth(el.clientWidth);
      setPerView(perViewFor(window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [openIndex]);

  /* Keep `start` valid when the number of visible cards changes. */
  useEffect(() => {
    setStart((s) => clamp(s, 0, maxStart));
  }, [maxStart]);

  /* Slide the track to the first visible card. */
  useEffect(() => {
    if (!step) return undefined;
    const controls = animate(x, -start * step, { type: 'tween', duration: 0.5, ease: EASE });
    return () => controls.stop();
  }, [start, step, x]);

  /* Move the active card and scroll just enough to keep it in view. */
  const goTo = useCallback(
    (next) => {
      const i = clamp(next, 0, total - 1);
      setActive(i);
      setStart((s) => {
        if (i < s) return i;
        if (i >= s + perView) return clamp(i - perView + 1, 0, maxStart);
        return s;
      });
    },
    [total, perView, maxStart]
  );

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const i = clamp(active + (e.key === 'ArrowLeft' ? -1 : 1), 0, total - 1);
    goTo(i);
    cardButtonRefs.current[i]?.focus({ preventScroll: true });
  };

  const onDragStart = () => {
    dragMoved.current = true;
  };

  const onDragEnd = (_, info) => {
    const projected = x.get() + info.velocity.x * 0.2;
    const s = clamp(Math.round(-projected / step), 0, maxStart);
    setStart(s);
    /* `start` may not change (a small drag); snap back regardless. */
    animate(x, -s * step, { type: 'tween', duration: 0.45, ease: EASE });
    setActive((a) => (a < s || a >= s + perView ? s : a));
    /* Let the click that ends a drag fall through without opening a card. */
    setTimeout(() => {
      dragMoved.current = false;
    }, 0);
  };

  const scrollSectionIntoView = () => {
    const el = rootRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.35) {
      window.scrollTo({ top: window.scrollY + top - 96, behavior: 'smooth' });
    }
  };

  const open = (i) => {
    if (dragMoved.current) return;
    setActive(i);
    setOpenIndex(i);
    scrollSectionIntoView();
  };

  const close = () => {
    const i = openIndex ?? active;
    restoreFocusTo.current = i;
    goTo(i);
    setOpenIndex(null);
  };

  /* Escape closes the expanded story. */
  useEffect(() => {
    if (openIndex === null) return undefined;
    const onEsc = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  });

  /* Return focus to the card that was explored once the carousel is back. */
  useEffect(() => {
    if (openIndex !== null || restoreFocusTo.current === null) return;
    const i = restoreFocusTo.current;
    restoreFocusTo.current = null;
    requestAnimationFrame(() => cardButtonRefs.current[i]?.focus({ preventScroll: true }));
  }, [openIndex]);

  return (
    <div ref={rootRef} className="mt-20 md:mt-24">
      {/* ---------------- Heading ---------------- */}
      <div className="max-w-2xl">
        <h2
          id="ai-products-heading"
          className="font-serif text-3xl font-semibold leading-tight tracking-[-0.01em] text-[#17202A] sm:text-4xl"
        >
          Our AI Products
        </h2>
        <p className="mt-3 font-sans text-base leading-relaxed text-[#4B5563] sm:text-lg">
          One Intelligence Engine. Multiple Clinical Applications.
        </p>
      </div>

      <div className="mt-10">
        {openIndex === null ? (
          <motion.div
            key="carousel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div
              role="region"
              aria-roledescription="carousel"
              aria-labelledby="ai-products-heading"
              onKeyDown={onKeyDown}
            >
              {/* ---------------- Track ---------------- */}
              <div ref={viewportRef} className="-my-6 overflow-hidden py-6">
                <motion.div
                  ref={trackRef}
                  className="flex cursor-grab items-stretch active:cursor-grabbing"
                  style={{ x, gap: GAP, touchAction: 'pan-y' }}
                  drag="x"
                  dragConstraints={{ left: -maxStart * step, right: 0 }}
                  dragElastic={0.12}
                  dragMomentum={false}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                >
                  {products.map((product, i) => {
                    const Card = product.story ? StoryCard : ProductCard;
                    return (
                      <Card
                        key={product.id}
                        product={product}
                        index={i}
                        total={total}
                        width={cardWidth || undefined}
                        selected={i === active}
                        onOpen={() => open(i)}
                        buttonRef={(el) => {
                          cardButtonRefs.current[i] = el;
                        }}
                      />
                    );
                  })}
                </motion.div>
              </div>

              {/* ---------------- Controls ---------------- */}
              <div className="mt-8 flex items-center justify-between gap-4">
                <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} className={controlClass}>
                  <ArrowIcon direction="left" />
                  <span className="sr-only sm:not-sr-only">Previous</span>
                </button>

                <div className="flex min-w-0 flex-1 flex-col items-center gap-2.5">
                  <p
                    className="font-sans text-sm font-semibold tabular-nums tracking-[0.08em] text-[#263238]"
                    aria-live="polite"
                  >
                    <span className="text-[#6D28D9]">{pad(active + 1)}</span>
                    <span className="mx-1.5 text-[#9CA3AF]">/</span>
                    <span>{pad(total)}</span>
                    <span className="sr-only">: {products[active].name}</span>
                  </p>
                  {/* Active card indicator */}
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {products.map((p, i) => (
                      <span
                        key={p.id}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i === active ? 'w-6 bg-gradient-to-r from-[#7C3AED] to-[#EC4899]' : 'w-1.5 bg-[#17202A]/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  disabled={active === total - 1}
                  className={controlClass}
                >
                  <span className="sr-only sm:not-sr-only">Next</span>
                  <ArrowIcon />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <ProductDetail index={openIndex} onSelect={setOpenIndex} onBack={close} onClose={close} />
        )}
      </div>
    </div>
  );
}
