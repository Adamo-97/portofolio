"use client";
import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Image from "next/image";

export type Nr1Type = {
  className?: string;
  logoContainer: string;
  pinBody: string;
  descriptionPlaceholdr?: string;

  /** Style props */
  nr4Top?: CSSProperties["top"];
  nr4Left?: CSSProperties["left"];
};

const Nr1: NextPage<Nr1Type> = ({
  className = "",
  nr4Top,
  nr4Left,
  logoContainer,
  pinBody,
  descriptionPlaceholdr,
}) => {
  const nr4Style: CSSProperties = useMemo(() => {
    return {
      top: nr4Top,
      left: nr4Left,
    };
  }, [nr4Top, nr4Left]);

  return (
    <div
      className={`!!m-[0 important] absolute top-[259px] left-[264px] flex flex-row items-start justify-start gap-2.5 z-[1] text-left text-xl text-white font-urbanist ${className}`}
      style={nr4Style}
    >
      <div className="h-[187px] w-[90px] flex flex-col items-start justify-start">
        <div className="w-[90px] max-h-full shrink-0 z-[2] overflow-hidden relative flex items-center justify-center">
          <Image
            className="w-full shrink-0 z-[2] object-cover absolute left-[0px] top-[0px] h-full [transform:scale(1.333)]"
            width={90}
            height={90}
            sizes="100vw"
            alt=""
            src={logoContainer}
          />
        </div>
        <div className="flex flex-row items-start justify-start py-0 px-7 z-[1] mt-[-13px] relative">
          <Image
            className="h-[110px] w-full relative rounded-sm shrink-0"
            loading="lazy"
            width={34}
            height={110}
            sizes="100vw"
            alt=""
            src={pinBody}
          />
        </div>
      </div>
      <div className="w-[230px] rounded-2xl flex flex-col items-end justify-start gap-2">
        <div className="self-stretch relative tracking-[-0.01em] font-extrabold mq450:text-base">
          2019 Medical Assistant, Karlskrona Kommun
        </div>
        <div className="self-stretch relative text-[15px] font-medium">
          {descriptionPlaceholdr}
        </div>
      </div>
    </div>
  );
};

export default Nr1;
