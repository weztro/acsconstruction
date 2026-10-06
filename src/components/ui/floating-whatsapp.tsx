"use client";

import { BRAND } from "@/lib/constants";
import { MessageSquare } from "lucide-react";

export function FloatingWhatsApp() {
  const cleanNumber = BRAND.whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=Hello%20ACS%20Construction,%20I%20would%20like%20to%20discuss%20a%20house%20construction%20project.`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with ACS Construction on WhatsApp"
        className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        <MessageSquare className="w-5 h-5 fill-white/20 stroke-[2.2]" />
        <span className="text-xs font-semibold tracking-wider uppercase hidden sm:inline-block">
          WhatsApp Us
        </span>
      </a>
    </div>
  );
}
