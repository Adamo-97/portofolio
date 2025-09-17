"use client";

import { useEffect, useMemo, useState } from "react";
import { SKILLS, type Skill } from "../../data/skills";
import { CATEGORIES, type CategoryKey } from "./categories";
import { useViewportStage } from "./useViewportStage";
import { SkillCard } from "./SkillCard";

const ORDER: CategoryKey[] = [
  "Languages",
  "Frontend",
  "Backend & Data",
  "Mobile",
  "Design & IDEs",
  "QA & Workflow",
];

const BASE = { cardW: 360, gap: 24, cardRatio: 4 / 3, padY: 40 };

type Spec = { cols: number; rows: number };

export default function SkillsGrid() {
  const byCat = useMemo(() => {
    const map: Record<CategoryKey, Skill[]> = {
      Languages: [],
      Frontend: [],
      "Backend & Data": [],
      Mobile: [],
      "Design & IDEs": [],
      "QA & Workflow": [],
    };
    for (const s of SKILLS) {
      if (s.category && (ORDER as string[]).includes(s.category)) {
        map[s.category as CategoryKey].push(s);
      }
    }
    ORDER.forEach((k) => map[k].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0)));
    return map;
  }, []);

  const [spec, setSpec] = useState<Spec>({ cols: 2, rows: 3 });
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setSpec(mq.matches ? { cols: 3, rows: 2 } : { cols: 2, rows: 3 });
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const STAGE = useMemo(() => ({ ...BASE, cols: spec.cols, rows: spec.rows }), [spec]);
  const { stageStyle, wrapperStyle } = useViewportStage(STAGE);

  return (
    <main className="flex items-center justify-center" style={wrapperStyle(STAGE.padY)}>
      <div style={stageStyle}>
        <ul
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${STAGE.cols}, ${STAGE.cardW}px)`,
            gridAutoRows: `${STAGE.cardW / STAGE.cardRatio}px`,
            gap: STAGE.gap,
          }}
        >
          {ORDER.slice(0, STAGE.cols * STAGE.rows).map((cat, i) => (
            <li key={cat}>
              <SkillCard
                category={cat}
                items={byCat[cat] ?? []}
                cardW={STAGE.cardW}
                cardRatio={STAGE.cardRatio}
                cardIndex={i}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes cardBounceFadeIn {
          0%   { opacity: 0; transform: translateY(22px) scale(0.965); filter: blur(2px); }
          55%  { opacity: 1; transform: translateY(-4px) scale(1.02);  filter: blur(0.4px); }
          82%  {            transform: translateY(1px)  scale(0.998);   filter: blur(0); }
          100% {            transform: translateY(0)    scale(1);       filter: none; }
        }
        @keyframes iconBounceFadeIn {
          0%   { opacity: 0; transform: translateY(14px) scale(0.985); filter: blur(1.5px); }
          60%  { opacity: 1; transform: translateY(-2px) scale(1.01);  filter: blur(0.2px); }
          88%  {            transform: translateY(1px)   scale(0.999); filter: blur(0); }
          100% {            transform: translateY(0)     scale(1);     filter: none; }
        }
        .animate-card { animation: cardBounceFadeIn 900ms cubic-bezier(.2,.7,.2,1) both; will-change: transform, opacity, filter; }
        .animate-icon { animation: iconBounceFadeIn 1000ms cubic-bezier(.2,.7,.2,1) both; will-change: transform, opacity, filter; }
        @media (prefers-reduced-motion: reduce) {
          .animate-card, .animate-icon { animation: none !important; opacity: 1 !important; transform: none !important; filter: none !important; }
        }
      `}</style>
    </main>
  );
}
