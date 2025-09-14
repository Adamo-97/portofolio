// components/skills/SkillsGrid.tsx
"use client";

import Image from "next/image";
import type { Skill } from "../../data/skills";
import { useMemo, useState } from "react";
import Folder from "./Folder";


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
  if (groupBy !== "category") {
    const sorted = [...items].sort((a, b) => {
      const aw = a.weight ?? 9999, bw = b.weight ?? 9999;
      return aw === bw ? a.name.localeCompare(b.name) : aw - bw;
    });
    return (
      <div className="flex flex-row flex-wrap content-start gap-8 sm:gap-6">
        {sorted.map((s) => (
          <FlatSkill key={s.id} skill={s} iconHeight={iconHeight} />
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

  return (
    <section className="relative w-full">
      {/* TOP: icons + selected folder */}
      <div className="relative w-full flex flex-col items中心">
        <div className="relative z-20 flex flex-row flex-wrap justify-center gap-5 sm:gap-6 md:gap-8 -translate-y-1">
          {visible.map((s, i) => (
            <SkillIcon key={`${active}-${s.id}`} skill={s} iconHeight={iconHeight} delay={i * 24} />
          ))}
        </div>

        <div
          className={[
            "relative z-10 mt-4 sm:mt-6 flex flex-col items-center",
            "transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
            dropping ? "translate-y-8 scale-[0.92] opacity-95" : "translate-y-0 scale-100 opacity-100",
            "[filter:drop-shadow(0_26px_70px_rgba(24,161,253,0.36))]",
          ].join(" ")}
        >
          <Folder active palette={paletteFor(active)} />
          <div className="mt-3 text-white font-urbanist font-semibold text-lg sm:text-xl tracking-[-0.01em]">
            {active}
          </div>
        </div>
      </div>

      {/* BOTTOM: other folders */}
      <div className="mt-12 sm:mt-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 place-items-center">
          {cats
            .filter((c) => c !== active)
            .map((cat) => {
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
                        ? "-translate-y-10 sm:-translate-y-14 scale-100"
                        : "translate-y-4 sm:translate-y-6 scale-[0.86]",
                    ].join(" ")}
                  >
                    <Folder size="sm" palette={paletteFor(cat)} />
                    <div className="mt-2 text-white font-urbanist font-semibold text-base sm:text-lg tracking-[-0.01em]">
                      {cat}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </section>
  );
}

/* ========= Icons (fixed height, no extra labels) ========= */
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
