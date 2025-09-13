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

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const norm  = (x: number, a: number, b: number) => (x - a) / (b - a);
const sat   = (t: number) => Math.max(0, Math.min(1, t));

/** Ratio grows aggressively with width; shrinks more on very small screens. */
function autoRatioForWidth(w: number, boost = 1) {
  let base: number;
  if (w <= 360) base = 0.22;
  else if (w <= 480) base = lerp(0.22, 0.25, sat(norm(w, 360, 480)));
  else if (w <= 768) base = lerp(0.26, 0.32, sat(norm(w, 480, 768)));
  else if (w <= 1280) base = lerp(0.34, 0.40, sat(norm(w, 768, 1280)));
  else if (w <= 1600) base = lerp(0.40, 0.46, sat(norm(w, 1280, 1600)));
  else if (w <= 2200) base = lerp(0.46, 0.52, sat(norm(w, 1600, 2200)));
  else base = 0.54; // ultrawide base
  const r = base * boost;
  return Math.min(r, 0.58); // hard cap
}

/** Outward (negative) inset increases center gap hard as width grows. */
function autoInsetForWidth(w: number, boost = 1) {
  if (w <= 480) return 0; // safe on small screens
  // from -32px around small tablets → up to ~-360px at 1920, -460px at 2560+
  const t = sat(norm(w, 480, 1920));
  const base = -Math.round(lerp(32, 360, t));
  const extraWide = w > 1920 ? -Math.round(lerp(360, 460, sat(norm(w, 1920, 2560)))) : base;
  return Math.round((w > 1920 ? extraWide : base) * boost);
}

/** Max width cap scales with width so big screens get beefier cards. */
function autoMaxWidthForWidth(w: number, boost = 1) {
  let base: number;
  if (w <= 400) base = 240;
  else if (w <= 768) base = lerp(260, 340, sat(norm(w, 400, 768)));
  else if (w <= 1280) base = lerp(360, 440, sat(norm(w, 768, 1280)));
  else if (w <= 1600) base = 520;
  else if (w <= 2200) base = 600;
  else base = 680;
  return Math.round(base * boost);
}

type UiCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  side: "left" | "right";
  rotateDeg?: number;
  insetX?: number;
  offsetY?: number;
  blurCorner: "bl" | "br";
  widthPx: number;
  scale?: number;
  enterDelayMs?: number;
  enterDurationMs?: number;
};

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
  scale,
  enterDelayMs = 0,
  enterDurationMs = 420,
}: UiCardProps) {
  const origin = side === "left" ? "center left" : "center right";
  const edgePos = side === "left" ? { left: insetX } : { right: insetX };
  const blurPos = blurCorner === "bl" ? "-left-1/2 -bottom-1/2" : "-right-1/2 -bottom-1/2";

  // Responsive scale based on reference width 192px
  const s = clamp(scale ?? widthPx / 192, 0.5, 2.4);

  // Corner math: inner has m-[2px]; make outer = inner + 2 for a perfect tangent
  const innerMargin = 2;
  const innerRadius = Math.round(12 * s);
  const outerRadius = innerRadius + innerMargin;

  const pad = Math.round(12 * s);
  const titleSize = 22 * s;
  const bodySize = 12 * s;

  const blurScale = widthPx / 192;
  const blurW = Math.round(260 * blurScale);
  const blurH = Math.round(210 * blurScale);

  // Enter animation (fade + slide up)
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setEntered(true), prefersReduced ? 0 : enterDelayMs);
    return () => window.clearTimeout(t);
  }, [enterDelayMs]);

  const enterOffset = Math.round(22 * s);
  const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <div
      className={`absolute drop-shadow-xl overflow-hidden bg-[#3d3c3d] ${className}`}
      style={{
        width: `${widthPx}px`,
        top: `calc(50% + ${offsetY}px)`,
        ...edgePos,
        transform: `translateY(${entered ? "-50%" : `calc(-50% + ${enterOffset}px)`}) rotate(${rotateDeg}deg)`,
        transformOrigin: origin,
        opacity: entered ? 1 : 0,
        willChange: "transform, opacity",
        transition: [
          `transform ${enterDurationMs}ms ${easing}`,
          `opacity ${Math.max(enterDurationMs - 60, 200)}ms ${easing}`,
          "width 220ms ease",
          "top 220ms ease",
          "left 220ms ease",
          "right 220ms ease",
        ].join(", "),
        borderRadius: outerRadius,
        ...style,
      }}
    >
      <div
        className="relative z-[1] m-[2px] bg-[#323132] text-white font-urbanist"
        style={{
          borderRadius: innerRadius,
          padding: pad,
          transition: "padding 220ms ease, border-radius 220ms ease",
        }}
      >
        <div
          className="text-center leading-snug"
          style={
            {
              ["--titleSize" as any]: `${titleSize}px`,
              ["--bodySize" as any]: `${bodySize}px`,
            } as CSSProperties
          }
        >
          {children}
        </div>
      </div>

      <div
        className={`pointer-events-none absolute bg-cornflowerblue-100 blur-[50px] ${blurPos}`}
        style={{ width: `${blurW}px`, height: `${blurH}px`, transition: "width 220ms ease, height 220ms ease" }}
      />
    </div>
  );
}

