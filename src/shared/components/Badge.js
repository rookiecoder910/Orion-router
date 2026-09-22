"use client";

import { cn } from "@/shared/utils/cn";

const variants = {
  default: "bg-surface-2 text-text-muted border border-border",
  primary: "bg-primary/10 text-primary border border-primary/50",
  success: "bg-primary/15 text-primary border border-primary",
  warning: "bg-secondary/15 text-secondary border border-secondary",
  error: "bg-danger/15 text-danger border border-danger",
  info: "bg-info/15 text-info border border-info",
};

const prefixes = {
  default: "SYS",
  primary: "PRM",
  success: "OK",
  warning: "WARN",
  error: "ERR",
  info: "INFO",
};

const sizes = {
  sm: "px-1.5 py-0.2 text-[10px]",
  md: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-xs sm:text-sm",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  icon,
  className,
}) {
  const prefix = prefixes[variant] || "LOG";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono font-bold tracking-wider uppercase rounded-none select-none",
        variants[variant],
        sizes[size],
        className
      )}
    >
      <span className="opacity-70 text-[0.85em] select-none">[{prefix}:</span>
      {icon && <span className="material-symbols-outlined text-[13px]">{icon}</span>}
      <span className="truncate">{children}</span>
      <span className="opacity-70 text-[0.85em] select-none">]</span>
    </span>
  );
}
