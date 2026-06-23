/**
 * Module-level bridge between ViewTransitionLink and NavigationResolver.
 *
 * Flow:
 *  1. ViewTransitionLink calls document.startViewTransition(async () => {
 *       router.push(href);
 *       await pendingTransition();   // ← waits here
 *     });
 *  2. Next.js renders the new route and commits it to the DOM.
 *  3. NavigationResolver's useLayoutEffect fires → resolveViewTransition()
 *  4. The awaited promise resolves → startViewTransition captures the new DOM
 *     and animates between before/after snapshots.
 */

let pendingResolve: (() => void) | null = null;

/** Call inside the startViewTransition callback to wait for the new route DOM. */
export function pendingTransition(): Promise<void> {
  return new Promise<void>((resolve) => {
    pendingResolve = resolve;
  });
}

/** Called by NavigationResolver once the new route has mounted. */
export function resolveViewTransition(): void {
  pendingResolve?.();
  pendingResolve = null;
}
