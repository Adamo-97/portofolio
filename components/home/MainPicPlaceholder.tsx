// components/home/MainPicPlaceholder.tsx
import Image from "next/image";

type Props = {
  className?: string;
  src?: string;
};

export default function MainPicPlaceholder({
  className = "",
  src = "/image-placeholder@2x.png",
}: Props) {
  return (
    <div className={`relative h-full w-full ${className}`}>
      <Image
        src={src}
        alt="Adam portrait"
        fill
        priority
        className="object-contain object-bottom select-none pointer-events-none"
        sizes="(max-width: 768px) 90vw, 720px"
      />
    </div>
  );
}
