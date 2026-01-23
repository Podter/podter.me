import { Buffer } from "node:buffer";
import type { APIRoute } from "astro";
import { sha256 } from "@oslojs/crypto/sha2";
import { eq } from "drizzle-orm";

import { getD1, getUtcNow } from "~/database";
import { guestbook } from "~/database/schema";
import { getCurrentSession } from "~/lib/auth/cookies";

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const session = getCurrentSession(cookies, locals.runtime.env.AUTH_SECRET);
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
    where: ({ user }, { eq }) => eq(user, session.sub),
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
      user: session.sub,
      message,
      emailHash: Buffer.from(
        sha256(new TextEncoder().encode(session.email)),
      ).toString("hex"),
    });
  }

  await locals.runtime.env.KV_CACHE.delete("guestbook");

  return new Response("OK", { status: 200 });
};

export const DELETE: APIRoute = async ({ cookies, locals }) => {
  const session = getCurrentSession(cookies, locals.runtime.env.AUTH_SECRET);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = getD1(locals);
  await db.delete(guestbook).where(eq(guestbook.user, session.sub));

  await locals.runtime.env.KV_CACHE.delete("guestbook");

  return new Response("OK", { status: 200 });
};
