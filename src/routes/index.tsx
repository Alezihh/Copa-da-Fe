import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ShieldCheck,
  Zap,
  Heart,
  Star,
  Check,
  BookOpen,
  Sparkles,
  Lock,
  Crown,
  Cross,
  Flame,
  User,
  Shield,
  ScrollText,
  Trophy,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import heroAlbum from "@/assets/copa-da-fe-nobg.png";
import childAlbum from "@/assets/familia-album.png";
import albumPages from "@/assets/album-open.jpg";
import rarityCards from "@/assets/rarity-cards.jpg";

import figJesus       from "@/assets/figurinhas/fig_jesus.png";
import figAdao        from "@/assets/figurinhas/fig_adao.png";
import figNoe         from "@/assets/figurinhas/fig_noe.png";
import figAbraao      from "@/assets/figurinhas/fig_abraao.png";
import figMoises      from "@/assets/figurinhas/fig_moises.png";
import figDavi        from "@/assets/figurinhas/fig_davi.png";
import figJoaoBatista from "@/assets/figurinhas/fig_joao_batista.png";
import figJoao        from "@/assets/figurinhas/fig_joao.png";
import figJudas       from "@/assets/figurinhas/fig_judas.png";

import photoMariana  from "@/assets/depoimentos/mariana.jpg";
import photoRoberto  from "@/assets/depoimentos/roberto.jpg";
import photoCleide   from "@/assets/depoimentos/cleide.jpg";
import photoPatricia from "@/assets/depoimentos/patricia.jpg";

export const Route = createFileRoute("/")({
  component: SalesPage,
});

/* ---------------- Primitives ---------------- */

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} transition={{ delay }} className={className}>
      {children}
    </motion.div>
  );
}

