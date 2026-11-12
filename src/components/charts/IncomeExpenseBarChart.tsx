"use client";

import React, { useState } from "react";
import { formatLKR } from "@/lib/currency";

export interface MonthlyBarData {
  monthLabel: string;
  income: number;
  expense: number;
  net: number;
}

export interface IncomeExpenseBarChartProps {
  data: MonthlyBarData[];
}

export function IncomeExpenseBarChart({ data }: IncomeExpenseBarChartProps) {
  const [activeBar, setActiveBar] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-52 text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
        No comparative data available.
      </div>
    );
  }

  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expense]), 10000);

  return (
    <div className="w-full space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-end gap-5 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-brand-600 dark:bg-brand-500" />
          <span className="text-charcoal dark:text-charcoal-dark font-medium">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-rose-500" />
          <span className="text-charcoal dark:text-charcoal-dark font-medium">Expenses</span>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-surface-border dark:border-surface-darkBorder">
        {data.map((item, index) => {
          const incomeHeight = Math.round((item.income / maxVal) * 100);
          const expenseHeight = Math.round((item.expense / maxVal) * 100);
          const isActive = activeBar === index;

          return (
            <div
              key={item.monthLabel}
              className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end"
              onMouseEnter={() => setActiveBar(index)}
              onMouseLeave={() => setActiveBar(null)}
            >
              {/* Tooltip */}
              {isActive && (
                <div className="absolute -top-14 z-20 bg-charcoal dark:bg-surface-darkElevated text-white text-[11px] p-2 rounded-xl shadow-lg pointer-events-none whitespace-nowrap border border-white/10">
                  <div className="font-semibold text-center mb-0.5">{item.monthLabel}</div>
                  <div className="flex gap-2">
                    <span className="text-brand-300">Inc: {formatLKR(item.income)}</span>
                    <span className="text-rose-300">Exp: {formatLKR(item.expense)}</span>
                  </div>
                </div>
              )}

              {/* Bars Pair */}
              <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2.5 h-[160px]">
                {/* Income Bar */}
                <div className="w-full max-w-[28px] bg-brand-50 dark:bg-surface-darkElevated rounded-t-lg overflow-hidden flex items-end h-full">
                  <div
                    style={{ height: `${Math.max(incomeHeight, 4)}%` }}
                    className="w-full bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 rounded-t-lg transition-all duration-300"
                  />
                </div>
                {/* Expense Bar */}
                <div className="w-full max-w-[28px] bg-rose-50 dark:bg-surface-darkElevated rounded-t-lg overflow-hidden flex items-end h-full">
                  <div
                    style={{ height: `${Math.max(expenseHeight, 4)}%` }}
                    className="w-full bg-rose-500 hover:bg-rose-600 dark:bg-rose-500/90 rounded-t-lg transition-all duration-300"
                  />
                </div>
              </div>

              {/* Month Label */}
              <span className="text-[11px] font-medium text-charcoal-muted dark:text-charcoal-darkMuted truncate max-w-[60px]">
                {item.monthLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
