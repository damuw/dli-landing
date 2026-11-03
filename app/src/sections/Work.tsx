import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { proofItems } from "@/data";
import { ContinuumGlyph } from "@/components/DliMark";
import { Reveal, SectionHeading } from "@/components/Motion";

export function Work() {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const rotation = -selected * (360 / proofItems.length);
  const item = proofItems[selected];
  const Icon = item.icon;
  return (
    <section id="work" data-nav-theme="light" className="relative min-h-[100dvh] overflow-hidden bg-[#f5f6f8] py-24 text-[#0a1424] sm:py-32">
      <div className="relative mx-auto grid max-w-[1500px] gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-16">
        <Reveal direction="left" className="relative z-10">
          <SectionHeading eyebrow="Selected engineering & product work" title="We don't just advise. We build." body="Explore engineering, product and venture directions across the DLI ecosystem. Each demonstrates a different way to bring intelligence into the real world." />
          <div className="mt-10 border-y border-[#0a1424]/15 py-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#64748a]">In focus · {item.type}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{item.name}</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#526278]">{item.description}</p>
            <button type="button" onClick={() => setOpen(true)} className="group mt-5 inline-flex min-h-11 items-center gap-3 text-sm font-semibold">Open work notes <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></button>
          </div>
          <p className="mt-5 max-w-md text-xs leading-relaxed text-[#64748a]">Portfolio relationships, public availability and evidence claims require final verification before publication. Concepts are labeled accordingly.</p>
        </Reveal>
        <Reveal direction="right" className="relative min-h-[560px] lg:min-h-[650px]">
          <div className="dial-stage absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-[58%]">
            <div className="absolute inset-0 rounded-full border border-[#0a1424]/10" />
            <div className="absolute inset-[14%] rounded-full border border-dashed border-[#31567c]/20" />
            <motion.div className="absolute inset-0" animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 80, damping: 18 }}>
              {proofItems.map((proof, index) => {
                const ProofIcon = proof.icon;
                const angle = index * (360 / proofItems.length);
                return <button key={proof.name} type="button" onClick={() => setSelected(index)} aria-label={`Focus ${proof.name}`} aria-pressed={selected === index} className={`dial-item absolute left-1/2 top-1/2 flex flex-col items-center justify-center gap-1 border bg-[#f5f6f8] p-2 text-center shadow-[0_12px_35px_rgba(19,44,70,.1)] transition-[border-color,background-color] ${selected === index ? "border-[#3d7df2] bg-white" : "border-[#0a1424]/15 hover:border-[#3d7df2]/60"}`} style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(-1 * var(--dial-radius))) rotate(${-angle - rotation}deg)` }}><ProofIcon size={23} strokeWidth={1.25} style={{ color: proof.color }} /><span className="text-[10px] font-semibold leading-tight">{proof.name}</span><span className="font-mono text-[7px] uppercase tracking-[0.12em] text-[#64748a]">{proof.type}</span></button>;
              })}
            </motion.div>
            <button type="button" onClick={() => setOpen(true)} className="group absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#0a1424]/15 bg-[#0b1c30] text-white shadow-[0_20px_60px_rgba(19,44,70,.2)] transition-transform hover:scale-[1.03]" aria-label={`Open ${item.name} details`}><ContinuumGlyph className="h-16 w-16 sm:h-20 sm:w-20" /><span className="mt-2 font-mono text-[8px] uppercase tracking-[0.18em] text-[#8ddff1]">Open selected</span></button>
          </div>
        </Reveal>
      </div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#07111f]/75 backdrop-blur-md" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-xl -translate-x-1/2 -translate-y-1/2 border border-white/15 bg-[#0b1c30] p-7 text-white shadow-2xl focus:outline-none sm:p-10">
            <Dialog.Close className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center border border-white/15 hover:bg-white/10" aria-label="Close work notes"><X size={18} /></Dialog.Close>
            <Icon size={42} strokeWidth={1.1} style={{ color: item.color }} />
            <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.2em] text-[#8ddff1]">{item.type}</p>
            <Dialog.Title className="mt-3 text-4xl font-medium tracking-[-0.05em]">{item.name}</Dialog.Title>
            <Dialog.Description className="mt-5 text-base leading-relaxed text-[#b7c4d4]">{item.description}</Dialog.Description>
            <div className="mt-8 border-t border-white/10 pt-6 text-sm leading-relaxed text-[#b7c4d4]"><strong className="text-white">Publication status:</strong> This homepage concept presents the direction only. Verified scope, ownership, evidence and public links belong in the final work detail page.</div>
            <Dialog.Close asChild><a href="#start-deployment" onClick={() => window.dispatchEvent(new CustomEvent("dli:add-capability", { detail: item.name }))} className="mt-8 inline-flex min-h-12 items-center gap-4 bg-white px-5 text-sm font-semibold text-[#0a1424]">Discuss a related deployment <ArrowUpRight size={16} /></a></Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
