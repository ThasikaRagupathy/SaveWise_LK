import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, prefixElement, suffixElement, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-charcoal-dark"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixElement && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-charcoal-muted dark:text-charcoal-darkMuted">
              {prefixElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-10 px-3.5 rounded-xl text-sm transition-all duration-200 outline-none",
              "bg-white dark:bg-surface-darkElevated",
              "text-charcoal dark:text-charcoal-dark placeholder:text-charcoal-light dark:placeholder:text-charcoal-darkMuted/60",
              "border border-surface-border dark:border-surface-darkBorder",
              "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:focus:border-brand-400 dark:focus:ring-brand-400/20",
              prefixElement ? "pl-10" : "",
              suffixElement ? "pr-10" : "",
              error && "border-danger focus:border-danger focus:ring-danger/20",
              className
            )}
            {...props}
          />
          {suffixElement && (
            <div className="absolute right-3.5 flex items-center text-charcoal-muted dark:text-charcoal-darkMuted">
              {suffixElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-danger font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
