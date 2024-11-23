import type { AstroCookies, AstroCookieSetOptions } from "astro";

import { verifyJWT } from "./jwt";

const COOKIE_NAME = "session";
export const COOKIE_OPTIONS = {
  path: "/",
  secure: import.meta.env.PROD,
  httpOnly: true,
  sameSite: "lax",
} satisfies AstroCookieSetOptions;

export function getCurrentSession(cookies: AstroCookies, secret: string) {
  const jwt = cookies.get(COOKIE_NAME)?.value ?? null;
  if (!jwt) {
    return null;
  }

  try {
    const result = verifyJWT(jwt, secret);
    return result;
  } catch {
    return null;
  }
}

export function setSessionCookie(
  cookies: AstroCookies,
  jwt: string,
  expiresAt: Date,
): void {
  cookies.set(COOKIE_NAME, jwt, {
    ...COOKIE_OPTIONS,
    expires: expiresAt,
  });
}

export function deleteSessionCookie(cookies: AstroCookies): void {
  cookies.set(COOKIE_NAME, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
}
