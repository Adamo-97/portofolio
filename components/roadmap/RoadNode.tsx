// components/roadmap/RoadNode.tsx
"use client";

export type RoadmapItem = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  from?: string;
  to?: string | null;
};
export type RoadPos = "top" | "bottom" | "left" | "right";

export default function RoadNode({
  item,
  pos,
  accentColor = "#7dd3fc",
  iconSize = 88,
  width = 420,
  appearDelayMs = 0,
  padFromRoad = 14,
}: {
  item: RoadmapItem;
  pos: RoadPos;
  accentColor?: string;
  iconSize?: number;
  width?: number;
  appearDelayMs?: number;
  padFromRoad?: number;
}) {
  const gap = Math.round(iconSize * 0.18);                // scales with icon
  const diamondPx = Math.round(clamp(iconSize * 0.12, 8, 16));
  const descMax = Math.round(clamp(width - 40, 220, width - 20));

  const Icon = (
    <div
      className="relative grid place-items-center opacity-0 animate-iconIn"
      style={{ height: iconSize, width: iconSize, animationDelay: `${appearDelayMs + 200}ms` }}
    >
      <span
        aria-hidden
        className="absolute rounded-full pointer-events-none animate-pulseGlow"
        style={{
          width: Math.round(iconSize * 1.6),
          height: Math.round(iconSize * 1.6),
          background: accentColor,
          opacity: 0.22,
          filter: "blur(26px)",
          zIndex: -1,
        }}
      />
      {item.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.icon} alt="" className="object-contain select-none" style={{ height: iconSize, width: iconSize }} />
      ) : (
        <span className="grid place-items-center text-sm font-semibold text-sky-50" style={{ height: iconSize, width: iconSize }}>
          {item.title.slice(0, 1)}
        </span>
      )}
    </div>
  );

  const Diamond = (
    <span
      aria-hidden
      className="inline-block"
      style={{
        width: diamondPx,
        height: diamondPx,
        background: accentColor,
        borderRadius: 2,
        transform: "rotate(45deg)",
        boxShadow: `0 0 10px ${accentColor}80`,
      }}
    />
  );

  function fmtRange(from?: string, to?: string | null) {
    if (!from) return "";
    const f = new Date(from);
    const t = to ? new Date(to) : null;
    const safe = (d: Date) =>
      isNaN(d.getTime()) ? "" : d.toLocaleString(undefined, { month: "short", year: "numeric" });
    const fm = safe(f);
    const tm = t ? safe(t) : "Present";
    return fm && tm ? `${fm} – ${tm}` : fm || tm || "";
  }

  const Text = (
    <div className="text-center opacity-0 animate-nodeIn" style={{ width, animationDelay: `${appearDelayMs + 320}ms` }}>
      <div className="text-sky-50 text-[18px] font-semibold leading-tight">{item.title}</div>
      <div className="mt-0.5 text-[12px] italic hidden sm:block" style={{ color: accentColor }}>
        {fmtRange(item.from, item.to)}
      </div>
      <p className="mt-2 text-[14px] leading-snug text-sky-100/85 hidden sm:block" style={{ maxWidth: descMax, margin: "0 auto" }}>
        {item.description}
      </p>
    </div>
  );

  const Stack = pos === "top" || pos === "right" ? [Text, Icon, Diamond] : [Diamond, Icon, Text];

  const padStyle =
    pos === "top"
      ? { paddingBottom: padFromRoad }
      : pos === "bottom"
      ? { paddingTop: padFromRoad }
      : undefined;

  return (
    <div
      className="relative z-20 flex flex-col items-center"
      style={{ gap, ...padStyle }}
    >
      {Stack.map((el, i) => (
        <div key={i}>{el}</div>
      ))}

      <style>{`
        @keyframes nodeIn { 0% {opacity:0; transform: translateY(8px); filter: blur(1px);} 100% {opacity:1; transform:none; filter:none;} }
        @keyframes iconIn { 0% {opacity:0; transform: translateY(6px) scale(.96);} 100% {opacity:1; transform:none;} }
        .animate-nodeIn { animation: nodeIn 520ms cubic-bezier(.2,.7,.2,1) both; }
        .animate-iconIn { animation: iconIn 520ms cubic-bezier(.2,.7,.2,1) both; }
        @keyframes pulseGlow { 0%,100% { opacity:.16 } 50% { opacity:.28 } }
        .animate-pulseGlow { animation: pulseGlow 3.6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
