// app/roadmap-page.tsx
"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import StreetTimeline, { type RoadmapItem } from "@/components/roadmap/StreetTimeline";

type ApiItem = { id: string; title: string; description: string; icon?: string; from: string; to?: string | null; };

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([]);

  useEffect(() => {
    let off = false;
    (async () => {
      const r = await fetch("/api/roadmap", { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      const all: ApiItem[] = await r.json();
      if (!off) setItems(all);
    })();
    return () => { off = true; };
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      {/* SAME LEFT/RIGHT PADDING AS HEADER */}
<main className="flex-1 py-10 px-[120px] mq750:px-[60px] mq450:px-5">
  {/* Timeline self-centers via mx-auto now; no extra max-w needed */}
  <StreetTimeline
    items={items}
    accentColor="#7dd3fc"
    laneHeight={460}
    iconSize={96}
    autoScale
  />
</main>
    </div>
  );
}
