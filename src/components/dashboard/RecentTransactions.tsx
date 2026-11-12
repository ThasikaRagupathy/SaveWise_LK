"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Transaction } from "@/types";
import { formatLKR } from "@/lib/currency";
import { formatRelativeDate } from "@/lib/dates";
import { Card, CardHeader } from "@/components/ui/Card";
import { ArrowDownLeft, ArrowUpRight, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TransactionModal } from "@/components/transactions/TransactionModal";

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const recent = transactions.slice(0, 5);

  return (
    <>
      <Card>
        <CardHeader
          title="Recent Transactions"
          subtitle="Latest income and expenses on your account"
          action={
            <Link
              href="/dashboard/transactions"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        {recent.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted mb-3">
              No transactions recorded for this period.
            </p>
            <Button size="sm" variant="primary" onClick={() => setIsAddOpen(true)}>
              <Plus className="w-4 h-4" />
              <span>Record First Expense</span>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-surface-border/60 dark:divide-surface-darkBorder/60">
            {recent.map((tx) => {
              const isIncome = tx.type === "income";

              return (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-3 group hover:bg-surface-light/40 dark:hover:bg-surface-darkElevated/40 px-1 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? "bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400"
                          : "bg-surface-light text-charcoal dark:bg-surface-darkElevated dark:text-charcoal-dark"
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-rose-500" />
                      )}
                    </div>

                    <div className="truncate">
                      <div className="font-semibold text-xs sm:text-sm text-charcoal dark:text-charcoal-dark truncate">
                        {tx.title}
                      </div>
                      <div className="text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted flex items-center gap-2">
                        <span>{formatRelativeDate(tx.date)}</span>
                        <span>•</span>
                        <span className="truncate">{tx.category}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`font-mono font-bold text-xs sm:text-sm shrink-0 ${
                      isIncome
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-charcoal dark:text-charcoal-dark"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatLKR(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <TransactionModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </>
  );
}
