// components/home/FloatingCards.tsx
import Image from "next/image";
import type { CSSProperties } from "react";

type Size = { width: number; height: number };

type Props = {
  className?: string;
  leftCardSrc?: string | null;
  rightCardSrc?: string | null;
  leftStyle?: CSSProperties;   // e.g., { bottom: 110, left: -16 }
  rightStyle?: CSSProperties;  // e.g., { bottom: 200, right: -8 }
  leftSize?: Size;             // default { width: 197, height: 154 }
  rightSize?: Size;            // default { width: 273, height: 191 }
  cornerRadius?: number;       // default 10
};

function mergePos(defaultPos: CSSProperties, override?: CSSProperties): CSSProperties {
  const final: CSSProperties = { ...defaultPos, ...(override || {}) };
  if (override && "bottom" in override) delete (final as any).top;
  if (override && "top" in override) delete (final as any).bottom;
  if (override && "left" in override) delete (final as any).right;
  if (override && "right" in override) delete (final as any).left;
  return final;
}

export default function FloatingCards({
  className = "",
  leftCardSrc = "/experience-section@2x.png",
  rightCardSrc = "/bcs-se@2x.png",
  leftStyle,
  rightStyle,
  leftSize = { width: 197, height: 154 },
  rightSize = { width: 273, height: 191 },
  cornerRadius = 10,
}: Props) {
  const leftDefault: CSSProperties = { top: 323, left: -27 };
  const rightDefault: CSSProperties = { top: 132, right: -5 };

  return (
    <div className={`pointer-events-none ${className}`}>
      {leftCardSrc && (
        <Image
          src={leftCardSrc}
          alt=""
          width={leftSize.width}
          height={leftSize.height}
          className="absolute object-contain"
          style={{ borderRadius: cornerRadius, ...mergePos(leftDefault, leftStyle) }}
          priority
          sizes="(max-width: 768px) 45vw, 320px"
        />
      )}

      {rightCardSrc && (
        <Image
          src={rightCardSrc}
          alt=""
          width={rightSize.width}
          height={rightSize.height}
          className="absolute object-contain"
          style={{ borderRadius: cornerRadius, ...mergePos(rightDefault, rightStyle) }}
          priority
          sizes="(max-width: 768px) 55vw, 380px"
        />
      )}
    </div>
  );
}
