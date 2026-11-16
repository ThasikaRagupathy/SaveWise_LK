"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "relative w-full rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-2xl z-10 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200",
          maxWidthClasses[maxWidth]
        )}
      >
        <div className="flex items-start justify-between p-5 pb-3 border-b border-surface-border/60 dark:border-surface-darkBorder/60">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-charcoal dark:text-charcoal-dark">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-charcoal-muted dark:text-charcoal-darkMuted mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-muted hover:text-charcoal dark:text-charcoal-darkMuted dark:hover:text-charcoal-dark hover:bg-surface-border/50 dark:hover:bg-surface-darkBorder transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[80dvh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
