"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PostJobForm } from "@/components/loker/PostJobForm";
import { JobCard } from "@/components/loker/JobCard";
import { useLokerData } from "@/hooks/useLokerData";

export default function LokerPage() {
  const {
    jobs,
    user,
    matchingId,
    feedback,
    createJob,
    applyToJob,
    runAiMatch,
    decideApplication,
  } = useLokerData();
  const [showPostForm, setShowPostForm] = useState(false);

  const canPostJob = user?.role !== "caregiver";

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 border-b border-[#E5E5E5] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold text-[#355E42] sm:text-sm">
            Rekrutmen & Pencocokan Caregiver
          </p>
          <h1 className="mt-1 font-display text-xl font-bold text-[#1F2937] sm:text-3xl">
            Loker Pendamping Lansia Terverifikasi
          </h1>
          <p className="mt-1.5 max-w-2xl text-xs text-[#4B5563] sm:text-sm">
            Pasang kebutuhan perawatan lansia dan lihat skor kecocokan pelamar
            dari AI Caregiver Matcher.
          </p>
        </div>

        {canPostJob && (
          <button
            type="button"
            onClick={() => setShowPostForm((prev) => !prev)}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl bg-[#C26D10] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#A65B0B] sm:text-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{showPostForm ? "Tutup Form" : "Pasang Lowongan"}</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="mt-5 rounded-r-xl border-l-4 border-[#4A7C59] bg-[#EDF4EF] px-4 py-3 text-xs font-semibold text-[#2E5239] sm:text-sm">
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
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-[#FFFFFF] px-6 py-12 text-center">
            <p className="text-sm font-semibold text-[#1F2937]">
              Belum ada lowongan aktif
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
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
