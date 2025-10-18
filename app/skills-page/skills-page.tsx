"use client";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import SkillsGrid from "@/components/skills/SkillsGrid";

const BRAND = "#18a1fd";
const RGB = "24,161,253";
const PARTICLES_DESKTOP = 220;
const PARTICLES_MOBILE = 120;
const SPEED_MULT = 1.6;
const TWINKLE_RATE = 1.4;
const DPR_CAP = 1.75;
const MAX_FPS = 45;

export default function Page() {
  const [showParticles, setShowParticles] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Show particles after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setShowParticles(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctxMaybe = canvas.getContext("2d");
    if (!ctxMaybe) return;

    const cnv: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const dpr = Math.min(DPR_CAP, Math.max(1, window.devicePixelRatio || 1));
    const prefersReduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const parent = cnv.parentElement;
    if (!parent) return;

    const vw = () => Math.max(1, parent.clientWidth || window.innerWidth);
    const vh = () => Math.max(1, parent.clientHeight || window.innerHeight);

    const P_BASE = window.innerWidth <= 675 ? PARTICLES_MOBILE : PARTICLES_DESKTOP;
    const densityAdj = window.innerWidth > 1920 ? 0.85 : 1;
    const P = prefersReduce
      ? Math.floor(P_BASE * 0.6 * densityAdj)
      : Math.floor(P_BASE * densityAdj);

    type Dot = { x: number; y: number; r: number; a: number; sp: number; ph: number };
    let dots: Dot[] = [];
    let running = !prefersReduce;

    function resize() {
      const w = vw();
      const h = vh();
      cnv.width = Math.floor(w * dpr);
      cnv.height = Math.floor(h * dpr);
      cnv.style.width = w + "px";
      cnv.style.height = h + "px";

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
      const now = performance.now();
      const elapsed = now - (lastTimeRef.current || 0);
      if (elapsed < 1000 / MAX_FPS) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTimeRef.current = now;

      ctx.clearRect(0, 0, cnv.width, cnv.height);

      for (const d of dots) {
        d.y += d.sp * 0.6 * dpr * SPEED_MULT;
        d.x += Math.sin((ts * 0.0003 * SPEED_MULT + d.ph) * 0.6) * 0.2 * dpr;

        if (d.y > cnv.height + 8 * dpr) {
          d.y = -8 * dpr;
          d.x = Math.random() * cnv.width;
        }

        const tw = prefersReduce ? 0 : (Math.sin(ts * 0.001 * TWINKLE_RATE + d.ph) + 1) * 0.5;
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

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    if (!prefersReduce) {
      running = true;
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(draw);
    } else {
      draw(0);
    }

    const onVis = () => {
      if (prefersReduce) return;
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
    <div 
      className="w-full min-h-[100svh] bg-black text-white overflow-hidden relative"
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
      <Header />
      
      {/* Particle canvas with fade-in */}
      <canvas 
        ref={canvasRef} 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[800ms] ease-out" 
        style={{ opacity: showParticles ? 1 : 0 }}
        aria-hidden="true" 
      />
      
      <div className="relative z-10">
        <SkillsGrid />
      </div>
    </div>
  );
}