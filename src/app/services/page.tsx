import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { ServicesList } from "@/components/services/ServicesList";
import { PackageCards } from "@/components/home/PackageCards";

export const metadata: Metadata = {
  title: "Services & Capabilities",
  description:
    "End-to-end residential construction and architectural design services in India: turnkey villa execution, structural engineering, interior carpentry, and heritage renovation.",
};

const FAQS = [
  {
    q: "What does your Turnkey Construction service include?",
    a: "Turnkey covers every phase from municipal sanction drawings, soil bore testing, and architectural blueprinting, through structural RCC civil work, brick masonry, plumbing, electricals, waterproofing, flooring, joinery, and painting, right up to deep cleaning and key handover with all warranties.",
  },
  {
    q: "How are construction costs estimated?",
    a: "We provide an itemized Bill of Quantities (BOQ) specifying brands (e.g. Tata Tiscon, Ultratech, Jaquar, Asian Paints), quantities, and labor rates. The price is fixed per agreed milestone, protecting you from mid-project budget escalations.",
  },
  {
    q: "Do you accommodate traditional Indian Vastu Shastra?",
    a: "Yes. Our sthapatis and architects specialize in integrating scientific Vastu principles — natural morning light from the East, water elements in the Northeast (Ishanya), and quiet master retreats in the Southwest (Nairuthi) — harmonized with contemporary modern layouts.",
  },
  {
    q: "What is your typical construction timeline for a 4,000 sq.ft villa?",
    a: "Typically 12 to 15 months from excavation to handover, governed by strict milestone schedules with curing times scientifically maintained.",
  },
  {
    q: "Can you provide architectural design if I already have a civil contractor?",
    a: "Yes. We offer independent Architectural Design & Engineering packages, delivering full 2D CAD sets, 3D photorealistic renderings, structural engineering calculations, and electrical/plumbing layout drawings.",
  },
];

export default function ServicesPage() {
  return (
    <div className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20 space-y-3">
          <Badge variant="terracotta" className="tracking-widest uppercase text-[11px]">
            Comprehensive Capabilities
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            Residential Construction &amp; Design.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-[1.7]">
            Crafting homes for Indian families requires both artistic sensitivity and
            uncompromising engineering rigor. Explore our core specialized practices.
          </p>
        </div>

        {/* Dynamic Services List */}
        <ServicesList />

        {/* Turnkey Construction Packages Section */}
        <div className="mt-24 lg:mt-32">
          <PackageCards
            className="border-none py-0 lg:py-0"
            title="Curated Turnkey Packages"
            subtitle="Transparent per-sq.ft rates with itemized material specifications and fixed handover commitments."
          />
        </div>

        {/* Construction FAQs using shadcn Accordion */}
        <div className="mt-24 lg:mt-32 max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B] flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Clarity &amp; Answers</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Everything you need to know about working with our construction and architectural studio.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full bg-card border border-border p-6 sm:p-8 rounded-md shadow-xs">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="font-serif text-base sm:text-lg font-normal">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-[1.7]">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Final Services CTA */}
        <div className="mt-20 p-8 sm:p-12 bg-secondary/30 border border-border rounded-md text-center space-y-4 shadow-xs">
          <h3 className="font-serif text-2xl font-normal text-foreground">
            Have a specific architectural requirement?
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Our principal architect is available for in-person consultations across Tamil Nadu and South India.
          </p>
          <div className="pt-2">
            <Button asChild variant="default" className="text-xs uppercase tracking-wider font-medium">
              <Link href="/contact">Book a Consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
