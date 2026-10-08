"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { ArchitecturalImage } from "@/components/ui/architectural-image";
import { DEFAULT_HERO_METRICS, type HeroMetricItem } from "@/lib/constants";
import { fetchHeroMetricsFromFirestore } from "@/lib/firebase";

export function Hero() {
  const [metrics, setMetrics] = React.useState<HeroMetricItem[]>(DEFAULT_HERO_METRICS);

  React.useEffect(() => {
    let isMounted = true;
    fetchHeroMetricsFromFirestore().then((data) => {
      if (isMounted && data && data.length > 0) {
        setMetrics(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <section className="relative overflow-hidden pt-20 pb-28 lg:pt-28 lg:pb-36 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text & Ethos Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3">
              <Badge
                variant="terracotta"
                className="py-1 px-3 tracking-wider text-[11px] uppercase flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#B86F55] dark:text-[#B8735B]" />
                Indian Home Construction & Design
              </Badge>
              <span className="text-xs text-muted-foreground hidden sm:inline font-mono">
                Tenkasi • Sankarankovil • Tamil Nadu
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-foreground leading-[1.12]">
                Building Homes That <br className="hidden sm:inline" />
                Feel Like Home.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground font-light leading-[1.7] max-w-xl">
                From timeless traditional courtyard homes to contemporary
                Indian villas, we design and build spaces made for the way your
                family lives.
              </p>
            </div>

            {/* Architectural Highlights */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-secondary/50 px-3.5 py-1.5 rounded-md border border-border/60">
                <Compass className="w-3.5 h-3.5 text-primary" />
                <span>Vastu & Climate Responsive</span>
              </div>
              <div className="flex items-center gap-1.5 bg-secondary/50 px-3.5 py-1.5 rounded-md border border-border/60">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>10-Year Structural Stability</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button
                asChild
                variant="default"
                size="lg"
                className="h-11 px-7 text-xs tracking-wider uppercase font-medium"
              >
                <Link href="/services" className="flex items-center justify-center gap-2">
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 px-7 text-xs tracking-wider uppercase font-medium border-border"
              >
                <Link href="/contact">Get a Free Consultation</Link>
              </Button>
            </div>

            {/* Dynamic Quotation Trust Indicators with Generous Breathing Room */}
            <div className="pt-8 border-t border-border flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-muted-foreground">
              {metrics.map((item, idx) => (
                <React.Fragment key={item.id || idx}>
                  {idx > 0 && <div className="h-8 w-[1px] bg-border hidden xs:block" />}
                  <div className="space-y-0.5 min-w-[110px]">
                    <p className="font-serif text-base font-normal text-foreground tracking-tight">
                      {item.value}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{item.label}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Architectural Image Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-md overflow-hidden border border-border shadow-md group bg-card">
              {/* Main Architectural Hero Image */}
              <div className="aspect-[16/11] relative overflow-hidden">
                <ArchitecturalImage
                  src="/images/hero/hero-villa.jpg"
                  alt="Modern Indian Villa Architecture with warm lighting"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Architectural Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-md bg-background/90 backdrop-blur-md border border-border text-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider text-[#B86F55] dark:text-[#B8735B] uppercase">
                      Architectural Vision
                    </span>
                    <h4 className="font-serif text-sm font-normal text-foreground">
                      Bespoke Courtyard Villa Concept
                    </h4>
                  </div>
                  <Link
                    href="/services"
                    className="w-7 h-7 rounded-md bg-secondary/80 hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-primary transition-colors shrink-0"
                    aria-label="View architectural services"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
