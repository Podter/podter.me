import type { APIRoute } from "astro";
import { generateState } from "arctic";

import {
  createGitHub,
  GITHUB_STATE_COOKIE,
  STATE_COOKIE_OPTIONS,
} from "~/lib/auth/providers";

export const GET: APIRoute = ({ locals, site, cookies, redirect }) => {
  const github = createGitHub(locals, site);

  const state = generateState();
  const url = github.createAuthorizationURL(state, ["read:user", "user:email"]);

  cookies.set(GITHUB_STATE_COOKIE, state, STATE_COOKIE_OPTIONS);

  return redirect(url.toString());
};
