"use client";

import { CircleCheck } from "lucide-react";
import { Tag } from "@/components/ui/layout";
import { useHydrated, useProgress } from "@/components/progress/store";

/** “Completed” tag for a Lab card — rendered only once local progress is known. */
export function LabDoneBadge({ id, label }: { id: string; label: string }) {
  const { labs } = useProgress();
  const hydrated = useHydrated();
  if (!hydrated || !labs.includes(id)) return null;
  return (
    <Tag tone="success">
      <CircleCheck className="size-3.5" aria-hidden /> {label}
    </Tag>
  );
}
