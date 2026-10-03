"use client";

import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------
 * Environment every effect demo runs in.
 * `active` is true only while the demo is on screen AND effects are
 * allowed, so animation loops never run for nothing.
 * ---------------------------------------------------------------- */
export type EffectEnv = {
  id: string;
  /** Detail page: bigger stage that captures touch gestures. */
  full: boolean;
  /** Inside a horizontal rail: leave every pan to the browser so the rail can scroll. */
  rail?: boolean;
  /** Effects allowed (device preference or the person’s own choice). */
  motion: boolean;
  /** On screen and allowed to move. */
  active: boolean;
  /** Accessible name for focusable stages. */
  label: string;
  /** Call once the person has really played with the effect. */
  tried: () => void;
};

const EnvContext = createContext<EffectEnv>({
  id: "",
  full: false,
  motion: false,
  active: false,
  label: "",
  tried: () => {},
});

export const EffectEnvProvider = EnvContext.Provider;
export const useEffectEnv = () => useContext(EnvContext);

/* ------------------------------------------------------------------
 * Media queries
 * ---------------------------------------------------------------- */
function useMedia(query: string, serverValue: boolean) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)", false);
/** A mouse or trackpad (hover + precise pointing), not a finger. */
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)", true);

/* ------------------------------------------------------------------
 * Pointer inside a stage — mouse, pen, touch and keyboard.
 * Arrow keys move a virtual pointer (Shift = bigger steps), Enter or
 * Space press it, Escape leaves. Values live in a ref so 60 fps
 * updates never re-render React.
 * ---------------------------------------------------------------- */
export type Pointer = {
  x: number;
  y: number;
  inside: boolean;
  down: boolean;
  /** Smoothed velocity in px per 16 ms. */
  vx: number;
  vy: number;
  w: number;
  h: number;
  kind: string;
};

type PointerHandlers = {
  onMove?: (p: Pointer) => void;
  onDown?: (p: Pointer) => void;
  onUp?: (p: Pointer) => void;
  onLeave?: (p: Pointer) => void;
};

export const VIRTUAL_POINTER = "effects:virtual-pointer";

export function useStagePointer(
  ref: RefObject<HTMLElement | null>,
  handlers: PointerHandlers = {},
  { capture = false, step = 24 }: { capture?: boolean; step?: number } = {},
) {
  const pointer = useRef<Pointer>({ x: 0, y: 0, inside: false, down: false, vx: 0, vy: 0, w: 0, h: 0, kind: "mouse" });
  const { tried } = useEffectEnv();
  const move = useEffectEvent((p: Pointer) => handlers.onMove?.(p));
  const down = useEffectEvent((p: Pointer) => handlers.onDown?.(p));
  const up = useEffectEvent((p: Pointer) => handlers.onUp?.(p));
  const leave = useEffectEvent((p: Pointer) => handlers.onLeave?.(p));
  const markTried = useEffectEvent(() => tried());

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const p = pointer.current;
    let lastT = 0;
    let travel = 0;
    let counted = false;

    const engage = (distance: number) => {
      travel += distance;
      if (!counted && travel > 360) {
        counted = true;
        markTried();
      }
    };

    const virtual = (on: boolean) =>
      el.dispatchEvent(new CustomEvent(VIRTUAL_POINTER, { detail: { on, x: p.x, y: p.y } }));

    const locate = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      p.w = r.width;
      p.h = r.height;
      if (p.inside) {
        const dt = Math.max(1, e.timeStamp - lastT);
        const k = 16 / dt;
        p.vx = p.vx * 0.6 + (x - p.x) * k * 0.4;
        p.vy = p.vy * 0.6 + (y - p.y) * k * 0.4;
        engage(Math.hypot(x - p.x, y - p.y));
      } else {
        p.vx = 0;
        p.vy = 0;
      }
      lastT = e.timeStamp;
      p.x = x;
      p.y = y;
      p.kind = e.pointerType || "mouse";
    };

    const onPointerMove = (e: PointerEvent) => {
      const wasVirtual = p.kind === "key";
      locate(e);
      p.inside = true;
      if (wasVirtual) virtual(false);
      move(p);
    };
    const onPointerDown = (e: PointerEvent) => {
      locate(e);
      p.inside = true;
      p.down = true;
      if (capture) el.setPointerCapture(e.pointerId);
      if (!counted) {
        counted = true;
        markTried();
      }
      down(p);
    };
    const onPointerUp = () => {
      if (!p.down) return;
      p.down = false;
      up(p);
    };
    const onPointerLeave = () => {
      if (p.down && capture) return;
      p.inside = false;
      leave(p);
    };
    const onCancel = () => {
      p.down = false;
      p.inside = false;
      up(p);
      leave(p);
    };

    const keyboardStart = () => {
      const r = el.getBoundingClientRect();
      p.w = r.width;
      p.h = r.height;
      if (!p.inside || p.kind !== "key") {
        p.x = r.width / 2;
        p.y = r.height / 2;
      }
      p.vx = 0;
      p.vy = 0;
      p.inside = true;
      p.kind = "key";
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target !== el) return; // inner controls handle their own keys
      const big = e.shiftKey ? 3 : 1;
      const delta: Record<string, [number, number]> = {
        ArrowLeft: [-step * big, 0],
        ArrowRight: [step * big, 0],
        ArrowUp: [0, -step * big],
        ArrowDown: [0, step * big],
      };
      if (e.key in delta) {
        e.preventDefault();
        keyboardStart();
        const [dx, dy] = delta[e.key];
        const nx = Math.min(p.w - 4, Math.max(4, p.x + dx));
        const ny = Math.min(p.h - 4, Math.max(4, p.y + dy));
        p.vx = (nx - p.x) / 3;
        p.vy = (ny - p.y) / 3;
        engage(Math.hypot(nx - p.x, ny - p.y) * 2);
        p.x = nx;
        p.y = ny;
        virtual(true);
        move(p);
      } else if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
        e.preventDefault();
        keyboardStart();
        virtual(true);
        p.down = true;
        if (!counted) {
          counted = true;
          markTried();
        }
        down(p);
      } else if (e.key === "Escape" && p.inside) {
        p.inside = false;
        virtual(false);
        leave(p);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.target !== el) return;
      if ((e.key === "Enter" || e.key === " ") && p.down) {
        p.down = false;
        up(p);
      }
    };
    const onFocus = (e: FocusEvent) => {
      if (e.target !== el || !el.matches(":focus-visible")) return;
      keyboardStart();
      virtual(true);
      move(p);
    };
    const onBlur = (e: FocusEvent) => {
      if (e.target !== el || p.kind !== "key") return;
      p.inside = false;
      p.down = false;
      virtual(false);
      leave(p);
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointerleave", onPointerLeave);
    el.addEventListener("pointercancel", onCancel);
    el.addEventListener("keydown", onKeyDown);
    el.addEventListener("keyup", onKeyUp);
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);
    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.removeEventListener("pointercancel", onCancel);
      el.removeEventListener("keydown", onKeyDown);
      el.removeEventListener("keyup", onKeyUp);
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
    };
  }, [ref, capture, step]);

  return pointer;
}

