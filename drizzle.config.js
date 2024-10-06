// @ts-check

/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./src/database/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
};
