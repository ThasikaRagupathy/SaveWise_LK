"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Budget } from "@/types";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { useAppStore } from "@/store/appStore";

export interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetToEdit?: Budget | null;
}

export function BudgetModal({ isOpen, onClose, budgetToEdit }: BudgetModalProps) {
  const { upsertBudget, selectedMonth } = useAppStore();

  const [category, setCategory] = useState(budgetToEdit?.category || EXPENSE_CATEGORIES[0].id);
  const [limitAmount, setLimitAmount] = useState(
    budgetToEdit ? String(budgetToEdit.limitAmount) : ""
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(limitAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid monthly limit amount greater than 0.");
      return;
    }

    upsertBudget({
      id: budgetToEdit?.id,
      category,
      limitAmount: amount,
      month: selectedMonth,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budgetToEdit ? "Adjust Category Budget" : "Create Monthly Category Budget"}
      description="Set a realistic spending target for this category to prevent unexpected end-of-month pinches."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={Boolean(budgetToEdit)}
        >
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </Select>

        <Input
          label="Monthly Spending Limit (LKR)"
          type="number"
          min="1"
          placeholder="e.g. 8000"
          prefixElement={<span className="text-xs font-bold font-mono">Rs.</span>}
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
          required
        />

        {error && <p className="text-xs text-danger font-medium">{error}</p>}

        <div className="flex items-center justify-end gap-2.5 pt-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {budgetToEdit ? "Update Budget" : "Save Budget"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
