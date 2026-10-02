"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Timer } from "lucide-react";
import { cn } from "@/lib/cn";
import { SegmentedControl } from "@/components/ui/controls";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

type Node = { id: string; children?: Node[]; target?: boolean };

/** Version A: vague labels, deep nesting. Version B: people’s words, shallow. */
const TREE_A: Node[] = [
  { id: "general", children: [{ id: "display" }, { id: "language" }] },
  { id: "advanced", children: [{ id: "misc", children: [{ id: "credentials", target: true }, { id: "sessions" }] }, { id: "data" }] },
  { id: "preferences", children: [{ id: "alerts" }, { id: "privacy" }] },
  { id: "other", children: [{ id: "about" }, { id: "legal" }] },
];
const TREE_B: Node[] = [
  { id: "account", children: [{ id: "profile" }, { id: "changePassword", target: true }, { id: "twoStep" }] },
  { id: "notifications" },
  { id: "privacy" },
  { id: "help" },
];

const copy = {
  en: {
    task: "Task: change your password",
    a: "Menu A",
    b: "Menu B",
    switchLabel: "Choose a menu",
    start: "Start the timer",
    found: "Found it in {s}s with {c} clicks",
    back: "Back",
    settings: "Settings",
    labels: {
      general: "General", display: "Display", language: "Language", advanced: "Advanced", misc: "Misc.",
      credentials: "Credential management", sessions: "Sessions", data: "Data", preferences: "Preferences",
      alerts: "Alerts", privacy: "Privacy", other: "Other", about: "About", legal: "Legal",
      account: "Account", profile: "Profile", changePassword: "Change password", twoStep: "Two-step verification",
      notifications: "Notifications", help: "Help",
    } as Record<string, string>,
    nope: "Not here — keep looking.",
    lesson: "Same feature, same content. Clear labels in people’s words and a shallow structure made B faster — that’s usability you can measure.",
  },
  th: {
    task: "ภารกิจ: เปลี่ยนรหัสผ่าน",
    a: "เมนู A",
    b: "เมนู B",
    switchLabel: "เลือกเมนู",
    start: "เริ่มจับเวลา",
    found: "เจอใน {s} วินาที ใช้ {c} คลิก",
    back: "กลับ",
    settings: "การตั้งค่า",
    labels: {
      general: "ทั่วไป", display: "การแสดงผล", language: "ภาษา", advanced: "ขั้นสูง", misc: "อื่น ๆ",
      credentials: "การจัดการข้อมูลรับรอง", sessions: "เซสชัน", data: "ข้อมูล", preferences: "การกำหนดลักษณะ",
      alerts: "การเตือน", privacy: "ความเป็นส่วนตัว", other: "เบ็ดเตล็ด", about: "เกี่ยวกับ", legal: "กฎหมาย",
      account: "บัญชี", profile: "โปรไฟล์", changePassword: "เปลี่ยนรหัสผ่าน", twoStep: "ยืนยันตัวตนสองขั้นตอน",
      notifications: "การแจ้งเตือน", help: "ช่วยเหลือ",
    },
    nope: "ไม่ใช่ตรงนี้ ลองหาต่อ",
    lesson: "ฟีเจอร์เดียวกัน เนื้อหาเดียวกัน แต่ป้ายที่ใช้คำของผู้ใช้และโครงสร้างที่ตื้นกว่าทำให้ B เร็วกว่า นี่คือ Usability ที่วัดได้จริง",
  },
  zh: {
    task: "任务：修改密码",
    a: "菜单 A",
    b: "菜单 B",
    switchLabel: "选择菜单",
    start: "开始计时",
    found: "用时 {s} 秒，点击 {c} 次",
    back: "返回",
    settings: "设置",
    labels: {
      general: "通用", display: "显示", language: "语言", advanced: "高级", misc: "杂项",
      credentials: "凭据管理", sessions: "会话", data: "数据", preferences: "偏好",
      alerts: "警报", privacy: "隐私", other: "其他", about: "关于", legal: "法律信息",
      account: "账户", profile: "个人资料", changePassword: "修改密码", twoStep: "两步验证",
      notifications: "通知", help: "帮助",
    },
    nope: "不在这里——继续找。",
    lesson: "同样的功能、同样的内容。用用户的语言写标签、结构更浅，让 B 更快——这就是可以衡量的可用性。",
  },
  ja: {
    task: "タスク：パスワードを変更する",
    a: "メニュー A",
    b: "メニュー B",
    switchLabel: "メニューを選ぶ",
    start: "タイマー開始",
    found: "{s} 秒、{c} クリックで発見",
    back: "戻る",
    settings: "設定",
    labels: {
      general: "一般", display: "表示", language: "言語", advanced: "詳細設定", misc: "その他の項目",
      credentials: "認証情報の管理", sessions: "セッション", data: "データ", preferences: "環境設定",
      alerts: "アラート", privacy: "プライバシー", other: "その他", about: "情報", legal: "法的事項",
      account: "アカウント", profile: "プロフィール", changePassword: "パスワードを変更", twoStep: "2 段階認証",
      notifications: "通知", help: "ヘルプ",
    },
    nope: "ここではありません。探し続けましょう。",
    lesson: "同じ機能、同じ内容。使う人の言葉でラベルを付け、構造を浅くしただけで B のほうが速くなりました。これが測れるユーザビリティです。",
  },
};

