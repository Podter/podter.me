/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { KVNamespacePutOptions } from "@cloudflare/workers-types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (locals: Runtime, ...args: any[]) => Promise<any>;

export function cache<T extends Callback>(
  callback: T,
  key: string | ((...args: Parameters<T>) => string),
  opts?: KVNamespacePutOptions,
): T {
  async function cachedCallback(...args: Parameters<typeof callback>) {
    const { runtime } = args[0];
    const cacheKey = typeof key === "function" ? key(...args) : key;

    const cached = await runtime.env.KV_CACHE.get(cacheKey);
    if (cached) {
      const { data } = JSON.parse(cached);
      return data;
    }

    // @ts-expect-error - args[0] already passed
    const data = await callback(...args);
    runtime.ctx.waitUntil(
      runtime.env.KV_CACHE.put(cacheKey, JSON.stringify({ data }), opts),
    );

    return data;
  }

  return cachedCallback as T;
}
