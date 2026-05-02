import { motion } from "framer-motion";

type CategoryTabsProps = {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
};

export function CategoryTabs({ categories, selectedCategory, onSelect }: CategoryTabsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="scrollbar-soft flex gap-2 overflow-x-auto rounded-lg border border-white/10 bg-white/[0.025] p-2">
        {categories.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`relative shrink-0 rounded-md px-4 py-2.5 text-sm font-bold transition ${
                active ? "text-black" : "text-rust-metal hover:bg-white/10 hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="category-active"
                  className="absolute inset-0 rounded-md bg-rust-amber"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <span className="relative">{category}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
