/* ------------------------------------------------------------------
   One of the three information blocks under a product story —
   Inputs, AI Analysis, Key Outputs. A label and a plain list: nothing
   competes with the content.
------------------------------------------------------------------ */
export default function ProductInfoBlock({ step, label, items }) {
  const headingId = `product-info-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`;

  return (
    <section
      aria-labelledby={headingId}
      className="h-full rounded-[18px] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6"
    >
      <h4
        id={headingId}
        className="flex items-center gap-2.5 font-sans text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-[#C4B5FD]"
      >
        <span className="tabular-nums text-slate-500">{step}</span>
        {label}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 font-sans text-[14px] leading-snug text-slate-200">
            <span
              className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#EC4899] opacity-80"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
