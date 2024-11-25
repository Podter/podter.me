export const DISCORD_ID = "331793642689789962";

export const STEAM_ID = "76561198369112596";

export const SOCIALS = {
  github: {
    href: "https://github.com/Podter",
    user: "@Podter",
  },
  discord: {
    href: `https://discord.com/users/${DISCORD_ID}`,
    user: "@podter",
  },
  bluesky: {
    href: "https://bsky.app/profile/podter.me",
    user: "@podter.me",
  },
  email: {
    href: "mailto:hi@podter.me",
    user: "hi@podter.me",
  },
} as const as Record<string, { href: string; user: string }>;
