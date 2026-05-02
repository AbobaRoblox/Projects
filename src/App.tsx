import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Clipboard,
  Compass,
  Flame,
  Hammer,
  Languages,
  PackageSearch,
  ShieldAlert,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryTabs } from "./components/CategoryTabs";
import { CraftCard } from "./components/CraftCard";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ItemCard } from "./components/ItemCard";
import { SearchBar } from "./components/SearchBar";
import { craftData } from "./data/crafts";
import type { CraftData } from "./data/crafts";
import { extraCraftData } from "./data/extraCrafts";
import { extraItemsData } from "./data/extraItems";
import { itemsData } from "./data/items";
import type { ItemData } from "./data/items";

const allItems = [
  ...itemsData,
  ...extraItemsData.filter((extraItem) => !itemsData.some((item) => item.id === extraItem.id)),
];

const allCrafts = [
  ...craftData,
  ...extraCraftData.filter((extraCraft) => !craftData.some((craft) => craft.id === extraCraft.id)),
];

const categories = [
  "Все",
  "Ресурсы",
  "Оружие",
  "Боеприпасы",
  "Броня",
  "Инструменты",
  "Строительство",
  "Электрика",
  "Двери и замки",
  "Ловушки",
  "Рейды",
  "Медицина",
  "Компоненты",
  "Монументы",
  "Транспорт",
  "Еда",
  "Фермерство",
  "Сленг",
  "Крафты",
];

const popularQueries = [
  "хазик",
  "т/с",
  "сера",
  "гаражка",
  "ревик",
  "скрап",
  "сачель",
  "сишка",
  "турка",
  "ойл",
  "карго",
  "бредли",
];

const firstCraftIds = [
  "building-plan",
  "hammer-tool",
  "stone-hatchet",
  "stone-pickaxe",
  "sleeping-bag",
  "tool-cupboard",
  "wooden-door",
  "furnace",
];

const craftTabs = [
  { id: "all", label: "Все", hint: "полная база" },
  { id: "start", label: "Старт", hint: "первые минуты" },
  { id: "base", label: "База", hint: "дом, двери, хранение" },
  { id: "weapons", label: "Оружие", hint: "пушки и патроны" },
  { id: "raid", label: "Рейды", hint: "взрывчатка и пробив" },
  { id: "armor", label: "Броня + медицина", hint: "выжить в драке" },
  { id: "electric", label: "Электрика", hint: "турели и питание" },
  { id: "utility", label: "Утилити", hint: "инструменты, еда, ферма" },
] as const;

type CraftTabId = (typeof craftTabs)[number]["id"];

const craftItemIdMap: Record<string, string> = {
  "double-barrel": "db-shotgun",
  buckshot: "shotgun-shell",
  "campfire-more": "campfire",
  "furnace-large": "large-furnace",
  refinery: "small-oil-refinery",
  "bolt-action": "bolt-action-rifle",
  "metal-chest": "metal-chest-plate",
  "coffee-can": "coffee-can-helmet",
  "hv-556": "556-ammo",
  "incendiary-556": "556-ammo",
  "roadsign-jacket": "roadsign-kit",
  "roadsign-kilt": "roadsign-kit",
  "furnace-electric": "furnace",
  "wooden-ladder": "ladder",
};

function normalize(value: string) {
  return value.toLowerCase().replaceAll("ё", "е").trim();
}

function findItemByNameOrSlang(value: string) {
  const needle = normalize(value);
  return allItems.find((item) => {
    const names = [item.id, item.nameEn, item.nameRu, ...item.slang].map(normalize);
    return names.some((name) => name === needle || name.includes(needle) || needle.includes(name));
  });
}

function getRelatedCraftItem(craft: CraftData) {
  const mappedId = craftItemIdMap[craft.id];
  return (
    allItems.find((item) => item.id === mappedId || item.id === craft.id) ??
    findItemByNameOrSlang(craft.name)
  );
}

function craftMatchesTab(craft: CraftData, tab: CraftTabId) {
  if (tab === "all") return true;
  if (tab === "start") {
    return (
      firstCraftIds.includes(craft.id) ||
      craft.priority.includes("сразу") ||
      craft.priority.includes("после базы") ||
      craft.priority.includes("после печки")
    );
  }
  if (tab === "base") {
    return ["Строительство", "Двери и замки", "Ловушки"].includes(craft.category);
  }
  if (tab === "weapons") {
    return ["Оружие", "Боеприпасы"].includes(craft.category);
  }
  if (tab === "raid") {
    return craft.category === "Рейды";
  }
  if (tab === "armor") {
    return ["Броня", "Медицина"].includes(craft.category);
  }
  if (tab === "electric") {
    return craft.category === "Электрика";
  }
  return ["Инструменты", "Еда", "Фермерство"].includes(craft.category);
}

