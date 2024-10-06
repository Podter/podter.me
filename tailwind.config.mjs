// @ts-check

import typography from "@tailwindcss/typography";
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["GeistSans", ...fontFamily.sans],
        mono: ["GeistMono", ...fontFamily.mono],
        serif: ["Newsreader", ...fontFamily.serif],
      },
    },
  },
  plugins: [typography],
};
