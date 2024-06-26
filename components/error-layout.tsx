import type { PropsWithChildren } from "react";

import FlyingToasters from "~/components/flying-toasters";
import { P } from "~/components/ui/typography";
import SplitAnimate from "./split-animate/split-animate";

interface ErrorLayoutProps {
  title: string;
  subtitle: string;
  description: string;
}

export default function ErrorLayout({
  title,
  subtitle,
  description,
  children,
}: PropsWithChildren<ErrorLayoutProps>) {
  return (
    <>
      <div className="relative flex h-[calc(100vh-10.5rem)] w-full flex-col items-center justify-center text-center md:h-[calc(100vh-16.5rem)]">
        <SplitAnimate
          as="h1"
          className="font-heading text-9xl font-semibold md:text-[10rem]"
        >
          {title}
        </SplitAnimate>
        <SplitAnimate
          as="p"
          className="font-heading text-4xl font-semibold lg:text-5xl"
        >
          {subtitle}
        </SplitAnimate>
        <SplitAnimate as={P}>{description}</SplitAnimate>
        <div className="mb-16 mt-6 flex items-center justify-center gap-3 md:mb-[7.5rem]">
          {children}
        </div>
        <FlyingToasters className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 -z-30 hidden h-full w-full select-none overflow-hidden md:block" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 -z-20 hidden h-full w-full select-none shadow-[inset_0px_0px_50px_125px_hsl(var(--background))] md:block"></div>
      </div>
      <FlyingToasters className="pointer-events-none fixed bottom-0 left-0 right-0 top-0 -z-30 h-full w-full select-none overflow-hidden md:hidden" />
    </>
  );
}
