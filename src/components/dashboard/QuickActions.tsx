"use client";

import React, { useState } from "react";
import { Plus, Target, PieChart, Calculator } from "lucide-react";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { BudgetModal } from "@/components/budgets/BudgetModal";
import { GoalModal } from "@/components/goals/GoalModal";
import Link from "next/link";

export function QuickActions() {
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setIsAddTxOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense / Income</span>
        </button>

        <button
          onClick={() => setIsGoalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-light hover:bg-surface-border/60 text-charcoal dark:bg-surface-darkElevated dark:hover:bg-surface-darkBorder dark:text-charcoal-dark border border-surface-border dark:border-surface-darkBorder transition-all active:scale-95 shrink-0"
        >
          <Target className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>New Savings Goal</span>
        </button>

        <button
          onClick={() => setIsBudgetOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-light hover:bg-surface-border/60 text-charcoal dark:bg-surface-darkElevated dark:hover:bg-surface-darkBorder dark:text-charcoal-dark border border-surface-border dark:border-surface-darkBorder transition-all active:scale-95 shrink-0"
        >
          <PieChart className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Set Category Budget</span>
        </button>

        <Link
          href="/dashboard/purchase-assistant"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-light hover:bg-surface-border/60 text-charcoal dark:bg-surface-darkElevated dark:hover:bg-surface-darkBorder dark:text-charcoal-dark border border-surface-border dark:border-surface-darkBorder transition-all active:scale-95 shrink-0"
        >
          <Calculator className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Check Purchase Impact</span>
        </Link>
      </div>

      <TransactionModal isOpen={isAddTxOpen} onClose={() => setIsAddTxOpen(false)} />
      <GoalModal isOpen={isGoalOpen} onClose={() => setIsGoalOpen(false)} />
      <BudgetModal isOpen={isBudgetOpen} onClose={() => setIsBudgetOpen(false)} />
    </>
  );
}
