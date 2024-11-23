import type { OAuth2Tokens } from "arctic";
import type { APIRoute } from "astro";

import { checkLogin } from "~/lib/auth/check";
import { setSessionCookie } from "~/lib/auth/cookies";
import { createJWT } from "~/lib/auth/jwt";
import { createDiscord, DISCORD_STATE_COOKIE } from "~/lib/auth/providers";

export const prerender = false;

interface DiscordResponse {
  id: string;
  username: string;
  global_name: string | null;
  email?: string | null;
  verified?: boolean;
}

export const GET: APIRoute = async ({
  locals,
  site,
  cookies,
  redirect,
  url,
}) => {
  const discord = createDiscord(locals, site);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies.get(DISCORD_STATE_COOKIE)?.value ?? null;

  if (!(state && code && storedState && state === storedState)) {
    return new Response(
      "something went wrong. please try again later. (invalid state)",
      {
        status: 400,
      },
    );
  }

  let token: OAuth2Tokens;
  try {
    token = await discord.validateAuthorizationCode(code);
  } catch {
    return new Response(
      "something went wrong. please try again later. (invalid code)",
      { status: 400 },
    );
  }

  const data = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token.accessToken()}`,
    },
  }).then((res) => res.json<DiscordResponse>());

  if (!(data.email && data.verified)) {
    return new Response(
      "an email address is required and must be verified to sign in.",
      { status: 400 },
    );
  }

  const allowed = await checkLogin(locals, data.email, "discord");
  if (!allowed) {
    return new Response(
      "you already have an account with this email address. please sign in with another provider.",
      { status: 400 },
    );
  }

  const { jwt, expires } = createJWT(
    {
      provider: "discord",
      userId: data.id,
      name: data.global_name ?? data.username,
      email: data.email,
    },
    locals.runtime.env.AUTH_SECRET,
  );

  setSessionCookie(cookies, jwt, expires);

  return redirect("/guestbook");
};
