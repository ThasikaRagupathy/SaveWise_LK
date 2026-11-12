"use client";

import React from "react";
import { useAppStore } from "@/store/appStore";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader } from "@/components/ui/Card";
import { ExpensePieChart } from "@/components/charts/ExpensePieChart";
import { IncomeExpenseBarChart, MonthlyBarData } from "@/components/charts/IncomeExpenseBarChart";
import { MonthlyTrendChart, TrendPoint } from "@/components/charts/MonthlyTrendChart";
import {
  calculateMonthlyTotals,
  calculateCategoryBreakdown,
  calculateBudgetStatuses,
} from "@/lib/calculations";
import { formatMonthDisplay, getAdjacentMonth } from "@/lib/dates";
import { formatLKR } from "@/lib/currency";
import { TrendingUp, AlertTriangle, CheckCircle2, Award, ArrowUpRight } from "lucide-react";

export default function InsightsPage() {
  const { transactions, budgets, goals, selectedMonth } = useAppStore();

  const totals = calculateMonthlyTotals(transactions, selectedMonth);
  const categories = calculateCategoryBreakdown(transactions, selectedMonth);
  const budgetStatuses = calculateBudgetStatuses(budgets, transactions, selectedMonth);

  // Highest spending category
  const topCategory = categories[0];

  // Prepare 3-month comparison data
  const prevMonthKey = getAdjacentMonth(selectedMonth, -1);
  const nextMonthKey = getAdjacentMonth(selectedMonth, 1);

  const prevTotals = calculateMonthlyTotals(transactions, prevMonthKey);
  const nextTotals = calculateMonthlyTotals(transactions, nextMonthKey);

  const comparisonData: MonthlyBarData[] = [
    {
      monthLabel: formatMonthDisplay(prevMonthKey).split(" ")[0],
      income: prevTotals.totalIncome,
      expense: prevTotals.totalExpenses,
      net: prevTotals.net,
    },
    {
      monthLabel: `${formatMonthDisplay(selectedMonth).split(" ")[0]} (Current)`,
      income: totals.totalIncome,
      expense: totals.totalExpenses,
      net: totals.net,
    },
    {
      monthLabel: formatMonthDisplay(nextMonthKey).split(" ")[0],
      income: nextTotals.totalIncome,
      expense: nextTotals.totalExpenses,
      net: nextTotals.net,
    },
  ];

  // Daily cumulative spend trend within the selected month
  const monthExpenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(selectedMonth))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let runningTotal = 0;
  const trendPoints: TrendPoint[] =
    monthExpenses.length > 0
      ? monthExpenses.map((t, idx) => {
          runningTotal += t.amount;
          return {
            label: t.date.slice(8), // day
            value: runningTotal,
          };
        })
      : [
          { label: "Day 1", value: 0 },
          { label: "Day 15", value: 0 },
          { label: "Day 30", value: 0 },
        ];

  return (
    <PageContainer>
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-charcoal dark:text-charcoal-dark tracking-tight">
          Financial Analytics & Spending Insights
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
          Visual insights and patterns for {formatMonthDisplay(selectedMonth)}
        </p>
      </div>

      {/* Highlights / Key Findings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top category */}
        <Card hoverEffect className="space-y-1">
          <span className="text-[11px] font-semibold text-charcoal-muted dark:text-charcoal-darkMuted uppercase">
            Highest Spending Category
          </span>
          {topCategory ? (
            <div>
              <div className="text-lg font-bold text-charcoal dark:text-charcoal-dark">
                {topCategory.category}
              </div>
              <div className="text-xs text-brand-600 dark:text-brand-400 font-mono mt-0.5">
                {formatLKR(topCategory.amount)} ({topCategory.percentage}% of total expenses)
              </div>
            </div>
          ) : (
            <p className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
              No expenses recorded yet.
            </p>
          )}
        </Card>

        {/* Savings Performance */}
        <Card hoverEffect className="space-y-1">
          <span className="text-[11px] font-semibold text-charcoal-muted dark:text-charcoal-darkMuted uppercase">
            Net Savings Rate
          </span>
          <div className="text-lg font-bold text-charcoal dark:text-charcoal-dark font-mono">
            {totals.savingsRate}%
          </div>
          <p className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
            {totals.net >= 0
              ? `Surplus of ${formatLKR(totals.net)} retained`
              : `Deficit of ${formatLKR(Math.abs(totals.net))} this month`}
          </p>
        </Card>

        {/* Budget Health */}
        <Card hoverEffect className="space-y-1">
          <span className="text-[11px] font-semibold text-charcoal-muted dark:text-charcoal-darkMuted uppercase">
            Active Budget Status
          </span>
          <div className="text-lg font-bold text-charcoal dark:text-charcoal-dark">
            {budgetStatuses.filter((b) => b.isOverspent).length === 0 ? "All On Track" : "Action Needed"}
          </div>
          <p className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
            {budgetStatuses.filter((b) => b.isOverspent).length} overspent,{" "}
            {budgetStatuses.filter((b) => b.isWarning).length} near limit
          </p>
        </Card>
      </div>

      {/* Main Charts: 2-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Bar Chart */}
        <Card>
          <CardHeader
            title="Income vs Expenses (Monthly Comparison)"
            subtitle="Comparing previous, current, and upcoming inflow vs outflow"
          />
          <IncomeExpenseBarChart data={comparisonData} />
        </Card>

        {/* Category Spending Donut Chart */}
        <Card>
          <CardHeader
            title="Category Expense Distribution"
            subtitle={`Full breakdown across ${categories.length} active spending areas`}
          />
          <ExpensePieChart data={categories} totalExpense={totals.totalExpenses} />
        </Card>
      </div>

      {/* Cumulative Month Outflow Trend */}
      <Card>
        <CardHeader
          title="Cumulative Monthly Spending Pace"
          subtitle="How your total expenses accumulated day-by-day across the month"
        />
        <MonthlyTrendChart
          points={trendPoints}
          primaryLabel="Cumulative Expenses (LKR)"
        />
      </Card>
    </PageContainer>
  );
}
