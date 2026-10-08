"use client";

import * as React from "react";
import { Check, Sparkles, ArrowRight, ShieldCheck, Phone, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  DEFAULT_PACKAGES,
  type DynamicPackage,
  BRAND,
} from "@/lib/constants";
import {
  fetchPackagesFromFirestore,
  fetchHiddenDefaults,
  saveLeadToFirestore,
} from "@/lib/firebase";

interface PackageCardsProps {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  tagline?: string;
}

export function PackageCards({
  id = "packages",
  className = "",
  title = "Turnkey Construction Packages",
  subtitle = "Transparent, itemized pricing per square foot with zero hidden escalations. Built with tested steel, certified cement, and milestone-backed craftsmanship.",
  tagline = "Itemized Pricing & Specifications",
}: PackageCardsProps) {
  const [packages, setPackages] = React.useState<DynamicPackage[]>(DEFAULT_PACKAGES);
  const [selectedPackage, setSelectedPackage] = React.useState<DynamicPackage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Modal Inquiry Form State
  const [formName, setFormName] = React.useState("");
  const [formPhone, setFormPhone] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formLocation, setFormLocation] = React.useState("");
  const [formArea, setFormArea] = React.useState("");
  const [formMessage, setFormMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [firestorePackages, hiddenConfig] = await Promise.all([
          fetchPackagesFromFirestore(),
          fetchHiddenDefaults(),
        ]);

        if (!isMounted) return;

        const hiddenIds = new Set(hiddenConfig.hiddenPackages || []);

        // Filter default packages that haven't been hidden
        const activeDefaults = DEFAULT_PACKAGES.filter((p) => p.id && !hiddenIds.has(p.id));

        // Merge defaults with custom packages
        const merged = [...activeDefaults, ...firestorePackages].filter(
          (pkg) => pkg.isActive !== false
        );

        // Sort by order
        merged.sort((a, b) => (a.order || 99) - (b.order || 99));

        if (merged.length > 0) {
          setPackages(merged);
        }
      } catch (err) {
        console.warn("Could not load dynamic packages, using defaults:", err);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenPackage = (pkg: DynamicPackage) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const notes = [
        `Selected Package: ${selectedPackage?.name} (${selectedPackage?.price})`,
        formArea ? `Approx Area: ${formArea} sq.ft` : null,
        formMessage ? `Notes: ${formMessage}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      const result = await saveLeadToFirestore({
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim() || "not-provided@client.com",
        location: formLocation.trim() || "Tamil Nadu",
        message: notes,
        projectType: `Package: ${selectedPackage?.name}`,
        budget: selectedPackage?.price,
      });

      if (result.success) {
        toast.success("Consultation request received! Our senior engineer will contact you shortly.");
        // Reset form
        setFormName("");
        setFormPhone("");
        setFormEmail("");
        setFormLocation("");
        setFormArea("");
        setFormMessage("");
        setIsDialogOpen(false);
      } else {
        toast.error("Failed to submit inquiry. Please call us directly.");
      }
    } catch {
      toast.error("Something went wrong. Please reach out via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappInquiryUrl = selectedPackage
    ? `https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hello ${BRAND.name}, I am interested in your ${selectedPackage.name} plan (${selectedPackage.price}). Could you provide a detailed BOQ and schedule an architectural consultation?`
      )}`
    : `https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, "")}`;

  return (
    <section id={id} className={`py-24 lg:py-32 bg-background border-t border-border ${className}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs font-semibold uppercase tracking-wider text-[#B86F55] dark:text-[#B8735B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{tagline}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground tracking-tight">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 3-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8 items-stretch">
          {packages.map((pkg) => {
            const isPopular = Boolean(pkg.isPopular);

            return (
              <div
                key={pkg.id || pkg.name}
                className={`relative flex flex-col justify-between rounded-2xl transition-all duration-300 bg-card p-7 sm:p-8 ${
                  isPopular
                    ? "border-2 border-[#B86F55] dark:border-[#B8735B] shadow-xl md:-translate-y-2.5 z-10"
                    : "border border-border/90 shadow-sm hover:border-primary/50 hover:shadow-md"
                }`}
              >
                {/* Popular Ribbon / Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-[#B86F55] dark:bg-[#B8735B] text-white text-[11px] font-bold tracking-widest uppercase px-4 py-1 rounded-full shadow-sm">
                      {pkg.badge || "MOST POPULAR"}
                    </span>
                  </div>
                )}

                {/* Card Top: Title & Price */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-serif text-2xl font-normal text-foreground">
                      {pkg.name}
                    </h3>
                    {!isPopular && pkg.badge && (
                      <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  {/* Price display with prominent styling */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`font-serif text-3xl sm:text-4xl font-semibold tracking-tight ${
                          isPopular
                            ? "text-[#B86F55] dark:text-[#B8735B]"
                            : "text-foreground"
                        }`}
                      >
                        {pkg.price}
                      </span>
                    </div>
                    {pkg.unit && (
                      <p className="text-xs text-muted-foreground mt-1">{pkg.unit}</p>
                    )}
                  </div>

                  {/* Features List with green checkmarks (mirrors Image 1 reference) */}
                  <div className="space-y-3.5 pt-6 border-t border-border/80">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-[13px] text-foreground/90">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom CTA Button */}
                <div className="pt-8 mt-6 border-t border-border/50">
                  <Button
                    type="button"
                    onClick={() => handleOpenPackage(pkg)}
                    className={`w-full h-12 text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-200 rounded-lg ${
                      isPopular
                        ? "bg-[#B86F55] hover:bg-[#A35F48] dark:bg-[#B8735B] dark:hover:bg-[#A8644E] text-white shadow-md hover:shadow-lg"
                        : "bg-secondary/80 hover:bg-secondary text-foreground border border-border hover:border-primary/40"
                    }`}
                  >
                    <span>Choose Plan</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-16 p-6 sm:p-8 bg-secondary/40 border border-border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#B86F55] dark:text-[#B8735B]" />
            </div>
            <div>
              <h4 className="font-serif text-base sm:text-lg text-foreground font-normal">
                Need a Custom Architectural Blueprint or Hybrid Specification?
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every home has unique soil, slope, and lifestyle criteria. We tailor BOQs down to the exact brand choice.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="shrink-0 border-border text-xs uppercase tracking-wider">
            <a href={`tel:${BRAND.phone.replace(/[^0-9]/g, "")}`}>
              <Phone className="w-3.5 h-3.5 mr-2" />
              Speak with Head Architect
            </a>
          </Button>
        </div>
      </div>

      {/* POPUP / MODAL DIALOG for the Selected Package */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          {selectedPackage && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-mono font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Plan Specifications &amp; Consultation
                  </span>
                  {selectedPackage.isPopular && (
                    <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-[#B86F55] text-white">
                      Most Popular
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-4">
                  <DialogTitle className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
                    {selectedPackage.name}
                  </DialogTitle>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#B86F55] dark:text-[#B8735B]">
                    {selectedPackage.price}
                  </div>
                </div>

                <DialogDescription className="text-xs sm:text-sm text-muted-foreground pt-2">
                  {selectedPackage.description ||
                    "Full turnkey civil construction and architectural execution with milestone-linked delivery guarantees."}
                </DialogDescription>
              </DialogHeader>

              {/* Detailed Category Specifications Breakdown */}
              {selectedPackage.detailedSpecs && selectedPackage.detailedSpecs.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                    Detailed Material &amp; Engineering Inclusions:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {selectedPackage.detailedSpecs.map((cat, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg bg-secondary/40 border border-border/80 space-y-2 text-xs"
                      >
                        <div className="font-serif font-medium text-foreground text-sm flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-primary" />
                          <span>{cat.category}</span>
                        </div>
                        <ul className="space-y-1.5 text-muted-foreground">
                          {cat.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-500 font-bold shrink-0">✓</span>
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instant Inquiry Booking Form */}
              <div className="pt-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg text-foreground font-normal">
                    Request Itemized BOQ &amp; Site Feasibility
                  </h4>
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Instant WhatsApp</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="formName" className="text-xs">Your Full Name *</Label>
                      <Input
                        id="formName"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        required
                        className="h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="formPhone" className="text-xs">Phone Number *</Label>
                      <Input
                        id="formPhone"
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        required
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="formEmail" className="text-xs">Email (Optional)</Label>
                      <Input
                        id="formEmail"
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="formLocation" className="text-xs">Plot City / Location</Label>
                      <Input
                        id="formLocation"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="e.g. Tenkasi, Chennai, Madurai"
                        className="h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="formArea" className="text-xs">Plot / Built-up Area</Label>
                      <Input
                        id="formArea"
                        value={formArea}
                        onChange={(e) => setFormArea(e.target.value)}
                        placeholder="e.g. 2,400 sq.ft"
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="formMessage" className="text-xs">Specific Requirements / Notes</Label>
                    <Textarea
                      id="formMessage"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="e.g. Looking to start construction next month, need Vastu-compliant ground+1 floor design..."
                      rows={2}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full sm:w-auto text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-[#B86F55] hover:bg-[#A35F48] dark:bg-[#B8735B] dark:hover:bg-[#A8644E] text-white text-xs font-semibold px-6 h-10"
                    >
                      {isSubmitting ? "Submitting..." : `Confirm Inquiry for ${selectedPackage.name}`}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
