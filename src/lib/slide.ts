import type {
  TransitionAnimationPair,
  TransitionDirectionalAnimations,
} from "astro";

const ANIMATION = {
  old: {
    name: "slideOut",
    duration: "300ms",
  },
  new: {
    name: "slideIn",
    duration: "300ms",
    delay: "100ms",
  },
} satisfies TransitionAnimationPair;

export const SLIDE_ANIMATION = {
  forwards: ANIMATION,
  backwards: ANIMATION,
} satisfies TransitionDirectionalAnimations;
