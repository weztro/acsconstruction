import { TESTIMONIALS } from "@/lib/constants";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-24 lg:py-36 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B]">
            Homeowner Reflections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            What Families Say.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-[1.7]">
            Stories from homeowners who entrusted us with designing and constructing
            their family residences.
          </p>
        </div>

        {/* 3 Refined Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-8 sm:p-9 bg-card border border-border rounded-md flex flex-col justify-between hover:border-primary/50 transition-colors relative shadow-xs"
            >
              <Quote className="w-8 h-8 text-primary/15 absolute top-7 right-7" />

              <div className="space-y-4 relative z-10">
                <p className="text-sm sm:text-base italic text-foreground/90 font-light leading-[1.7]">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border/60">
                <h4 className="font-serif text-base font-normal text-foreground">
                  {t.clientName}
                </h4>
                <p className="text-xs text-primary font-medium mt-0.5">
                  {t.homeType}
                </p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                  <span>{t.city}</span>
                  <span className="font-mono">{t.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
