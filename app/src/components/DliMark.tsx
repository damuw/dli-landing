/** Image-derived Continuum mark from the approved DLI hero artwork. */
export function ContinuumGlyph({ className = "" }: { className?: string }) {
  return <img src="/assets/continuum-mark.png" alt="" aria-hidden="true" className={`object-contain ${className}`} width="72" height="58" decoding="async" />;
}

export function DliLockup({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <ContinuumGlyph className="h-10 w-12 shrink-0 drop-shadow-[0_3px_5px_rgba(0,0,0,.12)]" />
      <span className="flex items-center gap-2.5">
        <span className="text-[25px] font-extrabold leading-none tracking-[-0.055em]">DLI</span>
        {!compact && <span className="border-l border-current/20 pl-2.5 font-mono text-[8px] font-medium uppercase leading-[1.45] tracking-[0.2em] opacity-75">Deep Learning<br />Intelligence</span>}
      </span>
    </span>
  );
}
