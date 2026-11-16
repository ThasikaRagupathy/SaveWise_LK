"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { MonthlyPlanner } from "@/components/dashboard/MonthlyPlanner";

export default function DashboardPage() {
  return (
    <PageContainer className="max-w-7xl space-y-6 py-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-charcoal dark:text-charcoal-dark sm:text-3xl">
          Plan your month
        </h1>
        <p className="text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
          Keep track of spending, bills, goals, and reminders in one place.
        </p>
      </header>

      <MonthlyPlanner />
    </PageContainer>
  );
}