function itemMatchesQuery(item: ItemData, query: string) {
  const q = normalize(query);
  if (!q) return true;
  const haystack = [
    item.nameEn,
    item.nameRu,
    item.category,
    item.description,
    item.whereToFind,
    item.usedFor,
    item.beginnerTip,
    ...item.slang,
    ...item.tags,
  ]
    .map(normalize)
    .join(" ");
  return haystack.includes(q);
}

function craftMatchesQuery(craft: CraftData, query: string) {
  const q = normalize(query);
  if (!q) return true;
  const relatedItem = getRelatedCraftItem(craft);
  const relatedResources = craft.resources
    .map((resource) => findItemByNameOrSlang(resource.name))
    .filter(Boolean) as ItemData[];
  const haystack = [
    craft.name,
    craft.category,
    craft.workbench,
    craft.priority,
    craft.difficulty,
    craft.description,
    craft.beginnerTip,
    ...craft.resources.map((resource) => resource.name),
    ...(relatedItem
      ? [
          relatedItem.nameEn,
          relatedItem.nameRu,
          relatedItem.category,
          relatedItem.description,
          relatedItem.whereToFind,
          relatedItem.usedFor,
          relatedItem.beginnerTip,
          ...relatedItem.slang,
          ...relatedItem.tags,
        ]
      : []),
    ...relatedResources.flatMap((item) => [item.nameEn, item.nameRu, ...item.slang, ...item.tags]),
  ]
    .map(normalize)
    .join(" ");
  return haystack.includes(q);
}

