"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  UserProfile,
  Transaction,
  Budget,
  SavingsGoal,
  SavingsContribution,
  SavingsChallenge,
  ThemeMode,
} from "@/types";
import {
  DEMO_PROFILE,
  DEMO_TRANSACTIONS,
  DEMO_BUDGETS,
  DEMO_GOALS,
  DEMO_CONTRIBUTIONS,
  DEMO_CHALLENGES,
} from "@/lib/demoData";
import { getCurrentMonthKey } from "@/lib/dates";

export interface AppState {
  // State
  profile: UserProfile;
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  contributions: SavingsContribution[];
  challenges: SavingsChallenge[];
  theme: ThemeMode;
  selectedMonth: string;
  notificationsEnabled: boolean;
  hasHydrated: boolean;

  // Actions
  setHasHydrated: (val: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  setSelectedMonth: (month: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;

  // Profile
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;

  // Transactions
  addTransaction: (tx: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Budgets
  upsertBudget: (budget: Omit<Budget, "id"> & { id?: string }) => void;
  removeBudget: (id: string) => void;

  // Goals
  addGoal: (goal: Omit<SavingsGoal, "id" | "savedAmount" | "status" | "createdAt">) => void;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  addContribution: (goalId: string, amount: number, note?: string) => void;

  // Challenges
  toggleChallengeProgress: (id: string, deltaAmount: number) => void;
  resetChallenge: (id: string) => void;

  // Management
  resetToDemoData: () => void;
  clearAllUserData: () => void;
  exportJSON: () => string;
  exportCSV: () => string;
  importJSON: (jsonStr: string) => boolean;
}

const STORAGE_KEY = "savewise-lk:v1";

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: DEMO_PROFILE,
      transactions: DEMO_TRANSACTIONS,
      budgets: DEMO_BUDGETS,
      goals: DEMO_GOALS,
      contributions: DEMO_CONTRIBUTIONS,
      challenges: DEMO_CHALLENGES,
      theme: "light",
      selectedMonth: getCurrentMonthKey(),
      notificationsEnabled: true,
      hasHydrated: false,

      setHasHydrated: (val) => set({ hasHydrated: val }),

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          const root = document.documentElement;
          if (
            theme === "dark" ||
            (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
          ) {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }
      },

      setSelectedMonth: (selectedMonth) => set({ selectedMonth }),

      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      completeOnboarding: (data) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...data,
            onboardingCompleted: true,
          },
        })),

      addTransaction: (tx) => {
        const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const now = new Date().toISOString();
        const newTx: Transaction = {
          ...tx,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }));
      },

      updateTransaction: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: now } : t
          ),
        }));
      },

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      upsertBudget: (b) => {
        set((state) => {
          const existingIndex = state.budgets.findIndex(
            (item) =>
              (b.id && item.id === b.id) ||
              (item.category.toLowerCase() === b.category.toLowerCase() &&
                item.month === b.month)
          );

          if (existingIndex >= 0) {
            const updated = [...state.budgets];
            updated[existingIndex] = {
              ...updated[existingIndex],
              limitAmount: b.limitAmount,
            };
            return { budgets: updated };
          } else {
            const newBudget: Budget = {
              id: b.id || `b-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              category: b.category,
              limitAmount: b.limitAmount,
              month: b.month,
            };
            return { budgets: [...state.budgets, newBudget] };
          }
        });
      },

      removeBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),

      addGoal: (goal) => {
        const id = `g-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const newGoal: SavingsGoal = {
          ...goal,
          id,
          savedAmount: 0,
          status: "active",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          goals: [newGoal, ...state.goals],
        }));
      },

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== id) return g;
            const updated = { ...g, ...updates };
            // Auto complete if target reached
            if (updated.savedAmount >= updated.targetAmount && updated.status === "active") {
              updated.status = "completed";
            }
            return updated;
          }),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
          contributions: state.contributions.filter((c) => c.goalId !== id),
        })),

      addContribution: (goalId, amount, note) => {
        if (amount <= 0) return;
        const contribId = `c-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const date = new Date().toISOString().slice(0, 10);

        const newContrib: SavingsContribution = {
          id: contribId,
          goalId,
          amount,
          date,
          note,
        };

        set((state) => {
          const updatedGoals = state.goals.map((g) => {
            if (g.id !== goalId) return g;
            const newSaved = g.savedAmount + amount;
            const status = newSaved >= g.targetAmount ? "completed" : g.status;
            return {
              ...g,
              savedAmount: newSaved,
              status,
            };
          });

          return {
            goals: updatedGoals,
            contributions: [newContrib, ...state.contributions],
          };
        });
      },

      toggleChallengeProgress: (id, deltaAmount) =>
        set((state) => ({
          challenges: state.challenges.map((ch) => {
            if (ch.id !== id) return ch;
            const nextAmount = Math.max(0, Math.min(ch.targetAmount, ch.currentAmount + deltaAmount));
            const status = nextAmount >= ch.targetAmount ? "completed" : "active";
            return {
              ...ch,
              currentAmount: nextAmount,
              status,
            };
          }),
        })),

      resetChallenge: (id) =>
        set((state) => ({
          challenges: state.challenges.map((ch) =>
            ch.id === id ? { ...ch, currentAmount: 0, status: "active" } : ch
          ),
        })),

      resetToDemoData: () =>
        set({
          profile: DEMO_PROFILE,
          transactions: DEMO_TRANSACTIONS,
          budgets: DEMO_BUDGETS,
          goals: DEMO_GOALS,
          contributions: DEMO_CONTRIBUTIONS,
          challenges: DEMO_CHALLENGES,
          selectedMonth: getCurrentMonthKey(),
        }),

      clearAllUserData: () =>
        set({
          profile: {
            id: `user-${Date.now()}`,
            displayName: "New Student",
            currency: "LKR",
            onboardingCompleted: false,
          },
          transactions: [],
          budgets: [],
          goals: [],
          contributions: [],
          challenges: DEMO_CHALLENGES.map((c) => ({ ...c, currentAmount: 0, status: "active" })),
        }),

      exportJSON: () => {
        const state = get();
        const exportObj = {
          version: "1.0.0",
          exportedAt: new Date().toISOString(),
          owner: "Thasika Ragupathy",
          profile: state.profile,
          transactions: state.transactions,
          budgets: state.budgets,
          goals: state.goals,
          contributions: state.contributions,
          challenges: state.challenges,
        };
        return JSON.stringify(exportObj, null, 2);
      },

      exportCSV: () => {
        const state = get();
        const header = ["ID", "Title", "Amount (LKR)", "Type", "Category", "Date", "Notes"];
        const rows = state.transactions.map((t) => [
          t.id,
          `"${t.title.replace(/"/g, '""')}"`,
          t.amount,
          t.type,
          `"${t.category.replace(/"/g, '""')}"`,
          t.date,
          `"${(t.note || "").replace(/"/g, '""')}"`,
        ]);
        return [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
      },

      importJSON: (jsonStr: string) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed && Array.isArray(parsed.transactions)) {
            set((state) => ({
              profile: parsed.profile || state.profile,
              transactions: parsed.transactions || state.transactions,
              budgets: parsed.budgets || state.budgets,
              goals: parsed.goals || state.goals,
              contributions: parsed.contributions || state.contributions,
              challenges: parsed.challenges || state.challenges,
            }));
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (null as any))),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
          // Apply theme on initial hydrate
          if (typeof document !== "undefined") {
            const root = document.documentElement;
            const theme = state.theme;
            if (
              theme === "dark" ||
              (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
            ) {
              root.classList.add("dark");
            } else {
              root.classList.remove("dark");
            }
          }
        }
      },
    }
  )
);
