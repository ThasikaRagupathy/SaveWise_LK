import { Transaction, Budget, SavingsGoal, BudgetStatus, CategorySummary } from "@/types";
import { EXPENSE_CATEGORIES } from "./constants";
import { getWeeksRemaining, isDateOverdue } from "./dates";

export interface MonthlyTotals {
  totalIncome: number;
  totalExpenses: number;
  net: number;
  savingsRate: number;
  transactionCount: number;
}

/**
 * Calculate totals for a given month (YYYY-MM)
 */
export function calculateMonthlyTotals(
  transactions: Transaction[],
  selectedMonth: string
): MonthlyTotals {
  const monthTransactions = transactions.filter((t) => t.date.startsWith(selectedMonth));

  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of monthTransactions) {
    if (t.type === "income") {
      totalIncome += t.amount;
    } else if (t.type === "expense") {
      totalExpenses += t.amount;
    }
  }

  const net = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 && net > 0 ? Math.round((net / totalIncome) * 100) : 0;

  return {
    totalIncome,
    totalExpenses,
    net,
    savingsRate,
    transactionCount: monthTransactions.length,
  };
}

/**
 * Calculate budget status for each configured category budget in a selected month
 */
export function calculateBudgetStatuses(
  budgets: Budget[],
  transactions: Transaction[],
  selectedMonth: string
): BudgetStatus[] {
  const monthExpenses = transactions.filter(
    (t) => t.type === "expense" && t.date.startsWith(selectedMonth)
  );

  return budgets.map((b) => {
    const spent = monthExpenses
      .filter((t) => t.category.toLowerCase() === b.category.toLowerCase())
      .reduce((sum, t) => sum + t.amount, 0);

    const remaining = b.limitAmount - spent;
    const percentUsed = b.limitAmount > 0 ? Math.round((spent / b.limitAmount) * 100) : 0;
    const isOverspent = spent > b.limitAmount;
    const isWarning = !isOverspent && percentUsed >= 80;

    return {
      budget: b,
      spent,
      remaining,
      percentUsed,
      isOverspent,
      isWarning,
    };
  });
}

/**
 * Calculate category spending breakdown for selected month
 */
export function calculateCategoryBreakdown(
  transactions: Transaction[],
  selectedMonth: string
): CategorySummary[] {
  const monthExpenses = transactions.filter(
    (t) => t.type === "expense" && t.date.startsWith(selectedMonth)
  );

  const totalExpense = monthExpenses.reduce((sum, t) => sum + t.amount, 0);
  if (totalExpense === 0) return [];

  const categoryMap = new Map<string, number>();

  for (const t of monthExpenses) {
    const current = categoryMap.get(t.category) || 0;
    categoryMap.set(t.category, current + t.amount);
  }

  const results: CategorySummary[] = [];

  categoryMap.forEach((amount, category) => {
    const matched = EXPENSE_CATEGORIES.find(
      (c) => c.id.toLowerCase() === category.toLowerCase()
    );
    const color = matched?.color || "#6B7280";
    const icon = matched?.icon || "MoreHorizontal";
    const percentage = Math.round((amount / totalExpense) * 100);

    results.push({
      category,
      amount,
      percentage,
      color,
      icon,
    });
  });

  return results.sort((a, b) => b.amount - a.amount);
}

/**
 * Calculate goal weekly contribution required
 */
export function calculateGoalWeeklyTarget(goal: SavingsGoal): {
  weeklyAmount: number;
  weeksRemaining: number;
  isOverdue: boolean;
  remainingAmount: number;
} {
  const remainingAmount = Math.max(0, goal.targetAmount - goal.savedAmount);
  if (remainingAmount <= 0) {
    return { weeklyAmount: 0, weeksRemaining: 0, isOverdue: false, remainingAmount: 0 };
  }

  const overdue = isDateOverdue(goal.deadline);
  if (overdue) {
    return { weeklyAmount: remainingAmount, weeksRemaining: 0, isOverdue: true, remainingAmount };
  }

  const weeksRemaining = getWeeksRemaining(goal.deadline);
  const weeklyAmount = weeksRemaining > 0 ? Math.ceil(remainingAmount / weeksRemaining) : remainingAmount;

  return {
    weeklyAmount,
    weeksRemaining,
    isOverdue: false,
    remainingAmount,
  };
}

