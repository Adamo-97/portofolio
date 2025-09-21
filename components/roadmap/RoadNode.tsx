"use client";
import { useMemo } from "react";
import RoadText from "./RoadText";

export type RoadmapItem = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  from?: string;
  to?: string | null;
};

type Props = {
  item: RoadmapItem;   // singular here ✅
  above: boolean;
  accentColor?: string;
  iconSize?: number;
  gapFromLine?: number;
  tipSize?: number;
  glowSize?: number;
  glowBlur?: number;
  laneHeight?: number;
  textWidth?: number;
  textBlock?: number;
};

export default function RoadNode({
  item,
  above,
  accentColor = "#7dd3fc",
  iconSize = 88,
  gapFromLine = 12,
  tipSize = 10,
  glowSize = 140,
  glowBlur = 26,
  laneHeight = 460,
  textWidth = 360,
  textBlock = 150,
}: Props) {
  const styles = useMemo(() => {
    const dotTop = `calc(50% - ${tipSize / 2}px)`;
    const iconTopAbove = `calc(50% - ${tipSize / 2 + gapFromLine + iconSize}px)`;
    const iconTopBelow = `calc(50% + ${tipSize / 2 + gapFromLine}px)`;
    const textGap = 10;
    const textTopAbove = `calc(50% - ${tipSize / 2 + gapFromLine + iconSize}px - ${textBlock}px - ${textGap}px)`;
    const textTopBelow = `calc(50% + ${tipSize / 2 + gapFromLine + iconSize + textGap}px)`;
    return { dotTop, iconTopAbove, iconTopBelow, textTopAbove, textTopBelow };
  }, [tipSize, gapFromLine, iconSize, textBlock]);

  return (
    <div className="relative" style={{ height: laneHeight }}>
      {/* diamond dot on line */}
      <span
        aria-hidden
        className="absolute z-10"
        style={{
          top: styles.dotTop,
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          width: tipSize,
          height: tipSize,
          background: accentColor,
          boxShadow: `0 0 12px ${accentColor}55`,
          borderRadius: 2,
        }}
      />
      {/* text */}
      <div
        className="absolute z-10"
        style={{
          top: above ? styles.textTopAbove : styles.textTopBelow,
          left: "50%",
          transform: "translateX(-50%)",
          height: textBlock,
          display: "grid",
          placeItems: "center",
        }}
      >
        <RoadText
          title={item.title}
          description={item.description}
          from={item.from}
          to={item.to}
          accentColor={accentColor}
          width={textWidth}
        />
      </div>
      {/* icon */}
      <div
        className="absolute z-10 grid place-items-center transition-transform duration-300"
        style={{
          top: above ? styles.iconTopAbove : styles.iconTopBelow,
          left: "50%",
          transform: "translateX(-50%)",
          height: iconSize,
          width: iconSize,
        }}
      >
        <span
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 140,
            height: 140,
            background: accentColor,
            opacity: 0.25,
            filter: `blur(26px)`,
            zIndex: -1,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {item.icon ? (
          <img src={item.icon} alt="" className="object-contain select-none" style={{ height: iconSize, width: iconSize }} draggable={false} />
        ) : (
          <span className="grid place-items-center text-sm font-semibold text-sky-50" style={{ height: iconSize, width: iconSize }}>
            {item.title.slice(0, 1)}
          </span>
        )}
      </div>
    </div>
  );
}
