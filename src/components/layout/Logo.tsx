"use client";

import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  showText?: boolean;
  asLink?: boolean;
}

export function AcsMark({ className }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 flex items-center justify-center", className)}>
      <Image
        src="/images/logo/acs-logo.png"
        alt={BRAND.name}
        width={997}
        height={651}
        priority
        unoptimized
        className="w-full h-full object-contain dark:hidden"
      />
      <Image
        src="/images/logo/acs-logo-dark.png"
        alt={BRAND.name}
        width={997}
        height={651}
        priority
        unoptimized
        className="w-full h-full object-contain hidden dark:block"
      />
    </div>
  );
}

export function Logo({
  className,
  markClassName,
  textClassName,
  size = "md",
  showTagline = true,
  showText = false,
  asLink = true,
}: LogoProps) {
  const sizeStyles = {
    sm: "h-9 sm:h-10",
    md: "h-11 sm:h-12",
    lg: "h-16 sm:h-20",
    xl: "h-20 sm:h-24",
  };

  const heightClass = sizeStyles[size] || sizeStyles.md;

  const content = (
    <div className={cn("group inline-flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative shrink-0 flex items-center transition-transform duration-200 group-hover:scale-102",
          markClassName
        )}
      >
        {/* Light theme logo */}
        <Image
          src="/images/logo/acs-logo.png"
          alt={BRAND.name}
          width={997}
          height={651}
          priority
          unoptimized
          className={cn("w-auto object-contain dark:hidden drop-shadow-xs", heightClass)}
        />
        {/* Dark theme logo */}
        <Image
          src="/images/logo/acs-logo-dark.png"
          alt={BRAND.name}
          width={997}
          height={651}
          priority
          unoptimized
          className={cn("w-auto object-contain hidden dark:block drop-shadow-xs", heightClass)}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-serif font-medium tracking-tight text-foreground group-hover:text-primary transition-colors leading-none",
              size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl",
              textClassName
            )}
          >
            {BRAND.name}
          </span>
          {showTagline && BRAND.tagline && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1 hidden sm:block">
              {BRAND.tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md inline-block select-none"
        aria-label={`${BRAND.name} Home`}
      >
        {content}
      </Link>
    );
  }

  return content;
}
