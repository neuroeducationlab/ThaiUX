"use client";

import { useEffect } from "react";
import { PartyPopper } from "lucide-react";
import { progress } from "@/components/progress/store";

/** Marks a lab experiment complete once (idempotent). */
export function useLabComplete(id: string, done: boolean) {
  useEffect(() => {
    if (done) progress.markLab(id);
  }, [id, done]);
}

export function CompletionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div role="status" className="animate-fade-up rounded-[var(--radius-xl)] border border-success/30 bg-success-soft p-6 text-center">
      <PartyPopper className="mx-auto size-8 text-success" aria-hidden />
      <p className="type-title mt-3 text-ink">{title}</p>
      <div className="mt-2 text-[0.9375rem] text-ink-2">{children}</div>
    </div>
  );
}

/** A phone-shaped frame for interface mock-ups used across the Lab. */
export function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[22rem] rounded-[2.25rem] border-[6px] border-[#1c1c22] bg-[#1c1c22] shadow-lg ${className}`}>
      <div className="overflow-hidden rounded-[1.75rem] bg-white text-[#1a1a1e]">{children}</div>
    </div>
  );
}
