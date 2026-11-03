import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { architectureLayers } from "@/data";
import { ArchitectureScene } from "@/scenes/ArchitectureScene";
import { ContinuumGlyph } from "@/components/DliMark";
import { Reveal, SectionHeading } from "@/components/Motion";

export function Architecture() {
  const [active, setActive] = useState(0);
  const layer = architectureLayers[active];
  const discuss = () => window.dispatchEvent(new CustomEvent("dli:add-capability", { detail: "Systems integration" }));
  return (
    <section id="architecture" data-nav-theme="dark" className="relative overflow-hidden bg-[#081729] py-24 text-[#f5f6f8] sm:py-32">
      <div className="architecture-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-16">
        <Reveal><SectionHeading dark eyebrow="Inside intelligence" title="Many moving parts. One intelligent system." body="The most valuable AI isn't isolated in a chatbot. It is connected to the right information, tools, decisions and safeguards. We engineer those connections around the way your organization actually works." className="max-w-4xl" /></Reveal>
        <div className="mt-14 grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
          <Reveal direction="left" className="relative z-10">
            <div role="tablist" aria-label="Intelligence architecture layers" className="flex overflow-x-auto border-y border-white/15 lg:flex-col lg:overflow-visible lg:border-y-0">
              {architectureLayers.map((item, index) => {
                const Icon = item.icon;
                return <button key={item.id} type="button" role="tab" id={`layer-tab-${item.id}`} aria-selected={active === index} aria-controls="architecture-panel" onClick={() => setActive(index)} className={`group flex min-h-16 min-w-[220px] items-center gap-4 border-white/15 px-4 text-left transition-colors lg:min-w-0 lg:border-b lg:px-0 ${active === index ? "bg-white/5 text-[#f5f6f8] lg:bg-transparent" : "text-[#8fa3b7] hover:text-white"}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-colors ${active === index ? "border-[#65d8f4]/60 bg-[#65d8f4]/10 text-[#65d8f4]" : "border-white/15"}`}><Icon size={17} /></span><span className="text-sm font-semibold">{item.label}</span><span className={`ml-auto hidden h-1.5 w-1.5 rounded-full bg-[#65d8f4] lg:block ${active === index ? "opacity-100" : "opacity-0"}`} /></button>;
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={layer.id} id="architecture-panel" role="tabpanel" aria-labelledby={`layer-tab-${layer.id}`} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 10, opacity: 0 }} transition={{ duration: 0.24 }} className="mt-8">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8ddff1]">{layer.signal}</p>
                <h3 className="mt-4 text-2xl font-medium tracking-[-0.04em]">{layer.title}</h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#b7c4d4]">{layer.text}</p>
              </motion.div>
            </AnimatePresence>
            <a href="#start-deployment" onClick={discuss} className="group mt-8 inline-flex min-h-12 items-center gap-4 border border-white/20 px-5 text-sm font-semibold transition-colors hover:border-[#65d8f4]/50 hover:bg-white/5">Discuss your architecture <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></a>
          </Reveal>
          <Reveal direction="right" className="relative min-h-[430px] overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_center,rgba(20,56,86,.58),rgba(8,23,41,.2)_68%)] sm:min-h-[540px]">
            <ArchitectureScene mode={active} />
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#081729]/45 backdrop-blur-sm"><ContinuumGlyph className="h-16 w-16" /></div>
            <div className="pointer-events-none absolute left-5 top-5 font-mono text-[8px] uppercase tracking-[0.22em] text-[#8fa3b7]">Reference architecture · {String(active + 1).padStart(2, "0")}</div>
            <div className="pointer-events-none absolute bottom-5 right-5 border border-white/10 bg-[#081729]/60 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.16em] text-[#8ddff1] backdrop-blur-md">{layer.signal}</div>
          </Reveal>
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-[#8fa3b7]">A reference architecture demonstrating DLI’s methods, not evidence of a generally available proprietary software platform.</p>
      </div>
    </section>
  );
}
