import type { APIRoute } from "astro";
import satori from "satori";
import { html } from "satori-html";

import { OG_HEIGHT, OG_WIDTH } from "~/constants/metadata";

export const GET: APIRoute = async ({ url, site, rewrite }) => {
  const type = url.searchParams.get("type");
  if (type !== "svg") {
    const newUrl = new URL(url);
    newUrl.searchParams.set("type", "svg");
    return rewrite(
      new Request(newUrl, {
        cf: {
          image: {
            format: "png",
          },
        },
      }),
    );
  }

  const title = url.searchParams.get("title");
  const description = url.searchParams.get("description");

  const newsreaderFont = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/newsreader@latest/latin-500-normal.ttf",
  ).then((res) => res.arrayBuffer());
  const geistFont = await fetch(
    "https://github.com/vercel/geist-font/raw/main/packages/next/dist/fonts/geist-sans/Geist-Medium.ttf",
  ).then((res) => res.arrayBuffer());

  const bgUrl = import.meta.env.DEV
    ? `http://localhost:4321/og-bg.png`
    : new URL("/og-bg.png", site).toString();

  const markup = html`<div
    style="position: relative; display: flex; width: 100%; height: 100%; background-image: url(${bgUrl});"
  >
    <div
      tw="absolute right-[4.5rem] top-[4.5rem] flex h-full w-full items-start justify-end"
    >
      <span
        tw="text-right text-7xl font-medium leading-tight text-neutral-50"
        style="font-family: Newsreader; max-width: 66.666667%;"
      >
        ${title}
      </span>
    </div>
    <div
      tw="absolute bottom-[5.125rem] right-[4.5rem] flex h-full w-full items-end justify-end"
    >
      <span
        tw="text-right text-2xl font-medium text-neutral-400"
        style="font-family: Geist;"
      >
        ${description}
      </span>
    </div>
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
      {
        name: "Geist",
        data: geistFont,
        style: "normal",
        weight: 500,
      },
    ],
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
};
