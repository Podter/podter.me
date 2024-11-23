import type { OAuth2Tokens } from "arctic";
import type { APIRoute } from "astro";

import { checkLogin } from "~/lib/auth/check";
import { setSessionCookie } from "~/lib/auth/cookies";
import { createJWT } from "~/lib/auth/jwt";
import { createGitHub, GITHUB_STATE_COOKIE } from "~/lib/auth/providers";

export const prerender = false;

interface GitHubUser {
  id: number;
  login: string; // username
  name: string | null;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

export const GET: APIRoute = async ({
  locals,
  site,
  cookies,
  redirect,
  url,
}) => {
  const github = createGitHub(locals, site);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies.get(GITHUB_STATE_COOKIE)?.value ?? null;

  if (!(state && code && storedState && state === storedState)) {
    return new Response(
      "something went wrong. please try again later. (invalid state)",
      { status: 400 },
    );
  }

  let token: OAuth2Tokens;
  try {
    token = await github.validateAuthorizationCode(code);
  } catch {
    return new Response(
      "something went wrong. please try again later. (invalid code)",
      { status: 400 },
    );
  }

  const [user, emails] = await Promise.all([
    fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token.accessToken()}`,
        "User-Agent": "podter-website",
      },
    }).then((res) => res.json<GitHubUser>()),
    fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${token.accessToken()}`,
        "User-Agent": "podter-website",
      },
    }).then((res) => res.json<GitHubEmail[]>()),
  ]);

  const email = emails.find((email) => email.primary && email.verified)?.email;
  if (!email) {
    return new Response(
      "an email address is required and must be verified to sign in.",
      { status: 400 },
    );
  }

  const allowed = await checkLogin(locals, email, "github");
  if (!allowed) {
    return new Response(
      "you already have an account with this email address. please sign in with another provider.",
      { status: 400 },
    );
  }

  const { jwt, expires } = createJWT(
    {
      provider: "github",
      userId: user.id.toString(),
      name: user.name ?? user.login,
      email,
    },
    locals.runtime.env.AUTH_SECRET,
  );

  setSessionCookie(cookies, jwt, expires);

  return redirect("/guestbook");
};
