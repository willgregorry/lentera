"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Plus,
  UserCheck,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PostJobForm } from "@/components/loker/PostJobForm";
import { JobCard } from "@/components/loker/JobCard";
import { useLokerData } from "@/hooks/useLokerData";

type FilterStatus = "all" | "open" | "filled";

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
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const canPostJob = user?.role === "family";

  const openCount = jobs.filter((j) => j.status === "open").length;
  const filledCount = jobs.filter((j) => j.status === "filled").length;
  const totalApplicants = jobs.reduce(
    (sum, j) => sum + (j.applications?.length || 0),
    0
  );

  const visibleJobs = jobs.filter((j) => {
    if (filterStatus === "all") return true;
    return j.status === filterStatus;
  });

  return (
    <AppShell>
      {/* Header Row */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-secondary">
            Rekrutmen & Pencocokan Caregiver
          </p>
          <h1 className="mt-1 font-display text-xl font-bold tracking-[-0.02em] text-ink sm:text-2xl">
            Loker Pendamping Lansia Terverifikasi
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-ink-muted sm:text-sm">
            {canPostJob
              ? "Pasang kebutuhan perawatan lansia dan temukan pelamar paling sesuai dengan bantuan AI Caregiver Matcher."
              : "Temukan keluarga yang membutuhkan pendampingan lansia dan kirim lamaran Anda langsung."}
          </p>
        </div>

        {canPostJob && (
          <button
            type="button"
            onClick={() => setShowPostForm((prev) => !prev)}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover sm:text-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{showPostForm ? "Tutup Form" : "Pasang Lowongan"}</span>
          </button>
        )}
      </div>

      {/* 3 KPI Summary Cards (Subtle Cream / Blue / Sage accents) */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-card-cream-border bg-card-cream/70 p-4">
          <div>
            <p className="text-xs font-medium text-ink-muted">Lowongan aktif</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-ink">
              {openCount}
            </p>
            <p className="mt-0.5 text-[11px] text-ink-muted">
              Siap menerima pelamar
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-primary shadow-xs">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-card-blue-border bg-card-blue/80 p-4">
          <div>
            <p className="text-xs font-medium text-ink-muted">Pelamar masuk</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-ink">
              {totalApplicants}
            </p>
            <p className="mt-0.5 text-[11px] text-ink-muted">
              Kandidat untuk ditinjau
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-sidebar shadow-xs">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-card-sage-border bg-card-sage/80 p-4">
          <div>
            <p className="text-xs font-medium text-ink-muted">Sudah terisi</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-ink">
              {filledCount}
            </p>
            <p className="mt-0.5 text-[11px] text-ink-muted">
              Perawat telah ditugaskan
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-secondary shadow-xs">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {(
          [
            { key: "all", label: "Semua lowongan", count: jobs.length },
            { key: "open", label: "Aktif", count: openCount },
            { key: "filled", label: "Terisi", count: filledCount },
          ] as const
        ).map((tab) => {
          const active = filterStatus === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterStatus(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                active
                  ? "border border-card-cream-border bg-card-cream text-primary"
                  : "border border-border bg-surface text-ink-muted hover:text-ink"
              }`}
            >
              <span>{tab.label}</span>
              <span className="tabular-nums opacity-75">{tab.count}</span>
            </button>
          );
        })}
      </div>

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

      {/* Main Content Area: Empty State + 3-Step Guide OR Job List */}
      <div className="mt-5">
        {visibleJobs.length === 0 ? (
          <div className="grid gap-5 lg:grid-cols-12">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface px-6 py-12 text-center lg:col-span-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-card-cream-border bg-card-cream text-primary">
                <Briefcase className="h-6 w-6" />
              </div>
              <p className="mt-4 font-display text-base font-bold text-ink">
                {jobs.length === 0
                  ? "Belum ada lowongan aktif"
                  : "Tidak ada lowongan pada filter ini"}
              </p>
              <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-ink-muted">
                {canPostJob
                  ? "Klik Pasang Lowongan untuk mulai mencari pendamping lansia. Ceritakan kebutuhan keluarga agar AI dapat membantu mencocokkan."
                  : "Lowongan baru dari keluarga akan tampil otomatis di sini saat tersedia."}
              </p>

              {canPostJob && (
                <div className="mt-5 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPostForm(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Pasang Lowongan</span>
                  </button>
                  <Link
                    href="/caregivers"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted transition-colors hover:text-primary"
                  >
                    <span>Atau jelajahi perawat terlebih dahulu</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            <aside className="rounded-2xl border border-card-blue-border bg-card-blue p-5 lg:col-span-4">
              <h2 className="font-display text-sm font-bold text-ink">
                Mudah, dalam 3 langkah
              </h2>
              <ol className="mt-4 space-y-4">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-sidebar shadow-xs">
                    1
                  </span>
                  <div>
                    <p className="text-xs font-bold text-ink">
                      {canPostJob
                        ? "Ceritakan kebutuhan Anda"
                        : "Pilih lowongan sesuai keahlian"}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">
                      {canPostJob
                        ? "Isi kondisi lansia, lokasi rumah, jadwal kerja, dan keahlian yang dibutuhkan."
                        : "Lihat detail lokasi, jadwal, serta kebutuhan perawatan lansia dari keluarga."}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-sidebar shadow-xs">
                    2
                  </span>
                  <div>
                    <p className="text-xs font-bold text-ink">
                      {canPostJob
                        ? "Temukan yang paling sesuai"
                        : "Kirim lamaran & profil Anda"}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">
                      {canPostJob
                        ? "AI Caregiver Matcher membantu menilai kecocokan pengalaman setiap pelamar."
                        : "Sertakan catatan pengalaman mendampingi lansia agar keluarga lebih yakin."}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-sidebar shadow-xs">
                    3
                  </span>
                  <div>
                    <p className="text-xs font-bold text-ink">
                      {canPostJob
                        ? "Mulai pemantauan harian"
                        : "Aktifkan ruang pencatatan"}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">
                      {canPostJob
                        ? "Setelah memilih perawat, menu Kondisi Orang Tua dan Laporan Masuk langsung terbuka."
                        : "Begitu diterima, fitur catatan tanda vital harian dan tombol SOS siap digunakan."}
                    </p>
                  </div>
                </li>
              </ol>
            </aside>
          </div>
        ) : (
          <div className="space-y-5">
            {visibleJobs.map((job) => (
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
        )}
      </div>

      {/* Bottom Sage Reassurance Strip */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-card-sage-border bg-card-sage px-4 py-3.5">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
        <p className="text-xs leading-relaxed text-ink">
          <span className="font-bold">
            Ketenangan keluarga adalah prioritas kami.
          </span>{" "}
          <span className="text-ink-muted">
            Semua data profil pendamping dan catatan perawatan tersimpan aman di
            ruang privat keluarga Anda.
          </span>
        </p>
      </div>
    </AppShell>
  );
}
