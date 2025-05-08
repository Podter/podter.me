// @ts-check

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import blackout from "./src/constants/themes/lambda-blackout.json";
import whiteout from "./src/constants/themes/lambda-whiteout.json";

// https://astro.build/config
export default defineConfig({
  site: "https://podter.me",
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: "cloudflare",
  }),
  integrations: [
    tailwind(),
    svelte(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/teapot"),
    }),
    robotsTxt({
      policy: [
        {
          allow: ["/"],
          disallow: ["/teapot"],
          userAgent: "*",
        },
      ],
    }),
  ],
  security: {
    checkOrigin: true,
  },
  markdown: {
    gfm: true,
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        // @ts-expect-error - this is a valid theme
        light: whiteout,
        // @ts-expect-error - this is a valid theme
        dark: blackout,
      },
    },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          test: ["h2", "h3"],
          properties: {
            class: "rehype-autolink-headings",
          },
        },
      ],
    ],
  },
});
