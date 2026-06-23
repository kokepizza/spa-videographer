"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { resolveViewTransition } from "@/lib/view-transition";

/**
 * Invisible component mounted in the root layout.
 * Every time the pathname changes (i.e. a new route has been rendered and
 * committed to the DOM), it resolves the pending view-transition promise so
 * that document.startViewTransition can capture the "after" snapshot.
 */
export default function NavigationResolver() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    resolveViewTransition();
  }, [pathname]);

  return null;
}
