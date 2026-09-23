import Link from "next/link";
import { PROCESS_STEPS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export function ConstructionProcess() {
  return (
    <section className="py-24 lg:py-36 bg-secondary/20 border-t border-border" id="process">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B]">
              Disciplined Execution
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
              Our 7-Step Building Journey.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-[1.7]">
              Every milestone is structured, digitally tracked, and inspected
              before proceeding to the next phase.
            </p>
          </div>
          <Button asChild variant="outline" className="text-xs uppercase tracking-wider font-medium border-border">
            <Link href="/process">Full Process Guide</Link>
          </Button>
        </div>

        {/* Desktop Horizontal Scroll / Grid Timeline */}
        <div className="hidden lg:block overflow-x-auto pb-4">
          <div className="grid grid-cols-7 gap-4 min-w-[1050px]">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="relative flex flex-col p-6 bg-card border border-border rounded-md group hover:border-primary/60 transition-colors shadow-xs"
              >
                {/* Step number badge & duration */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm font-semibold text-primary">
                    {step.step}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded-sm">
                    {step.duration}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-normal text-foreground mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {step.description}
                </p>

                {/* Progress track arrow indicator */}
                {idx < PROCESS_STEPS.length - 1 && (
                  <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-border flex items-center justify-center text-muted-foreground">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-border">
          {PROCESS_STEPS.map((step) => (
            <div key={step.step} className="relative pl-10">
              {/* Bullet Node */}
              <div className="absolute left-2.5 top-1 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background" />

              <div className="p-6 bg-card border border-border rounded-md space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary">
                    STAGE {step.step}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded-sm">
                    {step.duration}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-normal text-foreground">
                  {step.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                <div className="pt-2 border-t border-border/60 space-y-1">
                  {step.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Check className="w-3 h-3 text-primary shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
