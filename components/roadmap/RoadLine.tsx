"use client";

export default function RoadLine({
  width,
  height,
  accentColor = "#18a1fd",
  strokeWidth = 3,
  padding = 24,
  dash = 26,
  gap = 14,
  animMs = 900,
  vertical = false,
  mode = "overlay", // "overlay" (absolute) | "divider" (inline grid cell)
}: {
  width: number;
  height: number;
  accentColor?: string;
  strokeWidth?: number;
  padding?: number;
  dash?: number;
  gap?: number;
  animMs?: number;
  vertical?: boolean;
  mode?: "overlay" | "divider";
}) {
  const w = Math.max(width, 1);
  const h = Math.max(height, 1);

  // 🔹 compute the visible length + how many dash "slots"
  const len = Math.max(0, (vertical ? h : w) - padding * 2);

  const Wrapper =
    mode === "overlay"
      ? (props: any) => (
          <div
            {...props}
            className="pointer-events-none absolute inset-0 z-0"
            style={{ opacity: 0, animation: `roadFade ${animMs}ms ease forwards`, ...(props.style || {}) }}
            aria-hidden
          />
        )
      : (props: any) => (
          <div
            {...props}
            className="pointer-events-none w-full h-full z-0"
            style={{ opacity: 0, animation: `roadFade ${animMs}ms ease forwards`, ...(props.style || {}) }}
            aria-hidden
          />
        );

  return (
    <Wrapper>
      <svg className="w-full h-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <marker id="rdArrow" markerWidth="14" markerHeight="14" refX="11" refY="7" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,2 L12,7 L0,12 Z" fill={accentColor} opacity="0.92" />
          </marker>
        </defs>

        {vertical ? (
          <line
            x1={w / 2} y1={padding} x2={w / 2} y2={h - padding}
            stroke={accentColor} strokeOpacity="0.9" strokeWidth={strokeWidth} strokeLinecap="round"
            vectorEffect="non-scaling-stroke" strokeDasharray={`${dash} ${gap}`} markerEnd="url(#rdArrow)"
            // 👇 smooth reveal from start to arrow
            style={{
              strokeDashoffset: len,
              animation: `dashPop ${animMs}ms cubic-bezier(0.4, 0, 0.2, 1) forwards, roadFade ${Math.min(animMs, 500)}ms ease forwards`,
            }}
          />
        ) : (
          <line
            x1={padding} y1={h / 2} x2={w - padding} y2={h / 2}
            stroke={accentColor} strokeOpacity="0.9" strokeWidth={strokeWidth} strokeLinecap="round"
            vectorEffect="non-scaling-stroke" strokeDasharray={`${dash} ${gap}`} markerEnd="url(#rdArrow)"
            style={{
              strokeDashoffset: len,
              animation: `dashPop ${animMs}ms cubic-bezier(0.4, 0, 0.2, 1) forwards, roadFade ${Math.min(animMs, 500)}ms ease forwards`,
            }}
          />
        )}
      </svg>

      {/* keyframes use the computed `len` so it reveals from start → arrow */}
      <style>{`
        @keyframes dashPop { from { stroke-dashoffset: ${len}; } to { stroke-dashoffset: 0; } }
        @keyframes roadFade { from {opacity:0; filter: blur(1px);} to {opacity:1; filter:none;} }
      `}</style>
    </Wrapper>
  );
}
