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
  const flat = lines.join("");
  const total = flat.length;
  const offsets = lines.reduce<number[]>((acc, _line, index) => {
    acc.push(index === 0 ? 0 : acc[index - 1] + lines[index - 1].length);
    return acc;
  }, []);
  const [started, setStarted] = useState(false);
  const [typed, setTyped] = useState(() => (reduce ? total : 0));

  // Start when the heading approaches the viewport. Uses scroll/resize geometry
  // rather than IntersectionObserver so it still works in throttled/hidden tabs.
  useEffect(() => {
    if (reduce || started || total === 0) return;
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
  }, [reduce, started, total]);

  useEffect(() => {
    if (reduce) {
      setTyped(total);
      return;
    }
    if (!started || total === 0) return;
    const lineEnds = new Set<number>();
    let running = 0;
    for (const line of lines) {
      running += line.length;
      lineEnds.add(running);
    }
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number, fn: () => void) => {
      const t = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(t);
    };
    let count = 0;
    const step = () => {
      if (cancelled) return;
      count += 1;
      setTyped(count);
      if (count >= total) return;
      const ch = flat.charAt(count - 1);
      const pause = lineEnds.has(count)
        ? 150 + Math.random() * 180
        : ch === " "
          ? 40 + Math.random() * 60
          : /[.!?…]/.test(ch)
            ? 220 + Math.random() * 180
            : 16 + Math.random() * 34;
      wait(pause, step);
    };
    wait(startDelay, step);
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
    // `lines`/`flat` are derived from `textKey`; keeping the array out of the
    // dependency list prevents an inline array prop from restarting the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, reduce, total, textKey, startDelay]);

  const fullText = lines.join(" ");

  return (
    <h2 ref={ref} className={className} aria-label={fullText} style={{ minHeight: `${Math.max(1, lines.length) * 0.98}em` }}>
      {/* Real text for crawlers, screen readers and no-JS; the animated copy stays aria-hidden. */}
      <span className="sr-only">{fullText}</span>
      {lines.map((line, index) => {
        const offset = offsets[index] ?? 0;
        const visible = Math.max(0, Math.min(typed - offset, line.length));
        const active = !reduce && typed >= offset && typed < offset + line.length;
        return (
          <span key={`${line}-${index}`} className="typewriter-line" aria-hidden="true">
            <span className="typewriter-ghost">{line}</span>
            <span className={`typewriter-text ${gradientLine === index ? "text-metallic" : ""}`}>
              {line.slice(0, visible)}
              {active ? <span className="typewriter-cursor" /> : null}
            </span>
          </span>
        );
      })}
    </h2>
  );
}
