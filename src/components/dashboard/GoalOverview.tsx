"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SavingsGoal } from "@/types";
import { formatLKR } from "@/lib/currency";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ContributionModal } from "@/components/goals/ContributionModal";
import { GoalModal } from "@/components/goals/GoalModal";
import { ArrowRight, PlusCircle, Target } from "lucide-react";

export function GoalOverview({ goals }: { goals: SavingsGoal[] }) {
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);

  const activeGoals = goals.filter((g) => g.status === "active").slice(0, 3);

  return (
    <>
      <Card>
        <CardHeader
          title="Active Savings Goals"
          subtitle="Real-time progress toward your major student purchases"
          action={
            <Link
              href="/dashboard/goals"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View all ({goals.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        {activeGoals.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted mb-3">
              No active savings goals yet.
            </p>
            <Button size="sm" variant="outline" onClick={() => setIsNewGoalOpen(true)}>
              <Target className="w-4 h-4" />
              <span>Create First Goal</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeGoals.map((g) => {
              const percent = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));

              return (
                <div
                  key={g.id}
                  className="p-3.5 rounded-xl bg-surface-light dark:bg-surface-darkElevated border border-surface-border/60 dark:border-surface-darkBorder/60 space-y-2.5 transition-colors hover:border-brand-500/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-charcoal dark:text-charcoal-dark">
                        {g.title}
                      </h4>
                      <span className="text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted">
                        {g.category}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="mint"
                      className="h-7 text-xs px-2.5"
                      onClick={() => setSelectedGoal(g)}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </Button>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="w-full h-2 rounded-full bg-surface-border dark:bg-surface-darkBorder overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full bg-brand-500 rounded-full transition-all duration-300"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-semibold text-charcoal dark:text-charcoal-dark">
                        {formatLKR(g.savedAmount)}
                      </span>
                      <span className="text-charcoal-muted dark:text-charcoal-darkMuted">
                        {percent}% of {formatLKR(g.targetAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <ContributionModal
        isOpen={Boolean(selectedGoal)}
        onClose={() => setSelectedGoal(null)}
        goal={selectedGoal}
      />
      <GoalModal isOpen={isNewGoalOpen} onClose={() => setIsNewGoalOpen(false)} />
    </>
  );
}
