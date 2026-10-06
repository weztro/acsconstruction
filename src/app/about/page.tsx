import { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  ArrowRight,
} from "lucide-react";
import { TRUST_STATS } from "@/lib/constants";
import { ArchitecturalImage } from "@/components/ui/architectural-image";
import { TeamSection } from "@/components/about/TeamSection";

export const metadata: Metadata = {
  title: "About Our Studio & Heritage",
  description:
    "We are a premier Indian residential architecture and construction studio dedicated to building homes with natural stone, wood, concrete, and honest human craftsmanship.",
};

const LEADERSHIP = [
  {
    name: "Ar. K. Ramanathan",
    role: "Principal Architect & Founder",
    bio: "30+ years practicing vernacular and contemporary residential architecture. Trained at CEPT Ahmedabad with deep expertise in traditional South Indian wooden joinery and courtyard thermal physics.",
  },
  {
    name: "Er. Rajeshwari Menon",
    role: "Head of Structural & Civil Engineering",
    bio: "Former chief civil engineer on infrastructure projects with M.Tech in Earthquake Engineering from IIT Madras. Ensures every residential footing exceeds seismic and soil-bearing safety thresholds.",
  },
  {
    name: "Sthapati V. Murugesan",
    role: "Master of Traditional Indian Masonry",
    bio: "Fifth-generation temple and heritage sthapati from Thanjavur, supervising fine stone dressing, Athangudi tile casting, and classical wooden colonnades.",
  },
];

const MATERIAL_STANDARDS = [
  {
    category: "Primary Steel",
    spec: "Tata Tiscon Fe 550D Super Ductile TMT rebar with mill test certificates for every batch.",
  },
  {
    category: "Cement & Concreting",
    spec: "Ultratech 53-grade OPC for RCC structural frames and PPC for crack-free plastering.",
  },
  {
    category: "Natural Wood",
    spec: "Seasoned Burma teak, Anjili, and CP teak kiln-dried to under 12% moisture content.",
  },
  {
    category: "Masonry & Clay",
    spec: "High-density wire-cut kiln bricks with compressive strength above 10.5 N/mm² and zero efflorescence.",
  },
  {
    category: "Natural Stone",
    spec: "Sadahalli granite, Flamed Kota stone, Deccan basalt, and Kadappa slate sourced directly from certified quarries.",
  },
  {
    category: "Waterproofing",
    spec: "Multi-layer elastomeric polymer coatings backed by 72-hour terrace water ponding tests.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-24 lg:space-y-32">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="terracotta" className="tracking-widest uppercase text-[11px]">
            Our Origin & Ethos
          </Badge>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.15]">
            Building Homes for Indian Families.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-light leading-[1.7]">
            &ldquo;We don&rsquo;t just construct buildings. We build homes for Indian families —
            grounded in our rich architectural culture, crafted with earth and timber,
            and engineered for generations to come.&rdquo;
          </p>
        </div>

        {/* Origin Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] relative rounded-md overflow-hidden border border-border shadow-sm bg-secondary/30">
              <ArchitecturalImage
                src="/images/architecture/traditional-heritage.jpg"
                alt="Heritage Indian Home Architecture"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B]">
              Why We Started
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground leading-snug">
              A Departure from Generic Concrete Boxes.
            </h2>
            <p className="text-sm text-muted-foreground leading-[1.7]">
              Over the last two decades, Indian cities were flooded with generic glass-and-aluminum
              structures poorly suited for our tropical monsoons, scorching summers, and deep-rooted
              family gatherings. Rooms were dark, electricity bills for air conditioning were exorbitant,
              and ancestral craftsmanship was being lost.
            </p>
            <p className="text-sm text-muted-foreground leading-[1.7]">
              We founded our atelier to revive the wisdom of Indian homes: central courtyards that
              act as natural air pumps, shaded verandas where grandparents read morning papers,
              fragrant teak wood doors that welcome guests with dignity, and honest clay tiles
              that sing during the monsoon.
            </p>
            <div className="pt-2">
              <Button asChild variant="default" className="text-xs uppercase tracking-wider font-medium">
                <Link href="/services" className="inline-flex items-center gap-2">
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 sm:p-10 bg-card border border-border rounded-md divide-y sm:divide-y-0 sm:divide-x divide-border/60 shadow-xs">
          {TRUST_STATS.map((stat, i) => (
            <div key={stat.label} className={`space-y-1 ${i > 0 ? "pt-6 sm:pt-0 sm:pl-8" : ""}`}>
              <p className="font-serif text-3xl sm:text-4xl font-normal text-primary">
                {stat.value}
              </p>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mt-1">
                {stat.label}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Material & Engineering Standards */}
        <div className="space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Engineering Rigor</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
              Uncompromising Material Standards
            </h2>
            <p className="text-sm text-muted-foreground leading-[1.7]">
              We never compromise on structural steel, cement grades, or timber seasoning protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MATERIAL_STANDARDS.map((item) => (
              <div
                key={item.category}
                className="p-7 bg-card border border-border rounded-md space-y-2.5 hover:border-primary/50 transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  <h4 className="font-serif text-base font-normal text-foreground">
                    {item.category}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.spec}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Leadership & Engineers/Mesthris */}
        <TeamSection />

        {/* Bottom Banner */}
        <div className="p-8 sm:p-12 bg-secondary/30 border border-border rounded-md text-center space-y-4 shadow-xs">
          <h3 className="font-serif text-2xl font-normal text-foreground">
            Want to visit our active construction sites?
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Nothing conveys quality like seeing concrete curing, brick alignment, and joinery
            firsthand. We regularly host prospective homeowners on our active residential sites.
          </p>
          <div className="pt-2">
            <Button asChild variant="default" className="text-xs uppercase tracking-wider font-medium">
              <Link href="/contact">Request a Site Visit</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
