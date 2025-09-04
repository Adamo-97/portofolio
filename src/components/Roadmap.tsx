"use client";

import { useMemo, useState } from "react";
import type { RoadmapItem, RoadmapItemType } from "@/data/roadmap";
import SkillBadge from "@/components/Skillbadge";

const FILTERS: { label: string; value: RoadmapItemType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Projects", value: "project" },
  { label: "Work", value: "work" },
  { label: "Education", value: "education" },
  { label: "Certs", value: "cert" },
];

export default function Roadmap({ items }: { items: RoadmapItem[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => i.type === filter);
  }, [items, filter]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-3 py-1 text-sm ${
              filter === f.value ? "bg-black text-white dark:bg-white dark:text-black" : ""
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ol className="relative border-s">
        {filtered.map((item) => (
          <li key={item.id} className="mb-10 ms-6">
            <span className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full bg-black dark:bg-white" />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold">
                {item.title} {item.org ? <span className="opacity-70">· {item.org}</span> : null}
              </h3>
              <span className="text-sm opacity-70">{item.period}</span>
            </div>
            <p className="mt-1 text-sm opacity-90">{item.summary}</p>

            {item.tech && item.tech.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.tech.map((t) => (
                  <SkillBadge key={t} label={t} />
                ))}
              </div>
            )}

            <div className="mt-3 flex gap-3">
              {item.details && item.details.length > 0 && (
                <button
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                  className="text-sm underline underline-offset-4"
                >
                  {expanded === item.id ? "Hide details" : "Show details"}
                </button>
              )}
              {item.linkHref && item.linkLabel && (
                <a
                  href={item.linkHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline underline-offset-4"
                >
                  {item.linkLabel}
                </a>
              )}
            </div>

            {expanded === item.id && item.details && (
              <ul className="mt-2 list-disc space-y-1 ps-6 text-sm opacity-90">
                {item.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
