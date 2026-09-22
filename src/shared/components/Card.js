"use client";

import { cn } from "@/shared/utils/cn";

export default function Card({
  children,
  title,
  subtitle,
  icon,
  action,
  padding = "md",
  hover = false,
  elev = false,
  className,
  ...props
}) {
  const paddings = {
    none: "",
    xs: "p-3",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  };

  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-none relative font-mono text-text-main",
        hover && "hover:border-primary transition-colors cursor-pointer",
        paddings[padding],
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-border/80 bg-surface-2 -mx-5 -mt-5 px-4 py-2 mb-4 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-text-subtle select-none">+---</span>
            {icon && (
              <span className="material-symbols-outlined text-[16px] text-primary shrink-0">{icon}</span>
            )}
            <div className="flex items-baseline gap-2 truncate">
              {title && (
                <h3 className="text-primary font-bold uppercase tracking-wider truncate">
                  [ {title} ]
                </h3>
              )}
              {subtitle && (
                <span className="text-text-muted text-[11px] hidden sm:inline truncate">
                  // {subtitle}
                </span>
              )}
            </div>
            <span className="text-text-subtle select-none hidden md:inline">---+</span>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

Card.Section = function CardSection({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "p-3 rounded-none bg-surface-2/70 border border-border font-mono",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Row = function CardRow({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "p-2.5 -mx-3 px-3 transition-colors rounded-none font-mono",
        "border-b border-border/60 last:border-b-0",
        "hover:bg-surface-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.ListItem = function CardListItem({
  children,
  actions,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between p-2.5 -mx-3 px-3 rounded-none font-mono",
        "border-b border-border/60 last:border-b-0",
        "hover:bg-surface-2 transition-colors",
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {actions && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {actions}
        </div>
      )}
    </div>
  );
};
