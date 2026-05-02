import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Anvil,
  CircleDot,
  Clock3,
  Crosshair,
  DoorOpen,
  Gauge,
  Hammer,
  HeartPulse,
  Home,
  Rocket,
  Shield,
  Skull,
  Sprout,
  Wheat,
  Zap,
} from "lucide-react";
import type { CraftData } from "../data/crafts";
import type { ItemData } from "../data/items";

type CraftCardProps = {
  craft: CraftData;
  relatedItem?: ItemData;
};

const workbenchLabel: Record<CraftData["workbench"], string> = {
  none: "без верстака",
  level1: "верстак 1",
  level2: "верстак 2",
  level3: "верстак 3",
};

const difficultyLabel: Record<CraftData["difficulty"], string> = {
  easy: "easy",
  medium: "medium",
  hard: "hard",
};

const categoryIconMap: Record<string, LucideIcon> = {
  Строительство: Home,
  Оружие: Crosshair,
  Боеприпасы: CircleDot,
  Рейды: Rocket,
  Электрика: Zap,
  Медицина: HeartPulse,
  Броня: Shield,
  Инструменты: Hammer,
  "Двери и замки": DoorOpen,
  Ловушки: Skull,
  Фермерство: Sprout,
  Еда: Wheat,
};

export function CraftCard({ craft, relatedItem }: CraftCardProps) {
  const Icon = categoryIconMap[craft.category] ?? Hammer;
  const slang = relatedItem?.slang.slice(0, 4).join(", ");

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-rust-panel/90 to-black/40 p-5 shadow-rust"
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-rust-orange/10 blur-xl" />
      <div className="relative flex items-start gap-4">
        <div className="item-icon">
          <Icon size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-white">{craft.name}</h3>
            <span className={`badge ${craft.difficulty === "easy" ? "badge-green" : craft.difficulty === "medium" ? "badge-amber" : "badge-red"}`}>
              {difficultyLabel[craft.difficulty]}
            </span>
          </div>
          {relatedItem && (
            <p className="mt-1 text-sm text-rust-metal">
              Сленг: <span className="font-semibold text-rust-amber">{slang}</span>
            </p>
          )}
          <p className="mt-2 text-sm leading-6 text-rust-metal">{craft.description}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Meta icon={Anvil} title="Верстак" value={workbenchLabel[craft.workbench]} />
        <Meta icon={Clock3} title="Приоритет" value={craft.priority} />
        <Meta icon={Gauge} title="Категория" value={craft.category} />
      </div>

      <div className="mt-5 rounded-md border border-white/10 bg-black/20 p-4">
        <div className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-rust-metal">Ресурсы</div>
        <div className="flex flex-wrap gap-2">
          {craft.resources.map((resource) => (
            <span key={`${craft.id}-${resource.name}`} className="resource-chip">
              {resource.name}
              <b>{resource.amount}</b>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-md border border-rust-green/20 bg-rust-green/10 p-4 text-sm leading-6 text-white/80">
        <span className="font-bold text-rust-green">Совет: </span>
        {craft.beginnerTip}
      </div>
    </motion.article>
  );
}

function Meta({ icon: Icon, title, value }: { icon: typeof Hammer; title: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-rust-metal">
        <Icon size={14} />
        {title}
      </div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  );
}
