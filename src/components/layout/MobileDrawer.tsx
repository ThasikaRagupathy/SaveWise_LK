"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Sparkles, ShieldCheck } from "lucide-react";
import { NAV_ITEMS } from "./AppSidebar";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAppStore } from "@/store/appStore";
import { APP_METADATA } from "@/lib/constants";

export function MobileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { profile } = useAppStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 dark:bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Body */}
      <div className="relative w-72 max-w-[85vw] bg-white dark:bg-surface-darkCard h-full flex flex-col shadow-2xl z-10 border-r border-surface-border dark:border-surface-darkBorder animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-surface-border dark:border-surface-darkBorder flex items-center justify-between">
          <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 dark:bg-brand-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </div>
            <span className="font-extrabold text-base text-charcoal dark:text-charcoal-dark">
              SaveWise LK
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal dark:text-charcoal-darkMuted dark:hover:text-charcoal-dark hover:bg-surface-light dark:hover:bg-surface-darkElevated"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold"
                    : "text-charcoal-muted dark:text-charcoal-darkMuted hover:text-charcoal dark:hover:text-charcoal-dark hover:bg-surface-light dark:hover:bg-surface-darkElevated"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-brand-600 dark:text-brand-400" : "text-charcoal-light"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-border dark:border-surface-darkBorder space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                {profile.displayName.slice(0, 2)}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-charcoal dark:text-charcoal-dark truncate">
                  {profile.displayName}
                </div>
                <div className="text-[10px] text-charcoal-muted dark:text-charcoal-darkMuted">
                  {profile.currency} Account
                </div>
              </div>
            </div>
            <ThemeToggle showLabel />
          </div>

          <div className="pt-2 border-t border-surface-border/60 dark:border-surface-darkBorder/60 text-center text-[10px] text-charcoal-muted dark:text-charcoal-darkMuted flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Owned by {APP_METADATA.owner}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
