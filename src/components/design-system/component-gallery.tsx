"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Download, Plus } from "lucide-react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { ProgressBar, SegmentedControl, Switch, Tabs } from "@/components/ui/controls";
import { DifficultyDots, Kbd, Tag } from "@/components/ui/layout";
import { toast } from "@/components/ui/toast";
import { useCopy } from "@/components/demos/use-copy";

const copy = {
  en: {
    variants: { primary: "Primary", secondary: "Secondary", ghost: "Ghost", quiet: "Quiet link", danger: "Delete" } as Record<ButtonVariant, string>,
    sizes: { sm: "Small", md: "Medium", lg: "Large" } as Record<ButtonSize, string>,
    states: "States",
    disabled: "Disabled",
    loading: "Saving…",
    save: "Save",
    withIcon: "Download",
    add: "Add item",
    next: "Continue",
    switchLabel: "Email reminders",
    switchDesc: "Takes effect immediately",
    segLabel: "View",
    seg: { day: "Day", week: "Week", month: "Month" },
    tabsLabel: "Sections",
    tabs: { a: "Overview", b: "Details", c: "Reviews" },
    panels: { a: "Overview content.", b: "Details content.", c: "Reviews content." },
    progress: "Step 3 of 5",
    toast: "Show a toast",
    toastMsg: "Saved to your list",
    tags: { neutral: "Neutral", accent: "Accent", success: "Success", warning: "Warning", error: "Error" },
    level: "Intermediate",
    shortcut: "Search",
  },
  th: {
    variants: { primary: "ปุ่มหลัก", secondary: "ปุ่มรอง", ghost: "ปุ่มโปร่ง", quiet: "ลิงก์แบบเรียบ", danger: "ลบ" },
    sizes: { sm: "เล็ก", md: "กลาง", lg: "ใหญ่" },
    states: "สถานะ",
    disabled: "ปิดใช้งาน",
    loading: "กำลังบันทึก…",
    save: "บันทึก",
    withIcon: "ดาวน์โหลด",
    add: "เพิ่มรายการ",
    next: "ต่อไป",
    switchLabel: "แจ้งเตือนทางอีเมล",
    switchDesc: "มีผลทันที",
    segLabel: "มุมมอง",
    seg: { day: "วัน", week: "สัปดาห์", month: "เดือน" },
    tabsLabel: "ส่วนต่าง ๆ",
    tabs: { a: "ภาพรวม", b: "รายละเอียด", c: "รีวิว" },
    panels: { a: "เนื้อหาภาพรวม", b: "เนื้อหารายละเอียด", c: "เนื้อหารีวิว" },
    progress: "ขั้นที่ 3 จาก 5",
    toast: "แสดง Toast",
    toastMsg: "บันทึกลงรายการของคุณแล้ว",
    tags: { neutral: "ทั่วไป", accent: "เน้น", success: "สำเร็จ", warning: "เตือน", error: "ผิดพลาด" },
    level: "ระดับกลาง",
    shortcut: "ค้นหา",
  },
  zh: {
    variants: { primary: "主要", secondary: "次要", ghost: "幽灵", quiet: "文字链接", danger: "删除" },
    sizes: { sm: "小", md: "中", lg: "大" },
    states: "状态",
    disabled: "已禁用",
    loading: "保存中…",
    save: "保存",
    withIcon: "下载",
    add: "添加项目",
    next: "继续",
    switchLabel: "邮件提醒",
    switchDesc: "立即生效",
    segLabel: "视图",
    seg: { day: "日", week: "周", month: "月" },
    tabsLabel: "分区",
    tabs: { a: "概览", b: "详情", c: "评价" },
    panels: { a: "概览内容。", b: "详情内容。", c: "评价内容。" },
    progress: "第 3 步，共 5 步",
    toast: "显示提示",
    toastMsg: "已保存到你的列表",
    tags: { neutral: "中性", accent: "强调", success: "成功", warning: "警告", error: "错误" },
    level: "中级",
    shortcut: "搜索",
  },
  ja: {
    variants: { primary: "メイン", secondary: "サブ", ghost: "ゴースト", quiet: "テキストリンク", danger: "削除" },
    sizes: { sm: "小", md: "中", lg: "大" },
    states: "状態",
    disabled: "無効",
    loading: "保存中…",
    save: "保存",
    withIcon: "ダウンロード",
    add: "項目を追加",
    next: "次へ",
    switchLabel: "メールでのお知らせ",
    switchDesc: "すぐに反映されます",
    segLabel: "表示",
    seg: { day: "日", week: "週", month: "月" },
    tabsLabel: "セクション",
    tabs: { a: "概要", b: "詳細", c: "レビュー" },
    panels: { a: "概要の内容。", b: "詳細の内容。", c: "レビューの内容。" },
    progress: "ステップ 3 / 5",
    toast: "トーストを表示",
    toastMsg: "リストに保存しました",
    tags: { neutral: "ニュートラル", accent: "アクセント", success: "成功", warning: "警告", error: "エラー" },
    level: "中級",
    shortcut: "検索",
  },
};

