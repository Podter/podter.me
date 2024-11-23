<script lang="ts">
import Copy from "../icons/copy.svelte";

export let id = "code-block";

let label = "copy";

async function copyCode() {
  try {
    const code = document
      .getElementById(id)
      ?.getElementsByTagName("code")[0].innerText;
    if (!code) {
      throw new Error("No code found");
    }
    await navigator.clipboard.writeText(code);
    label = "copied!";
  } catch (e) {
    console.error(e);
    label = "error!";
  } finally {
    setTimeout(() => {
      label = "copy";
    }, 1000);
  }
}
</script>

<button
  class="absolute -top-6 right-0 inline-flex items-center gap-1 pb-1 text-sm text-neutral-600 opacity-0 transition-[opacity,color] hover:text-neutral-950 group-hover:opacity-100 dark:text-neutral-400 dark:hover:text-neutral-50"
  on:click={copyCode}
>
  <Copy size={12} />
  {label}
</button>
