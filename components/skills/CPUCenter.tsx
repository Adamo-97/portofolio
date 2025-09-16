// components/skills/CPUCenter.tsx
"use client";

import React from "react";

type Props = {
  size: number;              // px
  title: string;
  onPrev: () => void;
  onNext: () => void;
};

export default function CPUCenter({ size, title, onPrev, onNext }: Props) {
  // Map your 60/56/52/44/40 card to the passed size, keeping the same proportions
  const s = Math.max(140, Math.round(size));               // outer  w-60 h-60
  const inner1 = Math.round(s * (56 / 60));                // w-56 h-56
  const inner2 = Math.round(s * (52 / 60));                // w-52 h-52
  const contentW = Math.round(s * (44 / 60));              // w-44
  const contentH = Math.round(s * (40 / 60));              // h-40

  return (
    <div
      className="relative flex items-center justify-center rounded-3xl bg-sky-500"
      style={{
        width: s,
        height: s,
        // keep your “shadow-inner shadow-gray-50” vibe with explicit box-shadows
        boxShadow:
          "inset 0 10px 30px rgba(255,255,255,0.35), inset 0 -10px 25px rgba(2,132,199,0.35)",
      }}
    >
      {/* BIG blue halo you liked (stays on) */}
      <div
        className="pointer-events-none absolute -z-10"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: s * 2.1,
          height: s * 2.1,
          borderRadius: 9999,
          background:
            "radial-gradient(closest-side, rgba(56,190,255,0.98), rgba(56,190,255,0.65) 45%, rgba(56,190,255,0.25) 70%, transparent 78%)",
          filter:
            "blur(22px) drop-shadow(0 0 55px rgba(56,190,255,0.95)) drop-shadow(0 0 110px rgba(56,190,255,0.8))",
        }}
      />

      {/* inner 1: bg-neutral-900 shadow-inner shadow-gray-50 rounded-3xl */}
      <div
        className="flex items-center justify-center rounded-3xl bg-neutral-900"
        style={{
          width: inner1,
          height: inner1,
          boxShadow:
            "inset 0 10px 28px rgba(255,255,255,0.2), inset 0 -10px 24px rgba(0,0,0,0.65)",
        }}
      >
        {/* inner 2: bg-neutral-900 shadow-inner rounded-2xl */}
        <div
          className="flex items-center justify-center rounded-2xl bg-neutral-900"
          style={{
            width: inner2,
            height: inner2,
            boxShadow:
              "inset 0 10px 24px rgba(255,255,255,0.12), inset 0 -10px 20px rgba(0,0,0,0.6)",
          }}
        >
          {/* content area (your w-44 h-40 card) */}
          <div
            className="relative flex items-center justify-center rounded-xl bg-neutral-900 text-gray-50"
            style={{
              width: contentW,
              height: contentH,
              boxShadow:
                "inset 0 8px 18px rgba(255,255,255,0.12), inset 0 -8px 16px rgba(0,0,0,0.6)",
            }}
          >
            {/* the small orange-glow dot you had behind the time → replaced with a brighter blue pad behind the title */}
            <span
              className="absolute rounded-full"
              style={{
                top: "28%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: Math.max(48, Math.round(contentW * 0.28)),
                height: Math.max(48, Math.round(contentW * 0.28)),
                background:
                  "radial-gradient(closest-side, rgba(56,190,255,0.95), rgba(56,190,255,0.35) 60%, transparent 75%)",
                filter: "blur(8px) drop-shadow(0 0 16px rgba(56,190,255,0.9))",
                opacity: 1,
              }}
              aria-hidden
            />

            {/* Row: Prev | Title | Next (centered) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onPrev}
                className="grid place-items-center h-9 w-9 rounded-full border border-white/20 bg-white/10 text-white/95 hover:bg-white/20 active:scale-95"
                aria-label="Previous category"
              >
                ‹
              </button>

              <div className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/95 backdrop-blur-sm [box-shadow:0_0_30px_rgba(56,190,255,0.55),inset_0_0_24px_rgba(56,190,255,0.35)]">
                <span className="font-medium tracking-wide">{title}</span>
              </div>

              <button
                type="button"
                onClick={onNext}
                className="grid place-items-center h-9 w-9 rounded-full border border-white/20 bg-white/10 text-white/95 hover:bg-white/20 active:scale-95"
                aria-label="Next category"
              >
                ›
              </button>
            </div>

            {/* tiny label like your “fitbit” footer, optional—comment out if you don’t want it */}
            {/* <span className="absolute bottom-1 text-gray-400 text-xs font-light">fitbit</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}
