"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  label?: string;
  sentLabel?: string;
  sendingLabel?: string;     
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  color?: string;            
  gapPx?: number;            
  ringPx?: number;           
  sentMs?: number;           
  sendIconSrc?: string;
  sentIconSrc?: string;
  iconSize?: number;

  status?: "idle" | "sending" | "sent"; 
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

/**
 * Animated "Send" button component providing visual states for idle, sending, and sent.
 *
 * The component can manage its own transient "sent" state or be fully controlled via the `status` prop.
 * When uncontrolled (no `status` provided), clicking triggers an internal "sent" state for `sentMs`
 * milliseconds and then reverts automatically. When controlled (`status` provided), internal state
 * handling is bypassed and the button strictly reflects the supplied mode.
 *
 * Visual / UX Features:
 * - Gradient background and dynamic box shadow whose color derives from the `color` prop.
 * - Hover translation and icon rotation animations.
 * - Passing "sending" (via `status`) disables the button and applies a progress cursor.
 * - Passing / reaching "sent" removes the trailing sheen sweep + swaps the icon.
 * - Animated sheen (skewed gradient bar) on hover while not in sent state.
 *
 * Accessibility:
 * - `aria-label` dynamically reflects the current state label.
 * - `aria-disabled` mirrors the disabled state when sending.
 *
 * Performance / Cleanup:
 * - Uses a ref-held timeout to reset the transient sent state; cleaned up on unmount.
 *
 * Controlled vs Uncontrolled State:
 * - Controlled: Provide `status="idle" | "sending" | "sent"`. Internal timer is ignored.
 * - Uncontrolled: Omit `status`. Click sets internal sent state for `sentMs` ms.
 *
 * Edge Cases:
 * - If `onClick` triggers an async send, supply `status="sending"` externally to block re-clicks.
 * - Rapid successive clicks while uncontrolled will clear and restart the sent timeout.
 * - Provide accessible contrast for custom `color` values if WCAG compliance is needed.
 *
 * @param label           Optional base label for the idle state (default: "Send").
 * @param sentLabel       Label shown when the action has completed (default: "Sent").
 * @param sendingLabel    Label displayed while in the sending state (default: "Sending…").
 * @param className       Extra class names appended to the root wrapper.
 * @param onClick         Callback invoked when the button is clicked (fires before internal state change).
 * @param type            Native button type attribute (default: "button").
 * @param color           Base hex color used to derive gradients, shadows, and highlight effects (default: "#18a1fd").
 * @param gapPx           Pixel padding forming the outer gap / halo around the pill (default: 12).
 * @param ringPx          Width in pixels of the outer ring border (default: 2).
 * @param sentMs          Duration in milliseconds before reverting from sent to idle in uncontrolled mode (default: 5000).
 * @param sendIconSrc     Icon (mask) path for the idle / sending states (default: "/contact/send-alt.svg").
 * @param sentIconSrc     Icon (mask) path for the sent confirmation state (default: "/contact/check.svg").
 * @param iconSize        Square dimension (px) applied to the icon mask (default: 28).
 * @param status          Optional externally controlled state override ("idle" | "sending" | "sent"). When provided, internal sent timing is disabled.
 *
 * @returns A stylized, animated, accessible send button React element.
 *
 * @example
 * // Uncontrolled usage (auto-resets after sentMs):
 * <SendButton onClick={() => submitForm()} />
 *
 * @example
 * // Controlled usage with external async flow:
 * const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
 * async function handleSend() {
 *   setStatus("sending");
 *   try {
 *     await apiSend();
 *     setStatus("sent");
 *     setTimeout(() => setStatus("idle"), 4000);
 *   } catch {
 *     setStatus("idle");
 *   }
 * }
 * <SendButton status={status} onClick={handleSend} sendingLabel="Submitting…" sentLabel="Done" />
 *
 * @example
 * // Custom styling and color:
 * <SendButton
 *   color="#ff4d5a"
 *   gapPx={16}
 *   ringPx={3}
 *   iconSize={32}
 *   label="Message"
 *   sendIconSrc="/icons/paper-plane.svg"
 *   sentIconSrc="/icons/checkmark.svg"
 * />
 */
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
  sentMs = 5000,
  sendIconSrc = "/contact/send-alt.svg",
  sentIconSrc = "/contact/check.svg",
  iconSize = 28,
  status, // NEW
}: Props) {
  const { r, g, b } = hexToRgb(color);
  const lighter = lighten(color, 0.26);

  const [sent, setSent] = useState(false);
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (tRef.current) clearTimeout(tRef.current); }, []);

  const handleClick = () => {
    onClick?.();
    if (status) return; 
    setSent(true);
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setSent(false), sentMs);
  };

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
