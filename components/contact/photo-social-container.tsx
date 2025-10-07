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
  svgPath: string;  
  viewBox?: string; 
};

const BASE_W = 460;
const BASE_H = 660;

const looksLikeUrl = (v: string) =>
  /^https?:\/\//i.test(v) ||
  /\.svg(\?|#|$)/i.test(v) ||
  /^data:image\/(?:svg\+xml|png|jpeg|webp);/i.test(v);

const looksLikePathD = (v: string) =>
  /^[MmZzLlHhVvCcSsQqTtAa][\d\s,.\-+eE]+/.test(v);

/**
 * Renders a responsive, card–style contact/photo panel with a personal message
 * and dynamically loaded social / external links.
 *
 * Core Features:
 * 1. Responsive Uniform Scaling:
 *    - Uses a ResizeObserver on the host container to compute a uniform scale factor.
 *    - Scales an absolutely positioned fixed–dimension design (BASE_W x BASE_H) while preserving aspect ratio.
 *    - Ensures internal layout fidelity independent of parent container size.
 *
 * 2. Dynamic Link Fetching:
 *    - Fetches an array of LinkItem objects from /api/contact (no-store to avoid caching).
 *    - Aborts state updates on unmount via an "off" flag pattern to prevent memory leaks / React warnings.
 *
 * 3. Flexible Icon Rendering Strategy:
 *    - For each link item (LinkItem):
 *        a. If svgPath looks like a direct URL (http(s) or data URI) → render <img>.
 *        b. If svgPath begins with raw "<svg" markup → inject via dangerouslySetInnerHTML (trusted content required).
 *        c. If svgPath appears to be a valid SVG path "d" attribute → wrap in a generated <svg>.
 *        d. Fallback: empty sized placeholder span to maintain layout consistency.
 *    - Supports optional custom viewBox per link (default "0 0 24 24").
 *
 * 4. Accessibility & Semantics:
 *    - External links open in a new tab with rel="noopener noreferrer" for security.
 *    - Each anchor includes aria-label and title derived from link metadata.
 *    - Decorative / non-informational images use empty alt ("") to avoid redundant screen reader chatter.
 *    - Inline SVGs are marked aria-hidden when purely presentational.
 *
 * 5. Layered Visual Composition:
 *    - Background card illustration (static SVG).
 *    - Photo region with contained image (object-fit: contain; anchored top).
 *    - Text block with hashtag headline, description, and secondary prompt.
 *    - Social icon bar pinned to the bottom area of the card.
 *
 * 6. Performance Considerations:
 *    - Lazy loading for images (where applicable) to defer off-screen resource usage.
 *    - Minimal re-renders: scale updates only on container resize; links only once after fetch.
 *
 * 7. Styling & Layout:
 *    - Tailwind utility classes drive spacing, typography, and layering (z-index usage).
 *    - Scaling wrapper isolates transform to a single node to prevent layout thrash.
 *    - Uses flexbox centering and overflow-hidden to maintain a polished frame.
 *
 * External Dependencies / Assumptions:
 * - BASE_W, BASE_H: numeric constants representing the original design width & height.
 * - LinkItem: shape of fetched link objects (id, href, title, svgPath, viewBox, etc.).
 * - looksLikeUrl(value: string): boolean helper to detect URL or data URI.
 * - looksLikePathD(value: string): boolean helper to validate potential SVG path data.
 *
 * Security Notes:
 * - Raw SVG injection (dangerouslySetInnerHTML) should only be used with trusted content.
 * - Consider sanitizing svgPath if coming from user-generated or untrusted source.
 *
 * Potential Enhancements:
 * - Add loading / skeleton state while fetching links.
 * - Provide error feedback if fetch fails.
 * - Add keyboard focus outlines / focus ring enhancements for accessibility.
 * - Memoize rendered links if transformation logic becomes heavier.
 *
 * Props:
 * @prop className - Optional additional class names appended to the root <section>.
 *
 * Returns:
 * - A <section> element containing the scaled card UI and link icons (if any).
 *
 * Lifecycle Summary:
 * - On mount: attach ResizeObserver, fetch links.
 * - On unmount: disconnect observer, prevent stale state updates.
 */
const PhotoSocialContainer: NextPage<PhotoSocialContainerType> = ({
  className = "",
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [links, setLinks] = useState<LinkItem[]>([]);

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
      <div ref={hostRef} className="relative w-full h-full flex items-center justify-center">
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
              <Image
                className="absolute inset-0 z-[2] pointer-events-none"
                width={460}
                height={660}
                sizes="100vw"
                alt=""
                src="/contact/card-container.svg"
              />

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
                            <span
                              className="h-[30px] inline-block"
                              style={{ width: "auto" }}
                              aria-hidden="true"
                              dangerouslySetInnerHTML={{ __html: v }}
                            />
                          ) : looksLikePathD(v) ? (
                            <svg
                              viewBox={vb}
                              className="h-[30px] w-auto"
                              preserveAspectRatio="xMidYMid meet"
                              aria-hidden="true"
                            >
                              <path d={v} />
                            </svg>
                          ) : (
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
        </div>
      </div>
    </section>
  );
};

export default PhotoSocialContainer;
