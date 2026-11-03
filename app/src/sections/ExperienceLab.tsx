import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play, X } from "lucide-react";
import { labs } from "@/data";
import { DemoVisual } from "@/components/DemoVisual";
import { ParticleWave } from "@/scenes/ParticleWave";
import { Reveal } from "@/components/Motion";

type Lab = (typeof labs)[number];

export function ExperienceLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Lab | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const waveY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -45, reduce ? 0 : 85]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(labs.length - 1, index));
    const card = track.children[next] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest", inline: "start" });
  };
  const updateActive = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const left = track.scrollLeft;
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => { const delta = Math.abs(card.offsetLeft - track.offsetLeft - left); if (delta < distance) { distance = delta; nearest = index; } });
    setActive(nearest);
  };

  return (
    <section ref={sectionRef} id="experience-lab" data-nav-theme="dark" className="relative min-h-[100dvh] overflow-hidden bg-[#081729] pb-16 pt-28 text-[#f5f6f8] sm:pb-20 sm:pt-32">
      <motion.div style={{ y: waveY }} className="absolute inset-x-0 top-0 h-[68%] lab-wave-mask" aria-hidden="true"><ParticleWave /></motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#081729_0%,rgba(8,23,41,.93)_28%,rgba(8,23,41,.18)_72%,#081729_100%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1600px]">
        <div className="grid gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_.55fr] lg:items-end lg:px-16">
          <Reveal direction="left">
            <p className="eyebrow text-[#8ddff1]">The DLI Experience Lab</p>
            <h2 className="mt-5 max-w-3xl text-[clamp(2.5rem,4.7vw,4.8rem)] font-medium leading-[1.02] tracking-[-0.055em]">Experience intelligence<br className="hidden sm:block" /> in action.</h2>
          </Reveal>
          <Reveal direction="right" delay={0.12}>
            <p className="max-w-xl text-[15px] leading-relaxed text-[#b7c4d4] sm:text-base">Explore interactive examples of conversational AI, digital humans, autonomous workflows and intelligence platforms. Discover what these capabilities could look like inside your organization.</p>
            <a href="#solutions" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#8ddff1] hover:text-white">Skip to solutions <ArrowRight size={15} /></a>
          </Reveal>
        </div>

        <Reveal className="mt-12" delay={0.12}>
          <div
            ref={trackRef}
            className="lab-track flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-5 sm:px-8 lg:px-16"
            role="region"
            aria-label="Experience Lab concepts"
            tabIndex={0}
            onScroll={updateActive}
            onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); } if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); } }}
          >
            {labs.map((lab, index) => {
              const Icon = lab.icon;
              return (
                <article key={lab.id} className={`group w-[82vw] min-w-[280px] max-w-[350px] shrink-0 snap-start border bg-[#091a2d]/90 backdrop-blur-md transition-[border-color,transform] duration-300 hover:-translate-y-1 sm:w-[330px] ${active === index ? "border-[#65d8f4]/45" : "border-white/15 hover:border-white/30"}`}>
                  <div className="relative h-[190px] overflow-hidden sm:h-[205px]">{["athena", "lexi", "agent-desk", "atlas", "gfin"].includes(lab.id) ? <img src={`/assets/lab-${lab.id}.webp`} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.075]" /> : <DemoVisual type={lab.visual} /> }<div className="absolute inset-0 bg-gradient-to-t from-[#091a2d]/30 to-transparent" aria-hidden="true" /><span className="absolute left-4 top-4 border border-white/15 bg-[#081729]/75 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-[#dbe8f3] backdrop-blur-md">{lab.status}</span></div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#8ddff1]"><Icon size={13} />{lab.name}</div>
                    <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.035em]">{lab.category}</h3>
                    <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-[#b7c4d4]">{lab.outcome}</p>
                    <button type="button" onClick={() => setSelected(lab)} className="group/button mt-5 inline-flex min-h-11 items-center gap-3 border border-white/20 px-4 text-[13px] font-semibold transition-colors hover:border-[#65d8f4]/60 hover:bg-white/5" aria-label={`Explore ${lab.name} ${lab.category} concept`}>
                      <Play size={13} fill="currentColor" /> Explore concept <ArrowRight size={14} className="transition-transform group-hover/button:translate-x-1" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-3 flex items-center justify-between px-5 sm:px-8 lg:px-16">
          <div className="flex items-center gap-2" aria-label="Choose an Experience Lab card">
            {labs.map((lab, index) => <button key={lab.id} type="button" onClick={() => goTo(index)} className="flex h-11 w-6 items-center justify-center" aria-label={`Go to ${lab.name}`} aria-current={active === index ? "true" : undefined}><span className={`block h-1.5 rounded-full transition-all ${active === index ? "w-5 bg-[#65d8f4]" : "w-1.5 bg-white/30"}`} /></button>)}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30" aria-label="Previous experience"><ArrowLeft size={17} /></button>
            <button type="button" onClick={() => goTo(active + 1)} disabled={active === labs.length - 1} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30" aria-label="Next experience"><ArrowRight size={17} /></button>
          </div>
        </div>
      </div>

      <Dialog.Root open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay asChild><motion.div className="fixed inset-0 z-50 bg-[#030b14]/80 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /></Dialog.Overlay>
          <Dialog.Content asChild>
            <motion.div className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-32px)] max-w-3xl overflow-y-auto border border-white/15 bg-[#0b1c30] text-[#f5f6f8] shadow-2xl focus:outline-none" style={{ x: "-50%", y: "-50%" }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.22 }}>
              {selected && <>
                <div className="relative h-56 sm:h-64"><DemoVisual type={selected.visual} /><Dialog.Close className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center border border-white/20 bg-[#081729]/75 transition-colors hover:bg-white/10" aria-label="Close experience details"><X size={19} /></Dialog.Close></div>
                <div className="grid gap-8 p-6 sm:p-9 md:grid-cols-[1fr_.8fr]">
                  <div>
                    <p className="eyebrow text-[#8ddff1]">{selected.name} · {selected.status}</p>
                    <Dialog.Title className="mt-4 text-3xl font-medium tracking-[-0.045em] sm:text-4xl">{selected.category}</Dialog.Title>
                    <Dialog.Description className="mt-4 text-[15px] leading-relaxed text-[#b7c4d4]">{selected.description}</Dialog.Description>
                    <h3 className="mt-7 text-sm font-semibold">What you’ll experience</h3>
                    <ul className="mt-3 space-y-2 text-sm text-[#d3deea]">{selected.experiences.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#65d8f4]" />{item}</li>)}</ul>
                  </div>
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div><h3 className="font-semibold text-[#8ddff1]">What is simulated</h3><p className="mt-2 text-[#b7c4d4]">{selected.simulated}</p></div>
                    <div><h3 className="font-semibold text-[#8ddff1]">Where it fits</h3><p className="mt-2 text-[#b7c4d4]">{selected.fits}</p></div>
                    <div><h3 className="font-semibold text-[#8ddff1]">How deployment works</h3><p className="mt-2 text-[#b7c4d4]">Scope the workflow, integrations, permissions and human controls before engineering a production capability.</p></div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 border-t border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-9">
                  <p className="text-xs text-[#8fa3b7]">Concept details are illustrative, not a live system claim.</p>
                  <Dialog.Close asChild><a href="#start-deployment" onClick={() => window.dispatchEvent(new CustomEvent("dli:add-capability", { detail: selected.category }))} className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#f5f6f8] px-5 text-sm font-semibold text-[#0a1424]">Deploy a capability like this <ArrowUpRight size={16} /></a></Dialog.Close>
                </div>
              </>}
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
