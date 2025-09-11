"use client";
import Image from "next/image";
import React, { useMemo, type CSSProperties } from "react";

export type DowanloadCvButtonProps =
  React.ComponentProps<"button"> & {
    className?: string;
    downloadCV?: string;
    iconPlaceholder: string;
    href?: string;                 // <- new: link to your CV (e.g., "/cv.pdf")
    downloadAttr?: boolean;        // <- new: add download attribute on <a>
    dowanloadCvButtonHeight?: CSSProperties["height"];
    iconPlaceholderWidth?: CSSProperties["width"];
    iconPlaceholderHeight?: CSSProperties["height"];
  };

export default function DowanloadCvButton({
  className = "",
  downloadCV = "Download CV",
  iconPlaceholder,
  href,
  downloadAttr = false,
  dowanloadCvButtonHeight,
  iconPlaceholderWidth,
  iconPlaceholderHeight,
  ...btnProps
}: DowanloadCvButtonProps) {
  const wrapperStyle: CSSProperties = useMemo(
    () => ({ height: dowanloadCvButtonHeight }),
    [dowanloadCvButtonHeight]
  );
  const iconStyle: CSSProperties = useMemo(
    () => ({ width: iconPlaceholderWidth, height: iconPlaceholderHeight }),
    [iconPlaceholderWidth, iconPlaceholderHeight]
  );

  const inner = (
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
        style={iconStyle}
      />
    </div>
  );

  const baseClasses =
    "cursor-pointer border-white border-solid border-[2px] py-[7px] px-2 bg-gray-300 h-[82px] [backdrop-filter:blur(15px)] rounded-[50px] box-border overflow-hidden flex flex-row items-center justify-center";

  return href ? (
    <a
      href={href}
      {...(downloadAttr ? { download: "" } : {})}
      className={`${baseClasses} ${className}`}
      style={wrapperStyle}
    >
      {inner}
    </a>
  ) : (
    <button className={`${baseClasses} ${className}`} style={wrapperStyle} {...btnProps}>
      {inner}
    </button>
  );
}
