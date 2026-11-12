"use client";

import React, { useState } from "react";
import { Transaction } from "@/types";
import { formatLKR } from "@/lib/currency";
import { formatDisplayDate } from "@/lib/dates";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TransactionModal } from "./TransactionModal";
import { useAppStore } from "@/store/appStore";

export interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const { deleteTransaction } = useAppStore();
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getCategoryDetails = (cat: string, type: string) => {
    const list = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return list.find((c) => c.id.toLowerCase() === cat.toLowerCase()) || {
      label: cat,
      color: "#6B7280",
    };
  };

  return (
    <>
      <div className="bg-white dark:bg-surface-darkCard rounded-2xl border border-surface-border dark:border-surface-darkBorder overflow-hidden shadow-soft">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-surface-border dark:border-surface-darkBorder bg-surface-light/70 dark:bg-surface-darkElevated/70 text-[11px] font-bold uppercase tracking-wider text-charcoal-muted dark:text-charcoal-darkMuted">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-right">Amount (LKR)</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60 dark:divide-surface-darkBorder/60">
              {transactions.map((tx) => {
                const cat = getCategoryDetails(tx.category, tx.type);
                const isIncome = tx.type === "income";

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-surface-light/60 dark:hover:bg-surface-darkElevated/60 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-charcoal-muted dark:text-charcoal-darkMuted font-medium">
                      {formatDisplayDate(tx.date)}
                    </td>

                    {/* Title & Note */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-charcoal dark:text-charcoal-dark">
                        {tx.title}
                      </div>
                      {tx.note && (
                        <div className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted truncate max-w-xs mt-0.5">
                          {tx.note}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${cat.color}15`,
                          color: cat.color,
                        }}
                      >
                        {tx.category}
                      </span>
                    </td>

                    {/* Type indicator */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold capitalize ${
                          isIncome
                            ? "text-brand-600 dark:text-brand-400"
                            : "text-rose-500 dark:text-rose-400"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                        {tx.type}
                      </span>
                    </td>

                    {/* Amount */}
                    <td
                      className={`py-3.5 px-4 whitespace-nowrap text-right font-bold font-mono text-sm ${
                        isIncome
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-charcoal dark:text-charcoal-dark"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatLKR(tx.amount)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingTx(tx)}
                          className="p-1.5 rounded-lg text-charcoal-muted hover:text-brand-600 dark:text-charcoal-darkMuted dark:hover:text-brand-400 hover:bg-surface-light dark:hover:bg-surface-darkElevated transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(tx.id)}
                          className="p-1.5 rounded-lg text-charcoal-muted hover:text-danger dark:text-charcoal-darkMuted dark:hover:text-danger transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden divide-y divide-surface-border/60 dark:divide-surface-darkBorder/60">
          {transactions.map((tx) => {
            const isIncome = tx.type === "income";

            return (
              <div key={tx.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-charcoal dark:text-charcoal-dark truncate">
                      {tx.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted">
                        {formatDisplayDate(tx.date)}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-light dark:bg-surface-darkElevated font-medium text-charcoal-muted dark:text-charcoal-darkMuted">
                        {tx.category}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`font-mono font-bold text-sm shrink-0 ${
                      isIncome
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-charcoal dark:text-charcoal-dark"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatLKR(tx.amount)}
                  </div>
                </div>

                {tx.note && (
                  <p className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted italic">
                    {tx.note}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setEditingTx(tx)}
                    className="flex items-center gap-1 text-xs text-charcoal-muted hover:text-brand-600 dark:text-charcoal-darkMuted dark:hover:text-brand-400 px-2 py-1 rounded-md"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeletingId(tx.id)}
                    className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 px-2 py-1 rounded-md"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTx && (
        <TransactionModal
          isOpen={true}
          onClose={() => setEditingTx(null)}
          transactionToEdit={editingTx}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteTransaction(deletingId);
        }}
        title="Delete Transaction"
        message="Are you sure you want to remove this transaction record? This will immediately recalculate your monthly totals and budget remaining amounts."
        confirmText="Delete Record"
      />
    </>
  );
}
