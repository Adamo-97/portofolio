"use client";

import { useEffect, useState } from "react";

export function useViewport() {
  const [vw, setVw] = useState<number>(typeof window === "undefined" ? 0 : window.innerWidth);
  const [vh, setVh] = useState<number>(typeof window === "undefined" ? 0 : window.innerHeight);

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { vw, vh };
}
