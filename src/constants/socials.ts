export const DISCORD_ID = "331793642689789962";

export const SOCIALS = {
  github: {
    href: "https://github.com/Podter",
  },
  discord: {
    href: `https://discord.com/users/${DISCORD_ID}`,
  },
  x: {
    href: "https://x.com/Real_Podter",
  },
  email: {
    href: "mailto:hello@podter.me",
  },
} as const as Record<string, { href: string }>;
