"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9 text-muted-foreground"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-9 h-9 text-foreground hover:bg-muted transition-colors rounded-sm"
            aria-label={isDark ? "Switch to daylight mode" : "Switch to warm dark mode"}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform rotate-0 scale-100" />
            ) : (
              <Moon className="h-4 w-4 text-primary transition-transform rotate-0 scale-100" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{isDark ? "Light Mode (Warm Ivory)" : "Dark Mode (Charcoal Stone)"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
