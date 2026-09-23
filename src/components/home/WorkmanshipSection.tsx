import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hammer, CheckCircle2, ShieldCheck } from "lucide-react";
import { ArchitecturalImage } from "@/components/ui/architectural-image";

export function WorkmanshipSection() {
  const craftPoints = [
    {
      title: "Master Sthapatis & Masons",
      desc: "Generational bricklayers who achieve millimeter-true plumb lines and precise mortar joints.",
    },
    {
      title: "Carpenters of Fine Wood",
      desc: "Artisans trained in traditional joinery, tongue-and-groove teak ceilings, and Charupadi benches.",
    },
    {
      title: "Daily On-Site Civil Engineers",
      desc: "Every pour of concrete, rebar overlap, and slump test is verified on-site by degreed structural engineers.",
    },
    {
      title: "Respect & Fair Wages",
      desc: "Every artisan and worker is insured, provided safety gear, and celebrated as the true makers of our homes.",
    },
  ];

  return (
    <section className="py-24 lg:py-36 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          {/* Left Column: Authentic Indian Craftsman Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-md overflow-hidden border border-border shadow-sm bg-secondary/30 group">
              <div className="aspect-[4/3] sm:aspect-[16/12] relative">
                <ArchitecturalImage
                  src="/images/workers/craftsman.jpg"
                  alt="Indian master mason laying wire-cut terracotta bricks with spirit level on residential site"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                />
              </div>

              {/* Subtle Inset Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-md bg-background/90 backdrop-blur-md border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Hammer className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-serif font-normal text-foreground">
                      Precision in Every Course
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      On-site spirit level checks ensure true verticality across every wall
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Principles */}
          <div className="lg:col-span-6 space-y-7">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Human Craftsmanship</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground leading-[1.2]">
                Built by People Who Care About Every Detail.
              </h2>
            </div>

            <p className="text-base text-muted-foreground font-light leading-[1.7] italic">
              &ldquo;Behind every beautiful home is skilled workmanship, careful planning
              and attention to detail.&rdquo;
            </p>

            <p className="text-sm text-muted-foreground leading-[1.7] max-w-xl">
              In an age of prefabricated shortcuts, we believe a home in India still demands
              the warmth of human hands. From dressing raw Sadahalli granite and fitting
              hand-carved teak door frames, to troweling lime plaster until it shines like silk,
              our artisans take personal pride in every square inch they shape.
            </p>

            {/* Craft Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {craftPoints.map((item) => (
                <div key={item.title} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Button asChild variant="default" className="text-xs tracking-wider uppercase font-medium">
                <Link href="/process" className="inline-flex items-center gap-2">
                  <span>Our 7-Step Building Process</span>
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
