import { useEffect, useRef } from 'react';
import { ArrowIcon } from './ProductCard.jsx';

/* ------------------------------------------------------------------
   Compact product switcher at the foot of the detail view:

   ←  ResponseAI | SpatialTME | HistoQuant | … | TrialAI  →

   The tab strip scrolls horizontally on narrow screens and keeps the
   current product scrolled into view without moving the page.
------------------------------------------------------------------ */
export default function ProductNavigation({ products, index, onSelect }) {
  const stripRef = useRef(null);
  const itemRefs = useRef([]);
  const total = products.length;

  useEffect(() => {
    const strip = stripRef.current;
    const item = itemRefs.current[index];
    if (!strip || !item) return;
    const target = item.offsetLeft - (strip.clientWidth - item.offsetWidth) / 2;
    strip.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [index]);

  const arrowClass =
    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/15 disabled:hover:text-slate-300';

  return (
    <nav aria-label="Switch product" className="flex items-center gap-3">
      <button
        type="button"
        className={arrowClass}
        onClick={() => onSelect(index - 1)}
        disabled={index === 0}
        aria-label={index > 0 ? `Previous product: ${products[index - 1].shortName}` : 'Previous product'}
      >
        <ArrowIcon direction="left" />
      </button>

      <div
        ref={stripRef}
        className="relative min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-lenis-prevent
      >
        <ul className="flex w-max items-center gap-1 sm:mx-auto">
          {products.map((p, i) => {
            const current = i === index;
            return (
              <li key={p.id} className="flex items-center">
                {i > 0 && <span className="mx-1 h-3.5 w-px bg-white/10" aria-hidden="true" />}
                <button
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-current={current ? 'true' : undefined}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 font-sans text-[13px] font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] ${
                    current
                      ? 'bg-gradient-to-r from-[#7C3AED]/25 to-[#EC4899]/25 text-white ring-1 ring-inset ring-[#C4B5FD]/40'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {p.shortName}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        className={arrowClass}
        onClick={() => onSelect(index + 1)}
        disabled={index === total - 1}
        aria-label={index < total - 1 ? `Next product: ${products[index + 1].shortName}` : 'Next product'}
      >
        <ArrowIcon />
      </button>
    </nav>
  );
}
