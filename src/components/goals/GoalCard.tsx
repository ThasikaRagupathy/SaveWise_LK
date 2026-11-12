"use client";

import React from "react";
import { SavingsGoal } from "@/types";
import { formatLKR } from "@/lib/currency";
import { formatDisplayDate } from "@/lib/dates";
import { calculateGoalWeeklyTarget } from "@/lib/calculations";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlusCircle, CheckCircle2, Clock, Calendar, Edit2, Trash2 } from "lucide-react";

export interface GoalCardProps {
  goal: SavingsGoal;
  onContribute: (goal: SavingsGoal) => void;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, onContribute, onEdit, onDelete }: GoalCardProps) {
  const percent = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
  const isCompleted = goal.status === "completed" || percent >= 100;
  const { weeklyAmount, weeksRemaining, isOverdue, remainingAmount } = calculateGoalWeeklyTarget(goal);

  return (
    <Card hoverEffect className="space-y-4 flex flex-col justify-between">
      <div>
        {/* Top Badges and Actions */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
            {goal.category}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(goal)}
              className="p-1 rounded text-charcoal-muted hover:text-brand-600 dark:text-charcoal-darkMuted dark:hover:text-brand-400"
              title="Edit goal"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="p-1 rounded text-charcoal-muted hover:text-danger dark:text-charcoal-darkMuted dark:hover:text-danger"
              title="Delete goal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Goal Title */}
        <h4 className="font-bold text-base text-charcoal dark:text-charcoal-dark leading-tight">
          {goal.title}
        </h4>

        {/* Saved vs Target */}
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-xl font-extrabold text-charcoal dark:text-charcoal-dark font-mono">
            {formatLKR(goal.savedAmount)}
          </span>
          <span className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted font-mono">
            Target: {formatLKR(goal.targetAmount)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 space-y-1">
          <div className="w-full h-2 rounded-full bg-surface-border/70 dark:bg-surface-darkElevated overflow-hidden">
            <div
              style={{ width: `${percent}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted ? "bg-emerald-500" : "bg-brand-500"
              }`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted">
            <span>{percent}% Saved</span>
            <span>{formatLKR(remainingAmount)} to go</span>
          </div>
        </div>

        {/* Timeline & Guidance */}
        <div className="mt-4 pt-3 border-t border-surface-border/50 dark:border-surface-darkBorder/50 space-y-2 text-xs">
          {goal.deadline && (
            <div className="flex items-center justify-between text-charcoal-muted dark:text-charcoal-darkMuted">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Target Date:
              </span>
              <span className="font-medium text-charcoal dark:text-charcoal-dark">
                {formatDisplayDate(goal.deadline)}
              </span>
            </div>
          )}

          {!isCompleted && !isOverdue && weeksRemaining > 0 && (
            <div className="p-2.5 rounded-xl bg-surface-light dark:bg-surface-darkElevated flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-charcoal-muted dark:text-charcoal-darkMuted">
                <Clock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                Required pace:
              </span>
              <span className="font-bold text-brand-700 dark:text-brand-300 font-mono">
                {formatLKR(weeklyAmount)}/wk
              </span>
            </div>
          )}

          {isCompleted && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Goal successfully achieved! 🎉</span>
            </div>
          )}

          {isOverdue && !isCompleted && (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[11px] font-medium flex items-center gap-2">
              <span>Target date passed. You can extend the deadline in edit.</span>
            </div>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2">
        <Button
          variant={isCompleted ? "outline" : "primary"}
          size="sm"
          className="w-full"
          onClick={() => onContribute(goal)}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isCompleted ? "Add Bonus Savings" : "Contribute to Goal"}</span>
        </Button>
      </div>
    </Card>
  );
}
