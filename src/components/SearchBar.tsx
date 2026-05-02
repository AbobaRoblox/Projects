import { motion } from "framer-motion";
import { Hammer, PackageSearch, Search, X } from "lucide-react";

type SearchBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number;
  view: "items" | "crafts";
  onViewChange: (view: "items" | "crafts") => void;
  popularQueries: string[];
  onPopularClick: (query: string) => void;
};

export function SearchBar({
  query,
  onQueryChange,
  resultCount,
  view,
  onViewChange,
  popularQueries,
  onPopularClick,
}: SearchBarProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
      className="sticky top-[73px] z-30 mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="rounded-lg border border-white/10 bg-rust-panel/90 p-3 shadow-rust backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rust-amber" size={20} />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Поиск: хазик, т/с, сера, гаражка, ревик..."
              className="h-14 w-full rounded-md border border-white/10 bg-black/40 pl-12 pr-12 text-base text-white outline-none transition focus:border-rust-amber/60 focus:ring-2 focus:ring-rust-amber/20"
            />
            {query && (
              <button
                aria-label="Очистить поиск"
                className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-rust-metal transition hover:bg-white/10 hover:text-white"
                onClick={() => onQueryChange("")}
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 rounded-md border border-white/10 bg-black/30 p-1">
            <button
              className={`view-toggle ${view === "items" ? "view-toggle-active" : ""}`}
              onClick={() => onViewChange("items")}
            >
              <PackageSearch size={17} />
              Предметы
            </button>
            <button
              className={`view-toggle ${view === "crafts" ? "view-toggle-active" : ""}`}
              onClick={() => onViewChange("crafts")}
            >
              <Hammer size={17} />
              Крафты
            </button>
          </div>

          <div className="rounded-md border border-rust-green/25 bg-rust-green/10 px-4 py-3 text-sm text-rust-metal">
            Найдено: <span className="font-black text-white">{resultCount}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
          <span className="text-xs uppercase tracking-[0.18em] text-rust-metal">популярные запросы</span>
          {popularQueries.map((item) => (
            <button key={item} className="query-pill" onClick={() => onPopularClick(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
