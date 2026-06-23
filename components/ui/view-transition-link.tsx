"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { pendingTransition } from "@/lib/view-transition";

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

    // Run before the snapshot so the DOM is in its final "ready" state.
    onBeforeTransition?.();

    /*
     * The callback must return a Promise so startViewTransition waits for the
     * new route DOM to be committed before capturing the "after" snapshot.
     * NavigationResolver resolves the promise via useLayoutEffect once the
     * new pathname has mounted.
     */
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
