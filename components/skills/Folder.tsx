"use client";

import React, { useId } from "react";

type Palette = "blue" | "red" | "purple" | "green";

type Props = {
  active?: boolean;
  size?: "lg" | "sm";
  className?: string;
  onClick?: () => void;
  glow?: boolean;
  palette?: Palette;
  boxClassName?: string;
};

export default function Folder({
  active = false,
  size = "lg",
  className = "",
  boxClassName = "",
  onClick,
  glow = false,
  palette = "blue",
}: Props) {
  const scaleCls = size === "lg" ? "scale-100" : "scale-[0.86]";
  const gid = useId();

  // Gradients per palette
  const pal: Record<Palette, { backFrom: string; backTo: string; frontFrom: string; frontTo: string }> = {
    blue:   { backFrom: "#57ADDB", backTo: "#098DD6", frontFrom: "#73D7FF", frontTo: "#6BCBF3" },
    red:    { backFrom: "#FCA5A5", backTo: "#EF4444", frontFrom: "#FEB2B2", frontTo: "#F87171" },
    purple: { backFrom: "#C4B5FD", backTo: "#7C3AED", frontFrom: "#D6CCFF", frontTo: "#A78BFA" },
    green:  { backFrom: "#86EFAC", backTo: "#16A34A", frontFrom: "#B7F7CE", frontTo: "#34D399" },
  };
  const col = pal[palette];

  // BACK silhouette (with tab)
  const PATH_BACK =
    "M147.2 806H856.8C897.124 806 917.286 806 932.687 798.152C946.235 791.25 957.25 780.235 964.152 766.687C972 751.286 972 731.124 972 690.8V205.2C972 164.876 972 144.714 964.152 129.313C957.25 115.765 946.235 104.75 932.687 97.8475C917.286 90 897.124 90 856.8 90H467.5C446 90 418.5 88 391.5 67.5C364.5 47 387.5 64.5 359 42.5C330.5 20.5 315.966 16 291 16H147.2C106.876 16 86.7143 16 71.3127 23.8475C57.765 30.7504 46.7504 41.765 39.8475 55.3127C32 70.7143 32 90.8762 32 131.2V690.8C32 731.124 32 751.286 39.8475 766.687C46.7504 780.235 57.765 791.25 71.3127 798.152C86.7143 806 106.876 806 147.2 806Z";

  // FRONT rect from your SVG
  const FRONT_RECT = { x: 32, y: 150, w: 940, h: 656, r: 72 };



  return (
  <div
    onClick={onClick}
    onKeyDown={(e) => {
      if (!onClick) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }
    }}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    aria-pressed={onClick ? active : undefined}
    aria-label="Folder"
    className={[
        "relative inline-block group select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cornflowerblue-100/70",
        className,
      ].join(" ")}
    >
      {glow && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] blur-2xl"
          style={{ background: "radial-gradient(40% 60% at 50% 50%, rgba(24,161,253,0.36), rgba(24,161,253,0))" }}
        />
      )}

      <div className={["relative origin-bottom transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]", scaleCls].join(" ")}>
        {/* Layout box with perspective so the open has depth */}
        <div className={["relative", boxClassName ?? "w-60 h-40", "[perspective:1500px]"].join(" ")}>
          {/* Back shell */}
          <svg data-part="back" viewBox="32 16 940 790" className="absolute inset-0 w-full h-full" aria-hidden>
            <defs>
              <linearGradient id={`back-${gid}`} x1="502" y1="16" x2="502" y2="854" gradientUnits="userSpaceOnUse">
                <stop stopColor={col.backFrom} />
                <stop offset="0.23" stopColor={col.backTo} />
              </linearGradient>
            </defs>
            <path d={PATH_BACK} fill={`url(#back-${gid})`} />
          </svg>

        {/* === PAPERS (exact-fit: same width/radius as front rect) === */}
        {/* Layer 1 */}
        <svg
        viewBox="32 16 940 790"
        className={[
            "absolute inset-0 w-full h-full origin-bottom pointer-events-none",
            "transition-transform duration-300 ease",
            active ? "[transform:rotateX(-20deg)]" : "group-hover:[transform:rotateX(-20deg)]",
        ].join(" ")}
        aria-hidden
        >
        <defs>
            <clipPath id={`paper-clip-1-${gid}`}>
            <rect x={32} y={150} width={940} height={656} rx={72} ry={72} />
            </clipPath>
        </defs>
        <g clipPath={`url(#paper-clip-1-${gid})`}>
            <rect x={32} y={150} width={940} height={656} fill="#a1a1aa" /> {/* zinc-400 */}
        </g>
        </svg>

        {/* Layer 2 */}
        <svg
        viewBox="32 16 940 790"
        className={[
            "absolute inset-0 w-full h-full origin-bottom pointer-events-none",
            "transition-transform duration-300 ease",
            active ? "[transform:rotateX(-30deg)]" : "group-hover:[transform:rotateX(-30deg)]",
        ].join(" ")}
        aria-hidden
        >
        <defs>
            <clipPath id={`paper-clip-2-${gid}`}>
            <rect x={32} y={150} width={940} height={656} rx={72} ry={72} />
            </clipPath>
        </defs>
        <g clipPath={`url(#paper-clip-2-${gid})`}>
            <rect x={32} y={150} width={940} height={656} fill="#d4d4d8" /> {/* zinc-300 */}
        </g>
        </svg>

        {/* Layer 3 */}
        <svg
        viewBox="32 16 940 790"
        className={[
            "absolute inset-0 w-full h-full origin-bottom pointer-events-none",
            "transition-transform duration-300 ease",
            active ? "[transform:rotateX(-38deg)]" : "group-hover:[transform:rotateX(-38deg)]",
        ].join(" ")}
        aria-hidden
        >
        <defs>
            <clipPath id={`paper-clip-3-${gid}`}>
            <rect x={32} y={150} width={940} height={656} rx={72} ry={72} />
            </clipPath>
        </defs>
        <g clipPath={`url(#paper-clip-3-${gid})`}>
            <rect x={32} y={150} width={940} height={656} fill="#e4e4e7" /> {/* zinc-200 */}
        </g>
        </svg>
        {/* FRONT face (gradient, on top of papers) */}
        <svg
        data-part="front"
        viewBox="32 16 940 790"
        className={[
            "absolute inset-0 w-full h-full origin-bottom transition-transform duration-300 ease",
            active ? "[transform:rotateX(-46deg)_translateY(1px)]"
                : "group-hover:[transform:rotateX(-46deg)_translateY(1px)]",
        ].join(" ")}
        aria-hidden
        >
        <defs>
            <linearGradient id={`front-${gid}`} x1="502" y1="150" x2="502" y2="806" gradientUnits="userSpaceOnUse">
            <stop stopColor={col.frontFrom} />
            <stop offset="1" stopColor={col.frontTo} />
            </linearGradient>
        </defs>
        <rect x={32} y={150} width={940} height={656} rx={72} ry={72} fill={`url(#front-${gid})`} />
        </svg>

        </div>
      </div>
    </div>
  );
}
