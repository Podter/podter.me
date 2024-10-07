import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { sha256 } from "ohash";

import { getD1, getUtcNow } from "~/database";
import { guestbook } from "~/database/schema";
import { getSession } from "~/lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const session = await getSession(request, locals);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const data = await request.formData();
  const message = data.get("message");

  if (typeof message !== "string" || message.length <= 0) {
    return new Response("Message is required", { status: 400 });
  }

  const db = getD1(locals);
  const existingMessage = await db.query.guestbook.findFirst({
    columns: {
      id: true,
    },
    where: ({ user }, { eq }) => eq(user, session.user.user),
  });

  if (existingMessage) {
    await db
      .update(guestbook)
      .set({
        message,
        updatedAt: getUtcNow(),
      })
      .where(eq(guestbook.id, existingMessage.id));
  } else {
    await db.insert(guestbook).values({
      user: session.user.user,
      message,
      emailHash: sha256(session.user.email),
    });
  }

  await locals.runtime.env.KV_CACHE.delete("guestbook");

  return new Response("OK", { status: 200 });
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  const session = await getSession(request, locals);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = getD1(locals);
  await db.delete(guestbook).where(eq(guestbook.user, session.user.user));

  await locals.runtime.env.KV_CACHE.delete("guestbook");

  return new Response("OK", { status: 200 });
};
