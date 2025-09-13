"use client";
import { useEffect, useState } from "react";

type Props = {
  start?: boolean;
  words?: string[];
  /** How long each *subsequent* word is shown */
  dwellMs?: number;
  /** Delay before showing the first word */
  initialDelayMs?: number;
  /** How long the *first* word (Designer) stays before changing */
  firstDwellMs?: number;
  /** Transition duration per word */
  transitionMs?: number;
  /** "fade" (no slide) or "fadeSlide" (tiny rise) */
  effect?: "fade" | "fadeSlide";
  /** Fire when the last word settles (no loop) */
  onDone?: () => void;
  className?: string;
};

export default function RoleCycler({
  start = false,
  words = ["Designer", "Developer", "Engineer"],
  dwellMs = 700,
  initialDelayMs = 180,
  firstDwellMs = 1000,   // ← Designer holds longer
  transitionMs = 300,
  effect = "fade",
  onDone,
  className = "",
}: Props) {
  const [i, setI] = useState<number | null>(null); // null until we show the first word

  // Kick the first word after initialDelayMs
  useEffect(() => {
    if (!start) return;
    const t = setTimeout(() => setI(0), initialDelayMs);
    return () => clearTimeout(t);
  }, [start, initialDelayMs]);

  // Advance through words with custom dwell timings
  useEffect(() => {
    if (i === null) return;
    const last = words.length - 1;
    if (i >= last) {
      onDone?.();
      return;
    }
    const delay = i === 0 ? firstDwellMs : dwellMs;
    const t = setTimeout(() => setI((v) => (v === null ? 0 : v + 1)), delay);
    return () => clearTimeout(t);
  }, [i, words.length, dwellMs, firstDwellMs, onDone]);

  // Nothing to show yet
  if (i === null) return null;

  return (
    <span
      className={[
        "inline-block relative align-baseline",
        className,
      ].join(" ")}
      style={{ willChange: "opacity, transform" }}
    >
      <span
        key={`${i}-${words[i]}`}
        className={effect === "fade" ? "rc-fade" : "rc-fadeslide"}
        style={{ ["--rcdur" as any]: `${transitionMs}ms` }}
      >
        {words[i]}
      </span>

      <style jsx>{`
        .rc-fade {
          display: inline-block;
          animation: rc_fade var(--rcdur) ease forwards;
        }
        .rc-fadeslide {
          display: inline-block;
          animation: rc_fadeslide var(--rcdur) cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes rc_fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes rc_fadeslide {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rc-fade, .rc-fadeslide { animation: none !important; }
        }
      `}</style>
    </span>
  );
}
