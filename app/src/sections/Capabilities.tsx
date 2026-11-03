import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { capabilities } from "@/data";
import { Reveal, SectionHeading } from "@/components/Motion";
import { CapabilityVisual } from "@/components/CapabilityVisual";
import { Typewriter } from "@/components/Typewriter";

// Text-based vendor wordmarks avoid suggesting an official technology-partner relationship.
// Replace with provider-approved logo assets only after reviewing the applicable brand terms.
const technologies = [
  { name: "OpenAI", style: "brand-openai" },
  { name: "Microsoft Copilot", style: "brand-microsoft" },
  { name: "AWS", style: "brand-aws" },
  { name: "Google Cloud", style: "brand-google" },
  { name: "Oracle", style: "brand-oracle" },
  { name: "Azure", style: "brand-azure" },
  { name: "Palantir", style: "brand-palantir" },
  { name: "Hermes Agent", style: "brand-hermes" },
  { name: "OpenClaw", style: "brand-openclaw" },
  { name: "Grok Bot", style: "brand-grok" },
  { name: "Anthropic", style: "brand-anthropic" },
];

export function Capabilities() {
  const [selected, setSelected] = useState<(typeof capabilities)[number] | null>(null);
  return (
    <>
      <section id="capabilities" data-nav-theme="light" className="ribbon-section relative overflow-hidden bg-[#f5f6f8] py-24 text-[#0a1424] sm:py-28">
        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.5fr] lg:gap-16">
            <Reveal direction="left">
              <SectionHeading eyebrow="What we deploy" title="From possibility to production." body="We combine embedded engineering, AI-native product development, secure operations and applied intelligence to make advanced systems useful in the real world." />
              <a href="#solutions" className="group mt-7 inline-flex min-h-12 items-center gap-5 bg-[#0a1424] px-5 text-sm font-semibold text-[#f5f6f8]">Explore our solutions <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></a>
              <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#64748a]">Select an offering for a visual quick guide</p>
            </Reveal>
            <div className="grid gap-x-0 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon;
                return (
                  <Reveal key={capability.title} delay={index * 0.08} className="capability-card group relative border-t border-[#0a1424]/15 sm:px-5 sm:odd:pl-0 xl:border-l xl:border-t-0 xl:px-5 xl:first:border-l-0">
                    <article className="flex h-full flex-col">
                      <CapabilityVisual kind={capability.visual} className="relative aspect-[16/9]" />
                      <div className="flex flex-1 flex-col py-5 transition-transform duration-300 group-hover:-translate-y-1 group-focus-within:-translate-y-1">
                        <div className="flex items-center justify-between"><span className="font-mono text-[9px] tracking-[0.18em] text-[#64748a]">0{index + 1}</span><Icon size={19} strokeWidth={1.35} className="text-[#31567c]" /></div>
                        <h3 className="mt-4 text-lg font-semibold leading-snug tracking-[-0.03em]">{capability.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-[#526278]">{capability.text}</p>
                        <button type="button" onClick={() => setSelected(capability)} className="mt-auto flex min-h-11 items-center justify-between border-b border-[#0a1424]/15 pt-4 text-left text-[13px] font-semibold transition-colors hover:border-[#0a1424] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3d7df2]" aria-label={`Quick view: ${capability.title}`}>
                          Quick view <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="thesis" data-nav-theme="light" className="relative overflow-hidden bg-[#f5f6f8] py-24 text-[#0a1424] sm:py-36">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-16">
          <Reveal>
            <p className="eyebrow text-[#31567c]">Beyond the prototype</p>
            <Typewriter lines={["AI is not the outcome.", "What it makes", "possible is."]} className="mt-8 max-w-6xl text-[clamp(3rem,7.2vw,7.8rem)] font-medium leading-[0.96] tracking-[-0.072em]" gradientLine={2} />
          </Reveal>
          <div className="mt-12 grid gap-8 border-t border-[#0a1424]/15 pt-8 md:grid-cols-2">
            <Reveal><p className="max-w-xl text-lg leading-relaxed text-[#42536a]">Intelligence becomes valuable when it moves beyond experiments and into the decisions, systems and experiences that shape how organizations operate.</p></Reveal>
            <Reveal delay={0.1} className="md:justify-self-end"><a href="#mission-control" className="group inline-flex min-h-12 items-center gap-4 text-sm font-semibold">See how we work <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></a><p className="mt-5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#64748a]">Strategy → Engineering → Impact</p></Reveal>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <Dialog.Root open onOpenChange={(open) => { if (!open) setSelected(null); }}>
            <Dialog.Portal>
              <Dialog.Overlay asChild><motion.div className="fixed inset-0 z-50 bg-[#030b14]/80 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /></Dialog.Overlay>
              <Dialog.Content asChild onCloseAutoFocus={(event) => {
                event.preventDefault();
                if (window.location.hash !== "#start-deployment") document.querySelector<HTMLButtonElement>(`button[aria-label="Quick view: ${selected.title}"]`)?.focus();
              }}>
                <motion.div
                  className="fixed left-1/2 top-1/2 z-50 max-h-[92dvh] w-[calc(100%-24px)] max-w-6xl overflow-y-auto border border-white/20 bg-[#f5f6f8] text-[#0a1424] shadow-[0_35px_100px_rgba(0,0,0,.35)] focus:outline-none sm:w-[calc(100%-48px)]"
                  style={{ x: "-50%", y: "-50%" }}
                  initial={{ opacity: 0, scale: 0.975 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.24 }}
                >
                  <Dialog.Close className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center border border-white/35 bg-[#081729]/70 text-white backdrop-blur-md transition-colors hover:bg-[#081729]" aria-label="Close offering quick view"><X size={19} /></Dialog.Close>
                  <div className="grid lg:grid-cols-[.88fr_1.12fr]">
                    <div className="relative min-h-[250px] overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#16344b,#081526_68%)] sm:min-h-[320px] lg:min-h-[650px]">
                      <span className="absolute left-6 top-6 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45 sm:left-8 sm:top-8">Visual field notes</span>
                      <span className="pointer-events-none absolute left-5 top-12 text-[120px] font-medium leading-none tracking-[-0.08em] text-white/[0.035] sm:left-7 sm:top-16" aria-hidden="true">{selected.id === "fde" ? "01" : selected.id === "studio" ? "02" : selected.id === "operations" ? "03" : "04"}</span>
                      <CapabilityVisual kind={selected.visual} interactive={false} className="absolute inset-x-0 top-1/2 aspect-[16/9] -translate-y-1/2" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#081526]/85 to-transparent px-6 pb-6 pt-20 text-white sm:px-8">
                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d6e5f1]">DLI deployment offering</p>
                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#d6e5f1]">From contextual understanding to an operating capability.</p>
                      </div>
                    </div>
                    <div className="p-6 sm:p-9 lg:p-11">
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#31567c]">Quick guide · {selected.id === "fde" ? "01" : selected.id === "studio" ? "02" : selected.id === "operations" ? "03" : "04"}</p>
                      <Dialog.Title className="mt-4 max-w-xl text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.055em]">{selected.title}</Dialog.Title>
                      <Dialog.Description className="mt-6 text-lg font-medium leading-relaxed text-[#243b53]">{selected.definition}</Dialog.Description>
                      <div className="mt-5 space-y-4">{selected.paragraphs.map((paragraph) => <p key={paragraph} className="text-[14px] leading-relaxed text-[#526278]">{paragraph}</p>)}</div>
                      <div className="mt-8 border-t border-[#0a1424]/15 pt-7">
                        <h3 className="text-xl font-semibold tracking-[-0.03em]">{selected.workingTitle}</h3>
                        <p className="mt-3 text-[14px] leading-relaxed text-[#526278]">{selected.workingText}</p>
                        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                          {selected.principles.map((principle) => <li key={principle} className="flex items-start gap-2.5 border-t border-[#0a1424]/10 pt-3 text-[13px] leading-relaxed text-[#26384e]"><Check size={15} className="mt-1 shrink-0 text-[#287c91]" />{principle}</li>)}
                        </ul>
                      </div>
                      <div className="mt-8 border-l-2 border-[#31567c] bg-[#e9eef4] p-5"><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#526278]">The goal is simple</p><p className="mt-2 text-[15px] font-medium leading-relaxed">{selected.goal}</p></div>
                      <Dialog.Close asChild><a href="#start-deployment" onClick={() => window.dispatchEvent(new CustomEvent("dli:add-capability", { detail: selected.title }))} className="mt-7 inline-flex min-h-12 items-center justify-center gap-4 bg-[#0a1424] px-5 text-sm font-semibold text-white">Discuss this offering<ArrowUpRight size={16} /></a></Dialog.Close>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </AnimatePresence>
    </>
  );
}

export function TechnologyStrip() {
  const discuss = () => window.dispatchEvent(new CustomEvent("dli:add-capability", { detail: "Cloud & AI adoption" }));
  return (
    <section id="technology" data-nav-theme="light" aria-labelledby="technology-title" className="technology-hero-strip relative overflow-hidden border-y border-[#0a1424]/[.09] bg-[#f7f8fb] text-[#0a1424]">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-5 pb-5 pt-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-16">
        <div>
          <p className="eyebrow text-[#69788d]">Enterprise AI · agents · cloud · infrastructure</p>
          <h2 id="technology-title" className="mt-2 text-[clamp(1.3rem,2.1vw,2rem)] font-semibold tracking-[-.05em]">Your stack. <span className="text-[#5c6f86]">Our engineering.</span></h2>
        </div>
        <p className="max-w-lg text-[12px] leading-relaxed text-[#627187] lg:text-right">We help organizations evaluate, adopt and integrate the AI technologies that fit their needs.</p>
      </div>
      <div className="technology-marquee-shell relative overflow-hidden py-3" role="region" aria-label="AI and enterprise technology examples">
        <div className="technology-marquee-logo-row flex w-max items-center gap-0">
          {[0, 1].map((iteration) => (
            <div key={iteration} className="technology-marquee-set flex shrink-0 items-center" aria-hidden={iteration === 1 ? true : undefined}>
              {technologies.map(({ name, style }) => (
                <span key={`${iteration}-${name}`} className={`technology-logo ${style}`} title={name}>
                  <span>{name}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-5 pb-7 pt-3 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-16">
        <p className="max-w-5xl text-[10px] leading-relaxed text-[#6c7d91] sm:text-[11px]">Independent engineering and technology adoption services. Brand names indicate examples of technologies we can assess or scope; they do not imply official partnership, endorsement, certification, or confirmed support for every integration.</p>
        <a href="/solutions/enterprise-ai-agent-deployment/" onClick={discuss} className="inline-flex shrink-0 items-center gap-2 self-start text-[12px] font-semibold text-[#244c76] hover:underline lg:self-auto">Explore AI adoption <ArrowRight size={14} /></a>
      </div>
    </section>
  );
}
