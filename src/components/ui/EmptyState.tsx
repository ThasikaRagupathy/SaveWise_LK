import React from "react";
import { LucideIcon, FolderOpen } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-surface-border dark:border-surface-darkBorder bg-surface-light/50 dark:bg-surface-dark/40">
      <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-surface-darkElevated flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-charcoal dark:text-charcoal-dark mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
