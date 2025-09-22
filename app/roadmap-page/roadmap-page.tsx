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
    // Fill viewport; flex column gives us “remaining space” under Header automatically.
    <div className="bg-black flex flex-col overflow-hidden" style={{ minHeight: "100dvh" }}>
      <Header />

      {/* Slide area = remaining viewport (no scroll), centers child */}
      <main
        className="relative flex-1 min-h-0 overflow-hidden px-[120px] mq750:px-[60px] mq450:px-5 grid place-items-center"
        // Stronger, larger, viewport-scaling blue “fog” baked into the background
        // (multiple soft radial gradients from both bottom corners).
        style={{
          backgroundImage: `
            radial-gradient(90% 85% at 12% 100%, rgba(125,211,252,0.40) 0%, rgba(125,211,252,0.22) 30%, rgba(125,211,252,0.10) 55%, rgba(0,0,0,0) 80%),
            radial-gradient(90% 85% at 88% 100%, rgba(125,211,252,0.40) 0%, rgba(125,211,252,0.22) 30%, rgba(125,211,252,0.10) 55%, rgba(0,0,0,0) 80%),
            radial-gradient(70% 65% at 18% 100%, rgba(125,211,252,0.22) 0%, rgba(125,211,252,0.12) 40%, rgba(0,0,0,0) 75%),
            radial-gradient(70% 65% at 82% 100%, rgba(125,211,252,0.22) 0%, rgba(125,211,252,0.12) 40%, rgba(0,0,0,0) 75%),
            linear-gradient(#000, #000)
          `,
          backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat",
          // Bigger canvases = softer “blur” look; all in vw/vh so they breathe with the viewport.
          backgroundSize: "100vw 85vh, 100vw 85vh, 80vw 65vh, 80vw 65vh, 100% 100%",
          backgroundPosition: "left -18vw bottom -14vh, right -18vw bottom -14vh, left -8vw bottom -8vh, right -8vw bottom -8vh, center",
        }}
      >
        {/* Centered content that can shrink/grow inside the slide (no vertical padding) */}
        <div className="w-full max-w-[1600px] max-h-full place-self-center">
          <StreetTimeline
            items={items}
            accentColor="#7dd3fc"
            laneHeight={460}
            iconSize={96}
            autoScale
            // Keep natural height; only cap so it never overflows the slide.
            // @ts-ignore
            style={{ width: "100%", height: "auto", maxHeight: "100%", overflow: "visible" }}
          />
        </div>
      </main>
    </div>
  );
}
