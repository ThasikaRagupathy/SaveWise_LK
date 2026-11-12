"use client";

import React from "react";
import { BudgetStatus } from "@/types";
import { formatLKR } from "@/lib/currency";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { AlertCircle, CheckCircle2, AlertTriangle, Edit2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface BudgetCardProps {
  status: BudgetStatus;
  onEdit: (budget: BudgetStatus["budget"]) => void;
  onDelete: (id: string) => void;
}

export function BudgetCard({ status, onEdit, onDelete }: BudgetCardProps) {
  const { budget, spent, remaining, percentUsed, isOverspent, isWarning } = status;

  const categoryInfo = EXPENSE_CATEGORIES.find(
    (c) => c.id.toLowerCase() === budget.category.toLowerCase()
  ) || {
    label: budget.category,
    color: "#299E72",
  };

  const clampedPercent = Math.min(percentUsed, 100);

  // Status badge
  const getStatusBadge = () => {
    if (isOverspent) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-3 h-3" />
          Overspent by {formatLKR(Math.abs(remaining))}
        </span>
      );
    }
    if (isWarning) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
          <AlertTriangle className="w-3 h-3" />
          Near Limit ({percentUsed}%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
        <CheckCircle2 className="w-3 h-3" />
        On Track
      </span>
    );
  };

  return (
    <Card hoverEffect className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3.5 h-3.5 rounded-full shrink-0"
            style={{ backgroundColor: categoryInfo.color }}
          />
          <div>
            <h4 className="font-bold text-sm sm:text-base text-charcoal dark:text-charcoal-dark">
              {budget.category}
            </h4>
            <div className="mt-0.5">{getStatusBadge()}</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(budget)}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-brand-600 dark:text-charcoal-darkMuted dark:hover:text-brand-400 hover:bg-surface-light dark:hover:bg-surface-darkElevated transition-colors"
            title="Edit category budget"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-danger dark:text-charcoal-darkMuted dark:hover:text-danger hover:bg-surface-light dark:hover:bg-surface-darkElevated transition-colors"
            title="Remove budget"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-charcoal-muted dark:text-charcoal-darkMuted">
            Spent: <strong className="text-charcoal dark:text-charcoal-dark font-mono">{formatLKR(spent)}</strong>
          </span>
          <span className="text-charcoal-muted dark:text-charcoal-darkMuted">
            Limit: <strong className="text-charcoal dark:text-charcoal-dark font-mono">{formatLKR(budget.limitAmount)}</strong>
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-surface-border/60 dark:bg-surface-darkElevated overflow-hidden">
          <div
            style={{ width: `${clampedPercent}%` }}
            className={`h-full rounded-full transition-all duration-500 ${
              isOverspent
                ? "bg-rose-500"
                : isWarning
                ? "bg-amber-500"
                : "bg-brand-500"
            }`}
          />
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="flex items-center justify-between pt-2 border-t border-surface-border/50 dark:border-surface-darkBorder/50 text-xs">
        <span className="text-charcoal-muted dark:text-charcoal-darkMuted">
          {isOverspent ? "Overspent:" : "Remaining buffer:"}
        </span>
        <span
          className={`font-bold font-mono ${
            isOverspent
              ? "text-rose-600 dark:text-rose-400"
              : "text-brand-700 dark:text-brand-300"
          }`}
        >
          {isOverspent ? `-${formatLKR(Math.abs(remaining))}` : formatLKR(remaining)}
        </span>
      </div>
    </Card>
  );
}
