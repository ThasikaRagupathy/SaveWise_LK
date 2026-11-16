"use client";

import React, { useState } from "react";
import { Plus, Target, Calculator } from "lucide-react";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { GoalModal } from "@/components/goals/GoalModal";
import Link from "next/link";

export function QuickActions() {
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);

  return (
    <>
      <nav aria-label="Quick actions" className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
        <button
          onClick={() => setIsAddTxOpen(true)}
          className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.98] sm:col-span-1 sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add transaction</span>
        </button>

        <button
          onClick={() => setIsGoalOpen(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-light px-3 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-surface-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.98] dark:border-surface-darkBorder dark:bg-surface-darkElevated dark:text-charcoal-dark dark:hover:bg-surface-darkBorder sm:w-auto"
        >
          <Target className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>New goal</span>
        </button>

        <Link
          href="/dashboard/purchase-assistant"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-light px-3 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-surface-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.98] dark:border-surface-darkBorder dark:bg-surface-darkElevated dark:text-charcoal-dark dark:hover:bg-surface-darkBorder sm:w-auto"
        >
          <Calculator className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Purchase impact</span>
        </Link>
      </nav>

      <TransactionModal isOpen={isAddTxOpen} onClose={() => setIsAddTxOpen(false)} />
      <GoalModal isOpen={isGoalOpen} onClose={() => setIsGoalOpen(false)} />
    </>
  );
}
