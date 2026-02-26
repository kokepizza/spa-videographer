"use client";

import { useState } from "react";
import Nav from "@/components/Nav/Nav";
import Main from "@/components/Main/Main";
import About from "@/components/About/About";

export default function Page() {
  const [view, setView] = useState<"home" | "grid">("home");
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      <Nav
        currentView={view}
        setView={(v) => {
          setView(v);
          setIsAboutOpen(false);
        }}
        isAboutOpen={isAboutOpen}
        toggleAbout={() => setIsAboutOpen(!isAboutOpen)}
      />

      <Main view={view} />

      {isAboutOpen && (
        <About close={() => setIsAboutOpen(false)} />
      )}
    </div>
  );
}
