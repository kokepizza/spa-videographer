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
    <div className="col-span-full -mx-2 -mt-2 md:-mx-3 md:-mt-3 h-dvh flex flex-col md:flex-row overflow-hidden">
      <div
        className="order-1 md:order-2 flex-1 md:flex-none md:w-[75dvw] relative overflow-hidden"
        style={{ viewTransitionName: `video-${slug}` }}
      >
        <VideoPlayer slug={project.slug} />
      </div>
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
