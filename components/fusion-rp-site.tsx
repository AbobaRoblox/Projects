'use client';

import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, CircleHelp, Disc3, HeartHandshake, MessageSquare, Play, Shield, Users, Youtube } from 'lucide-react';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const sections = ['About', 'Features', 'Rules', 'Guides', 'FAQ', 'Community', 'Support'];

export default function FusionRPSite() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.fade-up', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.content-shell', start: 'top 80%' } });
      gsap.to('.orb', { x: 'random(-120,120)', y: 'random(-90,90)', repeat: -1, yoyo: true, duration: 8, ease: 'sine.inOut', stagger: 1.1 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden bg-[#08030f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,83,255,0.25),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(92,56,255,0.26),transparent_38%),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:cover,cover,48px_48px,48px_48px]" />
      <div className="orb absolute left-16 top-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="orb absolute right-8 top-56 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-black tracking-[0.22em]">FUSION RP</h1>
          <div className="hidden gap-5 text-sm md:flex">{sections.map((item) => <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-fuchsia-300">{item}</a>)}</div>
        </nav>
      </header>

      <main className="content-shell mx-auto max-w-6xl px-4 pb-20 pt-16">
        <section className="fade-up text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-fuchsia-300">Roblox Roleplay Project</p>
          <h2 className="mt-4 text-6xl font-black tracking-[0.16em] md:text-8xl">FUSION RP</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/75 md:text-lg">Step into a living futuristic city where every choice shapes your story. Fusion RP blends cinematic worldbuilding, deep jobs, and a community-first experience.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['Start Playing', 'Discord Server', 'Forum'].map((btn) => <a key={btn} href="#" className="rounded-full border border-fuchsia-300/60 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold shadow-[0_0_32px_rgba(187,80,255,0.45)] transition hover:scale-105">{btn}</a>)}
          </div>
        </section>

        <section className="fade-up mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ['Players', '12,400+'], ['Locations', '38'], ['Jobs', '24'], ['Vehicles', '150+'],
          ].map(([k, v]) => (
            <motion.div key={k} whileHover={{ y: -8 }} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl shadow-[0_15px_40px_rgba(118,50,225,0.35)]">
              <p className="text-sm text-white/60">{k}</p><p className="mt-2 text-2xl font-bold">{v}</p>
            </motion.div>
          ))}
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-2">
          {sections.map((section, i) => {
            const Icon = [Play, Disc3, Shield, BookOpen, CircleHelp, Users, HeartHandshake][i];
            return (
              <article id={section.toLowerCase()} key={section} className="fade-up group rounded-2xl border border-violet-300/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-xl transition hover:border-fuchsia-300/60 hover:shadow-[0_0_35px_rgba(209,88,255,0.35)]">
                <h3 className="text-2xl font-bold">{section}</h3>
                <p className="mt-3 text-white/70">Premium roleplay resources, curated content and smooth onboarding tools designed to keep every player engaged.</p>
                <div className="mt-4 text-fuchsia-300"><Icon size={20} /></div>
              </article>
            );
          })}
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/40 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-4">
          {[['Discord', Disc3], ['YouTube', Youtube], ['Roblox', Play], ['Forum', MessageSquare]].map(([label, Icon]) => {
            const FooterIcon = Icon as typeof Disc3;
            return (
              <a key={label as string} href="#" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 transition hover:border-fuchsia-300 hover:text-fuchsia-200">
                <FooterIcon size={16} /> {label as string}
              </a>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
