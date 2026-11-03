import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, CircleDot, ShieldCheck } from "lucide-react";
import { missionStages, services } from "@/data";
import { Reveal, SectionHeading } from "@/components/Motion";
import { GovernedDiscovery } from "@/components/GovernedDiscovery";

function selectNeed(need: string) {
  window.dispatchEvent(new CustomEvent("dli:add-capability", { detail: need }));
}

export function Solutions() {
  return (
    <section id="solutions" data-nav-theme="light" className="bg-[#f5f6f8] py-24 text-[#0a1424] sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-16">
        <Reveal><SectionHeading eyebrow="What we engineer" title="Engineered for the real world." body="We don't hand over another slide deck and call it transformation. Our teams work with yours to solve the implementation challenges between a promising idea and an operating system." className="max-w-4xl" /></Reveal>
        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            const primary = index === 0;
            return (
              <Reveal key={service.id} delay={index * 0.06} className={primary ? "lg:col-span-7 lg:row-span-3" : "lg:col-span-5"}>
                <article className={`group flex h-full flex-col p-6 sm:p-8 ${primary ? "min-h-[460px] bg-[#0b1c30] text-[#f5f6f8]" : "min-h-[245px] border border-[#0a1424]/12 bg-[#eef1f5] text-[#0a1424]"}`}>
                  <div className="flex items-center justify-between"><span className={`font-mono text-[9px] uppercase tracking-[0.2em] ${primary ? "text-[#8ddff1]" : "text-[#526278]"}`}>{service.eyebrow}</span><Icon size={26} strokeWidth={1.25} className={primary ? "text-[#65d8f4]" : "text-[#31567c]"} /></div>
                  <h3 className={`mt-10 max-w-xl font-medium leading-[1.06] tracking-[-0.045em] ${primary ? "text-[clamp(2rem,3.5vw,3.8rem)]" : "text-[25px]"}`}>{service.title}</h3>
                  <p className={`mt-5 max-w-xl text-[15px] leading-relaxed ${primary ? "text-[#b7c4d4]" : "text-[#526278]"}`}>{service.text}</p>
                  <div className="mt-auto pt-8">
                    <p className={`text-xs ${primary ? "text-[#8fa3b7]" : "text-[#64748a]"}`}>{service.offer}</p>
                    <a href="#start-deployment" onClick={() => selectNeed(service.need)} className={`group/link mt-5 inline-flex min-h-11 items-center gap-4 text-sm font-semibold ${primary ? "text-[#8ddff1]" : "text-[#0a1424]"}`}>Start a conversation <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" /></a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function MissionControl() {
  const [active, setActive] = useState(0);
  const stage = missionStages[active];
  return (
    <section id="mission-control" data-nav-theme="light" className="bg-[#e9eef4] py-24 text-[#0a1424] sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-16">
        <Reveal><SectionHeading eyebrow="Engineering in motion" title="See how intelligence becomes operational." body="Explore how a complex business challenge moves from initial discovery to an approved, monitored AI capability. Choose a stage to see the people, technology and decisions involved." className="max-w-4xl" /></Reveal>
        <Reveal className="mt-14 border border-[#0a1424]/15 bg-[#f7f9fb] shadow-[0_30px_80px_rgba(19,44,70,.08)]">
          <div className="flex min-h-14 items-center justify-between border-b border-[#0a1424]/12 px-5 sm:px-7">
            <div className="flex items-center gap-3"><CircleDot size={15} className="text-[#3d7df2]" /><span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em]">DLI Mission Control</span></div>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#64748a]">Synthetic walkthrough</span>
          </div>
          <div className="grid lg:grid-cols-[280px_1fr]">
            <div role="tablist" aria-label="Deployment stages" className="flex overflow-x-auto border-b border-[#0a1424]/12 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r">
              {missionStages.map((item, index) => <button key={item.id} type="button" role="tab" id={`mission-tab-${item.id}`} aria-selected={active === index} aria-controls="mission-panel" onClick={() => setActive(index)} className={`flex min-h-16 min-w-[150px] items-center gap-4 border-[#0a1424]/10 px-5 text-left transition-colors lg:min-w-0 lg:border-b ${active === index ? "bg-[#0b1c30] text-white" : "hover:bg-[#e9eef4]"}`}><span className={`font-mono text-[9px] ${active === index ? "text-[#65d8f4]" : "text-[#64748a]"}`}>0{index + 1}</span><span className="text-sm font-semibold">{item.label}</span>{active === index && <ArrowRight size={14} className="ml-auto" />}</button>)}
            </div>
            <div className="p-5 sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                <motion.div key={stage.id} id="mission-panel" role="tabpanel" aria-labelledby={`mission-tab-${stage.id}`} initial={{ x: 18, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -12, opacity: 0 }} transition={{ duration: 0.22 }}>
                  <div className={`grid gap-8 ${active === 0 ? "xl:grid-cols-[.72fr_1.28fr]" : "md:grid-cols-[1fr_.8fr]"}`}>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#3d7df2]">Stage {active + 1} of 5 · {stage.label}</p>
                      <h3 className="mt-4 max-w-xl text-3xl font-medium leading-tight tracking-[-0.045em] sm:text-4xl">{stage.title}</h3>
                      <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#526278]">{stage.text}</p>
                      <div className="mt-8 space-y-3">{stage.items.map((item, index) => <motion.div key={item} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.06 }} className="flex min-h-12 items-center gap-3 border border-[#0a1424]/10 bg-white px-4 text-sm"><Check size={15} className="text-[#3d7df2]" />{item}<span className="ml-auto font-mono text-[8px] uppercase tracking-[0.14em] text-[#64748a]">Mapped</span></motion.div>)}</div>
                    </div>
                    {active === 0 ? <GovernedDiscovery /> : (
                      <div className="relative min-h-[270px] overflow-hidden bg-[#0b1c30] p-6 text-white">
                        <div className="console-grid absolute inset-0 opacity-30" />
                        <div className="relative flex h-full flex-col">
                          <div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8ddff1]">{stage.metric}</span><ShieldCheck size={18} className="text-[#65d8f4]" /></div>
                          <p className="mt-8 text-3xl font-medium tracking-[-0.04em]">{stage.value}</p>
                          <div className="mt-8 flex h-20 items-end gap-2" aria-hidden="true">{stage.items.concat(stage.items).map((item, index) => <motion.span key={`${item}-${index}`} className="flex-1 bg-gradient-to-t from-[#3d7df2] to-[#65d8f4]" initial={{ height: 0 }} animate={{ height: `${32 + ((index * 23 + active * 17) % 62)}%` }} transition={{ duration: 0.35, delay: index * 0.04 }} />)}</div>
                          <div className="mt-auto border-t border-white/10 pt-4"><div className="h-1 bg-white/10"><motion.div className="h-full bg-[#65d8f4]" animate={{ width: `${(active + 1) * 20}%` }} /></div><p className="mt-3 font-mono text-[8px] uppercase tracking-[0.18em] text-[#8fa3b7]">Human decision required at every gate</p></div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-[#0a1424]/12 px-5 py-5 sm:px-7 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-xs leading-relaxed text-[#64748a]">Illustrative deployment walkthrough using synthetic data. Not a live customer environment or a statement of measured client results.</p>
            <a href="#start-deployment" onClick={() => selectNeed(`Deployment · ${stage.label}`)} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-4 bg-[#0a1424] px-5 text-sm font-semibold text-white">Scope my deployment <ArrowRight size={15} /></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
