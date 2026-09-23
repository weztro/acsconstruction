import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { ArchitecturalImage } from "@/components/ui/architectural-image";

export function FinalCTA() {
  return (
    <section className="relative py-28 lg:py-36 overflow-hidden">
      {/* Architectural Backdrop */}
      <div className="absolute inset-0 bg-[#191A18]">
        <ArchitecturalImage
          src="/images/hero/hero-villa.jpg"
          alt="Indian Villa Architecture Backdrop"
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#191A18]/95 via-[#191A18]/85 to-[#191A18]/95" />
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center space-y-8">
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B8735B]">
            Begin Your Construction Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#F1EEE7] tracking-tight leading-tight">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-base sm:text-lg text-[#AAA69D] font-light max-w-xl mx-auto leading-[1.7]">
            &ldquo;Let&rsquo;s turn your ideas, plans and aspirations into a home built
            for your family.&rdquo;
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
          <Button
            asChild
            variant="default"
            size="lg"
            className="h-11 px-8 text-xs tracking-wider uppercase font-medium bg-primary hover:bg-[#465C63] text-white"
          >
            <Link href="/contact" className="inline-flex items-center gap-2">
              <span>Start Your Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 px-8 text-xs tracking-wider uppercase font-medium border-border/40 bg-transparent text-[#F1EEE7] hover:bg-white/10 hover:text-white"
          >
            <a href={`tel:${BRAND.phone}`} className="inline-flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>Call Our Principal Architect</span>
            </a>
          </Button>
        </div>

        <p className="text-xs text-[#AAA69D]/80 font-mono pt-2">
          Free Initial Floor Plan Consultation • On-Site Soil Review Available
        </p>
      </div>
    </section>
  );
}
