<script lang="ts">
  import { Dialog } from "bits-ui";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  import { flyAndScale } from "~/lib/transition";
  import { cn } from "~/lib/utils";

  const KONAMI_CODE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  let dialogOpen = false;
  let konamiIndex = 0;

  onMount(() => {
    const controller = new AbortController();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "style") {
          dialogOpen = false;
          window.location.reload();
        }
      });
    });

    window.addEventListener(
      "keydown",
      (e) => {
        if (e.code === KONAMI_CODE[konamiIndex]) {
          konamiIndex++;
          if (konamiIndex === KONAMI_CODE.length) {
            dialogOpen = !dialogOpen;
            konamiIndex = 0;
            setTimeout(() => {
              observer.observe(document.getElementById("canvas")!, {
                attributes: true,
                attributeFilter: ["style"],
              });
            }, 1000);
          }
        } else {
          konamiIndex = 0;
        }
      },
      {
        signal: controller.signal,
      },
    );

    return () => {
      controller.abort();
      observer.disconnect();
    };
  });

  const IDBFS_DB_VERSION = 21;
  const IDBFS_DB_STORE_NAME = "FILE_DATA";
  const DEFAULT_OPTIONS_TXT = `key-Inventory=E
key-DropBlock=Q
key-FlyDown=ShiftLeft
key-FlyUp=Space
key-Speed=None`;

  onMount(() => {
    const controller = new AbortController();

    const db = window.indexedDB.open("/classicube", IDBFS_DB_VERSION);
    db.addEventListener(
      "upgradeneeded",
      () => {
        if (!db.result.objectStoreNames.contains(IDBFS_DB_STORE_NAME)) {
          const store = db.result.createObjectStore(IDBFS_DB_STORE_NAME);
          if (!store.indexNames.contains("timestamp")) {
            store.createIndex("timestamp", "timestamp", {
              unique: false,
            });
          }
          store.put(
            {
              timestamp: Date.now(),
              mode: 32768,
              contents: new TextEncoder().encode(DEFAULT_OPTIONS_TXT),
            },
            "/classicube/options.txt",
          );
        }
        controller.abort();
      },
      {
        signal: controller.signal,
      },
    );

    return () => {
      controller.abort();
    };
  });
</script>

<Dialog.Root
  bind:open={dialogOpen}
  closeOnEscape={false}
  closeOnOutsideClick={false}
>
  <Dialog.Portal>
    <Dialog.Overlay
      class="bg-neutral-100/80 dark:bg-neutral-900/80 fixed inset-0 z-40 backdrop-blur-sm"
      transition={fade}
      transitionConfig={{ duration: 150 }}
    />
    <Dialog.Content
      class={cn(
        "bg-neutral-100 dark:bg-neutral-900 z-50 p-6 focus-visible:outline-none",
        "top-6 left-6 bottom-6 right-6 fixed",
        "border border-dashed border-neutral-400 dark:border-neutral-600",
      )}
      transition={flyAndScale}
      transitionConfig={{ duration: 300 }}
    >
      <canvas
        id="canvas"
        class="block bg-black p-0 border-none w-full h-full"
        tabindex="-1"
        on:contextmenu={(e) => e.preventDefault()}
      ></canvas>
      <script>
        var Module = {
          arguments: [],
          print: console.log,
          printErr: console.error,
          onAbort: function () {
            console.error("Aborted");
          },
          canvas: (function () {
            const canvas = document.getElementById("canvas");
            function resizeCanvas() {
              const rect = canvas.getBoundingClientRect();
              canvas.setAttribute("width", String(rect.width));
              canvas.setAttribute("height", String(rect.height));
            }
            resizeCanvas();
            window.addEventListener("resize", resizeCanvas);
            return canvas;
          })(),
          setStatus: function (text) {
            console.log(text);
          },
        };
      </script>
      <script async src="/classicube/classicube.js"></script>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
