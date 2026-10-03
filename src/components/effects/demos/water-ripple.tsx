"use client";

import { useEffect, useRef } from "react";
import { Stage, useEffectEnv, useRaf, useSize, useStagePointer } from "../engine";

/** Paint the pond that the water refracts: gradient, light, lily pads, a lotus and koi. */
function paintPond(w: number, h: number): ImageData {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  const s = Math.min(w, h);

  const water = g.createLinearGradient(0, 0, w, h);
  water.addColorStop(0, "#1a8c95");
  water.addColorStop(0.55, "#0f6177");
  water.addColorStop(1, "#0a3a57");
  g.fillStyle = water;
  g.fillRect(0, 0, w, h);

  // soft caustic light
  for (const [fx, fy, fr] of [
    [0.2, 0.25, 0.35],
    [0.75, 0.3, 0.3],
    [0.5, 0.8, 0.4],
  ] as const) {
    const light = g.createRadialGradient(fx * w, fy * h, 0, fx * w, fy * h, fr * s);
    light.addColorStop(0, "rgba(180, 245, 240, 0.28)");
    light.addColorStop(1, "rgba(180, 245, 240, 0)");
    g.fillStyle = light;
    g.fillRect(0, 0, w, h);
  }

  // pebbles on the bottom
  g.fillStyle = "rgba(4, 30, 45, 0.35)";
  for (const [fx, fy, fr] of [
    [0.1, 0.85, 0.035],
    [0.16, 0.9, 0.025],
    [0.88, 0.78, 0.03],
    [0.42, 0.12, 0.02],
    [0.62, 0.92, 0.028],
  ] as const) {
    g.beginPath();
    g.ellipse(fx * w, fy * h, fr * s * 1.4, fr * s, 0.4, 0, Math.PI * 2);
    g.fill();
  }

  // koi
  const koi = (fx: number, fy: number, angle: number, size: number) => {
    g.save();
    g.translate(fx * w, fy * h);
    g.rotate(angle);
    const l = size * s;
    g.fillStyle = "#ff8a3d";
    g.beginPath();
    g.ellipse(0, 0, l, l * 0.34, 0, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.moveTo(-l * 0.85, 0);
    g.lineTo(-l * 1.45, -l * 0.38);
    g.lineTo(-l * 1.3, 0);
    g.lineTo(-l * 1.45, l * 0.38);
    g.closePath();
    g.fill();
    g.fillStyle = "#fff4e6";
    g.beginPath();
    g.ellipse(l * 0.2, -l * 0.05, l * 0.32, l * 0.18, 0.3, 0, Math.PI * 2);
    g.fill();
    g.restore();
  };
  koi(0.3, 0.62, -0.5, 0.075);
  koi(0.68, 0.48, 2.6, 0.065);

  // lily pads
  const pad = (fx: number, fy: number, r: number, notch: number) => {
    const x = fx * w;
    const y = fy * h;
    const rr = r * s;
    g.fillStyle = "#3f9b57";
    g.beginPath();
    g.moveTo(x, y);
    g.arc(x, y, rr, notch + 0.35, notch + Math.PI * 2 - 0.35);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(205, 245, 190, 0.45)";
    g.lineWidth = Math.max(1, rr * 0.06);
    for (let i = 1; i < 7; i++) {
      const a = notch + 0.35 + (i * (Math.PI * 2 - 0.7)) / 7;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + Math.cos(a) * rr * 0.85, y + Math.sin(a) * rr * 0.85);
      g.stroke();
    }
  };
  pad(0.14, 0.3, 0.13, 0.4);
  pad(0.82, 0.74, 0.15, 3.6);
  pad(0.9, 0.18, 0.08, 2.2);

  // lotus
  const lx = 0.56 * w;
  const ly = 0.26 * h;
  const lr = 0.075 * s;
  for (let i = 0; i < 8; i++) {
    g.save();
    g.translate(lx, ly);
    g.rotate((i / 8) * Math.PI * 2);
    g.fillStyle = i % 2 ? "#ffb3cf" : "#ff8fb8";
    g.beginPath();
    g.ellipse(0, -lr * 0.7, lr * 0.38, lr * 0.75, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  g.fillStyle = "#ffd166";
  g.beginPath();
  g.arc(lx, ly, lr * 0.32, 0, Math.PI * 2);
  g.fill();

  return g.getImageData(0, 0, w, h);
}

/** Two-buffer height-map ripple (Hugo Elias), rendered by refracting the pond texture. */
function createPond(canvas: HTMLCanvasElement, w: number, h: number) {
  const ctx = canvas.getContext("2d")!;
  const texture = new Uint32Array(paintPond(w, h).data.buffer);
  const frame = ctx.createImageData(w, h);
  const out = new Uint32Array(frame.data.buffer);
  let cur = new Int16Array(w * h);
  let prev = new Int16Array(w * h);

  const disturb = (fx: number, fy: number, radius: number, strength: number) => {
    const cx = Math.round(fx * w);
    const cy = Math.round(fy * h);
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        if (x * x + y * y > radius * radius) continue;
        const px = cx + x;
        const py = cy + y;
        if (px < 1 || py < 1 || px >= w - 1 || py >= h - 1) continue;
        const i = py * w + px;
        cur[i] = Math.max(-30000, Math.min(30000, cur[i] + strength));
      }
    }
  };

  const step = () => {
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        let v = ((cur[i - 1] + cur[i + 1] + cur[i - w] + cur[i + w]) >> 1) - prev[i];
        v -= v >> 5;
        prev[i] = v;
      }
    }
    const t = cur;
    cur = prev;
    prev = t;
  };

  const render = () => {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const dx = x > 0 && x < w - 1 ? cur[i - 1] - cur[i + 1] : 0;
        const dy = y > 0 && y < h - 1 ? cur[i - w] - cur[i + w] : 0;
        let sx = x + (dx >> 5);
        let sy = y + (dy >> 5);
        if (sx < 0) sx = 0;
        else if (sx >= w) sx = w - 1;
        if (sy < 0) sy = 0;
        else if (sy >= h) sy = h - 1;
        const c = texture[sy * w + sx];
        const shade = dx >> 6;
        if (shade === 0) {
          out[i] = c;
        } else {
          const r = Math.min(255, Math.max(0, (c & 0xff) + shade));
          const gg = Math.min(255, Math.max(0, ((c >> 8) & 0xff) + shade));
          const b = Math.min(255, Math.max(0, ((c >> 16) & 0xff) + shade));
          out[i] = (c & 0xff000000) | (b << 16) | (gg << 8) | r;
        }
      }
    }
    ctx.putImageData(frame, 0, 0);
  };

  return { disturb, step, render };
}

