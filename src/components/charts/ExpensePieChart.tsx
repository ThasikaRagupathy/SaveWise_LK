"use client";

import React, { useState } from "react";
import { CategorySummary } from "@/types";
import { formatLKR } from "@/lib/currency";

export interface ExpensePieChartProps {
  data: CategorySummary[];
  totalExpense: number;
}

export function ExpensePieChart({ data, totalExpense }: ExpensePieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0 || totalExpense === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-charcoal-muted dark:text-charcoal-darkMuted text-sm">
        <p>No expenses recorded for this period.</p>
      </div>
    );
  }

  // Calculate SVG arc paths for donut chart
  const size = 220;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  const slices = data.map((item, index) => {
    const percent = (item.amount / totalExpense) * 100;
    const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += percent;

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      index,
    };
  });

  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Donut Chart SVG */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-surface-border/40 dark:text-surface-darkBorder/40"
          />
          {slices.map((slice) => {
            const isHovered = hoveredIndex === slice.index;
            return (
              <circle
                key={slice.category}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(slice.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          {activeItem ? (
            <>
              <span className="text-[11px] font-semibold text-charcoal-muted dark:text-charcoal-darkMuted uppercase truncate max-w-[120px]">
                {activeItem.category}
              </span>
              <span className="text-base sm:text-lg font-bold text-charcoal dark:text-charcoal-dark font-mono">
                {formatLKR(activeItem.amount)}
              </span>
              <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                {activeItem.percentage}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-semibold text-charcoal-muted dark:text-charcoal-darkMuted uppercase">
                Total Spent
              </span>
              <span className="text-base sm:text-lg font-bold text-charcoal dark:text-charcoal-dark font-mono">
                {formatLKR(totalExpense)}
              </span>
              <span className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
                {data.length} {data.length === 1 ? "category" : "categories"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div className="w-full space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {data.map((item, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <div
              key={item.category}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                isHovered
                  ? "bg-brand-50/80 dark:bg-brand-950/40"
                  : "hover:bg-surface-light dark:hover:bg-surface-darkElevated"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-charcoal dark:text-charcoal-dark truncate">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-semibold text-charcoal dark:text-charcoal-dark font-mono">
                  {formatLKR(item.amount)}
                </span>
                <span className="text-[11px] font-medium text-charcoal-muted dark:text-charcoal-darkMuted w-9 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
