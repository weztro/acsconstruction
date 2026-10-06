"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ArchitecturalImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  containerClassName?: string;
}

export function ArchitecturalImage({
  src,
  alt,
  className,
  containerClassName,
  fallbackSrc = "/images/hero/hero-villa.jpg",
  ...props
}: ArchitecturalImageProps) {
  const [prevSrc, setPrevSrc] = React.useState(src);
  const [imgSrc, setImgSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setImgSrc(src);
    setHasError(false);
  }

  const isBase64 = typeof imgSrc === "string" && (imgSrc.startsWith("data:") || imgSrc.startsWith("blob:"));

  return (
    <div
      className={cn(
        "overflow-hidden bg-secondary/30",
        props.fill ? "absolute inset-0 w-full h-full" : "relative",
        containerClassName
      )}
    >
      <Image
        {...props}
        unoptimized={props.unoptimized ?? isBase64}
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          hasError ? "opacity-80" : "opacity-100",
          className
        )}
        onError={() => {
          if (!hasError) {
            console.warn(`ArchitecturalImage fallback triggered for: ${String(src)}`);
            setHasError(true);
          }
        }}
      />
    </div>
  );
}
