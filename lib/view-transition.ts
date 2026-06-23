/**
 * Module-level bridge between ViewTransitionLink / BackButton and NavigationResolver.
 *
 * Flow:
 *  1. ViewTransitionLink / BackButton call document.startViewTransition(async () => {
 *       router.push(href);   // or router.back()
 *       await pendingTransition();   // ← waits here
 *     });
 *  2. Next.js renders the new route and commits it to the DOM.
 *  3. NavigationResolver's useLayoutEffect fires → resolveViewTransition()
 *  4. The awaited promise resolves → startViewTransition captures the new DOM
 *     and animates between before/after snapshots.
 *
 * Additionally, any page can register a `globalBeforeTransition` callback that
 * will be called synchronously by every ViewTransitionLink / BackButton BEFORE
 * startViewTransition captures the "before" snapshot (e.g. to snap GSAP).
 */

// ── Pending-route promise ────────────────────────────────────────────────────

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

// ── Global before-transition hook ────────────────────────────────────────────

let globalBeforeCb: (() => void) | null = null;

/**
 * Register a callback to be called synchronously before every view transition's
 * "before" snapshot. Pass null to unregister.
 */
export function setGlobalBeforeTransition(cb: (() => void) | null): void {
  globalBeforeCb = cb;
}

/** Called by every ViewTransitionLink and BackButton before startViewTransition. */
export function runGlobalBeforeTransition(): void {
  globalBeforeCb?.();
}
