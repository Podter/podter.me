import { unstable_cache as cache } from "next/cache";
import { CodeIcon } from "@radix-ui/react-icons";
import { z } from "zod";

import { env } from "~/env.mjs";

const WakaTimeResponseSchema = z.object({
  data: z.object({
    human_readable_total_including_other_language: z.string(),
  }),
});

const getWakaTime = cache(
  async () => {
    const rawData = await fetch(
      "https://wakatime.com/api/v1/users/current/stats/last_7_days",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            env.WAKATIME_SECRET_API_KEY || "",
          ).toString("base64")}`,
        },
      },
    ).then((res) => res.json());
    const { data } = WakaTimeResponseSchema.parse(rawData);
    return data.human_readable_total_including_other_language;
  },
  ["wakatime-total"],
  { revalidate: 86400 },
);

export default async function WakaTime() {
  const total = await getWakaTime();
  return (
    <div className="flex items-center text-center sm:text-end">
      <CodeIcon width={14} height={14} />
      <p className="ml-1 text-sm text-muted-foreground">
        Coding for {total} last 7 days
      </p>
    </div>
  );
}
