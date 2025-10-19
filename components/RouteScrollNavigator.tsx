"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  routes: string[];           // ordered list the paths to navigate
  cooldownMs?: number;        // min time between navigations
  wheelThreshold?: number;    // how much wheel delta before we act
  touchThreshold?: number;    // swipe distance (px) to navigate
  enableOnReducedMotion?: boolean; // default false: don't hijack for those users
};

/**
 * A headless route navigation helper that converts user scroll, key, and touch
 * gestures into Next.js route transitions across a linear list of routes.
 *
 * Behavior:
 * - Listens globally for:
 *   - Wheel events (vertical only; horizontal deltas ignored)
 *   - Keyboard navigation (ArrowUp/Down, PageUp/PageDown, Space / Shift+Space)
 *   - Touch swipe gestures (vertical)
 * - Accumulates wheel delta until a threshold is exceeded, then advances to the
 *   next or previous route.
 * - Prevents navigation if a scrollable ancestor element can still scroll in
 *   the intended direction (avoids hijacking inner scroll areas like modals,
 *   code blocks, feed containers, etc.).
 * - Applies a cooldown between navigations to avoid rapid accidental multi-skip.
 * - Respects the user's `prefers-reduced-motion` setting by default unless explicitly
 *   overridden via `enableOnReducedMotion`.
 *
 * Side Effects:
 * - Attaches global listeners to `window` for wheel, keyboard, and touch events.
 * - Cleans up all listeners on unmount or dependency changes.
 *
 * Accessibility:
 * - Keyboard support mirrors conventional document navigation patterns.
 * - Respects reduced-motion preferences unless `enableOnReducedMotion` is `true`.
 * - Does not render UI; intended as an enhancement layered atop page structure.
 *
 * Performance:
 * - Minimal work per event (simple accumulation & bounds checks).
 * - Uses `performance.now()` for cooldown timing precision.
 *
 * Recommended Usage:
 * - Mount once per page (e.g., in a layout) with a stable `routes` array that
 *   reflects the vertical / chronological / narrative ordering you wish to
 *   traverse.
 * - Ensure routes array contains the current pathname, or the component will
 *   be inert (`index === -1`).
 *
 * Example:
 * ```tsx
 * <RouteScrollNavigator
 *   routes={["/", "/about", "/work", "/contact"]}
 *   cooldownMs={800}
 *   wheelThreshold={140}
 *   touchThreshold={70}
 * />
 * ```
 *
 * @component
 * @param routes Ordered list of route pathnames representing the scroll / swipe / key navigation sequence.
 * @param cooldownMs Minimum time (ms) between successive navigations to prevent rapid accidental multi-navigation. Default: 900.
 * @param wheelThreshold Accumulated vertical wheel delta required to trigger a route change. Higher values require more deliberate scrolling. Default: 120.
 * @param touchThreshold Vertical touch movement (in pixels) needed to trigger a route change on mobile / touch devices. Default: 60.
 * @param enableOnReducedMotion If true, enables gesture-based navigation even when the user prefers reduced motion. Default: false.
 * @returns null (non-visual utility component).
 */
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
  const goTo = useCallback((i: number) => {
    if (i < 0 || i >= routes.length || i === index) return;
    router.push(routes[i]);
  }, [index, routes, router]);

  const cooldown = useCallback(() => {
    const now = performance.now();
    if (now - lastAtRef.current < cooldownMs) return true;
    lastAtRef.current = now;
    return false;
  }, [cooldownMs]);

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
  }, [enabled, index, routes, wheelThreshold, touchThreshold, cooldownMs, cooldown, goTo]);

  return null;
}
