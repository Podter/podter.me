import type { APIRoute } from "astro";

import { deleteSessionCookie } from "~/lib/auth/cookies";

export const GET: APIRoute = ({ cookies, redirect }) => {
  deleteSessionCookie(cookies);
  return redirect("/guestbook");
};
