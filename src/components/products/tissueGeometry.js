/* ------------------------------------------------------------------
   Deterministic geometry for the schematic tissue illustrations
   (SpatialVisuals, HistoQuantVisuals). Everything is seeded, so a
   drawing is identical on every render and on the server.
------------------------------------------------------------------ */

export function seeded(seed) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* An irregular closed outline around (cx, cy). */
export function outline(cx, cy, rx, ry, seed, n = 44) {
  const r = seeded(seed);
  const k1 = r() * 6;
  const k2 = r() * 6;
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const m = 1 + 0.08 * Math.sin(3 * a + k1) + 0.05 * Math.sin(5 * a + k2);
    return [cx + rx * m * Math.cos(a), cy + ry * m * Math.sin(a)];
  });
}

export function inPoly([x, y], poly) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

export const toPath = (poly) => `M${poly.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`;
export const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/* Jittered grid of points inside `poly`, kept `margin` clear of its edge. */
export function fill(poly, spacing, seed, margin = 0) {
  const r = seeded(seed);
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const out = [];
  for (let y = Math.min(...ys); y <= Math.max(...ys); y += spacing * 0.87) {
    const row = Math.round(y / spacing) % 2;
    for (let x = Math.min(...xs) + (row ? spacing / 2 : 0); x <= Math.max(...xs); x += spacing) {
      const p = [x + (r() - 0.5) * spacing * 0.35, y + (r() - 0.5) * spacing * 0.35];
      if (!inPoly(p, poly)) continue;
      if (margin && poly.some((q) => dist(p, q) < margin)) continue;
      out.push(p);
    }
  }
  return out;
}

/* `count` random points inside a rectangle that pass `keep`. */
export function scatter([x0, y0, x1, y1], count, seed, keep = () => true) {
  const r = seeded(seed);
  const out = [];
  for (let tries = 0; out.length < count && tries < count * 40; tries++) {
    const p = [x0 + r() * (x1 - x0), y0 + r() * (y1 - y0)];
    if (keep(p) && out.every((q) => dist(p, q) > 7)) out.push(p);
  }
  return out;
}
