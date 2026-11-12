import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "mint";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
      primary:
        "bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500 shadow-sm dark:bg-brand-500 dark:hover:bg-brand-600",
      secondary:
        "bg-surface-light hover:bg-surface-border text-charcoal dark:bg-surface-darkElevated dark:hover:bg-surface-darkBorder dark:text-charcoal-dark border border-surface-border dark:border-surface-darkBorder",
      outline:
        "bg-transparent hover:bg-brand-50 text-brand-600 border border-brand-600/30 dark:text-brand-400 dark:border-brand-500/40 dark:hover:bg-brand-950/40",
      ghost:
        "bg-transparent hover:bg-surface-border/50 text-charcoal-muted hover:text-charcoal dark:text-charcoal-darkMuted dark:hover:text-charcoal-dark",
      danger:
        "bg-danger hover:bg-red-700 text-white focus:ring-red-400 shadow-sm",
      mint:
        "bg-mint-light hover:bg-brand-100 text-brand-800 dark:bg-mint-dark dark:hover:bg-brand-900/60 dark:text-brand-300 font-semibold",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 h-8 gap-1.5",
      md: "text-sm px-4 py-2 h-10 gap-2",
      lg: "text-base px-5 py-2.5 h-12 gap-2.5",
      icon: "h-10 w-10 p-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
