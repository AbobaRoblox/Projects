import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Anchor,
  Axe,
  Battery,
  Bed,
  Blocks,
  Bone,
  Bomb,
  Box,
  Cable,
  Castle,
  Check,
  CircleDot,
  CircuitBoard,
  ClipboardList,
  Container,
  Copy,
  Crosshair,
  DoorOpen,
  Factory,
  Flame,
  FlaskConical,
  Fuel,
  Gem,
  Hammer,
  HardHat,
  HeartPulse,
  Home,
  KeyRound,
  Landmark,
  LockKeyhole,
  MapPin,
  Mountain,
  Package,
  Pickaxe,
  Pill,
  Plane,
  Recycle,
  Rocket,
  ScanEye,
  Shirt,
  Shield,
  Ship,
  Skull,
  Sprout,
  Star,
  Sun,
  Swords,
  Target,
  TowerControl,
  TreePine,
  Truck,
  Vault,
  Wheat,
  Wrench,
  Zap,
} from "lucide-react";
import type { ItemData } from "../data/items";

type ItemCardProps = {
  item: ItemData;
  isFavorite: boolean;
  copied: boolean;
  onToggleFavorite: (id: string) => void;
  onCopySlang: (item: ItemData) => void;
};

const iconMap: Record<string, LucideIcon> = {
  scrap: CircleDot,
  stone: Mountain,
  wood: TreePine,
  metal: Box,
  hqm: Gem,
  sulfur: Flame,
  charcoal: Flame,
  cloth: Package,
  fuel: Fuel,
  armor: Shield,
  helmet: HardHat,
  rifle: Target,
  smg: Crosshair,
  pistol: Crosshair,
  bow: Target,
  shotgun: Crosshair,
  raid: Zap,
  ammo: CircleDot,
  base: Home,
  workbench: Hammer,
  furnace: Factory,
  bed: Bed,
  door: DoorOpen,
  lock: LockKeyhole,
  key: KeyRound,
  monument: Landmark,
  recycler: Recycle,
  component: Wrench,
  medicine: HeartPulse,
  electric: Zap,
  powder: FlaskConical,
  ore: Pickaxe,
  bone: Bone,
  barrel: Fuel,
  keycard: ClipboardList,
  blueprint: Blocks,
  hammerTool: Hammer,
  repair: Wrench,
  research: ScanEye,
  mixing: FlaskConical,
  refinery: Factory,
  storage: Container,
  locker: Vault,
  vending: Package,
  turret: TowerControl,
  trap: Skull,
  sam: Target,
  wire: Cable,
  battery: Battery,
  sniper: Target,
  lmg: Swords,
  grenade: Bomb,
  fire: Flame,
  rocket: Rocket,
  clothing: Shirt,
  ladder: Axe,
  hatch: DoorOpen,
  window: Castle,
  oilrig: Anchor,
  ship: Ship,
  tank: Shield,
  helicopter: Plane,
  horse: Truck,
  food: Wheat,
  farming: Sprout,
  survival: Sun,
  pill: Pill,
};

export function ItemCard({ item, isFavorite, copied, onToggleFavorite, onCopySlang }: ItemCardProps) {
  const Icon = iconMap[item.iconType] ?? Package;
  const mainSlang = item.slang.slice(0, 3).join(", ");

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-lg border border-white/10 bg-rust-panel/80 p-5 shadow-rust"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rust-amber/50 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="item-icon">
            <Icon size={24} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black text-white">{item.nameEn}</h3>
              {item.tags.includes("важно") && <span className="badge badge-amber">важно</span>}
              {item.tags.includes("новичку") && <span className="badge badge-green">новичку</span>}
            </div>
            <p className="mt-1 text-sm font-semibold text-rust-amber">{item.nameRu}</p>
            <p className="mt-2 text-sm text-rust-metal">
              Сленг: <span className="text-white">{mainSlang}</span>
            </p>
          </div>
        </div>

        <button
          aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
          className={`icon-button ${isFavorite ? "icon-button-active" : ""}`}
          onClick={() => onToggleFavorite(item.id)}
        >
          <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="mt-5 text-sm leading-6 text-rust-metal">{item.description}</p>

      <div className="mt-5 grid gap-3 text-sm">
        <InfoLine title="Где найти" value={item.whereToFind} />
        <InfoLine title="Зачем нужен" value={item.usedFor} />
        <InfoLine title="Совет" value={item.beginnerTip} important />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div className="flex flex-wrap gap-2">
          <span className="badge">{item.category}</span>
          {item.tags
            .filter((tag) => tag !== "новичку" && tag !== "важно")
            .slice(0, 3)
            .map((tag) => (
              <span key={tag} className="badge badge-muted">
                {tag}
              </span>
            ))}
        </div>
        <button className="copy-button" onClick={() => onCopySlang(item)}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Скопировано" : "Сленг"}
        </button>
      </div>
    </motion.article>
  );
}

function InfoLine({ title, value, important = false }: { title: string; value: string; important?: boolean }) {
  return (
    <div className={`rounded-md border p-3 ${important ? "border-rust-green/20 bg-rust-green/10" : "border-white/10 bg-black/20"}`}>
      <div className="mb-1 text-[11px] font-black uppercase tracking-[0.18em] text-rust-metal">{title}</div>
      <div className="leading-6 text-white/80">{value}</div>
    </div>
  );
}
