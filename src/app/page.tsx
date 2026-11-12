"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Wallet,
  Target,
  PieChart,
  Calculator,
  Trophy,
  Sliders,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { APP_METADATA } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-charcoal dark:text-charcoal-dark selection:bg-brand-500/20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-darkCard/80 backdrop-blur-md border-b border-surface-border dark:border-surface-darkBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
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
              <p className="text-[10px] text-charcoal-muted dark:text-charcoal-darkMuted leading-none">
                Student Finance
              </p>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-charcoal-muted dark:text-charcoal-darkMuted">
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              How It Works
            </a>
            <a href="#preview" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Interactive Preview
            </a>
            <Link href="/onboarding" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Setup Wizard
            </Link>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button size="sm" variant="primary">
                <span>Open Dashboard</span>
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
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Tailored for University Students in Sri Lanka</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-charcoal dark:text-charcoal-dark tracking-tight leading-[1.15]">
              Your money. Your goals. <br />
              <span className="text-brand-600 dark:text-brand-400">Your future.</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-charcoal-muted dark:text-charcoal-darkMuted leading-relaxed">
              Navigate university life with financial clarity. Track canteen meals, boarding advances, Mahapola stipends, and freelance gigs in Sri Lankan Rupees (LKR)—without guilt or complex banking hurdles.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-md">
                  <span>Start Saving Now (Free Demo)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/onboarding" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <span>4-Step Setup Wizard</span>
                </Button>
              </Link>
            </div>

            {/* Ownership Attribution Banner */}
            <div className="pt-6 flex items-center justify-center gap-2 text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
              <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>
                Engineered with dedication by <strong className="text-charcoal dark:text-charcoal-dark">{APP_METADATA.owner}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase Section */}
      <section id="features" className="py-16 bg-white dark:bg-surface-darkCard border-y border-surface-border dark:border-surface-darkBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal dark:text-charcoal-dark">
              Purpose-Built for Sri Lankan Student Needs
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
              Every tool and calculator is crafted around real student budgeting scenarios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Wallet,
                title: "Income & Expense Tracking",
                description:
                  "Effortlessly record boarding fees, canteen meals, train passes, and family allowances in LKR with quick filters and instant recalculations.",
                link: "/dashboard/transactions",
              },
              {
                icon: PieChart,
                title: "Category Budget Planner",
                description:
                  "Set realistic limits for food, outings, and study materials. Visual progress rings gently alert you at 80% before you run dry.",
                link: "/dashboard/budgets",
              },
              {
                icon: Target,
                title: "Goal Tracker & Confetti",
                description:
                  "Accumulate funds for coding laptops, semester fees, or emergency reserves with automated weekly pace targets and celebratory milestones.",
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
                icon: Sliders,
                title: "What-If Savings Simulator",
                description:
                  "Slide weekly deposit amounts and monthly coffee cuts to forecast your semester cash reserves over 3 to 24 months.",
                link: "/dashboard/simulator",
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
                title: "Log Your Monthly Inflow",
                desc: "Enter your family allowance, Mahapola bursary, or tutoring income. Set your baseline with no pressure.",
              },
              {
                step: "02",
                title: "Track Canteen & Daily Spend",
                desc: "Record expenses in seconds from your mobile phone or laptop. Watch category budgets update immediately.",
              },
              {
                step: "03",
                title: "Reach Your Dreams",
                desc: "Allocate savings towards a target laptop or trip. Experience peace of mind throughout your semester.",
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

      {/* Interactive Dashboard Preview Banner */}
      <section id="preview" className="py-16 bg-gradient-to-b from-brand-50/50 to-white dark:from-surface-darkElevated/40 dark:to-surface-dark border-t border-surface-border dark:border-surface-darkBorder">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal dark:text-charcoal-dark">
              Ready to take charge of your student finances?
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted max-w-xl mx-auto">
              Open the interactive demo loaded with realistic sample data for university students in Colombo, Moratuwa, and across Sri Lanka.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link href="/dashboard">
              <Button size="lg" variant="primary">
                <span>Launch Full App</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary">
                <span>Demo Sign In</span>
              </Button>
            </Link>
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

          <div className="flex items-center gap-1 font-semibold text-charcoal dark:text-charcoal-dark">
            <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Owned and Created by {APP_METADATA.owner}</span>
          </div>

          <div>
            <span>© 2026 SaveWise LK. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
