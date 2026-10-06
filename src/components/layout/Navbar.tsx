"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, NAVIGATION_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./Logo";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/80 shadow-xs py-2 sm:py-2.5"
          : "bg-background/85 backdrop-blur-xs border-b border-border/40 py-2.5 sm:py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand Logo & Ethos */}
        <Logo
          size="md"
          imageClassName={
            isScrolled
              ? "!h-12 sm:!h-14 lg:!h-16"
              : "!h-16 sm:!h-20 lg:!h-24"
          }
        />

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center space-x-1"
          aria-label="Main Navigation"
        >
          {NAVIGATION_LINKS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-xs font-medium tracking-wide transition-colors duration-200 rounded-md ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-foreground/75 hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0.5 left-4 right-4 h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle, Quote Button & Mobile Menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Button
            asChild
            variant="default"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Link href="/contact">Get a Quote</Link>
          </Button>

          {/* Mobile Navigation Drawer */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
