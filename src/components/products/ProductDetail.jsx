import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowIcon, Trademark } from './ProductCard.jsx';
import { DetailVisual, ViewFullProduct } from './DetailParts.jsx';
import ProductInfoBlock from './ProductInfoBlock.jsx';
import ProductNavigation from './ProductNavigation.jsx';
import ResponseAIDetail from './ResponseAIDetail.jsx';
import SpatialTMEDetail from './SpatialTMEDetail.jsx';
import HistoQuantDetail from './HistoQuantDetail.jsx';
import DiscoveryDetail from './DiscoveryDetail.jsx';
import ADCDetail from './ADCDetail.jsx';
import DrugDevDetail from './DrugDevDetail.jsx';
import { products } from './productsData.js';

const EASE = [0.22, 1, 0.36, 1];

/* Products with a full story name their layout in `story.layout`. */
const STORIES = {
  response: ResponseAIDetail,
  spatial: SpatialTMEDetail,
  histo: HistoQuantDetail,
  discovery: DiscoveryDetail,
  adc: ADCDetail,
  drugdev: DrugDevDetail,
};

/* ------------------------------------------------------------------
   The expanded product story. Takes the carousel's place in the section
   and switches between products in place.

   Layout from `md`: name, description and action on the left, the
   illustration on the right, the three information blocks beneath.
   On phones everything stacks: title → visual → description → Inputs →
   AI Analysis → Outputs → View Full Product.
------------------------------------------------------------------ */
export default function ProductDetail({ index, onSelect, onBack, onClose }) {
  const rootRef = useRef(null);
  const headingRef = useRef(null);
  const product = products[index];
  const { id, name, trademark, description, inputs, analysis, outputs, href, Visual } = product;
  const Story = product.story ? STORIES[product.story.layout] : null;

  /* Move focus into the story when it opens; switching products keeps
     focus on the switcher the visitor is using. */
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const select = (i) => {
    if (i < 0 || i >= products.length || i === index) return;
    onSelect(i);
    /* Stories differ in length; bring the top of the new one into view
       when the switcher was used from further down the page. */
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollTo({ top: window.scrollY + top - 96, behavior: 'smooth' });
  };

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0E1626] shadow-[0_24px_60px_-30px_rgba(15,23,42,0.75)]"
    >
      {/* A single, faint wash of the brand ramp in one corner */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(60% 50% at 85% 0%, rgba(124,58,237,0.14) 0%, rgba(124,58,237,0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative p-5 sm:p-8 lg:p-10">
        {/* ---------------- Top bar ---------------- */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full px-1 py-1 font-sans text-sm font-semibold text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD]"
          >
            <ArrowIcon direction="left" />
            Back to Products
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD]"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ---------------- Product story ---------------- */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={id}
            aria-labelledby={`product-detail-${id}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="mt-8 sm:mt-10"
          >
            {Story ? (
              <Story product={product} headingRef={headingRef} />
            ) : (
              <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.05fr_1fr] md:gap-x-10 md:gap-y-5 lg:gap-x-14">
                <h3
                  ref={headingRef}
                  id={`product-detail-${id}`}
                  tabIndex={-1}
                  className="font-serif text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.01em] text-[#F8FAFC] outline-none sm:text-[2.25rem] md:col-start-1 md:row-start-1 md:self-end lg:text-[2.6rem]"
                >
                  {name}
                  {trademark && <Trademark />}
                </h3>

                <div className="md:col-start-2 md:row-span-3 md:row-start-1 md:self-center">
                  <DetailVisual Visual={Visual} />
                </div>

                <p className="max-w-xl font-sans text-[15px] leading-relaxed text-slate-300 sm:text-base md:col-start-1 md:row-start-2">
                  {description}
                </p>

                <div className="hidden md:col-start-1 md:row-start-3 md:block md:self-start md:pt-2">
                  <ViewFullProduct href={href} />
                </div>
              </div>

              {/* ---------------- Inputs → AI Analysis → Outputs ---------------- */}
              <div className="mt-8 grid grid-cols-1 gap-4 border-t border-white/[0.08] pt-8 sm:mt-10 md:grid-cols-3 md:gap-5">
                <ProductInfoBlock step="01" label="Inputs" items={inputs} />
                <ProductInfoBlock step="02" label="AI Analysis" items={analysis} />
                <ProductInfoBlock step="03" label="Key Outputs" items={outputs} />
              </div>

              {href && (
                <div className="mt-8 md:hidden">
                  <ViewFullProduct href={href} className="w-full" />
                </div>
              )}
              </>
            )}
          </motion.article>
        </AnimatePresence>

        {/* ---------------- Product switcher ---------------- */}
        <div className="mt-10 border-t border-white/[0.08] pt-6">
          <ProductNavigation products={products} index={index} onSelect={select} />
        </div>
      </div>
    </motion.div>
  );
}
