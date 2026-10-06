"use client";

import * as React from "react";
import Link from "next/link";
import { INDIAN_DESIGN_STYLES, type DesignStyle } from "@/lib/constants";
import { fetchProjectTypesFromFirestore, fetchHiddenDefaults } from "@/lib/firebase";
import { ArrowRight } from "lucide-react";
import { ArchitecturalImage } from "@/components/ui/architectural-image";

export function ArchitectureShowcase() {
  const [styles, setStyles] = React.useState<DesignStyle[]>(INDIAN_DESIGN_STYLES);

  React.useEffect(() => {
    let isMounted = true;
    Promise.all([fetchProjectTypesFromFirestore(), fetchHiddenDefaults()])
      .then(([custom, hidden]) => {
        if (!isMounted) return;
        const hiddenIds = new Set(hidden.hiddenStyles);
        const mappedCustom: DesignStyle[] = (custom || []).map((c) => ({
          id: c.id || c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: c.title,
          tagline: c.tagline || "Custom Architectural Style",
          description:
            c.description ||
            "Bespoke residential style crafted for local climate, honest materials, and family traditions.",
          keyElements:
            c.keyElements && c.keyElements.length > 0
              ? c.keyElements
              : ["Vernacular Design", "Natural Stone", "Custom Courtyard"],
          imageUrl: c.imageUrl || "/images/architecture/traditional-heritage.jpg",
        }));
        const validDefaults = INDIAN_DESIGN_STYLES.filter((s) => !hiddenIds.has(s.id));
        setStyles([...mappedCustom, ...validDefaults]);
      })
      .catch(console.warn);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-24 lg:py-36 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B]">
            Aesthetic Heritage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            Indian Homes, Reimagined.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-[1.7]">
            We celebrate the architectural wisdom of India — courtyards, jaalis,
            shaded verandahs, and natural ventilation — refined for modern family life.
          </p>
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {styles.map((style) => (
            <div
              key={style.id}
              className="group flex flex-col justify-between rounded-md overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-xs"
            >
              {/* Large Image Frame 16:10 */}
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary/30">
                <ArchitecturalImage
                  src={style.imageUrl}
                  alt={`${style.title} Indian Architectural Style`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-104"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-medium tracking-wider text-amber-100/90">
                    {style.tagline}
                  </span>
                  <h3 className="font-serif text-lg font-normal text-white mt-0.5">
                    {style.title}
                  </h3>
                </div>
              </div>

              {/* Text Description & Key vernacular elements */}
              <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {style.description}
                </p>

                {/* Key Architectural Elements */}
                <div className="pt-3 border-t border-border/60">
                  <div className="flex flex-wrap gap-1.5">
                    {style.keyElements.map((el) => (
                      <span
                        key={el}
                        className="text-[11px] bg-secondary/60 text-foreground px-2 py-0.5 rounded-sm border border-border/50"
                      >
                        {el}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary group-hover:underline"
                  >
                    <span>View Projects In This Style</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
