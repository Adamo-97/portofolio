"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  baseW?: number;           // design width
  baseH?: number;           // design height (16:9 → e.g. 1400 x 788)
  className?: string;
  children: React.ReactNode;
};

export default function Stage16x9({
  baseW = 1400,
  baseH = 788,
  className = "",
  children,
}: Props) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = outerRef.current;
    if (!node) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const s = Math.min(width / baseW, height / baseH);
      setScale(s > 0 ? s : 1);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [baseW, baseH]);

  return (
    <div ref={outerRef} className={["relative w-full h-full", className].join(" ")}>
      {/* Absolutely center the base-sized canvas and scale it */}
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width: baseW,
          height: baseH,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
