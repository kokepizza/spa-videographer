"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import About from "@/components/sections/about";

// ─── Nav item shared styles ────────────────────────────────────────────────
const navItemClass =
  "flex w-full cursor-pointer justify-start rounded bg-light-gray/80 p-1 text-left font-mono uppercase leading-none backdrop-blur-md";

// ─── Nav link (route) ──────────────────────────────────────────────────────
function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link href={href} className={`${navItemClass} ${isActive ? "active" : ""}`}>
      {isActive ? `[ ${label} ]` : label}
    </Link>
  );
}

// ─── Nav button (modal trigger) ────────────────────────────────────────────
function NavButton({
  label,
  isActive,
  onClick,
  className = "",
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${navItemClass} ${isActive ? "active" : ""} ${className}`}
    >
      {isActive ? `[ ${label} ]` : label}
    </button>
  );
}

// ─── Close button ──────────────────────────────────────────────────────────
function CloseButton({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    gsap.set(btnRef.current, { autoAlpha: 0, scale: 0.7 });
  }, []);

  useEffect(() => {
    if (isOpen) {
      gsap.to(btnRef.current, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(1.4)", delay: 0.15 });
    } else {
      gsap.to(btnRef.current, { autoAlpha: 0, scale: 0.7, duration: 0.25, ease: "power2.in" });
    }
  }, [isOpen]);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClose}
      aria-label="Close about"
      className="fixed top-2 right-2 z-60 flex h-8 w-8 items-center justify-center rounded font-mono text-xs uppercase leading-none text-black/70 bg-light-gray/80 backdrop-blur-md cursor-pointer md:top-3 md:right-3"
    >
      ✕
    </button>
  );
}

// ─── About modal ───────────────────────────────────────────────────────────
function AboutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set(modalRef.current, { y: "120vh" });
    gsap.set(overlayRef.current, { autoAlpha: 0 });
  }, []);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
      gsap.to(modalRef.current, { y: 0, duration: 0.7, ease: "power3.out" });
    } else {
      gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.35, ease: "power2.in" });
      gsap.to(modalRef.current, { y: "120vh", duration: 0.5, ease: "power3.in" });
    }
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-black/15"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-black rounded w-[min(560px,90vw)] mx-6 p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <About />
      </div>
    </div>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────
export default function Header() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsAboutOpen(false);
  }, [pathname]);

  const closeAbout = () => setIsAboutOpen(false);

  return (
    <>
      <header className="fixed bottom-2 left-2 z-50 w-[calc(100%-16px)] md:bottom-3 md:left-3 md:w-[calc(100%-24px)]">
        <nav className="grid w-full grid-cols-2 gap-0.5 md:grid-cols-3">
          <NavLink href="/" label="home" isActive={!isAboutOpen && pathname === "/"} />
          <NavLink href="/grid" label="grid" isActive={!isAboutOpen && pathname === "/grid"} />
          <NavButton
            label="about"
            isActive={isAboutOpen}
            onClick={() => setIsAboutOpen((prev) => !prev)}
            className="col-span-2 md:col-span-1"
          />
        </nav>
      </header>

      <CloseButton isOpen={isAboutOpen} onClose={closeAbout} />
      <AboutModal isOpen={isAboutOpen} onClose={closeAbout} />
    </>
  );
}
