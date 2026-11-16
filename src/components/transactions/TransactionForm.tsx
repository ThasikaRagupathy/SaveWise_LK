"use client";

import React, { useState } from "react";
import { Transaction, TransactionType } from "@/types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/appStore";

export interface TransactionFormProps {
  initialData?: Transaction | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({
  initialData,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const { addTransaction, updateTransaction } = useAppStore();

  const [type, setType] = useState<TransactionType>(initialData?.type || "expense");
  const [title, setTitle] = useState(initialData?.title || "");
  const [amount, setAmount] = useState(initialData ? String(initialData.amount) : "");
  const [category, setCategory] = useState(
    initialData?.category ||
      (initialData?.type === "income" ? INCOME_CATEGORIES[0].id : EXPENSE_CATEGORIES[0].id)
  );
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().slice(0, 10)
  );
  const [note, setNote] = useState(initialData?.note || "");
  const [error, setError] = useState<string | null>(null);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please provide a title for this transaction.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    if (!date) {
      setError("Please pick a valid transaction date.");
      return;
    }

    if (initialData) {
      updateTransaction(initialData.id, {
        title: title.trim(),
        amount: parsedAmount,
        type,
        category,
        date,
        note: note.trim() || undefined,
      });
    } else {
      addTransaction({
        title: title.trim(),
        amount: parsedAmount,
        type,
        category,
        date,
        note: note.trim() || undefined,
      });
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle: Expense vs Income */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-surface-light dark:bg-surface-darkElevated rounded-xl border border-surface-border dark:border-surface-darkBorder">
        <button
          type="button"
          onClick={() => {
            setType("expense");
            setCategory(EXPENSE_CATEGORIES[0].id);
          }}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            type === "expense"
              ? "bg-rose-500 text-white shadow-sm"
              : "text-charcoal-muted dark:text-charcoal-darkMuted hover:text-charcoal dark:hover:text-charcoal-dark"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => {
            setType("income");
            setCategory(INCOME_CATEGORIES[0].id);
          }}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            type === "income"
              ? "bg-brand-600 dark:bg-brand-500 text-white shadow-sm"
              : "text-charcoal-muted dark:text-charcoal-darkMuted hover:text-charcoal dark:hover:text-charcoal-dark"
          }`}
        >
          Income
        </button>
      </div>

      {/* Title */}
      <Input
        label="Title / Description"
        placeholder={type === "expense" ? "e.g. Canteen Lunch, Bus pass, Books" : "e.g. Monthly Allowance, Freelance Gig"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Amount with Rs. prefix */}
      <Input
        label="Amount (LKR)"
        type="number"
        step="any"
        min="1"
        placeholder="e.g. 2500"
        prefixElement={<span className="text-xs font-bold font-mono">Rs.</span>}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      {/* Category selector */}
      <Select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </Select>

      {/* Date */}
      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      {/* Optional Note */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-charcoal-dark">
          Note (Optional)
        </label>
        <textarea
          rows={2}
          placeholder="Add context (e.g. shared purchase, group discount)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-surface-darkElevated text-charcoal dark:text-charcoal-dark placeholder:text-charcoal-light dark:placeholder:text-charcoal-darkMuted/60 border border-surface-border dark:border-surface-darkBorder focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:focus:border-brand-400 dark:focus:ring-brand-400/20 outline-none transition-all resize-none"
        />
      </div>

      {error && <p className="text-xs text-danger font-medium">{error}</p>}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? "Save Changes" : "Add Record"}
        </Button>
      </div>
    </form>
  );
}
