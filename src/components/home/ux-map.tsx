"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, CircleCheck, FlaskConical, GraduationCap, Play, Sparkles, Square, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { format } from "@/i18n/localized";
import { Switch } from "@/components/ui/controls";
import { progress, useHydrated, useProgress } from "@/components/progress/store";
import { DemoProvider } from "@/components/demos/demo-frame";
import { peeks, preloadPeek } from "@/components/peeks/registry";
import { PeekBoundary, PeekSkeleton } from "@/components/peeks/kit";
import type { Category, DemoId } from "@/content/types";
import { CATS, branch, computeLayout, nearestInDirection, type Pt } from "./ux-map-layout";

export type MapConcept = {
  id: string;
  term: string;
  /** Short local name (or another English name in English). */
  local: string;
  short: string;
  category: Category;
  demo: DemoId;
  /** What to try in the mini demo. */
  peek: string;
  href: string;
  related: string[];
  links: { kind: "module" | "lab" | "effect"; label: string; href: string }[];
};

export type MapLabels = {
  label: string;
  region: string;
  mapLabel: string;
  button: string;
  done: string;
  prompt: string;
  touchPrompt: string;
  progress: string;
  explain: Record<string, string>;
  milestone: string;
  localNames: string;
  showMe: string;
  stop: string;
  coach: string;
  more: string;
  tour: string[];
  try: string;
  lesson: string;
  related: string;
  back: string;
  close: string;
  experienced: string;
  notYet: string;
  youExperienced: string;
  categories: Record<Category, string>;
};

type Node = { x: number; y: number; vx: number; vy: number; ax: number; ay: number; w: number; h: number; f: number; ph: number; om: number };

const LINK_ICONS = { module: GraduationCap, lab: FlaskConical, effect: Sparkles } as const;
const CARD_W = 276;
const CALLOUT_MS = 2300;

function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * The homepage hero: a mind map of every concept on UXLab, grown from the
 * centre button by what you do. Point at it, press it, tab to it or drag
 * it, and the concept you just performed lights up with a short lesson;
 * open any word for its meaning, a mini demo and where to go next.
 * Lit words are your on-device progress, so the map remembers you.
 */
