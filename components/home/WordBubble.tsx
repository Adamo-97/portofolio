"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  text?: string;                 // safe optional
  svgSrc: string;
  padPx?: number;
  padRatio?: number;
  yNudge?: number;
  className?: string;

  // typing controls
  typeIn?: boolean;
  startTyping?: boolean;
  typeSpeedMs?: number;
  onTypedDone?: () => void;

  // fade-in of the surrounding SVG AFTER typing finishes
  revealBubbleAfterTyped?: boolean;
  bubbleFadeMs?: number;
  bubbleDelayMs?: number;
};

export default function WordBubble({
  text,
  svgSrc,
  padPx,
  padRatio = 0.08,
  yNudge = 2,
  className = "",

  typeIn = false,
  startTyping = false,
  typeSpeedMs = 70,
  onTypedDone,

  revealBubbleAfterTyped = true,
  bubbleFadeMs = 260,
  bubbleDelayMs = 40,
}: Props) {
  const safeText = text ?? "";
  const wordRef = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0, pad: 0 });
  const [n, setN] = useState(typeIn ? 0 : safeText.length);
  const [bubbleVisible, setBubbleVisible] = useState(!revealBubbleAfterTyped);

  // typing
  useEffect(() => {
    if (!typeIn || !startTyping) return;
    if (n >= safeText.length) return;
    const t = setTimeout(() => setN(v => v + 1), typeSpeedMs);
    return () => clearTimeout(t);
  }, [typeIn, startTyping, n, safeText.length, typeSpeedMs]);

  // when typing done → optional bubble fade-in
  useEffect(() => {
    if (typeIn && startTyping && n === safeText.length) {
      onTypedDone?.();
      if (revealBubbleAfterTyped) {
        const t = setTimeout(() => setBubbleVisible(true), bubbleDelayMs);
        return () => clearTimeout(t);
      }
    }
  }, [typeIn, startTyping, n, safeText.length, revealBubbleAfterTyped, bubbleDelayMs, onTypedDone]);

  // measure around growing text
  useEffect(() => {
    const el = wordRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      const fontSize = parseFloat(getComputedStyle(el).fontSize || "0");
      const pad = typeof padPx === "number" ? padPx : Math.round(fontSize * padRatio);
      setBox({ w: Math.ceil(r.width) + pad * 2, h: Math.ceil(r.height) + pad * 2, pad });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, [padPx, padRatio, n]);

  const shown = typeIn ? safeText.slice(0, n) : safeText;

  return (
    <span className="relative inline-block align-baseline">
      <span ref={wordRef} className={`relative z-10 inline-block ${className}`}>{shown}</span>

      {box.w > 0 && (
        <span
          aria-hidden
          className="absolute -z-10 pointer-events-none"
          style={{
            width: `${box.w}px`,
            height: `${box.h}px`,
            top: `${-box.pad + yNudge}px`,
            left: `${-box.pad}px`,
            opacity: bubbleVisible ? 1 : 0,
            transition: `opacity ${bubbleFadeMs}ms ease-out`,
          }}
        >
          <Image src={svgSrc} alt="" fill sizes="100vw" className="object-contain" />
        </span>
      )}
    </span>
  );
}
