"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  label?: string;
  sentLabel?: string;
  sendingLabel?: string;     // NEW: label while sending
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  color?: string;            // inner pill color
  gapPx?: number;            // space between outer stroke and inner pill
  ringPx?: number;           // outer stroke thickness
  hoverScale?: number;       // kept for API compatibility (ignored now)
  sentMs?: number;           // Sent-state duration (ms) in uncontrolled mode
  sendIconSrc?: string;
  sentIconSrc?: string;
  iconSize?: number;

  status?: "idle" | "sending" | "sent"; // NEW: controlled mode
};

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  const [r, g, b] = m ? [m[1], m[2], m[3]].map((x) => parseInt(x, 16)) : [24, 161, 253];
  return { r, g, b };
}
function lighten(hex: string, amt = 0.26) {
  const { r, g, b } = hexToRgb(hex);
  const L = (v: number) => Math.min(255, Math.round(v + (255 - v) * amt));
  return `rgb(${L(r)}, ${L(g)}, ${L(b)})`;
}

function MaskIcon({
  src,
  size = 28,
  className = "",
}: {
  src: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={["inline-block align-middle", className].join(" ")}
      style={{
        width: size,
        height: size,
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export default function SendButton({
  label = "Send",
  sentLabel = "Sent",
  sendingLabel = "Sending…",
  className = "",
  onClick,
  type = "button",
  color = "#18a1fd",
  gapPx = 12,
  ringPx = 2,
  hoverScale = 1.08, // kept but ignored (no hover scale anymore)
  sentMs = 5000,
  sendIconSrc = "/contact/send-alt.svg",
  sentIconSrc = "/contact/check.svg",
  iconSize = 28,
  status, // NEW
}: Props) {
  const { r, g, b } = hexToRgb(color);
  const lighter = lighten(color, 0.26);

  // Uncontrolled fallback (keeps backward compatibility)
  const [sent, setSent] = useState(false);
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (tRef.current) clearTimeout(tRef.current); }, []);

  const handleClick = () => {
    onClick?.();
    if (status) return; // controlled mode: parent drives the visuals
    setSent(true);
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setSent(false), sentMs);
  };

  // Derive visual mode
  const mode: "idle" | "sending" | "sent" = status ?? (sent ? "sent" : "idle");
  const isSending = mode === "sending";
  const isSent = mode === "sent";
  const currentLabel = isSending ? sendingLabel : (isSent ? sentLabel : label);

  return (
    <div
      className={["relative inline-block select-none group", className].join(" ")}
      style={
        {
          ["--b-r" as any]: r,
          ["--b-g" as any]: g,
          ["--b-b" as any]: b,
        } as React.CSSProperties
      }
    >
      {/* OUTER pill (stroke only, bigger via padding) */}
      <div
        aria-hidden
        className="relative rounded-full transition-transform duration-300 ease-out"
        style={{ padding: gapPx } as React.CSSProperties}
      >
        <div
          className="absolute inset-0 rounded-full pointer-events-none transition-all duration-300 ease-out group-hover:[box-shadow:0_10px_30px_rgba(var(--b-r),var(--b-g),var(--b-b),0.55)]"
          style={{ border: `${ringPx}px solid rgba(255,255,255,0.95)`, background: "transparent" }}
        />
        {/* INNER pill */}
        <button
          type={type}
          onClick={handleClick}
          aria-label={currentLabel}
          aria-disabled={isSending}
          disabled={isSending}
          className={[
            "relative z-10 inline-flex items-center justify-center rounded-full",
            "px-7 py-2 text-white font-semibold text-base overflow-hidden",
            "transition-transform duration-300 ease-out",
            "focus:outline-none",
            isSending ? "opacity-90 cursor-progress" : "cursor-pointer",
          ].join(" ")}
          style={{
            background: `linear-gradient(135deg, ${lighter} 0%, ${color} 60%)`,
            boxShadow: isSent ? "none" : "0 10px 30px rgba(var(--b-r), var(--b-g), var(--b-b), 0.55)",
          }}
        >
          <span className="relative z-10 flex items-center gap-4">
            <span className={["text-xl transition-transform duration-300", isSent ? "" : "group-hover:translate-x-1"].join(" ")}>
              {currentLabel}
            </span>

            {!isSent ? (
              <MaskIcon
                src={sendIconSrc}
                size={iconSize}
                className={[
                  "transition-transform duration-300 ease-out",
                  "-translate-x-1 opacity-90 rotate-0 [transform-origin:center]",
                  "group-hover:translate-x-0 group-hover:opacity-100 group-hover:rotate-[45deg]",
                ].join(" ")}
              />
            ) : (
              <MaskIcon src={sentIconSrc} size={iconSize} className="transition-transform duration-300 ease-out translate-x-0 opacity-100" />
            )}
          </span>

          {/* shimmer keeps running while sending */}
          {!isSent && (
            <div
              className={[
                "absolute inset-0 flex h-full w-full justify-center pointer-events-none",
                "[transform:skew(-13deg)_translateX(-100%)]",
                "group-hover:duration-1000",
                "group-hover:[transform:skew(-13deg)_translateX(100%)]",
              ].join(" ")}
            >
              <div
                className="relative h-full w-10"
                style={{
                  background: `linear-gradient(rgb(${r},${g},${b}), rgba(${r},${g},${b},0.9))`,
                  mixBlendMode: "screen",
                }}
              />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
