"use client";
import Image from "next/image";
import React, { useEffect, useMemo, useState, type CSSProperties } from "react";

export type DownloadCvButtonProps =
  React.ComponentProps<"button"> & {
    className?: string;
    downloadCV?: string;
    iconPlaceholder: string;
    href?: string;                 // optional: link to your CV (e.g., "/cv.pdf")
    downloadAttr?: boolean;        // optional: add download attribute on <a>

    // Optional sizing overrides
    downloadCvButtonHeight?: CSSProperties["height"];
    iconPlaceholderWidth?: CSSProperties["width"];
    iconPlaceholderHeight?: CSSProperties["height"];

    // Entrance + control
    animateIn?: boolean;           // animate when becoming visible
    enterDelayMs?: number;         // delay before anim starts
    enterDurationMs?: number;      // how long the anim takes
    show?: boolean;                // <<< NEW: externally controlled visibility
    resetOnHide?: boolean;         // reset animation state when show goes false (default true)

    // Micro-interactions
    liftOnHover?: boolean;         // subtle hover lift
  };

export default function DownloadCvButton({
  className = "",
  downloadCV = "Download CV",
  iconPlaceholder,
  href,
  downloadAttr = false,
  downloadCvButtonHeight,
  iconPlaceholderWidth,
  iconPlaceholderHeight,
  animateIn = true,
  enterDelayMs = 200,
  enterDurationMs = 520,
  show = true,
  resetOnHide = true,
  liftOnHover = true,
  ...btnProps
}: DownloadCvButtonProps) {
  // "entered" drives the mount animation (opacity/translate/scale)
  const [entered, setEntered] = useState<boolean>(!animateIn && show);

  useEffect(() => {
    if (!animateIn) {
      setEntered(show);
      return;
    }
    if (show) {
      const t = setTimeout(() => setEntered(true), Math.max(0, enterDelayMs));
      return () => clearTimeout(t);
    } else if (resetOnHide) {
      setEntered(false);
    }
  }, [show, animateIn, enterDelayMs, resetOnHide]);

  const wrapperStyle: CSSProperties = useMemo(
    () => ({
      height: downloadCvButtonHeight,
      transition: `opacity ${enterDurationMs}ms cubic-bezier(.22,1,.36,1), transform ${enterDurationMs}ms cubic-bezier(.22,1,.36,1)`,
    }),
    [downloadCvButtonHeight, enterDurationMs]
  );

  const iconStyle: CSSProperties = useMemo(
    () => ({ width: iconPlaceholderWidth, height: iconPlaceholderHeight }),
    [iconPlaceholderWidth, iconPlaceholderHeight]
  );

  // === Inner pill (blue) — your existing ink effect ===
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
          ["--ink-color" as any]: "#0A6FC2",
          ["--ink-speed" as any]: "2.4s",
        } as React.CSSProperties
      }
    >
      <div
        className={[
          "relative z-10",
          "text-[clamp(14px,2.2vw,25.7px)]",
          "leading-none",
          "tracking-[-0.01em] font-medium font-urbanist text-white text-left",
          "select-none",
        ].join(" ")}
      >
        {downloadCV}
      </div>

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
        }
      `}</style>
    </div>
  );

  // === Outer shell (entrance controlled by `entered`) ===
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
    // entrance
    entered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-[10px] scale-[0.985]",
    // micro
    "transform-gpu will-change-transform",
    liftOnHover ? "hover:shadow-[0_10px_28px_rgba(24,161,253,0.25)]" : "",
    "active:translate-y-0 active:scale-[0.99]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cornflowerblue-100/80",
    // keep it non-interactive while hidden
    entered ? "pointer-events-auto" : "pointer-events-none",
  ].join(" ");

  const content = inner;

  return href ? (
    <a
      href={href}
      aria-label={downloadCV}
      {...(downloadAttr ? { download: "" } : {})}
      className={`${baseClasses} ${className}`}
      style={wrapperStyle}
    >
      {content}
    </a>
  ) : (
    <button
      aria-label={downloadCV}
      className={`${baseClasses} ${className}`}
      style={wrapperStyle}
      {...btnProps}
    >
      {content}
    </button>
  );
}
