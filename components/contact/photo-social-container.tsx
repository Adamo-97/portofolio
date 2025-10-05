"use client";
import type { NextPage } from "next";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export type PhotoSocialContainerType = {
  className?: string;
};

type LinkItem = {
  id: number;
  title: string;
  href: string;
  svgPath: string;   // URL, data: URL, raw <path d="...">, or full <svg> markup
  viewBox?: string;  // e.g. "0 0 24 24"
};

const BASE_W = 460;
const BASE_H = 660;

// Accept http(s), .svg paths, and data URLs (svg/png/jpeg/webp)
const looksLikeUrl = (v: string) =>
  /^https?:\/\//i.test(v) ||
  /\.svg(\?|#|$)/i.test(v) ||
  /^data:image\/(?:svg\+xml|png|jpeg|webp);/i.test(v);

// Raw path data like "M10 10L..." etc.
const looksLikePathD = (v: string) =>
  /^[MmZzLlHhVvCcSsQqTtAa][\d\s,.\-+eE]+/.test(v);

const PhotoSocialContainer: NextPage<PhotoSocialContainerType> = ({
  className = "",
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [links, setLinks] = useState<LinkItem[]>([]);

  // scale to fit container
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

  // fetch socials (logos come ONLY from API now)
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const r = await fetch("/api/contact", { cache: "no-store" });
        if (!r.ok) return;
        const data = (await r.json()) as LinkItem[];
        if (!off && Array.isArray(data)) setLinks(data);
      } catch {
        /* silent */
      }
    })();
    return () => {
      off = true;
    };
  }, []);

  return (
    <section
      className={[
        "overflow-hidden flex flex-col items-center justify-center",
        "pt-0 px-[22px] pb-[30px] box-border relative gap-5 max-w-full",
        "text-left text-xl text-black font-urbanist",
        "mq450:min-w-full mq825:flex-1 mq825:pr-0 mq825:box-border",
        className,
      ].join(" ")}
    >
      {/* Available space host (drives scale) */}
      <div ref={hostRef} className="relative w-full h-full flex items-center justify-center">
        {/* Scaled canvas */}
        <div
          className="relative"
          style={{
            width: BASE_W,
            height: BASE_H,
            transform: `scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          <div className="absolute inset-0">
            <div className="relative w-[460px] h-[660px] overflow-hidden">
              {/* Frame (static) */}
              <Image
                className="absolute inset-0 z-[2] pointer-events-none"
                width={460}
                height={660}
                sizes="100vw"
                alt=""
                src="/contact/card-container.svg"
              />

              {/* Photo crop window (static) */}
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

              {/* Text block */}
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

              {/* Socials — render ONLY if API returned items */}
              {links.length > 0 && (
                <div className="absolute z-[3] left-0 right-0 bottom-3">
                  <div className="w-full flex items-center justify-center flex-wrap content-center gap-[30px]">
                    {links.map((l) => {
                      const v = (l.svgPath || "").trim();
                      const vb = l.viewBox ?? "0 0 24 24";
                      return (
                        <a
                          key={l.id}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={l.title}
                          title={l.title}
                          className="inline-flex items-center justify-center"
                        >
                          {/* Render SVG exactly as provided (no recolor) */}
                          {looksLikeUrl(v) ? (
                            // URL or data: URL
                            <img
                              src={v}
                              alt=""
                              className="h-[30px] w-auto select-none pointer-events-none"
                              decoding="async"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          ) : v.startsWith("<svg") ? (
                            // full inline SVG markup
                            <span
                              className="h-[30px] inline-block"
                              style={{ width: "auto" }}
                              aria-hidden="true"
                              // eslint-disable-next-line react/no-danger
                              dangerouslySetInnerHTML={{ __html: v }}
                            />
                          ) : looksLikePathD(v) ? (
                            // raw path data
                            <svg
                              viewBox={vb}
                              className="h-[30px] w-auto"
                              preserveAspectRatio="xMidYMid meet"
                              aria-hidden="true"
                            >
                              <path d={v} />
                            </svg>
                          ) : (
                            // unknown format → nothing
                            <span className="h-[30px] w-[30px]" aria-hidden="true" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* END canvas */}
        </div>
      </div>
    </section>
  );
};

export default PhotoSocialContainer;
