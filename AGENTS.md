# AGENTS.md

## 🎯 Project Context
This project is a portfolio website for a videographer. The goal is to create a visual, fluid, and cinematic experience where animation and rhythm are a core part of the design.

Stack:
- Next.js (App Router)
- Tailwind CSS
- GSAP (animations)
- TypeScript

---

## 🧠 Development Principles

- Prioritize visual and sensory experience over unnecessary technical complexity.
- Animations must feel smooth, intentional, and aligned with audiovisual storytelling.
- Avoid over-engineered solutions.
- Keep the codebase clean, modular, and reusable.

---

## 🎬 Animations (GSAP)

- GSAP is used for:
  - Page transitions
  - Section entrances/exits
  - Scroll animations (ScrollTrigger)
  - Micro-interactions (hover states, dynamic feedback)

- Rules:
  - Do not use CSS animations if GSAP handles the interaction.
  - Centralize animations in reusable hooks or helpers.
  - Always clean up timelines in useEffect cleanup.

---

## 🎨 UI / Tailwind

- Minimalist, editorial design focused on visual content.
- Heavy use of:
  - layout grids
  - full-screen sections
  - small typography and generous spacing
- Avoid generic “dashboard-style” UI components.

---

## 🧩 Architecture

- Clearly separate:
  - /components/ui → reusable UI elements
  - /components/sections → page blocks (Hero, Work, About)
  - /components/animations → GSAP logic
  - /components/layout → basic structure (header, footer, etc.)
  - /lib → utility helpers

- Each section should be self-contained and easy to move or reorder.

---

## 🧾 Naming Conventions

- Use **kebab-case** for all files and folders.
- Do NOT use uppercase letters in file names.
  - Example: `example-component.tsx`
  - NOT: `ExampleComponent.tsx` or `Example-component.tsx`

---

## ⚡ Performance

- Prioritize:
  - Lazy loading videos
  - Image optimization (Next/Image)
  - Avoid heavy animations on mobile
- Reduce layout shifts (reflows) in GSAP animations

---

## 📱 Responsive

- Mobile-first, but with a strong focus on desktop experience (portfolio-oriented).
- Simplify or reduce animations on mobile if performance is impacted.

---

## 🧪 Code Philosophy

- “Less but intentional”
- Every animation must serve a narrative purpose
- Avoid visual noise
- Code should be understandable 6 months later without context