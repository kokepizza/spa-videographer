"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("videoIn", "M0,0 C0.06,0.98 0.18,1 1,1");
CustomEase.create("videoOut", "M0,0 C0.4,0 1,0.6 1,1");

const projects = [
  { title: "Liquid Gold", category: "Food & Beverage", video: "/videos/food-cocktail.mp4" },
  { title: "Morning Ritual", category: "Food & Beverage", video: "/videos/food-coffee.mp4" },
  { title: "The Feast", category: "Food & Beverage", video: "/videos/food-eating.mp4" },
  { title: "Table No. 7", category: "Food & Beverage", video: "/videos/food-restaurant.mp4" },
  { title: "Rhythm & Motion", category: "Lifestyle", video: "/videos/lifestyle-dancing.mp4" },
  { title: "Through the Lens", category: "Lifestyle", video: "/videos/lifestyle-shooting.mp4" },
  { title: "Street Couture", category: "Lifestyle", video: "/videos/lifestyle-urbanfashion.mp4" },
  { title: "Solitude", category: "Lifestyle", video: "/videos/lifestyle-woman.mp4" },
  { title: "Night Frequencies", category: "Music", video: "/videos/music-dj.mp4" },
  { title: "Pulse", category: "Music", video: "/videos/music-drums.mp4" },
  { title: "Mass Resonance", category: "Music", video: "/videos/music-festival.mp4" },
  { title: "Still Keys", category: "Music", video: "/videos/music-piano.mp4" },
  { title: "Above the Rim", category: "Sport", video: "/videos/sport-basketball.mp4" },
  { title: "The Sweet Science", category: "Sport", video: "/videos/sport-boxing.mp4" },
  { title: "Dust & Chrome", category: "Sport", video: "/videos/sport-desertbike.mp4" },
  { title: "The Beautiful Game", category: "Sport", video: "/videos/sport-football.mp4" },
  { title: "Ritual Strength", category: "Sport", video: "/videos/sport-pushups.mp4" },
  { title: "Into the Distance", category: "Sport", video: "/videos/sport-run.mp4" },
];

export default function HomePage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const isTouchRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const prevVideoRef = useRef<string | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isTouchRef.current = window.matchMedia("(hover: none)").matches;
    gsap.set(overlayRef.current, { opacity: 0 });
  }, []);

  // Animate video overlay
  useEffect(() => {
    if (!overlayRef.current) return;
    gsap.killTweensOf(overlayRef.current);

    if (activeVideo && !prevVideoRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "videoIn" });
    } else if (!activeVideo) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.6, ease: "videoOut" });
    }

    prevVideoRef.current = activeVideo;
  }, [activeVideo]);

  // Close video on outside tap (mobile)
  useEffect(() => {
    if (!isTouchRef.current || !activeVideo) return;
    const close = () => setActiveVideo(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [activeVideo]);

  const handleEnter = (src: string) => {
    if (isTouchRef.current) return;
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    setActiveVideo(src);
  };

  const handleLeave = () => {
    if (isTouchRef.current) return;
    leaveTimerRef.current = setTimeout(() => setActiveVideo(null), 40);
  };

  const handleClick = (src: string, e: React.MouseEvent) => {
    if (!isTouchRef.current) return;
    e.stopPropagation();
    setActiveVideo((prev) => (prev === src ? null : src));
  };

  const isAnyActive = !!activeVideo;

  return (
    <>
      <div ref={overlayRef} className="fixed inset-0 z-10 pointer-events-none">
        {activeVideo && (
          <video
            key={activeVideo}
            src={activeVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <section className="col-span-full">
        <ul className="ml-[50%] flex flex-col items-start gap-[40px] pt-4 pb-32 pr-4 md:gap-[60px] md:pr-6">
          {projects.map((project) => (
            <li
              key={project.video}
              className={[
                "relative z-20 cursor-pointer text-left transition-opacity duration-500",
                isAnyActive && activeVideo !== project.video ? "opacity-0" : "opacity-100",
              ].join(" ")}
              onMouseEnter={() => handleEnter(project.video)}
              onMouseLeave={handleLeave}
              onClick={(e) => handleClick(project.video, e)}
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
