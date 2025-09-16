"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import SkillTile from "./SkillTile";
import CPUCenter from "./CPUCenter";
import { SKILLS } from "../../data/skills";

type Skill = {
  id: string;
  name: string;
  src: string;
  category?: "Build" | "Design" | "Data" | "Workflow";
  href?: string;
  weight?: number;
  box?: number;
  scale?: number;
  xOffset?: number;
  yOffset?: number;
};

const CATS: Array<NonNullable<Skill["category"]>> = ["Build", "Design", "Data", "Workflow"];
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function SkillOrbit() {
  // group and sort by category (SKILLS stays your single source of truth)
  const groups = useMemo(() => {
    const g: Record<string, Skill[]> = { Build: [], Design: [], Data: [], Workflow: [] };
    for (const s of SKILLS as Skill[]) {
      const c = (s.category ?? "Workflow") as keyof typeof g;
      (g[c] ?? g.Workflow).push(s);
    }
    CATS.forEach((k) =>
      g[k].sort((a, b) => {
        const aw = a.weight ?? 9999, bw = b.weight ?? 9999;
        return aw === bw ? a.name.localeCompare(b.name) : aw - bw;
      })
    );
    return CATS.filter((k) => g[k].length).map((k) => ({ key: k, items: g[k] }));
  }, []);

  // which category is open by default — prefer Build
  const defaultIdx = Math.max(0, groups.findIndex((g) => g.key === "Build"));
  const [idx, setIdx] = useState(defaultIdx === -1 ? 0 : defaultIdx);
  const active = groups[idx] ?? groups[0];

  // measure container (for centering ring)
  const wrapRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setBox({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cx = box.w / 2;
  const cy = box.h / 2;
  const isMobile = box.w < 640;

  // normalize tile sizes so logos look consistent
  const desktopBase = 88;
  const mobileBase = 68;
  const normTile = (s: Skill, base: number) => clamp(s.box ?? base, base - 8, base + 8);

  // first pass: check space with default base size
  const base0 = isMobile ? mobileBase : desktopBase;
  const ringPad = isMobile ? 16 : 28;
  const tileMax0 =
    active?.items.reduce((m, s) => Math.max(m, normTile(s, base0)), base0) ?? base0;
  const maxDiameter0 = Math.min(box.w, box.h) - (tileMax0 + ringPad);

  // shrink tiles a bit if tight
  const shrink = maxDiameter0 < 140 ? clamp((140 - maxDiameter0) / 80, 0, 1) : 0;
  const base = Math.round(base0 * (1 - 0.25 * shrink));

  // recompute with shrunk base
  const tileMax =
    active?.items.reduce((m, s) => Math.max(m, normTile(s, base)), base) ?? base;
  const maxDiameter = Math.min(box.w, box.h) - (tileMax + ringPad);

  // ring diameter (snapped to 8px to sit on your grid)
  const snap = 8;
  const ringDiameter = Math.round(clamp(maxDiameter, 120, isMobile ? 520 : 680) / snap) * snap;
  const R = ringDiameter / 2;

  // center CPU chip size
  const chipSize = clamp(ringDiameter * 0.44, isMobile ? 160 : 180, isMobile ? 220 : 260);

  // icon layout around the ring (start at top, clockwise)
  const layout = useMemo(() => {
    const items = active?.items ?? [];
    const n = Math.max(1, items.length);
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const x = cx + R * Math.cos(t);
      const y = cy + R * Math.sin(t);
      const z = 100 + Math.round(50 * Math.sin(t)); // subtle layering
      pts.push({ i, x, y, z });
    }
    pts.sort((a, b) => a.z - b.z);
    return pts;
  }, [active?.items, cx, cy, R]);

  // particle emitter (from chip to ring)
  const emitterDist = Math.max(40, R - chipSize / 2 - 8);
  const particleCount = 18;

  const prev = () => setIdx((p) => (p - 1 + groups.length) % groups.length);
  const next = () => setIdx((p) => (p + 1) % groups.length);

  return (
    <section className="w-full">
      <div
        ref={wrapRef}
        className={[
          "relative w-full overflow-hidden rounded-2xl",
          "bg-[radial-gradient(1200px_560px_at_center,rgba(24,161,253,0.10),transparent_60%)]",
          isMobile ? "h-[560px]" : "h-[620px] md:h-[700px]",
        ].join(" ")}
        aria-label="Skills"
      >
        {/* dotted ring — centered and on-grid */}
        {ringDiameter > 0 && (
          <div
            className="absolute rounded-full border-2 border-dashed border-gray-400/50"
            style={{
              left: cx, top: cy, width: ringDiameter, height: ringDiameter,
              transform: "translate(-50%, -50%)", zIndex: 60,
            }}
            aria-hidden
          />
        )}

        {/* particles (bright, from chip center to ring) */}
        {ringDiameter > 0 && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: cx, top: cy, width: 0, height: 0,
              transform: "translate(-50%,-50%)", zIndex: 140,
            }}
            aria-hidden
          >
            {Array.from({ length: particleCount }).map((_, i) => {
              const angleDeg = (i / particleCount) * 360 + (i % 2 ? 4 : -4);
              const size = 4 + (i % 3); // 4..6
              const dur = 2.6 + (i % 5) * 0.45; // 2.6..4.4
              const delay = (i * 0.11) % 1.6;
              return (
                <span
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: size, height: size,
                    background: "rgba(56,190,255,0.98)",
                    filter: "drop-shadow(0 0 18px rgba(56,190,255,1))",
                    willChange: "transform, opacity",
                    ["--angle" as any]: `${angleDeg}deg`,
                    ["--dist" as any]: `${emitterDist}px`,
                    ["--dur" as any]: `${dur}s`,
                    animation: `shoot var(--dur) cubic-bezier(.22,1,.36,1) ${delay}s infinite`,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* icons on the orbit */}
        {layout.map(({ i, x, y, z }) => {
          const s = active.items[i];
          const tile = normTile(s, base);
          const dx = s.xOffset ?? 0;
          const dy = s.yOffset ?? 0;
          return (
            <div
              key={s.id}
              className="absolute"
              style={{
                left: x + dx, top: y + dy, zIndex: 200,
                transform: "translate(-50%,-50%)",
              }}
            >
              <SkillTile title={s.name} src={s.src} boxSize={tile} />
            </div>
          );
        })}

        {/* CPU chip center (no side knob, title centered, prev/next inside) */}
        {ringDiameter > 0 && (
          <div
            className="absolute"
            style={{
              left: cx, top: cy, transform: "translate(-50%,-50%)", zIndex: 300,
            }}
          >
            <CPUCenter size={chipSize} title={active?.key ?? ""} onPrev={prev} onNext={next} />
          </div>
        )}
      </div>

      {/* keyframes used by particles */}
      <style jsx global>{`
        @keyframes shoot {
          0%   { transform: rotate(var(--angle)) translateX(0);        opacity: 1 }
          70%  { opacity: 0.9 }
          100% { transform: rotate(var(--angle)) translateX(var(--dist)); opacity: 0 }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation: shoot"] { animation: none !important; opacity: .55; }
        }
      `}</style>
    </section>
  );
}
