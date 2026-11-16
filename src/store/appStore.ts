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
  PlannerItem,
  ThemeMode,
} from "@/types";
import { SAVINGS_CHALLENGE_TEMPLATES } from "@/lib/challengeTemplates";
import { getCurrentMonthKey } from "@/lib/dates";

const EMPTY_PROFILE: UserProfile = {
  id: "",
  displayName: "",
  currency: "LKR",
  onboardingCompleted: false,
};

const SEEDED_RECORD_IDS = {
  transactions: new Set([
    "tx-inc-1",
    "tx-inc-2",
    "tx-inc-3",
    "tx-exp-1",
    "tx-exp-2",
    "tx-exp-3",
    "tx-exp-4",
    "tx-exp-5",
    "tx-exp-6",
    "tx-exp-7",
    "tx-exp-8",
    "tx-exp-9",
  ]),
  budgets: new Set(["b-1", "b-2", "b-3", "b-4", "b-5", "b-6", "b-7"]),
  goals: new Set(["g-1", "g-2", "g-3", "g-4"]),
  contributions: new Set(["c-1", "c-2"]),
};

const LEGACY_CHALLENGE_AMOUNTS: Record<string, number> = {
  "ch-1": 1500,
  "ch-2": 2500,
  "ch-3": 1200,
  "ch-4": 18500,
};

interface AccountData {
  profile: UserProfile;
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  contributions: SavingsContribution[];
  challenges: SavingsChallenge[];
  plannerItems: PlannerItem[];
  selectedMonth: string;
}

function createChallengeState() {
  return SAVINGS_CHALLENGE_TEMPLATES.map((challenge) => ({ ...challenge }));
}

function normalizeEmail(email?: string) {
  return email?.trim().toLowerCase() || "";
}

function isLegacyDemoProfile(profile?: UserProfile) {
  return (
    profile?.id === "user-demo" ||
    normalizeEmail(profile?.email) === "nila.student@campus.ac.lk"
  );
}

function migrateProfile(profile?: UserProfile): UserProfile {
  if (!profile) return EMPTY_PROFILE;
  if (!isLegacyDemoProfile(profile)) return profile;

  const isDefaultProfile = profile.displayName === "Nila Silva";
  return {
    ...profile,
    id: `user-${Date.now()}`,
    displayName: isDefaultProfile ? "" : profile.displayName,
    email:
      profile.email === "nila.student@campus.ac.lk" ? undefined : profile.email,
    university:
      profile.university === "University of Colombo" ? undefined : profile.university,
    faculty:
      profile.faculty === "Faculty of Computing & Information Systems"
        ? undefined
        : profile.faculty,
    monthlyIncomeEstimate:
      profile.monthlyIncomeEstimate === 45000
        ? undefined
        : profile.monthlyIncomeEstimate,
    onboardingCompleted: isDefaultProfile ? false : profile.onboardingCompleted,
    avatarUrl: profile.avatarUrl || undefined,
  };
}

function withoutSeededRecords<T extends { id: string }>(
  records: T[] | undefined,
  seededIds: Set<string>
) {
  return Array.isArray(records)
    ? records.filter((record) => !seededIds.has(record.id))
    : [];
}

function migrateChallenges(challenges?: SavingsChallenge[]) {
  if (!Array.isArray(challenges)) return createChallengeState();

  return challenges.map((challenge) => {
    if (challenge.currentAmount !== LEGACY_CHALLENGE_AMOUNTS[challenge.id]) {
      return challenge;
    }

    return {
      ...challenge,
      currentAmount: 0,
      daysRemaining: challenge.durationDays,
      status: "active" as const,
    };
  });
}

function migrateAccountData(data: Partial<AccountData>): AccountData {
  return {
    profile: migrateProfile(data.profile),
    transactions: withoutSeededRecords(data.transactions, SEEDED_RECORD_IDS.transactions),
    budgets: withoutSeededRecords(data.budgets, SEEDED_RECORD_IDS.budgets),
    goals: withoutSeededRecords(data.goals, SEEDED_RECORD_IDS.goals),
    contributions: withoutSeededRecords(data.contributions, SEEDED_RECORD_IDS.contributions),
    challenges: migrateChallenges(data.challenges),
    plannerItems: Array.isArray(data.plannerItems) ? data.plannerItems : [],
    selectedMonth: data.selectedMonth || getCurrentMonthKey(),
  };
}

function getAccountData(state: AccountData): AccountData {
  return {
    profile: { ...state.profile },
    transactions: state.transactions.map((transaction) => ({ ...transaction })),
    budgets: state.budgets.map((budget) => ({ ...budget })),
    goals: state.goals.map((goal) => ({ ...goal })),
    contributions: state.contributions.map((contribution) => ({ ...contribution })),
    challenges: state.challenges.map((challenge) => ({ ...challenge })),
    plannerItems: state.plannerItems.map((item) => ({ ...item })),
    selectedMonth: state.selectedMonth,
  };
}

function createAccountData(displayName: string, email: string): AccountData {
  return {
    profile: {
      id: `user-${Date.now()}`,
      displayName,
      email,
      currency: "LKR",
      onboardingCompleted: false,
    },
    transactions: [],
    budgets: [],
    goals: [],
    contributions: [],
    challenges: createChallengeState(),
    plannerItems: [],
    selectedMonth: getCurrentMonthKey(),
  };
}

