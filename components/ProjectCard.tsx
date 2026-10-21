import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { fileUrl } from "@/lib/pb";

export function ProjectCard({ project }: { project: Project }) {
  const cover = fileUrl(project.collectionId, project.id, project.cover);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-44 overflow-hidden bg-navy-100">
        {cover ? (
          <Image
            src={cover}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <span className="rounded bg-copper-50 px-2 py-0.5 text-copper-700">
            {project.category}
          </span>
          <span>{project.year}</span>
          <span>·</span>
          <span>{project.location}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-navy-950 group-hover:text-navy-800">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {project.summary}
        </p>
      </div>
    </Link>
  );
}
