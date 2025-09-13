"use client";
import Image from "next/image";
import React, { useMemo, type CSSProperties } from "react";

export type DownloadCvButtonProps =
  React.ComponentProps<"button"> & {
    className?: string;
    downloadCV?: string;
    iconPlaceholder: string;
    href?: string;                 // optional: link to your CV (e.g., "/cv.pdf")
    downloadAttr?: boolean;        // optional: add download attribute on <a>
    // Optional overrides; if provided, they will override the responsive defaults
    downloadCvButtonHeight?: CSSProperties["height"];
    iconPlaceholderWidth?: CSSProperties["width"];
    iconPlaceholderHeight?: CSSProperties["height"];
  };

export default function DownloadCvButton({  // name fixed, default export so your import can still be any name
  className = "",
  downloadCV = "Download CV",
  iconPlaceholder,
  href,
  downloadAttr = false,
  downloadCvButtonHeight,
  iconPlaceholderWidth,
  iconPlaceholderHeight,
  ...btnProps
}: DownloadCvButtonProps) {
  const wrapperStyle: CSSProperties = useMemo(
    () => ({ height: downloadCvButtonHeight }),
    [downloadCvButtonHeight]
  );
  const iconStyle: CSSProperties = useMemo(
    () => ({ width: iconPlaceholderWidth, height: iconPlaceholderHeight }),
    [iconPlaceholderWidth, iconPlaceholderHeight]
  );

  // === Inner pill (blue) — EXACT same paddings / radius ===
  const inner = (
    <div
      className={[
        "inner relative isolate",
        "rounded-[clamp(30px,8vw,60px)]",
        "bg-cornflowerblue-100",
        "border-lightgray border-solid border-[0.5px]",
        "overflow-hidden",
        "flex flex-row items-center justify-center",
        "py-[clamp(6px,1.4vw,9px)]",
        "px-[clamp(12px,2.2vw,19px)]",
        "gap-[clamp(6px,1.4vw,11px)]",
      ].join(" ")}
      style={
        {
          ["--ink-color" as any]: "#0A6FC2", // darker on hover
          ["--ink-speed" as any]: "2.4s",
        } as React.CSSProperties
      }
    >
      {/* label */}
      <div
        className={[
          "relative z-10",
          "text-[clamp(14px,2.2vw,25.7px)]",
          "leading-none", // prevent extra vertical space
          "tracking-[-0.01em] font-medium font-urbanist text-white text-left",
          "select-none",
        ].join(" ")}
      >
        {downloadCV}
      </div>

      {/* icon (rotates + nudges on hover) */}
      <span
        className={[
          "icon relative z-10 grid place-items-center",
          "w-[clamp(22px,4vw,42px)] h-[clamp(22px,4vw,42px)]",
          "transition-transform duration-500 ease-out will-change-transform",
          "group-hover:translate-x-[2px] group-hover:rotate-135",
        ].join(" ")}
      >
        <Image
          className="w-full h-full"
          width={42}
          height={42}
          sizes="100vw"
          alt=""
          src={iconPlaceholder}
          style={iconStyle}
        />
      </span>

      {/* liquid fill via pseudo-elements — zero layout impact */}
      <style jsx>{`
        .inner::before,
        .inner::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .inner::before {
          background-color: var(--ink-color);
          transform-origin: left center;
          transform: scaleX(0);
          transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .inner::after {
          opacity: 0;
          mix-blend-mode: soft-light;
          background:
            radial-gradient(40% 120% at 20% 50%, rgba(255,255,255,0.45) 0%, transparent 60%),
            radial-gradient(40% 120% at 70% 50%, rgba(255,255,255,0.25) 0%, transparent 60%);
          background-repeat: no-repeat;
          background-size: 120% 100%, 120% 100%;
          animation: inkWave var(--ink-speed) linear infinite;
          transition: opacity 360ms ease-out;
        }
        :global(.group:hover) .inner::before,
        :global(.group:focus-visible) .inner::before {
          transform: scaleX(1);
        }
        :global(.group:hover) .inner::after,
        :global(.group:focus-visible) .inner::after {
          opacity: 0.30;
        }
        @keyframes inkWave {
          0%   { background-position: 0% 0%, 60% 0%; }
          100% { background-position: 120% 0%, 180% 0%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .inner::before { transition: none; transform: scaleX(1); }
          .inner::after  { animation: none; opacity: 0.25; }
          :global(.group:hover) .icon,
          :global(.group:focus-visible) .icon { transform: none; }
        }
      `}</style>
    </div>
  );

  // === Outer shell
  const baseClasses = [
    "group",
    "cursor-pointer",
    "border-white border-solid border-[2px]",
    "py-[clamp(6px,1.1vw,8px)]",
    "px-[clamp(6px,1.1vw,8px)]",
    "bg-gray-300 min-h-[clamp(44px,8vw,82px)]",
    "[backdrop-filter:blur(15px)]",
    "rounded-[clamp(26px,6vw,50px)]",
    "box-border overflow-hidden",
    "flex flex-row items-center justify-center",
  ].join(" ");

  // Positioning is still entirely controlled by `className` prop.
  // e.g. className="absolute left-1/2 -translate-x-1/2 bottom-6 z-40"
  return href ? (
    <a
      href={href}
      {...(downloadAttr ? { download: "" } : {})}
      className={`${baseClasses} ${className}`}
      style={wrapperStyle}
    >
      {inner}
    </a>
  ) : (
    <button className={`${baseClasses} ${className}`} style={wrapperStyle} {...btnProps}>
      {inner}
    </button>
  );
}
