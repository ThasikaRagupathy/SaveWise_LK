"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, UserPlus } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/appStore";
import { APP_METADATA } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const { updateProfile } = useAppStore();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState(APP_METADATA.universityOptions[0]);
  const [monthlyIncomeEstimate, setMonthlyIncomeEstimate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Please provide a display name.");
      return;
    }

    updateProfile({
      displayName: displayName.trim(),
      email: email.trim() || undefined,
      university,
      monthlyIncomeEstimate: parseFloat(monthlyIncomeEstimate) || 30000,
      currency: "LKR",
    });

    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-surface-light dark:bg-surface-dark px-4 py-8">
      {/* Header */}
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

      {/* Main Register Card */}
      <div className="max-w-md w-full mx-auto my-auto space-y-4">
        <Card className="shadow-card">
          <CardHeader
            title="Create Student Profile"
            subtitle="Set up your personalized financial assistant in LKR"
          />

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Student Name"
              placeholder="e.g. Kasun, Nila, Thasika"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            <Input
              label="Student Email"
              type="email"
              placeholder="student@campus.ac.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Select
              label="University / Higher Ed Institute"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            >
              {APP_METADATA.universityOptions.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </Select>

            <Input
              label="Estimated Monthly Allowance / Income (LKR)"
              type="number"
              placeholder="e.g. 35000"
              prefixElement={<span className="text-xs font-bold font-mono">Rs.</span>}
              value={monthlyIncomeEstimate}
              onChange={(e) => setMonthlyIncomeEstimate(e.target.value)}
              hint="Optional. You can leave this blank or adjust anytime in settings."
            />

            {error && <p className="text-xs text-danger font-medium">{error}</p>}

            <Button type="submit" variant="primary" className="w-full">
              <UserPlus className="w-4 h-4" />
              <span>Continue to Setup Wizard</span>
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-surface-border/60 dark:border-surface-darkBorder/60 flex items-center justify-between text-xs">
            <Link href="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Already have demo data? Sign in
            </Link>
            <Link href="/dashboard" className="text-charcoal-muted dark:text-charcoal-darkMuted hover:underline">
              Skip directly to dashboard
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
