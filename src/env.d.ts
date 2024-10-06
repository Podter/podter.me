/* eslint-disable */
/// <reference path="../.astro/types.d.ts" />
interface Env {
  AUTH_SECRET: string;
  DISCORD_ID: string;
  DISCORD_SECRET: string;
  DISCORD_BOT_TOKEN: string;
  GITHUB_ID: string;
  GITHUB_SECRET: string;
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
