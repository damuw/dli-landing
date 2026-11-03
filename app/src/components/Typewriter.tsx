import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Typewriter heading.
 *
 * Ported from the Motion (motion.dev) "typewriter change content" behaviour:
 * text is revealed character by character with natural typing cadence (variable
 * speed, pauses at punctuation/spaces), a blinking cursor follows the active line,
 * and each line reserves its final size so nothing below shifts while typing.
 *
 * The content is expressed as ordered lines so the design's line breaks
 * (philosophy thesis) are preserved while still feeling typewriter-driven.
 */
type TypewriterProps = {
  /** Lines rendered top → bottom, typed sequentially. */
  lines: string[];
  className?: string;
  /** Zero-based index of the line that renders with the metallic gradient. */
  gradientLine?: number;
  /** Initial delay in ms before typing starts once the heading is in view. */
  startDelay?: number;
};

export function Typewriter({ lines, className = "", gradientLine = -1, startDelay = 0 }: TypewriterProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLHeadingElement | null>(null);
  const textKey = lines.join("\u0000");
  const [started, setStarted] = useState(false);
  const [counts, setCounts] = useState<number[]>(() => (reduce ? lines.map((line) => line.length) : lines.map(() => 0)));

  // Start when the heading approaches the viewport. Uses scroll/resize geometry
  // rather than IntersectionObserver so it still works in throttled/hidden tabs.
  useEffect(() => {
    if (reduce || started || lines.length === 0) return;
    const element = ref.current;
    if (!element) return;
    const check = () => {
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < viewport * 0.88 && rect.bottom > 0) setStarted(true);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [reduce, started, lines.length]);

  useEffect(() => {
    if (reduce) {
      setCounts(lines.map((line) => line.length));
      return;
    }
    if (!started || lines.length === 0) return;
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number, fn: () => void) => {
      const t = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(t);
    };
    let lineIndex = 0;
    let charIndex = 0;
    const tick = () => {
      if (cancelled) return;
      const line = lines[lineIndex];
      charIndex += 1;
      setCounts((prev) => {
        const next = [...prev];
        next[lineIndex] = charIndex;
        return next;
      });
      const done = charIndex >= line.length;
      if (done) {
        if (lineIndex < lines.length - 1) {
          lineIndex += 1;
          charIndex = 0;
          wait(140 + Math.random() * 180, tick);
          return;
        }
        return;
      }
      const ch = line[charIndex - 1];
      const pause = ch === " " ? 40 + Math.random() * 60 : /[.!?…]/.test(ch) ? 220 + Math.random() * 180 : 16 + Math.random() * 34;
      wait(pause, tick);
    };
    wait(startDelay, tick);
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [started, reduce, textKey, startDelay, lines]);

  const fullText = lines.join(" ");

  return (
    <h2 ref={ref} className={className} aria-label={fullText} style={{ minHeight: `${Math.max(1, lines.length) * 0.98}em` }}>
      {/* Real text for crawlers, screen readers and no-JS; the animated copy stays aria-hidden. */}
      <span className="sr-only">{fullText}</span>
      {lines.map((line, index) => {
        const typed = reduce ? line.length : Math.min(counts[index] ?? 0, line.length);
        const active = !reduce && started && typed < line.length;
        return (
          <span key={`${line}-${index}`} className="typewriter-line" aria-hidden="true">
            <span className="typewriter-ghost">{line}</span>
            <span className={`typewriter-text ${gradientLine === index ? "text-metallic" : ""}`}>
              {line.slice(0, typed)}
              {active ? <span className="typewriter-cursor" /> : null}
            </span>
          </span>
        );
      })}
    </h2>
  );
}
