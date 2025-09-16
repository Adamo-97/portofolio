"use client";

import { useMemo } from "react";
import { CATEGORIES, type CategoryKey } from "./categories";

type Props = {
  active: CategoryKey;
  onChange: (k: CategoryKey) => void;
};

export default function CategoryPills({ active, onChange }: Props) {
  const entries = useMemo(
    () => Object.keys(CATEGORIES) as CategoryKey[],
    []
  );

  return (
    <nav
      aria-label="Skill categories"
      className="w-full overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]"
    >
      <ul className="flex items-center gap-2">
        {entries.map((key) => {
          const isActive = key === active;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onChange(key)}
                className={[
                  "px-3 py-1.5 rounded-full text-sm transition border",
                  "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20",
                  isActive ? "bg-white/20 border-white/30" : "",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                ].join(" ")}
                aria-pressed={isActive}
              >
                {key}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
