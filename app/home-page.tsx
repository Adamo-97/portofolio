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
import DownloadCvButton from "../components/home/download-cv-button";
import TypeText from "../components/home/TypeText";
import RoleCycler from "../components/home/RoleCycler";

import { useViewport } from "../src/hooks/useViewport";
import { useElementRect } from "../src/hooks/useElementRect";
import { useSlideScale } from "../src/hooks/useSlideScale";
import { usePortraitHeight } from "../src/hooks/usePortraitHeight";
import { useImageContainScale } from "../src/hooks/useImageContainScale";
import { useMounted } from "../src/hooks/useMounted";

const MIN_SLIDE_H = 560;
const MIN_W = 320;
const MIN_H = 380;
const TEXT_OVERLAP = 100;

const HomePage: NextPage = () => {
  // --- hero animation state ---
  const [goHello, setGoHello] = useState(false);
  const [goIm, setGoIm] = useState(false);
  const [goAdam, setGoAdam] = useState(false);

  const [goSoft, setGoSoft] = useState(false);
  const [showSoftwareVector, setShowSoftwareVector] = useState(false);

  const [goRole, setGoRole] = useState(false);

  // kick sequence
  useEffect(() => {
    const t = setTimeout(() => setGoHello(true), 120);
    return () => clearTimeout(t);
  }, []);

  // when Software fades in, reveal its vector and then start the role cycler
  useEffect(() => {
    if (!goSoft) return;
    const t1 = setTimeout(() => setShowSoftwareVector(true), 240); // after Software fade
    const t2 = setTimeout(() => setGoRole(true), 300);             // start cycler shortly after
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [goSoft]);

  const mounted = useMounted();

  // refs
  const seRef = useRef<HTMLSpanElement>(null);
  const artBoxRef = useRef<HTMLDivElement>(null);

  // state
  const [imgAR, setImgAR] = useState<number>(0);

  // viewport + slide scaling
  const { vh } = useViewport();
  const { slideScale, style: computedSlideStyle } = useSlideScale(vh, MIN_SLIDE_H);

  // element rects
  const seRect = useElementRect(seRef);
  const artBoxRect = useElementRect(artBoxRef);
  const boxW = artBoxRect?.width ?? 0;

  // portrait height
  const artHeight = usePortraitHeight({
    vh,
    seBottom: seRect?.bottom ?? null,
    textOverlap: TEXT_OVERLAP,
    slideScale,
    minH: MIN_H,
  });

  // image scale (kill top letterbox)
  const imgScale = useImageContainScale(artHeight, boxW, imgAR);

  // stable style on first paint
  const slideStyle = mounted ? computedSlideStyle : { height: "100dvh" };

  return (
    <div className={`relative w-full h-dvh min-w-[${MIN_W}px] overflow-hidden bg-black text-white`}>
      <div style={slideStyle}>
        <Header />

        <main className="relative">
          <BgBlur position="fixed" height={`${artHeight}px`} cropPct={0} topFade="30%" className="z-0" />

          <section className="relative z-10 font-urbanist">
            <div
              className="relative mx-auto w-full max-w-[913px] px-5 text-center flex flex-col items-center"
              style={{ paddingTop: "clamp(48px, 10vh, 180px)" }}
            >
              {/* 1) Hello badge (stays) */}
              <HelloBadge
                className="mx-auto -mb-[6px]"
                vectorScale={0.78}
                offsetTopPx={24}
                offsetRightPx={26}
                show={goHello}
                onDone={() => setGoIm(true)}
              />

              {/* 2) Title */}
              <h1 className="mt-4 leading-[1] tracking-[-0.01em] font-semibold text-[clamp(2rem,7vw,96px)]">
                {/* "I’m " types first */}
                <TypeText
                  text={`I\u2019m\u00A0`} // I’m + NBSP
                  start={goIm}
                  speedMs={42}
                  onDone={() => setGoAdam(true)}
                  className="inline"
                />

                {/* Adam; bubble SVG fades AFTER typing */}
                <WordBubble
                  text="Adam"
                  svgSrc="/home/Vector-22.svg"
                  padRatio={0.18}
                  yNudge={-8}
                  className="text-cornflowerblue-100"
                  typeIn
                  startTyping={goAdam}
                  typeSpeedMs={70}
                  revealBubbleAfterTyped
                  bubbleFadeMs={240}
                  bubbleDelayMs={40}
                  onTypedDone={() => setGoSoft(true)}
                />

                <br />

                {/* 3) One-line role, all FADE (no typing) */}
                <span ref={seRef} className="relative inline-block leading-[1] whitespace-nowrap">
                  {/* SOFTWARE fades in */}
                  <span
                    className={[
                      "relative inline-block transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                      goSoft ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[4px]",
                    ].join(" ")}
                  >
                    Software&nbsp;
                    {/* vector anchored to Software */}
                    <span
                      aria-hidden
                      className={[
                        "absolute pointer-events-none",
                        showSoftwareVector ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95",
                        "transition-all duration-400 ease-[cubic-bezier(.22,1,.36,1)]",
                      ].join(" ")}
                      style={{
                        width: "1.1em",
                        height: "1.1em",
                        left: 0,
                        bottom: 0,
                        transform: "translate(-0.83em, 0.70em)",
                      }}
                    >
                      <Image src="/home/Vector-2.svg" alt="" fill className="object-contain" />
                    </span>
                  </span>

                  {/* Role fades: Designer → Developer → Engineer */}
                  {goRole && (
                    <RoleCycler
                      start={goRole}
                      words={["Designer", "Developer", "Engineer"]}
                      initialDelayMs={180}   // wait a beat before first word (Designer)
                      firstDwellMs={1000}    // keep Designer longer
                      dwellMs={700}          // then normal timing
                      transitionMs={300}
                      effect="fade"          // pure fade
                      className="inline font-semibold"
                    />
                  )}
                </span>
              </h1>
            </div>
          </section>

          <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center">
            <div ref={artBoxRef} className="relative w-[min(95vw,720px)]" style={{ height: `${artHeight}px` }}>
              <MainPicPlaceholder
                className="h-full w-full"
                scale={imgScale}
                onImgReady={(ar) => setImgAR(ar)}
              />

              <FloatingCards
                className="absolute inset-0 z-20"
                sizeBoost={1.3}
                gapBoost={1.5}
              />

              <DownloadCvButton
                className="absolute left-1/2 -translate-x-1/2 bottom-6 z-40"
                href="/cv.pdf"
                downloadAttr
                downloadCV="Download CV"
                iconPlaceholder="/home/icon-placeholder.svg"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
