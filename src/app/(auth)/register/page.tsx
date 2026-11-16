"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/appStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandMark } from "@/components/brand/BrandMark";

export default function RegisterPage() {
  const router = useRouter();
  const { signIn } = useAppStore();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Please provide a display name.");
      return;
    }

    if (!signIn({ displayName, email })) {
      setError("Please provide your name and email to create a profile.");
      return;
    }

    router.push("/onboarding");
  };

  return (
    <div className="min-h-dvh flex flex-col bg-surface-light dark:bg-surface-dark px-4 py-8">
      {/* Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrandMark className="w-8 h-8 shrink-0" />
          <span className="font-extrabold text-base text-charcoal dark:text-charcoal-dark">
            SaveWise_LK
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            Log in
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <main className="w-full max-w-md mx-auto flex flex-1 items-center py-10">
        <Card className="w-full">
          <CardHeader
            title="Create your account"
            subtitle="Start a local profile. Your data stays in this browser."
          />

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Student Name"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
              required
            />

            <Input
              label="Email address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            {error && <p className="text-xs text-danger font-medium">{error}</p>}

            <Button type="submit" variant="primary" className="w-full">
              <span>Continue to setup</span>
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
