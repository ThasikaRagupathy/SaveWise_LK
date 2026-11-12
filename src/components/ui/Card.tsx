import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-surface-darkCard rounded-2xl border border-surface-border dark:border-surface-darkBorder p-5 sm:p-6 shadow-soft transition-all duration-200",
        hoverEffect && "hover:shadow-card hover:border-brand-500/30 dark:hover:border-brand-500/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  title,
  subtitle,
  action,
  children,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-4", className)} {...props}>
      <div>
        {title && (
          <h3 className="font-bold text-base sm:text-lg text-charcoal dark:text-charcoal-dark tracking-tight">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {children}
    </div>
  );
}
