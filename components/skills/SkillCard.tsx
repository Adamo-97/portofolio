// components/skills/SkillCard.tsx
"use client";

import { CATEGORIES, type CategoryKey } from "./categories";
import SkillIcon from "./SkillIcon";

// Minimal shape used by this component
export type UISkill = {
  id: string;
  name: string;
  src: string;
  xOffset?: number;
  yOffset?: number;
};

type Props = {
  category: CategoryKey;
  items: UISkill[];
  cardW: number;
  cardRatio: number; // width / height
  cardIndex: number;
};

export function SkillCard({
  category,
  items,
  cardW,
  cardRatio,
  cardIndex,
}: Props) {
  return (
    <div
      className={[
        "relative rounded-2xl border bg-white/[0.06] border-white/10 backdrop-blur-[2px]",
        "grid overflow-hidden",
        "animate-card",
      ].join(" ")}
      style={{
        width: cardW,
        height: cardW / cardRatio,
        gridTemplateRows: "auto auto 1fr",
        animationDelay: `${cardIndex * 120}ms`,
        animationFillMode: "both",
      }}
      aria-label={CATEGORIES[category].title}
    >
      {/* subtle glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(80% 80% at 70% 20%, rgba(56,189,248,0.18) 0%, rgba(56,189,248,0.06) 42%, transparent 72%)",
        }}
      />

      {/* Title lane */}
      <div className="px-5 pt-5">
        <h2 className="text-center text-[20px] leading-[28px] font-semibold tracking-tight">
          {CATEGORIES[category].title}
        </h2>
      </div>

      {/* Description lane */}
      <div className="px-5">
        <p className="text-[12px] leading-[16px] text-white/75 line-clamp-2 text-left">
          {CATEGORIES[category].blurb}
        </p>
      </div>

      {/* Icons lane */}
      <div className="px-4 pb-5 h-full min-h-0">
        <div
          className="grid grid-cols-3 gap-3 h-full min-h-0"
          style={{ gridTemplateRows: "repeat(2, minmax(0, 1fr))" }}
        >
          {items.slice(0, 6).map((s, i) => (
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

          {/* pads if fewer than 6 */}
          {Array.from({ length: Math.max(0, 6 - items.length) }).map((_, i) => (
            <div
              key={`pad-${i}`}
              className="grid min-h-0 overflow-hidden animate-icon"
              style={{
                gridTemplateRows: "minmax(0, 1fr) auto",
                animationDelay: `${cardIndex * 120 + (6 + i) * 70}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="min-h-0 h-full py-[15px]" />
              <div className="mt-0.5 h-[12px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
