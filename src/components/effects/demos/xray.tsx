"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import { useCopy } from "@/components/demos/use-copy";
import { Stage, clamp, useSize, useStagePointer } from "../engine";

/* The figure is drawn in a 200 × 420 box (plus margins) and scaled to fit. */
const VB = { x: -12, y: -8, w: 224, h: 436 };
const BONE = "#eaf1ff";
const DEEP = "#0b1633";

type Part =
  | "heart"
  | "brain"
  | "skull"
  | "stomach"
  | "liver"
  | "lungs"
  | "collarbone"
  | "spine"
  | "ribcage"
  | "pelvis"
  | "humerus"
  | "forearm"
  | "hand"
  | "femur"
  | "kneecap"
  | "shin"
  | "foot";

const copy = {
  en: {
    heart: "Heart",
    brain: "Brain",
    skull: "Skull",
    stomach: "Stomach",
    liver: "Liver",
    lungs: "Lungs",
    collarbone: "Collarbone",
    spine: "Spine",
    ribcage: "Ribcage",
    pelvis: "Pelvis",
    humerus: "Humerus",
    forearm: "Radius & ulna",
    hand: "Hand bones",
    femur: "Femur",
    kneecap: "Kneecap",
    shin: "Tibia & fibula",
    foot: "Foot bones",
  },
  th: {
    heart: "หัวใจ",
    brain: "สมอง",
    skull: "กะโหลกศีรษะ",
    stomach: "กระเพาะอาหาร",
    liver: "ตับ",
    lungs: "ปอด",
    collarbone: "กระดูกไหปลาร้า",
    spine: "กระดูกสันหลัง",
    ribcage: "ซี่โครง",
    pelvis: "กระดูกเชิงกราน",
    humerus: "กระดูกต้นแขน",
    forearm: "กระดูกปลายแขน",
    hand: "กระดูกมือ",
    femur: "กระดูกต้นขา",
    kneecap: "กระดูกสะบ้า",
    shin: "กระดูกหน้าแข้ง",
    foot: "กระดูกเท้า",
  },
  zh: {
    heart: "心脏",
    brain: "大脑",
    skull: "头骨",
    stomach: "胃",
    liver: "肝脏",
    lungs: "肺",
    collarbone: "锁骨",
    spine: "脊柱",
    ribcage: "胸廓",
    pelvis: "骨盆",
    humerus: "肱骨",
    forearm: "桡骨和尺骨",
    hand: "手骨",
    femur: "股骨",
    kneecap: "髌骨",
    shin: "胫骨和腓骨",
    foot: "足骨",
  },
  ja: {
    heart: "心臓",
    brain: "脳",
    skull: "頭蓋骨",
    stomach: "胃",
    liver: "肝臓",
    lungs: "肺",
    collarbone: "鎖骨",
    spine: "脊椎",
    ribcage: "胸郭",
    pelvis: "骨盤",
    humerus: "上腕骨",
    forearm: "橈骨と尺骨",
    hand: "手の骨",
    femur: "大腿骨",
    kneecap: "膝蓋骨",
    shin: "脛骨と腓骨",
    foot: "足の骨",
  },
};

const english = copy.en;

/* ---------- hit testing in figure coordinates ---------- */
const inEllipse = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) =>
  ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;

function nearSegment(x: number, y: number, ax: number, ay: number, bx: number, by: number, r: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy), 0, 1);
  return Math.hypot(x - (ax + t * dx), y - (ay + t * dy)) <= r;
}

function partAt(x: number, y: number): Part | null {
  const mx = x > 100 ? 200 - x : x; // mirror: one test covers both sides
  if (inEllipse(x, y, 108, 154, 13, 16)) return "heart";
  if (inEllipse(x, y, 100, 35, 17, 18)) return "brain";
  if (inEllipse(x, y, 100, 44, 24, 31)) return "skull";
  if (inEllipse(x, y, 115, 203, 14, 12)) return "stomach";
  if (inEllipse(x, y, 86, 195, 17, 11)) return "liver";
  if (nearSegment(mx, y, 98, 95, 63, 96, 5)) return "collarbone";
  if (inEllipse(mx, y, 82, 145, 14, 40)) return "lungs";
  if (x > 94 && x < 106 && y > 72 && y < 262) return "spine";
  if (x > 64 && x < 136 && y > 98 && y < 205) return "ribcage";
  if (inEllipse(x, y, 100, 246, 38, 20)) return "pelvis";
  if (nearSegment(mx, y, 62, 102, 49, 176, 9)) return "humerus";
  if (nearSegment(mx, y, 48, 182, 42, 248, 9)) return "forearm";
  if (inEllipse(mx, y, 39, 268, 14, 20)) return "hand";
  if (inEllipse(mx, y, 81, 336, 8, 8)) return "kneecap";
  if (nearSegment(mx, y, 86, 256, 81, 328, 11)) return "femur";
  if (nearSegment(mx, y, 81, 342, 81, 398, 11)) return "shin";
  if (inEllipse(mx, y, 80, 409, 13, 11)) return "foot";
  return null;
}

