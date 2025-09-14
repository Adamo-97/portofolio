"use client";

import Image from "next/image";
import type { Skill } from "../../data/skills";
import { useEffect, useMemo, useState } from "react";
import Folder from "./Folder";

// ...keep your palette/category mapping if you have it
const PALETTE_BY_CATEGORY: Record<string, "blue" | "red" | "purple" | "green"> = {
  Build: "blue",
  Design: "purple",
  Data: "green",
  Workflow: "red",
};
const paletteFor = (cat: string) => PALETTE_BY_CATEGORY[cat] ?? "blue";

type Props = {
  items: Skill[];
  groupBy?: "category" | null;
  iconHeight?: number;
  order?: string[];
};

const DEFAULT_ORDER = ["Build", "Design", "Data", "Workflow"];

export default function SkillsGrid({
  items,
  groupBy = "category",
  iconHeight = 54,
  order = DEFAULT_ORDER,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  if (groupBy !== "category") {
    const sorted = [...items].sort((a, b) => {
      const aw = a.weight ?? 9999, bw = b.weight ?? 9999;
      return aw === bw ? a.name.localeCompare(b.name) : aw - bw;
    });
    return (
      <div className="flex flex-row flex-wrap content-start gap-8 sm:gap-6 justify-center min-h-[100svh] items-end pb-20">
        {sorted.map((s, i) => (
          <div
            key={s.id}
            className={[
              "transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
            ].join(" ")}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <FlatSkill skill={s} iconHeight={iconHeight} />
          </div>
        ))}
      </div>
    );
  }

  // ----- Folder stage -----
  const cats = useMemo(() => {
    const present = new Set(items.map((s) => s.category ?? "Other"));
    const prim = order.filter((c) => present.has(c));
    const extras = Array.from(present).filter((c) => !prim.includes(c));
    return [...prim, ...extras];
  }, [items, order]);

  const [active, setActive] = useState<string>(cats[0] ?? "Build");
  const [lifting, setLifting] = useState<string | null>(null);
  const [dropping, setDropping] = useState<boolean>(false);

  const byCat = useMemo(() => {
    const map: Record<string, Skill[]> = {};
    for (const s of items) {
      const c = s.category ?? "Other";
      (map[c] ??= []).push(s);
    }
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => {
        const aw = a.weight ?? 9999, bw = b.weight ?? 9999;
        return aw === bw ? a.name.localeCompare(b.name) : aw - bw;
      });
    }
    return map;
  }, [items]);

  const visible = byCat[active] ?? [];

  const choose = (cat: string) => {
    if (cat === active || lifting) return;
    setLifting(cat);
    setDropping(true);
    setTimeout(() => {
      setActive(cat);
      setDropping(false);
      setLifting(null);
    }, 480);
  };

  // Responsive sizes for Folder "box"
  const BOX_ACTIVE =
    "w-[200px] h-[135px] sm:w-[240px] sm:h-[160px] md:w-[280px] md:h-[188px] lg:w-[320px] lg:h-[214px] xl:w-[360px] xl:h-[240px]";
  const BOX_SMALL =
    "w-[130px] h-[88px] sm:w-[150px] sm:h-[100px] md:w-[170px] md:h-[114px] lg:w-[190px] lg:h-[128px] xl:w-[210px] xl:h-[142px]";

