// components/roadmap/StreetTimeline.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import RoadLine from "./RoadLine";
import RoadNode from "./RoadNode";
import type { RoadmapItem } from "./RoadNode";

type Props = { items: RoadmapItem[]; accentColor?: string; laneHeight?: number; iconSize?: number };

export default function StreetTimeline({
  items, accentColor="#7dd3fc", laneHeight=380, iconSize=88,
}: Props) {
  const wrapRef = useRef<HTMLDivElement|null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update(); const ro = new ResizeObserver(update); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={wrapRef} className="relative w-full" style={{ height: laneHeight }}>
      <RoadLine width={width} accentColor={accentColor} />
      <div className="relative grid z-10" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
        {items.map((it, idx) => (
          <RoadNode key={it.id} item={it} above={idx % 2 === 0}
            accentColor={accentColor} laneHeight={laneHeight} iconSize={iconSize} />
        ))}
      </div>
    </div>
  );
}

export type { RoadmapItem }; // so the page can: import StreetTimeline, { type RoadmapItem } ...
