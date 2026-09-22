"use client";

import { cn } from "@/shared/utils/cn";

const variants = {
  primary:
    "border border-primary bg-primary/10 text-primary hover:bg-primary hover:text-black focus:bg-primary focus:text-black",
  secondary:
    "border border-border bg-surface-2 text-text-muted hover:border-primary hover:text-primary hover:bg-surface-3",
  outline:
    "border border-border bg-transparent text-text-main hover:border-primary hover:text-primary hover:bg-primary/10",
  ghost:
    "border border-transparent text-text-muted hover:text-primary hover:border-border hover:bg-surface-2",
  danger:
    "border border-danger bg-danger/10 text-danger hover:bg-danger hover:text-black",
  success:
    "border border-primary bg-primary text-black hover:bg-primary-hover hover:text-black",
};

const sizes = {
  sm: "h-7 px-2.5 text-xs",
  md: "h-8 px-3.5 text-xs sm:text-sm",
  lg: "h-10 px-5 text-sm",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  disabled = false,
  loading = false,
  fullWidth = false,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer rounded-none select-none",
        "active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <span className="opacity-60 select-none text-[0.85em]">[</span>
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
      ) : icon ? (
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
      ) : null}
      <span className="truncate">{children}</span>
      {iconRight && !loading && (
        <span className="material-symbols-outlined text-[16px]">{iconRight}</span>
      )}
      <span className="opacity-60 select-none text-[0.85em]">]</span>
    </button>
  );
}
