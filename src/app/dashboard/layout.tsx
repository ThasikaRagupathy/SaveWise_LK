"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { useAppStore } from "@/store/appStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { hasHydrated, isLoggedIn } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && hasHydrated && !isLoggedIn) {
      router.replace("/login");
    }
  }, [mounted, hasHydrated, isLoggedIn, router]);

  // Hydration protection to prevent SSR/localStorage mismatches
  if (!mounted || !hasHydrated || !isLoggedIn) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-surface-light dark:bg-surface-dark">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-charcoal-muted dark:text-charcoal-darkMuted animate-pulse">
            {isLoggedIn ? "Loading SaveWise LK..." : "Returning to sign in..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-surface-light dark:bg-surface-dark">
      {/* Desktop Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenMenu={() => setMobileMenuOpen(true)} />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </div>
  );
}
