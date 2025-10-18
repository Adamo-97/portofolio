// app/contact-page/page.tsx
"use client";
import type { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants, Transition } from "framer-motion";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Stage16x9 from "@/components/Stage16x9";
import PhotoSocialContainer from "@/components/contact/photo-social-container";
import EmailForm from "@/components/contact/email-form";

const BRAND = "#18a1fd";
const RGB = "24,161,253";
const PARTICLES_DESKTOP = 220;
const PARTICLES_MOBILE = 120;
const SPEED_MULT = 1.6;
const TWINKLE_RATE = 1.4;
const DPR_CAP = 1.75;
const MAX_FPS = 45;

const ContactPage: NextPage = () => {
  const [showParticles, setShowParticles] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const handleSend = useCallback(async ({ name, email, message, files }: {
    name: string; email: string; message: string; files: File[];
  }) => {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("message", message);
    for (const f of files) fd.append("files", f, f.name);

    try {
      const res = await fetch("/api/contact/send", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      return Boolean(res.ok && data?.ok); // <-- return success boolean
    } catch {
      return false;
    }
  }, []);

  // Show particles after mount
  useEffect(() => {
    setTimeout(() => setShowParticles(true), 300);
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
      cnv.width = w * dpr;
      cnv.height = h * dpr;
      cnv.style.width = w + "px";
      cnv.style.height = h + "px";
      ctx.scale(dpr, dpr);
    }

    function init() {
      const w = vw();
      const h = vh();
      dots = [];
      for (let i = 0; i < P; i++) {
        const r = 0.8 + Math.random() * 1.6;
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          a: Math.random() * 0.7 + 0.2,
          sp: (0.1 + Math.random() * 0.3) * SPEED_MULT,
          ph: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw(now: number) {
      const w = vw();
      const h = vh();
      const dt = Math.min(1000 / MAX_FPS, now - lastTimeRef.current);
      lastTimeRef.current = now;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.y += d.sp * (dt / 16);
        if (d.y > h + 10) {
          d.y = -10;
          d.x = Math.random() * w;
        }

        d.ph += (0.02 * TWINKLE_RATE * dt) / 16;
        const tw = Math.sin(d.ph) * 0.5 + 0.5;
        const alpha = d.a * tw;

        ctx.fillStyle = `rgba(${RGB},${alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running) rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    init();
    lastTimeRef.current = performance.now();
    if (!prefersReduce) rafRef.current = requestAnimationFrame(draw);

    const handleResize = () => {
      resize();
      init();
    };
    window.addEventListener("resize", handleResize);

    const handleVisChange = () => {
      running = !document.hidden && !prefersReduce;
      if (running && rafRef.current === null) {
        lastTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(draw);
      } else if (!running && rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    document.addEventListener("visibilitychange", handleVisChange);

    return () => {
      running = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisChange);
    };
  }, []);

  const prefersReducedMotion = useReducedMotion();
  const springy: Transition = { type: "spring", stiffness: 260, damping: 26, mass: 0.9 };
  const parent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } } };
  const leftCol: Variants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -32, scale: prefersReducedMotion ? 1 : 0.98 },
    show:   { opacity: 1, x: 0, scale: 1, transition: springy },
  };
  const rightCol: Variants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : 32, scale: prefersReducedMotion ? 1 : 0.98 },
    show:   { opacity: 1, x: 0, scale: 1, transition: springy },
  };

  return (
    <div className="w-full min-h-screen relative [background:linear-gradient(128deg,_rgba(0,_0,_0,_0),_rgba(24,_161,_253,_0.15)),_linear-gradient(74.23deg,_rgba(24,_161,_253,_0.05),_rgba(0,_0,_0,_0)),_#000] overflow-hidden flex flex-col">
      {/* Fog gradients */}
      <div 
        className="pointer-events-none fixed top-[-10%] left-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full opacity-20 blur-[80px] z-0"
        style={{ background: `radial-gradient(circle, ${BRAND} 0%, transparent 70%)` }}
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none fixed bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full opacity-20 blur-[80px] z-0"
        style={{ background: `radial-gradient(circle, ${BRAND} 0%, transparent 70%)` }}
        aria-hidden="true" 
      />

      {/* Particle canvas */}
      <canvas 
        ref={canvasRef} 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[800ms] ease-out" 
        style={{ opacity: showParticles ? 1 : 0 }}
        aria-hidden="true" 
      />

      <Header />

      <main className="flex-1 min-h-0 px-4 sm:px-6 lg:grid lg:place-items-center relative z-10">
        {/* Mobile block */}
        <div className="lg:hidden py-6 grid place-items-center">
          <div className="w-full">
            <EmailForm
              onSend={handleSend}
              showMobileIcons
              className="w-full mx-auto max-w-[520px] sm:max-w-[560px] p-3 sm:p-4"
            />
          </div>
        </div>

        {/* DESKTOP/TABLET */}
        <div className="hidden lg:flex h-full w-full items-center justify-center px-4 lg:px-12">
          <div className="w-full h-full min-h-[560px] min-w-0">
            <Stage16x9 baseW={1400} baseH={788} className="w-full h-full overflow-visible">
              <div className="w-full h-full p-8 lg:p-10">
                <motion.section
                  variants={parent}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="grid h-full grid-cols-12 items-stretch gap-12 xl:gap-16 2xl:gap-20 overflow-visible"
                >
                  <motion.div
                    variants={leftCol}
                    className="col-span-12 lg:col-span-5 2xl:col-span-5 h-full grid place-items-center overflow-visible z-10"
                  >
                    <PhotoSocialContainer     
                      className="
                          w-full h-full max-w-none
                          transform-gpu origin-center
                          scale-[0.92] xl:scale-100 2xl:scale-100
                          transition-transform
                        "
                      />
                  </motion.div>

                {/* Right: form — 80% of column (photo stays 100%) */}
                  <motion.div
                    variants={rightCol}
                    className="
                      col-span-12 lg:col-span-7 2xl:col-span-7
                      h-full grid place-items-center
                      overflow-visible z-0
                    "
                  >
                    {/* this wrapper sets the height ratio */}
                    <div className="w-full h-[80%] min-h-[420px] max-h-full">
                      <EmailForm
                        onSend={handleSend}
                        className="w-full h-full max-w-[980px] xl:max-w-[1040px] 2xl:max-w-[1120px]"
                      />
                    </div>
                  </motion.div>

                </motion.section>
              </div>
            </Stage16x9>
          </div>
        </div>
      </main>

      <Footer year={2025} owner="Adam Abdullah" logoSrc="/logo1.svg" />
    </div>
  );
};

export default ContactPage;
