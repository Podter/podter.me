// @ts-check

import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: "cloudflare",
  }),
  integrations: [tailwind()],
});
