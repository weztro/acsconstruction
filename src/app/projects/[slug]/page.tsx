import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { PROJECTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Maximize2,
  Compass,
  Clock,
  Layers,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { ArchitecturalImage } from "@/components/ui/architectural-image";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} — ${project.location}`,
    description: project.headline,
    openGraph: {
      title: `${project.name} | Sthapati Homes`,
      description: project.headline,
      images: [{ url: project.heroImage }],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Back Link */}
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground -ml-3"
          >
            <Link href="/projects" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Projects</span>
            </Link>
          </Button>
        </div>

        {/* Project Header */}
        <div className="space-y-4 max-w-4xl mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="terracotta" className="text-[11px] uppercase tracking-wider">
              {project.category}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">
              Completed {project.year} • {project.location}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.15]">
            {project.name}
          </h1>

          <p className="font-serif text-lg sm:text-xl italic text-primary font-normal leading-relaxed">
            &ldquo;{project.headline}&rdquo;
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] rounded-md overflow-hidden border border-border shadow-sm mb-16 bg-secondary/30">
          <ArchitecturalImage
            src={project.heroImage}
            alt={project.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Specifications Matrix Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 sm:p-8 bg-card border border-border rounded-md shadow-xs mb-16 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          <div className="space-y-1 sm:px-4 first:pl-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Location</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-foreground">{project.location}</p>
          </div>

          <div className="space-y-1 sm:px-4 pt-4 sm:pt-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Maximize2 className="w-3.5 h-3.5 text-primary" />
              <span>Built-up Area</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-foreground">{project.builtUpArea}</p>
            <p className="text-[11px] text-muted-foreground">{project.plotSize}</p>
          </div>

          <div className="space-y-1 sm:px-4 pt-4 sm:pt-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>Architectural Style</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-foreground">{project.style}</p>
          </div>

          <div className="space-y-1 sm:px-4 pt-4 sm:pt-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Execution Timeline</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-foreground">{project.timeline}</p>
            <p className="text-[11px] text-muted-foreground">Year {project.year}</p>
          </div>
        </div>

        {/* Narrative & In-depth Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          {/* Main Description */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
                Architectural Intent & Story
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-[1.7]">
                {project.description}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-xl font-normal text-foreground">
                The Client&rsquo;s Brief
              </h3>
              <div className="p-6 bg-secondary/30 border-l-2 border-primary rounded-sm text-xs sm:text-sm text-foreground/90 italic leading-[1.7]">
                &ldquo;{project.clientBrief}&rdquo;
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-xl font-normal text-foreground">
                Spatial & Floor Plan Concept
              </h3>
              <p className="text-sm text-muted-foreground leading-[1.7]">
                {project.floorPlanConcept}
              </p>
            </div>

            {/* Construction Highlights */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-normal text-foreground">
                Engineering & Civil Highlights
              </h3>
              <div className="space-y-2.5">
                {project.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Materials & Consultation Box */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-6 sm:p-7 bg-card border border-border rounded-md space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B]">
                <Layers className="w-3.5 h-3.5" />
                <span>Material Palette</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Authentic, locally sourced materials curated for durability and graceful aging.
              </p>
              <div className="space-y-2 pt-2 border-t border-border/60">
                {project.materials.map((mat) => (
                  <div
                    key={mat}
                    className="text-xs font-medium text-foreground py-1.5 px-3 bg-secondary/50 rounded-sm border border-border/50"
                  >
                    {mat}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Quote Box */}
            <div className="p-6 sm:p-7 bg-secondary/30 border border-border rounded-md space-y-4 text-center">
              <h4 className="font-serif text-xl font-normal text-foreground">
                Inspired by this Home?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Speak with our architects to understand how this style can be adapted
                for your plot size and budget.
              </p>
              <Button asChild variant="default" className="w-full text-xs uppercase tracking-wider font-medium">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2">
                  <span>Enquire About Similar Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="space-y-8 pt-10 border-t border-border">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B]">
              Photographic Exploration
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
              Project Gallery & Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.gallery.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[4/3] rounded-md overflow-hidden border border-border bg-secondary/30 group shadow-xs"
              >
                <ArchitecturalImage
                  src={img}
                  alt={`${project.name} architectural detail ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-104"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation CTA */}
        <div className="mt-20 p-8 sm:p-10 bg-card border border-border rounded-md flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl font-normal text-foreground">
              Planning to build a similar Indian villa?
            </h3>
            <p className="text-xs text-muted-foreground">
              We offer turnkey architecture and civil execution across South India.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="text-xs uppercase tracking-wider font-medium border-border">
              <Link href="/projects">View More Projects</Link>
            </Button>
            <Button asChild variant="default" size="sm" className="text-xs uppercase tracking-wider font-medium">
              <Link href="/contact">Request Feasibility Study</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
