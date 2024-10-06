import type { AuthConfig, Session } from "@auth/core/types";
import { Auth, customFetch } from "@auth/core";
import Discord from "@auth/core/providers/discord";
import GitHub from "@auth/core/providers/github";

export const AUTH_API = "/api/auth";

export async function getSession(
  req: Request,
  locals: Runtime,
): Promise<Session | null> {
  const url = new URL(`${AUTH_API}/session`, req.url);
  const response = await Auth(
    new Request(url, { headers: req.headers }),
    authConfig(locals),
  );
  const { status = 200 } = response;

  const data = await response.json();

  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data as Session;
  // @ts-expect-error - data should have a message
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  throw new Error(data.message);
}

export const authConfig = ({ runtime }: Runtime): AuthConfig => ({
  providers: [
    Discord({
      clientId: runtime.env.DISCORD_ID,
      clientSecret: runtime.env.DISCORD_SECRET,
      [customFetch]: fetch.bind(globalThis),
    }),
    GitHub({
      clientId: runtime.env.GITHUB_ID,
      clientSecret: runtime.env.GITHUB_SECRET,
      [customFetch]: fetch.bind(globalThis),
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // async signIn({ user, account }) {
    //   if (user.email) {
    //     const emailHash = sha256(user.email);

    //     const db = getD1();
    //     const existingMessages = await db
    //       .select({ user: guestbook.user })
    //       .from(guestbook)
    //       .where(eq(guestbook.emailHash, emailHash))
    //       .limit(1);

    //     const existingMessage = existingMessages[0];
    //     if (existingMessage) {
    //       const isSameProvider = existingMessage.user.includes(
    //         account?.provider!,
    //       );
    //       if (isSameProvider) {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     }

    //     return true;
    //   }

    //   return false;
    // },
    jwt({ account, profile, token }) {
      if (account && profile) {
        if (account.provider === "discord") {
          token.name = profile.global_name as string;
          token.provider = account.provider;
          token.userId = profile.id;
          token.email = profile.email;

          return token;
        }

        if (account.provider === "github") {
          token.name = profile.name;
          token.provider = account.provider;
          token.userId = profile.id;
          token.email = profile.email;

          return token;
        }
      }

      return token;
    },
    session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      session.user.name = token.name!;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      session.user.user = `${token.provider}:${token.userId}`;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      session.user.email = token.email!;

      return session;
    },
  },
  basePath: AUTH_API,
  trustHost: true,
  secret: runtime.env.AUTH_SECRET,
});

declare module "@auth/core/types" {
  interface Session {
    user: {
      name: string;
      user: string;
      email: string;
    };
  }
}
