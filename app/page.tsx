"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { projects } from "@/lib/projects";
import { videoObjectUrls } from "@/lib/video-cache";
import {
  setGlobalBeforeTransition,
  runGlobalBeforeTransition,
  pendingTransition,
} from "@/lib/view-transition";

gsap.registerPlugin(CustomEase);
CustomEase.create("videoIn", "M0,0 C0.06,0.98 0.18,1 1,1");
CustomEase.create("videoOut", "M0,0 C0.4,0 1,0.6 1,1");

export default function HomePage() {
  const router = useRouter();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const isTouchRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const prevSlugRef = useRef<string | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref so the global callback always closes over the current slug without stale state.
  const activeSlugRef = useRef<string | null>(null);

  useEffect(() => {
    const touch = window.matchMedia("(hover: none)").matches;
    isTouchRef.current = touch;
    setIsTouch(touch);
    gsap.set(overlayRef.current, { opacity: 0 });

    setGlobalBeforeTransition(() => {
      if (overlayRef.current && activeSlugRef.current) {
        gsap.killTweensOf(overlayRef.current);
        gsap.set(overlayRef.current, { opacity: 1 });
      }
    });

    return () => setGlobalBeforeTransition(null);
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;
    gsap.killTweensOf(overlayRef.current);

    if (activeSlug && !prevSlugRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "videoIn" });
    } else if (!activeSlug) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.6, ease: "videoOut" });
    }

    prevSlugRef.current = activeSlug;
    activeSlugRef.current = activeSlug;
  }, [activeSlug]);

  const handleEnter = (slug: string) => {
    if (isTouchRef.current) return;
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    setActiveSlug(slug);
  };

  const handleLeave = () => {
    if (isTouchRef.current) return;
    leaveTimerRef.current = setTimeout(() => setActiveSlug(null), 40);
  };

  // Navigate using the View Transition API when available, falling back to router.push.
  const navigateTo = (href: string) => {
    if (!("startViewTransition" in document)) {
      router.push(href);
      return;
    }
    runGlobalBeforeTransition();
    (document as Document & {
      startViewTransition: (cb: () => Promise<void>) => void;
    }).startViewTransition(async () => {
      router.push(href);
      await pendingTransition();
    });
  };

  // Unified click handler for every project link.
  // Desktop: always navigate (hover already shows the preview).
  // Touch – first tap: open fullscreen preview (href is undefined, no nav).
  //       – second tap on same project: navigate and clear the preview.
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();

    if (!isTouchRef.current) {
      navigateTo(`/work/${slug}`);
      return;
    }

    if (activeSlug !== slug) {
      setActiveSlug(slug);
    } else {
      setActiveSlug(null);
      navigateTo(`/work/${slug}`);
    }
  };

  const isAnyActive = !!activeSlug;

  const videoSrc = activeSlug
    ? (videoObjectUrls.get(`/videos/${activeSlug}.webm`) ?? `/videos/${activeSlug}.webm`)
    : null;

  return (
    <>
      {/* Fullscreen video overlay — tappable on touch to dismiss */}
      <div
        ref={overlayRef}
        className={[
          "fixed inset-0 z-10",
          isTouch && activeSlug ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        style={{ viewTransitionName: activeSlug ? `video-${activeSlug}` : undefined }}
        onClick={isTouch && activeSlug ? () => setActiveSlug(null) : undefined}
      >
        {activeSlug && videoSrc && (
          <video
            key={activeSlug}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          >
            <source src={videoSrc} type="video/webm" />
          </video>
        )}
      </div>

      <section className="col-span-full">
        <ul className="ml-[50%] flex flex-col items-start gap-[40px] pt-4 pb-32 pr-4 md:gap-[60px] md:pr-6">
          {projects.map((project) => (
            <li
              key={project.slug}
              className={[
                "relative z-20 text-left transition-opacity duration-500",
                isAnyActive && activeSlug !== project.slug ? "opacity-0" : "opacity-100",
              ].join(" ")}
              onMouseEnter={() => handleEnter(project.slug)}
              onMouseLeave={handleLeave}
            >
              {/*
               * href is intentionally absent on touch until the preview is open.
               * First tap → sets activeSlug (preview opens, href becomes real URL).
               * Second tap → navigates and clears the preview.
               * Tap on overlay background → clears the preview (href goes back to undefined).
               */}
              <a
                href={
                  !isTouch || activeSlug === project.slug
                    ? `/work/${project.slug}`
                    : undefined
                }
                className="flex flex-col items-start gap-px cursor-pointer"
                onClick={(e) => handleLinkClick(e, project.slug)}
              >
                <h2
                  className="font-serif leading-none text-black"
                  style={{ viewTransitionName: `title-${project.slug}` }}
                >
                  {project.title}
                </h2>
                <p
                  className="font-serif leading-none text-dark-gray"
                  style={{ viewTransitionName: `category-${project.slug}` }}
                >
                  {project.category}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
