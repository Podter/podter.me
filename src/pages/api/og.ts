import type { APIRoute } from "astro";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
// @ts-expect-error .wasm files are not typed
import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm";
import satori from "satori";
import { html } from "satori-html";

import { OG_HEIGHT, OG_WIDTH } from "~/constants/metadata";

export const prerender = false;

async function initResvg() {
  try {
    await initWasm(resvgWasm as WebAssembly.Module);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Already initialized")) {
      return;
    }
    throw err;
  }
}

export const GET: APIRoute = async ({ request, url, locals }) => {
  // @ts-expect-error - request types is wrong
  let response: Response | undefined =
    // @ts-expect-error - request types is wrong
    await locals.runtime.caches.default.match(request);

  if (!response) {
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

    await initResvg();
    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    response = new Response(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, immutable, no-transform, max-age=31536000",
      },
    });
    locals.runtime.ctx.waitUntil(
      // @ts-expect-error - request types is wrong
      locals.runtime.caches.default.put(request, response.clone()),
    );
  }

  return response;
};