/* ---------- drawings ---------- */
function Silhouette({ outline }: { outline?: boolean }) {
  const extra = outline ? 3 : 0;
  const filled = { strokeWidth: extra };
  return (
    <g fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="100" cy="42" rx="24" ry="29" {...filled} />
      <rect x="89" y="62" width="22" height="34" rx="8" {...filled} />
      <path
        d="M58 100 Q62 88 80 86 L120 86 Q138 88 142 100 L138 168 Q134 196 136 222 Q138 248 124 260 L76 260 Q62 248 64 222 Q66 196 62 168 Z"
        {...filled}
      />
      <path d="M62 98 L47 178 L40 252" fill="none" strokeWidth={22 + extra} />
      <path d="M138 98 L153 178 L160 252" fill="none" strokeWidth={22 + extra} />
      <ellipse cx="38" cy="268" rx="11" ry="16" {...filled} />
      <ellipse cx="162" cy="268" rx="11" ry="16" {...filled} />
      <path d="M85 246 L82 330 L80 398" fill="none" strokeWidth={28 + extra} />
      <path d="M115 246 L118 330 L120 398" fill="none" strokeWidth={28 + extra} />
      <ellipse cx="78" cy="409" rx="14" ry="8" {...filled} />
      <ellipse cx="122" cy="409" rx="14" ry="8" {...filled} />
    </g>
  );
}

/** One side of the skeleton (the viewer’s left); mirrored for the other side. */
function Side() {
  const ribs = [22, 27, 31, 33, 33, 31, 27];
  return (
    <g>
      <path d="M96 106 C80 102 69 118 69 142 C69 164 75 184 92 188 C96 168 97 140 96 106 Z" fill="#ff8fa8" opacity="0.5" />
      <g stroke={BONE} fill="none" strokeLinecap="round">
        {ribs.map((w, i) => {
          const y = 104 + i * 12.5;
          return <path key={i} d={`M97 ${y} C ${100 - w * 0.55} ${y - 6}, ${100 - w - 2} ${y + 1}, ${100 - w + 1} ${y + 15}`} strokeWidth="2.4" />;
        })}
        <path d="M98 95 Q80 89 63 96" strokeWidth="3.2" />
        <line x1="62" y1="102" x2="49" y2="176" strokeWidth="6.5" />
        <line x1="47" y1="182" x2="40" y2="247" strokeWidth="3" />
        <line x1="52" y1="183" x2="45" y2="248" strokeWidth="3" />
        <path d="M40 258 L31 280 M40 258 L36 284 M41 258 L41 285 M42 258 L46 282 M45 255 L52 268" strokeWidth="2.2" />
        <path d="M100 232 C 90 226, 72 224, 66 238 C 63 250, 70 262, 84 263 C 90 263, 95 260, 99 258" strokeWidth="3.5" fill={BONE} fillOpacity="0.14" />
        <line x1="86" y1="258" x2="81" y2="328" strokeWidth="8" />
        <line x1="80" y1="343" x2="80" y2="398" strokeWidth="6.5" />
        <line x1="87" y1="345" x2="86" y2="396" strokeWidth="2.8" />
        <path d="M78 403 L72 415 M80 404 L79 418 M83 403 L87 415" strokeWidth="2.4" />
      </g>
      <g fill={BONE}>
        <circle cx="62" cy="101" r="5" />
        <circle cx="49" cy="178" r="4.5" />
        <circle cx="41" cy="255" r="4" />
        <circle cx="86" cy="254" r="5.5" />
        <circle cx="81" cy="336" r="5" />
        <circle cx="80" cy="400" r="3.5" />
      </g>
      <path d="M70 188 C 82 181, 104 184, 105 194 C 99 205, 80 207, 70 199 Z" fill="#c9705a" opacity="0.85" />
    </g>
  );
}

function Skeleton() {
  return (
    <g style={{ filter: "drop-shadow(0 0 2px rgb(170 200 255 / 0.55))" }}>
      <ellipse cx="100" cy="36" rx="17" ry="19" fill="#f29bbb" opacity="0.85" />
      <path d="M87 30 q4 -6 8 0 t8 0 t8 0 M85 38 q5 -5 9 0 t9 0 t9 0 M89 45 q4 -4 8 0 t8 0 t6 0" stroke="#b9507c" strokeWidth="1.2" fill="none" />
      <Side />
      <g transform="matrix(-1 0 0 1 200 0)">
        <Side />
      </g>
      <ellipse cx="100" cy="40" rx="22" ry="26" fill={BONE} fillOpacity="0.16" stroke={BONE} strokeWidth="2.5" />
      <ellipse cx="91" cy="47" rx="5.5" ry="4.5" fill={DEEP} stroke={BONE} strokeWidth="1.5" />
      <ellipse cx="109" cy="47" rx="5.5" ry="4.5" fill={DEEP} stroke={BONE} strokeWidth="1.5" />
      <path d="M100 52 l-3 7 h6 z" fill={DEEP} stroke={BONE} strokeWidth="1" />
      <path d="M84 57 Q86 73 100 75 Q114 73 116 57" fill="none" stroke={BONE} strokeWidth="3" />
      <path d="M92 64 h16" stroke={BONE} strokeWidth="3" strokeDasharray="1.6 1.2" />
      {Array.from({ length: 18 }, (_, i) => (
        <rect key={i} x="95" y={76 + i * 9.4} width="10" height="7" rx="2.5" fill={BONE} />
      ))}
      <path d="M94 246 L106 246 L102 264 L98 264 Z" fill={BONE} />
      <rect x="97" y="98" width="6" height="62" rx="3" fill={BONE} fillOpacity="0.9" />
      <path d="M107 139 C 117 131, 130 141, 121 156 L 107 171 L 95 156 C 89 145, 99 134, 107 139 Z" fill="#ff4d6d" />
      <path d="M108 192 C 124 186, 131 201, 123 213 C 117 221, 102 220, 100 211 C 104 207, 113 206, 113 199 Z" fill="#ffb36b" opacity="0.9" />
    </g>
  );
}

