"use client";

import React from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";

export interface TransactionFiltersState {
  searchQuery: string;
  typeFilter: "all" | "income" | "expense";
  categoryFilter: string;
  sortBy: "newest" | "oldest" | "highest" | "lowest";
}

export interface TransactionFiltersProps {
  filters: TransactionFiltersState;
  onChange: (filters: TransactionFiltersState) => void;
}

export function TransactionFilters({ filters, onChange }: TransactionFiltersProps) {
  const allCategories = [
    { id: "all", label: "All Categories" },
    ...EXPENSE_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
    ...INCOME_CATEGORIES.map((c) => ({ id: c.id, label: `(Income) ${c.label}` })),
  ];

  return (
    <div className="bg-white dark:bg-surface-darkCard p-4 rounded-2xl border border-surface-border dark:border-surface-darkBorder shadow-soft space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted dark:text-charcoal-darkMuted" />
          <input
            type="text"
            placeholder="Search by title, note, or amount..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm rounded-xl bg-surface-light dark:bg-surface-darkElevated border border-surface-border dark:border-surface-darkBorder text-charcoal dark:text-charcoal-dark placeholder:text-charcoal-light dark:placeholder:text-charcoal-darkMuted/60 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Type pills */}
        <div className="flex items-center gap-1 p-1 bg-surface-light dark:bg-surface-darkElevated rounded-xl border border-surface-border dark:border-surface-darkBorder shrink-0">
          {(["all", "expense", "income"] as const).map((t) => (
            <button
              key={t}
              onClick={() => onChange({ ...filters, typeFilter: t })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filters.typeFilter === t
                  ? "bg-white dark:bg-surface-darkCard text-brand-700 dark:text-brand-300 shadow-sm"
                  : "text-charcoal-muted dark:text-charcoal-darkMuted hover:text-charcoal dark:hover:text-charcoal-dark"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: Category and Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-surface-border/50 dark:border-surface-darkBorder/50">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-charcoal-muted dark:text-charcoal-darkMuted" />
          <select
            value={filters.categoryFilter}
            onChange={(e) => onChange({ ...filters, categoryFilter: e.target.value })}
            className="text-xs bg-transparent text-charcoal dark:text-charcoal-dark font-medium outline-none cursor-pointer"
          >
            {allCategories.map((c) => (
              <option key={c.id} value={c.id} className="bg-white dark:bg-surface-darkCard">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-muted dark:text-charcoal-darkMuted" />
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChange({ ...filters, sortBy: e.target.value as TransactionFiltersState["sortBy"] })
            }
            className="text-xs bg-transparent text-charcoal dark:text-charcoal-dark font-medium outline-none cursor-pointer"
          >
            <option value="newest" className="bg-white dark:bg-surface-darkCard">
              Date: Newest First
            </option>
            <option value="oldest" className="bg-white dark:bg-surface-darkCard">
              Date: Oldest First
            </option>
            <option value="highest" className="bg-white dark:bg-surface-darkCard">
              Amount: Highest
            </option>
            <option value="lowest" className="bg-white dark:bg-surface-darkCard">
              Amount: Lowest
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
