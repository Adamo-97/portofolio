"use client";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import StreetTimeline, { type RoadmapItem } from "@/components/roadmap/StreetTimeline";
import { motion } from "framer-motion";
import LoadingAnimation from "@/components/LoadingAnimation";

type ApiItem = { id: string; title: string; description: string; icon?: string; from: string; to?: string | null };

const BRAND = "#18a1fd";
const RGB = "24,161,253";            
const PARTICLES_DESKTOP = 220;
const PARTICLES_MOBILE  = 120;
const SPEED_MULT        = 1.6;        // >1 = faster float
const TWINKLE_RATE      = 1.4;        // >1 = faster twinkle
const DPR_CAP           = 1.75;       // cap devicePixelRatio for perf
const MAX_FPS           = 45;        

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showParticles, setShowParticles] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const r = await fetch("/api/roadmap", { cache: "no-store" });
        if (!r.ok) throw new Error(String(r.status));
        const all: ApiItem[] = await r.json();
        if (!off) {
          setItems(all as any);
          setLoading(false);
          // Show particles after content loads
          setTimeout(() => setShowParticles(true), 300);
        }
      } catch (e) {
        console.error("[RoadmapPage] fetch failed:", e);
        if (!off) {
          setLoading(false);
          setTimeout(() => setShowParticles(true), 300);
        }
      }
    })();
    return () => { off = true; };
  }, []);

  // --- Particle layer (brand-blue twinkles)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctxMaybe = canvas.getContext("2d");
    if (!ctxMaybe) return;

    // Capture non-null locals for inner functions (fixes TS18047)
    const cnv: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const dpr = Math.min(DPR_CAP, Math.max(1, window.devicePixelRatio || 1));
    const prefersReduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const parent = cnv.parentElement;
    if (!parent) return; // should exist, but keep TS happy

    const vw = () => Math.max(1, parent.clientWidth || window.innerWidth);
    const vh = () => Math.max(1, parent.clientHeight || window.innerHeight);

    const P_BASE = window.innerWidth <= 675 ? PARTICLES_MOBILE : PARTICLES_DESKTOP;
    const densityAdj = window.innerWidth > 1920 ? 0.85 : 1; // fewer on 2K/4K
    const P = prefersReduce
      ? Math.floor(P_BASE * 0.6 * densityAdj)
      : Math.floor(P_BASE * densityAdj);

    type Dot = { x: number; y: number; r: number; a: number; sp: number; ph: number };
    let dots: Dot[] = [];
    let running = !prefersReduce; // if reduced-motion, animate=false (we still render once)

    function resize() {
      const w = vw();
      const h = vh();
      cnv.width = Math.floor(w * dpr);
      cnv.height = Math.floor(h * dpr);
      cnv.style.width = w + "px";
      cnv.style.height = h + "px";

      // regenerate
      dots = Array.from({ length: P }, () => ({
        x: Math.random() * cnv.width,
        y: Math.random() * cnv.height,
        r: (0.6 + Math.random() * 1.8) * dpr,
        a: 0.15 + Math.random() * 0.45,
        sp: (0.25 + Math.random() * 0.7) * (prefersReduce ? 0 : 1),
        ph: Math.random() * Math.PI * 2,
      }));
    }

    function draw(ts: number) {
      // FPS throttle
      const now = performance.now();
      const elapsed = now - (lastTimeRef.current || 0);
      if (elapsed < 1000 / MAX_FPS) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTimeRef.current = now;

      ctx.clearRect(0, 0, cnv.width, cnv.height);

      for (const d of dots) {
        // float + drift (scaled)
        d.y += d.sp * 0.6 * dpr * SPEED_MULT;
        d.x += Math.sin((ts * 0.0003 * SPEED_MULT + d.ph) * 0.6) * 0.2 * dpr;

        if (d.y > cnv.height + 8 * dpr) {
          d.y = -8 * dpr;
          d.x = Math.random() * cnv.width;
        }

        // twinkle
        const tw = prefersReduce ? 0 : (Math.sin(ts * 0.001 * TWINKLE_RATE + d.ph) + 1) * 0.5; // 0..1
        const alpha = Math.min(1, Math.max(0, d.a * (0.5 + tw * 0.7)));

        const grd = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 2.2);
        grd.addColorStop(0, `rgba(${RGB},${alpha})`);
        grd.addColorStop(1, `rgba(${RGB},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running) rafRef.current = requestAnimationFrame(draw);
    }

    // Setup
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    if (!prefersReduce) {
      running = true;
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(draw);
    } else {
      // draw one static frame
      draw(0);
    }

    // Pause/resume on tab visibility
    const onVis = () => {
      if (prefersReduce) return; // static already
      if (document.hidden) {
        running = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else {
        running = true;
        lastTimeRef.current = 0;
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="bg-black flex flex-col overflow-hidden" style={{ minHeight: "100dvh" }}>
      <Header />

      {/* Slide area = remaining viewport */}
      <main
        className="relative flex-1 min-h-0 overflow-hidden px-[120px] pb-8 mq750:px-[60px] mq450:px-5 mq450:pb-6 grid place-items-center"
        // Fog derived from #18a1fd
        style={{
          backgroundImage: `
            radial-gradient(95% 90% at 10% 100%, rgba(${RGB},0.38) 0%, rgba(${RGB},0.22) 32%, rgba(${RGB},0.10) 58%, rgba(0,0,0,0) 82%),
            radial-gradient(95% 90% at 90% 100%, rgba(${RGB},0.38) 0%, rgba(${RGB},0.22) 32%, rgba(${RGB},0.10) 58%, rgba(0,0,0,0) 82%),
            radial-gradient(70% 65% at 18% 100%, rgba(${RGB},0.18) 0%, rgba(${RGB},0.10) 45%, rgba(0,0,0,0) 78%),
            radial-gradient(70% 65% at 82% 100%, rgba(${RGB},0.18) 0%, rgba(${RGB},0.10) 45%, rgba(0,0,0,0) 78%),
            linear-gradient(#000, #000)
          `,
          backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat",
          backgroundSize: "110vw 90vh, 110vw 90vh, 80vw 65vh, 80vw 65vh, 100% 100%",
          backgroundPosition:
            "left -20vw bottom -16vh, right -20vw bottom -16vh, left -8vw bottom -8vh, right -8vw bottom -8vh, center",
        }}
      >
        {/* Particle canvas with fade-in */}
        <canvas 
          ref={canvasRef} 
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-[800ms] ease-out" 
          style={{ opacity: showParticles ? 1 : 0 }}
          aria-hidden="true" 
        />

        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm">
            <LoadingAnimation text="Loading roadmap..." />
          </div>
        )}

        {/* Content above particles */}
        <div className="relative z-10 w-full max-w-[1600px] max-h-full place-self-center">
          <StreetTimeline
            items={items}
            accentColor={BRAND}
            laneHeight={460}
            iconSize={96}
            autoScale
            // Keep natural height; only cap so it never overflows the slide.
            // @ts-ignore
            style={{ width: "100%", height: "auto", maxHeight: "100%", overflow: "visible" }}
          />
        </div>
      </main>
    </div>
  );
}
