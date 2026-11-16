"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Receipt,
  PieChart,
  Target,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Planner", icon: CalendarDays },
    { href: "/dashboard/transactions", label: "Entries", icon: Receipt },
    { href: "/dashboard/budgets", label: "Budgets", icon: PieChart },
    { href: "/dashboard/goals", label: "Goals", icon: Target },
  ];

  return (
    <div className="safe-bottom fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-surface-border bg-white/95 px-3 py-1.5 backdrop-blur-md dark:border-surface-darkBorder dark:bg-surface-darkCard/95 lg:hidden">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors",
              isActive
                ? "text-brand-600 dark:text-brand-400 font-bold"
                : "text-charcoal-muted dark:text-charcoal-darkMuted hover:text-charcoal dark:hover:text-charcoal-dark"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{link.label}</span>
          </Link>
        );
      })}

      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-charcoal-muted dark:text-charcoal-darkMuted hover:text-charcoal dark:hover:text-charcoal-dark transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
        <span className="text-[10px]">More</span>
      </button>
    </div>
  );
}
