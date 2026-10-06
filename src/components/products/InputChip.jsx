/* ------------------------------------------------------------------
   A single data chip — an input modality, a marker, an output.
   `tone="accent"` is the brand-tinted variant for model outputs;
   `tone="optional"` a dashed outline for inputs that are not required.
   `dot` prefixes a small colour key (e.g. a marker's cell type).
------------------------------------------------------------------ */
export default function InputChip({ children, tone = 'default', dot, className = '' }) {
  const tones = {
    default: 'border-white/[0.12] bg-white/[0.04] text-slate-200',
    accent: 'border-[#C4B5FD]/30 bg-[#7C3AED]/[0.12] text-[#EDE9FE]',
    optional: 'border-dashed border-white/25 bg-transparent text-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-sans text-[12.5px] font-medium leading-none ${tones[tone]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: dot }} aria-hidden="true" />}
      {children}
    </span>
  );
}
