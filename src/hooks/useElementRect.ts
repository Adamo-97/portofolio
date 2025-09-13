"use client";

import { useEffect, useState, RefObject } from "react";

/** Observe an element's DOMRect (content-box) with ResizeObserver + window resize. */
export function useElementRect<T extends HTMLElement>(
  ref: RefObject<T | null>   // <-- widened
): DOMRect | null {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      setRect(new DOMRect(r.x, r.y, r.width, r.height));
    };

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    update();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return rect;
}
