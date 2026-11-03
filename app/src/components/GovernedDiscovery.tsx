import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, FileSearch, GitBranch, RotateCcw, ShieldCheck, UserCheck, X } from "lucide-react";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";

const steps = [
  { label: "Gather evidence", short: "Evidence", color: "#65d8f4", rgb: "101,216,244" },
  { label: "Prepare a decision", short: "Decision", color: "#a78bfa", rgb: "167,139,250" },
  { label: "Request approval", short: "Approval", color: "#f5b86b", rgb: "245,184,107" },
  { label: "Execute approved work", short: "Approved", color: "#72e0b2", rgb: "114,224,178" },
];

const evidence = [
  { title: "Workflow evidence assembled", copy: "Three synthetic sources reveal repeated handoffs and an avoidable review queue." },
  { title: "Opportunity brief prepared", copy: "A discovery workshop is framed around baseline measures, exceptions and accountable owners." },
  { title: "Human approval required", copy: "Authorize the discovery plan. No production system, contract or customer record is changed." },
  { title: "Discovery plan approved", copy: "The synthetic walkthrough is complete. No real system was changed and no work was submitted." },
];

export function GovernedDiscovery() {
  const hostRef = useRef<HTMLDivElement>(null);
  const visible = useSceneVisibility(hostRef);
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [rejected, setRejected] = useState(false);

  useEffect(() => {
    if (!visible || reduceMotion || rejected || step >= 2) return;
    const timer = window.setTimeout(() => setStep((current) => Math.min(current + 1, 2)), 2800);
    return () => window.clearTimeout(timer);
  }, [visible, reduceMotion, rejected, step]);

  const active = steps[step];
  const status = rejected
    ? { label: "Returned for review", copy: "No action taken. The evidence returns to the workflow owner for clarification." }
    : step === 0
      ? { label: "Read-only discovery", copy: "Approved sources can be examined. Systems and business records remain unchanged." }
      : step === 1
        ? { label: "Decision prepared", copy: "The opportunity, constraints and proposed outcome baseline are ready for review." }
        : step === 2
          ? { label: "Owner decision required", copy: "Approve a discovery workshop only. This gate never authorizes autonomous deployment." }
          : { label: "Approved in this demo", copy: "A discovery plan has been prepared in the demo. No real system was changed." };

  const replay = () => { setStep(0); setRejected(false); };

  return (
    <div
      ref={hostRef}
      className="relative min-h-[590px] overflow-hidden bg-[#081526] p-5 text-white sm:p-6"
      style={{ "--step-color": active.color, "--step-rgb": active.rgb } as CSSProperties}
      data-playing={visible && !reduceMotion && step < 2 && !rejected}
    >
      <div className="console-grid absolute inset-0 opacity-25" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl transition-colors duration-700" style={{ background: `rgba(${active.rgb},.15)` }} aria-hidden="true" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#dce8f5]"><ShieldCheck size={16} style={{ color: active.color }} />Governed discovery</span>
          <span className="border border-white/15 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-[#9db0c5]">Demo data</span>
        </div>

        <div className="mt-5 border border-white/10 bg-white/[0.045] p-4">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#8fa3b7]">Operations team · sample request</span>
          <p className="mt-2 text-[15px] leading-snug text-[#f2f6fb]">“Find a repetitive workflow where handoffs delay a measurable outcome.”</p>
        </div>

        <ol className="relative mt-5 space-y-1" aria-label="Governed discovery progress">
          <div className="absolute bottom-6 left-[15px] top-6 w-px bg-white/10" aria-hidden="true" />
          <motion.div className="absolute left-[15px] top-6 w-px origin-top" style={{ background: `linear-gradient(${steps[0].color}, ${steps[1].color}, ${steps[2].color}, ${steps[3].color})` }} animate={{ height: `${Math.max(0, step) * 38}px` }} transition={{ duration: reduceMotion ? 0 : 0.45 }} aria-hidden="true" />
          {steps.map((item, index) => {
            const complete = index < step || (step === 3 && index === 3 && !rejected);
            const current = index === step && !rejected;
            return (
              <li key={item.label} aria-current={current ? "step" : undefined} className="relative flex min-h-9 items-center gap-3 px-1 text-xs transition-colors" style={{ color: current ? item.color : complete ? "#c9d7e5" : "#687f96", background: current ? `rgba(${item.rgb},.08)` : "transparent" }}>
                <span className="relative z-10 grid h-[23px] w-[23px] shrink-0 place-items-center rounded-full border font-mono text-[9px]" style={{ borderColor: current || complete ? item.color : "#31465d", background: complete ? item.color : "#0b1b2e", color: complete ? "#081526" : current ? item.color : "#71879c" }}>
                  {complete ? <Check size={12} strokeWidth={2.5} /> : index + 1}
                </span>
                <span className="font-medium">{item.label}</span>
                {index === 2 && <UserCheck size={14} className="ml-auto" aria-label="Human approval gate" />}
                {current && step < 2 && !reduceMotion && <motion.span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: item.color }} animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.35, 0.8] }} transition={{ duration: 1.4, repeat: Infinity }} aria-hidden="true" />}
              </li>
            );
          })}
        </ol>

        <div className="mt-4 flex flex-wrap gap-2" aria-label="Synthetic evidence sources">
          {["Process map", "Exception log", "Outcome baseline"].map((source, index) => <span key={source} className="flex items-center gap-1.5 border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em]" style={{ borderColor: `rgba(${steps[index].rgb},.28)`, color: steps[index].color }}><span className="h-1 w-1 rounded-full" style={{ background: steps[index].color }} />{source}</span>)}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={rejected ? "rejected" : step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: reduceMotion ? 0 : 0.22 }} className="mt-4 flex gap-3 border-l-2 bg-white/[0.035] p-3" style={{ borderColor: rejected ? "#fb8ea0" : active.color }}>
            {rejected ? <X size={18} className="mt-0.5 shrink-0 text-[#fb8ea0]" /> : step === 0 ? <FileSearch size={18} className="mt-0.5 shrink-0" style={{ color: active.color }} /> : step === 1 ? <GitBranch size={18} className="mt-0.5 shrink-0" style={{ color: active.color }} /> : <ShieldCheck size={18} className="mt-0.5 shrink-0" style={{ color: active.color }} />}
            <div><strong className="text-sm font-medium">{rejected ? "Discovery paused" : evidence[step].title}</strong><p className="mt-1 text-xs leading-relaxed text-[#9db0c5]">{rejected ? status.copy : evidence[step].copy}</p></div>
          </motion.div>
        </AnimatePresence>

        <details className="group mt-2 text-xs text-[#9db0c5]">
          <summary className="flex min-h-10 cursor-pointer items-center gap-2 outline-none transition-colors focus-visible:text-white hover:text-white">Review example evidence<ArrowRight size={12} className="transition-transform group-open:rotate-90" /></summary>
          <p className="border-l border-white/15 pl-3 leading-relaxed">Synthetic process map: six handoffs. Synthetic exception log: repeated manual review. These illustrative inputs require an owner’s validation before any engagement decision.</p>
        </details>

        <div className="mt-auto border-t border-white/10 pt-4" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={rejected ? "rejected-status" : `status-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: rejected ? "#fb8ea0" : active.color }}>{status.label}</span>
              <p className="mt-2 min-h-9 text-xs leading-relaxed text-[#a9b9ca]">{status.copy}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 flex min-h-11 flex-wrap gap-2">
            {step === 2 && !rejected ? (
              <>
                <button type="button" onClick={() => setStep(3)} className="inline-flex min-h-11 items-center gap-2 bg-[#72e0b2] px-4 text-xs font-semibold text-[#081526] transition-colors hover:bg-[#a0efcc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Check size={14} />Approve demo plan</button>
                <button type="button" onClick={() => setRejected(true)} className="inline-flex min-h-11 items-center gap-2 border border-white/20 px-4 text-xs font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Reject</button>
              </>
            ) : step < 2 ? (
              <button type="button" onClick={() => setStep((current) => current + 1)} className="inline-flex min-h-11 items-center gap-2 border border-white/20 px-4 text-xs font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Next step<ArrowRight size={14} /></button>
            ) : (
              <button type="button" onClick={replay} className="inline-flex min-h-11 items-center gap-2 border border-white/20 px-4 text-xs font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><RotateCcw size={14} />Replay demo</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
