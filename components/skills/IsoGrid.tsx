"use client";

import type { Skill } from "../../data/skills";
import { useMemo, type CSSProperties } from "react";

type Props = {
  items: Skill[];
  cols?: number; // kept for compatibility, not critical now
  tile?: number;
  gap?: number;
};

export default function IsoGrid({
  items,
  cols = 8,
  tile = 96,
  gap = 12,
}: Props) {
  const vars = useMemo(
    () => ({
      "--tile": `${tile}px`,
      "--gap": `${gap}px`,
      "--cols": String(cols),
    }),
    [cols, tile, gap]
  );

  return (
    <div className="relative" style={vars as CSSProperties}>
      {/* Denser, smaller cards; also cap each card's max size so they never blow up */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
        {items.map((s) => (
          <div
            key={s.id}
            className={[
              "w-full max-w-[120px] mx-auto",        // cap size so they aren't huge
              "relative aspect-square rounded-2xl",
              "bg-white/[0.06] border border-white/10",
              "flex items-center justify-center p-2 sm:p-2.5",
            ].join(" ")}
            title={s.name}
          >
            {/* icon wrapper with inner blue glow BEHIND the icon */}
            <div className="relative w-[70%] h-[70%]">
              {/* blue glow, behind the icon only */}
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 block rounded-full blur-[14px] opacity-70"
                style={{
                  width: "120%",
                  height: "120%",
                  background:
                    "radial-gradient(closest-side, rgba(56,189,248,0.38), rgba(56,189,248,0.12) 55%, transparent 70%)",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.name}
                className="w-full h-full object-contain select-none pointer-events-none filter drop-shadow-[0_0_10px_rgba(56,189,248,0.28)] opacity-95"
                draggable={false}
              />
            </div>

            {/* label */}
            <div className="absolute bottom-2 left-0 right-0 text-center text-[11px] text-white/70">
              {s.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
