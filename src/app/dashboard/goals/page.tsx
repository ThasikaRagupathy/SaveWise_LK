"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { PageContainer } from "@/components/layout/PageContainer";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalModal } from "@/components/goals/GoalModal";
import { ContributionModal } from "@/components/goals/ContributionModal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SavingsGoal, GoalStatus } from "@/types";
import { formatLKR } from "@/lib/currency";
import { Target, Plus, CheckCircle, Wallet, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function GoalsPage() {
  const { goals, deleteGoal } = useAppStore();

  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("active");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [contributingGoal, setContributingGoal] = useState<SavingsGoal | null>(null);

  const filteredGoals = goals.filter((g) => {
    if (activeTab === "active") return g.status === "active";
    if (activeTab === "completed") return g.status === "completed" || g.savedAmount >= g.targetAmount;
    return true;
  });

  const totalSavedAcrossGoals = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const totalTargetAcrossGoals = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const completedGoalsCount = goals.filter((g) => g.status === "completed" || g.savedAmount >= g.targetAmount).length;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-charcoal dark:text-charcoal-dark tracking-tight">
            Savings Goals
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
            Plan and save toward the things that matter to you
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>New Savings Goal</span>
        </Button>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hoverEffect className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted uppercase font-semibold">
              Total Saved So Far
            </span>
            <div className="text-xl font-bold font-mono text-charcoal dark:text-charcoal-dark">
              {formatLKR(totalSavedAcrossGoals)}
            </div>
          </div>
        </Card>

        <Card hoverEffect className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted uppercase font-semibold">
              Combined Target
            </span>
            <div className="text-xl font-bold font-mono text-charcoal dark:text-charcoal-dark">
              {formatLKR(totalTargetAcrossGoals)}
            </div>
          </div>
        </Card>

        <Card hoverEffect className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted uppercase font-semibold">
              Completed Goals
            </span>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {completedGoalsCount} of {goals.length}
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-surface-light dark:bg-surface-darkElevated rounded-xl border border-surface-border dark:border-surface-darkBorder w-fit">
        {[
          { id: "active", label: `Active (${goals.filter((g) => g.status === "active").length})` },
          { id: "completed", label: `Completed (${completedGoalsCount})` },
          { id: "all", label: `All Goals (${goals.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-surface-darkCard text-brand-700 dark:text-brand-300 shadow-sm"
                : "text-charcoal-muted dark:text-charcoal-darkMuted hover:text-charcoal"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals found"
          description={
            activeTab === "completed"
              ? "You haven't completed any goals yet. Keep contributing consistently!"
              : "Create a goal for books, supplies, a device, a trip, or an emergency fund."
          }
          actionLabel="Create Savings Goal"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onContribute={(g) => setContributingGoal(g)}
              onEdit={(g) => setEditingGoal(g)}
              onDelete={(id) => deleteGoal(id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ContributionModal
        isOpen={Boolean(contributingGoal)}
        onClose={() => setContributingGoal(null)}
        goal={contributingGoal}
      />

      {(isAddOpen || editingGoal) && (
        <GoalModal
          isOpen={true}
          onClose={() => {
            setIsAddOpen(false);
            setEditingGoal(null);
          }}
          goalToEdit={editingGoal}
        />
      )}
    </PageContainer>
  );
}
