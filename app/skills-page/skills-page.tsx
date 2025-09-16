"use client";

import Header from "../../components/header";
import { useMemo, useState } from "react";
import { SKILLS, type Skill } from "../../data/skills"; // adjust to your SKILLS path
import { CATEGORIES, type CategoryKey } from "../../components/skills/categories";
import CategoryPills from "../../components/skills/CategoryPills";
import IsoGrid from "../../components/skills/IsoGrid";

export default function SkillsPage() {
  const [active, setActive] = useState<CategoryKey>("Build");

  const filtered = useMemo<Skill[]>(
    () =>
      SKILLS
        .filter((s) => s.category === active)
        .sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0)),
    [active]
  );

  const { title, blurb } = CATEGORIES[active];

  return (
    <div className="w-full min-h-[100svh] bg-black text-white">
      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-10">
        {/* tiny navbar-like category pills */}
        <CategoryPills active={active} onChange={setActive} />

        {/* Two-column layout: left text, right bounded iso board */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 items-start">
          {/* Left text panel */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-white/70">{blurb}</p>

            {/* Names of icons */}
            <ul className="mt-5 flex flex-wrap gap-2 text-sm text-white/70">
              {filtered.map((s) => (
                <li
                  key={s.id}
                  className="px-2 py-1 rounded-md bg-white/5 border border-white/10"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: bounded iso grid. Change cols/tile/gap if you want a different density */}
          <div>
            <IsoGrid items={filtered} cols={7} tile={92} gap={12} />
          </div>
        </section>
      </main>
    </div>
  );
}
