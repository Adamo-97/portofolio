// components/Section.tsx
import React from "react";
import clsx from "clsx";

type Props = {
  id?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({ id, title, children, className }: Props) {
  return (
    <section id={id} className={clsx("mx-auto max-w-5xl px-4 py-12", className)}>
      {title && (
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">{title}</h2>
      )}
      {children}
    </section>
  );
}
