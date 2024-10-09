<script lang="ts">
import { fade } from "svelte/transition";

import { activity, elapsed } from "~/lib/stores/lanyard";
import { time } from "~/lib/stores/time";
import Clock from "./icons/clock.svelte";
</script>

<p
  class="relative inline-flex h-6 items-center text-neutral-700 dark:text-neutral-300"
>
  <Clock size={20} />
  {#if $activity && $elapsed}
    <span transition:fade class="absolute left-8">
      {$activity} • {$elapsed} elapsed
    </span>
  {:else}
    <span transition:fade class="absolute left-8">{$time}</span>
  {/if}
</p>
