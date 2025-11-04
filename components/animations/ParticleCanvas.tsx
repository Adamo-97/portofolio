// components/animations/ParticleCanvas.tsx
"use client";
import React, { useEffect, useRef, memo } from "react";

interface ParticleCanvasProps {
  particlesDesktop?: number;
  particlesMobile?: number;
  speedMultiplier?: number;
  twinkleRate?: number;
  color?: string; // RGB format "24,161,253"
  maxFps?: number;
  className?: string;
}

/**
 * Reusable particle animation canvas component
 * Memoized to prevent unnecessary re-renders
 */
const ParticleCanvas: React.FC<ParticleCanvasProps> = memo(({
  particlesDesktop = 220,
  particlesMobile = 120,
  speedMultiplier = 1.6,
  twinkleRate = 1.4,
  color = "24,161,253",
  maxFps = 45,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(1.75, Math.max(1, window.devicePixelRatio || 1));
    const prefersReduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const parent = canvas.parentElement;
    if (!parent) return;

    const vw = () => Math.max(1, parent.clientWidth || window.innerWidth);
    const vh = () => Math.max(1, parent.clientHeight || window.innerHeight);

    const particleBase = window.innerWidth <= 675 ? particlesMobile : particlesDesktop;
    const densityAdj = window.innerWidth > 1920 ? 0.85 : 1;
    const particleCount = prefersReduce
      ? Math.floor(particleBase * 0.6 * densityAdj)
      : Math.floor(particleBase * densityAdj);

    type Dot = {
      x: number;
      y: number;
      r: number;
      a: number;
      sp: number;
      ph: number;
    };

    let dots: Dot[] = [];
    let running = !prefersReduce;

    const resize = () => {
      const w = vw();
      const h = vh();
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      // Reinitialize particles
      dots = [];
      for (let i = 0; i < particleCount; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.8 + Math.random() * 1.7,
          a: Math.random(),
          sp: (0.05 + Math.random() * 0.25) * speedMultiplier,
          ph: Math.random() * Math.PI * 2,
        });
      }
    };

    resize();

    const draw = (now: number) => {
      if (!running) return;
      
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const w = vw();
      const h = vh();

      // Throttle to maxFps
      const minInterval = 1000 / maxFps;
      if (dt * 1000 < minInterval) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        // Move particle upward
        d.y -= d.sp * 60 * dt;
        if (d.y < -10) d.y = h + 10;

        // Twinkle effect
        d.ph += twinkleRate * dt;
        const flicker = 0.5 + 0.5 * Math.sin(d.ph);
        const alpha = d.a * flicker;

        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    const handleResize = () => {
      resize();
      if (!running && !prefersReduce) {
        lastTimeRef.current = performance.now();
        running = true;
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    const handleVisibilityChange = () => {
      if (prefersReduce) return;
      
      if (document.hidden) {
        running = false;
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else {
        running = true;
        lastTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Start animation
    if (!prefersReduce) {
      running = true;
      lastTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      running = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [particlesDesktop, particlesMobile, speedMultiplier, twinkleRate, color, maxFps]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
});

ParticleCanvas.displayName = "ParticleCanvas";

export default ParticleCanvas;
