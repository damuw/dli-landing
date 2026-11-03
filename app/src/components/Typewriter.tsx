import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Typewriter heading.
 *
 * Ported from the Motion (motion.dev) "typewriter change content" behaviour:
 * text is revealed character by character with natural typing cadence (variable
 * speed, pauses at punctuation/spaces), a blinking cursor follows the active line,
 * and when the text prop changes the animation retires and re-types.
 *
 * Here the content is expressed as ordered lines so the design's line breaks
 * (philosophy thesis) are preserved while still feeling typewriter-driven.
 */
type TypewriterProps = {
  /** Lines rendered top → bottom, typed sequentially. */
  lines: string[];
  className?: string;
  /** Zero-based index of the line that renders with the metallic gradient. */
  gradientLine?: number;
  /** Initial delay in ms before typing starts. */
  startDelay?: number;
};

export function Typewriter({ lines, className = "", gradientLine = -1, startDelay = 0 }: TypewriterProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [counts, setCounts] = useState<number[]>(() => (reduce ? lines.map((line) => line.length) : lines.map(() => 0)));

  useEffect(() => {
    if (reduce) {
      setCounts(lines.map((line) => line.length));
      return;
    }
    if (!inView) return;
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
          const nextIndex = lineIndex + 1;
          lineIndex = nextIndex;
          charIndex = 0;
          setCounts((prev) => {
            const next = [...prev];
            next[nextIndex] = 0;
            return next;
          });
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
  }, [inView, reduce, lines, startDelay]);

  return (
    <h2 ref={ref} className={className} aria-label={lines.join(" ")}>
      {lines.map((line, index) => {
        const active = !reduce && inView && (counts[index] ?? 0) > 0 && (counts[index] ?? 0) < line.length;
        const text = line.slice(0, reduce ? line.length : Math.min(counts[index] ?? 0, line.length));
        return (
          <span key={`${line}-${index}`} aria-hidden="true" className={`typewriter-line block ${gradientLine === index ? "text-metallic" : ""}`}>
            {text}
            {active ? <span className="typewriter-cursor" aria-hidden="true" /> : null}
          </span>
        );
      })}
    </h2>
  );
}