/**
 * Purchase decision impact calculation
 */
export interface PurchaseImpactAnalysis {
  purchaseAmount: number;
  goalTitle: string;
  currentSaved: number;
  targetAmount: number;
  remainingWithoutPurchase: number;
  weeksToGoalWithoutPurchase: number;
  weeksToGoalWithDelayedContribution: number;
  additionalWeeksDelay: number;
  affordableFromMonthlySurplus: boolean;
  surplusCoveragePercent: number;
  recommendation: "safe" | "caution" | "delay";
  insightNote: string;
}

export function calculatePurchaseImpact(
  purchaseAmount: number,
  goal: SavingsGoal,
  plannedWeeklySavings: number,
  monthlyNetSurplus: number
): PurchaseImpactAnalysis {
  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
  const safeWeekly = plannedWeeklySavings > 0 ? plannedWeeklySavings : 1500;

  const weeksWithout = Math.ceil(remaining / safeWeekly);

  // If purchase amount delays goal by diverting savings:
  const additionalWeeksDelay = Math.ceil(purchaseAmount / safeWeekly);
  const weeksWith = weeksWithout + additionalWeeksDelay;

  const surplusCoveragePercent = monthlyNetSurplus > 0
    ? Math.min(100, Math.round((monthlyNetSurplus / purchaseAmount) * 100))
    : 0;

  const affordableFromMonthlySurplus = monthlyNetSurplus >= purchaseAmount;

  let recommendation: "safe" | "caution" | "delay" = "safe";
  let insightNote = "";

  if (affordableFromMonthlySurplus) {
    recommendation = "safe";
    insightNote = `Your current monthly surplus (Rs. ${monthlyNetSurplus.toLocaleString()}) covers this purchase without needing to compromise your '${goal.title}' goal.`;
  } else if (additionalWeeksDelay <= 3) {
    recommendation = "caution";
    insightNote = `This purchase will push back your '${goal.title}' goal by roughly ${additionalWeeksDelay} ${additionalWeeksDelay === 1 ? "week" : "weeks"}. Plan ahead if you have an upcoming deadline.`;
  } else {
    recommendation = "delay";
    insightNote = `Significant impact: This purchase will delay your '${goal.title}' goal by ${additionalWeeksDelay} weeks (approx ${(additionalWeeksDelay / 4).toFixed(1)} months). Consider saving specifically for it or looking for a student discount.`;
  }

  return {
    purchaseAmount,
    goalTitle: goal.title,
    currentSaved: goal.savedAmount,
    targetAmount: goal.targetAmount,
    remainingWithoutPurchase: remaining,
    weeksToGoalWithoutPurchase: weeksWithout,
    weeksToGoalWithDelayedContribution: weeksWith,
    additionalWeeksDelay,
    affordableFromMonthlySurplus,
    surplusCoveragePercent,
    recommendation,
    insightNote,
  };
}

/**
 * What-if savings simulation calculation
 */
export interface SimulationPoint {
  month: number;
  label: string;
  baselineSavings: number;
  acceleratedSavings: number;
}

export function simulateSavings(
  currentBalance: number,
  weeklySavings: number,
  monthlyReduction: number,
  horizonMonths: number
): SimulationPoint[] {
  const points: SimulationPoint[] = [];

  let baseline = currentBalance;
  let accelerated = currentBalance;

  // Monthly base savings = weeklySavings * 4.33
  const monthlyBaseSavings = weeklySavings * 4.33;
  const boostedMonthlySavings = monthlyBaseSavings + monthlyReduction;

  points.push({
    month: 0,
    label: "Now",
    baselineSavings: Math.round(baseline),
    acceleratedSavings: Math.round(accelerated),
  });

  for (let m = 1; m <= horizonMonths; m++) {
    baseline += monthlyBaseSavings;
    accelerated += boostedMonthlySavings;

    points.push({
      month: m,
      label: `Month ${m}`,
      baselineSavings: Math.round(baseline),
      acceleratedSavings: Math.round(accelerated),
    });
  }

  return points;
}
