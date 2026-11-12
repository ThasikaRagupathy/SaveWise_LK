"use client";

import React from "react";
import { formatLKR } from "@/lib/currency";
import { MonthlyTotals } from "@/lib/calculations";
import { Card } from "@/components/ui/Card";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface SummaryCardsProps {
  totals: MonthlyTotals;
  monthlyAllowanceEstimate?: number;
}

export function SummaryCards({ totals, monthlyAllowanceEstimate }: SummaryCardsProps) {
  const isNetPositive = totals.net >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Net for this month */}
      <Card hoverEffect className="relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal-muted dark:text-charcoal-darkMuted uppercase tracking-wider">
              Net This Month
            </p>
            <h3 className="text-2xl font-black text-charcoal dark:text-charcoal-dark font-mono mt-1">
              {formatLKR(totals.net)}
            </h3>
          </div>
          <div
            className={`p-2.5 rounded-xl ${
              isNetPositive
                ? "bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400"
                : "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
            }`}
          >
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {isNetPositive ? (
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Surplus
            </span>
          ) : (
            <span className="flex items-center text-rose-600 dark:text-rose-400 font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5" />
              Deficit
            </span>
          )}
          <span className="text-charcoal-muted dark:text-charcoal-darkMuted">
            {isNetPositive ? "Available to save or carry over" : "Expenses exceeded monthly income"}
          </span>
        </div>
      </Card>

      {/* 2. Total Recorded Income */}
      <Card hoverEffect>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal-muted dark:text-charcoal-darkMuted uppercase tracking-wider">
              Total Inflow
            </p>
            <h3 className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono mt-1">
              {formatLKR(totals.totalIncome)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
          {monthlyAllowanceEstimate ? (
            <span>Est. baseline: {formatLKR(monthlyAllowanceEstimate)}</span>
          ) : (
            <span>Allowances, jobs & scholarships</span>
          )}
        </div>
      </Card>

      {/* 3. Total Recorded Expenses */}
      <Card hoverEffect>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal-muted dark:text-charcoal-darkMuted uppercase tracking-wider">
              Total Outflow
            </p>
            <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
              {formatLKR(totals.totalExpenses)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
          {totals.totalIncome > 0 ? (
            <span>
              {Math.round((totals.totalExpenses / totals.totalIncome) * 100)}% of monthly income used
            </span>
          ) : (
            <span>Student living, food & travel</span>
          )}
        </div>
      </Card>

      {/* 4. Savings Rate */}
      <Card hoverEffect>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-charcoal-muted dark:text-charcoal-darkMuted uppercase tracking-wider">
              Savings Rate
            </p>
            <h3 className="text-2xl font-black text-charcoal dark:text-charcoal-dark font-mono mt-1">
              {totals.savingsRate}%
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
          {totals.savingsRate >= 20 ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Excellent student discipline! 🌟
            </span>
          ) : totals.savingsRate > 0 ? (
            <span>Consistent progress towards goals</span>
          ) : (
            <span>Focus on trimming non-essentials</span>
          )}
        </div>
      </Card>
    </div>
  );
}
