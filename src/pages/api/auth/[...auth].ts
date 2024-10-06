import type { AuthAction } from "@auth/core/types";
import type { APIRoute } from "astro";
import { Auth } from "@auth/core";
import { parseString } from "set-cookie-parser";

import { AUTH_API, authConfig } from "~/lib/auth";

const ACTIONS: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
];

const SET_COOKIE_ACTIONS: AuthAction[] = ["callback", "signin", "signout"];

const handler: APIRoute = async ({ cookies, request, url, locals }) => {
  const action = url.pathname
    .slice(AUTH_API.length + 1)
    .split("/")[0] as AuthAction;

  if (!ACTIONS.includes(action) || !url.pathname.startsWith(AUTH_API + "/")) {
    return new Response(null, { status: 404 });
  }

  const config = authConfig(locals);
  const res = await Auth(request, config);

  if (SET_COOKIE_ACTIONS.includes(action)) {
    const getSetCookie = res.headers.getSetCookie();
    if (getSetCookie.length > 0) {
      getSetCookie.forEach((cookie) => {
        const { name, value, ...options } = parseString(cookie);
        cookies.set(
          name,
          value,
          options as Parameters<(typeof cookies)["set"]>[2],
        );
      });
      res.headers.delete("Set-Cookie");
    }
  }
  return res;
};

export const GET = handler;
export const POST = handler;
