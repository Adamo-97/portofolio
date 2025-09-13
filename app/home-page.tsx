"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useRef, useState } from "react";
import Header from "../components/header";
import MainPicPlaceholder from "../components/home/MainPicPlaceholder";
import WordBubble from "../components/home/WordBubble";
import HelloBadge from "../components/home/HelloBadge";
import BgBlur from "../components/home/BgBlur";
import FloatingCards from "../components/home/FloatingCards";
import DowanloadCvButton from "../components/home/dowanload-cv-button";

// Hooks
import { useViewport } from "../src/hooks/useViewport";
import { useElementRect } from "../src/hooks/useElementRect";
import { useSlideScale } from "../src/hooks/useSlideScale";
import { usePortraitHeight } from "../src/hooks/usePortraitHeight";
import { useImageContainScale } from "../src/hooks/useImageContainScale";
import { useMounted } from "../src/hooks/useMounted";

/** Tunables */
const MIN_SLIDE_H = 560;
const MIN_W = 320;
const MIN_H = 380;
const TEXT_OVERLAP = 100;

const HomePage: NextPage = () => {
  const mounted = useMounted(); // prevents hydration mismatch

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

  // IMPORTANT: render a stable style on server/first client paint
  const slideStyle = mounted ? computedSlideStyle : { height: "100dvh" };

  return (
    <div className={`relative w-full h-dvh min-w-[${MIN_W}px] overflow-hidden bg-black text-white`}>
      <div style={slideStyle}>
        <Header />

        <main className="relative">
          <BgBlur position="fixed" height={`${artHeight}px`} cropPct={0} className="z-0" />

          <section className="relative z-10 font-urbanist">
            <div
              className="relative mx-auto w-full max-w-[913px] px-5 text-center flex flex-col items-center"
              style={{ paddingTop: "clamp(48px, 10vh, 180px)" }}
            >
              <HelloBadge className="mx-auto -mb-[6px]" vectorScale={0.78} offsetTopPx={24} offsetRightPx={26} />

              <h1 className="mt-4 leading-[1] tracking-[-0.01em] font-semibold text-[clamp(2rem,7vw,96px)]">
                I’m{" "}
                <WordBubble
                  text="Adam"
                  svgSrc="/home/Vector-22.svg"
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
                    <Image src="/home/Vector-2.svg" alt="" fill className="object-contain" />
                  </span>
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
                // Optional tiny edge gap and vertical nudges:
                leftInsetX={-100}
                rightInsetX={-100}
                leftOffsetY={-10}   // up a bit if you want
                rightOffsetY={20}    // down a bit if you want
              />
              <DowanloadCvButton
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
