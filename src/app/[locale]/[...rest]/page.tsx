import { notFound } from "next/navigation";

/** Any unknown path inside a locale gets the localized 404 (with header and footer). */
export default function CatchAll() {
  notFound();
}
