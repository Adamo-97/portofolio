"use client";
import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Image from "next/image";

export type Nr2Type = {
  className?: string;
  descriptionPlaceholdr?: string;
  pinBody: string;
  logoContainer: string;

  /** Style props */
  nr3Top?: CSSProperties["top"];
  nr3Left?: CSSProperties["left"];
  titlePlaceholderMargin?: CSSProperties["margin"];
};

const Nr2: NextPage<Nr2Type> = ({
  className = "",
  nr3Top,
  nr3Left,
  titlePlaceholderMargin,
  descriptionPlaceholdr,
  pinBody,
  logoContainer,
}) => {
  const nr3Style: CSSProperties = useMemo(() => {
    return {
      top: nr3Top,
      left: nr3Left,
    };
  }, [nr3Top, nr3Left]);

  const titlePlaceholderStyle: CSSProperties = useMemo(() => {
    return {
      margin: titlePlaceholderMargin,
    };
  }, [titlePlaceholderMargin]);

  return (
    <div
      className={`!!m-[0 important] absolute top-[491px] left-[354px] flex flex-row items-end justify-start gap-2.5 z-[2] text-right text-xl text-white font-urbanist ${className}`}
      style={nr3Style}
    >
      <div className="w-[230px] rounded-2xl flex flex-col items-end justify-start gap-2">
        <div
          className="self-stretch relative tracking-[-0.01em] font-extrabold mq450:text-base"
          style={titlePlaceholderStyle}
        >
          2023 B.Sc. in Software Engineering, BTH.
        </div>
        <div className="self-stretch relative text-[15px] font-medium">
          {descriptionPlaceholdr}
        </div>
      </div>
      <div className="h-[187px] w-[90px] flex flex-col items-start justify-start">
        <div className="flex flex-row items-start justify-start py-0 px-7 z-[1]">
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
        <div className="w-[90px] max-h-full shrink-0 z-[2] overflow-hidden relative flex items-center justify-center mt-[-13px]">
          <Image
            className="w-full shrink-0 z-[2] object-cover absolute left-[0px] top-[0px] h-full [transform:scale(1.333)]"
            width={90}
            height={90}
            sizes="100vw"
            alt=""
            src={logoContainer}
          />
        </div>
      </div>
    </div>
  );
};

export default Nr2;
