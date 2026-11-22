"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
    <div className="flex min-h-screen flex-col bg-[#F7F8F9] text-[#1F2937]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E5E5E5] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#355E42]">
              Rekrutmen & Pencocokan Caregiver
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-[#1F2937] sm:text-3xl">
              Loker Pendamping Lansia Terverifikasi
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#4B5563]">
              Pasang kebutuhan perawatan lansia dan lihat skor kecocokan pelamar
              dari AI Caregiver Matcher.
            </p>
          </div>

          {canPostJob && (
            <button
              type="button"
              onClick={() => setShowPostForm((prev) => !prev)}
              className="inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-xl bg-[#C26D10] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A65B0B] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{showPostForm ? "Tutup Form" : "Pasang Lowongan"}</span>
            </button>
          )}
        </div>

        {feedback && (
          <div className="mt-5 rounded-r-xl border-l-4 border-[#4A7C59] bg-[#EDF4EF] px-4 py-3 text-sm font-semibold text-[#2E5239]">
            {feedback}
          </div>
        )}

        {canPostJob && showPostForm && (
          <PostJobForm
            onSubmit={createJob}
            onCancel={() => setShowPostForm(false)}
          />
        )}

        <div className="mt-7 space-y-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              user={user}
              matchingId={matchingId}
              onApply={applyToJob}
              onRunAiMatch={runAiMatch}
              onDecide={decideApplication}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
