// components/home/FloatingCards.tsx
import Image from "next/image";
import type { CSSProperties } from "react";

type Size = { width: number; height: number };

type Props = {
  className?: string;

  /** Left card asset (pass null/undefined to hide) */
  leftCardSrc?: string | null;
  /** Right card asset (pass null/undefined to hide) */
  rightCardSrc?: string | null;

  /** Absolute positioning for each card (top/left or top/right) */
  leftStyle?: CSSProperties;   // e.g., { top: 323, left: -27 }
  rightStyle?: CSSProperties;  // e.g., { top: 132, right: -5 }

  /** Explicit sizes (defaults provided below) */
  leftSize?: Size;   // default { width: 197, height: 154 }
  rightSize?: Size;  // default { width: 273, height: 191 }

  /** Corner radius in px */
  cornerRadius?: number; // default 10
};

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
  return (
    <div className={`pointer-events-none ${className}`}>
      {leftCardSrc && (
        <Image
          src={leftCardSrc}
          alt=""
          width={leftSize.width}
          height={leftSize.height}
          className="absolute object-contain"
          style={{
            top: 323,
            left: -27,
            borderRadius: cornerRadius,
            ...leftStyle,
          }}
          priority
        />
      )}

      {rightCardSrc && (
        <Image
          src={rightCardSrc}
          alt=""
          width={rightSize.width}
          height={rightSize.height}
          className="absolute object-contain"
          style={{
            top: 132,
            right: -5,
            borderRadius: cornerRadius,
            ...rightStyle,
          }}
          priority
        />
      )}
    </div>
  );
}
