"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { formatLKR } from "@/lib/currency";
import { calculatePurchaseImpact, calculateMonthlyTotals } from "@/lib/calculations";
import { Calculator, ArrowRight, AlertCircle, CheckCircle, HelpCircle, Sparkles } from "lucide-react";

export default function PurchaseAssistantPage() {
  const { goals, transactions, selectedMonth } = useAppStore();

  const [itemName, setItemName] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("15000");
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id || "");
  const [plannedWeeklyContribution, setPlannedWeeklyContribution] = useState("2500");

  const totals = calculateMonthlyTotals(transactions, selectedMonth);
  const selectedGoal = goals.find((g) => g.id === selectedGoalId) || goals[0];

  const parsedAmount = parseFloat(purchaseAmount) || 0;
  const parsedWeekly = parseFloat(plannedWeeklyContribution) || 2500;

  const analysis = selectedGoal
    ? calculatePurchaseImpact(parsedAmount, selectedGoal, parsedWeekly, totals.net)
    : null;

  return (
    <PageContainer>
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-charcoal dark:text-charcoal-dark tracking-tight">
          Purchase Decision Assistant
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
          Understand the real opportunity cost before spending on gadgets, clothes, or impulse items
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (Left Column - 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader
              title="Purchase Details"
              subtitle="What are you thinking of buying?"
            />

            <div className="space-y-4">
              <Input
                label="Item Name / Purpose (Optional)"
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />

              <Input
                label="Price / Purchase Amount (LKR)"
                type="number"
                min="1"
                prefixElement={<span className="text-xs font-bold font-mono">Rs.</span>}
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
              />

              <Select
                label="Which Savings Goal Does This Impact?"
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
              >
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title} (Target: {formatLKR(g.targetAmount)})
                  </option>
                ))}
              </Select>

              <Input
                label="Your Typical Weekly Savings to this Goal (LKR)"
                type="number"
                min="100"
                prefixElement={<span className="text-xs font-bold font-mono">Rs.</span>}
                value={plannedWeeklyContribution}
                onChange={(e) => setPlannedWeeklyContribution(e.target.value)}
                hint="Used to compute the opportunity delay in weeks."
              />
            </div>
          </Card>
        </div>

        {/* Impact Analysis Result (Right Column - 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {analysis && selectedGoal ? (
            <Card className="space-y-6">
              <CardHeader
                title={
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    <span>Impact Analysis & Opportunity Cost</span>
                  </div>
                }
                subtitle={`Simulating ${formatLKR(parsedAmount)} spend against '${selectedGoal.title}'`}
              />

              {/* Recommendation Callout */}
              <div
                className={`p-4 rounded-2xl flex items-start gap-3.5 border ${
                  analysis.recommendation === "safe"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                    : analysis.recommendation === "caution"
                    ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                }`}
              >
                {analysis.recommendation === "safe" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">
                    {analysis.recommendation === "safe"
                      ? "Comfortably Affordable"
                      : analysis.recommendation === "caution"
                      ? "Minor Timeline Delay"
                      : "Consider Postponing or Downsizing"}
                  </h4>
                  <p className="text-xs leading-relaxed opacity-90">{analysis.insightNote}</p>
                </div>
              </div>

              {/* Comparative Timeline Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-darkElevated border border-surface-border dark:border-surface-darkBorder space-y-2">
                  <span className="text-[11px] font-semibold text-charcoal-muted dark:text-charcoal-darkMuted uppercase">
                    Scenario A: Skip Purchase
                  </span>
                  <div className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">
                    {analysis.weeksToGoalWithoutPurchase} Weeks
                  </div>
                  <p className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
                    Reach &apos;{selectedGoal.title}&apos; on schedule at your current savings pace.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-darkElevated border border-surface-border dark:border-surface-darkBorder space-y-2">
                  <span className="text-[11px] font-semibold text-charcoal-muted dark:text-charcoal-darkMuted uppercase">
                    Scenario B: Fund Purchase
                  </span>
                  <div className="text-2xl font-black text-charcoal dark:text-charcoal-dark font-mono">
                    {analysis.weeksToGoalWithDelayedContribution} Weeks
                  </div>
                  <p className="text-xs text-rose-500 font-medium">
                    +{analysis.additionalWeeksDelay} extra weeks delay on your main goal.
                  </p>
                </div>
              </div>

              {/* Monthly Surplus Context */}
              <div className="p-4 rounded-xl border border-surface-border dark:border-surface-darkBorder space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted dark:text-charcoal-darkMuted">
                    Monthly Net Surplus ({totals.net >= 0 ? "Positive" : "Deficit"}):
                  </span>
                  <strong className="font-mono text-charcoal dark:text-charcoal-dark">
                    {formatLKR(totals.net)}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted dark:text-charcoal-darkMuted">
                    Current Goal Target Remaining:
                  </span>
                  <strong className="font-mono text-brand-600 dark:text-brand-400">
                    {formatLKR(analysis.remainingWithoutPurchase)}
                  </strong>
                </div>
              </div>

              {/* Neutral Disclaimer */}
              <p className="text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted leading-relaxed italic border-t border-surface-border/50 dark:border-surface-darkBorder/50 pt-3">
                * Note: This simulation illustrates the mathematical trade-off of redirecting your student savings. SaveWise LK does not automatically deduct or alter your real balances.
              </p>
            </Card>
          ) : (
            <Card className="text-center py-12 text-charcoal-muted dark:text-charcoal-darkMuted text-sm">
              Please create at least one savings goal first to run opportunity simulations.
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
