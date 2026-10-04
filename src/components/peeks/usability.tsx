"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { format } from "@/i18n/localized";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";
import { MiniTabs } from "./kit";

type Menu = "a" | "b";
type Key = "general" | "advanced" | "misc" | "credentials" | "sessions" | "account" | "password" | "twoStep" | "notifications" | "help";
type Node = { key: Key; children?: Node[] };

/* Same feature, two structures: A is deep and in jargon, B is shallow and in plain words. */
const MENUS: Record<Menu, Node[]> = {
  a: [
    { key: "general" },
    { key: "advanced", children: [{ key: "sessions" }, { key: "credentials", children: [{ key: "password" }] }] },
    { key: "misc" },
  ],
  b: [{ key: "account", children: [{ key: "password" }, { key: "twoStep" }] }, { key: "notifications" }, { key: "help" }],
};

const copy = {
  en: {
    a: "Menu A",
    b: "Menu B",
    menus: "Choose a menu",
    settings: "Settings",
    back: "Back",
    found: "Found in {s}s · {c} clicks",
    nope: "Not here — keep looking",
    again: "Try again",
    labels: {
      general: "General", advanced: "Advanced", misc: "Misc.", credentials: "Credential management", sessions: "Sessions",
      account: "Account", password: "Change password", twoStep: "Two-step verification", notifications: "Notifications", help: "Help",
    } as Record<Key, string>,
  },
  th: {
    a: "เมนู A",
    b: "เมนู B",
    menus: "เลือกเมนู",
    settings: "การตั้งค่า",
    back: "กลับ",
    found: "เจอใน {s} วินาที · {c} คลิก",
    nope: "ไม่ใช่ตรงนี้ ลองหาต่อ",
    again: "ลองอีกครั้ง",
    labels: {
      general: "ทั่วไป", advanced: "ขั้นสูง", misc: "อื่น ๆ", credentials: "การจัดการข้อมูลรับรอง", sessions: "เซสชัน",
      account: "บัญชี", password: "เปลี่ยนรหัสผ่าน", twoStep: "ยืนยันตัวตนสองขั้นตอน", notifications: "การแจ้งเตือน", help: "ช่วยเหลือ",
    },
  },
  zh: {
    a: "菜单 A",
    b: "菜单 B",
    menus: "选择菜单",
    settings: "设置",
    back: "返回",
    found: "用时 {s} 秒 · 点击 {c} 次",
    nope: "不在这里——继续找",
    again: "再试一次",
    labels: {
      general: "通用", advanced: "高级", misc: "杂项", credentials: "凭据管理", sessions: "会话",
      account: "账户", password: "修改密码", twoStep: "两步验证", notifications: "通知", help: "帮助",
    },
  },
  ja: {
    a: "メニュー A",
    b: "メニュー B",
    menus: "メニューを選ぶ",
    settings: "設定",
    back: "戻る",
    found: "{s} 秒・{c} クリックで発見",
    nope: "ここではありません",
    again: "もう一度",
    labels: {
      general: "一般", advanced: "詳細設定", misc: "その他", credentials: "認証情報の管理", sessions: "セッション",
      account: "アカウント", password: "パスワードを変更", twoStep: "2 段階認証", notifications: "通知", help: "ヘルプ",
    },
  },
};

type Run = { path: Key[]; clicks: number; start: number; result: { s: number; c: number } | null };
const fresh = (): Run => ({ path: [], clicks: 0, start: 0, result: null });

export default function UsabilityPeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [menu, setMenu] = useState<Menu>("a");
  const [runs, setRuns] = useState<Record<Menu, Run>>({ a: fresh(), b: fresh() });
  const [nope, setNope] = useState<Key | null>(null);
  const [now, setNow] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const run = runs[menu];
  const running = run.start > 0 && !run.result;

  // A live stopwatch while a search is running
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(performance.now()), 100);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  let level = MENUS[menu];
  for (const key of run.path) level = level.find((n) => n.key === key)?.children ?? level;

  const update = (patch: (r: Run) => Run) => setRuns((all) => ({ ...all, [menu]: patch(all[menu]) }));

  // `at` is the click's own timestamp (same clock as performance.now)
  const choose = (node: Node, at: number) => {
    const start = run.start || at;
    const clicks = run.clicks + 1;
    if (node.children) {
      update((r) => ({ ...r, start, clicks, path: [...r.path, node.key] }));
    } else if (node.key === "password") {
      update((r) => ({ ...r, start, clicks, result: { s: (at - start) / 1000, c: clicks } }));
      experience();
    } else {
      update((r) => ({ ...r, start, clicks }));
      setNope(node.key);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setNope(null), 1200);
    }
  };

  const seconds = run.result ? run.result.s : running ? Math.max(0, (now - run.start) / 1000) : 0;

  return (
    <div className="flex size-full flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <MiniTabs
          label={t.menus}
          value={menu}
          onChange={(m) => {
            setMenu(m);
            setNope(null);
          }}
          options={[
            { value: "a", label: `${t.a}${runs.a.result ? " ✓" : ""}` },
            { value: "b", label: `${t.b}${runs.b.result ? " ✓" : ""}` },
          ]}
        />
        <span className="tabular font-mono text-[0.75rem] text-ink-2" aria-hidden>
          {seconds.toFixed(1)}s
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-sm)] border border-line-strong bg-surface">
        <div className="flex h-8 shrink-0 items-center gap-1 border-b border-line px-1.5 text-[0.75rem]">
          {run.path.length && !run.result ? (
            <button
              type="button"
              onClick={() => update((r) => ({ ...r, clicks: r.clicks + 1, path: r.path.slice(0, -1) }))}
              className="inline-flex h-6 items-center gap-0.5 rounded-full pr-2 pl-1 font-semibold text-accent-ink hover:bg-surface-2"
            >
              <ChevronLeft className="size-3.5" aria-hidden /> {t.back}
            </button>
          ) : null}
          <span aria-live="polite" className={cn("min-w-0 flex-1 truncate px-1 font-semibold", run.result ? "text-success" : "text-ink")}>
            {run.result
              ? `✓ ${format(t.found, { s: run.result.s.toFixed(1), c: run.result.c })}`
              : nope
                ? <span className="font-normal text-warning">{t.nope}</span>
                : run.path.length
                  ? t.labels[run.path[run.path.length - 1]]
                  : t.settings}
          </span>
        </div>
        {run.result ? (
          <button
            type="button"
            onClick={() => update(() => fresh())}
            className="m-auto inline-flex h-7 items-center rounded-full px-3 text-[0.75rem] font-semibold text-accent-ink hover:bg-surface-2"
          >
            ↺ {t.again}
          </button>
        ) : (
          <ul className="flex flex-col divide-y divide-line overflow-hidden">
            {level.map((node) => (
              <li key={node.key}>
                <button
                  type="button"
                  onClick={(e) => choose(node, e.timeStamp)}
                  className={cn(
                    "flex h-8 w-full items-center justify-between gap-2 px-2.5 text-left text-[0.8125rem] text-ink transition-colors hover:bg-surface-2",
                    nope === node.key && "bg-warning-soft",
                  )}
                >
                  <span className="truncate">{t.labels[node.key]}</span>
                  {node.children ? <ChevronRight className="size-3.5 shrink-0 text-ink-3" aria-hidden /> : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
