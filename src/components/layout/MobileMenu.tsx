"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, MessageSquare, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BRAND, NAVIGATION_LINKS } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden h-9 w-9 border-border"
          aria-label="Open mobile menu"
        >
          <Menu className="h-4 w-4 text-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0 flex flex-col justify-between bg-card">
        <div className="p-6">
          <SheetHeader className="text-left pb-4 border-b border-border">
            <Logo size="sm" asLink={false} />
          </SheetHeader>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1 mt-6" aria-label="Mobile Navigation">
            {NAVIGATION_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground/80 hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowRight className={`h-3.5 w-3.5 ${isActive ? "text-primary" : "text-muted-foreground/50"}`} />
                </Link>
              );
            })}
          </nav>

          <Separator className="my-6" />

          {/* Direct Actions */}
          <div className="space-y-2.5">
            <Button
              asChild
              className="w-full bg-primary hover:bg-[#465C63] text-primary-foreground font-medium text-xs py-2.5 h-10 rounded-md"
              onClick={() => setOpen(false)}
            >
              <Link href="/contact">
                Get a Quote
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-center text-xs h-10 border-border"
              onClick={() => setOpen(false)}
            >
              <a
                href={`https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>

        {/* Footer info inside mobile drawer */}
        <div className="p-6 bg-secondary/30 border-t border-border text-xs text-muted-foreground space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-primary" />
            <a href={`tel:${BRAND.phone}`} className="hover:text-foreground">
              {BRAND.phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>Bengaluru • Kochi • Hyderabad</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
