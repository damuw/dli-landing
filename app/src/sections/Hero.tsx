import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { FlyWords } from "@/components/Motion";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const logoScale = useTransform(scrollYProgress, [0, 0.9], [1, reduce ? 1 : 1.17]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 125]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.88], [1, 0.08]);

  return (
    <section ref={sectionRef} id="top" data-nav-theme="light" className="hero-reference relative isolate overflow-hidden bg-[#f2f0f3] text-[#0a1424]">
      <div className="hero-architecture absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[91dvh] max-w-[1600px] flex-col items-center px-5 pb-12 pt-[105px] sm:px-8 sm:pt-[92px] lg:px-16">
        <motion.div style={{ scale: logoScale, y: logoY, opacity: logoOpacity }} className="hero-continuum-img relative z-[1] mx-auto mt-0 w-[min(77vw,670px)] shrink-0 sm:w-[min(64vw,720px)] lg:mt-0 lg:w-[min(48vw,720px)]" role="img" aria-label="DLI Continuum — a sculptural Möbius-inspired ribbon displaying connected global markets, architecture, data and intelligent systems">
          <img src="/assets/continuum-hero.webp" alt="" fetchPriority="high" decoding="async" className="h-auto w-full select-none" />
          <div className="hero-continuum-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        </motion.div>
        <div className="relative z-10 -mt-3 flex max-w-5xl flex-col items-center text-center sm:-mt-8 lg:-mt-8">
          <p className="font-mono text-[9px] font-medium uppercase tracking-[0.36em] text-[#40536a] sm:text-[10px]">Deep Learning Intelligence</p>
          <h1 className="mt-3 text-[clamp(2.8rem,5.3vw,5.65rem)] font-medium leading-[1.06] tracking-[-0.07em]"><FlyWords text="Intelligence. Deployed." /></h1>
          <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-[#485367] sm:text-[17px]">We engineer, deploy and operate intelligent systems that turn data, technology and operational complexity into real-world outcomes — across markets, industries and organizations.</p>
          <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-[#657085] sm:text-[13px]">Forward-deployed AI engineering · Agentic automation · AI-native product development</p>
          <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <a href="#experience-lab" className="group inline-flex min-h-12 w-full items-center justify-center gap-5 rounded-[9px] bg-[#0a1424] px-7 text-sm font-semibold text-white shadow-lg shadow-[#14233d]/10 transition-transform hover:-translate-y-0.5 sm:w-auto">Explore the Experience Lab <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></a>
            <a href="#start-deployment" className="inline-flex min-h-12 w-full items-center justify-center rounded-[9px] border border-[#0a1424]/30 bg-white/25 px-7 text-sm font-semibold transition-colors hover:bg-white/70 sm:w-auto">Work with DLI</a>
          </div>
        </div>
        <a href="#technology" className="group mt-9 flex flex-col items-center gap-1 sm:mt-10" aria-label="Scroll to technology ecosystems and the Experience Lab"><span className="font-mono text-[8px] uppercase tracking-[0.32em] text-[#64748a]">Scroll to explore</span><ArrowDown size={13} className="text-[#64748a] transition-transform group-hover:translate-y-1" /></a>
      </div>
    </section>
  );
}
