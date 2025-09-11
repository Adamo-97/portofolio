"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  svgSrc: string;
  padPx?: number;      // exact px padding (overrides ratio)
  padRatio?: number;   // padding as % of font-size (e.g., 0.08 = 8%)
  yNudge?: number;     // extra vertical tweak in px (positive moves down)
  className?: string;
};

export default function WordBubble({
  text,
  svgSrc,
  padPx,
  padRatio = 0.08,       // ~8% of font-size feels natural
  yNudge = 2,            // move bubble down a touch
  className = "",
}: Props) {
  const wordRef = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0, pad: 0 });

  useEffect(() => {
    if (!wordRef.current) return;
    const el = wordRef.current;

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
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [padPx, padRatio]);

  return (
    <span className="relative inline-block align-baseline">
      <span ref={wordRef} className={`relative z-10 inline-block ${className}`}>{text}</span>
      {box.w > 0 && (
        <span
          aria-hidden
          className="absolute -z-10 pointer-events-none"
          style={{
            width: `${box.w}px`,
            height: `${box.h}px`,
            top: `${-box.pad + yNudge}px`,
            left: `${-box.pad}px`,
          }}
        >
          <Image src={svgSrc} alt="" fill sizes="100vw" className="object-contain" />
        </span>
      )}
    </span>
  );
}
