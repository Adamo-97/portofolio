"use client";

import { useEffect, useState } from "react";

export type StageSpec = {
  cols: number;
  rows: number;
  cardW: number;      // base design width of a card (px)
  cardRatio: number;  // width / height (e.g., 4/3)
  gap: number;        // gap between cards (px)
  padY: number;       // desired top/bottom padding (px) at 1× scale
};

export function useViewportStage(spec: StageSpec) {
  const { cols, rows, cardW, cardRatio, gap, padY } = spec;
  const baseW = cols * cardW + (cols - 1) * gap;
  const baseH = rows * (cardW / cardRatio) + (rows - 1) * gap;

  const [scale, setScale] = useState(1);
  const [availH, setAvailH] = useState(0);

  useEffect(() => {
    const onResize = () => {
      const header = typeof document !== "undefined" ? document.querySelector("header") : null;
      const headerH = header ? (header as HTMLElement).offsetHeight : 0;
      // Horizontal room (a little side padding for safety)
      const vw = window.innerWidth - 32;
      // Vertical room minus header and desired paddings top/bottom
      const vh = window.innerHeight - headerH - padY * 2;
      setAvailH(vh);

      // Fit stage inside viewport in both axes, clamp to a min scale
      const s = Math.max(0.5, Math.min(vw / baseW, vh / baseH));
      setScale(s);
    };
    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [baseW, baseH, padY]);

  return {
    scale,
    baseW,
    baseH,
    stageStyle: {
      width: baseW,
      height: baseH,
      transform: `scale(${scale})`,
      transformOrigin: "50% 50%",
    } as React.CSSProperties,
    wrapperStyle: (headerAwarePadY?: number) => ({
      height: `${availH + (headerAwarePadY ?? padY) * 2}px`,
      padding: `${headerAwarePadY ?? padY}px 16px`,
    }) as React.CSSProperties,
  };
}