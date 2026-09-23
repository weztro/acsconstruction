"use client";

import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  asLink?: boolean;
}

export function AcsMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-9 h-9 shrink-0", className)}
      aria-hidden="true"
    >
      {/* Architectural Plinth Squircle */}
      <rect
        width="40"
        height="40"
        rx="8"
        className="fill-primary transition-colors"
      />
      {/* Architectural Cantilever / A-Frame Pavilion Structure */}
      {/* Outer structural apex frame */}
      <path
        d="M20 9L9 29H14.5L20 18.5L25.5 29H31L20 9Z"
        fill="currentColor"
        className="text-primary-foreground"
      />
      {/* Foundation plinth lintel */}
      <rect
        x="13"
        y="23"
        width="14"
        height="2.5"
        rx="1"
        className="fill-[#B86F55] dark:fill-[#B8735B]"
      />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  textClassName,
  size = "md",
  showTagline = true,
  asLink = true,
}: LogoProps) {
  const sizeStyles = {
    sm: {
      mark: "w-7 h-7",
      title: "text-base",
      tagline: "text-[9px]",
    },
    md: {
      mark: "w-9 h-9",
      title: "text-lg sm:text-xl",
      tagline: "text-[10px]",
    },
    lg: {
      mark: "w-10 h-10",
      title: "text-xl sm:text-2xl",
      tagline: "text-[11px]",
    },
  };

  const currentSize = sizeStyles[size];

  const content = (
    <div className={cn("group inline-flex items-center gap-3", className)}>
      <AcsMark
        className={cn(
          currentSize.mark,
          "group-hover:scale-103 transition-transform duration-200",
          markClassName
        )}
      />
      <div className="flex flex-col">
        <span
          className={cn(
            "font-serif font-normal tracking-tight text-foreground group-hover:text-primary transition-colors leading-none",
            currentSize.title,
            textClassName
          )}
        >
          {BRAND.name}
        </span>
        {showTagline && BRAND.tagline && (
          <span
            className={cn(
              "font-mono uppercase tracking-widest text-muted-foreground mt-1 hidden sm:block",
              currentSize.tagline
            )}
          >
            {BRAND.tagline}
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md inline-block"
        aria-label={`${BRAND.name} Home`}
      >
        {content}
      </Link>
    );
  }

  return content;
}
