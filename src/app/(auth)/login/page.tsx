"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserCheck } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/appStore";
import { APP_METADATA } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandMark } from "@/components/brand/BrandMark";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAppStore();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn({ displayName, email })) {
      setError("Enter your name and email to continue.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-surface-light dark:bg-surface-dark px-4 py-8">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrandMark className="w-8 h-8 shrink-0" />
          <span className="font-extrabold text-base text-charcoal dark:text-charcoal-dark">
            SaveWise LK
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            Register
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto space-y-4">
        <Card className="shadow-card">
          <CardHeader
            title="Sign in"
            subtitle="Use your name and email to open your saved profile"
          />

          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              label="Student Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
              required
            />

            <Input
              label="Student Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <div className="p-3 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/50 dark:border-brand-800/50 text-[11px] text-brand-900 dark:text-brand-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Local Profile</span>
              </div>
              <p>
                Your profile and records are saved in this browser. Profiles are not password protected.
              </p>
            </div>

            {error && (
              <p role="alert" className="text-xs font-medium text-danger">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" className="w-full">
              <UserCheck className="w-4 h-4" />
              <span>Continue</span>
            </Button>
          </form>

        </Card>

        <div className="text-center text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted">
          <span>SaveWise LK • Sri Lanka Student Edition</span>
        </div>
      </div>

      <div />
    </div>
  );
}
