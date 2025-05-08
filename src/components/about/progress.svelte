<script lang="ts">
import type { WithoutChildrenOrChild } from "bits-ui";
import { Progress as ProgressPrimitive } from "bits-ui";

import { cn } from "~/lib/utils";

let {
  ref = $bindable(null),
  class: className,
  max = 100,
  value,
  ...restProps
}: WithoutChildrenOrChild<ProgressPrimitive.RootProps> = $props();
</script>

<ProgressPrimitive.Root
  bind:ref={ref}
  class={cn(
    "relative h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800",
    className,
  )}
  value={value}
  max={max}
  {...restProps}
>
  <div
    class="h-full w-full flex-1 rounded-full bg-neutral-950 transition-transform dark:bg-neutral-50"
    style={`transform: translateX(-${100 - (100 * (value ?? 0)) / max}%)`}
  ></div>
</ProgressPrimitive.Root>
