"use client";

import React, { useState, useMemo } from "react";
import { useAppStore } from "@/store/appStore";
import { PageContainer } from "@/components/layout/PageContainer";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import {
  TransactionFilters,
  TransactionFiltersState,
} from "@/components/transactions/TransactionFilters";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Download, FileSpreadsheet, Receipt } from "lucide-react";
import { formatLKR } from "@/lib/currency";

export default function TransactionsPage() {
  const { transactions, exportCSV, exportJSON } = useAppStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionFiltersState>({
    searchQuery: "",
    typeFilter: "all",
    categoryFilter: "all",
    sortBy: "newest",
  });

  // Filter & sort logic
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.note && t.note.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q) ||
          String(t.amount).includes(q)
      );
    }

    // Type filter
    if (filters.typeFilter !== "all") {
      result = result.filter((t) => t.type === filters.typeFilter);
    }

    // Category filter
    if (filters.categoryFilter !== "all") {
      result = result.filter(
        (t) => t.category.toLowerCase() === filters.categoryFilter.toLowerCase()
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (filters.sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (filters.sortBy === "highest") {
        return b.amount - a.amount;
      }
      if (filters.sortBy === "lowest") {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [transactions, filters]);

  // Export handlers
  const handleDownloadCSV = () => {
    const csv = exportCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `savewise-lk-transactions-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalFilteredAmount = filteredTransactions.reduce(
    (sum, t) => (t.type === "expense" ? sum + t.amount : sum),
    0
  );

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-charcoal dark:text-charcoal-dark tracking-tight">
            Transaction History
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
            Review, search, and manage all your student expenses and income deposits
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadCSV}
            title="Export transactions as CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </Button>

          <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <TransactionFilters filters={filters} onChange={setFilters} />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-charcoal-muted dark:text-charcoal-darkMuted px-1">
        <span>
          Showing <strong>{filteredTransactions.length}</strong> of {transactions.length} records
        </span>
        {filters.typeFilter === "expense" && (
          <span>
            Total in filter: <strong className="font-mono text-charcoal dark:text-charcoal-dark">{formatLKR(totalFilteredAmount)}</strong>
          </span>
        )}
      </div>

      {/* Table or Empty State */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions found"
          description={
            filters.searchQuery || filters.typeFilter !== "all" || filters.categoryFilter !== "all"
              ? "Try adjusting your search query or clearing your active filters."
              : "Start recording your student expenses or incoming allowances."
          }
          actionLabel="Add Transaction"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <TransactionTable transactions={filteredTransactions} />
      )}

      {/* Add Transaction Modal */}
      <TransactionModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </PageContainer>
  );
}
