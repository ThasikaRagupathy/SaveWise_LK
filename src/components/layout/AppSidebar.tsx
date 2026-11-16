"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Receipt,
  PieChart,
  Target,
  Trophy,
  BarChart3,
  Calculator,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { APP_METADATA } from "@/lib/constants";
import { BrandMark } from "@/components/brand/BrandMark";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Planner", icon: CalendarDays },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
  { href: "/dashboard/budgets", label: "Budget Planner", icon: PieChart },
  { href: "/dashboard/goals", label: "Savings Goals", icon: Target },
  { href: "/dashboard/challenges", label: "Challenges & Streaks", icon: Trophy },
  { href: "/dashboard/insights", label: "Insights & Analytics", icon: BarChart3 },
  { href: "/dashboard/purchase-assistant", label: "Purchase Assistant", icon: Calculator },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useAppStore();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-surface-darkCard border-r border-surface-border dark:border-surface-darkBorder h-dvh sticky top-0 z-30">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-surface-border/80 dark:border-surface-darkBorder/80">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <BrandMark className="w-10 h-10 shrink-0 transition-transform group-hover:scale-105" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-charcoal dark:text-charcoal-dark tracking-tight">
                SaveWise
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-300">
                LK
              </span>
            </div>
            <p className="text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted leading-none font-medium">
              Student Finance Suite
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-charcoal-light dark:text-charcoal-darkMuted/70">
          Core Management
        </div>

        {NAV_ITEMS.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold"
                  : "text-charcoal-muted dark:text-charcoal-darkMuted hover:text-charcoal dark:hover:text-charcoal-dark hover:bg-surface-light dark:hover:bg-surface-darkElevated"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-charcoal-light group-hover:text-charcoal dark:text-charcoal-darkMuted dark:group-hover:text-charcoal-dark"
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
              )}
            </Link>
          );
        })}

        <div className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-charcoal-light dark:text-charcoal-darkMuted/70">
          Growth & Tools
        </div>

        {NAV_ITEMS.slice(4).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold"
                  : "text-charcoal-muted dark:text-charcoal-darkMuted hover:text-charcoal dark:hover:text-charcoal-dark hover:bg-surface-light dark:hover:bg-surface-darkElevated"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-charcoal-light group-hover:text-charcoal dark:text-charcoal-darkMuted dark:group-hover:text-charcoal-dark"
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Attribution */}
      <div className="p-3 border-t border-surface-border dark:border-surface-darkBorder space-y-3">
        {/* User Card */}
        <div className="p-2.5 rounded-xl bg-surface-light dark:bg-surface-darkElevated flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-brand-600 dark:bg-brand-500 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {profile.displayName.slice(0, 2)}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-charcoal dark:text-charcoal-dark truncate">
                {profile.displayName}
              </div>
              <div className="text-[10px] text-charcoal-muted dark:text-charcoal-darkMuted truncate">
                {profile.institutionName ||
                  profile.university ||
                  (profile.educationLevel === "school"
                    ? "School student"
                    : profile.educationLevel === "university"
                      ? "University student"
                      : "Student profile")}
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-charcoal-muted transition-colors hover:bg-surface-light hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-charcoal-darkMuted dark:hover:bg-surface-darkElevated dark:hover:text-charcoal-dark"
        >
          <LogOut className="h-4 w-4" />
          <span>Switch account</span>
        </button>

        {/* Status Badge */}
        <div className="px-2 pt-1 text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted text-center flex flex-col gap-0.5">
          <div className="font-semibold text-charcoal/80 dark:text-charcoal-dark/80">
            SaveWise LK
          </div>
          <span className="text-[10px] opacity-75">Sri Lanka Student Edition</span>
        </div>
      </div>
    </aside>
  );
}
