<script lang="ts">
import { cn } from "~/lib/utils";
import LogOut from "../icons/log-out.svelte";
import Trash from "../icons/trash.svelte";
import Spinner from "../spinner.svelte";

interface Props {
  name: string;
  initialMessage?: string;
}

let { name, initialMessage }: Props = $props();

const action = $derived(initialMessage ? "edit" : "sign");

let isLoading = $state(false);
let isError = $state(false);

async function submit(e: SubmitEvent) {
  e.preventDefault();
  if (isLoading) return;

  isLoading = true;
  isError = false;

  const formData = new FormData(e.currentTarget as HTMLFormElement);
  const res = await fetch("/api/guestbook", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    isError = true;
    isLoading = false;
  } else {
    location.reload();
  }
}

async function deleteMessage() {
  if (isLoading) return;

  isLoading = true;
  isError = false;

  const res = await fetch("/api/guestbook", {
    method: "DELETE",
  });

  if (!res.ok) {
    isError = true;
    isLoading = false;
  } else {
    location.reload();
  }
}
</script>

<div class="mt-6 flex w-full flex-col space-y-2 sm:max-w-96">
  <p class="text-sm text-neutral-700 dark:text-neutral-300">
    signed in as <span class="font-semibold">{name}</span>
  </p>
  <form class="flex w-full space-x-2" onsubmit={submit}>
    <input
      class={cn(
        "flex h-9 w-full border-b border-neutral-400 bg-transparent py-1 text-sm transition-colors dark:border-neutral-600",
        "placeholder:text-neutral-600 dark:placeholder:text-neutral-400",
        "focus-visible:border-neutral-600 focus-visible:outline-none dark:focus-visible:border-neutral-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isError && "!border-red-500",
      )}
      placeholder="write something…"
      type="text"
      name="message"
      required
      disabled={isLoading}
      value={initialMessage ?? ""}
    />
    <button
      class={cn(
        "inline-flex items-center gap-1 text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      )}
      disabled={isLoading}
      type="submit"
    >
      {#if isLoading}
        {action} <Spinner />
      {:else}
        {action}
        <div class="w-2"></div>
      {/if}
    </button>
  </form>
  {#if isError}
    <p class="text-sm text-red-500">an error occurred, please try again.</p>
  {/if}
  <div class="flex w-full space-x-3">
    <a
      href="/auth/logout"
      class="inline-flex items-center gap-1 text-sm text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
    >
      <LogOut size={12} />
      sign out
    </a>
    {#if initialMessage}
      <button
        onclick={deleteMessage}
        disabled={isLoading}
        class={cn(
          "inline-flex items-center gap-1 text-sm text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50",
          "disabled:pointer-events-none",
        )}
        type="button"
      >
        <Trash size={12} />
        delete
      </button>
    {/if}
  </div>
</div>
