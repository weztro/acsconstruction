import { Metadata } from "next";
import Link from "next/link";
import { PROCESS_STEPS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  FileCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "7-Step Construction Process",
  description:
    "Explore our structured, transparent 7-step residential construction process from initial consultation to final Graha Pravesam handover.",
};

export default function ProcessPage() {
  return (
    <div className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-20 lg:space-y-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="terracotta" className="tracking-widest uppercase text-[11px]">
            Disciplined Methodology
          </Badge>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.15]">
            From Blueprint to Graha Pravesam.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-light leading-[1.7]">
            Constructing a home shouldn&rsquo;t be chaotic or stressful. We follow a milestone-locked
            7-stage lifecycle with weekly digital updates, transparent BOQs, and standardized laboratory tests.
          </p>
        </div>

        {/* 7 Process Stages In-Depth */}
        <div className="space-y-12">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="p-7 sm:p-10 bg-card border border-border rounded-md shadow-xs hover:border-primary/50 transition-colors"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Step badge & Title */}
                <div className="lg:col-span-4 space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-primary bg-secondary px-2.5 py-1 rounded-sm">
                      PHASE {step.step}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {step.duration}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
                    {step.title}
                  </h2>
                </div>

                {/* Description and Key Activities */}
                <div className="lg:col-span-8 space-y-5">
                  <p className="text-sm sm:text-base text-muted-foreground leading-[1.7]">
                    {step.description}
                  </p>

                  <div className="p-5 bg-secondary/30 rounded-md border border-border">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-primary" />
                      <span>Key Milestone Outputs</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {step.highlights.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Digital Tracking & Communication Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 sm:p-12 bg-secondary/30 border border-border rounded-md items-center shadow-xs">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Transparency System</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground leading-snug">
              Weekly Live Photo Logs & Milestone Sign-Offs
            </h3>
            <p className="text-sm text-muted-foreground leading-[1.7]">
              Living abroad or in another city during construction? We maintain a dedicated
              digital portal for your residence. Every Friday, our site civil engineer uploads
              high-resolution photographs of masonry, curing ponds, rebar arrangements, and material deliveries.
            </p>
          </div>

          <div className="p-7 bg-card border border-border rounded-md space-y-3.5 text-xs text-muted-foreground shadow-xs">
            <h4 className="font-serif text-base font-normal text-foreground">
              What Homeowners Receive at Handover:
            </h4>
            <ul className="space-y-2 list-disc list-inside leading-relaxed">
              <li>Laminated As-Built Electrical & Plumbing Conduit Schematics</li>
              <li>10-Year Structural RCC Stability Guarantee Bond</li>
              <li>72-Hour Terrace Waterproofing Pond Test Certificates</li>
              <li>Appliance, Fixture & Sanitaryware Warranty Dossier</li>
              <li>Paint code references for future touchups</li>
            </ul>
          </div>
        </div>

        {/* Action CTA */}
        <div className="text-center space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
            Ready to initiate Step 01 (Consultation)?
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Book a meeting with our architects to review your plot details and discuss budget frameworks.
          </p>
          <div className="pt-2">
            <Button asChild variant="default" size="lg" className="text-xs uppercase tracking-wider font-medium">
              <Link href="/contact" className="inline-flex items-center gap-2">
                <span>Begin Your Project Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
