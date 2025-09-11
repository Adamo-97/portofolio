"use client";
import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Image from "next/image";

export type DowanloadCvButtonType = {
  className?: string;
  downloadCV?: string;
  iconPlaceholder: string;

  /** Style props */
  dowanloadCvButtonHeight?: CSSProperties["height"];
  iconPlaceholderWidth?: CSSProperties["width"];
  iconPlaceholderHeight?: CSSProperties["height"];
};

const DowanloadCvButton: NextPage<DowanloadCvButtonType> = ({
  className = "",
  dowanloadCvButtonHeight,
  downloadCV,
  iconPlaceholder,
  iconPlaceholderWidth,
  iconPlaceholderHeight,
}) => {
  const dowanloadCvButtonStyle: CSSProperties = useMemo(() => {
    return {
      height: dowanloadCvButtonHeight,
    };
  }, [dowanloadCvButtonHeight]);

  const iconPlaceholderStyle: CSSProperties = useMemo(() => {
    return {
      width: iconPlaceholderWidth,
      height: iconPlaceholderHeight,
    };
  }, [iconPlaceholderWidth, iconPlaceholderHeight]);

  return (
    <button
      className={`cursor-pointer border-white border-solid border-[2px] py-[7px] px-2 bg-gray-300 h-[82px] [backdrop-filter:blur(15px)] rounded-[50px] box-border overflow-hidden flex flex-row items-center justify-center ${className}`}
      style={dowanloadCvButtonStyle}
    >
      <div className="rounded-[60px] bg-cornflowerblue-100 border-lightgray border-solid border-[0.5px] overflow-hidden flex flex-row items-center justify-center py-[9px] px-[19px] gap-[11px]">
        <div className="relative text-[25.7px] tracking-[-0.01em] font-medium font-urbanist text-white text-left">
          {downloadCV}
        </div>
        <Image
          className="w-[42px] relative h-[42px]"
          width={42}
          height={42}
          sizes="100vw"
          alt=""
          src={iconPlaceholder}
          style={iconPlaceholderStyle}
        />
      </div>
    </button>
  );
};

export default DowanloadCvButton;
