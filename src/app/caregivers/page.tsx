"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bell,
  Calendar,
  Check,
  MapPin,
  Phone,
  Search,
  Stethoscope,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useAssignmentStatus } from "@/hooks/useAssignmentStatus";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types";

function getInitials(name?: string): string {
  if (!name) return "P";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

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
  const [selectedCity, setSelectedCity] = useState("all");
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
        const busyIds = new Set<string>();
        const mergedMap = new Map<string, UserProfile>();

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

          for (const row of profilesRes.data || []) {
            const key = String(row.email || row.id).toLowerCase();
            mergedMap.set(key, {
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
            });
          }
        }

        const available = Array.from(mergedMap.values()).filter(
          (cg) => !busyIds.has(String(cg.id))
        );

        if (active) {
          setCaregivers(available);
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
        <div className="rounded-2xl border border-card-cream-border bg-card-cream p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sidebar text-base font-bold text-white shadow-xs">
                {getInitials(activeCaregiver.name)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-lg font-bold text-ink sm:text-xl">
                    {activeCaregiver.name}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-card-sage-border bg-card-sage px-2.5 py-0.5 text-xs font-semibold text-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
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
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover sm:text-sm"
              >
                <Phone className="h-4 w-4" />
                <span>Hubungi Perawat</span>
              </a>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-card-blue-border bg-card-blue p-4">
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Wilayah Tugas
            </p>
            <p className="mt-1.5 text-sm font-bold text-ink">
              {activeCaregiver.city}
            </p>
          </div>
          <div className="rounded-2xl border border-card-cream-border bg-card-cream p-4">
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
              <Calendar className="h-3.5 w-3.5 text-primary" /> Jadwal Tugas
            </p>
            <p className="mt-1.5 text-sm font-bold text-ink">
              {activeCaregiver.schedule}
            </p>
          </div>
          <div className="rounded-2xl border border-card-sage-border bg-card-sage p-4">
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
              <Stethoscope className="h-3.5 w-3.5 text-secondary" /> Pengalaman
            </p>
            <p className="mt-1.5 text-sm font-bold text-ink">
              {activeCaregiver.experience_years > 0
                ? `${activeCaregiver.experience_years} tahun rawat lansia`
                : "Perawat terverifikasi"}
            </p>
          </div>
        </div>

        {activeCaregiver.skills.length > 0 && (
          <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
              Keahlian Perawatan
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeCaregiver.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-card-blue-border bg-card-blue px-3 py-1.5 text-xs font-semibold text-ink"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover sm:text-sm"
          >
            <Activity className="h-4 w-4" />
            <span>Lihat Kondisi Orang Tua</span>
          </Link>
          <Link
            href="/notifikasi"
            className="inline-flex items-center gap-2 rounded-xl border border-card-blue-border bg-card-blue px-5 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-primary/40 sm:text-sm"
          >
            <Bell className="h-4 w-4 text-primary" />
            <span>Buka Laporan Masuk</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  // MODE 2: Keluarga BELUM memiliki perawat -> tampilkan Direktori Cari Perawat
  const uniqueCities = Array.from(
    new Set(caregivers.map((cg) => cg.city).filter(Boolean))
  ) as string[];

  const filtered = caregivers.filter((cg) => {
    const matchesCity =
      selectedCity === "all" || (cg.city || "") === selectedCity;
    if (!matchesCity) return false;
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
      {/* Warm Cream Editorial Hero Banner */}
      <section className="overflow-hidden rounded-2xl border border-card-cream-border bg-card-cream p-5 sm:p-6">
        <div className="grid items-center gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              Hangat, Aman, dan Terpercaya
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-ink sm:text-3xl">
              Perawatan terbaik, untuk yang tersayang.
            </h1>
            <p className="mt-2 max-w-lg text-xs leading-relaxed text-ink-muted sm:text-sm">
              Temukan pendamping lansia yang sedang tersedia dan sesuai dengan
              kebutuhan harian orang tua Anda di rumah.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-ink">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-secondary" />
                Perawat terdaftar
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-secondary" />
                Pencocokan personal AI
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-card-cream-border bg-surface shadow-xs">
              <img
                src="/images/hero_care.jpg"
                alt="Pendampingan hangat perawat bersama lansia di rumah"
                className="h-40 w-full object-cover object-center sm:h-44"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search & Action Toolbar */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama perawat, kota, atau keahlian..."
            className="min-h-[44px] w-full rounded-xl border border-border bg-card-blue/50 py-2.5 pr-4 pl-10 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:bg-surface focus:outline-none"
          />
        </div>

        <Link
          href="/loker"
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover sm:text-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Pasang Lowongan</span>
        </Link>
      </div>

      {/* Quick City Filter Pills */}
      {uniqueCities.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCity("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              selectedCity === "all"
                ? "border border-card-cream-border bg-card-cream text-primary"
                : "border border-border bg-surface text-ink-muted hover:text-ink"
            }`}
          >
            Semua Wilayah
          </button>
          {uniqueCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                selectedCity === city
                  ? "border border-card-cream-border bg-card-cream text-primary"
                  : "border border-border bg-surface text-ink-muted hover:text-ink"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {/* Results Header */}
      <div className="mt-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display text-base font-bold text-ink">
            Perawat untuk keluarga Anda
          </h2>
          <span className="rounded-full border border-card-cream-border bg-card-cream px-2.5 py-0.5 text-[11px] font-bold text-primary tabular-nums">
            {filtered.length} tersedia
          </span>
        </div>
      </div>

      {/* Caregiver Grid */}
      <div className="mt-4">
        {loadingList || checkingStatus ? (
          <div className="rounded-2xl border border-card-blue-border bg-card-blue/50 py-12 text-center text-sm text-ink-muted">
            Memuat daftar perawat tersedia...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-card-blue-border bg-card-blue/40 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-card-cream text-primary">
              <Stethoscope className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-ink">
              Belum ada perawat yang tersedia saat ini
            </p>
            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-ink-muted">
              Perawat yang baru mendaftar akan otomatis muncul di sini. Anda
              juga bisa memasang lowongan agar perawat dapat melamar langsung.
            </p>
            <Link
              href="/loker"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <span>Pasang Lowongan Sekarang</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cg, idx) => {
              const invited = invitedIds.includes(cg.id);
              const avatarTone =
                idx % 2 === 0
                  ? "bg-card-blue text-sidebar border-card-blue-border"
                  : "bg-card-cream text-primary border-card-cream-border";

              return (
                <div
                  key={cg.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_4px_rgba(15,23,42,0.03)] transition-all hover:border-card-blue-border hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      {cg.verified ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-card-sage-border bg-card-sage px-2.5 py-0.5 text-[11px] font-semibold text-secondary">
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                          <span>Tersedia</span>
                        </span>
                      ) : (
                        <span />
                      )}
                      {(cg.experience_years ?? 0) > 0 && (
                        <span className="text-[11px] font-semibold text-ink-muted">
                          {cg.experience_years} thn pengalaman
                        </span>
                      )}
                    </div>

                    <div className="mt-3.5 flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-sm font-bold ${avatarTone}`}
                      >
                        {getInitials(cg.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-base font-bold text-ink">
                          {cg.name}
                        </h3>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-muted">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="truncate">
                            {cg.city || "Indonesia"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {cg.bio && (
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                        {cg.bio}
                      </p>
                    )}

                    {cg.skills && cg.skills.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {cg.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg border border-card-blue-border bg-card-blue px-2.5 py-1 text-[11px] font-medium text-ink"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-ink-muted">
                      <UserCheck className="h-3.5 w-3.5 text-secondary" />
                      <span>Identitas & profil terdaftar di Lentera</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={invited}
                    onClick={() => handleInvite(cg.id)}
                    className={`mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                      invited
                        ? "border border-card-sage-border bg-card-sage text-secondary"
                        : "bg-primary text-white hover:bg-primary-hover"
                    }`}
                  >
                    <span>
                      {invited ? "Undangan Terkirim" : "Undang Wawancara"}
                    </span>
                    {!invited && <ArrowRight className="h-3.5 w-3.5" />}
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
