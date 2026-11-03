import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownToLine, ArrowRight, Check, FileText } from "lucide-react";
import { DliLockup } from "@/components/DliMark";
import { Reveal } from "@/components/Motion";

const needOptions = ["AI agent or workflow", "Voice AI", "Digital human", "Intelligent operating system", "Cloud & AI adoption", "Product engineering", "Forward-deployed engineering", "Managed AI operations", "Systems integration", "Not sure yet"];

const resources = [
  { slug: "the-power-of-innovation-in-recession", title: "The Power of Innovation in Recession", file: "The-Power-of-Innovation-in-Recession.pdf" },
  { slug: "jobs-of-the-future", title: "Jobs of the Future", file: "Jobs-of-the-Future.pdf" },
];

const LEAD_API_BASE = ((import.meta.env.VITE_LEAD_API_URL as string | undefined) ?? "https://api.deeplearningintelligence.com").replace(/\/+$/, "");

type LeadPayload = {
  name: string;
  email: string;
  organization: string;
  market: string;
  need: string;
  timeline: string;
  problem: string;
  resource?: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function Deployment() {
  const reduce = useReducedMotion();
  const [need, setNeed] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [resource, setResource] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef(0);
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);
  useEffect(() => {
    const onCapability = (event: Event) => { setNeed((event as CustomEvent<string>).detail); setDownloaded(false); };
    window.addEventListener("dli:add-capability", onCapability);
    return () => window.removeEventListener("dli:add-capability", onCapability);
  }, []);

  const sendLead = async (payload: LeadPayload): Promise<boolean> => {
    try {
      const response = await fetch(`${LEAD_API_BASE}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Analytics must never carry personal data or break the submission.
  const trackLead = (payload: LeadPayload) => {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "dli_lead_submit", need: payload.need, timeline: payload.timeline, resource: payload.resource ?? null });
      window.dispatchEvent(new CustomEvent("dli:lead", { detail: { need: payload.need, resource: payload.resource ?? null } }));
    } catch {
      /* ignore analytics failures */
    }
  };

  const buildBrief = (data: FormData, transmitted: boolean) => {
    const brief = [
      "DLI — DEPLOYMENT BRIEF",
      "Intelligence. Deployed.",
      "",
      `Name: ${data.get("name")}`,
      `Work email: ${data.get("email")}`,
      `Organization: ${data.get("organization")}`,
      `Country / market: ${data.get("market") || "Not specified"}`,
      `What do you need?: ${need}`,
      `Timeline: ${data.get("timeline") || "Not specified"}`,
      "",
      "PROBLEM TO SOLVE",
      String(data.get("problem")),
      "",
      "Suggested first step: a scoped deployment assessment covering workflow value, feasibility, architecture, governance and delivery roadmap.",
      "",
      transmitted
        ? "This brief was generated during your DLI enquiry. Details were transmitted to the DLI team for review."
        : "This brief was generated locally in the browser.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "DLI-deployment-brief.txt";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const payload: LeadPayload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      organization: String(data.get("organization") ?? ""),
      market: String(data.get("market") ?? ""),
      need,
      timeline: String(data.get("timeline") ?? ""),
      problem: String(data.get("problem") ?? ""),
      resource: resource ?? undefined,
    };
    // Spam guard: hidden honeypot must stay empty and the form must not be submitted instantly.
    const honeypotTripped = String(data.get("hp_website") ?? "") !== "";
    const tooFast = Date.now() - startedAtRef.current < 4000;
    if (honeypotTripped || tooFast) {
      // Likely automated: never send, but still give a human the local brief.
      buildBrief(data, false);
      setSent(false);
      return;
    }
    setSending(true);
    setSendError("");
    let ok = false;
    try {
      ok = await sendLead(payload);
    } finally {
      setSending(false);
    }
    if (!ok) {
      setSendError("Your note couldn't be sent just now. Please try again in a moment.");
      return;
    }
    trackLead(payload);
    setSent(true);
    setDownloaded(true);
    buildBrief(data, true);
    form.reset();
    setNeed("");
  };

  const requestResource = (slug: string) => {
    setResource(slug);
    setDownloaded(false);
    setSent(false);
    setSendError("");
    formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    formRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true });
  };

  const selectedResource = resource ? resources.find((item) => item.slug === resource) ?? null : null;

  return (
    <section id="start-deployment" data-nav-theme="dark" className="deployment-radiance relative overflow-hidden bg-[#081729] py-24 text-[#f5f6f8] sm:py-32">
      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-16">
        <div className="grid gap-14 lg:grid-cols-[1fr_.85fr] lg:items-start">
          <Reveal direction="left">
            <p className="eyebrow text-[#8ddff1]">Start a deployment</p>
            <h2 className="mt-6 max-w-3xl text-[clamp(3rem,6vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.065em]">Have a complex problem?<br /><span className="text-[#8ddff1]">Let’s engineer the answer.</span></h2>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-[#b7c4d4]">Tell us what you’re trying to improve, build or deploy. Prepare a focused brief for the right first conversation—from an AI deployment assessment to a dedicated engineering engagement.</p>
            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3 border-y border-white/15 py-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#8fa3b7]">{["Discover", "Engineer", "Validate", "Deploy", "Operate"].map((stage, index) => <span key={stage} className="flex items-center gap-5"><span className="text-[#d3deea]">{stage}</span>{index < 4 && <ArrowRight size={12} />}</span>)}</div>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#8fa3b7]">Not every problem needs a new model or an autonomous agent. The right approach starts with the actual workflow.</p>
            <div className="mt-10 border-t border-white/15 pt-8">
              <p className="eyebrow text-[#8ddff1]">Free resources</p>
              <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em]">Read the research before the first call.</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#8fa3b7]">Two short briefings DLI prepared on innovation during recession and the future of work. Leave your work email and we will send them over.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {resources.map((item) => (
                  <button key={item.slug} type="button" onClick={() => requestResource(item.slug)} aria-pressed={resource === item.slug} className={`group flex min-h-14 items-center justify-between gap-3 border px-4 text-left text-sm font-semibold text-[#f5f6f8] transition-colors ${resource === item.slug ? "border-[#65d8f4]/70 bg-[#65d8f4]/10" : "border-white/15 bg-white/[0.03] hover:border-[#65d8f4]/60 hover:bg-[#65d8f4]/5"}`}>
                    <span className="flex items-center gap-3"><FileText size={16} className="shrink-0 text-[#65d8f4]" />{item.title}</span>
                    <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
              <div aria-live="polite">{selectedResource ? <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#65d8f4]">Selected: {selectedResource.title} — submit the form to receive it.</p> : null}</div>
            </div>
          </Reveal>
          <Reveal direction="right" className="border border-white/15 bg-[#0b1c30]/80 p-5 backdrop-blur-xl sm:p-8">
            <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#65d8f4]/30 text-[#65d8f4]"><FileText size={20} /></span><div><h3 className="text-xl font-semibold tracking-[-0.03em]">Prepare a deployment brief</h3><p className="mt-2 text-xs leading-relaxed text-[#8fa3b7]">Your details go to the DLI team so a senior engineer can reply. Your brief is also generated for you to keep.</p></div></div>
            <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Deployment brief" className="mt-7 space-y-5">
              <input type="text" name="hp_website" tabIndex={-1} autoComplete="off" data-lpignore="true" data-1p-ignore aria-hidden="true" className="sr-only" />
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="form-label">Full name<input name="name" required autoComplete="name" className="form-input" /></label>
                <label className="form-label">Work email<input name="email" required type="email" autoComplete="email" className="form-input" /></label>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="form-label">Organization<input name="organization" required autoComplete="organization" className="form-input" /></label>
                <label className="form-label">Country / market <span>(optional)</span><input name="market" autoComplete="country-name" className="form-input" /></label>
              </div>
              <label className="form-label">What do you need?
                <select required value={need} onChange={(event) => { setNeed(event.target.value); setDownloaded(false); }} className="form-input bg-[#0b1c30]">
                  <option value="" disabled>Select a capability</option>
                  {need && !needOptions.includes(need) && <option value={need}>{need}</option>}
                  {needOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="form-label">Describe the problem<textarea name="problem" required rows={4} className="form-input resize-y" placeholder="What workflow, decision or experience needs to change? Please do not include sensitive or personal data." /></label>
              <label className="form-label">Timeline <span>(optional)</span><select name="timeline" className="form-input bg-[#0b1c30]"><option value="">Choose later</option><option>Exploratory</option><option>Within 30 days</option><option>Within 90 days</option><option>Later</option></select></label>
              <button type="submit" disabled={sending} className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#f5f6f8] px-5 text-sm font-semibold text-[#0a1424] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"><ArrowDownToLine size={16} />{sending ? "Sending…" : selectedResource ? "Email me the PDF" : "Send deployment brief"} <span aria-hidden="true">→</span></button>
              <p className="text-[11px] leading-relaxed text-[#7d90a4]">By sending this form you agree to be contacted about your enquiry. We do not sell your details.</p>
              {sendError ? <div role="alert" aria-live="assertive" className="border border-[#ff7a90]/40 bg-[#ff4d6d]/10 p-4 text-sm leading-relaxed text-[#ffd6de]">{sendError}</div> : null}
              <div aria-live="polite">{downloaded && <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col gap-3 border border-[#65d8f4]/30 bg-[#65d8f4]/5 p-4 text-sm leading-relaxed text-[#c6f4ff]"><span className="flex gap-3"><Check size={18} className="shrink-0" />{sent ? "Thanks — your details are with the DLI team. A senior engineer replies within one business day." : "Your deployment brief has been downloaded."}</span>{selectedResource ? <a className="font-semibold underline underline-offset-4" href={`/resources/${selectedResource.file}`} download>Download “{selectedResource.title}” (PDF)</a> : null}</motion.div>}</div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="company" data-nav-theme="dark" className="bg-[#06111f] pb-8 pt-16 text-[#f5f6f8]">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-16">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1fr_1.4fr]">
          <div><a href="#top" aria-label="Back to DLI home"><DliLockup /></a><p className="mt-5 max-w-sm text-sm leading-relaxed text-[#8fa3b7]">Forward-deployed AI engineering and AI-native product development for real operational environments.</p></div>
          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-4 sm:grid-cols-3">{[{ label: "Solutions", href: "#solutions" }, { label: "Experience Lab", href: "#experience-lab" }, { label: "Architecture", href: "#architecture" }, { label: "Industries", href: "#industries" }, { label: "Work", href: "#work" }, { label: "Venture Factory", href: "#venture-factory" }, { label: "FAQs", href: "#questions" }, { label: "Start a Deployment", href: "#start-deployment" }].map((link) => <a key={link.href} href={link.href} className="group flex min-h-12 items-center justify-between border-b border-white/10 text-sm font-medium text-[#d3deea] hover:text-white">{link.label}<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></a>)}</nav>
        </div>
        <a href="#top" className="group mt-10 flex items-end justify-between gap-4 text-[clamp(2.5rem,6.5vw,7rem)] font-medium leading-none tracking-[-0.07em] text-[#f5f6f8]">Intelligence. Deployed.<ArrowRight size={40} className="mb-2 shrink-0 transition-transform group-hover:translate-y-2" /></a>
        <div className="mt-12 flex flex-col gap-3 text-[11px] leading-relaxed text-[#64798f] sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Deep Learning Intelligence.</p><p>Prototype concepts, demo access, company claims and contracting details require verification before public launch.</p></div>
      </div>
    </footer>
  );
}
