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
    <article className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-[#E5E5E5] pb-5 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-[#B8640B]">
              {job.family_name}
            </span>
            <span className="text-[#E5E5E5]">•</span>
            <span
              className={`font-semibold ${
                job.status === "open" ? "text-[#4A7C59]" : "text-[#6B7280]"
              }`}
            >
              {job.status === "open" ? "Lowongan Dibuka" : "Sudah Terisi"}
            </span>
          </div>

          <h2 className="mt-2 font-display text-xl font-bold text-[#1F2937]">
            {job.title}
          </h2>

          <div className="mt-2.5 flex flex-wrap gap-5 text-xs text-[#6B7280]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#B8640B]" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#4A7C59]" />
              {job.schedule}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#1F2937]">
              <Wallet className="h-3.5 w-3.5 text-[#B8640B]" />
              {job.salary_display}
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
            <span className="font-semibold text-[#1F2937]">
              Kondisi {job.elderly_name}:
            </span>{" "}
            {job.medical_notes}
          </p>

          <p className="mt-2.5 text-xs font-medium text-[#1F2937]">
            Keahlian: {job.required_skills.join(" · ")}
          </p>
        </div>

        {job.status === "open" && (
          <button
            type="button"
            onClick={() => setApplying((p) => !p)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-4 py-2.5 text-xs font-semibold text-[#1F2937] hover:border-[#4A7C59] hover:text-[#4A7C59] transition-colors cursor-pointer"
          >
            <Briefcase className="h-4 w-4" />
            <span>Lamar Sebagai Caregiver</span>
          </button>
        )}
      </div>

      {applying && (
        <div className="mt-4 rounded-xl border border-[#CFE0D4] bg-[#EDF4EF] p-4">
          <p className="text-xs font-semibold text-[#355E42]">
            Kirim Lamaran sebagai {user?.name || "Rini Wulandari, A.Md.Kep"}
          </p>
          <textarea
            rows={2}
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-3 py-2 text-xs text-[#1F2937] focus:outline-none"
          />
          <div className="mt-2.5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setApplying(false)}
              className="px-3 py-1.5 text-xs font-medium text-[#6B7280] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApplySubmit}
              className="rounded-xl bg-[#4A7C59] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#3B6448] cursor-pointer"
            >
              Kirim Lamaran
            </button>
          </div>
        </div>
      )}

      <div className="mt-5">
        <h3 className="font-display text-sm font-bold text-[#1F2937]">
          Daftar Pelamar & Skor AI Caregiver Matcher (
          {job.applications?.length || 0})
        </h3>

        {!job.applications || job.applications.length === 0 ? (
          <p className="mt-2 text-xs text-[#6B7280]">
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
    </article>
  );
}
