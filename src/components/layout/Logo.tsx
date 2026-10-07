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
        width={971}
        height={534}
        priority
        unoptimized
        className="w-full h-full object-contain dark:hidden"
      />
      <Image
        src="/images/logo/acs-logo-dark.png"
        alt={BRAND.name}
        width={971}
        height={534}
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
  showConstructionText = false,
  asLink = true,
}: LogoProps) {
  const sizeStyles = {
    sm: {
      mark: "h-9 sm:h-10",
      text: "text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.14em] mt-0.5",
    },
    md: {
      mark: "h-12 sm:h-14 lg:h-16",
      text: "text-[12px] sm:text-[14px] lg:text-[16px] tracking-[0.12em] sm:tracking-[0.14em] mt-1 sm:mt-1.5",
    },
    lg: {
      mark: "h-18 sm:h-22 lg:h-26",
      text: "text-base sm:text-lg lg:text-xl tracking-[0.14em] mt-1.5 sm:mt-2",
    },
    xl: {
      mark: "h-24 sm:h-28 lg:h-32",
      text: "text-xl sm:text-2xl tracking-[0.16em] mt-2",
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  const content = (
    <div className={cn("group inline-flex flex-col items-center justify-center text-center", className)}>
      <div
        className={cn(
          "relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-102",
          markClassName
        )}
      >
        {/* Light theme logo (dark 3D letters) */}
        <Image
          src="/images/logo/acs-logo.png"
          alt={BRAND.name}
          width={971}
          height={534}
          priority
          unoptimized
          className={cn(
            "w-auto object-contain dark:hidden drop-shadow-xs transition-all duration-300",
            currentSize.mark,
            imageClassName
          )}
        />
        {/* Dark theme logo (white 3D letters with gold glow) */}
        <Image
          src="/images/logo/acs-logo-dark.png"
          alt={BRAND.name}
          width={971}
          height={534}
          priority
          unoptimized
          className={cn(
            "w-auto object-contain hidden dark:block drop-shadow-xs transition-all duration-300",
            currentSize.mark,
            imageClassName
          )}
        />
      </div>

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
