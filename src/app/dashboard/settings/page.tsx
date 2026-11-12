"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { APP_METADATA } from "@/lib/constants";
import {
  User,
  Palette,
  Bell,
  Download,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  FileCode,
  FileSpreadsheet,
} from "lucide-react";

export default function SettingsPage() {
  const {
    profile,
    updateProfile,
    theme,
    setTheme,
    notificationsEnabled,
    setNotificationsEnabled,
    resetToDemoData,
    clearAllUserData,
    exportJSON,
    exportCSV,
  } = useAppStore();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [email, setEmail] = useState(profile.email || "");
  const [university, setUniversity] = useState(profile.university || APP_METADATA.universityOptions[0]);
  const [incomeEstimate, setIncomeEstimate] = useState(
    profile.monthlyIncomeEstimate ? String(profile.monthlyIncomeEstimate) : ""
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim(),
      email: email.trim() || undefined,
      university,
      monthlyIncomeEstimate: parseFloat(incomeEstimate) || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `savewise-lk-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const csvStr = exportCSV();
    const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `savewise-lk-transactions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-charcoal dark:text-charcoal-dark tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
          Customize your student profile, visual themes, data persistence, and export options
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Profile & Theme */}
        <div className="lg:col-span-7 space-y-6">
          {/* Profile Form */}
          <Card>
            <CardHeader
              title="Student Profile"
              subtitle="Personalize your university finance workspace"
            />

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="Full Name / Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />

              <Input
                label="Student Email (Demo Only)"
                type="email"
                placeholder="name@student.ac.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                hint="Used locally for demo identification. Never transmitted."
              />

              <Select
                label="University / Institute"
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
                label="Estimated Monthly Income / Allowance (LKR)"
                type="number"
                placeholder="e.g. 35000"
                prefixElement={<span className="text-xs font-bold font-mono">Rs.</span>}
                value={incomeEstimate}
                onChange={(e) => setIncomeEstimate(e.target.value)}
                hint="Helps benchmark your monthly spending rate."
              />

              <div className="flex items-center justify-between pt-2">
                {savedSuccess && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    Profile saved successfully!
                  </span>
                )}
                <div className="ml-auto">
                  <Button type="submit" variant="primary" size="sm">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Appearance & Themes */}
          <Card>
            <CardHeader
              title="Appearance & Theme"
              subtitle="Switch between crisp light mode, rich forest dark mode, or system sync"
            />

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "light", label: "Light", desc: "Warm off-white" },
                  { id: "dark", label: "Dark", desc: "Forest night" },
                  { id: "system", label: "System", desc: "OS default" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setTheme(mode.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      theme === mode.id
                        ? "border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20"
                        : "border-surface-border dark:border-surface-darkBorder hover:bg-surface-light dark:hover:bg-surface-darkElevated text-charcoal dark:text-charcoal-dark"
                    }`}
                  >
                    <div className="font-bold text-xs uppercase tracking-wider">{mode.label}</div>
                    <div className="text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted mt-0.5">
                      {mode.desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Currency Display Note */}
              <div className="pt-3 border-t border-surface-border/50 dark:border-surface-darkBorder/50 flex items-center justify-between text-xs">
                <span className="text-charcoal-muted dark:text-charcoal-darkMuted">
                  Display Currency:
                </span>
                <span className="font-bold text-charcoal dark:text-charcoal-dark font-mono">
                  Sri Lankan Rupee (LKR / Rs.)
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (5 cols): Data Management & Prototype Ownership */}
        <div className="lg:col-span-5 space-y-6">
          {/* Data Export & Backup */}
          <Card>
            <CardHeader
              title="Data Portability & Backup"
              subtitle="Export all your local records anytime"
            />

            <div className="space-y-3">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start gap-2.5"
                onClick={handleDownloadCSV}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export Transactions (CSV)</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start gap-2.5"
                onClick={handleDownloadJSON}
              >
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>Export Full Backup (JSON)</span>
              </Button>
            </div>
          </Card>

          {/* Data Reset & Danger Zone */}
          <Card className="border-rose-200 dark:border-rose-900/50">
            <CardHeader
              title="Demo Data & Danger Zone"
              subtitle="Reset or start with a blank slate"
            />

            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2.5"
                onClick={() => setIsResetConfirmOpen(true)}
              >
                <RotateCcw className="w-4 h-4 text-brand-600" />
                <span>Reset to Sample Student Demo Data</span>
              </Button>

              <Button
                variant="danger"
                size="sm"
                className="w-full justify-start gap-2.5"
                onClick={() => setIsClearConfirmOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All My Data (Start Fresh)</span>
              </Button>
            </div>
          </Card>

          {/* Project Ownership & Attribution */}
          <Card className="bg-brand-50/50 dark:bg-brand-950/20 border-brand-200/60 dark:border-brand-800/60">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-brand-600 dark:bg-brand-500 text-white shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-sm text-brand-950 dark:text-brand-100">
                  Project Ownership
                </h4>
                <p className="text-charcoal/80 dark:text-charcoal-darkMuted leading-relaxed">
                  <strong>SaveWise LK</strong> is designed and developed with ownership by{" "}
                  <strong className="text-brand-700 dark:text-brand-300 font-semibold">
                    {APP_METADATA.owner}
                  </strong>
                  .
                </p>
                <p className="text-[11px] text-charcoal-muted dark:text-charcoal-darkMuted pt-1 border-t border-brand-200/40 dark:border-brand-800/40">
                  Prototype Version {APP_METADATA.version}. Client-side storage is active locally on this browser session.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => resetToDemoData()}
        title="Reset to Sample Demo Data?"
        message="This will reload the initial Sri Lankan student sample data (allowance, canteen expenses, dev laptop goal, Keells groceries, etc.). Any custom transactions you added will be replaced."
        confirmText="Reset to Demo"
        isDestructive={false}
      />

      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={() => clearAllUserData()}
        title="Clear All Financial Records?"
        message="This will permanently delete all transactions, category budgets, and savings goals on this browser. You can start completely blank."
        confirmText="Clear All Data"
        isDestructive={true}
      />
    </PageContainer>
  );
}
