import { BookOpen, Github, Hammer, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/35">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md border border-rust-amber/35 bg-rust-amber/10 font-black text-rust-amber">
              R
            </div>
            <div>
              <div className="font-black uppercase tracking-[0.18em] text-white">RustLex Codex</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-rust-metal">survival knowledge base</div>
            </div>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-rust-metal">
            Неофициальный русский справочник по Rust для новичков и обычных игроков. Без платных ассетов,
            без лишней официальщины, с нормальными человеческими объяснениями.
          </p>
        </div>

        <div>
          <div className="footer-title">Разделы</div>
          <div className="mt-4 grid gap-3 text-sm text-rust-metal">
            <a className="footer-link" href="#dictionary"><BookOpen size={15} />Словарь</a>
            <a className="footer-link" href="#crafts"><Hammer size={15} />Крафты</a>
            <a className="footer-link" href="#faq"><Shield size={15} />FAQ</a>
          </div>
        </div>

        <div>
          <div className="footer-title">Деплой</div>
          <div className="mt-4 rounded-md border border-white/10 bg-white/[0.035] p-4 text-sm leading-7 text-rust-metal">
            Готово для Netlify: `npm run build`, публикация из `dist`, SPA redirect уже в `netlify.toml`.
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-rust-metal">
            <Github size={15} />
            static vite app
          </div>
        </div>
      </div>
    </footer>
  );
}
