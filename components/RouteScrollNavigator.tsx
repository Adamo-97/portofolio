"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  routes: string[];           // ordered list the paths to navigate
  cooldownMs?: number;        // min time between navigations
  wheelThreshold?: number;    // how much wheel delta before we act
  touchThreshold?: number;    // swipe distance (px) to navigate
  enableOnReducedMotion?: boolean; // default false: don't hijack for those users
};

export default function RouteScrollNavigator({
  routes,
  cooldownMs = 900,
  wheelThreshold = 120,
  touchThreshold = 60,
  enableOnReducedMotion = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const index = useMemo(() => routes.indexOf(pathname ?? ""), [pathname, routes]);
  const lastAtRef = useRef(0);
  const accRef = useRef(0);
  const touchYRef = useRef<number | null>(null);

  // Helpers -------------------------------------------------------
  const goTo = (i: number) => {
    if (i < 0 || i >= routes.length || i === index) return;
    router.push(routes[i]);
  };

  const cooldown = () => {
    const now = performance.now();
    if (now - lastAtRef.current < cooldownMs) return true;
    lastAtRef.current = now;
    return false;
  };

  // Only navigate if no scrollable ancestor can consume this scroll in that direction
  const canAncestorScrollInDirection = (target: EventTarget | null, deltaY: number) => {
    let el = target as HTMLElement | null;
    while (el && el !== document.body && el !== document.documentElement) {
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      const isScrollable = (overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight;
      if (isScrollable) {
        if (deltaY > 0) {
          // scrolling down: if there's room below, let the element handle it
          if (Math.ceil(el.scrollTop + el.clientHeight) < el.scrollHeight) return true;
        } else if (deltaY < 0) {
          // scrolling up: if there's room above, let the element handle it
          if (el.scrollTop > 0) return true;
        }
      }
      el = el.parentElement;
    }
    return false;
  };

  // Respect prefers-reduced-motion by default
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const enabled = enableOnReducedMotion || !prefersReducedMotion;

  useEffect(() => {
    if (!enabled || index === -1) return;

    // WHEEL -------------------------------------------------------
    const onWheel = (e: WheelEvent) => {
      // ignore horizontal scrolls
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      if (canAncestorScrollInDirection(e.target, e.deltaY)) return;

      accRef.current += e.deltaY;

      if (Math.abs(accRef.current) >= wheelThreshold) {
        if (cooldown()) {
          accRef.current = 0;
          return;
        }
        const dir = accRef.current > 0 ? 1 : -1;
        goTo(index + dir);
        accRef.current = 0;
        // prevent the default scroll so we don't see a jump before routing
        e.preventDefault();
      }
    };

    // KEYS --------------------------------------------------------
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      let dir = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      else if (e.key === " " && !e.shiftKey) dir = 1;        // Space
      else if (e.key === " " && e.shiftKey) dir = -1;        // Shift+Space
      if (!dir) return;

      if (cooldown()) return;
      goTo(index + dir);
      e.preventDefault();
    };

    // TOUCH (mobile) ---------------------------------------------
    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      // if a child can scroll, let it
      const startY = touchYRef.current;
      if (startY == null) return;
      const dy = startY - (e.touches[0]?.clientY ?? startY);
      if (canAncestorScrollInDirection(e.target, dy)) return;

      if (Math.abs(dy) >= touchThreshold) {
        if (cooldown()) return;
        goTo(index + (dy > 0 ? 1 : -1));
        touchYRef.current = null;
        e.preventDefault();
      }
    };
    const onTouchEnd = () => {
      touchYRef.current = null;
    };

    // listeners (wheel must be non-passive to allow preventDefault)
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [enabled, index, routes, wheelThreshold, touchThreshold, cooldownMs]);

  return null;
}
