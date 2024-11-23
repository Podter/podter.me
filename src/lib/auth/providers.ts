import type { AstroCookieSetOptions } from "astro";
import { Discord, GitHub } from "arctic";

const COOKIE_PREFIX = "oauth_state";
export const DISCORD_STATE_COOKIE = `${COOKIE_PREFIX}_discord`;
export const GITHUB_STATE_COOKIE = `${COOKIE_PREFIX}_github`;

export const STATE_COOKIE_OPTIONS = {
  path: "/",
  secure: import.meta.env.PROD,
  httpOnly: true,
  maxAge: 600, // 10 minutes
  sameSite: "lax",
} satisfies AstroCookieSetOptions;

export function createDiscord({ runtime }: Runtime, site?: URL) {
  return new Discord(
    runtime.env.DISCORD_ID,
    runtime.env.DISCORD_SECRET,
    new URL(
      "/auth/discord/callback",
      import.meta.env.DEV ? "http://localhost:4321" : site,
    ).toString(),
  );
}

export function createGitHub({ runtime }: Runtime, site?: URL) {
  return new GitHub(
    runtime.env.GITHUB_ID,
    runtime.env.GITHUB_SECRET,
    new URL(
      "/auth/github/callback",
      import.meta.env.DEV ? "http://localhost:4321" : site,
    ).toString(),
  );
}