/* ------------------------------------------------------------------
 * requestAnimationFrame loop that only runs while `running`.
 * dt is in milliseconds, capped so a stalled tab doesn't explode physics.
 * ---------------------------------------------------------------- */
export function useRaf(callback: (dt: number, now: number) => void, running: boolean) {
  const tick = useEffectEvent(callback);
  useEffect(() => {
    if (!running) return;
    let id = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      tick(dt, now);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [running]);
}

/** Element size in CSS pixels, kept up to date with a ResizeObserver. */
export function useSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/* ------------------------------------------------------------------
 * Stage — the box every demo plays in.
 * Focusable stages get an accessible name and keyboard control via
 * useStagePointer; a small ring shows where the virtual pointer is.
 * Demos built from real controls (buttons, sliders) pass focusable={false}.
 * ---------------------------------------------------------------- */
export function Stage({
  ref,
  focusable = true,
  className,
  style,
  children,
}: {
  ref?: RefObject<HTMLDivElement | null>;
  focusable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const env = useEffectEnv();
  const ghost = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref?.current;
    if (!el || !focusable) return;
    const onVirtual = (e: Event) => {
      const { on, x, y } = (e as CustomEvent<{ on: boolean; x: number; y: number }>).detail;
      const g = ghost.current;
      if (!g) return;
      g.style.opacity = on ? "1" : "0";
      g.style.transform = `translate(${x}px, ${y}px)`;
    };
    el.addEventListener(VIRTUAL_POINTER, onVirtual);
    return () => el.removeEventListener(VIRTUAL_POINTER, onVirtual);
  }, [ref, focusable]);

  return (
    <div
      ref={ref}
      role={focusable ? "group" : undefined}
      aria-label={focusable ? env.label : undefined}
      tabIndex={focusable && env.motion ? 0 : undefined}
      inert={!env.motion}
      className={cn(
        "relative size-full overflow-hidden outline-none select-none [-webkit-tap-highlight-color:transparent]",
        env.full ? "touch-none" : env.rail ? "touch-auto" : "touch-pan-y",
        focusable && "focus-visible:shadow-[inset_0_0_0_3px_var(--focus)]",
        className,
      )}
      style={style}
    >
      {children}
      {focusable ? (
        <span
          ref={ghost}
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 z-50 -mt-3 -ml-3 size-6 rounded-full border-2 border-white opacity-0 shadow-[0_0_0_2px_rgb(0_0_0/0.5)] transition-opacity"
        />
      ) : null}
    </div>
  );
}
