"use client";

import { useRouter } from "next/navigation";
import { pendingTransition } from "@/lib/view-transition";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (!("startViewTransition" in document)) {
      router.back();
      return;
    }

    (document as Document & {
      startViewTransition: (cb: () => Promise<void>) => void;
    }).startViewTransition(async () => {
      router.back();
      await pendingTransition();
    });
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="font-mono text-[10px] uppercase text-dark-gray hover:text-black transition-colors self-start cursor-pointer"
    >
      ← back
    </button>
  );
}
