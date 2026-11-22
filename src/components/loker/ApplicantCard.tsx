"use client";

import React from "react";
import { BadgeCheck, Sparkles, UserCheck } from "lucide-react";
import { CareJob, JobApplication } from "@/types";

interface ApplicantCardProps {
  job: CareJob;
  app: JobApplication;
  matching: boolean;
  onRunAiMatch: (job: CareJob, app: JobApplication) => void;
  onDecide: (
    jobId: string,
    appId: string,
    status: "accepted" | "rejected"
  ) => void;
}

export function ApplicantCard({
  job,
  app,
  matching,
  onRunAiMatch,
  onDecide,
}: ApplicantCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-base font-bold text-ink">
                {app.caregiver_name}
              </p>
              {app.verified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary">
                  <BadgeCheck className="h-4 w-4" />
                  Terverifikasi
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-ink-muted">
              {app.caregiver_city} • Pengalaman {app.experience_years} tahun
            </p>
          </div>

          {typeof app.ai_match_score === "number" && (
            <div className="shrink-0 text-right">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                AI Match
              </span>
              <span className="font-mono-vital text-2xl font-bold text-secondary">
                {app.ai_match_score}%
              </span>
            </div>
          )}
        </div>

        <p className="mt-3 text-xs font-medium text-ink">
          {app.skills.join(" · ")}
        </p>

        <p className="mt-2.5 text-xs leading-relaxed text-ink-muted">
          &ldquo;{app.cover_note}&rdquo;
        </p>

        {app.ai_match_reason && (
          <div className="mt-3 border-l-2 border-primary pl-3 text-xs leading-relaxed text-ink">
            <span className="inline-flex items-center gap-1 font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Analisis AI:
            </span>{" "}
            {app.ai_match_reason}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <button
          type="button"
          onClick={() => onRunAiMatch(job, app)}
          disabled={matching}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-primary cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>{matching ? "Menilai..." : "Hitung Ulang AI Match"}</span>
        </button>

        {app.status === "accepted" ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary">
            <UserCheck className="h-4 w-4" />
            Direkrut
          </span>
        ) : app.status === "rejected" ? (
          <span className="text-xs font-medium text-ink-muted">
            Tidak dipilih
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onDecide(job.id, app.id, "accepted")}
            className="rounded-xl bg-[#4A7C59] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#3B6448] cursor-pointer"
          >
            Rekrut Caregiver
          </button>
        )}
      </div>
    </div>
  );
}
