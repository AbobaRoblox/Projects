import { BookOpen, Compass, Hammer, Languages, Shield } from "lucide-react";

type HeaderProps = {
  favoritesCount: number;
};

export function Header({ favoritesCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-rust-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="group flex items-center gap-3">
          <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-md border border-rust-amber/40 bg-gradient-to-br from-rust-panel2 to-black shadow-ember">
            <div className="absolute inset-0 metal-stripes opacity-40" />
            <span className="relative text-xl font-black tracking-[0.08em] text-rust-amber">R</span>
          </div>
          <div className="leading-none">
            <div className="text-sm font-black uppercase tracking-[0.2em] text-white sm:text-base">RustLex Codex</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-rust-metal">сленг, крафты, выживание</div>
          </div>
        </a>

        <nav className="hidden items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] p-1 lg:flex">
          <a className="nav-chip" href="#slang">
            <Languages size={15} />
            Сленг
          </a>
          <a className="nav-chip" href="#dictionary">
            <BookOpen size={15} />
            Словарь
          </a>
          <a className="nav-chip" href="#crafts">
            <Hammer size={15} />
            Крафты
          </a>
          <a className="nav-chip" href="#faq">
            <Compass size={15} />
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-rust-metal">
          <Shield size={15} className="text-rust-green" />
          <span className="hidden sm:inline">Избранное:</span>
          <span className="font-bold text-white">{favoritesCount}</span>
        </div>
      </div>
    </header>
  );
}
