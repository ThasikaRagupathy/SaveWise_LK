"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Trophy,
  BarChart3,
  Calculator,
  Sliders,
  Settings,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { APP_METADATA } from "@/lib/constants";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
  { href: "/dashboard/budgets", label: "Budget Planner", icon: PieChart },
  { href: "/dashboard/goals", label: "Savings Goals", icon: Target },
  { href: "/dashboard/challenges", label: "Challenges & Streaks", icon: Trophy },
  { href: "/dashboard/insights", label: "Insights & Analytics", icon: BarChart3 },
  { href: "/dashboard/purchase-assistant", label: "Purchase Assistant", icon: Calculator },
  { href: "/dashboard/simulator", label: "Savings Simulator", icon: Sliders },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { profile } = useAppStore();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-surface-darkCard border-r border-surface-border dark:border-surface-darkBorder h-screen sticky top-0 z-30">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-surface-border/80 dark:border-surface-darkBorder/80">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-brand-600 dark:bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-emerald-200" />
          </div>
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
                {profile.university || "University Student"}
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Ownership Badge */}
        <div className="px-2 pt-1 text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted text-center flex flex-col gap-0.5">
          <div className="flex items-center justify-center gap-1 font-semibold text-charcoal/80 dark:text-charcoal-dark/80">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Owned by {APP_METADATA.owner}</span>
          </div>
          <span className="text-[10px] opacity-75">Sri Lanka Student Edition</span>
        </div>
      </div>
    </aside>
  );
}