function fit(w: number, h: number) {
  const scale = Math.min(w / VB.w, h / VB.h);
  const offX = (w - VB.w * scale) / 2 - VB.x * scale;
  const offY = (h - VB.h * scale) / 2 - VB.y * scale;
  return { scale, offX, offY };
}

export default function XRay() {
  const t = useCopy(copy);
  const { locale } = useI18n();
  const stageRef = useRef<HTMLDivElement>(null);
  const size = useSize(stageRef);
  const [part, setPart] = useState<Part | null>("heart");
  const [labelBelow, setLabelBelow] = useState(false);
  const geometry = fit(size.w || 1, size.h || 1);
  const radius = clamp(75 * geometry.scale, 34, 92);

  const place = (x: number, y: number) => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--lx", `${x}px`);
    el.style.setProperty("--ly", `${y}px`);
    const g = fit(el.clientWidth, el.clientHeight);
    setPart(partAt((x - g.offX) / g.scale, (y - g.offY) / g.scale));
    setLabelBelow(y < clamp(75 * g.scale, 34, 92) + 44);
  };

  // rest the lens on the heart until someone moves it
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !size.w) return;
    const g = fit(size.w, size.h);
    el.style.setProperty("--lx", `${g.offX + 108 * g.scale}px`);
    el.style.setProperty("--ly", `${g.offY + 152 * g.scale}px`);
  }, [size.w, size.h]);

  useStagePointer(stageRef, { onMove: (p) => place(p.x, p.y), onDown: (p) => place(p.x, p.y) }, { step: 18 });

  const label = part ? (locale === "en" ? english[part] : `${english[part]} · ${t[part]}`) : null;
  const vb = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;
  const lens = `radial-gradient(circle ${radius}px at var(--lx, -999px) var(--ly, -999px), transparent 97%, #000 100%)`;

  return (
    <Stage ref={stageRef} className="cursor-none bg-surface-2" style={{ ["--lr" as string]: `${radius}px` }}>
      {/* inside: the X-ray */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#17295a,#070d1f_75%)]">
        <svg viewBox={vb} className="size-full" preserveAspectRatio="xMidYMid meet">
          <g className="text-[#1b3263]">
            <Silhouette />
          </g>
          <Skeleton />
        </svg>
      </div>
      {/* outside: the body, with a hole where the lens is */}
      <div aria-hidden className="demo-canvas absolute inset-0" style={{ maskImage: lens, WebkitMaskImage: lens }}>
        <svg viewBox={vb} className="size-full" preserveAspectRatio="xMidYMid meet">
          <g className="text-[#8f99c4] dark:text-[#59628f]">
            <Silhouette outline />
          </g>
          <g className="text-[#c9cfe8] dark:text-[#363d5e]">
            <Silhouette />
          </g>
        </svg>
      </div>
      {/* the lens ring, handle and label */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0"
        style={{ transform: "translate(var(--lx, -999px), var(--ly, -999px))" }}
      >
        <span
          className="absolute rounded-full border-2 border-white/90 shadow-[0_0_0_1px_rgb(0_0_0/0.35),inset_0_0_18px_rgb(140_190_255/0.35)]"
          style={{ width: radius * 2, height: radius * 2, left: -radius, top: -radius }}
        />
        <span
          className="absolute h-2.5 origin-left rounded-full bg-white/90 shadow-[0_0_0_1px_rgb(0_0_0/0.35)]"
          style={{ width: radius * 0.7, left: radius * 0.68, top: radius * 0.68, transform: "rotate(45deg)" }}
        />
        {label ? (
          <span
            className="absolute rounded-full border border-white/15 bg-[#0b1633] px-2.5 py-1 text-[0.75rem] font-semibold whitespace-nowrap text-white shadow-lg"
            style={{ left: radius * 0.2, top: labelBelow ? radius + 8 : -radius - 30 }}
          >
            {label}
          </span>
        ) : null}
      </div>
      <span className="sr-only" aria-live="polite">
        {label ?? ""}
      </span>
    </Stage>
  );
}
