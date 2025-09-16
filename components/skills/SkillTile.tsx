// components/skills/SkillTile.tsx
"use client";

import Image from "next/image";
import React from "react";

export type SkillTileProps = {
  title: string;
  src: string;
  /** Square tile size in px */
  boxSize?: number;
  /** Icon size in px (auto if omitted) */
  iconSize?: number;
  className?: string;
};

export default function SkillTile({
  title,
  src,
  boxSize = 86,
  iconSize,
  className = "",
}: SkillTileProps) {
  const isSvg = src.toLowerCase().endsWith(".svg");

  // Normalize: give every icon comfortable padding so different SVG viewBoxes look consistent
  const pad = Math.round(boxSize * 0.18);          // ~18% padding looks good
  const inner = boxSize - pad * 2;                 // square for the icon container
  const icon = Math.min(inner, iconSize ?? Math.max(32, Math.round(boxSize * 0.55)));

  return (
    <div className={`grid place-items-center ${className}`}>
      <div
        className={[
          "rounded-xl border border-white/10 bg-white/10 backdrop-blur-md",
          "[filter:drop-shadow(0_0_22px_rgba(24,161,253,0.55))]",
          "transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
          "hover:scale-105 active:scale-95",
          "grid place-items-center",
        ].join(" ")}
        style={{ width: boxSize, height: boxSize }}
        title={title}
        aria-label={title}
      >
        <div
          className="grid place-items-center"
          style={{ width: inner, height: inner }}
        >
          {isSvg ? (
            <img
              src={src}
              alt={title}
              width={icon}
              height={icon}
              className="select-none"
              style={{ objectFit: "contain" }}
            />
          ) : (
            <Image
              src={src}
              alt={title}
              width={icon}
              height={icon}
              className="select-none object-contain"
            />
          )}
        </div>
      </div>
      <div className="mt-1 text-center text-[11px] sm:text-xs text-white/85 font-urbanist max-w-[140px]">
        {title}
      </div>
    </div>
  );
}
