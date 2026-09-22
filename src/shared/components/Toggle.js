"use client";

import { cn } from "@/shared/utils/cn";

export default function Toggle({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className,
}) {
  const handleClick = () => {
    if (!disabled && onChange) onChange(!checked);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 font-mono",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold tracking-wider uppercase border transition-colors cursor-pointer rounded-none select-none",
          checked
            ? "border-primary bg-primary text-black"
            : "border-border bg-surface-2 text-text-muted hover:border-primary/50",
          disabled && "cursor-not-allowed"
        )}
      >
        {checked ? "[ON]" : "[OFF]"}
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-xs font-semibold text-text-main uppercase tracking-wider">{label}</span>
          )}
          {description && (
            <span className="text-[11px] text-text-muted">// {description}</span>
          )}
        </div>
      )}
    </div>
  );
}
