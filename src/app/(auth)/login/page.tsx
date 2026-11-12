"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/appStore";
import { APP_METADATA } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const { profile, updateProfile } = useAppStore();

  const [email, setEmail] = useState("thasika.ragupathy@student.ac.lk");
  const [displayName, setDisplayName] = useState(profile.displayName || "Nila Ragupathy");

  const handleDemoSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      email,
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-surface-light dark:bg-surface-dark px-4 py-8">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-emerald-200" />
          </div>
          <span className="font-extrabold text-base text-charcoal dark:text-charcoal-dark">
            SaveWise LK
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto space-y-4">
        <Card className="shadow-card">
          <CardHeader
            title="Prototype Sign In"
            subtitle="Enter a demo student session to explore all features"
          />

          <form onSubmit={handleDemoSignIn} className="space-y-4">
            <Input
              label="Student Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            <Input
              label="Student Email (Demo)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="p-3 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/50 dark:border-brand-800/50 text-[11px] text-brand-900 dark:text-brand-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Zero Password Session</span>
              </div>
              <p>
                SaveWise LK runs as a self-contained client-side prototype. No password is required or stored.
              </p>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              <UserCheck className="w-4 h-4" />
              <span>Continue to Dashboard</span>
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-surface-border/60 dark:border-surface-darkBorder/60 flex items-center justify-between text-xs">
            <Link href="/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              New student? Register profile
            </Link>
            <Link href="/onboarding" className="text-charcoal-muted dark:text-charcoal-darkMuted hover:underline">
              Run Onboarding
            </Link>
          </div>
        </Card>

        {/* Ownership */}
        <div className="text-center text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          <span>SaveWise LK • Owned by {APP_METADATA.owner}</span>
        </div>
      </div>

      <div />
    </div>
  );
}
