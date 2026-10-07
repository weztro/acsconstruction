import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ArchitecturalImage } from "@/components/ui/architectural-image";

export function AboutPreview() {
  const pillars = [
    {
      title: "Holistic Planning & Vastu",
      desc: "Orientation for sunrise sunlight, microclimate wind paths, and scientific Vastu balance.",
    },
    {
      title: "Authentic Indian Architecture",
      desc: "Nadumuttam courtyards, shaded verandahs, and handcrafted jali screens tailored for families.",
    },
    {
      title: "Precision Civil Engineering",
      desc: "Primary Fe 550D TMT steel, 53-grade certified cement, and standardized laboratory slump tests.",
    },
    {
      title: "Generational Craftsmen & Finishing",
      desc: "Stonemasons, sthapatis, and carpenters who understand the grain of teak and cut of granite.",
    },
  ];

  return (
    <section className="py-24 lg:py-36 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          {/* Left Architectural Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-md overflow-hidden border border-border shadow-sm">
              <div className="aspect-[4/3] sm:aspect-[16/11] relative">
                <ArchitecturalImage
                  src="/images/architecture/neat-home-elevation.jpg"
                  alt="Modern Indian Residential House Exterior Elevation — Simple & Neat Construction"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-7">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B]">
                About Our Atelier
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground leading-[1.2]">
                More Than Construction. We Build Your Vision.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground leading-[1.7] max-w-xl">
              Every home we build begins with understanding how your family lives —
              from early morning sunlight and afternoon breezes in the
              verandah, to festive dinners with extended family. We unite timeless
              vernacular Indian architecture with contemporary engineering discipline.
            </p>

            {/* 4 Architectural Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {pillars.map((p) => (
                <div key={p.title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      {p.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Button asChild variant="default" className="text-xs tracking-wider uppercase font-medium">
                <Link href="/about" className="inline-flex items-center gap-2">
                  <span>Know More About Us</span>
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
