"use client";

import React from "react";
import { BadgeCheck, RefreshCw, UserCheck } from "lucide-react";
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
    <div className="flex flex-col justify-between rounded-2xl border border-card-blue-border bg-card-blue/50 p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-base font-bold text-ink">
                {app.caregiver_name}
              </p>
              {app.verified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Terverifikasi
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-ink-muted">
              {app.caregiver_city} • Pengalaman {app.experience_years} tahun
            </p>
          </div>

          {typeof app.ai_match_score === "number" && (
            <div className="shrink-0 rounded-xl border border-card-sage-border bg-surface px-3 py-1.5 text-right">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                AI Match
              </span>
              <span className="font-mono-vital text-xl font-bold text-secondary">
                {app.ai_match_score}%
              </span>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {app.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-medium text-ink"
            >
              {skill}
            </span>
          ))}
        </div>

        <p className="mt-2.5 text-xs leading-relaxed text-ink-muted">
          &ldquo;{app.cover_note}&rdquo;
        </p>

        {app.ai_match_reason && (
          <div className="mt-3 rounded-xl border border-card-cream-border bg-card-cream px-3 py-2.5 text-xs leading-relaxed text-ink">
            <span className="font-bold text-primary">Analisis AI:</span>{" "}
            {app.ai_match_reason}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-card-blue-border pt-3">
        <button
          type="button"
          onClick={() => onRunAiMatch(job, app)}
          disabled={matching}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-primary cursor-pointer"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 text-primary ${matching ? "animate-spin" : ""}`}
          />
          <span>{matching ? "Menilai..." : "Hitung Ulang AI Match"}</span>
        </button>

        {app.status === "accepted" ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary">
            <UserCheck className="h-3.5 w-3.5" />
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
            className="rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover cursor-pointer"
          >
            Rekrut Caregiver
          </button>
        )}
      </div>
    </div>
  );
}
