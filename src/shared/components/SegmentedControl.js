"use client";

import { cn } from "@/shared/utils/cn";

export default function SegmentedControl({
  options = [],
  value,
  onChange,
  size = "md",
  className,
}) {
  const sizes = {
    sm: "h-7 text-xs px-2.5",
    md: "h-8 text-xs sm:text-sm px-3",
    lg: "h-9 text-sm px-4",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-surface border border-border rounded-none overflow-x-auto font-mono",
        className
      )}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "shrink-0 font-bold uppercase tracking-wider transition-colors cursor-pointer select-none rounded-none inline-flex items-center gap-1.5",
              sizes[size],
              isActive
                ? "bg-primary text-black border border-primary"
                : "text-text-muted hover:text-primary hover:bg-surface-2 border border-transparent"
            )}
          >
            {option.icon && (
              <span className="material-symbols-outlined text-[16px]">
                {option.icon}
              </span>
            )}
            <span>{isActive ? `> ${option.label} <` : option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
