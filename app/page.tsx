"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { projects } from "@/lib/projects";
import { videoObjectUrls } from "@/lib/video-cache";

gsap.registerPlugin(CustomEase);
CustomEase.create("videoIn", "M0,0 C0.06,0.98 0.18,1 1,1");
CustomEase.create("videoOut", "M0,0 C0.4,0 1,0.6 1,1");

export default function HomePage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const isTouchRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const prevSlugRef = useRef<string | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isTouchRef.current = window.matchMedia("(hover: none)").matches;
    gsap.set(overlayRef.current, { opacity: 0 });
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
  }, [activeSlug]);

  useEffect(() => {
    if (!isTouchRef.current || !activeSlug) return;
    const close = () => setActiveSlug(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
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

  const handleClick = (slug: string, e: React.MouseEvent) => {
    if (!isTouchRef.current) return;
    e.stopPropagation();
    setActiveSlug((prev) => (prev === slug ? null : slug));
  };

  const isAnyActive = !!activeSlug;

  const videoSrc = activeSlug
    ? (videoObjectUrls.get(`/videos/${activeSlug}.webm`) ?? `/videos/${activeSlug}.webm`)
    : null;

  return (
    <>
      <div ref={overlayRef} className="fixed inset-0 z-10 pointer-events-none">
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
                "relative z-20 cursor-pointer text-left transition-opacity duration-500",
                isAnyActive && activeSlug !== project.slug ? "opacity-0" : "opacity-100",
              ].join(" ")}
              onMouseEnter={() => handleEnter(project.slug)}
              onMouseLeave={handleLeave}
              onClick={(e) => handleClick(project.slug, e)}
            >
              <div className="flex flex-col items-start gap-px">
                <h2 className="font-serif leading-none text-black">
                  {project.title}
                </h2>
                <p className="font-serif leading-none text-dark-gray">
                  {project.category}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
