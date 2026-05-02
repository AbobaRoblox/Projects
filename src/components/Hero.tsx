import { motion } from "framer-motion";
import { ArrowRight, Gem, Hammer, Shield, Sparkles } from "lucide-react";

type HeroProps = {
  onDictionaryClick: () => void;
  onCraftsClick: () => void;
};

const heroItems = [
  { label: "Scrap", sub: "скрап", icon: Sparkles },
  { label: "Stone", sub: "камень", icon: Gem },
  { label: "Wood", sub: "дерево", icon: Hammer },
  { label: "Hazmat", sub: "хазик", icon: Shield },
  { label: "Sulfur", sub: "сера", icon: Sparkles },
  { label: "Metal", sub: "металл", icon: Gem },
];

export function Hero({ onDictionaryClick, onCraftsClick }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 rust-hero-bg" />
      <div className="absolute inset-0 subtle-grid opacity-60" />
      <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-rust-orange/20 blur-3xl" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-rust-green/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-4 pb-20 pt-20 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-rust-amber/25 bg-rust-amber/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-rust-amber">
            <span className="h-1.5 w-1.5 rounded-full bg-rust-green" />
            база знаний для вайпа
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            Русский Rust-гайд без воды и странных терминов
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-rust-metal sm:text-xl">
            Сленг, предметы, крафты и база знаний для новичков. Разбираем, что такое хазик,
            т/с, сачель, гаражка и почему твой первый шлюз важнее красивого фасада.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button className="primary-button" onClick={onDictionaryClick}>
              Открыть словарь
              <ArrowRight size={18} />
            </button>
            <button className="secondary-button" onClick={onCraftsClick}>
              Крафты для новичка
              <Hammer size={18} />
            </button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 text-xs text-rust-metal sm:grid-cols-6">
            {["поиск", "фильтры", "избранное", "крафты", "FAQ", "Netlify"].map((item) => (
              <div key={item} className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-center uppercase tracking-[0.14em]">
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, rotateX: 12, rotateY: -14, y: 30 }}
          animate={{ opacity: 1, rotateX: 0, rotateY: 0, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="relative hidden lg:block"
        >
          <div className="absolute -inset-10 rounded-full bg-rust-orange/10 blur-3xl" />
          <div className="hero-card relative rotate-2 rounded-lg border border-white/10 bg-rust-panel/90 p-5 shadow-rust backdrop-blur">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-rust-metal">field inventory</div>
                <div className="mt-1 text-xl font-black text-white">starter loadout</div>
              </div>
              <div className="rounded-md border border-rust-green/30 bg-rust-green/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-rust-green">
                online
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {heroItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.06 }}
                    className="group rounded-md border border-white/10 bg-gradient-to-br from-white/[0.07] to-black/30 p-4"
                  >
                    <div className="mb-4 grid h-11 w-11 place-items-center rounded-md border border-rust-amber/25 bg-rust-amber/10 text-rust-amber">
                      <Icon size={22} />
                    </div>
                    <div className="font-bold text-white">{item.label}</div>
                    <div className="mt-1 text-sm text-rust-metal">{item.sub}</div>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-5 rounded-md border border-rust-orange/20 bg-rust-orange/10 p-4 text-sm leading-6 text-rust-metal">
              Вбиваешь “гаражка”, “сера” или “т/с” - получаешь нормальное объяснение, где искать и зачем оно нужно.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
