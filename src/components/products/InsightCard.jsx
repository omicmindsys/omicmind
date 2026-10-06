import { motion } from 'framer-motion';
import {
  Activity,
  ArrowLeftRight,
  ChartColumn,
  ChartLine,
  ChartPie,
  ClipboardList,
  Database,
  Droplet,
  Fingerprint,
  Flag,
  Hash,
  LayoutGrid,
  Layers,
  Microscope,
  Network,
  Pill,
  Recycle,
  ScanSearch,
  Shapes,
  Shuffle,
  Stethoscope,
  Tags,
  TestTube,
  Waypoints,
  Boxes,
  ChartScatter,
  Combine,
  Crosshair,
  Dna,
  FlaskConical,
  Gauge,
  GitCompareArrows,
  Link2,
  Ruler,
  Search,
  ShieldOff,
  Split,
  Target,
  TrendingDown,
  Users,
} from 'lucide-react';

/* Icon keys used in productsData.js → lucide components. */
const ICONS = {
  gauge: Gauge,
  split: Split,
  users: Users,
  dna: Dna,
  trend: TrendingDown,
  compare: GitCompareArrows,
  scatter: ChartScatter,
  infiltrate: Crosshair,
  exclude: ShieldOff,
  ruler: Ruler,
  neighborhood: Boxes,
  link: Link2,
  flask: FlaskConical,
  target: Target,
  combine: Combine,
  translate: ArrowLeftRight,
  search: Search,
  microscope: Microscope,
  detect: ScanSearch,
  classify: Tags,
  shapes: Shapes,
  spatial: Waypoints,
  data: Database,
  composition: ChartPie,
  grid: LayoutGrid,
  layers: Layers,
  intensity: Droplet,
  heterogeneity: Shuffle,
  signature: Fingerprint,
  count: Hash,
  chart: ChartColumn,
  testtube: TestTube,
  clinical: Stethoscope,
  clipboard: ClipboardList,
  pill: Pill,
  network: Network,
  activity: Activity,
  repurpose: Recycle,
  timeline: ChartLine,
  decision: Flag,
};

/* ------------------------------------------------------------------
   One light insight card: small icon, title, one-line description.
   Icon keys are shared by every story's data (see ICONS).
   Inside a list driven by `hidden` / `show` variants the cards enter
   one after another; anywhere else they simply render.
------------------------------------------------------------------ */
export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export { ICONS };

export default function InsightCard({ icon, title, body, step }) {
  const Icon = ICONS[icon];

  return (
    <motion.li
      variants={staggerItem}
      className="flex h-full flex-col rounded-[18px] border border-white/[0.08] bg-white/[0.025] p-5 transition-colors duration-300 hover:border-white/[0.14]"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#C4B5FD]/20 bg-[#7C3AED]/10 text-[#C4B5FD]">
          {Icon && <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />}
        </span>
        <span className="font-sans text-[11px] font-semibold tabular-nums tracking-[0.12em] text-slate-600">
          {step}
        </span>
      </div>
      <h5 className="mt-4 font-sans text-[15px] font-semibold leading-snug text-slate-100">{title}</h5>
      <p className="mt-1.5 font-sans text-[13.5px] leading-relaxed text-slate-400">{body}</p>
    </motion.li>
  );
}