export interface AppState {
  // State
  profile: UserProfile;
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  contributions: SavingsContribution[];
  challenges: SavingsChallenge[];
  plannerItems: PlannerItem[];
  theme: ThemeMode;
  selectedMonth: string;
  notificationsEnabled: boolean;
  hasHydrated: boolean;
  accounts: Record<string, AccountData>;
  activeAccountId: string | null;
  isLoggedIn: boolean;

  // Actions
  setHasHydrated: (val: boolean) => void;
  signIn: (credentials: { displayName: string; email: string }) => boolean;
  logout: () => void;
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

  // Planner
  addPlannerItem: (item: Omit<PlannerItem, "id" | "completed" | "createdAt">) => void;
  togglePlannerItem: (id: string) => void;
  deletePlannerItem: (id: string) => void;

  // Challenges
  toggleChallengeProgress: (id: string, deltaAmount: number) => void;
  resetChallenge: (id: string) => void;

  // Management
  clearAllUserData: () => void;
  exportJSON: () => string;
  exportCSV: () => string;
  importJSON: (jsonStr: string) => boolean;
}

const STORAGE_KEY = "savewise-lk:v1";

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: EMPTY_PROFILE,
      transactions: [],
      budgets: [],
      goals: [],
      contributions: [],
      challenges: createChallengeState(),
      plannerItems: [],
      theme: "light",
      selectedMonth: getCurrentMonthKey(),
      notificationsEnabled: true,
      hasHydrated: false,
      accounts: {},
      activeAccountId: null,
      isLoggedIn: false,

      setHasHydrated: (val) => set({ hasHydrated: val }),

      signIn: ({ displayName, email }) => {
        const normalizedEmail = normalizeEmail(email);
        const normalizedName = displayName.trim();

        if (!normalizedEmail || !normalizedName) return false;

        set((state) => {
          const currentAccountId =
            state.activeAccountId || normalizeEmail(state.profile.email);
          const accounts = { ...state.accounts };

          if (currentAccountId) {
            accounts[currentAccountId] = getAccountData(state);
          }

          const storedAccount = accounts[normalizedEmail];
          const account = storedAccount
            ? { ...storedAccount, plannerItems: storedAccount.plannerItems || [] }
            : createAccountData(normalizedName, email.trim());

          return {
            ...account,
            profile: {
              ...account.profile,
              displayName: normalizedName,
              email: email.trim(),
            },
            accounts,
            activeAccountId: normalizedEmail,
            isLoggedIn: true,
          };
        });

        return true;
      },

      logout: () =>
        set((state) => {
          const currentAccountId =
            state.activeAccountId || normalizeEmail(state.profile.email);
          const accounts = currentAccountId
            ? { ...state.accounts, [currentAccountId]: getAccountData(state) }
            : state.accounts;

          return {
            accounts,
            activeAccountId: currentAccountId || null,
            isLoggedIn: false,
          };
        }),

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

      addPlannerItem: (item) => {
        const newItem: PlannerItem = {
          ...item,
          id: `planner-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          plannerItems: [newItem, ...state.plannerItems],
        }));
      },

      togglePlannerItem: (id) =>
        set((state) => ({
          plannerItems: state.plannerItems.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
          ),
        })),

      deletePlannerItem: (id) =>
        set((state) => ({
          plannerItems: state.plannerItems.filter((item) => item.id !== id),
        })),

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

      clearAllUserData: () =>
        set({
          transactions: [],
          budgets: [],
          goals: [],
          contributions: [],
          challenges: createChallengeState(),
          plannerItems: [],
        }),

      exportJSON: () => {
        const state = get();
        const exportObj = {
          version: "1.0.0",
          exportedAt: new Date().toISOString(),
          profile: state.profile,
          transactions: state.transactions,
          budgets: state.budgets,
          goals: state.goals,
          contributions: state.contributions,
          challenges: state.challenges,
          plannerItems: state.plannerItems,
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
              plannerItems: Array.isArray(parsed.plannerItems)
                ? parsed.plannerItems
                : state.plannerItems,
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
      version: 1,
      migrate: (persistedState, version) => {
        if (version >= 1) return persistedState as AppState;

        const state = persistedState as Partial<AppState> & Partial<AccountData>;
        const accounts = Object.fromEntries(
          Object.entries(state.accounts || {}).map(([accountId, account]) => [
            accountId,
            migrateAccountData(account),
          ])
        ) as Record<string, AccountData>;
        const migratedActiveAccount = migrateAccountData(state);

        if (isLegacyDemoProfile(state.profile)) {
          const previousAccountId = normalizeEmail(state.profile?.email);
          if (previousAccountId) {
            accounts[previousAccountId] = migratedActiveAccount;
          }

          return {
            ...state,
            profile: EMPTY_PROFILE,
            transactions: [],
            budgets: [],
            goals: [],
            contributions: [],
            challenges: createChallengeState(),
            plannerItems: [],
            selectedMonth: getCurrentMonthKey(),
            accounts,
            activeAccountId: null,
            isLoggedIn: false,
          } as AppState;
        }

        return {
          ...state,
          ...migratedActiveAccount,
          accounts,
        } as AppState;
      },
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
