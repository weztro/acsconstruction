"use client";

import * as React from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/lib/constants";
import {
  fetchTestimonialsFromFirestore,
  fetchHiddenDefaults,
  type DynamicTestimonial,
} from "@/lib/firebase";
import { Quote, Star } from "lucide-react";

interface TestimonialDisplayItem {
  id: string;
  quote: string;
  clientName: string;
  homeType: string;
  city: string;
  year: string;
  avatarUrl?: string;
  rating?: number;
}

export function Testimonials() {
  // Initialize with the static default testimonials
  const initialItems: TestimonialDisplayItem[] = TESTIMONIALS.map((t, idx) => ({
    id: `default-${idx + 1}`,
    quote: t.quote,
    clientName: t.clientName,
    homeType: t.homeType,
    city: t.city,
    year: t.year,
    rating: 5,
  }));

  const [testimonials, setTestimonials] = React.useState<TestimonialDisplayItem[]>(initialItems);

  React.useEffect(() => {
    let isMounted = true;
    Promise.all([fetchTestimonialsFromFirestore(), fetchHiddenDefaults()])
      .then(([customList, hiddenConfig]) => {
        if (!isMounted) return;

        const hiddenIds = new Set(hiddenConfig.hiddenTestimonials || []);

        // Filter default testimonials
        const validDefaults = initialItems.filter(
          (item) => !hiddenIds.has(item.id) && !hiddenIds.has(item.clientName)
        );

        // Map custom testimonials from Firebase
        const mappedCustom: TestimonialDisplayItem[] = (customList || []).map((c) => ({
          id: c.id || `custom-${c.clientName}`,
          quote: c.quote,
          clientName: c.clientName,
          homeType: c.homeType,
          city: c.city,
          year: c.year,
          avatarUrl: c.avatarUrl,
          rating: c.rating ?? 5,
        }));

        setTestimonials([...mappedCustom, ...validDefaults]);
      })
      .catch((err) => {
        console.warn("Could not load dynamic testimonials:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => {
            const initials = t.clientName
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase())
              .join("");

            return (
              <div
                key={t.id}
                className="p-8 sm:p-9 bg-card border border-border rounded-xl flex flex-col justify-between hover:border-primary/50 transition-colors relative shadow-xs"
              >
                <Quote className="w-8 h-8 text-primary/15 absolute top-7 right-7" />

                <div className="space-y-4 relative z-10">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <p className="text-sm sm:text-base italic text-foreground/90 font-light leading-[1.7]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border/60 flex items-center gap-4">
                  {/* Avatar / Monogram */}
                  {t.avatarUrl ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border/80 shadow-xs">
                      <Image
                        src={t.avatarUrl}
                        alt={t.clientName}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary font-serif font-medium text-sm flex items-center justify-center shrink-0">
                      {initials || "AC"}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif text-base font-normal text-foreground truncate">
                      {t.clientName}
                    </h4>
                    <p className="text-xs text-primary font-medium truncate mt-0.5">
                      {t.homeType}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                      <span className="truncate">{t.city}</span>
                      <span className="font-mono shrink-0 ml-2">{t.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
