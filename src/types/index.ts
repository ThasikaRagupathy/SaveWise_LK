export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO date e.g. YYYY-MM-DD
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type GoalStatus = "active" | "completed" | "archived";

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string; // ISO date
  category: string;
  status: GoalStatus;
  createdAt: string;
}

export interface SavingsContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface Budget {
  id: string;
  category: string;
  limitAmount: number;
  month: string; // YYYY-MM
}

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  university?: string;
  faculty?: string;
  currency: "LKR";
  monthlyIncomeEstimate?: number;
  onboardingCompleted: boolean;
  avatarUrl?: string;
}

export type ChallengeType = "7-day" | "no-spend" | "weekly" | "category-cut";
export type ChallengeStatus = "active" | "completed" | "paused";

export interface SavingsChallenge {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  durationDays: number;
  daysRemaining: number;
  status: ChallengeStatus;
  type: ChallengeType;
  category?: string;
}

export type ThemeMode = "light" | "dark" | "system";

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface BudgetStatus {
  budget: Budget;
  spent: number;
  remaining: number;
  percentUsed: number;
  isOverspent: boolean;
  isWarning: boolean;
}
