import Link from "next/link";
import { SERVICES } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Hammer,
  KeyRound,
  Armchair,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Check,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Hammer,
  KeyRound,
  Armchair,
  Sparkles,
  ShieldCheck,
};

export function Services() {
  return (
    <section className="py-24 lg:py-36 bg-secondary/20 border-t border-border" id="services">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B]">
              Craft & Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
              Comprehensive Residential Services.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-[1.7]">
              From architectural concept drawings to the day we hand you the keys,
              every step is executed under one dedicated studio.
            </p>
          </div>
          <Button asChild variant="outline" className="self-start md:self-auto text-xs uppercase tracking-wider font-medium border-border">
            <Link href="/services">View All Capabilities</Link>
          </Button>
        </div>

        {/* 6 Customized Architectural Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.iconName] || Compass;

            return (
              <Card
                key={service.id}
                className="group flex flex-col justify-between border-border bg-card hover:border-primary/60 transition-all duration-300 rounded-md shadow-xs"
              >
                <CardHeader className="space-y-4 p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-md bg-secondary/60 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground/60">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription>
                      {service.shortDesc}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="px-7 sm:px-8 pb-7 sm:pb-8 pt-0 space-y-5">
                  {/* Key Deliverables Bullet Points */}
                  <div className="pt-4 border-t border-border/60 space-y-2">
                    {service.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/services#${service.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary group-hover:translate-x-1 transition-transform"
                    >
                      <span>Explore Scope</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
