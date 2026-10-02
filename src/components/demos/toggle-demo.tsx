"use client";

import { useState } from "react";
import { Bell, BellOff, Plane, Signal, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/cn";
import { Switch } from "@/components/ui/controls";
import { useDemo } from "./demo-frame";
import { useCopy } from "./use-copy";

const copy = {
  en: {
    settings: "Settings",
    airplane: "Airplane mode",
    airplaneDesc: "Turns off Wi-Fi and mobile signal",
    wifi: "Wi-Fi",
    wifiOff: "Off while Airplane mode is on",
    notifications: "Notifications",
    note: "No “Save” button — every switch took effect the moment you flipped it. That’s the contract of a toggle.",
  },
  th: {
    settings: "การตั้งค่า",
    airplane: "โหมดเครื่องบิน",
    airplaneDesc: "ปิด Wi-Fi และสัญญาณมือถือ",
    wifi: "Wi-Fi",
    wifiOff: "ปิดอยู่ระหว่างเปิดโหมดเครื่องบิน",
    notifications: "การแจ้งเตือน",
    note: "ไม่มีปุ่ม “บันทึก” ทุกสวิตช์มีผลทันทีที่คุณกด นี่คือข้อตกลงของ Toggle",
  },
  zh: {
    settings: "设置",
    airplane: "飞行模式",
    airplaneDesc: "关闭 Wi-Fi 和移动信号",
    wifi: "Wi-Fi",
    wifiOff: "飞行模式开启时关闭",
    notifications: "通知",
    note: "没有“保存”按钮——每个开关一拨动就立即生效。这就是开关的约定。",
  },
  ja: {
    settings: "設定",
    airplane: "機内モード",
    airplaneDesc: "Wi-Fi とモバイル通信をオフにします",
    wifi: "Wi-Fi",
    wifiOff: "機内モード中はオフ",
    notifications: "通知",
    note: "「保存」ボタンはありません。どのスイッチも切り替えた瞬間に反映されました。これがトグルの約束です。",
  },
};

export default function ToggleDemo() {
  const t = useCopy(copy);
  const { experience } = useDemo();
  const [airplane, setAirplane] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [notify, setNotify] = useState(true);
  const [touched, setTouched] = useState(false);

  const flip = (fn: () => void) => {
    fn();
    setTouched(true);
    experience();
  };

  const wifiOn = wifi && !airplane;

  return (
    <div className="mx-auto max-w-sm">
      <div className="overflow-hidden rounded-[2rem] border border-line-strong bg-surface shadow-md">
        <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[0.75rem] font-semibold text-ink" aria-hidden>
          <span className="tabular">9:41</span>
          <span className="flex items-center gap-1.5">
            {airplane ? <Plane className="size-3.5 text-accent" /> : <Signal className="size-3.5" />}
            {wifiOn ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5 text-ink-3" />}
            {notify ? <Bell className="size-3.5" /> : <BellOff className="size-3.5 text-ink-3" />}
          </span>
        </div>
        <div className="px-4 pb-4">
          <p className="px-2 pt-2 pb-3 text-xl font-bold text-ink">{t.settings}</p>
          <div className="divide-y divide-line rounded-[var(--radius-md)] bg-surface-2 px-4">
            <Switch
              className="py-3"
              label={<span className="flex items-center gap-2"><Plane className="size-4 text-ink-2" aria-hidden />{t.airplane}</span>}
              description={t.airplaneDesc}
              checked={airplane}
              onChange={(v) => flip(() => setAirplane(v))}
            />
            <Switch
              className={cn("py-3", airplane && "opacity-60")}
              label={<span className="flex items-center gap-2"><Wifi className="size-4 text-ink-2" aria-hidden />{t.wifi}</span>}
              description={airplane ? t.wifiOff : undefined}
              checked={wifiOn}
              disabled={airplane}
              onChange={(v) => flip(() => setWifi(v))}
            />
            <Switch
              className="py-3"
              label={<span className="flex items-center gap-2"><Bell className="size-4 text-ink-2" aria-hidden />{t.notifications}</span>}
              checked={notify}
              onChange={(v) => flip(() => setNotify(v))}
            />
          </div>
        </div>
      </div>
      {touched ? <p className="animate-fade-up mt-4 text-center text-[0.875rem] text-ink-2">{t.note}</p> : null}
    </div>
  );
}
