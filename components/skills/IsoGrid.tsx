"use client";

import type { Skill } from "../../data/skills"; // adjust if your SKILLS file lives elsewhere

type Props = {
  items: Skill[];
  cols?: number;     // max columns (desktop)
  tile?: number;     // px size
  gap?: number;      // px spacing
};

/**
 * Bounded isometric board with a soft back-glow and a subtle particle field.
 * - Never overflows its container (wrapper hides overflow).
 * - Columns are clamped; rows auto-wrap.
 * - Mobile falls back to a flat grid.
 */
export default function IsoGrid({
  items,
  cols = 8,
  tile = 96,
  gap = 12,
}: Props) {
  // calculate rows needed (ceiling division) to set board height
  const rows = Math.ceil(items.length / cols);

  // Inline CSS variables keep Tailwind happy and let us pass knobs from props
  const vars = {
    "--tile": `${tile}px`,
    "--gap": `${gap}px`,
    "--cols": String(cols),
    "--rows": String(rows),
  };

  return (
    <div className="mt-6">
      {/* Mobile: simple neat grid */}
      <div className="grid grid-cols-4 gap-3 sm:hidden">
        {items.map((s) => (
          <div
            key={s.id}
            className="aspect-square rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center"
            title={s.name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.name} className="max-w-[70%] max-h-[70%]" />
          </div>
        ))}
      </div>

      {/* Desktop: bounded iso board */}
      <div className="relative hidden sm:block">
        {/* Wrapper ensures we never spill out of the layout */}
        <div className="iso-wrap" style={vars as React.CSSProperties}>
          {/* Glow + particles live behind the board */}
          <div className="iso-glow" aria-hidden />
          <div className="iso-particles" aria-hidden />

          <div className="iso-scene">
            <div className="iso-board">
              {items.map((s, i) => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                return (
                  <a
                    key={s.id}
                    href={s.href ?? "#"}
                    className="iso-tile group"
                    style={
                      {
                        // @ts-ignore css vars
                        "--col": String(col),
                        "--row": String(row),
                      } as React.CSSProperties
                    }
                    aria-label={s.name}
                    title={s.name}
                  >
                    <div className="iso-face">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.src}
                        alt={s.name}
                        className="h-[62%] w-[62%] object-contain opacity-90 transition group-hover:opacity-100"
                        draggable={false}
                      />
                    </div>
                    <div className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] text-white/65 opacity-0 transition group-hover:opacity-100">
                      {s.name}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
