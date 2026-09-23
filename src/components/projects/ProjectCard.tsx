import Link from "next/link";
import { Project } from "@/lib/constants";
import { ArrowRight, MapPin } from "lucide-react";
import { ArchitecturalImage } from "@/components/ui/architectural-image";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-md overflow-hidden border border-border bg-card hover:border-primary/60 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs"
    >
      {/* 4:3 Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
        <ArchitecturalImage
          src={project.heroImage}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Hover arrow indicator */}
        <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-md bg-background/90 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xs">
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
        </div>
      </div>

      {/* Card Info Footer: Clean Hierarchy */}
      <div className="p-5 sm:p-6 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3 h-3 text-primary shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>
          <span className="text-[11px] font-mono shrink-0">{project.builtUpArea}</span>
        </div>

        <h3 className="font-serif text-xl font-normal text-foreground group-hover:text-primary transition-colors">
          {project.name}
        </h3>

        <p className="text-xs text-muted-foreground font-light line-clamp-1">
          {project.style}
        </p>

        <div className="pt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary group-hover:underline">
          <span>View Project</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
