// Shared geometry helpers for the data-driven SVG diagrams.

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

export interface Point {
  x: number;
  y: number;
}

export function rect(x: number, y: number, w: number, h: number): Rect {
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}

/** Point on a rect's border along the ray from its centre toward `target`. */
export function borderPoint(r: Rect, target: Point): Point {
  const dx = target.x - r.cx;
  const dy = target.y - r.cy;
  if (dx === 0 && dy === 0) return { x: r.cx, y: r.cy };
  const hw = r.w / 2;
  const hh = r.h / 2;
  const scaleX = dx === 0 ? Infinity : hw / Math.abs(dx);
  const scaleY = dy === 0 ? Infinity : hh / Math.abs(dy);
  const s = Math.min(scaleX, scaleY);
  return { x: r.cx + dx * s, y: r.cy + dy * s };
}

/** Interpolate a point `dist` px from `a` toward `b`. */
export function along(a: Point, b: Point, dist: number): Point {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const t = dist / len;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Unit vector perpendicular to a→b (rotated +90°). */
export function perp(a: Point, b: Point): Point {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: -(b.y - a.y) / len, y: (b.x - a.x) / len };
}

export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function angleDeg(a: Point, b: Point): number {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}
