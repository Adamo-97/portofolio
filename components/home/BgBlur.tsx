import Image from "next/image";

type Props = {
  className?: string;
  src?: string;
  height?: string;                 // visual height of the glow area
  cropPct?: number;                // % to cut from bottom
  position?: "fixed" | "absolute";
};

export default function BgBlur({
  className = "",
  src = "/home/Ellipse-2.svg",
  height = "clamp(260px, 45vh, 520px)",
  cropPct = 30,                    // <- cut 30% from the bottom
  position = "fixed",              // <- sticks to bottom of the screen
}: Props) {
  const keepPct = Math.max(0, Math.min(100, 100 - cropPct));
  const mask = `linear-gradient(to bottom, black 0%, black ${keepPct}%, transparent ${keepPct}%, transparent 100%)`;

  return (
    <div
      className={[
        position === "fixed" ? "fixed" : "absolute",
        "pointer-events-none inset-x-0 bottom-0 w-screen",
        className,
      ].join(" ")}
      style={{
        height,
        WebkitMaskImage: mask,
        maskImage: mask,
        clipPath: `inset(0 0 ${cropPct}% 0)`, // hard cut fallback
      }}
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
        style={{ opacity: 1 }} // FULL glow
      />
    </div>
  );
}
