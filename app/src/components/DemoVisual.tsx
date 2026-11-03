import { Check, Cloud, FileText, Search, UserRound } from "lucide-react";

export function DemoVisual({ type }: { type: string }) {
  if (type === "voice") {
    return (
      <div className="demo-visual flex items-center justify-center overflow-hidden bg-[#061726]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(61,125,242,.2),transparent_58%)]" />
        <svg viewBox="0 0 400 180" className="relative w-[115%] max-w-none" aria-hidden="true">
          <defs>
            <linearGradient id="voice-line" x1="0" x2="1"><stop stopColor="#3d7df2" stopOpacity="0" /><stop offset=".45" stopColor="#65d8f4" /><stop offset=".7" stopColor="#9a83f7" /><stop offset="1" stopColor="#9a83f7" stopOpacity="0" /></linearGradient>
          </defs>
          {[0, 1, 2, 3].map((line) => (
            <path key={line} d={`M-10 90 C45 ${90 - line * 6}, 55 ${30 + line * 14}, 105 ${80 + line * 4} S165 ${155 - line * 10}, 210 ${82 + line * 5} S275 ${20 + line * 18}, 320 ${86 + line * 3} S375 ${120 - line * 5}, 410 90`} fill="none" stroke="url(#voice-line)" strokeWidth={3.4 - line * 0.55} opacity={0.95 - line * 0.18} className={`voice-wave voice-wave-${line}`} />
          ))}
        </svg>
        <span className="absolute bottom-5 right-5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#8ddff1]/70">Natural interaction</span>
      </div>
    );
  }
  if (type === "human") {
    return (
      <div className="demo-visual overflow-hidden bg-[radial-gradient(circle_at_50%_25%,#334158_0,#17283c_36%,#081729_75%)]">
        <div className="absolute left-1/2 top-[13%] h-[46%] w-[34%] -translate-x-1/2 rounded-[48%_48%_44%_44%] bg-[linear-gradient(105deg,#7f7280_0%,#d2b5aa_40%,#9b7f7c_72%,#3b3545_100%)] shadow-[0_0_50px_rgba(154,131,247,.16)]">
          <div className="absolute -left-[14%] -top-[8%] h-[70%] w-[128%] rounded-[50%_50%_35%_35%] bg-[linear-gradient(110deg,#171a25,#433642_55%,#171a25)]" />
          <div className="absolute left-[15%] top-[35%] h-[4%] w-[18%] rounded-full bg-[#2a2934]/80" />
          <div className="absolute right-[15%] top-[35%] h-[4%] w-[18%] rounded-full bg-[#2a2934]/80" />
          <div className="absolute bottom-[20%] left-1/2 h-[3%] w-[22%] -translate-x-1/2 rounded-full bg-[#704e55]/70" />
        </div>
        <div className="absolute bottom-[-16%] left-1/2 h-[58%] w-[78%] -translate-x-1/2 rounded-[50%_50%_0_0] bg-[linear-gradient(120deg,#101723,#273143_50%,#0b1422)]" />
        <div className="absolute inset-4 border border-[#9a83f7]/20" />
        <span className="absolute left-5 top-5 h-3 w-3 border-l border-t border-[#9a83f7]" />
        <span className="absolute right-5 top-5 h-3 w-3 border-r border-t border-[#9a83f7]" />
        <span className="absolute bottom-5 left-5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#d4caff]">AI disclosed</span>
      </div>
    );
  }
  if (type === "agents") {
    return (
      <div className="demo-visual overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#122e4b,#071525_70%)]">
        <div className="absolute left-1/2 top-1/2 w-[68%] -translate-x-1/2 -translate-y-1/2 -rotate-6">
          {["Research", "Analyze", "Create", "Review"].map((label, index) => (
            <div key={label} className="agent-row" style={{ transform: `translateX(${index * 9}px)`, marginTop: index ? -3 : 0 }}>
              <UserRound size={13} /><span>{label}</span><Check size={13} className="ml-auto text-[#65d8f4]" />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-10 bottom-5 h-px bg-gradient-to-r from-transparent via-[#65d8f4]/50 to-transparent" />
      </div>
    );
  }
  if (type === "globe") {
    return (
      <div className="demo-visual overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#143e70,#071426_67%)]">
        <div className="globe-grid absolute left-1/2 top-1/2 h-[76%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#65d8f4]/60 shadow-[inset_-20px_-12px_45px_#031020,0_0_40px_rgba(61,125,242,.28)]">
          <span className="absolute inset-[12%] rounded-full border border-[#65d8f4]/30" />
          <span className="absolute inset-x-0 top-1/2 h-px bg-[#65d8f4]/40" />
          <span className="absolute inset-y-0 left-1/2 w-px bg-[#65d8f4]/40" />
          <span className="absolute inset-x-[8%] top-[28%] h-[18%] rounded-[50%] border-t border-[#9a83f7]/50" />
          <span className="absolute inset-x-[8%] bottom-[28%] h-[18%] rounded-[50%] border-b border-[#9a83f7]/50" />
          {[[26, 32], [63, 25], [72, 58], [38, 67], [50, 45]].map(([x, y], index) => <span key={index} className="absolute h-1.5 w-1.5 rounded-full bg-[#c4f5ff] shadow-[0_0_10px_#65d8f4]" style={{ left: `${x}%`, top: `${y}%` }} />)}
        </div>
        <div className="absolute left-[8%] top-[48%] h-px w-[84%] rotate-[-18deg] bg-gradient-to-r from-transparent via-[#9a83f7]/60 to-transparent" />
      </div>
    );
  }
  if (type === "funding") {
    return (
      <div className="demo-visual overflow-hidden bg-[linear-gradient(145deg,#251e42,#0a1829_72%)]">
        <div className="absolute -right-[8%] -top-[12%] h-[105%] w-[62%] rotate-12 bg-[linear-gradient(160deg,rgba(154,131,247,.34),rgba(61,125,242,.04))] clip-funding" />
        <div className="absolute right-5 top-1/2 w-[58%] -translate-y-1/2 border border-white/10 bg-[#0b1728]/80 p-4 shadow-2xl backdrop-blur-md">
          {["Find funding", "Check eligibility", "Prepare application", "Track progress"].map((item) => <div key={item} className="flex items-center gap-2 py-1.5 text-[10px] text-[#d8e4f1]"><Check size={11} className="text-[#9a83f7]" />{item}</div>)}
        </div>
        <FileText className="absolute bottom-5 left-5 text-[#9a83f7]/60" size={28} strokeWidth={1} />
      </div>
    );
  }
  return (
    <div className="demo-visual overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#16344f,#081729_70%)]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((ring) => <div key={ring} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#65d8f4]/30" style={{ width: 80 + ring * 55, height: 80 + ring * 55 }} />)}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#102a43]/80 shadow-[0_0_45px_rgba(101,216,244,.16)]"><Cloud size={38} strokeWidth={1} className="text-[#65d8f4]" /></div>
      </div>
      <Search className="absolute bottom-5 right-5 text-[#65d8f4]/60" size={23} strokeWidth={1.2} />
    </div>
  );
}
