import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Maximize2, Calendar, Compass } from "lucide-react";
import { PROJECTS } from "@/lib/constants";
import { ArchitecturalImage } from "@/components/ui/architectural-image";

export function FeaturedProject() {
  const featured = PROJECTS.find((p) => p.featured) || PROJECTS[0];

  return (
    <section className="py-24 lg:py-36 bg-secondary/20 border-y border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col mb-12 lg:mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B]">
            Curated Case Study
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground mt-2">
            Featured Residence.
          </h2>
        </div>

        {/* Large Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-card border border-border rounded-md p-6 sm:p-10 shadow-xs">
          {/* Large Architectural Photography Frame */}
          <div className="lg:col-span-7 relative group">
            <div className="aspect-[16/11] relative rounded-md overflow-hidden border border-border/80 bg-secondary/30">
              <ArchitecturalImage
                src={featured.heroImage}
                alt={featured.name}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 text-white text-[11px] uppercase font-mono tracking-widest bg-black/60 backdrop-blur-xs px-3 py-1 rounded-sm">
                {featured.location}
              </div>
            </div>
          </div>

          {/* Editorial Project Spec & Narrative Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#B86F55] dark:text-[#B8735B] font-medium">
                PROJECT
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
                {featured.name}
              </h3>
              <p className="text-sm italic text-muted-foreground leading-relaxed">
                &ldquo;{featured.headline}&rdquo;
              </p>
            </div>

            <p className="text-sm text-muted-foreground leading-[1.7]">
              {featured.description}
            </p>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 gap-5 py-5 border-y border-border/80">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Location</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {featured.location}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Maximize2 className="w-3.5 h-3.5 text-primary" />
                  <span>Built-up Area</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {featured.builtUpArea}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Compass className="w-3.5 h-3.5 text-primary" />
                  <span>Architecture</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {featured.style}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>Handover Year</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {featured.year}
                </p>
              </div>
            </div>

            {/* Curated Materials */}
            <div className="space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                Curated Materials
              </p>
              <div className="flex flex-wrap gap-1.5">
                {featured.materials.map((mat) => (
                  <span
                    key={mat}
                    className="text-xs bg-secondary/60 text-muted-foreground px-2.5 py-1 rounded-sm border border-border/50"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Button asChild variant="default" size="lg" className="text-xs tracking-wider uppercase font-medium">
                <Link
                  href={`/projects/${featured.slug}`}
                  className="inline-flex items-center gap-2"
                >
                  <span>View Project Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
