"use client";
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import { type Project } from "@/components/project/ProjectCard";
import CategoryFolder, { CATEGORY_COLORS } from "@/components/project/CategoryFolder";
import ProjectCard from "@/components/project/ProjectCard";
import LoadingAnimation from "@/components/LoadingAnimation";

const BRAND = "#18a1fd";
const RGB = "24,161,253";
const PARTICLES_DESKTOP = 220;
const PARTICLES_MOBILE = 120;
const SPEED_MULT = 1.6;
const TWINKLE_RATE = 1.4;
const DPR_CAP = 1.75;
const MAX_FPS = 45;

const ProjectsPageClient: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/project");
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await res.json();
        setProjects(data);
        
        // Set first category as open by default
        if (data.length > 0) {
          const firstCategory = data[0].category;
          setOpenCategory(firstCategory);
        }
        
        // Show particles after content loads
        setTimeout(() => setShowParticles(true), 300);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
        setTimeout(() => setShowParticles(true), 300);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Group projects by category
  const projectsByCategory = projects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = [];
    }
    acc[project.category].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  // Particle animation (from roadmap page)
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
    <div className="bg-black flex flex-col overflow-hidden h-screen">
      <Header />

      {/* Main area with fog/glow background */}
      <main
        className="relative flex-1 min-h-0 overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 flex flex-col"
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
          className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[800ms] ease-out" 
          style={{ opacity: showParticles ? 1 : 0 }}
          aria-hidden="true" 
        />

        {/* Content above particles - NO SCROLLING */}
        <div className="relative z-10 flex flex-col h-full max-w-[1800px] mx-auto w-full overflow-hidden">
        {/* Loading State */}
        {loading && <LoadingAnimation text="Loading projects..." />}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-cornflowerblue-100 hover:bg-cornflowerblue-200 text-white font-medium rounded-full transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-cornflowerblue-100 mb-2">
                No projects found
              </h3>
              <p className="text-white/70">
                No projects available at the moment.
              </p>
            </div>
          </div>
        )}

        {/* Category Folders */}
        {!loading && !error && projects.length > 0 && (
          <div className="flex flex-col items-center gap-8 sm:gap-10 lg:gap-12 px-2 sm:px-4 h-full">
            {/* All categories in a single horizontal row - NO WRAP, responsive */}
            <div className="flex gap-2 sm:gap-3 lg:gap-4 justify-center pb-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
              {Object.entries(projectsByCategory).map(([category, categoryProjects], index) => (
                <CategoryFolder
                  key={category}
                  category={category}
                  projects={categoryProjects}
                  index={index}
                  isOpen={openCategory === category}
                  onToggle={() => setOpenCategory(category)}
                />
              ))}
            </div>
            
            {/* Horizontal Projects Display - NO SCROLLING, Responsive scale */}
            {openCategory && projectsByCategory[openCategory] && (
              <div className="w-full flex justify-center items-start flex-1 min-h-0">
                <div className="flex gap-2 sm:gap-3 lg:gap-4 justify-center items-start flex-wrap" style={{ 
                  maxWidth: '100%',
                }}>
                  {projectsByCategory[openCategory].map((project, idx) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      index={idx}
                      categoryColor={CATEGORY_COLORS[openCategory]}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default ProjectsPageClient;
