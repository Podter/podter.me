import type { APIRoute } from "astro";
import satori from "satori";
import { html } from "satori-html";

import { OG_HEIGHT, OG_WIDTH } from "~/constants/metadata";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const title = url.searchParams.get("title");
  const description = url.searchParams.get("description");

  const newsreaderFont = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/newsreader@latest/latin-500-normal.ttf",
  ).then((res) => res.arrayBuffer());

  const markup = html`<div
    style="color: black; font-family: Newsreader; font-size: 72;"
  >
    ${title} | ${description}
  </div>`;

  const svg = await satori(markup, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: [
      {
        name: "Newsreader",
        data: newsreaderFont,
        style: "normal",
        weight: 500,
      },
    ],
  });

  const png = await fetch("https://svg-to-png.podter.workers.dev", {
    method: "POST",
    body: svg,
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });

  return png;
};
