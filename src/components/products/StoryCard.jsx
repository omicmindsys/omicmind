import { ArrowIcon, CardIntro, CardShell } from './ProductCard.jsx';

/* ------------------------------------------------------------------
   Card for a product with a full story (ResponseAI™, SpatialTME™, …).
   Same frame and size as every other card; it can add a category line
   under the name and the data modalities as one quiet line below the
   summary, and ends in a labelled "Explore" action. A `featured`
   product keeps a faint brand edge even when another card is selected.
------------------------------------------------------------------ */
export default function StoryCard({ product, index, total, selected, width, onOpen, buttonRef }) {
  const { name, category, modalities = [], featured = false } = product;

  return (
    <CardShell
      index={index}
      total={total}
      name={name}
      selected={selected}
      featured={featured}
      width={width}
      onOpen={onOpen}
    >
      <CardIntro {...product} subtitle={category} clamp="line-clamp-4" />

      {modalities.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Data modalities">
          {modalities.map((m) => (
            <li
              key={m}
              className="whitespace-nowrap rounded-full border border-[#C4B5FD]/20 px-2 py-[3px] font-sans text-[10.5px] font-semibold leading-none tracking-[0.04em] text-[#C4B5FD]/90"
            >
              {m}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex justify-end pt-5">
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          aria-label={`Explore ${name}`}
          className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-4 font-sans text-[13px] font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111A2B] ${
            selected
              ? 'border-transparent bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white'
              : 'border-[#C4B5FD]/30 text-slate-200 group-hover:border-[#C4B5FD]/50 group-hover:text-white'
          }`}
        >
          Explore
          <ArrowIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </CardShell>
  );
}
