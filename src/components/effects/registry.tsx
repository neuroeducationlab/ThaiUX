"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { EffectId } from "@/content/effects";

/**
 * One demo per effect, each in its own chunk and rendered only on the
 * client. Cards mount their demo just before it scrolls into view, so the
 * Effects page downloads demos as people reach them.
 */
export const effectDemos: Record<EffectId, ComponentType> = {
  "water-ripple": dynamic(() => import("./demos/water-ripple"), { ssr: false }),
  xray: dynamic(() => import("./demos/xray"), { ssr: false }),
  "flower-cursor": dynamic(() => import("./demos/flower-cursor"), { ssr: false }),
  particles: dynamic(() => import("./demos/particles"), { ssr: false }),
  parallax: dynamic(() => import("./demos/parallax"), { ssr: false }),
  "image-trail": dynamic(() => import("./demos/image-trail"), { ssr: false }),
  magnetic: dynamic(() => import("./demos/magnetic"), { ssr: false }),
  tilt: dynamic(() => import("./demos/tilt"), { ssr: false }),
  lanyard: dynamic(() => import("./demos/lanyard"), { ssr: false }),
  spotlight: dynamic(() => import("./demos/spotlight"), { ssr: false }),
  gooey: dynamic(() => import("./demos/gooey"), { ssr: false }),
  "exploded-view": dynamic(() => import("./demos/exploded-view"), { ssr: false }),
  "hover-preview": dynamic(() => import("./demos/hover-preview"), { ssr: false }),
  "glow-cards": dynamic(() => import("./demos/glow-cards"), { ssr: false }),
  "spring-drag": dynamic(() => import("./demos/spring-drag"), { ssr: false }),
  "before-after": dynamic(() => import("./demos/before-after"), { ssr: false }),
  "kinetic-type": dynamic(() => import("./demos/kinetic-type"), { ssr: false }),
  "text-scramble": dynamic(() => import("./demos/text-scramble"), { ssr: false }),
  celebrate: dynamic(() => import("./demos/celebrate"), { ssr: false }),
  tactile: dynamic(() => import("./demos/tactile"), { ssr: false }),
  "hover-styles": dynamic(() => import("./demos/hover-styles"), { ssr: false }),
};
