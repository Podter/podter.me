<script lang="ts">
import { Avatar } from "bits-ui";

interface AvatarProps {
  src: string;
  alt: string;
  fallback: string;
}

let { src, alt, fallback }: AvatarProps = $props();
</script>

<Avatar.Root
  class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full sm:h-6 sm:w-6"
>
  <Avatar.Image src={src} alt={alt} class="aspect-square h-full w-full" />
  <Avatar.Fallback
    class="flex h-full w-full items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800"
  >
    <span
      class="text-center leading-none text-neutral-700 dark:text-neutral-300 sm:text-[13px]"
    >
      {fallback}
    </span>
  </Avatar.Fallback>
</Avatar.Root>
