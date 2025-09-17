"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Header from "../../components/header";
import IsoGrid from "../../components/skills/IsoGrid";
import { SKILLS, type Skill } from "../../data/skills";
import {
  CATEGORIES,
  CATEGORY_ORDER,
  nextCategory,
  prevCategory,
  type CategoryKey,
} from "../../components/skills/categories";

const Chevron = ({ dir = "left" as "left" | "right" }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    {dir === "left" ? <path d="M15 19l-7-7 7-7" /> : <path d="M9 5l7 7-7 7" />}
  </svg>
);

export default function SkillsPage() {
  const [active, setActive] = useState<CategoryKey>("Languages");
  const titleRef = useRef<HTMLHeadingElement>(null);

  const goPrev = useCallback(
    () => setActive((a) => prevCategory(a)),
    []
  );
  const goNext = useCallback(
    () => setActive((a) => nextCategory(a)),
    []
  );

  // After the category changes, move focus to the title for SR users.
  useEffect(() => {
    // Use rAF to ensure the DOM has updated.
    const id = requestAnimationFrame(() => titleRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [active]);

  const filtered = useMemo<Skill[]>(
    () =>
      SKILLS
        .filter((s) => s.category === active)
        // Higher weight first; stable tiebreaker on name.
        .sort(
          (a, b) =>
            (b.weight ?? 0) - (a.weight ?? 0) ||
            a.name.localeCompare(b.name)
        ),
    [active]
  );

  const { title, blurb } = CATEGORIES[active];
  const prev = prevCategory(active);
  const next = nextCategory(active);

  // Keyboard navigation parity with CategoryCarousel
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  return (
    <div className="w-full min-h-[100svh] bg-black text-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-10">
        {/* Centered title row with arrows; now keyboard-accessible */}
        <div
          className="flex items-center justify-center gap-3 sm:gap-4"
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-label="Skill categories"
        >
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex items-center justify-center rounded-md bg-white/5 border border-white/10 px-2 py-2 text-white/80 hover:bg-white/10 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={`Previous: ${CATEGORIES[prev].title}`}
          >
            <Chevron dir="left" />
          </button>

          <h1
            ref={titleRef}
            tabIndex={-1}
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-center"
            aria-live="polite"
          >
            {title}
          </h1>

          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center justify-center rounded-md bg-white/5 border border-white/10 px-2 py-2 text-white/80 hover:bg-white/10 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={`Next: ${CATEGORIES[next].title}`}
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

        {/* Hidden live region for SR to announce prev/next neighbor titles */}
        <div className="sr-only" aria-live="polite">
          Previous category: {CATEGORIES[prev].title}. Next category: {CATEGORIES[next].title}.
        </div>
      </main>
    </div>
  );
}
