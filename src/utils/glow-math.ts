/**
 * Mathematical models and pure logic for the Halden bowl-glow canvas
 * and scroll-driven typography reveals.
 */

export interface BowlParams {
  tip: number;
  half: number;
  soft: number;
}

export const SCROLL_KEYS: { q: number; tip: number; half: number; soft: number }[] = [
  { q: 0.0, tip: 0.30, half: 0.34, soft: 0.22 },
  { q: 0.03, tip: 0.45, half: 0.38, soft: 0.26 },
  { q: 0.08, tip: 0.65, half: 0.38, soft: 0.22 },
  { q: 0.18, tip: 0.80, half: 0.38, soft: 0.22 },
  { q: 0.40, tip: 0.95, half: 0.38, soft: 0.19 },
  { q: 0.66, tip: 1.05, half: 0.46, soft: 0.16 },
  { q: 0.87, tip: 1.05, half: 0.66, soft: 0.13 },
  { q: 1.15, tip: 1.10, half: 0.90, soft: 0.10 },
  { q: 1.43, tip: 1.30, half: 1.60, soft: 0.10 },
  { q: 1.80, tip: 2.40, half: 3.00, soft: 0.10 },
];

export function clamp(v: number, min = 0, max = 1): number {
  return v < min ? min : v > max ? max : v;
}

export function smoothstep(v: number): number {
  const x = clamp(v, 0, 1);
  return x * x * (3 - 2 * x);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function interpolateBowlKeys(q: number): BowlParams {
  const keys = SCROLL_KEYS;
  if (q <= keys[0].q) {
    return { tip: keys[0].tip, half: keys[0].half, soft: keys[0].soft };
  }
  const last = keys[keys.length - 1];
  if (q >= last.q) {
    return { tip: last.tip, half: last.half, soft: last.soft };
  }

  for (let i = 0; i < keys.length - 1; i++) {
    const k1 = keys[i];
    const k2 = keys[i + 1];
    if (q >= k1.q && q <= k2.q) {
      const t = (q - k1.q) / (k2.q - k1.q);
      return {
        tip: lerp(k1.tip, k2.tip, t),
        half: lerp(k1.half, k2.half, t),
        soft: lerp(k1.soft, k2.soft, t),
      };
    }
  }
  return { tip: last.tip, half: last.half, soft: last.soft };
}

export function pointToSegmentDistance(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const abLenSq = abx * abx + aby * aby;
  if (abLenSq === 0) {
    return Math.hypot(apx, apy);
  }
  const t = clamp((apx * abx + apy * aby) / abLenSq, 0, 1);
  const projx = ax + t * abx;
  const projy = ay + t * aby;
  return Math.hypot(px - projx, py - projy);
}

export function isInsideBowl(
  px: number,
  py: number,
  tip: number,
  half: number,
  aspect: number
): boolean {
  if (py >= tip || tip <= 0) return false;
  const boundX = half * aspect * Math.pow(Math.max(0, 1 - py / tip), 0.72);
  return px < boundX;
}

export function computeLetterProgress(
  p: number,
  index: number,
  total: number,
  spread: number
): number {
  if (total <= 0 || spread <= 0) return 0;
  return clamp((p * (1 + spread) - index / total) / spread, 0, 1);
}

export type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function mixRgb(c1: RGB, c2: RGB, t: number): RGB {
  const clamped = clamp(t, 0, 1);
  return [
    Math.round(lerp(c1[0], c2[0], clamped)),
    Math.round(lerp(c1[1], c2[1], clamped)),
    Math.round(lerp(c1[2], c2[2], clamped)),
  ];
}

export interface LetterStyle {
  opacity: number;
  color: string;
  blur: number;
}

export function calculateLetterState(
  t: number,
  ghost: RGB,
  accent: RGB,
  final: RGB
): LetterStyle {
  if (t <= 0) {
    return {
      opacity: 0,
      color: `rgb(${ghost[0]}, ${ghost[1]}, ${ghost[2]})`,
      blur: 8,
    };
  }
  if (t <= 0.35) {
    const u = t / 0.35;
    return {
      opacity: u,
      color: `rgb(${ghost[0]}, ${ghost[1]}, ${ghost[2]})`,
      blur: 8 - u * 6.5,
    };
  }
  if (t <= 0.70) {
    const u = (t - 0.35) / 0.35;
    const col = mixRgb(ghost, accent, u);
    return {
      opacity: 1,
      color: `rgb(${col[0]}, ${col[1]}, ${col[2]})`,
      blur: 1.5 - u * 1.5,
    };
  }
  const u = (t - 0.70) / 0.30;
  const col = mixRgb(accent, final, u);
  return {
    opacity: 1,
    color: `rgb(${col[0]}, ${col[1]}, ${col[2]})`,
    blur: 0,
  };
}
