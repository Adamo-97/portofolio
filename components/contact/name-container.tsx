"use client";
import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

export type NameContainerType = {
  className?: string;
  titlePlaceholder?: string;
  placeholder?: string;

  /** Style props */
  typeSectionBorder?: CSSProperties["border"];
};

const NameContainer: NextPage<NameContainerType> = ({
  className = "",
  titlePlaceholder,
  typeSectionBorder,
  placeholder,
}) => {
  const typeSectionStyle: CSSProperties = useMemo(() => {
    return {
      border: typeSectionBorder,
    };
  }, [typeSectionBorder]);

  return (
    <div
      className={`flex-1 flex flex-col items-start justify-start gap-2.5 text-left text-lg text-white font-urbanist ${className}`}
    >
      <b className="relative">{titlePlaceholder}</b>
      <div
        className="self-stretch rounded-2xl bg-darkslategray border-darkslateblue-200 border-solid border-[1px] flex flex-row items-start justify-start py-3.5 px-[23px]"
        style={typeSectionStyle}
      >
        <input
          className="w-full [border:none] [outline:none] inline-block font-urbanist text-lg bg-[transparent] h-[22px] flex-1 relative font-bold text-gray-200 text-left min-w-[144px] p-0"
          placeholder={placeholder}
          type="text"
        />
      </div>
    </div>
  );
};

export default NameContainer;
