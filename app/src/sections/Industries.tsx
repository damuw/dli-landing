import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { industries } from "@/data";
import { Reveal, SectionHeading } from "@/components/Motion";

export function Industries() {
  const [active, setActive] = useState(0);
  const industry = industries[active];
  const Icon = industry.icon;
  return (
    <section id="industries" data-nav-theme="dark" className="relative overflow-hidden bg-[#081729] py-24 text-[#f5f6f8] sm:py-32">
      <div className="absolute -right-[15%] top-[15%] h-[70%] w-[55%] rounded-full bg-[#3d7df2]/10 blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-16">
        <Reveal><SectionHeading dark eyebrow="Industry intelligence" title="Different environments. Intelligence built for each." body="Good engineering starts with the reality of the industry: its people, workflows, data, risk and operating constraints. Explore how the approach changes across environments." className="max-w-5xl" /></Reveal>
        <div role="tablist" aria-label="Industries" className="mt-12 flex overflow-x-auto border-b border-white/15">
          {industries.map((item, index) => <button key={item.id} type="button" role="tab" id={`industry-tab-${item.id}`} aria-selected={active === index} aria-controls="industry-panel" onClick={() => setActive(index)} className={`relative min-h-14 min-w-max px-5 text-sm font-semibold transition-colors first:pl-0 ${active === index ? "text-[#8ddff1]" : "text-[#8fa3b7] hover:text-white"}`}>{item.label}{active === index && <motion.span layoutId="industry-underline" className="absolute inset-x-0 bottom-0 h-0.5 bg-[#65d8f4]" />}</button>)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={industry.id} id="industry-panel" role="tabpanel" aria-labelledby={`industry-tab-${industry.id}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.26 }} className="grid gap-10 pt-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8ddff1]">{industry.label}</p>
              <h3 className="mt-5 max-w-xl text-[clamp(2.2rem,4.2vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.055em]">{industry.title}</h3>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#b7c4d4]">{industry.text}</p>
              <div className="mt-7 flex flex-wrap gap-2">{industry.examples.map((example) => <span key={example} className="inline-flex min-h-10 items-center gap-2 border border-white/15 px-3 text-xs text-[#d3deea]"><Check size={13} className="text-[#65d8f4]" />{example}</span>)}</div>
              <div className="mt-8 flex max-w-xl gap-3 border-l border-[#65d8f4]/50 pl-4 text-xs leading-relaxed text-[#8fa3b7]"><ShieldCheck size={18} className="shrink-0 text-[#65d8f4]" />{industry.trust}</div>
              <a href="#start-deployment" onClick={() => window.dispatchEvent(new CustomEvent("dli:add-capability", { detail: `${industry.label} AI` }))} className="group mt-8 inline-flex min-h-12 items-center gap-4 bg-[#f5f6f8] px-5 text-sm font-semibold text-[#0a1424]">Explore {industry.label} AI <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></a>
            </div>
            <div className="industry-visual relative min-h-[420px] overflow-hidden border border-white/10 bg-[#0b1c30]">
              <div className="console-grid absolute inset-0 opacity-40" />
              <motion.div key={`${industry.id}-rings`} initial={{ rotate: -12, scale: 0.95 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 0.5 }} className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2">
                {[0, 1, 2].map((ring) => <span key={ring} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#65d8f4]/20" style={{ width: 150 + ring * 80, height: 150 + ring * 80 }} />)}
                <span className="absolute inset-0 animate-[spin_24s_linear_infinite] rounded-full border border-dashed border-[#9a83f7]/35" />
                <span className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#65d8f4]/30 bg-[#102a43]/90 shadow-[0_0_70px_rgba(61,125,242,.25)]"><Icon size={55} strokeWidth={1} className="text-[#8ddff1]" /></span>
                {industry.examples.map((example, index) => { const angle = (index / industry.examples.length) * Math.PI * 2 - Math.PI / 2; return <span key={example} className="absolute flex h-12 w-12 items-center justify-center rounded-full border border-[#65d8f4]/40 bg-[#081729] font-mono text-[9px] text-[#8ddff1]" style={{ left: `calc(50% + ${Math.cos(angle) * 145}px - 24px)`, top: `calc(50% + ${Math.sin(angle) * 145}px - 24px)` }}>0{index + 1}</span>; })}
              </motion.div>
              <p className="absolute bottom-5 left-5 font-mono text-[8px] uppercase tracking-[0.18em] text-[#8fa3b7]">Workflow-centered · Human-controlled</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