export default function WaterRipple() {
  const env = useEffectEnv();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pond = useRef<ReturnType<typeof createPond> | null>(null);
  const idle = useRef(0);
  const size = useSize(stageRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size.w || !size.h) return;
    const scale = Math.min(1, Math.sqrt(110_000 / (size.w * size.h)));
    const w = Math.max(80, Math.round(size.w * scale));
    const h = Math.max(60, Math.round(size.h * scale));
    canvas.width = w;
    canvas.height = h;
    pond.current = createPond(canvas, w, h);
    pond.current.render();
  }, [size.w, size.h]);

  useStagePointer(stageRef, {
    onMove: (p) => {
      idle.current = 0;
      const speed = Math.min(1, Math.hypot(p.vx, p.vy) / 18);
      pond.current?.disturb(p.x / p.w, p.y / p.h, 2, 140 + speed * 420);
    },
    onDown: (p) => pond.current?.disturb(p.x / p.w, p.y / p.h, 4, 1500),
  });

  useRaf((dt) => {
    const sim = pond.current;
    if (!sim) return;
    idle.current += dt;
    // a raindrop now and then when nobody is playing, so the pond feels alive
    if (idle.current > 1200 && Math.random() < 0.035) sim.disturb(Math.random(), Math.random(), 2, 600);
    sim.step();
    sim.render();
  }, env.active);

  return (
    <Stage ref={stageRef} className="cursor-crosshair bg-[#0f6177]">
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
    </Stage>
  );
}
