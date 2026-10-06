import { useRef } from 'react';
import { routeLinkProps } from '../../router.jsx';
import { ArrowIcon } from './ProductCard.jsx';
import { useProductVisualMotion } from './ProductVisuals.jsx';

/* The illustration mounts with its product, so its motion is set up and
   torn down with it. */
export function DetailVisual({ Visual }) {
  const ref = useRef(null);
  useProductVisualMotion(ref, Visual);
  return (
    <div
      ref={ref}
      className="rounded-[20px] border border-white/[0.08] p-3 sm:p-4"
      style={{
        backgroundImage: 'linear-gradient(160deg, rgba(124,58,237,0.12) 0%, rgba(236,72,153,0.06) 100%)',
      }}
    >
      <Visual />
    </div>
  );
}

/* Without an `href`, an `onClick` renders the same action as a button
   (for products that have no dedicated page yet). */
export function ViewFullProduct({ href, onClick, className = '', children = 'View Full Product' }) {
  if (!href && !onClick) return null;
  const Tag = href ? 'a' : 'button';
  const props = href ? routeLinkProps(href) : { type: 'button', onClick };
  return (
    <Tag
      {...props}
      className={`group/cta relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-6 py-3 font-sans text-[14px] font-semibold tracking-[0.01em] text-white ring-1 ring-inset ring-white/20 transition-shadow duration-300 hover:shadow-[0_10px_28px_-12px_rgba(168,85,247,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1626] ${className}`}
    >
      {children}
      <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
    </Tag>
  );
}
