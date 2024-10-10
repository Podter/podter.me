import { derived } from "svelte/store";

import type { LanyardTimestamps } from "./types";
import { lanyardRawData } from "./raw-data";

const padding = (n: number) => (n < 10 ? `0${n}` : n);

const DAY = 1000 * 60 * 60 * 24;
const HOUR = 1000 * 60 * 60;
const MINUTE = 1000 * 60;
const SECOND = 1000;

function getTime(timestamps?: LanyardTimestamps): string | null {
  if (!timestamps) {
    return null;
  }

  const { start } = timestamps;
  if (!start) {
    return null;
  }

  const now = new Date();
  const startDate = start ? new Date(start) : now;
  const miliseconds = now.getTime() - startDate.getTime();
  const days = Math.floor(miliseconds / DAY);
  const hours = Math.floor((miliseconds % DAY) / HOUR);
  const minutes = Math.floor((miliseconds % HOUR) / MINUTE);
  const seconds = Math.floor((miliseconds % MINUTE) / SECOND);

  if (days > 0) {
    return `${days > 1 ? `${days} days` : `${days} day`}`;
  }

  return `${hours ? `${hours}:` : ""}${padding(minutes)}:${padding(seconds)}`;
}

export const elapsed = derived(lanyardRawData, ($data, set) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!$data || $data.activities.length < 1) {
    return set(undefined);
  }
  const { timestamps } = $data.activities[0];

  const interval = setInterval(() => {
    set(getTime(timestamps));
  }, 200);

  // @ts-expect-error - this is a valid clearInterval call
  return () => clearInterval(interval);
});
