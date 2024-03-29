import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef, useCallback, useMemo } from "react";
import { LayoutGroup, LazyMotion, m, MotionConfig } from "framer-motion";
import { useTheme } from "next-themes";

import { pages } from "~/constants/pages";
import { BaseLink, indicatorClassNames } from "./base-link";

export default function AnimatedMenu() {
  const domMax = useCallback(
    () => import("./animation").then((mod) => mod.default),
    [],
  );

  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user">
        <LayoutGroup>
          {Object.entries(pages).map(([path, { name }], i) => (
            <BaseLink key={i} name={name} href={path}>
              <Indicator />
            </BaseLink>
          ))}
        </LayoutGroup>
      </MotionConfig>
    </LazyMotion>
  );
}

const Indicator = forwardRef<
  ElementRef<typeof m.div>,
  ComponentPropsWithoutRef<typeof m.div>
>(({ ...props }, ref) => {
  const { resolvedTheme: theme } = useTheme();
  const isDark = useMemo(() => theme === "dark", [theme]);

  return (
    <m.div
      {...props}
      className={indicatorClassNames}
      layoutId="sidebar"
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 30,
      }}
      initial={{ opacity: isDark ? 1 : 0.5 }}
      animate={{ opacity: isDark ? 1 : 0.5 }}
      ref={ref}
    />
  );
});
Indicator.displayName = "Indicator";
