"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  text?: string;
  vectorSrc?: string;
  className?: string;
  vectorScale?: number;      // fraction of pill height (0.6–0.9 is nice)
  offsetTopPx?: number;      // distance ABOVE the top edge (px)
  offsetRightPx?: number;    // distance RIGHT of the right edge (px)
};

export default function HelloBadge({
  text = "Hello!",
  vectorSrc = "/Vector-1.svg",
  className = "",
  vectorScale = 0.75,
  offsetTopPx = 2,
  offsetRightPx = 2,
}: Props) {
  const pillRef = useRef<HTMLSpanElement>(null);
  const [svgSize, setSvgSize] = useState(0);

  useEffect(() => {
    if (!pillRef.current) return;
    const el = pillRef.current;
    const update = () => {
      const r = el.getBoundingClientRect();
      setSvgSize(Math.round(r.height * vectorScale));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [vectorScale]);

  return (
    <span className="relative inline-block">
      <span
        ref={pillRef}
        className={[
          "relative z-10 inline-flex items-center justify-center",
          "rounded-full bg-cornflowerblue-100 text-white font-urbanist",
          "tracking-[-0.01em] leading-none",
          "text-[clamp(1rem,2.5vw,1.375rem)] px-[1em] py-[0.5em]",
          className,
        ].join(" ")}
      >
        {text}
      </span>

      {svgSize > 0 && (
        <Image
          src={vectorSrc}
          alt=""
          width={svgSize}
          height={svgSize}
          className="pointer-events-none absolute"
          // negative puts it OUTSIDE; increase numbers = push further up/right
          style={{ top: `-${offsetTopPx}px`, right: `-${offsetRightPx}px` }}
        />
      )}
    </span>
  );
}
