"use client";
import type { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import RouteScrollNavigator from "./RouteScrollNavigator";

export type HeaderType = { className?: string };

const ROUTES = ["/", "/skills-page", "/roadmap-page", "/projects-page", "/contact-page"];

type NavItemProps = {
  label: string;
  onClick?: () => void;
  active?: boolean;
  size?: "md" | "sm";
};

function NavItem({ label, onClick, active = false, size = "md" }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={!active ? onClick : undefined}
      aria-current={active ? "page" : undefined}
      className={[
        "relative inline-flex items-center justify-center",
        size === "md" ? "px-2.5 pt-2 pb-3" : "px-2 pt-1.5 pb-2.5",
        "appearance-none bg-transparent border-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cornflowerblue-100/70",
        active ? "cursor-default" : "cursor-pointer group",
      ].join(" ")}
    >
      <span
        className={[
          "font-urbanist font-bold tracking-[-0.01em]",
          size === "md" ? "text-xl" : "text-lg",
          "transition-colors duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
          active
            ? "text-white"
            : "text-white group-hover:text-cornflowerblue-100 group-focus-visible:text-cornflowerblue-100",
        ].join(" ")}
      >
        {label}
      </span>
      {active && (
        <span aria-hidden className="absolute left-0 right-0 bottom-0 h-[2px] bg-cornflowerblue-100 rounded-full" />
      )}
    </button>
  );
}

/**
 * Responsive site header component that renders:
 * - A logo
 * - A horizontal navigation bar for desktop / tablet
 * - A mobile slide‑in navigation panel with accessible open/close controls
 * - A global route scroll navigator (wheel / touch navigation between defined routes)
 *
 * Behavior:
 * - Collapses the full navigation into a burger button below 675px viewport width.
 * - Mobile menu:
 *   - Opens as an off‑canvas panel from the right.
 *   - Includes a semi‑transparent backdrop that closes the panel on outside click.
 *   - Closes automatically when:
 *     - Route/pathname changes
 *     - Escape key is pressed
 *     - User clicks outside the panel
 * - Active navigation item is highlighted based on the current pathname.
 *
 * Accessibility:
 * - Burger button exposes aria-expanded and aria-controls for the mobile menu.
 * - Mobile panel is treated as a modal dialog with role="dialog" and aria-modal="true".
 * - Escape key handling and backdrop click provide expected dismissal affordances.
 * - Focus styles rely on Tailwind ring utilities for visible focus indication.
 *
 * Performance / Implementation Notes:
 * - Navigation handlers (goHome, goSkills, etc.) are memoized with useCallback to avoid
 *   unnecessary re-renders of child components that receive them.
 * - Event listeners for Escape key and outside clicks are scoped and cleaned up properly.
 * - Uses a ref (panelRef) to detect outside clicks for the mobile panel.
 * - Transition classes (translate-x, opacity) provide smooth opening/closing animations.
 *
 * Styling:
 * - Tailwind utility classes drive responsive spacing and visibility:
 *   - Desktop layout uses fixed horizontal padding that scales down at defined breakpoints.
 *   - Mobile menu uses backdrop blur, translucency, and a max width constraint.
 *
 * @component
 * @param props.className Optional additional class names merged onto the root header element.
 *
 * @remarks
 * Ensure that ROUTES, NavItem, RouteScrollNavigator, HeaderType, and required Next.js hooks
 * (useRouter, usePathname) are available in the component's module scope.
 *
 * @example
 * // Basic usage inside a layout:
 * <Header className="shadow-lg" />
 *
 * @example
 * // Custom wrapper with sticky positioning:
 * <div className="sticky top-0">
 *   <Header />
 * </div>
 *
 * @see RouteScrollNavigator for scroll-based route switching behavior.
 */
const Header: NextPage<HeaderType> = ({ className = "" }) => {
  const router = useRouter();
  const pathname = usePathname();

  const goHome = useCallback(() => router.push("/"), [router]);
  const goSkills = useCallback(() => router.push("/skills-page"), [router]);
  const goRoadmap = useCallback(() => router.push("/roadmap-page"), [router]);
  const goProjects = useCallback(() => router.push("/projects-page"), [router]);
  const goContact = useCallback(() => router.push("/contact-page"), [router]);

  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const pnl = panelRef.current;
      if (pnl && !pnl.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <header
      className={[
        "relative z-[90]",
        "self-stretch flex flex-row items-center justify-between",
        // Desktop/tablet padding preserved...
        "pt-2.5 px-[120px] pb-0",
        "mq750:pl-[60px] mq750:pr-[60px]",
        "mq450:pl-5 mq450:pr-5",
        // ...but make it smaller on true mobile (≤675px)
        "max-[675px]:pt-1.5 max-[675px]:px-3",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <Image
          className="relative max-h-full w-[42px] h-[44px] max-[675px]:w-[32px] max-[675px]:h-[34px]"
          loading="lazy"
          width={42}
          height={44}
          sizes="100vw"
          alt="Logo"
          src="/logo.svg"
        />
      </div>

      <nav className="m-0 flex flex-row items-center justify-start gap-5 text-center text-xl text-white font-urbanist max-[675px]:hidden">
        <NavItem label="Home" active={pathname === "/"} onClick={goHome} />
        <NavItem label="Skills" active={pathname === "/skills-page"} onClick={goSkills} />
        <NavItem label="Roadmap" active={pathname === "/roadmap-page"} onClick={goRoadmap} />
        <NavItem label="Projects" active={pathname === "/projects-page"} onClick={goProjects} />
        <NavItem label="Contact" active={pathname === "/contact-page"} onClick={goContact} />
      </nav>

      <button
        type="button"
        className="hidden max-[675px]:inline-flex items-center justify-center rounded-xl p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cornflowerblue-100/70"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-white" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className={[
          "hidden max-[675px]:block",
          "fixed inset-0 z-[70] bg-black/40 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      <div
        id="mobile-menu"
        ref={panelRef}
        className={[
          "hidden max-[675px]:flex",
          "fixed z-[80] top-0 right-0 h-dvh w-[78vw] max-w-[360px]",
          "bg-[#0b0d12]/95 backdrop-blur-md border-l border-white/10",
          open ? "translate-x-0" : "translate-x-full",
          "transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
          "flex-col",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <Image
              className="relative w-[32px] h-[34px]"
              loading="lazy"
              width={32}
              height={34}
              alt="Logo"
              src="/logo.svg"
            />
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="rounded-xl p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cornflowerblue-100/70"
            onClick={() => setOpen(false)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-white" aria-hidden="true">
              <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="mt-2 px-2 text-white font-urbanist">
          <ul className="flex flex-col">
            <li><NavItem label="Home" size="sm" active={pathname === "/"} onClick={goHome} /></li>
            <li><NavItem label="Skills" size="sm" active={pathname === "/skills-page"} onClick={goSkills} /></li>
            <li><NavItem label="Roadmap" size="sm" active={pathname === "/roadmap-page"} onClick={goRoadmap} /></li>
            <li><NavItem label="Projects" size="sm" active={pathname === "/projects-page"} onClick={goProjects} /></li>
            <li><NavItem label="Contact" size="sm" active={pathname === "/contact-page"} onClick={goContact} /></li>
          </ul>
        </nav>

        <div className="mt-auto p-4 text-xs text-white/60 select-none">
          © {new Date().getFullYear()}
        </div>
      </div>

      <RouteScrollNavigator
        routes={ROUTES}
        wheelThreshold={160}
        cooldownMs={900}
        touchThreshold={60}
      />
    </header>
  );
};

export default Header;
