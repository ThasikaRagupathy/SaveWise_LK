"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { PageContainer } from "@/components/layout/PageContainer";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { BudgetModal } from "@/components/budgets/BudgetModal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { calculateBudgetStatuses } from "@/lib/calculations";
import { formatMonthDisplay } from "@/lib/dates";
import { formatLKR } from "@/lib/currency";
import { Budget } from "@/types";
import { PieChart, Plus, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function BudgetsPage() {
  const { budgets, transactions, selectedMonth, removeBudget } = useAppStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const statuses = calculateBudgetStatuses(budgets, transactions, selectedMonth);

  const totalBudgeted = statuses.reduce((sum, s) => sum + s.budget.limitAmount, 0);
  const totalSpentInBudgets = statuses.reduce((sum, s) => sum + s.spent, 0);
  const overallRemaining = totalBudgeted - totalSpentInBudgets;
  const overallPercent = totalBudgeted > 0 ? Math.round((totalSpentInBudgets / totalBudgeted) * 100) : 0;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-charcoal dark:text-charcoal-dark tracking-tight">
            Monthly Category Budgets
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
            Planning limits for {formatMonthDisplay(selectedMonth)} based on real expense records
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>New Category Budget</span>
        </Button>
      </div>

      {/* Overview Metric Banner */}
      {statuses.length > 0 && (
        <Card className="bg-gradient-to-br from-white to-surface-light dark:from-surface-darkCard dark:to-surface-darkElevated">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-surface-border/60 dark:border-surface-darkBorder/60">
            <div>
              <span className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted uppercase font-semibold">
                Total Budgeted Limit
              </span>
              <div className="text-xl font-bold font-mono text-charcoal dark:text-charcoal-dark mt-0.5">
                {formatLKR(totalBudgeted)}
              </div>
            </div>

            <div>
              <span className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted uppercase font-semibold">
                Total Spent So Far
              </span>
              <div className="text-xl font-bold font-mono text-brand-600 dark:text-brand-400 mt-0.5">
                {formatLKR(totalSpentInBudgets)}
              </div>
            </div>

            <div>
              <span className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted uppercase font-semibold">
                Overall Safety Buffer
              </span>
              <div
                className={`text-xl font-bold font-mono mt-0.5 ${
                  overallRemaining >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {formatLKR(overallRemaining)}
              </div>
            </div>
          </div>

          <div className="pt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-charcoal dark:text-charcoal-dark">
                Overall Budget Utilization ({overallPercent}%)
              </span>
              <span className="text-charcoal-muted dark:text-charcoal-darkMuted">
                {totalBudgeted - totalSpentInBudgets >= 0 ? "Under Control" : "Over Budget"}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-border dark:bg-surface-darkBorder overflow-hidden">
              <div
                style={{ width: `${Math.min(overallPercent, 100)}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  overallPercent > 100 ? "bg-rose-500" : overallPercent >= 80 ? "bg-amber-500" : "bg-brand-500"
                }`}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Budget Cards Grid */}
      {statuses.length === 0 ? (
        <EmptyState
          icon={PieChart}
          title="No category budgets configured"
          description="Set limits for food, transport, housing, supplies, or activities."
          actionLabel="Create Budget"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statuses.map((status) => (
            <BudgetCard
              key={status.budget.id}
              status={status}
              onEdit={(b) => setEditingBudget(b)}
              onDelete={(id) => removeBudget(id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {(isAddOpen || editingBudget) && (
        <BudgetModal
          isOpen={true}
          onClose={() => {
            setIsAddOpen(false);
            setEditingBudget(null);
          }}
          budgetToEdit={editingBudget}
        />
      )}
    </PageContainer>
  );
}
