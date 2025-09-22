// app/roadmap-page.tsx
"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import StreetTimeline, { type RoadmapItem } from "@/components/roadmap/StreetTimeline";

type ApiItem = { id: string; title: string; description: string; icon?: string; from: string; to?: string | null };

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([]);

  useEffect(() => {
    let off = false;
    (async () => {
      const r = await fetch("/api/roadmap", { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      const all: ApiItem[] = await r.json();
      if (!off) setItems(all as any);
    })();
    return () => { off = true; };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-black flex flex-col overflow-hidden">
      <Header />

      {/* Slide area = exactly the remaining space (no scroll) */}
      <main className="flex-1 min-h-0 overflow-hidden px-[120px] mq750:px-[60px] mq450:px-5 grid place-items-center">
        {/* Centered box that can shrink/grow inside the slide */}
        <div className="w-full max-w-[1600px] max-h-full place-self-center">
          {/* Let it size naturally; only CAP height so it never overflows the slide */}
          <StreetTimeline
            items={items}
            accentColor="#7dd3fc"
            laneHeight={460}
            iconSize={96}
            autoScale
            // If supported, keep auto height + cap:
            // @ts-ignore
            style={{ width: "100%", height: "auto", maxHeight: "100%", overflow: "visible" }}
          />
        </div>
      </main>
    </div>
  );
}
