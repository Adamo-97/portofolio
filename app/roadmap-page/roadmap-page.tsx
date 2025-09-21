"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import StreetTimeline, { type RoadmapItem } from "@/components/roadmap/StreetTimeline";

type ApiItem = { id:string; title:string; description:string; icon?:string; from:string; to?:string|null };

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  useEffect(() => { let off=false; (async ()=>{
    const r = await fetch("/api/roadmap", { cache:"no-store" });
    if (!r.ok) throw new Error(String(r.status));
    const all: ApiItem[] = await r.json();
    if (!off) setItems(all);
  })(); return ()=>{off=true}; }, []);
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <StreetTimeline items={items} accentColor="#7dd3fc" laneHeight={460} iconSize={96} />
      </main>
    </div>
  );
}
