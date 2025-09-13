import Image from "next/image";
import type { CSSProperties } from "react";

type Props = {
  className?: string;
  src?: string;
  scale?: number;
  onImgReady?: (ar: number) => void; // h/w
  innerStyle?: CSSProperties;
};

export default function MainPicPlaceholder({
  className = "",
  src = "/image-placeholder@2x.png",
  scale = 1,
  onImgReady,
  innerStyle,
}: Props) {
  return (
    <div className={`relative h-full w-full ${className}`}>
      <div
        className="absolute inset-0"
        style={{ transform: `scale(${scale})`, transformOrigin: "bottom center", ...innerStyle }}
      >
        <Image
          src={src}
          alt="Adam portrait"
          fill
          priority
          className="object-contain object-bottom select-none pointer-events-none"
          sizes="(max-width: 768px) 90vw, 720px"
          onLoad={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (img.naturalWidth > 0 && onImgReady) {
              onImgReady(img.naturalHeight / img.naturalWidth);
            }
          }}
        />
      </div>
    </div>
  );
}
