"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { ThemeMode } from "@/types";

export function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { theme, setTheme } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-surface-light dark:bg-surface-darkElevated border border-surface-border dark:border-surface-darkBorder animate-pulse" />
    );
  }

  const cycleTheme = () => {
    const next: Record<ThemeMode, ThemeMode> = {
      light: "dark",
      dark: "system",
      system: "light",
    };
    setTheme(next[theme]);
  };

  const getIcon = () => {
    if (theme === "dark") return <Moon className="w-4 h-4 text-emerald-400" />;
    if (theme === "light") return <Sun className="w-4 h-4 text-amber-500" />;
    return <Monitor className="w-4 h-4 text-brand-500" />;
  };

  const getLabel = () => {
    if (theme === "dark") return "Dark Theme";
    if (theme === "light") return "Light Theme";
    return "System Theme";
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-2 p-2 rounded-xl text-charcoal-muted hover:text-charcoal dark:text-charcoal-darkMuted dark:hover:text-charcoal-dark bg-surface-light hover:bg-surface-border/50 dark:bg-surface-darkElevated dark:hover:bg-surface-darkBorder border border-surface-border dark:border-surface-darkBorder transition-all duration-200 active:scale-95"
      title={`Theme: ${getLabel()} (Click to toggle)`}
      aria-label={`Toggle theme: current ${getLabel()}`}
    >
      {getIcon()}
      {showLabel && <span className="text-xs font-semibold capitalize">{theme}</span>}
    </button>
  );
}
