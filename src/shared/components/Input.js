"use client";

import { cn } from "@/shared/utils/cn";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  hint,
  icon,
  disabled = false,
  required = false,
  className,
  inputClassName,
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
        {icon ? (
          <div className="pl-3 pr-1 text-text-muted flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
          </div>
        ) : (
          <div className="pl-3 pr-1 text-primary/60 flex items-center pointer-events-none select-none text-xs">
            $
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            "w-full py-2 px-2 text-xs sm:text-sm text-text-main bg-transparent font-mono rounded-none",
            "border-none placeholder:text-text-subtle",
            "focus:outline-none focus:ring-0",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            error && "text-danger",
            inputClassName
          )}
          {...props}
        />
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
