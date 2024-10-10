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
  x: {
    href: "https://x.com/Real_Podter",
    user: "@Real_Podter",
  },
  email: {
    href: "mailto:hello@podter.me",
    user: "hello@podter.me",
  },
} as const as Record<string, { href: string; user: string }>;
