"use client";

import { useEffect, useRef, useState } from "react";
import { FlaskConical, RotateCcw, Users, Wrench } from "lucide-react";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/button";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

type Phase = "v1" | "testing1" | "results1" | "v2" | "testing2" | "results2";
type Finding = { severity: "high" | "medium" | "low"; text: string };

const copy = {
  en: {
    simulated: "Simulated results for learning — not real research data.",
    v1: "Version 1",
    v2: "Version 2",
    title: "Create your account",
    handle: "Handle",
    email: "Email",
    password: "Password",
    rules: "8+ characters, 1 number",
    next: "Next",
    run: "Run a test with 5 people",
    runAgain: "Test version 2",
    testing: "Watching 5 participants try to sign up…",
    apply: "Apply fixes",
    restart: "Start over",
    findings: "Findings",
    severity: { high: "High", medium: "Medium", low: "Low" } as Record<Finding["severity"], string>,
    f1: [
      { severity: "high", text: "3 of 5 missed the password rules — they were hidden until an error appeared." },
      { severity: "high", text: "2 of 5 didn’t notice the faint “Next” button." },
      { severity: "medium", text: "2 of 5 weren’t sure what “Handle” meant." },
    ] as Finding[],
    f2: [{ severity: "low", text: "1 of 5 wanted a “show password” button." }] as Finding[],
    log: "Iteration log",
    changes: [
      "Password rules shown up front as helper text",
      "“Next” became a strong primary button: “Create account”",
      "“Handle” renamed to “Username”",
    ],
    username: "Username",
    create: "Create account",
    better: "Fewer, smaller problems. Test → learn → change → test again: that loop is how products get good.",
  },
  th: {
    simulated: "ผลลัพธ์จำลองเพื่อการเรียนรู้ ไม่ใช่ข้อมูลวิจัยจริง",
    v1: "เวอร์ชัน 1",
    v2: "เวอร์ชัน 2",
    title: "สร้างบัญชีของคุณ",
    handle: "Handle",
    email: "อีเมล",
    password: "รหัสผ่าน",
    rules: "อย่างน้อย 8 ตัว มีตัวเลข 1 ตัว",
    next: "ถัดไป",
    run: "ทดสอบกับคน 5 คน",
    runAgain: "ทดสอบเวอร์ชัน 2",
    testing: "กำลังดูผู้ทดสอบ 5 คนสมัครสมาชิก…",
    apply: "แก้ไขตามผลทดสอบ",
    restart: "เริ่มใหม่",
    findings: "สิ่งที่พบ",
    severity: { high: "สูง", medium: "กลาง", low: "ต่ำ" },
    f1: [
      { severity: "high", text: "3 ใน 5 คนพลาดเงื่อนไขรหัสผ่าน เพราะมันซ่อนอยู่จนกว่าจะเกิดข้อผิดพลาด" },
      { severity: "high", text: "2 ใน 5 คนไม่เห็นปุ่ม “ถัดไป” ที่จางมาก" },
      { severity: "medium", text: "2 ใน 5 คนไม่แน่ใจว่า “Handle” หมายถึงอะไร" },
    ] as Finding[],
    f2: [{ severity: "low", text: "1 ใน 5 คนอยากได้ปุ่ม “แสดงรหัสผ่าน”" }] as Finding[],
    log: "บันทึกการปรับปรุง",
    changes: [
      "แสดงเงื่อนไขรหัสผ่านไว้ล่วงหน้าเป็นข้อความช่วยเหลือ",
      "ปุ่ม “ถัดไป” กลายเป็นปุ่มหลักที่เด่นชัด: “สร้างบัญชี”",
      "เปลี่ยน “Handle” เป็น “ชื่อผู้ใช้”",
    ],
    username: "ชื่อผู้ใช้",
    create: "สร้างบัญชี",
    better: "ปัญหาน้อยลงและเล็กลง ทดสอบ → เรียนรู้ → แก้ไข → ทดสอบอีกครั้ง วงจรนี้คือวิธีที่ผลิตภัณฑ์ดีขึ้น",
  },
  zh: {
    simulated: "用于学习的模拟结果——不是真实的研究数据。",
    v1: "版本 1",
    v2: "版本 2",
    title: "创建你的账户",
    handle: "Handle",
    email: "邮箱",
    password: "密码",
    rules: "至少 8 个字符，含 1 个数字",
    next: "下一步",
    run: "找 5 个人测试",
    runAgain: "测试版本 2",
    testing: "正在观察 5 位参与者注册……",
    apply: "应用修改",
    restart: "重新开始",
    findings: "发现",
    severity: { high: "高", medium: "中", low: "低" },
    f1: [
      { severity: "high", text: "5 人中有 3 人没注意到密码规则——规则在出错前一直是隐藏的。" },
      { severity: "high", text: "5 人中有 2 人没注意到颜色很淡的“下一步”按钮。" },
      { severity: "medium", text: "5 人中有 2 人不确定“Handle”是什么意思。" },
    ] as Finding[],
    f2: [{ severity: "low", text: "5 人中有 1 人希望有“显示密码”按钮。" }] as Finding[],
    log: "迭代记录",
    changes: ["把密码规则作为辅助说明提前展示", "“下一步”变成醒目的主按钮：“创建账户”", "把“Handle”改名为“用户名”"],
    username: "用户名",
    create: "创建账户",
    better: "问题更少、更小。测试 → 学习 → 修改 → 再测试：产品就是这样变好的。",
  },
  ja: {
    simulated: "学習用の模擬結果です。実際の調査データではありません。",
    v1: "バージョン 1",
    v2: "バージョン 2",
    title: "アカウントを作成",
    handle: "ハンドル",
    email: "メールアドレス",
    password: "パスワード",
    rules: "8 文字以上、数字を 1 つ含む",
    next: "次へ",
    run: "5 人でテストする",
    runAgain: "バージョン 2 をテスト",
    testing: "5 人の参加者が登録する様子を観察中…",
    apply: "修正を反映",
    restart: "最初から",
    findings: "発見したこと",
    severity: { high: "高", medium: "中", low: "低" },
    f1: [
      { severity: "high", text: "5 人中 3 人がパスワードの条件を見落としました。エラーが出るまで隠れていたからです。" },
      { severity: "high", text: "5 人中 2 人が薄い「次へ」ボタンに気づきませんでした。" },
      { severity: "medium", text: "5 人中 2 人が「ハンドル」の意味が分かりませんでした。" },
    ] as Finding[],
    f2: [{ severity: "low", text: "5 人中 1 人が「パスワードを表示」ボタンを求めました。" }] as Finding[],
    log: "改善の記録",
    changes: ["パスワードの条件を補足テキストとして最初から表示", "「次へ」を目立つメインボタン「アカウントを作成」に", "「ハンドル」を「ユーザー名」に変更"],
    username: "ユーザー名",
    create: "アカウントを作成",
    better: "問題は少なく、小さくなりました。テスト → 学ぶ → 変える → もう一度テスト。製品はこのループで良くなっていきます。",
  },
};