function App() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [view, setView] = useState<"items" | "crafts">("items");
  const [craftTab, setCraftTab] = useState<CraftTabId>("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [slangCopied, setSlangCopied] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("rustlex:favorites");
    if (stored) {
      setFavoriteIds(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("rustlex:favorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const slangWords = useMemo(() => {
    return Array.from(new Set(allItems.flatMap((item) => item.slang))).sort((a, b) =>
      a.localeCompare(b, "ru"),
    );
  }, []);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const categoryMatch =
        selectedCategory === "Все" ||
        item.category === selectedCategory ||
        (selectedCategory === "Сленг" && item.tags.includes("сленг"));
      return categoryMatch && itemMatchesQuery(item, query);
    });
  }, [query, selectedCategory]);

  const filteredCrafts = useMemo(() => {
    return allCrafts.filter((craft) => {
      const categoryMatch =
        selectedCategory === "Все" ||
        selectedCategory === "Крафты" ||
        craft.category === selectedCategory;
      return categoryMatch && craftMatchesQuery(craft, query);
    });
  }, [query, selectedCategory]);

  const visibleCrafts = useMemo(() => {
    return filteredCrafts.filter((craft) => craftMatchesTab(craft, craftTab));
  }, [filteredCrafts, craftTab]);

  const activeResultCount = view === "items" ? filteredItems.length : visibleCrafts.length;
  const firstCrafts = firstCraftIds
    .map((id) => allCrafts.find((craft) => craft.id === id))
    .filter(Boolean) as CraftData[];
  const favoriteItems = allItems.filter((item) => favoriteIds.includes(item.id));

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category === "Крафты") {
      setView("crafts");
      setCraftTab("all");
    }
    if (category !== "Крафты" && view === "crafts" && !allCrafts.some((craft) => craft.category === category)) {
      setView("items");
    }
  };

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const copySlang = async (item: ItemData) => {
    const value = `${item.nameEn} - ${item.slang.join(", ")}`;
    await navigator.clipboard.writeText(value);
    setCopiedItemId(item.id);
    window.setTimeout(() => setCopiedItemId(null), 1500);
  };

  const copyAllSlang = async () => {
    await navigator.clipboard.writeText(slangWords.join(", "));
    setSlangCopied(true);
    window.setTimeout(() => setSlangCopied(false), 1600);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-rust-black text-white">
      <div className="fixed inset-0 pointer-events-none noise-layer" />
      <Header favoritesCount={favoriteIds.length} />
      <main>
        <Hero onDictionaryClick={() => scrollTo("dictionary")} onCraftsClick={() => scrollTo("crafts")} />

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          resultCount={activeResultCount}
          view={view}
          onViewChange={(nextView) => {
            setView(nextView);
            setSelectedCategory(nextView === "crafts" ? "Крафты" : "Все");
            if (nextView === "crafts") setCraftTab("all");
          }}
          popularQueries={popularQueries}
          onPopularClick={(value) => {
            setQuery(value);
            setView("items");
            setSelectedCategory("Все");
          }}
        />

        <CategoryTabs categories={categories} selectedCategory={selectedCategory} onSelect={handleCategorySelect} />

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-3 md:grid-cols-4">
            <StatCard icon={BookOpen} label="предметов и терминов" value={allItems.length} />
            <StatCard icon={Hammer} label="крафтов в базе" value={allCrafts.length} />
            <StatCard icon={Languages} label="сленговых слов" value={slangWords.length} />
            <StatCard icon={Compass} label="категорий" value={categories.length - 1} />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-lg border border-white/10 bg-rust-panel/70 p-5 shadow-rust"
            >
              <div className="section-kicker">популярный сленг</div>
              <h2 className="mt-2 text-2xl font-black text-white">Быстрые переводы, которые реально спрашивают</h2>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {[
                  ["хазик", "Hazmat Suit, костюм для радиации и фарма"],
                  ["т/с", "Tool Cupboard, главный шкаф базы"],
                  ["гаражка", "Garage Door, сильная внутренняя дверь"],
                  ["сишка", "C4, дорогая точечная взрывчатка"],
                  ["турка", "Auto Turret, электрическая защита базы"],
                  ["ойл", "Oil Rig, морской монумент с жирным лутом"],
                  ["карго", "Cargo Ship, движущийся морской ивент"],
                  ["бредли", "Bradley APC, танк на космодроме"],
                ].map(([term, text]) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      setView("items");
                      setSelectedCategory("Все");
                    }}
                    className="group rounded-md border border-white/10 bg-black/20 p-4 text-left transition hover:border-rust-amber/40 hover:bg-rust-amber/10"
                  >
                    <div className="text-lg font-black text-rust-amber">{term}</div>
                    <div className="mt-1 text-sm leading-6 text-rust-metal group-hover:text-white/80">{text}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="rounded-lg border border-rust-green/20 bg-rust-green/10 p-5 shadow-rust"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-md border border-rust-green/25 bg-rust-green/10 text-rust-green">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <div className="section-kicker">подсказка новичку</div>
                  <h2 className="text-2xl font-black text-white">Порядок важнее скорости</h2>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-rust-metal">
                В Rust можно быстро нафармить ресурсы и так же быстро потерять всё у двери. Надёжный старт:
                план, молоток, спальник, закрытая база, шкаф, шлюз, печка, железная дверь, потом верстак и оружие.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {["план", "молоток", "спальник", "шкаф", "шлюз", "печка"].map((item) => (
                  <button key={item} className="query-pill justify-center" onClick={() => setQuery(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="slang" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-white/10 bg-black/25 p-5 shadow-rust">
            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <div className="section-kicker">индекс сленга</div>
                <h2 className="section-title">Все сленговые слова из базы</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-rust-metal">
                  Это живой словарь: кликай по слову, чтобы сразу найти предмет или термин. Я включил ходовые
                  русские, англоязычные и смешанные варианты, которые чаще встречаются в голосе, чате и гайдах.
                </p>
              </div>
              <button className="secondary-button w-fit" onClick={copyAllSlang}>
                {slangCopied ? "Скопировано" : "Скопировать индекс"}
                <Clipboard size={18} />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto pr-2 scrollbar-soft">
              <div className="flex flex-wrap gap-2">
                {slangWords.map((word) => (
                  <button
                    key={word}
                    className="query-pill"
                    onClick={() => {
                      setQuery(word);
                      setView("items");
                      setSelectedCategory("Все");
                    }}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {favoriteItems.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center gap-3">
              <Star className="text-rust-amber" size={20} fill="currentColor" />
              <h2 className="text-2xl font-black text-white">Избранное</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {favoriteItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  isFavorite={favoriteIds.includes(item.id)}
                  copied={copiedItemId === item.id}
                  onToggleFavorite={toggleFavorite}
                  onCopySlang={copySlang}
                />
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <div className="section-kicker">первый вайп</div>
              <h2 className="section-title">Что крафтить новичку первым</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-rust-metal">
                Хороший порядок для спокойного старта: сначала инструменты и закрытая база, потом производство,
                потом оружие, медицина и рискованные выходы.
              </p>
            </div>
            <button className="secondary-button w-fit" onClick={() => scrollTo("crafts")}>
              Все крафты
              <Hammer size={18} />
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {firstCrafts.map((craft, index) => (
              <motion.div
                key={craft.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="rounded-lg border border-white/10 bg-black/25 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-md border border-rust-amber/25 bg-rust-amber/10 px-2.5 py-1 text-xs font-black uppercase tracking-[0.16em] text-rust-amber">
                    {index + 1}
                  </span>
                  <span className="text-xs text-rust-metal">{craft.priority}</span>
                </div>
                <h3 className="font-black text-white">{craft.name}</h3>
                <p className="mt-2 text-sm leading-6 text-rust-metal">{craft.beginnerTip}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="dictionary" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <div className="section-kicker">большой словарь</div>
              <h2 className="section-title">Предметы, сленг и смысл простыми словами</h2>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-rust-metal">
              <PackageSearch size={17} className="text-rust-amber" />
              {filteredItems.length} карточек
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {view === "items" && filteredItems.length > 0 ? (
              <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isFavorite={favoriteIds.includes(item.id)}
                    copied={copiedItemId === item.id}
                    onToggleFavorite={toggleFavorite}
                    onCopySlang={copySlang}
                  />
                ))}
              </motion.div>
            ) : view === "items" ? (
              <EmptyState query={query} onReset={() => setQuery("")} />
            ) : null}
          </AnimatePresence>
        </section>

        <section id="crafts" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <div className="section-kicker">крафты</div>
              <h2 className="section-title">Большая база крафтов для старта, базы, PvP и рейдов</h2>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-rust-metal">
              <Hammer size={17} className="text-rust-amber" />
              {visibleCrafts.length} крафтов
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-white/10 bg-black/25 p-2">
            <div className="scrollbar-soft flex gap-2 overflow-x-auto">
              {craftTabs.map((tab) => {
                const active = craftTab === tab.id;
                const count = filteredCrafts.filter((craft) => craftMatchesTab(craft, tab.id)).length;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setCraftTab(tab.id);
                      setView("crafts");
                      if (selectedCategory !== "Крафты" && selectedCategory !== "Все") {
                        setSelectedCategory("Крафты");
                      }
                    }}
                    className={`shrink-0 rounded-md border px-4 py-3 text-left transition ${
                      active
                        ? "border-rust-amber/45 bg-rust-amber text-black shadow-ember"
                        : "border-white/10 bg-white/[0.035] text-rust-metal hover:border-rust-amber/35 hover:bg-rust-amber/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm font-black">
                      {tab.label}
                      <span className={`rounded px-2 py-0.5 text-xs ${active ? "bg-black/15 text-black" : "bg-white/10 text-rust-amber"}`}>
                        {count}
                      </span>
                    </div>
                    <div className={`mt-1 text-xs ${active ? "text-black/65" : "text-rust-metal"}`}>{tab.hint}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {visibleCrafts.length > 0 ? (
              <motion.div layout className="grid gap-4 lg:grid-cols-2">
                {visibleCrafts.map((craft) => (
                  <CraftCard key={craft.id} craft={craft} relatedItem={getRelatedCraftItem(craft)} />
                ))}
              </motion.div>
            ) : (
              <EmptyState query={query} onReset={() => setQuery("")} />
            )}
          </AnimatePresence>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-rust-orange/20 bg-gradient-to-br from-rust-orange/10 to-rust-green/10 p-6 shadow-rust lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <div className="section-kicker">мини-маршрут</div>
                <h2 className="mt-2 text-3xl font-black text-white">Первый час без лишней боли</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["1", "Собери ткань, дерево, камень. Сделай план, молоток, инструменты и спальник."],
                  ["2", "Построй 2x1, поставь шкаф, дверь, замок и шлюз. Апни в камень."],
                  ["3", "Поставь печку, сделай металл, ВБ1, ревик, патроны и минимум медицины."],
                ].map(([step, text]) => (
                  <div key={step} className="rounded-md border border-white/10 bg-black/25 p-4">
                    <div className="mb-3 text-2xl font-black text-rust-amber">{step}</div>
                    <div className="text-sm leading-6 text-rust-metal">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Faq />
      </main>
      <Footer />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-lg border border-white/10 bg-rust-panel/70 p-4 shadow-rust"
    >
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-md border border-rust-amber/25 bg-rust-amber/10 text-rust-amber">
        <Icon size={19} />
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-rust-metal">{label}</div>
    </motion.div>
  );
}

function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-white/10 bg-rust-panel/70 p-10 text-center shadow-rust"
    >
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-md border border-rust-amber/25 bg-rust-amber/10 text-rust-amber">
        <BookOpen size={26} />
      </div>
      <h3 className="mt-5 text-2xl font-black text-white">Ничего не нашлось</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-rust-metal">
        По запросу “{query || "пусто"}” нет совпадений. Попробуй сленг вроде “хазик”, “т/с”, “сера”,
        “гаражка”, “ойл” или сбрось поиск.
      </p>
      <button className="primary-button mx-auto mt-6" onClick={onReset}>
        Сбросить поиск
        <Flame size={18} />
      </button>
    </motion.div>
  );
}

export default App;
