"use client";

import { cn } from "@/shared/utils/cn";

export default function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  error,
  hint,
  disabled = false,
  required = false,
  className,
  selectClassName,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-1 font-mono", className)}>
      {label && (
        <label className="text-xs uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <span className="text-primary select-none">&gt;</span>
          <span>{label}</span>
          {required && <span className="text-danger select-none">*</span>}
        </label>
      )}
      <div className="relative flex items-center bg-surface border border-border focus-within:border-primary transition-colors">
        <div className="pl-3 pr-1 text-primary/60 flex items-center pointer-events-none select-none text-xs">
          $
        </div>
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            "w-full py-2 px-2 pr-8 text-xs sm:text-sm text-text-main font-mono bg-surface rounded-none",
            "border-none appearance-none focus:outline-none focus:ring-0",
            "disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
            error && "text-danger",
            selectClassName
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-text-muted">
          <span className="text-xs select-none">[v]</span>
        </div>
      </div>
      {error && (
        <p className="text-[11px] text-danger flex items-center gap-1 mt-0.5">
          <span className="font-bold select-none">[ERR]</span>
          <span>{error}</span>
        </p>
      )}
      {hint && !error && (
        <p className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
          <span className="text-text-subtle select-none">//</span>
          <span>{hint}</span>
        </p>
      )}
    </div>
  );
}
