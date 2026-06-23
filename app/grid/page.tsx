"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { projects } from "@/lib/projects";
import { videoObjectUrls, subscribeToVideosReady, videosReady } from "@/lib/video-cache";
import ViewTransitionLink from "@/components/ui/view-transition-link";

function GridCard({ title, category, slug }: { title: string; category: string; slug: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(videosReady);

  useEffect(() => {
    return subscribeToVideosReady(() => setLoaded(true));
  }, []);

  // When the ObjectURL becomes available, update the source so play() uses memory
  useEffect(() => {
    const video = videoRef.current;
    if (!loaded || !video) return;
    const src = videoObjectUrls.get(`/videos/${slug}.webm`) ?? `/videos/${slug}.webm`;
    const source = video.querySelector("source");
    if (source && source.src !== src) {
      source.src = src;
      video.load();
    }
  }, [loaded, slug]);

  const handleEnter = () => {
    setHovered(true);
    videoRef.current?.play();
  };

  const handleLeave = () => {
    setHovered(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <ViewTransitionLink
      href={`/work/${slug}`}
      className="flex flex-col"
    >
      <div
        className="relative aspect-4/3 overflow-hidden"
        style={{ viewTransitionName: `video-${slug}` }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={`/videos/${slug}.webm`} type="video/webm" />
        </video>
        <Image
          src={`/thumbnails/${slug}.webp`}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}
        />
      </div>
      <div className="flex flex-col items-start gap-px pt-2">
        <h2
          className="font-serif leading-none text-black"
          style={{ viewTransitionName: `title-${slug}` }}
        >
          {title}
        </h2>
        <p
          className="font-serif leading-none text-dark-gray"
          style={{ viewTransitionName: `category-${slug}` }}
        >
          {category}
        </p>
      </div>
    </ViewTransitionLink>
  );
}

export default function GridPage() {
  return (
    <section className="col-span-full pt-4 pb-32">
      <div className="grid grid-cols-1 gap-y-[60px] md:grid-cols-3 md:gap-x-px">
        {projects.map((project) => (
          <GridCard key={project.slug} {...project} />
        ))}
      </div>
    </section>
  );
}
