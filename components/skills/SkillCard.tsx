// components/skills/SkillCard.tsx
"use client";

import SkillIcon from "./SkillIcon";

// Minimal shape used by this component
export type UISkill = {
  id: string;
  name: string;
  src: string;
  xOffset?: number;
  yOffset?: number;
};

export function SkillCard({
  title,
  blurb,
  items,
  cardW,
  cardRatio,
  cardIndex,
}: {
  categoryKey: string;
  title: string;
  blurb: string;
  items: UISkill[];
  cardW: number;
  cardRatio: number; // width / height
  cardIndex: number;
}) {
  // Determine grid layout based on item count
  const itemCount = items.length;
  let cols = 3;
  let rows = 2;
  let maxItems = 6;

  if (itemCount > 6) {
    cols = 4;
    rows = Math.ceil(itemCount / 4);
    maxItems = cols * rows;
  }

  const displayedItems = items.slice(0, maxItems);

  return (
    <div
      className="relative rounded-2xl border bg-white/[0.02] border-white/10 backdrop-blur-sm grid overflow-hidden animate-card"
      style={{
        width: cardW,
        height: cardW / cardRatio,
        gridTemplateRows: "auto auto 1fr",
        animationDelay: `${cardIndex * 120}ms`,
        animationFillMode: "both",
      }}
      aria-label={title}
    >
      {/* subtle glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(80% 80% at 70% 20%, rgba(56,189,248,0.12) 0%, rgba(56,189,248,0.04) 42%, transparent 72%)",
        }}
      />

      {/* Title */}
      <div className="px-5 pt-5">
        <h2 className="text-center text-[20px] leading-[28px] font-semibold tracking-tight">
          {title}
        </h2>
      </div>

      {/* Description - now centered */}
      <div className="px-5">
        <p className="text-[12px] leading-[16px] text-white/75 line-clamp-2 text-center">
          {blurb}
        </p>
      </div>

      {/* Icons - dynamic grid */}
      <div className="px-4 pb-5 h-full min-h-0">
        <div
          className="grid gap-3 h-full min-h-0"
          style={{ 
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` 
          }}
        >
          {displayedItems.map((s, i) => (
            <div
              key={s.id}
              className="grid min-h-0 overflow-hidden animate-icon"
              style={{
                gridTemplateRows: "minmax(0, 1fr) auto",
                animationDelay: `${cardIndex * 120 + i * 70}ms`,
                animationFillMode: "both",
              }}
              title={s.name}
            >
              <div className="min-h-0 h-full py-[15px]">
                <SkillIcon s={s} />
              </div>
              <div className="mt-0.5 h-[12px] text-[10px] leading-[12px] text-white/80 text-center truncate">
                {s.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
