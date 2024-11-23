<script lang="ts">
const LABELS = ["|", "/", "-", "\\"];

let i = $state(0);

$effect(() => {
  const interval = setInterval(() => {
    i = (i + 1) % LABELS.length;
  }, 100);
  return () => clearInterval(interval);
});

const label = $derived(LABELS[i]);
</script>

<span class="w-2">{label}</span>
