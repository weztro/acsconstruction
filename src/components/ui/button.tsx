import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none rounded-md",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-[#465C63] dark:hover:bg-[#899EA4] active:scale-[0.99]",
        architectural:
          "bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-[11px] px-5 py-2.5 shadow-xs hover:bg-[#465C63] dark:hover:bg-[#899EA4] transition-all active:scale-[0.99]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/80 shadow-xs",
        outline:
          "border border-border bg-transparent hover:bg-secondary/40 text-foreground active:bg-secondary/60",
        terracottaOutline:
          "border border-[#B86F55] text-[#B86F55] dark:text-[#B8735B] dark:border-[#B8735B] bg-transparent hover:bg-[#B86F55] hover:text-white dark:hover:text-white transition-all duration-200 uppercase tracking-wider text-[11px] font-semibold",
        ghost:
          "hover:bg-secondary/50 hover:text-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-[11px]",
        lg: "h-11 px-6 text-xs",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
