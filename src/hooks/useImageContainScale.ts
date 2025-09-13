"use client";

import { useEffect, useState } from "react";

/**
 * For object-contain/object-bottom images, compute a scale so the visible image
 * height equals the container height (eliminating any top "letterbox").
 */
export function useImageContainScale(artHeight: number, boxW: number, imgAR: number) {
  const [imgScale, setImgScale] = useState(1);

  useEffect(() => {
    if (!artHeight || !boxW || !imgAR) { setImgScale(1); return; }
    const renderedH = Math.min(artHeight, boxW * imgAR);   // "natural" contain height
    const scale = renderedH ? Math.max(1, artHeight / renderedH) : 1;
    setImgScale(scale);
  }, [artHeight, boxW, imgAR]);

  return imgScale;
}
