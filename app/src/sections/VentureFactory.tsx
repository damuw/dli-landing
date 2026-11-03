import { ArrowUpRight, Check, Compass, GitBranch, Layers3, Rocket, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Motion";

const stages = [
  { num: "01", icon: Compass, title: "Discover", desc: "Find customer problems, market signals and viable revenue opportunities." },
  { num: "02", icon: ShieldCheck, title: "Validate", desc: "Test demand, feasibility, economics and evidence before spending." },
  { num: "03", icon: Layers3, title: "Build", desc: "Turn approved opportunities into working products and reusable components." },
  { num: "04", icon: Rocket, title: "Launch", desc: "Deploy, measure outcomes and decide whether to scale, pivot or stop." },
];
const ventures = [
  { name: "Any.xyz", kind: "AI Product Studio", description: "Custom AI-native applications and operating systems, built with the DLI engineering approach.", href: "https://any.xyz/", color: "from-[#163459] to-[#0c1a33]", label: "Visit studio" },
  { name: "GoFundItNow", kind: "Funding intelligence · Product", description: "A vertical intelligence business helping organizations navigate funding opportunities and workflows.", href: "https://gofunditnow.com/", color: "from-[#0b454a] to-[#09252c]", label: "Explore product" },
  { name: "Role.ai", kind: "Agentic commerce · Exploration", description: "An emerging concept exploring intelligent commerce experiences, agents and payments.", href: "#start-deployment", color: "from-[#24245e] to-[#111634]", label: "Discuss opportunity" },
];

export function VentureFactory() {
  return (
    <section id="venture-factory" data-nav-theme="light" className="relative overflow-hidden bg-[#eef2f7] py-24 text-[#0a1424] sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <Reveal>
            <p className="eyebrow text-[#31567c]">DLI Venture Factory</p>
            <h2 className="mt-5 text-[clamp(2.9rem,5vw,5.6rem)] font-medium leading-[1.03] tracking-[-.06em]">Ideas are plentiful.<br/><span className="text-[#657b99]">Evidence is everything.</span></h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-[16px] leading-[1.8] text-[#4d6075]">Our Venture Factory is a governed pipeline for researching, validating, building and launching AI-native ventures. It connects commercial insight, engineering delivery and reusable infrastructure—without confusing speculative ideas with proven products. Agent-assisted research and building can increase throughput, but release decisions remain human-approved.</p>
            <div className="mt-6 flex flex-wrap gap-3 text-[11px] font-medium text-[#31567c]"><span className="border border-[#aebfd2] px-3 py-2">Evidence-led gates</span><span className="border border-[#aebfd2] px-3 py-2">Human approval</span><span className="border border-[#aebfd2] px-3 py-2">Revenue accountability</span></div>
          </Reveal>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden border border-[#c5d1df] bg-[#c5d1df] md:grid-cols-4">
          {stages.map(({ num, icon:Icon, title, desc }) => <Reveal key={num} className="bg-[#f7f9fb] px-6 py-8 sm:px-7"><div className="flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.2em] text-[#657b99]">GATE / {num}</span><Icon size={22} strokeWidth={1.4} className="text-[#31567c]"/></div><h3 className="mt-9 text-2xl font-semibold tracking-[-.045em]">{title}</h3><p className="mt-3 min-h-[80px] text-sm leading-relaxed text-[#526278]">{desc}</p></Reveal>)}
        </div>
        <div className="mt-20 grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
          <Reveal><p className="eyebrow text-[#31567c]">Portfolio intelligence</p><h3 className="mt-5 text-[clamp(2.3rem,4vw,4.2rem)] font-medium leading-tight tracking-[-.05em]">One engineering discipline.<br/>Many possible outcomes.</h3><p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#526278]">Some ventures become independent products. Others remain experiments or reusable capabilities. Our decisions are driven by market evidence, delivery economics and customer value.</p><a href="/venture-factory/" className="mt-7 inline-flex items-center gap-3 border-b border-[#31567c] py-3 text-sm font-semibold">Explore the Venture Factory <ArrowUpRight size={16}/></a></Reveal>
          <div className="venture-grid-v3 grid gap-3 sm:grid-cols-3">
            {ventures.map((v) => <article key={v.name} className={`flex min-h-[325px] flex-col overflow-hidden border border-white/10 bg-gradient-to-br ${v.color} p-6 text-white`}><span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8ddff1]">{v.kind}</span><div className="my-8 flex h-20 items-center justify-center"><GitBranch size={70} strokeWidth={.7} className="text-white/25"/></div><h4 className="text-[25px] font-semibold tracking-[-.05em]">{v.name}</h4><p className="mt-2 flex-1 text-[12px] leading-relaxed text-[#c2d1e1]">{v.description}</p><a href={v.href} {...(v.href.startsWith('http') ? {target:'_blank',rel:'noopener noreferrer'} : {})} className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold">{v.label} <ArrowUpRight size={14}/></a></article>)}
          </div>
        </div>
        <div className="mt-10 border-l-2 border-[#31567c] bg-white/60 px-5 py-4"><p className="eyebrow text-[#31567c]">Research & exploration queue</p><p className="mt-2 text-sm leading-relaxed text-[#526278]">AI Maturity Journey · Stablecoin Adoption Framework · Cloud Adoption Architect · JobsOfNow. These are research or concept directions, not claims of publicly launched products.</p></div>
        <Reveal className="mt-12 flex flex-col gap-4 border-t border-[#0a1424]/15 pt-7 sm:flex-row sm:items-start sm:justify-between"><p className="max-w-3xl text-sm leading-relaxed text-[#526278]"><Check size={15} className="mr-2 inline text-[#287c91]"/>The Venture Factory is an operating model and innovation pipeline—not a claim that every domain or idea is an active customer-facing product.</p><p className="font-mono text-[10px] tracking-[0.1em] text-[#657b99]">DLI FORWARD × ANY.XYZ × LABS</p></Reveal>
      </div>
    </section>
  );
}
