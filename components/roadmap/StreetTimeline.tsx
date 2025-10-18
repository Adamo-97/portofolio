"use client";
import { useEffect, useRef, useState } from "react";
import RoadLine from "./RoadLine";
import RoadNode, { type RoadmapItem } from "./RoadNode";

/**
 * Modern responsive timeline component with clean vertical layout on mobile
 * and horizontal street-style layout on desktop.
 */
export default function StreetTimeline({
  items,
  accentColor = "#18a1fd",
  laneHeight = 420,
  iconSize = 88,
  autoScale = true,
}: {
  items: RoadmapItem[];
  accentColor?: string;
  laneHeight?: number;
  iconSize?: number;
  autoScale?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState(0);
  const [vh, setVh] = useState(900);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const roadAnimMs = 900;
  const perItemStagger = 180;

  // Desktop calculations
  const laneScaled = autoScale ? Math.round(clamp(vh * 0.48, 360, 720)) : laneHeight;
  const colW = items.length > 0 ? w / items.length : w;
  const iconScaled = autoScale ? Math.round(clamp(colW * 0.30, 64, 140)) : iconSize;
  const stackWidth = autoScale ? Math.round(clamp(colW * 0.90, 260, 520)) : 420;
  const padFromRoad = Math.round(clamp(laneScaled * 0.02, 8, 20));
  const roadPx = 12;

  return (
    <div ref={wrapRef} className="relative w-full mx-auto" style={{ height: isMobile ? '100%' : undefined }}>
      {/* DESKTOP: Horizontal street layout */}
      {!isMobile ? (
        <div className="relative z-10 grid h-full overflow-visible" style={{ height: laneScaled, gridTemplateRows: `1fr ${roadPx}px 1fr`, gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
          {/* TOP row (even columns) */}
          {items.map((it, i) => (
            <div key={`top-${it.id}`} className="flex items-end justify-center">
              {i % 2 === 0 ? (
                <RoadNode
                  item={it}
                  pos="top"
                  accentColor={accentColor}
                  iconSize={iconScaled}
                  width={stackWidth}
                  appearDelayMs={roadAnimMs + i * perItemStagger}
                  padFromRoad={padFromRoad}
                />
              ) : null}
            </div>
          ))}

          {/* ROAD row */}
          <div style={{ gridColumn: `1 / -1` }}>
            <RoadLine width={w} height={roadPx} accentColor={accentColor} padding={28} dash={26} gap={14} animMs={roadAnimMs} vertical={false} mode="divider" />
          </div>

          {/* BOTTOM row (odd columns) */}
          {items.map((it, i) => (
            <div key={`bottom-${it.id}`} className="flex items-start justify-center">
              {i % 2 === 1 ? (
                <RoadNode
                  item={it}
                  pos="bottom"
                  accentColor={accentColor}
                  iconSize={iconScaled}
                  width={stackWidth}
                  appearDelayMs={roadAnimMs + i * perItemStagger}
                  padFromRoad={padFromRoad}
                />
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        // MOBILE: Compact single-side layout that fits all items in viewport
        <div className="relative z-10 w-full h-full flex flex-col px-4" style={{ paddingTop: "4px", paddingBottom: "4px" }}>
          {/* Vertical line on left */}
          <div className="absolute left-[22px] top-0 bottom-0 w-[2px] z-0 opacity-0" style={{ animation: `fadeIn 800ms ease forwards ${roadAnimMs * 0.3}ms` }}>
            <div className="w-full h-full" style={{ background: `linear-gradient(to bottom, transparent, ${accentColor}40 5%, ${accentColor}40 95%, transparent)` }} />
          </div>

          {/* Timeline items - evenly distributed to fit viewport (newest first) */}
          <div className="flex flex-col w-full h-full justify-between">
            {[...items].reverse().map((it, i) => (
              <div key={it.id} className="relative z-10 opacity-0 pl-10 pr-2 flex items-center" style={{ animation: `slideIn 600ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards ${roadAnimMs + i * perItemStagger}ms`, minHeight: 0 }}>
                {/* Timeline dot */}
                <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full border-2 z-20" style={{ borderColor: accentColor, background: "rgba(15, 23, 42, 0.9)", boxShadow: `0 0 8px ${accentColor}60` }} />

                {/* Compact card - constrained height */}
                <div className="relative bg-white/[0.02] backdrop-blur-sm rounded-lg border border-white/10 p-2.5 hover:bg-white/[0.04] transition-all duration-300 w-full">
                  <div className="flex items-start gap-2">
                    {/* Compact icon */}
                    {it.icon && (
                      <div className="relative flex-shrink-0 w-9 h-9 rounded-lg p-1">
                        <img src={it.icon} alt="" className="w-full h-full object-contain" />
                      </div>
                    )}

                    {/* Compact text content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-[13px] leading-tight mb-0.5">{it.title}</h3>
                      
                      {/* Date range */}
                      {(it.from || it.to) && (
                        <div className="text-[9px] font-medium mb-0.5 opacity-90" style={{ color: accentColor }}>
                          {formatRange(it.from, it.to)}
                        </div>
                      )}

                      {/* Compact description */}
                      <p className="text-sky-100/75 text-[10px] leading-snug line-clamp-2">{it.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); filter: blur(4px); }
          to { opacity: 1; transform: translateX(0); filter: none; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function formatRange(from?: string, to?: string | null) {
  if (!from) return "";
  const f = new Date(from);
  const t = to ? new Date(to) : null;
  const safe = (d: Date) => (isNaN(d.getTime()) ? "" : d.toLocaleString(undefined, { month: "short", year: "numeric" }));
  const fm = safe(f);
  const tm = t ? safe(t) : "Present";
  return fm && tm ? `${fm} – ${tm}` : fm || tm || "";
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export { type RoadmapItem, type RoadPos } from "./RoadNode";