const CACHE_NAME = "spa-videos-v1";

/** ObjectURL map: "/videos/slug.webm" → blob:// URL (valid for this session) */
export const videoObjectUrls = new Map<string, string>();

export let videosReady = false;

const subscribers = new Set<() => void>();

/**
 * Subscribe to the moment all videos are ready.
 * If already ready, the callback is called synchronously.
 * Returns an unsubscribe function.
 */
export function subscribeToVideosReady(cb: () => void): () => void {
  if (videosReady) {
    cb();
    return () => {};
  }
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

function notifyReady() {
  videosReady = true;
  subscribers.forEach((cb) => cb());
  subscribers.clear();
}

/**
 * Preloads all videos:
 * - Checks the Cache API for a stored response (persists across sessions).
 * - On cache miss, fetches from network and stores in cache.
 * - Creates an ObjectURL for each so <video> elements play from memory.
 * - Calls onProgress(loaded, total) after each video settles.
 */
export async function preloadAllVideos(
  urls: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  const total = urls.length;
  let loaded = 0;

  const hasCache = typeof window !== "undefined" && "caches" in window;
  const cache = hasCache ? await caches.open(CACHE_NAME) : null;

  await Promise.allSettled(
    urls.map(async (url) => {
      try {
        let response: Response | undefined;

        if (cache) {
          const cached = await cache.match(url);
          if (cached) {
            response = cached;
          } else {
            const fetched = await fetch(url);
            if (fetched.ok) {
              await cache.put(url, fetched.clone());
              response = fetched;
            }
          }
        } else {
          const fetched = await fetch(url);
          if (fetched.ok) response = fetched;
        }

        if (response) {
          const blob = await response.blob();
          videoObjectUrls.set(url, URL.createObjectURL(blob));
        }
      } catch {
        // Silent fail — video will attempt to stream from network
      } finally {
        loaded++;
        onProgress?.(loaded, total);
      }
    })
  );

  notifyReady();
}