const sevClass = { high: "bg-error-soft text-error", medium: "bg-warning-soft text-warning", low: "bg-surface-2 text-ink-2" };

export default function TestIterateExample() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [phase, setPhase] = useState<Phase>("v1");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const test = (to: Phase) => {
    setPhase(to === "results1" ? "testing1" : "testing2");
    timer.current = window.setTimeout(() => {
      setPhase(to);
      if (to === "results2") experience();
    }, 1800);
  };

  const version2 = phase === "v2" || phase === "testing2" || phase === "results2";
  const testing = phase === "testing1" || phase === "testing2";
  const findings = phase === "results1" ? t.f1 : phase === "results2" ? t.f2 : null;

  return (
    <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-[17rem_1fr]">
      <div data-intentionally-flawed={!version2 || undefined}>
        <p className="type-label mb-2">{version2 ? t.v2 : t.v1}</p>
        <div className="rounded-[var(--radius-lg)] border border-line-strong bg-surface p-4 shadow-sm">
          <p className="mb-3 font-semibold text-ink">{t.title}</p>
          <div className="space-y-2.5 text-[0.8125rem]">
            {version2 ? (
              <>
                <FieldMock label={t.username} />
                <FieldMock label={t.email} />
                <FieldMock label={t.password} helper={t.rules} />
                <span className="mt-1 flex h-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-on-accent">{t.create}</span>
              </>
            ) : (
              <>
                <span className="block h-9 rounded-[6px] border border-line-input px-2.5 py-2 text-ink-2">{t.handle}</span>
                <span className="block h-9 rounded-[6px] border border-line-input px-2.5 py-2 text-ink-2">{t.email}</span>
                <span className="block h-9 rounded-[6px] border border-line-input px-2.5 py-2 text-ink-2">{t.password}</span>
                <span className="mt-1 flex h-9 items-center justify-end px-2 text-[0.8125rem] text-[#c4c4cc]">{t.next} →</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <p className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full bg-surface-2 px-3 py-1 text-[0.75rem] font-medium text-ink-2">
          <FlaskConical className="size-3.5" aria-hidden /> {t.simulated}
        </p>
        <div className="flex-1 rounded-[var(--radius-lg)] border border-line bg-surface p-4" aria-live="polite" aria-busy={testing}>
          {testing ? (
            <p className="flex items-center gap-2 text-ink-2">
              <Spinner className="text-accent" /> {t.testing}
            </p>
          ) : findings ? (
            <>
              <p className="type-label mb-3 flex items-center gap-1.5">
                <Users className="size-3.5" aria-hidden /> {t.findings} · {version2 ? t.v2 : t.v1}
              </p>
              <ul className="space-y-2">
                {findings.map((f) => (
                  <li key={f.text} className="flex items-start gap-2 text-[0.875rem] text-ink">
                    <span className={cn("mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[0.6875rem] font-bold", sevClass[f.severity])}>
                      {t.severity[f.severity]}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>
              {phase === "results2" ? (
                <div className="mt-4 border-t border-line pt-4">
                  <p className="type-label mb-2 flex items-center gap-1.5">
                    <Wrench className="size-3.5" aria-hidden /> {t.log}
                  </p>
                  <ul className="prose-thaiux text-[0.875rem] text-ink-2">
                    {t.changes.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[0.875rem] font-medium text-success">{t.better}</p>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-ink-2">—</p>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {phase === "v1" ? (
            <ActionButton onClick={() => test("results1")}>{t.run}</ActionButton>
          ) : phase === "results1" ? (
            <ActionButton onClick={() => setPhase("v2")}>{t.apply}</ActionButton>
          ) : phase === "v2" ? (
            <ActionButton onClick={() => test("results2")}>{t.runAgain}</ActionButton>
          ) : phase === "results2" ? (
            <button
              type="button"
              onClick={() => setPhase("v1")}
              className="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-accent-ink hover:bg-surface"
            >
              <RotateCcw className="size-4" aria-hidden /> {t.restart}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FieldMock({ label, helper }: { label: string; helper?: string }) {
  return (
    <span className="block">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      <span className="block h-9 rounded-[6px] border border-line-input" />
      {helper ? <span className="mt-1 block text-[0.75rem] text-ink-2">{helper}</span> : null}
    </span>
  );
}

function ActionButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="h-11 rounded-full bg-ink px-5 text-sm font-semibold text-bg hover:opacity-90">
      {children}
    </button>
  );
}
