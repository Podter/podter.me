import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
    VERCEL_URL: z
      .string()
      .optional()
      .transform((v) => (v ? `https://${v}` : undefined)),
    PORT: z.coerce.number().default(3000),
  },
  server: {
    POSTGRES_URL: z.string(),
    AUTH_SECRET: z.string(),
    DISCORD_ID: z.string(),
    DISCORD_SECRET: z.string(),
    DISCORD_BOT_TOKEN: z.string(),
    GITHUB_ID: z.string(),
    GITHUB_SECRET: z.string(),
    WAKATIME_SECRET_API_KEY: z.string(),
    STEAM_API_KEY: z.string(),
    STEAMGRIDDB_API_KEY: z.string(),
  },
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },
  runtimeEnv: {
    POSTGRES_URL: process.env.POSTGRES_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    DISCORD_ID: process.env.DISCORD_ID,
    DISCORD_SECRET: process.env.DISCORD_SECRET,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    WAKATIME_SECRET_API_KEY: process.env.WAKATIME_SECRET_API_KEY,
    STEAM_API_KEY: process.env.STEAM_API_KEY,
    STEAMGRIDDB_API_KEY: process.env.STEAMGRIDDB_API_KEY,

    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,

    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    PORT: process.env.PORT,
  },
});