function Counter({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      setVal(Math.floor(p * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{val.toLocaleString("pt-BR")}{suffix}</span>;
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] ${light ? "text-gold" : "text-navy-deep/70"}`}>
      <span className={`h-px w-8 ${light ? "bg-gold" : "bg-navy-deep/40"}`} />
      {children}
    </div>
  );
}

function SectionNumber({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-navy-deep/60">
      <span className="font-display text-2xl font-light text-gold">{n}</span>
      <span className="h-px w-12 bg-navy-deep/30" />
      <span>{label}</span>
    </div>
  );
}

/* ---------------- Countdown Timer ---------------- */

const COUNTDOWN_KEY = "copa_fe_deadline";
const DURATION_MS   = 24 * 60 * 60 * 1000; // 24 horas

function getDeadline(): number {
  if (typeof window === "undefined") return Date.now() + DURATION_MS;
  const stored = localStorage.getItem(COUNTDOWN_KEY);
  if (stored) {
    const ts = parseInt(stored, 10);
    if (ts > Date.now()) return ts;
  }
  const deadline = Date.now() + DURATION_MS;
  localStorage.setItem(COUNTDOWN_KEY, String(deadline));
  return deadline;
}

function CountdownTimer() {
  const [deadline]  = useState<number>(() => getDeadline());
  const [timeLeft, setTimeLeft] = useState(Math.max(0, deadline - Date.now()));
  const isUrgent = timeLeft < 60 * 60 * 1000; // < 1 hora

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(Math.max(0, deadline - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const h  = String(Math.floor(timeLeft / 3_600_000)).padStart(2, "0");
  const m  = String(Math.floor((timeLeft % 3_600_000) / 60_000)).padStart(2, "0");
  const s  = String(Math.floor((timeLeft % 60_000) / 1_000)).padStart(2, "0");

  const ringColor = isUrgent
    ? "border-red-500/70 shadow-[0_0_18px_oklch(0.63_0.26_25/0.45)]"
    : "border-gold/60  shadow-[0_0_18px_oklch(0.82_0.17_74/0.30)]";

  return (
    <div className={`inline-flex flex-col items-center gap-2 rounded-2xl border-2 px-5 py-3 backdrop-blur-sm bg-white/70 transition-all duration-700 ${ringColor}`}>
      {/* Label */}
      <div className="flex items-center gap-2">
        <Zap className={`h-3.5 w-3.5 ${isUrgent ? "text-red-500" : "text-gold"}`} />
        <span className={`text-[11px] font-bold uppercase tracking-[0.22em] ${isUrgent ? "text-red-600" : "text-navy-deep/70"}`}>
          {isUrgent ? "Últimas horas — oferta expira em:" : "Oferta por tempo limitado — expira em:"}
        </span>
      </div>
      {/* Dígitos */}
      <div className="flex items-center gap-1.5">
        {[h, m, s].map((val, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className={`min-w-[2.4rem] rounded-lg px-2 py-1 text-center font-display text-2xl font-bold tabular-nums leading-none ${isUrgent ? "bg-red-50 text-red-600" : "bg-navy-deep/8 text-navy-deep"}`}>
              {val}
            </span>
            {i < 2 && <span className={`text-xl font-bold ${isUrgent ? "text-red-400" : "text-gold"}`}>:</span>}
          </span>
        ))}
      </div>
      {/* Sub-labels */}
      <div className="flex gap-6 text-[9px] font-semibold uppercase tracking-widest text-navy-deep/40">
        <span className="min-w-[2.4rem] text-center">Horas</span>
        <span className="min-w-[2.4rem] text-center">Min</span>
        <span className="min-w-[2.4rem] text-center">Seg</span>
      </div>
    </div>
  );
}

function PrimaryCTA({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <a
      href="#oferta"
      className={`group relative inline-flex items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-wider text-navy-deep shadow-gold transition-all duration-300 hover:brightness-105 hover:shadow-[0_24px_60px_-12px_oklch(0.78_0.14_80/0.6)] ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
    </a>
  );
}

function TrustRow({ light = false }: { light?: boolean }) {
  const cls = light ? "text-white/70" : "text-navy-deep/60";
  const icon = light ? "text-gold" : "text-gold";
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-xs font-semibold uppercase tracking-wider ${cls}`}>
      <span className="inline-flex items-center gap-2"><Lock className={`h-3.5 w-3.5 ${icon}`} /> Compra Segura</span>
      <span className={`h-3 w-px ${light ? "bg-white/20" : "bg-navy-deep/20"}`} />
      <span className="inline-flex items-center gap-2"><Zap className={`h-3.5 w-3.5 ${icon}`} /> Acesso Imediato</span>
      <span className={`h-3 w-px ${light ? "bg-white/20" : "bg-navy-deep/20"}`} />
      <span className="inline-flex items-center gap-2"><Heart className={`h-3.5 w-3.5 ${icon}`} /> Garantia 7 Dias</span>
    </div>
  );
}

function GoldRule() {
  return <div className="mx-auto h-px w-16 bg-gold" />;
}

/* ---------------- Top Bar ---------------- */

function TopBar() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="container mx-auto flex max-w-6xl items-center justify-between px-6 py-5 rounded-b-2xl bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-navy-deep">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 bg-cream">
            <Cross className="h-4 w-4 text-gold" />
          </div>
          <span>A Copa da Fé</span>
        </div>
        <a href="#oferta" className="hidden text-xs font-semibold uppercase tracking-wider text-navy-deep transition-colors hover:text-gold sm:inline-flex">
          Garantir álbum →
        </a>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36" style={{ background: "var(--gradient-hero)" }}>
      <TopBar />

      <div className="container relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          {/* Left: copy */}
          <div className="relative">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-navy-deep/15 bg-white/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-deep backdrop-blur-sm">
                <span className="flex h-1.5 w-1.5 rounded-full bg-gold" />
                Mais de milhares de famílias impactadas
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-7 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-navy-deep sm:text-6xl lg:text-[4.2rem]">
                A Copa da Fé
              </h1>
              <p className="mt-4 font-display text-xl font-medium leading-snug text-navy-deep/80 sm:text-2xl lg:text-[1.75rem]">
                Transforme o Tempo de Tela em<br className="hidden sm:block" />
                <em className="text-gold">Tempo com Deus.</em>
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-navy-deep/70">
                Mais de 100 figurinhas dos grandes heróis da Bíblia para imprimir, colecionar e fortalecer a fé em família.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-7">
                <CountdownTimer />
              </div>
            </Reveal>

            <Reveal delay={0.30}>
              <div className="mt-7 flex flex-col items-start gap-5">
                <PrimaryCTA>Quero começar minha coleção</PrimaryCTA>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wider text-navy-deep/60">
                  <span className="inline-flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-gold" /> Compra Segura</span>
                  <span className="inline-flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-gold" /> Acesso Imediato</span>
                  <span className="inline-flex items-center gap-2"><Heart className="h-3.5 w-3.5 text-gold" /> Garantia 7 Dias</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: image */}
          <Reveal delay={0.2}>
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-gold/25 via-purple-elegant/15 to-transparent blur-3xl" />
              <div className="absolute -top-4 -left-4 h-20 w-20 rounded-full bg-purple-elegant/20 blur-xl" />
              <motion.img
                src={heroAlbum}
                alt="Álbum A Copa da Fé com figurinhas dos heróis bíblicos"
                width={1536}
                height={1152}
                className="relative w-full rounded-2xl shadow-premium animate-float"
                initial={{ opacity: 0, scale: 0.96, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.1, delay: 0.3, ease }}
              />

              {/* Selo dourado — flutua junto com a imagem */}
              <motion.div
                className="absolute -bottom-8 -right-4 z-20 animate-float select-none"
                style={{ animationDelay: "0.5s" }}
                initial={{ opacity: 0, scale: 0.7, rotate: 12 }}
                animate={{ opacity: 1, scale: 1, rotate: 6 }}
                transition={{ duration: 0.9, delay: 0.8, ease }}
              >
                {/* Glow externo */}
                <div className="absolute inset-0 rounded-full blur-xl opacity-70"
                  style={{ background: "radial-gradient(circle, #FFD700 0%, #B8860B 70%, transparent 100%)" }} />

                {/* Corpo do selo */}
                <div className="relative h-36 w-36 rounded-full flex flex-col items-center justify-center overflow-visible"
                  style={{
                    background: "radial-gradient(circle at 38% 32%, #FFE94D, #D4900A 55%, #8B5A00 100%)",
                    boxShadow: "0 4px 24px rgba(180,120,0,0.55), inset 0 2px 6px rgba(255,255,200,0.35), inset 0 -3px 6px rgba(80,40,0,0.3)",
                  }}
                >
                  {/* Anel interno */}
                  <div className="absolute inset-2 rounded-full border-2 border-yellow-200/50 pointer-events-none" />
                  <div className="absolute inset-4 rounded-full border border-yellow-100/25 pointer-events-none" />

                  {/* Coroa */}
                  <div className="absolute -top-4 text-2xl drop-shadow-md leading-none">👑</div>

                  {/* Estrelas */}
                  <div className="mt-4 flex gap-0.5 text-yellow-200 text-[9px]">
                    {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                  </div>

                  {/* 100+ */}
                  <div className="font-sans text-[2rem] font-black leading-none text-white"
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.4)" }}>
                    100+
                  </div>

                  {/* Figurinhas para colecionar */}
                  <div className="text-center text-[8px] font-bold uppercase leading-tight text-yellow-100 px-3"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.35)" }}>
                    Figurinhas<br />para colecionar
                  </div>

                  {/* Faixa roxa — EXCLUSIVAS */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[115%]">
                    <div className="relative flex items-center justify-center py-1 px-2"
                      style={{
                        background: "linear-gradient(135deg, #5B21B6, #7C3AED)",
                        clipPath: "polygon(4% 0%, 96% 0%, 100% 50%, 96% 100%, 4% 100%, 0% 50%)",
                        boxShadow: "0 3px 8px rgba(0,0,0,0.35)",
                      }}>
                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white"
                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
                        Exclusivas
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>

        {/* Sub copy below hero */}
        <Reveal delay={0.35}>
          <div className="mt-20 grid gap-8 border-t border-navy-deep/10 pt-12 md:grid-cols-3">
            {[
              "Seu filho não vai apenas completar figurinhas. Ele vai conhecer homens e mulheres que mudaram a história através da fé, coragem, obediência e amor a Deus.",
              "Cada página concluída é uma nova descoberta. Cada personagem traz uma lição.",
              "Cada figurinha aproxima sua família da Palavra.",
            ].map((t, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-navy-deep/70">
                <span className="mb-3 block font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold">0{i + 1}</span>
                {t}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */

function Stats() {
  const stats = [
    { value: 100, suffix: "+", label: "Figurinhas Exclusivas" },
    { value: 8, suffix: "", label: "Categorias Bíblicas" },
    { value: 20, suffix: "+", label: "Personagens Históricos" },
    { value: 0, suffix: "∞", label: "Aprendizados para a Vida", isInfinity: true },
  ];
  return (
    <section className="border-y border-navy-deep/10 bg-white py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-y-10 divide-navy-deep/10 sm:grid-cols-4 sm:divide-x">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.08} className="px-4 text-center">
              <div className="font-display text-5xl font-light text-gold sm:text-6xl">
                {s.isInfinity ? "∞" : <><Counter to={s.value} />{s.suffix}</>}
              </div>
              <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-deep/60">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- What is it ---------------- */

function WhatIsIt() {
  const cards = [
    { icon: Trophy, title: "Personagens Bíblicos", text: "Conheça heróis que marcaram a história da fé." },
    { icon: BookOpen, title: "Valores Importantes", text: "Cada personagem transmite um ensinamento especial." },
    { icon: User, title: "Experiência em Família", text: "Momentos únicos de aprendizado entre pais e filhos." },
    { icon: Sparkles, title: "Coleção Inesquecível", text: "Diversão, educação e fé em um único lugar." },
  ];
  return (
    <section className="py-28">
      <div className="container mx-auto max-w-6xl px-6">
        <Reveal className="max-w-3xl">
          <SectionNumber n="01" label="O Álbum" />
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-deep sm:text-5xl">
            Uma coleção que ensina <em className="text-gold">valores para a vida inteira.</em>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-deep/70">
            A Copa da Fé é um álbum colecionável inspirado nos tradicionais álbuns da Copa do Mundo.
            Mas, em vez de jogadores de futebol, as crianças colecionam personagens bíblicos que marcaram
            gerações. Uma forma divertida e envolvente de despertar o interesse pela Bíblia desde cedo.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-navy-deep/10 bg-navy-deep/10 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="group relative h-full bg-cream p-8 transition-all duration-500 hover:bg-white">
                <div className="flex items-center justify-between">
                  <c.icon className="h-7 w-7 text-gold transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
                  <span className="font-display text-xs text-navy-deep/30">0{i + 1}</span>
                </div>
                <h3 className="mt-10 font-display text-xl font-semibold text-navy-deep">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-deep/65">{c.text}</p>
                <span className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Transformation ---------------- */

function Transformation() {
  const items = [
    { icon: Heart, title: "Constrói valores", text: "Cada lição é uma semente de caráter." },
    { icon: BookOpen, title: "Incentiva a leitura bíblica", text: "A curiosidade desperta o hábito da Palavra." },
    { icon: Sparkles, title: "Fortalece a fé", text: "Histórias reais que sustentam a esperança." },
  ];
  return (
    <section className="bg-[oklch(0.96_0.018_85)] py-28">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-purple-elegant/20 to-gold/10 blur-2xl" />
              <img
                src={childAlbum}
                alt="Criança feliz folheando o álbum A Seleção da Bíblia"
                loading="lazy"
                width={1024}
                height={1280}
                className="w-full rounded-2xl shadow-premium"
              />
              <div className="absolute -bottom-6 left-6 right-6 rounded-xl border border-navy-deep/10 bg-white/95 p-4 backdrop-blur-sm shadow-card-premium sm:left-auto sm:right-6 sm:max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-navy-deep to-purple-elegant" />
                    ))}
                  </div>
                  <p className="text-xs leading-tight text-navy-deep/70">
                    <span className="font-bold text-navy-deep">Milhares</span> de famílias colecionando juntas
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <SectionNumber n="02" label="A Transformação" />
              <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-deep sm:text-5xl">
                Cada figurinha representa <em className="text-gold">muito mais</em> do que um personagem.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-navy-deep/70">
                Ela representa uma história. Uma lição. Um exemplo. Uma oportunidade para ensinar
                princípios cristãos de maneira leve e divertida.
              </p>
            </Reveal>

            <div className="mt-10 space-y-3">
              {items.map((it, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="group flex items-start gap-5 border-b border-navy-deep/10 py-5">
                    <it.icon className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-navy-deep">{it.title}</h3>
                      <p className="mt-1 text-sm text-navy-deep/65">{it.text}</p>
                    </div>
                    <span className="font-display text-xs text-navy-deep/30">0{i + 1}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Team ---------------- */

function Team() {
  const categories = [
    { icon: Crown, name: "Reis" },
    { icon: Cross, name: "Apóstolos" },
    { icon: Flame, name: "Profetas" },
    { icon: User, name: "Mulheres da Bíblia" },
    { icon: Shield, name: "Heróis da Fé" },
    { icon: ScrollText, name: "Antigo Testamento" },
    { icon: Sparkles, name: "Novo Testamento" },
    { icon: Trophy, name: "Figurinhas Especiais" },
  ];
  return (
    <section className="py-28">
      <div className="container mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <SectionNumber n="03" label="O Time dos Campeões" />
          </div>
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-deep sm:text-5xl">
            Conheça os <em className="text-gold">Grandes Craques</em> da Bíblia
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-navy-deep/70">
            Os personagens mais importantes das Escrituras reunidos em uma coleção única.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="group relative aspect-square overflow-hidden rounded-xl border border-navy-deep/10 bg-cream transition-all duration-500 hover:border-gold/60 hover:bg-white">
                <div className="flex h-full flex-col items-center justify-center gap-4 p-5 text-center">
                  <c.icon className="h-7 w-7 text-navy-deep transition-all duration-500 group-hover:scale-110 group-hover:text-gold" strokeWidth={1.4} />
                  <div className="font-display text-sm font-semibold text-navy-deep">{c.name}</div>
                </div>
                <span className="absolute left-3 top-3 font-display text-[10px] uppercase tracking-wider text-navy-deep/30">0{i + 1}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-20">
          <figure>
            <img
              src={albumPages}
              alt="Páginas internas do álbum com figurinhas de personagens bíblicos"
              loading="lazy"
              width={1536}
              height={1024}
              className="w-full rounded-2xl shadow-premium"
            />
            <figcaption className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-navy-deep/50">
              Páginas internas — Edição completa
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Figurinha Carousel ---------------- */

const TOP_FIGURINHAS = [
  { img: figJesus,       num: "#01", name: "Jesus",        category: "Messias",     desc: "O Filho de Deus",                    special: true  },
  { img: figDavi,        num: "#27", name: "Davi",         category: "Reis",        desc: "Homem segundo o coração de Deus",    special: false },
  { img: figMoises,      num: "#17", name: "Moisés",       category: "Líderes",     desc: "Libertador de Israel",               special: false },
  { img: figAdao,        num: "#02", name: "Adão",         category: "Patriarcas",  desc: "O Primeiro Homem",                   special: false },
  { img: figNoe,         num: "#07", name: "Noé",          category: "Patriarcas",  desc: "Construtor da Arca",                 special: false },
  { img: figAbraao,      num: "#09", name: "Abraão",       category: "Patriarcas",  desc: "Pai das Nações",                     special: false },
  { img: figJoaoBatista, num: "#53", name: "João Batista", category: "Precursores", desc: "O Precursor do Messias",             special: false },
  { img: figJoao,        num: "#58", name: "João",         category: "Apóstolos",   desc: "O Discípulo Amado",                  special: false },
  { img: figJudas,       num: "#66", name: "Judas",        category: "Apóstolos",   desc: "O Traidor",                         special: false },
];

const CARD_W = 192; // px — largura fixa de cada card
const CARD_H = 266; // px — altura fixa (proporção ~370×514 das figurinhas reais)

function FigurinhaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
    containScroll: false,
  });

  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => emblaApi.scrollNext(), 2500);
    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Prev */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute -left-5 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-navy-deep/15 bg-white shadow-md transition hover:bg-gold hover:text-white hover:border-gold"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Viewport */}
      <div className="overflow-hidden py-4" ref={emblaRef}>
        <div className="flex items-center gap-5">
          {TOP_FIGURINHAS.map((fig) => (
            <motion.div
              key={fig.name}
              className="relative cursor-pointer select-none flex-shrink-0"
              style={{ width: CARD_W }}
              whileHover={{ scale: 1.07, y: -8 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              {fig.special && (
                <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-b from-gold/50 to-transparent blur-xl" />
              )}
              {/* Imagem com tamanho fixo e object-cover */}
              <div
                className={`overflow-hidden rounded-2xl shadow-lg ring-1 ${fig.special ? "ring-gold/60" : "ring-navy-deep/10"}`}
                style={{ width: CARD_W, height: CARD_H }}
              >
                <img
                  src={fig.img}
                  alt={`Figurinha ${fig.name}`}
                  className="w-full h-full object-cover object-center"
                  draggable={false}
                />
              </div>
              {/* Label */}
              <div className="mt-2.5 text-center" style={{ width: CARD_W }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-navy-deep/45 leading-none">{fig.category}</p>
                <p className="mt-0.5 text-sm font-bold text-navy-deep leading-tight">{fig.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next */}
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute -right-5 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-navy-deep/15 bg-white shadow-md transition hover:bg-gold hover:text-white hover:border-gold"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ---------------- Rarity ---------------- */

function Rarity() {
  const tiers = [
    { dot: "bg-emerald-500", name: "Comum", text: "A base da coleção." },
    { dot: "bg-blue-500", name: "Rara", text: "Personagens marcantes." },
    { dot: "bg-purple-500", name: "Épica", text: "Histórias inesquecíveis." },
    { dot: "bg-gold", name: "Lendária", text: "Verdadeiros tesouros." },
  ];
  return (
    <section className="relative overflow-hidden bg-[oklch(0.97_0.02_85)] py-28">
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(ellipse at 20% 0%, oklch(0.52 0.20 290 / 0.15), transparent 50%), radial-gradient(ellipse at 80% 100%, oklch(0.78 0.14 80 / 0.15), transparent 50%)" }} />
      <div className="container relative mx-auto max-w-6xl px-6">
        <Reveal className="max-w-3xl">
          <SectionNumber n="04" label="Figurinhas Especiais" />
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-deep sm:text-5xl">
            Nem todas as figurinhas <em className="text-gold">são iguais.</em>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-navy-deep/65">
            Algumas são comuns. Outras são especiais. E algumas se tornam verdadeiros tesouros dentro da coleção.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-14">
          <FigurinhaCarousel />
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-4">
          {tiers.map((t, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-navy-deep/10 bg-white p-6 shadow-sm transition-all hover:shadow-card-premium">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${t.dot}`} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-navy-deep/50">Nível 0{i + 1}</span>
                </div>
                <div className="mt-5 font-display text-2xl font-semibold text-navy-deep">{t.name}</div>
                <p className="mt-2 text-sm text-navy-deep/60">{t.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */

function Testimonials() {
  const items = [
    { photo: photoMariana,  name: "Mariana S.",      role: "Mãe de 2 — São Paulo",            text: "Meu filho de 7 anos pede para abrir o álbum todos os dias antes de dormir. Já aprendeu mais sobre a Bíblia em um mês do que em um ano de escola dominical." },
    { photo: photoRoberto,  name: "Roberto e Júlia", role: "Família — Curitiba",               text: "Virou nosso momento sagrado em família. Os meninos disputam quem cola a próxima figurinha. Investimento que vale ouro." },
    { photo: photoCleide,   name: "Dona Cleide",     role: "Avó de 4 netos",                   text: "Comprei para todos os meus netos. Não tem preço ver as crianças querendo conhecer Davi, Moisés e Ester por vontade própria." },
    { photo: photoPatricia, name: "Patrícia M.",     role: "Mãe cristã — Belo Horizonte",      text: "A criatividade é incrível. Meu filho de 9 anos largou o tablet para colecionar figurinhas dos heróis da fé. Recomendo de olhos fechados." },
  ];
  return (
    <section className="bg-cream py-28">
      <div className="container mx-auto max-w-6xl px-6">
        <Reveal className="max-w-3xl">
          <SectionNumber n="05" label="Prova Social" />
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-deep sm:text-5xl">
            Famílias que estão <em className="text-gold">vivendo essa experiência.</em>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {items.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <figure className="h-full rounded-2xl border border-navy-deep/10 bg-white p-8 transition-all hover:border-gold/40 hover:shadow-card-premium">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gold">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                  </div>
                  <span className="font-display text-xs text-navy-deep/30">0{i + 1}</span>
                </div>
                <blockquote className="mt-6 font-display text-lg leading-relaxed text-navy-deep">
                  "{t.text}"
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4 border-t border-navy-deep/10 pt-5">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover object-center ring-2 ring-gold/30 shrink-0"
                  />
                  <div>
                    <div className="font-semibold text-navy-deep">{t.name}</div>
                    <div className="text-xs uppercase tracking-wider text-navy-deep/50">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- What you get ---------------- */

function WhatYouGet() {
  const items = [
    "Álbum completo para impressão",
    "Mais de 100 figurinhas",
    "Categorias exclusivas",
    "Certificado Campeão da Fé",
    "Quiz Bíblico Infantil",
    "Desafios Bíblicos em Família",
    "Atualizações futuras",
  ];
  return (
    <section className="py-28">
      <div className="container mx-auto max-w-5xl px-6">
        <Reveal className="text-center">
          <div className="flex justify-center"><SectionNumber n="06" label="O Que Você Recebe" /></div>
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-deep sm:text-5xl">
            Tudo o que está <em className="text-gold">incluso.</em>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-navy-deep/10 bg-navy-deep/10 sm:grid-cols-2">
            {items.map((it, i) => (
              <li key={i} className="flex items-center gap-4 bg-cream px-6 py-5 transition-colors hover:bg-white">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold bg-cream">
                  <Check className="h-3.5 w-3.5 text-gold" strokeWidth={3} />
                </div>
                <span className="font-medium text-navy-deep">{it}</span>
                <span className="ml-auto font-display text-xs text-navy-deep/30">0{i + 1}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Emotional ---------------- */

function Emotional() {
  return (
    <section className="relative overflow-hidden py-32 text-cream">
      <div className="absolute inset-0 bg-gradient-premium" />
      <div className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(ellipse at 50% 30%, oklch(0.78 0.14 80 / 0.3), transparent 60%)" }} />
      <div className="container relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <Eyebrow light>Missão</Eyebrow>
          <h2 className="mt-8 font-display text-5xl font-light italic tracking-tight text-gold sm:text-7xl">
            Missão Cumprida.
          </h2>
          <div className="mt-10"><GoldRule /></div>
          <p className="mt-10 text-xl leading-relaxed text-cream/85">
            Ao completar sua coleção, seu filho terá conhecido dezenas de histórias bíblicas, aprendido
            princípios importantes e criado memórias que permanecerão por toda a vida.
          </p>
          <p className="mt-10 font-display text-2xl leading-relaxed text-cream sm:text-3xl">
            Porque a maior vitória não é levantar uma taça.
          </p>
          <p className="mt-2 font-display text-2xl italic leading-relaxed text-gold sm:text-3xl">
            É crescer conhecendo a Deus.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Offer ---------------- */

function Offer() {
  const basic = [
    "Álbum completo para impressão",
    "50 figurinhas dos Patriarcas e Líderes",
    "Acesso imediato em PDF",
  ];
  const premium = [
    "Álbum completo para impressão",
    "Mais de 100 figurinhas exclusivas",
    "Todas as 8 categorias bíblicas",
    "Certificado Campeão da Fé",
    "Quiz Bíblico Infantil",
    "Desafios Bíblicos em Família",
    "Atualizações futuras grátis",
  ];

  return (
    <section id="oferta" className="bg-cream py-28">
      <div className="container mx-auto max-w-5xl px-6">
        <Reveal className="text-center">
          <SectionNumber n="07" label="A Oferta" />
          <h2 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight text-navy-deep sm:text-5xl">
            Escolha o seu <em className="text-gold">plano</em>
          </h2>
          <p className="mt-3 text-navy-deep/60">Acesso imediato após a confirmação do pagamento</p>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2 items-start">

          {/* ---- Plano Básico R$19,90 ---- */}
          <Reveal delay={0.05}>
            <div className="overflow-hidden rounded-3xl border border-navy-deep/15 bg-white shadow-md">
              <div className="bg-navy-deep/8 px-8 py-5 border-b border-navy-deep/10">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-navy-deep/50">Plano Essencial</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-navy-deep">A Copa da Fé · Básico</h3>
              </div>
              <div className="p-8">
                <ul className="space-y-3">
                  {basic.map((it, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-4 w-4 shrink-0 text-purple-elegant" strokeWidth={3} />
                      <span className="text-sm font-medium text-navy-deep">{it}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-2xl bg-navy-deep/5 p-6 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy-deep/45">De <span className="line-through">R$ 49,90</span> por</p>
                  <div className="mt-2 flex items-start justify-center gap-1">
                    <span className="mt-2 font-display text-xl font-semibold text-navy-deep">R$</span>
                    <span className="font-display text-6xl font-semibold leading-none text-navy-deep">19</span>
                    <span className="mt-2 font-display text-2xl font-semibold text-navy-deep">,90</span>
                  </div>
                  <p className="mt-1 text-xs text-navy-deep/45">pagamento único</p>
                </div>
                <a
                  href="#oferta"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border-2 border-navy-deep py-3.5 text-sm font-bold uppercase tracking-wider text-navy-deep transition hover:bg-navy-deep hover:text-cream"
                >
                  Quero o Básico
                </a>
              </div>
            </div>
          </Reveal>

          {/* ---- Plano Premium R$39,90 ---- */}
          <Reveal delay={0.12}>
            <div className="relative overflow-hidden rounded-3xl border-2 border-gold bg-white animate-glow-border">
              {/* Badge "Mais Popular" */}
              <div className="absolute right-5 top-5 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-deep shadow-gold">
                  <Sparkles className="h-3 w-3" /> Mais Popular
                </span>
              </div>

              {/* Header dourado */}
              <div className="bg-gradient-to-r from-navy-deep to-purple-elegant px-8 py-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">Plano Completo</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-cream">A Copa da Fé · Premium</h3>
              </div>

              <div className="p-8">
                <ul className="space-y-3">
                  {premium.map((it, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15">
                        <Check className="h-3 w-3 text-gold" strokeWidth={3.5} />
                      </div>
                      <span className="text-sm font-medium text-navy-deep">{it}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-2xl bg-gradient-to-br from-gold/10 to-purple-elegant/10 p-6 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy-deep/50">De <span className="line-through">R$ 89,90</span> por apenas</p>
                  <div className="mt-2 flex items-start justify-center gap-1">
                    <span className="mt-2 font-display text-xl font-semibold text-navy-deep">R$</span>
                    <span className="font-display text-6xl font-semibold leading-none text-navy-deep">39</span>
                    <span className="mt-2 font-display text-2xl font-semibold text-navy-deep">,90</span>
                  </div>
                  <p className="mt-1 text-xs text-navy-deep/50">ou 3× de R$ 13,30 sem juros</p>
                </div>
                <PrimaryCTA className="mt-6 w-full">Quero o Completo</PrimaryCTA>
                <div className="mt-5">
                  <TrustRow />
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

/* ---------------- Guarantee ---------------- */

function Guarantee() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-4xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-navy-deep/10 bg-white p-8 sm:p-12">
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, var(--navy-deep), transparent 60%)" }} />
            <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-cream">
                <ShieldCheck className="h-9 w-9 text-gold" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <Eyebrow>Garantia</Eyebrow>
                <h3 className="mt-3 font-display text-2xl font-semibold text-navy-deep sm:text-3xl">
                  Garantia Incondicional de 7 Dias
                </h3>
                <p className="mt-3 leading-relaxed text-navy-deep/70">
                  Você pode testar todo o conteúdo sem riscos. Se sentir que o álbum não agregou valor à
                  vida do seu filho, devolvemos 100% do seu investimento. Sem burocracia. Sem perguntas.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

function FAQ() {
  const qs = [
    { q: "O álbum é físico ou digital?", a: "O álbum é 100% digital. Você recebe o material em PDF de alta qualidade, pronto para imprimir em casa ou em qualquer gráfica." },
    { q: "Como recebo o material?", a: "Imediatamente após a confirmação do pagamento, você recebe o acesso por e-mail com todos os arquivos para download." },
    { q: "Posso imprimir quantas vezes quiser?", a: "Sim! O acesso é para uso da sua família. Pode imprimir quantas vezes precisar, para quantos filhos e netos quiser." },
    { q: "Qual a idade recomendada?", a: "Indicado a partir dos 4 anos, com supervisão dos pais. Crianças de 6 a 12 anos costumam aproveitar o máximo da experiência." },
    { q: "Preciso comprar figurinhas separadamente?", a: "Não. Todas as 100+ figurinhas já estão inclusas no material para você imprimir e colar." },
    { q: "Posso acessar pelo celular?", a: "Sim, o acesso funciona em qualquer dispositivo: celular, tablet, computador." },
    { q: "O acesso é vitalício?", a: "Sim. Pagamento único, acesso para sempre, incluindo atualizações futuras." },
  ];
  return (
    <section className="bg-cream py-28">
      <div className="container mx-auto max-w-3xl px-6">
        <Reveal>
          <SectionNumber n="08" label="FAQ" />
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-deep sm:text-5xl">
            Perguntas frequentes.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Accordion type="single" collapsible className="border-t border-navy-deep/10">
            {qs.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-navy-deep/10">
                <AccordionTrigger className="py-6 text-left font-display text-lg font-semibold text-navy-deep hover:no-underline [&[data-state=open]]:text-gold">
                  <span className="flex items-center gap-5">
                    <span className="font-display text-xs font-normal text-navy-deep/40">0{i + 1}</span>
                    {item.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pl-10 text-base leading-relaxed text-navy-deep/70">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32 text-cream">
      <div className="absolute inset-0 bg-gradient-premium" />
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 30% 30%, oklch(0.78 0.14 80 / 0.25), transparent 50%), radial-gradient(ellipse at 70% 70%, oklch(0.42 0.15 300 / 0.4), transparent 50%)" }} />
      <div className="container relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <Eyebrow light>Último Chamado</Eyebrow>
          <h2 className="mt-8 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Seu filho vai se lembrar das figurinhas.
            <br />
            <em className="text-gold">Mas, principalmente, das lições que aprendeu com elas.</em>
          </h2>
          <div className="mt-10"><div className="mx-auto h-px w-16 bg-gold/60" /></div>
          <div className="mx-auto mt-10 max-w-2xl space-y-3 text-lg leading-relaxed text-cream/80">
            <p>Você não está comprando apenas um álbum.</p>
            <p>Está criando momentos. Fortalecendo valores. Ensinando princípios.</p>
            <p className="font-semibold text-cream">Plantando sementes que podem acompanhar seu filho para o resto da vida.</p>
          </div>
          <div className="mt-12">
            <a
              href="#oferta"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold px-10 py-5 text-sm font-bold uppercase tracking-wider text-navy-deep shadow-gold transition-all duration-300 hover:bg-cream"
            >
              Quero completar a Copa da Fé
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="bg-navy-deep py-20 text-cream/80">
      <div className="container mx-auto max-w-4xl px-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/60">
          <Cross className="h-5 w-5 text-gold" />
        </div>
        <blockquote className="mx-auto mt-8 max-w-2xl font-display text-2xl italic leading-relaxed text-cream sm:text-3xl">
          "Ensina a criança no caminho em que deve andar, e mesmo quando for velho não se desviará dele."
        </blockquote>
        <cite className="mt-5 block text-xs font-semibold uppercase tracking-[0.28em] not-italic text-gold">
          Provérbios 22:6
        </cite>

        <div className="mx-auto mt-14 h-px max-w-xs bg-cream/10" />

        <div className="mt-8 flex flex-col items-center gap-2 text-xs text-cream/50">
          <div className="font-display text-base text-cream/80">A Copa da Fé</div>
          <div>© {new Date().getFullYear()} Todos os direitos reservados.</div>
          <div className="mt-2 text-cream/30">Este produto não é afiliado a nenhuma federação esportiva.</div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Page ---------------- */

function SalesPage() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <Stats />
      <WhatIsIt />
      <Transformation />
      <Team />
      <Rarity />
      <Testimonials />
      <WhatYouGet />
      <Emotional />
      <Offer />
      <Guarantee />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
