// app/home-page.tsx
"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Header from "../components/header";
import MainPicPlaceholder from "../components/home/MainPicPlaceholder";
import WordBubble from "../components/home/WordBubble";
import HelloBadge from "../components/home/HelloBadge";
import BgBlur from "../components/home/BgBlur";
import FloatingCards from "../components/home/FloatingCards";
import DowanloadCvButton from "../components/home/dowanload-cv-button";

const MIN_H = 420;     // lower if you want smaller on tiny screens
const MAX_H = 900;     // raise if you want taller on huge screens
const GAP_TO_TITLE = 2; // px: positive leaves a gap, negative overlaps slightly

const HomePage: NextPage = () => {
  const seRef = useRef<HTMLSpanElement>(null);
  const [artHeight, setArtHeight] = useState<string | undefined>(undefined);

  useEffect(() => {
    const calc = () => {
      const se = seRef.current;
      if (!se) return;

      const rect = se.getBoundingClientRect();
      const vh = window.innerHeight;

      // We want image top to be at rect.bottom + GAP_TO_TITLE.
      // With object-bottom, image top = vh - containerHeight.
      // => containerHeight = vh - (rect.bottom + GAP_TO_TITLE)
      const desired = Math.round(vh - (rect.bottom + GAP_TO_TITLE));
      const clamped = Math.max(MIN_H, Math.min(MAX_H, desired));
      setArtHeight(`${clamped}px`);
    };

    const ro = new ResizeObserver(calc);
    if (seRef.current) ro.observe(seRef.current);
    window.addEventListener("resize", calc);
    calc();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, []);

  return (
    <div className="relative w-full min-h-dvh bg-black text-white flex flex-col">
      <Header />
      <main className="relative flex-1">
        {/* Glow pinned to bottom (full opacity, crop 30%) */}
        <BgBlur position="fixed" height="clamp(260px,80vh,800px)" cropPct={0} className="z-0" />

        <section className="relative z-10 font-urbanist">
          <div className="relative mx-auto w-full max-w-[913px] px-5 pt-24 text-center flex flex-col items-center">
            <HelloBadge className="mx-auto -mb-[6px]" vectorScale={0.78} offsetTopPx={24} offsetRightPx={26} />

            <h1 className="mt-6 leading-[1] tracking-[-0.01em] font-semibold text-[clamp(2rem,7vw,96px)]">
              I’m{" "}
              <WordBubble
                text="Adam"
                svgSrc="/Vector-22.svg"
                padRatio={0.18}
                yNudge={-8}
                className="text-cornflowerblue-100"
              />
              <br />
              <span ref={seRef} className="relative inline-block leading-[1]">
                <span>Software Engineer</span>
                <span
                  aria-hidden
                  className="absolute pointer-events-none"
                  style={{
                    width: "1.1em",
                    height: "1.1em",
                    left: 0,
                    bottom: 0,
                    transform: "translate(-0.83em, 0.70em)",
                  }}
                >
                  <Image src="/Vector-2.svg" alt="" fill className="object-contain" />
                </span>
              </span>
            </h1>
          </div>
        </section>

        {/* Portrait wrapper pinned to bottom; height computed to “kiss” the title */}
        <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center">
          <div className="relative w-[min(95vw,720px)]" style={{ height: artHeight }}>
            <MainPicPlaceholder className="h-full w-full" />

            {/* If you want cards/CV button, render them HERE (kept off by default) */}
            <FloatingCards
              className="absolute inset-0 z-20"
              leftCardSrc="/experience-section@2x.png"
              rightCardSrc="/bcs-se@2x.png"
            />
            <DowanloadCvButton
              className="absolute left-1/2 -translate-x-1/2 bottom-6 z-30"
              href="/cv.pdf"
              downloadAttr
              downloadCV="Download CV"
              iconPlaceholder="/icon-placeholder.svg"
            />
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
