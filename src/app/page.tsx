"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Wallet,
  Target,
  PieChart,
  Calculator,
  Trophy,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/brand/BrandMark";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-surface-light dark:bg-surface-dark text-charcoal dark:text-charcoal-dark selection:bg-brand-500/20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-darkCard/80 backdrop-blur-md border-b border-surface-border dark:border-surface-darkBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
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
              <p className="text-[10px] text-charcoal-muted dark:text-charcoal-darkMuted leading-none">
                Student Finance
              </p>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-charcoal-muted dark:text-charcoal-darkMuted">
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Features
            </a>
          </nav>

          {/* Account Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Link
              href="/login"
              className="text-sm font-semibold text-charcoal-muted transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-charcoal-darkMuted dark:hover:text-brand-400"
            >
              Log in
            </Link>
            <Link href="/register">
              <Button size="sm" variant="primary">
                <span>Register</span>
              </Button>
            </Link>
            <Link href="/dashboard" className="hidden sm:block">
              <Button
                size="sm"
                variant="outline"
                aria-label="Open dashboard"
                title="Open dashboard"
              >
                <span className="hidden md:inline">Open Planner</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>For school and university students in Sri Lanka</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-charcoal dark:text-charcoal-dark tracking-tight leading-[1.15]">
              Your money. Your goals. <br />
              <span className="text-brand-600 dark:text-brand-400">Your future.</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-charcoal-muted dark:text-charcoal-darkMuted leading-relaxed">
              Manage pocket money, school supplies, and savings goals in Sri Lankan Rupees. No budgeting experience needed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-md">
                  <span>Create Your Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <span>How It Works</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase Section */}
      <section id="features" className="py-16 bg-white dark:bg-surface-darkCard border-y border-surface-border dark:border-surface-darkBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal dark:text-charcoal-dark">
              Made for Student Life
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
              Plan everyday spending, income, and savings at school, university, or beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Wallet,
                title: "Income & Expense Tracking",
                description:
                  "Record pocket money, allowances, school supplies, snacks, and transport in LKR.",
                link: "/dashboard/transactions",
              },
              {
                icon: PieChart,
                title: "Category Budget Planner",
                description:
                  "Set simple spending limits for food, transport, supplies, or activities. Get a heads-up when you are close to a limit.",
                link: "/dashboard/budgets",
              },
              {
                icon: Target,
                title: "Goal Tracker & Confetti",
                description:
                  "Save toward books, supplies, a device, a trip, or an emergency fund at your own pace.",
                link: "/dashboard/goals",
              },
              {
                icon: Calculator,
                title: "Purchase Impact Assistant",
                description:
                  "Calculate the true opportunity cost before buying sneakers or gear. See how many weeks it delays your primary savings goal.",
                link: "/dashboard/purchase-assistant",
              },
              {
                icon: Trophy,
                title: "Micro-Habit Challenges",
                description:
                  "Build financial muscle with 7-day micro-savers and zero-takeaway weekends. No penalty streaks, just positive encouragement.",
                link: "/dashboard/challenges",
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Link
                  key={idx}
                  href={feat.link}
                  className="p-6 rounded-2xl bg-surface-light dark:bg-surface-darkElevated border border-surface-border dark:border-surface-darkBorder hover:border-brand-500/40 dark:hover:border-brand-500/40 hover:shadow-card transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-charcoal dark:text-charcoal-dark mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted leading-relaxed">
                    {feat.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal dark:text-charcoal-dark">
              How SaveWise LK Works in 3 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
              No real bank logins required. Local browser persistence keeps your data private.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Track Your Income",
                desc: "Record pocket money, family support, work, scholarships, or other money you receive.",
              },
              {
                step: "02",
                title: "Track Everyday Spending",
                desc: "Record costs like supplies, snacks, transport, and activities. Budgets update as you go.",
              },
              {
                step: "03",
                title: "Save for a Goal",
                desc: "Set aside money toward a device, education, a trip, or anything else that matters to you.",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder relative overflow-hidden"
              >
                <span className="text-4xl font-black text-brand-500/20 dark:text-brand-500/10 absolute top-4 right-4">
                  {s.step}
                </span>
                <h3 className="text-lg font-bold text-charcoal dark:text-charcoal-dark mb-2">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-surface-border dark:border-surface-darkBorder bg-white dark:bg-surface-darkCard text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="font-bold text-charcoal dark:text-charcoal-dark">
              SaveWise LK
            </span>
            <span>• Student Savings & Budgeting Suite</span>
          </div>

          <div>
            <span>© 2026 SaveWise LK. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