export function ComponentGallery({ labels }: { labels: { buttons: string; controls: string; feedback: string } }) {
  const t = useCopy(copy);
  const [saving, setSaving] = useState(false);
  const [on, setOn] = useState(true);
  const [seg, setSeg] = useState<"day" | "week" | "month">("week");
  const [tab, setTab] = useState<"a" | "b" | "c">("a");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const variants: ButtonVariant[] = ["primary", "secondary", "ghost", "quiet", "danger"];
  const sizes: ButtonSize[] = ["sm", "md", "lg"];

  return (
    <div className="space-y-12">
      <section aria-labelledby="ds-buttons">
        <h3 id="ds-buttons" className="type-title mb-4">{labels.buttons}</h3>
        <div className="space-y-4 rounded-[var(--radius-xl)] border border-line bg-surface p-6">
          {variants.map((v) => (
            <div key={v} className="flex flex-wrap items-center gap-3">
              <span className="w-28 shrink-0 text-[0.8125rem] font-medium text-ink-2">{t.variants[v]}</span>
              {(v === "quiet" ? (["md"] as ButtonSize[]) : sizes).map((s) => (
                <Button key={s} variant={v} size={s}>
                  {v === "quiet" ? t.next : `${t.variants[v]} · ${t.sizes[s]}`}
                </Button>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <span className="w-28 shrink-0 text-[0.8125rem] font-medium text-ink-2">{t.states}</span>
            <Button
              loading={saving}
              loadingLabel={t.loading}
              onClick={() => {
                setSaving(true);
                timer.current = window.setTimeout(() => setSaving(false), 1600);
              }}
            >
              {t.save}
            </Button>
            <Button disabled>{t.disabled}</Button>
            <Button variant="secondary">
              <Download className="size-4" aria-hidden /> {t.withIcon}
            </Button>
            <Button variant="ghost">
              <Plus className="size-4" aria-hidden /> {t.add}
            </Button>
            <Button variant="primary">
              {t.next} <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="ds-controls">
        <h3 id="ds-controls" className="type-title mb-4">{labels.controls}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-6 rounded-[var(--radius-xl)] border border-line bg-surface p-6">
            <Switch checked={on} onChange={setOn} label={t.switchLabel} description={t.switchDesc} />
            <SegmentedControl
              label={t.segLabel}
              value={seg}
              onChange={setSeg}
              options={(["day", "week", "month"] as const).map((v) => ({ value: v, label: t.seg[v] }))}
            />
          </div>
          <div className="rounded-[var(--radius-xl)] border border-line bg-surface p-6">
            <Tabs
              value={tab}
              onChange={setTab}
              label={t.tabsLabel}
              idBase="ds-tabs"
              tabs={(["a", "b", "c"] as const).map((v) => ({ value: v, label: t.tabs[v] }))}
            />
            <div id="ds-tabs-panel" role="tabpanel" aria-labelledby={`ds-tabs-tab-${tab}`} tabIndex={0} className="mt-4 rounded-[var(--radius-md)] bg-surface-2 p-4 text-ink-2">
              {t.panels[tab]}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="ds-feedback">
        <h3 id="ds-feedback" className="type-title mb-4">{labels.feedback}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-5 rounded-[var(--radius-xl)] border border-line bg-surface p-6">
            <div>
              <p className="mb-2 text-[0.875rem] font-medium text-ink">{t.progress}</p>
              <ProgressBar value={3} max={5} label={t.progress} />
            </div>
            <Button variant="secondary" onClick={() => toast(t.toastMsg)}>
              {t.toast}
            </Button>
          </div>
          <div className="flex flex-wrap content-start items-center gap-2 rounded-[var(--radius-xl)] border border-line bg-surface p-6">
            {(["neutral", "accent", "success", "warning", "error"] as const).map((tone) => (
              <Tag key={tone} tone={tone}>
                {t.tags[tone]}
              </Tag>
            ))}
            <span className="ml-1">
              <DifficultyDots level={2} label={t.level} />
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-2">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd> {t.shortcut}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
