<script lang="ts">
import { onMount } from "svelte";

const LABELS = ["|", "/", "-", "\\"];

let i = 0;

onMount(() => {
  const interval = setInterval(() => {
    i = (i + 1) % LABELS.length;
  }, 100);
  return () => clearInterval(interval);
});

$: label = LABELS[i];
</script>

<span class="w-2">{label}</span>
