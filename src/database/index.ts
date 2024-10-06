import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export function getUtcNow() {
  const date = new Date();
  return new Date(date.toISOString());
}

export function getD1({ runtime }: Runtime) {
  const db = drizzle(runtime.env.D1_DATABASE, { schema });
  return db;
}
