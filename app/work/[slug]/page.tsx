import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import VideoPlayer from "@/components/sections/video-player";
import BackButton from "@/components/ui/back-button";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    /*
     * -mx-2/-mt-2 cancels the padding from the <main> grid in layout.tsx
     * so this page goes full-bleed edge-to-edge.
     * On desktop: left info panel (25dvw) + right video (75dvw), full viewport height.
     * On mobile:  video on top (flex-1), info + back below.
     */
    <div className="col-span-full -mx-2 -mt-2 md:-mx-3 md:-mt-3 h-dvh flex flex-col md:flex-row overflow-hidden">

      {/* ── VIDEO PANEL ─────────────────────────────────────────────────── */}
      {/* order-1 on mobile (top), order-2 on desktop (right 75dvw) */}
      <div
        className="order-1 md:order-2 flex-1 md:flex-none md:w-[75dvw] relative overflow-hidden"
        style={{ viewTransitionName: `video-${slug}` }}
      >
        <VideoPlayer slug={project.slug} />
      </div>

      {/* ── INFO PANEL ──────────────────────────────────────────────────── */}
      {/* order-2 on mobile (below video), order-1 on desktop (left 25dvw) */}
      {/* title → description → back; on desktop the group sits at the bottom */}
      <div className="order-2 md:order-1 shrink-0 md:w-[25dvw] md:h-full flex flex-col gap-4 md:justify-end px-4 py-3 pb-14 md:px-5 md:py-5 md:pb-14 border-t border-light-gray/40 md:border-t-0 md:border-r md:border-light-gray/40">

        <div className="flex flex-col gap-0.5">
          <h1
            className="font-serif leading-none text-black"
            style={{ viewTransitionName: `title-${slug}` }}
          >
            {project.title}
          </h1>
          <p
            className="font-serif leading-none text-dark-gray"
            style={{ viewTransitionName: `category-${slug}` }}
          >
            {project.category}
          </p>
        </div>

        <p className="font-serif tracking-normal text-dark-gray">
          {project.description}
        </p>

        <BackButton />
      </div>
    </div>
  );
}
