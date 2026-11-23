"use client";

import React, { useState } from "react";
import { Briefcase, Calendar, MapPin, Wallet } from "lucide-react";
import { CareJob, JobApplication, UserProfile } from "@/types";
import { ApplicantCard } from "./ApplicantCard";

interface JobCardProps {
  job: CareJob;
  user: UserProfile | null;
  matchingId: string | null;
  onApply: (jobId: string, coverNote: string) => Promise<void>;
  onRunAiMatch: (job: CareJob, app: JobApplication) => void;
  onDecide: (
    jobId: string,
    appId: string,
    status: "accepted" | "rejected"
  ) => void;
}

export function JobCard({
  job,
  user,
  matchingId,
  onApply,
  onRunAiMatch,
  onDecide,
}: JobCardProps) {
  const [applying, setApplying] = useState(false);
  const [coverNote, setCoverNote] = useState(
    "Saya berpengalaman mendampingi lansia dengan riwayat hipertensi dan rutin mencatat tanda vital harian."
  );

  async function handleApplySubmit() {
    await onApply(job.id, coverNote);
    setApplying(false);
  }

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_4px_rgba(15,23,42,0.03)] sm:p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border-subtle pb-5 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="font-semibold text-primary">
              {job.family_name}
            </span>
            <span className="text-border">•</span>
            <span
              className={`font-semibold ${
                job.status === "open" ? "text-secondary" : "text-ink-muted"
              }`}
            >
              {job.status === "open" ? "Lowongan Dibuka" : "Sudah Terisi"}
            </span>
          </div>

          <h2 className="mt-2 font-display text-lg font-bold text-ink sm:text-xl">
            {job.title}
          </h2>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-secondary" />
              {job.schedule}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
              <Wallet className="h-3.5 w-3.5 text-primary" />
              {job.salary_display}
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink">
              Kondisi {job.elderly_name}:
            </span>{" "}
            {job.medical_notes}
          </p>

          {job.required_skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.required_skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-card-blue-border bg-card-blue px-2.5 py-1 text-[11px] font-medium text-ink"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {job.status === "open" && user?.role === "caregiver" && (
          <button
            type="button"
            onClick={() => setApplying((p) => !p)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover cursor-pointer"
          >
            <Briefcase className="h-4 w-4" />
            <span>Lamar Sebagai Perawat</span>
          </button>
        )}
      </div>

      {applying && user?.role === "caregiver" && (
        <div className="mt-4 rounded-2xl border border-card-cream-border bg-card-cream p-4">
          <p className="text-xs font-bold text-ink">
            Kirim Lamaran sebagai {user.name}
          </p>
          <textarea
            rows={2}
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none"
          />
          <div className="mt-2.5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setApplying(false)}
              className="px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApplySubmit}
              className="rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover cursor-pointer"
            >
              Kirim Lamaran
            </button>
          </div>
        </div>
      )}

      {user?.role === "family" && (
        <div className="mt-5">
          <h3 className="font-display text-sm font-bold text-ink">
            Daftar Pelamar & Skor Kecocokan AI (
            {job.applications?.length || 0})
          </h3>

          {!job.applications || job.applications.length === 0 ? (
            <p className="mt-2 text-xs text-ink-muted">
              Belum ada pelamar untuk lowongan ini.
            </p>
          ) : (
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {job.applications.map((app) => (
                <ApplicantCard
                  key={app.id}
                  job={job}
                  app={app}
                  matching={matchingId === app.id}
                  onRunAiMatch={onRunAiMatch}
                  onDecide={onDecide}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
