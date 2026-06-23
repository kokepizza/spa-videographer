"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { pendingTransition, runGlobalBeforeTransition } from "@/lib/view-transition";

interface ViewTransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** Called synchronously before startViewTransition captures the "before" snapshot. */
  onBeforeTransition?: () => void;
}

export default function ViewTransitionLink({
  href,
  children,
  className,
  onBeforeTransition,
}: ViewTransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!("startViewTransition" in document)) return;
    e.preventDefault();

    // Global hook first (e.g. snap GSAP overlays), then link-specific.
    runGlobalBeforeTransition();
    onBeforeTransition?.();

    (document as Document & {
      startViewTransition: (cb: () => Promise<void>) => void;
    }).startViewTransition(async () => {
      router.push(href);
      await pendingTransition();
    });
  };

  return (
    <Link href={href} onClick={handleClick} className={className} prefetch>
      {children}
    </Link>
  );
}
