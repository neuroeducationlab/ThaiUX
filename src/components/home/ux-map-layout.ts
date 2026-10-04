import type { Category } from "@/content/types";

/**
 * Geometry for the hero’s mind map: four category hubs around the centre
 * button, each concept on an arc beyond its hub, then a relaxation pass
 * that pushes overlapping labels apart and keeps everything on the stage.
 * Measured sizes go in, so it works for any stage, language or label set.
 */
export type Pt = { x: number; y: number };
export type Box = { w: number; h: number };

/** Hub order is reading order: top-left, top-right, bottom-left, bottom-right. */
export const CATS: Category[] = ["interaction", "component", "principle", "state"];
const DIRS: [number, number][] = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];

export type LayoutInput = {
  stage: Box;
  button: Box;
  hubs: Box[];
  leaves: { box: Box; cat: number }[];
};

export type Layout = { center: Pt; hubs: Pt[]; leaves: Pt[] };

export function computeLayout(input: LayoutInput): Layout {
  return input.stage.h > input.stage.w * 1.05 ? stacked(input) : radial(input);
}

/**
 * Phones: two groups above the button and two below, each its hub followed
 * by its concepts in centred rows — still a map around the button, but
 * tidy enough to read on a narrow screen, and overlap-free by construction.
 */
function stacked({ stage, button, hubs, leaves }: LayoutInput): Layout {
  const pad = 8;
  const gx = 5;
  const gy = 7;
  const blockGap = 16;
  const center = { x: stage.w / 2, y: stage.h / 2 };
  const maxW = stage.w - pad * 2;
  type Part = { hub: boolean; i: number; b: Box };
  const blocks = CATS.map((_, c) => {
    const parts: Part[] = [{ hub: true, i: c, b: hubs[c] }, ...leaves.flatMap((l, i) => (l.cat === c ? [{ hub: false, i, b: l.box }] : []))];
    const rows: Part[][] = [[]];
    let w = 0;
    for (const p of parts) {
      const row = rows[rows.length - 1];
      if (row.length && w + gx + p.b.w > maxW) {
        rows.push([p]);
        w = p.b.w;
      } else {
        w += (row.length ? gx : 0) + p.b.w;
        row.push(p);
      }
    }
    const rowH = rows.map((r) => Math.max(...r.map((p) => p.b.h)));
    return { rows, rowH, h: rowH.reduce((a, b) => a + b, 0) + gy * (rows.length - 1) };
  });
  const hubPts: Pt[] = CATS.map(() => ({ ...center }));
  const leafPts: Pt[] = leaves.map(() => ({ ...center }));
  const place = (b: (typeof blocks)[number], top: number) => {
    let y = top;
    b.rows.forEach((row, r) => {
      const total = row.reduce((a, p) => a + p.b.w, 0) + gx * (row.length - 1);
      let x = center.x - total / 2;
      for (const p of row) {
        const pt = { x: x + p.b.w / 2, y: y + b.rowH[r] / 2 };
        if (p.hub) hubPts[p.i] = pt;
        else leafPts[p.i] = pt;
        x += p.b.w + gx;
      }
      y += b.rowH[r] + gy;
    });
  };
  const [inter, comp, prin, states] = blocks;
  const above = center.y - button.h / 2 - 18;
  const below = center.y + button.h / 2 + 18;
  const upH = inter.h + blockGap + comp.h;
  const downH = prin.h + blockGap + states.h;
  const upTop = Math.max(pad, pad + (above - pad - upH) / 2);
  const downTop = Math.min(stage.h - pad - downH, below + (stage.h - pad - below - downH) / 2);
  place(inter, upTop);
  place(comp, upTop + inter.h + blockGap);
  place(prin, downTop);
  place(states, downTop + prin.h + blockGap);
  return { center, hubs: hubPts, leaves: leafPts };
}

