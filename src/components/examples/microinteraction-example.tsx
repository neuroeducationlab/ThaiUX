"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import { Switch } from "@/components/ui/controls";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

const copy = {
  en: {
    caption: "Sunset at Wat Arun",
    like: "Like",
    liked: "Liked",
    likes: "{n} likes",
    parts: "The anatomy",
    trigger: "Trigger",
    triggerDesc: "You tap the heart (or double-tap the photo).",
    rules: "Rules",
    rulesDesc: "One like per person. Tap again to undo.",
    feedback: "Feedback",
    feedbackDesc: "Colour, a little pop and the count changing.",
    loops: "Loops & modes",
    loopsDesc: "Double-tap also likes — a shortcut for regulars.",
    animate: "Feedback: pop animation",
    colour: "Feedback: colour change",
    count: "Rule: show the like count",
    off: "With the feedback switched off, did your like even register? That’s why tiny moments matter.",
  },
  th: {
    caption: "พระอาทิตย์ตกที่วัดอรุณฯ",
    like: "ถูกใจ",
    liked: "ถูกใจแล้ว",
    likes: "{n} ถูกใจ",
    parts: "กายวิภาคของ Microinteraction",
    trigger: "Trigger · ตัวกระตุ้น",
    triggerDesc: "คุณแตะรูปหัวใจ (หรือแตะรูปสองครั้ง)",
    rules: "Rules · กฎ",
    rulesDesc: "หนึ่งคนถูกใจได้หนึ่งครั้ง แตะอีกครั้งเพื่อยกเลิก",
    feedback: "Feedback · การตอบสนอง",
    feedbackDesc: "สีเปลี่ยน เด้งเล็กน้อย และตัวเลขเปลี่ยน",
    loops: "Loops & modes",
    loopsDesc: "แตะรูปสองครั้งก็ถูกใจได้ เป็นทางลัดสำหรับคนที่ใช้ประจำ",
    animate: "Feedback: แอนิเมชันเด้ง",
    colour: "Feedback: เปลี่ยนสี",
    count: "Rule: แสดงจำนวนถูกใจ",
    off: "เมื่อปิด Feedback คุณยังรู้ไหมว่ากดถูกใจไปแล้ว? นี่แหละเหตุผลที่ช่วงเวลาเล็ก ๆ สำคัญ",
  },
  zh: {
    caption: "郑王庙的日落",
    like: "点赞",
    liked: "已点赞",
    likes: "{n} 个赞",
    parts: "微交互的结构",
    trigger: "触发器",
    triggerDesc: "你点了一下爱心（或双击照片）。",
    rules: "规则",
    rulesDesc: "每人只能点一次赞，再点一次即取消。",
    feedback: "反馈",
    feedbackDesc: "颜色变化、轻轻一弹，以及数字的变化。",
    loops: "循环与模式",
    loopsDesc: "双击照片也能点赞——给老用户的快捷方式。",
    animate: "反馈：弹跳动画",
    colour: "反馈：颜色变化",
    count: "规则：显示点赞数",
    off: "关掉反馈后，你还确定自己点过赞了吗？这就是小瞬间为什么重要。",
  },
  ja: {
    caption: "ワット・アルンの夕焼け",
    like: "いいね",
    liked: "いいね済み",
    likes: "いいね {n} 件",
    parts: "マイクロインタラクションの構造",
    trigger: "トリガー",
    triggerDesc: "ハートをタップ（または写真をダブルタップ）。",
    rules: "ルール",
    rulesDesc: "いいねは 1 人 1 回。もう一度タップで取り消し。",
    feedback: "フィードバック",
    feedbackDesc: "色の変化、小さな弾み、そして数字の変化。",
    loops: "ループとモード",
    loopsDesc: "ダブルタップでもいいね。常連さん向けの近道です。",
    animate: "フィードバック：弾むアニメーション",
    colour: "フィードバック：色の変化",
    count: "ルール：いいねの数を表示",
    off: "フィードバックをオフにしたら、いいねできたか分かりましたか？ だから小さな瞬間が大切なのです。",
  },
};

export default function MicrointeractionExample() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [liked, setLiked] = useState(false);
  const [bump, setBump] = useState(0);
  const [anim, setAnim] = useState(true);
  const [colour, setColour] = useState(true);
  const [count, setCount] = useState(true);
  const [toggledOff, setToggledOff] = useState(false);

  const toggle = () => {
    setLiked((l) => !l);
    setBump((b) => b + 1);
    experience();
  };

  const n = 128 + (liked ? 1 : 0);

  return (
    <div className="mx-auto grid max-w-3xl items-start gap-8 md:grid-cols-[minmax(0,20rem)_1fr]">
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line-strong bg-surface shadow-sm">
        <div
          onDoubleClick={() => !liked && toggle()}
          className="aspect-square bg-[radial-gradient(circle_at_70%_30%,#ffd28a,transparent_40%),linear-gradient(180deg,#f59e6b_0%,#b45f8a_55%,#3b2a5c_100%)]"
          aria-hidden
        />
        <div className="flex items-center gap-3 p-3">
          <button
            key={anim ? bump : "static"}
            type="button"
            aria-pressed={liked}
            aria-label={liked ? t.liked : t.like}
            onClick={toggle}
            className={cn("flex size-11 items-center justify-center rounded-full hover:bg-surface-2", anim && liked && "animate-pop")}
          >
            <Heart
              className={cn("size-6 transition-colors", liked && colour ? "fill-[#e5484d] text-[#e5484d]" : "text-ink")}
              aria-hidden
            />
          </button>
          <div className="min-w-0">
            {count ? <p className="tabular text-sm font-semibold text-ink">{t.likes.replace("{n}", String(n))}</p> : null}
            <p className="truncate text-[0.8125rem] text-ink-2">{t.caption}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="type-label mb-3">{t.parts}</p>
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            [t.trigger, t.triggerDesc],
            [t.rules, t.rulesDesc],
            [t.feedback, t.feedbackDesc],
            [t.loops, t.loopsDesc],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[var(--radius-md)] border border-line bg-surface p-3">
              <dt className="text-[0.875rem] font-semibold text-ink">{k}</dt>
              <dd className="mt-1 text-[0.8125rem] text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 divide-y divide-line rounded-[var(--radius-md)] bg-surface px-4">
          <Switch className="py-2.5" label={t.animate} checked={anim} onChange={(v) => { setAnim(v); if (!v) setToggledOff(true); }} />
          <Switch className="py-2.5" label={t.colour} checked={colour} onChange={(v) => { setColour(v); if (!v) setToggledOff(true); }} />
          <Switch className="py-2.5" label={t.count} checked={count} onChange={(v) => { setCount(v); if (!v) setToggledOff(true); }} />
        </div>
        {toggledOff && !colour && !count ? (
          <p className="animate-fade-up mt-4 text-[0.875rem] text-ink-2">{t.off}</p>
        ) : null}
      </div>
    </div>
  );
}
