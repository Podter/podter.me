import { cache } from "~/lib/cache";

interface DiscordResponse {
  global_name: string | null;
  username: string;
  id: string;
  avatar: string;
}

interface GitHubResponse {
  name: string | null;
  login: string;
  html_url: string;
  avatar_url: string;
}

interface UserData {
  name: string;
  url: string;
  avatar: string;
}

export const fetchUser = cache(
  async (locals, user: string): Promise<UserData> => {
    const { DISCORD_BOT_TOKEN, GITHUB_ID, GITHUB_SECRET } = locals.runtime.env;

    const [provider, userId] = user.split(":");

    if (provider === "discord") {
      const data = await fetch(`https://discord.com/api/v9/users/${userId}`, {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }).then((res) => res.json<DiscordResponse>());

      return {
        name: data.global_name ?? data.username,
        url: `https://discord.com/users/${data.id}`,
        avatar: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=48`,
      };
    }

    if (provider === "github") {
      const data = await fetch(`https://api.github.com/user/${userId}`, {
        headers: {
          Authorization: `Basic ${btoa(`${GITHUB_ID}:${GITHUB_SECRET}`)}`,
          "User-Agent": "podter-website",
        },
      }).then((res) => res.json<GitHubResponse>());

      return {
        name: data.name ?? data.login,
        url: data.html_url,
        avatar: data.avatar_url,
      };
    }

    throw new Error("Unknown provider");
  },
  (_locals, user) => `user:${user}`,
  {
    expirationTtl: 172800,
  },
);
