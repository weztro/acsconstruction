"use client";

import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  markClassName?: string;
  imageClassName?: string;
  textClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  showText?: boolean;
  showConstructionText?: boolean;
  asLink?: boolean;
}

export function AcsMark({ className }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 flex items-center justify-center", className)}>
      <Image
        src="/images/logo/acs-logo.png"
        alt={BRAND.name}
        width={997}
        height={456}
        priority
        unoptimized
        className="w-full h-full object-contain dark:hidden"
      />
      <Image
        src="/images/logo/acs-logo-dark.png"
        alt={BRAND.name}
        width={997}
        height={456}
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
  imageClassName,
  textClassName,
  size = "md",
  showTagline = true,
  showText = false,
  showConstructionText = true,
  asLink = true,
}: LogoProps) {
  const sizeStyles = {
    sm: {
      mark: "h-9 sm:h-10",
      text: "text-[8.5px] sm:text-[9.5px] tracking-[0.26em] mt-0.5",
    },
    md: {
      mark: "h-13 sm:h-16 lg:h-18",
      text: "text-[10px] sm:text-[11.5px] lg:text-[13px] tracking-[0.3em] sm:tracking-[0.34em] mt-1 sm:mt-1.5",
    },
    lg: {
      mark: "h-18 sm:h-22 lg:h-26",
      text: "text-sm sm:text-base tracking-[0.34em] sm:tracking-[0.38em] mt-1.5 sm:mt-2",
    },
    xl: {
      mark: "h-24 sm:h-28 lg:h-32",
      text: "text-base sm:text-lg tracking-[0.36em] mt-2",
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  const content = (
    <div className={cn("group inline-flex flex-col items-center justify-center text-center", className)}>
      <div
        className={cn(
          "relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-104",
          markClassName
        )}
      >
        {/* Light theme logo */}
        <Image
          src="/images/logo/acs-logo.png"
          alt={BRAND.name}
          width={997}
          height={456}
          priority
          unoptimized
          className={cn(
            "w-auto object-contain dark:hidden drop-shadow-xs transition-all duration-300",
            currentSize.mark,
            imageClassName
          )}
        />
        {/* Dark theme logo */}
        <Image
          src="/images/logo/acs-logo-dark.png"
          alt={BRAND.name}
          width={997}
          height={456}
          priority
          unoptimized
          className={cn(
            "w-auto object-contain hidden dark:block drop-shadow-xs transition-all duration-300",
            currentSize.mark,
            imageClassName
          )}
        />
      </div>

      {/* Manual "CONSTRUCTION" Wordmark with synchronized zoom & weight hover */}
      {showConstructionText && (
        <span
          className={cn(
            "font-serif uppercase font-bold text-foreground/90 group-hover:text-primary group-hover:font-extrabold group-hover:scale-105 transition-all duration-300 origin-center inline-block select-none text-center leading-none",
            currentSize.text,
            textClassName
          )}
        >
          CONSTRUCTION
        </span>
      )}

      {showText && (
        <div className="flex flex-col mt-1">
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
