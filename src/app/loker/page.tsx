"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PostJobForm } from "@/components/loker/PostJobForm";
import { JobCard } from "@/components/loker/JobCard";
import { CaregiverInvitesSection } from "@/components/loker/CaregiverInvitesSection";
import { useLokerData } from "@/hooks/useLokerData";

export default function LokerPage() {
  const {
    jobs,
    user,
    matchingId,
    feedback,
    errorMsg,
    createJob,
    applyToJob,
    runAiMatch,
    decideApplication,
  } = useLokerData();
  const [showPostForm, setShowPostForm] = useState(false);

  const canPostJob = user?.role === "family";

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold text-secondary sm:text-sm">
            Rekrutmen & Pencocokan Caregiver
          </p>
          <h1 className="mt-1 font-display text-xl font-bold text-ink sm:text-3xl">
            Loker Pendamping Lansia Terverifikasi
          </h1>
          <p className="mt-1.5 max-w-2xl text-xs text-ink-muted sm:text-sm">
            Pasang kebutuhan perawatan lansia dan lihat skor kecocokan pelamar
            dari AI Caregiver Matcher.
          </p>
        </div>

        {canPostJob && (
          <button
            type="button"
            onClick={() => setShowPostForm((prev) => !prev)}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover sm:text-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{showPostForm ? "Tutup Form" : "Pasang Lowongan"}</span>
          </button>
        )}
      </div>

      {user?.role === "caregiver" && <CaregiverInvitesSection user={user} />}

      {errorMsg && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-danger/25 bg-red-50 px-4 py-3 text-xs font-medium text-danger sm:text-sm"
        >
          {errorMsg}
        </div>
      )}

      {feedback && (
        <div className="mt-5 rounded-2xl border border-card-sage-border bg-card-sage px-4 py-3 text-xs font-semibold text-secondary sm:text-sm">
          {feedback}
        </div>
      )}

      {canPostJob && showPostForm && (
        <PostJobForm
          onSubmit={createJob}
          onCancel={() => setShowPostForm(false)}
        />
      )}

      <div className="mt-6 space-y-6">
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
            <p className="text-sm font-semibold text-ink">
              Belum ada lowongan aktif
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              {canPostJob
                ? "Klik Pasang Lowongan untuk mulai mencari caregiver."
                : "Lowongan baru dari keluarga akan tampil otomatis di sini."}
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              user={user}
              matchingId={matchingId}
              onApply={applyToJob}
              onRunAiMatch={runAiMatch}
              onDecide={decideApplication}
            />
          ))
        )}
      </div>
    </AppShell>
  );
}
