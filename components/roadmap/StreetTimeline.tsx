// components/roadmap/StreetTimeline.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import RoadLine from "./RoadLine";
import RoadNode, { type RoadmapItem, type RoadPos } from "./RoadNode";

export default function StreetTimeline({
  items,
  accentColor = "#7dd3fc",
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
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
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
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setVertical(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // responsive totals
  const laneScaled = autoScale ? Math.round(clamp(vh * 0.48, 360, 720)) : laneHeight;
  const colW = items.length > 0 ? w / items.length : w;

  // scaled bits
  const iconScaled = autoScale ? Math.round(clamp(colW * 0.30, 64, 140)) : iconSize;
  const stackWidth = autoScale ? Math.round(clamp(colW * 0.90, 260, 520)) : 420;
  const mobIcon = Math.round(iconScaled * 0.78);
  const mobWidth = Math.round(clamp(w * 0.42, 220, 360));
  const padFromRoad = Math.round(clamp(laneScaled * 0.02, 8, 20));

  const roadAnimMs = 900;
  const perItemStagger = 180;

  // thickness of the road (divider track)
  const roadPx = 12;

  return (
    <div
      ref={wrapRef}
      className="relative w-full mx-auto"
      style={{ height: vertical ? laneScaled * items.length : laneScaled }}
    >
      {/* DESKTOP: rows = [top | ROAD | bottom] */}
      {!vertical ? (
        <div
          className="relative z-10 grid h-full overflow-visible"
          style={{
            gridTemplateRows: `1fr ${roadPx}px 1fr`,
            gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))`,
          }}
        >
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

          {/* ROAD row (span all columns) */}
          <div style={{ gridColumn: `1 / -1` }}>
            <RoadLine
              width={w}
              height={roadPx}
              accentColor={accentColor}
              padding={28}
              dash={26}
              gap={14}
              animMs={roadAnimMs}
              vertical={false}
              mode="divider"
            />
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
        // MOBILE: columns = [left | ROAD | right]
        <div
          className="relative z-10 grid h-full overflow-visible"
          style={{
            gridTemplateColumns: `1fr ${roadPx}px 1fr`,
            gridTemplateRows: `repeat(${items.length}, minmax(0,1fr))`,
          }}
        >
          {items.map((it, i) => (
            <div key={it.id} className="contents">
              {/* LEFT col (even rows) */}
              <div className="flex items-center justify-end pr-3">
                {i % 2 === 0 ? (
                  <RoadNode
                    item={it}
                    pos="left"
                    accentColor={accentColor}
                    iconSize={mobIcon}
                    width={mobWidth}
                    appearDelayMs={roadAnimMs + i * perItemStagger}
                  />
                ) : null}
              </div>

              {/* ROAD col (span all rows) */}
              {i === 0 && (
                <div style={{ gridRow: `1 / -1` }}>
                  <RoadLine
                    width={roadPx}
                    height={laneScaled * items.length}
                    accentColor={accentColor}
                    padding={28}
                    dash={26}
                    gap={14}
                    animMs={roadAnimMs}
                    vertical
                    mode="divider"
                  />
                </div>
              )}

              {/* RIGHT col (odd rows) */}
              <div className="flex items-center justify-start pl-3">
                {i % 2 === 1 ? (
                  <RoadNode
                    item={it}
                    pos="right"
                    accentColor={accentColor}
                    iconSize={mobIcon}
                    width={mobWidth}
                    appearDelayMs={roadAnimMs + i * perItemStagger}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
export { type RoadmapItem, type RoadPos } from "./RoadNode";