type Props = {
  className?: string;
  leftStyle?: CSSProperties;
  rightStyle?: CSSProperties;
  expStartYear?: number;
  leftRotateDeg?: number;
  rightRotateDeg?: number;

  /** Optional manual overrides. If omitted, responsive auto values kick in. */
  leftInsetX?: number;
  rightInsetX?: number;
  leftOffsetY?: number;
  rightOffsetY?: number;
  leftWidthRatio?: number;
  rightWidthRatio?: number;
  leftMinWidth?: number;
  leftMaxWidth?: number;
  rightMinWidth?: number;
  rightMaxWidth?: number;

  // Stagger controls
  enterBaseDelayMs?: number;
  enterStaggerMs?: number;
  enterDurationMs?: number;

  // NEW: global intensity knobs
  sizeBoost?: number; // multiplies size growth on big screens (1 = default)
  gapBoost?: number;  // multiplies center gap growth (1 = default)
};

export default function FloatingCards({
  className = "",
  leftStyle,
  rightStyle,
  expStartYear = new Date().getFullYear(),

  leftRotateDeg = -12,
  rightRotateDeg = 12,

  leftInsetX,
  rightInsetX,
  leftOffsetY,
  rightOffsetY,
  leftWidthRatio,
  rightWidthRatio,
  leftMinWidth,
  leftMaxWidth,
  rightMinWidth,
  rightMaxWidth,

  enterBaseDelayMs = 80,
  enterStaggerMs = 140,
  enterDurationMs = 480,

  sizeBoost = 1, // try 1.15–1.35 to go bigger
  gapBoost = 1,  // try 1.2–1.6 for wider center gap
}: Props) {
  const years = Math.max(0, new Date().getFullYear() - expStartYear);
  const { ref, w: wrapperW } = useContainerWidth();

  const isMobile = wrapperW <= 520;

  // Width ratios (auto unless explicitly passed)
  const L_ratio = leftWidthRatio  ?? autoRatioForWidth(wrapperW, sizeBoost);
  const R_ratio = rightWidthRatio ?? autoRatioForWidth(wrapperW, sizeBoost);

  // Insets (negative values increase the gap on wide screens)
  const autoInset = autoInsetForWidth(wrapperW, gapBoost);
  const L_insetBase = leftInsetX  ?? autoInset;
  const R_insetBase = rightInsetX ?? autoInset;

  // On tight mobile, clamp outward insets to 0 to avoid spill
  const L_inset = isMobile ? Math.max(0, L_insetBase) : L_insetBase;
  const R_inset = isMobile ? Math.max(0, R_insetBase) : R_insetBase;

  // Vertical offsets (subtle lift on larger screens)
  const L_offY = leftOffsetY  ?? (isMobile ? 0 : 0);
  const R_offY = rightOffsetY ?? (isMobile ? 6 : 12);

  // Min/max widths (auto unless explicitly passed)
  const L_min = leftMinWidth  ?? (isMobile ? 150 : 190);
  const R_min = rightMinWidth ?? (isMobile ? 150 : 190);
  const L_max = leftMaxWidth  ?? autoMaxWidthForWidth(wrapperW, sizeBoost);
  const R_max = rightMaxWidth ?? autoMaxWidthForWidth(wrapperW, sizeBoost);

  // Desired widths from ratios
  const desiredLeft  = Math.round(wrapperW * L_ratio);
  const desiredRight = Math.round(wrapperW * R_ratio);

  // Hard cap by remaining space from pinned edge (avoid spill)
  const maxLeftByInset  = Math.max(120, wrapperW - L_inset - 8);
  const maxRightByInset = Math.max(120, wrapperW - R_inset - 8);

  const leftWidthPx  = clamp(desiredLeft,  L_min, Math.min(L_max, maxLeftByInset));
  const rightWidthPx = clamp(desiredRight, R_min, Math.min(R_max, maxRightByInset));

  const leftScale  = clamp(leftWidthPx  / 192, 0.5, 2.4);
  const rightScale = clamp(rightWidthPx / 192, 0.5, 2.4);

  // Stagger
  const leftDelay  = enterBaseDelayMs;
  const rightDelay = enterBaseDelayMs + enterStaggerMs;

  return (
    <div ref={ref} className={`pointer-events-none ${className}`}>
      <UiCard
        side="left"
        rotateDeg={isMobile ? Math.round((leftRotateDeg ?? -12) * 0.5) : (leftRotateDeg ?? -12)}
        insetX={L_inset}
        offsetY={L_offY}
        blurCorner="br"
        widthPx={leftWidthPx}
        scale={leftScale}
        style={leftStyle}
        enterDelayMs={leftDelay}
        enterDurationMs={enterDurationMs}
      >
        <div style={{ fontSize: "var(--titleSize)", fontWeight: 600, lineHeight: 1 }}>
          +{years}
        </div>
        <div style={{ fontSize: "var(--bodySize)", marginTop: Math.max(2, 4 * leftScale) }}>
          years of experience
        </div>
      </UiCard>

      <UiCard
        side="right"
        rotateDeg={isMobile ? Math.round((rightRotateDeg ?? 12) * 0.5) : (rightRotateDeg ?? 12)}
        insetX={R_inset}
        offsetY={R_offY}
        blurCorner="bl"
        widthPx={rightWidthPx}
        scale={rightScale}
        style={rightStyle}
        enterDelayMs={rightDelay}
        enterDurationMs={enterDurationMs}
      >
        <div style={{ fontSize: `calc(var(--bodySize) * 1.1)`, fontWeight: 600 }}>
          Bachelor in Science Software Engineering
        </div>
      </UiCard>
    </div>
  );
}
