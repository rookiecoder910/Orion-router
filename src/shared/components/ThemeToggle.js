"use client";

import { useTheme } from "@/shared/hooks/useTheme";
import { cn } from "@/shared/utils/cn";

export default function ThemeToggle({ className, variant = "default" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center justify-center px-2 py-1 border border-border text-xs text-primary hover:bg-primary hover:text-black font-mono font-bold transition-none rounded-none cursor-pointer",
        className
      )}
      aria-label="Terminal Display Mode"
      title="Terminal Display Mode"
    >
      <span>[CRT]</span>
    </button>
  );
}
