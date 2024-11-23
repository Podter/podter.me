import { sha256 } from "@oslojs/crypto/sha2";

import { getD1 } from "~/database";

export async function checkLogin(
  { runtime }: Runtime,
  email: string,
  provider: "github" | "discord",
) {
  const db = getD1({ runtime });

  const existingMessage = await db.query.guestbook.findFirst({
    columns: {
      user: true,
    },
    where: ({ emailHash }, { eq }) =>
      eq(
        emailHash,
        new TextDecoder().decode(sha256(new TextEncoder().encode(email))),
      ),
  });

  if (existingMessage) {
    const isSameProvider = existingMessage.user.includes(provider);
    if (isSameProvider) {
      return true;
    } else {
      return false;
    }
  }

  return true;
}
