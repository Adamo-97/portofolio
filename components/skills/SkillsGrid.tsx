// components/skills/SkillsGrid.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useViewportStage } from "./useViewportStage";
import { SkillCard } from "./SkillCard";
import LoadingAnimation from "@/components/LoadingAnimation";

const BASE = { cardW: 360, gap: 24, cardRatio: 4 / 3, padY: 40 };
type Spec = { cols: number; rows: number };

// Minimal skill shape used by our UI
export type UISkill = {
  id: string;
  name: string;
  category?: string | null;
  src: string;
  xOffset?: number;
  yOffset?: number;
  weight?: number;
};

export default function SkillsGrid() {
  const [allSkills, setAllSkills] = useState<UISkill[]>([]);
  const [cats, setCats] = useState<{ key: string; title: string; blurb: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories (DB: skill_category with title/blurb)
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const r = await fetch("/api/skill-categories", { cache: "no-store" });
        if (!r.ok) throw new Error(String(r.status));
        const items = await r.json();
        if (!off) setCats(items);
      } catch (e) {
        console.error("[SkillsGrid] fetch /api/skill-categories failed:", e);
        if (!off) setCats([]);
      }
    })();
    return () => { off = true; };
  }, []);

  // ✅ Fetch skills (Supabase-backed)
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const r = await fetch("/api/skills", { cache: "no-store" });
        if (!r.ok) throw new Error(String(r.status));
        const items: UISkill[] = await r.json();
        if (!off) {
          setAllSkills(items);
          setLoading(false);
        }
      } catch (e) {
        console.error("[SkillsGrid] fetch /api/skills failed:", e);
        if (!off) {
          setAllSkills([]);
          setLoading(false);
        }
      }
    })();
    return () => { off = true; };
  }, []);

  // Bucket skills by fetched categories
  const byCat = useMemo(() => {
    const map: Record<string, UISkill[]> = {};
    for (const c of cats) map[c.key] = [];
    for (const s of allSkills) {
      if (s.category && map[s.category]) map[s.category].push(s);
    }
    Object.keys(map).forEach(k => map[k].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0)));
    return map;
  }, [cats, allSkills]);

  // 3x2 vs 2x3 layout
  const [spec, setSpec] = useState<Spec>({ cols: 2, rows: 3 });
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setSpec(mq.matches ? { cols: 3, rows: 2 } : { cols: 2, rows: 3 });
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const STAGE = { ...BASE, cols: spec.cols, rows: spec.rows };
  const { stageStyle, wrapperStyle } = useViewportStage(STAGE);

  // Loading state with animated icons
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-black">
        <LoadingAnimation text="Loading skills..." />
      </main>
    );
  }

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
          {cats.slice(0, STAGE.cols * STAGE.rows).map((c, i) => (
            <li key={c.key}>
              <SkillCard
                categoryKey={c.key}
                title={c.title}
                blurb={c.blurb}
                items={byCat[c.key] ?? []}
                cardW={STAGE.cardW}
                cardRatio={STAGE.cardRatio}
                cardIndex={i}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Animations (unchanged) */}
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
