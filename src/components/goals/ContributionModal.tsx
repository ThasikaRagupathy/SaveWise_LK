"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SavingsGoal } from "@/types";
import { formatLKR } from "@/lib/currency";
import { useAppStore } from "@/store/appStore";
import { Info, Sparkles } from "lucide-react";

export interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal | null;
}

export function ContributionModal({ isOpen, onClose, goal }: ContributionModalProps) {
  const { addContribution } = useAppStore();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!goal) return null;

  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const deposit = parseFloat(amount);
    if (isNaN(deposit) || deposit <= 0) {
      setError("Please enter a valid deposit amount.");
      return;
    }

    addContribution(goal.id, deposit, note.trim() || undefined);

    // If this contribution completes the goal, fire celebratory confetti!
    if (goal.savedAmount + deposit >= goal.targetAmount) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#176B4D", "#299E72", "#10B981", "#34D399", "#F59E0B"],
        });
      } catch {
        // Fallback gracefully
      }
    }

    setAmount("");
    setNote("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Contribute to '${goal.title}'`}
      description="Deposit an amount from your available funds into this dedicated goal."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Goal status summary */}
        <div className="p-3 rounded-xl bg-surface-light dark:bg-surface-darkElevated flex items-center justify-between text-xs">
          <div>
            <div className="text-charcoal-muted dark:text-charcoal-darkMuted">Currently Saved:</div>
            <div className="font-bold text-charcoal dark:text-charcoal-dark font-mono text-sm">
              {formatLKR(goal.savedAmount)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-charcoal-muted dark:text-charcoal-darkMuted">Target Remaining:</div>
            <div className="font-bold text-brand-600 dark:text-brand-400 font-mono text-sm">
              {formatLKR(remaining)}
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <Input
          label="Deposit Amount (LKR)"
          type="number"
          min="1"
          placeholder="e.g. 5000"
          prefixElement={<span className="text-xs font-bold font-mono">Rs.</span>}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        {/* Quick Amount Suggestion Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted">Quick:</span>
          {[1000, 2500, 5000, remaining].filter((val) => val > 0).map((val, idx) => (
            <button
              key={`${val}-${idx}`}
              type="button"
              onClick={() => setAmount(String(val))}
              className="text-[11px] px-2 py-0.5 rounded-lg border border-surface-border dark:border-surface-darkBorder hover:border-brand-500 bg-white dark:bg-surface-darkCard font-mono"
            >
              +{formatLKR(val)}
            </button>
          ))}
        </div>

        {/* Note */}
        <Input
          label="Note (Optional)"
          placeholder="e.g. Saved from freelance gig, allowance surplus"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Important accounting rule reminder */}
        <div className="p-2.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200/40 dark:border-brand-800/40 flex items-start gap-2 text-[11px] text-brand-900 dark:text-brand-300">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-brand-600 dark:text-brand-400" />
          <span>
            Goal contributions are internal savings allocations. They grow your target fund without being treated as an expense penalty.
          </span>
        </div>

        {error && <p className="text-xs text-danger font-medium">{error}</p>}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            <Sparkles className="w-4 h-4" />
            <span>Confirm Deposit</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
