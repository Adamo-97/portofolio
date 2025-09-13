// src/lib/math.ts
export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
