import Link from "next/link";
import { INDIAN_ARCH_PHILOSOPHY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ArchitecturalImage } from "@/components/ui/architectural-image";

export function IndianArchitecturePhilosophy() {
  return (
    <section className="py-24 lg:py-36 bg-secondary/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B]">
            The Vernacular Synthesis
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            Rooted in Tradition. Designed for Today.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-[1.7]">
            Our ancestors knew how to build cool, naturally lit, monsoon-ready homes
            without air conditioning. We synthesize these time-tested Indian architectural
            devices with modern structural glass and open-plan living.
          </p>
        </div>

        {/* 6 Core Architectural Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INDIAN_ARCH_PHILOSOPHY.map((item, idx) => (
            <div
              key={item.feature}
              className="p-7 sm:p-8 bg-card border border-border rounded-md flex flex-col justify-between hover:border-primary/50 transition-colors shadow-xs"
            >
              <div className="space-y-3">
                <span className="font-mono text-xs font-semibold text-primary">
                  0{idx + 1}
                </span>
                <h3 className="font-serif text-xl font-normal text-foreground">
                  {item.feature}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span className="uppercase tracking-widest text-[10px] font-semibold text-[#B86F55] dark:text-[#B8735B]">
                  Vernacular Feature
                </span>
                <span className="font-mono text-[11px]">Sthapati Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Photography Strip */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="relative aspect-[16/10] rounded-md overflow-hidden border border-border bg-secondary/30">
            <ArchitecturalImage
              src="/images/projects/courtyard-detail-1.jpg"
              alt="Central Water Courtyard with Granite Details"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            <span className="absolute bottom-3.5 left-4 text-white text-xs font-medium">
              Central Water Courtyard
            </span>
          </div>

          <div className="relative aspect-[16/10] rounded-md overflow-hidden border border-border bg-secondary/30">
            <ArchitecturalImage
              src="/images/projects/brick-detail.jpg"
              alt="Perforated Terracotta Jali screening afternoon light"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            <span className="absolute bottom-3.5 left-4 text-white text-xs font-medium">
              Perforated Terracotta Jali
            </span>
          </div>

          <div className="relative aspect-[16/10] rounded-md overflow-hidden border border-border bg-secondary/30">
            <ArchitecturalImage
              src="/images/projects/kerala-verandah.jpg"
              alt="Teak wood verandah with Charupadi seating"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            <span className="absolute bottom-3.5 left-4 text-white text-xs font-medium">
              Shaded Thinnai Verandah
            </span>
          </div>
        </div>

        <div className="mt-14 text-center">
          <Button asChild variant="outline" className="text-xs uppercase tracking-wider font-medium border-border">
            <Link href="/projects" className="inline-flex items-center gap-2">
              <span>Explore Homes Built With These Principles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
