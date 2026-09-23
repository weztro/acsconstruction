import { WHY_CHOOSE_US } from "@/lib/constants";
import {
  ShieldCheck,
  UserCheck,
  Eye,
  Compass,
  Clock,
  HeartHandshake,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  UserCheck,
  Eye,
  Compass,
  Clock,
  HeartHandshake,
};

export function WhyChooseUs() {
  return (
    <section className="py-24 lg:py-36 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B]">
            Our Commitments
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            Why Indian Families Trust Us.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-[1.7]">
            Constructing a home is often the single largest investment in a family&rsquo;s lifetime.
            We treat your trust, capital, and family aspirations with absolute seriousness.
          </p>
        </div>

        {/* 6 Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_US.map((item, idx) => {
            const Icon = iconMap[item.iconName] || ShieldCheck;

            return (
              <div
                key={item.title}
                className="p-7 sm:p-8 bg-card border border-border rounded-md flex flex-col space-y-4 hover:border-primary/50 transition-colors group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-md bg-secondary/60 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground/60">
                    0{idx + 1}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-normal text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
