import type { APIRoute } from "astro";

const UMAMI_HOST = "umami.podter.me";

const handler: APIRoute = async ({ params, request, locals }) => {
  const req = new Request(request);
  request.headers.delete("cookie");

  if (params.path === "script.js") {
    // @ts-expect-error - response type is wrong
    let response: Response | undefined =
      // @ts-expect-error - response type is wrong
      await locals.runtime.caches.default.match(request);
    if (!response) {
      response = await fetch(`https://${UMAMI_HOST}/script.js`, req);
      locals.runtime.ctx.waitUntil(
        // @ts-expect-error - response type is wrong
        locals.runtime.caches.default.put(request, response.clone()),
      );
    }
    return response;
  }

  const umamiUrl = new URL(params.path ?? "", `https://${UMAMI_HOST}`);
  return await fetch(umamiUrl, req);
};

export const prerender = false;

export const GET = handler;
export const POST = handler;
