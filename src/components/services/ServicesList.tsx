"use client";

import * as React from "react";
import Link from "next/link";
import { SERVICES, type ServiceItem } from "@/lib/constants";
import {
  fetchServicesFromFirestore,
  fetchHiddenDefaults,
  type DynamicService,
} from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Hammer,
  KeyRound,
  Armchair,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Home,
  Wrench,
  Ruler,
  Paintbrush,
  HardHat,
  Layers,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Hammer,
  KeyRound,
  Armchair,
  Sparkles,
  ShieldCheck,
  Home,
  Wrench,
  Ruler,
  Paintbrush,
  HardHat,
  Layers,
};

export function ServicesList() {
  const [services, setServices] = React.useState<ServiceItem[]>(SERVICES);

  React.useEffect(() => {
    let isMounted = true;

    async function loadServices() {
      try {
        const [firestoreServices, hiddenConfig] = await Promise.all([
          fetchServicesFromFirestore(),
          fetchHiddenDefaults(),
        ]);

        if (!isMounted) return;

        const hiddenIds = new Set(hiddenConfig.hiddenServices || []);
        const activeDefaults = SERVICES.filter((s) => !hiddenIds.has(s.id));
        const merged = [...activeDefaults, ...firestoreServices].filter(
          (s) => (s as DynamicService).isActive !== false
        );

        if (merged.length > 0) {
          setServices(merged);
        }
      } catch (err) {
        console.warn("Could not load dynamic services on services page:", err);
      }
    }

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 lg:space-y-20">
      {services.map((service, index) => {
        const Icon = iconMap[service.iconName] || Compass;

        return (
          <section
            key={service.id || index}
            id={service.id}
            className="scroll-mt-28 p-7 sm:p-10 bg-card border border-border rounded-md shadow-xs"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Service Header Info */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-md bg-secondary/60 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-primary font-semibold">
                      SERVICE {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
                      {service.title}
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-[1.7]">
                  {service.fullDesc}
                </p>

                <div className="pt-2">
                  <Button asChild variant="default" size="sm" className="text-xs uppercase tracking-wider font-medium">
                    <Link href="/contact" className="inline-flex items-center gap-2">
                      <span>Request Service Proposal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Features & Deliverables Column */}
              <div className="lg:col-span-6 bg-secondary/30 p-6 sm:p-7 rounded-md border border-border space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
                    Technical Standards &amp; Methodologies
                  </h3>
                  <div className="space-y-2.5">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2.5">
                      Deliverables Included
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {service.deliverables.map((del, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono px-2.5 py-1 rounded bg-card text-muted-foreground border border-border"
                        >
                          {del}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
