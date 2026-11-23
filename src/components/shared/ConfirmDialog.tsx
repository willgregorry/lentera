"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "primary" | "danger";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  tone = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) {
        onCancel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, loading, onCancel]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="animate-dialog-backdrop fixed inset-0 bg-sidebar/45 backdrop-blur-[2px]"
        onClick={() => {
          if (!loading) onCancel();
        }}
      />

      <div className="animate-dialog-panel relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-[0_20px_50px_rgba(19,35,58,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <h3
            id="confirm-dialog-title"
            className="font-display text-base font-bold text-ink sm:text-lg"
          >
            {title}
          </h3>
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            aria-label="Tutup dialog"
            className="rounded-lg p-1 text-ink-muted hover:bg-canvas-subtle hover:text-ink disabled:opacity-50 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-canvas-subtle disabled:opacity-50 sm:text-sm cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void onConfirm()}
            className={`rounded-xl px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 sm:text-sm cursor-pointer ${
              tone === "danger"
                ? "bg-danger hover:opacity-90"
                : "bg-primary hover:bg-primary-hover"
            }`}
          >
            {loading ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
