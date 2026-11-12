import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "success" | "warning" | "danger" | "neutral" | "mint";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "brand", size = "sm", children, ...props }: BadgeProps) {
  const variants = {
    brand: "bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-800",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
    danger: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
    neutral: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    mint: "bg-mint-light text-brand-800 border-brand-200/60 dark:bg-mint-dark dark:text-brand-300 dark:border-brand-700/50",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 rounded-full font-medium border",
    md: "text-xs px-2.5 py-1 rounded-full font-semibold border",
  };

  return (
    <span className={cn("inline-flex items-center gap-1 leading-none", variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
