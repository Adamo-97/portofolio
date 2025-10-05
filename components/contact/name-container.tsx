"use client";
import type { NextPage } from "next";
import React from "react";

type Props = {
  className?: string;
  titlePlaceholder?: string;
  placeholder?: string;
  typeSectionBorder?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  id?: string;
  required?: boolean;
  valueForRequired?: string; // controls the required icon visibility
  size?: "sm" | "md" | "lg"; // NEW: sizing without changing font
};

const NameContainer: NextPage<Props> = ({
  className = "",
  titlePlaceholder = "",
  placeholder = "",
  typeSectionBorder,
  inputProps,
  id,
  required = false,
  valueForRequired = "",
  size = "md",
}) => {
  const showReq = required && !valueForRequired.trim();

  // Only height & padding change; font stays the same as before.
  const sizeCls =
    size === "sm"
      ? "h-10 rounded-xl px-4"
      : size === "lg"
      ? "h-14 rounded-2xl px-7"
      : "h-12 rounded-2xl px-6";

  return (
    <div className={["flex flex-col gap-2 w-full", className].join(" ")}>
      {!!titlePlaceholder && (
        <label
          htmlFor={id}
          className="relative inline-flex items-center gap-2 cursor-pointer select-none"
        >
          <b className="relative">{titlePlaceholder}</b>
          {showReq && (
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="w-3 h-3 text-gray-400"
            >
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="12" y1="7" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1.2" fill="currentColor" />
            </svg>
          )}
        </label>
      )}

      <input
        id={id}
        {...inputProps}
        required={required}
        className={[
          "border-steelblue border-solid border-[1px] bg-darkslategray",
          "w-full [outline:none] shadow-[0_4px_4px_rgba(0,0,0,0.25)]",
          "font-urbanist font-bold text-lg text-gray-200", // ← keep your font & size
          sizeCls, // ← only affects height/padding/radius
          inputProps?.className || "",
        ].join(" ")}
        placeholder={placeholder}
        style={typeSectionBorder ? { border: typeSectionBorder } : undefined}
      />
    </div>
  );
};

export default NameContainer;
