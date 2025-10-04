"use client";
import type { NextPage } from "next";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export type PhotoSocialContainerType = {
  className?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  youtubeUrl?: string;
};

const BASE_W = 460;
const BASE_H = 660;

const PhotoSocialContainer: NextPage<PhotoSocialContainerType> = ({
  className = "",
  linkedinUrl = "https://www.linkedin.com/in/adam-abdullah97/",
  githubUrl = "https://github.com/Adamo-97",
  youtubeUrl = "https://www.youtube.com/@TVV-Arabic",
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const s = Math.min(width / BASE_W, height / BASE_H);
      setScale(s > 0 ? s : 1);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      className={[
        // keep your container vibe; no fixed height so it can scale
        "overflow-hidden flex flex-col items-center justify-center",
        "pt-0 px-[22px] pb-[30px] box-border relative gap-5 max-w-full",
        "text-left text-xl text-black font-urbanist",
        "mq450:min-w-full mq825:flex-1 mq825:pr-0 mq825:box-border",
        className,
      ].join(" ")}
    >
      {/* The slot that defines available size */}
      <div ref={hostRef} className="relative w-full h-full flex items-center justify-center">
        {/* Scaled canvas: treat the whole card as one unit */}
        <div
          className="relative"
          style={{
            width: BASE_W,
            height: BASE_H,
            transform: `scale(${scale})`,
            transformOrigin: "center", // stays centered in its grid cell
          }}
        >
          {/* Frame + contents live inside this base-size canvas */}
          <div className="absolute inset-0">
            <div className="relative w-[460px] h-[660px] overflow-hidden">
              {/* Frame on top */}
              <Image
                className="absolute inset-0 z-[2] pointer-events-none"
                width={460}
                height={660}
                sizes="100vw"
                alt=""
                src="/contact/card-container.svg"
              />

              {/* Photo crop window */}
              <div
                className="absolute z-[1] overflow-hidden w-[422px] h-[432px]"
                style={{ left: 19, top: 18 }}
              >
                <div className="w-full h-full pt-3 px-3">
                  <Image
                    src="/photo-thumbsup@2x.png"
                    alt=""
                    width={416}
                    height={426}
                    className="w-full h-full object-contain object-top"
                    sizes="100vw"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text block (unchanged) */}
              <div
                className="absolute z-[3] text-left"
                style={{ left: 19, right: 19, top: 450, paddingTop: 14 }}
              >
                <div className="space-y-5">
                  <p className="m-0 font-semibold text-cornflowerblue-100">
                    #Thanks for stopping by!
                  </p>
                  <p className="m-0 text-base">
                    I’m open to new opportunities, collaborations, or just a chat
                    about tech and design. Feel free to drop me a message through
                    the form — I’ll get back to you as soon as I can.
                  </p>
                  <div className="text-[15px] font-medium text-cornflowerblue-100">
                    You can also find me here:
                  </div>
                </div>
              </div>

              {/* Socials: now INSIDE the card, pinned at the bottom */}
              <div
                className="absolute z-[3] left-0 right-0 bottom-3"
                // match your spacing; tweak bottom if you need a nudge
              >
                <div className="w-full flex items-center justify-center flex-wrap content-center gap-[30px]">
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="inline-flex"
                  >
                    <Image
                      className="w-[30px] relative rounded-[5px] max-h-full"
                      loading="lazy"
                      width={30}
                      height={30}
                      sizes="100vw"
                      alt="LinkedIn"
                      src="/contact/linkedin-logo.svg"
                    />
                  </a>

                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="inline-flex"
                  >
                    <Image
                      className="w-[31px] relative max-h-full"
                      loading="lazy"
                      width={31}
                      height={30}
                      sizes="100vw"
                      alt="GitHub"
                      src="/contact/github-logo.svg"
                    />
                  </a>

                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="inline-flex"
                  >
                    <Image
                      className="w-[43px] relative max-h-full"
                      loading="lazy"
                      width={43}
                      height={30}
                      sizes="100vw"
                      alt="YouTube"
                      src="/contact/yt-logo.svg"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* END canvas */}
        </div>
      </div>
    </section>
  );
};

export default PhotoSocialContainer;
