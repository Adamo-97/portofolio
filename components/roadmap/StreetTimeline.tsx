"use client";
import { useEffect, useRef, useState } from "react";

/** Your item shape */
export type RoadmapItem = {
  id: string;
  title: string;
  description: string;
  icon?: string; // URL in /public, e.g. "/logo-container2.svg"
};

type Props = {
  items: RoadmapItem[];
  /** dash length (px) for the lane markings */
  dash?: number;
  /** gap between dashes (px) */
  gap?: number;
  /** thickness of lane markings */
  strokeWidth?: number;
};

const DEFAULTS = {
  dash: 18,
  gap: 12,
  strokeWidth: 3,
};

export default function StreetTimeline({
  items,
  dash = DEFAULTS.dash,
  gap = DEFAULTS.gap,
  strokeWidth = DEFAULTS.strokeWidth,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* STREET CONNECTOR: dashed line with rounded ends */}
      <svg
        className="absolute left-0 top-6 h-[10px] w-full"
        viewBox={`0 0 ${Math.max(width, 100)} 10`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <line
          x1="0"
          y1="5"
          x2={String(Math.max(width, 100))}
          y2="5"
          stroke="#e6f6ff"
          strokeOpacity="0.95"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          // subtle glow
          filter="url(#glow)"
          shapeRendering="geometricPrecision"
        />
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* NODES */}
      <div
        className="relative grid z-10"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}
      >
        {items.map((it, idx) => (
          <TimelineNode key={it.id} item={it} index={idx} />
        ))}
      </div>
    </div>
  );
}

function TimelineNode({ item, index }: { item: RoadmapItem; index: number }) {
  return (
    <div className="relative col-start-auto col-end-auto">
      <div className="group relative flex flex-col items-center">
        {/* PIN (white) with icon + glow */}
        <div
          className="relative h-12 w-12 rounded-full bg-white grid place-items-center 
                     shadow-[0_0_0_1px_rgba(2,132,199,0.18),0_10px_28px_rgba(56,189,248,0.30)]
                     transition-transform duration-300 group-hover:scale-105"
          style={{ animation: `fadeIn 360ms ease-out ${index * 80}ms both` }}
        >
          {item.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.icon}
              alt=""
              className="h-6 w-6 object-contain"
              draggable={false}
            />
          ) : (
            <span className="text-sm font-semibold text-slate-900">
              {item.title.slice(0, 1)}
            </span>
          )}
          {/* subtle halo */}
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-sky-300/30 blur-md" />
        </div>

        {/* TITLE + DESCRIPTION (always visible) */}
        <div className="mt-4 text-center max-w-[24ch]">
          <div className="text-sky-50 text-sm font-semibold tracking-wide">
            {item.title}
          </div>
          <p className="mt-1 text-[13px] leading-snug text-sky-100/85">
            {item.description}
          </p>
        </div>
      </div>

      {/* stagger-in keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
