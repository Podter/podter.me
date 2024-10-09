import { readable } from "svelte/store";

import type { LanyardData, LanyardWebSocketMessage } from "./types";
import { DISCORD_ID } from "~/constants/socials";

const WS_URL = "wss://api.lanyard.rest/socket";
const WS_HEARTBEAT = 30e3;

export const lanyardRawData = readable<LanyardData>(undefined, (set) => {
  if (typeof window === "undefined") return;

  const socket = new WebSocket(WS_URL);
  let interval: ReturnType<typeof setInterval>;

  socket.addEventListener("open", () => {
    socket.send(
      JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: DISCORD_ID,
        },
      }),
    );

    interval = setInterval(() => {
      socket.send(JSON.stringify({ op: 3 }));
    }, WS_HEARTBEAT);
  });

  socket.addEventListener("message", ({ data }: { data: string }) => {
    const { t, d } = JSON.parse(data) as LanyardWebSocketMessage;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (t === "INIT_STATE" || t === "PRESENCE_UPDATE") set(d);
  });

  return () => {
    socket.close();
    // @ts-expect-error - this is a valid clearInterval call
    clearInterval(interval);
  };
});
