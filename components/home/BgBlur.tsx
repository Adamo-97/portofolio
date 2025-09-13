"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
  height?: string;                   // visual height of the glow area
  cropPct?: number;                  // % to cut from bottom (0 = no bottom fade/cut)
  position?: "fixed" | "absolute";
  topFade?: string;                  // NEW: thickness of top fade (e.g. "20%", "80px", "18vh")
  enterDelayMs?: number;             // (already added earlier)
  enterDurationMs?: number;          // (already added earlier)
};

export default function BgBlur({
  className = "",
  height = "clamp(260px, 45vh, 520px)",
  cropPct = 30,
  position = "fixed",
  topFade = "20%",                   // ← gentle top fade by default
  enterDelayMs = 60,
  enterDurationMs = 520,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ---- Mask: top fade + optional bottom fade/cut ----
  const keepPct = Math.max(0, Math.min(100, 100 - cropPct));
  const topStops = topFade
    ? `transparent 0, white ${topFade}`
    : `white 0`;
  const bottomStops =
    cropPct > 0
      ? `white ${keepPct}%, transparent ${keepPct}%, transparent 100%`
      : `white 100%`;
  const mask = `linear-gradient(to bottom, ${topStops}, ${bottomStops})`;

  // ---- Enter animation state (from previous version) ----
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const t = window.setTimeout(() => setEntered(true), prefersReduced ? 0 : enterDelayMs);
    return () => window.clearTimeout(t);
  }, [enterDelayMs]);

  useEffect(() => {
    const el = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    let raf = 0;
    let last = performance.now();

    // Look/feel (tweak freely)
    const COLOR_BASE_ALPHA = 0.24;       // particle brightness
    const BASE_DENSITY = 0.00012;        // particles per pixel (pre-clamp)
    const SPEED = { min: 10, max: 34 };  // px/sec (upwards)
    const SIZE = { min: 1.2, max: 2.4 }; // px radius

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let particles: P[] = [];

    function maxParticlesForWidth(w: number) {
      // More on larger screens, but still capped for perf
      if (w < 480) return 160;
      if (w < 768) return 220;
      if (w < 1280) return 320;
      if (w < 1920) return 380;
      return 460;
    }

    const init = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(
        maxParticlesForWidth(w),
        Math.max(24, Math.round(w * h * BASE_DENSITY))
      );

      particles = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 6,
        vy: -lerp(SPEED.min, SPEED.max, Math.random()),
        r: lerp(SIZE.min, SIZE.max, Math.random()),
      }));
    };

    const draw = (now: number) => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const dt = (now - last) / 1000;
      last = now;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `rgba(24,161,253,${COLOR_BASE_ALPHA})`;

      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // wrap edges
        if (p.y + p.r < 0) p.y = h + p.r;
        if (p.y - p.r > h) p.y = -p.r;
        if (p.x + p.r < 0) p.x = w + p.r;
        if (p.x - p.r > w) p.x = -p.r;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };

    // Init + respond to size changes
    const ro = new ResizeObserver(() => init());
    ro.observe(el);
    init();

    // Reduced motion = single static frame
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (prefersReduced) {
      draw(performance.now());
      ro.disconnect();
      return () => {};
    }

    raf = requestAnimationFrame((t) => {
      last = t;
      draw(t);
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [height, cropPct, position]);

  return (
    <div
      ref={wrapperRef}
      className={[
        position === "fixed" ? "fixed" : "absolute",
        "pointer-events-none inset-x-0 bottom-0 w-screen overflow-hidden",
        className,
      ].join(" ")}
      style={{
        height,
        WebkitMaskImage: mask,
        maskImage: mask,
        clipPath: `inset(0 0 ${cropPct}% 0)`, // only affects bottom (fallback). With cropPct=0, no cut.
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0px)" : "translateY(8px)",
        transition: `opacity ${enterDurationMs}ms ease-out, transform ${enterDurationMs}ms ease-out`,
        willChange: "opacity, transform",
      }}
      aria-hidden
    >
      {/* Circular glow (bottom-center), sits under particles */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 100%, \
              rgba(24,161,253,0.55) 0%, \
              rgba(24,161,253,0.36) 28%, \
              rgba(24,161,253,0.18) 52%, \
              rgba(24,161,253,0.08) 68%, \
              transparent 100%)",
          filter: "blur(2px)",
        }}
      />
      {/* Particles on top */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}

// ------- helpers -------
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
