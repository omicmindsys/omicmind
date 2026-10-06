import { motion } from 'framer-motion';

export function Trademark() {
  return <span className="align-super font-sans text-[0.55em] font-medium text-slate-500">&trade;</span>;
}

export function ArrowIcon({ className = 'h-4 w-4', direction = 'right' }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`${className} ${direction === 'left' ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <path
        d="M4 10h11M10.5 5.5L15 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const EDGE_SELECTED =
  'linear-gradient(140deg, rgba(167,139,250,0.85) 0%, rgba(217,70,239,0.6) 50%, rgba(236,72,153,0.75) 100%)';
const EDGE_FEATURED =
  'linear-gradient(140deg, rgba(167,139,250,0.38) 0%, rgba(217,70,239,0.18) 50%, rgba(236,72,153,0.32) 100%)';
const EDGE_DEFAULT = 'linear-gradient(140deg, rgba(255,255,255,0.10), rgba(255,255,255,0.10))';

/* ------------------------------------------------------------------
   The shared frame every carousel card sits in: the 1px edge, navy
   surface, hover lift and selected state. The body is the card's own.

   `selected` is the card currently being explored — it alone carries the
   full purple → pink edge. A `featured` card keeps a faint version of
   that edge when it is not selected; every other card stays quiet.
------------------------------------------------------------------ */
export function CardShell({ index, total, name, selected, featured = false, width, onOpen, children }) {
  return (
    <motion.article
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${name}`}
      onClick={onOpen}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative shrink-0 cursor-pointer rounded-[22px] p-px"
      style={{
        width,
        backgroundImage: selected ? EDGE_SELECTED : featured ? EDGE_FEATURED : EDGE_DEFAULT,
        boxShadow: selected
          ? '0 18px 40px -22px rgba(124,58,237,0.55)'
          : '0 10px 28px -20px rgba(15,23,42,0.6)',
        transition: 'box-shadow 0.35s ease, background-image 0.35s ease',
      }}
    >
      <div
        className={`flex h-full flex-col rounded-[21px] p-5 transition-colors duration-300 ${
          selected ? 'bg-[#141E33]' : 'bg-[#111A2B] group-hover:bg-[#131D30]'
        }`}
      >
        {/* Hover: slightly brighter edge on unselected cards */}
        {!selected && (
          <span
            className="pointer-events-none absolute inset-0 rounded-[22px] border border-white/0 transition-colors duration-300 group-hover:border-white/[0.14]"
            aria-hidden="true"
          />
        )}
        {children}
      </div>
    </motion.article>
  );
}

/* Illustration, name and summary — the part of the body every card shares. */
export function CardIntro({ id, name, trademark, tagline, Visual, subtitle, clamp = 'line-clamp-3' }) {
  return (
    <>
      <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.02] p-2">
        <Visual />
      </div>

      <h3
        id={`product-card-${id}`}
        className={`mt-5 font-serif text-[1.08rem] font-semibold leading-snug tracking-[-0.005em] text-[#F8FAFC]`}
      >
        {name}
        {trademark && <Trademark />}
      </h3>

      {subtitle && (
        <p className="mt-1 font-sans text-[12.5px] font-medium leading-snug text-[#C4B5FD]">{subtitle}</p>
      )}

      <p className={`mt-2 ${clamp} font-sans text-[13px] leading-relaxed text-slate-400`}>{tagline}</p>
    </>
  );
}

/* ------------------------------------------------------------------
   One compact, equal-height product card. The whole card is clickable
   for pointer users; the circular arrow is the single focusable control,
   so keyboard and screen-reader users get one clearly named button per
   product rather than a button wrapping a heading.
------------------------------------------------------------------ */
export default function ProductCard({ product, index, total, selected, width, onOpen, buttonRef }) {
  const { name } = product;

  return (
    <CardShell index={index} total={total} name={name} selected={selected} width={width} onOpen={onOpen}>
      <CardIntro {...product} />

      <div className="mt-auto flex justify-end pt-5">
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          aria-label={`Explore ${name}`}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111A2B] ${
            selected
              ? 'border-transparent bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white'
              : 'border-white/15 text-slate-300 group-hover:border-white/30 group-hover:text-white'
          }`}
        >
          <ArrowIcon />
        </button>
      </div>
    </CardShell>
  );
}
