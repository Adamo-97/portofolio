"use client";
import React from "react";

interface LanguageChipsProps {
  languages: Record<string, number>;
  maxDisplay?: number;
}

const LanguageChips: React.FC<LanguageChipsProps> = ({ languages, maxDisplay = 5 }) => {
  // Sort languages by percentage descending
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxDisplay);

  if (sortedLanguages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {sortedLanguages.map(([lang, percentage]) => (
        <div
          key={lang}
          className="px-2.5 py-1 rounded-full bg-cornflowerblue-400/30 border border-cornflowerblue-100/40 backdrop-blur-sm"
        >
          <span className="text-xs font-medium text-white/90">
            {lang} <span className="text-cornflowerblue-100">{percentage}%</span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default LanguageChips;