type Run = { ms: number; clicks: number };

function Menu({ tree, onFound, onClick, labels, back, title, nope }: {
  tree: Node[];
  onFound: () => void;
  onClick: () => void;
  labels: Record<string, string>;
  back: string;
  title: string;
  nope: string;
}) {
  const [path, setPath] = useState<Node[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const level = path.length ? path[path.length - 1].children ?? [] : tree;

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line-strong bg-surface">
      <div className="flex h-12 items-center gap-2 border-b border-line px-3">
        {path.length ? (
          <button
            type="button"
            onClick={() => {
              onClick();
              setPath((p) => p.slice(0, -1));
              setMiss(null);
            }}
            className="inline-flex h-9 items-center gap-0.5 rounded-full pr-3 pl-1.5 text-sm font-medium text-accent-ink hover:bg-surface-2"
          >
            <ChevronLeft className="size-4" aria-hidden /> {back}
          </button>
        ) : null}
        <span className="truncate text-sm font-semibold text-ink">{path.length ? labels[path[path.length - 1].id] : title}</span>
      </div>
      <ul className="divide-y divide-line">
        {level.map((node) => (
          <li key={node.id}>
            <button
              type="button"
              onClick={() => {
                onClick();
                if (node.target) onFound();
                else if (node.children) {
                  setPath((p) => [...p, node]);
                  setMiss(null);
                } else setMiss(node.id);
              }}
              className="flex h-12 w-full items-center justify-between px-4 text-left text-[0.9375rem] text-ink hover:bg-surface-2"
            >
              {labels[node.id]}
              {node.children ? <ChevronRight className="size-4 text-ink-3" aria-hidden /> : null}
            </button>
            {miss === node.id ? <p className="px-4 pb-3 text-[0.8125rem] text-warning">{nope}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function UsabilityDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [which, setWhich] = useState<"a" | "b">("a");
  const [running, setRunning] = useState(false);
  const [runs, setRuns] = useState<Partial<Record<"a" | "b", Run>>>({});
  const startedAt = useRef(0);
  const clicks = useRef(0);

  useEffect(() => {
    if (runs.a && runs.b) experience();
  }, [runs, experience]);

  const run = runs[which];

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4">
      <p className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg">
        <Timer className="size-4" aria-hidden /> {t.task}
      </p>
      <SegmentedControl<"a" | "b">
        label={t.switchLabel}
        value={which}
        onChange={(v) => {
          setWhich(v);
          setRunning(false);
        }}
        options={[
          { value: "a", label: `${t.a}${runs.a ? " ✓" : ""}` },
          { value: "b", label: `${t.b}${runs.b ? " ✓" : ""}` },
        ]}
      />

      <div className="w-full">
        {running ? (
          <Menu
            key={which}
            tree={which === "a" ? TREE_A : TREE_B}
            labels={t.labels}
            back={t.back}
            title={t.settings}
            nope={t.nope}
            onClick={() => (clicks.current += 1)}
            onFound={() => {
              setRuns((r) => ({ ...r, [which]: { ms: performance.now() - startedAt.current, clicks: clicks.current } }));
              setRunning(false);
            }}
          />
        ) : (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface p-6 text-center">
            {run ? (
              <p className="animate-fade-up font-semibold text-success">
                {t.found.replace("{s}", (run.ms / 1000).toFixed(1)).replace("{c}", String(run.clicks))}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => {
                startedAt.current = performance.now();
                clicks.current = 0;
                setRunning(true);
              }}
              className={cn("h-11 rounded-full px-6 text-sm font-semibold", run ? "text-accent-ink hover:bg-surface-2" : "bg-accent text-on-accent hover:bg-accent-hover")}
            >
              {t.start} · {which === "a" ? t.a : t.b}
            </button>
          </div>
        )}
      </div>
      {runs.a && runs.b ? <p className="animate-fade-up text-center text-[0.875rem] text-ink-2">{t.lesson}</p> : null}
    </div>
  );
}
