"use client";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "../../components/header";
import StreetTimeline, {
  RoadmapItem,
} from "../../components/roadmap/StreetTimeline";

type RoadmapJsonItem = RoadmapItem & {
  from: string;          // ISO
  to?: string | null;    // ISO | null | "ongoing"
};

const RoadmapPage: NextPage = () => {
  const [items, setItems] = useState<RoadmapItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/data/roadmap.json", { cache: "no-store" });
        const all: RoadmapJsonItem[] = await res.json();

        // ensure from exists & sort by from desc
        const latest4 = all
          .filter((i) => !!i.from)
          .sort(
            (a, b) =>
              new Date(b.from).getTime() - new Date(a.from).getTime()
          )
          .slice(0, 4)
          .map(({ id, title, description, icon }) => ({
            id,
            title,
            description,
            icon,
          }));

        if (!cancelled) setItems(latest4);
      } catch (e) {
        console.error("Failed to load roadmap.json", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full h-[100svh] relative overflow-hidden flex flex-col bg-black">
      <Header />

      <main className="relative flex-1 flex items-center justify-center p-6">
        {/* BLUE BLUR BACKGROUND */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[15%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute left-[8%] bottom-[10%] h-[45vh] w-[45vh] rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-[10%] top-[30%] h-[50vh] w-[50vh] rounded-full bg-blue-400/10 blur-3xl" />
        </div>

        <div className="relative w-full max-w-6xl">
          <StreetTimeline
            items={items}
            dash={22}        // longer lane segments
            gap={12}         // small gap between segments
            strokeWidth={4}  // thicker line
          />
        </div>
      </main>
    </div>
  );
};

export default RoadmapPage;
