import { MousePointer2, Search } from "lucide-react";

/**
 * Quiet schematic thumbnails for the Lab index — enough to recognise each
 * experiment at a glance, never a busy illustration. Decorative only.
 */
export function LabThumb({ id }: { id: string }) {
  return (
    <div aria-hidden className="relative h-full w-full overflow-hidden">
      {id === "ux-detective" ? <Detective /> : null}
      {id === "make-it-better" ? <Better /> : null}
      {id === "which-would-you-choose" ? <Choose /> : null}
      {id === "build-a-button" ? <ButtonStates /> : null}
    </div>
  );
}

function Screen({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-t-[14px] border border-b-0 border-line-strong bg-surface p-2.5 shadow-xs ${className}`}>{children}</div>;
}

const Bar = ({ w, className = "" }: { w: string; className?: string }) => <div className={`h-1.5 rounded-full bg-surface-3 ${className}`} style={{ width: w }} />;

function Detective() {
  return (
    <>
      <Screen className="absolute top-5 bottom-0 left-1/2 w-[44%] -translate-x-1/2 space-y-2">
        <Bar w="55%" className="bg-line-strong" />
        <Bar w="80%" />
        <div className="rounded-md bg-error-soft p-1.5 ring-1 ring-error/40">
          <Bar w="70%" className="bg-error/40" />
        </div>
        <Bar w="65%" />
        <Bar w="40%" />
        <div className="h-4 rounded-md bg-surface-3" />
      </Screen>
      <div className="absolute top-[22%] right-[10%] flex size-11 items-center justify-center rounded-full border-[3px] border-accent bg-accent-soft/60 sm:right-[16%] sm:size-16">
        <Search className="size-4 text-accent-ink sm:size-6" />
      </div>
    </>
  );
}

function Better() {
  return (
    <div className="absolute inset-x-0 top-5 bottom-0 flex items-end justify-center gap-[6%]">
      <Screen className="flex h-full w-[30%] flex-col gap-1.5 opacity-70">
        <div className="h-3 w-1/2 rounded bg-surface-3" />
        <Bar w="70%" />
        <Bar w="50%" />
      </Screen>
      <div className="mb-[18%] self-center text-xl font-light text-ink-2">→</div>
      <Screen className="flex h-full w-[30%] flex-col gap-1.5">
        <Bar w="70%" className="bg-line-strong" />
        <Bar w="50%" />
        <div className="flex-1" />
        <div className="h-5 rounded-md bg-accent" />
      </Screen>
    </div>
  );
}

function Choose() {
  return (
    <div className="absolute inset-x-0 top-5 bottom-0 flex items-end justify-center gap-[8%]">
      {(["A", "B"] as const).map((k) => (
        <Screen key={k} className="relative flex h-full w-[28%] flex-col gap-1.5">
          {k === "A" ? (
            <div className="mb-1 flex flex-col gap-[3px]">
              <span className="h-[2px] w-3 rounded bg-ink-2" />
              <span className="h-[2px] w-3 rounded bg-ink-2" />
              <span className="h-[2px] w-3 rounded bg-ink-2" />
            </div>
          ) : null}
          <Bar w="80%" />
          <Bar w="60%" />
          <Bar w="70%" />
          {k === "B" ? (
            <div className="absolute inset-x-2 bottom-2 flex justify-around border-t border-line pt-1.5">
              {[0, 1, 2, 3].map((n) => (
                <span key={n} className={`size-1.5 rounded-full ${n === 0 ? "bg-accent" : "bg-line-strong"}`} />
              ))}
            </div>
          ) : null}
          <span className="absolute -top-3 -right-3 flex size-7 items-center justify-center rounded-full bg-ink text-[0.75rem] font-bold text-bg">{k}</span>
        </Screen>
      ))}
    </div>
  );
}

function ButtonStates() {
  return (
    <div className="absolute inset-0 flex scale-[0.68] flex-col items-center justify-center gap-2.5 sm:scale-100">
      <div className="relative flex h-8 w-32 items-center justify-center rounded-full bg-accent text-[0.6875rem] font-semibold text-on-accent">
        Default
        <MousePointer2 className="absolute -right-4 -bottom-3 size-5 fill-ink text-bg" />
      </div>
      <div className="flex h-8 w-32 scale-[0.97] items-center justify-center rounded-full bg-accent-press text-[0.6875rem] font-semibold text-on-accent">Active</div>
      <div className="flex h-8 w-32 items-center justify-center rounded-full bg-accent text-[0.6875rem] font-semibold text-on-accent outline-2 outline-offset-2 outline-focus">Focus</div>
      <div className="flex h-8 w-32 items-center justify-center rounded-full border border-dashed border-line-strong bg-surface-2 text-[0.6875rem] font-semibold text-ink-2">Disabled</div>
    </div>
  );
}
