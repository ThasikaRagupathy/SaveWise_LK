"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { SavingsGoal } from "@/types";
import { GOAL_CATEGORIES } from "@/lib/constants";
import { useAppStore } from "@/store/appStore";

export interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: SavingsGoal | null;
}

export function GoalModal({ isOpen, onClose, goalToEdit }: GoalModalProps) {
  const { addGoal, updateGoal } = useAppStore();

  const [title, setTitle] = useState(goalToEdit?.title || "");
  const [targetAmount, setTargetAmount] = useState(
    goalToEdit ? String(goalToEdit.targetAmount) : ""
  );
  const [deadline, setDeadline] = useState(goalToEdit?.deadline || "");
  const [category, setCategory] = useState(goalToEdit?.category || GOAL_CATEGORIES[0].id);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please specify a goal name.");
      return;
    }

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Target amount must be a positive number.");
      return;
    }

    if (goalToEdit) {
      updateGoal(goalToEdit.id, {
        title: title.trim(),
        targetAmount: amount,
        deadline: deadline || undefined,
        category,
      });
    } else {
      addGoal({
        title: title.trim(),
        targetAmount: amount,
        deadline: deadline || undefined,
        category,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goalToEdit ? "Edit Savings Goal" : "Create New Savings Goal"}
      description="Turn your student dreams into achievable, realistic milestones."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Goal Name"
          placeholder="e.g. New Coding Laptop, Semester Trip, Emergency Fund"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Input
          label="Target Amount (LKR)"
          type="number"
          min="1"
          placeholder="e.g. 150000"
          prefixElement={<span className="text-xs font-bold font-mono">Rs.</span>}
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
        />

        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {GOAL_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </Select>

        <Input
          label="Target Deadline (Optional)"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          hint="Setting a deadline helps calculate your recommended weekly savings pace."
        />

        {error && <p className="text-xs text-danger font-medium">{error}</p>}

        <div className="flex items-center justify-end gap-2.5 pt-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {goalToEdit ? "Save Changes" : "Create Goal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
