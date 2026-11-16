"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { useAppStore } from "@/store/appStore";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatLKR } from "@/lib/currency";
import { Trophy, Zap, Award, Flame, CheckCircle, RotateCcw, Plus } from "lucide-react";
import { SavingsChallenge } from "@/types";

export default function ChallengesPage() {
  const { challenges, toggleChallengeProgress, resetChallenge } = useAppStore();
  const [selectedChallenge, setSelectedChallenge] = useState<SavingsChallenge | null>(null);

  const handleLogProgress = (ch: SavingsChallenge, amount: number) => {
    toggleChallengeProgress(ch.id, amount);
    if (ch.currentAmount + amount >= ch.targetAmount) {
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#299E72", "#10B981", "#F59E0B", "#3B82F6"],
        });
      } catch {}
    }
  };

  const completedCount = challenges.filter((c) => c.status === "completed").length;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-charcoal dark:text-charcoal-dark tracking-tight">
            Savings Challenges & Streaks
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
            Simple saving habits for students at school, university, and beyond
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{completedCount} Challenges Conquered</span>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {challenges.map((ch) => {
          const percent = Math.min(100, Math.round((ch.currentAmount / ch.targetAmount) * 100));
          const isDone = ch.status === "completed" || percent >= 100;

          return (
            <Card
              key={ch.id}
              hoverEffect
              className={`flex flex-col justify-between space-y-4 ${
                isDone ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10" : ""
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isDone
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400"
                      }`}
                    >
                      {isDone ? <CheckCircle className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-charcoal dark:text-charcoal-dark leading-tight">
                        {ch.title}
                      </h4>
                      <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                        {ch.badge}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-light dark:bg-surface-darkElevated text-charcoal-muted dark:text-charcoal-darkMuted border border-surface-border dark:border-surface-darkBorder">
                    {ch.durationDays} Days
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted mt-3 leading-relaxed">
                  {ch.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono font-medium">
                    <span className="text-charcoal dark:text-charcoal-dark font-bold">
                      Saved: {formatLKR(ch.currentAmount)}
                    </span>
                    <span className="text-charcoal-muted dark:text-charcoal-darkMuted">
                      Target: {formatLKR(ch.targetAmount)}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-surface-border dark:bg-surface-darkElevated overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        isDone ? "bg-emerald-500" : "bg-brand-500"
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted">
                    <span>{percent}% Completed</span>
                    {ch.daysRemaining > 0 && <span>{ch.daysRemaining} days remaining</span>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-surface-border/50 dark:border-surface-darkBorder/50 flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-charcoal-muted hover:text-charcoal"
                  onClick={() => resetChallenge(ch.id)}
                  title="Reset challenge"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </Button>

                {!isDone ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="mint"
                      size="sm"
                      onClick={() => handleLogProgress(ch, Math.round(ch.targetAmount / ch.durationDays) || 300)}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Daily Save (+{formatLKR(Math.round(ch.targetAmount / ch.durationDays) || 300)})</span>
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed! Badge Unlocked</span>
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Philosophy Callout */}
      <Card className="bg-brand-50/50 dark:bg-brand-950/20 border-brand-200/50 dark:border-brand-800/40">
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-brand-900 dark:text-brand-200">
              Flexible Saving Habits
            </h4>
            <p className="text-brand-800/80 dark:text-brand-300 leading-relaxed">
              School, university, and work schedules can change. Missed a day? Your progress will not reset unless you choose to restart. Small steps matter more than perfect streaks.
            </p>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
