"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAppStore } from "@/store/appStore";
import { formatMonthDisplay, getAdjacentMonth } from "@/lib/dates";
import { TransactionModal } from "@/components/transactions/TransactionModal";

export function AppHeader({ onOpenMobileMenu }: { onOpenMobileMenu?: () => void }) {
  const pathname = usePathname();
  const { selectedMonth, setSelectedMonth } = useAppStore();
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Financial Overview";
    if (pathname.includes("/transactions")) return "Transactions & Expenses";
    if (pathname.includes("/budgets")) return "Monthly Budget Planner";
    if (pathname.includes("/goals")) return "Savings Goals";
    if (pathname.includes("/challenges")) return "Savings Challenges";
    if (pathname.includes("/insights")) return "Analytics & Spending Insights";
    if (pathname.includes("/purchase-assistant")) return "Purchase Decision Assistant";
    if (pathname.includes("/simulator")) return "What-If Savings Simulator";
    if (pathname.includes("/settings")) return "Settings & Preferences";
    return "Dashboard";
  };

  const handlePrevMonth = () => {
    setSelectedMonth(getAdjacentMonth(selectedMonth, -1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(getAdjacentMonth(selectedMonth, 1));
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-surface-darkCard/90 backdrop-blur-md border-b border-surface-border dark:border-surface-darkBorder px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-charcoal hover:bg-surface-light dark:text-charcoal-dark dark:hover:bg-surface-darkElevated border border-surface-border dark:border-surface-darkBorder"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-charcoal dark:text-charcoal-dark leading-tight">
              {getPageTitle()}
            </h1>
            <p className="text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted hidden sm:block">
              SaveWise LK • Sri Lanka Student Edition
            </p>
          </div>
        </div>

        {/* Right: Month Selector + Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Month Navigator */}
          <div className="flex items-center bg-surface-light dark:bg-surface-darkElevated border border-surface-border dark:border-surface-darkBorder rounded-xl p-0.5 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-surface-border/60 dark:hover:bg-surface-darkBorder rounded-lg text-charcoal-muted hover:text-charcoal dark:text-charcoal-darkMuted dark:hover:text-charcoal-dark transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-charcoal dark:text-charcoal-dark min-w-[100px] justify-center">
              <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
              <span className="truncate">{formatMonthDisplay(selectedMonth)}</span>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-surface-border/60 dark:hover:bg-surface-darkBorder rounded-lg text-charcoal-muted hover:text-charcoal dark:text-charcoal-darkMuted dark:hover:text-charcoal-dark transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Toggle (Visible on smaller screens too) */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Quick Add Transaction Button */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddTxOpen(true)}
            className="shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Add Record</span>
          </Button>
        </div>
      </header>

      {/* Quick Add Transaction Modal */}
      <TransactionModal isOpen={isAddTxOpen} onClose={() => setIsAddTxOpen(false)} />
    </>
  );
}
