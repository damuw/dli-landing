import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Reveal({ children, className = "", delay = 0, direction = "up" }: { children: ReactNode; className?: string; delay?: number; direction?: "up" | "left" | "right" }) {
  const reduce = useReducedMotion();
  const offset = direction === "up" ? { y: 42 } : direction === "left" ? { x: -48 } : { x: 48 };
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { ...offset, scale: 0.985 }}
      whileInView={reduce ? undefined : { x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.85, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function FlyWords({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, index) => (
        <motion.span
          aria-hidden="true"
          className="inline-block will-change-transform"
          key={`${word}-${index}`}
          initial={reduce ? false : { x: (index % 2 ? 1 : -1) * 70, scale: 0.96 }}
          animate={{ x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: delay + index * 0.07, ease: EASE_OUT }}
        >
          {word}{index < text.split(" ").length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, body, dark = false, className = "" }: { eyebrow: string; title: string; body?: string; dark?: boolean; className?: string }) {
  return (
    <div className={className}>
      <p className={`eyebrow ${dark ? "text-[#8ddff1]" : "text-[#31567c]"}`}>{eyebrow}</p>
      <h2 className={`section-title mt-5 ${dark ? "text-[#f5f6f8]" : "text-[#0a1424]"}`}>{title}</h2>
      {body && <p className={`body-copy mt-6 max-w-2xl ${dark ? "text-[#b7c4d4]" : "text-[#42536a]"}`}>{body}</p>}
    </div>
  );
}
