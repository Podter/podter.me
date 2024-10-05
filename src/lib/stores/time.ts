import { readable } from "svelte/store";

const formatter = new Intl.DateTimeFormat("en-UK", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
  timeZone: "Asia/Bangkok",
});

const getTime = () =>
  formatter.format(Date.now()).toLowerCase().replace("at", "•");

export const time = readable<string>(getTime(), (set) => {
  const interval = setInterval(() => set(getTime()), 1000);
  return () => clearInterval(interval);
});
