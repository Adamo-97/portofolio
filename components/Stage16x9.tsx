"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  baseW?: number;           // design width
  baseH?: number;           // design height (16:9 → e.g. 1400 x 788)
  className?: string;
  children: React.ReactNode;
};

/**
 * A responsive fixed-aspect (16:9 by default) stage container that scales its contents
 * to fit inside the available parent space while preserving the original design width
 * and height. The component measures its own rendered size using a ResizeObserver and
 * applies a uniform CSS scale transform to the inner content wrapper.
 *
 * The inner wrapper is absolutely centered (via translate +50/-50) so that scaling
 * occurs from the center point, preventing layout drift when resizing.
 *
 * @param baseW - The design (unscaled) width in pixels of the stage content. Defaults to 1400.
 * @param baseH - The design (unscaled) height in pixels of the stage content. Defaults to 788.
 * @param className - Optional additional class names applied to the outer container.
 * @param children - React children to render inside the scaled stage.
 *
 * @remarks
 * - The scaling factor is computed as the minimum ratio of available width to baseW
 *   and available height to baseH, ensuring the entire design fits without cropping.
 * - If the computed scale would be zero or negative (defensive safeguard), a scale
 *   of 1 is used instead.
 * - The outer container should have a bounded size (e.g., via flex or explicit
 *   height) so that ResizeObserver reports meaningful dimensions.
 * - Because a CSS transform is used, layout inside the inner wrapper should rely
 *   on the base (unscaled) design measurements; do not mix scaled measurements
 *   with external layout calculations.
 *
 * @performance
 * ResizeObserver callbacks are lightweight here (a single scale computation).
 * Avoid nesting many instances deeply if performance becomes a concern.
 *
 * @accessibility
 * Scaling via transform does not inherently impact screen readers, but ensure
 * that any text remains legible at reduced scales; consider responsive
 * adjustments if extreme downscaling occurs.
 *
 * @example
 * <div className="w-full h-[60vh]">
 *   <Stage16x9 baseW={1920} baseH={1080} className="bg-neutral-900">
 *     <YourScene />
 *   </Stage16x9>
 * </div>
 *
 * @example
 * // Using default 1400x788 design size
 * <Stage16x9>
 *   <Dashboard />
 * </Stage16x9>
 */
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
