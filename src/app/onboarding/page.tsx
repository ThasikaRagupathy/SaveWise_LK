"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Wallet,
  PieChart,
  Target,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/appStore";
import { APP_METADATA, EXPENSE_CATEGORIES, GOAL_CATEGORIES } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function OnboardingPage() {
  const router = useRouter();
  const {
    profile,
    updateProfile,
    upsertBudget,
    addGoal,
    selectedMonth,
  } = useAppStore();

  const [step, setStep] = useState(1);

  // Step 1: Student info
  const [displayName, setDisplayName] = useState(profile.displayName || "Nila");
  const [university, setUniversity] = useState(profile.university || APP_METADATA.universityOptions[0]);

  // Step 2: Income / Allowance
  const [incomeType, setIncomeType] = useState<"fixed" | "irregular" | "skip">("fixed");
  const [incomeEstimate, setIncomeEstimate] = useState("35000");

  // Step 3: Initial category budget
  const [budgetCategory, setBudgetCategory] = useState("Food & Groceries");
  const [budgetLimit, setBudgetLimit] = useState("12000");

  // Step 4: First savings goal
  const [goalTitle, setGoalTitle] = useState("Dell Coding Laptop");
  const [goalTarget, setGoalTarget] = useState("150000");
  const [goalCategory, setGoalCategory] = useState("Tech & Devices");

  const handleFinish = () => {
    // Save profile updates
    updateProfile({
      displayName,
      university,
      monthlyIncomeEstimate: incomeType === "fixed" ? parseFloat(incomeEstimate) || 0 : undefined,
      onboardingCompleted: true,
    });

    // Save initial budget if provided
    if (budgetLimit && parseFloat(budgetLimit) > 0) {
      upsertBudget({
        category: budgetCategory,
        limitAmount: parseFloat(budgetLimit),
        month: selectedMonth,
      });
    }

    // Save initial goal if provided
    if (goalTitle && parseFloat(goalTarget) > 0) {
      addGoal({
        title: goalTitle,
        targetAmount: parseFloat(goalTarget),
        category: goalCategory,
      });
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-surface-light dark:bg-surface-dark px-4 py-8">
      {/* Top Header */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-emerald-200" />
          </div>
          <span className="font-extrabold text-base text-charcoal dark:text-charcoal-dark">
            SaveWise LK
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Wizard Container */}
      <div className="max-w-xl w-full mx-auto my-auto space-y-4">
        {/* Progress Bar & Steps Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-charcoal-muted dark:text-charcoal-darkMuted">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Setup Completed</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-border dark:bg-surface-darkElevated overflow-hidden">
            <div
              style={{ width: `${(step / 4) * 100}%` }}
              className="h-full bg-brand-600 dark:bg-brand-500 rounded-full transition-all duration-300"
            />
          </div>
        </div>

        <Card className="shadow-card">
          {/* STEP 1: WELCOME & NAME */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Getting Started
                </span>
                <h3 className="text-xl font-black text-charcoal dark:text-charcoal-dark mt-1">
                  Welcome to SaveWise LK! 👋
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted mt-1">
                  Let’s configure your personal student finances in Sri Lankan Rupees.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="What should we call you?"
                  placeholder="e.g. Nila, Kasun, Thasika"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />

                <Select
                  label="University / Higher Education Institution"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                >
                  {APP_METADATA.universityOptions.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="primary" onClick={() => setStep(2)}>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: MONTHLY INCOME / ALLOWANCE */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Income Baseline
                </span>
                <h3 className="text-xl font-black text-charcoal dark:text-charcoal-dark mt-1">
                  Estimated Monthly Inflow
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted mt-1">
                  University income can vary. Choose the option that fits your situation best.
                </p>
              </div>

              {/* Mode Selection */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "fixed", label: "Monthly Allowance" },
                  { id: "irregular", label: "Gigs / Irregular" },
                  { id: "skip", label: "Not Sure Yet" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIncomeType(item.id as any)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      incomeType === item.id
                        ? "border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20"
                        : "border-surface-border dark:border-surface-darkBorder hover:bg-surface-light dark:hover:bg-surface-darkElevated text-charcoal-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {incomeType === "fixed" && (
                <Input
                  label="Typical Monthly Total (Family, Jobs, Bursaries in LKR)"
                  type="number"
                  prefixElement={<span className="text-xs font-bold font-mono">Rs.</span>}
                  value={incomeEstimate}
                  onChange={(e) => setIncomeEstimate(e.target.value)}
                />
              )}

              <div className="pt-2 flex items-center justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button variant="primary" onClick={() => setStep(3)}>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: INITIAL CATEGORY BUDGET */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Spending Guardrails
                </span>
                <h3 className="text-xl font-black text-charcoal dark:text-charcoal-dark mt-1">
                  Set Your First Monthly Budget
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted mt-1">
                  Choose a category where you want to keep costs controlled (e.g. food or transit).
                </p>
              </div>

              <div className="space-y-4">
                <Select
                  label="Budget Category"
                  value={budgetCategory}
                  onChange={(e) => setBudgetCategory(e.target.value)}
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Monthly Limit Cap (LKR)"
                  type="number"
                  prefixElement={<span className="text-xs font-bold font-mono">Rs.</span>}
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  hint="You can add more category budgets later in the planner."
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button variant="primary" onClick={() => setStep(4)}>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: FIRST SAVINGS GOAL */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Future Vision
                </span>
                <h3 className="text-xl font-black text-charcoal dark:text-charcoal-dark mt-1">
                  Create a Milestone Goal
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted mt-1">
                  What are you striving to achieve or purchase during your university journey?
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Goal Name"
                  placeholder="e.g. Dev Laptop, Exam Certification, Semester Trip"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                />

                <Input
                  label="Target Amount (LKR)"
                  type="number"
                  prefixElement={<span className="text-xs font-bold font-mono">Rs.</span>}
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                />

                <Select
                  label="Goal Category"
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value)}
                >
                  {GOAL_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button variant="secondary" onClick={() => setStep(3)}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button variant="primary" onClick={handleFinish}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finish & Open Dashboard</span>
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Ownership */}
        <div className="text-center text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          <span>SaveWise LK • Owned by {APP_METADATA.owner}</span>
        </div>
      </div>

      <div />
    </div>
  );
}