/** Wider stages: hubs on the diagonals, concepts on arcs beyond them, then relaxed. */
function radial({ stage, button, hubs, leaves }: LayoutInput): Layout {
  const narrow = stage.w < 520;
  const portrait = stage.h > stage.w * 1.05;
  const center = { x: stage.w / 2, y: stage.h / 2 };
  const hx = stage.w * (narrow ? 0.2 : 0.19);
  const hy = stage.h * (narrow ? 0.21 : 0.2);
  const hubPts = DIRS.map(([dx, dy]) => ({ x: center.x + dx * hx, y: center.y + dy * hy }));

  // Concepts fan out on an arc beyond their hub, alternating two radii
  const byCat: number[][] = [[], [], [], []];
  leaves.forEach((l, i) => byCat[l.cat].push(i));
  const leafPts: Pt[] = leaves.map(() => ({ ...center }));
  const r = Math.min(stage.w, stage.h) * (narrow ? 0.24 : 0.25);
  byCat.forEach((idx, c) => {
    const [dx, dy] = DIRS[c];
    const base = Math.atan2(dy, dx);
    const spread = Math.min(Math.PI * 0.9, (idx.length - 1) * 0.36);
    idx.forEach((li, k) => {
      const t = idx.length === 1 ? 0 : k / (idx.length - 1) - 0.5;
      const a = base + t * spread;
      const rr = r + (k % 2 ? 26 : 0);
      leafPts[li] = { x: hubPts[c].x + Math.cos(a) * rr * 1.25, y: hubPts[c].y + Math.sin(a) * rr * 0.8 };
    });
  });

  // Relax: springs to the anchors, push apart on overlap, stay inside the stage
  type Item = { p: Pt; a: Pt; b: Box; m: number };
  const items: Item[] = [
    { p: { ...center }, a: center, b: { w: button.w + 28, h: button.h + 22 }, m: 0 }, // the button never moves
    ...hubPts.map((p, i) => ({ p: { ...p }, a: p, b: hubs[i], m: 0.5 })),
    ...leafPts.map((p, i) => ({ p: { ...p }, a: p, b: leaves[i].box, m: 1 })),
  ];
  const gap = narrow ? 5 : 8;
  const pad = 8;
  // 260 rounds pulled toward the anchors, then 160 that only separate what still overlaps
  for (let it = 0; it < 420; it++) {
    const pull = it < 260 ? 0.03 : 0;
    for (const o of items) {
      if (!o.m || !pull) continue;
      o.p.x += (o.a.x - o.p.x) * pull;
      o.p.y += (o.a.y - o.p.y) * pull;
    }
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const A = items[i];
        const B = items[j];
        if (!A.m && !B.m) continue;
        const dx = B.p.x - A.p.x;
        const dy = B.p.y - A.p.y;
        const ox = (A.b.w + B.b.w) / 2 + gap - Math.abs(dx);
        const oy = (A.b.h + B.b.h) / 2 + gap - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        const total = A.m + B.m;
        // push along the axis that needs the smaller move; labels are wide, so vertical
        // moves are cheaper — and on a narrow stage there is more room up and down
        if (ox < oy * (portrait ? 0.7 : 1.6)) {
          const s = (dx >= 0 ? 1 : -1) * ox;
          A.p.x -= (s * A.m) / total;
          B.p.x += (s * B.m) / total;
        } else {
          const s = (dy >= 0 ? 1 : -1) * oy;
          A.p.y -= (s * A.m) / total;
          B.p.y += (s * B.m) / total;
        }
      }
    }
    for (const o of items) {
      if (!o.m) continue;
      o.p.x = Math.min(stage.w - pad - o.b.w / 2, Math.max(pad + o.b.w / 2, o.p.x));
      o.p.y = Math.min(stage.h - pad - o.b.h / 2, Math.max(pad + o.b.h / 2, o.p.y));
    }
  }

  // Last resort: anything still touching walks out on a spiral to the nearest free spot
  const hits = (o: Item, others: Item[]) =>
    others.some(
      (q) => q !== o && Math.abs(q.p.x - o.p.x) < (q.b.w + o.b.w) / 2 + gap - 0.5 && Math.abs(q.p.y - o.p.y) < (q.b.h + o.b.h) / 2 + gap - 0.5,
    );
  const inside = (o: Item, p: Pt) =>
    p.x - o.b.w / 2 >= pad && p.x + o.b.w / 2 <= stage.w - pad && p.y - o.b.h / 2 >= pad && p.y + o.b.h / 2 <= stage.h - pad;
  const placed = items.slice(0, 5);
  // widest first, so the long labels claim room before the free space fragments
  for (const o of items.slice(5).sort((a, b) => b.b.w - a.b.w)) {
    if (hits(o, placed)) {
      const from = { ...o.p };
      search: for (let r = 4; r < Math.max(stage.w, stage.h); r += 4) {
        for (let k = 0; k < 24; k++) {
          const a = (k / 24) * Math.PI * 2;
          const p = { x: from.x + Math.cos(a) * r * 1.3, y: from.y + Math.sin(a) * r };
          if (!inside(o, p)) continue;
          o.p = p;
          if (!hits(o, placed)) break search;
        }
      }
      if (hits(o, placed)) o.p = from;
    }
    placed.push(o);
  }

  return {
    center,
    hubs: items.slice(1, 5).map((o) => o.p),
    leaves: items.slice(5).map((o) => o.p),
  };
}

/** A soft mind-map branch: leaves and arrives level, curving in between. */
export function branch(a: Pt, b: Pt): string {
  const mx = (a.x + b.x) / 2;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} C${mx.toFixed(1)} ${a.y.toFixed(1)} ${mx.toFixed(1)} ${b.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

/** The nearest point in a direction, for arrow-key travel across the map. */
export function nearestInDirection(points: Pt[], from: number, dir: Pt): number {
  const o = points[from];
  let best = from;
  let score = Infinity;
  points.forEach((p, i) => {
    if (i === from) return;
    const dx = p.x - o.x;
    const dy = p.y - o.y;
    const along = dx * dir.x + dy * dir.y;
    if (along <= 2) return;
    const across = Math.abs(dx * dir.y - dy * dir.x);
    const s = along + across * 2.2;
    if (s < score) {
      score = s;
      best = i;
    }
  });
  return best;
}
