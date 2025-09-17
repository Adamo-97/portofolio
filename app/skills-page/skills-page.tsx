"use client";

import { useMemo, useState, useCallback } from "react";
import Header from "../../components/header";
import IsoGrid from "../../components/skills/IsoGrid";
import { SKILLS, type Skill } from "../../data/skills";
import { CATEGORIES, type CategoryKey } from "../../components/skills/categories";

const ORDER: CategoryKey[] = [
  "Languages",
  "Frontend",
  "Backend & Data",
  "Mobile",
  "Design & IDEs",
  "QA & Workflow",
];

const prevOf = (k: CategoryKey) => ORDER[(ORDER.indexOf(k) - 1 + ORDER.length) % ORDER.length];
const nextOf = (k: CategoryKey) => ORDER[(ORDER.indexOf(k) + 1) % ORDER.length];

const Chevron = ({ dir = "left" as "left" | "right" }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    {dir === "left" ? <path d="M15 19l-7-7 7-7" /> : <path d="M9 5l7 7-7 7" />}
  </svg>
);

export default function SkillsPage() {
  const [active, setActive] = useState<CategoryKey>("Languages");
  const goPrev = useCallback(() => setActive((a) => prevOf(a)), []);
  const goNext = useCallback(() => setActive((a) => nextOf(a)), []);

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
        {/* Centered title row with arrows; title is NOT clickable */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex items-center justify-center rounded-md bg-white/5 border border-white/10 px-2 py-2 text-white/80 hover:bg-white/10 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={`Previous: ${CATEGORIES[prevOf(active)].title}`}
            title={CATEGORIES[prevOf(active)].title}
          >
            <Chevron dir="left" />
          </button>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">
            {title}
          </h1>

          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center justify-center rounded-md bg-white/5 border border-white/10 px-2 py-2 text-white/80 hover:bg-white/10 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={`Next: ${CATEGORIES[nextOf(active)].title}`}
            title={CATEGORIES[nextOf(active)].title}
          >
            <Chevron dir="right" />
          </button>
        </div>

        {/* Description under the centered title */}
        <p className="mt-2 text-center text-white/70">{blurb}</p>

        {/* Two-column layout: left text (chips), right grid */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 items-start">
          {/* Left: names list ("other cards") */}
          <div>
            <ul className="flex flex-wrap gap-2 text-sm text-white/70">
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

          {/* Right: icon card grid */}
          <div>
            <IsoGrid items={filtered} />
          </div>
        </section>
      </main>
    </div>
  );
}
