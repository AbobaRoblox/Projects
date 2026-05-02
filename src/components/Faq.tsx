import { motion } from "framer-motion";
import { BadgeHelp } from "lucide-react";

const faqItems = [
  {
    question: "Что такое т/с в Rust?",
    answer: "Т/с или TC - это Tool Cupboard, шкаф с инструментами. Он даёт привилегию строительства и хранит ресурсы на содержание базы. Если враг забрал шкаф, база становится намного уязвимее.",
  },
  {
    question: "Что такое хазик?",
    answer: "Хазик - Hazmat Suit, жёлтый костюм химзащиты. Его любят за защиту от радиации и простой полный комплект брони без подбора шлема, штанов и куртки.",
  },
  {
    question: "Что такое скрап?",
    answer: "Скрап - главная валюта прогресса. За него изучают чертежи, делают верстаки и покупают полезные вещи в безопасных зонах.",
  },
  {
    question: "Что сначала крафтить новичку?",
    answer: "Обычно: каменные инструменты, спальник, лук со стрелами, маленькую базу, шкаф, дверь с замком, потом печку и верстак 1 уровня.",
  },
  {
    question: "Где найти компоненты?",
    answer: "Компоненты падают из бочек и ящиков у дорог, на монументах и в подземных тоннелях. Ненужное можно переработать в ресайклере на скрап и ресурсы.",
  },
  {
    question: "Как сделать первую базу?",
    answer: "Самый простой вариант - 2x1: две клетки, шкаф, дверь, шлюз и ящики. Сначала закрываешься, потом апаешь стены в камень и ставишь железную дверь.",
  },
  {
    question: "Что такое шлюз?",
    answer: "Шлюз - маленький вход с двумя дверями. Если ты открыл внешнюю дверь, враг всё равно не попадает сразу к луту и шкафу.",
  },
  {
    question: "Что такое вайп?",
    answer: "Вайп - сброс сервера. Обычно пропадают базы, лут и прогресс карты, а игроки начинают заново. На старте вайпа особенно много драки за ресурсы.",
  },
  {
    question: "Что такое ресайклер?",
    answer: "Ресайклер - станок на монументах и в безопасных зонах. Он разбирает компоненты и предметы на скрап, металл, ткань и другие ресурсы.",
  },
  {
    question: "Что такое сачель и сишка?",
    answer: "Сачель - ранний самодельный заряд для рейдов, дешевле и капризнее. Сишка - C4, дорогая точечная взрывчатка для серьёзного пробоя.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="section-kicker">FAQ</div>
          <h2 className="section-title">Вопросы, которые лучше закрыть до первого рейда</h2>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {faqItems.map((item, index) => (
          <motion.details
            key={item.question}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.03 }}
            className="faq-card group"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 text-base font-black text-white">
              <span className="grid h-9 w-9 place-items-center rounded-md border border-rust-amber/25 bg-rust-amber/10 text-rust-amber">
                <BadgeHelp size={18} />
              </span>
              {item.question}
            </summary>
            <p className="mt-4 pl-12 text-sm leading-7 text-rust-metal">{item.answer}</p>
          </motion.details>
        ))}
      </div>
    </section>
  );
}
