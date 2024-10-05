<script lang="ts">
import { time } from "~/lib/stores/time";
import Clock from "./icons/clock.svelte";
</script>

<p
  class="inline-flex items-center gap-3 text-neutral-700 dark:text-neutral-300"
>
  <Clock size={20} />
  {$time}
</p>
