import { useId } from "react";

export type CapabilityVisualKind = "fde" | "studio" | "operations" | "markets";

function Illustration({ kind, id, detail, fit = "slice" }: { kind: CapabilityVisualKind; id: string; detail: boolean; fit?: "slice" | "meet" }) {
  const grid = `${id}-grid`;
  const glow = `${id}-glow`;
  const wash = `${id}-wash`;
  return (
    <svg className="h-full w-full" viewBox="0 0 640 360" preserveAspectRatio={`xMidYMid ${fit}`} role="img" aria-label={kind === "fde" ? "Domain experts and engineers connected to a production deployment pathway" : kind === "studio" ? "Layered AI product prototypes and interface studies" : kind === "operations" ? "AI operations monitoring rings, quality signals and controlled releases" : "Connected markets and intelligence pathways across a globe"}>
      <defs>
        <pattern id={grid} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,.09)" strokeWidth="1" /></pattern>
        <radialGradient id={glow}><stop stopColor={kind === "studio" ? "#ffb199" : kind === "operations" ? "#72e0b2" : kind === "markets" ? "#b8a5ff" : "#65d8f4"} stopOpacity=".62" /><stop offset="1" stopColor="#081526" stopOpacity="0" /></radialGradient>
        <linearGradient id={wash} x1="0" y1="0" x2="1" y2="1"><stop stopColor={kind === "studio" ? "#ff8d75" : kind === "operations" ? "#39b991" : kind === "markets" ? "#8b72ed" : "#2b91c4"} /><stop offset="1" stopColor="#081526" /></linearGradient>
      </defs>
      <rect width="640" height="360" fill={kind === "studio" ? "#241b32" : "#081526"} />
      <rect width="640" height="360" fill={`url(#${grid})`} />
      <ellipse cx={kind === "studio" ? 490 : 250} cy="150" rx="310" ry="280" fill={`url(#${glow})`} opacity={detail ? ".9" : ".55"} />

      {kind === "fde" && (
        <g>
          <path d="M0 286C130 230 194 297 302 238S484 108 640 138V360H0Z" fill={`url(#${wash})`} opacity=".34" />
          <g transform="translate(78 65)">
            <circle cx="92" cy="100" r="86" fill="#0c2338" stroke="#6d8ca6" strokeOpacity=".45" />
            <circle cx="92" cy="100" r="62" fill="none" stroke="#65d8f4" strokeOpacity=".35" strokeDasharray="3 8" />
            <circle cx="92" cy="100" r="34" fill="#102f47" stroke="#a9eaf6" strokeOpacity=".7" />
            <path d="M76 101l12 12 24-29" fill="none" stroke="#a9eaf6" strokeWidth="4" strokeLinecap="square" />
            {[0, 1, 2, 3, 4, 5].map((n) => { const a = n * Math.PI / 3; return <g key={n}><line x1={92 + Math.cos(a) * 40} y1={100 + Math.sin(a) * 40} x2={92 + Math.cos(a) * 82} y2={100 + Math.sin(a) * 82} stroke="#65d8f4" strokeOpacity=".4" /><circle cx={92 + Math.cos(a) * 84} cy={100 + Math.sin(a) * 84} r="5" fill={n % 2 ? "#a78bfa" : "#65d8f4"} /></g>; })}
            <text x="92" y="214" textAnchor="middle" fill="#a9b9ca" fontSize="10" letterSpacing="2.4">DOMAIN CONTEXT</text>
          </g>
          <path d="M265 166C332 166 326 103 394 103H472" fill="none" stroke="#65d8f4" strokeWidth="2" />
          <path d="M265 166C332 166 334 230 394 230H472" fill="none" stroke="#a78bfa" strokeWidth="2" />
          {[{ x: 299, y: 153, c: "#65d8f4" }, { x: 350, y: 110, c: "#65d8f4" }, { x: 306, y: 185, c: "#a78bfa" }, { x: 367, y: 225, c: "#a78bfa" }].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={detail ? 6 : 4} fill={p.c} />)}
          <g transform="translate(470 66)">
            {[0, 1, 2].map((n) => <g key={n} transform={`translate(${n * 17} ${n * 62})`}><rect width="116" height="52" fill={n === 2 ? "#e8f7fb" : "#12334c"} stroke={n === 2 ? "#fff" : "#4e7a96"} /><rect x="14" y="13" width="42" height="5" fill={n === 2 ? "#17344a" : "#65d8f4"} /><rect x="14" y="26" width="76" height="4" fill={n === 2 ? "#7990a1" : "#4e7189"} /><rect x="14" y="36" width="58" height="3" fill={n === 2 ? "#a2b1bd" : "#355a73"} /></g>)}
            <text x="70" y="226" textAnchor="middle" fill="#d8e6f1" fontSize="10" letterSpacing="2.2">PRODUCTION</text>
          </g>
          {detail && <g><path d="M42 42H190M42 42V72M598 318H450M598 318V288" stroke="#d9f7ff" strokeWidth="2" /><rect x="256" y="42" width="128" height="28" fill="#eaf9fc" /><text x="320" y="60" textAnchor="middle" fill="#102a3e" fontSize="10" fontWeight="700" letterSpacing="1.6">BUILD · VALIDATE</text></g>}
        </g>
      )}

      {kind === "studio" && (
        <g>
          <rect x="52" y="54" width="278" height="236" rx="3" fill="#ff9c84" opacity={detail ? ".96" : ".7"} transform="rotate(-7 52 54)" />
          <rect x="106" y="76" width="338" height="224" fill="#f4f0ee" stroke="#fff" strokeOpacity=".7" />
          <rect x="106" y="76" width="338" height="30" fill="#d9d5dc" />
          {[0, 1, 2].map(n => <circle key={n} cx={126 + n * 15} cy="91" r="3.5" fill={n === 0 ? "#ff8d75" : n === 1 ? "#d4a017" : "#7a6c87"} />)}
          <rect x="128" y="128" width="126" height="148" fill="#202134" />
          <rect x="144" y="148" width="94" height="9" fill="#d9f7ff" />
          <rect x="144" y="169" width="70" height="5" fill="#727b98" />
          <rect x="144" y="211" width="94" height="42" fill="#7963d9" />
          <path d="M154 241l16-14 13 8 18-19 25 25" fill="none" stroke="#d8ccff" strokeWidth="2" />
          <rect x="278" y="128" width="140" height="12" fill="#313549" />
          {[0, 1, 2, 3].map(n => <rect key={n} x="278" y={158 + n * 22} width={n % 2 ? 102 : 132} height="6" fill="#a5a1ac" />)}
          <rect x="278" y="254" width="92" height="24" fill="#ff8d75" />
          <g transform="translate(402 170) rotate(7)"><rect width="154" height="132" fill="#8e78e8" stroke="#cabfff" /><rect x="18" y="18" width="118" height="50" fill="#b7a8f4" /><circle cx="76" cy="43" r="17" fill="#f6efea" /><path d="M18 94H136M18 108H96" stroke="#e5dfff" strokeWidth="5" /></g>
          <path d="M478 250l38 62 12-25 27-8z" fill="#fff" stroke="#30263e" strokeWidth="3" />
          {detail && <g fill="none" stroke="#fff"><path d="M64 36V20H94M64 36H46V66M576 318v16h-30M576 318h18v-30" strokeWidth="2" /><path d="M72 326H570" strokeDasharray="2 8" opacity=".6" /></g>}
          <text x="120" y="332" fill="#f4dfe3" fontSize="10" letterSpacing="2.2">IDEA → INTERFACE → PRODUCT</text>
        </g>
      )}

      {kind === "operations" && (
        <g>
          <g transform="translate(208 172)">
            {[120, 92, 64].map((r, n) => <circle key={r} r={r} fill="none" stroke={n === 1 ? "#72e0b2" : "#65d8f4"} strokeOpacity={n === 1 ? ".62" : ".25"} strokeWidth={n === 1 ? 2 : 1} strokeDasharray={n === 0 ? "3 10" : undefined} />)}
            <path d="M0-120A120 120 0 0 1 114 37" fill="none" stroke="#72e0b2" strokeWidth="5" />
            <path d="M-92 0A92 92 0 0 1 0-92" fill="none" stroke="#a78bfa" strokeWidth="4" />
            <circle r="40" fill="#103a3c" stroke="#9ef0ce" />
            <path d="M-17 0l12 12 24-28" fill="none" stroke="#b9f9df" strokeWidth="4" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map(n => { const a = n * Math.PI / 4; return <circle key={n} cx={Math.cos(a) * 120} cy={Math.sin(a) * 120} r={detail && n % 2 === 0 ? 7 : 4} fill={n % 3 === 0 ? "#a78bfa" : "#72e0b2"} />; })}
          </g>
          <g transform="translate(388 66)">
            <rect width="200" height="108" fill="#0b2732" stroke="#4b817b" />
            <path d="M18 76L44 58 68 66 92 35 116 48 144 22 182 40" fill="none" stroke="#72e0b2" strokeWidth="3" />
            <path d="M18 86H182M18 60H182M18 34H182" stroke="#5b7c84" strokeOpacity=".3" />
            <circle cx="144" cy="22" r={detail ? 7 : 4} fill="#d2ffec" />
            <text x="18" y="98" fill="#8eaab1" fontSize="8" letterSpacing="1.8">EVALUATION SIGNAL</text>
          </g>
          <g transform="translate(388 198)">
            {[["QUALITY", "#72e0b2", 148], ["CONTROL", "#65d8f4", 126], ["RELEASE", "#a78bfa", 164]].map(([label, color, w], n) => <g key={label as string} transform={`translate(0 ${n * 34})`}><text y="8" fill="#a9bdc4" fontSize="8" letterSpacing="1.4">{label}</text><rect x="70" width="130" height="8" fill="#173943" /><rect x="70" width={w as number > 130 ? 122 : (w as number) - 30} height="8" fill={color as string} /></g>)}
          </g>
          {detail && <g><rect x="42" y="42" width="98" height="28" fill="#c8f9e5" /><text x="91" y="60" textAnchor="middle" fill="#10372f" fontSize="10" fontWeight="700" letterSpacing="1.4">OBSERVE</text><path d="M42 314H598" stroke="#72e0b2" strokeOpacity=".5" /></g>}
        </g>
      )}

      {kind === "markets" && (
        <g>
          <g transform="translate(310 176)">
            <circle r="128" fill="#171d45" stroke="#a99af2" strokeOpacity=".65" />
            <ellipse rx="128" ry="52" fill="none" stroke="#8d83cb" strokeOpacity=".55" />
            <ellipse rx="128" ry="92" fill="none" stroke="#8d83cb" strokeOpacity=".35" />
            <ellipse rx="54" ry="128" fill="none" stroke="#8d83cb" strokeOpacity=".55" />
            <ellipse rx="92" ry="128" fill="none" stroke="#8d83cb" strokeOpacity=".35" />
            <path d="M-128 0H128M0-128V128" stroke="#8d83cb" strokeOpacity=".4" />
            <path d="M-90-54C-32-112 30-96 82-34M-108 38C-32 100 58 96 110 22M-60 108C-20 42 42-12 106-44" fill="none" stroke="#65d8f4" strokeWidth="2" />
            {[{ x: -90, y: -54, c: "#f5b86b" }, { x: 82, y: -34, c: "#65d8f4" }, { x: -108, y: 38, c: "#a78bfa" }, { x: 110, y: 22, c: "#72e0b2" }, { x: -60, y: 108, c: "#f5b86b" }, { x: 106, y: -44, c: "#65d8f4" }].map((p, i) => <g key={i}><circle cx={p.x} cy={p.y} r={detail ? 11 : 8} fill={p.c} opacity=".18" /><circle cx={p.x} cy={p.y} r="4" fill={p.c} /></g>)}
          </g>
          <path d="M44 86H144L198 122M44 272H154L202 226M596 74H500L422 126M596 282H488L420 232" fill="none" stroke="#7c72b0" strokeWidth="1.5" />
          {[["MARKET 01", 44, 62], ["MARKET 02", 44, 248], ["SIGNAL 03", 496, 50], ["ACTION 04", 496, 258]].map(([label, x, y], n) => <g key={label as string} transform={`translate(${x} ${y})`}><rect width="100" height="38" fill="#111a38" stroke={n % 2 ? "#65d8f4" : "#9b89ed"} /><text x="50" y="23" textAnchor="middle" fill="#d9d8ed" fontSize="8" letterSpacing="1.1">{label}</text></g>)}
          {detail && <g><circle cx="310" cy="176" r="146" fill="none" stroke="#f5b86b" strokeDasharray="2 12" strokeWidth="2" /><rect x="248" y="320" width="124" height="25" fill="#f2e9d7" /><text x="310" y="337" textAnchor="middle" fill="#282040" fontSize="9" fontWeight="700" letterSpacing="1.5">COMPARE · CONNECT</text></g>}
        </g>
      )}
    </svg>
  );
}

export function CapabilityVisual({ kind, interactive = true, className = "" }: { kind: CapabilityVisualKind; interactive?: boolean; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`capability-art overflow-hidden bg-[#081526] ${className}`}>
      <div className="capability-art-base h-full w-full"><Illustration kind={kind} id={`${id}-base`} detail={!interactive} fit={interactive ? "slice" : "meet"} /></div>
      {interactive && <div className="capability-art-detail absolute inset-0" aria-hidden="true"><Illustration kind={kind} id={`${id}-detail`} detail /></div>}
    </div>
  );
}
