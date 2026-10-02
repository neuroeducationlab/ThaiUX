"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

type Plane = "surface" | "skeleton" | "structure" | "scope" | "strategy";
const PLANES: Plane[] = ["surface", "skeleton", "structure", "scope", "strategy"];

const copy = {
  en: {
    names: { surface: "Surface", skeleton: "Skeleton", structure: "Structure", scope: "Scope", strategy: "Strategy" } as Record<Plane, string>,
    questions: {
      surface: "What does it look like?",
      skeleton: "Where does everything go?",
      structure: "How does it fit together?",
      scope: "What does it do?",
      strategy: "Why are we making it?",
    } as Record<Plane, string>,
    examples: {
      surface: "Colours, type and food photos; how the “Order” button looks.",
      skeleton: "Where the cart, the address and the “Order” button sit on screen.",
      structure: "The flow — browse → basket → checkout → track — and how the menu is organised.",
      scope: "Which features exist: scheduled orders, group orders, tips, dietary filters.",
      strategy: "Hungry people want food fast at a predictable cost; the business wants repeat orders.",
    } as Record<Plane, string>,
    concrete: "Concrete",
    abstract: "Abstract",
    ui: "the top two layers",
    ux: "all five layers",
    choose: "Choose a layer of the delivery app",
  },
  th: {
    names: { surface: "Surface · พื้นผิว", skeleton: "Skeleton · โครงร่าง", structure: "Structure · โครงสร้าง", scope: "Scope · ขอบเขต", strategy: "Strategy · กลยุทธ์" },
    questions: {
      surface: "หน้าตาเป็นอย่างไร?",
      skeleton: "อะไรวางอยู่ตรงไหน?",
      structure: "ทุกอย่างเชื่อมกันอย่างไร?",
      scope: "มันทำอะไรได้บ้าง?",
      strategy: "เราสร้างมันไปทำไม?",
    },
    examples: {
      surface: "สี ตัวอักษร รูปอาหาร และหน้าตาของปุ่ม “สั่งซื้อ”",
      skeleton: "ตะกร้า ที่อยู่ และปุ่ม “สั่งซื้อ” วางอยู่ตรงไหนบนหน้าจอ",
      structure: "ลำดับขั้นตอน ดูเมนู → ตะกร้า → ชำระเงิน → ติดตาม และการจัดหมวดเมนู",
      scope: "มีฟีเจอร์อะไรบ้าง เช่น สั่งล่วงหน้า สั่งเป็นกลุ่ม ให้ทิป กรองอาหารตามข้อจำกัด",
      strategy: "คนหิวอยากได้อาหารเร็วในราคาที่คาดเดาได้ ส่วนธุรกิจอยากให้คนกลับมาสั่งซ้ำ",
    },
    concrete: "รูปธรรม",
    abstract: "นามธรรม",
    ui: "สองชั้นบน",
    ux: "ครบทั้งห้าชั้น",
    choose: "เลือกชั้นของแอปสั่งอาหาร",
  },
  zh: {
    names: { surface: "表现层", skeleton: "框架层", structure: "结构层", scope: "范围层", strategy: "战略层" },
    questions: {
      surface: "它看起来是什么样？",
      skeleton: "每样东西放在哪里？",
      structure: "它们如何组织在一起？",
      scope: "它能做什么？",
      strategy: "我们为什么要做它？",
    },
    examples: {
      surface: "颜色、字体和美食照片；“下单”按钮的样子。",
      skeleton: "购物车、地址和“下单”按钮在屏幕上的位置。",
      structure: "流程——浏览 → 购物车 → 结账 → 追踪——以及菜单如何组织。",
      scope: "有哪些功能：预约下单、拼单、小费、饮食偏好筛选。",
      strategy: "饿了的人想以可预期的价格快速吃到饭；企业希望用户重复下单。",
    },
    concrete: "具体",
    abstract: "抽象",
    ui: "最上面两层",
    ux: "全部五层",
    choose: "选择外卖 App 的一个层面",
  },
  ja: {
    names: { surface: "表層", skeleton: "骨格", structure: "構造", scope: "要件", strategy: "戦略" },
    questions: {
      surface: "どう見える？",
      skeleton: "何をどこに置く？",
      structure: "どうつながる？",
      scope: "何ができる？",
      strategy: "なぜ作る？",
    },
    examples: {
      surface: "色、文字、料理の写真。「注文」ボタンの見た目。",
      skeleton: "カート、住所、「注文」ボタンが画面のどこにあるか。",
      structure: "流れ（メニュー → カート → 購入 → 配達状況）と、メニューの整理の仕方。",
      scope: "どんな機能があるか。予約注文、グループ注文、チップ、食事制限フィルター。",
      strategy: "お腹がすいた人は、予想どおりの金額で早く食べたい。ビジネスはリピート注文を増やしたい。",
    },
    concrete: "具体",
    abstract: "抽象",
    ui: "上の 2 段階",
    ux: "5 段階すべて",
    choose: "デリバリーアプリの段階を選ぶ",
  },
};

export default function FivePlanesExample() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [active, setActive] = useState<Plane>("surface");
  const [seen, setSeen] = useState<Set<Plane>>(new Set(["surface"]));

  const choose = (p: Plane) => {
    setActive(p);
    const next = new Set(seen).add(p);
    setSeen(next);
    if (next.size >= 3) experience();
  };

  return (
    <div className="mx-auto grid max-w-3xl items-center gap-8 md:grid-cols-[1.1fr_1fr]">
      <div className="flex gap-3">
        <div className="flex flex-col items-center justify-between py-1 text-[0.6875rem] font-semibold tracking-wide text-ink-3 uppercase" aria-hidden>
          <span>{t.concrete}</span>
          <span className="w-px flex-1 bg-line-strong" />
          <span>{t.abstract}</span>
        </div>
        <div role="radiogroup" aria-label={t.choose} className="flex flex-1 flex-col gap-2">
          {PLANES.map((p, i) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={active === p}
              onClick={() => choose(p)}
              style={{ marginLeft: `${i * 10}px`, marginRight: `${(4 - i) * 10}px` }}
              className={cn(
                "flex h-14 items-center justify-between rounded-[var(--radius-md)] border px-4 text-left transition-[background-color,border-color,transform] duration-200",
                active === p
                  ? "translate-x-1 border-accent bg-accent text-on-accent shadow-md"
                  : "border-line-strong bg-surface text-ink hover:border-accent/50",
              )}
            >
              <span className="font-semibold">{t.names[p]}</span>
              {i < 2 ? (
                <span className={cn("rounded-full px-2 py-0.5 text-[0.6875rem] font-bold", active === p ? "bg-white/20" : "bg-accent-soft text-accent-ink")}>UI</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6" aria-live="polite">
        <p className="type-label text-accent-ink">{t.names[active]}</p>
        <p className="type-h3 mt-2">{t.questions[active]}</p>
        <p className="mt-3 text-ink-2">{t.examples[active]}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-[0.75rem] font-semibold">
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-ink">UI = {t.ui}</span>
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-ink-2">UX = {t.ux}</span>
        </div>
      </div>
    </div>
  );
}
