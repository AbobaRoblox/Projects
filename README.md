# RustLex Codex

Премиальный статический сайт-гайд по Rust на русском языке: сленг игроков, предметы, крафты для новичков, поиск, фильтры и избранное.

## Стек

- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Статический билд для Netlify

## Что внутри

- Большой словарь предметов, монументов, транспорта, ресурсов, рейдовых вещей и Rust-сленга
- Расширенная база крафтов для старта, базы, PvP, рейдов, электрики, ловушек и фермерства
- Индекс сленговых слов с быстрым поиском и копированием
- Избранное через `localStorage`
- Закреплённый поиск, категории, популярные запросы и адаптивная тёмная тема

## Запуск локально

```bash
npm install
npm run dev
```

После запуска Vite покажет локальный адрес, обычно `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Деплой на Netlify

Проект уже содержит `netlify.toml`.

- Build command: `npm run build`
- Publish directory: `dist`

Можно загрузить репозиторий на Netlify как обычный Vite-проект. SPA fallback уже настроен через redirect на `index.html`.
