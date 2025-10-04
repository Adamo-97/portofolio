"use client";
import Image from "next/image";
import React from "react";

type Props = {
  className?: string;
  year?: number;
  owner?: string;        // the name in the copyright line
  logoSrc?: string;
  logoAlt?: string;
  logoW?: number;
  logoH?: number;
};

export default function Footer({
  className = "",
  year = 2025,
  owner = "Adam Abdullah",
  logoSrc = "/logo1.svg",
  logoAlt = "Logo",
  logoW = 28,
  logoH = 30,
}: Props) {
  return (
    <footer
      className={[
        "w-full flex items-center justify-between py-4 px-6 sm:px-12",
        className,
      ].join(" ")}
    >
      <div className="tracking-[-0.5px] leading-[38px]">
        © {year} {owner}, All Rights Reserved
      </div>
      <Image
        className="w-7 h-auto"
        width={logoW}
        height={logoH}
        sizes="100vw"
        alt={logoAlt}
        src={logoSrc}
      />
    </footer>
  );
}
