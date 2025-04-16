import type { APIRoute } from "astro";
import { generateState } from "arctic";

import {
  createDiscord,
  DISCORD_STATE_COOKIE,
  STATE_COOKIE_OPTIONS,
} from "~/lib/auth/providers";

export const prerender = false;

export const GET: APIRoute = ({ locals, site, cookies, redirect }) => {
  const discord = createDiscord(locals, site);

  const state = generateState();
  const url = discord.createAuthorizationURL(state, null, [
    "identify",
    "email",
  ]);

  cookies.set(DISCORD_STATE_COOKIE, state, STATE_COOKIE_OPTIONS);

  return redirect(url.toString());
};
