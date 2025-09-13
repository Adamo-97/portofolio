// components/home/FloatingCards.tsx
"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** Observe the pixel width of the wrapper (the absolutely-positioned container). */
function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setW(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    update();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);
  return { ref, w };
}

type UiCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;

  /** Which wrapper edge to hug */
  side: "left" | "right";

  /** Rotation (deg) and offsets */
  rotateDeg?: number;
  insetX?: number;   // px from the side (0 = touch the edge)
  offsetY?: number;  // px nudge relative to vertical center

  /** Blur corner */
  blurCorner: "bl" | "br";

  /** Explicit pixel width (height will hug content) */
  widthPx: number;
};

/** Universe-style card, pinned to left/right edge, vertically centered on wrapper */
function UiCard({
  children,
  className = "",
  style,
  side,
  rotateDeg = 0,
  insetX = 0,
  offsetY = 0,
  blurCorner,
  widthPx,
}: UiCardProps) {
  const origin = side === "left" ? "center left" : "center right";
  const edgePos = side === "left" ? { left: insetX } : { right: insetX };
  const blurPos = blurCorner === "bl" ? "-left-1/2 -bottom-1/2" : "-right-1/2 -bottom-1/2";

  // Scale blur relative to card width (reference card width ~192px)
  const blurScale = widthPx / 192; // 1.0 at 192px wide
  const blurW = Math.round(224 * blurScale); // base w-56 (224px)
  const blurH = Math.round(192 * blurScale); // base h-48 (192px)

  return (
    <div
      className={`absolute drop-shadow-xl overflow-hidden rounded-xl bg-[#3d3c3d] ${className}`}
      style={{
        width: `${widthPx}px`,
        top: `calc(50% + ${offsetY}px)`,
        ...edgePos,
        transform: `translateY(-50%) rotate(${rotateDeg}deg)`,
        transformOrigin: origin,
        ...style,
      }}
    >
      {/* content panel: height grows with text */}
      <div className="relative z-[1] m-[2px] rounded-xl bg-[#323132] text-white font-urbanist">
        <div className="px-3 py-3 text-[14px] leading-snug text-center">{children}</div>
      </div>

      {/* same Universe blur shape, but your blue; scaled to card width */}
      <div
        className={`pointer-events-none absolute bg-cornflowerblue-100 blur-[50px] ${blurPos}`}
        style={{ width: `${blurW}px`, height: `${blurH}px` }}
      />
    </div>
  );
}

type Props = {
  className?: string;

  /** Optional per-card style overrides (still pinned to edges) */
  leftStyle?: CSSProperties;
  rightStyle?: CSSProperties;

  /** Experience counter start year (increments every Jan 1) */
  expStartYear?: number;

  /** Rotations & insets & vertical nudges */
  leftRotateDeg?: number;    // default -15
  rightRotateDeg?: number;   // default +15
  leftInsetX?: number;       // px from left edge (can be negative to overflow)
  rightInsetX?: number;      // px from right edge
  leftOffsetY?: number;      // px relative to vertical center
  rightOffsetY?: number;

  /** Responsive width controls (per card) — scale with wrapper width */
  leftWidthRatio?: number;   // portion of wrapper width (default ~0.27)
  rightWidthRatio?: number;  // portion of wrapper width
  leftMinWidth?: number;     // clamp in px (default 150)
  leftMaxWidth?: number;     // clamp in px (default 240)
  rightMinWidth?: number;    // clamp in px (default 150)
  rightMaxWidth?: number;    // clamp in px (default 240)
};

export default function FloatingCards({
  className = "",
  leftStyle,
  rightStyle,
  expStartYear = new Date().getFullYear(),
  leftRotateDeg = -15,
  rightRotateDeg = 15,
  leftInsetX = 0,
  rightInsetX = 0,
  leftOffsetY = 0,
  rightOffsetY = 0,
  leftWidthRatio = 0.27,   // ~192px when wrapper is 720px
  rightWidthRatio = 0.27,
  leftMinWidth = 150,
  leftMaxWidth = 240,
  rightMinWidth = 150,
  rightMaxWidth = 240,
}: Props) {
  const years = Math.max(0, new Date().getFullYear() - expStartYear);

  // Measure wrapper width (this component is rendered as absolute inset-0 inside the portrait wrapper)
  const { ref, w: wrapperW } = useContainerWidth();

  // Compute responsive widths (clamped)
  const leftWidthPx = Math.max(leftMinWidth, Math.min(leftMaxWidth, Math.round(wrapperW * leftWidthRatio)));
  const rightWidthPx = Math.max(rightMinWidth, Math.min(rightMaxWidth, Math.round(wrapperW * rightWidthRatio)));

  return (
    <div ref={ref} className={`pointer-events-none ${className}`}>
      {/* LEFT — absolute LEFT edge, vertically centered */}
      <UiCard
        side="left"
        rotateDeg={leftRotateDeg}
        insetX={leftInsetX}
        offsetY={leftOffsetY}
        blurCorner="br"
        widthPx={leftWidthPx}
        style={leftStyle}
      >
        <div className="text-[22px] font-semibold leading-none">+{years}</div>
        <div className="mt-1 text-[12px] text-white/80">years of experience</div>
      </UiCard>

      {/* RIGHT — absolute RIGHT edge, vertically centered */}
      <UiCard
        side="right"
        rotateDeg={rightRotateDeg}
        insetX={rightInsetX}
        offsetY={rightOffsetY}
        blurCorner="bl"
        widthPx={rightWidthPx}
        style={rightStyle}
      >
        <div className="text-[12px] uppercase tracking-wide text-white/70">Education</div>
        <div className="mt-1 font-semibold">Bachelor in Sc Software Engineer</div>
      </UiCard>
    </div>
  );
}
