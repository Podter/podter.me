"use client";

import { useCallback } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import useSound from "use-sound";

import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export default function ThemeSwitch() {
  const { resolvedTheme: theme, setTheme } = useTheme();

  const [playSwitchOff] = useSound("/sounds/switch-off.mp3");
  const [playSwitchOn] = useSound("/sounds/switch-on.mp3");

  const toggleTheme = useCallback(() => {
    if (theme === "dark") {
      setTheme("light");
      playSwitchOn();
    } else {
      setTheme("dark");
      playSwitchOff();
    }
  }, [playSwitchOff, playSwitchOn, setTheme, theme]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          className="h-6 w-6"
          variant="ghost"
          onClick={toggleTheme}
        >
          <SunIcon className="h-4 w-4 dark:hidden" width={16} height={16} />
          <MoonIcon
            className="hidden h-4 w-4 dark:block"
            width={16}
            height={16}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle theme</p>
      </TooltipContent>
    </Tooltip>
  );
}
