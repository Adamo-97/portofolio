"use client";

import { useEffect, useState } from "react";
import { clamp } from "../lib/math";

type Options = {
  vh: number;
  seBottom: number | null;     // bottom of "Software Engineer" span
  textOverlap: number;         // desired *visible* overlap (e.g., 100)
  slideScale: number;          // from useSlideScale
  minH: number;                // portrait min height
};

export function usePortraitHeight({
  vh,
  seBottom,
  textOverlap,
  slideScale,
  minH,
}: Options) {
  const [artHeight, setArtHeight] = useState(minH);

  useEffect(() => {
    if (!vh || !seBottom) return;

    // Keep the *visible* overlap constant even when slide is scaled:
    // pre-overlap = textOverlap / slideScale (so after scaling, it's == textOverlap)
    const overlapPx = textOverlap / (slideScale || 1);

    // object-bottom: imageTop = vh - containerHeight
    // we want imageTop = seBottom - overlapPx
    const desired = Math.round(vh - (seBottom - overlapPx));

    const maxHByVh = Math.floor(vh * 0.995); // allow near-full height (fixes your 2K cap)
    setArtHeight(clamp(desired, minH, maxHByVh));
  }, [vh, seBottom, textOverlap, slideScale, minH]);

  return artHeight;
}
