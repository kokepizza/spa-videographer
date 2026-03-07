"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Nav from "@/components/Nav/Nav";

export default function NavClient() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsAboutOpen(false);
  }, [pathname]);

  return (
    <Nav
      isAboutOpen={isAboutOpen}
      toggleAbout={() => setIsAboutOpen(!isAboutOpen)}
    />
  );
}