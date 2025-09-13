"use client";

import { useMemo } from "react";

type SlideScale = {
  slideScale: number;
  style: React.CSSProperties;
};

/** Compute slide scale + style (PowerPoint slide vibe, bottom-centered). */
export function useSlideScale(vh: number, minSlideH: number): SlideScale {
  const slideScale = vh < minSlideH ? vh / minSlideH : 1;

  const style = useMemo<React.CSSProperties>(() => {
    return slideScale < 1
      ? {
          zoom: slideScale, // Chromium
          transform: `scale(${slideScale})`, // fallback
          transformOrigin: "bottom center",
          height: `${minSlideH}px`,
        }
      : { height: "100dvh" };
  }, [slideScale, minSlideH]);

  return { slideScale, style };
}
