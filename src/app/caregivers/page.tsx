"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Bell,
  Calendar,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useAssignmentStatus } from "@/hooks/useAssignmentStatus";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types";

export default function CaregiverDirectoryPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const {
    loading: checkingStatus,
    hasCaregiver,
    activeCaregiver,
  } = useAssignmentStatus();
  const [caregivers, setCaregivers] = useState<UserProfile[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [query, setQuery] = useState("");
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login?role=family");
      return;
    }
    if (hydrated && user && user.role === "caregiver") {
      router.replace("/caregiver");
    }
  }, [hydrated, user, router]);

  useEffect(() => {
    if (hasCaregiver) return;
    let active = true;
    async function loadCaregivers() {
      try {
        if (supabase) {
          const [profilesRes, filledJobsRes, acceptedAppsRes] =
            await Promise.all([
              supabase
                .from("profiles")
                .select("*")
                .eq("role", "caregiver")
                .order("created_at", { ascending: false }),
              supabase
                .from("care_jobs")
                .select("assigned_caregiver_id")
                .eq("status", "filled")
                .not("assigned_caregiver_id", "is", null),
              supabase
                .from("job_applications")
                .select("caregiver_id")
                .eq("status", "accepted"),
            ]);

          const busyIds = new Set<string>();
          for (const row of filledJobsRes.data || []) {
            if (row.assigned_caregiver_id) {
              busyIds.add(String(row.assigned_caregiver_id));
            }
          }
          for (const row of acceptedAppsRes.data || []) {
            if (row.caregiver_id) {
              busyIds.add(String(row.caregiver_id));
            }
          }

          if (active && profilesRes.data) {
            setCaregivers(
              profilesRes.data
                .filter((row) => !busyIds.has(String(row.id)))
                .map((row) => ({
                  id: row.id,
                  name: row.full_name,
                  email: row.email,
                  role: "caregiver",
                  phone: row.phone || "",
                  city: row.location || "Indonesia",
                  verified: Boolean(row.is_verified ?? true),
                  skills: Array.isArray(row.skills) ? row.skills : [],
                  experience_years: Number(row.experience_years || 0),
                  bio: row.bio || "",
                }))
            );
          }
        }
      } finally {
        if (active) setLoadingList(false);
      }
    }
    loadCaregivers();
    return () => {
      active = false;
    };
  }, [hasCaregiver]);

  if (!hydrated || !user || user.role !== "family") {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm font-medium text-ink-muted">
            Memeriksa akses halaman...
          </p>
        </div>
      </AppShell>
    );
  }

  // MODE 1: Keluarga SUDAH memiliki perawat -> tampilkan Identitas Perawat Bertugas
  if (!checkingStatus && hasCaregiver && activeCaregiver) {
    return (
      <AppShell>
        <div className="border-b border-border pb-5">
          <p className="text-xs font-semibold text-secondary sm:text-sm">
            Pendamping Aktif Keluarga Anda
          </p>
          <h1 className="mt-1 font-display text-xl font-bold text-ink sm:text-3xl">
            Perawat yang Sedang Bertugas
          </h1>
          <p className="mt-1 text-xs text-ink-muted sm:text-sm">
            Identitas lengkap perawat yang saat ini mendampingi orang tua Anda
            di rumah.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-border-subtle pb-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-soft text-secondary">
                <UserCheck className="h-7 w-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
                    {activeCaregiver.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary-soft px-2.5 py-0.5 text-xs font-semibold text-secondary">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Aktif Bertugas
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-muted sm:text-sm">
                  {activeCaregiver.job_title}
                </p>
              </div>
            </div>

            {activeCaregiver.phone && (
              <a
                href={`tel:${activeCaregiver.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas-subtle sm:text-sm"
              >
                <Phone className="h-4 w-4 text-secondary" />
                <span>Hubungi Perawat</span>
              </a>
            )}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-canvas-subtle p-4">
              <p className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <MapPin className="h-3.5 w-3.5" /> Wilayah
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {activeCaregiver.city}
              </p>
            </div>
            <div className="rounded-xl bg-canvas-subtle p-4">
              <p className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <Calendar className="h-3.5 w-3.5" /> Jadwal Tugas
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {activeCaregiver.schedule}
              </p>
            </div>
            <div className="rounded-xl bg-canvas-subtle p-4">
              <p className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <Stethoscope className="h-3.5 w-3.5" /> Pengalaman
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {activeCaregiver.experience_years > 0
                  ? `${activeCaregiver.experience_years} tahun rawat lansia`
                  : "Perawat terverifikasi"}
              </p>
            </div>
          </div>

          {activeCaregiver.skills.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-ink-muted">
                Keahlian Perawatan
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeCaregiver.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-border-subtle px-3 py-1 text-xs font-medium text-ink"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3 border-t border-border-subtle pt-5">
            <Link
              href="/dashboard"
              className="btn-diagonal-secondary inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white sm:text-sm"
            >
              <Activity className="h-4 w-4" />
              <span>Lihat Kondisi Orang Tua</span>
            </Link>
            <Link
              href="/notifikasi"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas-subtle sm:text-sm"
            >
              <Bell className="h-4 w-4" />
              <span>Buka Laporan Masuk</span>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  // MODE 2: Keluarga BELUM memiliki perawat -> tampilkan Direktori Cari Perawat
  const filtered = caregivers.filter((cg) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      cg.name.toLowerCase().includes(q) ||
      (cg.city || "").toLowerCase().includes(q) ||
      (cg.skills || []).some((s) => s.toLowerCase().includes(q))
    );
  });

  function handleInvite(id: string) {
    setInvitedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold text-secondary sm:text-sm">
            Langkah Pertama Keluarga
          </p>
          <h1 className="mt-1 font-display text-xl font-bold text-ink sm:text-3xl">
            Cari Perawat untuk Orang Tua
          </h1>
          <p className="mt-1 text-xs text-ink-muted sm:text-sm">
            Menampilkan perawat terdaftar yang sedang tersedia dan belum
            menerima pekerjaan.
          </p>
        </div>

        <Link
          href="/loker"
          className="btn-diagonal-secondary inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white sm:text-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Pasang Lowongan</span>
        </Link>
      </div>

      <div className="mt-5">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama perawat, kota, atau keahlian..."
            className="w-full rounded-xl border border-border bg-surface py-2.5 pr-4 pl-10 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6">
        {loadingList || checkingStatus ? (
          <p className="py-12 text-center text-sm text-ink-muted">
            Memuat daftar perawat tersedia...
          </p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
            <Stethoscope className="mx-auto h-8 w-8 text-ink-muted" />
            <p className="mt-3 text-sm font-semibold text-ink">
              Belum ada perawat yang tersedia saat ini
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Perawat yang baru mendaftar akan otomatis muncul di sini. Anda
              juga bisa memasang lowongan agar perawat dapat melamar langsung.
            </p>
            <Link
              href="/loker"
              className="btn-diagonal-secondary mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white"
            >
              Pasang Lowongan Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cg) => {
              const invited = invitedIds.includes(cg.id);
              return (
                <div
                  key={cg.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-display text-base font-bold text-ink">
                          {cg.name}
                        </h2>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-muted">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{cg.city || "Indonesia"}</span>
                        </p>
                      </div>
                      {cg.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary-soft px-2.5 py-0.5 text-[11px] font-semibold text-secondary">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Tersedia</span>
                        </span>
                      )}
                    </div>

                    {cg.bio && (
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                        {cg.bio}
                      </p>
                    )}

                    {cg.skills && cg.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {cg.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-border-subtle px-2 py-0.5 text-[11px] font-medium text-ink"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={invited}
                    onClick={() => handleInvite(cg.id)}
                    className={`mt-5 w-full rounded-xl py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                      invited
                        ? "bg-secondary-soft text-secondary"
                        : "bg-primary text-white hover:bg-primary-hover"
                    }`}
                  >
                    {invited ? "Undangan Terkirim" : "Undang untuk Wawancara"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
