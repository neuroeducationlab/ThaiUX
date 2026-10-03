/**
 * Every effect id, in gallery order. Kept apart from the effect content so
 * client components can count or list effects without bundling every
 * effect’s text. A content check keeps this list and `effects` in sync.
 */
export const effectIds = [
  "water-ripple",
  "xray",
  "flower-cursor",
  "particles",
  "parallax",
  "image-trail",
  "magnetic",
  "tilt",
  "lanyard",
  "spotlight",
  "gooey",
  "exploded-view",
  "hover-preview",
  "glow-cards",
  "spring-drag",
  "before-after",
  "kinetic-type",
  "text-scramble",
  "celebrate",
  "tactile",
  "hover-styles",
] as const;

export type EffectId = (typeof effectIds)[number];
