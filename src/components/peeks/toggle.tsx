"use client";

import { useState } from "react";
import { Plane, Signal, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/cn";
import { Switch } from "@/components/ui/controls";
import { useDemo } from "@/components/demos/demo-frame";
import { useCopy } from "@/components/demos/use-copy";

const copy = {
  en: { airplane: "Airplane mode", wifi: "Wi-Fi", wifiOff: "Off in airplane mode", note: "It took effect instantly — no Save button." },
  th: { airplane: "โหมดเครื่องบิน", wifi: "Wi-Fi", wifiOff: "ปิดอยู่ระหว่างโหมดเครื่องบิน", note: "มีผลทันที ไม่ต้องกดบันทึก" },
  zh: { airplane: "飞行模式", wifi: "Wi-Fi", wifiOff: "飞行模式下已关闭", note: "立即生效——不需要“保存”按钮。" },
  ja: { airplane: "機内モード", wifi: "Wi-Fi", wifiOff: "機内モード中はオフ", note: "すぐに反映。「保存」ボタンは不要です。" },
};

export default function TogglePeek() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [airplane, setAirplane] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [touched, setTouched] = useState(false);
  const wifiOn = wifi && !airplane;

  const flip = (fn: () => void) => {
    fn();
    setTouched(true);
    experience();
  };

  return (
    <div className="flex size-full flex-col items-center justify-center gap-2">
      <div className="w-full max-w-[17rem] overflow-hidden rounded-[var(--radius-lg)] border border-line-strong bg-surface shadow-sm">
        <div className="flex items-center justify-between px-3.5 pt-2 text-[0.6875rem] font-semibold text-ink" aria-hidden>
          <span className="tabular">9:41</span>
          <span className="flex items-center gap-1.5">
            {airplane ? <Plane className="size-3.5 text-accent" /> : <Signal className="size-3.5" />}
            {wifiOn ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5 text-ink-3" />}
          </span>
        </div>
        <div className="divide-y divide-line px-3.5 pb-1 text-[0.875rem]">
          <Switch
            className="py-2"
            label={
              <span className="flex items-center gap-2">
                <Plane className="size-4 text-ink-2" aria-hidden />
                {t.airplane}
              </span>
            }
            checked={airplane}
            onChange={(v) => flip(() => setAirplane(v))}
          />
          <Switch
            className={cn("py-2", airplane && "opacity-60")}
            label={
              <span className="flex items-center gap-2">
                <Wifi className="size-4 text-ink-2" aria-hidden />
                {t.wifi}
              </span>
            }
            description={airplane ? <span className="text-[0.75rem]">{t.wifiOff}</span> : undefined}
            checked={wifiOn}
            disabled={airplane}
            onChange={(v) => flip(() => setWifi(v))}
          />
        </div>
      </div>
      <p className="min-h-4 text-center text-[0.75rem] leading-tight text-ink-2">
        {touched ? <span className="animate-fade-up inline-block">{t.note}</span> : null}
      </p>
    </div>
  );
}
