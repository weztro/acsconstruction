import { TRUST_STATS } from "@/lib/constants";

export function TrustStats() {
  return (
    <section className="py-16 sm:py-20 bg-secondary/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {TRUST_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col justify-center ${
                idx !== 0 ? "pt-8 lg:pt-0 lg:pl-10" : ""
              }`}
            >
              <div className="flex items-baseline">
                <span className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-primary tracking-tight">
                  {stat.value}
                </span>
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mt-2">
                {stat.label}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 max-w-xs">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
