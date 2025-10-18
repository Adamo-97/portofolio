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
  valueForRequired?: string; 
  size?: "sm" | "md" | "lg"; 
};

/**
 * Responsive labeled input container component.
 *
 * Renders an optional bold label (driven by `titlePlaceholder`) and an <input/>
 * element with consistent sizing, styling, and conditional required indicator.
 *
 * A subtle "info" style icon appears next to the label when `required` is true
 * but the current `valueForRequired` is empty/whitespace, signaling to the user
 * that the field still needs attention. This visual indicator is purely
 * informational; HTML required validation is handled via the `required` prop.
 *
 * Sizing:
 * - size="sm" => compact height, smaller horizontal padding
 * - size="md" (default) => standard height/padding
 * - size="lg" => taller field with increased padding
 *
 * Border customization:
 * - `typeSectionBorder` can override the default border via inline style (e.g. "1px solid #fff").
 *
 * Styling strategy:
 * - Utility classes are composed dynamically (Tailwind-style)
 * - External consumers can extend/override input styling through `inputProps.className`
 * - Root wrapper also accepts a `className` for layout control
 *
 * Accessibility:
 * - The label is associated with the input through `htmlFor` / `id`
 * - The required indicator SVG is marked as aria-hidden to avoid redundancy
 *
 * Performance / safety:
 * - Defensive optional chaining is used for `inputProps?.className`
 *
 * Props:
 * @prop className Optional class names applied to the outer wrapper container.
 * @prop titlePlaceholder Optional text displayed as the field label (bold). If empty, no label is rendered.
 * @prop placeholder Placeholder text passed to the underlying input element.
 * @prop typeSectionBorder Optional CSS border value applied inline to the input (e.g. "2px dashed #888").
 * @prop inputProps Additional standard input props (e.g. onChange, value, type, name). `className` within this merges with internal styles.
 * @prop id The id used for input and label association. Recommended when `titlePlaceholder` is provided.
 * @prop required If true, sets the input as required and enables the conditional required state indicator.
 * @prop valueForRequired The current external value used to determine whether to show the required indicator (typically mirrors inputProps.value).
 * @prop size Visual size variant: "sm" | "md" | "lg". Defaults to "md".
 *
 * Internal logic:
 * @constant showReq True when the field is marked required and `valueForRequired` is empty/whitespace.
 * @constant sizeCls Computed Tailwind-like class string for sizing and rounding.
 *
 * Usage example:
 * <NameContainer
 *   id="fullName"
 *   titlePlaceholder="Full Name"
 *   placeholder="Enter your full name"
 *   required
 *   valueForRequired={formValues.fullName}
 *   inputProps={{ value: formValues.fullName, onChange: handleChange }}
 *   size="lg"
 * />
 */
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

      <div className="relative">
        {/* Glossy top edge */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-[inherit] pointer-events-none z-10" />
        
        <input
          id={id}
          {...inputProps}
          required={required}
          className={[
            "relative border-[2px] border-cornflowerblue-100/30 bg-[#0f1729]",
            "w-full [outline:none]",
            "shadow-[0_4px_20px_rgba(24,161,253,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]",
            "hover:border-cornflowerblue-100/50 hover:shadow-[0_4px_30px_rgba(24,161,253,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]",
            "focus:border-cornflowerblue-100/70 focus:shadow-[0_4px_40px_rgba(24,161,253,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]",
            "transition-all duration-300",
            "before:absolute before:inset-0 before:rounded-[inherit] before:p-[2px]",
            "before:bg-gradient-to-br before:from-white/20 before:to-transparent",
            "before:pointer-events-none before:-z-10",
            "font-urbanist font-bold text-lg text-white placeholder:text-gray-400", 
            sizeCls, 
            inputProps?.className || "",
          ].join(" ")}
          placeholder={placeholder}
          style={typeSectionBorder ? { border: typeSectionBorder } : undefined}
        />
      </div>
    </div>
  );
};

export default NameContainer;
