"use client";

export type RoadTextProps = {
  title: string;
  description: string;
  from?: string;
  to?: string | null;
  accentColor?: string; // date color
  width?: number;       // px (visual width of the text card)
};

export default function RoadText({
  title,
  description,
  from,
  to,
  accentColor = "#7dd3fc",
  width = 360,
}: RoadTextProps) {
  return (
    <div
      className="text-center"
      style={{ width }}
    >
      <div className="text-sky-50 text-sm font-semibold tracking-wide">
        {title}
      </div>
      {from && (
        <div className="mt-1 text-[12px] italic" style={{ color: accentColor }}>
          {fmtRange(from, to)}
        </div>
      )}
      <p className="mt-2 text-[14px] leading-snug text-sky-100/85">
        {description}
      </p>
    </div>
  );
}

function fmtRange(from?: string, to?: string | null) {
  if (!from) return "";
  const f = new Date(from);
  const t = to ? new Date(to) : null;
  const fm = f.toLocaleString(undefined, { month: "short", year: "numeric" });
  const tm = t ? t.toLocaleString(undefined, { month: "short", year: "numeric" }) : "Present";
  return `${fm} – ${tm}`;
}
