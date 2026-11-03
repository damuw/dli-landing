import { useEffect, useState } from "react";

const items = [
  { label: "Continuum", selector: "top" },
  { label: "Experience", selector: "experience-lab" },
  { label: "Architecture", selector: "architecture" },
  { label: "Solutions", selector: "solutions" },
  { label: "Mission", selector: "mission-control" },
  { label: "Deploy", selector: "start-deployment" },
];

export function SideNav() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let current = items[0].selector;
      items.forEach((item) => {
        const element = document.getElementById(item.selector);
        if (element && element.getBoundingClientRect().top <= window.innerHeight * 0.45) current = item.selector;
      });
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <nav aria-label="Chapter navigation" className="fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 mix-blend-difference xl:block">
      <ol className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.selector}>
            <a href={`#${item.selector}`} aria-current={active === item.selector ? "location" : undefined} className="group flex min-h-9 items-center gap-3 text-white">
              <span className={`block rounded-full bg-white transition-all duration-300 ${active === item.selector ? "h-2.5 w-2.5" : "h-1.5 w-1.5 opacity-40 group-hover:opacity-90"}`} />
              <span className={`font-mono text-[9px] uppercase tracking-[0.18em] transition-all ${active === item.selector ? "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-80" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"}`}>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
