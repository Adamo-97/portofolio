"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  text?: string;
  vectorSrc?: string;
  className?: string;
  vectorScale?: number;    // ← keep this
  offsetTopPx?: number;
  offsetRightPx?: number;

  show?: boolean;          // ← controls entrance; stays visible
  durationMs?: number;
  onDone?: () => void;
};

export default function HelloBadge({
  text = "Hello!",
  vectorSrc = "/home/Vector-1.svg",
  className = "",
  vectorScale = 0.75,
  offsetTopPx = 2,
  offsetRightPx = 2,
  show = false,
  durationMs = 520,
  onDone,
}: Props) {
  const pillRef = useRef<HTMLSpanElement>(null);
  const [svgSize, setSvgSize] = useState(0);

  useEffect(() => {
    const el = pillRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setSvgSize(Math.round(r.height * vectorScale));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, [vectorScale]);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onDone?.(), durationMs + 60);
    return () => clearTimeout(t);
  }, [show, durationMs, onDone]);

  return (
    <span className="relative inline-block">
      <span
        ref={pillRef}
        className={[
          "relative z-10 inline-flex items-center justify-center",
          "rounded-full bg-cornflowerblue-100 text-white font-urbanist",
          "tracking-[-0.01em] leading-none",
          "text-[clamp(1rem,2.5vw,1.375rem)] px-[1em] py-[0.5em]",
          "transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
          show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95",
          className,
        ].join(" ")}
        style={{ willChange: "opacity, transform" }}
      >
        {text}
      </span>

      {svgSize > 0 && (
        <Image
          src={vectorSrc}
          alt=""
          width={svgSize}
          height={svgSize}
          className={[
            "pointer-events-none absolute",
            "transition-all duration-560 ease-[cubic-bezier(.22,1,.36,1)]",
            show ? "opacity-100 translate-x-0 -translate-y-0 rotate-0" : "opacity-0 translate-x-2 -translate-y-1 rotate-[6deg]",
          ].join(" ")}
          style={{ top: `-${offsetTopPx}px`, right: `-${offsetRightPx}px`, willChange: "opacity, transform" }}
        />
      )}
    </span>
  );
}
