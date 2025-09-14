"use client";
import type { NextPage } from "next";
import { useCallback } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import RouteScrollNavigator from "./RouteScrollNavigator";

export type HeaderType = { className?: string };


const ROUTES = ["/", "/skills-page", "/roadmap-page", "/projects-page", "/contact-page"];


type NavItemProps = {
  label: string;
  onClick?: () => void;
  active?: boolean;
};

function NavItem({ label, onClick, active = false }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={!active ? onClick : undefined}               // disable click on current page
      aria-current={active ? "page" : undefined}
      className={[
        // keep layout rock-solid
        "relative inline-flex items-center justify-center px-2.5 py-2.5",
        "appearance-none bg-transparent border-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cornflowerblue-100/70",
        active ? "cursor-default" : "cursor-pointer group", // group only when hoverable
      ].join(" ")}
    >
      {/* Single text node; we fade its color on hover if NOT active */}
      <span
        className={[
          "font-urbanist font-bold text-xl tracking-[-0.01em]",
          "transition-colors duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
          active
            ? "text-white"                                  // selected stays white
            : "text-white group-hover:text-cornflowerblue-100 group-focus-visible:text-cornflowerblue-100",
        ].join(" ")}
      >
        {label}
      </span>

      {/* Active underline only */}
      {active && (
        <span
          aria-hidden
          className="absolute left-0 right-0 -bottom-[2px] h-[1px] bg-cornflowerblue-100"
        />
      )}
    </button>
  );
}

const Header: NextPage<HeaderType> = ({ className = "" }) => {
  const router = useRouter();
  const pathname = usePathname();

  const goHome     = useCallback(() => router.push("/"), [router]);
  const goSkills   = useCallback(() => router.push("/skills-page"), [router]);
  const goRoadmap  = useCallback(() => router.push("/roadmap-page"), [router]);
  const goProjects = useCallback(() => router.push("/projects-page"), [router]);
  const goContact  = useCallback(() => router.push("/contact-page"), [router]);

  return (
    <header
      className={`self-stretch flex flex-row items-center justify-between pt-2.5 px-[120px] pb-0 gap-0 mq450:pl-5 mq450:pr-5 mq450:box-border mq750:pl-[60px] mq750:pr-[60px] mq750:box-border ${className}`}
    >
      <Image
        className="w-[42px] relative max-h-full"
        loading="lazy"
        width={42}
        height={44}
        sizes="100vw"
        alt=""
        src="/logo.svg"
      />

      <nav className="m-0 flex flex-row items-center justify-start gap-5 text-center text-xl text-white font-urbanist mq675:hidden">
        <NavItem label="Home"     active={pathname === "/"}             onClick={goHome} />
        <NavItem label="Skills"   active={pathname === "/skills-page"}  onClick={goSkills} />
        <NavItem label="Roadmap"  active={pathname === "/roadmap-page"} onClick={goRoadmap} />
        <NavItem label="Projects" active={pathname === "/projects-page"}onClick={goProjects} />
        <NavItem label="Contact"  active={pathname === "/contact-page"} onClick={goContact} />
      </nav>
      <RouteScrollNavigator
        routes={ROUTES}
        wheelThreshold={160}   // 120–200: lower = more sensitive
        cooldownMs={900}       // time between jumps; match your page transition
        touchThreshold={60}    // px swipe on mobile
      />
    </header>
  );
};

export default Header;
