"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader } from "@/components/ui/Card";
import { MonthlyTrendChart } from "@/components/charts/MonthlyTrendChart";
import { simulateSavings } from "@/lib/calculations";
import { formatLKR } from "@/lib/currency";
import { Sliders, TrendingUp, Sparkles, AlertCircle, ArrowUpRight } from "lucide-react";

export default function SimulatorPage() {
  const { goals } = useAppStore();

  const currentTotalSavings = goals.reduce((sum, g) => sum + g.savedAmount, 0);

  const [weeklySavings, setWeeklySavings] = useState(2000);
  const [monthlyExpenseReduction, setMonthlyExpenseReduction] = useState(3000);
  const [horizonMonths, setHorizonMonths] = useState(6);

  const simulationPoints = simulateSavings(
    currentTotalSavings,
    weeklySavings,
    monthlyExpenseReduction,
    horizonMonths
  );

  const baselineFinal = simulationPoints[simulationPoints.length - 1].baselineSavings;
  const acceleratedFinal = simulationPoints[simulationPoints.length - 1].acceleratedSavings;
  const additionalGain = acceleratedFinal - baselineFinal;

  const chartPoints = simulationPoints.map((p) => ({
    label: p.label,
    value: p.baselineSavings,
    secondaryValue: p.acceleratedSavings,
  }));

  return (
    <PageContainer>
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-charcoal dark:text-charcoal-dark tracking-tight">
          What-If Savings Simulator
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
          Project how small daily adjustments compound into substantial wealth across your university semesters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="space-y-6">
            <CardHeader
              title="Simulation Controls"
              subtitle="Tweak habits to see your future fund"
            />

            {/* Slider 1: Weekly Savings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-charcoal dark:text-charcoal-dark uppercase tracking-wider">
                  Regular Weekly Savings
                </label>
                <span className="font-bold font-mono text-brand-600 dark:text-brand-400 text-sm">
                  {formatLKR(weeklySavings)}/wk
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="15000"
                step="250"
                value={weeklySavings}
                onChange={(e) => setWeeklySavings(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-charcoal-muted dark:text-charcoal-darkMuted">
                <span>Rs. 500</span>
                <span>Rs. 15,000</span>
              </div>
            </div>

            {/* Slider 2: Monthly Cut */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-charcoal dark:text-charcoal-dark uppercase tracking-wider">
                  Monthly Lifestyle Cut (Snacks/Cabs)
                </label>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                  +{formatLKR(monthlyExpenseReduction)}/mo
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15000"
                step="500"
                value={monthlyExpenseReduction}
                onChange={(e) => setMonthlyExpenseReduction(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-charcoal-muted dark:text-charcoal-darkMuted">
                <span>Rs. 0</span>
                <span>Rs. 15,000</span>
              </div>
            </div>

            {/* Slider 3: Horizon */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-charcoal dark:text-charcoal-dark uppercase tracking-wider">
                  Timeline Horizon
                </label>
                <span className="font-bold text-charcoal dark:text-charcoal-dark text-sm">
                  {horizonMonths} Months
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="24"
                step="1"
                value={horizonMonths}
                onChange={(e) => setHorizonMonths(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-charcoal-muted dark:text-charcoal-darkMuted">
                <span>3 Months</span>
                <span>24 Months (2 Years)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-light dark:bg-surface-darkElevated text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
              Current Base Savings across active goals:{" "}
              <strong className="text-charcoal dark:text-charcoal-dark font-mono">
                {formatLKR(currentTotalSavings)}
              </strong>
            </div>
          </Card>
        </div>

        {/* Projections & Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="space-y-6">
            <CardHeader
              title="Projected Savings Trajectory"
              subtitle={`Growth projection over ${horizonMonths} months`}
            />

            <MonthlyTrendChart
              points={chartPoints}
              primaryLabel="Baseline Pace"
              secondaryLabel="Accelerated with Lifestyle Cut"
            />

            {/* Outcome KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-darkElevated border border-surface-border dark:border-surface-darkBorder">
                <span className="text-[11px] font-semibold text-charcoal-muted dark:text-charcoal-darkMuted uppercase">
                  Baseline Outcome
                </span>
                <div className="text-xl font-bold font-mono text-charcoal dark:text-charcoal-dark mt-1">
                  {formatLKR(baselineFinal)}
                </div>
                <p className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted mt-1">
                  At standard {formatLKR(weeklySavings)}/week deposit.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Accelerated Outcome
                </span>
                <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-1">
                  {formatLKR(acceleratedFinal)}
                </div>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-1">
                  +{formatLKR(additionalGain)} extra by trimming non-essentials.
                </p>
              </div>
            </div>

            {/* Neutral Disclaimer */}
            <div className="p-3 rounded-xl bg-surface-light dark:bg-surface-darkElevated flex items-start gap-2.5 text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted">
              <AlertCircle className="w-4 h-4 shrink-0 text-charcoal-muted mt-0.5" />
              <span>
                Calculations are linear cash accumulation projections. No bank interest, inflation rates, or investment returns are assumed.
              </span>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
