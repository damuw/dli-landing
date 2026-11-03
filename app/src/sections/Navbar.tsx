import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { DliLockup } from "@/components/DliMark";

const links = [
  { label: "Solutions", href: "#solutions" },
  { label: "Experience Lab", href: "#experience-lab" },
  { label: "Industries", href: "#industries" },
  { label: "Venture Factory", href: "#venture-factory" },
  { label: "Our Work", href: "#work" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-theme]"));
      const position = window.scrollY + 140;
      let current = sections[0];
      sections.forEach((section) => { if (section.offsetTop <= position) current = section; });
      setDark(current?.dataset.navTheme === "dark");
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className={`glass-nav fixed left-1/2 top-3 z-40 w-[calc(100%-1.5rem)] max-w-[1560px] -translate-x-1/2 overflow-hidden rounded-2xl border transition-[background-color,border-color,box-shadow,color] duration-300 sm:w-[calc(100%-2rem)] ${dark ? "glass-nav--dark text-[#f5f6f8]" : "text-[#0a1424]"} ${scrolled || open ? "glass-nav--scrolled" : ""}`}>
      <div className={`mx-auto flex max-w-[1600px] items-center justify-between px-5 transition-[height] duration-300 sm:px-8 lg:px-12 ${scrolled ? "h-16" : "h-[76px]"}`}>
        <a href="#top" aria-label="DLI home" className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3d7df2]" onClick={() => setOpen(false)}>
          <DliLockup />
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} className={`nav-link relative py-3 text-[13px] font-medium tracking-[-0.01em] transition-colors ${dark ? "text-[#d9e3ed] hover:text-white" : "text-[#26384e] hover:text-[#0a1424]"}`}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#start-deployment" className={`group hidden min-h-11 items-center gap-3 rounded-xl border px-5 text-[13px] font-semibold transition-all hover:-translate-y-0.5 sm:inline-flex ${dark ? "border-white/70 bg-[#f5f6f8]/90 text-[#0a1424] shadow-[0_5px_18px_rgba(0,0,0,.14)]" : "border-white/20 bg-[#0a1424]/95 text-[#f5f6f8] shadow-[0_5px_18px_rgba(10,20,36,.14)]"}`}>
            Start a Deployment <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <button type="button" className={`flex h-11 w-11 items-center justify-center rounded-xl border backdrop-blur-md lg:hidden ${dark ? "border-white/20 bg-white/[0.06]" : "border-white/70 bg-white/25"}`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-menu" aria-label="Mobile navigation" className={`border-t px-5 pb-6 pt-3 lg:hidden ${dark ? "border-white/10 bg-white/[0.025]" : "border-white/50 bg-white/[0.08]"}`} initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.22 }}>
            {links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-between border-b border-current/10 text-lg font-medium">{link.label}<ArrowUpRight size={17} /></a>)}
            <a href="#start-deployment" onClick={() => setOpen(false)} className={`mt-5 flex min-h-12 items-center justify-between rounded-xl px-4 font-semibold ${dark ? "bg-[#f5f6f8]/90 text-[#0a1424]" : "bg-[#0a1424]/95 text-[#f5f6f8]"}`}>Start a Deployment<ArrowUpRight size={17} /></a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
