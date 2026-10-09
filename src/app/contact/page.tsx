import { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { ContactForm } from "@/components/contact/ContactForm";
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Contact & Consultation",
  description:
    "Schedule an architectural consultation or site visit for your Indian home construction project with our principal sthapatis and civil engineers.",
};

export default function ContactPage() {
  return (
    <div className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20 space-y-3">
          <Badge variant="terracotta" className="tracking-widest uppercase text-[11px]">
            Start the Conversation
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            Let&rsquo;s Talk About Your Home.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-[1.7]">
            Whether you already possess a plot and need turnkey execution, or wish to begin with
            architectural concept drawings and Vastu alignment, we are here to listen.
          </p>
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Studio Contact & Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-5 sm:p-8 md:p-9 bg-card border border-border rounded-md space-y-6 shadow-xs">
              <h2 className="font-serif text-2xl font-normal text-foreground">
                Main Design Atelier
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <div>
                    <strong className="text-foreground block font-medium">Studio Address</strong>
                    <span>{BRAND.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <div>
                    <strong className="text-foreground block font-medium">Direct Telephone</strong>
                    <a
                      href={`tel:${BRAND.phone}`}
                      className="hover:text-primary transition-colors font-medium text-foreground"
                    >
                      {BRAND.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <div>
                    <strong className="text-foreground block font-medium">General Enquiries</strong>
                    <a
                      href={`mailto:${BRAND.email}`}
                      className="hover:text-primary transition-colors"
                    >
                      {BRAND.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <div>
                    <strong className="text-foreground block font-medium">Studio Hours</strong>
                    <span>{BRAND.workingHours}</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA Button */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hello%20ACS%20Construction,%20I%20would%20like%20to%20discuss%20a%20house%20construction%20project.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs uppercase tracking-wider transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

            {/* What to expect card */}
            <div className="p-6 bg-secondary/30 border border-border rounded-md space-y-3 text-xs text-muted-foreground">
              <h3 className="font-serif text-sm font-normal text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Our Consultation Commitment</span>
              </h3>
              <ul className="space-y-2 list-disc list-inside leading-relaxed">
                <li>Zero-obligation preliminary floor plan discussion.</li>
                <li>Clear guidance on local municipal setbacks and floor area ratio (FAR).</li>
                <li>Itemized turnkey estimate based on current market materials.</li>
              </ul>
            </div>

            {/* Regional Branch Coverage */}
            <div className="p-6 bg-card border border-border rounded-md space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                <Compass className="w-3.5 h-3.5 text-primary" />
                <span>Active Project Locations</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tenkasi • Sankarankovil • Tirunelveli • Madurai • Rajapalayam • Tamil Nadu
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
