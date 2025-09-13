"use client";

import Image from "next/image";
import { useEffect, useState, useMemo, type CSSProperties } from "react";

type Props = {
  className?: string;
  src?: string;
  scale?: number;
  onImgReady?: (ar: number) => void; // h/w
  innerStyle?: CSSProperties;

  /** Smooth entrance controls */
  delayMs?: number;          // start delay
  durationMs?: number;       // focus-in duration
  liftPx?: number;           // initial downward offset (animates to 0)
  blurPx?: number;           // initial blur (animates to 0)
  startScale?: number;       // initial scale (animates to 1)

  /** Optional sheen sweep across the image after it appears */
  sheen?: boolean;
  sheenDelayMs?: number;     // defaults to delayMs + 200
  sheenDurationMs?: number;  // duration of the sweep
  sheenOpacity?: number;     // 0..1
};

export default function MainPicPlaceholder({
  className = "",
  src = "/home/image-placeholder@2x.png",
  scale = 1,
  onImgReady,
  innerStyle,

  delayMs = 220,
  durationMs = 720,
  liftPx = 10,
  blurPx = 10,
  startScale = 0.985,

  sheen = true,
  sheenDelayMs,
  sheenDurationMs = 800,
  sheenOpacity = 0.35,
}: Props) {
  const [ready, setReady] = useState(false);   // wait for natural size → no size flash
  const [entered, setEntered] = useState(false);

  // Respect reduced motion
  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (prefersReduced) { setEntered(true); return; }
    const t = setTimeout(() => setEntered(true), delayMs);
    return () => clearTimeout(t);
  }, [ready, delayMs, prefersReduced]);

  const vars: CSSProperties = {
    ["--dur" as any]: `${durationMs}ms`,
    ["--delay" as any]: `0ms`, // we handle delay via entered timing above
    ["--lift" as any]: `${liftPx}px`,
    ["--blur" as any]: `${blurPx}px`,
    ["--startScale" as any]: String(startScale),
    ["--sheenDelay" as any]: `${(sheenDelayMs ?? delayMs + 200)}ms`,
    ["--sheenDur" as any]: `${sheenDurationMs}ms`,
    ["--sheenAlpha" as any]: String(sheenOpacity),
  };

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div
        className={["absolute inset-0", ready ? "" : "invisible"].join(" ")}
        style={{ transform: `scale(${scale})`, transformOrigin: "bottom center", ...innerStyle, ...vars }}
      >
        {/* Image: sharpens, lifts, and scales into place */}
        <div className={["smooth-wrap", entered ? "is-in" : ""].join(" ")}>
          <Image
            src={src}
            alt="Adam portrait"
            fill
            priority
            className="object-contain object-bottom select-none pointer-events-none"
            sizes="(max-width: 768px) 90vw, 720px"
            onLoad={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.naturalWidth > 0) {
                onImgReady?.(img.naturalHeight / img.naturalWidth);
                setReady(true);
              }
            }}
          />

          {/* Optional sheen sweep (subtle, professional) */}
          {sheen && (
            <span aria-hidden className="sheen" />
          )}
        </div>

        <style jsx>{`
          .smooth-wrap {
            position: absolute;
            inset: 0;
            /* start soft & slightly low */
            opacity: 0;
            filter: blur(var(--blur));
            transform: translateY(var(--lift)) scale(var(--startScale));
            transition:
              opacity var(--dur) cubic-bezier(0.22,1,0.36,1),
              filter  var(--dur) cubic-bezier(0.22,1,0.36,1),
              transform var(--dur) cubic-bezier(0.22,1,0.36,1);
            will-change: opacity, filter, transform;
          }
          .smooth-wrap.is-in {
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0) scale(1);
          }

          /* Sheen: a diagonal light sweep that plays once */
          .sheen {
            position: absolute;
            inset: 0;
            pointer-events: none;
            opacity: 0;
            background:
              linear-gradient(
                75deg,
                rgba(255,255,255,0) 0%,
                rgba(255,255,255,var(--sheenAlpha)) 45%,
                rgba(255,255,255,0) 60%
              );
            transform: translateX(-140%) skewX(-8deg);
            animation:
              sheenSweep var(--sheenDur) cubic-bezier(0.22,1,0.36,1) var(--sheenDelay) 1 forwards;
          }
          @keyframes sheenSweep {
            0%   { opacity: 0; transform: translateX(-140%) skewX(-8deg); }
            10%  { opacity: var(--sheenAlpha); }
            100% { opacity: 0; transform: translateX(140%) skewX(-8deg); }
          }

          @media (prefers-reduced-motion: reduce) {
            .smooth-wrap {
              opacity: 1 !important;
              filter: none !important;
              transform: none !important;
              transition: none !important;
            }
            .sheen { display: none !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
