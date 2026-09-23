import { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Compass,
  Hammer,
  KeyRound,
  Armchair,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services & Capabilities",
  description:
    "End-to-end residential construction and architectural design services in India: turnkey villa execution, structural engineering, interior carpentry, and heritage renovation.",
};

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Hammer,
  KeyRound,
  Armchair,
  Sparkles,
  ShieldCheck,
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
            Residential Construction & Design.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-[1.7]">
            Crafting homes for Indian families requires both artistic sensitivity and
            uncompromising engineering rigor. Explore our six core specialized practices.
          </p>
        </div>

        {/* 6 In-depth Service Sections */}
        <div className="space-y-16 lg:space-y-20">
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.iconName] || Compass;

            return (
              <section
                key={service.id}
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
                          SERVICE 0{index + 1}
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
                        Technical Standards & Methodologies
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

                    <div className="pt-4 border-t border-border">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2.5">
                        Deliverables Included
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {service.deliverables.map((del) => (
                          <span
                            key={del}
                            className="text-xs bg-card text-foreground px-2.5 py-1 rounded-sm border border-border font-medium"
                          >
                            {del}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Construction FAQs using shadcn Accordion */}
        <div className="mt-24 lg:mt-32 max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B] flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Clarity & Answers</span>
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
            Our principal architect is available for in-person consultations in Bengaluru,
            Hyderabad, Chennai, and Kochi.
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
