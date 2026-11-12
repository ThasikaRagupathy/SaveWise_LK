"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/appStore";
import { PageContainer } from "@/components/layout/PageContainer";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { GoalOverview } from "@/components/dashboard/GoalOverview";
import { SpendingOverview } from "@/components/dashboard/SpendingOverview";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { BudgetModal } from "@/components/budgets/BudgetModal";
import {
  calculateMonthlyTotals,
  calculateBudgetStatuses,
  calculateCategoryBreakdown,
} from "@/lib/calculations";
import { formatMonthDisplay } from "@/lib/dates";
import { Budget } from "@/types";
import { ArrowRight, AlertTriangle, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const {
    profile,
    transactions,
    budgets,
    goals,
    selectedMonth,
    removeBudget,
  } = useAppStore();

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);

  // Calculations for selected month
  const totals = calculateMonthlyTotals(transactions, selectedMonth);
  const budgetStatuses = calculateBudgetStatuses(budgets, transactions, selectedMonth);
  const categoryBreakdown = calculateCategoryBreakdown(transactions, selectedMonth);

  const overspentBudgets = budgetStatuses.filter((b) => b.isOverspent);
  const warningBudgets = budgetStatuses.filter((b) => b.isWarning);

  return (
    <PageContainer>
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-700 text-white shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-emerald-100 uppercase tracking-wider">
              {formatMonthDisplay(selectedMonth)}
            </span>
            <span className="text-xs text-emerald-200">
              {profile.university || "University of Colombo"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Ayubowan, {profile.displayName} 👋
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
            You have saved <strong className="font-mono text-white">{totals.savingsRate}%</strong> of your monthly inflow. Keep your essential living expenses balanced!
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/dashboard/purchase-assistant"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-brand-800 hover:bg-emerald-50 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Purchase Impact</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <QuickActions />

      {/* Financial Metrics Cards */}
      <SummaryCards
        totals={totals}
        monthlyAllowanceEstimate={profile.monthlyIncomeEstimate}
      />

      {/* Budget Overspending Alerts (if any) */}
      {(overspentBudgets.length > 0 || warningBudgets.length > 0) && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <strong className="text-amber-900 dark:text-amber-200 block text-sm font-bold">
              Budget Notifications for {formatMonthDisplay(selectedMonth)}
            </strong>
            <p className="text-amber-800/90 dark:text-amber-300 mt-0.5">
              {overspentBudgets.length > 0 &&
                `You have exceeded your limit in: ${overspentBudgets
                  .map((b) => b.budget.category)
                  .join(", ")}. `}
              {warningBudgets.length > 0 &&
                `Approaching 80% threshold in: ${warningBudgets
                  .map((b) => b.budget.category)
                  .join(", ")}.`}
            </p>
          </div>
          <Link
            href="/dashboard/budgets"
            className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline shrink-0"
          >
            Manage
          </Link>
        </div>
      )}

      {/* 2-Column Grid: Spending Chart & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingOverview
          categories={categoryBreakdown}
          totalExpenses={totals.totalExpenses}
        />
        <GoalOverview goals={goals} />
      </div>

      {/* Budget Preview Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-charcoal dark:text-charcoal-dark">
              Category Budgets ({formatMonthDisplay(selectedMonth)})
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
              Track actual student expenses against your monthly limits
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddBudgetOpen(true)}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Budget</span>
            </Button>
            <Link
              href="/dashboard/budgets"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {budgetStatuses.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder text-center">
            <p className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted mb-2">
              No budgets configured for this month.
            </p>
            <Button size="sm" variant="primary" onClick={() => setIsAddBudgetOpen(true)}>
              Set Your First Budget
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetStatuses.slice(0, 3).map((status) => (
              <BudgetCard
                key={status.budget.id}
                status={status}
                onEdit={(b) => setEditingBudget(b)}
                onDelete={(id) => removeBudget(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions Section */}
      <RecentTransactions transactions={transactions} />

      {/* Budget Modal */}
      {(editingBudget || isAddBudgetOpen) && (
        <BudgetModal
          isOpen={true}
          onClose={() => {
            setEditingBudget(null);
            setIsAddBudgetOpen(false);
          }}
          budgetToEdit={editingBudget}
        />
      )}
    </PageContainer>
  );
}
