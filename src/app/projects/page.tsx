import { Metadata } from "next";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Architectural Portfolio & Homes",
  description:
    "Explore our portfolio of completed Indian residences, modern tropical villas, Kerala Nalukettu homes, and exposed brick courtyard sanctuaries.",
};

export default function ProjectsPage() {
  return (
    <div className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20 space-y-3">
          <Badge variant="terracotta" className="tracking-widest uppercase text-[11px]">
            Architectural Archive
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            Our Residential Portfolio.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-[1.7]">
            Every home is a unique response to its plot microclimate, family traditions,
            and honest Indian materials. Filter through our completed residences below.
          </p>
        </div>

        {/* Project Gallery */}
        <ProjectGallery />
      </div>
    </div>
  );
}
