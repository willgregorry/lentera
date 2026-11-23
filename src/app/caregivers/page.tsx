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
  Stethoscope,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useAssignmentStatus } from "@/hooks/useAssignmentStatus";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types";

type InviteStatus = "pending" | "accepted" | "declined";

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
  const [inviteStatusMap, setInviteStatusMap] = useState<
    Record<string, InviteStatus>
  >({});
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [hiringId, setHiringId] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    if (hasCaregiver || !user) return;
    let active = true;

    async function loadCaregiversAndInvites() {
      try {
        const busyIds = new Set<string>();
        const mergedMap = new Map<string, UserProfile>();
        const sentInvites: Record<string, InviteStatus> = {};

        if (supabase) {
          const [profilesRes, filledJobsRes, acceptedAppsRes, invitesRes] =
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
              supabase
                .from("notifications")
                .select("user_id, metadata")
                .eq("type", "job"),
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

          for (const row of invitesRes.data || []) {
            const meta = (row.metadata || {}) as Record<string, unknown>;
            if (
              meta.kind === "interview_invite" &&
              String(meta.family_id || "") === user!.id &&
              row.user_id
            ) {
              const st = String(meta.status || "pending");
              sentInvites[String(row.user_id)] =
                st === "accepted" || st === "declined" ? st : "pending";
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
          setInviteStatusMap(sentInvites);
        }
      } finally {
        if (active) setLoadingList(false);
      }
    }

    void loadCaregiversAndInvites();

    if (!supabase) return;
    const channel = supabase
      .channel(`family-invites-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          void loadCaregiversAndInvites();
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase?.removeChannel(channel);
    };
  }, [hasCaregiver, user]);

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

        <div className="mt-6 rounded-2xl border border-card-cream-border bg-card-cream/40 p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-card-cream-border/70 pb-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sidebar text-white">
                <UserCheck className="h-7 w-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
                    {activeCaregiver.name}
                  </h2>
                  <span className="text-xs font-semibold text-secondary">
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
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-primary/40 sm:text-sm"
              >
                <Phone className="h-4 w-4 text-secondary" />
                <span>Hubungi Perawat</span>
              </a>
            )}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-card-blue-border bg-card-blue p-4">
              <p className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Wilayah
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {activeCaregiver.city}
              </p>
            </div>
            <div className="rounded-xl border border-card-cream-border bg-surface p-4">
              <p className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Jadwal Tugas
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {activeCaregiver.schedule}
              </p>
            </div>
            <div className="rounded-xl border border-card-blue-border bg-card-blue p-4">
              <p className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <Stethoscope className="h-3.5 w-3.5 text-secondary" /> Pengalaman
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
                    className="rounded-lg border border-card-blue-border bg-card-blue px-3 py-1 text-xs font-medium text-ink"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3 border-t border-card-cream-border/70 pt-5">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover sm:text-sm"
            >
              <Activity className="h-4 w-4" />
              <span>Lihat Kondisi Orang Tua</span>
            </Link>
            <Link
              href="/notifikasi"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-primary/40 sm:text-sm"
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

  async function handleInvite(cg: UserProfile) {
    if (!supabase || !user) return;
    setInvitingId(cg.id);
    setErrorMsg(null);
    setActionMsg(null);

    try {
      const { error } = await supabase.from("notifications").insert({
        user_id: cg.id,
        type: "job",
        title: `Undangan Wawancara dari ${user.name}`,
        body: `Keluarga ${user.name} mengundang Anda untuk wawancara pendampingan lansia.`,
        metadata: {
          kind: "interview_invite",
          status: "pending",
          family_id: user.id,
          family_name: user.name,
          family_phone: user.phone || "",
          family_city: user.city || "",
          caregiver_id: cg.id,
          caregiver_name: cg.name,
        },
      });

      if (error) {
        setErrorMsg(
          `Gagal mengirim undangan ke Supabase: ${error.message}. Pastikan policy INSERT tabel notifications sudah aktif.`
        );
        return;
      }

      setInviteStatusMap((prev) => ({ ...prev, [cg.id]: "pending" }));
      setActionMsg(
        `Undangan wawancara terkirim ke ${cg.name}. Perawat dapat langsung melihat dan menerima undangan di Ruang Perawat.`
      );
    } finally {
      setInvitingId(null);
    }
  }

  async function handleHireDirectly(cg: UserProfile) {
    if (!supabase || !user) return;
    setHiringId(cg.id);
    setErrorMsg(null);
    setActionMsg(null);

    try {
      const { data: existingElderly } = await supabase
        .from("elderly_profiles")
        .select("id")
        .eq("family_id", user.id)
        .limit(1)
        .maybeSingle();

      let elderlyId = existingElderly?.id as string | undefined;
      if (!elderlyId) {
        const { data: createdElderly, error: eldErr } = await supabase
          .from("elderly_profiles")
          .insert({
            family_id: user.id,
            name: `Orang Tua ${user.name.split(" ")[0]}`,
            age: 70,
            address: user.city || "Indonesia",
            status: "aman",
          })
          .select("id")
          .single();

        if (eldErr || !createdElderly) {
          setErrorMsg(eldErr?.message || "Gagal menyiapkan profil orang tua.");
          return;
        }
        elderlyId = createdElderly.id;
      }

      const { error: jobErr } = await supabase.from("care_jobs").insert({
        family_id: user.id,
        elderly_id: elderlyId,
        title: `Pendamping Lansia — Keluarga ${user.name.split(" ")[0]}`,
        description: "Penugasan langsung setelah wawancara disetujui.",
        schedule: "Senin – Sabtu, 08.00 – 16.00 WIB",
        location: user.city || "Indonesia",
        salary_min: 3500000,
        salary_max: 4000000,
        required_skills: cg.skills || [],
        status: "filled",
        assigned_caregiver_id: cg.id,
      });

      if (jobErr) {
        setErrorMsg(jobErr.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setHiringId(null);
    }
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
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover sm:text-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Pasang Lowongan</span>
        </Link>
      </div>

      {actionMsg && (
        <div className="mt-4 rounded-xl border border-card-sage-border bg-card-sage px-4 py-3 text-xs font-semibold text-secondary sm:text-sm">
          {actionMsg}
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-danger/25 bg-red-50 px-4 py-3 text-xs font-medium text-danger sm:text-sm"
        >
          {errorMsg}
        </div>
      )}

      <div className="mt-5">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama perawat, kota, atau keahlian..."
            className="w-full rounded-xl border border-card-blue-border bg-card-blue/50 py-2.5 pr-4 pl-10 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:bg-surface focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6">
        {loadingList || checkingStatus ? (
          <p className="py-12 text-center text-sm text-ink-muted">
            Memuat daftar perawat tersedia...
          </p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-card-blue-border bg-card-blue/45 px-6 py-12 text-center">
            <Stethoscope className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-3 text-sm font-semibold text-ink">
              Belum ada perawat yang tersedia saat ini
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Perawat yang baru mendaftar akan otomatis muncul di sini. Anda
              juga bisa memasang lowongan agar perawat dapat melamar langsung.
            </p>
            <Link
              href="/loker"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Pasang Lowongan Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cg, idx) => {
              const inviteStatus = inviteStatusMap[cg.id];
              const cardTint =
                idx % 2 === 0
                  ? "border-card-blue-border bg-card-blue/40"
                  : "border-card-cream-border bg-card-cream/40";
              return (
                <div
                  key={cg.id}
                  className={`flex flex-col justify-between rounded-2xl border p-5 transition-shadow hover:shadow-sm ${cardTint}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-display text-base font-bold text-ink">
                          {cg.name}
                        </h2>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-muted">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span>{cg.city || "Indonesia"}</span>
                        </p>
                      </div>
                      {cg.verified && (
                        <span className="text-xs font-semibold text-secondary">
                          Tersedia
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
                            className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-medium text-ink"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {inviteStatus === "accepted" ? (
                    <div className="mt-5 space-y-2">
                      <p className="text-center text-xs font-semibold text-secondary">
                        Perawat bersedia wawancara
                      </p>
                      <button
                        type="button"
                        disabled={hiringId === cg.id}
                        onClick={() => handleHireDirectly(cg)}
                        className="w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60 cursor-pointer"
                      >
                        {hiringId === cg.id
                          ? "Memproses..."
                          : "Tugaskan Perawat Ini"}
                      </button>
                    </div>
                  ) : inviteStatus === "pending" ? (
                    <button
                      type="button"
                      disabled
                      className="mt-5 w-full rounded-xl bg-card-sage py-2.5 text-xs font-semibold text-secondary"
                    >
                      Undangan Terkirim · Menunggu Perawat
                    </button>
                  ) : inviteStatus === "declined" ? (
                    <p className="mt-5 py-2 text-center text-xs font-medium text-ink-muted">
                      Undangan ditolak oleh perawat
                    </p>
                  ) : (
                    <button
                      type="button"
                      disabled={invitingId === cg.id}
                      onClick={() => handleInvite(cg)}
                      className="mt-5 w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60 cursor-pointer"
                    >
                      {invitingId === cg.id
                        ? "Mengirim..."
                        : "Undang untuk Wawancara"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
