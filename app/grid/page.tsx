"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const projects = [
  { title: "Liquid Gold", category: "Food & Beverage", slug: "food-cocktail" },
  { title: "Morning Ritual", category: "Food & Beverage", slug: "food-coffee" },
  { title: "The Feast", category: "Food & Beverage", slug: "food-eating" },
  { title: "Table No. 7", category: "Food & Beverage", slug: "food-restaurant" },
  { title: "Rhythm & Motion", category: "Lifestyle", slug: "lifestyle-dancing" },
  { title: "Through the Lens", category: "Lifestyle", slug: "lifestyle-shooting" },
  { title: "Street Couture", category: "Lifestyle", slug: "lifestyle-urbanfashion" },
  { title: "Solitude", category: "Lifestyle", slug: "lifestyle-woman" },
  { title: "Night Frequencies", category: "Music", slug: "music-dj" },
  { title: "Pulse", category: "Music", slug: "music-drums" },
  { title: "Mass Resonance", category: "Music", slug: "music-festival" },
  { title: "Still Keys", category: "Music", slug: "music-piano" },
  { title: "Above the Rim", category: "Sport", slug: "sport-basketball" },
  { title: "The Sweet Science", category: "Sport", slug: "sport-boxing" },
  { title: "Dust & Chrome", category: "Sport", slug: "sport-desertbike" },
  { title: "The Beautiful Game", category: "Sport", slug: "sport-football" },
  { title: "Ritual Strength", category: "Sport", slug: "sport-pushups" },
  { title: "Into the Distance", category: "Sport", slug: "sport-run" },
];

function GridCard({ title, category, slug }: { title: string; category: string; slug: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

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
    <div
      className="flex flex-col cursor-pointer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={`/videos/${slug}.webm`} type="video/webm" />
          <source src={`/videos/${slug}.mp4`} type="video/mp4" />
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
        <h2 className="font-serif leading-none text-black">{title}</h2>
        <p className="font-serif leading-none text-dark-gray">{category}</p>
      </div>
    </div>
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
