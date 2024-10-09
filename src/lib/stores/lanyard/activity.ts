import { derived } from "svelte/store";

import { lanyardRawData } from "./raw-data";

export const activity = derived(lanyardRawData, ($data) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!$data || $data.activities.length < 1) {
    return undefined;
  }
  const activity = $data.activities[0];

  switch (activity.type) {
    case 0:
      return `playing ${activity.name}`.toLowerCase();
    case 1:
      return `streaming ${activity.name}`.toLowerCase();
    case 2:
      return `listening to ${activity.name}`.toLowerCase();
    case 3:
      return `watching ${activity.name}`.toLowerCase();
    case 5:
      return `competing in ${activity.name}`.toLowerCase();
    default:
      return undefined;
  }
});
