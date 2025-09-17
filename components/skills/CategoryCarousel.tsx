"use client";

import { useCallback, useMemo } from "react";
import {
  CATEGORIES,
  nextCategory,
  prevCategory,
  type CategoryKey,
} from "./categories";

type Props = {
  active: CategoryKey;
  onChange: (k: CategoryKey) => void;
};

export default function CategoryCarousel({ active, onChange }: Props) {
  const prev = useMemo(() => prevCategory(active), [active]);
  const next = useMemo(() => nextCategory(active), [active]);

  const goPrev = useCallback(() => onChange(prev), [prev, onChange]);
  const goNext = useCallback(() => onChange(next), [next, onChange]);

  const Chevron = ({ dir = "left" as "left" | "right" }) => (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      {dir === "left" ? <path d="M15 19l-7-7 7-7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[640px] select-none overflow-hidden"
      role="region"
      aria-label="Skill categories"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Edge fades to crop neighbor titles (partial, not full-width) */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent" />

      <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4 px-5">
        {/* Prev arrow */}
        <button
          type="button"
          onClick={goPrev}
          className="inline-flex items-center justify-center rounded-md bg-white/5 border border-white/10 px-2 py-2 text-white/80 hover:bg-white/10 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={`Previous: ${CATEGORIES[prev].title}`}
          title={CATEGORIES[prev].title}
        >
          <Chevron dir="left" />
        </button>

        {/* Cropped/faded neighbor titles + active title-as-button */}
        <div className="relative flex-1 flex items-center justify-center">
          <span
            aria-hidden
            className="absolute -left-6 translate-x-[-100%] text-xl sm:text-2xl font-semibold text-white/25 blur-[0.5px] pointer-events-none"
            style={{ transform: "translateX(-100%) rotate(-2deg)" }}
          >
            {CATEGORIES[prev].title}
          </span>

          <button
            type="button"
            onClick={goNext}
            className="px-1 text-2xl sm:text-3xl font-semibold tracking-tight text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-current="true"
            aria-label={`Current: ${CATEGORIES[active].title}. Click to go to ${CATEGORIES[next].title}`}
            title={CATEGORIES[active].title}
          >
            {CATEGORIES[active].title}
          </button>

          <span
            aria-hidden
            className="absolute -right-6 translate-x-[100%] text-xl sm:text-2xl font-semibold text-white/25 blur-[0.5px] pointer-events-none"
            style={{ transform: "translateX(100%) rotate(2deg)" }}
          >
            {CATEGORIES[next].title}
          </span>
        </div>

        {/* Next arrow */}
        <button
          type="button"
          onClick={goNext}
          className="inline-flex items-center justify-center rounded-md bg-white/5 border border-white/10 px-2 py-2 text-white/80 hover:bg-white/10 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={`Next: ${CATEGORIES[next].title}`}
          title={CATEGORIES[next].title}
        >
          <Chevron dir="right" />
        </button>
      </div>
    </div>
  );
}
