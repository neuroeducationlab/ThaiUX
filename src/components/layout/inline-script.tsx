"use client";

/**
 * Runs synchronously during HTML parsing (before first paint) on full page
 * loads. On the client it renders as inert text/plain, so React doesn't warn
 * about rendering a <script> (pattern from the Next.js "preventing flash" guide).
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