return (
  <section
    className={[
      // full viewport height, centered both axes
      "relative w-full min-h-[100svh] grid place-items-center",
      // comfy padding so labels don’t clip when scaled
      "py-24 sm:py-28",
      // fade/slide in the whole section
      "transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
    ].join(" ")}
  >
    {/* Centered vertical stack */}
    <div className="w-full max-w-[1200px] flex flex-col items-center justify-center gap-8 sm:gap-10">
      {/* icons ABOVE the selected folder */}
      <div
        className={[
          "relative z-20 flex flex-row flex-wrap justify-center gap-5 sm:gap-6 md:gap-8",
          "transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        ].join(" ")}
        style={{ transitionDelay: "120ms" }}
      >
        {visible.map((s, i) => (
          <SkillIcon key={`${active}-${s.id}`} skill={s} iconHeight={iconHeight} delay={i * 24} />
        ))}
      </div>

      {/* selected folder block (centered) */}
      <div
        className={[
          "relative z-10 flex flex-col items-center",
          "transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
          dropping ? "translate-y-2 scale-[0.97] opacity-95" : "translate-y-0 scale-100 opacity-100",
          "[filter:drop-shadow(0_26px_70px_rgba(24,161,253,0.20))]",
          // mount fade
          "transition-opacity duration-700",
          mounted ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{ transitionDelay: "220ms" }}
      >
        <Folder
          active
          palette={paletteFor(active)}
          boxClassName={BOX_ACTIVE}
        />
        <div className="mt-3 text-center text-white font-urbanist font-semibold text-lg sm:text-xl tracking-[-0.01em]">
          {active}
        </div>
      </div>

      {/* BOTTOM: unselected folders — centered row */}
      <div className="w-full">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 pb-2">
          {cats
            .filter((c) => c !== active)
            .map((cat, idx) => {
              const isLifting = lifting === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => choose(cat)}
                  className="group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cornflowerblue-100/70"
                >
                  <div
                    className={[
                      "flex flex-col items-center transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
                      isLifting
                        ? "-translate-y-6 sm:-translate-y-8 scale-100"
                        : "translate-y-1.5 sm:translate-y-2.5 scale-[0.86]",
                      // mount anim per tile
                      "transition-all duration-700",
                      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                    ].join(" ")}
                    style={{ transitionDelay: `${300 + idx * 80}ms` }}
                  >
                    <Folder
                      palette={paletteFor(cat)}
                      boxClassName={BOX_SMALL}
                    />
                    <div className="mt-2 text-center text-white font-urbanist font-semibold text-base sm:text-lg tracking-[-0.01em]">
                      {cat}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  </section>
);

}

/* ========= Icons ========= */
function SkillIcon({
  skill,
  iconHeight,
  delay = 0,
}: {
  skill: Skill;
  iconHeight: number;
  delay?: number;
}) {
  const isSvg = skill.src.toLowerCase().endsWith(".svg");
  const common = "inline-block align-middle will-change-[opacity,transform] transition-all duration-300";
  const style: React.CSSProperties = {
    height: `${iconHeight}px`,
    width: "auto",
    opacity: 0,
    transform: "translateY(6px) scale(0.98)",
    transitionDelay: `${delay}ms`,
  };
  const styleVisible: React.CSSProperties = { ...style, opacity: 1, transform: "translateY(0) scale(1)" };

  return (
    <div className="grid place-items-center">
      {isSvg ? (
        <img src={skill.src} alt={skill.name} loading="lazy" className={common} style={styleVisible} title={skill.name} />
      ) : (
        <Image src={skill.src} alt={skill.name} width={0} height={0} sizes="100vw" loading="lazy" className={common} style={styleVisible} title={skill.name} />
      )}
    </div>
  );
}

function FlatSkill({ skill, iconHeight }: { skill: Skill; iconHeight: number }) {
  const isSvg = skill.src.toLowerCase().endsWith(".svg");
  return isSvg ? (
    <img
      src={skill.src}
      alt={skill.name}
      loading="lazy"
      className="inline-block align-middle"
      style={{ height: `${iconHeight}px`, width: "auto" }}
      title={skill.name}
    />
  ) : (
    <Image
      src={skill.src}
      alt={skill.name}
      width={0}
      height={0}
      sizes="100vw"
      loading="lazy"
      className="inline-block align-middle"
      style={{ height: `${iconHeight}px`, width: "auto" }}
      title={skill.name}
    />
  );
}
