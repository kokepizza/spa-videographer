"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { preloadAllVideos } from "@/lib/video-cache";
import { projects } from "@/lib/projects";

const videoUrls = projects.map((p) => `/videos/${p.slug}.webm`);

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const spinTween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    spinTween.current = gsap.to(spinnerRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 1,
      ease: "linear",
    });

    const hide = () => {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          spinTween.current?.kill();
          setVisible(false);
        },
      });
    };

    preloadAllVideos(videoUrls, (loaded, total) => {
      setProgress(Math.round((loaded / total) * 100));
      if (loaded === total) hide();
    });

    return () => {
      spinTween.current?.kill();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-200 flex flex-col items-center justify-center backdrop-blur-sm"
    >
      <div
        ref={spinnerRef}
        className="h-7 w-7 rounded-full border-[1.5px] border-transparent border-t-black"
      />
      <span className="mt-3 font-mono text-[10px] uppercase tracking-widest text-black/40">
        {progress}%
      </span>
    </div>
  );
}
