"use client";

import React from "react";
import Link from "next/link";
import { CategorySummary } from "@/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { ExpensePieChart } from "@/components/charts/ExpensePieChart";
import { ArrowRight } from "lucide-react";

export interface SpendingOverviewProps {
  categories: CategorySummary[];
  totalExpenses: number;
}

export function SpendingOverview({ categories, totalExpenses }: SpendingOverviewProps) {
  return (
    <Card>
      <CardHeader
        title="Monthly Spending Breakdown"
        subtitle="Where your student rupees went this period"
        action={
          <Link
            href="/dashboard/insights"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Detailed insights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

      <ExpensePieChart data={categories} totalExpense={totalExpenses} />
    </Card>
  );
}