export function UxMap({ concepts, labels }: { concepts: MapConcept[]; labels: MapLabels }) {
  const state = useProgress();
  const hydrated = useHydrated();
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const coarse = useMedia("(hover: none)");
  const uid = useId();

  const lit = new Set(hydrated ? state.experienced : []);
  const count = concepts.filter((c) => lit.has(c.id)).length;
  const catOf = concepts.map((c) => CATS.indexOf(c.category));
  const indexOf = (id: string) => concepts.findIndex((c) => c.id === id);

  const [ready, setReady] = useState(false);
  const [localNames, setLocalNames] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [trying, setTrying] = useState(false);
  const [cardPos, setCardPos] = useState<{ left: number; sheet: boolean } | null>(null);
  const [tip, setTip] = useState<{ i: number; left: number; y: number; below: boolean } | null>(null);
  const [callout, setCallout] = useState<{ id: string; term: string; text: string; left: number; y: number; below: boolean; key: number } | null>(null);
  const [focusIdx, setFocusIdx] = useState(0);
  const [doneFlash, setDoneFlash] = useState(false);
  const [milestone, setMilestone] = useState<number | null>(null);
  const [announce, setAnnounce] = useState("");
  const [tour, setTour] = useState<number | null>(null);
  const [ghost, setGhost] = useState<{ x: number; y: number; press: boolean; bubble?: string } | null>(null);
  const [demoBtn, setDemoBtn] = useState<"hover" | "active" | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hubEls = useRef<(HTMLDivElement | null)[]>([]);
  const leafEls = useRef<(HTMLButtonElement | null)[]>([]);
  const hubEdges = useRef<(SVGPathElement | null)[]>([]);
  const leafEdges = useRef<(SVGPathElement | null)[]>([]);
  const relEdges = useRef<(SVGPathElement | null)[]>([]);
  const pulseDots = useRef<(SVGCircleElement | null)[]>([]);
  const wake = useRef<() => void>(() => {});
  const timers = useRef<number[]>([]);
  const ui = useRef({
    seen: new Set<string>(),
    queue: [] as string[],
    showing: false,
    lit: new Set<string>(),
    press: null as null | { x: number; y: number; moved: boolean },
    nodePress: null as null | { i: number; x: number; y: number; sx: number; sy: number; moved: boolean },
    skipClick: false,
    skipNode: -1,
    tipTimer: 0,
    calloutTimer: 0,
    touring: false,
    coached: false,
    seq: 0,
  });
  const sim = useRef({
    W: 0,
    H: 0,
    cx: 0,
    cy: 0,
    bx: 0,
    by: 0,
    bvx: 0,
    bvy: 0,
    bw: 0,
    bh: 0,
    drag: false,
    gx: 0,
    gy: 0,
    hubs: [] as Node[],
    leaves: [] as Node[],
    dragLeaf: -1,
    lgx: 0,
    lgy: 0,
    alive: false,
    reduced: false,
    focusLeaf: -1,
    related: [] as number[][],
    pulses: [] as { leaf: number; t0: number; dur: number }[],
    last: 0,
  });

  // Mirror what the frame loop needs from React
  useEffect(() => {
    sim.current.reduced = reduced;
    ui.current.lit = lit;
    sim.current.focusLeaf = selected ?? tip?.i ?? -1;
    wake.current();
  });

  // Who connects to whom (both ways), for the related lines and the drag pull
  useEffect(() => {
    const idx = new Map(concepts.map((c, i) => [c.id, i]));
    const rel = concepts.map(() => new Set<number>());
    concepts.forEach((c, i) =>
      c.related.forEach((id) => {
        const j = idx.get(id);
        if (j === undefined) return;
        rel[i].add(j);
        rel[j].add(i);
      }),
    );
    sim.current.related = rel.map((s) => [...s]);
  }, [concepts]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => {
    const t = timers.current;
    const u = ui.current;
    return () => {
      t.forEach(window.clearTimeout);
      window.clearTimeout(u.tipTimer);
      window.clearTimeout(u.calloutTimer);
    };
  }, []);

  /* ---------- layout: measure, place, and re-place on resize ---------- */
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const btn = btnRef.current;
    if (!stage || !btn) return;
    const measure = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      if (!W || !H) return;
      const s = sim.current;
      const box = (el: HTMLElement | null, w: number, h: number) => ({ w: el?.offsetWidth || w, h: el?.offsetHeight || h });
      const L = computeLayout({
        stage: { w: W, h: H },
        button: { w: btn.offsetWidth, h: btn.offsetHeight },
        hubs: CATS.map((_, i) => box(hubEls.current[i], 90, 22)),
        leaves: concepts.map((_, i) => ({ box: box(leafEls.current[i], 80, 28), cat: catOf[i] })),
      });
      const first = s.hubs.length === 0;
      const make = (p: Pt, el: HTMLElement | null, prev: Node | undefined, i: number, f: number): Node => ({
        // the first time, everything starts tucked behind the button and springs out
        x: prev ? prev.x : L.center.x + Math.sin(i * 2.3) * 4,
        y: prev ? prev.y : L.center.y + Math.cos(i * 1.7) * 4,
        vx: prev?.vx ?? 0,
        vy: prev?.vy ?? 0,
        ax: p.x,
        ay: p.y,
        w: el?.offsetWidth || 80,
        h: el?.offsetHeight || 26,
        f,
        ph: i * 1.618,
        om: 0.7 + ((i * 37) % 11) / 20,
      });
      s.W = W;
      s.H = H;
      s.cx = L.center.x;
      s.cy = L.center.y;
      s.bw = btn.offsetWidth;
      s.bh = btn.offsetHeight;
      s.hubs = L.hubs.map((p, i) => make(p, hubEls.current[i], first ? undefined : s.hubs[i], i, 0.86));
      s.leaves = L.leaves.map((p, i) => make(p, leafEls.current[i], first ? undefined : s.leaves[i], i + 4, 0.58 + ((i * 7) % 5) * 0.04));
      if (first && s.reduced) {
        for (const n of [...s.hubs, ...s.leaves]) {
          n.x = n.ax;
          n.y = n.ay;
        }
      }
      wake.current();
    };
    measure();
    // labels change size when web fonts arrive (Thai especially), so watch them too
    let frame = 0;
    const soon = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(soon);
    ro.observe(stage);
    for (const el of [...hubEls.current, ...leafEls.current, btn]) if (el) ro.observe(el);
    document.fonts?.ready.then(soon);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
    // catOf is derived from concepts; re-measure when labels change language
  }, [concepts, localNames]); // eslint-disable-line react-hooks/exhaustive-deps

  // Grow the map the first time it comes into view
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setReady(true);
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  // …and burst out of the button at that moment
  useEffect(() => {
    if (!ready) return;
    const s = sim.current;
    if (!s.reduced) {
      for (const n of [...s.hubs, ...s.leaves]) {
        n.x = s.cx + (n.ax - s.cx) * 0.06;
        n.y = s.cy + (n.ay - s.cy) * 0.06;
        n.vx = n.vy = 0;
      }
    }
    wake.current();
  }, [ready]);

  /* ---------- the frame loop (sleeps when nothing moves) ---------- */
  useEffect(() => {
    let id = 0;
    const step = (now: number) => {
      const s = sim.current;
      const dt = Math.min(48, s.last ? now - s.last : 16.7);
      s.last = now;
      const k = dt / 16.7;
      const damp = Math.pow(0.78, k);
      let energy = 0;

      // the centre button: follows the pointer while dragged, springs home after
      if (s.drag) {
        s.bx = s.gx;
        s.by = s.gy;
        s.bvx = s.bvy = 0;
      } else if (s.reduced) {
        s.bx = s.by = 0;
      } else {
        s.bvx = (s.bvx + -s.bx * 0.14 * k) * damp;
        s.bvy = (s.bvy + -s.by * 0.14 * k) * damp;
        s.bx += s.bvx * k;
        s.by += s.bvy * k;
        if (Math.abs(s.bx) + Math.abs(s.by) + Math.abs(s.bvx) + Math.abs(s.bvy) < 0.05) s.bx = s.by = s.bvx = s.bvy = 0;
      }
      energy += Math.abs(s.bx) + Math.abs(s.by);
      const ox = s.reduced ? 0 : s.bx;
      const oy = s.reduced ? 0 : s.by;
      const t = now / 1000;
      const drift = s.alive && !s.reduced ? 2 : 0;
      const dragged = s.dragLeaf >= 0 ? s.leaves[s.dragLeaf] : null;
      const pulled = dragged ? new Set(s.related[s.dragLeaf] ?? []) : null;

      const move = (n: Node, leaf: number) => {
        if (leaf >= 0 && leaf === s.dragLeaf) {
          n.x = s.lgx;
          n.y = s.lgy;
          n.vx = n.vy = 0;
          return;
        }
        let tx = n.ax + ox * n.f;
        let ty = n.ay + oy * n.f;
        if (drift) {
          tx += Math.sin(t * n.om + n.ph) * drift;
          ty += Math.cos(t * n.om * 0.83 + n.ph) * drift;
        }
        if (dragged && pulled?.has(leaf)) {
          tx += (dragged.x - dragged.ax) * 0.18;
          ty += (dragged.y - dragged.ay) * 0.18;
        }
        if (s.reduced) {
          n.x = tx;
          n.y = ty;
          return;
        }
        n.vx = (n.vx + (tx - n.x) * 0.12 * k) * damp;
        n.vy = (n.vy + (ty - n.y) * 0.12 * k) * damp;
        n.x += n.vx * k;
        n.y += n.vy * k;
        energy += Math.abs(n.vx) + Math.abs(n.vy) + (Math.abs(tx - n.x) + Math.abs(ty - n.y)) * 0.1;
      };
      s.hubs.forEach((n) => move(n, -1));
      s.leaves.forEach((n, i) => move(n, i));

      // paint
      btnRef.current?.style.setProperty("--dx", `${s.bx.toFixed(1)}px`);
      btnRef.current?.style.setProperty("--dy", `${s.by.toFixed(1)}px`);
      const place = (el: HTMLElement | null | undefined, n: Node) => {
        if (el) el.style.transform = `translate3d(${(n.x - n.w / 2).toFixed(1)}px, ${(n.y - n.h / 2).toFixed(1)}px, 0)`;
      };
      const C = { x: s.cx + s.bx, y: s.cy + s.by };
      s.hubs.forEach((n, i) => {
        place(hubEls.current[i], n);
        hubEdges.current[i]?.setAttribute("d", branch(C, n));
      });
      s.leaves.forEach((n, i) => {
        place(leafEls.current[i], n);
        const hub = s.hubs[CATS.indexOf(concepts[i].category)];
        if (hub) leafEdges.current[i]?.setAttribute("d", branch(hub, n));
      });

      // dashed lines to the concepts a focused word connects to
      const rel = s.focusLeaf >= 0 ? (s.related[s.focusLeaf] ?? []) : [];
      relEdges.current.forEach((el, j) => {
        if (!el) return;
        const to = rel[j];
        if (to === undefined || !s.leaves[to]) {
          el.setAttribute("d", "");
          return;
        }
        const a = s.leaves[s.focusLeaf];
        const b = s.leaves[to];
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2 - Math.abs(a.x - b.x) * 0.12;
        el.setAttribute("d", `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
      });

      // a spark travels from the button, through the hub, to a word that just lit up
      s.pulses = s.pulses.filter((p) => now - p.t0 < p.dur);
      pulseDots.current.forEach((dot, j) => {
        if (!dot) return;
        const p = s.pulses[j];
        const hubEdge = p ? hubEdges.current[CATS.indexOf(concepts[p.leaf].category)] : null;
        const leafEdge = p ? leafEdges.current[p.leaf] : null;
        if (!p || !hubEdge || !leafEdge) {
          dot.setAttribute("opacity", "0");
          return;
        }
        const u = (now - p.t0) / p.dur;
        const path = u < 0.42 ? hubEdge : leafEdge;
        const v = u < 0.42 ? u / 0.42 : (u - 0.42) / 0.58;
        const len = path.getTotalLength();
        // the hub edge runs button → hub; the leaf edge runs hub → word
        const pt = path.getPointAtLength(len * v);
        dot.setAttribute("cx", pt.x.toFixed(1));
        dot.setAttribute("cy", pt.y.toFixed(1));
        dot.setAttribute("opacity", String(Math.min(1, (1 - u) * 3)));
      });

      if (energy > 0.03 || s.drag || s.dragLeaf >= 0 || drift || s.pulses.length) id = requestAnimationFrame(step);
      else {
        id = 0;
        s.last = 0;
      }
    };
    wake.current = () => {
      if (!id) id = requestAnimationFrame(step);
    };
    wake.current();
    return () => {
      cancelAnimationFrame(id);
      id = 0;
    };
  }, [concepts]);

  /* ---------- discovering by doing ---------- */
  const showNext = () => {
    const u = ui.current;
    if (u.showing) return;
    const id = u.queue.shift();
    if (!id) return;
    const i = indexOf(id);
    const n = sim.current.leaves[i];
    if (!n) return;
    u.showing = true;
    const below = n.y < 110;
    const left = Math.max(8, Math.min(sim.current.W - 256, n.x - 124));
    setCallout({ id, term: concepts[i].term, text: labels.explain[id] ?? concepts[i].short, left, y: below ? n.y + n.h / 2 + 10 : n.y - n.h / 2 - 10, below, key: ++u.seq });
    window.clearTimeout(u.calloutTimer);
    const end = () => {
      u.showing = false;
      setCallout(null);
      showNext();
    };
    // stay long enough to read, but hurry along when more lessons are waiting
    const tick = (shown: number) => {
      if (u.queue.length || shown >= CALLOUT_MS) end();
      else u.calloutTimer = window.setTimeout(() => tick(shown + 300), 300);
    };
    u.calloutTimer = window.setTimeout(() => tick(1100), 1100);
  };

  const pulse = (i: number, delay = 0) => {
    if (sim.current.reduced || i < 0) return;
    later(() => {
      sim.current.pulses.push({ leaf: i, t0: performance.now(), dur: 720 });
      wake.current();
      later(() => leafEls.current[i]?.animate([{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }], { duration: 420, easing: "cubic-bezier(.34,1.4,.64,1)", composite: "add" }), 700);
    }, delay);
  };

  const discover = (id: string, delay = 0) => {
    const u = ui.current;
    if (u.touring) return;
    const i = indexOf(id);
    if (i < 0) return;
    const fresh = !u.lit.has(id);
    progress.markExperienced(id);
    pulse(i, delay);
    if (fresh) {
      u.lit = new Set(u.lit).add(id);
      const n = concepts.filter((c) => u.lit.has(c.id)).length;
      if (n % 5 === 0 || n === concepts.length) {
        later(() => {
          setMilestone(n);
          if (id !== "success-state") discover("success-state", 600);
          later(() => setMilestone((m) => (m === n ? null : m)), 7000);
        }, delay + 900);
      }
    }
    if (!u.seen.has(id)) {
      u.seen.add(id);
      setAnnounce(`${format(labels.youExperienced, { term: concepts[i].term })} ${labels.explain[id] ?? ""}`);
      later(() => {
        u.queue.push(id);
        showNext();
      }, delay);
    }
  };

  /* ---------- the centre button ---------- */
  const releaseButton = () => {
    const p = ui.current.press;
    ui.current.press = null;
    if (!p?.moved) return;
    sim.current.drag = false;
    ui.current.skipClick = true;
    wake.current();
    discover("drag-and-drop");
  };

  /* ---------- words ---------- */
  const showTip = (i: number) => {
    const n = sim.current.leaves[i];
    if (!n || selected !== null) return;
    const below = n.y < 90;
    const left = Math.max(8, Math.min(sim.current.W - 248, n.x - 120));
    setTip({ i, left, y: below ? n.y + n.h / 2 + 8 : n.y - n.h / 2 - 8, below });
    window.clearTimeout(ui.current.tipTimer);
    ui.current.tipTimer = window.setTimeout(() => discover("tooltip"), 700);
  };
  const hideTip = () => {
    window.clearTimeout(ui.current.tipTimer);
    setTip(null);
  };

  const openCard = (i: number) => {
    const s = sim.current;
    const n = s.leaves[i];
    if (!n) return;
    hideTip();
    preloadPeek(concepts[i].demo);
    const sheet = s.W < 460;
    let left = n.x > s.W / 2 ? n.x - n.w / 2 - 12 - CARD_W : n.x + n.w / 2 + 12;
    left = Math.max(8, Math.min(s.W - CARD_W - 8, left));
    setCardPos({ left, sheet });
    setSelected(i);
    setTrying(false);
    setFocusIdx(i);
  };
  const closeCard = (refocus = true) => {
    const i = selected;
    setSelected(null);
    setTrying(false);
    if (refocus && i !== null) leafEls.current[i]?.focus({ preventScroll: true });
  };

  // focus into the card when it opens, and keep it inside the stage
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (selected === null || !card) return;
    const s = sim.current;
    if (!trying && cardPos && !cardPos.sheet) {
      // centre the card on its word, kept inside the stage (its height is only known now)
      const h = card.offsetHeight;
      const n = s.leaves[selected];
      card.style.top = `${Math.max(8, Math.min(s.H - 8 - h, (n?.y ?? s.H / 2) - h / 2))}px`;
    } else card.style.top = "";
    card.focus({ preventScroll: true });
  }, [selected, trying, cardPos]);

  const onNodeKey = (e: React.KeyboardEvent, i: number) => {
    const dirs: Record<string, Pt> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } };
    let next = -1;
    if (dirs[e.key]) next = nearestInDirection(sim.current.leaves, i, dirs[e.key]);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = concepts.length - 1;
    else if (e.key === "Escape" && tip) {
      e.preventDefault();
      hideTip();
      return;
    }
    if (next < 0) return;
    e.preventDefault();
    setFocusIdx(next);
    leafEls.current[next]?.focus({ preventScroll: true });
  };

  /* ---------- guided tour: a ghost pointer shows the moves ---------- */
  const stopTour = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    const u = ui.current;
    u.touring = false;
    u.showing = false;
    sim.current.drag = false;
    wake.current();
    setTour(null);
    setGhost(null);
    setDemoBtn(null);
    setCallout(null);
    hideTip();
    setSelected(null);
    setTrying(false);
  };

  const runTour = () => {
    const s = sim.current;
    if (!s.leaves.length) return;
    stopTour();
    const u = ui.current;
    u.touring = true;
    const B = { x: s.cx, y: s.cy + 6 };
    const target = Math.max(0, indexOf("affordance"));
    const tn = s.leaves[target];
    let t = 0;
    const at = (ms: number, fn: () => void) => {
      t += ms;
      later(fn, t);
    };
    setTour(0);
    setGhost({ x: s.W - 40, y: s.H - 30, press: false });
    at(80, () => setGhost({ x: B.x + 10, y: B.y, press: false }));
    at(760, () => {
      setDemoBtn("hover");
      pulse(indexOf("hover"));
    });
    at(1500, () => {
      setTour(1);
      setGhost({ x: B.x + 10, y: B.y, press: true });
      setDemoBtn("active");
      pulse(indexOf("active-state"));
    });
    at(380, () => {
      setGhost({ x: B.x + 10, y: B.y, press: false });
      setDemoBtn("hover");
      setDoneFlash(true);
      pulse(indexOf("click"));
      pulse(indexOf("feedback"), 300);
    });
    at(1500, () => {
      setDoneFlash(false);
      setTour(2);
      setGhost({ x: B.x + 10, y: B.y, press: true });
    });
    // drag the button left and down, then let go
    for (let f = 1; f <= 12; f++) {
      at(45, () => {
        s.drag = true;
        s.gx = (-90 * f) / 12;
        s.gy = (36 * f) / 12;
        setGhost({ x: B.x + 10 + s.gx, y: B.y + s.gy, press: true });
        wake.current();
      });
    }
    at(450, () => {
      s.drag = false;
      setGhost({ x: B.x + 10 - 90, y: B.y + 36, press: false });
      setDemoBtn(null);
      pulse(indexOf("drag-and-drop"));
      wake.current();
    });
    at(1500, () => {
      setTour(3);
      setGhost({ x: tn.x + 8, y: tn.y + 4, press: false });
    });
    at(750, () => showTip(target));
    at(1700, () => {
      setTour(4);
      setGhost({ x: tn.x + 8, y: tn.y + 4, press: true });
    });
    at(200, () => {
      setGhost({ x: tn.x + 8, y: tn.y + 4, press: false });
      openCard(target);
    });
    at(2600, () => {
      setSelected(null);
      setTour(5);
      setGhost({ x: B.x + 10, y: B.y + 40, press: false });
    });
    at(1900, () => stopTour());
  };

  // First visit: the ghost pointer glides to the button once, under five seconds
  useEffect(() => {
    if (!ready || reduced || !hydrated || state.experienced.length) return;
    const u = ui.current;
    if (u.coached) return;
    u.coached = true;
    try {
      if (sessionStorage.getItem("thaiux:map-coach")) return;
      sessionStorage.setItem("thaiux:map-coach", "1");
    } catch {
      /* storage blocked: coach anyway, once per page view */
    }
    const s = sim.current;
    const ids = [
      window.setTimeout(() => setGhost({ x: s.W - 36, y: s.H - 26, press: false }), 900),
      window.setTimeout(() => setGhost({ x: s.cx + 12, y: s.cy + 8, press: false, bubble: labels.coach }), 1000),
      window.setTimeout(() => setGhost((g) => (g && !ui.current.touring ? { ...g, press: true } : g)), 2100),
      window.setTimeout(() => setGhost((g) => (g && !ui.current.touring ? { ...g, press: false } : g)), 2350),
      window.setTimeout(() => setGhost((g) => (ui.current.touring ? g : null)), 3600),
    ];
    timers.current.push(...ids);
  }, [ready, reduced, hydrated, state.experienced.length, labels.coach]);

  const cancelCoach = () => {
    if (!ui.current.touring && ghost) setGhost(null);
  };

  const sel = selected !== null ? concepts[selected] : null;
  const focusRel = new Set(selected !== null ? concepts[selected].related : []);
  const tourCaption = tour !== null ? labels.tour[tour] : null;
  const Demo = sel ? peeks[sel.demo] : null;

  return (
    <div role="region" aria-label={labels.region} className="squircle relative overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-lg">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className="type-label flex items-center gap-2 text-accent-ink">
          <Sparkles className="size-4" aria-hidden /> {labels.label}
        </p>
        <div className="flex items-center gap-2.5">
          <span className="tabular text-[0.8125rem] font-medium text-ink-2">{format(labels.progress, { n: count, total: concepts.length })}</span>
          <span aria-hidden className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-surface-3 sm:block">
            <span className="block h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(count / concepts.length) * 100}%` }} />
          </span>
        </div>
      </div>

      <div
        ref={stageRef}
        data-ready={ready || undefined}
        className="ux-map-stage @container relative h-[31rem] touch-pan-y overflow-hidden select-none sm:h-[25rem]"
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          sim.current.alive = true;
          wake.current();
        }}
        onPointerLeave={() => {
          sim.current.alive = false;
        }}
        onPointerDown={() => {
          if (tour !== null) stopTour();
          else cancelCoach();
        }}
      >
        <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
          {CATS.map((c, i) => (
            <path
              key={c}
              ref={(el) => {
                hubEdges.current[i] = el;
              }}
              className="ux-edge ux-edge-hub"
              data-lit={concepts.some((x, j) => catOf[j] === i && lit.has(x.id)) || undefined}
            />
          ))}
          {concepts.map((c, i) => (
            <path
              key={c.id}
              ref={(el) => {
                leafEdges.current[i] = el;
              }}
              className="ux-edge"
              data-lit={lit.has(c.id) || undefined}
            />
          ))}
          {Array.from({ length: 8 }, (_, j) => (
            <path
              key={j}
              ref={(el) => {
                relEdges.current[j] = el;
              }}
              className="ux-edge-rel"
            />
          ))}
          {Array.from({ length: 4 }, (_, j) => (
            <circle
              key={j}
              ref={(el) => {
                pulseDots.current[j] = el;
              }}
              r="4.5"
              opacity="0"
              className="ux-pulse"
            />
          ))}
        </svg>

        {CATS.map((c, i) => {
          const total = catOf.filter((x) => x === i).length;
          const done = concepts.filter((x, j) => catOf[j] === i && lit.has(x.id)).length;
          return (
            <div
              key={c}
              ref={(el) => {
                hubEls.current[i] = el;
              }}
              aria-hidden
              className="ux-hub absolute top-0 left-0 inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-bg uppercase @max-md:gap-1 @max-md:px-2 @max-md:text-[0.625rem]"
            >
              {labels.categories[c]}
              <span className="tabular font-medium opacity-70">
                {done}/{total}
              </span>
            </div>
          );
        })}

        <div role="group" aria-label={labels.mapLabel} className="pointer-events-none absolute inset-0">
          {concepts.map((c, i) => {
            const on = lit.has(c.id);
            const focus = selected === i || (selected !== null && focusRel.has(c.id));
            return (
              <button
                key={c.id}
                ref={(el) => {
                  leafEls.current[i] = el;
                }}
                type="button"
                tabIndex={focusIdx === i ? 0 : -1}
                aria-haspopup="dialog"
                aria-expanded={selected === i}
                data-lit={on || undefined}
                data-focus={focus || undefined}
                onPointerDown={(e) => {
                  if (e.pointerType !== "mouse" || e.button !== 0) return;
                  const n = sim.current.leaves[i];
                  if (!n) return;
                  ui.current.nodePress = { i, x: e.clientX, y: e.clientY, sx: n.x, sy: n.y, moved: false };
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  const p = ui.current.nodePress;
                  if (!p || p.i !== i) return;
                  const dx = e.clientX - p.x;
                  const dy = e.clientY - p.y;
                  if (!p.moved && Math.hypot(dx, dy) > 6) {
                    p.moved = true;
                    sim.current.dragLeaf = i;
                    hideTip();
                  }
                  if (!p.moved) return;
                  const s = sim.current;
                  s.lgx = Math.max(10, Math.min(s.W - 10, p.sx + dx));
                  s.lgy = Math.max(10, Math.min(s.H - 10, p.sy + dy));
                  wake.current();
                }}
                onPointerUp={() => {
                  const p = ui.current.nodePress;
                  ui.current.nodePress = null;
                  if (!p?.moved) return;
                  sim.current.dragLeaf = -1;
                  ui.current.skipNode = i;
                  wake.current();
                  discover("drag-and-drop");
                }}
                onClick={() => {
                  if (ui.current.skipNode === i) {
                    ui.current.skipNode = -1;
                    return;
                  }
                  openCard(i);
                }}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse" && !ui.current.nodePress) showTip(i);
                }}
                onPointerLeave={hideTip}
                onFocus={() => {
                  setFocusIdx(i);
                  showTip(i);
                }}
                onBlur={hideTip}
                onKeyDown={(e) => onNodeKey(e, i)}
                className={cn(
                  "ux-leaf pointer-events-auto absolute top-0 left-0 inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[0.8125rem] leading-none font-medium whitespace-nowrap shadow-xs",
                  "@max-md:h-6 @max-md:gap-0.5 @max-md:px-2 @max-md:text-[0.75rem]",
                  "transition-[background-color,border-color,color,box-shadow,opacity] duration-300",
                  on ? "border-accent/40 bg-accent-soft text-accent-ink" : "border-line-strong bg-surface text-ink-2 hover:border-accent/50 hover:text-ink",
                  focus && "z-30",
                )}
              >
                {on ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : <span aria-hidden className="size-1.5 rounded-full bg-line-strong" />}
                <span lang={localNames ? undefined : "en"}>{localNames ? c.local : c.term}</span>
                <span className="sr-only">
                  {" "}
                  — {labels.categories[c.category]}, {on ? labels.experienced : labels.notYet}
                </span>
              </button>
            );
          })}
        </div>

        <button
          ref={btnRef}
          type="button"
          data-demo={demoBtn ?? undefined}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") discover("hover");
          }}
          onPointerDown={(e) => {
            discover("active-state");
            ui.current.press = { x: e.clientX, y: e.clientY, moved: false };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const p = ui.current.press;
            if (!p) return;
            const s = sim.current;
            const dx = e.clientX - p.x;
            const dy = e.clientY - p.y;
            if (!p.moved && Math.hypot(dx, dy) > 8) {
              p.moved = true;
              s.drag = true;
            }
            if (!p.moved) return;
            const mx = s.W / 2 - s.bw / 2 - 8;
            const my = s.H / 2 - s.bh / 2 - 8;
            s.gx = Math.max(-mx, Math.min(mx, dx));
            s.gy = Math.max(-my, Math.min(my, dy));
            wake.current();
          }}
          onPointerUp={releaseButton}
          onPointerCancel={releaseButton}
          onKeyDown={(e) => {
            if ((e.key === " " || e.key === "Enter") && !e.repeat) discover("active-state");
          }}
          onFocus={(e) => {
            if (e.currentTarget.matches(":focus-visible")) discover("focus-state");
          }}
          onClick={() => {
            if (ui.current.skipClick) {
              ui.current.skipClick = false;
              return;
            }
            discover("click");
            discover("feedback", 320);
            setDoneFlash(true);
            later(() => setDoneFlash(false), 1600);
          }}
          style={{ touchAction: "none" }}
          className={cn(
            "ux-center absolute top-1/2 left-1/2 z-20 inline-flex h-12 min-w-36 cursor-grab items-center justify-center gap-2 rounded-full px-6 text-[1rem] font-semibold shadow-md active:cursor-grabbing",
            "@max-md:h-11 @max-md:min-w-32 @max-md:px-5 @max-md:text-[0.9375rem]",
            "transition-[background-color,box-shadow,scale] duration-200 ease-out-soft",
            "focus-visible:outline-[3px] focus-visible:outline-offset-4",
            "active:scale-[0.96] motion-reduce:active:scale-100",
            doneFlash ? "bg-success text-white dark:text-[#0b1f14]" : "bg-accent text-on-accent hover:bg-accent-hover hover:shadow-lg active:bg-accent-press",
          )}
        >
          {doneFlash ? (
            <>
              <Check className="animate-pop size-5" strokeWidth={2.75} aria-hidden /> {labels.done}
            </>
          ) : (
            labels.button
          )}
        </button>

        {tip && !sel ? (
          <div
            aria-hidden
            className={cn("ux-tip pointer-events-none absolute z-40 w-max max-w-[15rem] rounded-[var(--radius-sm)] bg-ink px-3 py-2 text-[0.75rem] leading-snug text-bg shadow-lg", tip.below ? "" : "-translate-y-full")}
            style={{ left: tip.left, top: tip.y }}
          >
            <p className="line-clamp-3">{concepts[tip.i].short}</p>
            {coarse ? null : <p className="mt-1 font-semibold opacity-70">{labels.more} →</p>}
          </div>
        ) : null}

        {callout && !sel ? (
          <div
            key={callout.key}
            aria-hidden
            className={cn("ux-callout pointer-events-none absolute z-40 w-[15.5rem] rounded-[var(--radius-md)] border border-accent/30 bg-surface p-3 shadow-lg", callout.below ? "" : "-translate-y-full")}
            style={{ left: callout.left, top: callout.y }}
          >
            <p className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-success">
              <CircleCheck className="size-4 shrink-0" aria-hidden />
              <span lang="en">{callout.term}</span>
            </p>
            <p className="mt-1 text-[0.8125rem] leading-snug text-ink">{callout.text}</p>
          </div>
        ) : null}

        {ghost ? (
          <div
            aria-hidden
            className="ux-ghost pointer-events-none absolute top-0 left-0 z-50"
            style={{ transform: `translate(${ghost.x}px, ${ghost.y}px)`, transitionDuration: ghost.press ? "90ms" : undefined }}
          >
            <svg width="26" height="30" viewBox="0 0 26 30" className={cn("drop-shadow-md transition-transform duration-150", ghost.press && "scale-[0.82]")}>
              <path d="M3 2 L3 24 L9 18.5 L13 27.5 L17 25.8 L13.2 17 L21.5 17 Z" fill="var(--ink)" stroke="var(--bg)" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            {ghost.press ? <span className="ux-ripple absolute top-0 left-0 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent" /> : null}
            {ghost.bubble ? (
              <span className="animate-pop absolute top-7 left-5 rounded-full bg-ink px-2.5 py-1 text-[0.75rem] font-semibold whitespace-nowrap text-bg shadow-md">{ghost.bubble}</span>
            ) : null}
          </div>
        ) : null}

        {sel && cardPos ? (
          <>
            <div aria-hidden onClick={() => closeCard()} className="absolute inset-0 z-20 bg-surface/55 backdrop-blur-[1px]" />
            <div
              ref={cardRef}
              role="dialog"
              aria-labelledby={`${uid}-card`}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key !== "Escape" || e.defaultPrevented) return;
                e.preventDefault();
                if (trying) setTrying(false);
                else closeCard();
              }}
              className={cn(
                "animate-pop absolute z-40 flex flex-col rounded-[var(--radius-lg)] border border-line bg-surface shadow-lg outline-none",
                trying || cardPos.sheet ? "inset-2" : "max-h-[calc(100%-1rem)]",
              )}
              style={trying || cardPos.sheet ? undefined : { left: cardPos.left, width: CARD_W }}
            >
              <div className="flex items-start justify-between gap-2 px-4 pt-3">
                <div className="min-w-0">
                  <p className="text-[0.6875rem] font-semibold tracking-wide text-ink-2 uppercase">{labels.categories[sel.category]}</p>
                  <p id={`${uid}-card`} className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
                    <span lang="en" className="type-serif text-[1.625rem] leading-none text-ink">
                      {sel.term}
                    </span>
                    <span className="text-[0.8125rem] font-medium text-accent-ink">{sel.local}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center">
                  {trying ? (
                    <button type="button" onClick={() => setTrying(false)} aria-label={labels.back} className="inline-flex size-8 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink">
                      <ArrowLeft className="size-4" aria-hidden />
                    </button>
                  ) : null}
                  <button type="button" onClick={() => closeCard()} aria-label={labels.close} className="inline-flex size-8 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink">
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
              </div>

              {trying && Demo ? (
                <TryPanel key={sel.id} concept={sel} labels={labels} onExperienced={() => discover(sel.id)}>
                  <Demo />
                </TryPanel>
              ) : (
                <div className="min-h-0 overflow-y-auto px-4 pt-2 pb-4">
                  <p className="text-[0.875rem] leading-relaxed text-ink">{sel.short}</p>
                  <button
                    type="button"
                    onClick={() => setTrying(true)}
                    className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-[0.8125rem] font-semibold text-on-accent hover:bg-accent-hover"
                  >
                    <Play className="size-3 fill-current" aria-hidden /> {labels.try}
                  </button>
                  <ul className="mt-3 space-y-0.5 border-t border-line pt-2 text-[0.8125rem]">
                    <li>
                      <Link href={sel.href} className="flex items-center gap-2 rounded-[6px] px-1.5 py-1.5 font-semibold text-accent-ink hover:bg-accent-soft">
                        <BookOpen className="size-4 shrink-0" aria-hidden />
                        <span className="min-w-0 flex-1 truncate">{labels.lesson}</span>
                        <ArrowRight className="size-3.5 shrink-0" aria-hidden />
                      </Link>
                    </li>
                    {sel.links.map((l) => {
                      const Icon = LINK_ICONS[l.kind];
                      return (
                        <li key={l.kind}>
                          <Link href={l.href} className="flex items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-ink hover:bg-surface-2">
                            <Icon className="size-4 shrink-0 text-ink-2" aria-hidden />
                            <span className="min-w-0 flex-1 truncate">{l.label}</span>
                            <ArrowRight className="size-3.5 shrink-0 text-ink-3" aria-hidden />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  {sel.related.length ? (
                    <div className="mt-2">
                      <p className="text-[0.6875rem] font-semibold text-ink-2">{labels.related}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {sel.related.map((rid) => {
                          const j = indexOf(rid);
                          if (j < 0) return null;
                          return (
                            <button
                              key={rid}
                              type="button"
                              onClick={() => openCard(j)}
                              lang="en"
                              className="inline-flex h-7 items-center rounded-full border border-line-strong px-2.5 text-[0.75rem] font-medium text-ink-2 hover:border-accent/50 hover:text-ink"
                            >
                              {concepts[j].term}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line px-5 py-3">
        <p
          className={cn(
            "flex min-h-9 min-w-0 flex-1 basis-56 items-center gap-2 text-[0.875rem] leading-snug",
            tourCaption ? "font-semibold text-accent-ink" : milestone ? "font-semibold text-success" : "text-ink-2",
          )}
        >
          {tourCaption ? (
            <>
              <span className="tabular shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[0.75rem]">{(tour ?? 0) + 1}/6</span>
              <span key={tour} className="animate-fade-up">
                {tourCaption}
              </span>
            </>
          ) : milestone ? (
            <>
              <CircleCheck className="animate-pop size-5 shrink-0" aria-hidden /> {format(labels.milestone, { n: milestone })}
            </>
          ) : coarse ? (
            labels.touchPrompt
          ) : (
            labels.prompt
          )}
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <Switch
            className="gap-2 text-[0.8125rem]"
            label={labels.localNames}
            checked={localNames}
            onChange={(v) => {
              setLocalNames(v);
              discover("toggle");
            }}
          />
          <button
            type="button"
            onClick={() => (tour !== null ? stopTour() : runTour())}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-[0.8125rem] font-semibold text-ink transition-colors hover:border-accent/50 hover:bg-accent-soft hover:text-accent-ink"
          >
            {tour !== null ? <Square className="size-3 fill-current" aria-hidden /> : <Play className="size-3 fill-current" aria-hidden />}
            {tour !== null ? labels.stop : labels.showMe}
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

/** The card’s mini demo: the same card-sized demos the glossary uses. */
function TryPanel({ concept, labels, onExperienced, children }: { concept: MapConcept; labels: MapLabels; onExperienced: () => void; children: React.ReactNode }) {
  const [felt, setFelt] = useState(false);
  const marked = useRef(false);
  const report = useRef(onExperienced);
  useEffect(() => {
    report.current = onExperienced;
  });
  const experience = useCallback(() => {
    if (marked.current) return;
    marked.current = true;
    setFelt(true);
    report.current();
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col px-3 pt-2 pb-3">
      <div className="demo-canvas @container relative min-h-0 flex-1 overflow-hidden rounded-[var(--radius-md)] p-2.5">
        <PeekBoundary fallback={<p className="flex size-full items-center justify-center px-4 text-center text-[0.8125rem] text-ink-2">—</p>}>
          <Suspense fallback={<PeekSkeleton />}>
            <DemoProvider value={{ experience, experienced: felt }}>{children}</DemoProvider>
          </Suspense>
        </PeekBoundary>
      </div>
      <p role="status" className={cn("mt-2 flex min-h-6 items-center gap-1.5 px-1 text-[0.8125rem] leading-tight", felt ? "font-semibold text-success" : "text-ink-2")}>
        {felt ? (
          <>
            <CircleCheck className="animate-pop size-4 shrink-0" aria-hidden />
            {format(labels.youExperienced, { term: concept.term })}
          </>
        ) : (
          <>
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-accent" />
            {concept.peek}
          </>
        )}
      </p>
    </div>
  );
}
