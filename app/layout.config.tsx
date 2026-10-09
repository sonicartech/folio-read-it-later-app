import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { AISearchTrigger } from "@/components";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <div className="logo" />
        {/* <Image src={whiteLogo} alt="logo" width={150}  /> */}
      </>
    ),
    children: (
      <AISearchTrigger className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Image
          src="/icons/ai.svg"
          alt="AI Assistant"
          width={23}
          height={22}
          className="text-gray-600 dark:text-gray-400 dark:invert"
        />
      </AISearchTrigger>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};
