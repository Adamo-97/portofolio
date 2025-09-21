// components/roadmap/RoadLine.tsx
"use client";

type RoadLineProps = {
  width: number;          // container width in px
  accentColor?: string;
  strokeWidth?: number;
  dash?: number;
  gap?: number;
};

export default function RoadLine({
  width,
  accentColor = "#7dd3fc",
  strokeWidth = 3,
  dash = 18,
  gap = 12,
}: RoadLineProps) {
  const w = Math.max(width, 100); // fallback so SVG has some width

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-0"
      style={{ top: "50%", height: 10, transform: "translateY(-50%)" }}
      aria-hidden
    >

     <svg className="w-full h-full" viewBox={`0 0 ${w} 10`} preserveAspectRatio="none">
       <line x1="0" y1="5" x2={String(w)} y2="5"
          stroke={accentColor}
          strokeOpacity="0.9"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          vectorEffect="non-scaling-stroke"  // keep dashes crisp when SVG scales
          shapeRendering="geometricPrecision"
        />
      </svg>
    </div>
  );
}
